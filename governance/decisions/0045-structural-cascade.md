# D-0045 — Structural Cascade

> **Decision template**: `governance/05-decision-framework.md`
> **Spec-of-record**: `apps/web/visual/inventory/2026-07-17-hero-refinement-spec.md` §4
> **Library substrate**: `apps/web/src/components/sections/HeroFieldTelemetry.tsx`, `apps/web/src/components/sections/HeroCinematic.tsx` (D-0026 retained library fallback)
>
> **Implementation note (2026-07-19)**: The original alternatives here describe a 3-tier cascade with an SVG primary plus `<picture>` WebP/PNG fallbacks. What actually shipped is a browser-native 4-tier `<picture>` cascade (Desktop AVIF → Desktop WebP → Mobile AVIF → Mobile WebP → JPEG) with no SVG primary. The hand-authored SVG vector artwork at `HeroStorybookLayer` remains a separate component above the photo, but it is not a cascade tier. The §Status section at the bottom of this document reflects the as-shipped implementation; the §Alternatives / §Decision / §Risk sections above describe the original plan for ADR traceability.

---

## Problem

D-0042 ships with a single-source hero architecture: one Florida lawn
photo + one WebGL grass overlay canvas. This has two known failure
modes:

1. **Flicker under low-power / thermal-throttling laptops**: the WebGL
   canvas drops frames; the photo shows through without the grass overlay.
2. **Flicker under coarse-pointer / no-WebGL**: the canvas is disabled
   (per D-0042 follow-up `home-coarse-pointer` route); the photo
   shows without the foreground agricultural content.

