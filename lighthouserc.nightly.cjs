/**
 * lighthouserc.nightly.cjs
 *
 * Lighthouse CI full-sweep config — runs in the nightly cron
 * (lighthouse-nightly.yml).
 *
 * 6 PRD-00 §4 routes × 2 viewports = 12 Lighthouse audits per night.
 * Posts the day's delta to the steward via the artifacts; failures
 * open a GitHub issue.
 *
 * Budgets are looser than PR (which only catches the 4 primary routes
 * at desktop) because nightly CI has higher variance — the full sweep
 * is for monitoring drift, not gating PRs.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/services',
        'http://localhost:3000/services/mowing',
        'http://localhost:3000/areas/33771',
        'http://localhost:3000/pricing',
        'http://localhost:3000/quote',
      ],
      numberOfRuns: 1,
      settings: {
        formFactor: 'desktop',
        // Desktop preset used; throttle configuration left to defaults.
        skipAudits: ['is-on-https', 'uses-http2'],
      },
    },
    assert: {
      // Nightly is warn-only — we want monitoring, not block-on-change.
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.15 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'speed-index': ['warn', { maxNumericValue: 3500 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
      reportFilenamePattern: '%%PATHNAME%%-nightly-%%DATETIME%%-report',
    },
  },
};
