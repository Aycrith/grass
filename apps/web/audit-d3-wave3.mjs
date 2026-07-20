// Wave 3 visual verification capture
// Run: bun audit-d3-wave3.mjs
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = 'C:/Users/camer/DEVNEW/GRASS/apps/web/audit/d-wave3-visual';
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3001';
const VIEWPORT = { width: 1440, height: 900 };

async function go() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'], timeout: 60000 });
  const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();

  page.on('pageerror', (err) => console.error('[pageerror]', err.message));
  page.on('console', (msg) => console.log('[' + msg.type() + ']', msg.text()));
  page.on('requestfailed', (r) => console.error('[requestfailed]', r.url(), r.failure()?.errorText));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Capture scroll 0
  await page.screenshot({ path: `${OUT}/scroll-0pct.png` });

  // Scroll to 50% of hero (storybook mid-cross-fade)
  const heroH = await page.locator('#hero').evaluate((el) => el.getBoundingClientRect().height);
  console.log('[hero height]', heroH);
  const half = heroH * 0.5;
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), half);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/scroll-50pct.png` });

  // Scroll to 100% (resting state)
  const full = heroH * 0.95;
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), full);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/scroll-95pct.png` });

  // Layer visibility diagnostic
  const layers = await page.evaluate(() => {
    const fern = document.querySelector('[data-testid="hero-fern-layer"]');
    const songbirds = document.querySelector('[data-testid="hero-songbirds-layer"]');
    function inspect(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        present: true,
        display: cs.display,
        opacity: cs.opacity,
        visibility: cs.visibility,
        width: cs.width,
        height: cs.height,
        mixBlendMode: cs.mixBlendMode,
        zIndex: cs.zIndex,
        children: el.children.length,
      };
    }
    return { fern: inspect(fern), songbirds: inspect(songbirds) };
  });
  console.log('[layers]', JSON.stringify(layers, null, 2));

  await browser.close();
}

go().catch((e) => { console.error(e); process.exit(1); });
