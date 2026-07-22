// Sample actual pixel colors at specific points along the right
// edge of the hero to identify the gray strip source.
import { chromium } from 'playwright';
import fs from 'node:fs';

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

// Use html2canvas approach via a canvas overlay
const result = await page.evaluate(async () => {
  // Use the browser's built-in screenshot via canvas (limited but works for testing)
  // Actually, use a different approach: render the page to a canvas via foreignObject
  // Simpler: take a series of element screenshots
  const points = [
    { x: 1700, y: 400, label: 'far-left of right area' },
    { x: 1800, y: 400, label: 'just before right palm' },
    { x: 1850, y: 400, label: 'right palm area' },
    { x: 1880, y: 400, label: 'right of right palm' },
    { x: 1900, y: 400, label: 'near hero right edge' },
    { x: 1910, y: 400, label: 'past hero right edge' },
    { x: 1850, y: 100, label: 'sky area' },
    { x: 1850, y: 700, label: 'grass area' },
  ];

  const results = [];
  for (const p of points) {
    const el = document.elementFromPoint(p.x, p.y);
    results.push({
      ...p,
      elTag: el ? el.tagName : 'none',
      elClass: el ? (el.className.baseVal || el.className || '').toString().substring(0, 80) : 'none',
    });
  }
  return results;
});

console.log(JSON.stringify(result, null, 2));

// Also capture a labeled annotation screenshot
await page.screenshot({ path: 'audit/d-0059-path-a/rightedge-annotation.png', clip: { x: 1700, y: 0, width: 220, height: 800 } });

await browser.close();
