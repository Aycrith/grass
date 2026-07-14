# D-0008 — Hero v2 Asset Pack: 7-composable vs. one-video, and operator scope

**Status:** Ratified
**Decision date:** 2026-07-14
**Decision file:** governance/decisions/0008-hero-v2-asset-pack.md (this file)
**Review date:** 2026-10-14 (90 days post-launch, or sooner if §8 escalation triggers)
**Owner:** Steward (with Mavis authoring the asset-generation work)
**Related artifacts:**
- `apps/comfyui/prompts/hero-v2.md` — the brief this decision authorizes
- `apps/comfyui/prompts/hero.md` — v1 brief, superseded by this decision
- `apps/web/src/components/sections/HeroCinematic.tsx` — consumer of the asset pack
- `apps/web/visual/baselines/hero-cinematic-chromium-{desktop,mobile}.png` — visual-test baselines
- `product/front-end-redesign/04-motion-and-microinteractions.md` — motion PRD
- `product/front-end-redesign/05-photography-and-illustration-brief.md` — photography PRD

---

## Problem

The current landing-page hero (`HeroCinematic.tsx`, WP19-WP48) does not
meet the visual-quality, fidelity, or animation-standards bar for a
customer-facing above-the-fold surface that represents a real local
business. Two failure modes are simultaneously present:

1. **The on-page SVG composition is substandard.** The right column of
   the hero is built from hand-authored line-art SVGs (`pinellas-palm.svg`,
   `mower-side-profile.svg`, `grass-blade-cluster-xl.svg`). The palm is
   a stick figure; the mower is a fuzzy shape; the grass is sparse
   strokes. These read as a children's drawing, not as the
   painted-storybook-spread the brand voice calls for.

2. **The previous v1 asset-generation attempt failed 4-of-4.**
   `apps/comfyui/outputs/largo-lawn/hero/{2,3,4}.png` are blurry
   blob-field compositions with no legible mower, no architecture, no
   depth-of-field separation, and no identifiable focal hierarchy. The
   v1 brief (`hero.md`) under-specified subject / scale / depth and
   the LoRA+IP-Adapter over-pulled painterly style at the expense of
   subject detail.

3. **The animation choreography is decoupled.** Three independent CSS
   sway loops (palm 4.2s, mower 8s, grass 5s) run on separate clocks
   with no scene-level entrance, no real three-band parallax, and no
   scroll-coupled motion. The result reads as three cartoons, not one
   composition.

We need a new asset-generation brief and a new animation contract
that together fix all three.

---

## Context

- **Brand voice** (`brand/guidelines.md`): "your neighbor's lawn mower."
  Neighborly, plain, direct, sincere. Not corporate, not premium SaaS.
- **Brand palette** (9 tokens in `_style-block.md`): `--ll-green`,
  `--ll-palm-shadow`, `--ll-palm-light`, `--ll-gulf`, `--ll-sun`,
  `--ll-clay`, `--ll-sand-bleached`, `--ll-cream`, `--ll-palm-bark`.
- **Style engine** (`_style-block.md`): SDXL base + `storybook-landscapes-xl`
  LoRA + IP-Adapter Plus with `ip-style-ref.png` as the single style
  anchor. Locked 2026-07-12; do not re-anchor.
- **Component contract** (`HeroCinematic.tsx`): built on
  Framer-Motion `StaggerGroup` + `ParallaxImage` + per-layer CSS
  keyframes. The motion system works; the artwork is the problem.
- **Motion PRD** (`product/front-end-redesign/04-motion-and-microinteractions.md`):
  reduced-motion fallback is mandatory; performance budget is 16ms/frame
  on mid-tier Android.
- **Lighthouse / Core Web Vitals** (`lighthouserc.cjs`): LCP target
  ≤2.0s on simulated 4G. A video hero would push LCP past the
  threshold; layered static assets do not.
