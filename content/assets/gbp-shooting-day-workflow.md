# GBP Photo Shooting Day — Workflow

> **Goal:** Get 5 GBP-ready photos (cover + 3 work + 1 before/after) from a
> single yard visit, in 20-30 minutes, with zero Canva work afterward.

This is the operational workflow for `scripts/gbp-photo-process.py`. The
script is the technical side; this doc is the on-the-yard side.

---

## Before you leave the truck

1. **Charge your phone** — a dead phone mid-shoot kills the session.
2. **Wipe the lens** — phone-camera smudges ruin close-up edge shots.
3. **Open a notes app** — you'll want to type the captions BEFORE the
   shoot so you can write them on a chalkboard/paper/phone screen in
   the photo.

**Pre-type the captions you'll need (one per photo):**

For most yards, you'll get these 4-5 captions from the script's
auto-suggest (just call the script on a dummy filename to see them):

```bash
# What caption would the script suggest for each photo type?
python scripts/gbp-photo-process.py dummy.jpg --type edging --zip 33771
python scripts/gbp-photo-process.py dummy.jpg --type before-after --zip 33771
python scripts/gbp-photo-process.py dummy.jpg --type mulching --zip 33774
python scripts/gbp-photo-process.py dummy.jpg --type mowing --zip 33771
```

Scribble each suggested caption on a piece of paper (or save as a
screenshot on your phone) so you can prop it in the photo.

---

## At the yard — the 5-shot sequence

The script is named for the photo TYPE, not the order you shoot. Do
them in whatever order works at the site. The 5 priority shots:

### 1. Cover photo (1024×576 landscape) — 1 shot

**What:** Wide establishing shot from the curb. Lawn in the middle, house
in the background, crisp edges visible in the foreground.

**How to prop the caption:** Most cover photos have no caption. If
you want to identify the location, hold a small paper reading
"33771" in the corner of the frame.

```bash
python scripts/gbp-photo-process.py IMG_xxxx.jpg --type cover --zip 33771
```

### 2. Before/after pair (720×540) — 2 shots, taken at the same angle

**What:** Same exact angle, before you start AND after you finish. The
"before" should look obviously bad (overgrown edges, clippings on
the lawn). The "after" should look obviously clean.

**Critical:** Don't move between the two shots. Mark your feet with
a piece of tape if you have to.

**Caption prop:** Hold a paper reading "Before & After — 33771 — Largo
Lawn" in the BOTTOM-LEFT corner of the frame (not the bottom band —
the spec keeps the caption out of the image so Google doesn't read it
as text-on-image, which they penalize for accessibility).

```bash
python scripts/gbp-photo-process.py IMG_before.jpg --type before-after --zip 33771
python scripts/gbp-photo-process.py IMG_after.jpg --type before-after --zip 33771
# The script outputs two files: before-after-33771-DATE.jpg and
# before-after-33771-DATE.jpg. Combine them in Canva (or your phone's
# built-in editor) into a side-by-side before-after composite. Save as
# `before-after-composite-33771-DATE.jpg`. Upload that.
```

### 3. Edge detail (720×540) — 1 shot

**What:** Knee-height shot, sharp focus on the curb-meeting-grass
edge line. Take 5-10 shots and pick the one with the sharpest edge.

**Caption prop:** Small paper reading "Mechanical Edging — 33771 —
Largo Lawn" at the edge of the frame.

```bash
python scripts/gbp-photo-process.py IMG_xxxx.jpg --type edging --zip 33771
```

### 4. Service-in-action (720×540) — 1 shot

**What:** You, mid-work, doing the thing the photo is about. For an
edging job, that's you holding the edger. For a mowing job, that's
you walking behind the mower. For a mulch job, that's you raking
mulch into the bed.

**Critical:** Don't include any visible client property in the
background (privacy). The camera should be facing YOU, with the
lawn / curb / yard in the foreground.

**Caption prop:** Skip the paper here — your work clothes + visible
equipment IS the caption. The script will print an empty caption.

```bash
python scripts/gbp-photo-process.py IMG_xxxx.jpg --type mowing --zip 33771
```

### 5. After shot wide (720×540) — 1 shot

**What:** Same angle as the cover photo, but tighter (knees-up
height). Shows the clean result of the work. This is the photo that
ends up being the most-shared because it's the visual payoff.

**Caption prop:** Skip the paper — the visual speaks.

```bash
python scripts/gbp-photo-process.py IMG_xxxx.jpg --type work --zip 33771
```

---

## Filename conventions (auto-suggest depends on this)

The script reads the source filename for tokens. Use this pattern
when you AirDrop / import the photos from your phone:

```
edging-33771.jpg
mowing-33771.jpg
mulch-3yd-33774.jpg     (the 3 cubic yards is parsed from "3yd")
hedge-8ft-33770.jpg      (the 8 feet is parsed from "8ft")
prep-Milton-33773.jpg    (the storm name is parsed, case-preserved)
before-33771.jpg
after-33771.jpg
ba-33771.jpg             (shorthand for before/after)
```

The script will auto-suggest the caption from these tokens. If you
shoot at multiple ZIPs in one session, include the ZIP in the
filename — saves you typing `--zip` on every command.

---

## What the script does NOT do

The script is intentionally minimal. It does NOT:

- Add a caption overlay to the photo (you burn the caption in at
  capture time per the 2026-07-24 design decision — no font
  dependency, no brand-color matching, no accessibility penalty
  from text-on-image)
- Auto-enhance brightness / contrast / white balance (your phone
  does this; trust the JPG)
- Compress further than the 92% JPEG quality (GBP accepts up to
  ~250KB per photo; the script output is well under that)
- Combine before/after into a composite (the before and after
  JPGs are output separately; you combine them in your phone's
  built-in photo editor — takes 30 seconds)
- Generate the avatar (that's the `avatar` subcommand, run once)

---

## Run-the-script output

The script prints:

1. **The suggested caption** (so you can pre-write it on paper)
2. **The source / target / cropped dimensions** (so you can sanity
   check the smart-crop didn't cut off the subject)
3. **The output filename** (default:
   `apps/web/public/work/<type>-<zip>-<date>.jpg`)

After processing, the files are immediately ready to upload to the
GBP dashboard. No post-processing needed.

---

## The avatar (one-time, not per-shoot)

The Profile photo (the small round avatar on every GBP listing) is
generated separately:

```bash
python scripts/gbp-photo-process.py avatar
# writes apps/web/public/work/avatar-720x720.png
```

This is a hand-drawn 3-blade grass mark on the brand cream
background. Re-run only if you rebrand. The avatar is also in
`brand/logo-mark.svg` for the website, but the GBP version is
PNG-only (Google doesn't render SVG in the avatar slot).

---

## Storage and backups

- All processed photos: `apps/web/public/work/`
- Originals: keep on your phone for 30 days, then back up to
  Google Drive monthly
- The script output is the upload-ready asset; the originals are
  for re-processing if you ever change the script (e.g., switch
  to a different blend mode or output format)
