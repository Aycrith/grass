# D-0057 — Specimen Plate section: design brief

**Status:** Design phase
**Date:** 2026-07-21
**Author:** Mavis
**Reviewer:** Steward
**Related:** D-0049 (style-mismatch lesson), D-0055 (Field Log editorial voice), D-0047 (Six-ZIP service area)

---

## The dare

The 10-section GRASS landing page is now a coherent field-notebook
artifact: cream + sun-yellow + palm-bark + clay palette, hand-drawn
flat-fill SVG cartoon, painted VEO backgrounds, passport stamps,
field notes, route maps. The brand reads as "operator's working
journal, not franchise."

What's missing: **precision**. The page currently speaks in the
voice of a craftsman but doesn't show that the craftsman can
*identify the plants at the species level*. The FieldLog shows
the route, the OperatorStrip shows the bio, the Schedule shows
the cadence — but none of these answer the visitor's most
practical question: "**what's actually growing in my yard, and
do you know how to mow it properly?**"

The dare is to add a section that is **a museum-quality
botanical specimen plate of the four turf grasses of Pinellas
County** — the kind of artifact a working botanist or UF/IFAS
extension agent would recognize as accurate. This is a NEW
visual register the page doesn't have yet:

| Register | Where it lives | Source |
|---|---|---|
| Folk-cartoon (flat-fill SVG) | Hero scene 1, FieldLog route, stamps | D-0049 + D-0050 + D-0055 |
| Painted VEO brushwork | Hero scene 2, OperatorStrip, songbirds | D-0049 + D-0053 |
| Pressed-specimen botanical (NEW) | **Specimen Plate (this section)** | Curtis's Botanical Magazine (1787), herbarium sheets |

The third register is **sepia, desaturated, and aged** — like a
pressed plant on cream paper. It introduces a scientific tone
without breaking the field-notebook theme (botanical plates
ARE field notebooks). The visitor sees: "this operator knows
plants at the species level."

## The four species (real data)

From UF/IFAS Extension and the Florida Lawn Care Authority
(cited below). These are the four warm-season turf grasses
commercially viable in Pinellas County, in dominance order:

| # | Common name | Scientific name | Blade | Mowing height | Frequency | Spreads by |
|---|---|---|---|---|---|---|
| 1 | St. Augustinegrass (Floratam) | *Stenotaphrum secundatum* | 5-8 mm, broadest, **rounded** tip, dark blue-green | 3.5-4.0 in | 5-14 d | Stolons only (no rhizomes) |
| 2 | Bermudagrass | *Cynodon dactylon* | ~2 mm, fine, **pointed** tip, gray-green | 1-2 in | 3-5 d | Stolons + rhizomes |
| 3 | Zoysiagrass | *Zoysia spp.* | 2-3 mm, medium, **pointed** tip, medium-dark green | 1.75-2.5 in | 10-14 d | Stolons + rhizomes (aggressive) |
| 4 | Bahiagrass | *Paspalum notatum* | coarse, V-shaped, light-medium green, **Y-shaped seedhead** | 3-4 in | 7-17 d | Thick rhizomes (no stolons) |

These four cover ~95% of Pinellas residential lawns. The
section visualizes the four blade profiles, four growth habits,
and four seedheads — and the four mowing heights are the
practical answer to the visitor's question.

Sources:
- UF/IFAS ENH04/LH005 "Selecting a Turfgrass for Florida Lawns"
- UF/IFAS ENH1382/EP646 "Florida Turfgrass Identification"
- UF/IFAS Gardening Solutions "Mowing Your Florida Lawn"
- Florida Lawn Care Authority "Florida Turfgrass Selection Guide"
- iloveturf.com "Better grass for Pinellas County" (local confirmation)

## The aesthetic: herbarium sheet, not Curtis's Magazine

Two reference styles, both botanical, but very different:

**Curtis's Botanical Magazine** (1787–present): hand-colored
copper engravings of ORNAMENTAL plants. Each plate shows the
plant in full watercolor glory — bright petals, lush foliage,
idealized composition. The audience was wealthy gardeners who
wanted to know what exotic flowers looked like.

