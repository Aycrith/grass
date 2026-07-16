/**
 * D-0033 capture: verify the homepage after the /areas removal.
 * Confirms: (1) no Service Areas nav link; (2) no chip strip
 * below the form; (3) 33771 still works through Coverage Check;
 * (4) /areas/* returns 404.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/audit';
const URL = 'http://localhost:3000/';

mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });

    // Top of page: verify nav no longer has "Service Areas" link
    const navItems = await page.$$eval('nav a, header a', (as) =>
      as.map((a) => a.textContent?.trim()).filter(Boolean),
    );
    console.log('Nav items:', navItems);

    const scrollJs = `Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.includes('Six Pinellas'))?.scrollIntoView({block: 'start'})`;

    // Idle section
    await page.evaluate(scrollJs);
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(OUT_DIR, 'd0033-desktop-idle.png'), fullPage: false });

    // HIT 33771
    await page.evaluate(() => {
      const input = document.querySelector('input[name="coverage"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, '33771');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.closest('form')?.requestSubmit();
      }
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT_DIR, 'd0033-desktop-hit-33771.png'), fullPage: false });

    // Full page
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(OUT_DIR, 'd0033-desktop-fullpage.png'), fullPage: true });

    // /areas/33771 should 404
    const res404 = await page.goto('http://localhost:3000/areas/33771', { waitUntil: 'domcontentloaded' });
    console.log('/areas/33771 status:', res404?.status());

    // /areas should 404 too
    const res404idx = await page.goto('http://localhost:3000/areas', { waitUntil: 'domcontentloaded' });
    console.log('/areas status:', res404idx?.status());

    // /quote?zip=33771 (the new calloutHref target) should 200
    const resQuote = await page.goto('http://localhost:3000/quote?zip=33771', { waitUntil: 'domcontentloaded' });
    console.log('/quote?zip=33771 status:', resQuote?.status());

    // Footer capture (no ZIP pills, no "See full service area" link)
    const ctx2 = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const p2 = await ctx2.newPage();
    await p2.goto(URL, { waitUntil: 'networkidle' });
    await p2.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p2.waitForTimeout(500);
    await p2.screenshot({ path: join(OUT_DIR, 'd0033-desktop-footer.png'), fullPage: false });

    await ctx.close();
    await ctx2.close();
    console.log('DONE');
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
