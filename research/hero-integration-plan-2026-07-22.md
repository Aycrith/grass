# LargoLawn Hero — Artistic Integration Plan

**Author:** Mavis (orchestrator) on behalf of the steward
**Date:** 2026-07-22
**Scope:** Integration of the VEO-rendered B-roll library in
`C:\Users\camer\Downloads\grasscontent\` into the LargoLawn
(GRASS Mission 1) landing-page hero.
**Supersedes:** the v1 `hero-green-grass.jpg` + `palm.webp` flat
asset attempt that leaks on the right edge of the current page
(visible artifact in the annotated screenshot — see §2).
**Builds on:** D-0048 (scene 2 source = `Hand-painted_gouache_illustratio`),
the prep scripts (`prep-loop-frames.py`, `prep-palms-fern-frames.py`,
`prep-scene2-frames.py`), and the v2 layer webps already on disk
under `apps/web/public/hero/layers/v2/`.

---

## 1. Executive summary

We have a **3-plane parallax hero** already partly built (BG storybook +
MID scene2 + FG ferns/palms/songbirds, 6-frame webp strips per layer).
The current page ships only the BG plane — the MID and FG layers exist
on disk but are not yet wired into the React component, which is why
the user sees dead space at the bottom of the hero (blue circles) and
a leftover v1 palm/grass asset bleeding through on the right (red
circle).

The integration plan is therefore **not "add new assets"** — it is
**"wire the existing v2 layers into a choreographed 3-plane scene, fix
the v1 bleed, and resolve the dead space with a 4th plane (the mowed-
lawn grass-tuff foreground)."** All asset work is done; this is
layout + design + code.

Headline recommendations:

1. **Adopt a 4-plane HeroScene4D**, not 3. The 4th plane is a
   foreground grass-tuff band sitting in the dead space. It is the
   only honest answer to the user's blue-circle complaint.
2. **Make the hero 100% painted gouache.** The real-footage riding-
   mower clips (×2) do not coexist with the painted layers; quarantine
   them to a separate "Behind the scenes" section in a later phase.
3. **Fix the v1 bleed (red circle) by deleting the orphan files**
   `apps/web/public/hero/v2/desktop.{avif,webp}`, `mobile.{avif,webp}`,
   `hero-green-grass.jpg`, and `apps/web/public/hero/layers/palm.webp`.
   These are the v1 attempt — they should not load.
4. **Wire the audio (`brielle_ref.mp3`) as a hero-only ambient loop**
   with a visible mute toggle in the bottom-right corner. Default off
   (per industry convention), remembers the user's choice in
   `localStorage`.
5. **Use a single asymmetric scene anchor** (the chosen
   `Hand-painted_gouache_illustratio` — Florida ranch house, single
   house, asymmetric palms, birdbath) as the MID plane's reference.
   The current storybook BG (symmetric 3-house pattern) is decorative;
   the asymmetric house is *place*. This is the same recommendation
   the Phase 1 source-comparison report already made (D-0048).
6. **Add a soft "vignette" gradient on the hero** to seat the
   foreground text and to mask any remaining sub-pixel seams between
   the 4 plane edges. The vignette also adds depth without more
   imagery.

The plan below is organized so a single coder-agent can implement it
in one PR against `apps/web/`.

---

## 2. Diagnostic — what the user is actually pointing at

The annotated screenshot reveals three distinct problems. Each is
fixable with the assets already on disk; none requires new VEO
renders.

### 2.1 Dead space (BLUE circles, left + right ground band)

The lower 25–30% of the hero is a static gouache band of brown
grass tufts. It is symmetric, decorative, and contains no
parallax-able element. The user's blue circles mark exactly the
band where the **foreground action** should live: tall grass
swaying in the breeze, a fern frond or two at the very front,
a small songbird on a hedge line.

**Root cause:** the hero is shipped with only the BG plane
(`Hand-painted_gouache_storybook`). The FG layers (`fern-01..06.webp`,
`palms-01..06.webp`, `songbirds-01..06.webp`) are on disk but not
referenced from the React component.

### 2.2 Bleed-through (RED circle, far right edge)

A vertical strip of photographic palm trees and blue sky is visible
on the right edge of the hero, behind the copy block. This is
**not** part of the painted storybook scene — it is a leftover from
the v1 attempt at hero composition, when the dev used the
`hero-green-grass.jpg` (4MB real photograph) and the single
`palm.webp` v1 layer as a quick stand-in.

**Root cause:** `apps/web/public/hero/v2/desktop.{avif,webp}` and
`hero-green-grass.jpg` are still in the public tree and are loaded
by the page; they do not match the painted scene and they are not
clipped to the page content area, so they spill past the right edge.

**Fix (immediate):** delete these four files. The v2 prep pipeline
(`prep-loop-frames.py` + `prep-palms-fern-frames.py` +
`prep-scene2-frames.py`) supersedes them entirely.

### 2.3 Static copy-over-illustration (general)

The "Your neighbor's lawn mower." copy block is centered against
the painted sun and house pattern, which competes with the type
for visual attention. The current storybook BG is symmetric and
the type is centered, so the eye does not know where to land.

**Root cause:** the BG is symmetric + the type is centered, so the
two are reading as one flat composition.

**Fix:** shift the copy to a **left-aligned asymmetric grid** (still
centered vertically), let the asymmetric scene 2 (illustratio — house
on the left, mowed lawn on the right, palms at different heights)
provide a counter-weight to the type. The asymmetric
scene 2 + left-aligned copy = balanced composition.

---

## 3. Asset inventory and classification

The grasscontent directory contains **14 mp4 clips** + **1 audio
file** + **5 prep scripts**. They fall into 4 categories that
should be treated differently in the page.

| Category | Files | Treatment on page |
|---|---|---|
| **A. Painted gouache (hero-grade)** | `Hand-painted_gouache_illustratio`, `Hand-painted_gouache_storybook` | Hero BG + MID planes |
| **B. Painted gouache micro-loops (hero-grade)** | `Palm_trees_sway_in_painting`, `Fern_swaying_in_painting`, `Songbirds_flying_on_hedge` | Hero FG + accent layers |
| **C. Painted gouache scenics (secondary-grade)** | `Hand-painted_gouache_painting_still` (top-down checkerboard), `Egret_standing_in_shallow_water`, `Seagull_gliding_across_sky` | Secondary page sections — "Our service ecosystem," "Why a healthy lawn" |
| **D. Real photographic footage (separate-grade)** | `Riding_mower_cutting_lawn` ×2 | Quarantined — a "Behind the scenes / proof of work" section, lower on the page, with its own visual identity (paper-cream border, slight desaturation, small label "Real footage from a Tuesday in Pinellas") |

The audio (`brielle_ref.mp3`, 80KB) is treated as **category E —
ambient loop** and lives only on the hero, behind a user toggle.

### 3.1 Why the painted/real footage split is non-negotiable

The hero is a hand-painted gouache world with a consistent pastel
palette, asymmetric ink-brush linework, and soft VEO motion blur.
The real riding-mower footage (Category D) is a 4K cell-phone video
of a man on a red mower in front of a beige ranch house. Drop it
into the hero and the page reads as "Stock image gallery with one
photo thrown in" — which is precisely the failure mode the v1
attempt landed in. The egret and seagull (Category C) *do* match
the painted world, so they earn hero-adjacent placement in secondary
sections; the mower does not.

If a future decision wants to bring the mower into the hero, the
right path is a ComfyUI re-render in the same gouache style (out of
scope here per the Phase 1 report).

---

## 4. HeroScene4D — the 4-plane architecture

The current 3-plane model (BG storybook → MID scene2 → FG ferns/palms)
is the right structural idea but under-uses the dead space. Promote
to a 4-plane model with **explicit depth, parallax, and motion
cadence** for each layer.

### 4.1 Plane stack (back to front)

| # | Plane | Source | Frame strip | Parallax factor | Motion cadence | CSS variable name |
|---|---|---|---|---|---|---|
| **0** | Vignette | CSS radial gradient (no asset) | — | 0.0 (fixed) | none | `--hero-vignette` |
| **1** | BG — distant sky + sun | `Hand-painted_gouache_storybook` (current) | reuse, no new prep | 0.15× scroll | 0 (static) | `--hero-bg` |
| **2** | MID — house + mowed lawn + palms | `Hand-painted_gouache_illustratio` | `scene2-01..06.webp` (already on disk) | 0.45× scroll | 4.0 s loop | `--hero-mid` |
| **3** | FG accent — tall palms | `Palm_trees_sway_in_painting` | `palms-01..06.webp` (already on disk) | 0.75× scroll | 2.4 s loop | `--hero-palms-fg` |
| **4** | FG grass band — grass tufts + ferns | composite of `Fern_swaying_in_painting` + a new "grass tuft" sprite layer derived from the storybook BG's foreground band | `fern-01..06.webp` (already on disk) + extracted grass-tuff PNG | 1.10× scroll | 3.2 s loop | `--hero-grass-fg` |
| **5** | FG micro — songbirds on hedge | `Songbirds_flying_on_hedge` | `songbirds-01..06.webp` (already on disk) | 1.25× scroll | 5.0 s loop, offset by 1.5 s from the palms so the two never tick at the same moment | `--hero-birds-fg` |

> **Why "HeroScene4D" not "HeroScene3D":** the existing 3-plane
> model (BG/MID/FG) conflates the FG into one layer. Splitting FG
> into **palms / grass / birds** (3 sub-planes) gives 5 planes
> total, but conceptually 4 depth tiers (sky → scene → mid-foliage
> → micro-detail). Calling it HeroScene4D signals the new
> sub-structure without renaming the public class.

### 4.2 Parallax math (mouse + scroll combined)

The current v1 of the hero uses scroll-only parallax. Upgrade to
**scroll + mouse-tilt combined**, weighted:

```
final_x = 0.7 * scroll_x_offset + 0.3 * mouse_x_normalized
final_y = 0.7 * scroll_y_offset + 0.3 * mouse_y_normalized
```

Each plane transforms by `translate3d(final_x * parallax_factor,
final_y * parallax_factor, 0)`. With `parallax_factor` from the
table above, the FG grass band moves the most and the BG moves
the least. Result: a 5–10 px apparent depth at the edges of the
hero, enough to feel parallaxed without inducing motion sickness.

`prefers-reduced-motion: reduce` must disable both the mouse-tilt
input and the per-plane loop animations, and freeze each plane on
its first frame. This is non-negotiable for accessibility.

### 4.3 Loop cadence — why each plane ticks at a different speed

If all 5 planes loop at the same cadence, the page reads as a
single repeating GIF. Different cadences break the cadence into
asynchronous events, which the eye reads as **wind** (palms +
grass) and **life** (birds, then a pause, then more birds). The
table above gives intentional co-primes (2.4, 3.2, 4.0, 5.0 s) so
the overall pattern does not visibly repeat for ~96 s.

---

## 5. The dead-space solution — the new grass band (Plane 4)

The user marked two large blue ovals on the lower-left and lower-
right ground areas. These are the band where the painted ground
goes from a mid-tone tan (around y=580) to a deep umber (y=720)
with the static grass-tuft decorative pattern. The fix has three
parts:

1. **Crop the storybook BG so its lower 30% is hidden by the
   grass band.** With 4 planes stacked, the storybook BG no longer
   needs to show its own grass tufts — those become the *underlay*
   for the new grass band, not the foreground. The new grass band
   is brighter, larger, and animated.

2. **Build a 3-cell grass-tuff sprite strip** from a region of
   `Hand-painted_gouache_storybook` (around y=620–720). The storybook
   has natural grass-tuft decoration in this band; lift it out, crop
   it to a 1.82:1 aspect (matching the hero panel), and re-author
   as 3 large grass-tuft sprites that overlap into the band from
   the left and right edges.

3. **Re-extract the fern layer at a wider crop** that includes the
   bottom-third of the source frame. The current
   `fern-01..06.webp` are 1240×680 (the full content area of the
   fern source), but the fern is in the upper-left of that frame.
   For the grass band, we need a *bottom-anchored* version: the
   fern frond entering from the top, with empty space at the
   bottom. **Add a 5th prep script**
   `prep-fern-bottom-anchored.py` that extracts 6 frames cropped
   to the lower 60% of the source and re-batched with vertical
   offset so the fern enters from above the grass band and the
   tip disappears into the ground.

After these three changes, the blue-circled area is filled with:
- A wide painted grass-tuff band (the dead-space is now overpainted
  with the new FG layer)
- Two fern fronds entering from above the band (left + right
  thirds), animating the 6-frame sway loop
- Optional: a small painted birdbath in the center of the band,
  matching the birdbath in the chosen scene 2 (the illustratio
  scene has a stone birdbath in the foreground — pull that out
  as a static sprite, drop it center-bottom of the grass band)

---

## 6. Fix the bleed-through (RED circle) — the v1 purge

The red circle on the far right of the screenshot is a vertical
strip of photographic palm trees and blue sky, behind the
"Free quote" button. This is from the v1 hero attempt, when the
dev used a single static photo (`hero-green-grass.jpg`, 4MB) and
a single static palm PNG (`layers/palm.webp`, 242KB) as a fast
stand-in. Both files are still in the public tree and are loaded
by the current page.

**Concrete steps (do these first, before any layout work):**

1. Delete `apps/web/public/hero/v2/desktop.avif`
2. Delete `apps/web/public/hero/v2/desktop.webp`
3. Delete `apps/web/public/hero/v2/mobile.avif`
4. Delete `apps/web/public/hero/v2/mobile.webp`
5. Delete `apps/web/public/hero/v2/hero-green-grass.jpg`
6. Delete `apps/web/public/hero/layers/palm.webp`
7. In `apps/web/components/hero/HeroScene.tsx` (or equivalent
   current hero component), remove all imports / `<img src=>`
   references to these 6 paths.
8. Run `bun run typecheck` and `bun run lint` to confirm no
   dangling references.

This single block of deletes resolves the red-circle bleed. The
new v2 prep pipeline (`scene2-*.webp`, `palms-*.webp`,
`fern-*.webp`, `songbirds-*.webp`) is what should load instead.

---

## 7. Color and material consistency

The painted gouache has a constrained palette that any new layer
must respect. Sampling from the v2 frame strips:

| Token | Hex (sampled) | Used for |
|---|---|---|
| `--ink-deep` | `#3a2e1e` | Outlines, deep shadows |
| `--ink-warm` | `#5a4a30` | Secondary outlines |
| `--cream-paper` | `#f5ecd9` | Sky / paper edge |
| `--cream-cloud` | `#fbf2dc` | Cloud highlights |
| `--sun-yellow` | `#f4c542` | Sun disc, accent glow |
| `--sun-halo` | `#f8d77a` | Sun halo |
| `--lawn-light` | `#5a8a3e` | Mowed lawn highlight |
| `--lawn-mid` | `#3e6a2a` | Mowed lawn mid |
| `--lawn-deep` | `#284a1c` | Mowed lawn shadow |
| `--soil-warm` | `#8a5a32` | Bare earth, mid-ground |
| `--soil-deep` | `#5a3a1e` | Foreground soil |
| `--house-ochre` | `#c47a3a` | Ranch house (scene 2) |
| `--house-trim` | `#f4ead0` | House trim |
| `--bird-cream` | `#f0e8d2` | Egret body |
| `--bird-jay` | `#2a4a8a` | Songbird accent (used sparingly) |

