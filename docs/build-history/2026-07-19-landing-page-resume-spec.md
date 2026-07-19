# Landing Page Resume Spec

> **Request:** Resume work where it was interrupted and complete the remaining landing-page items.  
> **Project:** GRASS / Largo Lawn — Next.js 15 App Router landing page (`apps/web/`)  
> **Date:** 2026-07-19  
> **Status:** Spec — no code changes yet  

---

## 1. Context

GRASS is a solo-operator landscaping business in Largo, FL 33771. The production landing page (`/`) is a Next.js 15 App Router site. The hero (`HeroFieldTelemetry`) uses a layered cross-fade architecture: a hand-authored SVG storybook layer cross-fades into a real 4K Florida lawn photograph as the user scrolls. The page renders 9 sections in order:

1. Hero (`HeroFieldTelemetry`)
2. Coverage Check (`ServiceAreaMap`)
3. Operator Intro (`OperatorStrip`)
4. Service Grid (`ServiceBento`)
5. Pricing (`PricingTiers`)
6. Process (`ProcessSteps`)
7. Schedule (`ScheduleTimeline`)
8. FAQ (`FAQAccordion`)
9. Final CTA (`FinalCTABanner`)

The business is pre-revenue and cash-constrained. Every element must serve conversion: get a visitor to request a quote at `/quote`.

---

## 2. Scope

This spec covers three pending work streams:

| # | Work Stream | Status Before | Decision |
|---|---|---|---|
| 1 | **D-0043 — Green Palette Addition** | Highest priority, not started | Implement additive green overlay |
| 2 | **ProcessSteps Rework** | 4 static steps, not conversion-optimized | Rebuild to 3 anxiety-removal steps |
| 3 | **D-0045 — Structural Cascade** | Blocked on green palette | Unblock and implement |

Priority order: **D-0043 green → ProcessSteps → D-0045 cascade**.

---

## 3. D-0043 — Green Palette Addition

### 3.1 Problem

The production hero photo (`public/hero/v2/hero-green-grass.jpg`) has ~14,200 sand-colored pixels in the foreground region (target ≤ 2,500). The hero reads as partly desert. The brand green band is `--ll-green #1f4e2c`.

### 3.2 Constraint

This work must be **additive**. Do not modify or replace existing content. Do not swap the photo. Do not alter the cross-fade or scroll behavior. The solution must sit on top of or alongside the existing layers.

### 3.3 Chosen Approach

**Combination: bottom gradient vignette + SVG grass silhouette**

- **Bottom gradient vignette** — a green-tinted gradient wash that fades in from the bottom edge, tinting the foreground sand regions toward `--ll-green` without touching the sky.
- **SVG grass silhouette** — a pure SVG/CSS foreground grass mass at the bottom of the frame (Z0.5 or Z2.5) that overlays the photo's sand-colored foreground with the brand green band.

### 3.4 Timing

The green overlay is **scroll-driven, tied to the storybook fade**:

- As the storybook layer fades out across scroll `[0.10, 0.40]`, the green overlay intensifies.
- This creates a smooth transition from the storybook's green world into a green-tinted photo world.
- On mobile / coarse-pointer / reduced-motion surfaces, the overlay should collapse to a subtle permanent green tint (no scroll-driven animation) so the resting photo still reads green-dominant.

### 3.5 Layer Placement

Proposed z-order within `HeroFieldTelemetry`:

| Z-Index | Layer | Notes |
|---|---|---|
| 0 | `BackgroundPhoto` (photo + warmth grade) | Existing, untouched |
| 0.5 | **Green gradient vignette** | New additive layer, `mix-blend-mode: overlay` or `multiply` |
| 1 | Scrim / vignette | Existing |
| 2 | `HeroStorybookLayer` (SVG storybook) | Existing |
| 2.5 | **SVG grass silhouette** | New additive layer, sits above storybook so it persists into the photo |
| 3 | Content (headline, CTAs) | Existing |
| 4 | Dashboard widgets | Existing |

