# D-0058 — Pocket Map section (vintage illustrated service area map of Pinellas County)

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Architecture + Engineering + Research
**Reviewer:** Steward
**Related:** D-0047 (Six-ZIP service area), D-0049 (style-mismatch lesson), D-0050 (per-ZIP strip), D-0055 (FieldLog editorial voice), D-0057 (SpecimenPlate register)

---

## Context

The 10-section GRASS landing page has three visual registers
established:

1. **Folk-cartoon (D-0049, D-0050, D-0055):** hero scene 1, FieldLog
   route houses, passport stamps, sun, operator
2. **Painted VEO brushwork (D-0049, D-0053):** hero scene 2
   background, OperatorStrip ambient palms, songbirds, ferns
3. **Pressed-herbarium botanical (D-0057):** 4 turf grass specimens

The page's narrative is solid — it shows the operator's bio, the
route, the plants. But it has a **geography gap**: the visitor
never sees the operator's actual territory — the spatial context
the route runs through.

D-0058 adds the page's **FOURTH visual register**: a **vintage
illustrated pocket map** in the 1920s-30s WPA national park /
pictorial map tradition. The map is a real cartographic artifact
showing the operator's actual service area in Pinellas County, FL,
with REAL OpenStreetMap boundary data (not hand-drawn).

## Decision

A new `<PocketMap />` section, placed **between `<OperatorStrip />`
(3) and `<FieldLog />` (3.5)**, that contains a vintage pocket
map of the operator's actual service area.

### 5 vertical zones (matching the SpecimenPlate pattern)

1. **Eyebrow:** "POCKET MAP · 06 · THE TERRITORY"
2. **H2:** "Six ZIPs, one operator, no franchises."
3. **Subhead:** "This isn't a regional chain. The map is the map.
   33771 is the truck, the trailer, the walk-behind, and the same
   guy every Tuesday. The star is the home base — the route
   radiates from there. Six ZIPs, one operator, one truck, one
   walk-behind, one edger, one trimmer. The whole thing fits in
   the bed of a pickup."
4. **Map:** the vintage pocket map (700×1000 SVG, displayed at
   max-width 480px on desktop)
5. **Closing line:** "If you're inside the line, you're on the
   route. If you're outside, you're outside — and I'll tell you
   that, too."

### The map's components

- **Real Pinellas boundary from OSM** (relation 1210726, 392
  points projected to SVG via equirectangular projection)
- **Aged paper radial gradient background** (the yellowed map
  paper of the 1920s-30s)
- **Decorative double-rule art-deco border**
- **Title cartouche** at top: "POCKET MAP · NO. 06" + "The
  Operator's Service Area" + "PINELLAS COUNTY · FLORIDA"
- **Water labels:** "GULF OF MEXICO" rotated -90° + "TAMPA BAY"
  rotated +90°
- **6 ZIP markers** (cream + sepia house icons) at the actual
  positions of 33756, 33770, 33771, 33773, 33774, 33778