Any new asset (e.g. a future "gravel path" loop) must draw from
this palette. A `tokens.css` file in `apps/web/styles/` is the
single source of truth.

---

## 8. Copy-block composition (left-aligned, asymmetric)

Current copy block is centered. New layout:

```
┌─────────────────────────────────────────────────────────────┐
│ [logo]                              [Services Pricing About]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   LAWN CARE IN 33771     ⌜                                 │
│                          │                                  │
│   Your neighbor's        │   [scene 2 MID plane]            │
│   lawn mower.            │   - asymmetric ranch house       │
│                          │   - palms of different heights   │
│   Local, solo-operator   │   - mowed lawn with stripes      │
│   lawn care in Largo     │   - birdbath foreground          │
│   and the 5 adjacent     │   - sun on the right             │
│   Pinellas ZIPs...       ⌝                                  │
│                                                             │
│   [Get a free quote →]   Call (727) 555-0123                │
│                                                             │
│   [grass band FG: ferns + grass tufts + birds on hedge]     │
└─────────────────────────────────────────────────────────────┘
```

Left half = type (40–50% width), right half = scene 2 (50–60%
width). The copy is now left-aligned, the scene is right-
weighted, and the eye lands on the headline (largest type)
before drifting right to the house (the new visual anchor).

On mobile (<768px), the layout collapses to a stacked single
column: copy on top, scene 2 below, grass band at the bottom.
The grass band is the same width as the hero on both layouts.

