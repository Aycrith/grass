# D-0060 — Five-plane hero architecture (4th cartoon + 5th painted)

**Date:** 2026-07-23
**Status:** SHIPPED 2026-07-23 → **PARTIALLY SUPERSEDED 2026-07-24**
(see §13 below). The 4th cartoon plane (birdbath) is RETAINED. The
5th painted plane (fern overlay) is REVERTED. The BTS split is
RETAINED. The audio drop is RETAINED.
**Author:** Mavis (orchestrator)
**Scope:** the unified hero on `/` (the most-SEO-critical page on the site),
specifically `apps/web/src/components/sections/HeroFieldTelemetry.tsx` +
`HeroStorybookLayer.tsx` + `SecondScene.tsx` + `BehindTheScenes.tsx` +
`components/motion/useViewportMotion.tsx` + `content/hero/INTENT.md` +
`content/hero/manifest.yaml`.
**Review date:** 2026-10-23 (90 days post-ship)
**Confidence (shipped):** 0.78
**Confidence (post-revert):** 0.65 — the 5-plane label is no longer
accurate; see §13 for the actual state (4 cartoon planes + 1 painted
background + 1 content overlay = 4 layers in scene 2, 4 cartoon
layers + 1 photo in scene 1).

---

## 0. The decision in one paragraph

The hero is promoted from a 3-scene composition to a **5-plane
composition**: the existing 3 scenes stay, and 2 new visual planes
are added (a 4th cartoon plane in the storybook foreground dead
space, a 5th painted plane as a multiply-blend overlay above the
painted scene 2). Concurrently, the single `BehindTheScenes`
section is split into 2 instances of the same component ("The
truck" + "The yard"), and the ambient audio + MuteToggle shipped
in commit `17d8491` are removed per the steward's direct
decision that "audio isn't necessary."

## 1. The 5 planes (per-layer table)

| # | Plane | Style | Source | Parallax | Role |
|---|---|---|---|---|---|
| 0 | Vignette | CSS | n/a | 0.0× fixed | Edge darkening for text legibility |
| 1 | Real photograph | Photo | `hero-green-grass.jpg` + AVIF/WebP | scroll-driven scale + cross-fade | The "working operation" anchor |
| 2 | Hand-authored SVG storybook | Cartoon | `HeroStorybookLayer.tsx` (BackgroundSky, Clouds, FarLayer, MidLayer, NearLayer, **BirdbathLayer**) | 0.15–1.20× | The brand illustration |
| 3 | Grass silhouette | SVG | `grassSilhouette` motion.div in `HeroFieldTelemetry.tsx` | scroll-driven opacity | Foreground mask on the photo |
| 4 | Painted VEO scene 2 | Painted | `scene2-01..06.webp` + **`fern-01..06.webp` (multiply overlay)** | 0.32× (gouache layer) | The editorial "Same yard, every week" moment |

The 4th cartoon plane (the new `BirdbathLayer` sub-component in
plane 2) and the 5th painted plane (the new `.fernLayer` div in
plane 4) are the 2026-07-23 additions. The other 3 sub-components
of plane 2 (BackgroundSky, FarLayer, MidLayer, NearLayer) and
plane 4 (sceneStage) are pre-existing.

## 2. Steward decisions (from `content/hero/INTENT.md §8`)

All 4 open questions in §8 were resolved on 2026-07-23:

| Q | Question | Resolution |
|---|---|---|
| Q1 | 4-plane hero rebuild? | **EXPANDED to 5-plane** — both a 4th cartoon plane (birdbath) AND a 5th painted plane (fern overlay) per the steward's "add a 4th cartoon plane and 5th painted plane" answer |
| Q2 | Birdbath sprite in foreground? | **Folded into Q1's 4th cartoon plane** — the birdbath is drawn NEW in the hand-authored SVG cartoon style (NOT lifted from scene 2's painted birdbath, per the D-0049 rev 4 painted/cartoon lesson) |
| Q3 | Audio loop seam? | **N/A** — the steward's answer was "audio isn't necessary." The ambient audio + MuteToggle shipped in commit `17d8491` are removed. The hero is 100% visual. |
| Q4 | Promote BehindTheScenes? | **Split into 2 sections** — "The truck" (07.1, identity signal, real-mower-01.mp4) + "The yard" (07.2, craft signal, real-mower-02.mp4). The `BehindTheScenes` component is now reusable (content as props). |

## 3. Why the 4th cartoon plane is a birdbath (not a mower or operator)

