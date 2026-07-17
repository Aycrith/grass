/**
 * Route-level visual regression — 6 PRD-00 §4 routes. The actual viewport
 * is determined by the Playwright project (`chromium-desktop` 1280×800,
 * `chromium-mobile` Pixel 5 emulation), not by a test parameter, so each
 * route test runs in BOTH projects and produces TWO baselines:
 *
 *   baselines/<slug>-chromium-desktop.png   (1280×800 desktop)
 *   baselines/<slug>-chromium-mobile.png    (Pixel 5 mobile)
 *
 * Mirrors the surface Lighthouse CI gates (`lighthouserc.cjs` /
 * `lighthouserc.mobile.cjs`) so a route regressing LCP / CLS / TBT AND a
 * route shifting pixels are both caught on the same PR.
 */
import { expect, test } from '@playwright/test';
import { PRD_ROUTES } from './utils/fixtures';
import { flushScrollTriggers, maskVolatileContent, settleForCapture } from './utils/stabilize';

for (const route of PRD_ROUTES) {
  test(`${route.slug}`, async ({ page }) => {
    // Freeze the clock for deterministic ScheduleTimeline rendering on
    // the home route (the only PRD route with time-dependent content).
    // `setSystemTime` freezes Date only — see comment in components.spec.ts
    // for full rationale. Safe for the other 13 routes. D-0040.
    await page.clock.setSystemTime(new Date('2026-07-14T10:15:00-04:00'));
    await page.goto(route.path);
    // Scroll to the bottom and back so every below-the-fold FadeUp
    // (e.g. QuoteConfirmation) has a chance to trigger before we settle.
    await flushScrollTriggers(page);
    await settleForCapture(page);
    await maskVolatileContent(page);
    await expect(page).toHaveScreenshot(route.slug, {
      maxDiffPixels: 200,
      threshold: 0.2,
    });
  });
}

// Reduced-motion / coarse-pointer fallback for the new WebGL hero.
// The WebGL grass overlay is disabled when prefers-reduced-motion is
// true OR when the primary pointer is coarse, so the hero should
// degrade to the photo + Ken Burns only.
test('home-reduced-motion', async ({ page }) => {
  await page.clock.setSystemTime(new Date('2026-07-14T10:15:00-04:00'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await flushScrollTriggers(page);
  await settleForCapture(page);
  await maskVolatileContent(page);
  await expect(page).toHaveScreenshot('home-reduced-motion', {
    maxDiffPixels: 200,
    threshold: 0.2,
  });
});

test('home-coarse-pointer', async ({ page }) => {
  await page.clock.setSystemTime(new Date('2026-07-14T10:15:00-04:00'));
  // Preserve the real matchMedia and only override the coarse query so
  // other media-query consumers (e.g. Framer Motion useReducedMotion)
  // continue to work.
  await page.context().addInitScript(() => {
    const original = window.matchMedia.bind(window);
    window.matchMedia = (query: string) => {
      if (query === '(pointer: coarse)') {
        const list = original('(pointer: coarse)');
        return { ...list, matches: true } as MediaQueryList;
      }
      return original(query);
    };
  });
  await page.goto('/');
  await flushScrollTriggers(page);
  await settleForCapture(page);
  await maskVolatileContent(page);
  // The WebGL grass overlay should be disabled on coarse pointers.
  await expect(page.locator('#hero canvas')).toHaveCount(0);
  await expect(page).toHaveScreenshot('home-coarse-pointer', {
    maxDiffPixels: 200,
    threshold: 0.2,
  });
});
