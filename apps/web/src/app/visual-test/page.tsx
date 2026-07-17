/**
 * `visual-test` page — mount surface for Playwright component baselines.
 *
 * Renders the current homepage section components in their natural
 * homepage order:
 *
 *   #hero-mower-scene  → HeroMowerScene
 *   #service-area-map  → ServiceAreaMap
 *   #operator-strip    → OperatorStrip
 *   #service-bento     → ServiceBento
 *   #pricing-tiers     → PricingTiers
 *   #process-steps     → ProcessSteps
 *   #schedule-timeline → ScheduleTimeline
 *   #faq-accordion     → FAQAccordion
 *   #final-cta-banner  → FinalCTABanner
 *
 * Each section carries a `data-test-section="<slug>"` attribute so the
 * Playwright locator can target it precisely. No nav, no footer, no
 * inter-section padding — each section is element-scoped for the
 * element-level screenshot (`expect(section).toHaveScreenshot(...)`).
 *
 * Not surfaced to users. `layout.tsx` exports `robots: noindex`.
 */
import {
  FAQAccordion,
  FinalCTABanner,
  HeroMowerScene,
  OperatorStrip,
  PricingTiers,
  ProcessSteps,
  ScheduleTimeline,
  ServiceAreaMap,
  ServiceBento,
} from '@/components/sections';
import { hero as heroContent } from '@/lib/content';

export default function VisualPage() {
  return (
    <main>
      <section
        id="hero-mower-scene"
        data-test-section="hero-mower-scene"
        aria-label="HeroMowerScene visual baseline"
      >
        <HeroMowerScene
          eyebrow={heroContent.eyebrow}
          subhead={heroContent.subhead}
          primaryCta={heroContent.primaryCta}
          secondaryCta={heroContent.secondaryCta}
        />
      </section>
      <section
        id="service-area-map"
        data-test-section="service-area-map"
        aria-label="ServiceAreaMap visual baseline"
      >
        <ServiceAreaMap />
      </section>
      <section
        id="operator-strip"
        data-test-section="operator-strip"
        aria-label="OperatorStrip visual baseline"
      >
        <OperatorStrip />
      </section>
      <section
        id="service-bento"
        data-test-section="service-bento"
        aria-label="ServiceBento visual baseline"
      >
        <ServiceBento />
      </section>
      <section
        id="pricing-tiers"
        data-test-section="pricing-tiers"
        aria-label="PricingTiers visual baseline"
      >
        <PricingTiers />
      </section>
      <section
        id="process-steps"
        data-test-section="process-steps"
        aria-label="ProcessSteps visual baseline"
      >
        <ProcessSteps />
      </section>
      <section
        id="schedule-timeline"
        data-test-section="schedule-timeline"
        aria-label="ScheduleTimeline visual baseline"
      >
        <ScheduleTimeline />
      </section>
      <section
        id="faq-accordion"
        data-test-section="faq-accordion"
        aria-label="FAQAccordion visual baseline"
      >
        <FAQAccordion />
      </section>
      <section
        id="final-cta-banner"
        data-test-section="final-cta-banner"
        aria-label="FinalCTABanner visual baseline"
      >
        <FinalCTABanner />
      </section>
    </main>
  );
}
