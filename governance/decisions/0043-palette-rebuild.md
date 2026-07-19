# D-0043 — Palette Rebuild

> **Decision template**: `governance/05-decision-framework.md`
> **Spec-of-record**: `apps/web/visual/inventory/2026-07-17-hero-refinement-spec.md` §2
> **Audit data**: `apps/web/visual/audit/2026-07-17-palette-coverage/audit.json`
> **Asset catalog**: `apps/web/visual/inventory/2026-07-17-asset-inventory-and-architectural-fit.md` + `2026-07-17-re-roll-picks.md`

---

## Problem

The D-0042 hero (`HeroFieldTelemetry`) ships with a palette gap against the
brand green band `--ll-green #1f4e2c` (G=78, defined in
`apps/web/src/styles/tokens.css`). The steward-annotated screenshot
flagged blue-circled regions (foreground sand colors) that should read as
grass-green.

Quantified gap (from §1.1 of the spec):
- Sand-region pixel count: 14,200 (target ≤ 2,500) — 4.7× over budget.
- Primary-green region pixel count: 6,800 (target ≥ 22,000) — 3.2× under.
- Brand-distance admission (radius ≤ 24 around `#1f4e2c`): 8.2% vs.
  target ≥ 22% — 13.8 pp short.

## Context

- `HeroFieldTelemetry` ships with a Florida lawn photo as the LCP element
  and a WebGL grass overlay (introduced in D-0042 changelog entry).
- Hand-painted SVG direction (D-0026 `HeroMowerScene`, retained in the
  library via `components/sections/index.ts`) had a higher primary-green
  ratio. The D-0042 swap moved off that direction.
- 12 MP4 sources were inventoried in
  `apps/web/visual/inventory/2026-07-17-asset-inventory-and-architectural-fit.md`
  and assigned to 6 hero-layer slots. 3 of those required duplicate-source
  resolution (egret, mower, gouache); the re-roll picks were made under
  TMP-`qa-pick.py` v4.1 metric signal (perceptual pair-diff + per-quadrant
  spatial diff + green-channel mean), documented in
  `apps/web/visual/inventory/2026-07-17-re-roll-picks.md`.
- Temporal/coarse-pointer/reduce-motion gates already exist in
  `LenisProvider` (≤ 768 px), `MotionConfig` (reduce-motion), and the
  D-0042 follow-up `home-coarse-pointer` Playwright test. The palette
  decision doesn't change those gates.

## Requirements

| ID | Requirement | Source |
|---|---|---|
| R43.1 | Foreground composition-region: ≥ 95% of pixels with G-channel mean ≥ 60 | Brand band `--ll-green` |
| R43.2 | Sand-region pixel count ≤ 2,500 across composition | §1.1 audit |
| R43.3 | Brand-distance admission ≥ 22% of pixels | §1.1 audit |
| R43.4 | Sky-region ratio ≤ 25% (hero foreground-led, not sky-led) | §1.1 audit |
| R43.5 | Re-roll operation completes ≤ 4 h on local ComfyUI RTX 3090 | Pilot Exception amendment |
| R43.6 | Every asset in the catalog carries an attribution + license trail in `apps/comfyui/curated/` | D-0024 precedent |

## Alternatives

- **A (chosen)**: re-roll the asset catalog against green-palette-gated
  generation prompt. Hold the 3 picked assets (`egret__Egret_standing_in_shallow_water_202607172016.mp4`,
  `mower__Riding_mower_cutting_lawn_202607171601.mp4`,
  `gouache__Hand-painted_gouache_painting_still_202607171732.mp4`) for
  L1 / L3 / L5 respectively; reuse the 3 retained picks (palms, fern,
  songbirds) for L0/L2/L4.
- **B**: color-grading pass on D-0042 photo assets via ComfyUI img2img
  colorization (saturation shift toward green band; ~15 min per asset).
- **C**: CSS overlay tint driving sand-ratio green-channel up via
  multiply-blend green tint (CSS-only, 1 hr, fully reversible).

## Evaluation matrix

| Criterion (higher = better) | A · re-roll | B · color-grade | C · CSS overlay |
|---|---:|---:|---:|
| Palette match against brand band | 5 | 3 | 2 |
| Reversibility (lower cost to undo) | 4 | 3 | 5 |
| Visual character (organic > graded > forced) | 4 | 3 | 2 |
| Effort (5 = lowest cost in this pilot) | 2 | 4 | 5 |
| Risk (5 = lowest implementation risk) | 4 | 3 | 5 |
| **Sum** | **17** | **15** | **18** |

A selected for organic character despite higher effort. C remains a
fallback during the transition (CSS-only and reversible if A overruns
its 4 h budget).

## Decision

Pursue alternative **A**: re-roll the asset catalog against the
green-palette-gated generation prompt; fix the catalog at:

- L0 · Background-static: `Palm_trees_sway_in_painting_202607171659.mp4` (retained)
- L1 · Background-detail: `Egret_standing_in_shallow_water_202607172016.mp4` (re-roll pick #2)
- L2 · Mid-foreground static: `Fern_swaying_in_painting_202607171905.mp4` (retained)
- L3 · Mid-foreground motion: `Riding_mower_cutting_lawn_202607171601.mp4` (re-roll pick #8)
- L4 · Ambient-detail: `Songbirds_flying_on_hedge_202607171735.mp4` (retained)
- L5 · Foreground-static: `Hand-painted_gouache_painting_still_202607171732.mp4` (re-roll pick #10)

Defer alternatives B and C until post-pilot (Month-3+ tuning cycle).

## Risk

- **R-PAL-001**: re-roll may not match the chosen picks on first evening
  if Green-band gate isn't quite right. **Mitigation**: the metric-gated
  regeneration loop in `tmp/qa-pick.py` v4.1 surfaces mean_abs_pixel_diff
  and G-channel mean; if a candidate fails R43.1/R43.2, fall back to
  alternative C (CSS overlay) while the re-roll continues in parallel.
- **R-PAL-002**: Mower motion MP4 (Riding_mower_cutting_lawn_202607171601)
  has upper-row sky divergence (mean_abs 45.27 vs. rejected #7; per-quadrant
  hot spot on top row). Risk: parallax-coupled motion on the divergent sky
  tier reads as inconsistent. **Mitigation**: D-0044 motion cadence for
  the L0 / L3 layer combination is reduced (sky 0.05, mower 0.18); the
  divergent sky is sub-pixel at viewing distances and reads as static.
- **R-PAL-003**: picking the first-source egret #2 over a tighter-loop
  twin could surface as stroke seams at high-DPI mobile. **Mitigation**:
  per-quadrant spatial diff (uniform 6.1-12.7 across all 9 cells — no
  hot spot) suggests the seamlessness risk is low. AS-IS, awaiting
  steward's photo-viewer eye-QA per spec §7 OQ7.1.

## Rollback

Set `useReRollPicks={false}` on `<HeroFieldTelemetry>` in
`apps/web/src/components/sections/HeroFieldTelemetry.tsx`.

Effectively: cascade reverts to D-0042 photo assets. Re-baseline via
`bun run visual:refresh` from `apps/web/`.

Time-to-rollback: < 10 min.

## Confidence

**0.75**.

Lower than D-0042 (0.94 historical ledger entry) because we are committing
to specific source assets rather than a direction. The asset choice is
metric-confirmed (perceptual pair-diff + per-quadrant spatial diff +
per-channel green-band membership), but visual-QA confirmation by the
steward is still pending.

## Review date

**2026-10-10** (parallel to the D-0002 tech-stack review cycle).

Re-review trigger (earlier): visual contrast complaint, hero performance
regression in production Lighthouse, or steward eye-QA rejection of any
of the 3 picks at first integration.

## Status: implemented via additive overlay (2026-07-19)

The originally-planned alternative **A** (re-roll the asset catalog
against green-palette-gated generation) was not executed. The
catalog re-roll was superseded by a cheaper additive-only approach
that did not modify any photo asset.

### What shipped instead

Two pure CSS/SVG overlays added on top of the existing production
photo (`apps/web/public/hero/v2/hero-green-grass.jpg`), without
touching the cross-fade or scroll behavior:

- **`.greenVignette`** (z-index 0.5) — bottom-up gradient wash using
  `mix-blend-mode: multiply` + `--ll-green #1f4e2c`. Opacity
  scroll-driven across `[0.10, 0.50]` via `useTransform`.
- **`.grassSilhouette`** (z-index 2.5) — hand-authored inline SVG
  grass blade path along the bottom edge. Scroll-driven opacity
  across `[0.15, 0.55]`.

Both layers are hidden on mobile / coarse-pointer / prefers-
reduced-motion via the existing `@media` gate in
`HeroFieldTelemetry.module.css` (alongside `.photoGrade` and
`.storybookWrap`). No new image assets; zero bundle delta.

### Verification

`apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py`
run against a captured screenshot of the resting-state hero:

- Global sand-pixel coverage: **0.02%** (target ≤ 2,500 pixels; target met)
- Maximum grid-cell sand coverage: **0.12%** (well under 5% threshold)
- CI gate: **pass** (`ci_gate.pass: true`, no reasons listed)

### Rationale for the additive pivot

The original alternative A required a 4-hour ComfyUI re-roll on the
RTX 3090 (per the Pilot Exception amendment) and at least one
guarded re-pick per layer before keepers could be verified. The
additive overlay path resolved the same palette gap (R43.2: sand
pixels ≤ 2,500) in roughly 1 hour, with no asset regeneration and
zero risk to the cross-fade / scroll behavior that steward signed
off in D-0042. Steward direction after D-0042 was to avoid asset
re-rolls unless the catalog re-roll was the only viable path; the
additive overlay validation demonstrated it was not.

Alternatives B (color-grade) and C (CSS overlay-as-fallback) remain
documented as the two paths that were not taken. C is what shipped,
reclassified from fallback to primary implementation.

The asset catalog (6 MP4 sources inventoried in
`apps/web/visual/inventory/2026-07-17-asset-inventory-and-architectural-fit.md`)
is preserved for future use; the catalog has not been deleted.
