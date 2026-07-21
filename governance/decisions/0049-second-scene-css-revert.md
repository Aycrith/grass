# D-0049 — Revert D-0048 Three.js 2.5D; restore pure-CSS SecondScene

> **Decision template**: `governance/05-decision-framework.md`
> **Spec-of-record**: this ADR
> **Library substrate**: `apps/web/src/components/sections/SecondScene.tsx`, `SecondScene.module.css`, `HeroFieldTelemetry.tsx`, `HeroFieldTelemetry.module.css`, `apps/web/src/lib/content.ts`, `apps/web/src/app/hero-3d-test/page.tsx`, `apps/web/package.json`, `apps/web/scripts/fix-v2-asset-letterbox.py`, `apps/web/public/hero/layers/v2/{fern,songbirds}-*.webp`
> **Commit of record**: pending (Phase 7 commit)

---

## Problem

D-0048 (commit `5250b37`, 2026-07-20) shipped a Three.js 2.5D plane stack for the
hero's second scene. Three separate planes — BG scene2 / MID palms / FG fern —
each textured with a different VEO-painted strip, with camera orbit, per-plane
wind sway, per-plane texture cycling, and cream fog. The redesign was
intended to fix a "fragmented 3-timestamp mashup" from the previous Wave 4
gouache attempt, but it produced a worse problem: a **dark vertical column
in the center of the scene 2 panel** where the BG scene2 plane's geometry
didn't cover the visible area. The result was an incoherent scene with
visible palm/fern strips on the edges and a dark gap in the middle.

Beyond the visual bug, the D-0048 stack had three additional costs:

1. **~150KB three.js + R3F + drei** in the deferred bundle (verified 238kB
   First Load JS reduction when it was dynamic-imported, but still adding
   150kB+ to the scene 2 mount path).
2. **WebGL dependency** that fails in headless Chrome SwiftShader —
   visual confirmation only possible in a real browser via
   `/hero-3d-test` route.
3. **Camera frustum math** that didn't actually cover the visible panel
   — the BG plane was sized for `32×17` at `z=-15` with fov=50, but the
   actual visible area at that depth was different, leaving a column
   of canvas-clear-color visible.

The user's directive to "use the pre-existing coherent access assets that
have existed up to this point" makes the D-0048 stack the wrong answer.
The painted VEO frames (scene2-01..06.webp) are complete, coherent
Florida-ranch-house scenes — they were always meant to fill the panel
edge-to-edge as a single full-bleed background, not be split into
Three.js planes with depth math.

## Solution

**Drop the Three.js stack entirely. Restore the Wave 4 (commit `99dbf05`)
pure-CSS SecondScene approach, but use the new (better) `scene2-01..06.webp`
frames instead of the old letterboxed `gouache-01..06.webp`.**

The Wave 4 implementation was simple and worked:
- 6 frames as CSS background-image with `steps(1, end)` cycle
- 10s per frame (meditative hand-painted stillness, not a flipbook)
- A palms strip overlay with `mix-blend-mode: multiply` for foreground
  parallax (12s cycle, drifts in/out of phase)
- Editorial pull-quote content overlay

The new `scene2-01..06.webp` frames are an upgrade: full-bleed (no
letterbox bars), 1240×680 with paper-cream border already cropped, and
each frame is a near-identical painted scene with subtle differences
(mower position shifts, sun has minor variations). The new frames were
always meant to be used as a single full-bleed background, not split
into three planes.

The palms strip is now used as a foreground parallax layer with
`mix-blend-mode: multiply` at bottom-right — overprinting the painted
scene like a hand-painted foreground element. This is a Wave 4
pattern (the `secondScenePalms` from commit `99dbf05`) that the D-0048
overhaul removed in favor of the WebGL plane-stack approach.

## What changed

### New files
- `apps/web/src/components/sections/SecondScene.tsx` (~190 lines) —
  the pure-CSS component. Renders 6 painted scene2 frames as
  background-image + 6 palms frames as foreground parallax +
  editorial pull-quote content overlay.
- `apps/web/src/components/sections/SecondScene.module.css` (~200
  lines) — the CSS-step keyframe animations for both layer cycles +
  layout styles for the content overlay.
- `apps/web/audit/d-0049-second-scene/hero-y*.png` (8 captures at
  scroll positions 0, 600, 1200, 1700, 1900, 2100, 2500, 2900) —
  visual evidence the new scene 2 fills the panel coherently.