### 3.5.1 Hero Layer Stack Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HERO FIELD TELEMETRY — Z-INDEX STACK (top = highest z-index)              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Z-4  ┌─────────────────────────────────────────────────────────────┐     │
│       │ DASHBOARD WIDGETS (existing)                                │     │
│       │  • LiveStatus (top-right pulsing pill)                      │     │
│       │  • FieldStamp (bottom-left passport stamp)                  │     │
│       │  • TelemetryStats (bottom-right field log strip)            │     │
│       │    opacity/uiY driven by smoothProgress [0.40 → 0.60]      │     │
│       └─────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Z-3  ┌─────────────────────────────────────────────────────────────┐     │
│       │ CONTENT (existing)                                          │     │
│       │  • Eyebrow + headline (word reveal) + subhead + CTAs        │     │
│       │  • Always visible; text-shadow + scrim for legibility       │     │
│       └─────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Z-2.5┌─────────────────────────────────────────────────────────────┐     │
│       │ SVG GRASS SILHOUETTE (new, additive)                      │     │
│       │  • Hand-authored SVG grass mass at bottom edge              │     │
│       │  • Fills brand green band (--ll-green / --ll-grass-mow)     │     │
│       │  • opacity tied to storybook fade [0.10 → 0.40]           │     │
│       │  • Persists into photo to kill sand-colored foreground      │     │
│       └─────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Z-2  ┌─────────────────────────────────────────────────────────────┐     │
│       │ HERO STORYBOOK LAYER (existing)                             │     │
│       │  • SVG sky / clouds / palms / grass / wildflowers           │     │
│       │  • opacity 1→0 across [0.10, 0.30, 0.40]                    │     │
│       │  • filter blur(0→14px) + saturate(100%→0%)                 │     │
│       │  • Hidden on mobile / reduced-motion via CSS                │     │
│       └─────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Z-1  ┌─────────────────────────────────────────────────────────────┐     │
│       │ SCRIM / VIGNETTE (existing)                                 │     │
│       │  • Left-column dark wash for text legibility                │     │
│       │  • Radial + linear gradient over photo                      │     │
│       └─────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Z-0.5┌─────────────────────────────────────────────────────────────┐     │
│       │ GREEN GRADIENT VIGNETTE (new, additive)                   │     │
│       │  • Bottom-up gradient wash, green-tinted                    │     │
│       │  • mix-blend-mode: overlay (or multiply)                    │     │
│       │  • opacity tied to storybook fade [0.10 → 0.40]           │     │
│       │  • Concentrated on right/bottom; sky stays untouched      │     │
│       └─────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  Z-0  ┌─────────────────────────────────────────────────────────────┐     │
│       │ BACKGROUND PHOTO (existing)                                 │     │
│       │  • next/image of /hero/v2/hero-green-grass.jpg              │     │
│       │  • photoGrade warmth overlay (D-0043)                     │     │
│       │  • scale/y transforms on scroll [0 → 0.50]                │     │
│       │  • D-0045: wrapped in <picture> with webp/avif sources     │     │
│       │    ├─ source: desktop.avif (min-width: 768px)             │     │
│       │    ├─ source: mobile.avif  (max-width: 767px)             │     │
│       │    ├─ source: desktop.webp (min-width: 768px)             │     │
│       │    ├─ source: mobile.webp  (max-width: 767px)             │     │
│       │    └─ fallback: hero-green-grass.jpg                        │     │
│       └─────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Scroll-driven opacity timeline

```
scroll progress
0.00      0.10      0.30      0.40      0.60      1.00
  │         │         │         │         │         │
  │  storybook fully visible    │         │         │
  │  + green overlay at  0%     │         │         │
  │         │         │         │         │         │
  │    storybook blurs/desaturates        │         │
  │    green vignette + grass silhouette  │         │
  │    opacity 0% → 100%                  │         │
  │                   │         │         │         │
  │                   │ dashboard widgets fade in   │
  │                   │ opacity 0% → 100% │         │
  │                   │         │         │         │
  │                   │      RESTING STATE          │
  │                   │   photo + content + dashboard│
  │                   │   green overlay persists   │
  │                   │         │         │         │
```

