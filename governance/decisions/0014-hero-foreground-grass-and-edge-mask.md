# D-0014 — Hero foreground grass + right-edge photo mask + Mower removal

## Problem

The production hero (`HeroFieldTelemetry.tsx` + `HeroStorybookLayer.tsx`)
renders the foreground grass in clay/bark tones (`var(--ll-clay)` #b5651d,
`var(--ll-palm-bark)` #1a1f1b) instead of palm-green tokens, producing two
brown-footprint bands visible to every visitor on first paint. Separately,
the 4K Florida-lawn photograph in `BackgroundPhoto` renders with no
right-edge clip or mask, so the photo's right seam bleeds against the
page's cream background with a visible discontinuity. A third subsumed
cause — the still-rendered Mower SVG (`<Mower position={progress} />` in
`HeroStorybookLayer.tsx` ~line 285) — produces a small grey vehicle on
top of the brown mid-band.

All three were observed and annotated by the steward at 2026-07-17 18:56
and were, on the same day, independently verified to be byte-identical
to the 17:04 desktop baseline locked at
`apps/web/visual/baselines/.before-2026-07-17-hero-chromium-desktop.png`
(sha256 `5c6823548fc540ecf52871d15026258b69a306c3b8325605d11af0f8c9efb754`,
1,436,183 B, IDEMPOTENT playwright refresh verdict at 17:13). The
byte-locked baseline + the steward screenshot + the file-grounded line
references are captured in `apps/web/visual/audit/2026-07-17-hero-bug-findings.md`.

## Context

- Charter principle #3 binds this work: "Specification before
  implementation. No code lands without an approved spec." This ADR
  is that spec for the foreground-grass + edge-mask + Mower-removal
  bundle.
- D-0008 (page-load performance ≤ 2.5s LCP, no video on hero) forbids
  introducing new image layers. Fixes use the existing SVG gradient +
  a single CSS mask — no new `<Image>` elements.
- D-0016 sources document Mower as "dropped" but `HeroMowerScene.tsx`
  was ported into `HeroStorybookLayer.tsx` during the D-0043 cinematic
  cross-fade work (2026-07-17) and never removed. The Mower SVG is
  still rendered.
- `apps/web/src/styles/tokens.css` already defines `--ll-green:
  #1f4e2c`, `--ll-palm-shadow: #2d5a3d`, `--ll-palm-light: #6b9b7e`,
  `--ll-sage-muted: #8fa89b`. None of them are wired into the
  foreground-grass paths. Three new derived tokens (`--ll-grass`,
  `--ll-grass-mow`, `--ll-grass-deep`) close the gap via `color-mix`
  against the existing tokens — no invented hex values.

## Requirements

1. **Add 3 new CSS custom properties to `apps/web/src/styles/tokens.css`,
   derived from `--ll-green` + `--ll-palm-shadow` via `color-mix(in
   oklab, …)`**:
   - `--ll-grass` — mid green; foreground grass base
   - `--ll-grass-mow` — freshly-cut grass tone; grass tip
   - `--ll-grass-deep` — deep grass; root shadow
2. **`apps/web/src/components/sections/HeroStorybookLayer.tsx` Near-
   layer grass gradient (`<linearGradient id="grass">`)** swaps from
   `var(--ll-clay)` → `var(--ll-palm-bark)` to
   `var(--ll-grass-deep)` → `var(--ll-grass-mow)`.
3. **Far-layer sand path** (`fill="var(--ll-sand)" opacity="0.5"`)
   recolors to `fill="var(--ll-palm-light)" opacity="0.45"` so the
   far horizon reads as grass, not Florida earth.
4. **Mid-layer sand band** (`fill="var(--ll-sand)" opacity="0.6"`)
   recolors to `fill="var(--ll-palm-light)" opacity="0.5"`.
5. **Mid-layer clay band** (`fill="var(--ll-clay)" opacity="0.5"`)
   recolors to `fill="var(--ll-grass)" opacity="0.5"`.
6. **Mower SVG removed** — both the JSX call
   `<Mower position={progress} />` and the dead `function Mower…`
   block deleted from `HeroStorybookLayer.tsx`. The associated CSS
   selectors `.mower`, `.mower svg`, `.mowedPath`, `.mowerTrail`
   and the mobile `@media (max-width: 768px) { .mower { bottom: 18% }
   }` rule are also deleted from `HeroStorybookLayer.module.css`.
7. **`apps/web/src/components/sections/HeroFieldTelemetry.module.css`
   `.photoWrap`** gains a right-edge `mask-image` so the photograph
   fades into cream at the right edge:
   ```
   mask-image: linear-gradient(to right, black 0%, black 86%, transparent 100%);
   -webkit-mask-image: linear-gradient(to right, black 0%, black 86%, transparent 100%);
   ```

## Alternatives

### Alt A — Drop the entire storybook layer on desktop
Would yield an instant fix (no brown possibility). **Rejected** — the
storybook layer IS the brand identity (warm Florida sunset + palms +
birds that dissolves into the working operation). Charter principle #6
(automation) + brand/guidelines.md require the storybook layer.

### Alt B — Add a photographic green-grass overlay
A real PNG of cut grass could mask the brown without touching SVG.
**Rejected** — D-0008 budget (LCP ≤ 2.5s). A second LCP-eligible
`<Image>` on the hero would push LCP past 2.0s even with priority
hints. Token swap replaces the visual with the same zero-RTT path.

### Alt C (chosen) — Token swap + Mower removal + edge mask
No new assets. All CSS / SVG edits stay inside their existing files.
Net diff: ~25 lines added, ~35 lines removed. Browser cost: zero new
DOM, zero new images, zero new motion. Resting-state LCP unchanged.

### Alt D — WebGL grass overlay (rejected 2026-07-17)
Removed 2026-07-17 because SDF blades rendered as incoherent green
shards. Re-introducing it requires an architecture-level amendment,
which is out of scope for this ADR.

## Evaluation matrix

| Criterion                                | Alt A | Alt B | Alt C (chosen) | Alt D |
|------------------------------------------|-------|-------|----------------|-------|
| Fixes brown foreground bands             | YES   | YES   | YES            | YES   |
| Fixes right-edge bleed                   | NO*   | NO*   | YES            | NO*   |
| Removes Mower (subsumed brown cause)     | YES+  | NO    | YES            | NO+   |
| LCP impact                               | 0     | +800ms| 0              | +120ms|
| File diff size                           | −100 LoC | +0 LoC + asset | ±25 LoC | +400 LoC |
| Brand fidelity preserved                 | NO    | YES   | YES            | YES   |
| Charter #3 (spec before impl)            | met   | met   | met            | met   |
| Reviewable in <1 sitting                 | YES   | YES   | YES            | NO    |

`*` Alt A, B, D do not address the right-edge photo bleed.
`+` Alt A removes the storybook so the Mower goes with it; Alt D
re-introduces WebGL where Mower was already integrated.

## Decision

Adopt **Alt C**:
1. Add 3 derived grass tokens to `tokens.css`.
2. 4 sed-style recolors in `HeroStorybookLayer.tsx` (Near grass,
   Far sand, Mid sand, Mid clay).
3. Delete `<Mower position={progress} />` JSX site + the dead
   `function Mower…` block from `HeroStorybookLayer.tsx`.
4. Delete `.mower`, `.mower svg`, `.mowedPath`, `.mowerTrail`,
   and the mobile `.mower` rule from
   `HeroStorybookLayer.module.css`.
5. Add `.photoWrap` right-edge `mask-image` to
   `HeroFieldTelemetry.module.css`.

## Risk

| Risk                                                  | Like | Imp  | Mitigation |
|-------------------------------------------------------|------|------|-----------|
| Color saturation drift on first paint                 | LOW  | LOW  | Tokens are `color-mix` derived; verified via IDEMPOTENT-refresh |
| Mower removal shifts other scroll motion              | LOW  | LOW  | D-0043 timing curves remain; playwright catches drift |
| Edge-mask interacts with iOS notch area               | MED  | LOW  | Mask covers only right 14%; notch is top — no overlap |
| Right-edge mask fights `object-fit: cover` semantics  | LOW  | LOW  | Mask applied on wrapper, not on `<Image>`; `object-fit` untouched |
| Sand-band recolor too saturated (over-greens)         | MED  | LOW  | Use `--ll-palm-light` (muted-green) for recolor, not `--ll-green` |

## Rollback

1. `git revert` on the D-0014 commit.
2. Re-run targeted playwright refresh (`--grep='hero'` flag Validated
   as the substring pattern Playwright matches); the new baseline
   must byte-match `.before-2026-07-17-hero-chromium-desktop.png`
   (sha `5c682354…`, 1,436,183 B) to certify a clean rollback.
3. Tokens added to `tokens.css` are derivative (`color-mix` from
 

## Amendment 1 (2026-07-17, post-implementation)

Post-implementation review surfaced a residual brown stroke on the 60 foreground grass blades in NearLayer. The `id="grass-tip"` linearGradient (below the recoloured `id="grass"` ground fill) still used `var(--ll-sand)` -> `var(--ll-clay)` for the per-blade stroke - exactly the brown-tuft pattern the steward annotated at 18:56. Requirement #2 was strictly read as "the ground fill linearGradient"; a charitable reading covers both gradients (ground + per-blade stroke) as "the foreground grass gradient family". This amendment extends the recolor to the per-blade stroke so the cascade is complete.

Scope:
- D-0014 §Requirement 2 (extended): Near-layer grass gradient family (`<linearGradient id="grass">` ground fill AND `<linearGradient id="grass-tip">` per-blade stroke) swaps from clay / palm-bark / sand tones to `var(--ll-grass-deep)` -> `var(--ll-grass-mow)`.
- Acceptance criterion (new): after edit, Near-layer region of `apps/web/src/components/sections/HeroStorybookLayer.tsx` contains no `var(--ll-clay)` / `var(--ll-palm-bark)` / `var(--ll-sand)` references.
- Risk: LOW. Two-line CSS edit (`--ll-sand` -> `--ll-grass-mow`, `--ll-clay` -> `--ll-grass-deep`) applied to the existing `<linearGradient id="grass-tip">` stops.
- Rollback: revert the 2-line edit AND revert this amendment note.
- Charter rationale: stricter reading of the original scope, not a new requirement. Amendment stays on the same ADR file so the audit chain is single-page.
- Review date: 2026-07-31 (unchanged).
- by: "Buffy (orchestrator, post-implementation review, 2026-07-17)"