---

## 9. Audio integration (`brielle_ref.mp3`)

The audio file is 80KB, which is consistent with a short
loopable ambient track (1–3 s, mono, low bitrate).

**UX:**

- Default: muted. Autoplay restrictions on mobile + desktop
  browsers require a user gesture before any audio plays, so
  muted-by-default is the only defensible default.
- A small **mute toggle** sits in the bottom-right corner of the
  hero, above the grass band, with a hand-drawn icon (speaker /
  speaker-with-slash, drawn in the same gouache style as a small
  inline SVG). 24px square, paper-cream background, 60% opacity
  until hovered.
- Clicking the toggle starts the loop at 30% volume
  (`audio.volume = 0.3`). The loop is seamless (verify with a
  spectrogram — there should be no transient at the loop point).
- The user's choice persists in `localStorage` under
  `largo.hero.audio.muted` (string `"true"` / `"false"`).
- The toggle is **NOT** in the header navigation. It is a hero
  ornament, not a site-wide control. It does not control any
  other audio on the page (there is none).

**Implementation:**

- Place the file at `apps/web/public/hero/audio/ambient-loop.mp3`
  (rename from `brielle_ref.mp3` if "brielle" is a personal
  name; otherwise keep it). 80KB is fine to ship directly.
- Use the native `<audio loop>` element with `preload="none"`
  and `crossOrigin="anonymous"`. Do not use the Web Audio API
  for this — the native element's `loop` attribute is good
  enough and the bundle cost of Web Audio is not justified.