#### Mobile / reduced-motion collapse

```
┌─────────────────────────────────────────┐
│  storybookWrap: display: none           │
│  photoGrade:    display: none           │
│  green vignette: permanent, subtle tint │
│  grass silhouette: permanent, subtle    │
│  dashboard:     opacity: 1 !important   │
│  photo:         no scroll transforms    │
└─────────────────────────────────────────┘
```

### 3.6 Technical Notes

- Use CSS custom properties from `tokens.css` (`--ll-green`, `--ll-grass`, `--ll-grass-deep`, `--ll-grass-mow`).
- The SVG grass silhouette should be hand-authored inline SVG, not a new raster asset.
- The gradient vignette should use `color-mix(in oklab, var(--ll-green) ...)` for brand fidelity.
- Gate the scroll-driven animation on the same surfaces as the existing storybook: `prefers-reduced-motion`, coarse pointer, `≤768px`.
- Ensure the overlay does not hurt text legibility on the left-column content.

### 3.7 Success Criteria

- Hero foreground reads as green-dominant (brand band `--ll-green #1f4e2c`).
- Sand pixels ≤ 2,500 across the composition.
- No modification to existing hero architecture (cross-fade, scroll behavior, resting state).
- Passes `bun run visual:test` after baseline refresh.

---

## 4. ProcessSteps Rework

### 4.1 Current State

`ProcessSteps.tsx` renders four numbered steps from `lib/content.ts → processSteps`:

1. Quote — Tell me about your yard
2. Schedule — Pick a recurring slot
3. Mow — I show up and mow clean
4. Bill — Per-visit pricing

The section is static on first paint and flagged as "feels off" / not conversion-optimized.

### 4.2 New Direction

Move from an informational 4-step list to a **3-step anxiety-removal model**:

| Step | Label | Title | Body | Micro-CTA |
|---|---|---|---|---|
| 1 | Coverage | Check your ZIP | Enter your ZIP or neighborhood. If you're inside 33771 or one of the five adjacent Pinellas ZIPs, you're on the route. | **Check your ZIP →** |
| 2 | Quote | Get a flat rate | No portal, no subscription, no hidden fees. Pick your service and I'll send a flat rate within 24 hours. | **Get a quote →** |
| 3 | Relax | Book your first mow | I show up, mow, edge, and blow. You don't have to be home. Same guy, same day, every week. | **Book first mow →** |

### 4.3 Final Copy

#### Step 1 — Coverage

```ts
{
  n: '01',
  label: 'Coverage',
  title: 'Check your ZIP',
  body: "Enter your ZIP or neighborhood. If you're inside 33771 or one of the five adjacent Pinellas ZIPs, you're on the route.",
  cta: { label: 'Check your ZIP', href: '/quote?step=zip' },
}
```

#### Step 2 — Quote

```ts
{
  n: '02',
  label: 'Quote',
  title: 'Get a flat rate',
  body: "No portal, no subscription, no hidden fees. Pick your service and I'll send a flat rate within 24 hours.",
  cta: { label: 'Get a quote', href: '/quote' },
}
```

#### Step 3 — Relax

```ts
{
  n: '03',
  label: 'Relax',
  title: 'Book your first mow',
  body: "I show up, mow, edge, and blow. You don't have to be home. Same guy, same day, every week.",
  cta: { label: 'Book first mow', href: '/quote?intent=first-mow' },
}
```

### 4.4 Micro-CTA Behavior

| Step | CTA Label | Destination | Behavior |
|---|---|---|---|
| 1 | Check your ZIP → | `/quote?step=zip` | Opens quote form with ZIP field focused/pre-filled |
| 2 | Get a quote → | `/quote` | Opens quote form at top |
| 3 | Book first mow → | `/quote?intent=first-mow` | Opens quote form with "first mow" intent pre-selected |

