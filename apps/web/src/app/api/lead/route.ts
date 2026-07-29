/**
 * /api/lead — Lead capture endpoint.
 *
 * Stage 2 hardening (per plan
 * `C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md`
 * Stage 2 — "Make lead capture reliable"):
 *
 * 1. Idempotency: dedup by sha256(email|phone|zip|first_name) within a
 *    60s window. Duplicate submits return the same response without
 *    creating a second lead.
 * 2. Rate limiting: 5 requests per IP per 60s. Protects against
 *    click-flood and automated submission storms.
 * 3. Durable persistence: the lead is created FIRST. If the SMS/email
 *    acknowledgement fails, the failure is recorded with a retriable
 *    status (`acknowledgement_status: 'failed'`) — never silently
 *    swallowed. The lead is the durable step; the notification is
 *    best-effort.
 * 4. Truthful success state: the response message reflects the actual
 *    SLA (5 min during business hours, next-morning after hours).
 * 5. SMS consent gate (per D-0066): SMS is sent only when the form
 *    explicitly captured `sms_consent: true`. If the caller preferred
 *    SMS but consent is missing, fall back to email.
 * 6. PII-safe logging: error logs never contain raw email/phone.
 * 7. Existing behaviour preserved: validation, ZIP-in-service-area,
 *    server-side PostHog `lead_captured` event, `system` principal.
 *
 * The in-memory idempotency and rate-limit stores are sufficient for
 * the pilot (cash-min mode, single process, canonical durable store is
 * the Gmail inbox). For multi-replica production, replace with Redis
 * or Vercel KV. The contract is documented in the module comment of
 * the test file at `apps/web/tests/lead/route.test.ts`.
 *
 * Charter binding: lead:create / lead:update allow customer / crew_member /
 * steward / system principal kinds; the website's anonymous visitor is
 * unauthenticated, so we construct a transient `system` principal.
 *
 * Response is intentionally minimal — never leaks internal IDs to
 * the browser. PostHog holds the lead_id for support/debug.
 */

import { createHash } from 'node:crypto';
import { BUSINESS, inServiceArea } from '@/lib/business';
import type { Principal } from '@grass/auth';
import { createLead, updateLeadAcknowledgement } from '@grass/crm-core';
import type { Lead } from '@grass/crm-core';
import { sendLeadResponse } from '@grass/notifications-core';
import { NextResponse } from 'next/server';

interface LeadInput {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  zip: string;
  message?: string;
  source?: string;
  /** TCPA consent captured at submit time (per D-0066). */
  sms_consent?: boolean;
  /** Caller's preference; overridden by sms_consent for the SMS path. */
  preferred_contact_method?: 'sms' | 'email' | 'phone';
}

// --- In-memory stores -----------------------------------------------------
// Process-local. Sufficient for the pilot because the canonical durable
// store is the email inbox (Gmail). For multi-replica production, replace
// with Redis or Vercel KV. See plan Stage 2 acceptance criteria.

interface IdempotencyEntry {
  lead_id: string;
  expires_at: number;
}

interface RateLimitState {
  count: number;
  reset_at: number;
}

const idempotencyStore = new Map<string, IdempotencyEntry>();
const rateLimitStore = new Map<string, RateLimitState>();

/**
 * __resetStores — test-only escape hatch. Resets the in-memory idempotency
 * and rate-limit stores. Production code MUST NOT import this; it is
 * exported solely for the unit-test suite at `apps/web/tests/lead/`.
 *
 * The leading double underscore is a deliberate "do not call from app
 * code" signal — it survives tree-shaking but is visually obvious in
 * code review.
 */
export function __resetStores(): void {
  idempotencyStore.clear();
  rateLimitStore.clear();
}

// --- Tunables -------------------------------------------------------------

const IDEMPOTENCY_WINDOW_MS = 60_000; // 60s
const RATE_LIMIT_WINDOW_MS = 60_000; // 60s
const RATE_LIMIT_MAX = 5; // 5 req per IP per window
const CACHE_CLEANUP_INTERVAL_MS = 5_000; // GC every 5s