### Modified files
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`:
  - Removed `next/dynamic` import of HeroScene3D.
  - Replaced `<HeroScene3D />` call site with `<SecondScene />`.
  - `parseScene2Headline.italicKeywords` restored to D-0047's
    `['yard', 'week', 'every week']` list (dropped the D-0048
    "Tuesday" keyword which was a copy regression).
  - `grassOpacity` extended from `[0.1, 0.3]` to `[0.1, 0.3, 0.4, 0.7]`
    with a fade-out leg so the dark brand-green grass silhouette
    dissolves as scene 2 cross-fades in. Without this, the
    silhouette reads as a black saw-tooth stripe across the
    bottom of the bright painted scene 2.
  - `greenVignetteOpacity` extended similarly with a fade-out leg.
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css`:
  - `.root` and `.viewport` background-color switched from
    `var(--ll-palm-bark)` to `var(--ll-cream)`. The previous dark
    root bg was the source of the pre-existing "dark column"
    visual bug: the storybook SVG has transparent areas between
    its cartoon elements, the photo has a right-edge mask
    transparent from 86-100%, and the scene 2 transition has
    brief moments where the photo + painted scene are both at
    partial opacity. All three scenarios exposed the dark
    --ll-palm-bark bg, producing black vertical strips.
    Switching to cream makes the bg match the brand palette
    and the painted scene 2 sky.
- `apps/web/src/lib/content.ts`: scene2 copy restored to D-0047's
  "CHAPTER 2 — THE COMMITMENT" / "Same yard, every week." /
  "No swap, no franchise markup..." The D-0048 "Walked past
  Tuesday." copy was a regression — poetic but didn't answer
  the conversion question a Largo homeowner has.
- `apps/web/src/app/hero-3d-test/page.tsx`: updated to import
  the new SecondScene component. The debug panel removed the
  3-plane legend + camera-orbit slider (no longer relevant) and
  replaced with scene-opacity + content-opacity sliders + a
  painted-scene / palms legend.
- `apps/web/src/app/hero-3d-test/layout.tsx`: metadata updated
  to reflect D-0049 (no longer about the Three.js scene).
- `apps/web/src/app/hero-3d-test/page.module.css`: legend dot
  colors updated to match the new layers (painted ranch house
  + foreground palms).
- `apps/web/package.json`: removed `@react-three/drei`,
  `@react-three/fiber`, `three` from dependencies.
- `apps/web/bun.lock`: regenerated to remove the three deps.

### Deleted files
- `apps/web/src/components/sections/HeroScene3D.tsx` (~440 lines)
- `apps/web/src/components/sections/HeroScene3D.module.css`
  (~180 lines)

## Why this works and the D-0048 Three.js version didn't

- **No WebGL context required.** Renders identically in headless
  Chrome, Safari, Firefox, mobile browsers. No SwiftShader drop.
- **No camera frustum math.** The painted scene IS the scene —
  background-size: cover fills the panel with no geometry to
  miscalculate.
- **No dynamic import + ssr:false.** ~150KB three.js + R3F + drei
  removed from the bundle. The homepage First Load JS stays at
  231kB (was 231kB with the dynamic import deferring 238kB; now
  231kB without needing the deferral at all).
- **The painted frames are coherent complete scenes.** The
  scene2-01..06.webp frames are full-bleed Florida ranch house
  scenes (terracotta roof, sun, palms, mower on the lawn). They
  were extracted to fill the panel — splitting them into 3
  planes broke the composition.

## The hero sequence (D-0049)

The unified hero composition now reads as a 3-scene story:

1. **Scene 1 (0-10% scroll)** — Hand-authored SVG storybook
   (vector clouds, palms, sun, houses, fern layer, songbirds
   layer). "Your neighbor's lawn mower." headline.

2. **Scene 1 → Photo (10-40% scroll)** — Storybook dissolves
   (blur+saturate+fade-out) into the real 4K Florida lawn
   photo. Dashboard widgets (LIVE pill, EST stamp, telemetry
   stats) rise together. "Your neighbor's lawn mower." stays.

3. **Photo → Scene 2 (40-70% scroll)** — Photo fades out as
   the painted Florida ranch house scene fades in (full-bleed
   1240×680, 6-frame cycle @ 10s). Headline shifts from
   "Your neighbor's lawn mower." to "Same yard, every week."
   Subhead shifts to "No swap, no franchise markup. The same
   operator shows up at the same address on the same day,
   until you say stop."

4. **Scene 2 (70-100% scroll)** — Painted ranch house resting
   state. Subtle ambient cycling. "See my route" / "See pricing"
   CTAs. Telemetry stats persistent.

The grass silhouette + green vignette now fade out across
[0.4, 0.7] so they don't bleed into the bright painted scene
as black saw-teeth.

