/**
 * lighthouserc.mobile.cjs
 *
 * Lighthouse CI budget config — PR mobile guard.
 *
 * Same 2 routes as lighthouserc.cjs but with Lighthouse's mobile preset
 * (slow 4G + 4× CPU throttling). Mobile is where the budget matters most
 * because the production PRD-00 §4 mobile LCP has the tightest headroom
 * (worst observed: 2.27s on /quote mobile against a 2.5s budget).
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
        // Mobile preset defaults: simulated Moto G4, slow 4G, 4× CPU throttle.
        // No `preset: 'mobile'` here because Lighthouse-CI's `preset` setting
        // flips Lighthouse into "form-factor-mobile" mode, which is what we want.
        formFactor: 'mobile',
        throttling: {
          // Match Lighthouse defaults for the mobile preset.
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
        skipAudits: ['is-on-https', 'uses-http2'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'speed-index': ['error', { maxNumericValue: 4000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
      reportFilenamePattern: '%%PATHNAME%%-mobile-%%DATETIME%%-report',
    },
  },
};
