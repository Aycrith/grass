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
 * Component close-ups on the `_visual` test route. Each entry is one
 * `data-test-section` anchor on `app/_visual/page.tsx`. Desktop-only —
 * mobile responsive variants are tested via route baselines.
 *
 * WP12 expansion: 7 close-ups (4 prior + 3 marquee moments). Motion
 * captures (MarqueeQuote at t=0 + t=20s, ServiceBeforeAfter at frame
 * 0 + 50 + 100) live in `motion.spec.ts` so the static baselines stay
 * deterministic across replays.
 */
export const COMPONENT_BASELINES = [
  { slug: 'hero-cinematic', anchor: '#hero-cinematic' },
  { slug: 'service-bento', anchor: '#service-bento' },
  { slug: 'operator-strip', anchor: '#operator-strip' },
  { slug: 'pricing-tiers', anchor: '#pricing-tiers' },
  { slug: 'editorial-break', anchor: '#editorial-break' },
  { slug: 'service-area-stats', anchor: '#service-area-stats' },
  { slug: 'schedule-timeline', anchor: '#schedule-timeline' },
  { slug: 'marquee-quote', anchor: '#marquee-quote' },
  { slug: 'equipment-showcase', anchor: '#equipment-showcase' },
  { slug: 'service-before-after', anchor: '#service-before-after' },
] as const;
