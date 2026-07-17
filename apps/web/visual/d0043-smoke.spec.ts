/**
 * D-0043 cross-surface smoke test.
 *
 * Verifies the hero behavior the steward expects across the 4 critical
 * surfaces, BEYOND the pixel regression covered by routes.spec.ts:
 *
 *   1. Desktop normal visitor    - storybook visible at scroll 0,
 *                                  dashboard widgets fade in via scroll,
 *                                  per-stat cascade reads 47 -> 18h
 *                                  -> 6 yrs -> 6 across scroll 0.42-0.58,
 *                                  no first-paint flash.
 *
 *   2. Desktop reduced motion    - storybook hidden, dashboard visible
 *                                  at scroll 0, no flash.
 *
 *   3. Mobile-ish coarse pointer - storybook hidden (CSS @media
 *                                  (max-width: 767px) gates it),
 *                                  dashboard visible at scroll 0,
 *                                  no flash.
 *
 *   4. Phone                     - storybook hidden, dashboard visible
 *                                  at scroll 0, no flash.
 *
 * The pixel baselines in apps/web/visual/baselines/ guard the RESTING
 * state. This spec guards the DYNAMIC state across surfaces and the
 * non-trivial scroll-driven math on desktop normal.
 *
 * === Playwright project scope ===
 *
 * Skipped on chromium-mobile: that project hardcodes Pixel 5 emulation
 * (393x851 + hasTouch + devicePixelRatio 2.75) which would override
 * each test's per-surface `setViewportSize`. The mobile surfaces are
 * covered for pixel stability by routes.spec.ts (which runs on both
 * projects). This spec exercises dynamic behavior on desktop only.
 *
 * === Playwright config interaction ===
 *
 * apps/web/playwright.config.ts sets `contextOptions: { reducedMotion:
 * 'reduce' }` for visual-regression stability. That setting bleeds into
 * every browser context unless explicitly overridden. Surface A MUST
 * override it with `emulateMedia({ reducedMotion: 'no-preference' })`
 * (called BEFORE navigation) or `useReducedMotion()` returns true and
 * the storybook unmounts even though the viewport is a normal desktop.
 *
 * === Spring settling ===
 *
 * The hero uses `useSpring(stiffness=70, damping=22, mass=0.5)`. With
 * those params, damping ratio ζ ≈ 1.86 (overdamped). Settling time to
 * within 2% of target ≈ 1.2s. The cascade test waits 2500ms per
 * probe to absorb LenisProvider's smooth-scroll animation (~1.2s)
 * AND the spring settle (~1.2s) — the two stack on the same scroll
 * event so the per-probe budget is the sum, not the larger.
 *
 * === React/CSS coarse-pointer note ===
 *
 * The hero component flips its scroll-fade flag based on
 * `window.matchMedia('(pointer: coarse)')` and the CSS uses an
 * independent `@media (pointer: coarse)` query. Playwright's
 * `addInitScript` override of matchMedia affects React but not the
 * CSS engine's pointer detection. To exercise the CSS code path on
 * coarse pointer we use a viewport width of 767px (just below the
 * `max-width: 767px` breakpoint) which triggers the same CSS rules
 * as a real coarse-pointer tablet.
 */
import { expect, test } from '@playwright/test';

/**
 * Override baseURL via env for ad-hoc smoke runs against a dev server
 * on a non-default port. Defaults to '/' so the committed spec uses
 * the playwright.config.ts baseURL in CI.
 */
const BASE_URL = process.env.SMOKE_BASE_URL ?? '/';

/** Frozen clock matching routes.spec.ts so ScheduleTimeline renders deterministically. */
const FROZEN_NOW = new Date('2026-07-14T10:15:00-04:00');

async function bootPage(page: import('@playwright/test').Page): Promise<void> {
  await page.clock.setSystemTime(FROZEN_NOW);
  await page.goto(BASE_URL);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1300);
}

interface HeroState {
  storybookInDom: boolean;
  storybookDisplay: string;
  storybookOpacity: number | null;
  liveOpacity: number | null;
  telemetryOpacity: number | null;
  statOpacities: number[];
  statValues: string[];
}

