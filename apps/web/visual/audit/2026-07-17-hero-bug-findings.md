# 2026-07-17 — Hero bug findings (D-0014 root cause + IDEMPOTENT baseline)

## Pre-fix baseline (byte-locked)

| Path | SHA256 | Size | Mtime |
|------|--------|------|-------|
| `apps/web/visual/baselines/hero-chromium-desktop.png` | `5c6823548fc540ecf52871d15026258b69a306c3b8325605d11af0f8c9efb754` | 1,436,183 B | 2026-07-17 17:04:03 |
| `apps/web/visual/baselines/.before-2026-07-17-hero-chromium-desktop.png` | `5c682354…` (sibling copy, locked pre-refresh) | 1,436,183 B | 2026-07-17 17:04:03 |
| `apps/web/visual/baselines/home-chromium-desktop.png` | `d3e4eb2c14ac3a56f6ad28ee01b80088c7bfeb5a9d3e8335464b7ebfb653356c` | byte-stable | 2026-07-17 17:04–17:05 |

**Verdict: IDEMPOTENT.** `bunx playwright test visual/components.spec.ts --update-snapshots --project=chromium-desktop --grep='hero' --workers=1` produced "1 passed (11.9s)" and a byte-identical canonical file. `cmp` against `.before-2026-07-17-hero-chromium-desktop.png` confirmed zero drift since 17:04. The route-level `home-*-chromium-desktop.png` family is also IDEMPOTENT (sha256 `d3e4eb2c…`); no incidental page drift outside the hero file.

## Annotated screenshot (steward 18:56)

The steward annotated `apps/web/visual/baselines/hero-chromium-desktop.png` with three circles:

- **Two blue circles** — on the lower-left and lower-center brown bands.
- **One red circle** — on the right edge where the photo bleeds visibly past the content boundary.

## Symptom mapping (file-grounded line refs)

| Annotation | Symptom                              | File                                                  | Token / line ref                                |
|------------|--------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| Blue L     | Foreground grass brown band          | `apps/web/src/components/sections/HeroStorybookLayer.tsx`, Near layer grass gradient | `<linearGradient id="grass">` clay → palm-bark  |
| Blue C     | Mid-layer clay band                  | `apps/web/src/components/sections/HeroStorybookLayer.tsx`, Mid layer clay path     | `var(--ll-clay)` opacity 0.5 path ~line 290     |
| Red R      | Photo right-edge bleed               | `apps/web/src/components/sections/HeroFieldTelemetry.module.css`, `.photoWrap`     | No `mask-image` rule currently defined          |

## Subsumed cause (not annotated)

The `<Mower position={progress} />` JSX call (~line 285 of `HeroStorybookLayer.tsx`) plus the `function Mower({ position })` block (~lines 287+) renders a small grey vehicle that crosses the brown mid-band. Even after green-swap, the Mower's wheel rotation would sit visibly on the brown band temporarily. So **Mower removal is included in D-0014** to prevent post-fix regressions on the same visual axis.

## Decision

See `governance/decisions/0014-hero-foreground-grass-and-edge-mask.md` (D-0014).

## Verification target (post-fix)

After D-0014 lands:
- New `hero-chromium-desktop.png` SHA256 must differ from `5c682354…`.
- Visual delta must show: grass-family color on foreground bands, right-edge fade, no Mower SVG.
- Diff pixel count must stay below `maxDiffPixels: 200 / threshold: 0.2` when compared to a SECOND sibling, `.after-d0014-2026-07-17-hero-chromium-desktop.png`, written from the post-fix PNG.

## Cross-baselines (sanity check beyond hero)

The route-level home page baselines (`home-chromium-desktop.png`, `home-reduced-motion-chromium-desktop.png`, `home-coarse-pointer-chromium-desktop.png`) are all byte-identical across the pre-refresh refresh window (sha256 `d3e4eb2c…`). The page-rendering pipeline has not drifted outside the hero file.

## Amendment 1 - grass-tip recolor + visual-verification caveat (2026-07-17, post-implementation)

Following the implementation re-review, the foreground blade-stroke gradient (`<linearGradient id="grass-tip">` in NearLayer) was recolored from `var(--ll-sand)` -> `var(--ll-grass-mow)` and `var(--ll-clay)` -> `var(--ll-grass-deep)` per the in-place ADR amendment.

### Acceptance criteria for Amendment 1 (ground-truth via static grep):
- Source-level: `grep -c '--ll-grass-mow' apps/web/src/components/sections/HeroStorybookLayer.tsx` returns 2 (id="grass" + id="grass-tip"). VERIFIED OK.
- Source-level: `grep -c '--ll-grass-deep' HeroStorybookLayer.tsx` returns 2 (id="grass" + id="grass-tip"). VERIFIED OK.
- Token presence: `grep -c -- '--ll-grass\b' tokens.css` returns 3. VERIFIED OK.

### Visual-verification caveat (test-grain limitation):
The post-implementation playwright refresh produced byte-identical baseline `c10d841d...` versus the prior post-NearLayer-recovery baseline. This is NOT a regression - it is expected test behavior given:

1. `apps/web/playwright.config.ts` line ~67 sets `use.contextOptions.reducedMotion = 'reduce'` globally for both `chromium-desktop` and `chromium-mobile` projects.
2. `HeroFieldTelemetry.tsx` `useEffect` collapses `enableScrollFade` to `false` when `reducedMotion` is true, unmounting `<div className={styles.storybookWrap}>`.
3. NearLayer (which contains the recolored `id="grass-tip"` gradient) only renders inside the storybook layer.
4. With `reducedMotion='reduce'`, the storybook layer is unmounted during the playwright capture. NearLayer is not in the DOM. The grass-tip gradient is therefore not rendered into the screenshot.

### Verification path (deferred): non-reduced-motion playwright capture
To verify Amendment 1's visual effect, run a non-reduced-motion capture. Options:
- Edit `apps/web/playwright.config.ts` to set `use.contextOptions.reducedMotion = 'no-preference'` for the desktop project, run the targeted refresh, restore.
- Spawn `browser-use` agent against `http://localhost:3000` after a production build, with explicit `prefers-reduced-motion: 'no-preference'` chrome flag.
- Author a sister spec file `visual/hero-noreduction.spec.ts` with `test.use({ reducedMotion: 'no-preference' })`, run targeted.

### Rollback / sign-off
- If the source-level grep verification (above) is acceptable as the binding check for Amendment 1, no further action is required for sign-off.
- If a visual-verification capture is required, queue it as a follow-up ADR (`D-0015` candidate, alongside the mask viewport-gate amendment).
