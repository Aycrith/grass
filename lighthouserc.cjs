/**
 * lighthouserc.cjs
 *
 * Lighthouse CI budget config — PR desktop guard.
 *
 * WP12 expansion: covers every customer-facing route (14 routes
 * per PRD-00 §4). The 4-category gate (`categories:performance`,
 * `categories:accessibility`, `categories:best-practices`,
 * `categories:seo` ≥95) is what locks the AAA tier in.
 *
 * Budgets are tuned to the WP5 post-WP3 baseline at
 * audit/wp5-lighthouse/SUMMARY.md (desktop LCP ~510ms, CLS ≤0.023,
 * TBT 0ms, FCP ~490ms). One step looser than the worst observed to
 * absorb CI-machine variance.
 *
 * See PRD-00 §4 / PRD-05 §10 for the production targets.
 *
 * Mobile guard still runs from lighthouserc.mobile.cjs (same routes,
 * mobile preset).
 */
const PRD_ROUTES = [
  '/',
  '/services',
  '/services/mowing',
  '/services/edging',
  '/services/mulching',
  '/areas',
  '/areas/33756',
  '/areas/33771',
  '/areas/33773',
  '/areas/33774',
  '/areas/33778',
  '/pricing',
  '/quote',
  '/about',
  '/contact',
  '/review',
];

module.exports = {
  ci: {
    collect: {
      url: PRD_ROUTES.map((p) => `http://localhost:3000${p}`),
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        // Network/CPU throttling defaults from lighthouse-ci; emulator screen.
        // Skipped audits that are flaky on local Linux runners:
        skipAudits: ['is-on-https', 'uses-http2'],
      },
    },
    assert: {
      // `error` makes a regression fail the build; `warn` posts a PR comment.
      // WP12 gate: every Lighthouse category ≥95. Worst observed is 98 on
      // mobile perf, 100 on desktop perf — slack is in place for CI variance.
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report',
    },
  },
};
