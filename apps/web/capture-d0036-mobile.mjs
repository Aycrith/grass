import { chromium } from 'playwright-core';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 393, height: 851 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.evaluate(() => {
  const h2 = Array.from(document.querySelectorAll('h2')).find(
    (h) => h.textContent && h.textContent.includes('Which day the mower shows up'),
  );
  h2?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'C:/Users/camer/DEVNEW/GRASS/audit/d0036-mobile-1x.png', fullPage: false });
await browser.close();
console.log('done');
