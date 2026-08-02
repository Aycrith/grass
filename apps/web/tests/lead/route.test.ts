/**
 * /api/lead route tests — Stage 2 acceptance criteria.
 *
 * Run with:  bun test apps/web/tests/lead/route.test.ts
 *
 * Covers (per plan
 * `C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md`
 * Stage 2 acceptance):
 *
 *   - Happy path: lead persisted, ack sent, response carries SLA message.
 *   - Duplicate submit: same payload within 60s returns the same response
 *     without creating a second lead.
 *   - Invalid ZIP shape: 400.
 *   - Out-of-area ZIP: 400 with the canonical service-area hint.
 *   - Rate limit: 6th request from same IP within 60s returns 429.
 *   - CRM/persistence failure: 500 (no lead created).
 *   - SMS failure: lead STILL persisted and marked as failed.
 *   - Email failure: lead STILL persisted and marked as failed.
 *   - sms_consent=false: SMS is NOT sent; email fallback is used.
 *   - Success message matches D-0064 SLA (5 min business hours, next morning
 *     after hours) — NOT the previous "within 24 hours".
 *   - PII safety: error logs do not include raw email or phone.
 *
 * The tests use `bun:test` module mocking to substitute the CRM and
 * notifications packages. The route handler is imported directly so the
 * tests exercise the real wiring rather than a test-only facade.
 */

import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

// Mock NEXT_PUBLIC_POSTHOG_HOST/KEY so we don't fire network requests.
const originalPostHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
process.env.NEXT_PUBLIC_POSTHOG_KEY = undefined;

// --- Mock the CRM and notifications modules BEFORE importing the route ---

// Wide return type so per-test mockImplementationOnce can return varied
// shapes (sent/failed, sms/email) without TypeScript narrowing.
type AckResult = {
  channel: 'sms' | 'email';
  status: 'sent' | 'failed';
  cost_cents: number;
  error?: string;
};

const mockCreateLead = mock(async (input: unknown, _p: unknown) => {
  const i = input as {
    first_name?: string;
    email?: string;
    zip?: string;
    sms_consent?: boolean;
    phone?: string;
  };
  return {
    id: `lead_${Date.now()}`,
    first_name: i.first_name ?? 'Test',
    email: i.email ?? 'test@example.com',
    zip: i.zip ?? '33771',
    sms_consent: i.sms_consent,
    phone: i.phone,
    source: 'website' as const,
    status: 'new' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
});

const mockUpdateLeadAcknowledgement = mock(async (_id: string, _patch: unknown, _p: unknown) => ({
  id: _id,
  first_name: '',
  source: 'manual' as const,
  zip: '',
  status: 'new' as const,
  acknowledgement_status: 'sent' as const,
  acknowledgement_channel: 'email' as const,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
}));

// Stage 3: markLeadContacted is called from /api/lead when ack status='sent'.
// The mock returns a stub Lead; tests don't assert on first_response_at here
// (that's covered by attribution/lifecycle-derivation.test.ts in Stage 3.12).
const mockMarkLeadContacted = mock(async (id: string, _p: unknown) => ({
  id,
  first_name: '',
  source: 'manual' as const,
  zip: '',
  status: 'new' as const,
  first_response_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
}));

// Stage 3: appendLeadEvent is called from /api/lead after createLead to
// append the lead_captured event to the audit log. The mock returns a
// stub LeadEvent. Tests don't assert on event_id/occurred_at here.
const mockAppendLeadEvent = mock(async (input: unknown) => {
  const i = input as { lead_id: string; event_type: string };
  return {
    event_id: `evt_test_${Date.now()}`,
    lead_id: i.lead_id,
    event_type: i.event_type,
    from_stage: null,
    to_stage: 'new' as const,
    actor_id: 'system',
    occurred_at: new Date().toISOString(),
  };
});

const mockSendLeadResponse = mock(async (_lead: unknown, _p: unknown): Promise<AckResult> => {
  return {
    channel: 'email' as const,
    status: 'sent' as const,
    cost_cents: 1,
  };
});

mock.module('@grass/crm-core', () => ({
  appendLeadEvent: mockAppendLeadEvent,
  createLead: mockCreateLead,
  markLeadContacted: mockMarkLeadContacted,
  updateLeadAcknowledgement: mockUpdateLeadAcknowledgement,
}));

mock.module('@grass/notifications-core', () => ({
  sendLeadResponse: mockSendLeadResponse,
}));

// Mock the business module so we don't depend on `@/lib/business` resolving
// from the test path. The real service-area zips are ['33770', '33771', '33773', '33774', '33778', '33756'].
mock.module('@/lib/business', () => ({
  BUSINESS: {
    service_area_zips: ['33770', '33771', '33773', '33774', '33778', '33756'],
  },
  inServiceArea: (zip: string) =>
    ['33770', '33771', '33773', '33774', '33778', '33756'].includes(zip),
}));

// Dynamically import the route AFTER mocks are set up.
const { POST } = await import('../../src/app/api/lead/route.ts');
// Test reset is attached to globalThis (Next.js 15.5 rejects non-HTTP
// named exports from route files). See route.ts for the rationale.
const __resetLeadStores = (globalThis as { __resetLeadStores?: () => void }).__resetLeadStores;

// --- Test helpers ---------------------------------------------------------

let ipCounter = 0;
function makeRequest(body: unknown, ip?: string): Request {
  // Each request gets a unique IP by default so tests don't share rate-limit
  // state. Tests that explicitly want to exercise rate limiting pass a
  // explicit IP.
  const resolvedIp = ip ?? `10.0.${Math.floor(ipCounter / 254)}.${(ipCounter++ % 254) + 1}`;
  return new Request('http://localhost/api/lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': resolvedIp,
    },
    body: JSON.stringify(body),
  });
}

