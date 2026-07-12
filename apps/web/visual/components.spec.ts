/**
 * Component-level visual regression — 4 close-ups of the new section
 * library mounted on the `visual-test` test route (`app/visual-test/page.tsx`).
 *
 * Each test navigates to `/visual-test#<section-anchor>`, scrolls the
 * section into view, flushes any in-view animations, then captures only
 * the section element (NOT the full page). Element-level capture keeps
 * the 4 baselines from bleeding into adjacent sections.
 *
 * Captures run in `chromium-desktop` only — the responsive mobile variant
 * is tested via the route baselines.
 */
import { expect, test } from '@playwright/test';
import { COMPONENT_BASELINES } from './utils/fixtures';
import { flushScrollTriggers, maskVolatileContent, settleForCapture } from './utils/stabilize';

test.describe('component close-ups', () => {
  test.describe.configure({ mode: 'serial' });

  for (const { slug, anchor } of COMPONENT_BASELINES) {
    test(`${slug}`, async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Desktop-only visual baseline.');

      await page.goto(`/visual-test${anchor}`);
      const section = page.locator(`[data-test-section="${slug}"]`);
      await section.scrollIntoViewIfNeeded();
      await flushScrollTriggers(page);
      await settleForCapture(page);
      await maskVolatileContent(page);
      await expect(section).toHaveScreenshot(slug, {
        maxDiffPixels: 200,
        threshold: 0.2,
      });
    });
  }
});