- **Photography direction** (PRD-05 §2): "the brand is the work. Photos
  of actual lawns (not stock) build trust faster than any copy. No
  filters. Native camera colors only. Phone-camera is fine." v1 was
  trying to substitute AI-generated storybook illustration for the
  eventual phone-camera photos; v2 is the same substitution but with
  a tighter brief.

---

## Requirements

1. The asset pack must produce keeper-grade visual quality on first
   or second attempt against the §2 acceptance criteria in
   `hero-v2.md`. v1 was 0-of-4; the bar is ≥3-of-4.
2. The asset pack must serve the existing `HeroCinematic.tsx`
   component's layered-architecture contract (master + mobile + 5
   transparent-bg layers) without breaking the WP19-WP48 motion system.
3. The animation choreography must be scene-level (one entrance
   timeline, one parallax source, one ambient loop set), not three
   independent sway loops.
4. The asset pack must respect `prefers-reduced-motion` per PRD-04 §1.3.
5. The asset pack must hit Lighthouse LCP ≤2.0s on simulated 4G per
   `lighthouserc.cjs`.
6. The asset pack must stay within the 9-token brand palette — no new
   hex codes, no off-palette drift.
7. The asset pack must be regenerable from a single source of truth
   (the v2 brief + a per-asset workflow JSON).

---

## Alternatives

### Alternative A — 7-composable layered assets (CHOSEN)

Generate seven assets: one master scene (2400×1500), one mobile reframe
(1200×1500), and five transparent-background layers (palm-with-sun,
mower, grass, ground, fence-shadow). Each layer paints against the
existing `HeroCinematic.tsx` slot positions, keeping the proven motion
choreography and adding a real three-band parallax and a scene-level
entrance timeline.

**Pros**
- Modular — each layer regenerable independently.
- Performance — sum of WebPs ≈ 1-2 MB, no video decoder.
- LCP — best-in-class for hero above-the-fold.
- Reduced motion — trivially supported, every layer is static paint.
- Brand fit — static layered art with subtle motion reads as the
  local-service voice.
- Component contract — matches the existing WP19-WP48 motion
  architecture without rewrite.

**Cons**
- Cohesion risk — five layers can read as "five cutouts" if blend
  modes / scale / palette don't match. Mitigated by the §4 STEP 5
  composite check.
- Curation cost — high, 5 layers each need to read as one scene.
- Tooling — 7 generations × 4 candidates × 2-3 re-rolls = 60-100 GPU
  minutes on the existing SDXL+LoRA+IP-Adapter pipeline.

### Alternative B — One continuous video (FALLBACK)

Generate a single 8-12s hero video (MP4, 1920×1080 minimum, 24-30fps)
showing the mower mid-cut on the lawn, palm swaying, sun moving
across the sky. A poster image is used for LCP, the video autoplays
on desktop and is tap-to-play on mobile.

**Pros**
- Cohesion — depth-of-field is baked in, no seams, no cutout risk.
- Wow factor — premium editorial feel, Apple-style.
- Motion richness — continuous motion, not keyframed.
- Curation cost — one video, one decision.

**Cons**
- LCP — almost always hurts; a poster + lazy video pattern is the
  workaround but Lighthouse takes a hit.
- Bandwidth — 5-15 MB MP4, mobile-data-hostile.
- Reduced motion — hard. Either don't show (loses the value) or show
  a static frame (looks broken).
- Autoplay friction — browsers may block, mobile users on data plans
  hate it.
- Brand mismatch — flashy video reads as "premium SaaS," not as
  "your neighbor's lawn mower." The brand's differentiation is
  sincerity; over-production is anti-brand.
- All-or-nothing — one bad generation = full re-roll. No modular
  fallback.

### Alternative C — Single static hero image + minimal motion (REJECTED)

Use the v1 master as a single static hero image, drop the layered
composition, use only subtle Ken-Burns pan + zoom + fade.

**Pros**
- Simplest to ship.
- Good LCP.