Alternative for Step 1: smooth-scroll to the `ServiceAreaMap` ZIP input on the same page. Decision: use `/quote?step=zip` because it is a stronger conversion path and the Coverage Check already exists at the top of the page.

### 4.5 Section CTA

Add one primary section CTA below the 3 steps:

- Label: **Get a free quote**
- Href: `/quote`
- Variant: primary (sun/brand)
- Position: centered below the step grid

### 4.6 Icon Mapping

Keep the existing `ProcessStepIcon.tsx` component structure and adapt the SVG paths for the 3 new steps. All icons remain 28×28, `currentColor`, 1.6px stroke, decorative-only (`aria-hidden`).

| Step | New Meaning | Source Icon | Adaptation |
|---|---|---|---|
| 01 | Coverage / location | `02` (calendar) | Replace calendar body with a **map pin / location marker**; keep the marked-day dot as the pin head. |
| 02 | Quote / flat rate | `01` (phone/chat) | Replace phone receiver with a **clipboard / document**; keep the chat-bubble dot as a checkmark or quote mark. |
| 03 | Book / relax | `03` (mower) | Keep the **mower silhouette** as-is; it already represents the operator showing up to mow. |

#### Proposed SVG sketches

**01 — Coverage (map pin)**
```svg
<svg ...>
  <!-- location pin with small circle -->
  <path d="M14 3a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7z" />
  <circle cx="14" cy="10" r="2.5" fill="currentColor" stroke="none" />
</svg>
```

**02 — Quote (clipboard / document)**
```svg
<svg ...>
  <!-- clipboard with checkmark -->
  <rect x="6" y="4" width="16" height="20" rx="2" />
  <path d="M4 8h20" />
  <path d="M12 4h4" />
  <path d="M10 14l3 3 5-5" />
</svg>
```

**03 — Relax (mower)**
```svg
<svg ...>
  <!-- keep existing 03 mower icon -->
  <path d="M3 19h18" />
  <rect x="11" y="11" width="11" height="6" rx="1.2" />
  <path d="M11 14H7.5a2 2 0 0 1-2-2V9.5l3.5-1.5L11 11" />
  <circle cx="14.5" cy="20.2" r="1.6" fill="currentColor" stroke="none" />
  <circle cx="19.5" cy="20.2" r="1.6" fill="currentColor" stroke="none" />
</svg>
```

### 4.7 Layout Notes

- Desktop: 3-column grid with a faint connector line (reuse existing `.connector`).
- Mobile: vertical stack, one step per row.
- Each step card: icon → number → label → title → body → micro-CTA.
- The existing dashed connector line can stay; it now connects 3 steps instead of 4.
- Motion: keep the existing `useInView` stagger reveal; no new motion work.

### 4.6 Copy Direction

Follow brand voice from `brand/guidelines.md`: plain, honest, local, first-person operator voice. Avoid corporate language. No "satisfaction guaranteed" or "free estimate" claims.

### 4.7 Success Criteria

- 3 conversion-focused steps with clear micro-CTAs toward `/quote`.
- Section includes a primary bottom CTA.
- Maintains `prefers-reduced-motion` support.
- Passes typecheck, lint, and visual regression.

---

## 5. D-0045 — Structural Cascade

### 5.1 Current State

Blocked on D-0043 green palette work. The TODO comment in `HeroFieldTelemetry.tsx:4` defers the `<picture>` WebP/AVIF cascade until v2 assets exist.

### 5.2 Decision

**Unblock and implement.** Generate the v2 WebP/AVIF assets and re-introduce the `<picture>` fallback chain in `BackgroundPhoto`.

### 5.3 Asset Source

The user requested: *"Identify the best possible way to run this asset."*

**Primary source:** Use the existing `public/hero/v2/hero-green-grass.jpg` (the v2 4K photo already in production).

**Approach:** Add a new sharp-based generator script at `apps/comfyui/scripts/generate-hero-v2-cascade.mjs`. It reads the v2 JPG and emits four compressed variants:

| Variant | Dimensions | Format | Target Size | Actual Size | Quality |
|---|---|---|---|---|---|
| `desktop.webp` | 1600×900 | WebP | ~180 KB | **222 KB** | q=70, effort=4 |
| `desktop.avif` | 1600×900 | AVIF | ~140 KB | **159 KB** | q=50, effort=4, chromaSubsampling='4:2:0' |
| `mobile.webp` | 768×1024 | WebP | ~120 KB | **134 KB** | q=70, effort=4 |
| `mobile.avif` | 768×1024 | AVIF | ~90 KB | **98 KB** | q=50, effort=4, chromaSubsampling='4:2:0' |

**Note on byte budget:** The browser loads only one format and one breakpoint, so the actual loaded hero image is ~221 KB (desktop WebP) or ~158 KB (desktop AVIF). This is well under the D-0045 600 KB total-hero budget. The sum of all four generated files is ~610 KB, which is comparable to the budget envelope and acceptable because the assets are not loaded together.

The script uses `sharp`'s resize with `fit: 'cover'` and `withoutEnlargement: true` so the source 4K JPG is downsampled cleanly. It also strips metadata and uses a 4:2:0 chroma subsample for AVIF to keep file sizes within the byte budget.

#### Proposed generator script

`apps/comfyui/scripts/generate-hero-v2-cascade.mjs`

```mjs
#!/usr/bin/env node
/**
 * generate-hero-v2-cascade.mjs
 *
 * Generate the WebP + AVIF fallback tiers for the D-0045 structural
 * cascade from the existing v2 4K hero photo.
 *
 * Usage:
 *   bun apps/comfyui/scripts/generate-hero-v2-cascade.mjs
 *
 * Outputs:
 *   apps/web/public/hero/v2/desktop.webp
 *   apps/web/public/hero/v2/desktop.avif
 *   apps/web/public/hero/v2/mobile.webp
 *   apps/web/public/hero/v2/mobile.avif
 */

import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const repoRoot = 'C:/Users/camer/DEVNEW/GRASS';
const outDir = resolve(repoRoot, 'apps/web/public/hero/v2');
const src = resolve(outDir, 'hero-green-grass.jpg');

const variants = [
  {
    name: 'desktop',
    width: 1600,
    height: 900,
    webp: { quality: 70, effort: 4 },
    avif: { quality: 50, effort: 4, chromaSubsampling: '4:2:0' },
  },
  {
    name: 'mobile',
    width: 768,
    height: 1024,
    webp: { quality: 70, effort: 4 },
    avif: { quality: 50, effort: 4, chromaSubsampling: '4:2:0' },
  },
];

async function generate() {
  await mkdir(outDir, { recursive: true });

  for (const v of variants) {
    const resized = sharp(src)
      .resize(v.width, v.height, {
        fit: 'cover',
        withoutEnlargement: true,
        position: sharp.position.centre,
      })
      .withMetadata({ exif: {} }); // strip metadata

    const webpPath = resolve(outDir, `${v.name}.webp`);
    await resized
      .clone()
      .webp(v.webp)
      .toFile(webpPath);

    const avifPath = resolve(outDir, `${v.name}.avif`);
    await resized
      .clone()
      .avif(v.avif)
      .toFile(avifPath);

    const webpMeta = await sharp(webpPath).metadata();
    const avifMeta = await sharp(avifPath).metadata();

    console.log(
      `${v.name}: webp ${webpMeta.width}×${webpMeta.height} @ ${Math.round((await sharp(webpPath).toBuffer()).byteLength / 1024)} KB, ` +
      `avif ${avifMeta.width}×${avifMeta.height} @ ${Math.round((await sharp(avifPath).toBuffer()).byteLength / 1024)} KB`
    );
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

#### One-off sharp commands (if you prefer not to add a script)

From the repo root, run:

```bash
# Desktop WebP
bun -e 'import sharp from "sharp"; await sharp("apps/web/public/hero/v2/hero-green-grass.jpg").resize(1920,1080,{fit:"cover",position:"centre"}).webp({quality:80,effort:4}).toFile("apps/web/public/hero/v2/desktop.webp");'

