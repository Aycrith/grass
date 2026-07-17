/**
 * capture-hero-v2.mjs
 * Captures screenshots of the new HeroFieldTelemetry at /preview/hero-v2.
 * Uses playwright-core (matches the existing capture-d00xx.mjs pattern).
 */
import { chromium } from 'playwright-core';
import { join } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const URL = 'http://localhost:3000/hero-v2';
const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/apps/web/visual';
mkdirSync(OUT_DIR, { recursive: true });

async function capture(viewport, label, scrollPct) {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    if (scrollPct > 0) {
      const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.evaluate(
        ({ pct, h }) => window.scrollTo({ top: h * pct, behavior: 'instant' }),
        { pct: scrollPct, h: totalHeight },
      );
      await page.waitForTimeout(800);
    }
    const path = join(OUT_DIR, `hero-v2-${label}.png`);
    await page.screenshot({ path, fullPage: false });
    console.log(`[ok] ${label} -> ${path}`);
  } finally {
    await browser.close();
  }
}

const shots = [
  { viewport: { width: 1440, height: 900 }, label: 'desktop-top', scrollPct: 0 },
  { viewport: { width: 1440, height: 900 }, label: 'desktop-mid', scrollPct: 0.15 },
  { viewport: { width: 390, height: 844 }, label: 'mobile-top', scrollPct: 0 },
  { viewport: { width: 390, height: 844 }, label: 'mobile-mid', scrollPct: 0.25 },
];

const results = [];
for (const shot of shots) {
  try {
    await capture(shot.viewport, shot.label, shot.scrollPct);
    results.push(`hero-v2-${shot.label}.png`);
  } catch (e) {
    console.error(`[fail] ${shot.label}: ${e.message}`);
  }
}
writeFileSync(join(OUT_DIR, 'hero-v2-manifest.txt'), results.join('\n'));
console.log('done');
