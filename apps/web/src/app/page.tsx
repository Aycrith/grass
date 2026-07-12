/**
 * Home page (Landing) — the single most-SEO-critical page.
 *
 * Targets: "lawn care Largo FL", "landscaping 33771", "yard maintenance Pinellas".
 * GBP-style NAP block matches schema.org/LandscapingBusiness in layout.
 *
 * Canonical section composition (10 sections, eyebrows 01-09):
 *   HeroCinematic → TrustStrip → OperatorStrip → ServiceBento →
 *   PricingTiers → ProcessSteps → ServiceAreaMap → TestimonialQuote →
 *   FAQAccordion → FinalCTABanner
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
  TestimonialQuote,
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

      {/* 07 — Social proof */}
      <TestimonialQuote />

      {/* 08 — FAQ */}
      <FAQAccordion />

      {/* 09 — Final CTA */}
      <FinalCTABanner />
    </>
  );
}