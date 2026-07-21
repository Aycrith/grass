# D-0052 — Animated cartoon sun in hero scene 1

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Engineering
**Reviewer:** Steward
**Related:** D-0049 (hero layered painting cascade), D-0050 (hero extension)

---

## Context

The hero scene 1 cartoon storybook had a static sun (two circles: a
cream core + sun-yellow halo). Drifting clouds, swaying palms, swaying
operator, swaying wildflowers, swaying grass blades — all animated.
The sun was the only static element in the upper sky.

The user requested more visible "video/animated content using the
various assets generated for this project." The cartoon sun is the
most prominent static element in the most viewed part of the page;
animating it was the highest-leverage single addition.

## Decision

Add 12 hand-authored sun rays around the existing sun, animated with
three coordinated CSS keyframes:

```css
.sunRays {
  transform-box: view-box;
  transform-origin: 352px 252px;
  animation: sunRaysRotate 20s linear infinite;
}

.sunCore {
  transform-box: view-box;
  transform-origin: 352px 252px;
  animation: sunCoreBreathe 4.4s ease-in-out infinite;
}

.sunHalo {
  transform-box: view-box;
  transform-origin: 352px 252px;
  animation: sunHaloPulse 4.4s ease-in-out infinite;
  animation-delay: -0.6s;
}

@keyframes sunRaysRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes sunCoreBreathe {
  0%, 100% { transform: scale(1);    opacity: 0.9; }
  50%      { transform: scale(1.03); opacity: 1;   }
}

@keyframes sunHaloPulse {
  0%, 100% { transform: scale(1);    opacity: 0.18; }
  50%      { transform: scale(1.06); opacity: 0.30; }
}
```

The 12 rays are SVG `<line>` elements from r=128 to r=170 around the
sun center (352, 252), at 30° intervals, drawn in `var(--ll-sun)` with
5px stroke width and `stroke-linecap: round`. Each ray is 42px long
in the 1600x900 viewBox.

## Design rationale

**Rays rotation (20s linear):** Slow enough to read as ambient
motion, not a windmill. A 12s rotation would feel like a clock;
20s reads as "the sun is alive but unhurried."

**Core/halo breath (4.4s ease-in-out):** The 3% scale on the core is
just below the threshold of "is the sun winking at me?" — registers
as warmth without being a button. The halo's 6% scale + 0.18→0.30
opacity is slightly out-of-phase (delay -0.6s) so the glow appears
to swell from the edge inward.

**Different periods (20s vs 4.4s):** Different periods so the
animations don't visibly loop in lockstep. The rays drift slowly
past the pulsing core, creating a layered ambient rhythm.

**`transform-box: view-box`:** The same SVG-coordinate trick the
`operatorSway` class uses (D-0049). Without it, `transform-origin:
352px 252px` would be measured in CSS pixels relative to the parent
`<div>`, which scales with the SVG and gives the wrong pivot.

**Hand-authored SVG, not painted VEO rays:** The D-0049 lesson.
Painted VEO brushwork clashes with the hand-authored SVG cartoon
style. The rays are flat-fill `var(--ll-sun)` strokes — same idiom
as the existing palms, wildflowers, and operator.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .sunRays, .sunCore, .sunHalo {
    animation: none;
  }
}
```

All three animations collapse to identity (no rotation, no breath,
no pulse). The sun renders as a static core + halo, matching the
pre-D-0052 state.

## Verification

Playwright inspect confirms all three animations are applied:
- `.sunRays` (g with 12 line children) → `20s linear infinite sunRaysRotate`
- `.sunCore` (circle r=72) → `4.4s ease-in-out infinite sunCoreBreathe`
- `.sunHalo` (circle r=120) → `4.4s ease-in-out -0.6s infinite sunHaloPulse`
- `computedOpacity` of halo is 0.220044 (mid-animation, between 0.18 and 0.30)
- `computedOpacity` of core is 0.903288 (mid-animation, between 0.9 and 1.0)

Visual proof: `apps/web/audit/d-0052-sun/hero-y0.png` + `hero-y0-t2.5.png`
+ `hero-y0-t5.png`. The 3 captures show the rays at distinct rotation
angles (45° between each 2.5s capture), and a drifting cloud has
moved between them.

## Artifacts

- Commit: `3a9c1e0 feat(hero): D-0052 animated cartoon sun (rotating rays + breathing core/halo)`
- Files: `apps/web/src/components/sections/HeroStorybookLayer.tsx` (added 12 sun rays), `apps/web/src/components/sections/HeroStorybookLayer.module.css` (added 3 keyframe animations)
- Captures: `apps/web/audit/d-0052-sun/hero-y0*.png`
