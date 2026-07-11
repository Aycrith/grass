# PRD-05 — Photography and Illustration Brief

**Purpose:** Define exactly what visual assets the Largo Lawn web app
needs, the spec for each, and the photography direction.

**Audience:** Steward (asset procurement) + engineer (placement)

---

## 1. Asset list

Total: ~30 unique assets. Breakdown:

| Category | Count | Format | Source |
|---|---|---|---|
| Operator portrait | 1 | 800×1000 webp | Steward phone camera |
| Truck photo | 1 | 1600×900 webp | Steward phone camera |
| Equipment (×4) | 4 | 800×600 webp | Steward phone camera |
| Hero image (homepage) | 1 + mobile crop | 2400×1200 / 1200×1500 webp | Steward phone camera |
| Service hero (×6) | 6 | 1600×900 webp | Steward phone camera |
| Area hero (×6) | 6 | 1600×900 webp | Steward phone camera |
| Work samples (yards) | 8-10 | 800×1000 webp | Steward phone camera |
| Before/after pairs | 4 | 1600×900 webp | Steward phone camera |
| Logo / brand mark | existing | SVG | Already exists |
| Custom icons | 6-8 | 24×24 SVG | Engineer or designer |
| Illustrations (empty states) | 3-4 | 600×400 SVG | Designer or AI-assisted |
| Favicon / app icon | 1 | multi-size | Existing brand mark |

## 2. Photography direction

### Subject
**Real yards. Real mower. Real sun.** No stock photography, no AI
people, no "smiling family in front of lawn" tropes.

### Equipment
The steward (you) takes photos with their phone. **No photographer
budget.** Suggested gear:
- Phone with portrait mode (any iPhone 11+ or equivalent)
- Optional: small phone tripod ($15) for self-portrait and operator
  shot

### Settings
- **Time of day:** golden hour (first/last hour of sun) or overcast
- **Avoid:** harsh midday sun (creates unflattering shadows)
- **Weather:** post-rain grass looks greener; clear day for action shots
- **Composition:** rule of thirds; yard fills bottom 2/3, sky or trees
  top 1/3; mower visible somewhere

### Color treatment
- **No filters.** Native camera colors only.
- **Consistent warm tone:** golden hour gives this naturally
- **Avoid:** heavy saturation boost, desaturated "moody" presets

### Composition checklist per shot
- ✓ Sharp focus on the main subject (mower, yard, person)
- ✓ Brightness matches other shots (consistency)
- ✓ No visible lawn equipment from competitors in background
- ✓ Real homes in background (not empty lots)
- ✓ Trash cans / toys / garden hoses visible (sells "real homes")
- ✓ Sky visible (Florida blue, not blown-out white)

## 3. Specific shot lists

### Operator portrait
- Standing in front of truck or on a yard
- Hands at sides or holding mower handle (action)
- Slight smile, looking at camera
- Golden hour or overcast
- Wearing work clothes (t-shirt, work pants, hat optional)
- Alt text: brief description + zip code ("Operator standing in front of green pickup truck, 33771")

### Truck photo
- Parked on a street in service area (named street visible)
- Side profile, full vehicle in frame
- Door visible with optional logo decal (post-launch)
- Golden hour
- Alt text: "Green pickup truck parked on residential street in Largo FL"

### Equipment (4 shots)
- Mower on cut grass, close-up of deck
- Edger against curb with clean edge visible
- Trimmer held at side
- Blower in action, debris visible
- Each: bright, sharp, action-oriented

### Hero (homepage)
- **Composition:** yard in foreground, mower mid-frame, blue sky upper third, palm tree or oak visible
- **Aspect:** 2400×1200 (2:1 landscape) for desktop, 1200×1500 (4:5 portrait) for mobile
- **Cropping:** mobile version is the right third of the desktop version (rule of thirds)

### Service hero (6)
Each service needs a hero photo:

| Service | Composition |
|---|---|
| Mowing | Mid-mow, stripes visible, mower in frame |
| Edging | Close-up of clean edge against curb |
| Mulching | Wheelbarrow + mulch pile, brown rich texture |
| Hedge trimming | Hedge in foreground, trimmer in action |
| Hurricane prep | Yard with secured items, blue sky, ready |
| Seasonal cleanup | Leaves being blown or piled, autumn color if possible |

### Area hero (6)
Each ZIP needs a signature photo:

| ZIP | Composition |
|---|---|
| 33771 | Central Largo street, residential |
| 33770 | Belleair Bluffs, near water visible |
| 33773 | East Largo, newer subdivision |
| 33774 | Ridgecrest, elevated terrain / oaks |
| 33778 | Seminole border, coastal feel |
| 33756 | Belleair / Clearwater, mature landscaping |

