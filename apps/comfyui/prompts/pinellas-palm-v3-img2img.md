---
name: pinellas-palm-v3-img2img
description: >
  v3 pinellas-palm asset — img2img of the v1 hand-authored SVG
  (apps/web/public/illustrations/pinellas-palm.svg) with low
  denoise (0.35) to painterly-ify the fronds, trunk, sun, and
  coconuts into the brand's storybook gouache style. Solves the
  WP15 / WP19 / WP49-era "stick-figure palm" complaint that
  flagged the v1 SVG as substandard alongside the v2 hero
  blob-field.

  The v3 palm is the brand's Florida identity signature — appears
  in 4 components (SiteFooter brandMark, OperatorStrip bioSignature,
  PricingTiers headerOrnament, ServiceAreaStats watermark) and is
  visible on every page of the site. The img2img approach is the
  same pattern that worked for the v3 grass (D-0009 Path 3 of 3)
  — the LoRA bias toward "tropical beach with sunset" was avoided
  by providing the correct shape as the input image and using
  low denoise (0.35) to keep the model focused on texture rather
  than subject invention.

  Source: apps/web/public/illustrations/pinellas-palm.svg
  Output: apps/web/public/illustrations/pinellas-palm-v3-{72,120,600x400}.webp
  Workflow: apps/comfyui/workflows/pinellas-palm-v3-img2img.json
  Driver: apps/comfyui/scripts/run-img2img.py (one-off, see grass v3)
  Curated: 4/4 candidates at seeds 5801-5804 all keepers (denoise 0.35
  is very stable, all 4 nearly identical). Seed 5801 selected as
  canonical.
type: illustration
version: 3
status: shipped
input: pinellas-palm.svg
output_paths:
  - apps/web/public/illustrations/pinellas-palm-v3-72.webp
  - apps/web/public/illustrations/pinellas-palm-v3-120.webp
  - apps/web/public/illustrations/pinellas-palm-v3-600x400.webp
components_using_v3:
  - apps/web/src/components/site/SiteFooter.tsx (brandMark, 36px)
  - apps/web/src/components/sections/OperatorStrip.tsx (bioSignatureMark, 72px)
  - apps/web/src/components/sections/PricingTiers.tsx (headerOrnamentMark, 120px)
  - apps/web/src/components/sections/ServiceAreaStats.tsx (watermark, 600x400)
seed: 5801
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

# Pinellas-palm — v3 img2img (D-0009 follow-up closure)

## What this asset is

The v3 palm tree, painted in the brand's storybook gouache style.
Replaces the v1 hand-authored SVG (`pinellas-palm.svg`) which the
WP15 / WP19-era audit trail described as "a stick figure, not a
painted-storybook-spread the brand voice calls for." Same fix
pattern that resolved D-0008 for the v2 hero (commit 72e749c): the
v1 SVG provided the correct shape, the SDXL pipeline painted the
texture on top at denoise 0.35, the IP-Adapter style transfer kept
the output in the brand's storybook family.

## Why img2img and not txt2img

The D-0008 §v2 outcome documented that the v2 txt2img approach
(`hero-layer-grass.json`) failed 4-of-4 on the "grass" subject
because of LoRA bias toward purple fountain grass / wildflower
meadow. The same risk applies to "palm tree" — the SDXL+LoRA
pipeline biases toward "tropical beach with sunset / hammock /
ocean" which is wrong for the brand's editorial voice. The
img2img approach sidesteps this by:
1. Providing the correct shape (single mature fan-palm, brown
   trunk with rings, fronds sweeping outward) as the input image
2. Using low denoise (0.35) so the model only has to re-paint
   the texture, not invent the subject
3. The IP-Adapter style transfer (weight 0.40) keeps the output
   in the same storybook family as the rest of the brand asset
   pack (v2 hero, v3 grass, layer-palm from D-0008)

The result: 4-of-4 candidates were keepers. The LoRA bias toward
"tropical beach" was completely avoided — every candidate
shows an isolated palm on transparent background with no
beach, no ocean, no hammock, no person, no sunset-as-focal-point.

## What ships

4 candidates generated at seeds 5801-5804, ALL 4 keepers (low
denoise is very stable — outputs are nearly identical, all
show the same single mature palm, sun on the right, slight
variation in frond angle and trunk curve). Seed 5801 selected
as the canonical version.

