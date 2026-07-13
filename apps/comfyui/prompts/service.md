---
name: service
description: Per-service scene template. Slots: {slug} (mowing | edging | mulching | hedge-trimming | hurricane-prep | seasonal-cleanup), {mood} (bright default | hurricane dark). 6 services × 1 scene = 6 assets.
type: service
workflow: service-{slug}.json
resolution: [1600, 900]
output_path_template: apps/web/public/services/{slug}.webp
seed_formula: "1100 + slug_hash"  # see _style-block.md seed table
style_block: _style-block.md
lora: storybook-landscapes-xl
lora_strength: 0.75
ip_adapter_weight: 0.55
mood_overrides:
  hurricane-prep: hurricane
---

# Service scene — {slug}

## Style engine

This scene runs **with** the storybook LoRA at 0.75 strength — slightly
under the hero's 0.85 so the action (mower deck, edger blade, hedge
shears) stays readable instead of being swallowed by brushwork. IP-Adapter
at 0.55 keeps palette continuity with the rest of the library. Prepend
trigger words: `digital storybook illustration, textured brushwork,
sharp focus`.

## Subject

A working moment of the **{slug}** service in a Pinellas residential
yard. The action is the photo — mowing deck engaged, edger trimming
along a sidewalk, mulch being spread, hedge shears mid-cut, hurricane
prep stacking patio furniture, leaf rake gathering piles. Whatever
{slug} means, show it being done.

## Composition

- Subject action occupies the lower 2/3 of frame.
- Yard fills foreground; house or fence fills mid-distance.
- Equipment visible (the tool doing the work is in-frame, not cut out).
- No people facing camera directly (avoids AI-face issues). A hand or
  silhouette is fine.

## Lighting

**Default mood: bright** — morning golden hour, soft warm light,
shadows short on the grass. Reads "weekend morning, getting things done."

**Hurricane mood (slug=hurricane-prep only):** overcast, pre-storm.
Light is cool and dim, sky `--ll-gulf` heavy with `--ll-palm-shadow`
clouds. The scene is deliberately darker than the rest of the library
— this matches the live hurricane-mode banner on the site
(`components/site/HurricaneBanner.tsx`) and is intentional. **Do not
brighten to match other service scenes.** If the LoRA pulls the sky
back toward warm, drop LoRA strength to 0.65 for this asset only.

## Mood

- Default: capable, calm, daily-rhythm-of-care. Reads as a storybook
  spread — "this is what Tuesday morning looks like."
- Hurricane: prepared, methodical, mid-task. Not panicked. The same
  storybook feel but with cooler palette and shorter shadows.

## Per-slug notes

- **mowing**: freshly mowed stripes on St. Augustine grass, mower at
  mid-distance, blue sky.
- **edging**: clean edge between grass and concrete walkway, edger
  visible, late-afternoon shadows.
- **mulching**: dark mulch being spread around the base of a palm or
  shrub, gloved hands visible.
- **hedge-trimming**: hedge shears mid-cut on a row of small shrubs,
  clippings visible, golden hour side-light.
- **hurricane-prep**: patio furniture stacked against a garage, potted
  plants moved to a porch, tarp over a grill. Dim, cool light.
- **seasonal-cleanup**: leaf rake pulling a pile into a yard bag,
  autumn-but-still-Florida foliage (not bare trees).

## See also

- `apps/comfyui/prompts/_style-block.md` — palette + anti-patterns
- Plan §2 — hurricane scene kept dark (intentional)