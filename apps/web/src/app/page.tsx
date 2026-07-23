/**
 * Home page (Landing) — the single most-SEO-critical page.
 *
 * Targets: "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas".
 * GBP-style NAP block matches schema.org/LandscapingBusiness in layout.
 *
 * Canonical section composition (9 sections, eyebrows 01-09):
 *   HeroMowerScene → ServiceAreaMap → OperatorStrip → ServiceBento →
 *   PricingTiers → ProcessSteps → ScheduleTimeline → FAQAccordion →
 *   FinalCTABanner
 *
 * D-0029 (Wave B of three sequential design changes) collapsed the
 * 14-section composition to 9. Two problems drove the cut:
 *
 *   1. **Late coverage decision.** The user's first conversion question
 *      is "am I in your service area?" In the 14-section order, the
 *      Coverage Check sat at position 6 of 14 — after the operator
 *      intro, the service grid, pricing, an editorial break, and a
 *      stats panel. By fold 3 the user had scrolled past ~8 full-bleed
 *      editorial blocks before being able to answer the conversion
 *      question. The first paint after the hero should already be the
 *      Coverage Check (D-0028's section), so we move it to position 2.
 *
 *   2. **Operator voice was duplicated.** OperatorStrip's bio already
 *      says "Same guy, same day, every week." in the first-person bio.
 *      `OperatorNote` (typographic pause) and `MarqueeQuote` (slow
 *      horizontal scroll) both carried the same operator-voice content
 *      in different visual idioms — three of the same section. We keep
 *      OperatorStrip as the canonical operator-voice section and demote
 *      OperatorNote + MarqueeQuote to the library (still available for
 *      /about and seasonal campaigns).
 *
 *      swapped for HeroMowerScene. The storybook-painted-static-image
 *      hero felt dated and earned repeated steward pushback. The new
 *      hero is a hand-authored animated SVG landscape where a small
 *      lawn mower crosses the scene on scroll, revealing the headline
 *      in its mowed path. Multiple parallax layers, ambient CSS
 *      animations (drifting clouds, swaying palms, blooming wildflowers),
 *      and magnetic CTAs. The same id="hero" anchor is preserved so
 *      the library for /visual-test and as a fallback.
 *
 * `EditorialBreak` (pretty, non-converting full-bleed image pause) and
 * `ServiceAreaStats` (the "47 / 89 / 18h / 6 yrs" data panel) were
 * also demoted. The two strongest stats from `ServiceAreaStats` were
 * folded into `OperatorStrip`'s bio card — the bio is the operator's
 * voice section, so "47 yards on the route" + "18h median quote
 * turnaround" reinforce that voice without an extra section. The full
 * 4-stat panel stays in the library for /about and other surfaces.
 *
 * Section dividers are reserved for the three major tone shifts on
 * the new composition:
 *   - between Hero and Coverage (cinematic dark → dark form section)
 *   - between Coverage and Operator (dark form → light bio card)
 *   - between FAQ and FinalCTA (light → dark closer)
 * No dividers between same-tone neighbors (Bento → Pricing → Process
 * are all light editorial; Schedule → FAQ is also light editorial).
 *
 * This page is the production surface for every component in the
 * `sections/` library. visual-test/page.tsx only mounts a subset of
 * these for per-component screenshot baselines.
 */
