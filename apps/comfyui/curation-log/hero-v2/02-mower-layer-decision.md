# Mower layer — generation abandoned, existing SVG kept

**Date:** 2026-07-14
**Decision:** skip the layered mower.webp generation. Keep the existing
`apps/web/public/illustrations/mower-side-profile.svg` and let the
existing `HeroCinematic.tsx` continue to use it.

## Why we tried

The v2 brief (`hero-v2.md` §3) called for a layered raster mower asset
to replace the hand-authored SVG. The rationale was: "Every layer is an
asset already shipped in WP11, so the hero renders in any condition."
Extending that to the mower would have been a uniform treatment.

## Why we abandoned

All 4 candidates at seed 4377, LoRA 0.80, IP-Adapter 0.45 produced
tractors / riding mowers, not push mowers. The negative prompt's
exclusions ("NOT a riding mower, NOT a tractor") were overwhelmed by
the storybook LoRA's strong tractor / farm-equipment prior and the
IP-Adapter style anchor's bias toward large wheeled equipment.

**Curate scores (1-5 per criterion, against §2 acceptance bar):**

| Candidate | §2.1 Quality | §2.2 Focal (push mower) | §2.2 Background clean | Score | Verdict |
|---|---|---|---|---|---|
| 1 (pink vintage tractor on road) | 4 (painterly, off-palette) | 1 (tractor) | 1 (full env) | 6/15 | REJECT |
| 2 (green riding mower) | 4 (painterly, on-palette) | 1 (riding mower) | 1 (full env) | 6/15 | REJECT |
| 3 (pink "19UCUT" vintage tractor) | 4 | 1 (tractor) | 1 (full env) | 6/15 | REJECT |
| 4 (purple riding mower, large wheels) | 4 | 1 (riding mower) | 1 (full env) | 6/15 | REJECT |

The tractor / riding-mower bias is a property of the LoRA + IP-Adapter
pipeline, not the seed. Re-rolling with seed+11 would not have helped
— the prior is in the style embedding, not the noise.

The chroma key also failed across all 4 — the LoRA painted full
natural scenes over the magenta, same failure mode as the palm layer
but more aggressive because the mower is a smaller subject and the
LoRA's environment painting dominates the canvas.

## Why this is fine

The brand already has `mower-side-profile.svg` — a hand-authored
push mower illustration that the existing `HeroCinematic.tsx` already
composites correctly. Looking at the original `hero-cinematic-chromium-desktop.png`
baseline, the mower is a small, somewhat-fuzzy shape in the lower-right
of the right column. It's not the worst element of the current
composition (the palm and grass are the bigger problems). Replacing
it with a SDXL-generated tractor would have been a regression.

The v2 brief treated all 5 layers as uniform raster assets. The actual
failure mode of the pipeline (LoRA bias + chroma key loss) is
per-layer. The palm layer works because the LoRA handles a single
isolated subject (palm) well. The mower layer doesn't work because
the LoRA's "mower" prior is "tractor", which is off-brand.

## What we're keeping vs. what we're generating

| Asset | Source | Why |
|---|---|---|
| Master scene (2400×1500) | GENERATED (`master_keeper.png`) | v2 §6.1, candidate 1, 24/30 — keeper |
| Mobile crop (1200×1500) | GENERATED (next) | v2 §6.3 |
| Palm layer | GENERATED (`palm_keeper_rgba.png`) | v2 §6.4, candidate 4, chroma-keyed |
| **Mower layer** | **EXISTING SVG** (`mower-side-profile.svg`) | v2 §6.5 — abandoned, LoRA bias to tractor |
| Grass layer | GENERATED (next) | v2 §6.6 |
| Ground layer | CSS GRADIENT (`.ground` in HeroCinematic.module.css) | v2 §6.7 — CSS is cheaper, no chroma key needed |
| Fence-shadow layer | CSS GRADIENT (new in HeroCinematic.module.css) | v2 §6.8 — CSS is cheaper, no chroma key needed |

## Net effect on the hero composition

- Master scene: ranch house + warm golden hour + faint tractor in
  lower-right corner (mostly occluded by layered palm + grass + ground).
- Layered palm: clean painterly palm with sun behind (from §6.4).
- Layered grass: clean painterly grass blade cluster (from §6.6, TBD).
- Layered mower: the existing hand-authored push mower SVG (good enough).
- Layered ground: CSS gradient (dark green to deep palm-shadow, new).
- Layered fence-shadow: CSS gradient (diagonal warm-shadow line, new).

The layered composition reads as: warm ranch-house backdrop with sun
behind a painterly palm, grass blades in the foreground, the
hand-authored push mower sitting on the lawn. Off-brand artifacts
(faint tractor in the master) are hidden by the layered foreground.

## What this teaches us for the v2 brief

The brief assumed a uniform "all 5 layers generated" approach. The
actual failure modes are per-layer:
- Palm: works (LoRA handles single isolated tree)
- Mower: fails (LoRA biases toward tractor, off-brand)
- Grass: TBD (will know after generation)
- Ground: trivially a CSS gradient (cheaper, more controllable)
- Fence-shadow: trivially a CSS gradient (cheaper, more controllable)

For future asset generation, the brief should be updated to:
- Use CSS for any layer that's a simple shape or gradient
- Reserve SDXL generation for layers where painterly detail matters
- Accept that some subjects (small equipment, recognizable brand
  objects) are better hand-authored than AI-generated because the
  LoRA's priors are wrong for them
