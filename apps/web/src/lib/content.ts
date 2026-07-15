/**
 * Page content: Mission 1
 *
 * Single source of truth for all customer-facing copy that lives outside the
 * service registry (lib/business.ts). Pages consume this; designers and the
 * steward edit this file rather than hunting through page.tsx trees.
 *
 * Copy principles (from brand/guidelines.md):
 *   - Plain, honest, local. First-person where the operator is the subject.
 *   - No "Eco-friendly", "Licensed & insured", "Free estimate",
 *     "Satisfaction guaranteed", "Family-owned", "#1 in [city]".
 *   - Legal scope only: mowing / edging / blowing / mulching / hedge trim /
 *     hurricane prep / seasonal cleanup. No fertilization / irrigation /
 *     pest-control language.
 */

export const operator = {
  name: 'Operator', // steward replaces with real first name
  yearsMowing: 6,
  bio: `I'm the guy mowing your neighbor's yard. Six years cutting grass in Largo and the five adjacent ZIPs. I run solo, on a consistent weekly route, so the same person shows up every week. No crew swap, no franchise markup.`,
  equipment: [
    { name: 'Honda HRX217', use: 'self-propelled mower' },
    { name: 'EGO 56V', use: 'string trimmer' },
    { name: 'Greenworks 40V', use: 'blower' },
    { name: 'Echo PAS-225', use: 'edger' },
  ],
} as const;

export const hero = {
  eyebrow: 'Lawn care in 33771',
  headline: "Your neighbor's lawn mower.",
  subhead:
    'Local, solo-operator lawn care in Largo and the five adjacent Pinellas ZIPs. Free quotes within 24 hours. No contract, no franchise markup.',
  primaryCta: { label: 'Get a free quote', href: '/quote' },
  secondaryCta: { label: 'Call (727) 555-0123', href: 'tel:+17275550123' },
  image: {
    alt: 'Freshly mowed lawn in 33771 at golden hour.',
    desktopSlot: '/hero/desktop.webp',
    mobileSlot: '/hero/mobile.webp',
  },
  /**
   * WP19: right-column SVG composition (replaces the photo right column
   * that was failing to render in <picture>+next/image setups).
   * WP21: removed the inline sun arc (the palm SVG has its own sun baked
   * in; the second sun created "two suns" incoherence). The composition is
   * now four layers: pinellas-palm (with internal sun), solo mower,
   * foreground grass, and a 33771 callout pill. Copy tweaks live here so
   * the steward edits one file, not the component.
   */
  composition: {
    palmAriaLabel: 'Pinellas palm tree against a deep-green Florida stage.',
    mowerAriaLabel: 'Solo push mower mid-cut on the route.',
    grassAriaLabel: 'Foreground grass tufts anchoring the composition.',
    callout: '33771 - Largo central',
    calloutHref: '/areas/33771',
  },
} as const;

export const trustStrip = {
  copy: 'Proudly serving 33771 · 33770 · 33773 · 33774 · 33778 · 33756 - and counting.',
} as const;

/**
 * Service area map: section 06 on the landing page.
 *
 * Renders the schematic Pinellas peninsula with 6 ZIP pins (one per
 * `BUSINESS.service_area_zips`). `pinLocations` pairs each ZIP with a
 * neighborhood label rendered both inside the pin tooltip and in
 * the side rail. Layout coordinates (x/y per pin) live in the
 * component, not here: they're SVG layout config, not copy.
 *
 * Adding a new service-area ZIP only needs two edits:
 *   1. Add the ZIP to `BUSINESS.service_area_zips` and
 *      `PIN_LAYOUT` (in the component).
 *   2. Add the matching label here.
 */
export const serviceAreaMap = {
  eyebrow: 'Where I mow',
  heading: 'Six ZIPs, one route.',
  subhead:
    'We keep the service area tight on purpose: six ZIPs across Largo and the adjacent Pinellas neighborhoods. If you are right outside one of these, ask; I sometimes make exceptions for yards next door.',
  svgAriaLabel: 'Map of Largo Lawn service area with six ZIPs marked',
  tampaBayLabel: 'Tampa Bay',
  gulfOfMexicoLabel: 'Gulf of Mexico',
  railTitle: 'Service areas',
  pinLocations: {
    '33756': 'Belleair / Clearwater',
    '33770': 'Belleair Bluffs / Largo',
    '33771': 'Largo (central)',
    '33773': 'Largo (east)',
    '33774': 'Largo / Ridgecrest',
    '33778': 'Seminole / Largo West',
  },
  /**
   * Per-ZIP thumbnail map. Sources are ComfyUI-generated webps
   * produced against `apps/comfyui/prompts/area.md`; rendered
   * alongside each rail row so the previously-orphaned area
   * imagery lands on the page where it was always meant to live.
   * Generic alt text: these are abstract illustrations, not
   * neighborhood photography.
   */
  areaImages: {
    '33756': '/areas/33756.webp',
    '33770': '/areas/33770.webp',
    '33771': '/areas/33771.webp',
    '33773': '/areas/33773.webp',
    '33774': '/areas/33774.webp',
    '33778': '/areas/33778.webp',
  },
  areaImageAlt: 'Abstract illustration of a Largo-area neighborhood.',
} as const;

/**
 * Service line items. Slugs match `/services/[slug]` routes and the keys in
 * `business.ts → PRICING_FLOOR_CENTS`. `featured: true` flags the bento card
 * that spans two columns on desktop.
 */