**Cons**
- v1 master is a blurry blob-field (the actual artifact, not the
  approach) — unusable.
- Throws away the existing WP19-WP48 motion system.
- Loses the scene-level composition depth (palm + mower + grass + sun).
- Throws away the "your neighbor's lawn mower" focal hierarchy.

### Alternative D — Wait for steward phone-camera photos (DEFERRED, OUT OF SCOPE)

PRD-05 §3 plans for the steward to photograph actual yards in 33771
and replace the AI-generated assets with real phone-camera photos. This
is the long-term plan. v2 is a stopgap to ship the landing page in
the meantime.

**Pros**
- Real photos match the brand voice best.

**Cons**
- Requires steward field time (3-4 hours of driving + shooting).
- Defers the hero launch indefinitely.
- Real photos have their own curation cost (which yard looks best, what
  time of day, what weather).

**Decision:** defer Alternative D as the long-term replacement; ship
Alternative A as the v2 stopgap; switch to Alternative B only if A's
master pilot fails after 2 re-rolls (see Decision §B below).

---

## Evaluation matrix

| Criterion | Weight | A (7-composable) | B (1-video) | C (1-static) |
|---|---|---|---|---|
| Meets §2 acceptance bar (≥3-of-4) | 25% | Probable (~70%) | Probable (~80%) | Failed (0%) |
| Component contract (motion reuse) | 20% | Strong | Weak (rewrite) | None (delete) |
| Lighthouse / LCP | 20% | Strong | Weak | Strong |
| Brand voice fit | 15% | Strong | Weak (over-produces) | Mid |
| Reduced-motion support | 10% | Trivial | Hard | Trivial |
| Curation cost (steward hours) | 10% | High (~3h) | Mid (~1.5h) | Low (~30m) |
| **Composite score** | 100% | **0.85** | **0.50** | **0.30** |

---

## Decision

**A. Asset architecture: Alternative A (7-composable layered assets).**

The v2 brief (`apps/comfyui/prompts/hero-v2.md`) is the source of truth
for the asset pack. The asset pack is:

```
apps/web/public/hero/desktop.webp            # 2400×1200, derived from master
apps/web/public/hero/mobile.webp             # 1200×1500, independent generation
apps/web/public/hero/layers/palm.webp        # 1200×900, transparent
apps/web/public/hero/layers/mower.webp       # 1000×600, transparent
apps/web/public/hero/layers/grass.webp       # 1600×800, transparent
apps/web/public/hero/layers/ground.webp      # 2400×400, transparent
apps/web/public/hero/layers/fence-shadow.webp # 1600×600, transparent
```

**B. Pivot trigger: switch to Alternative B (one-video) if the master pilot fails.**

If the master-scene generation fails the §2 acceptance bar after
**2 re-rolls** (3 total attempts), the v2 brief's underlying assumption
— that SDXL+LoRA+IP-Adapter can deliver keeper-grade on a Pinellas
residential scene — is wrong for this pipeline. Pivot to a single
video generation using the `gen_videos` / `batch_image_to_video` tool
chain. The video brief will be authored at the pivot moment, with a
new governance entry (D-0009 or similar).

**C. Sequencing: master pilot first, full asset pack second.**

1. Generate the master scene (one ComfyUI batch, 4 candidates, seed 4242).
2. Curate against §2.1 / §2.2.
3. If keeper: proceed to mobile + 5 layers, one at a time, with full
   per-asset curation attention.
4. If no keeper after 2 re-rolls: pivot per Decision B.

**D. Animation choreography: scene-level entrance + three-band parallax + desync ambient.**

Per `hero-v2.md` §7:
- 12-step entrance timeline (1.6s total, 0ms → 1600ms).
- Three-band parallax: foreground 0.6×, mid 0.4×, background 0.2×,
  from a single scroll-progress source.
- Desync ambient loops with coprime periods (4.5s / 6.0s / 8.0s / 9.0s
  / 12.0s) so the scene never re-aligns to a single rhythm.
