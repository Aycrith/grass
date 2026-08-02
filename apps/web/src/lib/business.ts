/**
 * Business constants — Mission 1 (Largo FL 33771 landscaping).
 *
 * Single source of truth for NAP, hours, service area, pricing
 * floor, and the canonical site URL. Read by all pages and the
 * GBP-stub.
 *
 * Pricing is grounded in `research/pricing/price-book.yaml`.
 *
 * Note: the route schedule helpers (DayKey, dayIndex, todayKey,
 * nextMowForZip, currentRouteProgress, daysSinceLastMow,
 * neighborhoodFor, buildMonthMatrix, MonthCell) used to live
 * here. They were extracted to `lib/schedule.ts` because they
 * are a separate concern — they read the `weeklySchedule` +
 * `dayMeta` data from `lib/content.ts`, not the BUSINESS
 * constants. The import surface per file is now:
 *   - `lib/business` for NAP + pricing + URL
 *   - `lib/schedule` for route-day math
 *   - `lib/content` for the schedule data itself
 */

export const BUSINESS = {
  /**
   * Business display name. Driven by `NEXT_PUBLIC_BUSINESS_NAME`
   * so a name change is a one-line env-var flip with no code
   * edits. Defaults to 'Largo Lawn' for backwards compat.
   */
  name: process.env['NEXT_PUBLIC_BUSINESS_NAME'] ?? 'Largo Lawn',
  legal_entity: process.env['NEXT_PUBLIC_LEGAL_ENTITY'] ?? 'Largo Lawn',
  /**
   * Production domain. Use anywhere the canonical site URL is
   * needed (JSON-LD url field, metadataBase, sitemap base URL,
   * QR-code target domain, robots.txt sitemap directive, etc).
   *
   * Driven by `NEXT_PUBLIC_SITE_URL` so a domain change is a
   * one-line env-var flip. Defaults to `https://largolawn.pro`
   * to match the historical hard-coded literal. The 'https://largolawn.pro'
   * literal was previously hard-coded in 13+ files; now it lives in
   * exactly one place.
   */
  url: process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://largolawn.pro',
  /**
   * Display phone (formatted for humans). Use for any visible
   * text rendering — header, footer, contact page, success
   * states, etc.
   */
  phone: '+1-727-313-8011',
  /**
   * E.164-format phone (digits only) for `tel:` hrefs. Most
   * modern browsers (Chrome, Safari, Firefox, iOS Safari,
   * Android Chrome) accept the dashed `+1-727-313-8011` form
   * in `tel:` hrefs, but a small number of legacy devices
   * (older flip phones, some car infotainment systems) strip
   * everything but digits. Use `BUSINESS.phoneTel` for any
   * `href={\`tel:${...}\`}` so the link works on every device.
   */
  phoneTel: '+17273138011',
  email: 'hello@largolawn.pro',
  /**
   * Service-area business (SAB) address policy.
   *
   * The business operates as a service-area business — the
   * operator travels to the customer. Per the steward's
   * explicit instruction (2026-07-26), no street address is
   * shown publicly anywhere on the site or in any citation
   * submission. The address below is for the steward's
   * private reference only (e.g., the GBP verification
   * postcard, when the steward is ready to submit).
   *
   * The `addressPublic` flag controls whether the address
   * line is rendered in the public UI. When `false` (the
   * default), the SiteHeader, SiteFooter, Contact page, and
   * the JSON-LD `streetAddress` field all suppress the
   * street line and show only the city/state/zip. This is
   * the correct SAB pattern for a home-based or
   * service-only operation.
   */
  address: {
    line1: '', // Private — not rendered publicly. See steward only.
    city: 'Largo',
    state: 'FL',
    zip: '33771',
  },
  addressPublic: false,
  hours: {
    weekdays: 'Mon to Fri, 7:00 AM to 5:00 PM',
    saturday: 'Sat, 8:00 AM to 2:00 PM',
    sunday: 'Closed',
  },
  service_area_zips: ['33770', '33771', '33773', '33774', '33778', '33756'] as const,
  /**
   * Hurricane mode flag. When true, the site-wide HurricaneBanner
   * mounts and the ServiceBento hurricane-prep card gains a 2px
   * sun border + subtle ribbon pulse (visual signal that mirrors
   * the banner). Defaults to false — steward flips it on when the
   * `cap_hurricane_mode` capability is triggered (see
   * state/capability-registry.yaml).
   */
  hurricaneModeActive: false,
  // Hurricane operating rule: no outdoor work in named-storm conditions or sustained
  // winds >=30 mph. Hard charter rule, enforced by scheduling constraint.
  hurricane_wind_threshold_mph: 30,
  /**
   * Google Business Profile direct review URL. Read by ContactForm
   * when `showReviewAsk` is true. The format is
   * `https://search.google.com/local/writereview?placeid=<PLACE_ID>`
   * where `<PLACE_ID>` is the GBP Place ID. Empty until GBP is
   * verified (postcard arrives 5-7 days after claim).
   *
   * Driven by `NEXT_PUBLIC_GBP_REVIEW_URL` so the steward can
   * paste the URL from GBP dashboard without touching code. When
   * unset, the review-ask card is silently hidden — never shows
   * a broken link.
   */
  gbpReviewUrl: process.env['NEXT_PUBLIC_GBP_REVIEW_URL'] ?? '',
} as const;

/**
 * Pricing floor per service. Numbers are conservative Q3-2026 Pinellas costs
 * for a 1-person crew (fuel, equipment depreciation, labor). Multiplied by
 * lot bucket at quote-time.
 */
export const PRICING_FLOOR_CENTS = {
  mowing_per_visit_small: 4500, // ≤0.25 acre
  mowing_per_visit_medium: 6500, // 0.25–0.5 acre
  mowing_per_visit_large: 9500, // 0.5–1 acre
  edging_per_linear_ft: 75,
  mulch_per_cubic_yard: 6500,
  mulch_install_per_cubic_yard: 4500,
  hedge_trim_per_linear_ft: 225,
  hurricane_prep_base: 12000,
  seasonal_cleanup_base: 18000,
} as const;

export function inServiceArea(zip: string): boolean {
  return (BUSINESS.service_area_zips as readonly string[]).includes(zip);
}
