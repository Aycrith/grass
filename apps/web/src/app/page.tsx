/**
 * Home page (Landing) — the single most-SEO-critical page.
 *
 * Targets: "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas".
 * GBP-style NAP block matches schema.org/LandscapingBusiness in layout.
 *
 * Canonical section composition (14 sections, eyebrows 01-09):
 *   HeroCinematic → TrustStrip → OperatorStrip → ServiceBento →
 *   PricingTiers → EditorialBreak → ServiceAreaStats → ProcessSteps →
 *   ServiceAreaMap → ScheduleTimeline → OperatorNote → MarqueeQuote →
 *   FAQAccordion → FinalCTABanner
 *
 * `OperatorNote` is the typographic pause between the dark
 * ServiceAreaMap section and the marquee. It carries the operator's
 * first-person voice ("Same guy, same day, every week.") instead of
 * a customer testimonial — brand guidelines forbid invented customer
 * quotes, and the first-person operator copy carries the same
 * authority without crossing that line.
 *
 * `MarqueeQuote` extends that voice into a slow horizontal scroll —
 * 7 short operator lines, Fraunces italic, sun-color quote marks,
 * sand-bleached surface. Reduced-motion collapses to a static list.
 *
 * `ServiceAreaStats` is the "by the numbers" panel between
 * EditorialBreak and ProcessSteps — four specific data points
 * (yards, route miles, quote turnaround, tenure) that earn trust
 * the way the operator talks.
 *
 * `TestimonialQuote` remains in the `sections/` library as a dormant
 * component, ready to re-mount the moment a real proof item lands
 * (and would slot in at position 07 ahead of OperatorNote).
 *
 * This page is the production surface for every component in the
 * `sections/` library. visual-test/page.tsx only mounts a subset of
 * these for per-component screenshot baselines.
 */
import {
  EditorialBreak,
  FAQAccordion,
  FinalCTABanner,
  HeroCinematic,
  MarqueeQuote,
  OperatorNote,
  OperatorStrip,
  PricingTiers,
  ProcessSteps,
  ScheduleTimeline,
  ServiceAreaMap,
  ServiceAreaStats,
  ServiceBento,
  TrustStrip,
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

      {/* D-0013 — chapter break before the trust strip (sand-bleached to
       * sand-bleached; the painted ornament gives the typographic strip
       * a clear "and now we begin" feel) */}
      <SectionDivider />

      <TrustStrip />

      {/* 02 — Operator intro */}
      <OperatorStrip />

      {/* D-0013 — painted storybook chapter break before the service grid */}
      <SectionDivider />

      {/* 03 — Service grid */}
      <ServiceBento />

      {/* D-0013 — chapter break before pricing */}
      <SectionDivider />

      {/* 04 — Pricing */}
      <PricingTiers />

      {/* 04.5 — Editorial break (full-bleed image pause) */}
      <EditorialBreak />

      {/* D-0013 — chapter break after the editorial break before the
       * stat panel (both are full-bleed image/text sandwiches, divider
       * keeps the rhythm consistent) */}
      <SectionDivider />

      {/* 04.7 — By the numbers (sand-bleached stat panel) */}
      <ServiceAreaStats />

      {/* D-0013 — chapter break before the process steps */}
      <SectionDivider />

      {/* 05 — Process */}
      <ProcessSteps />

      {/* D-0013 — chapter break before the service area map */}
      <SectionDivider />

      {/* 06 — Service area */}
      <ServiceAreaMap />

      {/* 06.5 — Weekly schedule */}
      <ScheduleTimeline />

      {/* D-0013 — chapter break before the operator's note */}
      <SectionDivider />

      {/* 07 — Operator's note (typographic pause) */}
      <OperatorNote />

      {/* 07.5 — Marquee (operator voice scroll) */}
      <MarqueeQuote />

      {/* D-0013 — chapter break before the FAQ */}
      <SectionDivider />

      {/* 08 — FAQ */}
      <FAQAccordion />

      {/* D-0013 — chapter break before the final CTA */}
      <SectionDivider />

      {/* 09 — Final CTA */}
      <FinalCTABanner />
    </>
  );
}