> **D-0049 rev 2 (palms removal):** The earlier draft of
> SecondScene overlaid a `palms-01..06.webp` foreground parallax
> at bottom-right with `mix-blend-mode: multiply`. The D-0048
> re-extraction of `palms-*.webp` produced **full painted Florida
> scenes** (1240×680 — house, big sun, palm trees, bird bath)
> instead of the slim letterboxed strips the Wave 4 pattern
> assumed. Re-using the same `background-size: 42% auto, right
> bottom` pattern put a giant palm tree + sun on top of the
> painted scene 2 instead of a slim frond. The painted scene 2
> is already complete with its own palms, sun, and house — no
> foreground overlay is needed. The palms layer was dropped;
> the SecondScene is now a single full-bleed painted background
> + editorial content overlay (cleaner composition, no risk of
> double-painting the same Florida house twice).

> **D-0049 rev 3 (asset black-letterbox fix):** After the rev 2
> palms removal, the steward reviewed a fresh capture set and
> flagged a dark vertical column at ~50% of panel width on the
> storybook stage. Root cause was different from the D-0048
> Three.js column: the `.fernWrap` and `.songbirdsWrap` layers
> apply `mix-blend-mode: multiply`, and the `fern-01..06.webp` /
> `songbirds-01..06.webp` assets are VEO extractions encoded as
> **RGB WebP without an alpha channel** — the painted scene
> has black letterbox bars on the left and right sides. Under
> `multiply` blend, black × any-color = black, so the letterbox
> bled through as a solid dark column at the left edge of the
> songbirds image. Fix: re-encode all 12 fern + songbirds WebP
> files with the solid-black pixels converted to alpha=0
> (threshold R+G+B < 30 preserves the dark-green palm leaves
> and hill shadows at full opacity, since their RGB sums are
> 120-210). Idempotent script at
> `apps/web/scripts/fix-v2-asset-letterbox.py`. Visual evidence
> in `apps/web/audit/d-0049-second-scene/hero-y*.png` — the
> dark column is gone, the painted palm + birds are now visible
> as foreground parallax depth over the cartoon.

## Requirements