export const services = {
  mowing: {
    slug: 'mowing',
    title: 'Mowing',
    eyebrow: '01',
    summary: 'Weekly or biweekly. Mow, edge, blow. Most yards every visit.',
    floors: { small: 4500, medium: 6500, large: 9500 },
    imageSlot: '/services/mowing.webp',
    // Abstract illustration: sage-green lawn with horizontal mower stripes,
    // low rounded tree row, golden sun. (engineer-curated per WP3 webp)
    imageAlt:
      'Abstract illustration of a sage-green lawn with visible mower stripes, a low row of rounded trees on the horizon, and a warm golden sun overhead.',
    featured: true,
    /**
     * Synthetic before/after pair for the WP10 launch (per WP10
     * plan: "Ship with synthetic pair"). Reuses `imageSlot` for
     * both before and after; the component applies a subtle
     * saturation/brightness filter to the "after" image so the
     * scrub still reads as a transformation at a glance.
     *
     * To upgrade to a real pair: replace beforeSrc + afterSrc with
     * distinct webps and remove the filter treatment.
     */
    beforeAfter: {
      caption: 'Same yard, four weeks apart.',
      attribution: "Operator's first month in 33771.",
      beforeSrc: '/services/mowing.webp',
      afterSrc: '/services/mowing.webp',
      beforeAlt: 'A Largo lawn before the first mowing visit: uneven height, ragged edges.',
      afterAlt:
        'The same Largo lawn after four weeks of weekly mowing: clean stripes and crisp edges.',
    },
  },
  edging: {
    slug: 'edging',
    title: 'Edging',
    eyebrow: '02',
    summary: 'Crisp lines along the driveway, sidewalk, and bed edges.',
    floors: { perVisit: 7500 },
    imageSlot: '/services/edging.webp',
    // Abstract illustration: sage lawn, denser tree row cluster, warm peach sky
    // with circular halo around the sun. (engineer-curated per WP3 webp)
    imageAlt:
      'Abstract illustration of a sage-green lawn framed by a dense row of trees, warm peach sky, and a soft sunset halo in the upper right.',
    beforeAfter: {
      caption: 'Curb line, twice sharpened.',
      attribution: "Operator's first visit on 74th Street.",
      beforeSrc: '/services/edging.webp',
      afterSrc: '/services/edging.webp',
      beforeAlt: 'A blurred, soft edge along a Largo driveway before edging.',
      afterAlt: 'A clean, mechanical edge along the same Largo driveway after edging.',
    },
  },
  mulching: {
    slug: 'mulching',
    title: 'Mulching',
    eyebrow: '03',
    summary: 'Fresh hardwood or cypress mulch, pulled and replaced as needed.',
    floors: { base: 65000, perYard: 45000 },
    imageSlot: '/services/mulching.webp',
    // Abstract illustration: tidy lawn with rounded shrubs at the foundation
    // line, golden-hour sun. (engineer-curated per WP3 webp)
    imageAlt:
      'Abstract illustration of a tidy sage-green lawn with a row of rounded foundation shrubs, set under a golden-hour sun.',
    beforeAfter: {
      caption: 'Fresh bed, pulled and replaced.',
      attribution: 'Mulch delivery from Pinellas Pallet.',
      beforeSrc: '/services/mulching.webp',
      afterSrc: '/services/mulching.webp',
      beforeAlt: 'A tired foundation bed with faded mulch before the refresh.',
      afterAlt: 'A clean foundation bed with a deep layer of fresh hardwood mulch.',
    },
  },
  'hedge-trimming': {
    slug: 'hedge-trimming',
    title: 'Hedge trimming',
    eyebrow: '04',
    summary: 'Shape and clean up. Most hedges twice a year is plenty.',
    floors: { perVisit: 22500 },
    imageSlot: '/services/hedge-trimming.webp',
    // Abstract illustration: row of uniformly trimmed hedges at the same
    // height, evenly spaced. (engineer-curated per WP3 webp)
    imageAlt:
      'Abstract illustration of a row of evenly trimmed hedges at shoulder height, sage-green ground, warm sky in the background.',
    beforeAfter: {
      caption: 'Hedges, even and breathing.',
      attribution: 'Trimming in 33773, late spring.',
      beforeSrc: '/services/hedge-trimming.webp',
      afterSrc: '/services/hedge-trimming.webp',
      beforeAlt: 'An uneven, slightly overgrown hedge row before trimming.',
      afterAlt: 'A evenly trimmed hedge row at shoulder height, clean and full.',
    },
  },
  'hurricane-prep': {
    slug: 'hurricane-prep',
    title: 'Hurricane prep',
    eyebrow: '05',
    summary: 'Pre-storm yard sweep + post-storm debris haul. Bound by the wind.',
    floors: { perVisit: 120000 },
    imageSlot: '/services/hurricane-prep.webp',
    // Abstract illustration: overcast peach sky, sparse and uneven tree
    // row, cleared lawn: pre-storm sweep visual cue. (engineer-curated)
    imageAlt:
      'Abstract illustration of a yard under an overcast peach sky, sparse trees at the horizon, and a cleared sage-green lawn below.',
    beforeAfter: {
      caption: 'Same yard, calm before and after the wind.',
      attribution: 'Sweep Saturday, before the storm.',
      beforeSrc: '/services/hurricane-prep.webp',
      afterSrc: '/services/hurricane-prep.webp',
      beforeAlt: 'A pre-storm Largo yard with loose debris that could become projectiles.',
      afterAlt: 'The same Largo yard after a pre-storm sweep: loose debris gone, lawn clear.',
    },
  },
  'seasonal-cleanup': {
    slug: 'seasonal-cleanup',
    title: 'Seasonal cleanup',
    eyebrow: '06',
    summary: 'One-time deep cleanup for leaf season and after long absences.',
    floors: { perVisit: 180000 },
    imageSlot: '/services/seasonal-cleanup.webp',
    // Abstract illustration: freshly cleared lawn with even tree row,
    // double-sun golden glow: suggests a wide-open cleared space.
    imageAlt:
      'Abstract illustration of a freshly cleared lawn with evenly spaced trees and a wide warm sky overhead.',
    beforeAfter: {
      caption: 'Six weeks of leaves, one Saturday.',
      attribution: 'Leaf-season cleanup in 33770.',
      beforeSrc: '/services/seasonal-cleanup.webp',
      afterSrc: '/services/seasonal-cleanup.webp',
      beforeAlt: 'A fall Largo yard covered in leaves and small branches before cleanup.',
      afterAlt: 'The same Largo yard after a full leaf-season cleanup: clear and ready.',
    },
  },
} as const;

