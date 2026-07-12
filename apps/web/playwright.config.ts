/**
 * Playwright visual regression — Largo Lawn web app.
 *
 * Baselines live in `apps/web/visual/baselines/` (committed). Actual / diff
 * output goes to `apps/web/visual/test-output/` (gitignored).
 *
 * This config follows the same server-bring-up pattern as the Lighthouse CI
 * job (`.github/workflows/ci.yml` `lighthouse:`). When invoked from a real
 * PR workflow, the `visual:` job starts its own production server; locally,
 * `bun run start` must already be serving on :3000 (or `webServer` will
 * boot it for you — `reuseExistingServer` is on outside CI).
 *
 * Captures run with `prefers-reduced-motion: reduce` so Framer's
 * `useReducedMotion` hook collapses + CSS `@media (prefers-reduced-motion)`
 * queries fire — eliminates animation jitter in baselines.
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './visual',
  outputDir: './visual/test-output',

  /**
   * GitHub Actions runners are 2-core; 1 worker keeps capture ordering
   * predictable (4 captures × 2 viewports + 4 components serially).
   */
  workers: 1,

  fullyParallel: true,

  /** CI gets 2 retries to absorb transient flakes (network, font load). */
  retries: process.env.CI ? 2 : 0,

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: './visual/playwright-report' }]]
    : 'list',

  /**
   * Screenshot diff tolerance. `maxDiffPixels: 200` ≈ 0.02% of a 1280×800
   * capture; `threshold: 0.2` is per-pixel anti-aliasing tolerance. Both
   * can be overridden per-call when a route is known to be noisier.
   */
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 200,
      threshold: 0.2,
    },
    timeout: 10_000,
  },

  /**
   * Production build served on :3000. Reuse an already-running server
   * locally so dev iteration is fast; in CI always boot a fresh one.
   */
  webServer: {
    command: 'bun run start',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 5_000,
    navigationTimeout: 30_000,
    /** Sets `prefers-reduced-motion: reduce` on every browser context. */
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        // devices['Pixel 5'] default is 393×851 @ 2.75x. Keep that — it
        // matches the Lighthouse mobile emulation in lighthouserc.mobile.cjs.
      },
    },
  ],

  /**
   * Baselines stored at `{testDir}/baselines/<name>-<project>.png`. The
   * screenshot `name` is the string passed as the first positional arg to
   * `expect(locator).toHaveScreenshot(name)`. We bake in the project name
   * so each project gets its own baseline file.
   *
   * Example: `expect(page).toHaveScreenshot('home-desktop')` on the
   * `chromium-desktop` project → `baselines/home-desktop-chromium-desktop.png`.
   */
  snapshotPathTemplate: '{testDir}/baselines/{arg}-{projectName}.png',
});