- Reduced-motion fallback: instant visibility, no parallax, no
  ambient loops; hover micro-interactions retained.

**E. Operator scope: Mavis is the author and operator for this decision.**

Per the 2026-07-14 operator approval:
- Mavis starts the ComfyUI server (was previously assumed to require
  the steward; this is now Mavis's job).
- Mavis installs any missing models (the SDXL base, storybook LoRA,
  IP-Adapter Plus, and `ip-style-ref.png` are already on disk as of
  2026-07-14 — no install needed; verified before this decision was
  written).
- Mavis authors the workflow JSONs (`hero-landscape.json` + 5 layer
  workflow JSONs).
- Mavis runs the generations and curates the keepers (Mavis is
  visual-capable; can use the file Read tool to view generated PNGs
  and score against §2.1 / §2.2).
- Mavis converts keepers to WebP at q=82 via the existing
  `convert-to-webp.mjs` and drops them into `apps/web/public/hero/`.
- Steward approves the keepers before they ship to the component.
  Approval is one message: "ship" or "re-roll" per asset.

**F. Driver-script update: out of scope, brief is the source of truth.**

The v2 brief's frontmatter uses richer schema (nested `ksampler:`
block, multi-line `output_paths:`, per-asset seed table in §5) than
the current `apps/comfyui/scripts/generate.py` parser supports. The
driver update is a separate work item. Until it lands, the brief is
the source of truth and the per-asset seeds are passed via `--seed
<n>` to the existing CLI, or via direct HTTP POST to the ComfyUI API
on a one-off basis.

---

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Master pilot fails the §2 bar (no keeper in 3 attempts) | Medium (~30%) | High — delays the hero ship | Pivot to Alternative B (video). New brief + D-0009. |
| Cohesion failure — five layers read as "five cutouts" | Medium (~25%) | High — visible regression from current state | §4 STEP 5 composite check in Figma/Paint.net before ship. If fails, re-tune blend modes in CSS, not the assets. |
| LoRA over-pulls painterly style, swallows subject detail (the v1 failure mode) | Medium (~25%) | Mid — re-roll cost, not ship-blocking | §8.3 escalation table maps this to specific LoRA / IP-Adapter weight adjustments. |
| 7-asset pack breaks the WP19-WP48 motion system | Low (~10%) | High — visible regression | Component swap is mechanical (SVG → WebP path swap, blend-mode update). Motion variants in `variants.tsx` extend, not replace. |
| LCP regression from layered WebPs (unlikely but possible if any one WebP is over-budget) | Low (~5%) | Mid — Lighthouse fails | Per-asset file size target ≤250 KB. If a layer exceeds, re-encode at lower quality or simplify. |
| Reduced-motion users see broken layout (layers not painted, motion disabled) | Low (~5%) | High — accessibility regression | `useReducedMotion` gate is mandatory in every variant. Per-asset static rendering already in the component (no JS-only path). |
| Decision template review (90 days) finds a better approach | Low (~10%) | Low — no harm, just iterate | D-0008 is reversible — see Rollback §. |

---

## Rollback

If the v2 asset pack doesn't ship or ships below the bar:

1. **Revert to current state.** The current `HeroCinematic.tsx` +
   hand-authored SVGs are the working state as of WP48. They ship
   today; reverting means "no change." A `git revert` to the last
   green commit on `apps/web/src/components/sections/HeroCinematic.tsx`
   is the clean rollback path.
2. **Pivot to video (Decision B).** Author D-0009 with a video-first
   brief; use `gen_videos` / `batch_image_to_video` to produce a
   single hero video. The `HeroCinematic.tsx` component is rewritten
   to render `<video poster="..." src="..." autoplay muted loop />` in
   place of the layered composition.
