# Audit 2 — Website Inventory (2026-07-30)

> **Read-only audit.** Output of the Explore agent dispatched during the situation-review session.
>
> **Scope:** Every `apps/web/src/app/**`, `apps/web/src/components/**`, `apps/web/src/lib/**`, `apps/web/public/**` file relevant to customer-facing surfaces.
>
> **Source:** Agent 2 of 3 (parallel).

---

## Inventory at a Glance

- **Routes:** 14 (homepage `/` + 6 services + `/pet-waste` + `/pricing` + `/contact` + `/about` + `/terms` + `/privacy` + `/sitemap`)
- **Components:** 23 first-party (Hero, ServiceBento, PricingTiers, ProcessSteps, OperatorStrip, FAQAccordion, FinalCTABanner, etc.)
- **Twin / lib:** 11 utility modules (`business.ts`, `content.ts`, `reviews.ts`, `utm.ts`, `event-id.ts`, `synthetic-log.ts`, etc.)
- **Hard-stop violations in working tree:** 6 (server-track.ts, track.ts, analytics/, twilio.ts, /api/lead/route.ts, /pet-waste/page.tsx)

---

## Homepage Composition (`apps/web/src/app/page.tsx`)

14 sections in order:
1. HeroFieldTelemetry
2. ServiceAreaMap
3. OperatorStrip
4. PocketMap
5. FieldLog
6. BehindTheScenes × 2
7. ServiceBento
8. SpecimenPlate
9. PricingTiers
10. ProcessSteps
11. ScheduleTimeline
12. FAQAccordion
13. FinalCTABanner
14. ConversionRail

**Targets:** "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas". NAP matches `BUSINESS`.

---

## Service Pages (`apps/web/src/app/services/[slug]/page.tsx`)

