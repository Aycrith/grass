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
  secondaryCta: { label: 'Call (727) 313-8011', href: 'tel:+17273138011' },
  /**
   * D-0049 — second pinned scene that appears after the photo
   * (scroll > 0.40). Copy voice matches scene 1 but shifts from
   * the introductory "neighbor's lawnmower" beat into the
   * commitment beat: same yard, same day, every week. The painted
   * Florida-ranch-house illustration reads as a chapter-opener /
   * editorial spread, so the copy stays quiet and brand-anchored
   * to operator voice. Restored from D-0047 (the "Walked past
   * Tuesday." draft was a copy regression that didn't match the
   * painted illustration's character).
   */
  scene2: {
    eyebrow: 'CHAPTER 2 — THE COMMITMENT',
    headline: 'Same yard, every week.',
    subhead:
      'No swap, no franchise markup. The same operator shows up at the same address on the same day, until you say stop.',
    primaryCta: { label: 'See my route', href: '/service-areas' },
    secondaryCta: { label: 'See pricing', href: '/pricing' },
  },
  /**
   * D-0050 Phase 3 — per-ZIP card strip rendered at the bottom of
   * scene 3 (the painted ranch house). 6 cards, one per service
   * area ZIP, each with the painted area image + ZIP + label.
   * Clickable hint that anchors the visitor's "I want to see MY
   * area" intent: scroll past the editorial column, then pick a
   * ZIP to dive into the area page.
   *
   * The cards reuse the existing `serviceAreaMap.pinLocations`
   * labels and `areaImages` images, so adding/removing a ZIP only
   * needs one edit in this file (and the corresponding area page).
   *
   * Renders only in scene 3; fades in across scroll [0.70, 0.85]
   * (during the resting state of the painted scene) and persists
   * until the section ends. Stays out of the photo cross-fade
   * window so it doesn't compete with the route pin in scene 2.
   */
  /**
   * D-0059 Path A — scene 3 used to render a per-ZIP card strip
   * (D-0050 Phase 3). That strip duplicated data already carried
   * by the ServiceAreaMap section below the hero (the ZIP form
   * + 6 ZIP chips + neighborhood labels). The strip is deleted;
   * the ServiceAreaMap section remains the single source of
   * per-ZIP navigation.
   *
   * D-0059 Path A — scene 1 used to render a service-area callout
   * pill below the eyebrow (D-0050 Phase 1a). The pill duplicated
   * the eyebrow "Lawn care in 33771" signal; the ServiceAreaMap
   * form is the actual answer to "do you cover my address?". The
   * pill is deleted.
   *
   * D-0059 Path A — scene 1 used to render a cartoon operator +
   * walk-behind mower (D-0050 Phase 1b). The OperatorStrip section
   * below the hero carries the operator identity; the in-hero
   * cartoon operator duplicated that identity. The cartoon operator
   * SVG is deleted.
   *
   * See governance/decisions/0059-hero-simplification-and-extension.md
   * §2.1 + §2.3 for the full rationale.
   */
  scene3: {},
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
 * Adding a new service-area ZIP needs 3 edits:
 *   1. Add the ZIP to `BUSINESS.service_area_zips`.
 *   2. Add the matching label to `serviceAreaMap.pinLocations` (the
 *      `Record<BusinessZip, string>` type below fails compilation
 *      if a key is missing, so TypeScript catches it).
 *   3. Add the layout entry to `PIN_LAYOUT` (in the component).
 */
import { BUSINESS } from './business';

type BusinessZip = (typeof BUSINESS.service_area_zips)[number];

export const serviceAreaMap: {
  eyebrow: string;
  heading: string;
  subhead: string;
  svgAriaLabel: string;
  tampaBayLabel: string;
  gulfOfMexicoLabel: string;
  railTitle: string;
  pinLocations: Record<BusinessZip, string>;
} = {
  eyebrow: 'Where I mow',
  // D-0028: heading + subhead retargeted from "Six ZIPs, one route." to
  // lead with the neighborhood word the user actually thinks in. The ZIP
  // input is right below, so the section label now matches how a Largo
  // homeowner talks about their address (street + neighborhood), not how
  // their postal code reads on an envelope.
  heading: 'Six Pinellas neighborhoods. One route.',
  subhead:
    'Type your ZIP or neighborhood name  -  I will get back to you with a quote. Home base is Largo and the surrounding Pinellas County neighborhoods, but I am flexible about nearby ZIPs while I am building the route.',
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
};

/**
 * Per-ZIP service-area images. D-0034: storybook-painted
 * neighborhood scenes generated via the ComfyUI pipeline at
 * `apps/comfyui/prompts/area.md`, one webp per ZIP. The same
 * image renders as the per-area hero on `/areas/[zip]`. Each
 * image is 1200x675 webp, ~64-74KB, painted style with the
 * brand's 9-token palette.
 */