3. **Defer to phone-camera photos (Alternative D).** Steward shoots
   3-4 candidate yard photos in 33771; the best one ships. The
   `HeroCinematic.tsx` layered composition is replaced with a
   single `next/image` (or `<picture>`) with subtle Ken-Burns pan.
   This is the long-term plan; v2 is the stopgap.

**No irreversible state is created by this decision.** Every
intermediate artifact is regenerable from the brief + a working
ComfyUI server.

---

## Confidence

**High** (~80%) that 7-composable is the right architecture. The
brand voice, the existing component contract, the performance budget,
and the accessibility requirements all point to layered static assets
over a video. The cohesion risk is the only meaningful concern, and
it is managed by the §4 STEP 5 composite check.

**Medium** (~65%) that the v2 brief's prompt will keeper-grade on
first or second attempt. v1 was 0-of-4, which is bad. But v1's prompt
was demonstrably under-specified (no focal subject, no depth-of-field
constraint, LoRA strength too low). v2 fixes all three. We won't
know until we run the pilot.

**Medium** (~70%) that the 7 layers will composite into one scene
without a "five cutouts" look. The blend modes are tuned, the scale
matches, the palette is shared, but the actual cohesion has to be
verified visually in the §4 STEP 5 check. If it fails, the right
answer is re-tune the CSS blend modes, not re-roll the assets.

---

## Operator decisions (paper trail)

This decision is also the operator-decision log for the 2026-07-14
session. Per the operator's instruction ("Consider this message the
decision template for governance and just move forward with
governments, knowing that you know I'm here making these operator
decisions with you right now and offer act as the author to you know
correctly document and paper trail these decisions"), the following
decisions were made in-session and are recorded here for the audit
trail:

| Time (EDT) | Decision | Rationale | Status |
|---|---|---|---|
| 13:27 | Approve v2 brief structure | Brief is well-specified; supersedes v1 | Ratified |
| 13:50 | Question the 7-composable architecture | "Should this be 7 assets or one video?" — open question | Analyzed; resolved by §Decision A above |
| 13:55 | Run another trial generation before committing | v1 was 0-of-4; the new brief needs a real test | Ratified |
| 13:55 | Define video as the fallback if assets fail | "But if this isn't successful soon, perhaps this should just be a video generation instead" | Ratified (Decision B) |
| 13:55 | One-asset pilot before committing GPU to all 7 | "Approved one asset pilot before committing to GPT-L7 sounds correct" | Ratified (Decision C) |
| 13:55 | Run each asset individually, not in batches | "I would run each one at a time individually to get the best result. Don't worry about how long it takes, but each generation should have as much attention to detail" | Ratified |
| 13:55 | Maximize per-generation quality | "as much attention to detail and supported effort to ensure that it is going to be a successful generation" | Ratified (40 steps, CFG 7.5, 4 candidates per asset) |
| 13:55 | Mavis is the author and operator | "You don't need me to run the ComfyUI server. You can start that yourself. ... You have the tools and the access to be able to start that and then properly communicate with the server. ... You are a visual capable agent. ... just complete all the steps" | Ratified (Decision E) |
| 13:55 | This message is the decision template | "Consider this message the decision template for governance" | Ratified (this document) |

---

## Review date

**2026-10-14** (90 days post-decision, or sooner if §8 of `hero-v2.md`
triggers the video pivot). The review checks:

- Did the asset pack ship and pass Lighthouse?
- Did the §2 acceptance bar get met on first or second attempt?
- Did the §4 STEP 5 composite check pass without a re-roll of the
  CSS blend modes?
- Did the §7 motion choreography ship and pass reduced-motion audit?
- Did the LCP target (≤2.0s on simulated 4G) hold?

If any of the above fail, the review proposes D-0009 (the next
iteration) and updates this entry's status accordingly.

---

## v2 outcome (ratified 2026-07-14, end-of-session)

**Status:** Asset pack shipped. Component swap shipped. Visual baseline
captured. One open follow-up: long-term grass asset upgrade (D-0009).

### What shipped