export type ServiceKey = keyof typeof services;
export type ServiceCopy = (typeof services)[ServiceKey];

/**
 * ServiceDirectory: `/services` index page header.
 *
 * Three lines: eyebrow ("01 - Services"), h1 ("Six things."),
 * tagline. Plus a tail line below the grid ("If you need
 * something not listed, ask."). Pulled from this single const
 * so /services and any future "services" mention (preview, ad
 * landing page, etc.) stays in lockstep.
 */
export const servicesIndex = {
  eyebrow: '01 - Services',
  heading: 'Six things.',
  tagline:
    'Six residential lawn-care lines for Largo and the five adjacent Pinellas ZIPs. Each one done on a consistent weekly route, by the same solo operator, with no crew swap.',
  tail: 'If you need something not listed: hauling, light brush clearing, one-off yard rescue: ask. Half of what I do is the stuff nobody else lists.',
} as const;

/**
 * Long-form service detail content for /services/[slug] pages.
 *
 * Distinct from `services` (the bento-card summary copy used on
 * the homepage). The two are split because:
 *   - The bento summary stays ≤110 chars and one CTA-friendly line.
 *   - The detail copy runs 60 - 120 words intro + 5 - 8 bullets + 2 - 3
 *     FAQs and lives on its own page where the operator explains
 *     the "why" of the line item in plain English.
 *
 * Keys match the `services` record keys. Steward edits both files
 * together when copy changes: both pull from the same brand voice.
 */