export const areaImages: Readonly<Record<string, string>> = {
  '33756': '/areas/33756.webp',
  '33770': '/areas/33770.webp',
  '33771': '/areas/33771.webp',
  '33773': '/areas/33773.webp',
  '33774': '/areas/33774.webp',
  '33778': '/areas/33778.webp',
};

/**
 * Per-ZIP detail content for `/areas/[zip]` pages. D-0034:
 * substantive local content, not the placeholder copy D-0026/27/28
 * shipped. Each block has:
 *
 *   - `name`     Short neighborhood label (matches pinLocations).
 *   - `longName` Long-form name used in the hero h1 + metadata.
 *   - `tagline`  1-2 sentence intro for the hero subhead.
 *   - `intro`    2-3 sentence paragraph for the hero body.
 *   - `about`    2-3 paragraphs of real local content
 *                (neighborhood character, local landmarks, what
 *                mows like here).
 *   - `landmarks` List of 4-5 real nearby landmarks the user
 *                would recognize.
 *   - `challenges` 3 bullets of common lawn challenges here.
 *   - `whatWeDo`   3-4 bullets of the operator's specific
 *                approach for this ZIP.
 *   - `faqs`     3-4 per-ZIP questions (the 1-question placeholder
 *                density D-0026/27 had is gone).
 *
 * Copy is grounded in:
 *   - research/seo/largo-keyword-map.md (long-tail ZIP keywords)
 *   - research/regulatory/largo-licensing-map.yaml (legal scope)
 *   - research/suppliers/largo.yaml (SiteOne Largo, Horizon
 *     Pinellas, Pinellas Tractor  -  real local businesses)
 *   - First-person operator voice per brand/guidelines.md
 */
export interface AreaDetail {
  zip: string;
  name: string;
  longName: string;
  tagline: string;
  intro: string;
  about: ReadonlyArray<string>;
  landmarks: ReadonlyArray<string>;
  challenges: ReadonlyArray<string>;
  whatWeDo: ReadonlyArray<string>;
  faqs: ReadonlyArray<{ q: string; a: string }>;
  /** Hint for narrative voice. Currently always 'standard'. */
  voice: 'standard';
}

