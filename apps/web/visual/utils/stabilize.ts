/**
 * Flakiness-killer helpers for Playwright visual regression.
 *
 * Three patterns cover the bulk of the noise sources flagged by
 * `apps/web/visual/README.md` and the Phase 1 Visual audit:
 *
 *   1. `maskVolatileContent(page)` — hide date-rendered text (footer year,
 *      privacy/terms "Last updated") so day-to-day runs diff cleanly.
 *
 *   2. `settleForCapture(page)` — scroll-to-top + wait-for-networkidle +
 *      one rAF tick. The minimum stable state for a top-of-page screenshot.
 *
 *   3. `flushScrollTriggers(page)` — scroll to bottom then back to top.
 *      Forces `useInView` (Framer Motion) to fire on every section below
 *      the fold, so fade-up / stagger / parallax elements have settled
 *      before `toHaveScreenshot` captures them.
 */
import type { Page } from '@playwright/test';

/**
 * Hide date-driven content (footer copyright year, privacy/terms "Last
 * updated" stamp) so baselines stay stable across calendar days.
 *
 * The selectors target any element tagged with `data-visual-mask="date"`
 * OR `data-visual-mask="year"` (the footer copyright span), plus a
 * generic `.last-updated` class for privacy/terms pages.
 */
export async function maskVolatileContent(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      [data-visual-mask="date"],
      [data-visual-mask="year"],
      .last-updated {
        visibility: hidden !important;
      }
      /* Force-show any motion element (FadeUp / StaggerGroup /
       * ScrollReveal) still locked at opacity:0 because useInView
       * hasn't fired by capture time. Without this, baselines look
       * like blank panels for sections whose IO threshold
       * (margin: '-10% 0px') hasn't been met. We force opacity:1
       * and reset transform/transition so the page reflects its
       * fully-revealed state at the moment of capture. */
      [style*="opacity: 0"],
      [style*="opacity:0"] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    `,
  });
}

/**
 * Stabilize the page for a top-of-page screenshot:
 *   - scroll to y=0 (predictable SiteHeader `.scrolled` state)
 *   - wait for `networkidle` (let lazy images finish decoding)
 *   - yield one rAF tick (let any pending paint flush)
 *   - wait 1300ms — long enough for the longest FadeUp cascade
 *     (delay 0.7s + transition 0.4s = 1.1s) plus WordReveal
 *     (~0.9s) to complete so useInView-triggered opacity:0
 *     elements have time to fade in before capture.
 */
export async function settleForCapture(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      }),
  );
  await page.waitForTimeout(1300);
}

/**
 * Scroll the page to bottom, let the network settle, then back to top.
 * Use BEFORE `settleForCapture` so that every `useInView` element below
 * the fold has had a chance to trigger (otherwise fade-up sections render
 * at `opacity:0` for the screenshot).
 */
export async function flushScrollTriggers(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      }),
  );
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}
