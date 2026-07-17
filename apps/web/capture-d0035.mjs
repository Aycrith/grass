/**
 * One-off D-0035 capture. Standalone Playwright script — no test framework.
 * Run with:
 *   cd apps/web
 *   bunx playwright install chromium  # if not already installed
 *   node capture-d0035.mjs
 *
 * Assumes a dev or production server is running on :3000.
 * Captures the ScheduleTimeline section in 3 states:
 *   - idle   (no input)
 *   - hit    (typed 33771, resolver returns the next mow day)
 *   - full   (full-page screenshot so the ledger + resolver + month + week + subscribe all stack)
 * Plus a mobile capture for the same.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/audit';
const URL = 'http://localhost:3000/';

mkdirSync(OUT_DIR, { recursive: true });

async function scrollToSchedule(page) {
  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(
      (h) => h.textContent && h.textContent.includes('Which day the mower shows up'),
    );
    h2?.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(600);
}

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
    await page.waitForTimeout(1000);

    // IDLE: scroll the schedule section into view, capture just that section.
    await scrollToSchedule(page);
    const schedBox = await page.evaluate(() => {
      const el = document.querySelector('[class*="ScheduleTimeline_root"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { y: window.scrollY + r.top, height: r.height };
    });
    if (schedBox) {
      await page.evaluate((y) => window.scrollTo(0, y - 60), schedBox.y);
      await page.waitForTimeout(400);
    }
    await page.screenshot({
      path: join(OUT_DIR, 'd0035-desktop-idle-section.png'),
      fullPage: false,
    });

    // HIT: type a known ZIP and submit, capture the resolved panel.
    await page.evaluate(() => {
      const input = document.querySelector('[class*="ScheduleTimeline_resolverInput"]');
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '33771');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const form = input.closest('form');
      if (form) form.requestSubmit();
    });
    await page.waitForTimeout(800);
    await scrollToSchedule(page);
    await page.screenshot({
      path: join(OUT_DIR, 'd0035-desktop-hit-section.png'),
      fullPage: false,
    });

    // FULL PAGE: so the steward can review the whole section as it sits on the page.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({
      path: join(OUT_DIR, 'd0035-desktop-full.png'),
      fullPage: true,
    });

    await ctx.close();

    // ---- MOBILE 393x851 ----
    const mctx = await browser.newContext({
      viewport: { width: 393, height: 851 },
      deviceScaleFactor: 2.75,
      reducedMotion: 'reduce',
    });
    const mpage = await mctx.newPage();
    await mpage.goto(URL, { waitUntil: 'networkidle' });
    await mpage.waitForTimeout(1000);

    await scrollToSchedule(mpage);
    await mpage.screenshot({
      path: join(OUT_DIR, 'd0035-mobile-idle-section.png'),
      fullPage: false,
    });

    await mctx.close();
  } finally {
    await browser.close();
  }

  console.log('D-0035 captures written to', OUT_DIR);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
