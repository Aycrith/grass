// Zoom capture - 3 different crops to inspect the eyebrow area
import { chromium } from 'playwright';
import path from 'node:path';

const browser = await chromium.launch({
  headless: true,
  timeout: 300000,
  executablePath: 'C:\\Users\\camer\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu-sandbox'],
});
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: 'no-preference',
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000 });
await page.waitForTimeout(2500);

// At y=0, the storybook is fully visible. Capture the eyebrow area.
const box = await page.evaluate(() => {
  const eyebrow = document.querySelector('[class*="eyebrow"]');
  if (!eyebrow) return null;
  const r = eyebrow.getBoundingClientRect();
  return { x: Math.max(0, r.x - 100), y: Math.max(0, r.y - 100), w: r.width + 200, h: r.height + 200 };
});
console.log('zoom box:', box);

// Capture around the eyebrow (this is the STORYBOOK state at y=0).
await page.screenshot({
  path: path.join('audit/d-0059-path-a', 'zoom-storybook-eyebrow.png'),
  clip: { x: box.x, y: box.y, width: box.w, height: box.h },
});
console.log('captured zoom-storybook-eyebrow.png at y=0');

await browser.close();
