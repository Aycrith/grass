---
name: hero
description: Full-bleed hero composition — 2400×1500 master, cropped to 2400×1200 (desktop) and 1200×1500 (mobile). Plan §2 locked: single generate + 2 crops for v1; switch to independent desktop+mobile compositions in v2 if mobile crop feels cramped.
type: hero
workflow: hero-landscape.json
resolution: [2400, 1500]
output_paths:
  - apps/web/public/hero/desktop.webp   # cropped from master
  - apps/web/public/hero/mobile.webp    # cropped from master
seed: 4242
style_block: _style-block.md
lora: storybook-landscapes-xl
lora_strength: 0.85
ip_adapter_weight: 0.50
---

# Hero — landscape composition (single master, dual-crop)

## Style engine

This scene runs **with** the storybook LoRA. Prepend trigger words:
`digital storybook illustration, textured brushwork, sharp focus`.
The negative block (brand + LoRA author) is appended by the driver.
IP-Adapter weight is 0.50 — the hero gets its strong style from the
LoRA + composition prompt; IP-Adapter just keeps palette continuity
with the rest of the library.

## Subject

A freshly mowed St. Augustine lawn in a Pinellas residential yard at
**golden hour** (the warm late-afternoon light that makes grass glow).
The lawn is the hero — fills the lower 2/3 of the frame. A modest
ranch-style house or screen porch sits in the upper 1/3. Mid-distance
palm(s) anchor the Florida setting without becoming tropical kitsch.

## Composition

- Rule of thirds. Horizon line at lower-third.
- Slight wide-angle (35mm equivalent).
- Mower visible in mid-distance (small scale) — implies "your neighbor
  just finished", doesn't dominate.
- Painterly depth — the LoRA pulls textures into brushwork; lean into
  that by giving the eye a clear foreground/midground/background path.
- No people (operator is off-frame, suggested by the mower).

## Lighting

Late-afternoon golden hour. Long warm shadows on the grass. The sky is
the `--ll-sand-bleached` color near the horizon, transitioning to
`--ll-gulf` at the top.

## Mood

Quiet, just-finished, residential, capable. **Reads like the
opening spread of a children's book about a Florida neighborhood** —
hand-drawn warmth, not stock photography.

## Crop guidance

Engineer crops in post via `sharp.extract()`:

- **Desktop (2400×1200)** — center horizontal crop, keep the lawn in
  the bottom 2/3 of the frame.
- **Mobile (1200×1500)** — center vertical crop, keep the house
  visible at the top.

## See also

- `apps/comfyui/prompts/_style-block.md` — palette + anti-patterns
- `apps/comfyui/control/ip-style-ref.png` — IP-Adapter style anchor
- Plan §2 — locked decision (single master + 2 crops)