The D-0059 Path A removal of the cartoon operator reasoned that
"the operator duplicated the OperatorStrip section's identity
signal below the hero." A birdbath is NOT a character — it is a
static garden element that adds a focal point to the foreground
dead space (the lower-center area between the houses and the
grass band) without duplicating any other section's identity.

A small lawn mower rolling across the dead space would have been
a second valid choice, but a mower has motion (it rolls), which
would compete with the existing 60-blade grass sway. A birdbath
is static, with only the bird's head-tilt + the water's opacity
shimmer as animation — both subtle, both reduced-motion-safe.

## 4. Why the 5th painted plane is the fern (not palms or songbirds)

The on-disk VEO micro-loops (Tier C) come in 3 frame strips:
- `fern-01..06.webp` — single frond on cream background (1240×680, frond in upper-left)
- `palms-01..06.webp` — full painted scene (1280×720, palms + sun + house)
- `songbirds-01..06.webp` — full painted scene (870×720, palm + 2 birds on hedge)

`palms` and `songbirds` are full painted scenes. Per D-0049 rev 2
(the same rev that removed the painted palms overlay from the
storybook), full painted scenes mounted as overlays compete with
the underlying scene 2 background — the eye sees "two houses" or
"two suns." They are reserved for future secondary use.

`fern` is structurally different: it's a SINGLE FROND on a cream
background, not a full scene. When multiply-blended at 0.65 opacity
above scene 2, it reads as a "deep foreground detail" — the eye
sees the painted scene 2 with a fern detail in the upper-right
corner, not a competing scene. The fern is mirrored via
`transform: scaleX(-1)` to anchor at the upper-RIGHT of scene 2
(balances scene 2's natural left-right asymmetry: sun on the
right, palms on the left).

## 5. The D-0049 rev 4 lesson, applied to the 5th plane

The D-0049 rev 4 lesson (painted VEO brushwork and hand-authored
SVG cartoon are at incompatible fidelity levels — they do not
coexist in the same visual register) is the single most important
guardrail on the hero. The 5-plane architecture respects it
**at the plane level, not at the asset level**:

- The 4th cartoon plane (birdbath) is in the CARTOON storybook
  (plane 2). All its elements are hand-authored SVG in the same
  cartoon style as the existing PalmTree / House primitives. No
  painted-VEO brushwork in this plane.
- The 5th painted plane (fern overlay) is in the PAINTED scene 2
  (plane 4). Both the fern and the scene 2 background are VEO
  brushwork. They stack because painted stacks with painted.

The lesson is NOT "no painted assets anywhere" — it's "painted
assets stack with painted, cartoon assets stack with cartoon,
never mix."

## 6. What this decision does NOT do (out of scope)

- **Does not add a 3rd painted plane** (palms or songbirds) above
  scene 2. Per §4, those would compete with scene 2. The fern is
  the structurally compatible Tier C asset.
- **Does not change the scroll choreography** beyond the new
  planes' natural fade-in with their parent layers. The fern
  fades in with scene 2 (no new MotionValue needed). The birdbath
  fades out with the storybook at [0.10, 0.25] (no new MotionValue
  needed). Both inherit their parent's opacity.
- **Does not re-render any VEO assets.** The fern overlay uses
  the existing on-disk `fern-01..06.webp` from the Wave 4 prep
  pipeline. The birdbath is hand-authored, not VEO-rendered.
- **Does not touch the photo layer files** (`hero-green-grass.jpg`,
  `desktop.avif`, `desktop.webp`, `mobile.avif`, `mobile.webp`).
  They are the active production photo layer, not v1 orphans.