export const areaDetail: Readonly<Record<string, AreaDetail>> = {
  '33771': {
    zip: '33771',
    name: 'Largo (central)',
    longName: 'Largo (central) lawn care',
    tagline:
      'Home base. Same-guy, same-day response in the heart of Largo  -  33771  -  the route the rest of the week builds around.',
    intro:
      'I live in 33771. When you call before 10am on a Tuesday, you are most often calling me on Tuesday, not next Tuesday. The route has been built around this ZIP for six years.',
    about: [
      'Largo (central)  -  33771  -  is the operator home base. Downtown Largo, Largo Central Park, the cultural center of the city. Streets are a mix of older homes from the 1950s through 1970s and the newer infill builds going in around the old lots. The dominant ground cover is St. Augustine grass, which means weekly mowing through the wet season (April through October) is the right schedule, biweekly works for the dry months (November through March) for most yards.',
      'Starkey Ranch is on the north edge of 33771  -  newer subdivisions, more irrigation, more Bahia and freshly-sodded St. Augustine. The east side of 33771 (still inside this ZIP) drifts toward 33773-style newer construction, with brand-new sod, irrigation heads that need to be worked around, and pre-sod weeds that need to be kept off the lawn.',
      'The lot sizes are mostly a quarter to a half acre, with some larger along the east side. Most yards in 33771 are within the bread-and-butter mow-rate range  -  no need for a quote call-out to scope before I can give you a number. If the gate is unlocked on the day I am coming, you do not have to be home. The mower will not be alone with the dog unless we have talked about it first.',
    ],
    landmarks: [
      'Downtown Largo',
      'Largo Central Park',
      'Starkey Ranch',
      'Highland Recreation Complex',
      'Largo Public Library',
    ],
    challenges: [
      'Standard St. Augustine maintenance: weekly mow April through October, biweekly November through March.',
      'Edging along sidewalks and the longer driveways  -  clean lines take a few passes on the older concrete that has crumbled a bit.',
      'Full-yard cleanup in March and April, when the spring growth starts pushing and the older lots have six months of buildup in the beds.',
    ],
    whatWeDo: [
      'I keep the route on 33771 the way most of you keep your day  -  same day, same time, every week. Tuesday is a 33771 day.',
      'Edging is included with every mow. I run a real mechanical edger, not a string trimmer held sideways, so the lines stay clean through the week.',
      'Spring cleanup and full-bed mulch in March through May, sourced from SiteOne on 66th Street (a ten-minute drive from anywhere in 33771).',
    ],
    faqs: [
      {
        q: 'How fast can you start a new customer in 33771?',
        a: 'Most weeks I can start within five business days of a quote. The route has room on Tuesdays, Wednesdays, and Fridays. Hurricane season and seasonal cleanup are longer waits  -  book early.',
      },
      {
        q: 'Do you work with the downtown Largo small businesses too?',
        a: 'Yes  -  light commercial lots in 33771 are welcome. Vacant-lot mow, parking-lot edging, and the long strips along West Bay are all in scope. The legal scope is the same as residential (no fertilization, no pest control, no irrigation).',
      },
      {
        q: 'I do not have a fence or a gate. Will the mower be in the yard while I am at work?',
        a: 'Yes. Solo operator, no crew. The mower shows up, mows, edges, blows, and is gone before you get home. I do not subcontract  -  when you book, you get me.',
      },
      {
        q: 'I am out of town for three weeks  -  will the lawn be okay?',
        a: 'Three weeks of missed cuts in the wet season is rough. If you let me know before you leave, I will schedule an extra mid-trip visit at a discounted rate so the lawn does not bounce back from a full-scale rescue. A single rescue mow after a long absence is also a service we offer under seasonal cleanup.',
      },
    ],
    voice: 'standard',
  },
  '33770': {
    zip: '33770',
    name: 'Belleair Bluffs / Largo',
    longName: 'Belleair Bluffs & west-central Largo lawn care',
    tagline:
      'Belleair Bluffs and the west-central Largo neighborhoods. Mature oaks, the oak-leaf drop in March and April, and clean lines for the wider sidewalks along West Bay.',
    intro:
      'A ten-minute drive from 33771, and a different lawn rhythm. The oaks drop leaves for two months solid. The lots are tighter than 33771. The sidewalks along West Bay are wider, and the HOA is paying attention.',
    about: [
      'Belleair Bluffs and the west-central edge of Largo  -  33770  -  is an established neighborhood with mature live oaks. The lots run a quarter to a half acre, mostly ranch-style homes from the 60s and 70s with a fair number of recent teardowns that have been rebuilt. The dominant ground cover is St. Augustine, and the dominant challenge is the oaks.',
      'March and April are the oak leaf drop. A 33770 yard will get a measurable leaf-drop every week for six to eight weeks. If your lot has even one mature live oak on it, that is part of the mow rate. Two oaks and a magnolia, the rate is going to be on the higher end of the bread-and-butter band  -  but I have already built that into the quote.',
      'The east side of 33770 runs along West Bay Drive, where the sidewalks are wider and the small-commercial lots are mixed in with the residential. Edging here is the part that takes longer than it looks: a 24-inch sidewalk with a 30-foot straightaway still needs the same hand-trim at the corners that a 4-foot walk does. Indian Rocks Beach is a few minutes west, which is a nice Saturday destination even if it is not part of the mow route.',
    ],
    landmarks: [
      'Belleair Bluffs',
      'Indian Rocks Beach access (west)',
      'Largo Medical Center',
      'West Bay Drive shops',
      'Walsingham Park',
    ],
    challenges: [
      'Oak leaf cleanup March and April: leaves for six to eight weeks solid, every week. Already in the rate.',
      'Oak root intrusion into lawn: oak roots heave and the mower scalps the high spots. Not a fix, but I cut higher over the raised area to keep the lines even.',
      'St. Augustine thatch buildup: thatch layer thickens through the wet season, and the lawn starts to feel spongy. The mow stays at 3 to 3.5 inches to keep the grass competitive with the thatch.',
    ],
    whatWeDo: [
      'Mow-and-edge every visit. The mow rate covers weekly leaf pickup during oak-drop season; you do not get a spring cleanup bill for the oak leaves.',
      'Higher cut on the root-heave areas to keep the lines from scalping. Better lawn than trying to fight the roots.',
      'Corner-and-bed detail on the wider West Bay Drive sidewalks  -  that is where the curb appeal reads first, and that is where I slow down.',
    ],
    faqs: [
      {
        q: 'My oak drops leaves every week in spring  -  is that in the mowing rate?',
        a: 'Yes. If your lot has a mature oak, the March and April weekly leaf pickup is part of the mow rate. I would rather build it in than bill you for a seasonal cleanup every spring.',
      },
      {
        q: 'Do you edge along West Bay Drive properties with the wider sidewalks?',
        a: 'Yes. The wider sidewalks take longer to edge, but they also benefit the most from a clean line. I run a real mechanical edger along the whole walk plus the bed edges.',
      },
      {
        q: 'How do you handle root-heave scalping in 33770?',
        a: 'I cut higher over the raised area. Trying to scalp level would scalp the lawn. The mow stays at 3.5 inches over the heave, which keeps the grass full while the rest of the lawn is at 3.',
      },
    ],
    voice: 'standard',
  },
  '33773': {
    zip: '33773',
    name: 'Largo (east)',
    longName: 'Largo (east) lawn care',
    tagline:
      'Newer subdivisions, irrigation systems, freshly sodded lawns. The east side of Largo, 33773, on the Pinellas Park border.',
    intro:
      'East of 33771, into the 90s-and-2000s subdivisions. Bahia, freshly laid St. Augustine, irrigation heads everywhere. I work around the heads  -  I do not service the systems.',
    about: [
      'Largo (east)  -  33773  -  is mostly newer subdivisions, built from the 1990s through the 2010s with some brand-new construction still going in on the east edge. The lot sizes are tighter than 33771  -  closer to a fifth of an acre  -  and the houses are closer together. Most homes in 33773 have irrigation systems pre-installed, and most lawns are either Bahia or freshly sodded St. Augustine.',
      'The Pinellas Park border is on the east edge. East Bay and the Feather Sound area are just over the line. The houses are a little newer, the lots a little smaller, and the irrigation heads a little denser per square foot than anywhere else on the route.',
      'For the operator, 33773 is about working around the irrigation heads (I do not service the systems  -  Florida requires the PCCLB Irrigation Specialty license for that, and I refer irrigation work out). I mow slightly higher over the irrigation zones so the heads do not get scalped. I will flag a leaking head to you when I see it; I do not touch the system itself.',
    ],
    landmarks: [
      'East Bay',
      'Feather Sound',
      'Pinellas Park',
      'John Chesnut Sr. Park (just east)',
      'Brooker Creek Preserve',
    ],
    challenges: [
      'Irrigation coordination: I mow around the heads and slightly higher over the irrigation zones, but the systems themselves are out of scope. I can flag leaks to you.',
      'New-construction settling: the houses that are still going in have a few years of settling and the lawn edges drift. I trim to the new grade, not the old one.',
      'Sod establishment: freshly sodded lawns need a different mow pattern for the first month (higher cut, sharper blade, no bagging so the clippings feed the new sod).',
    ],
    whatWeDo: [
      'I will mow around the irrigation heads and flag any leaks to you. The systems themselves are out of scope; I refer irrigation work to a licensed partner.',
      'First-month sod protocol on freshly laid lawns  -  higher cut, no bagging, sharp blade  -  until the sod has rooted.',
      'Edge along the foundation beds of the newer construction, which usually need a clean-up pass at the first few visits until the bed edges settle.',
    ],
    faqs: [
      {
        q: 'Do you service irrigation systems?',
        a: 'No  -  Florida requires the PCCLB Irrigation Specialty Contractor license for irrigation work, which is a different license than mine. I mow around the heads and flag anything I see (leaks, broken heads, misaligned spray), and I can refer you to a licensed irrigation partner for repairs.',
      },
      {
        q: 'How do you handle new-construction lawns that have not fully established?',
        a: 'First-month protocol: higher cut (3.5 to 4 inches), no bagging (the clippings feed the new sod), and a sharp blade (dull blades tear new sod). After the sod has rooted, normal mowing schedule kicks in.',
      },
      {
        q: 'My irrigation runs in the early morning  -  will the lawn be too wet?',
        a: 'If the irrigation is on a normal 5am-6am cycle, the lawn is usually dry enough by 8am when I show up. If the cycle is heavier or runs later, the first cut might be after the dew has lifted anyway. I do not mow wet grass  -  it clumps, ruts, and the cut is uneven. I will skip to the next day if the yard is too wet.',
      },
    ],
    voice: 'standard',
  },
  '33774': {
    zip: '33774',
    name: 'Largo / Ridgecrest',
    longName: 'Largo & Ridgecrest lawn care',
    tagline:
      'Ridgecrest and the elevated terrain to the south. More mature tree canopy, more shade, more landscaped lots, and the drainage on the ridge is its own thing.',
    intro:
      'Ridgecrest  -  33774  -  sits a little higher than the rest of the route. The tree canopy is heavier, the lots are larger, and the drainage on the ridge has been working for fifty years.',
    about: [
      'Ridgecrest  -  33774  -  is the elevated terrain south of central Largo. The lots tend to be larger and more landscaped than the other ZIPs on the route, with mature live oaks, pines, and a number of landscaped foundation beds that need regular attention. The Seminole border is to the south; Lake Seminole is to the southeast.',
      'Drainage on the ridge is generally good  -  the elevation handles heavy rain well  -  but the lots at the lower edges of the ridge see runoff from the higher properties. The mow does not change for that, but the edging along the swales and the curbs takes a steadier hand.',
      'Shade is the bigger issue for 33774. The mature tree canopy filters a lot of light, and St. Augustine Palmetto or Seville cultivars do better here than the broader-leaf Floratam that does well in the sun. If your yard is mostly shade, I will ask at quote-time what cultivar is in the lawn so the mow height is right for it.',
    ],
    landmarks: [
      'Ridgecrest',
      'Lake Seminole',
      'Seminole City Park',
      'Walsingham corridor',
      'Pinellas Trail access',
    ],
    challenges: [
      'Shade tolerance: the broader-leaf St. Augustine cultivars thin out under the canopy. Palmetto or Seville are the right call for shaded lots.',
      'Drainage on the lower-elevation lots: swales and curbs handle the runoff, but the edges take more attention to keep the line clean through wet weeks.',
      'Mature tree root zones: the root zones of the mature oaks and pines are not places to scalp. Higher cut, no aggressive edging into the root flare.',
    ],
    whatWeDo: [
      'Right cultivar for the light. If you have shade, I will ask at quote-time and the mow height adjusts (Palmetto and Seville prefer 3.5 to 4 inches, Floratam prefers 3 to 3.5).',
      'Steady-hand edging along the swales and the curbs, not the same perfunctory pass that the open lots get.',
      'Conservative cut over the mature tree root zones. Better lawn long-term than trying to push the line right up to the trunk.',
    ],
    faqs: [
      {
        q: 'My yard has a lot of shade  -  what grass will actually grow?',
        a: 'St. Augustine is the right grass for Pinellas in general, but the cultivar matters under shade. Floratam needs the most sun. Palmetto and Seville tolerate partial shade. Raleigh is OK in deep shade but slower. If you do not know what is in your lawn, I can usually tell at the first visit from the blade width and the growth pattern, and we go from there.',
      },
      {
        q: 'Do you handle the drainage issues on the elevated lots?',
        a: 'I do the drainage-related edging (swales, curbs, the lower edges of the ridge) well. I do not do drainage work itself  -  regrading, French drains, catch basin installs  -  those are out of scope and I refer them to a licensed partner. I will flag what I see at a visit.',
      },
      {
        q: 'My oak roots are heaving the lawn  -  what do you do?',
        a: 'Higher cut over the root-heave area, no aggressive edging into the root flare. The lawn stays full, the lines stay even, and the oak keeps its roots.',
      },
    ],
    voice: 'standard',
  },
  '33778': {
    zip: '33778',
    name: 'Seminole / Largo West',
    longName: 'Seminole & west Largo lawn care',
    tagline:
      'Seminole and the west edge of Largo, 33778. Sandy soil, salt air, hurricane exposure. The hurricane prep work is real here.',
    intro:
      'West of 33771, into Seminole and the west edge of Largo. The lots are a mix of established and new, the soil is sandy, and the salt air off the Gulf is a fact of life. Hurricane prep is the headline service in 33778.',
    about: [
      'Seminole and the west edge of Largo  -  33778  -  runs from the Pinellas Park border west to Indian Shores access. The lots are a mix of established residential and newer builds, and the soil is the sandy coastal-soil that comes with being a few miles from the Gulf. Salt-tolerant grass varieties are the right call for the closer-to-Gulf properties  -  Bahiagrass and certain St. Augustine cultivars (Floratam, in particular) handle the salt better than the broader-leaf cultivars.',
      'Hurricane prep is the headline service in 33778. The Gulf proximity means named-storm exposure is a real thing, and the June through November hurricane season drives most of the off-schedule work in this ZIP. Pre-storm sweep, post-storm haul, and the insurance paperwork that goes with it.',
      'Indian Shores is just to the west, and Boca Ciega Bay is the body of water on the south side of the ZIP. The salt air is part of the lawn-care picture  -  salt-tolerance matters for the grass, and the mow height is a little higher than inland properties to keep the grass competitive with the salt.',
    ],
    landmarks: [
      'Seminole',
      'Indian Shores access (beaches just west)',
      'Lake Seminole',
      'Boca Ciega Bay',
      'Tiki Gardens',
    ],
    challenges: [
      'Salt damage: salt air off the Gulf burns the leaf tips and stresses the grass. The mow height is a little higher (3.5 inches) to keep the grass competitive with the salt.',
      'Hurricane prep + cleanup: pre-storm yard sweep, post-storm debris haul. Insurance-friendly invoices. Most-active hurricane ZIP on the route.',
      'Sandy-soil nutrient management: sandy soil leaches fertilizer fast. I do not fertilize (separate Florida license required), but I will flag soil-stress patterns to you.',
    ],
    whatWeDo: [
      'Salt-aware mow: 3.5 inches instead of 3, and a sharper blade so the cut is clean rather than tearing the salt-burned tips.',
      'Hurricane prep mode: the same guy who mows your yard on Saturday is the same guy who sweeps the loose debris on Saturday before the wind. Pre-storm sweep is a single-visit job; post-storm haul is by appointment and the queue moves in the order the storm came through.',
      'Insurance-friendly invoices for the post-storm haul. Photos of the before-and-after for your claim if you want them.',
    ],
    faqs: [
      {
        q: 'How quickly can you respond to a hurricane in this ZIP?',
        a: 'Hurricane mode activates when a named storm is in the Pinellas cone or sustained winds hit 30 mph. I pause regular scheduling and dispatch prep visits in the order the cone arrives. After the all-clear, post-storm haul is by appointment and the queue moves in the order the storm came through. 33778 is the highest hurricane-exposure ZIP on the route  -  the prep slots tend to fill first.',
      },
      {
        q: 'Do you handle the salt-air grass varieties for the closer-to-Gulf properties?',
        a: 'Yes. Floratam and Bahiagrass both do well closer to the Gulf. The mow is a little higher (3.5 inches) and the blade is kept sharper to keep the cut clean through the salt-burned tips. If you do not know what is in your lawn, I can tell at the first visit.',
      },
      {
        q: 'I am a few blocks from Indian Shores  -  does the salt affect how often you mow?',
        a: 'The closer to the Gulf, the faster the salt-burn cycle pushes the grass to seed. Most 33778 yards closer to Indian Shores do well on a weekly mow in the wet season, biweekly in the dry. The mow is at 3.5 inches regardless of the week.',
      },
    ],
    voice: 'standard',
  },
  '33756': {
    zip: '33756',
    name: 'Belleair / Clearwater',
    longName: 'Belleair & east Clearwater lawn care',
    tagline:
      'Belleair and the east edge of Clearwater, 33756. Coastal soil, salt-tolerant grass, HOA standards that read twice.',
    intro:
      'West of 33771, across the county line into Pinellas proper. Belleair and the east edge of Clearwater. Higher property values, larger lots, HOA standards that read twice.',
    about: [
      'Belleair and the east edge of Clearwater  -  33756  -  sits west of 33770, on the coastal side of Pinellas. The lots are larger than the rest of the route (a third of an acre to a full acre in some of the Belleair subdivisions), the property values are higher, and the HOA standards in many of the subdivisions read twice  -  curb appeal is a real line item for the homes here.',
      'The soil is sandy coastal soil. The salt air off the Gulf is a fact of life, and the salt-tolerant grass varieties (Bahia, Floratam, certain St. Augustine cultivars) do better than the broader-leaf cultivars. The tree canopy is mature  -  live oaks, magnolias, sabal palms. Palm root intrusion into the lawn is a real thing in 33756, especially the closer-to-coastal lots.',
      'The historic district in Belleair has its own rhythm  -  the older homes, the wider lots, the slower pace. The east Clearwater side of 33756 has more of a mixed residential/commercial feel along the main corridors. Both sides benefit from a higher mow cut and a sharper blade, and both have stricter curb-appeal standards than the inland ZIPs.',
    ],
    landmarks: [
      'Belleair',
      'Belleair Beach access',
      'Clearwater',
      'Intracoastal Waterway',
      'Pelican Walk Plaza',
    ],
    challenges: [
      'Salt damage to grass: the closer-to-Gulf properties see salt burn at the leaf tips, and the mow needs to be a little higher (3.5 inches) to keep the grass competitive.',
      'Palm root intrusion into lawn: sabal palm roots heave and the mower scalps the high spots. Higher cut over the heave, no aggressive edging into the root flare.',
      'Sandy-soil irrigation needs: sandy soil drains fast and the lawn needs more frequent watering. I do not service irrigation (separate Florida license), but I will flag what I see.',
    ],
    whatWeDo: [
      'Right grass for the soil. Bahia and Floratam handle the salt better than the broader-leaf cultivars. If you are not sure what is in the lawn, I can usually tell at the first visit from the blade width and the growth pattern.',
      'HOA-aware timing: the mow happens before the weekend, the edging is clean, the curbside clippings are blown back into the lawn. Curb appeal is a real line item here.',
      'Slower pass through the historic district lots. The wider lots and the mature tree canopy mean the mow is not a fast job  -  and the rate is built around that.',
    ],
    faqs: [
      {
        q: 'Do you handle saltwater irrigation damage on the coastal properties?',
        a: 'I do not service the irrigation systems themselves (separate Florida license required for that), but I will flag leaks, broken heads, and saltwater intrusion patterns. The mow is adjusted for the salt  -  higher cut, sharper blade  -  to keep the grass competitive through the burn.',
      },
      {
        q: 'How do you deal with HOA standards in Belleair?',
        a: 'Curb-appeal timing: the mow is before the weekend, the edging is clean, the clippings are blown back into the lawn (not onto the sidewalk or the street). The whole point of the Belleair HOA standards is the street-facing first impression, and that is what I slow down on.',
      },
      {
        q: 'My palm roots are heaving the lawn  -  what is the fix?',
        a: 'There is not a fix. The palm keeps growing, the roots keep heaving, and the lawn keeps shifting. The right move is a higher cut over the heave so the lines stay even, and no aggressive edging into the root flare. The lawn stays full and the palm keeps its roots.',
      },
    ],
    voice: 'standard',
  },
};

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
  valuesHeading: 'What you can count on.',
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
  /**
   * Coverage-line copy. `prefix` is the static ZIP-list intro.
   * `ctaLabel` is the link text for the action that takes the
   * visitor to the homepage coverage form (anchored at
   * /#coverage). Split out from a single string so the
   * ContactHero can render the CTA as a real <a> link with
   * the href pointing at the homepage coverage form, not a
   * naked phrase that the visitor has to manually translate
   * into navigation.
   */
  coverageLine: {
    prefix:
      'We currently service 33756, 33770, 33771, 33773, 33774, 33778. Not sure if we cover your ZIP?',
    ctaLabel: 'Try your ZIP on the homepage coverage form',
  },
} as const;

