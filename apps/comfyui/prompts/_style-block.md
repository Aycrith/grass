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

## Negative prompt (paste into SDXL CLIPTextEncode negative)

```
smiling family, generic green grass texture, palm tree silhouette decoration,
flamingo, sunset as focal point, lawn equipment cutout, AI generated people,
human face, detailed facial features, portrait photography of person,
lorem ipsum, placeholder, coming soon, photo placeholder, stock photo watermark,
shutterstock, istock, getty, blurry phone photo, thumb visible, drone aerial,
winter bare trees, snow, watermark, text, signature, logo, AI artifact,
blur, oversaturated, neon colors, generic suburb
```

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
as `style_model` for **every** generation, weight 0.4–0.6. This is the
single most important cross-page-consistency lock — pick this image once,
keep it stable across the whole library.