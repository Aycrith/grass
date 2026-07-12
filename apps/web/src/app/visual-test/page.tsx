/**
 * `visual-test` page — mount surface for Playwright component baselines.
 *
 * Renders four section components in their natural homepage order:
 *
 *   #hero-cinematic   → HeroCinematic
 *   #service-bento    → ServiceBento
 *   #operator-strip   → OperatorStrip
 *   #pricing-tiers    → PricingTiers
 *
 * Each section carries a `data-test-section="<slug>"` attribute so the
 * Playwright locator can target it precisely. No nav, no footer, no
 * inter-section padding — each section is element-scoped for the
 * element-level screenshot (`expect(section).toHaveScreenshot(...)`).
 *
 * Not surfaced to users. `layout.tsx` exports `robots: noindex`.
 */
import { HeroCinematic, OperatorStrip, PricingTiers, ServiceBento } from '@/components/sections';

export default function VisualPage() {
  return (
    <main>
      <section
        id="hero-cinematic"
        data-test-section="hero-cinematic"
        aria-label="HeroCinematic visual baseline"
      >
        <HeroCinematic />
      </section>
      <section
        id="service-bento"
        data-test-section="service-bento"
        aria-label="ServiceBento visual baseline"
      >
        <ServiceBento />
      </section>
      <section
        id="operator-strip"
        data-test-section="operator-strip"
        aria-label="OperatorStrip visual baseline"
      >
        <OperatorStrip />
      </section>
      <section
        id="pricing-tiers"
        data-test-section="pricing-tiers"
        aria-label="PricingTiers visual baseline"
      >
        <PricingTiers />
      </section>
    </main>
  );
}
