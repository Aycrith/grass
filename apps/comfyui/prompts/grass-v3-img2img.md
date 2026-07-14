---
name: grass-v3-img2img
description: >
  v3 grass asset — img2img of the v1 grass-blade-cluster-xl.svg with
  low denoise (0.35) to painterly-ify without changing the 7-blade
  structure. Solves the D-0008 §D-0009 follow-up's "long-term grass
  asset upgrade" (Path 3 of 3: img2img the existing grass SVG).
  Successfully generates clean St Augustine Florida lawn grass in
  brand forest green (#1F4E2C) without the LoRA bias toward
  purple fountain grass / magenta blades / wildflower meadow
  that plagued the v2 txt2img approach (4-of-4 failure on
  hero-layer-grass.json at LoRA 0.80, 4-of-4 at LoRA 0.55 were
  green blades with purple iris blooms).

  Source: apps/web/public/illustrations/grass-blade-cluster-xl.svg
  Output: apps/web/public/illustrations/grass-blade-cluster-v3-*.webp
  Workflow: apps/comfyui/workflows/hero-grass-v3-img2img.json
  Driver: apps/comfyui/scripts/run-img2img.py
  Curated: 4/4 candidates at seeds 5701-5704 all keepers (denoise 0.35
  is very stable, all 4 nearly identical). Seed 5701 selected as
  canonical.
type: grass
version: 3
status: keeper
input: grass-blade-cluster-xl.svg
output_resolution: [200, 200]  # matches the v1 SVG viewBox
output_paths:
  - apps/web/public/illustrations/grass-blade-cluster-v3-100.webp
  - apps/web/public/illustrations/grass-blade-cluster-v3-150.webp
  - apps/web/public/illustrations/grass-blade-cluster-v3-200.webp
  - apps/web/public/illustrations/grass-blade-cluster-v3-300.webp
seed: 5701
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

# Grass — v3 img2img (D-0009 follow-up closure)

## What this asset is

The v3 grass cluster. Replaces the v1 hand-authored SVG
(`grass-blade-cluster-xl.svg`) with an SDXL+LoRA+IP-Adapter
img2img at low denoise (0.35). The 7-blade silhouette of the
v1 SVG is preserved (denoise is too low to deviate from the
input structure) but the rendering is now painterly/gouache
with soft sunlit highlights in the inner blade sections.

## Why img2img and not txt2img

D-0008 §v2 outcome documented that the v2 txt2img approach
(`hero-layer-grass.json`) failed 4-of-4 on the "grass" subject
because of LoRA bias toward purple fountain grass / wildflower
meadow. 4-of-4 at LoRA 0.80 were magenta-tipped; 4-of-4 at
LoRA 0.55 were green blades with purple iris blooms. The brand
needs St Augustine Florida lawn grass in `--ll-green`; the
SDXL+LoRA pipeline has the wrong prior.

The img2img approach sidesteps this by:
1. Providing the correct shape (7 blades, brand green) as
   the input image
2. Using low denoise (0.35) so the model only has to
   re-paint the texture, not invent the subject
3. The IP-Adapter style transfer (weight 0.40) keeps the
   output in the same storybook family as the rest of the
   brand asset pack

## What ships

4 candidates generated at seeds 5701-5704. All 4 are
keeper-quality (the low denoise produces very stable output).
Seed 5701 is the canonical version.

Rasterized to webp at 4 sizes (100/150/200/300) to match
the v1 SVG kit's render-at-any-size pattern. Webp is
~1-5 KB per size — the asset is mostly solid-color field
with thin blade strokes, so webp compresses extremely well.

## How to use

Replace v1 SVG references with v3 webp:

```diff
- <Illustration src="/illustrations/grass-blade-cluster-xl.svg" />
+ <Illustration src="/illustrations/grass-blade-cluster-v3-200.webp" />
```

The v1 SVG is kept for fallback + diff traceability.

## How to regenerate

```bash
# 1. Make sure ComfyUI is up
# 2. Rasterize the v1 SVG to a 1024x1024 RGB PNG
bun -e 'const sharp=(await import("sharp")).default; const svg=await Bun.file("apps/web/public/illustrations/grass-blade-cluster-xl.svg").text(); await sharp(Buffer.from(svg),{density:300}).resize(1024,1024,{fit:"contain",background:{r:250,g:246,b:240,alpha:1}}).flatten({background:{r:250,g:246,b:240}}).png().toFile("apps/comfyui/outputs/grass-input/grass-xl-input-rgb.png")'

# 3. Run the img2img workflow
& "C:\ComfyUI\ComfyUI_windows_portable\python_embeded\python.exe" \
  apps/comfyui/scripts/run-img2img.py \
  --workflow hero-grass-v3-img2img.json \
  --seed 5701 \
  --input-image grass-xl-input-rgb.png

# 4. Convert the keeper to webp at the 4 sizes
bun -e '...'
```

## See also

- `governance/decisions/0008-hero-v2-asset-pack.md` §v2 outcome
  for the original LoRA-bias analysis that motivated the
  img2img approach
- `governance/decisions/0008-hero-v2-asset-pack.md` §D-0009
  follow-up (Path 3 of 3) for the original 3-path proposal
- `apps/comfyui/scripts/run-img2img.py` for the driver
- `apps/comfyui/workflows/hero-grass-v3-img2img.json` for
  the workflow
