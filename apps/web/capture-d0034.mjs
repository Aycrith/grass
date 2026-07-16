/**
 * D-0034 — per-area pages visual capture.
 *
 * Captures desktop (1280) + mobile (393) of:
 *   - /areas index
 *   - /areas/33771 (home ZIP, "Largo central")
 *   - /areas/33756 (most-different ZIP, "Belleair / Clearwater")
 *   - /areas/33778 (hurricane-prone, "Seminole / Largo West")
 *
 * Plus a per-page wide capture of the painted neighborhood
 * scene alone (zoomed on the hero).
 *
 * Standalone Playwright script — no test framework. Run with:
 *
 *   cd apps/web
 *   bunx playwright install chromium  # if not already installed
 *   node capture-d0034.mjs
 *
 * Assumes a dev or production server is running on :3000
 * (`bun run start` from apps/web/ in another terminal).
 */

import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/audit';
const BASE = 'http://localhost:3000';

// Pages to capture: [slug, page-name-suffix, optional notes]
const PAGES = [
  { path: '/areas', name: 'areas-index', notes: '6-card grid' },
  { path: '/areas/33771', name: 'area-33771', notes: 'home ZIP — central' },
  { path: '/areas/33756', name: 'area-33756', notes: 'coastal / Belleair' },
  { path: '/areas/33778', name: 'area-33778', notes: 'Seminole / hurricane' },
];

mkdirSync(OUT_DIR, { recursive: true });

async function capturePage(browser, viewport, label) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: viewport.width >= 1000 ? 1 : 2.75,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    console.log(`[${label}] ${p.path}`);
    await page.goto(BASE + p.path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    // Full-page capture
    await page.screenshot({
      path: join(OUT_DIR, `d0034-${label}-${p.name}-full.png`),
      fullPage: true,
    });
    // Above-the-fold capture (hero only)
    await page.screenshot({
      path: join(OUT_DIR, `d0034-${label}-${p.name}-fold.png`),
      fullPage: false,
    });
  }
  await ctx.close();
}

async function run() {
  const browser = await chromium.launch();
  try {
    await capturePage(browser, { width: 1280, height: 900 }, 'desktop');
    await capturePage(browser, { width: 393, height: 851 }, 'mobile');
  } finally {
    await browser.close();
  }
  console.log('DONE');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
