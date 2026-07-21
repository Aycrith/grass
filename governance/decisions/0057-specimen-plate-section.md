# D-0057 — Specimen Plate section (pressed-herbarium turf grasses of Pinellas County)

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Architecture + Engineering + Research
**Reviewer:** Steward
**Related:** D-0049 (style-mismatch lesson), D-0055 (Field Log editorial voice), D-0050 (per-ZIP strip)

---

## Context

The 10-section GRASS landing page has two visual registers established:

1. **Folk-cartoon (flat-fill SVG):** hero scene 1, FieldLog route houses,
   passport stamps, sun, operator
2. **Painted VEO brushwork:** hero scene 2 background, OperatorStrip
   ambient palms, songbirds, ferns (D-0049)

The page reads as "operator's working journal, not franchise." But it
has a precision gap: the page shows the operator *mowing* lawns but
never shows the operator *knowing plants at the species level*. The
FieldLog shows the route, the OperatorStrip shows the bio, the
Schedule shows the cadence — but none of these answer the visitor's
most practical question: "**what's actually growing in my yard, and
do you know how to mow it properly?**"

The user explicitly asked for **daring** artistic design choices that
add value to the coherent artistic vision. This section introduces
the page's **third visual register** — pressed-herbarium botanical
illustration in the Curtis's Botanical Magazine (1787) / herbarium-
sheet tradition. It's the THIRD visual language on the page, and it
adds a scientific register that says "this is a working reference,
not a marketing piece."

## Decision

A new `<SpecimenPlate />` section, placed **between `<ServiceBento />`
("what we do") and `<PricingTiers />` ("what it costs")**, that contains:

- **5 vertical zones:** eyebrow → H2 → subhead → 2x2 grid → closing
- **2x2 grid of 4 pressed-herbarium turf grass specimens**, each
  hand-authored SVG (340×340 viewBox) in sepia line art + light olive
  wash on aged cream paper
- **Real UF/IFAS data** for each species: scientific name (italic),
  common name, mowing height, frequency, growth habit, location, date
- **Brand-true kicker:** "If you don't know what's in your yard, send
  a photo. I'll tell you before I quote." The operator is a turf
  grass identifier, not just a mower.

### The four species (in dominance order)

