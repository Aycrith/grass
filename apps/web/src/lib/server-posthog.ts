/**
 * server-posthog.ts — server-side PostHog capture for /api/lead.
 *
 * Stage 3 (per plan `review-the-plans-recently-lucky-catmull.md` Stage 3):
 * PostHog is the only analytics source for the pilot. No client-side
 * tags, no consent gate. The route handler fires one `lead_captured`
 * event after a lead is persisted, keyed by `lead.id` so PostHog can
 * correlate the event with downstream customer/quote/job lifecycle
 * stages later.
 *
 * B-5 follow-up: the payload was previously constructed inline in
 * `apps/web/src/app/api/lead/route.ts` and was therefore not unit-
 * testable. This module exposes `buildLeadCapturedEvent()` as a pure
 * function so the payload contract can be asserted independently of
 * fetch/network behavior. The route handler still owns the network
 * call (fire-and-forget) and the PII-safe error log.
 *
 * No PII beyond what PostHog needs for funnel segmentation:
 *   - `distinct_id` is the lead.id (server-generated; never a
 *     user-supplied identifier like email/phone).
 *   - Properties include ZIP and landing_path — both deliberately
 *     coarse (ZIP is a 5-digit region; landing_path is a route, not
 *     a query string with PII).
 *   - UTMs are passed through as-is; the form handler strips PII from
 *     referrer/user_agent before persisting them.
 */

import type { Lead } from '@grass/crm-core';

/**
 * The exact payload shape posted to PostHog's /capture/ endpoint.
 * Mirrors the documented contract at
 * https://posthog.com/docs/api/capture (subset of fields we use).
 */
export interface PostHogCapturePayload {
  api_key: string;
  event: 'lead_captured';
  distinct_id: string;
  properties: {
    zip: string;
    source: Lead['source'];
    sms_consent: boolean;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    utm_content: string | null;
    gclid: string | null;
    landing_path: string | null;
    referrer: string | null;
    device_class: 'mobile' | 'tablet' | 'desktop' | null;
    first_touch_at: string | null;
  };
}

/**
 * Build the PostHog `lead_captured` payload for a freshly-persisted
 * lead. Pure function: same input → same output, no I/O.
 *
 * @param lead - The Lead row that was just persisted. Must have `id`
 *   set (route handler stamps this synchronously after createLead).
 * @param apiKey - PostHog project API key. Caller is responsible for
 *   sourcing it from `process.env.NEXT_PUBLIC_POSTHOG_KEY` (and
 *   gating the call on its presence — see /api/lead/route.ts:543).
 */
export function buildLeadCapturedEvent(
  lead: Lead,
  apiKey: string,
): PostHogCapturePayload {
  return {
    api_key: apiKey,
    event: 'lead_captured',
    distinct_id: lead.id,
    properties: {
      zip: lead.zip,
      source: lead.source,
      sms_consent: lead.sms_consent === true,
      utm_source: lead.utm_source ?? null,
      utm_medium: lead.utm_medium ?? null,
      utm_campaign: lead.utm_campaign ?? null,
      utm_term: lead.utm_term ?? null,
      utm_content: lead.utm_content ?? null,
      gclid: lead.gclid ?? null,
      landing_path: lead.landing_path ?? null,
      referrer: lead.referrer ?? null,
      device_class: lead.device_class ?? null,
      first_touch_at: lead.first_touch_at ?? null,
    },
  };
}

/**
 * Fire-and-forget the payload to PostHog's /capture/ endpoint. The
 * caller does NOT await this — analytics must never block the UX
 * response, and a failed PostHog call must not affect the lead's
 * acknowledgement path.
 *
 * @returns A no-op-friendly sentinel; the network call is observed
 *   only via its rejection (caught and PII-safe-logged here).
 */
export function fireLeadCapturedEvent(payload: PostHogCapturePayload): void {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';
  void fetch(`${host}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch((err) => {
    // PII-safe: just the error message, never the payload (which
    // includes the lead id and ZIP).
     
    console.error('[lead] posthog fire failed', {
      error: err instanceof Error ? err.message : 'unknown',
    });
  });
}