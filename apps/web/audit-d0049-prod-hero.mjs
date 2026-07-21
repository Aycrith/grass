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

// D-0049 rev 4 — try 3005 first, fall back to whatever the dev
// server is on. Skip 3000 (stale dev processes from other repos
// on shared machines). Accept 3001+ (port Next.js auto-falls back
// to when 3000 is busy, which is where the dev server usually
// lands in this workspace).
let connectedPort = null;
for (const port of [3005, 3001, 3002, 3003, 3004, 3006]) {
  try {
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded', timeout: 8000 });
    // Wait for hydration. The first request on a fresh dev
    // server triggers an on-demand compile (10s+), so allow up
    // to 30s for the [data-test-section="hero"] attribute to
    // appear after hydration completes.
    await page.waitForSelector('[data-test-section="hero"]', { timeout: 30000, state: 'attached' });
    connectedPort = port;
    break;
  } catch (e) {
    console.log(`port ${port} did not respond with GRASS hero: ${e.message.split('\n')[0]}`);
  }
}
if (connectedPort === null) {
  throw new Error('Could not connect to a GRASS dev server on any port 3001-3006');
}
console.log('connected on port', connectedPort);
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