let emailCounter = 0;
function validBody(overrides: Record<string, unknown> = {}) {
  // Each body has a unique email by default so tests don't share
  // idempotency state. Tests that explicitly want to exercise dedup
  // pass a stable email.
  if (!overrides.email) {
    overrides.email = `test${emailCounter++}@example.com`;
  }
  return {
    first_name: 'Cameron',
    email: 'cam@example.com',
    zip: '33771',
    ...overrides,
  };
}

beforeEach(() => {
  __resetLeadStores?.();
  mockCreateLead.mockClear();
  mockUpdateLeadAcknowledgement.mockClear();
  mockSendLeadResponse.mockClear();
  // Reset to defaults — pass through sms_consent so the IIFE can read it.
  mockCreateLead.mockImplementation(async (input, _p) => {
    const i = input as {
      first_name?: string;
      email?: string;
      zip?: string;
      sms_consent?: boolean;
      phone?: string;
    };
    return {
      id: `lead_${Date.now()}_${Math.random()}`,
      first_name: i.first_name ?? 'Test',
      email: i.email ?? 'test@example.com',
      zip: i.zip ?? '33771',
      sms_consent: i.sms_consent,
      phone: i.phone,
      source: 'website' as const,
      status: 'new' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
  mockSendLeadResponse.mockImplementation(async () => ({
    channel: 'email' as const,
    status: 'sent' as const,
    cost_cents: 1,
  }));
});

afterEach(() => {
  if (originalPostHogKey !== undefined) {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = originalPostHogKey;
  } else {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = undefined;
  }
});

// --- Tests ---------------------------------------------------------------

describe('POST /api/lead — happy path', () => {
  it('persists lead, sends ack, returns SLA message', async () => {
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; message: string };
    expect(json.ok).toBe(true);
    // SLA message must reflect D-0064 — NOT the prior "within 24 hours" copy.
    expect(json.message).toMatch(/5 minutes during business hours/);
    expect(json.message).toMatch(/Mon-Fri 7a-5p/);
    expect(json.message).toMatch(/next business morning/);
    expect(json.message).not.toMatch(/24 hours/);
    expect(mockCreateLead).toHaveBeenCalledTimes(1);
    expect(mockSendLeadResponse).toHaveBeenCalledTimes(1);
  });

  it('trims and lowercases email before persisting', async () => {
    await POST(makeRequest(validBody({ email: '  CAM@EXAMPLE.COM  ' })));
    const call = mockCreateLead.mock.calls[0]?.[0] as { email: string };
    expect(call.email).toBe('cam@example.com');
  });

  it('trims first_name before persisting', async () => {
    await POST(makeRequest(validBody({ first_name: '  Cameron  ' })));
    const call = mockCreateLead.mock.calls[0]?.[0] as { first_name: string };
    expect(call.first_name).toBe('Cameron');
  });
});

describe('POST /api/lead — validation', () => {
  it('rejects missing first_name', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', zip: '33771' }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toMatch(/First name required/i);
    expect(mockCreateLead).not.toHaveBeenCalled();
  });

  it('rejects invalid email', async () => {
    const res = await POST(makeRequest(validBody({ email: 'not-an-email' })));
    expect(res.status).toBe(400);
    expect(mockCreateLead).not.toHaveBeenCalled();
  });

  it('rejects malformed ZIP', async () => {
    const res = await POST(makeRequest(validBody({ zip: '1234' })));
    expect(res.status).toBe(400);
    expect(mockCreateLead).not.toHaveBeenCalled();
  });

  it('rejects ZIP outside service area', async () => {
    const res = await POST(makeRequest(validBody({ zip: '90210' })));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toMatch(/don'?t currently service 90210/);
    expect(json.error).toMatch(/33771/);
    expect(mockCreateLead).not.toHaveBeenCalled();
  });

  it('rejects invalid JSON body', async () => {
    const req = new Request('http://localhost/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/lead — idempotency', () => {
  it('returns duplicate:true for identical submission within window', async () => {
    const body = validBody();
    const r1 = await POST(makeRequest(body));
    expect(r1.status).toBe(200);
    // Second submit within 60s window.
    const r2 = await POST(makeRequest(body));
    expect(r2.status).toBe(200);
    const json = (await r2.json()) as { duplicate?: boolean };
    expect(json.duplicate).toBe(true);
    // Only ONE lead created.
    expect(mockCreateLead).toHaveBeenCalledTimes(1);
  });

  it('different ZIP creates a second lead (not a duplicate)', async () => {
    await POST(makeRequest(validBody({ zip: '33771' })));
    await POST(makeRequest(validBody({ zip: '33774' })));
    expect(mockCreateLead).toHaveBeenCalledTimes(2);
  });

  it('different phone creates a second lead (not a duplicate)', async () => {
    await POST(makeRequest(validBody({ phone: '727-313-8011' })));
    await POST(makeRequest(validBody({ phone: '727-555-9999' })));
    expect(mockCreateLead).toHaveBeenCalledTimes(2);
  });
});

describe('POST /api/lead — rate limiting', () => {
  it('returns 429 after 5 requests from the same IP within 60s', async () => {
    // Each request must have a different idem key (different email) so the
    // dedup window doesn't mask the rate limit.
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(validBody({ email: `a${i}@x.com` }), '1.2.3.4'));
      expect(res.status).toBe(200);
    }
    const sixth = await POST(makeRequest(validBody({ email: 'a6@x.com' }), '1.2.3.4'));
    expect(sixth.status).toBe(429);
    const retryAfter = sixth.headers.get('Retry-After');
    expect(retryAfter).toBeTruthy();
    expect(Number(retryAfter)).toBeGreaterThan(0);
    // The 6th request must NOT create a lead.
    expect(mockCreateLead).toHaveBeenCalledTimes(5);
  });

  it('different IPs are independently rate-limited', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(validBody({ email: `a${i}@x.com` }), '1.2.3.4'));
      expect(res.status).toBe(200);
    }
    // Different IP — should reset.
    const res = await POST(makeRequest(validBody({ email: 'b@x.com' }), '5.6.7.8'));
    expect(res.status).toBe(200);
  });
});

describe('POST /api/lead — durability', () => {
  it('persistence failure returns 500 and no lead is created', async () => {
    mockCreateLead.mockImplementationOnce(async () => {
      throw new Error('database down');
    });
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(500);
    const json = (await res.json()) as { ok: boolean; error: string };
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/Internal error/);
    // sendLeadResponse must NOT be called when persistence failed.
    expect(mockSendLeadResponse).not.toHaveBeenCalled();
  });

  it('SMS failure does NOT drop the lead — failure is recorded', async () => {
    mockSendLeadResponse.mockImplementationOnce(
      async (): Promise<AckResult> => ({
        channel: 'sms',
        status: 'failed',
        cost_cents: 0,
        error: 'carrier_rejected',
      }),
    );
    const res = await POST(makeRequest(validBody({ phone: '727-313-8011', sms_consent: true })));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
    expect(mockCreateLead).toHaveBeenCalledTimes(1);
    // updateLeadAcknowledgement should be called with status='failed'.
    // Allow microtask drain so the fire-and-forget IIFE settles.
    await new Promise((r) => setTimeout(r, 10));
    expect(mockUpdateLeadAcknowledgement).toHaveBeenCalled();
    const [leadId, patch] = mockUpdateLeadAcknowledgement.mock.calls[0] ?? [];
    expect(leadId).toBeTruthy();
    expect((patch as { status: string }).status).toBe('failed');
  });

  it('email failure does NOT drop the lead — failure is recorded', async () => {
    mockSendLeadResponse.mockImplementationOnce(
      async (): Promise<AckResult> => ({
        channel: 'email',
        status: 'failed',
        cost_cents: 0,
        error: 'smtp_rejected',
      }),
    );
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(200);
    expect(mockCreateLead).toHaveBeenCalledTimes(1);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockUpdateLeadAcknowledgement).toHaveBeenCalled();
    const [, patch] = mockUpdateLeadAcknowledgement.mock.calls[0] ?? [];
    expect((patch as { status: string }).status).toBe('failed');
  });

  it('sendLeadResponse throwing does NOT 500 — lead is marked failed', async () => {
    mockSendLeadResponse.mockImplementationOnce(async () => {
      throw new Error('sdk crashed');
    });
    const res = await POST(makeRequest(validBody()));
    expect(res.status).toBe(200);
    expect(mockCreateLead).toHaveBeenCalledTimes(1);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockUpdateLeadAcknowledgement).toHaveBeenCalled();
    const [, patch] = mockUpdateLeadAcknowledgement.mock.calls[0] ?? [];
    expect((patch as { status: string }).status).toBe('failed');
  });
});

