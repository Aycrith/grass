/**
 * Page content — Mission 1
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
  eyebrow: '01 — Lawn care in 33771',
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
} as const;

export const trustStrip = {
  copy: 'Proudly serving 33771 · 33770 · 33773 · 33774 · 33778 · 33756 — and counting.',
} as const;

/**
 * Service area map — section 06 on the landing page.
 *
 * Renders the schematic Pinellas peninsula with 6 ZIP pins (one per
 * `BUSINESS.service_area_zips`). `pinLocations` pairs each ZIP with a
 * neighborhood label rendered both inside the pin tooltip and in
 * the side rail. Layout coordinates (x/y per pin) live in the
 * component, not here — they're SVG layout config, not copy.
 *
 * Adding a new service-area ZIP only needs two edits:
 *   1. Add the ZIP to `BUSINESS.service_area_zips` and
 *      `PIN_LAYOUT` (in the component).
 *   2. Add the matching label here.
 */
export const serviceAreaMap = {
  eyebrow: '06 — Where I mow',
  heading: 'Six ZIPs, one route.',
  subhead:
    'We keep the service area tight on purpose — six ZIPs across Largo and the adjacent Pinellas neighborhoods. If you are right outside one of these, ask; I sometimes make exceptions for yards next door.',
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
   * Generic alt text — these are abstract illustrations, not
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
     * Real customer before/after pair. Stays `null` until the steward
     * captures operator's own yard with written homeowner permission.
     * PinnedBeforeAfter mounts on /services/mowing only when both
     * before and after image slots exist AND `permission: true` is
     * set. Default state: nothing renders, page stays honest.
     */
    beforeAfter: {
      before: null as string | null,
      after: null as string | null,
      permission: false,
      caption: null as string | null,
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
    beforeAfter: undefined,
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
    beforeAfter: undefined,
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
    beforeAfter: undefined,
  },
  'hurricane-prep': {
    slug: 'hurricane-prep',
    title: 'Hurricane prep',
    eyebrow: '05',
    summary: 'Pre-storm yard sweep + post-storm debris haul. Bound by the wind.',
    floors: { perVisit: 120000 },
    imageSlot: '/services/hurricane-prep.webp',
    // Abstract illustration: overcast peach sky, sparse and uneven tree
    // row, cleared lawn — pre-storm sweep visual cue. (engineer-curated)
    imageAlt:
      'Abstract illustration of a yard under an overcast peach sky, sparse trees at the horizon, and a cleared sage-green lawn below.',
    beforeAfter: undefined,
  },
  'seasonal-cleanup': {
    slug: 'seasonal-cleanup',
    title: 'Seasonal cleanup',
    eyebrow: '06',
    summary: 'One-time deep cleanup for leaf season and after long absences.',
    floors: { perVisit: 180000 },
    imageSlot: '/services/seasonal-cleanup.webp',
    // Abstract illustration: freshly cleared lawn with even tree row,
    // double-sun golden glow — suggests a wide-open cleared space.
    imageAlt:
      'Abstract illustration of a freshly cleared lawn with evenly spaced trees and a wide warm sky overhead.',
    beforeAfter: undefined,
  },
} as const;

export type ServiceKey = keyof typeof services;
export type ServiceCopy = (typeof services)[ServiceKey];

/**
 * ServiceDirectory — `/services` index page header.
 *
 * Three lines: eyebrow ("01 — Services"), h1 ("Six things."),
 * tagline. Plus a tail line below the grid ("If you need
 * something not listed, ask."). Pulled from this single const
 * so /services and any future "services" mention (preview, ad
 * landing page, etc.) stays in lockstep.
 */
export const servicesIndex = {
  eyebrow: '01 — Services',
  heading: 'Six things.',
  tagline:
    'Six residential lawn-care lines for Largo and the five adjacent Pinellas ZIPs. Each one done on a consistent weekly route, by the same solo operator, with no crew swap.',
  tail: 'If you need something not listed — hauling, light brush clearing, one-off yard rescue — ask. Half of what I do is the stuff nobody else lists.',
} as const;

