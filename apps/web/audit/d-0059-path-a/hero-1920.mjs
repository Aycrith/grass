// Capture hero at 1920x800 (the user's viewport) to verify
// the rev6 fixes (sun artistic rework + wildflowers removal +
// palm repositioning) work at wider viewports.
import { chromium } from 'playwright';
import path from 'node:path';

const browser = await chromium.launch({
  headless: true,
  timeout: 300000,
  executablePath: 'C:\\Users\\camer\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu-sandbox'],
});
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 800 },
  reducedMotion: 'no-preference',
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000 });
await page.waitForTimeout(3000);

// Capture at y=0 (storybook resting state)
await page.screenshot({
  path: path.join('audit/d-0059-path-a', 'hero-1920-y000.png'),
  fullPage: false,
});
console.log('captured hero-1920-y000.png');

await browser.close();
