# PRD-02 — Content Model

**Purpose:** Define what data flows into each surface, what's hard-coded
vs. content-sourced, and what CMS-shaped fields exist even if the CMS
ships later.
**Audience:** Engineer (implementing), Marketing (writing copy)

---

## 1. Why this matters

A redesign that has to touch code every time the steward wants to change
a phone number is a redesign that won't get maintained. The current
codebase has a single source of truth (`apps/web/src/lib/business.ts` for
NAP, hours, pricing floor). This PRD extends that pattern to **every
piece of customer-facing content**:

- Service descriptions, FAQ entries
- Operator bio, photo, equipment list
- Area-specific copy (per-ZIP neighborhood notes)
- Testimonials
- Photo gallery metadata (alt text, captions)
- Press / awards / "as seen in" (future)

If/when a CMS is added (post-M3, separate PRD), this content model
becomes the schema. Until then, it's all in `lib/content.ts` as typed
constants.

## 2. The `lib/content.ts` shape

```typescript
// apps/web/src/lib/content.ts
// Single source of truth for every customer-facing string + asset.
// All pages import from here; nothing is hard-coded in page files.

export const CONTENT = {
  brand: {
    name: 'Largo Lawn',
    tagline: 'Your Neighbor\'s Lawn Mower',
    shortDescription: 'Local, solo-operator lawn care in Largo, FL.',
    operator: {
      // Steward fills in:
      name: '<<STEWARD: your first name>>',
      bio: '<<STEWARD: 2-3 sentences about you — born/raised here? how long mowing? what you love about Pinellas?>>',
      photoSrc: '/operator/portrait.webp',
      photoAlt: '<<STEWARD: brief description of the photo>>',
      yearsMowing: '<<STEWARD: how many years?>>',
      certifications: ['<<STEWARD: any certs? (most are none — that\'s fine)>>'],
      equipment: [
        { name: '<<STEWARD: your mower model>>', photoSrc: '/equipment/mower.webp' },
        { name: '<<STEWARD: your edger model>>', photoSrc: '/equipment/edger.webp' },
        { name: '<<STEWARD: your trimmer model>>', photoSrc: '/equipment/trimmer.webp' },
        { name: '<<STEWARD: your blower model>>', photoSrc: '/equipment/blower.webp' },
      ],
      truck: { model: '<<STEWARD: your truck — year/make/model>>', photoSrc: '/truck/photo.webp' },
    },
  },

  social: {
    proof: [
      // Steward pastes real testimonials here as they come in.
      // Until then, leave empty — do NOT use placeholder testimonials.
      { quote: '', author: '', area: '', date: '' },
    ],
    proofPhotos: [
      // Real before/after or finished-yard photos.
      { src: '/work/yard-001.webp', alt: '<<STEWARD: alt text>>', caption: '' },
    ],
  },

  faq: [
    // Common lawn-care questions. Steward reviews and edits.
    { q: 'Do I need to be home when you mow?', a: '<<STEWARD: your answer>>' },
    { q: 'What if it rains on my mow day?', a: '<<STEWARD: your answer>>' },
    { q: 'Do you take checks / cards / Venmo?', a: '<<STEWARD: your answer>>' },
    { q: 'What happens to my gate / dog?', a: '<<STEWARD: your answer>>' },
    { q: 'Are you insured?', a: '<<STEWARD: per anti-brand list — do NOT claim until OBJ-M2-003 fires>>' },
    { q: 'How fast can you start?', a: '<<STEWARD: your typical lead time>>' },
  ],

  pressMentions: [], // future, when applicable

  serviceAreas: {
    '33771': { heroPhoto: '/areas/33771-hero.webp', neighborhoodNotes: '<<STEWARD: 1-2 sentences specific to 33771>>' },
    '33770': { heroPhoto: '/areas/33770-hero.webp', neighborhoodNotes: '<<STEWARD: 1-2 sentences specific to 33770>>' },
    '33773': { heroPhoto: '/areas/33773-hero.webp', neighborhoodNotes: '<<STEWARD: 1-2 sentences specific to 33773>>' },
    '33774': { heroPhoto: '/areas/33774-hero.webp', neighborhoodNotes: '<<STEWARD: 1-2 sentences specific to 33774>>' },
    '33778': { heroPhoto: '/areas/33778-hero.webp', neighborhoodNotes: '<<STEWARD: 1-2 sentences specific to 33778>>' },
    '33756': { heroPhoto: '/areas/33756-hero.webp', neighborhoodNotes: '<<STEWARD: 1-2 sentences specific to 33756>>' },
  },

  servicePricing: {
    // Already lives in BUSINESS / PRICING_FLOOR_CENTS — copied here for
    // content-cohabitation. Steward edits in one place; this doc tracks
    // human-friendly display values.
    mowing: {
      weeklySmall:    '$35',
      weeklyMedium:   '$48',
      weeklyLarge:    '$65',
      biweeklySmall:  '$39',
      biweeklyMedium: '$55',
      biweeklyLarge:  '$75',
      oneTimeSmall:   '$45',
      oneTimeMedium:  '$60',
      oneTimeLarge:   '$85',
    },
    hurricanePrep: '$95',
    // ...
  },
} as const;
```

