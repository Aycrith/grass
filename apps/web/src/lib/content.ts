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
 * Customer testimonials / social proof.
 *
 * **Empty-state invariant**: until the steward has real customer
 * quotes with explicit written permission, this stays `proof: []`.
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
