# 2026-07-17 — MP4/PNG Asset Inventory + Architectural Fit

Read-only scan of `C:\Users\camer\Downloads\` for hand-painted-gouache / hero-relevant MP4s plus the single Screenshot PNG. Per-asset role suggestion + fit verdict against the current `HeroFieldTelemetry` architecture. **No code changes; this is inventory + fit, not a spec.**

## 1. Inventory table

| # | File (basename) | Size (MiB) | Duration (s) | Codec | Res | FPS | Bitrate | Suggested hero-layer role | Architecture fit | Primitive needed |
|---|---|---:|---:|---|---|---|---:|---|---|---|
| 1 | `Egret_standing_in_shallow_water_202607172016_202607172038.mp4` | 2.06 | 8.000 | h264 | 1280×720 | 24 | 2.16 Mb/s | Foreground critter (water reflection) | **NEW COMPONENT** | `<LoopingCritter>` |
| 2 | `Egret_standing_in_shallow_water_202607172016.mp4` | 2.07 | 8.000 | h264 | 1280×720 | 24 | 2.17 Mb/s | (re-roll of #1) | **NEW COMPONENT** | `<LoopingCritter>` |
| 3 | `Fern_swaying_in_painting_202607171905.mp4` | 1.70 | 8.000 | h264 | 1280×720 | 24 | 1.78 Mb/s | Mid-foreground foliage (sway) | **NEW COMPONENT** | `<LoopingFoliage>` |
| 4 | `Seagull_gliding_across_sky_202607171810.mp4` | 0.92 | 8.000 | h264 | 1280×720 | 24 | 0.96 Mb/s | Sky critter (above palms) | **NEW COMPONENT** | `<LoopingCritter>` |
| 5 | `Songbirds_flying_on_hedge_202607171735.mp4` | 2.43 | 10.005 | h264 | 1280×720 | 24 | 2.54 Mb/s | Midground flock across hedge | **NEW COMPONENT** | `<LoopingCritter>` |
| 6 | `Palm_trees_sway_in_painting_202607171659.mp4` | 2.38 | 10.005 | h264 | 1280×720 | 24 | 2.50 Mb/s | Sky/background palms (sway loop) | **NEW COMPONENT** | `<LoopingFoliage>` |
| 7 | `Riding_mower_cutting_lawn_202607171603.mp4` | 2.38 | 10.005 | h264 | 1280×720 | 24 | 2.49 Mb/s | Foreground action (mower parade) | **NEW COMPONENT** | `<LoopingMower>` |
| 8 | `Riding_mower_cutting_lawn_202607171601.mp4` | 2.42 | 10.005 | h264 | 1280×720 | 24 | 2.53 Mb/s | (re-roll of #7) | **NEW COMPONENT** | `<LoopingMower>` |
| 9 | `Hand-painted_gouache_illustratio…_202607171636.mp4` | 2.42 | 10.005 | h264 | 1280×720 | 24 | 2.54 Mb/s | Base storybook landscape | **NEW COMPONENT** | `<LoopingGouachePlate>` |
| 10 | `Hand-painted_gouache_painting_still_202607171732.mp4` | 2.36 | 10.005 | h264 | 1280×720 | 24 | 2.50 Mb/s | (re-roll of #9) | **NEW COMPONENT** | `<LoopingGouachePlate>` |
| 11 | `Hand-painted_gouache_storybook_p…_202607171737.mp4` | 2.37 | 10.005 | h264 | 1280×720 | 24 | 2.48 Mb/s | (re-roll of #9) | **NEW COMPONENT** | `<LoopingGouachePlate>` |
| 12 | `Screenshot 2026-07-17 185603.png` | 0.95 | n/a (still) | — | — | — | — | Reduced-motion / coarse-pointer fallback (per layer) | **MERGE** with existing `next/image` pattern | `<StaticGouacheFallback>` |

**Totals:** ~24 MB MP4 payload across 11 hand-painted clips (4 at 8 s cadence, 7 at 10.005 s cadence). The double-timestamp pattern on #1 (`_<YYYYMMDDhhmmss>_<YYYYMMDDhhmmss>`) and the near-identical generator timestamps on #1+#2, #7+#8, #9+#10+#11 strongly suggest AI-generation re-rolls of the same prompt — picking one per concept avoids bundle bloat.

## 2. Architecture-fit verdict (one-line)

**All 11 MP4s require new component primitives — there is no `<video>` element anywhere in the current `HeroFieldTelemetry` stack today.** Per the thinker's read of `apps/web/src/components/sections/HeroFieldTelemetry.tsx`:

- L20 / L52 — SVG landscape + vector graphics (no video layer)
- L108 — `enableScrollFade` gate on `pointer: coarse` + `prefers-reduced-motion: reduce`
- L122-126 — `smoothProgress` scroll-driven choreography
- L149-L157 — `<HeroStorybookLayer>` mounts CSS-keyframe animations (clouds, palms, birds)
- L156 — `photoGrade` overlay-blend before fade-out
- L237 — `next/image` 4K photo fallback

The current hero is purely **SVG + framer-motion + CSS keyframes + next/image**. No `<video>` primitive exists. Adding MP4 layers is therefore a *new architectural primitive*, not a restyling tweak.

## 3. Re-roll guidance (avoid bundle bloat)

| Concept | Files | Recommended pick | Rule |
|---|---|---|---|
| Egret | #1, #2 | visual-QA tie-breaker; #2 is later-timestamped | pick one |
| Fern | #3 | #3 (single) | n/a |
| Seagull | #4 | #4 (single) | n/a |
| Songbirds | #5 | #5 (single) | n/a |
| Palms | #6 | #6 (single) | n/a |
| Riding mower | #7, #8 | visual-QA tie-breaker | pick one |
| Gouache base plate | #9, #10, #11 | prefer #11 (most recent 17:37) | pick one |

The double-timestamp on #1 (`_202607172016_202607172038`) implies the file was originally generated at 20:16 and re-rolled at 20:38 — likely the older variant; prefer the simpler timestamp on #2 unless the older frame loops more cleanly.

## 4. New-component primitives checklist

To use any of #1-#11 in production, author each in `apps/web/src/components/sections/hero-layers/`:

- [ ] **`<LoopingVideoLayer>`** — base primitive with `useReducedMotion()` + `pointer: coarse` gates; `playsInline autoplay loop muted` for iOS Safari inline autoplay; mobile data-sawareness via `<picture>` srcset (720p + 480p ladder).
- [ ] **`<LoopingGouachePlate>`** — animated base landscape. Replaces the SVG landscape inside `.storybookWrap` (`HeroFieldTelemetry.tsx:153`).
- [ ] **`<LoopingCritter>`** — sub-primitive for egret / seagull / songbirds with optional position constraints (water / skyscape / midground).
- [ ] **`<LoopingFoliage>`** — sub-primitive for fern / palm with sway loop, parent-mounted to follow the base plate parallax.
- [ ] **`<LoopingMower>`** — sub-primitive for the tractor; decoupled positional so it can parallax across the field.
- [ ] **`<StaticGouacheFallback>`** — `<Image>`-based fallback for coarse-pointer + reduced-motion devices (extends the existing `next/image` pattern at L237).

## 5. Mobile & performance risk (one-line)

h264 720p 24fps decode is ~2 MB/s. **Cap simultaneous decodes at 3** on low-end mobile. Override: `HeroFieldTelemetry.tsx:108` already gates for `pointer: coarse` + reduced-motion — the new primitive MUST integrate with that gate, not bypass it. Asset #12 (the PNG) is the canonical fallback for the rest.

## 6. Trade-off call-outs

1. **MP4 gouache vs SVG vector:** MP4s gain brush-stroke texture impossible in DOM, but lose infinite scalability and add GPU decode cost. Visual brand shifts from "vector-flat editorial" to "storybook-painterly."
2. **Free-running 8 s / 10 s loop cadence vs scroll-driven choreography.** Current hero rides `smoothProgress`. MP4s run on a wall clock. Decision: pause+scrub MP4s on scroll, OR let them free-play while the L156 fade-out overlay takes over.
