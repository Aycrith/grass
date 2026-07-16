/**
 * One-off D-0028 Coverage Check capture via Playwright.
 *
 * Captures the new Coverage Check section in 3 states (idle / hit /
 * miss) at both desktop (1280x900) and mobile (393x851) viewports.
 * Saves PNGs under audit/d0028-{viewport}-{state}.png.
 *
 * Run from apps/web/:
 *   bunx playwright test audit/capture-d0028-playwright.ts --reporter=list
 *
 * The script reuses the existing dev server (port 3000) rather than
 * booting its own — saves 60s of compile time vs the harness's
 * webServer config.
 */
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/audit';

async function dismissMotions(page: Page): Promise<void> {
  // Force-show any FadeUp / ScrollReveal element that hasn't yet
  // been intersected (matches the maskVolatileContent helper in
  // visual/utils/stabilize.ts but inlined for the one-off run).
  await page.addStyleTag({
    content: `
      [style*="opacity: 0"], [style*="opacity:0"] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    `,
  });
}

async function scrollToSection(page: Page): Promise<void> {
  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(
      (h) => h.textContent && h.textContent.includes('Six Pinellas'),
    );
    h2?.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(800);
}

async function shoot(page: Page, name: string): Promise<void> {
  const file = path.join(OUT_DIR, `d0028-${name}.png`);
  // Avoid fullPage on mobile: a 10k+ px tall page blows past
  // Chrome's tile memory budget. We crop to the section
  // instead — the .coverage grid is the only thing the steward
  // needs to review.
  const buf = await page.screenshot({ fullPage: false, timeout: 30_000 });
  fs.writeFileSync(file, buf);
  // biome-ignore lint/suspicious/noConsole: one-off capture script
  console.log(`  saved ${file} (${buf.length.toLocaleString()} bytes)`);
}

async function shootSection(page: Page, name: string): Promise<void> {
  // Locator screenshot of the section only — bounded height, no
  // tile memory blow-up. Best-of-both for mobile captures.
  const section = page.locator('section').filter({ hasText: 'Six Pinellas neighborhoods' });
  const file = path.join(OUT_DIR, `d0028-${name}.png`);
  const buf = await section.screenshot({ timeout: 30_000 });
  fs.writeFileSync(file, buf);
  // biome-ignore lint/suspicious/noConsole: one-off capture script
  console.log(`  saved ${file} (${buf.length.toLocaleString()} bytes)`);
}

async function fillAndSubmit(page: Page, value: string): Promise<void> {
  await page.fill('input[name="coverage"]', value);
  await page.click('button[type="submit"]:has-text("Check coverage")');
  await page.waitForTimeout(600);
}

test.describe('D-0028 Coverage Check capture', () => {
  for (const viewport of ['desktop', 'mobile'] as const) {
    test(`${viewport}`, async ({ page }) => {
      // Set viewport BEFORE navigation.
      if (viewport === 'desktop') {
        await page.setViewportSize({ width: 1280, height: 900 });
      } else {
        await page.setViewportSize({ width: 393, height: 851 });
      }
      // Use the existing dev server on :3000. `domcontentloaded`
      // is more reliable than `networkidle` for the dev server
      // (the Lenis smooth-scroll keeps the network marginally
      // active and networkidle can time out).
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('load');
      await page.waitForTimeout(2500);
      await dismissMotions(page);

      // IDLE
      await scrollToSection(page);
      await shootSection(page, `${viewport}-idle-section`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      if (viewport === 'desktop') await shoot(page, `${viewport}-idle-full`);

      // HIT
      await scrollToSection(page);
      await fillAndSubmit(page, '33771');
      await shootSection(page, `${viewport}-hit-section`);

      // MISS
      await fillAndSubmit(page, '99999');
      await shootSection(page, `${viewport}-miss-section`);

      // Areas open
      await page.evaluate(() => {
        document.querySelector('details')?.setAttribute('open', 'open');
      });
      await page.waitForTimeout(400);
      await shootSection(page, `${viewport}-hit-areas-open`);
    });
  }
});