Per UF/IFAS Extension (ENH04/LH005, ENH1382/EP646, Gardening
Solutions) and local confirmation (iloveturf.com, "Better grass
for Pinellas County"):

| # | Common name | Scientific name | Mow height | Frequency | Spreads by |
|---|---|---|---|---|---|
| 1 | St. Augustinegrass (Floratam) | *Stenotaphrum secundatum* | 3.5-4.0 in | 5-14 d | Stolons only (no rhizomes) |
| 2 | Bermudagrass | *Cynodon dactylon* | 1.0-2.0 in | 3-5 d | Stolons + rhizomes |
| 3 | Zoysiagrass (Empire / JaMur) | *Zoysia spp.* | 1.75-2.5 in | 10-14 d | Stolons + rhizomes (aggressive) |
| 4 | Bahiagrass ("highway grass") | *Paspalum notatum* | 3.0-4.0 in | 7-17 d | Rhizomes only (no stolons) |

St. Augustine covers ~80% of Pinellas residential lawns. The other
20% is Bermuda, Zoysia, and the occasional Bahia. The four plates
show each species' diagnostic features:

- **St. Augustine:** 5-8mm BROAD blades with ROUNDED tips, flat
  scaly seedhead, THICK stolons (no rhizomes)
- **Bermuda:** ~2mm FINE blades with POINTED tips, 3-finger seedhead,
  stolons + rhizomes (BOTH above and below soil)
- **Zoysia:** medium 2-3mm blades, small terminal spike seedhead,
  AGGRESSIVE stolons + rhizomes (with new plantlet sprouts at nodes)
- **Bahia:** coarse V-FOLDED blades, distinctive Y-SHAPED seedhead,
  THICK rhizomes only (no above-ground stolons)

## Design rationale

### The third visual register (the dare)

The page's existing two registers are both "friendly" — folk cartoon
and painted VEO. A third register that's **scientific** says
"this operator knows plants at the species level." The visitor who
scrolls past the section sees:

- A field-guide eyebrow ("FIELD GUIDE · 06 · TURF GRASSES OF PINELLAS
  COUNTY") in faded red — the old stamp red of 19th-century
  herbarium labels
- A H2 in Fraunces ("Four species, four heights.") with a poetic
  line break
- A subhead that uses **specific, falsifiable numbers** ("Mowing
  Floratam at 2 inches is a 4-week recovery")
- 4 plates that look like museum specimens (sepia line art, light
  olive wash, faint press rings, specimen tags, corner stamps)
- 4 captions below the plates (italic scientific name + one-line
  note)
- A right-aligned closing line in Fraunces italic with a clay
  "send a photo" link

This is the page's first register that *requires* the visitor to
slow down and read. The hero is kinetic, the FieldLog is kinetic,
the schedule is kinetic — this section is **stationary**. It's the
museum exhibit where the visitor pauses.

### Aesthetic decisions (sepia line art, not flat-fill)

The first iteration of the 4 specimens used **flat-fill with strong
olive saturation** (similar to the page's existing cartoon). They
read as "modern flat icons" — visually too close to the page's
existing register, no value added.

The second iteration switched to:

- **Sepia ink outlines** (`#5a3e1f`) at 0.5 stroke (thin, scientific)
- **Olive fill** (`#6b7d4a`) at **0.15 fill-opacity** (translucent
  pressed look — the grass is "see-through," like chlorophyll
  breaking down during pressing)
- **Parallel veining lines** down each blade (botanical accuracy —
  grass blades are parallel-veined, and visible veining is the
  hallmark of a field-guide illustration)
- **4 faint press rings** in each plate's background (the mounting
  sheet's pressure marks)
- **Self-contained corner stamp** (FL-04, clay) — the field-
  collection mark
- **Self-contained specimen tag** with scientific name (italic
  Georgia), common name, care row, and "Largo FL · 2026-07-21" date

The aesthetic is the herbarium-sheet style (vintage field guides),
not the Curtis magazine style (watercolor). Turf grasses don't have
ornamental flowers; the herbarium sheet is the more honest and more
useful visual model.

### Layout: 2x2 grid, not 1x4 row

A 1x4 row of plates on desktop means each plate is ~280px wide; too
narrow to show the full anatomy (blades + seedhead + stolons +
rhizomes + tag). A 2x2 grid gives each plate ~480px on desktop,
which is enough for the full plate to be readable. On mobile,
the grid collapses to a single column stack (4 plates × 340px each).

The 2x2 also reads more like a **field guide spread** — the visual
analog of an open book. 1x4 reads like a strip of icons; 2x2 reads
like reference material.

### Specimens in dominance order (not alphabetical)

The grid is in dominance order: St. Augustine top-left, Bermuda
top-right, Zoysia bottom-left, Bahia bottom-right. The visitor's
eye starts at the top-left, which is the species they're most
likely to have. The brand message: "we know all four, but
specifically we know YOUR grass."

### The closing line (the brand-true kicker)

The closing line is the section's value-add:

> "If you don't know what's in your yard, send a photo.
> I'll tell you before I quote."

This is the only place on the page where the operator says "I will
identify your grass" — a service that's free, expert, and turns the
quote process into a conversation. The visitor who reads the
section sees that the operator is a turf grass identifier, not
just a mower. That's the dare.

## The reduced-motion contract

All 5 entry animations are gated by `@media (prefers-reduced-motion:
reduce)`:

- header fade-up
- 4 specimens staggered fade-in
- closing line fade-up
- hover rotate + drop shadow

Under reduced-motion, all 5 collapse to identity: the section is
a static plate display. The visitor who has reduced-motion enabled
sees the same content, no motion.

## The font-size trap (carried over from D-0055)

The H2 max-width is `20ch` (in the .headline class). At 2.875rem
Fraunces 400, 1ch ≈ 18px, so 20ch resolves to ~360px. This
intentionally breaks the line on "four / heights." — a poetic
cadence. The trap is that ch units are font-size dependent; at
2.875rem the width is much larger than at 1rem. I sized to 20ch
deliberately (D-0055 lesson: the visual width, not the ch count,
is what matters).

## File layout

```
apps/web/src/
├── components/sections/
│   ├── SpecimenPlate.tsx              (148 lines, this section)
│   └── SpecimenPlate.module.css       (165 lines, with --ll-* register)
└── (specimens are in public/, not src/ — see below)

apps/web/public/specimens/
├── st-augustine.svg                   (7.8KB, 340x340)
├── bermuda.svg                        (7.8KB, 340x340)
├── zoysia.svg                         (6.7KB, 340x340)
└── bahia.svg                          (7.6KB, 340x340)
```

The SVGs live in `public/` (not `src/`) because Next/Image requires
accessible URLs. The hand-authored SVGs were initially created in
`src/assets/specimens/` then git-renamed to `public/specimens/`
(Phase 3 commit).

## Verification

- TypeScript: `tsc --noEmit` passes (0 errors with proper tsconfig)
- Visual: `apps/web/audit/d-0057-specimen-plate/specimen-plate-clean.png`
  shows the section in its final rendered state
- Cross-section: `context-specimen-with-bento.png` shows the section
  in context between ServiceBento (cream) above and PricingTiers
  (cream) below, with the SpecimenPlate's slightly-more-aged
  background as a deliberate "different page" signal
- Hover: `specimen-hover-state.png` shows the -0.5deg rotate + drop
  shadow deepening on a single plate
- Mobile: `specimen-plate-mobile.png` shows the section at 390px
  width (iPhone 14 Pro) with 1-column stack of 4 plates
- Grid: `specimen-plate-grid.png` shows the 2x2 grid in isolation

## Rejected alternatives (to document the decision)

1. **Curtis-style watercolor plates (full color, ideal composition).**
   Rejected: turf grasses don't have ornamental flowers; the
   visitor would be confused by a flower they don't see in their
   yard. Herbarium sheet is more honest and more useful.
2. **Single-page Audubon-style full spread (1 specimen dominates,
   3 in margin).** Rejected: too much visual weight for one
   section; doesn't fit the page rhythm of ~1 viewport-height
   per section.
3. **Real photographs of pressed specimens.** Rejected: requires
   photo capture, the page already uses hand-authored SVG
   (D-0049 lesson: painted VEO + hand-authored cartoon, never
   mixed in the same shot). Real photos would introduce a new
   register the page doesn't have.
4. **Generic "lawn care tips" 4-tip grid.** Rejected: not daring,
   not a museum artifact, doesn't elevate the brand. "Lawn care
   tips" is a category every competitor has; "turf grass specimen
   plate of Pinellas County" is not.
5. **Photo-realistic AI-generated grass.** Rejected: D-0049/0055/
   0052 lesson — AI-generated images don't match the page's
   hand-drawn register. A precise hand-authored SVG of a pressed
   grass clump reads as "intentional, made by a person who knows
   plants."

## Artifacts

- Commit 1 (specimens): `dae6db0 feat(specimens): D-0057 Phase 1 — 4 hand-authored turf grass specimen SVGs`
- Commit 2 (section + page): `feat(specimen-plate): D-0057 Phases 2+3 — SpecimenPlate section + page insertion`
- Files: `apps/web/src/components/sections/SpecimenPlate.{tsx,module.css}`
- SVGs: `apps/web/public/specimens/{st-augustine,bermuda,zoysia,bahia}.svg`
- Design brief: `apps/web/audit/d-0057-specimen-plate/memo.md` (16KB)
- Captures: `apps/web/audit/d-0057-specimen-plate/{specimen-plate-{clean,desktop,grid,mobile},context-specimen-with-bento,specimen-hover-state}.png`