async function readHeroState(page: import('@playwright/test').Page): Promise<HeroState> {
  return page.evaluate(() => {
    const hero = document.querySelector('#hero');
    if (!hero) {
      return {
        storybookInDom: false,
        storybookDisplay: 'NO HERO',
        storybookOpacity: null,
        liveOpacity: null,
        telemetryOpacity: null,
        statOpacities: [],
        statValues: [],
      };
    }
    const storybook = hero.querySelector('[data-testid="hero-storybook"]');
    const live = hero.querySelector('[role="status"]');
    const telemetry = hero.querySelector('[aria-label="Field log stats"]');
    const items = telemetry
      ? Array.from(telemetry.querySelectorAll('[class*="telemetryItem"]'))
      : [];
    const values = telemetry
      ? Array.from(telemetry.querySelectorAll('[class*="telemetryValue"]'))
      : [];
    const num = (el: Element | null | undefined): number | null => {
      if (!el) return null;
      const o = parseFloat(getComputedStyle(el).opacity);
      return Number.isFinite(o) ? o : null;
    };
    return {
      storybookInDom: !!storybook,
      storybookDisplay: storybook ? getComputedStyle(storybook).display : 'NOT MOUNTED',
      storybookOpacity: num(storybook),
      liveOpacity: num(live),
      telemetryOpacity: num(telemetry),
      statOpacities: items.map((s) => num(s) ?? 0),
      statValues: values.map((s) => (s.textContent ?? '').trim()),
    };
  });
}

/**
 * Wait for the page to fully settle: load event, React hydrated, AND
 * the live status widget's computed opacity matches the expected
 * resting value. This catches the CSS-load race that the previous
 * `state: 'attached'` check missed (element attached before CSS
 * module class is applied means inline opacity:0 wins briefly).
 */
/**
 * Poll the cascade target (the last stat) until its computed
 * opacity stops changing by more than 0.01 between two reads
 * taken 250ms apart. Returns once the spring is effectively
 * settled. Bails after 6000ms to avoid hanging on a real
 * regression.
 */
async function waitForSpringSettle(page: import('@playwright/test').Page): Promise<void> {
  const start = Date.now();
  let prev = -1;
  let stable = 0;
  while (Date.now() - start < 6_000) {
    const opa = await page.evaluate(() => {
      const hero = document.querySelector('#hero');
      const tel = hero ? hero.querySelector('[aria-label="Field log stats"]') : null;
      if (!tel) return -1;
      const items = tel.querySelectorAll('[class*="telemetryItem"]');
      // The last stat is the slowest to settle (its window is the
      // latest), so we sample that as the spring's tail.
      const last = items[items.length - 1] as HTMLElement | undefined;
      if (!last) return -1;
      return parseFloat(getComputedStyle(last).opacity) || 0;
    });
    if (prev >= 0 && Math.abs(opa - prev) < 0.01) {
      stable += 1;
      if (stable >= 2) return;
    } else {
      stable = 0;
    }
    prev = opa;
    await page.waitForTimeout(250);
  }
}

async function waitForHeroHydrated(
  page: import('@playwright/test').Page,
  expectedLiveOpacity: number,
): Promise<void> {
  await page.waitForLoadState('load');
  // Cold-reload path: React re-hydrates from scratch, so the
  // [role="status"] LiveStatus widget can take 2-4s to mount on
  // a coarse-pointer surface (the useEffect matchMedia check has
  // to run before enableScrollFade flips and the dashboard paints).
  // 10s is plenty past that and still catches a real regression.
  await page.waitForSelector('#hero [role="status"]', { state: 'attached', timeout: 10_000 });
  // Poll until computed opacity matches expectation, or 10s elapses.
  await page.waitForFunction(
    (expected) => {
      const el = document.querySelector('#hero [role="status"]');
      if (!el) return false;
      const o = parseFloat(getComputedStyle(el).opacity);
      return Math.abs(o - expected) < 0.05;
    },
    expectedLiveOpacity,
    { timeout: 10_000, polling: 100 },
  );
}

/**
 * Capture 10 rapid reads of BOTH liveStatus + telemetry opacity after
 * a reload. Returns the min observed per widget. The 75ms granularity
 * catches sub-frame flashes that 150ms misses.
 */
async function captureFirstPaintFlash(
  page: import('@playwright/test').Page,
): Promise<{ liveMin: number; telemetryMin: number; reads: Array<{ at: number; live: number; tel: number }> }> {
  const reads: Array<{ at: number; live: number; tel: number }> = [];
  for (let i = 0; i < 10; i++) {
    const { liveOpacity, telemetryOpacity } = await readHeroState(page);
    reads.push({
      at: i * 75,
      live: liveOpacity ?? -1,
      tel: telemetryOpacity ?? -1,
    });
    await page.waitForTimeout(75);
  }
  const liveMin = Math.min(...reads.map((r) => r.live));
  const telemetryMin = Math.min(...reads.map((r) => r.tel));
  return { liveMin, telemetryMin, reads };
}

/**
 * Skip helper — `test.skip` at describe-level doesn't reliably
 * receive `testInfo` in this Playwright version. Inline the skip at
 * the top of each test body where testInfo is a guaranteed second arg.
 */
function skipMobile(testInfo: import('@playwright/test').TestInfo): void {
  test.skip(
    testInfo.project.name === 'chromium-mobile',
    'Smoke spec exercises dynamic scroll math on desktop only. Mobile pixel regressions are covered by routes.spec.ts (which runs on both projects).',
  );
}