**Tip:** Steward can photograph these by simply driving through the ZIP
once with the phone out the window. No appointment needed.

### Work samples (8-10)
- Each photo: a finished yard, post-mow
- Variety of lot sizes (small / medium / large)
- Different grass types visible (St. Augustine, Bahia, Zoysia)
- Different times of year (one winter, one summer)
- Caption: lot size + ZIP + date (optional)

### Before/after pairs (4)
- Same yard, two photos: overgrown and post-mow
- Side-by-side or stacked
- Strong visual contrast
- Use for: homepage, `/services/mowing`, social media

## 4. File organization

```
apps/web/public/
  operator/
    portrait.webp
  truck/
    side.webp
  equipment/
    mower.webp
    edger.webp
    trimmer.webp
    blower.webp
  hero/
    desktop.webp      /* 2400×1200 */
    mobile.webp       /* 1200×1500 */
  services/
    mowing.webp
    edging.webp
    mulching.webp
    hedge-trimming.webp
    hurricane-prep.webp
    seasonal-cleanup.webp
  areas/
    33771.webp
    33770.webp
    33773.webp
    33774.webp
    33778.webp
    33756.webp
  work/
    yard-001.webp ... yard-010.webp
    before-after-001.webp ... before-after-004.webp
```

## 5. Compression and format

- **Format:** `.webp` for photographs (smaller than jpg at same quality)
- **Quality:** 80% (visually lossless, ~30% smaller than quality 95)
- **Max size per asset:** 300 KB
- **Compression tool:** `cwebp -q 80 input.jpg -o output.webp` or
  Squoosh.app for one-off conversions

## 6. Alt text

Every image requires alt text. Stored in `lib/content.ts`, not in
filename.

**Rules:**
- Describe what's in the image, not what it represents
- Include location context (ZIP, street name) where relevant
- Don't start with "image of" or "photo of"
- Keep under 125 characters

**Examples:**
- ✓ "Green pickup truck parked on residential street in 33771"
- ✓ "Operator standing in front of freshly mowed lawn with mower visible"
- ✗ "Image of our truck" (vague)
- ✗ "Beautiful lawn we mowed" (marketing speak, not descriptive)

## 7. Custom icons (need to author)

These don't exist in Lucide and need custom SVGs:

| Icon | Subject | Used in |
|---|---|---|
| Lawn mower | Front view, simplified | Services nav, empty states |
| Edger | Close-up of blade on curb | Services nav |
| Mulch pile | Wheelbarrow with mulch | Services nav |
| Hedge trimmer | Trim against hedge | Services nav |
| Hurricane cone | Spiral / path | Hurricane prep section |
| Yard sign | Sign in front of house | Quote CTA |
| Yard map pin | Pin with grass blade | Service areas map |
| Storm recovery | Branch + debris | Storm cleanup CTA |

**Style:** 24×24 viewBox, 1.5px stroke, `currentColor` fill, rounded
line caps. Lucide aesthetic.

## 8. Illustrations

### Empty states (3-4)

When the steward has zero testimonials / zero work photos, the page
should not feel empty — it should feel honest.

| Empty state | Illustration |
|---|---|
| No testimonials yet | Hand-drawn yard with "Be the first to review" text |
| No work photos yet | Stylized grass blade + "Photos coming soon" |
| No service area coverage | Map pin with "Coming to your ZIP soon?" |
| Search no results | Garden hose curled into question mark |

**Style:** flat geometric, limited palette (use brand tokens), no
people, no faces.

**Authoring:** Engineer can write these inline as SVG. No designer
required for v1.

## 9. Anti-patterns (do NOT use)

- ❌ Stock photos of "smiling family in front of perfect lawn"
- ❌ Generic green grass texture tiles
- ❌ Tropical kitsch: palm tree silhouettes, flamingos, sunsets
- ❌ Lawn equipment cutouts on white backgrounds
- ❌ AI-generated people (uncanny, gets worse every month)
- ❌ Lorem ipsum image placeholders visible to users
- ❌ Watermarked stock photos
- ❌ Blurry phone shots taken in haste (worst offender: random photo
  with thumb visible)

## 10. Verification

- Every photo referenced in `lib/content.ts` exists at the path
- Every photo has alt text (CI check)
- Every photo is < 300 KB (CI check, fails build if oversized)
- All photos load with explicit width/height (no CLS)
- Hero image is preloaded (`<link rel="preload">`)

## 11. What this PRD does NOT cover

- Video content (out of scope for v1)
- Drone photography (out of scope)
- Custom font character sets (deferred)
- Brand mascot / illustration character (deferred)