/**
 * Legal-page "last updated" date.
 *
 * Before this commit, /privacy and /terms used
 * `new Date().toISOString().split('T')[0]` at render
 * time, which meant every deploy stamped a fresh date
 * even if the policy text hadn't changed. A "Last
 * updated: 2026-08-15" date that is actually just the
 * build timestamp is misleading to a customer who
 * reads the page and trusts the date as a recency
 * signal.
 *
 * Now: the date is a single-source-of-truth const
 * that the steward updates only when the policy
 * actually changes. Both /privacy and /terms read
 * from the same const so they stay in lockstep
 * (a real-world legal review would update both at
 * the same time, and accidentally updating only one
 * is a footgun).
 *
 * Initial value: 2026-07-25 (the date of the polish
 * pass that migrated the legal pages to the design
 * system primitives).
 */
export const LEGAL_LAST_UPDATED = '2026-07-26';

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

export const processSteps = {
  heading: 'Three steps, no portal.',
  steps: [
    {
      n: '01',
      label: 'Coverage',
      title: 'Check your ZIP',
      body: "Enter your ZIP or neighborhood. If you're inside 33771 or one of the five adjacent Pinellas ZIPs, you're on the route.",
      cta: { label: 'Check your ZIP', href: '/quote?step=zip' },
    },
    {
      n: '02',
      label: 'Quote',
      title: 'Get a flat rate',
      body: "No portal, no subscription, no hidden fees. Pick your service and I'll send a flat rate within 24 hours.",
      cta: { label: 'Get a quote', href: '/quote' },
    },
    {
      n: '03',
      label: 'Relax',
      title: 'Book your first mow',
      body: "I show up, mow, edge, and blow. You don't have to be home. Same guy, same day, every week.",
      cta: { label: 'Book first mow', href: '/quote?intent=first-mow' },
    },
  ],
  sectionCta: { label: 'Get a free quote', href: '/quote' },
} as const;

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
    a: 'I send an invoice the same day I mow. Pay by cash, Venmo, Zelle, or card-on-phone (the operator swipes your card on their personal phone). Monthly statements if you would rather receive one bill.',
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

