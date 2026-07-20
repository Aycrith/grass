// D-0048 audit — capture /hero-3d-test scene at multiple states.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'apps/web/audit/d-0048-hero3d');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--no-sandbox',
  ],
});

const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});

const page = await ctx.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') console.error('[console.error]', msg.text());
});
page.on('pageerror', (err) => console.error('[pageerror]', err.message));

await page.goto('http://localhost:3002/hero-3d-test', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3500); // let Three.js initialize and texture load

await page.screenshot({ path: `${OUT}/01-default.png`, fullPage: false });
console.log('captured 01-default.png');

// Scrub scrollProgress to 0 (camera orbit 0)
await page.evaluate(() => {
  const slider = document.querySelector('input[type="range"]');
  if (slider) {
    slider.value = '0';
    slider.dispatchEvent(new Event('change', { bubbles: true }));
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/02-scroll-0.png`, fullPage: false });
console.log('captured 02-scroll-0.png');

// Scrub to 0.5
await page.evaluate(() => {
  const slider = document.querySelector('input[type="range"]');
  if (slider) {
    slider.value = '0.5';
    slider.dispatchEvent(new Event('change', { bubbles: true }));
    slider.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/03-scroll-0.5.png`, fullPage: false });
console.log('captured 03-scroll-0.5.png');

// Capture again after 4 more seconds to verify frame cycling
await page.waitForTimeout(4000);
await page.screenshot({ path: `${OUT}/04-cycled.png`, fullPage: false });
console.log('captured 04-cycled.png');

// Check Three.js render state via window.__r3f
const stats = await page.evaluate(() => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return { canvasFound: false };
  return {
    canvasFound: true,
    width: canvas.width,
    height: canvas.height,
    cssWidth: canvas.clientWidth,
    cssHeight: canvas.clientHeight,
    hasWebGL: !!(canvas.getContext('webgl2') || canvas.getContext('webgl')),
    parentClass: canvas.parentElement?.className || null,
    sceneTestId: document.querySelector('[data-testid="hero-second-scene"]') !== null,
  };
});
console.log('canvas stats:', JSON.stringify(stats));

await browser.close();
