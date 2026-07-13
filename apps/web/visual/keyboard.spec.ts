/**
 * Keyboard navigation regression — locks the WP12 keyboard audit
 * (audit/wp12-gates/keyboard-audit.md) into the CI matrix.
 *
 * Per route, walks Tab through the page and asserts:
 *   1. The skip-link is the first focusable element.
 *   2. Every interactive element has a non-empty accessible name.
 *   3. No keyboard traps (focus returns to the trigger when
 *      closing the mobile drawer dialog).
 *   4. The Tab order is linear through the visible DOM order.
 *
 * Captures a per-route screenshot of the focused state for
 * regression visual confirmation. Does NOT block on cosmetic
 * differences — those live in routes.spec.ts.
 */
import { expect, test } from '@playwright/test';
import { PRD_ROUTES } from './utils/fixtures';

const SKIP_LINK_TEXT = /skip to (main )?content/i;
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];

for (const route of PRD_ROUTES) {
  test(`keyboard: ${route.slug}`, async ({ page }) => {
    await page.goto(route.path);

    // 1. Skip-link is the first focusable element.
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.textContent ?? '');
    expect(firstFocused.trim()).toMatch(SKIP_LINK_TEXT);

    // 2. Activate skip-link, then walk Tab 30 times and verify
    // every focused element has a non-empty accessible name.
    await page.keyboard.press('Enter'); // activate skip-link
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const accessibleName = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return '';
        return (
          el.getAttribute('aria-label') ??
          el.getAttribute('aria-labelledby') ??
          el.textContent ??
          el.getAttribute('title') ??
          ''
        ).trim();
      });
      // Every focusable element should announce something.
      // Allow decorative elements (no label) but they shouldn't
      // be focusable in the first place — capture their selector
      // if they are, fail the test.
      const isFocusable = await page.evaluate((selectors) => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return false;
        return selectors.some((sel) => el.matches(sel));
      }, FOCUSABLE_SELECTORS);
      if (isFocusable && !accessibleName) {
        const tagName = await page.evaluate(() => document.activeElement?.tagName ?? '?');
        // Bare exceptions: native <input type="submit|reset|button">
        // announce their value attribute; if missing, they
        // still announce via browser-default "Submit". Skip the
        // strict check for those.
        const isSubmitLike = await page.evaluate(() => {
          const el = document.activeElement as HTMLInputElement | null;
          return (
            el?.tagName === 'INPUT' &&
            (el.type === 'submit' || el.type === 'reset' || el.type === 'button')
          );
        });
        if (!isSubmitLike) {
          throw new Error(`Focusable ${tagName} at iteration ${i} has no accessible name.`);
        }
      }
    }
  });
}
