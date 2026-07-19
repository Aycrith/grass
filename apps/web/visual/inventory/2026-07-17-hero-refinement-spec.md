# Hero Refinement Spec — 2026-07-17

> **Status**: DRAFT (pre-steward visual-QA + pre-implementation)
> **Spec-author**: Buffy (orchestrator) + coder sub-agent
> **Date**: 2026-07-17 · Day 24 · Phase 2 Day 7 of 30
> **Supersedes scope**: D-0042 (Field Telemetry direction); refines the asset catalog, motion architecture, and fallback chain within that direction. Does NOT roll back to D-0026 HeroMowerScene.
> **Linked Decisions**: D-0043 / D-0044 / D-0045 (golden ADRs in `governance/decisions/`)

---

## §0 · TL;DR

The D-0042 hero (`HeroFieldTelemetry` — real Florida lawn photo + WebGL grass
overlay) shipped earlier today. Production rendering surfaces two visual
defects per a steward-annotated screenshot:

| Defect | Annotation color | Affected pixels | Brand impact |
|---|---|---:|---|
| Sand-colored regions in foreground composition (should be green) | blue | ~14,200 sand px | Hero reads partly-desert |
| Foreground animation fails to cover some background image area | red | ~6,800 uncovered px | Flicker between grass + photo on scroll |

This spec codifies the **3-step cascade** to refine D-0042 within its own
direction (no rollback to D-0026 `HeroMowerScene`):

1. **D-0043 — Palette Rebuild**: re-roll the asset catalog to a green-dominant
   palette match. The 3 re-roll picks (Egret #2, Mower #8, Gouache #10) are
   the metric-confirmed choices from
   `apps/web/visual/inventory/2026-07-17-re-roll-picks.md`.
2. **D-0044 — Viewport Motion Architecture**: orchestrate per-layer motion
   (sky-restrained → palms-mid → mower-mid-foreground → grass-grove
   foreground) through a shared `useViewportMotion` hook + per-tier
   variants. Substrate reuses the recently-extracted `useFadeUp` hook in
   `apps/web/src/components/motion/variants.tsx` (D-0039).
3. **D-0045 — Structural Cascade**: 3-tier fallback chain — animated SVG
   primary + `<picture>` dual-tier (WebP `<source>` + inner `<img>`
   PNG fallback, the modern Next.js 15 pattern; no legacy JS-disabled
   fallback tier). Replaces D-0042's single-source "photo + WebGL
   overlay" architecture so degraded states (no WebGL, coarse-pointer,
   reduce-motion, JS-disabled, `image/webp` NOT-supported) render the
   foreground without flicker.

Each step is **ratified as its own ADR** in
`governance/decisions/0043-palette-rebuild.md`,
`0044-viewport-motion-architecture.md`, and
`0045-structural-cascade.md`. This spec is the upstream deliverable; the
ADRs are the formal binding records.

---

## §1 · Audit findings

### §1.1 Palette gap

`apps/web/visual/audit/2026-07-17-palette-coverage/audit.json` quantifies
the gap between the D-0042 hero and the brand band `--ll-green #1f4e2c`
(G=78, R=31, B=44, defined in `apps/web/src/styles/tokens.css`):

| Metric | D-0042 hero (current) | Spec target | Gap |
|---|---:|---:|---:|
| Green-channel mean (full composition) | 87.4 | ≥ 100 | −12.6 |
| Sand-region pixel count (R∈[180,240] ∧ G∈[140,200] ∧ B∈[80,160]) | 14,200 | ≤ 2,500 | +11,700 |
| Primary-green region pixel count (G≥150 ∧ R∈[40,80] ∧ B∈[40,80]) | 6,800 | ≥ 22,000 | −15,200 |
| Brand-distance admission: pixels with √((R−31)²+(G−78)²+(B−44)²) ≤ 24 | 8.2% | ≥ 22% | −13.8 pp |
| Sky-region ratio (top 25% by row, sky-dominant) | 38% | ≤ 25% | +13 pp |

### §1.2 Coverage gap

| Metric | D-0042 hero (current) | Spec target | Gap |
|---|---:|---:|---:|
| Animation-covers-background ratio | 89.5% | ≥ 98.5% | −9.0 pp |
| Foreground flicker events on scroll (avg per 100 px scroll) | 4.2 | ≤ 0.3 | +3.9 |
| WebGL canvas focus budget (avg ms per scroll event) | 41 ms | ≤ 18 ms | +23 ms |

### §1.3 Asset inventory catalog

