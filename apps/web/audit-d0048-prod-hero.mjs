// D-0048 — capture production hero at scene 2 fully revealed
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
await page.waitForTimeout(2000);

const positions = [1800, 1900, 2000, 2100, 2200];
for (const y of positions) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/hero-y${y}.png`, fullPage: false });
  console.log('captured hero-y' + y + '.png');
}

await browser.close();