**Herbarium sheet** (Linnaeus, 1750s–present): a PRESSED,
DRIED plant glued to a sheet of mounting paper with a typed
or handwritten label in the bottom-right corner. The audience
was working botanists who needed to identify specimens in the
field. The aesthetic is **sepia, olive, desaturated** — the
plant has been dried, so the color is gone. The composition
is "this is what the plant looks like in your hand, with
roots, stem, leaves, and inflorescence all visible." The
label is the working scientist's note to their future self.

For turf grasses, the **herbarium sheet** is the right model.
Turf grasses don't have ornamental flowers. Their value is
*identification* — the visitor looks at the blade, the
seedhead, the growth habit, and figures out what's in their
yard. A bright watercolor Curtis plate would be wrong; a
sepia pressed-specimen plate is what the page needs.

The page already has the folk-cartoon and painted-VEO
registers. The pressed-specimen register is the third, and
it's the one that says "this is a working reference, not a
marketing piece."

## The visual language (precise)

Each plate is a single pressed turf grass specimen, ~340px
square, on a desaturated cream "mounting sheet" with a
slight aged-paper texture (inherited from `body::before`
paper-grain at 5% opacity). The plate has five elements:

```
┌─────────────────────────────────────┐
│  [stamp]                            │  ← corner stamp (clay)
│                                     │
│      ▲▲▲  ← seedhead                │
│      │││  ← blades                  │
│      │││  ← stolons/rhizomes (runners)
│      ▔▔▔  ← soil line               │
│                                     │
│  ───────────────────────────────    │
│  Stenotaphrum secundatum     [4]    │  ← scientific name (italic)
│  St. Augustinegrass · Floratam      │  ← common name
│  3.5-4.0 in · weekly · stolons      │  ← care
│  Largo FL · 2026-07-21              │  ← label
└─────────────────────────────────────┘
```

The pressed-specimen drawing for each species is hand-authored
SVG, with a *thin sepia outline + olive fill* — the actual
colors of pressed/dried grass. The drawing shows:

1. **Seedhead** at the top (the most diagnostic feature —
   Bahia has the distinctive Y-shape, Bermuda has a spike
   with 3-5 fingers, St. Augustine has a flat spike, Zoysia
   has a small spike)
2. **3-4 blades** emerging from a central crown, at the
   species' actual proportions
3. **Stolons and/or rhizomes** at the base, depending on
   the species (Bahia and Bermuda have rhizomes that dive
   below the soil line; St. Augustine has only above-ground
   stolons; Zoysia has both)
4. **Soil line** at the bottom — a thin horizontal line
   with little grass-root squiggles below
5. **Specimen tag** in the lower-right corner, a small
   rectangle with handwritten-style text:
   - **Scientific name** (italic Fraunces)
   - **Common name + cultivar** (Inter 400)
   - **Care row**: "3.5-4.0 in · weekly · stolons"
   - **Location + date**: "Largo FL · 2026-07-21"

The care row is the visitor's practical takeaway. A homeowner
who knows they have Floratam now knows to mow at 3.5-4 inches
weekly, not at 2 inches. That's the section's job: turn a
mowing service into a *knowledgeable* mowing service.

## The 2×2 grid + hover reveal

Four plates sit in a 2×2 grid on desktop (single column on
mobile, in the same dominance order as the table above —
St. Augustine top-left as the dominant species, Bermuda
top-right, Zoysia bottom-left, Bahia bottom-right).

Each plate has a **hover/focus reveal**: a small caret in
the upper-right of the plate, on hover the plate
subtly tilts forward (`transform: rotate(-0.5deg)`) and the
specimen tag fades in to full opacity from 50%. The visitor
who is curious can hover and get the full data; the visitor
who isn't gets the at-a-glance plate. This is the museum
"exhibition card" pattern.

## Placement in page composition

**Between `<ServiceBento />` and `<PricingTiers />`.** The
current page flow is:

1. Hero (3 scenes)
2. ServiceAreaMap
3. OperatorStrip
4. FieldLog
5. **ServiceBento** ← the visitor knows what we do
6. **Specimen Plate** ← NEW: the visitor knows what we mow (at the species level)
7. **PricingTiers** ← the visitor knows what it costs
8. ProcessSteps
9. ScheduleTimeline
10. FAQAccordion
11. FinalCTABanner

