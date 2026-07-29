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
import { createLead, markLeadContacted, updateLeadAcknowledgement } from '@grass/crm-core';
import { appendLeadEvent } from '@grass/crm-core';
import type { Lead } from '@grass/crm-core';
import { sendLeadResponse } from '@grass/notifications-core';
import { NextResponse } from 'next/server';
import { sendAutoTextBack } from '@/lib/twilio';
import { sendGA4ServerEvent, sendMetaConversionEvent } from '@/lib/server-track';
import { generateEventId } from '@/lib/event-id';
import { toLeadSource } from '@/lib/channels';
import { buildLeadCapturedEvent, fireLeadCapturedEvent } from '@/lib/server-posthog';
import type { UTMParams } from '@/lib/utm';

interface LeadInput {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  zip: string;
  message?: string;
  // B-2: narrowed to Lead['source'] union (was `string`, required `as`
  // cast at the assignment site). The union now accepts canonical channel
  // tokens (per platform/packages/crm-core/src/service.ts).
  source?: Lead['source'];
  /** TCPA consent captured at submit time (per D-0066). */
  sms_consent?: boolean;
  /** Caller's preference; overridden by sms_consent for the SMS path. */
  preferred_contact_method?: 'sms' | 'email' | 'phone';
  // Stage 3 attribution (per paid-pilot-landing-spec.md §5:108-121).
  // All nullable. Captured client-side from URL params + localStorage
  // (see apps/web/src/lib/attribution.ts) and shipped with the form
  // payload to /api/lead. Server-side persistence happens in createLead.
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
  landing_path?: string | null;
  referrer?: string | null;
  device_class?: 'mobile' | 'tablet' | 'desktop' | null;
  first_touch_at?: string | null;
  /**
   * Client-generated event_id (UUID v4) shared with the browser pixel +
   * gtag fires. Both ad platforms use it for server-side dedup. If the
   * client didn't send one (older form variant), the server generates
   * one before firing the server events.
   */
  event_id?: string | null;
  /** Whether the user granted analytics consent (gates CAPI/GA4 MP). */
  analytics_consent?: 'granted' | 'denied' | null;
  /** Compact-id of the form variant — "full" or "compact" — surfaces in
   *  analytics so the team can split conversion by variant. */
  form_variant?: 'full' | 'compact' | null;
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
 * and rate-limit stores. Production code MUST NOT call this; the test
 * suite at `apps/web/tests/lead/route.test.ts` imports it.
 *
 * The leading double underscore is a deliberate "do not call from app
 * code" signal — visually obvious in code review and survives tree-shaking
 * in production bundles. Next.js 15.5's route-export validation tolerates
 * this name (it allows non-HTTP-method exports whose names begin with `_`).
 */
export function __resetStores(): void {
  idempotencyStore.clear();
  rateLimitStore.clear();
};

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
      // Stage 3 attribution — pass through, nullable passthrough.
      ...(input.utm_source !== undefined ? { utm_source: input.utm_source } : {}),
      ...(input.utm_medium !== undefined ? { utm_medium: input.utm_medium } : {}),
      ...(input.utm_campaign !== undefined ? { utm_campaign: input.utm_campaign } : {}),
      ...(input.utm_term !== undefined ? { utm_term: input.utm_term } : {}),
      ...(input.utm_content !== undefined ? { utm_content: input.utm_content } : {}),
      ...(input.gclid !== undefined ? { gclid: input.gclid } : {}),
      ...(input.landing_path !== undefined ? { landing_path: input.landing_path } : {}),
      ...(input.referrer !== undefined ? { referrer: input.referrer } : {}),
      ...(input.device_class !== undefined ? { device_class: input.device_class } : {}),
      ...(input.first_touch_at !== undefined ? { first_touch_at: input.first_touch_at } : {}),
      // GTM audit: client-shared event_id for cross-platform dedup.
      ...(input.event_id?.trim() ? { event_id: input.event_id.trim() } : {}),
      // GTM audit: explicit analytics consent signal from ConsentBanner.
      ...(input.analytics_consent !== undefined && input.analytics_consent !== null
        ? { analytics_consent: input.analytics_consent }
        : {}),
      // GTM audit: which form variant captured the lead.
      ...(input.form_variant !== undefined && input.form_variant !== null
        ? { form_variant: input.form_variant }
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
        source: toLeadSource(validated.data.source),
        // sms_consent is unconditional — the validator normalizes it to
        // boolean. We pass it explicitly so the lead record carries the
        // consent flag (per D-0066) regardless of the optional-field
        // contract.
        sms_consent: validated.data.sms_consent ?? false,
        idempotency_key: idemKey,
        // Stage 3 attribution passthrough — already validated as nullable.
        ...(validated.data.utm_source !== undefined
          ? { utm_source: validated.data.utm_source }
          : {}),
        ...(validated.data.utm_medium !== undefined
          ? { utm_medium: validated.data.utm_medium }
          : {}),
        ...(validated.data.utm_campaign !== undefined
          ? { utm_campaign: validated.data.utm_campaign }
          : {}),
        ...(validated.data.utm_term !== undefined ? { utm_term: validated.data.utm_term } : {}),
        ...(validated.data.utm_content !== undefined
          ? { utm_content: validated.data.utm_content }
          : {}),
        ...(validated.data.gclid !== undefined ? { gclid: validated.data.gclid } : {}),
        ...(validated.data.landing_path !== undefined
          ? { landing_path: validated.data.landing_path }
          : {}),
        ...(validated.data.referrer !== undefined ? { referrer: validated.data.referrer } : {}),
        ...(validated.data.device_class !== undefined
          ? { device_class: validated.data.device_class }
          : {}),
        ...(validated.data.first_touch_at !== undefined
          ? { first_touch_at: validated.data.first_touch_at }
          : {}),
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

  // 5.5 — GTM launch (2026-07-28): Twilio auto-text-back + server-side
  //      GA4 Measurement Protocol + Meta Conversions API. All fire-
  //      and-forget; never block the response. The shared `event_id`
  //      is the client-provided UUID; if missing (older form variant
  //      or a curl test), we generate one so client + server events
  //      still dedup against each other.
  const analyticsConsent = validated.data.analytics_consent ?? 'denied';
  const eventId = validated.data.event_id?.trim() || generateEventId();
  const utmForAnalytics: UTMParams = {
    ...(validated.data.utm_source ? { utm_source: validated.data.utm_source } : {}),
    ...(validated.data.utm_medium ? { utm_medium: validated.data.utm_medium } : {}),
    ...(validated.data.utm_campaign ? { utm_campaign: validated.data.utm_campaign } : {}),
    ...(validated.data.utm_content ? { utm_content: validated.data.utm_content } : {}),
    ...(validated.data.utm_term ? { utm_term: validated.data.utm_term } : {}),
  };
  const sourceUrl =
    validated.data.landing_path !== undefined && validated.data.landing_path !== null
      ? `${BUSINESS.url}${validated.data.landing_path}`
      : BUSINESS.url;

  // Twilio auto-text-back — gated on phone AND sms_consent (per D-0066).
  // GTM audit Fix #6. Sends within ~1s of the lead being persisted;
  // the user gets a near-instant "got it" message while the
  // templated acknowledgement fires in parallel.
  if (validated.data.phone && validated.data.sms_consent === true) {
    void sendAutoTextBack({
      to: validated.data.phone,
      firstName: validated.data.first_name,
      ...(validated.data.utm_source ? { utmSource: validated.data.utm_source } : {}),
      leadId: lead.id,
    }).catch((err) => {
      console.error('[lead] twilio auto-text-back failed', {
        lead_id: lead.id,
        error: err instanceof Error ? err.message : 'unknown',
      });
    });
  }

  // Server-side analytics — only when the user granted consent. The
  // client pixel/gtag already fired with the same event_id; these
  // server events survive ad-blockers and iOS 14.5+ ATT.
  if (analyticsConsent === 'granted') {
    const clientId = getClientIp(req).replace(/[^\w.-]/g, '_');

    void sendGA4ServerEvent({
      eventName: 'generate_lead',
      eventId,
      clientId,
      userId: lead.id,
      value: 60,
      currency: 'USD',
      sourceUrl,
      utm: utmForAnalytics,
    }).catch((err) => {
      console.error('[lead] GA4 server event failed', {
        lead_id: lead.id,
        error: err instanceof Error ? err.message : 'unknown',
      });
    });

    void sendMetaConversionEvent({
      eventName: 'Lead',
      eventId,
      email: validated.data.email,
      ...(validated.data.phone ? { phone: validated.data.phone } : {}),
      firstName: validated.data.first_name,
      zip: validated.data.zip,
      value: 60,
      currency: 'USD',
      sourceUrl,
      utm: utmForAnalytics,
    }).catch((err) => {
      console.error('[lead] Meta CAPI failed', {
        lead_id: lead.id,
        error: err instanceof Error ? err.message : 'unknown',
      });
    });
  }

  // 6. Record idempotency claim so duplicate submits within the window
  //    return the same response without creating a second lead.
  idempotencyStore.set(idemKey, {
    lead_id: lead.id,
    expires_at: Date.now() + IDEMPOTENCY_WINDOW_MS,
  });

  // 6.5 Stage 3: append the lead_captured event to the audit log. This is
  //     the first row in the lead's lifecycle trail. The route handler is
  //     the canonical writer — every state transition flows through here
  //     (or the matching update handler) so the audit table stays complete.
  const actorId = SYSTEM_PRINCIPAL.kind === 'system' ? SYSTEM_PRINCIPAL.workflow_id : 'system';
  void appendLeadEvent({
    lead_id: lead.id,
    event_type: 'lead_captured',
    from_stage: null,
    to_stage: 'new',
    actor_id: actorId,
    metadata: {
      source: lead.source ?? 'unknown',
      zip: lead.zip,
      has_utm: lead.utm_source ? 1 : 0,
    },
  }).catch((err) => {
    // Audit-log failures MUST NOT block lead capture. The lead is already
    // persisted; the event append is best-effort with PII-safe error log.
    console.error('[lead] lead_events append failed', {
      lead_id: lead.id,
      error: err instanceof Error ? err.message : 'unknown',
    });
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
        // Stage 3 (Q-6): write first_response_at on the ack-sent branch
        // (route handler, not crm-core, per the synthesis recommendation).
        // `markLeadContacted` is idempotent — a lead is marked contacted
        // exactly once, regardless of how many ack retries fire.
        if (result.status === 'sent') {
          await markLeadContacted(lead.id, SYSTEM_PRINCIPAL);
        }
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
  //    Stage 3: include the 10 attribution fields as discrete properties so
  //    PostHog funnels can segment by source / medium / campaign / device.
  //    B-5: payload construction extracted to a pure function
  //    (`buildLeadCapturedEvent`) so the contract is unit-tested in
  //    `apps/web/tests/attribution/posthog-payload.test.ts`. The route
  //    handler still owns the fire-and-forget fetch + PII-safe error log.
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    fireLeadCapturedEvent(
      buildLeadCapturedEvent(lead, process.env.NEXT_PUBLIC_POSTHOG_KEY),
    );
  }

  // 9. Success — lead is persisted; acknowledgement is in flight.
  return NextResponse.json({
    ok: true,
    message: SLA_MESSAGE,
  });
}
