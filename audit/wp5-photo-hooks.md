# v2 Photo Hooks — Steward Drop Guide (2026-07-12)

This document is the seam for the steward's future phone-photo drops. Every
WP0–WP5 webp is currently an SDXL+IPAdapter-generated abstract
illustration matching the brand palette (see
`apps/comfyui/prompts/_style-block.md`). The illustrations are honest about
their origin (visual sweep confirms each depicts what its alt says it does)
but they are not real photographs of the operator's actual yard or jobs.

v2 is the photoreal drop. Five hooks are pre-wired; this doc tells the
steward exactly what to photograph, where to drop it, and what code seams
the engineer needs to update post-drop.

---

## Hook 1 — Operator portrait

**Current state:** Stylized AI portrait. The IP-Adapter anchor
(`apps/comfyui/control/ip-style-ref.png`) is rendered from the original
`apps/web/public/operator/portrait.svg` — a man-in-hat-and-shoulder
abstraction, no facial features. Aspect ratio is 1:1. Path:
`apps/web/public/operator/portrait.webp` (sized ≤37 KB).

**v2 path:** Steward shoots a phone photo of themselves — operator only,
yard in the background, golden-hour side light for palette continuity.
Replace `apps/web/public/operator/portrait.webp` at the same path. No code
change required.

**Constraints:**

- **Update `operator.name = 'Operator'`** in
  `apps/web/src/lib/content.ts:18` to the operator's real first name.
  Currently the placeholder reads `'Operator'` literally.
- The alt at `OperatorStrip.tsx:42` reads `'Portrait of ${operator.name},
  Largo Lawn operator'` — it updates automatically.
- Color continuity: the warm-sage-palm-shadow palette (`--ll-sun`,
  `--ll-sage-muted`, `--ll-palm-shadow` per `_style-block.md`) should
  loosely anchor the photo so it doesn't fight the surrounding hero
  imagery. Steward shouldn't grade the photo aggressively — natural light
  in the yard is fine.
- Aspect ratio: render square or near-square (1248×1248 webp works for
  most phone snaps). If the photo doesn't crop nicely, the `<Image>`
  with `fill` will handle it.

**IP-Adapter anchor reference:** `apps/comfyui/control/ip-style-ref.png` —
keep within the same warm-pastel palette family.

---

## Hook 2 — Hero mobile independent composition

**Current state:** The mobile hero image is a vertical crop from the same
SDXL master as `desktop.webp`. Per
`apps/comfyui/scripts/convert-to-webp.mjs:38-53`, the mobile extract is
`{ width: 1200, height: 1496, left: 600, top: 0 }` from the 2400×1496 SDXL
master. This works but feels cramped on a 412px-wide phone because the
composition was framed for the 16:9 desktop master.

**v2 path (only if steward review decides the mobile crop is cramped):**
generate a separate mobile-first composition by:

1. Adding a mobile-specific composition section to
   `apps/comfyui/prompts/hero.md` — narrower-aspect, taller framing,
   foreground interest in the lower 1/3 of the frame.
2. Updating `apps/comfyui/workflows/hero-landscape.json` if the SDXL
   dimensions change (current: 1024×1024; the master is 2400×1496 after
   upscale).
3. Updating the SLUG_MAP hero entry in
   `apps/comfyui/scripts/convert-to-webp.mjs:38-53` to remove the
   `extract` step on the mobile entry — independently curated PNGs feed
   straight to webp without re-cropping.

If the steward is satisfied with the current vertical crop, do nothing —
this hook only fires on review decision.

**Constraints:**

- The `<picture><source media="(max-width: 900px)" srcSet="/hero/mobile.webp">`
  at `apps/web/src/components/sections/HeroCinematic.tsx:96` doesn't
  change.
- Alt at `HeroCinematic.tsx:99` stays hand-tuned to "Freshly mowed lawn
  in 33771 at golden hour" until steward proves a real-photo update
  needs different wording.

**IP-Adapter anchor reference:** `apps/comfyui/control/ip-style-ref.png` —
keep the warm sky + sage grass palette.

---

## Hook 3 — Real area photos (33771, 33770, 33773, 33774, 33778, 33756)

**Current state:** Six SDXL-generated abstract landscape webps at
`apps/web/public/areas/<zip>.webp`. These exist and are referenced via
the `services / areas` `imageSlot` registry in
`apps/web/src/lib/content.ts`, but **no component currently renders
them**. The `verify-references.mjs` script catches the unused-but-valid
slots; the references job in CI passes. The next-day
`apps/web/src/app/areas/[zip]/page.tsx` route renders NO `<Image>`
element.

**v2 path:** For each ZIP, steward shoots 1-2 phone photos of
representative lawns in that ZIP (cameron's neighbor's yard, a corner
park, a sample residential block). Replace `apps/web/public/areas/<zip>.webp`
at the same path.

**Constraints:**

- **The area detail page (`apps/web/src/app/areas/[zip]/page.tsx`)
  currently renders no `<Image>`.** When the steward drops real photos,
  the engineer also needs to add a consumer:
  ```tsx
  import Image from 'next/image';
  // In the area page component:
  <Image
    src={areasData[zip].imageSlot}
    alt={areasData[zip].imageAlt /* new field, see Hook 3.1 */}
    fill
    sizes="(max-width: 980px) 100vw, 50vw"
  />
  ```
  Plus a new `imageAlt: string` field on each area entry in
  `lib/content.ts:126-167` (parallel to the service `imageAlt` WP5
  work).