The Specimen Plate sits between "what we do" and "what it
costs" — the deep-dive moment that says "we don't just mow
lawns, we mow YOUR specific grass correctly." It's also the
last editorial beat before the page becomes operational
(pricing, process, schedule). Pricing follows immediately so
the practical visitor who scrolled past still converts.

Rejected placements:
- **Before ServiceBento**: would compete with FieldLog
  (already an editorial moment)
- **After PricingTiers**: too late — the visitor has decided
- **After ScheduleTimeline**: visitor has already converted
  or bounced; doesn't help the funnel

## Section copy

- **Eyebrow:** `FIELD GUIDE · 06 · TURF GRASSES OF PINELLAS COUNTY`
  (12px Inter 700 uppercase, letter-spacing 0.18em, faded red)
- **H2:** `Four species, four heights.`
  (48px Fraunces 400, palm-bark, 12ch max-width)
- **Subhead:** "St. Augustine covers about 80% of the lawns
  in 33771. The other 20% is Bermuda, Zoysia, and the
  occasional Bahia. They look similar. They mow completely
  differently. Mowing Floratam at 2 inches is a 4-week
  recovery. Mowing Bermuda at 4 inches is a thatch
  disaster. The grass in your yard is the grass I plan
  around." (16px Inter 400, palm-bark at 80%)
- **Closing line** (right-aligned, after the grid): "If
  you don't know what's in your yard, send a photo. I'll
  tell you before I quote." (15px Inter italic 400,
  palm-bark at 70%, with a tiny clay caret pointing to a
  CTA-less email link `hello@grass.lan`)

The closing line is the brand-true kicker: the operator
identifies turf grass as a normal part of the conversation.
This is what the dare is buying us.

## Palette additions (the "pressed specimen" register)

The page's existing palette is cream + sun-yellow + palm-bark
+ clay. The specimen plate introduces a **third register**
that's still coherent — a desaturated, sepia-leaning palette
that reads as "aged paper + dried plant":

```css
--ll-aged-paper: #ede4d0;       /* mounting sheet, warm yellow-cream */
--ll-sepia:       #5a3e1f;       /* ink for outlines + labels */
--ll-olive:       #6b7d4a;       /* pressed-grass fill */
--ll-specimen-green: #4a6741;    /* where the grass is still green */
--ll-faded-red:   #6b3a1d;       /* label ink (the old stamp red) */
--ll-label-tan:   #f0e6d0;       /* small label card */
--ll-soil:        #8a6a3a;       /* soil line + root squiggles */
```

These are defined locally in `SpecimenPlate.module.css` and
NOT added to the global `tokens.css` — they're a section-local
register, like the field log's "sand-bleached" surface color
in D-0055. The brand tokens stay clean; the section has its
own micro-palette that hand-shakes with the brand at the
edges (sepia is a darker cousin of clay; aged paper is a
darker cousin of sand-bleached; faded red is a darker cousin
of clay).

## Animation philosophy (reduced-motion first)

The pressed-specimen register is the LEAST animated section
on the page. The plates are static drawings — pressed plants
don't move. The only animations are:

| Element | Animation | Period | Easing |
|---|---|---|---|
| `.grid` | opacity 0→1 + y 16→0 (on viewport entry) | 0.7s | cubic-bezier(0.16,1,0.3,1) |
| `.specimen` (×4, staggered) | opacity 0→1, delay 0/100/200/300ms | 0.5s | cubic-bezier(0.16,1,0.3,1) |
| `.specimen:hover` | rotate(-0.5deg) | 0.4s | cubic-bezier(0.4,0,0.2,1) |
| `.tag` (inside specimen) | opacity 0.5→1 on hover/focus-within | 0.3s | ease-out |
| `.closingLine` | opacity 0→1, y 8→0, delay 0.6s | 0.5s | cubic-bezier(0.16,1,0.3,1) |

All gated by `prefers-reduced-motion: reduce` — the
animations collapse to identity, the section is a static
plate display.

