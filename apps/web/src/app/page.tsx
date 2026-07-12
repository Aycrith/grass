/**
 * Home page (Landing) — the single most-SEO-critical page.
 *
 * Targets: "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas".
 * GBP-style NAP block matches schema.org/LandscapingBusiness in layout.
 *
 * Canonical section composition (9 sections, eyebrows 01-09):
 *   HeroCinematic → TrustStrip → OperatorStrip → ServiceBento →
 *   PricingTiers → ProcessSteps → ServiceAreaMap → FAQAccordion →
 *   FinalCTABanner
 *
 * `TestimonialQuote` is intentionally omitted from the composition
 * until the steward supplies real customer quotes with explicit
 * written permission — `lib/content.ts → social.proof` is empty by
 * design, and invented quotes are forbidden per brand guidelines.
 * The component remains in the `sections/` library, dormant, ready
 * to re-mount the moment a real proof item lands.
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

      {/* 07 — FAQ (was: TestimonialQuote — dormant until real quotes exist) */}
      <FAQAccordion />

      {/* 08 — Final CTA */}
      <FinalCTABanner />
    </>
  );
}