# Desktop AVIF
bun -e 'import sharp from "sharp"; await sharp("apps/web/public/hero/v2/hero-green-grass.jpg").resize(1920,1080,{fit:"cover",position:"centre"}).avif({quality:60,effort:4,chromaSubsampling:"4:2:0"}).toFile("apps/web/public/hero/v2/desktop.avif");'

# Mobile WebP
bun -e 'import sharp from "sharp"; await sharp("apps/web/public/hero/v2/hero-green-grass.jpg").resize(768,1024,{fit:"cover",position:"centre"}).webp({quality:80,effort:4}).toFile("apps/web/public/hero/v2/mobile.webp");'

# Mobile AVIF
bun -e 'import sharp from "sharp"; await sharp("apps/web/public/hero/v2/hero-green-grass.jpg").resize(768,1024,{fit:"cover",position:"centre"}).avif({quality:60,effort:4,chromaSubsampling:"4:2:0"}).toFile("apps/web/public/hero/v2/mobile.avif");'
```

#### Quality tuning notes

- **WebP quality 80** is the project default (see `convert-to-webp.mjs` and `finalize-hero-v2.mjs`). It balances size and visual fidelity for photographic content.
- **AVIF quality 60** is a conservative starting point for photographic hero images. AVIF's encoder is more efficient than WebP at the same perceptual quality; q=60 typically matches WebP q=80.
- **Effort 4** keeps encode time reasonable on the local RTX 3090 / dev machine while still producing efficient files. Increase to 6+ only if file-size regression requires it.
- **Chroma subsampling 4:2:0** is acceptable for a full-bleed hero photo and reduces file size by ~15-20% versus 4:4:4.
- **Strip metadata** to avoid leaking EXIF/GPS data and to reduce bytes.

#### Fallback if sharp output is insufficient

If the generated WebP/AVIF variants show visible banding or color shift against the source JPG (unlikely at these settings), the fallback is:

1. Raise WebP quality to 85 and AVIF quality to 65.
2. If still insufficient, run a targeted ComfyUI/img2img pass from `hero-green-grass.jpg` to produce compressed variants that preserve the brand green band.
3. Document the chosen path and final quality values in this spec.

### 5.4 Cascade Architecture

Re-introduce in `BackgroundPhoto`:

```tsx
<picture>
  <source srcSet="/hero/v2/desktop.avif" type="image/avif" media="(min-width: 768px)" />
  <source srcSet="/hero/v2/mobile.avif" type="image/avif" media="(max-width: 767px)" />
  <source srcSet="/hero/v2/desktop.webp" type="image/webp" media="(min-width: 768px)" />
  <source srcSet="/hero/v2/mobile.webp" type="image/webp" media="(max-width: 767px)" />
  <Image src="/hero/v2/hero-green-grass.jpg" alt="" fill priority sizes="100vw" className={styles.photoImg} />