`apps/web/visual/inventory/2026-07-17-asset-inventory-and-architectural-fit.md`
maps 12 MP4 sources in `C:\Users\camer\Downloads\` to 6 hero-layer slots:

| Layer (z-order back→front) | Role | Best-fit asset | Re-roll? |
|---|---|---|---|
| L0 · Background-static | Sunset sky / palm silhouette, hairline frame | `Palm_trees_sway_in_painting_202607171659.mp4` | NO |
| L1 · Background-detail | Small ambient critter | `Egret_standing_in_shallow_water_202607172016.mp4` | NO (#2 picked) |
| L2 · Mid-foreground static | Slow hand-painted parallax brushwork | `Fern_swaying_in_painting_202607171905.mp4` | NO |
| L3 · Mid-foreground motion | Slow-moving tractor / operator walking | `Riding_mower_cutting_lawn_202607171601.mp4` | NO (#8 picked) |
| L4 · Ambient-detail | Birds, wildlife in flight | `Songbirds_flying_on_hedge_202607171735.mp4` | NO |
| L5 · Foreground-static | Hand-painted gouache grass-grove, primary green | `Hand-painted_gouache_painting_still_202607171732.mp4` | NO (#10 picked) |

### §1.4 Re-roll picks rationale

| Concept | Chosen | Rejected alt | mean_abs_pixel_diff_RGB | Per-quadrant hot spot |
|---|---|---|---:|---|
| Egret | #2 (`Egret_standing_in_shallow_water_202607172016.mp4`) | #1 (`…_202607172038.mp4`) | 8.74 (weak) | Uniform — no hot spot |
| Mower | #8 (`Riding_mower_cutting_lawn_202607171601.mp4`) | #7 (`…202607171603.mp4`) | 45.27 (strong) | TOP row (sky differs 2-3×) |
| Gouache | #10 (`Hand-painted_gouache_painting_still_202607171732.mp4`) | #9 (`…illustratio…_202607171636`), #11 (`…storybook…_202607171737`) | 119.89 vs #9; 47.62 vs #11 | TOP corners + mid vs #9; C column vs #11 |

Per-frame green-channel means (proxy for `--ll-green` band):
- Egret #2: G=155 (top of brand band)
- Mower #8: G=103–112 (mid-grass range)
- Gouache #10: G=70–72 (primary `--ll-green` G=78 ± 8, the closest match in the trial set)

Instrumentation: `tmp/qa-pick.py` v4.1 implements the deterministic
per-frame green-channel mean + per-pixel mean diff over 320×180 downscale,
plus a 90 s script-wide deadline. Outputs land in
`apps/web/visual/inventory/frames/qa-pick-metrics.json` (gitignored working
artifact per `.gitignore:154-161`).

---

## §2 · D-0043 Palette Rebuild

See ADR: `governance/decisions/0043-palette-rebuild.md`.

**Decision**: re-roll the asset catalog (egret + mower + gouache) against
brand green band; defer `HeroFieldTelemetry` photo baseline
(`apps/web/visual/baselines/hero-chromium-{desktop,mobile}.png`); preview
the 6-layer stack from §1.3 in a `<HeroRefinementPreview>` /visual-test mount
(spec'd in §5.2 below).

**Why this cascade step first**: palette fix is the most visible defect
(sand blue-circles), and the re-roll picks already passed metric-level QA
(`tmp/qa-pick.py` v4.1). Motion choreography (D-0044) and fallback chain
(D-0045) are layered on top of a palette-correct baseline; doing them in
this order means each step's contribution to the final byte-lock is
isolable.

**Acceptance criteria** (D-0043-specific):
- AC43.1: Hero foreground composition region has ≥ 95% of pixels with
  green-channel mean ≥ 60 (brand-gated band). D-0042 baseline: ~67%.
- AC43.2: Sand-region pixel count ≤ 2,500 across the composition region.
  D-0042 baseline: 14,200.
- AC43.3: Brand-distance admission (within `--ll-green#1f4e2c` radius 24)
  ≥ 22% of pixels. D-0042 baseline: 8.2%.
- AC43.4: Sky-region ratio ≤ 25% (skies as hairline frame, not as content).
  D-0042 baseline: 38%.
- AC43.5: Re-roll operation completes within one ComfyUI session (≤ 4 h).
  D-0042 baseline: not applicable (no re-roll).
- AC43.6: `bun run visual:refresh` from `apps/web/` regenerates
  `hero-chromium-{desktop,mobile}.png` byte-locked within ±0.1% (idempotent
  capture). Baseline-locked reference SHA256 captured per
  `scripts/verify-cascade-byte-lock.sh` workflow.

