/**
 * lighthouserc.cjs
 *
 * Lighthouse CI budget config — PR desktop guard.
 *
 * Two routes (`/` + `/services/mowing`) × desktop preset. The "primary"
 * routes — landing and a detail page — catch most regressions with a
 * low CI-minutes cost (4 budgets asserted for ~2 min of runner time).
 *
 * For the full sweep (6 routes × 2 viewports), see:
 *   - lighthouserc.nightly.cjs → .github/workflows/lighthouse-nightly.yml
 *
 * Budgets are tuned to the WP5 post-WP3 baseline at audit/wp5-lighthouse/SUMMARY.md
 * (desktop LCP 0.5s, CLS ≤0.023, TBT 0ms, FCP 0.5s). One step looser than
 * the worst observed to absorb CI-machine variance.
 *
 * See PRD-00 §4 / PRD-05 §10 for the production targets.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/services/mowing',
      ],
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
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
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