/**
 * Per-day operational metadata for the schedule.
 *
 * D-0035  -  the schedule was a static text wall in v1. Now each
 * day carries:
 *   - icon       which activity dominates the route (field-log pictogram)
 *   - etaStart   arrival window start (24h "HH:MM"  -  only on work days)
 *   - etaEnd     arrival window end
 *   - note       short operator-voice detail (e.g. "Edges + blow")
 *   - kind       'work' | 'closed' | 'holiday'  -  controls field-log icon + skip behavior
 *   - skip       true if the day is shifted (renders the holiday/skip strip)
 *   - skipLabel  human-readable reason ("Independence Day  -  shifted to Fri")
 *
 * ETA windows are the operator's standing weekly pattern. The
 * actual real-time "mower is at 33771 right now" indicator is
 * derived in the component (deterministic by hour-of-day for the
 * static v1; future Supabase dynamic replaces without layout change).
 */
export const dayMeta: Readonly<
  Record<
    'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun',
    {
      icon: 'mow' | 'edge' | 'mulch' | 'trim' | 'blow' | 'rest' | 'closed' | 'holiday';
      etaStart: string | null;
      etaEnd: string | null;
      note: string;
      kind: 'work' | 'closed' | 'holiday';
      skip: boolean;
      skipLabel: string | null;
    }
  >