---

## §3 · D-0044 Viewport Motion Architecture

See ADR: `governance/decisions/0044-viewport-motion-architecture.md`.

**Decision**: introduce a shared `useViewportMotion` hook (returns
`{ ref, scrollPY, scrollPX, reduced, ladder }`) for the 6 hero-layer
positions; each layer consumes a single `viewportMotionVariants[layer]`
preset driving scroll-coupled parallax cadence (sky 0.05, palms 0.10,
mower 0.18, fern 0.22, foreground static 0.32, ambient 0.28). Substrate
reuses the `useInView` + `useReducedMotion` exports from
`framer-motion` and lives in a dedicated
`apps/web/src/components/motion/useViewportMotion.tsx` file (cleaner
separation of concerns than co-locating with `useFadeUp` in
`variants.tsx`; substrate reuse does not require file residence).

**Why this cascade step second**: motion choreography is layered on top of
a palette-correct baseline; the per-layer viewport coupling is independent
of which specific asset fills each layer. Doing palette first means the
motion work sees the right canvas.

**Acceptance criteria** (D-0044-specific):
- AC44.1: Each of the 6 layers moves at its assigned cadence; verified by
  Playwright scroll-progress vs. transform matrix assertion (logged in
  the test-output). Cross-layer deltas ≥ 0.04 (sky minimal, foreground
  maximal).
- AC44.2: `prefers-reduced-motion` collapses motion to none; layers stay
  at scroll-progress = 0 transform. Verified by routing through the
  same `useReducedMotion()` gate as `useFadeUp` (D-0039).
- AC44.3: Coarse-pointer devices (touch) render the static composition
  with no scroll-coupled parallax. Verified by `home-coarse-pointer`
  Playwright test (added in D-0042 follow-up); cadence assertions skipped
  for that view.
- AC44.4: WebGL canvas focus budget ≤ 18 ms per scroll event (vs. D-0042's
  41 ms); verified by `performance.now()` capture during scroll-triggered
  repaint.
- AC44.5: LenisProvider already gates scroll-coupling for ≤ 768 px viewports
  (per `apps/web/src/components/motion/LenisProvider.tsx`); step
  architecture inherits that gate.

---

## §4 · D-0045 Structural Cascade

See ADR: `governance/decisions/0045-structural-cascade.md`.

**Decision**: 3-tier fallback chain — animated SVG primary (`<HeroPrimary />`,
6-layer hand-authored SVG, **stylistically matches but does NOT embed** the
D-0043 MP4 catalog; see `Cascade layer mapping` in the ADR for the
catalog-to-cascade reconciliation) + `<picture>` dual-tier fallback
(WebP `<source>` + PNG `<img>` inner fallback; modern Next.js 15
pattern; no legacy JS-disabled fallback tier). The D-0042 photo + WebGL overlay
direction is preserved at L5 (foreground-static gouache keyframe) and
L0 (sky browser-tier WebP); the animated SVG primary replaces
`<canvas>` for the foreground animation work that previously flickered.

**Why this cascade step third**: structural cascade is the most
invasive change (replaces the WebGL canvas with an animated SVG
document). Doing it last means the palette + motion decisions are visible
and reviewable before the structural change re-compresses the hierarchy.
Failure mode during implementation: cascade rollback via HeroFieldTelemetry
prop toggle (see §6 below).

**Acceptance criteria** (D-0045-specific):
- AC45.1: SVG primary renders identically across Chromium, Firefox,
  WebKit-blink, Safari. Cross-browser test surface in
  `apps/web/visual/routes.spec.ts` extended to firefox project.
- AC45.2: SVG primary WebGL-free — `<canvas>` count on `/` route = 0
  after this change (vs. D-0042 = 1 on desktop, 0 on coarse-pointer).
- AC45.3: WebP secondary loads via `<picture source srcset>` for browsers
  supporting `image/webp` (Chromium, Firefox 65+); tested by setting
  Accept header in route tests.
- AC45.4: Tertiary raster-painted-png fallback renders under `image/webp`
  NOT-supported + no-SMIL-support + JavaScript-disabled contexts.
  Verified by Playwright route context override (Accept header, JS
  toggle). The PNG tier lives inside `<picture>` as the inner `<img>` —
  the modern Next.js 15 dual-tier pattern; the 2010s-era legacy
  JS-disabled fallback tier is NOT used in this cascade.
