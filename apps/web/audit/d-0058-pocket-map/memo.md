# D-0058 — Pocket Map section: design brief

**Status:** Design phase
**Date:** 2026-07-21
**Author:** Mavis
**Reviewer:** Steward
**Related:** D-0047 (Six-ZIP service area), D-0049 (style-mismatch lesson), D-0055 (FieldLog editorial voice), D-0057 (SpecimenPlate register, sepia palette)

---

## The dare

The page's existing visual registers:
1. **Folk-cartoon** (D-0049, D-0050, D-0055) — hero, FieldLog route, stamps
2. **Painted VEO** (D-0049, D-0053) — hero scene 2, OperatorStrip ambient palms
3. **Pressed-herbarium botanical** (D-0057) — SpecimenPlate

D-0058 adds the page's **FOURTH visual register**: a **vintage
illustrated pocket map** in the 1920s WPA national park / pictorial
map tradition. The map shows the operator's actual service area
(Pinellas County, FL) with REAL geography — the boundary is fetched
from OpenStreetMap (relation 1210726), not hand-drawn.

This is daring because:
- The boundary is **real data** (392-point OSM polygon, projected to
  SVG via equirectangular projection), not hand-drawn
- The aesthetic is a **specific historical register** (1920s-30s
  WPA pictorial map — sepia line art, faded earth tones, hand-
  lettered labels, compass rose, scale bar, decorative border)
- It introduces the page's first **CARTOGRAPHIC** element (everything
  else is illustration or photography)
- The operator's home base (33771) is marked with a **sun-yellow
  star + clay dot** — the same sun-yellow that the FieldLog uses
  for "today's location" and the schedule uses for the day-of-week
  accent. The color carries across sections.

## The research (real data, not invented)

**Boundary data:** OpenStreetMap relation 1210726 (Pinellas County,
Florida), fetched via the Overpass API endpoint
`polygons.openstreetmap.fr/get_geojson.py?id=1210726&params=0`. The
returned GeoJSON is a MultiPolygon with 392 vertices on the outer
ring, accurately representing the hook-shaped Pinellas peninsula +
the wide mainland north of it.

**Why use real OSM data, not hand-draw:** Per the project's memory
("Geographic features (maps, coastlines, anything with a specific
real-world shape) — do NOT use SDXL. SDXL has no strong
representation of "Pinellas County shape" or "Tampa Bay coastline"
in its training data; the model will improvise a plausible-looking
but geographically wrong silhouette. **Use real OpenStreetMap
data exports rendered as line-art, not hand-drawn approximations**
— the D-0024 hand-authored Pinellas SVG was also rejected by the
steward ("not coherent enough to meet acceptance criteria")."). I
used real OSM data, not hand-drawing.

**ZIP centroids (the 6 service ZIPs):** From the operator's actual
service area (defined in the project: 33771, 33770, 33773, 33774,
33778, 33756). Coordinates are approximate city-center lat/lon from
the USPS ZIP database.

**Landmarks (7):** Honeymoon Island, Caladesi Island (state parks,
north); Clearwater Beach, Indian Rocks Beach, Treasure Island (Gulf
beaches); St. Petersburg, Tampa (the two main cities on either side
of Tampa Bay). These are the recognizable Pinellas landmarks anyone
in the area would know.

**Vintage map conventions (the aesthetic):**
- **WPA national park poster style (1930s-40s):** yellowed paper
  texture, ink-loss/print imperfection, wonky bold type centered,
  seal/logo in title, north arrow as a feature, vectory paint-by-
  numbers with handful of colors
- **Pictorial maps (1920s-50s):** bird's-eye illustrations of
  landmarks, plants, animals; compass roses; elaborate cartouches;
  decorative borders; Art Deco influence
- **Surveyor maps (1850s-1900s):** stipple shading, engraved
  hatching, formal cartouches, faded earth tones

For the GRASS page, the **WPA + pictorial** blend is the right
model: yellowed paper + sepia coastlines + decorative compass
rose + hand-lettered labels + small illustrated landmarks (a
compass-rose icon for Clearwater Beach, a palm-tree icon for
Honeymoon Island).

## The map design

A 700×1000 portrait pocket map (the right shape for a real pocket
map, since the Pinellas peninsula is taller than wide). Components:

- **Aged paper background** (radial gradient from #f4e8d0 center
  to #d8c89a edges — the yellowed paper of a vintage map)
- **Decorative double-rule border** (art-deco / WPA convention)
- **Title cartouche** at top: "POCKET MAP · NO. 06" (eyebrow) +
  "The Operator's Service Area" (H2, italic Fraunces) +
  "PINELLAS COUNTY · FLORIDA" (subhead)
- **Water labels:** "GULF OF MEXICO" (rotated -90° on the west
  side) + "TAMPA BAY" (rotated +90° on the east side), in faded
  sepia italic Georgia
- **The Pinellas peninsula** (real OSM boundary, 392 points
  projected) filled with a faded olive land-wash, stroked in
  sepia 1.4px
- **6 ZIP markers** (small house icons in cream + sepia outline)
- **1 operator's home base** at 33771 (sun-yellow 5-point star
  with a clay dot in the center — matches the FieldLog's truck
  marker and the SpecimenPlate's stamp)
- **7 landmarks** in faded sepia (small icons: beach = wave
  circle, island = olive ellipse, city = filled square)
- **Compass rose** at bottom-left: 8-point star, sepia + clay,
  decorative (the WPA "north arrow as a feature" convention)
- **Scale bar** at bottom-right: black-and-cream alternating
  segments, "SCALE OF MILES" label
- **Legend** at bottom-right: lists all 6 ZIPs + the operator's
  home base marker, in a small aged-paper frame
- **Footer:** "Surveyed & mowed · Largo FL · 2026-07-21" (small
  italic, the vintage "surveyed by..." convention)

## Section copy

- **Eyebrow:** `POCKET MAP · 06 · THE TERRITORY`
- **H2:** `Six ZIPs, one operator, no franchises.`
- **Subhead:** "This isn't a regional chain. The map is the map.
  33771 is the truck, the trailer, the walk-behind, and the same
  guy every Tuesday. The star is the home base — the route
  radiates from there. Six ZIPs, one operator, one truck, one
  walk-behind, one edger, one trimmer. The whole thing fits in
  the bed of a pickup."
- **Closing line:** "If you're inside the line, you're on the
  route. If you're outside, you're outside — and I'll tell you
  that, too."

The closing line is the brand-true kicker. It commits to the
geography as a literal boundary: the operator serves the 6 ZIPs
in the legend and nothing else. Visitors who are outside the
service area will be told so. That's the "no franchises" promise.

## Palette additions (the "pocket map" register)

The map adds a **fourth palette register** to the page, alongside
the existing cream + sun-yellow + palm-bark + clay (page brand) +
the aged-paper + sepia + olive + faded-red (D-0057 specimens). For
the pocket map:

- `#f4e8d0` (warm paper center) and `#d8c89a` (yellowed edges) —
  the radial gradient that reads as "aged map paper"
- `#b8c8d0` (faded water) — the blue-grey of an old map's water
  wash
- `#d4d0a0` (land wash) and `#c4be8a` (deeper land) — the olive
  land tones that don't compete with the page's existing greens

These are defined inline in the SVG (no new CSS tokens), since the
map is a self-contained artifact.

## Placement in page composition

**Between `<OperatorStrip />` (3) and `<FieldLog />` (3.5).** The
narrative flow becomes:

1. Hero (3 scenes)
2. ServiceAreaMap (coverage check — FUNCTIONAL)
3. OperatorStrip (operator bio)
4. **PocketMap** (D-0058, EDITORIAL — the territory) ← NEW
5. FieldLog (D-0055, EDITORIAL — the route + voice)
6. ServiceBento
7. SpecimenPlate (D-0057)
8. PricingTiers
9. ProcessSteps
10. ScheduleTimeline
11. FAQAccordion
12. FinalCTABanner

This placement fills the "where" gap in the narrative: the visitor
sees the operator (OperatorStrip) → where the operator works
(PocketMap) → what the operator sees (FieldLog). A clean
who → where → what progression.

The functional ServiceAreaMap (position 2) is a different artifact
(it's the FUNCTIONAL coverage check, with the ZIP input + result
panel) and the PocketMap is the EDITORIAL map (no input, just a
beautiful artifact). They're 2 sections apart, so the visitor
won't confuse them.

## Rejected alternatives (to document the decision)

1. **Curtis-style colored pictorial map (full color, ideal
   geography).** Rejected: same reason as D-0057's Curtis vs
   herbarium choice — full color would clash with the page's
   existing palette, and turf grass-style precision doesn't fit
   a colorful map.
2. **Modern Google Maps screenshot.** Rejected: not daring, not a
   museum artifact, doesn't elevate the brand. Every competitor
   has a Google Maps embed; this would be a regression.
3. **Hand-drawn Pinellas boundary.** Rejected: per the memory, the
   D-0024 hand-authored Pinellas SVG was rejected ("not coherent
   enough"). Real OSM data is the only acceptable source for
   geographic accuracy.
4. **3D / 360° / WebGL map.** Rejected: not a "vintage" register,
   and the page already has a Three.js experiment in the hero
   (D-0048, reverted per D-0049). Adding another 3D element would
   re-litigate the same ground.
5. **Just a static SVG without the real boundary.** Rejected: would
   look like a "vintage map aesthetic" but the visitor would
   notice the shape doesn't match reality. Real data is the
   differentiator.

## Acceptance criteria

- Real Pinellas boundary (from OSM), projected to SVG
- 6 ZIP markers in the actual service area (clustered in central-
  west Pinellas)
- 1 operator's home base at 33771 (sun-yellow star + clay dot)
- 7 landmarks in faded sepia
- Compass rose, scale bar, legend, title cartouche
- All section copy in the operator's voice (first-person, falsifiable)
- Visual captures: 4 desktop (different scroll positions), 2 mobile
- TypeScript: `tsc --noEmit` passes
- No regression to existing sections (visual cross-check with
  previous captures)

## References

- OpenStreetMap relation 1210726 (Pinellas County, Florida)
- polygons.openstreetmap.fr (GeoJSON boundary export)
- USPS ZIP database (ZIP centroids)
- WPA national park poster style (1930s-40s)
- Pictorial maps (1920s-50s, George Glazer Gallery reference)
- Florida Yard Care Authority: Pinellas County turf grass + ZIP
  mapping data
