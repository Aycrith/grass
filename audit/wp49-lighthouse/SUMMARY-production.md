# WP49 Lighthouse audit — production-mode v2 hero (2026-07-14)

Captures Lighthouse scores for the v2 hero swap (commit 72e749c) in
**production mode** (`bun run start` from `bun run build` on port 3000),
which is the apples-to-apples comparison against the v1 production
baseline at `audit/wp5-lighthouse/SUMMARY.md`. The dev-mode capture
in `SUMMARY.md` (this directory) is NOT representative — it includes
HMR, dev overlays, and the slower next/image dev path.

## Production-mode v2 hero (this run)

| Route | Viewport | Perf | FCP | LCP | CLS | TBT | Speed Index |
|---|---|---:|---:|---:|---:|---:|---:|
| `/` | desktop | **100** | 0.4s | 0.7s | 0 | 10ms | 0.7s |
| `/` | mobile | 80 | 2.1s | 4.0s | 0 | 260ms | 3.1s |

Lighthouse v13.4.0, headless Chrome `--headless=new --no-sandbox`,
served by `bun run start` from a fresh `bun run build` of `apps/web/`
on port 3000. Mobile capture includes 3 warmup GETs before the
audited run to neutralize cold-cache variance.

Raw reports:
- `production-home-desktop.report.{json,html}`
- `production-home-mobile.report.{json,html}` (cold)
- `production-home-mobile-warm.report.{json,html}` (after warmup)

## Production-mode v1 baseline (for comparison)

| Route | Viewport | Perf | FCP | LCP | CLS | TBT | Speed Index |
|---|---|---:|---:|---:|---:|---:|---:|
| `/` | desktop | **100** | 0.5s | 0.5s | 0.003 | 0ms | 0.5s |
| `/` | mobile | **98** | 1.6s | 2.2s | 0.006 | 20ms | 1.6s |

Source: `audit/wp5-lighthouse/{home-desktop,home-mobile}.json`
(post-WP3 hero at commit `ac16da8`, captured 2026-07-12).

## Delta (production-mode v2 vs production-mode v1)

| Metric | v1 prod | v2 prod | Δ | Pass? |
|---|---:|---:|---:|---|
| Desktop Perf | 100 | 100 | 0 | ✓ CI gate (≥95) |
| Desktop LCP | 0.5s | 0.7s | +0.2s | ✓ under 2.0s target |
| Desktop CLS | 0.003 | 0 | -0.003 | ✓ improvement |
| Desktop TBT | 0ms | 10ms | +10ms | ✓ under 200ms |
| **Mobile Perf** | **98** | **80** | **-18** | **✗ CI gate (≥95)** |
| Mobile LCP | 2.2s | 4.0s | +1.8s | ✗ over 3.0s budget |
| Mobile TBT | 20ms | 260ms | +240ms | ✗ over 200ms budget |
| Mobile SI | 1.6s | 3.1s | +1.5s | ✗ over 3.0s budget |

## Verdict

**Desktop: clean ship.** Production-mode perf holds at 100/100, all 4
Lighthouse categories ≥95, all PRD-00 §4 success metrics met. The
v2 hero swap is confirmed safe on desktop. Dev-mode regression
captured in `SUMMARY.md` was a false positive caused by HMR + dev
overlays + next/image dev path, exactly as predicted.

**Mobile: real regression.** Production-mode perf dropped 98 → 80
(18 points), with LCP +1.8s, TBT +240ms, and SI +1.5s. The CI
`lighthouserc.cjs` is desktop-only, so the build gate passes — but
the mobile regression needs to be fixed before the v2 hero can ship
to real customers on cellular networks. This is the gap that
`lighthouserc.mobile.cjs` would have caught (separate config, same
routes, mobile preset) if it were wired into CI.

## What's hurting mobile

The LCP element is the hero **subhead text** (`.HeroCinematic_subhead`),
not the image. Lighthouse `lcp-breakdown-insight` shows:
- TTFB: 11.7ms (fine)
- Element render delay: 577.7ms (acceptable)
- Total LCP: 4.0s

