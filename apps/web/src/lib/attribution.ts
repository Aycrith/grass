/**
 * @/lib/attribution — first-party attribution capture and persistence.
 *
 * Stage 3 (per plan `review-the-plans-recently-lucky-catmull.md`):
 * server-side PostHog is the only analytics source, so attribution is
 * captured on the client (where the URL + localStorage are accessible)
 * and shipped with the lead payload to /api/lead, which writes the
 * discrete fields onto the Lead row.
 *
 * The first-touch fields (utm_source/medium/campaign, gclid, landing_path,
 * first_touch_at) are immutable: once persisted for a visitor, they're
 * never overwritten. The last-touch fields (utm_term, utm_content, referrer,
 * device_class) update on every page load — useful for A/B test attribution
 * within a campaign but not as the primary "where did this lead come from"
 * signal.
 *
 * The localStorage key is `grass_attribution_v1`. The `_v1` suffix is the
 * schema version: if the persisted shape ever changes incompatibly, bump
 * to `_v2` and old keys naturally expire (30-day TTL).
 *
 * This module is browser-only — every function guards `typeof window`
 * so importing it from a server component or a route handler is safe
 * (it just no-ops).
 */

import type { Lead } from '@grass/crm-core';

/**
 * The complete attribution payload captured on the client. Mirrors the
 * Lead row's attribution fields (10 discrete fields + first_touch_at).
 * All fields are nullable — server-side capture tolerates missing data.
 *
 * The `source` token is the legacy coarser-grained summary (e.g.
 * 'nextdoor:free_first_mow' or 'paid_ad'). It's kept for backward
 * compatibility with the existing 6-value `Lead.source` union until
 * the source taxonomy is fully migrated to discrete fields.
 */
export interface AttributionPayload {
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
  /** Coarse-grained summary derived from UTMs (or hardcoded). */
  source: string;
}

const STORAGE_KEY = 'grass_attribution_v1';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * First-touch immutable fields. Once written, these don't update for the
 * same visitor across the 30-day window. Subsequent page loads still
 * hydrate them from localStorage — they only update if no prior
 * first-touch is recorded.
 *
 * Last-touch fields (utm_term, utm_content, referrer, device_class)
 * always update on each capture. Useful for within-campaign A/B test
 * attribution.
 *
 * The first-touch/last-touch split is implemented inline in
 * `persistAttribution()` below; the lists are documented here for the
 * canonical reference.
 */

/**
 * Capture attribution from the current URL + headers + UA. Pure read;
 * does not write to localStorage. Returns a payload suitable for either
 * merging into localStorage or shipping with a form submission.
 *
 * @param referrer - Document referrer (browser-only; pass '' on server).
 * @param userAgent - Navigator userAgent (browser-only; pass '' on server).
 * @param landingPath - The path the visitor landed on. Defaults to the
 *   current pathname if running in the browser.
 */
export function captureAttribution(
  referrer = '',
  userAgent = '',
  landingPath: string | null = null,
): AttributionPayload {
  if (typeof window === 'undefined') {
    return EMPTY_ATTRIBUTION;
  }
  const params = new URLSearchParams(window.location.search);
  const path = landingPath ?? window.location.pathname;
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
    gclid: params.get('gclid'),
    landing_path: path,
    referrer: referrerHostname(referrer),
    device_class: parseDeviceClass(userAgent),
    first_touch_at: null, // populated only on first write
    source: deriveLegacySource(params.get('utm_source'), params.get('utm_campaign')),
  };
}

const EMPTY_ATTRIBUTION: AttributionPayload = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
  gclid: null,
  landing_path: null,
  referrer: null,
  device_class: null,
  first_touch_at: null,
  source: 'website',
};

/**
 * Read the persisted attribution from localStorage, if any and not expired.
 * Returns null if the key is absent or the TTL has elapsed.
 */
export function readPersistedAttribution(): AttributionPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { payload: AttributionPayload; expires_at: number };
    if (parsed.expires_at <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.payload;
  } catch {
    return null;
  }
}

/**
 * Persist attribution to localStorage with a 30-day TTL.
 *
 * First-touch fields are preserved across calls: if the persisted payload
 * already has a `utm_source`, the incoming capture's `utm_source` is
 * ignored. Last-touch fields always update.
 */
export function persistAttribution(capture: AttributionPayload): AttributionPayload {
  if (typeof window === 'undefined') return capture;
  const existing = readPersistedAttribution();
  const merged: AttributionPayload = {
    ...capture,
    // First-touch: keep existing values if present.
    utm_source: existing?.utm_source ?? capture.utm_source,
    utm_medium: existing?.utm_medium ?? capture.utm_medium,
    utm_campaign: existing?.utm_campaign ?? capture.utm_campaign,
    gclid: existing?.gclid ?? capture.gclid,
    landing_path: existing?.landing_path ?? capture.landing_path,
    first_touch_at: existing?.first_touch_at ?? capture.first_touch_at ?? new Date().toISOString(),
    // Last-touch: always overwrite from the capture.
    utm_term: capture.utm_term,
    utm_content: capture.utm_content,
    referrer: capture.referrer,
    device_class: capture.device_class,
    // Source: prefer the existing legacy token if present.
    source: existing?.source ?? capture.source,
  };
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ payload: merged, expires_at: Date.now() + TTL_MS }),
    );
  } catch {
    // localStorage may be unavailable (private mode, quota). Silent fail.
  }
  return merged;
}

/**
 * Convert an AttributionPayload into the subset of Lead-row fields the
 * /api/lead endpoint accepts. This is the bridge between the client-side
 * capture and the server-side schema.
 */
export function attributionToLeadFields(
  attribution: AttributionPayload,
): Pick<
  Lead,
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content'
  | 'gclid'
  | 'landing_path'
  | 'referrer'
  | 'device_class'
  | 'first_touch_at'
  | 'source'
> {
  return {
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
    gclid: attribution.gclid,
    landing_path: attribution.landing_path,
    referrer: attribution.referrer,
    device_class: attribution.device_class,
    first_touch_at: attribution.first_touch_at,
    source: attribution.source as Lead['source'],
  };
}

// --- helpers ---------------------------------------------------------------

function referrerHostname(referrer: string): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    // Strip 'www.' for cleaner grouping.
    return url.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Parse a coarse device class from the User-Agent string. Matches the
 * /api/lead vocab: 'mobile' | 'tablet' | 'desktop'.
 *
 * This is server-side friendly — the route handler can also use it for
 * the `X-Device-Class` header path. Tablet detection runs BEFORE mobile
 * because most modern mobile UAs include 'Mobile' but tablets include
 * 'iPad' or 'Android' WITHOUT 'Mobile'.
 */
export function parseDeviceClass(userAgent: string): 'mobile' | 'tablet' | 'desktop' | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))) {
    return 'tablet';
  }
  if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('ipod')) {
    return 'mobile';
  }
  return 'desktop';
}

function deriveLegacySource(utmSource: string | null, utmCampaign: string | null): string {
  if (utmSource && utmCampaign) return `${utmSource}:${utmCampaign}`;
  if (utmSource) return utmSource;
  return 'website';
}