- Aspect ratio per the existing 800×480 abstract — for phone snaps,
  16:9 or 4:3 crops work without distortion.
- Quality budget ≤37 KB per file (matches the existing CI asset-weight
  guard at `apps/comfyui/scripts/check-weight.mjs`).

**IP-Adapter anchor reference:** `apps/comfyui/control/ip-style-ref.png`
— match the warm-sage palette.

---

## Hook 4 — Real service photos (6 services)

**Current state:** Six stylized illustrations rendered only via the
homepage `ServiceBento.tsx:113`. The `imageAlt` field on each
`lib/content.ts → services` entry was added in WP5 (engineer-curated
for the AI illustrations). The per-service detail page template
`apps/web/src/components/ServicePage.tsx` currently renders NO
`<Image>`.

**v2 path:** Steward captures each service at a representative job —
the first 1-2 of each (mowing, edging, mulching, hedge-trimming,
hurricane-prep, seasonal-cleanup). Replace
`apps/web/public/services/<slug>.webp` at the same path.

**Constraints:**

- **`ServicePage.tsx` shared template renders no `<Image>`.** When
  steward has real photos, engineer-side decision: add a hero `<Image>`
  to the per-service detail page, or keep the homepage bento as the
  only service-image consumer. Either is fine; the v2 hooks doc flags
  this as a UX decision.
- Update `imageAlt` in `lib/content.ts` to match the real photo (any
  descriptive sentence with the depicted scene). The WP5
  engineer-curated alts are accurate for the AI illustrations but
  will read as fiction if applied to real photos.
- Quality budget ≤37 KB. CI catches overruns via `check-weight.mjs`.

**IP-Adapter anchor reference:** `apps/comfyui/control/ip-style-ref.png`
— match warm-sage palette; the service scene cues (mower stripes,
edge lines, hedge rows) the AI versions relied on will be replaced by
real service details.

---

## Hook 5 — Real equipment photos (mower, trimmer, blower, edger)

**Current state:** Four stylized tool illustrations rendered in the
`OperatorStrip` 2×2 grid (`OperatorStrip.tsx:80`). Alt text at
`OperatorStrip.tsx:81` uses `item.use` ("self-propelled mower",
"string trimmer", "blower", "edger") — descriptive of tool category,
works whether the photo is AI-generated or phone-shot.

**v2 path:** Steward shoots each actual tool (Honda HRX217, EGO 56V
string trimmer, Greenworks 40V blower, Echo PAS-225 edger) on a
neutral surface (concrete, a sheet, daylight indoor). Replace
`apps/web/public/equipment/<tool>.webp` at the same path.

**Constraints:**

- Alt text is already tool-category-descriptive and accurate for
  either AI or phone-shot source. No code change needed; the v2
  photos drop in.
- Quality budget ≤37 KB. CI catches overruns.
- Aspect ratio matches the existing 320×320 per tile.

**IP-Adapter anchor reference:** `apps/comfyui/control/ip-style-ref.png`
— warm-tone neutral backgrounds (sage / sand-bleached / palm-shadow).

---

## Workflow: steward drops photos, engineer verifies

1. Steward takes phone snaps.
2. Resize to ≤37 KB webp locally (any image tool — Photoshop, GIMP,
   `cwebp` from libwebp, or Photoshop's "Save for Web"). Target
   dimensions: 1248×1248 for operator portrait; 16:9 1920×1080 for
   hero desktop/mobile; 800×480 for areas and services; 320×320 for
   equipment.
3. Commit and push directly to `main` (or a feature branch if you want
   review first). The asset-weight CI guard at
   `.github/workflows/ci.yml` job `asset-weight` will catch overruns
   before merge.
4. Update any `imageAlt` strings in `lib/content.ts` whose AI-alt
   doesn't fit the new photo. (Hook 4 in particular — services change
   most.)
5. Update `operator.name` in `lib/content.ts:18` (only Hook 1).
6. For Hook 3 (areas) and Hook 4 (services), engineer adds the
   `<Image>` consumer in `app/areas/[zip]/page.tsx` or
   `ServicePage.tsx` (one PR after steward has real photos).
7. Rerun Lighthouse manually against `main` (or rely on the
   lighthouse-nightly cron at `.github/workflows/lighthouse-nightly.yml`)
   to confirm phone-shot LCP is in the same band as the SDXL baseline
   (audit/wp5-lighthouse/SUMMARY.md).

---

## Why not just generate with ComfyUI for v2?

Because the prompt for v2 is "a real photo of YOUR specific tool, YOUR
specific yard" — SDXL doesn't have the operator's actual household in
its training distribution. Phone photos from the steward are the only
honest source. The IP-Adapter anchor handles the v1 (illustrated)
brand coherence; for v2 the brand voice comes through the alt text,
the operator strip copy, and the page chrome — not the photo pixels.

## See also

- `apps/comfyui/prompts/_style-block.md` — palette + composition rules for the AI v1
- `apps/comfyui/control/ip-style-ref.png` — the v1 chain-of-custody reference
- `apps/comfyui/scripts/convert-to-webp.mjs:37-129` — slug → webp mapping (one entry per slot)
- `apps/web/src/lib/content.ts:17-120` — single source of truth for copy + imageSlots
- `audit/wp5-lighthouse/SUMMARY.md` — the production LCP/CLS baseline the v2 photos must hold
- `C:\Users\camer\.claude\plans\the-front-end-website-linked-quill.md` §7 — the original deferral list WP5 picked up
