// Full-page visual survey capture for D-0059 rev4 polish pass.
// Walks through every section of the landing page, takes a
// full-bleed screenshot of each, and writes them to
// audit/d-0059-path-a/sections/. Used to inventory visual
// coherence issues across the entire page, not just the hero.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = 'audit/d-0059-path-a/sections';
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

// Discover every section by data-test-section attribute.
const sectionIds = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('[data-test-section]'));
  return els.map((el) => ({
    id: el.getAttribute('data-test-section'),
    top: el.getBoundingClientRect().top + window.scrollY,
    height: el.getBoundingClientRect().height,
  }));
});
console.log(`discovered ${sectionIds.length} sections:`);
for (const s of sectionIds) {
  console.log(`  - ${s.id} (top=${Math.round(s.top)}, height=${Math.round(s.height)})`);
}

// Take a screenshot of each section, scrolled to its top, and
// capture viewport-height (800px) of content. The first 800px of
// each section is usually the most diagnostic — the eyebrow,
// headline, and first row of content.
let captured = 0;
for (const s of sectionIds) {
  await page.evaluate((y) => window.scrollTo(0, y), s.top);
  await page.waitForTimeout(800);
  try {
    await page.screenshot({
      path: path.join(outDir, `${s.id}.png`),
      fullPage: false,
      timeout: 60000,
    });
    console.log(`captured ${s.id} -> ${s.id}.png`);
    captured++;
  } catch (e) {
    console.log(`FAILED ${s.id}: ${e.message}`);
  }
}

await browser.close();
console.log(`done — ${captured}/${sectionIds.length} section captures written to ${outDir}`);