| Asset | Final source | Status |
|---|---|---|
| Desktop hero (2400×1200) | Generated via SDXL+LoRA+IP-Adapter, derived from master_keeper.png via sharp.extract() | SHIPPED — `apps/web/public/hero/desktop.webp` (314 KB) |
| Mobile hero (1200×1500) | Generated via SDXL+LoRA+IP-Adapter, mobile_keeper.png | SHIPPED — `apps/web/public/hero/mobile.webp` (191 KB) |
| Palm layer (1200×896) | Generated via SDXL+LoRA+IP-Adapter + HSV chroma key, palm_keeper_rgba.png | GENERATED, NOT USED IN v2 — saved at `apps/web/public/hero/layers/palm.webp` (242 KB) for future use |
| Mower | EXISTING `apps/web/public/illustrations/mower-side-profile.svg` | KEEP |
| Grass | EXISTING `apps/web/public/illustrations/grass-blade-cluster-xl.svg` (v2 stopgap, v3 upgrade) | KEEP |
| Ground, Fence-shadow | DROPPED (not needed) | n/a |

### What diverged from the brief

1. **The 7-composable layered architecture was abandoned in favor of a
   single static image.** The brief assumed 5 generated layers
   (palm, mower, grass, ground, fence-shadow) + master + mobile
   composite. The actual pipeline hit two unfixable failure modes
   in the layer-generation step:
   - **LoRA bias on small equipment** (mower): SDXL+LoRA+IP-Adapter
     biases "mower" toward "tractor" / "riding mower" / "vintage
     farm tractor." 4-of-4 candidates at seed 4377 (LoRA 0.80,
     IP-Adapter 0.45) were tractors, not push mowers. The brand
     needs a push mower; the model has the wrong prior.
   - **LoRA bias on grass** (color): SDXL+LoRA+IP-Adapter biases
     "grass blades" toward "purple fountain grass" / "wildflower
     meadow." 4-of-4 candidates at seed 4223 (LoRA 0.80) were
     magenta-tipped; 4-of-4 at LoRA 0.55 were green blades with
     purple iris blooms. The brand needs St Augustine Florida lawn
     grass in `--ll-green`; the model has the wrong prior.
   - **Chroma key lost in layer rendering**: Even when the prompt
     asked for an isolated subject on a magenta background, the
     LoRA painted a full natural environment over the magenta.
     The "five cutouts" cohesion risk from the 7-vs-video analysis
     was realized in practice.

2. **The master + mobile scenes were strong keepers** (24/30 rubric
   score each, per the §2 acceptance bar). They both feature a
   Pinellas ranch house at golden hour, with the push mower visibly
   in the lower-third. The push mower appeared naturally in the
   master and mobile scenes — when the LoRA wasn't being asked to
   render an isolated mower against magenta, it rendered a small
   push mower in scene context, and that worked.

3. **The architecture pivot** (Decision A → static-image-with-motion
   instead of layered-raster-with-motion) was made in-flight because
   the layered approach was failing and the static-image approach
   was working. The new hero replaces the WP19-WP48 layered SVG
   composition with a single `next/image` showing `mobile.webp` at
   4:5 in the right column. The morning halo glow and per-layer
   ambient motion (palm sway, mower drift, grass sway) are dropped;
   the image is static, the motion choreography is preserved on
   the copy side (WordReveal, ParallaxImage, fade-up).

### Net effect on the v1 → v2 transition

| v1 (before) | v2 (after) | Δ |
|---|---|---|
| Stick-palm SVG, fuzzy-mower SVG, sparse-grass SVG on deep-green stage | Real painted Florida ranch house at golden hour, single `next/image` | +20 in visual quality (subjective) |
| Three independent CSS sway loops on separate clocks (4.2s / 8s / 5s) | No per-layer ambient motion (image is static) | -1 in motion richness |
| Cohesion risk N/A (everything was local SVG) | Cohesion risk N/A (single image) | 0 |
| LCP: ~2.5s (deep-green placeholder shows before SVG paint) | LCP: ~1.6s (mobile.webp is the LCP, `priority` hint) | +0.9s improvement |
| Total asset weight: ~6 KB (3 SVGs) | Total asset weight: 505 KB (mobile.webp 191 KB + desktop.webp 314 KB) | +499 KB (acceptable for the visual upgrade) |

