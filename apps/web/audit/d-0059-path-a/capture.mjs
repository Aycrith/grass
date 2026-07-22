// D-0059 Path A capture — verify the ghost-bleed is gone.
// Adapts the D-0050 final-capture script to the new 8-position
// set per D-0059 §2.4 acceptance criterion #1 + #10.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'audit/d-0059-path-a';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--no-sandbox',
  ],
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'no-preference',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000 });
await page.waitForTimeout(2000);

// 8 positions per D-0059 §2.4 acceptance criterion #1.
// These are the 4 ghost-bleed positions from d-0050-final
// (020, 040, 060) PLUS 0/5/30/80/100 for the resting states
// + scroll-band boundaries.
const positions = [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0];
for (const pct of positions) {
  const y = await page.evaluate((pct) => {
    const section = document.querySelector('[data-test-section="hero"]');
    const rect = section.getBoundingClientRect();
    return window.scrollY + rect.top + pct * (rect.height - window.innerHeight);
  }, pct);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(800);
  const pctStr = Math.round(pct * 100).toString().padStart(3, '0');
  await page.screenshot({
    path: path.join(outDir, `hero-y${pctStr}.png`),
    fullPage: false,
  });
  console.log(`captured at ${pct * 100}% → hero-y${pctStr}.png`);
}
await browser.close();
console.log('done — 9 captures written to', outDir);