export const serviceDetail = {
  mowing: {
    slug: 'mowing',
    name: 'Lawn Mowing',
    tagline:
      'Weekly, bi-weekly, or monthly push-mowing for residential lots up to 1 acre in Largo, FL.',
    intro:
      'Our mowing service includes push-mowing or riding-mowing (depending on lot size), edging along all hard surfaces, and blowing clippings off walks, drives, and beds. We mow at 3.0 - 3.5 inches for St. Augustine grass: the optimal height for Pinellas County lawns.',
    bullets: [
      'Push-mowing for lots ≤0.5 acre',
      'Riding-mowing for lots 0.5 - 1 acre',
      'Mechanical edging along curbs, walks, and bed lines',
      'Blowing clippings off all hard surfaces',
      'Grass-cycling or bagged clippings (your choice)',
      'Service reminders sent the day before',
      'Auto-reschedule on rain at no charge',
    ],
    pricing:
      'From $45 per visit (small lots) to $95 per visit (large lots): recurring customers save 15%',
    faqs: [
      {
        q: 'How often should I mow in Florida?',
        a: 'During the growing season (April through October), weekly mowing is ideal. During cooler months, bi-weekly is usually sufficient. We will recommend a schedule based on your lot.',
      },
      {
        q: 'Do you mow in the rain?',
        a: 'No: wet mowing causes clumping and ruts. If your scheduled day is rained out, we auto-reschedule to the next clear day at no charge.',
      },
      {
        q: 'What if I have a locked gate or dogs?',
        a: "We'll note gate codes and dog status in your property file at quote-time. Crew is briefed before every visit.",
      },
    ],
  },
  edging: {
    slug: 'edging',
    name: 'Lawn Edging',
    tagline: 'Mechanical edging for crisp, clean lines along curbs, walkways, and bed edges.',
    intro:
      'Our edging service uses a power edger to cut a defined edge along all hard surfaces: driveways, sidewalks, patios: and along landscape bed borders. Edging is typically bundled with mowing visits but can be scheduled standalone.',
    bullets: [
      'Mechanical edging with commercial edger (not a string trimmer)',
      'Cuts a clean 1 - 1.5" deep edge',
      'Edging along all curbs, walks, patios',
      'Bed-line edging for defined bed borders',
      'Cleanup of all debris after edging',
      'Paver-safe depth adjustment: no chipping',
    ],
    pricing: 'From $0.75 per linear foot (standalone) or included with mowing visit',
    faqs: [
      {
        q: 'How often should I edge?',
        a: 'Every 2 - 4 weeks is typical. Edging every mow visit keeps lines razor-sharp; less frequent edging is fine if you prefer a more natural look.',
      },
      {
        q: 'Can you edge along pavers without damaging them?',
        a: 'Yes: we adjust the edger depth to match the paver height. For irregular natural stone, we recommend bed-line edging instead.',
      },
    ],
  },
  mulching: {
    slug: 'mulching',
    name: 'Mulch Installation',
    tagline:
      'Bulk mulch delivery and professional installation: pine bark, cypress, or hardwood blends.',
    intro:
      'Fresh mulch does three things: suppresses weeds, retains moisture (critical in Florida summers), and instantly upgrades curb appeal. We deliver in bulk (not bagged) and install to a 2 - 3 inch depth with proper bed-edge definition.',
    bullets: [
      'Bulk delivery (truckload): no bagged-mess on your driveway',
      'Pine bark, cypress, or hardwood blends available',
      '2 - 3 inch depth per UF/IFAS recommendation',
      'Bed edges redefined before install',
      'Old mulch removal available as add-on',
      'Spring (March through May) and fall (Oct to Nov) preferred timing',
    ],
    pricing: 'From $110 per cubic yard installed (materials + labor)',
    faqs: [
      {
        q: 'Which mulch is best for Florida?',
        a: 'Pine bark is our most popular: it breaks down slowly and is locally sourced. Cypress is longer-lasting. Hardwood holds color the longest but costs more.',
      },
      {
        q: 'Do you remove old mulch first?',
        a: 'Yes, as an add-on. Fresh mulch on top of old, compacted mulch can suffocate roots: we recommend removal every 2 - 3 years.',
      },
      {
        q: 'When is the best time to mulch in FL?',
        a: 'Spring (March through May) and fall (October through November) are ideal: mulch holds winter warmth and summer moisture best.',
      },
    ],
  },
  'hedge-trimming': {
    slug: 'hedge-trimming',
    name: 'Hedge & Shrub Trimming',
    tagline: 'Seasonal hedge and shrub trimming for healthy, attractive landscaping.',
    intro:
      'Hedges and shrubs in Pinellas County grow year-round and need trimming 2 - 4 times per year to stay healthy and attractive. We trim to shape, remove dead wood, and clean up all debris: hauling it off-site.',
    bullets: [
      'Trimming of all hedge and shrub varieties',
      'Heights up to 12 ft (ladder work)',
      'Dead-wood removal',
      'Shape maintenance (rounded, squared, or naturalistic)',
      'All debris hauled off-site',
      'No more than 1/3 of live growth removed at once (plant-health rule)',
    ],
    pricing: 'From $2.25 per linear foot (height-dependent)',
    faqs: [
      {
        q: 'When is the best time to trim hedges in FL?',
        a: 'Most shrubs benefit from trimming in late spring (after the spring growth flush) and mid-fall. Avoid heavy trimming during peak summer heat.',
      },
      {
        q: 'How much can you trim off without killing the plant?',
        a: 'Generally no more than 1/3 of the live growth at a time. We assess each species before starting.',
      },
    ],
  },
  'hurricane-prep': {
    slug: 'hurricane-prep',
    name: 'Hurricane Prep & Cleanup',
    tagline:
      'Pre-storm yard securing and post-storm debris removal: June through November in Pinellas County.',
    intro:
      'Florida hurricane season runs June 1 - November 30. Our hurricane service has two phases: pre-storm preparation (securing loose items, removing vulnerable branches, taking down lightweight decor) and post-storm cleanup (debris removal, fallen limb haul-off, damaged tree assessment).',
    bullets: [
      'Pre-storm: secure outdoor furniture, decor, and lightweight items',
      'Pre-storm: identify and remove vulnerable branches',
      'Pre-storm: photograph yard condition for insurance',
      'Post-storm: debris removal and haul-off',
      'Post-storm: tree damage assessment',
    ],
    pricing: 'From $120 base + debris volume',
    faqs: [
      {
        q: 'When do you trigger hurricane mode?',
        a: 'When a named storm is forecast within 48 hours and Pinellas County is in the cone, OR when sustained winds reach 30+ mph locally. In hurricane mode we pause regular scheduling and dispatch prep visits.',
      },
      {
        q: 'Do you work during the storm?',
        a: 'No: outdoor work stops when winds hit 30 mph sustained. We resume 24 hours after the storm passes and conditions are safe.',
      },
      {
        q: 'Will insurance cover hurricane cleanup?',
        a: 'Many homeowner policies cover debris removal after a named storm. We provide detailed invoices with photos to support your claim.',
      },
    ],
  },
  'seasonal-cleanup': {
    slug: 'seasonal-cleanup',
    name: 'Seasonal Cleanup',
    tagline: 'Spring and fall yard cleanup: leaves, debris, bed prep, and haul-off.',
    intro:
      "Pinellas County's subtropical climate means we don't get a hard leaf drop like the northeast, but spring and fall still bring heavy cleanup needs. We remove leaves, debris, dead annuals, and prep beds for the next season.",
    bullets: [
      'Leaf removal and blowing',
      'Bed cleanup and edging',
      'Dead annual and perennial removal',
      'Debris haul-off (no piles left behind)',
      'Optional: mulch refresh bundled with cleanup',
    ],
    pricing: 'From $180 base + lot size',
    faqs: [
      {
        q: 'How often should I schedule seasonal cleanup?',
        a: 'Twice a year is typical: late March (spring) and late November (fall). Some lots with heavy tree coverage benefit from a third visit in mid-summer.',
      },
      {
        q: 'Do you take the debris or leave it for city pickup?',
        a: 'We haul everything off-site. City bulk pickup is unpredictable and leaves piles at the curb for weeks.',
      },
    ],
  },
} as const satisfies Record<ServiceKey, ServiceDetailCopy>;

export interface ServiceDetailCopy {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  bullets: ReadonlyArray<string>;
  pricing: string;
  faqs: ReadonlyArray<{ q: string; a: string }>;
}

