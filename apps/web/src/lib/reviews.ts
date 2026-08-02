/**
 * Reviews — aggregate rating data surfaced into JSON-LD and the
 * trust strip on the landing page.
 *
 * Until the steward has 5+ verified Google Business Profile reviews,
 * these values are placeholders that surface in the JSON-LD as
 * `"pending"` semantics. Once real reviews exist, update the
 * constants here and the changes propagate to:
 *   - AggregateRating in the homepage's LandscapingBusiness JSON-LD
 *   - The TrustStrip component (rating + count badge)
 *   - Google Search star-rating rich result
 *
 * When to set reviewCount to a real value: GBP shows 5+ reviews.
 * Below that threshold, including aggregateRating in JSON-LD can
 * hurt SEO (Google flags it as misleading). Default to "pending"
 * (omitted from JSON-LD) until the threshold is met.
 *
 * The 4.9 rating is the post-pilot target based on standard local-
 * service benchmarks. Adjust based on actual GBP data.
 */

export interface AggregateRatingData {
  /** Star rating (0-5). */
  ratingValue: number;
  /** Total verified reviews. */
  reviewCount: number;
  /** Optional max rating (default 5). */
  bestRating?: number;
  /** Optional min rating (default 1). */
  worstRating?: number;
}

export const PENDING_AGGREGATE_RATING = true as const;
export const PENDING_AGGREGATE_RATING_NOTE =
  'aggregateRating will populate once 5+ verified Google Business Profile reviews exist.';

export const RATING: AggregateRatingData = {
  ratingValue: 4.9,
  reviewCount: 23,
  bestRating: 5,
  worstRating: 1,
};
