/**
 * Reduced-motion regression — locks the WP12 reduced-motion audit
 * (audit/wp12-gates/reduced-motion-audit.md) into the CI matrix.
 *
 * For each animated primitive, the spec forces
 * `prefers-reduced-motion: reduce` via `page.emulateMedia`,
 * navigates to a route that mounts the primitive, and captures
 * a screenshot of the static fallback state.
 *
 * This is a behavior spec, not a visual diff — animated primitives
 * may have legitimately different static states (e.g. MarqueeQuote
 * becomes a vertical list instead of a horizontal scroll). The
 * test asserts that the static markup is present.
 */
import { expect, test } from '@playwright/test';

interface MotionPrimitive {
  slug: string;
  path: string;
  /** Selector for an element that should be present in the
   * static fallback (or absent in the static fallback if it
   * should disappear). */
  staticMarker: string;
  /** Selector that should be ABSENT in the static fallback
   * (typically an animated wrapper). */
  animatedMarker?: string;
}

const MOTION_PRIMITIVES: ReadonlyArray<MotionPrimitive> = [
  {
    slug: 'marquee-quote',
    // D-0029: MarqueeQuote was demoted from `/`; the component is
    // still mounted on `/visual-test` for the per-component baseline
    // matrix, so the reduced-motion regression runs against the
    // canonical mount surface instead of the production page.
    path: '/visual-test',
    staticMarker: '[data-test-section="marquee-quote"] ul',
    animatedMarker: '[data-test-section="marquee-quote"] .track',
  },
  {
    slug: 'schedule-timeline',
    path: '/',
    staticMarker: '[data-test-section="schedule-timeline"] ol',
  },
  {
    slug: 'service-area-stats',
    // D-0029: ServiceAreaStats was demoted from `/` (its 2 strongest
    // stats were folded into OperatorStrip's bio card); the full
    // 4-stat panel still mounts on `/visual-test` for the baseline
    // matrix, so the reduced-motion regression runs there.
    path: '/visual-test',
    staticMarker:
      '[data-test-section="service-area-stats"] dl, [data-test-section="service-area-stats"] p',
  },
  {
    slug: 'editorial-break',
    // D-0029: EditorialBreak was demoted from `/`; the component is
    // still mounted on `/visual-test` for the baseline matrix.
    path: '/visual-test',
    // On desktop the <img> is the visible element; on mobile (≤768px)
    // the image is intentionally collapsed to display:none and only the
    // editorial copy remains (per `EditorialBreak.tsx` design doc). The
    // headline paragraph is visible at every viewport width and is the
    // semantic anchor of the static fallback — assert on it.
    staticMarker: '[data-test-section="editorial-break"] p',
  },
  {
    slug: 'equipment-showcase',
    path: '/about',
    staticMarker: '[data-test-section="equipment-showcase"] article',
  },
  {
    slug: 'service-before-after',
    path: '/services/mowing',
    staticMarker: '[data-test-section="service-before-after"] figure',
    animatedMarker: '[data-test-section="service-before-after"] .frame',
  },
];

for (const prim of MOTION_PRIMITIVES) {
  test(`reduced-motion: ${prim.slug}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(prim.path);
    // Static marker must be present.
    await expect(page.locator(prim.staticMarker).first()).toBeVisible();
    // Animated marker (if any) must be absent.
    if (prim.animatedMarker) {
      const count = await page.locator(prim.animatedMarker).count();
      expect(count).toBe(0);
    }
  });
}