describe('POST /api/lead — SMS consent gate (D-0066)', () => {
  it('sms_consent=true routes to SMS', async () => {
    mockSendLeadResponse.mockImplementationOnce(
      async (): Promise<AckResult> => ({
        channel: 'sms',
        status: 'sent',
        cost_cents: 1,
      }),
    );
    await POST(makeRequest(validBody({ phone: '727-313-8011', sms_consent: true })));
    await new Promise((r) => setTimeout(r, 10));
    const [leadArg] = mockSendLeadResponse.mock.calls[0] ?? [];
    expect((leadArg as { sms_consent: boolean }).sms_consent).toBe(true);
  });

  it('sms_consent=false forces email fallback (no SMS sent)', async () => {
    mockSendLeadResponse.mockImplementationOnce(async (lead): Promise<AckResult> => {
      const sms_consent = (lead as { sms_consent?: boolean }).sms_consent;
      const channel: 'sms' | 'email' = sms_consent === true ? 'sms' : 'email';
      return {
        channel,
        status: 'sent',
        cost_cents: 1,
      };
    });
    await POST(makeRequest(validBody({ phone: '727-313-8011', sms_consent: false })));
    await new Promise((r) => setTimeout(r, 10));
    const [leadArg] = mockSendLeadResponse.mock.calls[0] ?? [];
    expect((leadArg as { sms_consent: boolean }).sms_consent).toBe(false);
  });

  it('no phone + sms_consent=false → email fallback', async () => {
    await POST(makeRequest(validBody({ sms_consent: false })));
    await new Promise((r) => setTimeout(r, 10));
    const [leadArg] = mockSendLeadResponse.mock.calls[0] ?? [];
    expect((leadArg as { sms_consent: boolean }).sms_consent).toBe(false);
    expect((leadArg as { phone?: string }).phone).toBeUndefined();
  });
});

