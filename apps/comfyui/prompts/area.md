---
name: area
description: Per-ZIP area scene template. Slots: {zip} (5-digit), {neighborhood-name} (Largo + adjacent: 33771, 33770, 33778, 33773, 33774, 33756). 6 ZIPs × 1 scene = 6 assets.
type: area
workflow: area-{zip}.json
resolution: [1200, 675]
output_path_template: apps/web/public/areas/{zip}.webp
seed_formula: "2200 + zip"
style_block: _style-block.md
---

# Area scene — {zip} ({neighborhood-name})

## Subject

A wide establishing shot of the **{neighborhood-name}** neighborhood in
Largo, FL ({zip}). Not a street-view map screenshot — a curated angle
that conveys the *feel* of living here: the lawn-care rhythms, the
architecture, the tree canopy, the small Florida-specific details.

## Composition

- Wide horizontal, low camera height (chest level).
- Subject is the streetscape: sidewalk, curbside lawns, mid-distance
  ranch houses, mature live oaks or palm silhouettes.
- A single mower or edger visible somewhere (implies the service
  is happening here, not just here-are-some-houses).
- No people.

## Per-ZIP flavor

Each ZIP has a distinct neighborhood character. Match it:

| ZIP | Neighborhood | Character |
|---|---|---|
| 33771 | Largo (downtown / central) | Mature oaks, older ranch homes, slightly shaded streets |
| 33770 | Belleair / Harbor Bluffs edge | Larger lots, manicured hedges, hints of intracoastal water |
| 33778 | Seminole / Pinellas Park fringe | Open lawns, more sun, ranch + manufactured-home mix |
| 33773 | East Lake area | Newer subdivisions, screen porches, fresh sod |
| 33774 | Ridgecrest / Walsingham corridor | Palms prominent, mid-density, light commercial visible |
| 33756 | Clearwater east edge | Established trees, smaller lots, urban-suburban blend |

## Lighting

Late-afternoon golden hour. The neighborhood name plus the hour tells
the visitor "this is when we work, this is when it looks like this."

## Mood

Quiet, lived-in, maintained. Not aspirational-magazine, not hoarded-rural.
Reads as "your neighbor's block."

## See also

- `apps/comfyui/prompts/_style-block.md` — palette + anti-patterns
- `apps/web/src/lib/business.ts` — ZIP list (single source of truth)