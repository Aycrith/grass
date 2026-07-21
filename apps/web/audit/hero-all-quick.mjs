// Quick capture script for all 8 hero scroll positions
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve(process.cwd(), 'apps/web/audit/d-0049-second-scene');
mkdirSync(OUT, { recursive: true });

const PORT = 3001;

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});

const page = await ctx.newPage();
page.on('pageerror', (err) => console.error('[pageerror]', err.message));

await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load', timeout: 60000 });
await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000 });
await page.waitForTimeout(2000);

const positions = [0, 600, 1200, 1700, 1900, 2100, 2500, 2900];
for (const y of positions) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/hero-y${y}.png`, fullPage: false });
  console.log('captured hero-y' + y + '.png');
}

await browser.close();
