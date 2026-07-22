// D-0059 Path A capture — verify the cross-fade is clean.
// Adapts the D-0050 final-capture script to the new 9-position
// set per D-0059 §2.4 acceptance criterion #1 + #10.
// D-0059 rev3: tightened cross-fade window [0.10, 0.25] (was
// [0.10, 0.40]) and dropped paper-grain. Re-run after the rev3
// changes land to confirm y=0.20 no longer shows the cartoon
// ranch houses / palms / sun as visible ghosts on the photo.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'audit/d-0059-path-a';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  timeout: 300000,
  executablePath: 'C:\\Users\\camer\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu-sandbox',
  ],
});
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: 'no-preference',
  deviceScaleFactor: 1,
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
  await page.waitForTimeout(1200);
  const pctStr = Math.round(pct * 100).toString().padStart(3, '0');
  try {
    await page.screenshot({
      path: path.join(outDir, `hero-y${pctStr}.png`),
      fullPage: false,
      timeout: 60000,
    });
    console.log(`captured at ${pct * 100}% → hero-y${pctStr}.png`);
  } catch (e) {
    console.log(`FAILED at ${pct * 100}%: ${e.message}`);
  }
}
await browser.close();
console.log('done — 9 captures written to', outDir);