/**
 * Long-form service detail content for /services/[slug] pages.
 *
 * Distinct from `services` (the bento-card summary copy used on
 * the homepage). The two are split because:
 *   - The bento summary stays ≤110 chars and one CTA-friendly line.
 *   - The detail copy runs 60–120 words intro + 5–8 bullets + 2–3
 *     FAQs and lives on its own page where the operator explains
 *     the "why" of the line item in plain English.
 *
 * Keys match the `services` record keys. Steward edits both files
 * together when copy changes — both pull from the same brand voice.
 */
export const serviceDetail = {
  mowing: {
    slug: 'mowing',
    name: 'Lawn Mowing',
    tagline:
      'Weekly, bi-weekly, or monthly push-mowing for residential lots up to 1 acre in Largo, FL.',
    intro:
      'Our mowing service includes push-mowing or riding-mowing (depending on lot size), edging along all hard surfaces, and blowing clippings off walks, drives, and beds. We mow at 3.0–3.5 inches for St. Augustine grass — the optimal height for Pinellas County lawns.',
    bullets: [
      'Push-mowing for lots ≤0.5 acre',
      'Riding-mowing for lots 0.5–1 acre',
      'Mechanical edging along curbs, walks, and bed lines',
      'Blowing clippings off all hard surfaces',
      'Grass-cycling or bagged clippings (your choice)',
      'Service reminders sent the day before',
      'Auto-reschedule on rain at no charge',
    ],
    pricing:
      'From $45 per visit (small lots) to $95 per visit (large lots) — recurring customers save 15%',
    faqs: [
      {
        q: 'How often should I mow in Florida?',
        a: 'During the growing season (April–October), weekly mowing is ideal. During cooler months, bi-weekly is usually sufficient. We will recommend a schedule based on your lot.',
      },
      {
        q: 'Do you mow in the rain?',
        a: 'No — wet mowing causes clumping and ruts. If your scheduled day is rained out, we auto-reschedule to the next clear day at no charge.',
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
      'Our edging service uses a power edger to cut a defined edge along all hard surfaces — driveways, sidewalks, patios — and along landscape bed borders. Edging is typically bundled with mowing visits but can be scheduled standalone.',
    bullets: [
      'Mechanical edging with commercial edger (not a string trimmer)',
      'Cuts a clean 1–1.5" deep edge',
      'Edging along all curbs, walks, patios',
      'Bed-line edging for defined bed borders',
      'Cleanup of all debris after edging',
      'Paver-safe depth adjustment — no chipping',
    ],
    pricing: 'From $0.75 per linear foot (standalone) or included with mowing visit',
    faqs: [
      {
        q: 'How often should I edge?',
        a: 'Every 2–4 weeks is typical. Edging every mow visit keeps lines razor-sharp; less frequent edging is fine if you prefer a more natural look.',
      },
      {
        q: 'Can you edge along pavers without damaging them?',
        a: 'Yes — we adjust the edger depth to match the paver height. For irregular natural stone, we recommend bed-line edging instead.',
      },
    ],
  },
  mulching: {
    slug: 'mulching',
    name: 'Mulch Installation',
    tagline:
      'Bulk mulch delivery and professional installation — pine bark, cypress, or hardwood blends.',
    intro:
      'Fresh mulch does three things: suppresses weeds, retains moisture (critical in Florida summers), and instantly upgrades curb appeal. We deliver in bulk (not bagged) and install to a 2–3 inch depth with proper bed-edge definition.',
    bullets: [
      'Bulk delivery (truckload) — no bagged-mess on your driveway',
      'Pine bark, cypress, or hardwood blends available',
      '2–3 inch depth per UF/IFAS recommendation',
      'Bed edges redefined before install',
      'Old mulch removal available as add-on',
      'Spring (March–May) and fall (Oct–Nov) preferred timing',
    ],
    pricing: 'From $110 per cubic yard installed (materials + labor)',
    faqs: [
      {
        q: 'Which mulch is best for Florida?',
        a: 'Pine bark is our most popular — it breaks down slowly and is locally sourced. Cypress is longer-lasting. Hardwood holds color the longest but costs more.',
      },
      {
        q: 'Do you remove old mulch first?',
        a: 'Yes, as an add-on. Fresh mulch on top of old, compacted mulch can suffocate roots — we recommend removal every 2–3 years.',
      },
      {
        q: 'When is the best time to mulch in FL?',
        a: 'Spring (March–May) and fall (October–November) are ideal — mulch holds winter warmth and summer moisture best.',
      },
    ],
  },
  'hedge-trimming': {
    slug: 'hedge-trimming',
    name: 'Hedge & Shrub Trimming',
    tagline: 'Seasonal hedge and shrub trimming for healthy, attractive landscaping.',
    intro:
      'Hedges and shrubs in Pinellas County grow year-round and need trimming 2–4 times per year to stay healthy and attractive. We trim to shape, remove dead wood, and clean up all debris — hauling it off-site.',
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
      'Pre-storm yard securing and post-storm debris removal — June through November in Pinellas County.',
    intro:
      'Florida hurricane season runs June 1 – November 30. Our hurricane service has two phases: pre-storm preparation (securing loose items, removing vulnerable branches, taking down lightweight decor) and post-storm cleanup (debris removal, fallen limb haul-off, damaged tree assessment).',
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
        a: 'No — outdoor work stops when winds hit 30 mph sustained. We resume 24 hours after the storm passes and conditions are safe.',
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
    tagline: 'Spring and fall yard cleanup — leaves, debris, bed prep, and haul-off.',
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
        a: 'Twice a year is typical — late March (spring) and late November (fall). Some lots with heavy tree coverage benefit from a third visit in mid-summer.',
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
    body: 'No subscription, no contract. Pay after each visit or set up monthly — your call.',
  },
] as const;

export const pricingHeader = {
  eyebrow: '04 — Pricing',
  heading: 'What it costs.',
  subhead:
    'Floor pricing, per visit or per project. Most lawns fall inside the floor; bigger yards, slopes, and gated back-fences bump the price. No subscription, no contract, no surprise fees.',
  ribbon: 'Most booked',
  ctaLabel: 'Get a quote',
} as const;

/**
 * EditorialBreak — full-bleed image pause between PricingTiers
 * (04) and ProcessSteps (05). Single image, single editorial
 * line. The italic Fraunces headline is the only italic-on-photo
 * in the section library — reads as deliberate editorial rather
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
    body: 'Mow, edge, blow. About a third of an acre or less. Recurring weekly or biweekly.',
    featured: false,
  },
  {
    eyebrow: 'Mulching',
    title: 'Full-bed refresh',
    price: '$185',
    cadence: 'average yard',
    body: 'Pull the old, lay the new. Two cubic yards of hardwood or cypress, hauled away.',
    featured: true,
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
  eyebrow: '08 — Questions',
  heading: 'Honest answers.',
  subhead: 'A few things people ask before the first visit. No surprises, no fine print.',
} as const;

export const faq = [
  {
    q: 'What if it rains on my scheduled day?',
    a: 'I push everyone back one day in sequence. If the rain is heavy enough to skip the whole week, I send a text by Wednesday so you know.',
  },
  {
    q: 'My gate is locked — how do you get in?',
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
    a: 'Most weeks I can start within five business days of a quote. Hurricane season and seasonal cleanup have a longer wait — book early.',
  },
  {
    q: 'Do you go outside Largo?',
    a: 'Six ZIPs right now: 33771, 33770, 33773, 33774, 33778, and 33756. If you are right outside one of those, ask — I sometimes make exceptions for yards next door.',
  },
] as const;

export const finalCta = {
  headline: 'Ready for a yard that looks cared for?',
  cta: { label: 'Get my free quote', href: '/quote' },
  micro: 'No obligation. No contract. Local since day one.',
} as const;

/**
 * Operator's Note — editorial 07-position moment on the
 * homepage. Sits between ServiceAreaMap (06) and FAQAccordion
 * (08) as a typographic pause — first-person italic quote from
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
  eyebrow: '07 — From the operator',
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
  eyebrow: '07 — From a neighbor',
} as const;

/**
 * **Empty-state invariant**: until the steward has real customer
 * quotes with explicit written permission, `proof` stays `[]`.
 * The TestimonialQuote component renders nothing when the array
 * is empty — invented quotes are forbidden per brand guidelines.
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
