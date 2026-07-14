---
name: hero-v2
description: >
  v2 hero asset brief. Supersedes hero.md (v1). v1 produced 4 PNGs that
  failed the visual-quality, fidelity, and animation-standards bar: the
  outputs are blurry, blob-field compositions with no legible subject,
  no focal hierarchy, and no usable detail (see apps/comfyui/outputs/
  largo-lawn/hero/{2,3,4}.png — all rejected at the curate-pick stage).
  v1's hero.md also assumed a single-master/dual-crop pipeline that
  cannot meet the bar by itself; the on-page component
  (HeroCinematic.tsx) needs *layered* assets so the existing
  Framer-Motion + CSS keyframe choreography (word reveal, parallax,
  stagger group, sway loops) can paint against crisp per-layer
  artwork instead of a hand-authored stick-figure SVG.

  v2 splits the hero into SEVEN composable assets — one master scene
  (the desktop hero), one mobile reframe, and five transparent-background
  layers (palm-with-sun, mower, grass, ground, fence-shadow) — and pairs
  the asset generation with an animation-choreography sub-brief that
  upgrades the on-page motion from "three independent CSS sway loops"
  to a single scene-level entrance + scroll-coupled parallax + ambient
  micro-loops that read as one composition, not three cartoons.
type: hero
version: 2
supersedes: hero.md
status: awaiting-cf0-seed
workflow_master: hero-landscape.json
workflow_layered: hero-layer-{name}.json
seed_strategy: family-of-seeds  # see §5
style_block: _style-block.md
lora: storybook-landscapes-xl
lora_strength_master: 0.90       # heaviest style lock — this is the brand spread
lora_strength_layer: 0.80        # slightly less so individual subjects stay readable
ip_adapter_weight_master: 0.55   # per the 2026-07-12 keeper calibration
ip_adapter_weight_layer: 0.45    # lower so the LoRA + per-layer prompt can dominate
ksampler:
  steps: 40
  cfg: 7.5
  sampler: dpmpp_2m
  scheduler: karras
  denoise: 1.0
  batch_size: 4
output_paths:
  - apps/web/public/hero/desktop.webp        # cropped from master
  - apps/web/public/hero/mobile.webp         # cropped from master
  - apps/web/public/hero/layers/palm.webp    # transparent-bg, composable
  - apps/web/public/hero/layers/mower.webp
  - apps/web/public/hero/layers/grass.webp
  - apps/web/public/hero/layers/ground.webp
  - apps/web/public/hero/layers/fence-shadow.webp
acceptance_gate: see §2
choreography_brief: see §7
qa_loop: see §8
---

# Hero v2 — layered composition + scene-level choreography

> **Reading order for the agent that picks this up:** §2 (acceptance
> criteria) first, then §3 (asset architecture), then §6 (sub-prompts)
> in the dependency order in §4. §7 (choreography) and §8 (QA) are the
> motion sub-agent and verification layers — they can be read in
> parallel with §6 if the team is splitting work.
>
> **Driver-script note:** the frontmatter above is the *human-readable
> spec* for this brief, not the data the current
> `apps/comfyui/scripts/generate.py` consumes — that driver still
> parses only single-line `key: value` and inline `[a, b]` list
> fields (v1 schema). The driver needs a v2-schema update to read the
> `ksampler:` block, the multi-line `output_paths:` list, and the
> per-asset seed table in §5. That driver update is a separate work
> item (out of scope for "author the brief"). Until that lands, the
> agent can either (a) extract the per-asset seed from §5 and pass it
> via `--seed <n>` to the existing CLI, or (b) author a one-off
> driver script for this brief only. Both paths preserve the brief
> as the source of truth.

## 1. Why v2