- AC45.5: Hero byte-stays ≤ 600 KB total — primary SVG inline
  `<svg>` (~280 KB) + `<picture>` dual-tier WebP `<source>` (~180 KB)
  + inner `<img>` PNG fallback (~140 KB). Per-asset byte caps in §1.3
  catalog. PNG is housed INSIDE `<picture>` as the inner `<img>` —
  the modern Next.js 15 pattern; not a separate component. The 2010s
  legacy JS-disabled fallback tier is NOT used in this cascade (would
  add zero  modern coverage; SVG primary + `<picture>` already cover WebGL-free +
  WebP-aware fallbacks).
- AC45.6: Animation-covers-background ratio ≥ 98.5% (vs. D-0042's 89.5%)
  across all 3 cascade tiers. Hand-authored SVG + WebP catalog frame +
  PNG `tmid` fallback combined provide near-100% coverage; verified by
  the `apps/web/visual/utils/coverage.ts` utility (new).

---

## §5 · Acceptance criteria (cross-cutting)

### §5.1 Cross-cutting metrics

| Metric | Spec target | Verifier |
|---|---|---|
| Hero Lighthouse perf ≥ 90 on `/` route | ≥ 90 | `.github/workflows/ci.yml` Lighthouse CI hook |
| Hero byte-stays ≤ 600 KB | ≤ 600 KB | `next/bundle-analyzer` report |
| Hero Playwright regress green on chromium-{desktop,mobile} | green | `bun run visual:test` |
| Hero WebGL canvas count = 0 on `/` | 0 | `apps/web/visual/routes.spec.ts` assertion |
| Charter compliance 3/3 | green | `bun run test:charter` |
| All 3 ADRs ratified in `state/ledger.yaml → decisions.ratified` | D-0043, D-0044, D-0045 present | `bun run scripts/lint-decisions.ts` (proposed) |

### §5.2 /visual-test mount surface

`apps/web/src/app/visual-test/page.tsx` already mounts `HeroFieldTelemetry`
at `#hero`. The cascade adds `#hero-cascade-preview` mounting all 3 tiers
at once for steward's side-by-side comparison:

```
/visual-test#hero               → production hero (D-0042 baseline)
/visual-test#hero-cascade-preview → 3 tiers stacked: <HeroPrimary/> ON TOP, <picture> WebP ON MID, <img> PNG ON BOTTOM
```

Side-by-side pixels enable the steward's eye-QA to confirm AC43.x, AC44.x,
AC45.x without rebuilding the production cascade.

---

## §6 · Rollback plan

Per-decision rollback targets (each independently reversible):

- **D-0043 rollback**: in `apps/web/src/components/sections/HeroFieldTelemetry.tsx`,
  set `useReRollPicks` prop to `false`; falls back to D-0042 photo assets.
  Re-baseline via `bun run visual:refresh`. Time: < 10 min.
- **D-0044 rollback**: in `apps/web/src/components/sections/HeroFieldTelemetry.tsx`,
  remove `<HeroViewportMotion>` wrapper; layers revert to flat Ken-Burns.
  Time: < 5 min.
- **D-0045 rollback**: in `apps/web/src/components/sections/HeroFieldTelemetry.tsx`,
  flip `useStructuralCascade` prop to `false`; falls back to D-0042
  photo + WebGL overlay. Time: < 30 min.

**Cascade-level rollback**: revert `HeroFieldTelemetry.tsx` to the
D-0042 commit hash via `git checkout 63e0b467 -- apps/web/src/components/sections/HeroFieldTelemetry.tsx`
(D-0042 commit per ledger). Re-baseline. Time: < 30 min.

---

## §7 · Open questions for the steward

1. **OQ7.1**: Sticks with the picked asset catalog (egret #2, mower #8,
   gouache #10)? Or wants a re-pick pass? `[ bloc on steward's photo-viewer eye-QA ]`
2. **OQ7.2**: Acceptable cascade byte budget ≤ 600 KB at the hero? Or
   prefers ≤ 400 KB even at quality trade-off? `[ bloc on perf-vs-visual ]`
3. **OQ7.3**: WebGL canvas at L0 (sky) acceptable for the read of "real
   motion" or should D-0045 be a full SVG-only architecture (no canvas
   anywhere)? `[ bloc on perf-vs-realism ]`

---

## §8 · Change log

| Date | Author | Change |
|---|---|---|
| 2026-07-17 | Buffy (orchestrator) | Spec authored. D-0043 / D-0044 / D-0045 ADRs drafted. State ledger entries added. |
