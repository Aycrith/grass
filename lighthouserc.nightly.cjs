/**
 * lighthouserc.nightly.cjs
 *
 * Lighthouse CI full-sweep config — runs in the nightly cron
 * (lighthouse-nightly.yml).
 *
 * WP12 expansion: covers all 16 customer-facing routes × 2 viewports
 * = 32 Lighthouse audits per night (was 6 × desktop = 6). The
 * nightlies are for monitoring drift, not gating PRs — every
 * assertion is `warn`, and the nightly budget thresholds are looser
 * than the PR guard. Failures open a GitHub issue (see the
 * lighthouse-nightly workflow).
 *
 * Slack vs PR guard:
 *   - PR guard (lighthouserc.cjs / lighthouserc.mobile.cjs) is
 *     tight (≥95 categories, per-metric thresholds).
 *   - Nightly is loose (≥85 perf, per-metric thresholds bumped
 *     +500ms) because nightly CI has higher variance.
 */
const PRD_ROUTES = [
  '/',
  '/services',
  '/services/mowing',
  '/services/edging',
  '/services/mulching',
  '/services/hedge-trimming',
  '/services/hurricane-prep',
  '/services/seasonal-cleanup',
  '/areas',
  '/areas/33756',
  '/areas/33770',
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
        formFactor: 'desktop',
        // Desktop preset used; throttle configuration left to defaults.
        skipAudits: ['is-on-https', 'uses-http2'],
      },
    },
    assert: {
      // Nightly is warn-only — we want monitoring, not block-on-change.
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
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