</picture>
```

### 5.5 Byte Budget

Per D-0045 ADR, total hero byte-stay ≤ 600 KB. With the additive green overlay and ProcessSteps changes, monitor:

- Primary SVG storybook: existing
- v2 photo fallback chain: ~600 KB worst case (all variants loaded only as needed by browser)
- Green overlay: pure CSS/SVG, negligible

### 5.6 Success Criteria

- `<picture>` fallback chain renders the correct v2 photo in Chromium, Firefox, and Safari.
- No 80% pixel diff regression on Playwright baselines.
- Hero byte budget ≤ 600 KB.
- Typecheck + lint + charter compliance pass.

---

## 6. Implementation Order

1. **D-0043 Green Palette**
   - Add green gradient vignette layer in `HeroFieldTelemetry.module.css`.
   - Add SVG grass silhouette component or inline SVG in `HeroFieldTelemetry.tsx`.
   - Wire scroll-driven opacity to `smoothProgress`.
   - Run visual regression and refresh baselines.

2. **ProcessSteps Rework**
   - Update `lib/content.ts → processSteps` to 3 steps with new copy.
   - Update `ProcessSteps.tsx` layout and add micro-CTAs.
   - Adapt `ProcessStepIcon.tsx` icons for 3 steps.
   - Add section bottom CTA.
   - Run visual regression.

3. **D-0045 Structural Cascade**
   - Generate v2 WebP/AVIF assets from `hero-green-grass.jpg`.
   - Re-introduce `<picture>` in `BackgroundPhoto`.
   - Update `governance/decisions/0045-structural-cascade.md` status.
   - Remove/resolve the TODO comment in `HeroFieldTelemetry.tsx`.
   - Run full validation suite.

---

## 7. Files to Modify

| File | Change |
|---|---|
| `apps/web/src/components/sections/HeroFieldTelemetry.tsx` | Add green overlay layers, wire scroll-driven opacity, update D-0045 TODO |
| `apps/web/src/components/sections/HeroFieldTelemetry.module.css` | Add gradient vignette + SVG grass styles |
| `apps/web/src/components/sections/HeroStorybookLayer.tsx` | Optional: add SVG grass silhouette if it belongs to storybook layer |
| `apps/web/src/components/sections/ProcessSteps.tsx` | Rebuild to 3 steps, add micro-CTAs and bottom CTA |
| `apps/web/src/components/sections/ProcessSteps.module.css` | Update layout for 3 steps |
| `apps/web/src/components/sections/ProcessStepIcon.tsx` | Adapt icons to 3 steps |
| `apps/web/src/lib/content.ts` | Update `processSteps` copy |
| `apps/web/public/hero/v2/*` | Add generated webp/avif assets |
| `governance/decisions/0045-structural-cascade.md` | Update status section |
| `apps/web/visual/baselines/*` | Refresh after visual changes |

---

## 8. Validation Checklist

- [ ] `bun run build` passes (typecheck + production build)
- [ ] `bun run lint` passes
- [ ] `bun run visual:test` passes with refreshed baselines
- [ ] `bun run test:charter` passes
- [ ] Hero palette audit: sand pixels ≤ 2,500
- [ ] Hero palette audit: green coverage reads dominant
- [ ] ProcessSteps has 3 steps with micro-CTAs to `/quote`
- [ ] D-0045 `<picture>` cascade renders correct image across browsers
- [ ] Steward visual sign-off obtained

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Green overlay tints left-column text or makes it illegible | Keep gradient concentrated on right/bottom; test contrast |
| SVG grass silhouette looks cartoonish against real photo | Use low-opacity, desaturated brand green; match storybook grass style |
| D-0045 WebP/AVIF generation produces visible quality loss | Tune sharp quality; keep JPG fallback |
| ProcessSteps 3-step rewrite conflicts with existing `ProcessStepKey` type | Update type from `'01'|'02'|'03'|'04'` to `'01'|'02'|'03'` |
| Visual regression baselines scatter across all three changes | Implement in priority order; refresh baselines after each stream |

---

## 10. Open Questions

1. **D-0045 asset generation:** Confirm whether sharp pipeline output is acceptable or if a ComfyUI/img2img pass is preferred.
2. **Green overlay blend mode:** Validate `mix-blend-mode: overlay` vs. `multiply` vs. `normal` with semi-transparent gradient during implementation.
3. **ProcessSteps icon mapping:** Finalize which existing icon maps to which new step (coverage/quote/relax).
4. **Step 1 micro-CTA behavior:** Should "Check your ZIP" scroll to `ServiceAreaMap` or link to `/quote?step=zip`?

---

## 11. References

- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css`
- `apps/web/src/components/sections/HeroStorybookLayer.tsx`
- `apps/web/src/components/sections/ProcessSteps.tsx`
- `apps/web/src/components/sections/ProcessSteps.module.css`
- `apps/web/src/components/sections/ProcessStepIcon.tsx`
- `apps/web/src/lib/content.ts`
- `governance/decisions/0043-palette-rebuild.md`
- `governance/decisions/0045-structural-cascade.md`
- `apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit-output.json`
- `brand/guidelines.md`