describe('POST /api/lead — PII safety in error logs', () => {
  it('persistence failure log does NOT include email or phone', async () => {
    const consoleError = spyOn(console, 'error').mockImplementation(() => {});
    mockCreateLead.mockImplementationOnce(async () => {
      throw new Error('database down');
    });
    await POST(makeRequest(validBody({ email: 'secret@example.com', phone: '727-555-1234' })));
    // Collect every log arg.
    const allArgs = consoleError.mock.calls.flat().map((a) => String(a));
    const combined = allArgs.join('\n');
    expect(combined).not.toContain('secret@example.com');
    expect(combined).not.toContain('727-555-1234');
    consoleError.mockRestore();
  });

  it('SMS failure log does NOT include email or phone', async () => {
    const consoleError = spyOn(console, 'error').mockImplementation(() => {});
    mockSendLeadResponse.mockImplementationOnce(async () => {
      throw new Error('carrier down');
    });
    await POST(
      makeRequest(
        validBody({ email: 'secret@example.com', phone: '727-555-1234', sms_consent: true }),
      ),
    );
    await new Promise((r) => setTimeout(r, 10));
    const allArgs = consoleError.mock.calls.flat().map((a) => String(a));
    const combined = allArgs.join('\n');
    expect(combined).not.toContain('secret@example.com');
    expect(combined).not.toContain('727-555-1234');
    consoleError.mockRestore();
  });
});
