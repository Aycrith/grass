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
import { maskVolatileContent, settleForCapture } from './utils/stabilize';

for (const route of PRD_ROUTES) {
  test(`${route.slug}`, async ({ page }) => {
    // Freeze the clock for deterministic ScheduleTimeline rendering on
    // the home route (the only PRD route with time-dependent content).
    // `setSystemTime` freezes Date only — see comment in components.spec.ts
    // for full rationale. Safe for the other 13 routes. D-0040.
    await page.clock.setSystemTime(new Date('2026-07-14T10:15:00-04:00'));
    await page.goto(route.path);
    await settleForCapture(page);
    await maskVolatileContent(page);
    await expect(page).toHaveScreenshot(route.slug, {
      maxDiffPixels: 200,
      threshold: 0.2,
    });
  });
}