> = {
  Mon: {
    icon: 'mow',
    etaStart: '08:00',
    etaEnd: '11:30',
    note: 'Mow + edge. Quietest on the route  -  best day for new signups.',
    kind: 'work',
    skip: false,
    skipLabel: null,
  },
  Tue: {
    icon: 'edge',
    etaStart: '08:30',
    etaEnd: '12:00',
    note: 'Edge work + hard edging along walks and curbs.',
    kind: 'work',
    skip: false,
    skipLabel: null,
  },
  Wed: {
    icon: 'mow',
    etaStart: '07:30',
    etaEnd: '12:30',
    note: 'Heaviest day. 10 yards, 4 mulching jobs. Saws on in the morning.',
    kind: 'work',
    skip: false,
    skipLabel: null,
  },
  Thu: {
    icon: 'trim',
    etaStart: '08:00',
    etaEnd: '11:30',
    note: 'Hedge trim + palm skirt work. Loud at the start of the day.',
    kind: 'work',
    skip: false,
    skipLabel: null,
  },
  Fri: {
    icon: 'mow',
    etaStart: '08:00',
    etaEnd: '13:00',
    note: 'Mow + blow. Longest ETA window  -  biggest yards on the route.',
    kind: 'work',
    skip: false,
    skipLabel: null,
  },
  Sat: {
    icon: 'blow',
    etaStart: '09:00',
    etaEnd: '11:00',
    note: 'Light Saturday cleanup. HOA-noise-window start at 9.',
    kind: 'work',
    skip: false,
    skipLabel: null,
  },
  Sun: {
    icon: 'rest',
    etaStart: null,
    etaEnd: null,
    note: 'No outdoor power equipment. HOA noise rules in 33771.',
    kind: 'closed',
    skip: false,
    skipLabel: null,
  },
};

