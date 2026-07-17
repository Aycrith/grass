import { chromium } from 'playwright-core';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load' });
await page.waitForTimeout(2000);
await page.evaluate(() => {
  const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.includes('Which day the mower shows up'));
  h2?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(600);
await page.evaluate(() => {
  const input = document.querySelector('[class*="ScheduleTimeline_resolverInput"]');
  if (!input) return;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, '33771');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  const form = input.closest('form');
  if (form) form.requestSubmit();
});
await page.waitForTimeout(900);
await page.screenshot({ path: 'C:/Users/camer/DEVNEW/GRASS/audit/d0038-desktop-hit.png', fullPage: false });
await browser.close();
console.log('done');