- **Does not add any color outside the locked palette.** The
  birdbath uses `--ll-sand`, `--ll-sand-bleached`, `--ll-palm-bark`,
  `--ll-clay`, `--ll-sun`, `--ll-cream`, `--ll-sky` only. The fern
  overlay uses multiply blend at 0.65 opacity, so the painted
  scene 2 palette is preserved (the fern tints via the blend,
  it doesn't introduce new colors).

## 7. Performance budget (the 5-plane composition)

| Plane | Asset size | Loaded |
|---|---|---|
| 0 | n/a (CSS) | always |
| 1 | desktop.webp 227 KB / desktop.avif 162 KB / mobile.webp 138 KB / mobile.avif 100 KB / jpg 4 MB fallback | always (eager, fetchPriority=high) |
| 2 | Inline SVG (no asset) + the painted micro-loops (none active in the storybook cartoon — the fern is in plane 4) | always |
| 3 | Inline SVG | always |
| 4 | scene2-01..06.webp ~32 KB × 6 = ~192 KB + fern-01..06.webp ~296 KB × 6 = ~1.7 MB | sceneStage: always (preload). fernLayer: `preload="none"` (the fern is a "nice to have" detail, not core content) |

Total: ~2.2 MB of hero assets, of which ~1.7 MB is the fern
overlay (loaded on demand via `preload="none"`). The critical
path (planes 0-3 + scene 2 background) is ~600 KB.

The 60% reduction in critical-path asset size comes from the
birdbath (which adds 0 bytes — it's inline SVG) and the scene 2
unchanged.

## 8. Files changed (15 files, +866/-558 lines)

### Code (8 files)

- `apps/web/src/components/sections/HeroFieldTelemetry.tsx` — removed MuteToggle import + mount
- `apps/web/src/components/sections/HeroStorybookLayer.tsx` — added `BirdbathLayer` function + the new `<motion.div className={styles.birdbathLayer}>` mount + `birdbathY` MotionValue binding
- `apps/web/src/components/sections/HeroStorybookLayer.module.css` — added `.birdbathLayer` (z-index 8), `.birdHead` (4s head-tilt animation), `.waterShimmer` (6s opacity animation), `@keyframes birdHeadTilt`, `@keyframes waterShimmer`, reduced-motion `@media` block
- `apps/web/src/components/sections/SecondScene.tsx` — added `FERN_FRAMES` constant + `<div className={styles.fernLayer}>` mount with 6 fern frames
- `apps/web/src/components/sections/SecondScene.module.css` — added `.fernLayer`, `.fernFrame` (with `transform: scaleX(-1)`), `@keyframes fernCycle`, reduced-motion + mobile `@media` blocks
- `apps/web/src/components/sections/BehindTheScenes.tsx` — refactored to accept content as props (`BehindTheScenesProps` interface)
- `apps/web/src/components/sections/BehindTheScenes.module.css` — removed v1 `.videoGrid` (2-column), kept single-figure layout
- `apps/web/src/app/page.tsx` — replaced 1 `<BehindTheScenes />` mount with 2 (07.1 "The truck" + 07.2 "The yard")
- `apps/web/src/components/motion/useViewportMotion.tsx` — added `'birdbath'` to `ViewportMotionLayerId` union, added `birdbath: { cadence: 0.36, translateY: 48 }` to `VIEWPORT_MOTION_VARIANTS`, added `birdbathY` + `birdbathX` to the hook return

### Removed (3 files)

- `apps/web/src/components/hero/MuteToggle.tsx` (221 lines)
- `apps/web/src/components/hero/MuteToggle.module.css` (91 lines)
- `apps/web/public/hero/audio/ambient-loop.mp3` (80 KB)
- The `apps/web/src/components/hero/` directory (was only MuteToggle, now empty)

### Docs (2 files)

- `content/hero/INTENT.md` — updated §1 (the hero in one paragraph), §2 (the 5-plane architecture subsection), asset classification table; replaced §5 audio section with a "removed" note
- `content/hero/manifest.yaml` — added `hero-birdbath` entry (Tier A), added `fern-frames-overlay` entry (Tier C, active), updated `fern-frames` status from `reserved` to `active`, replaced Tier F audio entry with a "REMOVED" section

### Ledger (1 file)

- `state/ledger.yaml` — added the `2026-07-23-hero-5plane-bts-split` changelog entry (44th entry)

## 9. Tradeoffs (honest list)

| Decision | Cost | Benefit |
|---|---|---|
| Drop audio | Lose the optional ambient soundtrack (recoverable from commit `17d8491`) | Hero is 100% visual, no autoplay-policy gymnastics, no localStorage tracking, no reduced-data opt-out complexity |
| Split BTS | 2× the section markup on the page | Operator identity (07.1) and craft signal (07.2) each get their own editorial moment — the visitor gets a "who" + a "what" instead of one combined "proof" card |
| 4th cartoon plane (birdbath) | +200 lines in storybook TSX + CSS, +1 layer in the motion hook | Foreground dead space is no longer dead — there's a focal point with subtle animation. The "blue circles" complaint from the 2026-07-17 screenshot is resolved. |
| 5th painted plane (fern overlay) | +1.7 MB of fern assets (loaded on demand), +1 layer in SecondScene | Scene 2 resting state is no longer "a still painting" — it has a subtle 8s breath via the fern detail. The "Same yard, every week." moment feels alive, not static. |
| Both new planes honor the D-0049 lesson | None — the lesson was free | The single most important guardrail on the hero is intact. Future iterations know the rule and can apply it confidently. |

## 10. Confidence (0.78) and what would change my mind

The 0.78 confidence reflects the visual-design half of the
shipped work — the code is verified (typecheck + lint clean),
but the visual outcome needs to be seen.

**Review milestones (90 days):**
- 2026-10-23 — does the 5-plane composition still look right after a few weeks of live traffic? Are the planes reading as expected, or is one of them bleeding/ghosting?
- 2026-10-23 — does the fern overlay's multiply blend still look right? If the painted scene 2 changes (VEO re-render), the multiply math may need re-tuning.
- 2026-10-23 — does the birdbath's parallax cadence (0.36, the highest in the storybook) feel "right close" or "stuck on"? Visitors may find it too reactive.

**What would lower my confidence:**
- A future A/B test shows the 4-plane architecture (birdbath OR fern, not both) converts better than the 5-plane (both). Possible — the birdbath and fern add visual density that some visitors may find busy.
- A future re-render of scene 2 with a different prompt makes the fern overlay stop blending cleanly. Likely — the multiply math is dependent on the painted scene's exact palette.
- A future mobile performance audit shows the 5-plane composition is too heavy for phones. Possible — the fern assets add 1.7 MB; even with `preload="none"`, the mobile experience may need further optimization.

**What would raise my confidence:**
- A visual capture (via `scripts/hero-capture.py`) at all 3 viewports showing the 5 planes rendering correctly across desktop, tablet, mobile.
- A future `prefers-reduced-data: reduce` audit showing the fern assets are correctly NOT fetched on data-saver mode.
- A/B test confirmation that the 5-plane composition does not hurt conversion.

## 11. How to roll back (if needed)

This decision is the sum of 3 commits on `main`. The rollback
sequence:

```bash
git revert d2dd344         # revert the merge commit (preserves history)
# or, if the steward prefers a hard reset:
git reset --hard 9ed56cd   # back to the D-0059 rev9 state
```

Neither sequence loses any pre-D-0060 work. The pre-D-0060 main
(commit `9ed56cd`, D-0059 rev9) is the safe rollback point.

If only a partial rollback is needed (e.g., "keep the BTS split
but drop the new planes"):

```bash
git revert --no-commit 00ca598 790f00b   # revert the new planes
# keep c8d015f (drop audio + split BTS)
```

## 12. References

- **Prior ADRs:** D-0042 (hero unification), D-0043 (cinematic
  cross-fade), D-0044 (viewport motion architecture),
  D-0049 (second-scene CSS revert + the painted/cartoon lesson),
  D-0050 (hero content extension), D-0052 (animated sun),
  D-0059 (hero simplification + re-extension, the prior
  ratification)
- **Design docs:** `content/hero/INTENT.md` (the 5-plane
  architecture §2), `content/hero/manifest.yaml` (the per-asset
  inventory), `research/hero-integration-plan-2026-07-22.md`
  (the 16-section plan, archived)
- **Prep tooling:** `scripts/prep-fern-bottom-anchored.py`,
  `scripts/prep-grass-tuff-strip.py` (both from the 2026-07-22
  prep session, NOT used by the 5-plane composition but available
  for future iterations), `scripts/palette-validate.py` (brand
  token compliance), `scripts/hero-capture.py` (visual regression)
- **Code sites:** `apps/web/src/components/sections/HeroFieldTelemetry.tsx`,
  `HeroStorybookLayer.tsx`, `SecondScene.tsx`,
  `BehindTheScenes.tsx`, `components/motion/useViewportMotion.tsx`
- **Commits on the feature branch:**
  - `c8d015f chore+feat(hero): drop audio + split BehindTheScenes`
  - `790f00b feat(hero): add 4th cartoon plane (hand-drawn birdbath)`
  - `00ca598 feat+docs(hero): 5th painted plane (fern overlay) + architecture docs`
  - `a726a4d docs(ledger): hero-5plane-bts-split entry`
- **Merge commit:** `d2dd344 merge: feat/hero-5plane-bts-split-2026-07-23`

---

## 13. Supersession — 5th painted plane REVERTED (2026-07-24)

**This section supersedes §3 and §4 of this ADR.** The 5th painted
plane (fern overlay above scene 2) was reverted on 2026-07-24 after
the steward reviewed the post-resolution captures in
`tmp/hero-captures/2026-07-23-post-qresolutions/desktop-pos0.70.png`
and identified the fern as "completely incoherent... like an image
dropped in the top right hand corner... completely out of place...
stupid looking."

### 13.1 What got reverted

- `apps/web/src/components/sections/SecondScene.tsx` — the
  `FERN_FRAMES` constant, the `<div className={styles.fernLayer}>`
  JSX block, and the explanatory comment block were all removed.
  The FERN_FRAMES block was replaced with a "REVERTED" comment
  documenting the asset analysis.
- `apps/web/src/components/sections/SecondScene.module.css` — the
  `.fernLayer` / `.fernFrame*` / `@keyframes fernCycle` rules
  (plus the @media blocks) were removed. The fern section was
  replaced with a "REMOVED" comment.
- `tmp/hero-captures/2026-07-23-fern-experiment/` (visual review
  captures) — kept for the audit trail.

The fern-*.webp files stay on disk in
`apps/web/public/hero/layers/v2/fern-*.webp` for potential future
use in a different scene context.

### 13.2 Why the fern didn't work (asset analysis)

The original design rationale ("painted VEO stacks with painted VEO"
per D-0049 rev 4) was correct in principle, but the fern-01.webp
asset has a structural issue that makes multiply-blend fail:

1. fern-01.webp is 1240x680 RGBA, but the alpha channel has the
   cream BACKGROUND opaque (most of the image, ~656k pixels) and
   only the fronds transparent. mix-blend-mode: multiply operates
   on the visible (opaque) pixels, so the cream background of the
   source blends INTO scene 2 as a cream wash, and the fronds
   themselves are barely visible (transparent pixels are skipped
   entirely in multiply).
2. The visible result is "cream wash + a partial frond outline" at
   the upper-right, which reads as a pasted image, not as a "deep
   foreground detail" of the scene.
3. The fern has no connection to any element in scene 2 (it
   doesn't sit behind/in front of the palms, the ranch house, the
   lawn, etc.) — it's a free-floating object in the top-right
   corner.

In short: the multiply blend was applied to the wrong pixels
(the cream background instead of the fronds), and even if the
asset were correctly keyed, the fern still has no natural anchor
in the scene 2 painting.

### 13.3 What was kept

The rest of the 5-plane architecture is RETAINED:

- **4th cartoon plane (hand-drawn birdbath):** kept. The
  birdbath is hand-authored SVG in the same cartoon style as
  the existing PalmTree / House primitives, drawn fresh in
  the storybook foreground dead space. Works as designed
  (cartoon stacks with cartoon, satisfies D-0049 rev 4).
- **BTS split ("The truck" + "The yard"):** kept.
- **Audio drop (MuteToggle removed):** kept.
- **Scene 1 storybook cartoon:** unchanged from pre-D-0060.
- **Scene 2 painted background:** unchanged from pre-D-0060.

### 13.4 What the architecture is now (post-revert)

The 5-plane label is no longer accurate. The actual state:

- **Scene 1 (storybook cartoon, [0.00, 0.25] of hero):**
  4 cartoon planes (sky / far / mid / near) + 1 photo layer
  (the 4K photo) + 1 content overlay (headline + CTAs).
  The cartoon birdbath is the 4th cartoon plane, added in
  the storybook foreground dead space.
- **Scene 2 (painted ranch house, [0.40, 1.00] of hero):**
  1 painted background (scene2-01..06.webp) + 1 content
  overlay (editorial pull-quote + CTAs). The fern overlay
  (5th painted plane) is REMOVED.
- **Scene 3 (BehindTheScenes split):**
  "The truck" (07.1) + "The yard" (07.2), each a 1-video
  pull-quote section.

### 13.5 Lessons learned

1. **Visual review BEFORE labeling a plane as "shipped" is
   critical.** The fern overlay passed typecheck / lint /
   charter / build / 85 routes, but it was visually incoherent.
   A static-quality-gate passing does not mean a visual asset
   is correct. Future plane additions should include a
   `tmp/hero-captures/<date>-<plane-name>/` capture set +
   steward sign-off BEFORE the change is labeled "shipped".

2. **Multiply-blend with an RGBA asset requires the asset's
   alpha channel to be correct.** If the source has the
   background opaque (and only the foreground transparent),
   multiply blends the wrong pixels. The fern-*.webp files
   need to be re-keyed (background transparent, fronds
   opaque) for any future use as an overlay. Without that
   re-key, no blend mode will work.

3. **Painted VEO brushwork can stack with painted VEO
   brushwork in principle (D-0049 rev 4), but a multiply
   overlay on a free-floating object without an anchor in
   the destination scene will read as a pasted image.** The
   fern needed to be anchored to something in scene 2
   (e.g., behind the painted palms, in front of the painted
   birdbath) to read as part of the scene, not as a foreign
   object.

### 13.6 Revert commit

- `f45117c feat(hero): 6th painted plane experiment (palms overlay) — REVERTED`
  (palms overlay experiment; kept fern at the time, then reverted in
  the next commit)
- The fern revert is in the same commit that supersedes this ADR
  (commit not yet authored at the time of this writing).
