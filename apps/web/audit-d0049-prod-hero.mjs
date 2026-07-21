// D-0049 — capture production hero at all 7 scroll positions
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'apps/web/audit/d-0049-second-scene');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--no-sandbox',
  ],
});

const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});

const page = await ctx.newPage();
page.on('pageerror', (err) => console.error('[pageerror]', err.message));

await page.goto('http://localhost:3005/', { waitUntil: 'networkidle', timeout: 60000 });
// Force a full reload to ensure no cache from previous dev session.
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const positions = [0, 600, 1200, 1700, 1900, 2100, 2500, 2900];
for (const y of positions) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/hero-y${y}.png`, fullPage: false });
  console.log('captured hero-y' + y + '.png');
}

await browser.close();
