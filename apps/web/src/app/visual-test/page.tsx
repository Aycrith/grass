/**
 * `visual-test` page — mount surface for Playwright component baselines.
 *
 * Renders the current homepage section components in their natural
 * homepage order, plus the demoted library (components that were
 * cut from the production surface but kept for visual-regression
 * coverage and potential revival on /about or seasonal campaigns):
 *
 *   #hero              → HeroFieldTelemetry
 *   #service-area-map  → ServiceAreaMap
 *   #operator-strip    → OperatorStrip
 *   #service-bento     → ServiceBento
 *   #pricing-tiers     → PricingTiers
 *   #process-steps     → ProcessSteps
 *   #schedule-timeline → ScheduleTimeline
 *   #faq-accordion     → FAQAccordion
 *   #final-cta-banner  → FinalCTABanner
 *   #marquee-quote     → MarqueeQuote (library)
 *   #service-area-stats → ServiceAreaStats (library)
 *   #editorial-break   → EditorialBreak (library)
 *
 * The `data-test-section="<slug>"` attribute is emitted by the
 * component itself (via its inner <Section>), so the page wrappers
 * are bare <div> containers — adding the attribute here too would
 * produce duplicate matches and break the strict-mode locator in
 * `visual/components.spec.ts`. Wrappers carry only `id` (for
 * navigation) and `aria-label` (for screen readers).
 *
 * No nav, no footer, no inter-section padding — each section is
 * element-scoped for the element-level screenshot
 * (`expect(section).toHaveScreenshot(...)`).
 *
 * Not surfaced to users. `app/visual-test/layout.tsx` exports
 * `robots: noindex` so this page is invisible to crawlers.
 */
import {
  EditorialBreak,
  FAQAccordion,
  FinalCTABanner,
  HeroFieldTelemetry,
  MarqueeQuote,
  OperatorStrip,
  PricingTiers,
  ProcessSteps,
  ScheduleTimeline,
  ServiceAreaMap,
  ServiceAreaStats,
  ServiceBento,
} from '@/components/sections';
import { hero as heroContent } from '@/lib/content';

export default function VisualPage() {
  return (
    <main>
      <div id="hero" aria-label="HeroFieldTelemetry visual baseline">
        <HeroFieldTelemetry
          eyebrow={heroContent.eyebrow}
          headline={heroContent.headline}
          subhead={heroContent.subhead}
          primaryCta={heroContent.primaryCta}
          secondaryCta={heroContent.secondaryCta}
          scene2={heroContent.scene2}
        />
      </div>
      <div id="service-area-map" aria-label="ServiceAreaMap visual baseline">
        <ServiceAreaMap />
      </div>
      <div id="operator-strip" aria-label="OperatorStrip visual baseline">
        <OperatorStrip />
      </div>
      <div id="service-bento" aria-label="ServiceBento visual baseline">
        <ServiceBento />
      </div>
      <div id="pricing-tiers" aria-label="PricingTiers visual baseline">
        <PricingTiers />
      </div>
      <div id="process-steps" aria-label="ProcessSteps visual baseline">
        <ProcessSteps />
      </div>
      <div id="schedule-timeline" aria-label="ScheduleTimeline visual baseline">
        <ScheduleTimeline />
      </div>
      <div id="faq-accordion" aria-label="FAQAccordion visual baseline">
        <FAQAccordion />
      </div>
      <div id="final-cta-banner" aria-label="FinalCTABanner visual baseline">
        <FinalCTABanner />
      </div>
      {/* ===========================================================
       * Library (demoted) — these components were cut from the
       * production surface in D-0029 / D-0042 but are kept here
       * so the per-component visual-regression matrix still has
       * a mount surface. They may return on /about or seasonal
       * campaigns; if not, drop the corresponding reduced-motion
       * spec entries from `visual/reduced-motion.spec.ts`.
       * =========================================================== */}
      <div id="marquee-quote" aria-label="MarqueeQuote visual baseline (library)">
        <MarqueeQuote />
      </div>
      <div id="service-area-stats" aria-label="ServiceAreaStats visual baseline (library)">
        <ServiceAreaStats />
      </div>
      <div id="editorial-break" aria-label="EditorialBreak visual baseline (library)">
        <EditorialBreak />
      </div>
    </main>
  );
}
