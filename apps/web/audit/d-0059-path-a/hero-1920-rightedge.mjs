// Investigate the right-edge gray strip on the 1920x800 hero.
// Capture the full hero + a tight zoom on the rightmost 300px.
import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  timeout: 300000,
  executablePath: 'C:\\Users\\camer\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu-sandbox'],
});
const ctx = await browser.newContext({ viewport: { width: 1920, height: 800 }, reducedMotion: 'no-preference' });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000 });
await page.waitForTimeout(3000);

// Full hero capture
await page.screenshot({ path: 'audit/d-0059-path-a/hero-1920-rev9-y000.png' });

// Right edge zoom
await page.screenshot({ path: 'audit/d-0059-path-a/hero-1920-rightedge.png', clip: { x: 1620, y: 0, width: 300, height: 800 } });

// Sample pixels along the right edge to identify the gray band
const samples = await page.evaluate(() => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    // can't directly screenshot DOM, but we can use a different approach
    // Just resolve with viewport info
    // ctx is intentionally unused; we just need the Promise wrapper to satisfy
    // the linter for the unused-vars rule.
    void ctx;
    resolve({
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    });
  });
});

console.log('viewport:', JSON.stringify(samples));

await browser.close();
