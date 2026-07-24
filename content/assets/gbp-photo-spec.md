# GBP Photo Spec — Cover, Profile, Work, Team

> **Why photos matter:** GBP listings WITH photos get 35% more clicks and 42% more direction requests than listings without.
> **Format:** JPG, 720px × 720px minimum (square crops better in GBP).
> **Free tool:** Phone camera + Canva free for text overlays.
> **Automated pipeline:** `scripts/gbp-photo-process.py` (added 2026-07-24) generates the avatar and processes phone photos into GBP-ready JPGs in one command. See `content/assets/gbp-shooting-day-workflow.md` for the operational workflow. **The spec below is the design contract; the script is the implementation.**

---

## Photo 1 — GBP Cover (the wide banner)

**Dimensions:** 1024 × 576 px (Google's preferred cover aspect).
**Use:** First impression on GBP profile page. Sets the entire brand tone.

```
[Spec]
Subject: A freshly-mowed lawn in Largo, FL. Bright daylight. Crisp edges.
        Visible house in background (owner gave permission).
        Optional: small "YOUR NEIGHBOR'S LAWN MOWER" overlay in ll-green.

Composition: Foreground = edge detail. Middle = grass. Background = house.
Time of day: 9-10 AM (warm but not harsh).
Season: Spring (March-May) shows healthy green growth.
```

**How to shoot:**
1. Find a yard you just finished.
2. Stand at the curb. Aim across the yard toward the house.
3. Frame so the foreground shows edge detail, middle shows grass texture, background shows house.
4. Take 10 shots. Pick the one with best light.

**Why it works:** Owner of GBP is in 33771. Sees lawn in 33771. "This is what my yard could look like." Self-recognition → click.

---

## Photo 2 — GBP Profile (square avatar)

**Dimensions:** 250 × 250 px minimum, 720 × 720 px preferred.
**Use:** Round crop in GBP listings, citations, reviews.

```
[Spec]
Subject: Largo Lawn logo-mark on solid ll-cream background.
No text overlay. Just the mark.

Source: brand/logo-mark.svg, exported to PNG at 720×720.
```

**Why:** Brand consistency across GBP, citations, social, business cards. Recognition builds trust.

---

## Photo 3 — Work photo #1 (before/after pair)

**Dimensions:** 720 × 540 px (4:3 ratio, GBP standard).
**Use:** GBP photo gallery. Posted monthly.

```
[Spec]
Subject: A before-and-after split image.
  LEFT: Photo of the yard "before" (overgrown, edges ragged).
  RIGHT: Same angle "after" (mowed, edged, blown).

How: Take 2 photos from the same position. Canva → split-screen side-by-side.
     Caption overlay bottom-right: "Before & After — 33773 — Largo Lawn"
```

---

## Photo 4 — Work photo #2 (service detail)

**Dimensions:** 720 × 540 px.
**Use:** GBP gallery, citations, social posts.

```
[Spec]
Subject: Close-up of crisp edge detail (curb meeting grass).
  Tight crop. Sharp focus on the edge line.
  Caption overlay: "Mechanical Edging — 33771 — Largo Lawn"
```

---

## Photo 5 — Work photo #3 (mulch installation)

**Dimensions:** 720 × 540 px.

```
[Spec]
Subject: Fresh mulch install mid-job or just-finished.
  Visible: dark mulch, defined bed edges, contrast against grass.
  Caption: "Mulch Install — 2 cubic yards — 33774"
```

---

## Photo 6 — Work photo #4 (hedge trim)

**Dimensions:** 720 × 540 px.

```
[Spec]
Subject: A freshly trimmed hedge, natural shape.
  Visible: clean cut lines, debris already cleaned up.
  Caption: "Hedge Trim — 8 ft height — 33770"
```

---

## Photo 7 — Work photo #5 (hurricane prep)

**Dimensions:** 720 × 540 px.

```
[Spec]
Subject: Pre-storm yard prep (secured items, vulnerable branches removed).
  Visible: tidy yard, items staged, weather still clear.
  Caption: "Pre-Storm Prep — [Storm Name] — 33773"
```

---

## Photo 8 — Work photo #6 (equipment detail)

**Dimensions:** 720 × 540 px.

```
[Spec]
Subject: The work truck or trailer, organized and clean.
  Visible: branded sign if you have one, organized tools, mower visible.
  Caption: "[optional — only if truck looks genuinely professional]"
```

---

## Photo 9 — Team photo (just you)

**Dimensions:** 720 × 720 px (square, since this is the "team" portrait).

```
[Spec]
Subject: You, in work clothes, smiling, holding a trimmer or standing next to a mower.
  Background: a yard you just finished (proof of work).
  No PPE required for this shot (this is marketing, not a safety video).

Caption: "[Your first name] — Founder, Largo Lawn"
```

**Why this works:** Most lawn-care GBP listings have no human face. You will. Trust = person + consistency.

---

## Photo 10 — Optional: Hurricane post-storm cleanup

**Dimensions:** 720 × 540 px.

```
[Spec]
Subject: Debris cleanup mid-job or pile of branches ready for haul-off.
  Visible: damage, but the yard is being restored.
  Caption: "Post-Storm Cleanup — 33771 — Largo Lawn"
```

---

## Photographic style guide

Per `brand/guidelines.md`:
- **Bright daylight** (no golden-hour moodiness, no harsh midday shadows).
- **Sharp focus on the work** (no motion blur; the grass should look like a carpet).
- **No filters** beyond basic brightness/contrast (white balance correct).
- **No stock photos** — every photo is a real yard you worked on.
- **Phone camera is fine.** Modern iPhone / Pixel is sharper than any DSLR you'll bring to a job site.

## Post-frequency

- **GBP Cover photo:** Once per season (4× per year).
- **Profile photo:** Once. Update only on rebrand.
- **Work photos:** 2-3 per month. Minimum 1 per week during growing season.
- **Team photo:** Once per year (or when you get new gear that changes your look).

## Storage

- All photos in `apps/web/public/work/` with descriptive filenames.
- Backed up to Google Drive monthly.
- Originals kept for 5 years (some before/after shots become valuable for ads 2 years out).