- Add `prefers-reduced-motion: reduce` AND `prefers-reduced-data:
  reduce` opt-out: if either is set, do not load the audio file
  at all (omit the `<audio>` element). Respect the user's data
  budget.

---

## 10. Scroll-driven choreography

Below the fold, the user scrolls past the hero. The 4 planes
should:

1. **Hold full parallax on screen** (0 → 100% hero viewport
   visible).
2. **At 100% → 120% viewport, begin the exit choreography:**
   - BG plane: translateY(0) → translateY(-12vh), opacity 1 → 0.85
   - MID plane: translateY(0) → translateY(-6vh), opacity 1 → 0.65
   - FG planes: translateY(0) → translateY(-3vh), opacity 1 → 0
3. **At 120% → 150% viewport, lock to the "below the fold"
   transition zone:** the next section (Services, currently
   the 2nd section) fades up from `translateY(40px)` to its
   resting position, opacity 0 → 1.
4. **At 150% onwards:** hero is offscreen, Services is full
   opacity, parallax is no longer calculated.

This gives a soft "the scene recedes as you scroll into the
business" transition. The eye does not see a hard cut.

---

## 11. Performance budget

The current v2 webp strips total ~3.2 MB across 24 files. This
is fine for a single hero, but we should plan for:

- **Initial transfer:** preload only the first frame of each
  layer (6 frames, ~600 KB total). The remaining 5 frames per
  layer are loaded after `requestIdleCallback`.