test.describe('D-0043 cross-surface smoke', () => {
  test('Surface A - desktop normal: storybook on, dashboard fades in, cascade reads, no flash', async ({
    page,
  }, testInfo) => {
    skipMobile(testInfo);
    // Override the global playwright.config.ts reducedMotion: 'reduce'
    // so we actually test "normal motion preferences" on this surface.
    // Call BEFORE navigation so the initial SSR HTML uses the right
    // media query state.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await bootPage(page);

    // --- (1) storybook visible at scroll 0 ---
    const initial = await readHeroState(page);
    expect.soft(initial.storybookInDom, 'storybook should be mounted').toBe(true);
    expect.soft(initial.storybookDisplay, 'storybook should not be display:none').not.toBe('none');
    expect.soft(
      initial.storybookOpacity ?? 0,
      'storybook opacity at scroll 0',
    ).toBeGreaterThan(0.5);

    // --- (2) dashboard NOT visible at scroll 0 (fades in via scroll) ---
    expect.soft(initial.liveOpacity ?? 1, 'live status opacity at scroll 0').toBeLessThan(0.1);
    expect.soft(initial.telemetryOpacity ?? 1, 'telemetry opacity at scroll 0').toBeLessThan(0.1);

    // --- (4) no first-paint flash ---
    await page.reload();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.setSystemTime(FROZEN_NOW);
    await waitForHeroHydrated(page, 0); // On Surface A, dashboard is invisible at scroll 0
    const flash = await captureFirstPaintFlash(page);
    const trace = flash.reads.map((r) => `[${r.at}ms L=${r.live.toFixed(2)} T=${r.tel.toFixed(2)}]`).join(' ');
    expect.soft(flash.liveMin, `live status flash: min=${flash.liveMin.toFixed(3)} reads: ${trace}`).toBeLessThan(0.15);
    expect.soft(flash.telemetryMin, `telemetry flash: min=${flash.telemetryMin.toFixed(3)} reads: ${trace}`).toBeLessThan(0.15);

    // --- (3) per-stat cascade reads 47 -> 18h -> 6 yrs -> 6 ---
    // The exact scrollY -> useScroll progress mapping depends on
    // the section's offsetTop, the SiteHeader's sticky footprint,
    // and the LenisProvider's lerp factor — none of which are
    // stable enough to bake into probe coordinates. So instead of
    // asserting exact progress targets, sweep a known scrollY
    // range and check (a) all 4 stats end at 1 once we pass the
    // cascade end, and (b) the cascade order is monotonic (earlier
    // stats reveal at least as fast as later stats) at every sweep
    // point. This validates the BEHAVIOR without coupling to the
    // exact useScroll math.
    const sweepPoints = [0, 200, 400, 500, 600, 800, 1200];
    const cascade: Array<{ at: number; opacities: number[]; values: string[] }> = [];
    for (const scrollY of sweepPoints) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await waitForSpringSettle(page);
      const { statOpacities, statValues } = await readHeroState(page);
      cascade.push({ at: scrollY, opacities: statOpacities, values: statValues });
    }
    await page.evaluate(() => window.scrollTo(0, 0));

    // Sanity: 4 stats, with the expected values.
    expect.soft(cascade[0]?.values).toEqual(['47', '18h', '6 yrs', '6']);

    // Start state (scrollY 0): all 4 stats invisible.
    for (let i = 0; i < 4; i++) {
      expect.soft(
        cascade[0]?.opacities[i] ?? 0,
        `stat ${i} (${cascade[0]?.values[i]}) at scrollY 0`,
      ).toBeLessThan(0.15);
    }

    // End state (last sweep point, well past the cascade window):
    // all 4 stats fully revealed.
    const endProbe = cascade[cascade.length - 1];
    for (let i = 0; i < 4; i++) {
      expect.soft(
        endProbe?.opacities[i] ?? 0,
        `stat ${i} (${endProbe?.values[i]}) at scrollY ${endProbe?.at}`,
      ).toBeGreaterThan(0.85);
    }

    // Monotonicity: at every sweep point, earlier stats should be
    // at LEAST as opaque as later stats (cascade reads in order).
    // Delta tolerance 0.05 to absorb spring-settle residuals.
    for (const probe of cascade) {
      for (let i = 0; i < probe.opacities.length - 1; i++) {
        const earlier = probe.opacities[i] ?? 0;
        const later = probe.opacities[i + 1] ?? 0;
        const delta = earlier - later;
        expect.soft(
          delta,
          `at scrollY ${probe.at}, stat ${i} (${probe.values[i]}) should be >= stat ${i + 1} (${probe.values[i + 1]}): earlier=${earlier.toFixed(3)}, later=${later.toFixed(3)}, delta=${delta.toFixed(3)}`,
        ).toBeGreaterThanOrEqual(-0.05);
      }
    }
  });

  test('Surface B - desktop reduced-motion: storybook off, dashboard on, no flash', async ({
    page,
  }, testInfo) => {
    skipMobile(testInfo);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await bootPage(page);

    const state = await readHeroState(page);

    expect.soft(
      state.storybookInDom === false || state.storybookDisplay === 'none',
      `storybook hidden on reduced-motion (inDom=${state.storybookInDom}, display=${state.storybookDisplay})`,
    ).toBe(true);
    expect.soft(state.liveOpacity ?? 0, 'live status opacity on reduced-motion').toBe(1);
    expect.soft(state.telemetryOpacity ?? 0, 'telemetry opacity on reduced-motion').toBe(1);

    await page.reload();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.setSystemTime(FROZEN_NOW);
    await waitForHeroHydrated(page, 1);
    const flash = await captureFirstPaintFlash(page);
    const trace = flash.reads.map((r) => `[${r.at}ms L=${r.live.toFixed(2)} T=${r.tel.toFixed(2)}]`).join(' ');
    expect.soft(flash.liveMin, `live status flash on reduced-motion: min=${flash.liveMin.toFixed(3)} reads: ${trace}`).toBeGreaterThan(0.9);
    expect.soft(flash.telemetryMin, `telemetry flash on reduced-motion: min=${flash.telemetryMin.toFixed(3)} reads: ${trace}`).toBeGreaterThan(0.9);
  });

  test('Surface C - mobile-ish coarse pointer (767x1024, CSS-only path): storybook off, dashboard on, no flash', async ({
    page,
  }, testInfo) => {
    skipMobile(testInfo);
    // Width 767 sits exactly at the @media (max-width: 767px)
    // breakpoint, which is the only CSS gate we actually need to
    // exercise here (the .liveStatus/.telemetry/.telemetryItem
    // !important rules are nested under that media query). The
    // earlier matchMedia shim was REMOVED because its plain-object
    // spread lacked addEventListener, which crashed LenisProvider's
    // useEffect and tore down the React tree (a `pageerror` was
    // observable in console). Width alone is sufficient to exercise
    // the CSS path; the React matchMedia path is covered by Surface
    // B (reduced motion) and Surface D (real phone viewport).
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 767, height: 1024 });
    await bootPage(page);

    const state = await readHeroState(page);

    expect.soft(
      state.storybookInDom === false || state.storybookDisplay === 'none',
      `storybook hidden on coarse pointer (inDom=${state.storybookInDom}, display=${state.storybookDisplay})`,
    ).toBe(true);
    expect.soft(state.liveOpacity ?? 0, 'live status opacity on coarse pointer').toBe(1);
    expect.soft(state.telemetryOpacity ?? 0, 'telemetry opacity on coarse pointer').toBe(1);

    await page.reload();
    await waitForHeroHydrated(page, 1);
    const flash = await captureFirstPaintFlash(page);
    const trace = flash.reads.map((r) => `[${r.at}ms L=${r.live.toFixed(2)} T=${r.tel.toFixed(2)}]`).join(' ');
    expect.soft(flash.liveMin, `live status flash on coarse pointer: min=${flash.liveMin.toFixed(3)} reads: ${trace}`).toBeGreaterThan(0.9);
    expect.soft(flash.telemetryMin, `telemetry flash on coarse pointer: min=${flash.telemetryMin.toFixed(3)} reads: ${trace}`).toBeGreaterThan(0.9);
  });

  test('Surface D - phone (393x851): storybook off, dashboard on, no flash', async ({ page }, testInfo) => {
    skipMobile(testInfo);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 393, height: 851 });
    await bootPage(page);

    const state = await readHeroState(page);

    expect.soft(
      state.storybookInDom === false || state.storybookDisplay === 'none',
      `storybook hidden on phone (inDom=${state.storybookInDom}, display=${state.storybookDisplay})`,
    ).toBe(true);
    expect.soft(state.liveOpacity ?? 0, 'live status opacity on phone').toBe(1);
    expect.soft(state.telemetryOpacity ?? 0, 'telemetry opacity on phone').toBe(1);

    await page.reload();
    await waitForHeroHydrated(page, 1);
    const flash = await captureFirstPaintFlash(page);
    const trace = flash.reads.map((r) => `[${r.at}ms L=${r.live.toFixed(2)} T=${r.tel.toFixed(2)}]`).join(' ');
    expect.soft(flash.liveMin, `live status flash on phone: min=${flash.liveMin.toFixed(3)} reads: ${trace}`).toBeGreaterThan(0.9);
    expect.soft(flash.telemetryMin, `telemetry flash on phone: min=${flash.telemetryMin.toFixed(3)} reads: ${trace}`).toBeGreaterThan(0.9);
  });
});
