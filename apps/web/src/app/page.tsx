/**
 * Home page (Landing) — the single most-SEO-critical page.
 *
 * Targets: "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas".
 * GBP-style NAP block matches schema.org/LandscapingBusiness in layout.
 *
 * Canonical section composition (10 sections, eyebrows 01-09):
 *   HeroCinematic → TrustStrip → OperatorStrip → ServiceBento →
 *   PricingTiers → ProcessSteps → ServiceAreaMap → OperatorNote →
 *   FAQAccordion → FinalCTABanner
 *
 * `OperatorNote` is the typographic pause between the dark
 * ServiceAreaMap section and the FAQ. It carries the operator's
 * first-person voice ("Same guy, same day, every week.") instead of
 * a customer testimonial — brand guidelines forbid invented customer
 * quotes, and the first-person operator copy carries the same
 * authority without crossing that line.
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
  FAQAccordion,
  FinalCTABanner,
  HeroCinematic,
  OperatorNote,
  OperatorStrip,
  PricingTiers,
  ProcessSteps,
  ServiceAreaMap,
  ServiceBento,
  TrustStrip,
} from '@/components/sections';

export default function HomePage() {
  return (
    <>
      {/* 01 — Hero */}
      <HeroCinematic />
      <TrustStrip />

      {/* 02 — Operator intro */}
      <OperatorStrip />

      {/* 03 — Service grid */}
      <ServiceBento />

      {/* 04 — Pricing */}
      <PricingTiers />

      {/* 05 — Process */}
      <ProcessSteps />

      {/* 06 — Service area */}
      <ServiceAreaMap />

      {/* 07 — Operator's note (typographic pause) */}
      <OperatorNote />

      {/* 08 — FAQ */}
      <FAQAccordion />

      {/* 09 — Final CTA */}
      <FinalCTABanner />
    </>
  );
}