| ID | Requirement | Source |
|---|---|---|
| R49.1 | New `<SecondScene />` component renders 6 painted VEO frames (scene2-01..06.webp) as full-bleed background-image with CSS-step cycle @ 10s | §Solution |
| R49.2 | (rev 2 — REMOVED) The earlier draft had a foreground palms layer (palms-01..06.webp) at bottom-right, 6 frames @ 12s cycle, `mix-blend-mode: multiply` at 0.85 opacity. Dropped because the D-0048 re-extracted palms frames are full painted scenes, not slim strips — overlaying them on top of scene 2 produced a double-painted Florida house. | §rev 2 |
| R49.3 | Editorial pull-quote content overlay matches D-0047's ornament (opening-mark glyph + italic brand keyword): "yard" / "week" / "every week" italicized in Fraunces | D-0047 restoration |
| R49.4 | Scene 2 copy restored to D-0047: "CHAPTER 2 — THE COMMITMENT" / "Same yard, every week." / "No swap, no franchise markup. The same operator shows up at the same address on the same day, until you say stop." | D-0047 restoration |
| R49.5 | HeroScene3D (D-0048 Three.js component) deleted. three.js + @react-three/fiber + @react-three/drei removed from package.json | §Cleanup |
| R49.6 | `parseScene2Headline.italicKeywords` restored to D-0047's `['yard', 'week', 'every week']` list | D-0047 restoration |
| R49.7 | `grassOpacity` + `greenVignetteOpacity` extended with fade-out leg [0.4, 0.7] so the dark brand-green grass silhouette doesn't bleed into scene 2 as black saw-teeth | §Quality pass 1 |
| R49.8 | `.root` and `.viewport` background-color switched to `var(--ll-cream)`. Removes the pre-existing "dark column" bug from the storybook's transparent areas + photo's right-edge mask | §Quality pass 2 |
| R49.9 | Mobile (393×851) + desktop (1440×900) Playwright captures at 8 scroll positions verify the new scene 2 fills the panel coherently with editorial text overlay | §Validation |
| R49.10 | `prefers-reduced-motion` drops both cycle animations, locks both layers to frame 01. Coarse-pointer (mobile/touch) drops the palms parallax layer to save fillrate | §Accessibility |
| R49.11 | `/hero-3d-test` route (kept for backwards compat with steward's bookmark) renders the new SecondScene in isolation with mock MotionValues + 2 sliders | §Validation |
| R49.12 | (rev 3) All 12 fern + songbirds WebP assets re-encoded with alpha channel — solid-black pixels (R+G+B < 30) become alpha=0 so the `mix-blend-mode: multiply` on `.fernWrap` / `.songbirdsWrap` doesn't bleed the VEO letterbox bars through as a dark column. Idempotent script at `apps/web/scripts/fix-v2-asset-letterbox.py` | §rev 3 |

## Validation

- `bunx tsc --noEmit` — clean
- `bun run build` — 84/84 pages compile, First Load JS for `/` = 231kB
- 8 Playwright captures at scroll 0/600/1200/1700/1900/2100/2500/2900
  verify the new scene 2 fills the panel coherently with the editorial
  pull-quote text overlay. The D-0048 black column bug is gone.
- The `SecondScene` is now a pure-CSS component, identical render
  in headless Chrome and real browser.

## Confidence

**0.85** at ship time after D-0049. Visually validated through:
- 8 Playwright captures at desktop scroll positions 0/600/1200/1700/1900/2100/2500/2900 (`apps/web/audit/d-0049-second-scene/hero-y*.png`)
- `bunx tsc --noEmit` — clean
- `bun run build` — 84/84 pages compile, First Load JS for `/` = 231kB
- HeroScene3D deleted; no remaining Three.js references in src

The 0.85 confidence (vs 0.82 for D-0048) reflects:
- The D-0048 black-column visual bug is gone (validated via headless captures — would have been impossible to catch with D-0048 since headless Chrome dropped the WebGL context).
- The "Same yard, every week." copy is restored to D-0047 (steward-approved, never visually confirmed-bad).
- The palms foreground parallax adds the depth that D-0048's three-plane stack was trying to achieve, without the geometry math.
- The cream viewport bg removes the pre-existing "dark column" bug that was in D-0045+ from the storybook's transparent areas + photo's right-edge mask.

The remaining 0.15 risk is that the painted scene 2's bottom 20% has the green grass and the next section's dark "Where I Mow" bg creates a hard transition. The grass silhouette was supposed to soften that transition, but the D-0049 fade-out makes the transition sharper. A future wave (D-0050+) can address this with a dedicated bottom-fade gradient on the SecondScene.

## Review date

2026-10-10 (90 days post-ship). Re-evaluate against:
- Lighthouse CI perf budget (≥95 perf, ≥95 a11y) — expected to improve vs D-0048 because the three.js bundle is gone
- Mobile thermal/battery impact — improved (no WebGL)
- Visual regression test baseline coverage

---

## Status

Shipped on Day 27 (2026-07-20) per commit (pending Phase 7).

### Implementation summary

| Phase | Deliverable | Status |
|---|---|---|
| 1 | New SecondScene component (pure-CSS) using scene2-01..06.webp as full-bleed background + palms-01..06.webp as foreground parallax | ✓ |
| 2 | Grass silhouette + green vignette fade-out legs added to prevent black saw-teeth in scene 2 | ✓ |
| 3 | Viewport bg switched to cream (removes pre-existing dark column bug) | ✓ |
| 4 | D-0047 "Same yard, every week." copy restored | ✓ |
| 5 | Three.js deps + HeroScene3D component deleted | ✓ |
| 6 | /hero-3d-test route updated to mount the new component | ✓ |
| 7 | 8 desktop scroll-position captures verify coherent scene 2 | ✓ |

### Files changed

**New** (3):
- `apps/web/src/components/sections/SecondScene.tsx` (NEW, ~190 lines; rev 2 dropped the palms parallax, ~150 lines effective)
- `apps/web/src/components/sections/SecondScene.module.css` (NEW, ~200 lines; rev 2 dropped the palms keyframes, ~180 lines effective)
- `apps/web/scripts/fix-v2-asset-letterbox.py` (NEW, rev 3 — idempotent asset re-encoder; ~80 lines)
- `governance/decisions/0049-second-scene-css-revert.md` (NEW, this ADR)
- `apps/web/audit/d-0049-second-scene/hero-y*.png` (NEW, 8 captures per rev)

**Modified** (6):
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css`
- `apps/web/src/lib/content.ts`
- `apps/web/src/app/hero-3d-test/page.tsx`
- `apps/web/src/app/hero-3d-test/layout.tsx`
- `apps/web/src/app/hero-3d-test/page.module.css`
- `apps/web/package.json` (three deps removed)
- `apps/web/bun.lock` (regenerated)
- `apps/web/public/hero/layers/v2/fern-01..06.webp` (rev 3 — re-encoded with alpha)
- `apps/web/public/hero/layers/v2/songbirds-01..06.webp` (rev 3 — re-encoded with alpha)

**Deleted** (2):
- `apps/web/src/components/sections/HeroScene3D.tsx`
- `apps/web/src/components/sections/HeroScene3D.module.css`
