/**
 * D-0035 resolver state capture.
 */
import { chromium } from 'playwright-core';

const URL = 'http://localhost:3000/';
const OUT = 'C:/Users/camer/DEVNEW/GRASS/audit';

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(
      (h) => h.textContent && h.textContent.includes('Which day the mower shows up'),
    );
    h2?.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(600);

  // Type neighborhood name "Largo"
  await page.evaluate(() => {
    const input = document.querySelector('[class*="ScheduleTimeline_resolverInput"]');
    if (!input) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'Largo');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const form = input.closest('form');
    if (form) form.requestSubmit();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/d0035-desktop-resolver-largo.png`, fullPage: false });

  // Miss case: 99999
  await page.evaluate(() => {
    const input = document.querySelector('[class*="ScheduleTimeline_resolverInput"]');
    if (!input) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, '99999');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const form = input.closest('form');
    if (form) form.requestSubmit();
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/d0035-desktop-resolver-miss.png`, fullPage: false });

  await ctx.close();
} finally {
  await browser.close();
}
console.log('done');
