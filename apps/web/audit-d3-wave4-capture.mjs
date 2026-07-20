// Wave 4 visual capture — 7 scroll positions across the new 350svh hero.
//
// Strategy: playwright-core's chromium.launch() hangs on CDP handshake in
// this Windows env. Bypass it: spawn chromium ourselves with an explicit
// --remote-debugging-port, parse the WS endpoint from chrome's stderr
// output ("DevTools listening on ws://..."), then connect via
// chromium.connectOverCDP over a TCP WebSocket.
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const OUT = 'C:/Users/camer/DEVNEW/GRASS/apps/web/audit/d-wave4-visual';
mkdirSync(OUT, { recursive: true });

const BASE = process.env.BASE || 'http://localhost:3002';
const VIEWPORT = { width: 1440, height: 900 };

const CHROMIUM_PATH = 'C:/Users/camer/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const port = 9400 + Math.floor(Math.random() * 200);
const profileDir = `C:/Users/camer/AppData/Local/Temp/wave4-chrome-${Date.now()}`;

let wsEndpoint = null;
const proc = spawn(
  CHROMIUM_PATH,
  [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    '--no-sandbox',
    '--no-first-run',
    '--disable-extensions',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--mute-audio',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] },
);

proc.stderr.on('data', (d) => {
  const s = d.toString();
  process.stderr.write(`[chrome] ${s}`);
  // Look for the DevTools line in the current chunk — we don't need
  // a rolling buffer since the WS endpoint appears in a single line.
  const m = s.match(/DevTools listening on (ws:\/\/[^\s]+)/);
  if (m && !wsEndpoint) {
    wsEndpoint = m[1];
  }
});
proc.on('exit', (code) => console.log('[chrome exited]', code));

// Wait up to 30s for the WS endpoint to appear in stderr
for (let i = 0; i < 60 && !wsEndpoint; i++) {
  await sleep(500);
}
if (!wsEndpoint) {
  proc.kill();
  throw new Error('chrome DevTools WS endpoint never appeared in stderr');
}
console.log('chrome ready, ws:', wsEndpoint);

// Connect via CDP. Bump the connect timeout because the WS handshake can
// take a few seconds in this env.
const browser = await chromium.connectOverCDP(wsEndpoint, { timeout: 60000 });
console.log('connected to browser');

const ctx = await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'no-preference' });
const page = await ctx.newPage();

page.on('pageerror', (err) => console.error('[pageerror]', err.message));
page.on('requestfailed', (r) =>
  console.error('[requestfailed]', r.url(), r.failure()?.errorText),
);

await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(800);

const heroH = await page.locator('#hero').evaluate(
  (el) => el.getBoundingClientRect().height,
);
console.log('[hero height]', heroH);

const positions = [0.0, 0.15, 0.3, 0.45, 0.6, 0.8, 1.0];
for (const p of positions) {
  const y = heroH * p;
  await page.evaluate(
    (sy) => window.scrollTo({ top: sy, behavior: 'instant' }),
    y,
  );
  await page.waitForTimeout(700);
  const name = `scroll-${Math.round(p * 100)}pct.png`;
  await page.screenshot({ path: `${OUT}/${name}` });
  console.log(`captured ${name}`);
}

await page.evaluate(
  (y) => window.scrollTo({ top: y, behavior: 'instant' }),
  heroH * 0.55,
);
await page.waitForTimeout(800);
const layers = await page.evaluate(() => {
  const ids = ['hero-fern-layer', 'hero-songbirds-layer', 'hero-second-scene'];
  function inspect(el) {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      present: true,
      opacity: cs.opacity,
      visibility: cs.visibility,
      width: cs.width,
      height: cs.height,
      zIndex: cs.zIndex,
    };
  }
  const result = {};
  for (const id of ids) {
    result[id] = inspect(document.querySelector(`[data-testid="${id}"]`));
  }
  const ssc = document.querySelector('[data-testid="hero-second-scene"]');
  if (ssc) {
    const eyebrow = ssc.querySelector('[class*="secondSceneEyebrow"]');
    const headline = ssc.querySelector('[class*="secondSceneHeadline"]');
    const openingMark = ssc.querySelector('[class*="secondSceneOpeningMark"]');
    const italic = ssc.querySelector('[class*="secondSceneHeadlineItalic"]');
    result.secondSceneText = {
      eyebrowText: eyebrow?.textContent ?? null,
      headlineText: headline?.textContent?.trim() ?? null,
      hasOpeningMark: !!openingMark,
      hasItalicSpan: !!italic,
      italicText: italic?.textContent ?? null,
    };
  }
  return result;
});
console.log('[layers@55%]', JSON.stringify(layers, null, 2));

await browser.close();
proc.kill();
console.log('done');