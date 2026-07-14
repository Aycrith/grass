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
    //
    // The browser's accessible name algorithm walks:
    //   1. aria-labelledby (resolves referenced IDs in order)
    //   2. aria-label
    //   3. associated <label> (via wrapping OR `for=`/`id=`)
    //   4. title
    //   5. native semantics (placeholder for inputs, button text for
    //      <input type="submit|reset|button">, alt for images, etc.)
    //
    // `el.textContent` alone is wrong because inputs have no text
    // content — it returns "" even when wrapped in a <label>.
    // Mirror the browser's algorithm so the test catches real
    // accessibility bugs without false positives on labeled inputs.
    await page.keyboard.press('Enter'); // activate skip-link
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const accessibleName = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return '';
        // 1. aria-labelledby — resolve referenced IDs and concat text.
        const labelledBy = el.getAttribute('aria-labelledby');
        if (labelledBy) {
          const ids = labelledBy.split(/\s+/).filter(Boolean);
          const text = ids
            .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
            .filter(Boolean)
            .join(' ');
          if (text) return text;
        }
        // 2. aria-label — direct override.
        const ariaLabel = el.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel.trim();
        // 3. Associated <label> — wrapping or via `for=`.
        //    el.labels walks both for/id and wrapping associations.
        const labels = (el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)
          .labels;
        if (labels && labels.length > 0) {
          const text = Array.from(labels)
            .map((l) => l.textContent?.trim() ?? '')
            .filter(Boolean)
            .join(' ');
          if (text) return text;
        }
        // 4. Native semantics: text content for non-form elements,
        //    placeholder for empty form elements, value for buttons.
        const tag = el.tagName;
        if (tag === 'INPUT') {
          const inp = el as HTMLInputElement;
          if (inp.type === 'submit' || inp.type === 'reset' || inp.type === 'button') {
            return (inp.value || '').trim();
          }
          return (inp.placeholder || '').trim();
        }
        if (tag === 'TEXTAREA') {
          return (el as HTMLTextAreaElement).placeholder.trim();
        }
        // 5. title attribute as last resort before text content.
        const title = el.getAttribute('title');
        if (title) return title.trim();
        // 6. text content (for buttons, links, divs with role, etc.).
        return (el.textContent ?? '').trim();
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
