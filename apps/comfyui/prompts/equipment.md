---
name: equipment
description: Per-tool equipment tile template. Slots: {tool} (mower | trimmer | blower | edger). 4 tools × 1 tile = 4 assets.
type: equipment
workflow: equipment-{tool}.json
resolution: [800, 600]
output_path_template: apps/web/public/equipment/{tool}.webp
seed_formula: "3300 + tool_hash"
style_block: _style-block.md
lora: storybook-landscapes-xl
lora_strength: 0.65
ip_adapter_weight: 0.50
---

# Equipment tile — {tool}

## Style engine

This scene runs **with** the storybook LoRA but at a **reduced 0.65
strength** — equipment tiles are the most reference-functional imagery
in the library (the steward wants them readable at small sizes in the
OperatorStrip grid). Going heavy on the LoRA here turns the mower into
a brushy blob. IP-Adapter at 0.50 keeps palette continuity without
locking the action shot into the landscape aesthetic.

## Subject

A close-up of a **{tool}** at work in a Pinellas residential yard. Not
a product shot on white — the tool is being used, in context, at a
slight angle that shows both the tool head and the work being done.

## Composition

- Square-ish crop (4:3) for the equipment grid in `OperatorStrip`.
- Tool head fills ~40% of frame, mid-action.
- Foreground: grass / hedge / driveway surface (whatever the tool works on).
- Background: soft-focus yard / fence (rule-of-thirds bokeh OK at this size).

## Per-tool notes

- **mower**: deck close to grass, freshly-cut clippings visible,
  mowing stripes leading away from the deck. The mower fills the lower
  half of the frame; the yard stretches back.
- **trimmer**: trimmer head mid-spin against a fence line or tree
  base, grass clippings airborne, slight motion blur on the head.
- **blower**: leaves or grass clippings in mid-air across a driveway,
  blower nozzle visible in lower-right, action moving left-to-right.
- **edger**: clean cut between grass and concrete, edger blade just
  engaged, a thin line of turf dust kicked up.

## Lighting

Bright, daytime. Equipment tiles are functional reference imagery
(trust signals) — they should be the most readable images in the
library. Morning light is fine; overcast is fine; avoid harsh noon
shadows.

## Mood

Capable, well-maintained, professional-grade. The tool looks like it
belongs to someone who knows what they're doing with it. Painterly,
but the action stays primary.

## See also

- `apps/comfyui/prompts/_style-block.md` — palette + anti-patterns