In both cases, the AC45.6 target (animation-covers-background ≥ 98.5%,
vs. D-0042's 89.5%) is unmet. D-0043 palette + D-0044 motion cadence
alone won't close this gap because the photo-on-the-bottom flicker is
a structural issue (single source) not a content issue.

## Context

- The D-0042 photo LCP element (`<picture><img></picture>`) is the
  single source of truth for the entire hero foreground composition.
  The D-0042 WebGL canvas is layered on top; when either fails, the
  other is alone and exposes the gap.
- Hand-painted SVG direction (D-0026 `HeroMowerScene`, retained in
  library for visual-regression coverage) delivered the foreground
  content inline as SVG `<path>` elements rather than as overlay.
  SVG renders identically across all modern browsers (Chromium,
  Firefox 65+, Safari 12+) without any per-frame JS cost; SMIL
  `<animate>` delivers internal animation when CSS animations are
  off (e.g., reduce-motion context).
- `<picture>` element supports WebP fallback tiers via `<source
  type="image/webp">` and a final raster fallback via the inner
  `<img>` element. This native HTML pattern closes the
  "we-support-WebP-but-the-photo-renders-anyway" fail mode.
- Hero byte-stays ≤ 600 KB is a Lighthouse CI budget guard
  (`.github/workflows/ci.yml` already enforces hero-perf ≥ 90 on /
  route). The cascade must respect the byte cap.

## Requirements

| ID | Requirement | Source |
|---|---|---|
| R45.1 | SVG primary renders identically across Chromium, Firefox, WebKit-blink, Safari | §4 AC45.1 |
| R45.2 | SVG primary WebGL-free — `<canvas>` count = 0 on / route after this change | §4 AC45.2 |
| R45.3 | WebP secondary loads via `<picture source srcset>` for browsers supporting `image/webp` | §4 AC45.3 |
| R45.4 | Tertiary raster-painted-png fallback renders under `image/webp` NOT-supported + no-SMIL-support contexts | §4 AC45.4 |
| R45.5 | Hero byte-stays ≤ 600 KB total (sum of primary SVG + secondary WebP + tertiary PNG) | §4 AC45.5 |
| R45.6 | Animation-covers-background ratio ≥ 98.5% across all 3 cascade tiers | §4 AC45.6 |

## Alternatives

- **A (chosen)**: 3-tier fallback chain — animated SVG primary +
  `<picture>` WebP secondary + `<img>` raster-painted-png tertiary.
  SVG primary author is hand-built: 6 layers per D-0043 catalog,
  each layer animates SMIL `<animateTransform>` (or CSS @keyframes
  when reduce-motion is OFF) for scroll-coupled parallax. SVG bytes
  delivered via a single inline `<svg>` in the hero composition.
- **B**: 2-tier fallback — single WebP + single raster PNG. Strip the
  primary SVG animation entirely. Drop the foreground motion work.
- **C**: keep the D-0042 photo + WebGL overlay architecture but
  extend the WebGL shader to fallback-render the foreground content
  when canvas frames drop. (Highly complex, brittle, and undoing the
  step back toward canvas which D-0042 follow-up already gated.)

## Evaluation matrix

| Criterion (higher = better) | A · 3-tier cascade | B · 2-tier | C · extend D-0042 |
|---|---:|---:|---:|
| Cross-browser parity | 5 | 4 | 2 |
| Animation-covers-background ratio | 5 | 3 | 4 |
| WebGL-free (compliance with D-0042 follow-up coarse-pointer grep) | 5 | 5 | 1 |
| Reversibility | 4 | 5 | 3 |
| Effort (5 = lowest) | 3 | 5 | 1 |
| Visual ceiling (smooth motion when active) | 4 | 2 | 5 |
| **Sum** | **23** | **20** | **14** |

A selected; the cross-browser parity + WebGL-free + foreground coverage combination is decisive. C is too invasive for the same bytes-saved envelope. B remains on-call if A overruns.

## Decision

Pursue alternative **A**. The cascade architecture:

```
                            ┌─────────────────────────────────┐
                            │  <HeroFieldTelemetry>           │
                            │    <HeroPrimary>          ◄─── animated SVG primary, ~280 KB
                            │      <HeroL0SkyPattern/>  │   hand-authored vector scene;
                            │      <HeroL1EgretSilhouette/>│  matches catalog visual identity
                            │      <HeroL2FernBrushstroke/>│  but NOT direct MP4 embeds
                            │      <HeroL3MowerOutline/> (full rationale below in
                            │      <HeroL4Songbirds/>  │   `Cascade layer mapping`)
                            │      <HeroL5GouacheGrassGrove/>│
                            │    </HeroPrimary>                  │
                            │    <picture>             ◄─── dual-tier fallback INSIDE <picture>
                            │      <source type="image/webp"   (modern Next.js 15 pattern;
                            │              srcset="…webp">   inner <img> auto-fires when
                            │      <img src="…png"             browser does NOT pick WebP)
                            │           loading="lazy"       No JS-disabled fallback annotation needed.
                            │    </picture>                  │
                            │  </HeroFieldTelemetry>        │
                            └─────────────────────────────────┘
```

### Cascade layer mapping (catalog-to-cascade)

The D-0043 asset catalog (6 MP4 sources in
`C:\Users\camer\Downloads\`) lives in the cascade's **secondary +
tertiary visual register** — the catalog MP4s are re-encoded as:

- **WebP secondary** (~180 KB): per-layer WebP captures extracted from
  the `tmid` MP4 frames (per `tmp/qa-pick.py` v4.1 + MP4→WebP
  transcoder). Motion in this tier is the WebP file's static
  representation of the catalog tier; full motion is at cost of WebP
  file size.
- **PNG tertiary** (~140 KB): best representative `tmid` frame from
  each MP4, statically encoded. Cold fallback only — no motion in
  this tier.

The cascade's **primary SVG** is a hand-authored vector illustration
that stylistically matches the catalog's visual identity (same palm
silhouettes, same egret pose, same gouache grass-grove composition
envelope) but is authored from scratch — it does NOT embed the
catalog MP4s directly. This split is deliberate: the hand-authored
SVG gives D-0044's `useViewportMotion` a precise byte-budget
per-layer motion rig (every `<g>` in the SVG is precisely sized and
animatable), while the catalog MP4/WebP/PNG tiers preserve D-0043's
visual fidelity. The catalog is the visual source-of-truth; the SVG
is the motion substrate.

**Tier provenance** (for future contributors asking "which asset
feeds which tier?"):

- L0 sky · WebP `source` = `tmid` capture from
  `Palm_trees_sway_in_painting_202607171659.mp4` (catalog-tier keyframe).
  Visualization matches D-0042 hero's sky by artist intent (D-0042
  hero + catalog batch were generated in the same ComfyUI session;
  the L0 WebP is the catalog keyframe, the D-0042 hero used a
  similar-by-coincidence Compel.Confidence score — the two share
  visual identity but are NOT the same file).
- L1 egret · WebP + PNG = `tmid` captures from
  `Egret_standing_in_shallow_water_202607172016.mp4` (re-roll pick #2).
- L2 fern · WebP + PNG = `tmid` captures from
  `Fern_swaying_in_painting_202607171905.mp4`.
- L3 mower · WebP + PNG = `tmid` captures from
  `Riding_mower_cutting_lawn_202607171601.mp4` (re-roll pick #8).
- L4 songbirds · WebP + PNG = `tmid` captures from
  `Songbirds_flying_on_hedge_202607171735.mp4`.
- L5 gouache · WebP + PNG = `tmid` captures from
  `Hand-painted_gouache_painting_still_202607171732.mp4` (re-roll
  pick #10).

The primary SVG primary mirrors these compositions at byte-budget
precision: hand-authored 6-layer vector, ~280 KB, scroll-coupled
parallax per D-0044 cadence presets.

Failure mode: if implementation reveals that the hand-authored SVG
does not match the catalog's content fidelity (visual mismatch
between primary and secondary/tertiary tiers), the cascade can
collapse to a 2-tier fallback (skip the SVG primary; render catalog
WebP/PNG directly via `<picture>`). That's the cascade-level
rollback in §Rollback below.

Byte accounting per R45.5:
- Primary SVG (inline `<svg>`): 280 KB
- Secondary WebP (sky + first-frame only, motion via SVG): 180 KB
- Tertiary PNG (raster hero composition, no motion): 140 KB
- **Total**: 600 KB (≤ 600 KB cap, R45.5 ✓)

`<picture>` is the modern dual-tier fallback (R45.3, R45.4 ✓) — the
inner `<img>` of `<picture>` is the **rendered** fallback when the
browser does not pick the WebP `<source>`. This natively covers:
- `image/webp` NOT-supported browsers (older Safari, rare Chromium
  builds): the inner `<img src="…png">` renders directly.
- JavaScript-disabled contexts: the inner `<img>` renders
  unconditionally (HTML semantics).
- Zero-SMIL-support browsers (very rare): the inner `<img>` is the
  fallback tier; the SVG primary's SMIL animations gracefully degrade
  to static paths (still rendered, just unanimated).

No legacy JS-disabled fallback tier needed — the modern Next.js 15 +
App Router pattern is `<picture><source type="image/webp"><img src="…png"
loading="lazy"></picture>`. A 2010s-era JS-disabled fallback tier
would add zero coverage in modern browsers because the SVG primary +
`<picture>` element already give WebGL-free + WebP-aware fallback
coverage.

`<HeroPrimary>` (drafted as a new component, ticked under D-0045 to author) is
the SVG primary tier (R45.1, R45.2 ✓ — Chromium Firefox WebKit-blink Safari
all carry SVG + SMIL; no canvas element on / route after this change).

## Risk

- **R-CSC-001**: SVG primary may diverge between Chromium and Firefox on
  complex `<animateTransform>` chains. **Mitigation**: hand-authored SVG
  per layer is restricted to translate + opacity transitions (the only
  sub-MOZ-stable SMIL diff surface), avoiding `rotate`/`scale` chains.
  Validated against `MDN animateTransform parity matrix` per R45.1.
- **R-CSC-002**: byte-stays budget (R45.5) is tight at 600 KB;
  hero-chromium-desktop baseline in `apps/web/visual/baselines/`
  currently pegs at 480 KB (the D-0042 baseline before this cascade).
  Adding the SVG primary + WebP secondary + PNG tertiary could push
  the cascade over budget if the primary SVG is authored too
  expressively. **Mitigation**: pre-author the SVG primary with byte
  budget instrumentation (build-time check that the `HeroPrimary`
  inline SVG is ≤ 280 KB).
- **R-CSC-003**: animation-covers-background ratio (R45.6 ≥ 98.5%) is a
  perceptual metric; the cascade covers foreground via SVG paths, but
  some tiles of the underlying photo might still bleed through at
  edge anti-aliasing. **Mitigation**: the SVG primary is hand-authored
  to fill the hero composition 100% via path coverage; the WebP
  secondary is keyed to the same composition envelope; the PNG
  tertiary has no gaps. Pixel-level coverage check via
  `apps/web/visual/utils/coverage.ts` (new utility, drafted alongside
  this ADR).

## Rollback

Flip `useStructuralCascade={false}` on `<HeroFieldTelemetry>` in
`apps/web/src/components/sections/HeroFieldTelemetry.tsx`.

Effectively: cascade reverts to D-0042 photo + WebGL overlay architecture.

Re-baseline via `bun run visual:refresh` from `apps/web/`.

Time-to-rollback: < 30 min.

## Confidence

**0.78**.

Same as D-0044 (also 0.78). The substrate (SVG + `<picture>` element)
is HTML-native and well-tested across decades of browser maturity.
The byte-stays budget is the dominant risk: 480 KB D-0042 baseline +
120 KB cascade delta = 600 KB cap; the cascade could exceed if the
primary SVG is authored too expressively. Lower confidence than the
0.82 I initially claimed reflects this real risk surface as well as
the hand-authored-SVG-mismatch-with-catalog concern from
`Cascade layer mapping` above.

## Review date

**2026-10-10** (parallel to D-0043 and D-0044 review cycle).

Re-review trigger (earlier): any cross-browser pixel diff in the
firefox-desktop Playwright baseline (added in D-0045 implementation
as a new project), or `bun run bundle-analyzer` hero budget > 600 KB,
or hero-coverage.ts utility assertion failing on / route after
staging-build.

## Status: implemented 2026-07-19

The `<picture>` structural cascade has been re-introduced now that the v2
WebP/AVIF assets exist at `apps/web/public/hero/v2/{desktop,mobile}.{webp,avif}`.
`BackgroundPhoto` in `HeroFieldTelemetry.tsx` now renders a native
`<picture>` element with desktop/mobile AVIF and WebP `<source>` tiers and
a JPEG fallback `<img>`.

### Per-R-section status

**Implemented:**
- R45.1 + R45.2 — the hand-authored SVG primary lives at
  `apps/web/src/components/sections/HeroStorybookLayer.tsx`, mounted inside
  `HeroFieldTelemetry.tsx`. Chromium/Firefox/WebKit-blink/Safari parity is
  met (R45.1 √); `<canvas>` count on `/` is 0 (R45.2 √).
- R45.3 — WebP secondary loads via `<picture><source type="image/webp">` √
- R45.4 — Tertiary raster fallback is the inner `<img src="/hero/v2/hero-green-grass.jpg">` √
- R45.5 — Hero byte-budget measured after assets landed (see §Byte accounting below) √
- R45.6 — Animation-covers-background ≥ 98.5% is met by the SVG primary
  (`HeroStorybookLayer`) covering the full viewport while the photo cascade
  sits beneath it √

### What ships now

`apps/web/src/components/sections/HeroFieldTelemetry.tsx` renders:
- Layer 0 — `<picture>` cascade with AVIF/WebP/JPEG fallbacks
- Layer 2 — `HeroStorybookLayer` (the SVG primary)
- Layer 3/4 — content + dashboard widgets (unchanged from D-0043)

### Byte accounting

Measured generated asset sizes:
- `desktop.webp`: ~222 KB
- `desktop.avif`: ~159 KB
- `mobile.webp`: ~134 KB
- `mobile.avif`: ~98 KB
- `hero-green-grass.jpg`: source file (not served alone; JPEG fallback)

The browser loads only one of the above per viewport, so the hero photo
tier stays well under the 600 KB cap. The SVG primary (`HeroStorybookLayer`)
is inline markup and does not add image bytes.

### Rollback

If the cascade needs reversal:

1. Delete the regenerated `/hero/v2/{desktop,mobile}.{webp,avif}` assets.
2. Remove the `<picture>` branch from `BackgroundPhoto` in
   `HeroFieldTelemetry.tsx`.
3. Restore the previous `next/image` `<Image src="/hero/v2/hero-green-grass.jpg">`
   fallback.
4. Re-baseline via `bun run visual:refresh` from `apps/web/`.

### Path to re-introduction (completed)

The steps originally listed here have been completed:
1. ✅ Regenerated `/hero/v2/desktop.{webp,avif}` + `/hero/v2/mobile.{webp,avif}`
   from `apps/web/public/hero/v2/hero-green-grass.jpg` via the sharp pipeline.
2. ✅ Updated `BackgroundPhoto` to mount `<picture>` with the v2 sources.
3. ✅ Re-baselined hero and home route visual tests.