## 3. Per-surface content slots

### Homepage `/`

| Slot | Source | Editable by | Default |
|---|---|---|---|
| Hero headline | `brand.tagline` or generated | Steward | "Your Neighbor's Lawn Mower." |
| Hero subhead | `brand.shortDescription` | Steward | "Local, solo-operator lawn care in Largo, FL." |
| Hero image | `images/hero.webp` (new asset) | Steward (drop file in `apps/web/public/`) | TBD |
| Hero CTA primary | `'/quote'` | Engineering | "Free Quote" |
| Hero CTA secondary | `tel:+17275550123` | Engineering | "(727) 555-0123" |
| Operator strip | `brand.operator.{name,bio,photoSrc}` | Steward | Photo + 2-line bio |
| Service cards (×6) | `services/data.ts` (existing) | Steward | Slug, title, blurb, hero photo, price |
| Social proof | `social.proof` (when populated) | Steward | Empty until real testimonials exist |
| Why-us list | `brand.usp` (new) | Steward | 3-4 bullets |
| Footer NAP | `BUSINESS` (existing) | Steward | Auto from `lib/business.ts` |

### Quote `/quote`

| Slot | Source | Editable by | Default |
|---|---|---|---|
| Calculator | `QuoteCalculator.tsx` (existing) | Engineering | Lot / frequency / add-ons |
| Pricing matrix | `servicePricing.mowing` | Steward (in `content.ts`) | Live values |
| Testimonial strip (post-launch) | `social.proof` | Steward | Empty pre-launch |
| Service-area reassurance | `BUSINESS.service_area_zips` | Steward | 6 ZIPs |

### Service detail `/services/[slug]`

| Slot | Source | Editable by |
|---|---|---|
| Hero photo | `images/services/{slug}.webp` | Steward (drop file) |
| Title | `services/data.ts` | Steward |
| Body copy | `services/data.ts` | Steward |
| Pricing | `BUSINESS` + `content.ts` | Steward |
| FAQ | `services/data.ts` (per-service FAQ) | Steward |
| Related services | derived from `services/data.ts` | Auto |
| Schema.org JSON-LD | derived from page content | Auto |

### Areas `/areas` and `/areas/[zip]`

| Slot | Source | Editable by |
|---|---|---|
| Map | Static image or Leaflet | Engineering |
| ZIP cards | `BUSINESS.service_area_zips` | Auto |
| Per-ZIP hero photo | `serviceAreas.{zip}.heroPhoto` | Steward |
| Per-ZIP notes | `serviceAreas.{zip}.neighborhoodNotes` | Steward |

