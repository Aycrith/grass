/**
 * channels.ts — single source of truth for paid-channel utm_medium labels.
 *
 * Extracted in the Stage 3 review follow-up so that
 * `apps/web/src/app/t/[source]/route.ts` (the live redirect) and
 * `scripts/migrate-legacy-lead-source.ts` (the backfill) cannot drift
 * apart. Both consumers import `UTM_MEDIUM_BY_SOURCE` from this module;
 * if a new channel is added, add its row here in both places
 * (redirect + map) consistently.
 *
 * The contract: every channel that appears in /t/[source] CHANNELS
 * and every legacy-source token in migrate-legacy-lead-source.ts must
 * be classified by exactly one entry in UTM_MEDIUM_BY_SOURCE. Unknown
 * tokens fall back to FALLBACK_MEDIUM = 'referral' (the script's
 * conservative default; the route never emits unknown tokens
 * because it has a hardcoded CHANNELS map).
 *
 * Per plan `review-the-plans-recently-lucky-catmull.md` Stage 3 and
 * the synthesis decision package §6.
 */

/**
 * Controlled vocabulary for utm_medium, per analytics/kpi-taxonomy.md §3.2
 * and the Stage 3 attribution decision spec. Keep these strings exact —
 * PostHog funnels segment by them and the migration backfill uses them
 * as the canonical resolver.
 */
export type UtmMedium = 'cpc' | 'social' | 'referral' | 'email' | 'print';

/**
 * Canonical utm_medium for each utm_source token. The keys here must
 * match the `utm_source` (or derived legacy source token) that appears
 * on a Lead row.
 *
 * Adding a new channel = one row here + one row in the route's
 * CHANNELS map. The two stay in lockstep via this shared module.
 */
export const UTM_MEDIUM_BY_SOURCE: Readonly<Record<string, UtmMedium>> = {
  // paid lead-gen networks
  google_ads: 'cpc',
  bing_ads: 'cpc',
  craigslist: 'cpc',
  thumbtack: 'cpc',
  meta_ads: 'cpc', // legacy: meta_ads slug is now paused (S3.7); backfill stays correct
  // social (organic / Nextdoor / Facebook groups)
  nextdoor: 'social',
  facebook: 'social',
  // referral
  // (currently no channel routes here — kept for legacy-row backfill)
  // print / offline collateral
  door_hanger: 'print',
  yard_sign: 'print',
  business_card: 'print',
  review_magnet: 'print',
};

/** Fallback medium for unmapped sources in the migration backfill. */
export const FALLBACK_MEDIUM: UtmMedium = 'referral';

/**
 * Canonical Lead.source tokens — the union accepted by the Lead.source
 * column (see platform/packages/crm-core/src/service.ts). Mirrored here
 * so the web app can validate `utm_source` strings from the URL without
 * importing crm-core (which would pull in @grass/auth and other server
 * deps into the client bundle).
 *
 * Keep this set in lockstep with the Lead.source union in crm-core.
 * Drift here produces a typecheck error at the validator call site,
 * which is the desired alarm.
 */
export const LEAD_SOURCE_TOKENS = [
  // Customer.source subset (inherited)
  'gbp',
  'website',
  'referral',
  'yard_sign',
  'nextdoor',
  'manual',
  // Coarse-grained join keys (Stage 2)
  'paid_ad',
  'paid_search',
  'door_hanger',
  'walk_in',
  'quote_calculator',
  // Canonical channel tokens (Stage 3 B-2 widening)
  'google',
  'google_ads',
  'bing_ads',
  'facebook',
  'craigslist',
  'thumbtack',
  'business_card',
  'review_magnet',
] as const;

export type LeadSource = (typeof LEAD_SOURCE_TOKENS)[number];

const LEAD_SOURCE_SET: ReadonlySet<string> = new Set(LEAD_SOURCE_TOKENS);

/**
 * Type guard: is `value` a valid Lead.source token?
 */
export function isLeadSource(value: string | null | undefined): value is LeadSource {
  return value != null && LEAD_SOURCE_SET.has(value);
}

/**
 * Narrow `value` to LeadSource, falling back to `'website'` if not a
 * recognized token. Use this at the boundary between user-controlled
 * input (URL params, form submissions, postMessage) and the Lead.source
 * column. Falls back to 'website' (the organic default) so unknown
 * channels don't crash capture — PostHog still records the raw
 * utm_source in the discrete field for ad-hoc analysis.
 */
export function toLeadSource(value: string | null | undefined): LeadSource {
  return isLeadSource(value) ? value : 'website';
}