The intentional minimalism is part of the aesthetic. The
hero is kinetic (rotating sun rays, palms cycle, mower
vibration). The field log is kinetic (path draw-in, stamp
slam). The schedule is kinetic (mower idle). The specimen
plate is the **stationary** section — the museum exhibit
where the visitor pauses and reads.

## Rejected alternatives (to document the decision)

1. **Curtis-style watercolor plates (full color, ideal
   composition).** Rejected: turf grasses don't have
   ornamental flowers; the visitor would be confused by a
   flower they don't see in their yard. Herbarium sheet is
   more honest and more useful.
2. **Single-page Audubon-style full spread (1 specimen
   dominates, 3 in margin).** Rejected: too much visual
   weight for one section; doesn't fit the page rhythm of
   ~1 viewport-height per section.
3. **Real photographs of pressed specimens.** Rejected:
   requires photo capture, the page already uses
   hand-authored SVG (D-0049 lesson: painted VEO + hand-
   authored cartoon, never mixed in the same shot). Real
   photos would introduce a new register the page doesn't
   have.
4. **Generic "lawn care tips" 4-tip grid.** Rejected: not
   daring, not a museum artifact, doesn't elevate the
   brand. "Lawn care tips" is a category every competitor
   has; "turf grass specimen plate of Pinellas County" is
   not.
5. **Photo-realistic AI-generated grass.** Rejected:
   D-0049/0055/0052 lesson — AI-generated images don't
   match the page's hand-drawn register. A precise hand-
   authored SVG of a pressed grass clump reads as
   "intentional, made by a person who knows plants."

## Implementation plan (4 commits, reversible)

1. **Commit 1** — `feat(specimens): D-0057 Phase 1 — hand-author 4 turf grass specimen SVGs`
   - 4 standalone SVG files in `apps/web/src/assets/specimens/`
   - Each is 340×340 viewBox, sepia outline + olive fill
   - No React yet — just the assets
2. **Commit 2** — `feat(specimen-plate): D-0057 Phase 2 — SpecimenPlate section TSX + CSS`
   - `apps/web/src/components/sections/SpecimenPlate.tsx`
   - `apps/web/src/components/sections/SpecimenPlate.module.css`
   - 2×2 grid + hover reveal + closing line
   - Export from `index.ts`
3. **Commit 3** — `feat(page): D-0057 Phase 3 — insert SpecimenPlate between ServiceBento and PricingTiers`
   - Update `apps/web/src/app/page.tsx`
4. **Commit 4** — `docs(specimen-plate): D-0057 ADR + ledger entry`
   - `governance/decisions/0057-specimen-plate-section.md`
   - Update `state/ledger.yaml`

Each commit is independently revertable. If the steward
dislikes the aesthetic, each commit can be reverted in
isolation without affecting the others.

## Acceptance criteria

- 4 hand-authored SVG specimens, each visually distinct
  (St. Augustine, Bermuda, Zoysia, Bahia) with the species'
  actual diagnostic features (blade width, tip shape,
  seedhead type, growth habit)
- Section renders at one viewport height on desktop,
  ~2.5 viewport heights on mobile (single column stack)
- Hover/focus reveal works on each plate
- All 5 animations collapse to identity under
  `prefers-reduced-motion: reduce`
- Visual captures: 4 desktop (different scroll positions),
  2 mobile (top + bottom), 1 hover state
- TypeScript: `tsc --noEmit` passes
- No regression to existing sections (visual cross-check
  with previous captures)

## References

- Curtis's Botanical Magazine (1787–) — visual reference for
  the *register* of botanical plates, even though the
  aesthetic is the herbarium sheet style, not the
  Curtis-color-plate style
- Florida Museum of Natural History Herbarium specimen
  preparation guide (https://www.floridamuseum.ufl.edu/herbarium/methods/specimen-preparation-guide/)
- Western Australian Herbarium Vascular Specimen Mounting
  Guidelines
- UF/IFAS Turfgrass Identification Infographic
  (https://sfyl.ifas.ufl.edu/duval/horticulture/commercial-hort-pdf/Turfgrass-Identitfication-Digital.pdf)
- Vintage herbarium sheets in
  `apps/web/audit/d-0057-research/` (curated reference
  images for the sepia/olive palette)