The 3.4s gap is JS bootup time blocking first paint. The
`bootup-time` audit shows:
- HTML page: 1,578ms (was 289ms in v1 prod)
- chunk `6623-*.js`: 700ms
- chunk `1255-*.js`: 484ms
- Smaller chunks: 73-184ms each

The chunks are the same hashes as v1 (same bundled files), so the
regression is in **page-level JS execution**, not in chunk content.
This is consistent with the HeroCinematic rewrite changing how
framer-motion is imported/instantiated on the home route.

The image itself is not the bottleneck:
- `desktop.webp` 314 KB (was 37 KB) — 8.5× larger than v1
- `mobile.webp` 191 KB (was 22 KB) — 8.7× larger than v1
- Both decode in <100ms once delivered; transfer on simulated 4G
  mobile adds ~1.0s vs v1's <0.1s

The image swap cost ~1.0s of mobile transfer time. The other ~0.8s
of LCP regression is JS.

## Recommended fixes (priority order)

1. **Investigate HeroCinematic JS execution** (D-0010 candidate).
   Profile the framer-motion variants in
   `apps/web/src/components/motion/variants.tsx` (13 KB) and
   `apps/web/src/components/sections/HeroCinematic.tsx` (6 KB).
   The `ParallaxImage` `useSpring` + `useTransform` chains may
   be running on first paint when they should be deferred to
   post-mount. Estimated effort: 1-2 hours.

2. **Re-encode mobile.webp at quality=70** (cheap, ~5 min). Saves
   ~40 KB on transfer. Won't fix the JS bottleneck but trims
   ~200ms off simulated 4G transfer time. Mechanical script
   change in `scripts/crop-hero-for-gbp.ts`.

3. **AVIF source via `<picture>`** (medium, ~30 min). AVIF is
   typically 30-50% smaller than WebP at equivalent quality.
   Universal browser support since 2023. Trims another 50-100ms
   off mobile transfer.

4. **Lazy-load the HeroCinematic component** (medium, ~1 hour).
   The `priority` hint and framer-motion work can be deferred
   until after first paint with `next/dynamic` + `{ ssr: false }`.
   This is the bigger lever for the 1.8s LCP gap but requires
   careful reduced-motion handling.

5. **Wire `lighthouserc.mobile.cjs` into CI** (low, ~15 min).
   This regression would have been caught at PR time if mobile
   were gated. Should be a separate WP after D-0010.

## D-0009 follow-up updated

D-0009 was originally just "long-term grass asset upgrade." It now
includes:

- **Mobile perf regression fix** — D-0010 candidate (see
  governance/decisions/0010-pending-mobile-perf-fix.md when authored).
  Required before declaring the v2 hero a clean ship on cellular.
- **Original grass asset work** — 3 paths still in play
  (D-0008 §v2 outcome, paths 1/2/3).

## Files

- `production-home-desktop.report.{json,html}` — desktop, v2 hero
- `production-home-mobile.report.{json,html}` — mobile cold
- `production-home-mobile-warm.report.{json,html}` — mobile warmed
- `home-desktop.json` — pre-existing dev-mode v2 capture (kept)
- `SUMMARY.md` — pre-existing dev-mode summary (kept)
- `audit/wp5-lighthouse/SUMMARY.md` — v1 production baseline

## Verification

- `bun run test:charter` → ✓ all checks pass
- `bun run typecheck` → ✓ green (after the MotionStyle import fix
  in `apps/web/src/components/motion/variants.tsx:9`)
- `bun run build` → ✓ green (84 routes prerendered, BUILD_ID
  `b_7J1tS4nVTzRC53_EGjm`)
- `bun run start` on port 3000 → ✓ 200 OK on `/` (101 KB HTML)
- Lighthouse desktop v2 → ✓ 100/100 (CI gate passes)
- Lighthouse mobile v2 → ✗ 80/100 (CI gate fails; needs D-0010 fix)