// Periodic GC to prevent unbounded growth in long-lived processes.
const gcInterval = setInterval(cleanupCaches, CACHE_CLEANUP_INTERVAL_MS);
// Bun + Node both support unref(); .?.() defends against environments
// that don't.
gcInterval.unref?.();

function cleanupCaches(): void {
  const now = Date.now();
  for (const [k, v] of idempotencyStore) {
    if (v.expires_at <= now) idempotencyStore.delete(k);
  }
  for (const [k, v] of rateLimitStore) {
    if (v.reset_at <= now) rateLimitStore.delete(k);
  }
}

// --- Helpers --------------------------------------------------------------

function idempotencyKey(input: LeadInput): string {
  const hash = createHash('sha256');
  hash.update(
    [
      input.first_name.trim().toLowerCase(),
      input.email.trim().toLowerCase(),
      input.phone?.trim() ?? '',
      input.zip.trim(),
    ].join('|'),
  );
  return hash.digest('hex');
}

function getClientIp(req: Request): string {
  // x-forwarded-for is set by Vercel; check first.
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() ?? 'unknown';
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function checkRateLimit(ip: string): { ok: boolean; retry_after_s: number } {
  const now = Date.now();
  const state = rateLimitStore.get(ip);
  if (!state || state.reset_at <= now) {
    rateLimitStore.set(ip, { count: 1, reset_at: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, retry_after_s: 0 };
  }
  if (state.count >= RATE_LIMIT_MAX) {
    return { ok: false, retry_after_s: Math.ceil((state.reset_at - now) / 1000) };
  }
  state.count += 1;
  return { ok: true, retry_after_s: 0 };
}

function validateLead(
  input: Partial<LeadInput>,
): { ok: true; data: LeadInput } | { ok: false; error: string } {
  if (!input.first_name || input.first_name.trim().length < 1) {
    return { ok: false, error: 'First name required.' };
  }
  const trimmedEmail = input.email?.trim() ?? '';
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { ok: false, error: 'Valid email required.' };
  }
  if (!input.zip || !/^\d{5}$/.test(input.zip)) {
    return { ok: false, error: '5-digit ZIP code required.' };
  }
  if (!inServiceArea(input.zip)) {
    return {
      ok: false,
      error: `Sorry. We don't currently service ${input.zip}. We cover ${BUSINESS.service_area_zips.join(', ')}.`,
    };
  }
  return {
    ok: true,
    data: {
      first_name: input.first_name.trim(),
      ...(input.last_name?.trim() ? { last_name: input.last_name.trim() } : {}),
      email: trimmedEmail.toLowerCase(),
      ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
      zip: input.zip.trim(),
      ...(input.message?.trim() ? { message: input.message.trim() } : {}),
      source: input.source ?? 'website',
      sms_consent: input.sms_consent === true,
      ...(input.preferred_contact_method
        ? { preferred_contact_method: input.preferred_contact_method }
        : {}),
    },
  };
}

const SYSTEM_PRINCIPAL: Principal = { kind: 'system', workflow_id: 'wf_lead_capture' };

/**
 * SLA message — mirrors D-0064 §0.7: 5 minutes during business hours,
 * next-morning reply after hours. Honest about after-hours behaviour so
 * the user does not expect a 5-minute reply at 9pm.
 */
const SLA_MESSAGE =
  "Thanks. We text or email within 5 minutes during business hours (Mon-Fri 7a-5p, Sat 8a-2p). After hours we'll reply first thing next business morning.";

// --- POST handler ---------------------------------------------------------

export async function POST(req: Request) {
  // 1. Rate limit by IP.
  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(rate.retry_after_s) } },
    );
  }

  // 2. Parse body.
  let body: Partial<LeadInput>;
  try {
    body = (await req.json()) as Partial<LeadInput>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  // 3. Validate.
  const validated = validateLead(body);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  // 4. Idempotency check.
  const idemKey = idempotencyKey(validated.data);
  const existing = idempotencyStore.get(idemKey);
  if (existing && existing.expires_at > Date.now()) {
    // Duplicate within window — return the same response without creating.
    return NextResponse.json({ ok: true, message: SLA_MESSAGE, duplicate: true });
  }

  // 5. Persist lead (the durable step). If this fails the user gets a 500
  //    and the lead was never created — no state to recover.
  let lead: Lead;
  try {
    lead = await createLead(
      {
        first_name: validated.data.first_name,
        ...(validated.data.last_name ? { last_name: validated.data.last_name } : {}),
        email: validated.data.email,
        ...(validated.data.phone ? { phone: validated.data.phone } : {}),
        zip: validated.data.zip,
        ...(validated.data.message ? { message: validated.data.message } : {}),
        source:
          (validated.data.source as
            | 'gbp'
            | 'website'
            | 'referral'
            | 'yard_sign'
            | 'nextdoor'
            | 'manual'
            | undefined) ?? 'website',
        // sms_consent is unconditional — the validator normalizes it to
        // boolean. We pass it explicitly so the lead record carries the
        // consent flag (per D-0066) regardless of the optional-field
        // contract.
        sms_consent: validated.data.sms_consent ?? false,
        idempotency_key: idemKey,
      },
      SYSTEM_PRINCIPAL,
    );
  } catch (err) {
    // Persistence failed. Log WITHOUT PII — no email, no phone, no name.
    console.error('[lead] persistence failed', {
      error: err instanceof Error ? err.message : 'unknown',
    });
    return NextResponse.json(
      { ok: false, error: 'Internal error. Please call us directly.' },
      { status: 500 },
    );
  }

  // 6. Record idempotency claim so duplicate submits within the window
  //    return the same response without creating a second lead.
  idempotencyStore.set(idemKey, {
    lead_id: lead.id,
    expires_at: Date.now() + IDEMPOTENCY_WINDOW_MS,
  });

  // 7. Fire-and-forget acknowledgement (SMS only if sms_consent, else
  //    email). Critical: failure MUST NOT drop the lead. The lead is
  //    already persisted; the acknowledgement is best-effort with a
  //    recorded status.
  void (async () => {
    try {
      const result = await sendLeadResponse(
        {
          first_name: lead.first_name,
          ...(lead.email ? { email: lead.email } : {}),
          ...(lead.phone ? { phone: lead.phone } : {}),
          preferred_contact_method: lead.phone ? 'sms' : 'email',
          sms_consent: lead.sms_consent ?? false,
        },
        SYSTEM_PRINCIPAL,
      );
      if (result) {
        await updateLeadAcknowledgement(
          lead.id,
          {
            status: result.status,
            channel: result.channel,
            ...(result.error ? { error: result.error } : {}),
          },
          SYSTEM_PRINCIPAL,
        );
      } else {
        // No reachable channel — record as failed so the steward follows
        // up manually.
        await updateLeadAcknowledgement(
          lead.id,
          {
            status: 'failed',
            channel: 'email',
            error: 'no_reachable_channel',
          },
          SYSTEM_PRINCIPAL,
        );
      }
    } catch (err) {
      // PII-safe log: no lead content, only the error type and the
      // internal lead_id (which is not PII).
      console.error('[lead] acknowledgement failed', {
        lead_id: lead.id,
        error: err instanceof Error ? err.message : 'unknown',
      });
      try {
        await updateLeadAcknowledgement(
          lead.id,
          {
            status: 'failed',
            channel: 'email',
            error: err instanceof Error ? err.message : 'unknown',
          },
          SYSTEM_PRINCIPAL,
        );
      } catch (_e2) {
        console.error('[lead] acknowledgement status update failed', {
          lead_id: lead.id,
        });
      }
    }
  })();

  // 8. PostHog event (fire-and-forget — never block UX on analytics).
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    void fetch(`${process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        event: 'lead_captured',
        distinct_id: lead.id,
        properties: {
          zip: lead.zip,
          source: lead.source,
          sms_consent: lead.sms_consent === true,
        },
      }),
    }).catch((err) => {
      // PII-safe: just the error type, no payload.
      console.error('[lead] posthog fire failed', {
        error: err instanceof Error ? err.message : 'unknown',
      });
    });
  }

  // 9. Success — lead is persisted; acknowledgement is in flight.
  return NextResponse.json({
    ok: true,
    message: SLA_MESSAGE,
  });
}