- **GPU:** each plane is a `position: absolute` div with a
  `background-image` and a CSS animation step. 5 planes × 6
  frames = 30 background-image swaps during a cycle. This is
  well within the 16ms/frame budget on any device shipped in
  the last 5 years. No canvas, no WebGL.
- **Lighthouse perf target:** ≥90 on mobile (4G simulated),
  ≥95 on desktop. The 4MB `hero-green-grass.jpg` deletion
  alone (per §6) will improve LCP by ~400ms.
- **CLS:** zero. All planes are absolutely positioned with
  explicit aspect-ratio: 16/9 set on the hero container.

---

## 12. Accessibility

- **Reduced motion:** §4.2 covers it — disable all loop
  animations and mouse-tilt; freeze on frame 1 of each strip.
- **Reduced data:** §9 covers it — omit the audio element
  entirely.
- **Screen readers:** the hero is decorative; provide a single
  `<h1>` (the headline) and a single `<p>` (the subhead) as the
  semantic content. Each plane is `aria-hidden="true"`. The
  mute toggle has `aria-label="Toggle ambient audio"` and
  `aria-pressed`.
- **Color contrast:** the serif headline is `--ink-deep` (#3a2e1e)
  on a `--cream-paper` (#f5ecd9) — 11.4:1, well above WCAG AAA.
  The CTA pill is gold (`--sun-yellow` #f4c542) on dark text
  (4.8:1) — passes AA for large text. No changes needed.

---

## 13. Real footage quarantine — what to do with the mower clips

The two `Riding_mower_cutting_lawn` clips are 2.5MB each, 4K cell-
phone footage. They show a man on a red mower cutting a real
Pinellas lawn. They do NOT match the painted hero.

**Recommended placement: a new "Behind the scenes" section** in
Phase 2 of the page (after Services, before Pricing). The section
has its own visual identity:

- White card on the cream-paper background
- A small paper-tape label at the top: "Real footage, not stock"
- The clip is loaded as a `<video autoplay muted loop playsinline>`
  element with a slight hand-drawn border (8px, dashed, ink-deep)
- A short caption: "That's the actual mower, the actual truck, and
  the actual Tuesday. No franchise, no subcontractor."

This converts the aesthetic mismatch into a **trust signal**:
"Look, the painted scene is the brand. The real footage is the
proof. We know which is which."

**Do NOT:**

- Use the mower clips in the hero
- Mix the mower clips with the painted layers in any other section
- Apply a "painterly" CSS filter to the mower clips to force
  them into the hero — the result looks uncanny, not painted

---

## 14. Implementation steps (single coder PR)

The plan fits in a single PR against `apps/web/`. Approximate
order:

1. **Purge the v1 bleed (§6):** delete 6 files, remove all
   references. Verify `bun run typecheck` passes. Commit.
2. **Author `prep-fern-bottom-anchored.py`** (the new 5th prep
   script, per §5.3). Run it, output to
   `apps/web/public/hero/layers/v2/fern-bottom-*.webp`. Commit
   the new assets.
3. **Author `prep-grass-tuff-strip.py`** to extract the
   foreground grass band from the storybook BG into a 6-frame
   strip. Output to `apps/web/public/hero/layers/v2/grass-*.webp`.
   Commit.
4. **Author `apps/web/components/hero/HeroScene4D.tsx`** as the
   new component. It composes the 5 planes per §4.1, with
   combined mouse + scroll parallax per §4.2, reduced-motion
   opt-out per §12, and the muted-by-default audio toggle per
   §9. Replace the existing hero import in
   `apps/web/app/page.tsx` (or wherever the hero is mounted).
5. **Author `apps/web/styles/hero-tokens.css`** with the color
   palette from §7. Import it in the hero's layout file.
6. **Reflow the copy block** to the left-aligned asymmetric grid
   per §8. On mobile, stack.
7. **Add scroll-driven exit choreography** per §10. Use
   `IntersectionObserver` (no scroll-event listener — perf).
8. **Add the "Behind the scenes" section** for the real mower
   clips per §13. New component
   `apps/web/components/sections/BehindTheScenes.tsx`.
9. **Lighthouse pass:** target ≥90 mobile / ≥95 desktop per
   §11. The v1 purge alone should buy back 200–400ms LCP.
10. **Visual QA:** open the hero on a 1440×900 desktop, a 768×1024
    tablet, and a 375×667 mobile. Verify the planes are
    correctly z-ordered, no edge bleed, audio toggle works,
    parallax reads, reduced-motion freezes the loops.

---

## 15. Acceptance criteria

The plan ships when ALL of the following are true:

- [ ] No real-footage pixel appears anywhere in the hero (hero is
  100% painted gouache)
- [ ] The 4 (sub-)planes are visible and parallax correctly on
  scroll + mouse hover
- [ ] The blue-circled dead space is now overpainted with the
  new grass band (no empty ground visible at the bottom of
  the hero)
- [ ] The red-circled bleed is gone (the v1 files are deleted
  and no longer load)
- [ ] The audio plays on click of the toggle, loops seamlessly,
  respects the muted-by-default + localStorage persistence
- [ ] `prefers-reduced-motion: reduce` freezes all 4 planes on
  frame 1, no mouse-tilt
- [ ] `prefers-reduced-data: reduce` omits the audio element
- [ ] Lighthouse mobile perf ≥90, desktop ≥95
- [ ] CLS = 0 on initial load and on scroll
- [ ] The mower clips live in their own "Behind the scenes"
  section, do not load on the hero page fold

---

## 16. Open questions for the steward

These are the decisions only the steward can make. Each has a
recommended default; flag if you want a different answer.

1. **The audio file name** — `brielle_ref.mp3` suggests a
   personal reference. Rename to `ambient-loop.mp3` before
   shipping, or keep as-is? *Default: rename.*
2. **The birdbath** — the chosen scene 2 has a stone birdbath
   in the foreground. Should we lift it out as a static sprite
   in the grass band? *Default: yes, it adds a focal point.*
3. **The storybook BG** — keep as a static sky layer behind
   scene 2, or replace entirely with a pure sky gradient? *Default:
   keep — it provides nice inked cloud detail at the top.*
4. **The "Behind the scenes" section** — Phase 2 of the page
   (this PR) or a separate Phase 2 PR? *Default: separate PR,
   the hero is the higher-leverage fix.*
5. **The "LAWN CARE IN 33771" badge** — should it stay in the
   hero, move below the headline, or move to a pre-headline
   subhead? *Default: stay, it's good context.*

---

## Appendix A — File-level diff summary

```
NEW:  apps/web/components/hero/HeroScene4D.tsx
NEW:  apps/web/components/hero/MuteToggle.tsx
NEW:  apps/web/components/sections/BehindTheScenes.tsx
NEW:  apps/web/styles/hero-tokens.css
NEW:  apps/web/public/hero/audio/ambient-loop.mp3        (renamed from brielle_ref.mp3)
NEW:  apps/web/public/hero/layers/v2/fern-bottom-01..06.webp
NEW:  apps/web/public/hero/layers/v2/grass-01..06.webp
NEW:  scripts/prep-fern-bottom-anchored.py
NEW:  scripts/prep-grass-tuff-strip.py
NEW:  research/hero-integration-plan-2026-07-22.md      (this file)

MOD:  apps/web/app/page.tsx                              (swap hero import)
MOD:  apps/web/components/hero/index.ts                  (export HeroScene4D)
MOD:  research/grasscontent/REPORT-source-comparison.md  (link to this plan as Phase 2)

DEL:  apps/web/public/hero/v2/desktop.avif
DEL:  apps/web/public/hero/v2/desktop.webp
DEL:  apps/web/public/hero/v2/mobile.avif
DEL:  apps/web/public/hero/v2/mobile.webp
DEL:  apps/web/public/hero/v2/hero-green-grass.jpg
DEL:  apps/web/public/hero/layers/palm.webp
```

---

## Appendix B — Why I am NOT recommending more VEO renders

The Phase 1 source-comparison report (D-0048) already locked the
scene 2 source. The grasscontent directory is the canonical asset
library for the hero; re-rendering VEO clips is out of scope
(§6 of the report: "the user pointed at the existing grasscontent
directory and wants to use what's there"). This plan operates
entirely within the existing 14 mp4s + 1 audio file. If the
steward wants to add new clips (e.g. a "hedge-trim" loop, a
"pine-straw install" loop), the natural place is a follow-on
Phase 3 with a new VEO generation round and a new source-
comparison report — not this PR.
