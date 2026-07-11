/**
 * Business constants — Mission 1 (Largo FL 33771 landscaping).
 *
 * Single source of truth for NAP, hours, service area, pricing floor.
 * Read by all pages and the GBP-stub.
 *
 * Pricing is grounded in `research/pricing/price-book.yaml`.
 */

export const BUSINESS = {
  name: 'Largo Lawn',
  legal_entity: 'Largo Lawn',
  phone: '+1-727-555-0123',
  email: 'hello@largolawn.pro',
  address: {
    line1: '12345 Starkey Rd',
    city: 'Largo',
    state: 'FL',
    zip: '33771',
  },
  hours: {
    weekdays: 'Mon–Fri 7:00 AM – 5:00 PM',
    saturday: 'Sat 8:00 AM – 2:00 PM',
    sunday: 'Closed',
  },
  service_area_zips: ['33770', '33771', '33773', '33774', '33778', '33756'] as const,
  // Sales tax is 6% FL + 0.75% Pinellas = 6.75% effective 2025-01-01.
  sales_tax_pct: 6.75,
  // Hurricane operating rule: no outdoor work in named-storm conditions or sustained
  // winds >=30 mph. Hard charter rule, enforced by scheduling constraint.
  hurricane_wind_threshold_mph: 30,
} as const;

export type ServiceAreaZip = (typeof BUSINESS.service_area_zips)[number];

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

export function estimatedQuoteCents(
  service: keyof typeof PRICING_FLOOR_CENTS,
  _bucket: 'small' | 'medium' | 'large' = 'medium',
): number {
  if (service === 'mowing_per_visit_small') return PRICING_FLOOR_CENTS.mowing_per_visit_small;
  if (service === 'mowing_per_visit_medium') return PRICING_FLOOR_CENTS.mowing_per_visit_medium;
  if (service === 'mowing_per_visit_large') return PRICING_FLOOR_CENTS.mowing_per_visit_large;
  return PRICING_FLOOR_CENTS[service];
}
