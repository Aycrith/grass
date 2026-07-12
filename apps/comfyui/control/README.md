# control/ — IP-Adapter reference imagery

> **Status (2026-07-11):** Empty. The single `ip-style-ref.png` lands
> here after WP0 (ComfyUI server running).

## What goes here

```
control/
├── ip-style-ref.png          # ONE image, used as IP-Adapter style_model for ALL 19 assets
└── README.md                 # this file
```

## How to choose the anchor (post-WP0)

1. Start with the existing `apps/web/public/hero/desktop.svg` (the
   most-curated SVG composition we have).
2. Render it at high-res PNG via `sharp` at 2× its display size
   (e.g., 4800×2400 → save as `ip-style-ref.png`).
3. Open the PNG in any image viewer. Check that:
   - The palette is recognizable (`--ll-palm-shadow` greens,
     `--ll-sand-bleached` sky, `--ll-gulf` upper).
   - The composition reads "Largo / Pinellas / residential" at a glance.
   - The grain / line weight feels editorial (not slick-stock, not
     photorealistic).
4. If it doesn't read well, generate 3–4 candidate anchors via
   ComfyUI's img2img on the existing SVG, pick the keeper.

## Why ONE anchor for all 19 assets

IP-Adapter Plus's `style_model` mode transfers *visual style* (palette
+ lighting + grain + line weight) without copying *content*. Using the
same anchor for every asset is the single most important
cross-page-consistency lock. Don't change it mid-library — if you do,
every webp needs to be regenerated.

## Weight calibration

Start at `weight=0.5`. Test on a single hero generation. If the
generated images drift too far from the anchor (palette wrong, grain
wrong), bump to `0.6`. If they over-fit the anchor (too identical,
no per-asset variation), drop to `0.4`. Lock the weight once and
document the final value in the workflow JSON's IP-Adapter node.
