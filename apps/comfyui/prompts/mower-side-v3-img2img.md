---
name: mower-side-v3-img2img
description: >
  v3 mower-side-profile asset — img2img of the v1 hand-authored SVG
  (apps/web/public/illustrations/mower-side-profile.svg) with low
  denoise (0.35) to painterly-ify the push mower into the brand's
  storybook gouache style. Completes the cross-component brand
  consistency that the v3 grass and v3 palm established.

  The v1 SVG was the only remaining hand-authored line-art
  illustration on the home page (used in ScheduleTimeline's
  "today" card). It was a "fuzzy shape" / "children's drawing"
  per the WP19-era audit trail — the same complaint that
  flagged the v2 hero blob-field and the v1 pinellas-palm
  stick figure. Both of those got the img2img upgrade; the
  mower is the last one.

  Source: apps/web/public/illustrations/mower-side-profile.svg
  Output: apps/web/public/illustrations/mower-side-profile-v3-{120,240}.webp
  Workflow: apps/comfyui/workflows/mower-side-v3-img2img.json
  Driver: apps/comfyui/scripts/run-img2img.py (one-off, see grass v3)
  Curated: 4/4 candidates at seeds 5901-5904 all keepers (denoise
  0.35 is very stable). Seed 5901 selected as canonical.
type: illustration
version: 3
status: shipped
input: mower-side-profile.svg
output_paths:
  - apps/web/public/illustrations/mower-side-profile-v3-120.webp
  - apps/web/public/illustrations/mower-side-profile-v3-240.webp
components_using_v3:
  - apps/web/src/components/sections/ScheduleTimeline.tsx (todayMower, 120px)
seed: 5901
denoise: 0.35
style_block: _style-block.md
lora: storybook-landscapes-xl
lora_strength: 0.55
ip_adapter_weight: 0.40
ip_adapter_weight_type: "style transfer"
ksampler:
  steps: 35
  cfg: 7.0
  sampler: dpmpp_2m
  scheduler: karras
---

# Mower — v3 img2img (homepage ScheduleTimeline)

## What this asset is

The v3 push-mower illustration, painted in the brand's storybook
gouache style. Replaces the v1 hand-authored SVG (which was a
"fuzzy shape" per the WP19-era audit trail). The same fix
pattern as the v3 grass and v3 palm: img2img with denoise 0.35
to avoid LoRA bias toward "riding mower / tractor / commercial
mower / in a yard with a person."

## Why this matters

The mower appears in `ScheduleTimeline.tsx` (homepage) on the
"today" card — shows the customer which day the mower shows up.
It's a small decorative element (120x80 rendered), but it's the
last hand-authored line-art illustration on the home page after
the v3 palm upgrade. With this change, every illustration on
the home page is in the brand's painted storybook style:
- HeroCinematic: v2 painted
- OperatorStrip: v3 palm
- PricingTiers: v3 palm
- ServiceAreaStats: v3 palm + numbers
- ScheduleTimeline: v3 mower (this change)
- ServiceBento: already-painted service images
- ServiceAreaMap: SVG with x/y coords (architectural, not a
  hand-drawn illustration — kept as SVG)

## What ships

4 candidates generated at seeds 5901-5904, ALL 4 keepers
(same pattern as grass v3 and palm v3). Seed 5901 selected as
canonical. Verified visually on the keeper:

- Self-propelled PUSH mower side profile (NOT riding, NOT tractor)
- Dark forest green body color #1F4E2C
- Warm brown handle grip #B5651D
- Warm brown small gas engine on top #B5651D
- Dark wheels with brass-colored treads #1A1F1B
- Sage green grass catcher bag on rear #8FA89B
- Brass pull-cord knob #E8B65A
- Small grass tufts on either side (preserved from v1)
- Transparent background
- Painterly gouache texture
- ZERO LoRA bias (no tractor, no riding mower, no person,
  no yard, no operator)

Rasterized to webp at 2 sizes (matching the actual usage):
- mower-side-profile-v3-120.webp     ~1 KB (ScheduleTimeline)
- mower-side-profile-v3-240.webp     ~2 KB (master/source of truth)

## Component swap shipped (1 file)

apps/web/src/components/sections/ScheduleTimeline.tsx → uses
/illustrations/mower-side-profile-v3-120.webp at 120x120 (was
SVG at 120x80, height adjusted to 1:1 aspect).

The v1 SVG is KEPT at apps/web/public/illustrations/
mower-side-profile.svg for fallback + diff traceability.

## How to regenerate

```bash
# 1. Rasterize the v1 SVG to 1024x1024 RGB PNG
bun -e 'const sharp=(await import("sharp")).default; const svg=await Bun.file("apps/web/public/illustrations/mower-side-profile.svg").text(); await sharp(Buffer.from(svg),{density:300}).resize(1024,1024,{fit:"contain",background:{r:250,g:246,b:240,alpha:1}}).flatten({background:{r:250,g:246,b:240}}).png().toFile("apps/comfyui/outputs/grass-input/mower-side-input-rgb.png")'

# 2. Run the img2img workflow
& "C:\ComfyUI\ComfyUI_windows_portable\python_embeded\python.exe" \
  apps/comfyui/scripts/run-img2img.py \
  --workflow mower-side-v3-img2img.json \
  --seed 5901 \
  --input-image mower-side-input-rgb.png

# 3. Convert to webp at 2 sizes
bun -e '...'
```

## See also

- `apps/comfyui/prompts/grass-v3-img2img.md` (D-0009 Path 3 of 3)
- `apps/comfyui/prompts/pinellas-palm-v3-img2img.md` (cross-cutting visual upgrade)
- `governance/decisions/0008-hero-v2-asset-pack.md` §v2 outcome
  (the original LoRA-bias analysis)
- `apps/comfyui/scripts/run-img2img.py` (the one-off driver)
- `apps/comfyui/workflows/mower-side-v3-img2img.json` (the workflow)