The v1 hero brief (this file's predecessor) produced four PNGs in
`apps/comfyui/outputs/largo-lawn/hero/`. Every one of them failed the
visual-quality bar at the curate-pick stage. The failures are
diagnostic, not stochastic:

| Failure mode | Where it shows up in v1 output | Why it happened in v1 |
|---|---|---|
| **No legible subject** | v1 PNGs have no identifiable mower, no architecture, no human-scale object | Prompt listed many nouns (lawn, house, palm, mower, sun) without naming which is the FOCAL subject and at what scale |
| **Blob composition** | Tree shapes are uniform green circles; clouds are uniform white circles; lawn is a featureless green band | IP-Adapter style-transfer at 0.50 over-pulled the keeper's painterly style without enough subject-detail in the positive prompt to anchor SDXL's denoising |
| **No depth zones** | Foreground/midground/background all read at the same value | Prompt didn't specify a depth-of-field separation (foreground grass vs. mid-distance mower vs. background house) — SDXL fell back to a flat spread |
| **LoRA undertrained** | Output looks like a vector-flat illustration, not a painted storybook spread | LoRA strength at 0.85 with 30 KSampler steps is too gentle — the storybook brushwork didn't get a chance to lock in |
| **No crop guidance** | A 2400×1500 master intended to crop 2:1 / 4:5 produced a master that doesn't have the right subject placement for either crop | Prompt didn't constrain the mower to the right-third (mobile crop) or the lawn to the bottom-half (desktop crop) |
| **No motion contract** | The on-page component is forced to use hand-authored stick-figure SVGs because v1's "hero" was a single raster, not a layered set | v1 assumed a single-image hero; the existing HeroCinematic.tsx component (WP19-WP48) is built for layered SVG/raster composition with motion |

v2 fixes all six.

## 2. Acceptance criteria (the gate — assets do NOT ship until every line passes)

The agent must self-evaluate each generated asset against the following
criteria. **Any failure = re-roll with a new seed.** If three re-rolls
fail the same criterion, stop, escalate, and propose a LoRA-strength
or IP-Adapter-weight adjustment — do not ship substandard work.

### 2.1 Visual quality

- [ ] **Storybook painterly texture, not vector flat.** Brushwork
      should be visible at 100% zoom on the lawn and on the tree
      foliage. SDXL+LoRA defaults to soft watercolor; we want hand-drawn
      gouache / colored-pencil — slightly grainy, slightly imperfect.
- [ ] **Brand palette fidelity.** All colors stay within the 9-token
      palette in `_style-block.md`. No new greens, no new oranges, no
      photo-realistic sky blues. If a color shows up that doesn't have
      a matching token, it is a failure.
- [ ] **No AI-face artifacts.** Zero people, zero faces, zero skin
      tones. The brand voice is "your neighbor's lawn mower" — the
      neighbor is *implied* by the mower sitting on the lawn, not
      shown.
- [ ] **No text, no logos, no watermarks burned in.** The LoRA
      negative block already enforces this — verify in output.

### 2.2 Fidelity

- [ ] **Focal subject is unambiguous.** The mower must be
      identifiable as a mower (deck + handle + wheels) at the asset's
      rendered display size. Not a green blob, not a generic
      equipment-shape — a *push mower*, side profile, 3/4 angle.
- [ ] **Depth-of-field separation is visible.** Three distinct value
      bands: foreground (grass blades, dark), mid-distance (mower +
      lawn, mid-value), background (house + trees + sky, light).
      At least 1.5 stops of value separation between bands.
- [ ] **Composition respects rule of thirds for crop.** The mower
      sits in the right-third horizontal band (mobile crop target) and
      in the lower-third vertical band (desktop crop target). The
      horizon line is at the lower-third.
- [ ] **Mower scale is correct.** Mower should occupy roughly 4–6% of
      the frame area in the master — small enough to read as "your
      neighbor's mower parked on the lawn," large enough to be
      identifiable.
- [ ] **All seven layered assets have a transparent background.**
      No baked-in sky, no baked-in ground. The ground band asset is
      *only* the soft horizon line / earth band — it must composite
      cleanly against the master without seams.

### 2.3 Animation standards (informs the layered asset design, not the SDXL output)

The on-page animation choreography is governed by `§7` below. The
acceptance bar for the *artwork* is that each layered asset must:

- [ ] **Survive a 3% scale variation** without breaking the silhouette.
      The Framer-Motion parallax tracks Lenis scroll; a layer
      that breaks at non-1:1 scale was generated at the wrong
      intrinsic size.
- [ ] **Have a single dominant edge color.** A silhouette with three
      competing edge values will shimmer when animated. Each layer
      asset should read as one painted shape from a 3m viewing
      distance.
- [ ] **Be separable.** The palm-with-sun asset's palm must be
      cleanly extractable from the sun by blend mode alone (multiply
      on the dark stage, screen on the cream stage) — no fine
      interlocking details that would tear under blend.

## 3. Asset architecture

v1 produced one PNG. v2 produces **seven**:

| # | Asset | Resolution | Use | Background | Blend target |
|---|---|---|---|---|---|
| 1 | `hero/desktop.webp` | 2400×1200 | Desktop hero, full-bleed right column | baked | — |
| 2 | `hero/mobile.webp` | 1200×1500 | Mobile hero, stacked top | baked | — |
| 3 | `hero/layers/palm.webp` | 1200×900 (transparent) | Hero composition, `pinellas-palm` slot replacement | transparent | multiply on dark stage, screen on cream stage |
| 4 | `hero/layers/mower.webp` | 1000×600 (transparent) | Hero composition, `mower-side-profile` slot replacement | transparent | normal |
| 5 | `hero/layers/grass.webp` | 1600×800 (transparent) | Hero composition, `grass-blade-cluster-xl` slot replacement | transparent | normal |
| 6 | `hero/layers/ground.webp` | 2400×400 (transparent) | Hero composition, new — soft earth band beneath grass | transparent | normal |
| 7 | `hero/layers/fence-shadow.webp` | 1600×600 (transparent) | Optional mid-distance fence / porch shadow, gives depth behind mower | transparent | multiply |

**Why seven instead of one.** The current `HeroCinematic.tsx` is
built on a Framer-Motion `StaggerGroup` + `ParallaxImage` + per-layer
CSS keyframes (`heroPalmSway`, `heroMowerDrift`, `heroGrassSway`).
That choreography is good and tested — the WP19-WP48 history on the
component shows the motion system works. The problem was that the
*artwork* inside each motion slot was a hand-authored SVG (stick
palm, fuzzy mower, sparse grass). Layered raster assets with the
same SVG positions + blend modes keep every motion win and fix the
artwork.

**Why the master + crops are still generated.** The desktop and
mobile baked hero images are used as:

- A fallback when the JS motion layer is reduced-motion-disabled
  (the master paints as a static image; layers don't animate)
- A poster image for the LCP/SSR first-paint
- A pre-load image for `next/image` priority hints
- A reference baseline for visual-test playwright snapshots

The layered assets are the "real" hero; the master is the safety net.

## 4. Generation order (dependency)

Generate in this order. Each later asset is informed by the keeper
from the prior step.

```
STEP 1  Generate master (2400×1500)        — 4 candidates
STEP 2  Curate master keeper               — see §8.1
STEP 3  Generate mobile crop (1200×1500)   — independent generation,
                                              see §6.3 for the mobile-only
                                              prompt variant
STEP 4  Generate layered assets in parallel — see §6.4-§6.8
STEP 5  Composite check — overlay the
         layers in Figma/Paint.net at the
         HeroCinematic stage coordinates
         and verify the composition reads
         as one scene, not five cutouts
STEP 6  Convert all PNGs to WebP at q=82
         (apps/comfyui/scripts/convert-to-webp.mjs)
STEP 7  Drop the keepers into apps/web/public/hero/{desktop,mobile,
         layers/}.webp
```

The master is a hard dependency for steps 3 and 4 — the mobile crop
and the layered assets are tuned against the master's palette and
focal hierarchy. Do not generate the layers before the master keeper
is selected.

## 5. Seed strategy — family of seeds

v1 used a single seed (4242) for the hero, which made re-rolls
deterministic but produced the same family of failures. v2 uses a
**family of seeds** — the master seed is 4242 (preserved for
reproducibility), and each layered asset gets a deterministic offset
that is *close enough* to the master to inherit its style lock but
*far enough* to escape its specific failure mode.

| Asset | Seed | Offset from master | Why |
|---|---|---|---|
| Master | 4242 | 0 | Continuity with v1 / IP-Adapter ref |
| Mobile crop | 4269 | +27 | Same family, different spatial composition |
| Palm layer | 4311 | +69 | Off-family so the palm doesn't inherit the master's tree-blob failure |
| Mower layer | 4377 | +135 | Off-family so the mower doesn't inherit the master's equipment-blob failure |
| Grass layer | 4223 | -19 | Close to master so the grass palette matches the lawn |
| Ground layer | 4411 | +169 | Off-family — ground is a new asset, no prior art to match |
| Fence-shadow | 4489 | +247 | Off-family — fence-shadow is a new asset, optional |

The driver script (`apps/comfyui/scripts/generate.py`) computes the
per-asset seed from this table — do NOT hard-code the seeds in the
workflow JSON. The driver is the single source of truth for seed
arithmetic.

## 6. Sub-prompts (positive + negative, one block per asset)

Each sub-prompt is ready to be templated into the matching workflow
JSON's CLIPTextEncode (positive) node. The negative block is the
shared `_style-block.md` negative — it is identical for every asset
in the library and is appended by the driver, not re-pasted here.

### 6.1 Master hero scene (2400×1500)

```
digital storybook illustration, textured brushwork, sharp focus,
medium-wide establishing shot of a freshly mowed St Augustine
lawn in a Pinellas County residential yard, late afternoon golden
hour, single source of warm sun positioned upper-right at 30°
above the horizon, soft long shadows cast to the lower-left,

FOCAL SUBJECT: a single push lawnmower sitting on the lawn at
mid-distance, three-quarter side profile, slightly right of
center (mobile-crop focal point), occupying 4-6% of frame area,
mower deck visible, handle upright, two rear wheels distinct,

FOREGROUND: freshly cut grass with visible blade texture and faint
mowing stripes, the lower third of the frame, deep saturated
greens, individual blades suggested with short gouache strokes,

MIDGROUND: the mower on the lawn, a clean concrete walkway
entering from the lower-left at 30°, the edge between grass and
concrete is sharp and deliberate,

BACKGROUND: a modest one-story ranch-style house with a screen
porch, a Florida live oak at left, two cabbage palms at right,
soft warm cumulus clouds at the upper third,

PALETTE: deep saturated greens for foliage, warm sand-bleached
cream for the sky, golden-hour sun color in the highlights, no
new colors, painterly gouache, hand-drawn linework on the
mower and the house eaves,

DEPTH: clear three-band depth-of-field — dark foreground, mid
midground, light background, atmospheric perspective on the
background trees,

35mm focal length, slight wide-angle, hand-held warmth, mild
film grain
```

### 6.2 Desktop crop (2400×1200) — engineering-side derivation

Generated by the engineering team via `sharp.extract()` from the
master keeper — no SDXL call. Center horizontal crop, retain the
mower in the right-third, retain the horizon at the lower-third,
discard the top 200px and the bottom 100px of the master.

```js
// apps/comfyui/scripts/derive-desktop-crop.mjs (post-curation)
import sharp from 'sharp';
await sharp('hero/master_keeper.png')
  .extract({ left: 0, top: 200, width: 2400, height: 1200 })
  .webp({ quality: 82 })
  .toFile('apps/web/public/hero/desktop.webp');
```

### 6.3 Mobile crop (1200×1500)

Generated independently, not extracted from the master — v1's
"extract from master" approach produced a cramped mobile composition
because the master's mower wasn't framed for a 4:5 vertical crop.
v2's mobile is a fresh generation with a re-tuned prompt.

```
digital storybook illustration, textured brushwork, sharp focus,
portrait-orientation establishing shot, 4:5 aspect,

FOCAL SUBJECT: the same push lawnmower from the master, now
centered horizontally and at the lower-third vertically,
occupying 6-8% of the slightly taller frame, three-quarter side
profile, deck and handle distinct, two rear wheels visible,

FOREGROUND: freshly cut grass with blade texture and faint mowing
stripes, the lower half of the frame, deep saturated greens,

MIDGROUND: the mower, a clean concrete walkway curving from
the lower-left, a small Florida-friendly shrub to the right
of the mower,

BACKGROUND: the ranch house at the top of the frame, more of
the house visible than in the master, screen porch and roof
eaves readable, a single cabbage palm at the upper-right,
soft golden clouds,

PALETTE: same as master — deep greens, warm cream sky, golden
highlights, no new colors,

DEPTH: three-band depth-of-field, same hierarchy as master,
house at the top so it reads as "this is the yard of this
house," not a separate subject,

35mm focal length, slightly tighter than master, hand-held warmth
```

### 6.4 Palm-with-sun layer (1200×900, transparent)

```
digital storybook illustration, textured brushwork, sharp focus,
isolated subject on a fully transparent background, PNG alpha
channel preserved,

SUBJECT: a single mature Florida cabbage palm tree, three-quarter
side view, trunk curving slightly to the right, fronds spreading
outward and slightly downward (mid-afternoon droop, not
midnight-martini-rigid), 6-8 fronds visible, two coconut
clusters at the crown, palm-bark trunk with subtle scale texture,

SUN: a single soft sun disc positioned at the upper-right behind
the fronds, golden warm halo, 8 short rays radiating from the
disc, the disc must read as the SINGLE sun in any final
composition (no other sun sources),

SCALE: the palm fills 75% of the frame height, the sun disc is
sized to be 15% of the frame width,

PALETTE: --ll-green for the fronds, --ll-palm-bark for the
trunk, --ll-sun for the disc and rays, --ll-clay for the
coconut clusters — no other colors, no new hex values,

EDGE: every silhouette edge is hand-drawn linework, no
vector-flat contours, the alpha channel must cleanly cut every
palm frond and every ray tip
```

### 6.5 Mower layer (1000×600, transparent)

```
digital storybook illustration, textured brushwork, sharp focus,
isolated subject on a fully transparent background, PNG alpha
channel preserved,

SUBJECT: a single residential push lawnmower, three-quarter side
profile facing right, gas-powered, four wheels (two larger rear,
two smaller front), grass-catcher bag at the rear, operator
handle with curved grips at the top, engine cowl on top of the
deck, sharp horizontal mowing-deck line at the base, the deck
shows a faint hint of cut grass clippings,

SCALE: the mower fills 80% of the frame width and 70% of the
frame height, the handle is fully visible (not cut off at the
top of the frame), the deck wheels rest on the implied ground
line at the bottom 8% of the frame,

DETAIL FIDELITY: deck-to-handle joint visible, engine cowl
vents visible, grass-catcher mesh texture visible, tire treads
visible (3-4 lug blocks per tire, not flat circles),

PALETTE: --ll-palm-bark for the deck and handle (silhouette
weight), --ll-clay for the engine cowl accent, --ll-green
for the grass-catcher bag, --ll-sun for the wheel hubs,
no other colors, no chrome highlights, no photo-realistic
metal,

STYLE: hand-drawn gouache, slight 1-2px offset on the deck
line from the handle joint (not CAD-perfect, painterly
imperfection is the brand)
```

### 6.6 Grass layer (1600×800, transparent)

```
digital storybook illustration, textured brushwork, sharp focus,
isolated foreground subject on a fully transparent background,
PNG alpha channel preserved,

SUBJECT: a cluster of St Augustine grass blades at the
foreground of a yard, 30-50 distinct blade silhouettes, the
blades vary in height from short (2 inches) to tall (6 inches)
with the variation natural, not uniform, blade tips pointed
and slightly curved (no flat-topped choppy blades),

COMPOSITION: the grass cluster fills the lower 80% of the
frame width and the full 80% of the frame height, the top
20% of the frame is empty transparent (the blades grow
upward from the bottom edge), the bottom edge of the frame
is a soft earth band that fades to transparent at 10% above
the bottom edge,

DETAIL FIDELITY: each blade has a faint center vein line
(--ll-green darker than the fill), blade midrib is a
single 1px stroke, blades overlap and interweave without
z-order artifacts, no AI-blob mass,

PALETTE: --ll-green primary, --ll-palm-shadow for the deeper
blades in the back of the cluster, --ll-sun for the blade
tip highlights (golden-hour side-lit), --ll-palm-bark for
the earth band, no other colors
```

### 6.7 Ground layer (2400×400, transparent)

```
digital storybook illustration, textured brushwork, sharp focus,
isolated horizon band on a fully transparent background,
PNG alpha channel preserved,

SUBJECT: a soft horizontal earth-tone band that reads as the
horizon / ground line beneath the grass, the band has a
grainy texture suggesting cut-grass clippings and warm
Florida soil,

COMPOSITION: the band fills the full frame width and the
full frame height, the top 30% of the band fades from
opaque to transparent (blends into whatever sits above it
in the composition), the bottom 70% of the band is the
earth color,

DETAIL FIDELITY: a few stray grass clippings scattered in
the band (3-5 short blade shapes, --ll-green), a faint
diagonal mowing stripe pattern (very subtle, 5% opacity
shift across the band), no hard edges top or bottom,

PALETTE: --ll-palm-shadow for the band body, --ll-palm-bark
for the lower edge shadow, --ll-green for the clippings,
no other colors
```

### 6.8 Fence-shadow layer (1600×600, transparent)

```
digital storybook illustration, textured brushwork, sharp focus,
isolated mid-distance subject on a fully transparent background,
PNG alpha channel preserved,

SUBJECT: a soft diagonal fence shadow cast across the lawn at
mid-distance, behind where the mower sits, the shadow implies
a wooden picket fence at the property line without drawing
the fence itself — just the shadow,

COMPOSITION: the shadow enters the frame from the upper-left
at 30° below horizontal and exits the lower-right at the
same angle, the shadow has soft edges (multiply-blend
target), the shadow occupies 60% of the frame width,

DETAIL FIDELITY: vertical picket lines visible in the shadow
(8-12 pickets suggested, not drawn), the picket lines are
faint, the shadow is the dominant feature, the lines are
secondary,

PALETTE: --ll-palm-bark at 30% opacity for the shadow body,
no other colors,

WHY THIS EXISTS: gives the mower something to sit in front
of, breaks the "mower floating on green plane" failure of
v1's master output, reads as "this is a real yard with
a real property line"
```

## 7. Animation choreography brief (consumed by the motion sub-agent, not by SDXL)

The on-page animation is the second half of the hero acceptance bar.
v1's motion is "three independent CSS sway loops" — palm sways at
4.2s, mower drifts at 8s, grass sways at 5s. Each loop is on its
own clock, none of them is scene-level, none of them is
entrance-choreographed, none of them is scroll-coupled in a
meaningful way (the parallax offset is on the whole stage, not on
the individual layers).

v2's motion contract is:

### 7.1 Entrance choreography (mount, runs once)

| Order | Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|---|
| 1 | Master hero image (fallback poster) | opacity 0 → 1 | 800ms | `--motion-easing-emphasize` | 0ms |
| 2 | Master crops to mobile (CSS clip-path on resize) | clip-path inset | 400ms | `--motion-easing-default` | 0ms |
| 3 | Ground layer | opacity 0 → 1, translateY(8px → 0) | 400ms | `--motion-easing-default` | 100ms |
| 4 | Fence-shadow layer | opacity 0 → 0.5 (target), translateX(-12px → 0) | 600ms | `--motion-easing-default` | 200ms |
| 5 | Palm layer | opacity 0 → 1, scale(0.96 → 1) | 600ms | `--motion-easing-emphasize` | 300ms |
| 6 | Mower layer | opacity 0 → 1, translateY(16px → 0) | 500ms | `--motion-easing-emphasize` | 500ms |
| 7 | Grass layer | opacity 0 → 1, scale(0.98 → 1) | 500ms | `--motion-easing-default` | 700ms |
| 8 | Headline (WordReveal) | clip-path inset(0 100% 0 0) → inset(0 0 0 0), per word | 400ms per word, 80ms stagger | `--motion-easing-emphasize` | 600ms |
| 9 | Subhead | opacity 0 → 1, translateY(8px → 0) | 400ms | `--motion-easing-default` | 1000ms |
| 10 | CTA buttons | opacity 0 → 1, translateY(8px → 0) | 400ms | `--motion-easing-default` | 1100ms |
| 11 | Trust row | opacity 0 → 1, translateY(8px → 0) | 400ms | `--motion-easing-default` | 1200ms |
| 12 | Corner stamp + caption pill | opacity 0 → 1 | 400ms | `--motion-easing-default` | 900ms |

Total entrance choreography: ~1.6s from first paint to fully settled.
All `useReducedMotion()` falls back to instant visibility on every
animation above.

### 7.2 Scroll-coupled parallax (continuous, runs while hero is in view)

The v1 `ParallaxImage` wraps the whole stage in a single `translateY`.
v2 splits the parallax into **three depth bands**:

| Band | Layers | Parallax factor | Why |
|---|---|---|---|
| Foreground (fastest) | grass, ground | 0.6× | Reads as closest to viewer, moves most |
| Mid-distance (medium) | mower, fence-shadow | 0.4× | Reads as the action focal point |
| Background (slowest) | palm, sun, master fallback | 0.2× | Reads as anchored, painterly backboard |

This is a real three-band parallax, not a single-element translate.
The bands must run in `useScroll` + `useTransform` with a single
scroll-progress source so the depth hierarchy reads correctly. Each
band is wrapped in its own `motion.div` with the parallax factor as
the `y` transform.

### 7.3 Ambient micro-loops (continuous, runs while hero is in view)

| Layer | Loop | Period | Amplitude | Easing |
|---|---|---|---|---|
| Palm | sway (rotation around trunk base) | 6.0s | ±1.2° | ease-in-out |
| Mower | subtle horizontal drift (wind on the deck) | 9.0s | ±3px | ease-in-out |
| Grass | skew sway (per-blade phase offset, 80ms stagger across blades) | 4.5s | ±0.8° | ease-in-out |
| Sun (in palm layer) | very slow scale pulse (1.0 → 1.03 → 1.0) | 8.0s | ±1.5% | ease-in-out |
| Fence-shadow | opacity drift (0.5 → 0.55 → 0.5) — cloud passing | 12.0s | ±0.05 | linear |

The micro-loops are not synchronized to a single clock — they're
intentionally desynchronized so the scene reads as natural ambient
motion (the way real foliage moves in a real breeze) rather than a
choreographed animation. The desync periods are roughly coprime
(4.5, 6.0, 8.0, 9.0, 12.0) so the scene never re-aligns to a single
rhythm.

### 7.4 Hover micro-interactions

| Element | Hover animation |
|---|---|
| CTA primary (`variant="sun"`) | existing — background-color shift, transform translateY(-1px) |
| CTA secondary (`variant="outline"`) | existing — border + background-color shift |
| Callout pill (33771 — Largo Central) | scale 1.0 → 1.04, transition 240ms, easing `--motion-easing-default` |
| Corner stamp ("01") | no hover — pure chip, not a target |
| Caption pill (Pinellas porch — golden hour) | no hover — pure chip, not a target |

### 7.5 Reduced-motion fallback

`useReducedMotion()` (Framer Motion) is the gate for every animation
above. When the user prefers reduced motion:

- Entrance choreography collapses to instant visibility (all 12
  elements visible at first paint, no animation)
- Parallax bands collapse to a static layout (no scroll-coupled
  translate, layers paint at their resting positions)
- Ambient micro-loops are disabled entirely (the layers are static
  painted shapes)
- Hover micro-interactions remain (they are user-initiated, not
  autonomous — per PRD-04 §1.2 they are allowed in reduced-motion
  mode)

## 8. QA loop — re-roll criteria, escalation path

### 8.1 Curate-pick stage (STEP 2 in §4)

For each of the 4 master candidates, score against the §2.1 and §2.2
criteria. Use a 5-point rubric per criterion:

| Score | Meaning | Action |
|---|---|---|
| 5 | Passes cleanly, no notes | Keeper candidate |
| 4 | Passes, one minor note (e.g. slightly too saturated) | Keeper candidate, fix in post |
| 3 | Passes the spirit, fails a specific letter (e.g. mower at 7% scale instead of 4-6%) | Borderline, second-pass if no 4-or-5 exists |
| 2 | Fails a major criterion (no legible subject, wrong palette) | Reject |
| 1 | Fails multiple major criteria | Reject |

Keeper selection rule: pick the candidate with the highest sum. If
two candidates tie, prefer the one with the higher score on §2.2
fidelity over §2.1 quality (a sharp subject with slightly weaker
brushwork beats blurry brushwork with a vague subject — the brand
is the work, and the work has to be readable).

### 8.2 Re-roll protocol (when a candidate scores 2 or lower)

1. Note which criterion failed.
2. Adjust the prompt by **adding one specific descriptive phrase**
   targeting the failure (do not rewrite the prompt — surgical
   additions only). For example: "the mower's deck is dark
   green-black and the engine cowl is clay-orange, two distinct
   color values, not a single mass."
3. Re-roll with `seed + 11` (preserves family but breaks the
   specific failure pattern).
4. Re-score against §2.1 / §2.2.

### 8.3 Escalation (after 3 failed re-rolls on the same criterion)

Stop and report. The likely causes:

| Failure pattern | Likely root cause | Fix |
|---|---|---|
| Mower keeps rendering as a green blob | LoRA + IP-Adapter are over-pulling painterly style at the expense of subject detail | Drop LoRA strength to 0.80, drop IP-Adapter weight to 0.40, add the specific color-value phrase from §8.2 step 2 |
| Composition keeps losing the depth bands | SDXL is ignoring the depth-band wording | Add `(foreground: dark), (midground: mid-value), (background: light)` in parentheses — SDXL weights parentheticals higher |
| Palette keeps drifting outside the 9 tokens | IP-Adapter is pulling the keeper's broader palette | Drop IP-Adapter weight to 0.35, increase LoRA strength to 0.95 |
| Fence-shadow renders as a literal fence (not a shadow) | Negative block isn't strong enough | Add `, not a fence, not a fence pickets, not wood grain, only the shadow of a fence` to the negative prompt for this asset only |

### 8.4 Animation QA (post-STEP 5 composite check)

The motion sub-agent must produce a `visual-test/hero-choreography.spec.ts`
playwright trace that captures:

- Frame at 0ms (pre-entrance)
- Frame at 200ms (entrance in progress — palm + ground visible, mower not yet)
- Frame at 800ms (entrance half-done — mower + grass visible, headline mid-reveal)
- Frame at 1600ms (entrance complete — fully settled)
- Frame at scroll 0% (parallax at rest)
- Frame at scroll 50% (parallax bands separated)
- Frame at scroll 100% (parallax at maximum offset)

Each frame is diffed against the §2 acceptance baseline. Any motion
that breaks a layout baseline is a choreography failure, not an
artwork failure — re-tune the variant, not the asset.

## 9. Handoff to engineering (the asset pack is ready when)

All seven assets exist as WebP at q=82, are in `apps/web/public/hero/`,
and pass the §2 acceptance criteria. The motion sub-agent owns:

- `apps/web/src/components/sections/HeroCinematic.tsx` — update the
  layer slot imports from `.svg` to `.webp` paths, keep the
  `<Illustration />` wrapper or swap to `next/image` per the
  asset's blend-mode requirement
- `apps/web/src/components/sections/HeroCinematic.module.css` —
  replace the SVG `mix-blend-mode: multiply` rules with the
  per-layer blend targets from §3, drop the WP21 morning halo
  (`.glow`) if the new master already carries the warmth
- `apps/web/src/components/motion/variants.tsx` — add the
  three-band parallax variant from §7.2, add the desync micro-loop
  variants from §7.3
- `apps/web/visual/baselines/hero-cinematic-chromium-{desktop,mobile}.png`
  — regenerate via `bun run visual:snap` after the asset swap
- `apps/web/src/lib/content.ts` — update `hero.composition.callout`
  if the new scene changes the 33771 callout text

Engineering does NOT modify the prompts. The asset pack is the
contract; engineering consumes the contract.

## 10. Anti-pattern reminders (lifted from `_style-block.md`)

Do not introduce any of these. They are the v1 failure modes
and they will tank the v2 brief just as easily:

- ❌ Smiling family in front of perfect lawn
- ❌ Generic green grass texture tile (no lawn, just texture)
- ❌ Tropical kitsch: palm tree silhouette (used as decoration, not
      as a legitimate Pinellas palm), flamingo, sunset (as a focal
      point)
- ❌ Lawn equipment cutout on white background (e.g., isolated
      mower with no scene)
- ❌ AI-generated people — including the operator. Use stylized
      editorial abstraction for the operator portrait (out of scope
      for this brief)
- ❌ Lorem ipsum / "placeholder" / "COMING SOON" / "PHOTO
      PLACEHOLDER" text burned into the image
- ❌ Stock photo watermarks
- ❌ Blurry phone shots with thumb visible
- ❌ Aerial drone shots
- ❌ Mature trees with no leaves in winter (this is Florida;
      foliage is year-round)
- ❌ Photorealism / photo / 3D render / realism
- ❌ Black-and-white, low-contrast
- ❌ Anime / cel-shaded / vector-flat

## 11. See also

- `apps/comfyui/prompts/_style-block.md` — palette + LoRA + IP-Adapter
  calibration + shared negative block
- `apps/comfyui/prompts/hero.md` — v1 brief, superseded by this file
- `apps/comfyui/scripts/generate.py` — driver, seeds are computed
  here from the §5 table, not in the workflow JSON
- `apps/comfyui/scripts/convert-to-webp.mjs` — PNG → WebP at q=82
- `apps/comfyui/control/ip-style-ref.png` — IP-Adapter style anchor
- `apps/web/src/components/sections/HeroCinematic.tsx` — consumer
  of the asset pack (the contract this brief writes against)
- `apps/web/src/components/motion/variants.tsx` — consumer of the
  choreography brief in §7
- `product/front-end-redesign/04-motion-and-microinteractions.md` —
  PRD-04 motion token reference
- `product/front-end-redesign/05-photography-and-illustration-brief.md`
  — PRD-05 photography direction
- `brand/guidelines.md` — brand voice + palette + voice/tone table