/**
 * Holiday / skip-day calendar for the year.
 *
 * A "skip" day is one where the route is shifted (e.g. a federal
 * holiday landing on a Tuesday pushes the Tuesday route to
 * Wednesday). When the rendered week's day-of-week matches a
 * `skipDate` here, the day card renders the "skip" treatment and
 * the skip label appears at the top of the section.
 *
 * D-0035  -  holiday detection is data-driven (this table) so
 * the operator can add a holiday in 5 seconds without touching
 * code. The actual shift logic ("if Tue 7/4 then Wed's route
 * takes Tue's yards") is left for the future Supabase dynamic
 *  -  the v1 just renders the skip label.
 */
export const holidaySkips: ReadonlyArray<{
  /** ISO date (YYYY-MM-DD) of the day the route is shifted off. */
  date: string;
  /** Day of the week this is anchored to (must match `date` ISO weekday). */
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  /** Human-readable reason shown in the skip strip + day card. */
  reason: string;
}> = [
  // Federal + commonly observed in Pinellas.
  { date: '2026-01-01', day: 'Thu', reason: 'New Year\u2019s Day \u2014 Thu route shifts to Fri' },
  { date: '2026-05-25', day: 'Mon', reason: 'Memorial Day \u2014 Mon route shifts to Tue' },
  { date: '2026-07-04', day: 'Sat', reason: 'Independence Day \u2014 Sat cleanup shifts to Fri PM' },
  { date: '2026-09-07', day: 'Mon', reason: 'Labor Day \u2014 Mon route shifts to Tue' },
  { date: '2026-11-26', day: 'Thu', reason: 'Thanksgiving \u2014 Thu trim shifts to Fri' },
  { date: '2026-12-25', day: 'Fri', reason: 'Christmas \u2014 Fri route shifts to Sat morning' },
];

