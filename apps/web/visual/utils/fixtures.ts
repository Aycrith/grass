/**
 * Test matrices for Playwright visual regression.
 *
 * The PRD-00 §4 route list mirrors what Lighthouse CI baselines (the same
 * 6 routes × 2 viewports = 12 captures). When that list changes, update
 * Lighthouse's `lighthouserc.nightly.cjs` URL list in lockstep.
 */
export const PRD_ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'services', path: '/services' },
  { slug: 'services-mowing', path: '/services/mowing' },
  { slug: 'areas', path: '/areas' },
  { slug: 'areas-33756', path: '/areas/33756' },
  { slug: 'areas-33771', path: '/areas/33771' },
  { slug: 'areas-33773', path: '/areas/33773' },
  { slug: 'areas-33774', path: '/areas/33774' },
  { slug: 'areas-33778', path: '/areas/33778' },
  { slug: 'pricing', path: '/pricing' },
  { slug: 'quote', path: '/quote' },
  { slug: 'about', path: '/about' },
  { slug: 'contact', path: '/contact' },
  { slug: 'review', path: '/review' },
] as const;

export const VIEWPORTS = ['desktop', 'mobile'] as const;

export type Viewport = (typeof VIEWPORTS)[number];

/**
 * Component close-ups on the `visual-test` test route. Each entry is one
 * `data-test-section` anchor on `app/visual-test/page.tsx`. Desktop-only —
 * mobile responsive variants are tested via route baselines.
 *
 * Mirrors the current homepage section composition (see page.tsx):
 * HeroFieldTelemetry → ServiceAreaMap → OperatorStrip → ServiceBento →
 * PricingTiers → ProcessSteps → ScheduleTimeline → FAQAccordion →
 * FinalCTABanner.
 */
export const COMPONENT_BASELINES = [
  { slug: 'hero', anchor: '#hero' },
  { slug: 'service-area-map', anchor: '#service-area-map' },
  { slug: 'operator-strip', anchor: '#operator-strip' },
  { slug: 'service-bento', anchor: '#service-bento' },
  { slug: 'pricing-tiers', anchor: '#pricing-tiers' },
  { slug: 'process-steps', anchor: '#process-steps' },
  { slug: 'schedule-timeline', anchor: '#schedule-timeline' },
  { slug: 'faq-accordion', anchor: '#faq-accordion' },
  { slug: 'final-cta-banner', anchor: '#final-cta-banner' },
] as const;