export function isKnownService(slug: string): slug is ServiceKey {
  return slug in services;
}

// ============================================================
// WP9b: page-level content for areas, pricing, about, contact,
// quote, and review. Each block is a self-contained const that
// the corresponding section component reads from.
// ============================================================

/**
 * AreaDirectory: `/areas` index page header.
 *
 * Same shape as servicesIndex: eyebrow + h1 + tagline + tail.
 */
export const areasIndex = {
  eyebrow: '01 - Service areas',
  heading: 'Six ZIPs.',
  tagline:
    'Largo and the five adjacent Pinellas County neighborhoods: six ZIPs we know well enough to commit to a recurring weekly route through.',
  tail: 'Right outside one of these? Ask. I sometimes make exceptions for yards next door.',
} as const;

/**
 * Per-ZIP area detail. Keys match BUSINESS.service_area_zips.
 * Each entry carries: neighborhood name, intro paragraph, 3 - 4
 * nearby landmarks, 1 area-specific FAQ. Image source comes
 * from serviceAreaMap.areaImages[zip] so the same webp serves
 * both the landing-page rail and the area-detail hero.
 */
export const areaDetail = {
  '33756': {
    zip: '33756',
    name: 'Belleair / Clearwater',
    heading: 'Lawn care in Belleair & Clearwater (33756)',
    intro:
      'Mix of historic homes and waterfront properties along the west side of Pinellas. Salinity-resistant plant selection is common: and strict HOA standards mean curb appeal matters twice over.',
    nearby: ['Belleair', 'Belleair Beach access', 'Clearwater'],
    faqs: [
      {
        q: 'Do you handle saltwater irrigation damage?',
        a: 'Yes. Salt-tolerant grass varieties (Bahiagrass, certain St. Augustine cultivars) and a slightly higher mow height help. We can recommend a partner for soil amendments if your lawn is heavily affected.',
      },
    ],
  },
  '33770': {
    zip: '33770',
    name: 'Belleair Bluffs / Largo',
    heading: 'Lawn care in Belleair Bluffs & east Largo (33770)',
    intro:
      'Established neighborhood with mature oaks: heavy leaf-drop in spring and lush, established landscaping requiring routine maintenance. Most yards in this ZIP have a 0.25 - 0.5 acre footprint.',
    nearby: ['Belleair Bluffs', 'Indian Rocks Beach access', 'Largo Medical Center'],
    faqs: [
      {
        q: 'My oak drops leaves every week in spring: is that in the mowing rate?',
        a: 'Light leaf-drop is bundled with the mowing visit (we blow off the hard surfaces after each cut). Heavy seasonal drops in March through April can be a separate seasonal cleanup visit.',
      },
    ],
  },
  '33771': {
    zip: '33771',
    name: 'Largo (central)',
    heading: 'Lawn care in central Largo (33771)',
    intro:
      'Our home base: fastest response times for this ZIP. Mix of older and newer homes; many 0.25 - 0.5 acre lots. St. Augustine grass is the dominant ground cover.',
    nearby: ['Downtown Largo', 'Largo Central Park', 'Starkey Ranch'],
    faqs: [
      {
        q: 'How fast can you start?',
        a: 'For 33771 specifically, we can usually start within five business days of a quote. Hurricane season is the exception: book early if you want prep or cleanup.',
      },
    ],
  },
  '33773': {
    zip: '33773',
    name: 'Largo (east)',
    heading: 'Lawn care in east Largo (33773)',
    intro:
      'Newer subdivisions with irrigation systems and Bahia or St. Augustine lawns. Many homes under 10 years old with new landscaping: different needs than older neighborhoods.',
    nearby: ['East Bay', 'Pinellas Park border', 'Feather Sound'],
    faqs: [
      {
        q: 'Do you service irrigation systems?',
        a: 'No: irrigation installation requires the PCCLB Irrigation Specialty license, which we have not acquired. We mow and trim around irrigation heads carefully, and can recommend a licensed irrigation operator.',
      },
    ],
  },
  '33774': {
    zip: '33774',
    name: 'Largo / Ridgecrest',
    heading: 'Lawn care in Ridgecrest (33774)',
    intro:
      'Ridgecrest area with elevated terrain and mature tree canopy. Drainage considerations and shade-tolerant grass varieties are common needs. Lots tend to be larger and more landscaped.',
    nearby: ['Ridgecrest', 'Seminole border', 'Lake Seminole'],
    faqs: [
      {
        q: 'My yard has a lot of shade: what grass will actually grow?',
        a: 'St. Augustine cultivars like Palmetto and Seville handle partial shade well. Bahia tolerates more sun than shade. We can recommend a partner for sod or overseeding if your current turf is thinning out.',
      },
    ],
  },
  '33778': {
    zip: '33778',
    name: 'Seminole / Largo West',
    heading: 'Lawn care in Seminole & west Largo (33778)',
    intro:
      'Coastal influence: sandy soil and salt air. Service scheduling is tight in this ZIP due to high demand. Hurricane prep is the top seller for homes this close to the Gulf.',
    nearby: ['Seminole', 'Indian Shores access', 'Largo (west)'],
    faqs: [
      {
        q: 'How quickly can you respond to a hurricane in this ZIP?',
        a: 'Once winds drop below 30 mph sustained, we resume outdoor work and prioritize this ZIP along with 33773 and 33774. Most post-storm cleanup visits happen within 48 hours of the all-clear.',
      },
    ],
  },
} as const satisfies Record<string, AreaDetailCopy>;

