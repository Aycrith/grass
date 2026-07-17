/**
 * D-0036 capture. Standalone Playwright script — no test framework.
 * Run with:
 *   cd apps/web
 *   node capture-d0036.mjs
 *
 * Assumes a dev or production server on :3000. Captures the
 * ScheduleTimeline section in 4 states:
 *   - idle   (no input)
 *   - hit    (typed 33771)
 *   - miss   (typed 99999)
 *   - month  (with the "See full month" toggle open)
 * Plus a full-page screenshot and a mobile capture.
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
  await page.waitForTimeout(800);
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
    await page.waitForTimeout(1200);

    // IDLE: scroll the schedule section into view, capture full section.
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
      path: join(OUT_DIR, 'd0036-desktop-idle.png'),
      fullPage: false,
    });

    // HIT: type a known ZIP
    await page.evaluate(() => {
      const input = document.querySelector('[class*="ScheduleTimeline_resolverInput"]');
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '33771');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const form = input.closest('form');
      if (form) form.requestSubmit();
    });
    await page.waitForTimeout(900);
    await scrollToSchedule(page);
    await page.screenshot({
      path: join(OUT_DIR, 'd0036-desktop-hit.png'),
      fullPage: false,
    });

    // Reset and try miss
    await page.evaluate(() => {
      const input = document.querySelector('[class*="ScheduleTimeline_resolverInput"]');
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const input = document.querySelector('[class*="ScheduleTimeline_resolverInput"]');
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '99999');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const form = input.closest('form');
      if (form) form.requestSubmit();
    });
    await page.waitForTimeout(900);
    await scrollToSchedule(page);
    await page.screenshot({
      path: join(OUT_DIR, 'd0036-desktop-miss.png'),
      fullPage: false,
    });

    // Open the month toggle
    await page.evaluate(() => {
      const btn = document.querySelector('[class*="ScheduleTimeline_monthToggle"]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(700);
    await scrollToSchedule(page);
    await page.screenshot({
      path: join(OUT_DIR, 'd0036-desktop-month-open.png'),
      fullPage: false,
    });

    // FULL PAGE
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({
      path: join(OUT_DIR, 'd0036-desktop-full.png'),
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
    await mpage.waitForTimeout(1200);
    await scrollToSchedule(mpage);
    await mpage.screenshot({
      path: join(OUT_DIR, 'd0036-mobile-idle.png'),
      fullPage: false,
    });

    await mctx.close();
  } finally {
    await browser.close();
  }

  console.log('D-0036 captures written to', OUT_DIR);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
