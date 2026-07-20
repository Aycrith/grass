/**
 * audit-hero-diagnostic.mjs - Hero diagnostic capture
 *
 * Captures the hero at 5 scroll positions + 1 debug variant and writes
 * DOM snapshots + console logs to apps/web/audit/d-hero-diagnostic/.
 *
 * Used for the "new content missing from hero" audit (see plan file
 * C:\Users\camer\.claude\plans\develop-a-comprehensive-plan-precious-gizmo.md).
 *
 * Prereq: dev server running on :3000.
 */
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'C:/Users/camer/DEVNEW/GRASS/apps/web/audit/d-hero-diagnostic';
mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORT = { width: 1440, height: 900 };

// Browser context — desktop, prefers-reduced-motion: no-preference so the
// scroll-driven cross-fade actually runs (the production component
// collapses to 100svh on reduced-motion).
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});

const page = await ctx.newPage();

// Collect console output for analysis
const consoleLines = [];
page.on('console', (msg) => {
  consoleLines.push(`[${msg.type()}] ${msg.text()}`);
});
const pageErrors = [];
page.on('pageerror', (err) => {
  pageErrors.push(`[pageerror] ${err.message}\n${err.stack}`);
});

console.log('Loading /...');
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });
// Give the headline word-reveal a moment to settle
await page.waitForTimeout(2000);

// Hero height is 200svh = 1800px in this viewport, so scroll positions are
// 0, 450, 900, 1350, 1800 relative to top of hero. Scroll to absolute Y
// from document top by adding the hero's offsetTop.
async function captureAtScroll(label, scrollY) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
  // Wait for the spring-smoothed scroll to settle (stiffness 70 damping 22
  // means ~500ms for a big jump, ~250ms for a small one).
  await page.waitForTimeout(700);
  const pngPath = join(OUT_DIR, `${label}.png`);
  await page.screenshot({ path: pngPath, fullPage: false });

  // Snapshot the hero DOM so we can verify what's mounted + visible
  const heroOuterHtml = await page.evaluate(() => {
    const hero = document.querySelector('#hero');
    if (!hero) return null;
    // Compact the HTML by stripping long style attrs; just dump the structure
    const layers = {
      root: !!hero,
      photoWrap: !!hero.querySelector('[class*="photoWrap"]'),
      photoImg: !!hero.querySelector('img'),
      greenVignette: !!hero.querySelector('[class*="greenVignette"]'),
      scrim: !!hero.querySelector('[class*="scrim"]'),
      storybookWrap: !!hero.querySelector('[class*="storybookWrap"]'),
      storybookMounted: !!hero.querySelector('[data-testid="hero-storybook"]'),
      grassSilhouette: !!hero.querySelector('[class*="grassSilhouette"]'),
      content: !!hero.querySelector('[class*="content"]'),
      eyebrow: !!hero.querySelector('[class*="eyebrow"]'),
      headline: !!hero.querySelector('[class*="headline"]'),
      subhead: !!hero.querySelector('[class*="subhead"]'),
      actions: !!hero.querySelector('[class*="actions"]'),
      liveStatus: !!hero.querySelector('[class*="liveStatus"]'),
      stamp: !!hero.querySelector('[class*="stamp"]'),
      telemetry: !!hero.querySelector('[class*="telemetry"]'),
      telemetryItems: hero.querySelectorAll('[class*="telemetryItem"]').length,
      debugBanner: !!hero.querySelector('[class*="debugBanner"]'),
      debugStyle: !!hero.querySelector('style'),
      sectionHeight: hero.getBoundingClientRect().height,
    };
    // Compute effective visibility: getComputedStyle().display !== 'none' &&
    // computed opacity > 0.05
    function vis(sel) {
      const el = hero.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        display: cs.display,
        opacity: cs.opacity,
        visibility: cs.visibility,
        effectiveOpacity: parseFloat(cs.opacity) > 0.05 && cs.display !== 'none',
      };
    }
    return {
      scrollY: window.scrollY,
      sectionTop: hero.getBoundingClientRect().top,
      layers,
      greenVignetteVis: vis('[class*="greenVignette"]'),
      grassSilhouetteVis: vis('[class*="grassSilhouette"]'),
      storybookVis: vis('[class*="storybookWrap"]'),
      liveStatusVis: vis('[class*="liveStatus"]'),
      telemetryVis: vis('[class*="telemetry"]'),
      stampVis: vis('[class*="stamp"]'),
      photoVis: vis('[class*="photo"]'),
    };
  });

  const jsonPath = join(OUT_DIR, `${label}.dom.json`);
  writeFileSync(jsonPath, JSON.stringify(heroOuterHtml, null, 2));
  console.log(`captured ${label} -> ${pngPath}`);
}

console.log('Capturing 5 hero scroll positions...');
const heroTop = await page.evaluate(() => {
  const hero = document.querySelector('#hero');
  return hero ? hero.getBoundingClientRect().top + window.scrollY : 0;
});
console.log(`hero starts at scrollY=${heroTop}, totalHeight=${VIEWPORT.height * 2}`);

// 0% — at the very top of the hero
await captureAtScroll('scroll-00pct', heroTop);
// 25% — 25% through the 200svh pinned section (450px)
await captureAtScroll('scroll-25pct', heroTop + VIEWPORT.height * 0.5);
// 50% — half-way (900px)
await captureAtScroll('scroll-50pct', heroTop + VIEWPORT.height * 1.0);
// 75% — late (1350px)
await captureAtScroll('scroll-75pct', heroTop + VIEWPORT.height * 1.5);
// 100% — past the hero, right at the section divider
await captureAtScroll('scroll-100pct', heroTop + VIEWPORT.height * 2.0);

// Debug variant: load ?debug=show-additive at scroll 0 to verify all
// additive layers are mathematically present
console.log('Capturing ?debug=show-additive at scroll 0...');
await page.goto('http://localhost:3000/?debug=show-additive', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
await captureAtScroll('scroll-debug-additive', 0);

// Write console + error logs
writeFileSync(join(OUT_DIR, 'console.log'), consoleLines.join('\n'));
writeFileSync(join(OUT_DIR, 'errors.log'), pageErrors.join('\n---\n'));

await browser.close();
console.log(`done. ${consoleLines.length} console lines, ${pageErrors.length} errors.`);
console.log(`output: ${OUT_DIR}`);
