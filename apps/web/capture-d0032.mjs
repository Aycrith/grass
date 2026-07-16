/**
 * D-0032 capture: verify the permissiveness of the Coverage Check.
 * Tests: home ZIP (33771) → known hit; unknown ZIP (90210) → hit
 * with no name; unresolved text (Tampa) → text-state hit.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/audit';
const URL = 'http://localhost:3000/';

mkdirSync(OUT_DIR, { recursive: true });

async function fillAndSubmit(page, value) {
  await page.evaluate((v) => {
    const input = document.querySelector('input[name="coverage"]');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, v);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.closest('form')?.requestSubmit();
    }
  }, value);
  await page.waitForTimeout(800);
}

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

    const scrollJs = `Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.includes('Six Pinellas'))?.scrollIntoView({block: 'start'})`;

    // IDLE
    await page.evaluate(scrollJs);
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(OUT_DIR, 'd0032-desktop-idle.png'), fullPage: false });

    // HIT 1: home ZIP (33771) — known
    await fillAndSubmit(page, '33771');
    await page.screenshot({ path: join(OUT_DIR, 'd0032-desktop-33771-known.png'), fullPage: false });

    // HIT 2: unknown ZIP (90210) — should still be a positive result
    await fillAndSubmit(page, '90210');
    await page.screenshot({ path: join(OUT_DIR, 'd0032-desktop-90210-unknown.png'), fullPage: false });

    // HIT 3: text (Tampa) — unresolved, but positive
    await fillAndSubmit(page, 'Tampa');
    await page.screenshot({ path: join(OUT_DIR, 'd0032-desktop-tampa-text.png'), fullPage: false });

    // INVALID: 1 char
    await fillAndSubmit(page, '3');
    await page.screenshot({ path: join(OUT_DIR, 'd0032-desktop-invalid.png'), fullPage: false });

    // Mobile — just the home ZIP case
    await ctx.close();
    const mctx = await browser.newContext({
      viewport: { width: 393, height: 851 },
      deviceScaleFactor: 2.75,
      reducedMotion: 'reduce',
    });
    const mpage = await mctx.newPage();
    await mpage.goto(URL, { waitUntil: 'networkidle' });
    await mpage.evaluate(scrollJs);
    await mpage.waitForTimeout(600);
    await fillAndSubmit(mpage, '33771');
    await mpage.screenshot({ path: join(OUT_DIR, 'd0032-mobile-33771.png'), fullPage: false });
    await mctx.close();

    console.log('DONE');
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
