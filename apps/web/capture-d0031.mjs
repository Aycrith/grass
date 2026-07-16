/**
 * One-off D-0031 capture. Standalone Playwright script — no test
 * framework, no test discovery. Run with:
 *
 *   cd apps/web
 *   bunx playwright install chromium  # if not already installed
 *   node ../../audit/capture-d0031.mjs
 *
 * Assumes a dev or production server is running on :3000
 * (`bun run start` from apps/web/ in another terminal).
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/audit';
const URL = 'http://localhost:3000/';

mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch();
  try {
    // ---- DESKTOP 1280x900 ----
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });

    // Scroll the Coverage Check into view (h2 contains "Six Pinellas")
    await page.evaluate(() => {
      const h2 = Array.from(document.querySelectorAll('h2')).find((h) =>
        h.textContent && h.textContent.includes('Six Pinellas'),
      );
      h2?.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);

    // IDLE
    await page.screenshot({
      path: join(OUT_DIR, 'd0031-desktop-idle-section.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: join(OUT_DIR, 'd0031-desktop-idle-full.png'),
      fullPage: true,
    });

    // HIT (33771)
    await page.evaluate(() => {
      const input = document.querySelector('input[name="coverage"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '33771');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.closest('form')?.requestSubmit();
      }
    });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: join(OUT_DIR, 'd0031-desktop-hit-section.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: join(OUT_DIR, 'd0031-desktop-hit-full.png'),
      fullPage: true,
    });

    // MISS (99999)
    await page.evaluate(() => {
      const input = document.querySelector('input[name="coverage"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '99999');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.closest('form')?.requestSubmit();
      }
    });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: join(OUT_DIR, 'd0031-desktop-miss-section.png'),
      fullPage: false,
    });

    // Areas details open
    await page.evaluate(() => {
      const d = document.querySelector('details');
      if (d) d.setAttribute('open', 'open');
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(OUT_DIR, 'd0031-desktop-areas-open.png'),
      fullPage: false,
    });

    await ctx.close();

    // ---- MOBILE 393x851 (Pixel 5 @ 2.75x) ----
    const mctx = await browser.newContext({
      viewport: { width: 393, height: 851 },
      deviceScaleFactor: 2.75,
      reducedMotion: 'reduce',
    });
    const mpage = await mctx.newPage();
    await mpage.goto(URL, { waitUntil: 'networkidle' });

    await mpage.evaluate(() => {
      const h2 = Array.from(document.querySelectorAll('h2')).find((h) =>
        h.textContent && h.textContent.includes('Six Pinellas'),
      );
      h2?.scrollIntoView({ block: 'start' });
    });
    await mpage.waitForTimeout(800);

    await mpage.screenshot({
      path: join(OUT_DIR, 'd0031-mobile-idle-section.png'),
      fullPage: false,
    });
    await mpage.screenshot({
      path: join(OUT_DIR, 'd0031-mobile-idle-full.png'),
      fullPage: true,
    });

    await mpage.evaluate(() => {
      const input = document.querySelector('input[name="coverage"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '33771');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.closest('form')?.requestSubmit();
      }
    });
    await mpage.waitForTimeout(800);
    await mpage.screenshot({
      path: join(OUT_DIR, 'd0031-mobile-hit-section.png'),
      fullPage: false,
    });

    console.log('DONE');
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