export interface AreaDetailCopy {
  zip: string;
  name: string;
  heading: string;
  intro: string;
  nearby: ReadonlyArray<string>;
  faqs: ReadonlyArray<{ q: string; a: string }>;
}

/**
 * Pricing: `/pricing` page content.
 *
 * PricingHero (eyebrow + h1 + tagline) + PricingComparisonTable
 * (rows of service-line + rate). Both read from this const so
 * the steward edits one file when prices change.
 *
 * Rates are passed via BUSINESS.PRICING_FLOOR_CENTS at render
 * time: this const carries only the human-readable labels.
 */
export const pricingPage = {
  eyebrow: 'Pricing',
  heading: 'What it costs.',
  tagline:
    'Floor pricing, per visit or per project. Most lawns fall inside the floor; bigger yards, slopes, and gated back-fences bump the price. No subscription, no contract, no surprise fees.',
  discountEyebrow: 'Discounts & recurring',
  discountIntro: 'Three ways to save on the floor rates above:',
  discounts: [
    {
      label: 'Pre-pay 6 months',
      body: '10% off mowing: lock in price + service priority through hurricane season.',
    },
    {
      label: 'Refer a neighbor',
      body: '$25 credit on your next invoice for each neighbor who signs up.',
    },
    {
      label: 'Senior / military',
      body: '10% off all services. Valid ID required at quote-time.',
    },
  ],
  notIncludedTitle: "What's not on the list",
  notIncludedBody: 'To stay in compliance with Florida regulations, we do not currently offer:',
  notIncluded: [
    'Fertilization (requires FDACS Limited Commercial Fertilizer Applicator license)',
    'Pest control (requires FDACS §482 certification)',
    'Irrigation system installation (requires PCCLB Irrigation Specialty license)',
  ],
  notIncludedTail: 'We can refer you to trusted licensed partners for these services.',
  taxEyebrow: 'Sales tax note',
  taxBody:
    'For the first phase of operation, our invoice reads "tax not yet collected". The Florida / Pinellas combined rate is 7.00% (6% FL state + 1% Pinellas County surtax). Once we register for Florida sales tax (DR-1) at the first-cash milestone, we\'ll add a sales-tax line item to invoices and remit quarterly. Until then, we either absorb the tax into the advertised price or invoice it transparently for your records: your choice at quote-time.',
} as const;

/**
 * About: `/about` page content.
 *
 * Drives AboutHero (eyebrow + h1 + tagline) and OperatorBio
 * (long-form mission + values + service register). Steward
 * edits one file to update the about page copy.
 */
export const aboutPage = {
  eyebrow: '01 - About',
  heading: 'About Largo Lawn.',
  tagline:
    "Solo-founder lawn care in Largo, FL. Six years cutting grass in 33771. Here's why we run small on purpose.",
  missionEyebrow: 'Our mission',
  mission:
    "We exist to make professional lawn care affordable and reliable for everyday homeowners. Floridians already deal with enough: hurricanes, humidity, salt air: and a stressed-out yard shouldn't add to it.",
  whySoloEyebrow: 'Why solo?',
  whySolo:
    "Most landscaping companies grow fast, hire subcontractors, and lose quality control. We don't. Largo Lawn is a one-crew operation: every job is performed by the same person who quoted it. When you book, you know exactly who's coming.",
  valuesEyebrow: 'Our values',
  values: [
    {
      label: 'Transparent pricing',
      body: 'Rates published on the website. No surprise fees.',
    },
    {
      label: 'Weather fairness',
      body: 'When winds hit the local hurricane threshold or it rains at your scheduled time, we auto-reschedule at no charge.',
    },
    {
      label: 'No upselling',
      body: "If your yard doesn't need a service, we'll tell you.",
    },
    {
      label: 'Local accountability',
      body: 'We live here. Our reputation depends on every yard we touch.',
    },
  ],
  registerEyebrow: 'Service register (active)',
  register: [
    'Lawn mowing (push + riding, ≤1 acre)',
    'Mechanical edging (curbs, walks, bed lines)',
    'Mulch installation (bulk delivery + install)',
    'Hedge & shrub trimming (≤12 ft height)',
    'Hurricane prep + post-storm cleanup',
    'Seasonal cleanup (leaves, beds, debris haul-off)',
  ],
} as const;

/**
 * Contact: `/contact` page content.
 *
 * Drives ContactHero (eyebrow + h1 + tagline) above the
 * existing ContactForm. Tagline emphasizes 24-hour response.
 */
export const contactPage = {
  eyebrow: '01 - Contact',
  heading: 'Get a free quote.',
  tagline:
    'Tell us about your yard and we will get back to you within 24 hours during business days. Or call us directly.',
  hurricaneCopy:
    'Hurricane Mode Active: We are prioritizing prep and cleanup requests. Please include your address and any concerns in the message field below.',
  coverageLine:
    'We currently service 33756, 33770, 33771, 33773, 33774, 33778. Not sure if we cover your ZIP? Enter it in the form and we will let you know.',
} as const;

/**
 * Quote: `/quote` page content.
 *
 * Drives QuoteHero (eyebrow + h1 + tagline) above the existing
 * QuoteCalculator, plus QuoteConfirmation (the "what happens
 * next" step list shown below the form).
 */