6 service pages currently live:
- `/services/lawn-mowing`
- `/services/edging`
- `/services/mulching`
- `/services/hedge-trim`
- `/services/hurricane-prep` (note: matches brainstorm #2)
- `/services/seasonal-cleanup`

**Plus `/pet-waste` — off-registry**.

---

## 13 Strategy-Relevant Inconsistencies

| # | Where | Issue | Fix |
|---|---|---|---|
| 1 | `business.ts` | `address.line1 = ''` (private) → fine for SAB, but GBP description says "Largo" with no street | Confirm GBP description adequacy |
| 2 | `business.ts` | `gbpReviewUrl = ''` (empty) → review-ask card silently hidden when empty | Wire `NEXT_PUBLIC_GBP_REVIEW_URL` after GBP verified |
| 3 | `reviews.ts` | `PENDING_AGGREGATE_RATING = true` — gates `aggregateRating` JSON-LD | Correct, do not change |
| 4 | `content.ts` | Pet waste NOT in registry (6 services only) | Add pet-waste as 7th (T1.7) |
| 5 | `services/[slug]/page.tsx` | Listing has 6 services but no pet-waste slug | Either `/services/pet-waste` or keep `/pet-waste` separate |
| 6 | `FinalCTABanner.tsx` | Has "$1M liability insured" claim | Replace with "Fully insured — policy on request" (T1.5) |
| 7 | `AboutHero.tsx` | Has "Six years" claim | Verify or remove (T1.5) |
| 8 | `OperatorStrip.tsx` | "47 yards" / "18h median" — unsubstantiated | Remove "18h median" (T1.6) |
| 9 | `HeroFieldTelemetry.tsx` | Same stats as OperatorStrip | Same fix |
| 10 | `terms/page.tsx` | Contradicts "$1M" claim | Reconcile (T1.5) |
| 11 | `/pet-waste/page.tsx` | Has "since 2020" + "Meet Cameron" with generated image | Reset to spec (T1.2) |
| 12 | `/about/page.tsx` | "Since 2020" again | Remove or verify (T1.5) |
| 13 | `/service-areas` | Broken link mentioned in audit | Verify and either delete or repair |

---

## Pricing Drift Across 6 Surfaces

| Surface | Mowing price | Other |
|---|---|---|
| `research/pricing/price-book.yaml` | $38–$115 tier table (canonical) | Mulch $110/yd, hedge $4–$12/ft + $80 min, edge $0.85/ft + $35 min |
| Google/Meta ads | "$25+ per visit" | — |
| Google draft | "$45 average" "under $50" | — |
| Thumbtack | "$40-60 per visit" | — |
| `/pricing` page | TBD what tier table is rendered | Need to verify |
| `business_plan_*.html` | Mid-tier value | — |

**Canonical:** `price-book.yaml`. **Action:** T1.4 + T1.5 (sync all surfaces).

---

## Components Inventory (Customer-Facing)

| Component | Purpose | Risk |
|---|---|---|
| `HeroFieldTelemetry.tsx` | Hero with stats | "47 yards" / "18h median" unsubstantiated |
| `HeroCinematic.tsx` | Hero variant (5-plane, D-0060) | None |
| `ServiceBento.tsx` | 6 services grid | Pet waste missing |
| `SpecimenPlate.tsx` | Grass specimen showcase | Synthetic imagery risk |
| `PricingTiers.tsx` | Pricing display | Drift risk |
| `ProcessSteps.tsx` | Process explainer | None |
| `OperatorStrip.tsx` | Operator stats | "47 yards" / "18h median" |
| `BehindTheScenes.tsx` | BTS carousel | Synthetic imagery risk |
| `FieldLog.tsx` | Field log | Synthetic imagery risk |
| `FAQAccordion.tsx` | FAQ | None |
| `FinalCTABanner.tsx` | Closer | "$1M insured" claim |
| `ConversionRail.tsx` | Multi-CTA rail | None |
| `TrustStrip.tsx` | Trust signals | Mounted but disabled (per Audit 1) |
| `PocketMap.tsx` | Pocket map | None |
| `ServiceAreaMap.tsx` | Service area map | None |
| `ScheduleTimeline.tsx` | Schedule timeline | None |
| `HeroSection.tsx` | Hero variant | None |
| `HeroAerial.tsx` | Aerial hero | Synthetic imagery risk |
| `HeroSplit.tsx` | Split hero | None |
| `HeroFieldStats.tsx` | Hero stats | "47 yards" / "18h median" |
| `FieldTelemetry.tsx` | Field telemetry | "47 yards" |
| `pricing/PricingComparisonTable.tsx` | Pricing comparison | Drift risk |
| `TestimonialCarousel.tsx` | Reviews carousel | Fabricated review risk |

**Visual assets:** 4 SVG specimens (`bahia.svg`, `bermuda.svg`, `st-augustine.svg`, `zoysia.svg`) — real. All `/public` raster images appear synthetic.

---

## JSON-LD Strategy

- `aggregateRating` is **correctly gated** via `PENDING_AGGREGATE_RATING = true` in `reviews.ts`.
- Pet waste `FAQPage` JSON-LD with `provider: LandscapingBusiness` is present.
- Homepage `Service` JSON-LD references 6 services; pet waste missing.

---

## Claims Register (current)

Below — all unsubstantiated per D-0064 §0.10:

| Claim | Where | Action |
|---|---|---|
| "5-Star Pet Waste Service" | Google draft, Meta draft | REMOVE |
| "5-Star Lawn Care" | Google draft | REMOVE |
| "Pinellas County's #1" | Google draft | REMOVE |
| "Trusted by 47 Yards in 33771" | OperatorStrip, HeroFieldTelemetry, FieldTelemetry | REMOVE |
| "Trusted by Largo Neighbors" | Google draft | REMOVE |
| "Family-Owned" | Google draft callout | REMOVE (operator is solo) |
| "Veteran-Owned" | Nextdoor templates | VERIFY before use |
| "Stop Calling Franchises" | Google draft | OK as A/B test variant |
| "$1M Liability Insured" | FinalCTABanner, terms, ads callout | REPLACE with "Fully insured — policy on request" |
| "Since 2020" | /pet-waste, /about, Google draft H6, Meta description | REMOVE per D-0064 §0.10 |
| "Six years" | AboutHero | VERIFY or REMOVE |
| "First 5 neighbors on your street" | /pet-waste subhead, Meta copy | KEEP (A/B test variable) |

---

## Visual Asset Audit

| Asset | Type | Status |
|---|---|---|
| `bahia.svg`, `bermuda.svg`, `st-augustine.svg`, `zoysia.svg` | SVG specimens | Real (drawn) |
| All `/public` raster JPGs | Photos | Synthetic (generated) |
| Hero aerial `hero_aerial_v3.jpg` | Photo | Synthetic |
| Hero plane illustrations | SVG | Real (drawn, D-0060) |
| Operator portraits | Photo | Synthetic |
| Pet waste before/after | Photo | Missing — needs shoot |

**For pilot:** Use illustrative images (no specific people) until real operator photo + pet waste before/after shoots happen.

---

## Trust Strip Status

`TrustStrip.tsx` is **mounted but disabled**. Currently the homepage relies on visual trust signals without the explicit TrustStrip. The fix is to enable `TrustStrip` with **substantiated claims only** for State 1.

---

## Recommended Fix Order (matches strategy plan Gate 1)

1. T1.1 — discard hard-stop violations (server-track, track, analytics/ConsentBanner, twilio sendAutoTextBack)
2. T1.2 — re-author /pet-waste to spec
3. T1.3 — revert /api/lead to Stage 2/3 HEAD
4. T1.4 — resolve D-0062 drift (price-book, business.ts, content.ts)
5. T1.5 — strip unsubstantiated claims register
6. T1.6 — resolve 5-min vs 18-hour SLA conflict
7. T1.7 — add pet-waste to content registry
8. T1.8 — sync GBP and citations for 6 ZIPs
9. T1.11 — verify charter + lint + empty-grep checks

---

## What this audit did NOT cover

- Ad/GTM surfaces (covered by Audit 3).
- Documentation-only drift (covered by Audit 1).
- Component visual regression tests (covered by Gate 5).
- Performance metrics (Lighthouse, LCP, CLS — covered by Gate 2 verification).
