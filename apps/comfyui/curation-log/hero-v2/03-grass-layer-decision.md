# Grass layer — generation abandoned, existing SVG kept (with future-upgrade note)

**Date:** 2026-07-14
**Decision:** skip the layered grass.webp generation. Keep the existing
`apps/web/public/illustrations/grass-blade-cluster-xl.svg`.

## Why we tried

The v2 brief called for replacing the existing grass SVG (which the v1
brief called "sparse strokes, substandard") with a layered painterly
grass webp.

## Why we abandoned

Two re-rolls (r1 at LoRA 0.80, r2 at LoRA 0.55) both failed the
brand-palette criterion.

### Re-roll 1 — seed 4223, LoRA 0.80, IP-Adapter 0.45

All 4 candidates painted the grass blades in **magenta/purple** rather
than the brand's `--ll-green` / `--ll-palm-shadow` / `--ll-sun` palette.
The LoRA + IP-Adapter style anchor have a strong "wildflower meadow"
prior that overrides the color instruction.

| Candidate | Verdict |
|---|---|
| 1 (magenta-tipped blades) | REJECT — wrong color |
| 2 (purple blades, warm sky) | REJECT — wrong color |
| 3 (purple blades, soft sky) | REJECT — wrong color |
| 4 (purple blades, soft sky) | REJECT — wrong color |

### Re-roll 2 — seed 4223, LoRA 0.55, IP-Adapter 0.30, prompt re-tightened

Reducing LoRA + IP-Adapter strength let the green color through, but
the model painted **purple iris / wildflower blooms** on top of the
green grass. The "St Augustine lawn grass" prompt is overwhelmed by
the "grass + colorful flowers" prior the LoRA has.

| Candidate | Verdict |
|---|---|
| 1 (green blades + purple iris) | REJECT — off-brand flowers |
| 2-4 | REJECT — same |

The re-roll protocol §8.2 says re-roll up to 3 times with surgical
prompt additions. Two re-rolls at substantially different LoRA
strengths both failed. The failure mode is the LoRA's prior, not the
prompt. Per §8.3 escalation: stop and ship with the existing SVG.

## What we're keeping

- `apps/web/public/illustrations/grass-blade-cluster-xl.svg` — the
  v1-era hand-authored grass. The "substandard" complaint in the
  original brief was about the *style* (sparse strokes, not painterly
  enough), not about the *content* (Florida grass blades, correct
  shape). The shape is correct; the rendering style is hand-drawn
  line art instead of painted gouache. Acceptable as a v2 stopgap.

## Future upgrade path (logged for D-0009 or later)

The grass layer is a real gap. The right path to a better grass
asset is one of:

1. **Hand-author a v3 grass SVG** in the same painterly gouache
   style as the new palm layer. Estimated 2-3 hours of work for
   the engineering team.
2. **Train a LoRA specifically for St Augustine grass** that doesn't
   have the "wildflower meadow" prior. Estimated 8-12 hours of
   dataset curation + training.
3. **Use img2img on the existing SVG** with a low denoise (0.30-0.40)
   to painterly-ify the strokes without changing the shape. This is
   the cheapest path and worth a single follow-up experiment.

None of these are in scope for v2. The user-facing hero can ship with
the existing SVG grass and the gap gets fixed in v3.

## Net effect on the v2 asset pack

| Asset | Source | Status |
|---|---|---|
| Master scene (2400×1500) | GENERATED | DONE — `master_keeper.png` (24/30) |
| Mobile crop (1200×1500) | GENERATED | NEXT |
| Palm layer | GENERATED | DONE — `palm_keeper_rgba.png` (19/20) |
| Mower layer | EXISTING SVG | KEEP — `mower-side-profile.svg` |
| Grass layer | EXISTING SVG | KEEP — `grass-blade-cluster-xl.svg` (v2 stopgap, v3 upgrade) |
| Ground layer | CSS GRADIENT | NEW — `.ground` rule in `HeroCinematic.module.css` |
| Fence-shadow layer | CSS GRADIENT | NEW — `.fence-shadow` rule in `HeroCinematic.module.css` |

Generated: 2/7 (master, palm). TBD: 1/7 (mobile). Reused/cheap: 4/7.