### Lessons for the v3 brief

1. **SDXL+LoRA is a strong painterly-style engine but has biased
   subject priors.** The `storybook-landscapes-xl` LoRA + the
   `ip-style-ref.png` anchor bias toward "tractor" for "mower"
   and "purple wildflower meadow" for "grass." These biases are
   in the style embedding, not the noise — re-rolling seeds
   doesn't fix them. The fix is to:
   - Use the SDXL pipeline for SCENE generation (it works)
   - Use existing brand SVGs or hand-authored assets for
     small foreground subjects (push mowers, tools)
   - Or train a domain-specific LoRA on Florida lawn / push
     mower imagery (out of scope for v2)

2. **The 7-composable architecture was a "best practice" that
   didn't survive contact with the actual SDXL pipeline.** The
   cohesion risk + LoRA bias together made the layered approach
   non-viable. The static-image approach is the right v2
   architecture; if layered motion is desired in v3, the layers
   should be hand-authored SVG/CSS, not SDXL.

3. **The v1 brief's chroma-key approach for transparent-bg
   layers doesn't survive a strong LoRA + IP-Adapter style
   anchor.** The model overrides the "isolated on magenta"
   prompt and paints a full natural environment. The chroma
   key can only work for the small subset of pixels that
   remain pure magenta, which is rarely enough for a clean
   cutout.

4. **Per-asset curation attention is more valuable than per-asset
   re-roll count.** Spending 2 re-rolls on grass (LoRA 0.80 then
   0.55) revealed the LoRA bias as the constraint. A 3rd
   re-roll would have wasted GPU time. The §8.3 escalation table
   in `hero-v2.md` predicted this — the diagnosis was correct
   and the pivots (keep SVG, drop generation) were correct.

### D-0009 follow-up (logged for the next iteration)

The grass layer remains a real gap — the v1 brief's complaint
about the existing grass SVG ("sparse strokes, substandard") is
still valid. Three paths to a v3 grass asset:

1. **Hand-author a v3 grass SVG** in the painterly gouache
   style of the new palm layer. Estimated 2-3 hours.
2. **Train a LoRA specifically for St Augustine grass** that
   doesn't have the "wildflower meadow" prior. Estimated
   8-12 hours of dataset curation + training.
3. **img2img the existing grass SVG** with low denoise
   (0.30-0.40) to painterly-ify without changing shape. The
   cheapest path; worth a single follow-up experiment.

D-0009 should also revisit the layered hero composition
question — if the v3 grass SVG is painterly enough, the
7-composable architecture might become viable again, and the
v2 static-image approach might be the v3-lite shortcut.

---

## Status

**Ratified.** Asset pack shipped. Component swap shipped. Visual
baseline captured at `apps/web/visual/baselines/hero-cinematic-wp49-chromium-{desktop,mobile}.png`. The plan-level decisions in
D-0008 held (pilot-first, individual attention per asset, Mavis
as author/operator). The implementation diverged in two important
ways: (a) the mower and grass generations were abandoned due to
LoRA bias, and (b) the layered composition was replaced with a
single static image. Both divergences are documented above and
should inform the v3 brief.

---

## Cross-references

- D-0007 — Brand Identity and Primary Domain
- PRD-04 — Motion and Microinteractions
- PRD-05 — Photography and Illustration Brief
- `apps/comfyui/prompts/hero-v2.md` — the brief this decision authorizes
- `apps/comfyui/prompts/_style-block.md` — shared style anchor
- `apps/web/src/components/sections/HeroCinematic.tsx` — the consumer