### About `/about`

| Slot | Source | Editable by |
|---|---|---|
| Operator photo | `brand.operator.photoSrc` | Steward |
| Bio | `brand.operator.bio` | Steward |
| Equipment list | `brand.operator.equipment` | Steward |
| Truck | `brand.operator.truck` | Steward |
| Years mowing | `brand.operator.yearsMowing` | Steward |

### Contact `/contact`

| Slot | Source | Editable by |
|---|---|---|
| Contact form | existing | Engineering |
| Phone | `BUSINESS.phone` | Steward |
| Email | `BUSINESS.email` | Steward |
| Hours | `BUSINESS.hours` | Steward |
| NAP block | `BUSINESS.address` | Steward |

### QR codes `/qr`

| Slot | Source | Editable by |
|---|---|---|
| QR targets | hardcoded in `qr/page.tsx` | Engineering |
| Downloadable SVG | generated | Auto |

### Redirector `/t/[slug]`

| Slot | Source | Editable by |
|---|---|---|
| Channel list | hardcoded in `t/[source]/route.ts` | Engineering |

## 4. Imagery assets needed

The steward (or photographer) needs to provide:

```
apps/web/public/
  operator/
    portrait.webp              /* 800×1000, head + shoulders, golden hour */
  truck/
    photo.webp                 /* 1600×900, parked on a street */
  equipment/
    mower.webp                 /* 800×600 */
    edger.webp                 /* 800×600 */
    trimmer.webp               /* 800×600 */
    blower.webp                /* 800×600 */
  work/
    yard-001.webp ... yard-N.webp   /* before/afters, finished yards */
  areas/
    33771-hero.webp            /* 1600×900, signature 33771 street */
    33770-hero.webp
    33773-hero.webp
    33774-hero.webp
    33778-hero.webp
    33756-hero.webp
  services/
    mowing-hero.webp           /* 1600×900 */
    edging-hero.webp
    mulching-hero.webp
    hedge-trimming-hero.webp
    hurricane-prep-hero.webp
    seasonal-cleanup-hero.webp
  hero.webp                    /* homepage hero, 2400×1200 */
  hero-mobile.webp             /* 1200×1500, mobile crop */
```

Total: ~25-30 image assets.

Format: `.webp` for size; PNG fallback for transparency (logo). Target
size per asset: <300 KB after compression (use `cwebp -q 80`).

Alt text: required for every asset. Stored in `content.ts`, not in
filename.

## 5. Edit workflow (pre-CMS)

Until a CMS ships, the steward edits:

- **Strings** → edit `apps/web/src/lib/content.ts`, run `bun run build`
  to verify, commit
- **Images** → drop file in `apps/web/public/...`, update
  `content.ts` to reference it, run build, commit
- **Pricing** → edit `lib/business.ts` AND `lib/content.ts`
  (display values), verify both
- **Theme** → edit `apps/web/src/styles/tokens.css`, refresh
- **Service copy** → edit `apps/web/src/app/services/data.ts`

After every edit, `bun run build` must remain green and `/preview/design`
must reflect the change.

## 6. Future-CMS compatibility

When a CMS ships (post-M3, separate PRD), `lib/content.ts` becomes a
loader that fetches from the CMS at build time (for SSG) or runtime
(for ISR). The shape of `CONTENT` stays the same. Pages don't change.

Recommended future CMS:
- **Local-first**: Markdown files in `content/` directory, loaded at
  build time via `fs.readdir`. No external service. (See existing
  `content/` directory pattern.)
- **Hosted**: Sanity, Contentful, or Payload. Decision deferred.

## 7. What this document does NOT cover

- CMS selection → separate PRD (post-M3)
- Translation workflow → separate PRD
- Per-page animation choreography → `04-motion-and-microinteractions.md`
- Asset photography direction → `05-photography-and-illustration-brief.md`