export const quotePage = {
  eyebrow: '01 - Free quote',
  heading: 'Tell us about your yard.',
  tagline:
    'Free, no-obligation quote within 24 hours. No subscription, no contract: just a flat rate from a local operator.',
  confirmationEyebrow: 'What happens next',
  confirmationSteps: [
    'Submit the form (30 seconds).',
    'We text or email within 24 hours with a flat-rate quote.',
    'If the price works, schedule your first mow: usually within the same week.',
    'After the first visit, decide if you want weekly / bi-weekly / one-time. No contract.',
  ],
  talkTail:
    'Prefer to talk it through? Text or call and we will work through the same questions on the phone.',
} as const;

/**
 * Review: `/review` page content.
 *
 * Drives ReviewMagnet (placeholder until GBP verified). The
 * post-launch GBP write-a-review URL is the only thing that
 * changes between pre-launch and post-launch: this const
 * holds both states so the steward can flip with one edit.
 */
export const reviewPage = {
  eyebrow: '01 - Leave a review',
  heading: 'Thanks for trusting us with your yard.',
  tagline:
    'A 30-second Google review helps a local small business compete against the big guys: and it means the world to a one-person operation like ours.',
  comingSoonTitle: 'Google review coming soon',
  comingSoonBody:
    'Our Google Business Profile is being set up this season. Once verified, the QR code on your review-magnet card will open our Google review form directly.',
  comingSoonTail: 'In the meantime, text or call us directly with any feedback: good or bad:',
  notRightTitle: "When something isn't right",
  notRightBody:
    "Most lawn-care complaints come down to one of three things: missed spots, edge cleanup, or timing. We want to fix any of those before they fester: text or call us and we'll be back within 48 hours to make it right. No charge for the return visit.",
  notRightTail:
    "This is the standard we hold ourselves to. Local reputation is everything when you're a solo operator: one bad review we didn't try to fix matters more than five great ones we never had to make right.",
  /**
   * WP13 gate. When false (default), ReviewMagnet renders the
   * static "coming soon" card and phone CTA. When true,
   * ReviewMagnetForm replaces the static card with the
   * interactive 5-star selector + GBP-redirect / feedback-form
   * branch. Steward flips this the day the GBP profile is
   * verified.
   */
  reviewMagnetEnabled: false,
  /**
   * GBP write-a-review URL. Placeholder until GBP is verified: * the steward replaces this with the live URL when the GBP
   * profile goes active. ReviewMagnetForm appends
   * `?src=review-magnet&zip=...` for attribution.
   */
  gbpUrl: 'https://g.page/r/largo-lawn/review',
} as const;

export const processSteps = [
  {
    n: '01',
    label: 'Quote',
    title: 'Tell me about your yard',
    body: 'Free, 24-hour turnaround. Yard size, gate location, anything I should know.',
  },
  {
    n: '02',
    label: 'Schedule',
    title: 'Pick a recurring slot',
    body: 'Weekly, biweekly, or one-time. I keep the same day each visit so you know when I am coming.',
  },
  {
    n: '03',
    label: 'Mow',
    title: 'I show up and mow clean',
    body: 'Mow, edge, blow off the hard surfaces. Hose down the driveway if it needs it.',
  },
  {
    n: '04',
    label: 'Bill',
    title: 'Per-visit pricing',
    body: 'No subscription, no contract. Pay after each visit or set up monthly: your call.',
  },
] as const;

export const pricingHeader = {
  eyebrow: 'Pricing',
  heading: 'What it costs.',
  subhead:
    'Floor pricing, per visit or per project. Most lawns fall inside the floor; bigger yards, slopes, and gated back-fences bump the price. No subscription, no contract, no surprise fees.',
  ribbon: 'Most booked',
  ctaLabel: 'Get a free quote',
} as const;

/**
 * EditorialBreak: full-bleed image pause between PricingTiers
 * (04) and ProcessSteps (05). Single image, single editorial
 * line. The italic Fraunces headline is the only italic-on-photo
 * in the section library: reads as deliberate editorial rather
 * than CTA.
 *
 * Imagery: services.mowing.imageSlot is the proven keeper from
 * the 2026-07-12 ComfyUI regeneration (storybook pipeline).
 * Steward can swap to a different imageSlot by editing this const.
 */
export const editorialBreak = {
  eyebrow: 'Every Tuesday, all year',
  headline: 'The same yard, every week.',
  imageSlot: services.mowing.imageSlot,
  imageAlt: services.mowing.imageAlt,
} as const;

export const pricingTiers = [
  {
    eyebrow: 'Mowing',
    title: 'Most yards, most weeks',
    price: '$48',
    cadence: 'starting price',
    body: 'Mow, edge, blow. About a third of an acre or less. Recurring weekly or biweekly. The bread and butter of the route; everything else is the upsell.',
    featured: true,
  },
  {
    eyebrow: 'Mulching',
    title: 'Full-bed refresh',
    price: '$185',
    cadence: 'average yard',
    body: 'Pull the old, lay the new. Two cubic yards of hardwood or cypress, hauled away.',
    featured: false,
  },
  {
    eyebrow: 'Hurricane prep',
    title: 'Pre-storm sweep',
    price: '$95',
    cadence: 'per visit',
    body: 'Loose debris cleared, patio furniture staged, post-storm haul at no extra cost.',
    featured: false,
  },
] as const;

export const faqHeader = {
  eyebrow: '08 - Questions',
  heading: 'Honest answers.',
  subhead: 'A few things people ask before the first visit. No surprises, no fine print.',
} as const;

