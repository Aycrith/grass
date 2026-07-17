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
    test(`${slug}`, async ({ page }) => {
      test.skip(
        test.info().project.name !== 'chromium-desktop',
        'Desktop-only visual baseline.'
      );

      // Freeze the clock so ScheduleTimeline's wall-clock-derived
      // rendering ("today", "currently mowing", zip last-mow-arithmetic)
      // is deterministic across capture days. `setSystemTime` freezes
      // `Date.now()` + `new Date()` only — it does NOT pause timers,
      // so `settleForCapture` (rAF + waitForTimeout) keeps working.
      // Pin: Tuesday 2026-07-14 10:15 EDT, inside the operator's
      // 8:00–11:30 ETA window so the today card shows a realistic
      // in-progress state. Safe across all 9 component tests.
      // D-0040.
      await page.clock.setSystemTime(new Date('2026-07-14T10:15:00-04:00'));
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
