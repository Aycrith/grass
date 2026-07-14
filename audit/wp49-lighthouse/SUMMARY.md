# WP49 Lighthouse audit — v2 hero (2026-07-14)

Captures Lighthouse scores for the v2 hero swap (commit 72e749c) on
`next dev` mode, port 3002. The dev-mode capture is a smoke test for
the swap, NOT a production baseline — production builds use a
different code path (no HMR, no dev overlays, no source maps) and
the v1 production baseline at `audit/wp5-lighthouse/SUMMARY.md` is
the comparison reference for production-mode scores.

## Dev-mode capture (this run)

| Route | Viewport | Perf | FCP | LCP | CLS | TBT | Speed Index |
|---|---|---:|---:|---:|---:|---:|---:|
| `/` | desktop | 61 | 400ms | 2200ms | 0 | 810ms | 1100ms |

Lighthouse v13.4.0, headless Chrome, served by `next dev` on
localhost:3002. One run, no warmup beyond a single GET to compile
the page.

## Production-mode v1 baseline (for comparison)

| Route | Viewport | Perf | FCP | LCP | CLS | TBT | Speed Index |
|---|---|---:|---:|---:|---:|---:|---:|
| `/` | desktop | **100** | 473ms | 518ms | 0.003 | 0ms | 473ms |

Source: `audit/wp5-lighthouse/SUMMARY.md` (run 2026-07-12, post-WP3
hero, captured against `bun run start` from `bun run build`).

## Delta (dev-mode v2 vs production-mode v1)

| Metric | v1 production | v2 dev | Δ | Notes |
|---|---:|---:|---:|---|
| Performance | 100 | 61 | -39 | dev-mode regression expected; not representative |
| LCP | 518ms | 2200ms | +1682ms | dev-mode regression; production should be ~500-800ms |
| CLS | 0.003 | 0 | -0.003 | improvement (new image is fixed-size) |
| TBT | 0ms | 810ms | +810ms | dev-mode HMR / dev overlays / next/image dev path |
| FCP | 473ms | 400ms | -73ms | improvement |

## Why dev-mode isn't representative

`next dev` runs:
- React DevTools hooks (adds ~100ms to first render)
- HMR WebSocket (main thread cost ~50-200ms while warming)
- Source-map-based stack traces
- next/image dev-mode optimization (slower than production)
- Framer Motion dev-mode checks (motion library is in dev profile)

The v1 production baseline (100/100) was against `next start` which
skips all of the above. The v2 dev-mode score of 61/100 includes the
dev-mode overhead on top of the asset swap; it does NOT measure
production-mode performance.

## What needs to happen before the v2 hero is considered a clean ship

**Required for the CI lighthouse gate to pass:**

1. Production-mode Lighthouse capture on the v2 hero (full PRD-00 §4
   14-route sweep, both viewports, against `bun run start` from
   `bun run build` on port 3000). Capture the SUMMARY at
   `audit/wp49-lighthouse/SUMMARY-production.md` and compare to the
   v1 production baseline.
2. If production-mode perf is also <95 (the CI `error` gate), the
   swap is a regression and the right call is either:
   - Drop the `priority` hint on the `next/image` (defer LCP to a
     later image) — likely 0.5-1.0s LCP improvement at the cost of
     a small visible-loading flash.
   - Re-encode the mobile.webp at quality=70 (currently 82) — saves
     ~40 KB, may not move LCP needle.
   - Use `<picture>` with an `AVIF` source for the mobile breakpoint
     — typically 30-50% smaller than WebP at equivalent quality,
     supported in all evergreen browsers.
3. If production-mode perf holds at ≥95, log the dev-mode caveat
   in the ledger and ship.

## D-0009 follow-up added

The D-0008 §D-0009 follow-up now includes this production-mode
Lighthouse re-run as a required step before declaring the v2 hero
a clean ship. Tracked in `state/ledger.yaml` Day-20 changelog
commit ad51f98.

## Files

- `audit/wp49-lighthouse/home-desktop.json` — raw Lighthouse
  output for this dev-mode run.
- `audit/wp5-lighthouse/SUMMARY.md` — v1 production baseline for
  comparison.
- `lighthouserc.cjs` — CI gate config; categories:performance ≥95
  is the hard error threshold.

## Verification

- `bun run test:charter` → ✓ all checks pass
- `bun run test:agents` → ✓ 13 agent specs validated
- `bun run test:capabilities` → ✓ 9 capabilities validated
- `bun run test:ledger-freshness` → ✓ 0.9 days (limit 7)
- `bun run typecheck` → ✓ green (no new errors in HeroCinematic.tsx)
