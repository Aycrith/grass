/**
 * Home page (Landing) — the single most-SEO-critical page.
 *
 * Targets: "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas".
 * GBP-style NAP block matches schema.org/LandscapingBusiness in layout.
 *
 * Canonical section composition (9 sections, eyebrows 01-09):
 *   HeroCinematic → ServiceAreaMap → OperatorStrip → ServiceBento →
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
  FinalCTABanner,
  HeroCinematic,
  OperatorStrip,
  PricingTiers,
  ProcessSteps,
  ScheduleTimeline,
  ServiceAreaMap,
  ServiceBento,
} from '@/components/sections';
import { SectionDivider } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {/* 01 — Hero */}
      <HeroCinematic />
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

      {/* 04 — Service grid (6 cards, no dividers between light
       * editorial sections) */}
      <ServiceBento />

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
    </>
  );
}
