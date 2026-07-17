/**
 * D-0037 capture — sticky conversion rail states.
 * Captures: hero in view (rail hidden), mid-page (rail visible),
 * final-cta in view (rail hidden again).
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/audit';
const URL = 'http://localhost:3000/';

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // State 1: hero in view, rail hidden
  await page.screenshot({
    path: join(OUT_DIR, 'd0037-desktop-hero.png'),
    fullPage: false,
  });

  // State 2: mid-page, rail visible. Scroll to about 1500px (past hero, before final CTA).
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(OUT_DIR, 'd0037-desktop-mid.png'),
    fullPage: false,
  });

  // State 3: schedule section in view, rail visible
  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(
      (h) => h.textContent && h.textContent.includes('Which day the mower shows up'),
    );
    h2?.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(OUT_DIR, 'd0037-desktop-schedule.png'),
    fullPage: false,
  });

  // State 4: final CTA in view, rail hidden
  await page.evaluate(() => {
    const el = document.getElementById('final-cta');
    el?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(OUT_DIR, 'd0037-desktop-final-cta.png'),
    fullPage: false,
  });

  await ctx.close();

  // Mobile
  const mctx = await browser.newContext({
    viewport: { width: 393, height: 851 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const mpage = await mctx.newPage();
  await mpage.goto(URL, { waitUntil: 'load' });
  await mpage.waitForTimeout(2000);
  await mpage.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(
      (h) => h.textContent && h.textContent.includes('Which day the mower shows up'),
    );
    h2?.scrollIntoView({ block: 'start' });
  });
  await mpage.waitForTimeout(800);
  await mpage.screenshot({
    path: join(OUT_DIR, 'd0037-mobile-schedule.png'),
    fullPage: false,
  });
  await mctx.close();
} finally {
  await browser.close();
}
console.log('D-0037 captures written to', OUT_DIR);
