# D-0053 — OperatorStrip ambient painted-palms background

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Engineering
**Reviewer:** Steward
**Related:** D-0049 (hero layered painting cascade), D-0050 (hero extension)

---

## Context

The user requested more visible "video/animated content using the
various assets generated for this project." The painted VEO assets
in `apps/web/public/hero/layers/v2/` are 6-frame sequences designed
as ambient video loops — `fern-01..06.webp`, `palms-01..06.webp`,
`scene2-01..06.webp`. The `scene2-*` sequence was already powering
hero scene 2 (D-0049). The `palms-*` and `fern-*` sequences were
sitting unused.

The OperatorStrip section has a flat cream `--ll-shell` background
with portrait + bio + equipment grid. It's a content moment, but
the background is unused visual real estate.

## Decision

Add a 6-frame painted VEO palms cycle as a subtle ambient background
to the OperatorStrip section, using the same CSS-step pattern
SecondScene uses for its `scene2-*` cycle (D-0049):

```tsx
const PALMS_FRAMES = [
  '/hero/layers/v2/palms-01.webp',
  '/hero/layers/v2/palms-02.webp',
  '/hero/layers/v2/palms-03.webp',
  '/hero/layers/v2/palms-04.webp',
  '/hero/layers/v2/palms-05.webp',
  '/hero/layers/v2/palms-06.webp',
] as const;
```

```css
.ambientPalms {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.ambientPalmsFrame {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  opacity: 0;
  will-change: opacity;
  mix-blend-mode: multiply;
}

@keyframes ambientPalmsCycle {
  0%, 16.666% { opacity: 0.07; }
  16.667%, 100% { opacity: 0; }
}

.ambientPalmsFrame1 { animation: ambientPalmsCycle 10s steps(1, end) infinite; animation-delay: 0s; }
.ambientPalmsFrame2 { animation: ambientPalmsCycle 10s steps(1, end) infinite; animation-delay: 1.666s; }
/* ... frames 3-6 with delays 3.333s, 5s, 6.666s, 8.333s ... */
```

## Design rationale

**6 painted VEO frames, 10s/frame, `steps(1, end)`:** Same cadence
as SecondScene's `scene2-*` cycle. The frames are NEAR-IDENTICAL
painted Florida scenes (ranch house, sun, palms, bird bath) with
subtle differences (sun rays shift, clouds drift, grass blade tip
wobbles). The hard-cut `steps(1, end)` cycle reads as meditative
hand-painted stillness — the visitor sees a subtle ambient update
every ~1.7s, not a jarring flipbook.

**7% opacity + `mix-blend-mode: multiply`:** The painted scenes are
CSS-bleached down to 7% opacity with multiply blending so they
integrate with the cream `--ll-shell` backdrop without competing
with the bio text. The ranch house outline + palms are visible as
soft shapes behind the bio, not as a competing scene.

**Why 7% and not 100%?** The D-0049 lesson: painted VEO brushwork
clashes with hand-authored SVG cartoon when both are in the same
panel at the same time. The bio content is TEXT, not hand-authored
SVG cartoon, so the styles don't collide visually at low opacity.
At 100% opacity the painted content would dominate the section and
the bio would become secondary.

**`overflow: hidden` on the section:** The painted scenes' aspect
ratio (~1.82:1) is narrower than most desktop viewports, so
`background-size: cover` crops top/bottom — no horizontal bleed in
practice. `overflow: hidden` is cheap insurance against future
asset swaps.

**Stacking:** `.root` is `position: relative + isolation: isolate`,
`.ambientPalms` is z=0, `.inner` is z=1. The bio text sits above
the painted frames so the readability is not affected.

**D-0049 cycle reuse:** The 6-frame CSS-step + `prefers-reduced-motion`
lock-to-frame-1 pattern is the same one SecondScene uses. Keeping
both cycles on the same cadence means the page has a consistent
"meditative hand-painted" rhythm.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .ambientPalmsFrame2,
  .ambientPalmsFrame3,
  .ambientPalmsFrame4,
  .ambientPalmsFrame5,
  .ambientPalmsFrame6 {
    display: none;
  }
  .ambientPalmsFrame1 {
    animation: none;
    opacity: 0.07;
  }
}
```

Frames 2-6 are hidden, frame 1 stays at 0.07 opacity with no
animation. The painted palms are visible as a static backdrop, no
flicker.

## Verification

Playwright inspect confirms the cycle is applied:
- 6 `.ambientPalmsFrame` divs with their respective `palms-01..06.webp`
  background images
- `animation: 10s steps(1) infinite ambientPalmsCycle` on each
  (with 0s, 1.666s, 3.333s, 5s, 6.666s, 8.333s delays)
- At the moment of capture, frame 3 had `opacity: 0.07` (visible);
  all others had `opacity: 0` (hidden). The cycle is running.

Visual proof: `apps/web/audit/d-0053-ambient-palms/operator-strip-t0.png`
+ `operator-strip-t2.png`. The 2 captures show the painted palms
cycling through distinct frames (subtle ranch house / palm position
shifts between the two 2s-apart captures).

## Artifacts

- Commit: `a23e6f2 feat(operator): D-0053 ambient painted-palms background (6-frame VEO cycle)`
- Files: `apps/web/src/components/sections/OperatorStrip.tsx` (added 6 background frames), `apps/web/src/components/sections/OperatorStrip.module.css` (added cycle + reduced-motion)
- Captures: `apps/web/audit/d-0053-ambient-palms/operator-strip-*.png`
