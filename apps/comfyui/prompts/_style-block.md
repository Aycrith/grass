---
name: _style-block
description: Shared style anchor — palette, composition, lighting, anti-patterns. Included in every other prompt by reference.
type: shared
---

# Shared style block

This file is **not a standalone prompt** — it's the style anchor every
other prompt in `prompts/` references. The driver script inlines this
block into every generation call. Don't change it without re-curating
all 19 assets (the visual coherence of the whole library hangs on this).

## Composition

- Rule of thirds; subject fills the lower 2/3, sky/trees/structures top 1/3.
- Yard visible in foreground (where applicable).
- Mower or operator visible at small/medium scale (where applicable).
- Pinellas-evocative architecture: ranch houses, screen porches, palm
  silhouettes in mid-distance, no high-rises or coastal condos.

## Lighting

- **Morning (7–9am) or late afternoon (4–6pm)** — soft, warm, golden.
- Harsh noon shadows are an anti-pattern.
- Overcast days OK but not preferred.

## Palette (anchored to apps/web/src/styles/tokens.css)

| Token | Hex | Use |
|---|---|---|
| `--ll-green` | `#1f4e2c` | Foliage, primary brand |
| `--ll-palm-shadow` | `#2d5a3d` | Deep foliage / section bg |
| `--ll-palm-light` | `#6b9b7e` | Subdued foliage |
| `--ll-gulf` | `#2e6b8c` | Sky / water secondary |
| `--ll-sun` | `#e8b65a` | Warm gold (sun, ribbon) |
| `--ll-clay` | `#b5651d` | Brick accent (eyebrow text only) |
| `--ll-sand-bleached` | `#f4e8d0` | Warm bone (sky / surface) |
| `--ll-cream` | `#faf6f0` | Pure white-ish (card bg) |
| `--ll-palm-bark` | `#1a1f1b` | Near-black with green tint |

Hex literals in the prompt must match these exactly. Don't introduce new
colors — if you need one, add a token to `tokens.css` first.

## Composition grain

- 35mm equivalent focal length (slight wide-angle; not iPhone ultra-wide).
- Hand-held feel OK; tripod-perfect feel is suspicious.
- Mild film grain acceptable; over-sharpened is not.

## Style engine — LoRA + IP-Adapter

The library is **hand-drawn storybook illustration**, not photography.
Two mechanism enforce that:

**LoRA — `storybook-landscapes-xl.safetensors`**
- Source: CivitAI model id 324247, downloaded 2026-07-12
- Path: `C:/ComfyUI/ComfyUI_windows_portable/ComfyUI/models/loras/storybook-landscapes-xl.safetensors` (~218 MB)
- **Always-on for:** hero, service, area, equipment scenes
- **Off for:** operator-portrait (see `operator-portrait.md` — editorial
  abstraction, must stay clean-line)
- **Trigger words** (prepend to every positive prompt):
  `digital storybook illustration, textured brushwork, sharp focus`
- **Negative additions** (LoRA author's): `people, photo, realism,
  deformed, black and white, disfigured, low contrast` — appended to the
  base negative block by the driver script
- **Strength:** 0.85 for hero / area (most weight on style);
  0.75 for service / equipment (slightly less so action stays readable)

**IP-Adapter Plus — `control/ip-style-ref.png`**
- Source: regenerated 2026-07-12 from a 4-candidate test using the
  storybook LoRA + SDXL base + the seed 4242 prompt. The keeper
  (`anchor_test_00001_.png`) was selected for best compositional
  depth (ranch + mature oak + palms + lawn + driveway + golden-hour
  clouds), richest green lawn to color-anchor other assets, and
  strongest brand alignment with the Largo residential archetype.
- **Weight calibration:** start at 0.55 for service / area / equipment,
  0.50 for hero (hero gets LoRA strength + composition prompt doing the
  heavy lifting), 0.40 for operator (if used — currently off).
- If the LoRA produces too strong a style lock, drop IP-Adapter to
  0.45; if compositions drift, raise to 0.65.

## Anti-patterns (DO NOT include any of these — PRD-05 §9)

- ❌ Smiling family in front of perfect lawn
- ❌ Generic green grass texture tile (no lawn, just texture)
- ❌ Tropical kitsch: palm tree silhouette (used as decoration, not as a
  legitimate Pinellas palm), flamingo, sunset (as a focal point)
- ❌ Lawn equipment cutout on white background (e.g., isolated mower
  with no scene)
- ❌ AI-generated people (uncanny, gets worse every month) — including
  the operator. Use stylized editorial abstraction for the operator
  portrait, per the plan §2 locked decision.
- ❌ Lorem ipsum / "placeholder" / "COMING SOON" / "PHOTO PLACEHOLDER"
  text burned into the image
- ❌ Stock photo watermarks (Shutterstock, iStock, Getty)
- ❌ Blurry phone shots with thumb visible
- ❌ Aerial drone shots (out of scope for v1 per PRD-05 §11)
- ❌ Mature trees with no leaves in winter (this is Florida; foliage is year-round)
- ❌ Photorealism / photo / 3D render / realism — the whole library is
  hand-drawn storybook illustration, not photography. The LoRA rejects
  this style; let it.
- ❌ Black-and-white, low-contrast — the brand palette is warm and saturated.
- ❌ Anime / cel-shaded / vector-flat — storybook is painterly and textured,
  not flat color blocks.

## Negative prompt (paste into SDXL CLIPTextEncode negative)

Base brand negatives:

```
smiling family, generic green grass texture, palm tree silhouette decoration,
flamingo, sunset as focal point, lawn equipment cutout, AI generated people,
human face, detailed facial features, portrait photography of person,
lorem ipsum, placeholder, coming soon, photo placeholder, stock photo watermark,
shutterstock, istock, getty, blurry phone photo, thumb visible, drone aerial,
winter bare trees, snow, watermark, text, signature, logo, AI artifact,
oversaturated, neon colors, generic suburb
```

Storybook LoRA negatives (author-supplied, applied on every LoRA run):

```
photo, realistic, photorealistic, 3d render, deformed, black and white,
realism, disfigured, low contrast, anime, cel shaded, vector art, flat color
```

The driver script concatenates both blocks per generation.

## Seed

Use a fixed seed per asset class so re-rolls are reproducible:

| Class | Base seed |
|---|---|
| hero | `4242` |
| operator-portrait | `7777` |
| service | `1100 + slug_hash` |
| area | `2200 + zip` |
| equipment | `3300 + tool_hash` |

The driver script auto-derives the per-class seed from this table.

## IP-Adapter style anchor

The `control/ip-style-ref.png` reference image is fed to IP-Adapter Plus
as `style_model` for **every** generation that uses the storybook LoRA
(hero, service, area, equipment). This is the single most important
cross-page-consistency lock — pick this image once, keep it stable
across the whole library. Regenerate only when the brand aesthetic
materially shifts; see the "Style engine" section above for current
weight calibration and the 2026-07-12 keeper rationale.