Rasterized to webp at the 3 sizes the components actually use:
  - pinellas-palm-v3-72.webp     ~1 KB (SiteFooter brandMark,
                                          OperatorStrip bioSignature)
  - pinellas-palm-v3-120.webp    ~2 KB (PricingTiers headerOrnament)
  - pinellas-palm-v3-600x400.webp ~9 KB (ServiceAreaStats watermark)

The v3 master is 1024×1024 (1:1 aspect, palm in center-left, sun
in upper-right). The 600x400 variant is a 3:2 crop for the
watermark component (which uses `aspect-ratio: 6/1.4` in CSS).

Webp compresses extremely well — the solid-color transparent
background is near-zero cost; the painted palm itself is mostly
thick brushstrokes. Total: ~12 KB for all three webp variants
vs the v1 SVG at 3.6 KB. Worth the size increase for the visual
quality upgrade.

## Component swaps shipped (4 files)

The 4 components that referenced `/illustrations/pinellas-palm.svg`
now reference the v3 webp at the appropriate size:
  - SiteFooter.tsx → /illustrations/pinellas-palm-v3-72.webp
    (width 36, height 36 — was 36×24, height changed to match 1:1 aspect)
  - OperatorStrip.tsx → /illustrations/pinellas-palm-v3-72.webp
    (width 72, height 72 — was 72×48)
  - PricingTiers.tsx → /illustrations/pinellas-palm-v3-120.webp
    (width 120, height 120 — was 120×80)
  - ServiceAreaStats.tsx → /illustrations/pinellas-palm-v3-600x400.webp
    (width 600, height 400 — same dimensions, but now painted)

The v1 SVG is KEPT at apps/web/public/illustrations/pinellas-palm.svg
for fallback + diff traceability.

## Visual regression baselines

The 4 component swaps change the visual output of every page
that uses them. The Playwright visual regression baselines at
apps/web/visual/baselines/ will fail for the affected routes
(home, pricing, areas, about — every page has the footer palm).
The steward should regenerate baselines:

  cd apps/web
  bunx playwright test --update-snapshots
  git diff visual/baselines/   # review
  git add visual/baselines/    # commit

The 16 committed PNG baselines at apps/web/visual/baselines/ will
all need the palm-marked regions updated. Diff is expected to be
limited to the footer + operator + pricing + watermark regions.

## How to regenerate the v3 palm

```bash
# 1. Make sure ComfyUI is up
# 2. Rasterize the v1 SVG to a 1024x1024 RGB PNG
bun -e 'const sharp=(await import("sharp")).default; const svg=await Bun.file("apps/web/public/illustrations/pinellas-palm.svg").text(); await sharp(Buffer.from(svg),{density:300}).resize(1024,1024,{fit:"contain",background:{r:250,g:246,b:240,alpha:1}}).flatten({background:{r:250,g:246,b:240}}).png().toFile("apps/comfyui/outputs/grass-input/pinellas-palm-input-rgb.png")'

# 3. Run the img2img workflow (4 candidates, seeds 5801-5804)
& "C:\ComfyUI\ComfyUI_windows_portable\python_embeded\python.exe" \
  apps/comfyui/scripts/run-img2img.py \
  --workflow pinellas-palm-v3-img2img.json \
  --seed 5801

# 4. Convert the keeper to webp at the 3 sizes
bun -e 'const sharp=(await import("sharp")).default; const fs=(await import("node:fs/promises")).default; const base="apps/comfyui/outputs/largo-lawn/grass-v3-img2img/candidate_1_pinellas_palm_v3_img2img_00001_.png"; for (const [name,sz] of [["72",72],["120",120],["600x400",{w:600,h:400}]]) { const buf = await sharp(base).resize(typeof sz === "object" ? sz.w : sz, typeof sz === "object" ? sz.h : sz, {fit: typeof sz === "object" ? "cover" : "contain", background:{r:250,g:246,b:240,alpha:1}, position:"left"}).webp({quality:85}).toBuffer(); await fs.writeFile(`apps/web/public/illustrations/pinellas-palm-v3-${name}.webp`, buf) }'
```

## See also

- `governance/decisions/0008-hero-v2-asset-pack.md` §v2 outcome
  for the original LoRA-bias analysis
- `apps/comfyui/prompts/grass-v3-img2img.md` for the parallel
  v3 grass asset (same workflow pattern)
- `apps/comfyui/scripts/run-img2img.py` for the one-off driver
- `apps/comfyui/workflows/pinellas-palm-v3-img2img.json` for
  the workflow