import {
  FAQAccordion,
  FieldLog,
  FinalCTABanner,
  HeroFieldTelemetry,
  OperatorStrip,
  PocketMap,
  PricingTiers,
  ProcessSteps,
  ScheduleTimeline,
  ServiceAreaMap,
  ServiceBento,
  SpecimenPlate,
} from '@/components/sections';
// 2026-07-22 — BehindTheScenes section imported separately to
// keep the destructure list scannable. Same module, same re-export.
import { BehindTheScenes } from '@/components/sections/BehindTheScenes';
import { ConversionRail } from '@/components/site';
import { SectionDivider } from '@/components/ui';
import { hero as heroContent } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {/* 01 — Hero (D-0042: Field Telemetry + WebGL grass field) */}
      <HeroFieldTelemetry
        eyebrow={heroContent.eyebrow}
        headline={heroContent.headline}
        subhead={heroContent.subhead}
        primaryCta={heroContent.primaryCta}
        secondaryCta={heroContent.secondaryCta}
        scene2={heroContent.scene2}
      />
      <SectionDivider />

      {/* 02 — Coverage check (D-0028: ZIP-or-neighborhood input +
       * map illustration + result panel + details collapse). First
       * conversion decision lands at fold 1-2 instead of fold 4-5. */}
      <ServiceAreaMap />
      <SectionDivider />

      {/* 03 — Operator intro (carries the 2 stats folded in from
       * the demoted ServiceAreaStats: "47 yards on the route" +
       * "18h median quote turnaround" — see OperatorStrip.tsx). */}
      <OperatorStrip />

      {/* 03.5 — D-0058 editorial "pocket map" section. Vintage
       * illustrated map of the operator's actual service area in
       * Pinellas County, FL. Real OpenStreetMap boundary (relation
       * 1210726, 392-point polygon), 1920s-30s WPA / pictorial map
       * aesthetic. The page's FOURTH visual register (folk-cartoon
       * + painted VEO + pressed-herbarium + pocket map). Bridges
       * the operator bio (where the operator is introduced) to
       * the FieldLog (where the operator describes the route).
       * See governance/decisions/0058-pocket-map-section.md and
       * apps/web/audit/d-0058-pocket-map/memo.md. */}
      <PocketMap />

      {/* 04 — D-0055 editorial "field log" section. Stand-alone
       * editorial moment between the operator intro and the service
       * grid: hand-drawn route map of the 6 ZIPs + pull-quote +
       * passport stamp. No CTA — pure breathing room + voice anchor.
       * See governance/decisions/0055-field-log-section.md. */}
      <FieldLog />

      {/* 04.05 — 2026-07-22 "behind the scenes" trust section.
       * Quarantines the real-footage riding-mower clips that
       * don't match the painted hero world. White card on cream,
       * paper-tape "Real footage, not stock" label, two side-by-side
       * 10s videos, caption "Same truck, every Tuesday. No franchise,
       * no subcontractor." Bridges FieldLog (the route) and
       * ServiceBento (the work) — gives the visitor proof that the
       * painted brand illustration IS the working operation, not
       * a stock gallery. */}
      <BehindTheScenes />

      {/* 04 — Service grid (6 cards, no dividers between light
       * editorial sections) */}
      <ServiceBento />

      {/* 04.5 — D-0057 editorial "field guide" section. 2x2 grid of
       * pressed-herbarium turf grass specimens (St. Augustine, Bermuda,
       * Zoysia, Bahia) with the species' actual diagnostic features
       * (blade width, seedhead, growth habit). Closes the gap between
       * "we mow lawns" and "we know what's growing in your yard at the
       * species level." Uses real UF/IFAS data for mowing heights and
       * frequencies. See governance/decisions/0057-specimen-plate-section.md
       * and apps/web/audit/d-0057-specimen-plate/memo.md. */}
      <SpecimenPlate />

      {/* 05 — Pricing */}
      <PricingTiers />

      {/* 06 — Process */}
      <ProcessSteps />

      {/* 07 — Weekly schedule (optional consolidation candidate
       * with the Coverage Check's "which day" answer — steward can
       * review whether ScheduleTimeline is redundant with the map
       * result on a later wave). */}
      <ScheduleTimeline />

      {/* 08 — FAQ */}
      <FAQAccordion />
      <SectionDivider />

      {/* 09 — Final CTA (the closer) */}
      <FinalCTABanner />

      {/* D-0037 — sticky conversion rail. Appears once the user
       * scrolls past the hero, hides when the final CTA is in
       * view. Single primary "Get a free quote" CTA is always
       * within reach. */}
      <ConversionRail heroId="hero" finalCtaId="final-cta" />
    </>
  );
}