- **1 operator's home base at 33771** — sun-yellow 5-point star
  with a clay dot in the center (matches the FieldLog's truck
  marker + the SpecimenPlate's stamp color vocabulary)
- **7 landmarks** in faded sepia (Honeymoon Island, Caladesi
  Island, Clearwater Beach, Indian Rocks Beach, Treasure Island,
  St. Petersburg, Tampa)
- **Compass rose** (8-point star, sepia + clay) at bottom-left
- **Scale bar** ("SCALE OF MILES", 0-5-10 alternating) at
  bottom-right
- **Legend** listing all 6 ZIPs + the operator's home base marker
- **Footer:** "Surveyed & mowed · Largo FL · 2026-07-21"

## Design rationale

### The fourth visual register (the dare)

The page's existing three registers are: friendly folk-cartoon,
atmospheric painted VEO, and precise pressed-herbarium botanical.
The pocket map adds a **cartographic** register — the first
SECTION on the page that uses the language of maps (not
illustrations or photography).

The aesthetic is the **1920s-30s WPA / pictorial map** blend:
- Yellowed paper background (radial gradient)
- Sepia line art for the boundary + chrome
- Hand-lettered labels (Georgia serif, italic for water)
- Compass rose as a decorative feature (the WPA "north arrow as
  a feature" convention)
- Scale bar (the surveyor convention)
- Decorative border (art-deco)
- Faded earth-tone washes for land and water (no bright colors)

This register is **distinct** from the other three:
- Folk-cartoon = flat-fill, friendly, storybook
- Painted VEO = atmospheric, brushwork, environmental
- Pressed-herbarium = precise, scientific, sepia
- **Pocket map = cartographic, hand-lettered, vintage**

The visitor who scrolls past the section sees a museum-quality
artifact: a real map of the operator's territory, with the
operator's home base marked with a sun-yellow star (the page's
color vocabulary from the FieldLog's "today's location" marker
and the SpecimenPlate's stamp).

### Why real OSM data, not hand-drawn

Per the project's memory:
> "Geographic features (maps, coastlines, anything with a
> specific real-world shape) — do NOT use SDXL. SDXL has no
> strong representation of 'Pinellas County shape' or 'Tampa Bay
> coastline' in its training data; the model will improvise a
> plausible-looking but geographically wrong silhouette. **Use
> real OpenStreetMap data exports rendered as line-art, not
> hand-drawn approximations** — the D-0024 hand-authored Pinellas
> SVG was also rejected by the steward ('not coherent enough to
> meet acceptance criteria'). Real OSM data + matplotlib + PIL
> frame composition produces the editorial poster style the user
> wants (see D-0025)."

I used the Overpass-style endpoint
`polygons.openstreetmap.fr/get_geojson.py?id=1210726&params=0` to
fetch the real Pinellas boundary. The returned GeoJSON is a
MultiPolygon with 392 vertices on the outer ring. The
projection is equirectangular (simple lat/lon → x/y) since the
Pinellas peninsula is small enough that projection distortion
is negligible.

This is the only acceptable source for geographic accuracy. The
steward has rejected hand-drawn Pinellas shapes before; I will
not re-litigate that decision.

### The 6 ZIPs and the operator's home base

The 6 ZIPs are the operator's actual service area (defined in the
project state: 33771, 33770, 33773, 33774, 33778, 33756). They
cluster in the central-west part of the Pinellas peninsula —
Largo, Belleair, Seminole. The map shows them in their actual
positions.

The **operator's home base is 33771** (Largo central). It's
marked with a sun-yellow 5-point star + clay dot — the same
sun-yellow the FieldLog uses for "today's location" and the
schedule uses for the day-of-week accent. This color
consistency across sections ties the page together.

### Why the legend, not labels on the map

With 6 ZIPs clustered in a 1-square-mile area of the peninsula,
labels on the map overlap. The vintage-map convention is to put
labels in a corner legend. I followed this convention: the map
shows just the icons (house for service ZIP, star for operator's
home base) and the legend lists each ZIP with its full name.
This is also the convention used in real pocket maps (the
USGS, Rand McNally, etc.).

The 7 landmarks (Honeymoon Island, Caladesi Island, etc.) are
labeled directly on the map because they're geographically
spread out and don't crowd.

## Layout in page composition

The section sits at position 3.5, between OperatorStrip (3) and
FieldLog (3.5). The narrative flow becomes:

- OperatorStrip: **who** the operator is (bio + equipment)
- **PocketMap (D-0058): where** the operator works (the territory)
- FieldLog: **what** the operator sees (the route + the editorial
  moment)
- ServiceBento: what we do (services grid)
- SpecimenPlate (D-0057): we know the plants (precision)
- PricingTiers: what it costs

The functional ServiceAreaMap at position 2 is a different
artifact (FUNCTIONAL coverage check, with the ZIP input + result
panel). The PocketMap is the EDITORIAL counterpart (no input,
just a beautiful artifact). They're 2 sections apart, so the
visitor won't confuse them.

## Reduced motion

All 3 entry animations are gated by `@media (prefers-reduced-
motion: reduce)`:
- header fade-up
- map fade-up (with delay 0.2s)
- closing line fade-up (with delay 0.5s)
- map hover transform

Under reduced-motion, all collapse to identity: the section is
a static pocket map display.

## Rejected alternatives (to document the decision)

1. **Curtis-style colored pictorial map (full color, ideal
   geography).** Rejected: same reason as D-0057's Curtis vs
   herbarium choice — full color would clash with the page's
   existing palette, and turf grass-style precision doesn't
   fit a colorful map.
2. **Modern Google Maps screenshot.** Rejected: not daring, not
   a museum artifact, doesn't elevate the brand. Every competitor
   has a Google Maps embed; this would be a regression.
3. **Hand-drawn Pinellas boundary.** Rejected: per the memory,
   the D-0024 hand-authored Pinellas SVG was rejected ("not
   coherent enough"). Real OSM data is the only acceptable
   source for geographic accuracy.
4. **3D / 360° / WebGL map.** Rejected: not a "vintage" register,
   and the page already has a Three.js experiment in the hero
   (D-0048, reverted per D-0049). Adding another 3D element
   would re-litigate the same ground.
5. **Just a static SVG without the real boundary.** Rejected:
   would look like a "vintage map aesthetic" but the visitor
   would notice the shape doesn't match reality. Real data is
   the differentiator.

## Verification

- TypeScript: `tsc --noEmit` passes (0 errors)
- Visual: `apps/web/audit/d-0058-pocket-map/pocket-map-desktop.png`
  shows the section in its final rendered state
- Cross-section: `pocket-map-context.png` shows the section in
  context with OperatorStrip above and the transition
- Hover: `pocket-map-hover.png` shows the -0.4deg rotate +
  translateY -2px + drop shadow deepening
- Mobile: `pocket-map-mobile.png` shows the section at 390px
  width (iPhone 14 Pro) with full-width map and left-aligned
  closing line
- Map itself: `pocket-map-v1.png` shows the rendered vintage
  map SVG in isolation

## Artifacts

- Commit 1 (map SVG): `eebedde feat(pocket-map): D-0058 Phase 1 — vintage illustrated pocket map SVG (real OSM data)`
- Commit 2 (section + page): `a594d1c feat(pocket-map): D-0058 Phases 2+3 — PocketMap section + page insertion`
- Map: `apps/web/public/maps/pinellas-pocket-map.svg` (19.5KB)
- Files: `apps/web/src/components/sections/PocketMap.{tsx,module.css}`
- Data: `apps/web/audit/d-0058-pocket-map/pinellas-boundary-raw.geojson` (raw OSM)
- Scripts: `project-boundary.mjs`, `build-map.mjs`, `render.mjs`, `capture.mjs`
- Design brief: `apps/web/audit/d-0058-pocket-map/memo.md` (10KB)
- Captures: `pocket-map-{desktop,context,hover,mobile}.png`