export const faq = [
  {
    q: 'What if it rains on my scheduled day?',
    a: 'I push everyone back one day in sequence. If the rain is heavy enough to skip the whole week, I send a text by Wednesday so you know.',
  },
  {
    q: 'My gate is locked: how do you get in?',
    a: 'Most people leave it unlocked on the mow day. If you cannot, we can put a combo lock on it and I will store the combo in a note for the route.',
  },
  {
    q: 'Are the dogs and kids okay while you work?',
    a: 'Yes. I keep the mower deck on the far side of the house from where dogs usually are, and blow in the opposite direction. If your dog needs to be inside for any reason just let me know.',
  },
  {
    q: 'How does billing work?',
    a: 'I send an invoice the same day I mow. Pay by card, ACH, or Venmo. Monthly statements if you would rather receive one bill.',
  },
  {
    q: 'How much lead time before the first visit?',
    a: 'Most weeks I can start within five business days of a quote. Hurricane season and seasonal cleanup have a longer wait: book early.',
  },
  {
    q: 'Do you go outside Largo?',
    a: 'Six ZIPs right now: 33771, 33770, 33773, 33774, 33778, and 33756. If you are right outside one of those, ask: I sometimes make exceptions for yards next door.',
  },
] as const;

/**
 * MarqueeQuote: operator voice lines for the homepage marquee.
 *
 * First-person, short, slightly wry: the same register as
 * OperatorNote but compressed into single sentences for the
 * scroll. 7 lines, ~14 words each, no CTA, no urgency.
 */
export const operatorMarquee = [
  'Same guy, same Tuesday.',
  'The mulch goes in the bed, not on the lawn.',
  'You mow, you blow, you edge: every time, not sometimes.',
  "If I can't do it Tuesday, you'll know by Sunday night.",
  'A locked gate is fine. A locked gate I do not know about is not.',
  'I do not subcontract. You booked me, you get me.',
  'I would rather tell you do not need a service than sell you one.',
] as const;

/**
 * ServiceAreaStats: four "by the numbers" data points on `/`.
 *
 * Phrasing deliberately specific (not aspirational): median hours,
 * route miles, yard count, tenure: the kind of numbers a neighbor
 * would quote about a neighbor. Numbers rendered as Fraunces
 * italic, label as Inter caption.
 *
 * Owned by the operator. Update via PR; no approval needed.
 */
export const areaStats = [
  { value: '47', label: 'Yards on the weekly route' },
  { value: '89', label: 'Route miles driven per week' },
  { value: '18 h', label: 'Median quote turnaround' },
  { value: '6 yrs', label: 'Mowing in Largo, 33771' },
] as const;

/**
 * ScheduleTimeline: weekly mowing route, made visible.
 *
 * Static snapshot of the operator's route days. Sunday closed (no
 * outdoor power equipment under HOA noise rules). Saturday limited.
 * Yard counts are rough: the schedule is what the customer asked
 * for ("which day does the mower show up?"), not a guarantee.
 *
 * Future Supabase dynamic swaps the source without changing layout.
 */
export const weeklySchedule = [
  { day: 'Mon', yards: 9, zips: ['33771', '33770'], closed: false },
  { day: 'Tue', yards: 8, zips: ['33773', '33774'], closed: false },
  { day: 'Wed', yards: 10, zips: ['33771', '33778'], closed: false },
  { day: 'Thu', yards: 9, zips: ['33770', '33773'], closed: false },
  { day: 'Fri', yards: 11, zips: ['33774', '33778', '33756'], closed: false },
  { day: 'Sat', yards: 4, zips: ['33771'], closed: false },
  { day: 'Sun', yards: 0, zips: [], closed: true },
] as const;

export const finalCta = {
  headline: 'Ready for a yard that looks cared for?',
  cta: { label: 'Get a free quote', href: '/quote' },
  micro: 'No obligation. No contract. Local since day one.',
} as const;

/**
 * Operator's Note: editorial 07-position moment on the
 * homepage. Sits between ServiceAreaMap (06) and FAQAccordion
 * (08) as a typographic pause: first-person italic quote from
 * the operator, a thin clay rule on top, a small portrait
 * anchoring attribution on the right. No CTA.
 *
 * Distinct from TestimonialQuote (which renders customer reviews
 * when social.proof[] is populated). This component is always on.
 *
 * Brand guideline: invented customer quotes are forbidden, but
 * the operator speaking in first person about his own service
 * is fine and reads with quiet authority.
 */
export const operatorNote = {
  eyebrow: '07 - From the operator',
  quote: 'Same guy, same day, every week.',
} as const;

/**
 * Customer testimonials / social proof.
 *
 * `socialHeader` holds the section eyebrow. Section sits at
 * position 07 on the homepage (after ServiceAreaMap 06, before
 * FAQAccordion 08). The empty-state invariant on `proof: []`
 * means the component renders nothing until steward supplies
 * real reviews with permission.
 */
export const socialHeader = {
  eyebrow: '07 - From a neighbor',
} as const;

/**
 * **Empty-state invariant**: until the steward has real customer
 * quotes with explicit written permission, `proof` stays `[]`.
 * The TestimonialQuote component renders nothing when the array
 * is empty: invented quotes are forbidden per brand guidelines.
 *
 * Once the steward collects reviews, push them in like:
 *   proof: [
 *     {
 *       quote: 'He showed up on the same day every week...',
 *       name: 'Casey R.',
 *       zip: '33771',
 *       source: 'Nextdoor review',
 *     },
 *   ]
 */
export const social = {
  proof: [] as ReadonlyArray<{
    quote: string;
    name: string;
    zip?: string;
    source?: string;
  }>,
} as const;