/**
 * Field-log copy for the "Find your mow day" ZIP / neighborhood
 * resolver. Falls back to a generic positive message if the
 * input is not in the canonical 6  -  same D-0032 permissive
 * pattern as the Coverage Check above. The resolver never says
 * "we don't mow there" because every ZIP routes to /quote,
 * not to a hard gate.
 *
 * D-0036  -  added a primary "lock in" CTA on the hit panel so
 * the resolver pushes visitors into /quote, not just delivers
 * info. The "book this day" mini-CTA is reused on the today
 * card and each day card in the week strip.
 */
export const scheduleResolver = {
  eyebrow: 'Find your mow day',
  inputLabel: 'Your ZIP or neighborhood',
  placeholder: '33771, or "Largo"',
  cta: 'Find my day',
  hitHeading: 'Your next mow',
  hitBody: 'is the day I work your neighborhood.',
  /** CTA on the hit panel. {day} interpolates to the matched day name. */
  hitCta: 'Lock in {day}',
  missHeading: 'Outside the 6 home ZIPs',
  missBody:
    'I\u2019m flexible about nearby ZIPs while the route is still growing. Drop your address and I will quote you directly.',
  missCta: 'Request a quote',
} as const;

/**
 * Per-day booking CTA. D-0036  -  every day in the week strip
 * has a small "Book [Day]" mini-CTA that links to /quote with
 * the day's first ZIP and the day-key pre-filled. The day-key
 * is a forward-compatible hint (the v2 quote form can use it
 * to surface a "your preferred mow day" dropdown).
 */
export const dayBookCta = {
  template: 'Book {day}',
  /** Today card uses a fuller prompt. */
  today: 'Book this mow',
} as const;

/**
 * Subscribe-to-route copy. Renders below the 7-day strip.
 *
 * The destination is /quote?zip={zip}&notify=1 (handled by the
 * existing QuoteCalculator prefill  -  see D-0028 in /quote). The
 * `notify=1` flag is a forward-compatible hint so a future v2
 * can read it and add the customer to a notification list
 * without a separate route. For now it just pre-fills the ZIP.
 */
export const subscribeToRoute = {
  heading: 'Get a text when the mower is in your ZIP.',
  body: 'No spam, no daily updates. One text the morning of your mow, with a tighter window than the standing ETA above.',
  cta: 'Notify me',
  helper: 'Texts sent by 7am the day before your mow.',
} as const;

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
