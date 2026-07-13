/**
 * `visual-test` page — mount surface for Playwright component baselines.
 *
 * Renders ten section components in their natural homepage order:
 *
 *   #hero-cinematic    → HeroCinematic
 *   #service-bento     → ServiceBento
 *   #operator-strip    → OperatorStrip
 *   #pricing-tiers     → PricingTiers
 *   #editorial-break   → EditorialBreak
 *   #service-area-stats → ServiceAreaStats
 *   #schedule-timeline → ScheduleTimeline
 *   #marquee-quote     → MarqueeQuote
 *   #equipment-showcase → EquipmentShowcase
 *   #service-before-after → ServiceBeforeAfter
 *
 * Each section carries a `data-test-section="<slug>"` attribute so the
 * Playwright locator can target it precisely. No nav, no footer, no
 * inter-section padding — each section is element-scoped for the
 * element-level screenshot (`expect(section).toHaveScreenshot(...)`).
 *
 * WP12 expansion: 4 → 10 sections. EditorialBreak + the 5 WP10 marquee
 * sections + EquipmentShowcase join the matrix. ServiceBeforeAfter is
 * mounted with synthetic copy pointing at the mowing webp (the
 * reduced-motion static grid is captured).
 *
 * Not surfaced to users. `layout.tsx` exports `robots: noindex`.
 */
import {
  EditorialBreak,
  EquipmentShowcase,
  HeroCinematic,
  MarqueeQuote,
  OperatorStrip,
  PricingTiers,
  ScheduleTimeline,
  ServiceAreaStats,
  ServiceBeforeAfter,
  ServiceBento,
} from '@/components/sections';
import { services } from '@/lib/content';

const BEFORE_AFTER_COPY = services.mowing.beforeAfter;

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
      <section
        id="editorial-break"
        data-test-section="editorial-break"
        aria-label="EditorialBreak visual baseline"
      >
        <EditorialBreak />
      </section>
      <section
        id="service-area-stats"
        data-test-section="service-area-stats"
        aria-label="ServiceAreaStats visual baseline"
      >
        <ServiceAreaStats />
      </section>
      <section
        id="schedule-timeline"
        data-test-section="schedule-timeline"
        aria-label="ScheduleTimeline visual baseline"
      >
        <ScheduleTimeline />
      </section>
      <section
        id="marquee-quote"
        data-test-section="marquee-quote"
        aria-label="MarqueeQuote visual baseline"
      >
        <MarqueeQuote />
      </section>
      <section
        id="equipment-showcase"
        data-test-section="equipment-showcase"
        aria-label="EquipmentShowcase visual baseline"
      >
        <EquipmentShowcase />
      </section>
      <section
        id="service-before-after"
        data-test-section="service-before-after"
        aria-label="ServiceBeforeAfter visual baseline"
      >
        <ServiceBeforeAfter copy={BEFORE_AFTER_COPY} />
      </section>
    </main>
  );
}
