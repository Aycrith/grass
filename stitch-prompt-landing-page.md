# Stitch Design Prompt: Largo Lawn Full Landing Page

> The full single-page landing surface for a local lawn-care
> company in Largo FL (33771). Solo operator, one truck, one
> person, every yard. Brand voice: neighborly, operator-first,
> no franchise markup. This prompt documents the current
> production design (D-0031 through D-0038) plus a recommended
> alternative direction ("Local Pinellas" newspaper editorial)
> the user can run in Stitch for comparison.

**NOTE BEFORE YOU PASTE THIS INTO STITCH:**

This prompt contains **zero em-dashes** (the design system bans
them) and **zero en-dashes** (also banned). All ranges use
"to" or "X-X" with regular hyphens. If Stitch auto-formats
punctuation in its output, scan the result for any ` - ` or
` to ` characters and replace them.

The brand uses NO em-dashes anywhere. The agent's own output
must not contain them either.

---

## DESIGN SYSTEM (REQUIRED)

### Platform and theme

- **Platform:** Web, Desktop-first with explicit mobile collapse
- **Theme:** Light only, single theme locked
- **Background:** Cream `#faf6f0`
- **No dark mode.** Single light surface across all 9 sections
  + sticky rail. Theme-locked. Do not introduce inverted
  sections.

### Brand context (read first)

- **Company:** Largo Lawn. Largo FL 33771. Solo operator, one
  truck, one person, every yard.
- **Service area:** 6 Pinellas County ZIPs (33756, 33770, 33771,
  33773, 33774, 33778)
- **Vibe:** Neighborly, editorial, Florida-Pinellas storybook.
  NOT corporate. NOT templated. NOT AI-purple. NOT warm-beige-
  and-brass.
- **Aesthetic family:** Editorial / Pacific-Northwest-clean-
  meets-Florida-pastoral. Generous whitespace. Hand-stamped
  feel on metadata. Soft sun-and-clay accents on a near-white
  ground.
- **Conversion goal:** Every section ends with a clear path to
  /quote. The page reads top-to-bottom as one funnel toward a
  free quote.

### Colors (brand-locked, do not deviate)

**Brand palette (locked, do not change):**
- Deep Palm Green `#1f4e2c`  -  primary brand color. Used for
  the logo, primary CTAs (Palm Green pill button, "Find my
  day" green button), and active states.
- Florida Sand `#d4a574`  -  secondary accent. Logo mark,
  eyebrow details, metadata labels.
- Sky Blue `#3b7dd8`  -  links only.
- Charcoal `#1a1a1a`  -  body text (legacy alias for Palm Bark).
- Cream `#faf6f0`  -  primary surface background.

**Expanded Pinellas-evocative palette (for the page):**
- Palm Shadow `#2d5a3d`  -  deep green, used for the OperatorStrip
  palm-mark, the ServiceBento "Hurricane prep" card highlight,
  and the FinalCTABanner background.
- Sun `#e8b65a`  -  warm gold. The conversion CTA color. Used for
  "Get a free quote", "Lock in {day}", "Book this mow",
  "Request a quote", the FinalCTABanner headline, and the
  ScheduleTimeline "Today" badge. Never decorative.
- Clay `#b5651d`  -  brick accent. Used for emphasis labels, the
  ScheduleTimeline today-card border, the "currently mowing"
  progress bar fill (gradient Sun to Clay), and the holiday
  skip indicator.
- Sand Bleached `#f4e8d0`  -  warm bone. Used for the
  ServiceAreaMap (Coverage Check) section background, the
  ScheduleTimeline resolver card surface, and the radial
  gradient on the today card.
- Pure White `#ffffff`  -  card surface for ServiceBento cards,
  PricingTiers cards, ProcessSteps cards, FAQ rows, the
  ScheduleTimeline today card and day cards.
- Palm Bark `#1a1f1b`  -  near-black with a green tint. All body
  and headline text. The Charcoal alias.
- Sage Muted `#8fa89b`  -  muted green. Sunday indicator, dot
  legends, low-emphasis borders, secondary card backgrounds.

**Semantic aliases (consume via these, not the raw hex):**
- Primary CTA background: Sun `#e8b65a` (text Palm Bark on it)
- Primary CTA text: Palm Bark `#1a1f1b`
- Secondary CTA background: Palm Green `#1f4e2c` (text Cream on it)
- Outline CTA border + text: Clay `#b5651d`
- Section background: Cream `#faf6f0`
- Card background: White `#ffffff`
- Resolver + Coverage Check background: Sand Bleached `#f4e8d0`
- Today card border: Clay `#b5651d`
- Today card surface: White with a radial Sun gradient at
  top-left (18% opacity, fading to transparent at 50%)
- FAQ accordion open state: White with Sand Bleached hover
- FinalCTABanner: Palm Shadow `#2d5a3d` background with sand-
  bleached text

**Do NOT use these palettes (banned AI defaults):**
- Beige + brass + oxblood (premium consumer default  -  banned)
- AI-purple / mesh-gradient / glassmorphism (SaaS dashboard
  default  -  banned)
- Pure black `#000000` and pure white `#ffffff` as text or
  background (use Palm Bark and Cream instead)

### Typography (Fraunces + Inter only)

**Type families:**
- Display + italic + numerals: **Fraunces** (variable serif,
  weights 400 default, 500 for italic emphasis, optical sizing
  for headlines)
- Body + UI labels + buttons: **Inter** (variable sans, weights
  400 / 500 / 600 / 700)
- Never use Fraunces for body copy. Never use Inter for headlines
  or italic emphasis. The two-family pairing is the design
  system's identity.

**Type scale (clamp for fluid, mobile-first):**
- Page h1 (hero): `clamp(2.25rem, 5vw, 3.75rem)`, Fraunces 700,
  line-height 1.05, letter-spacing -0.02em
- Section h2: `clamp(1.75rem, 3vw, 2.5rem)`, Fraunces 400,
  line-height 1.1, letter-spacing -0.01em
- Section h3: `clamp(1.25rem, 2vw, 1.625rem)`, Fraunces 400,
  line-height 1.2
- Lede (subhead): 1rem, Inter 400, line-height 1.55, opacity 0.78
- Body: 1rem, Inter 400, line-height 1.55
- Hero numerals (large stat values): `clamp(3rem, 6vw, 5rem)`,
  Fraunces 400 italic, line-height 1, letter-spacing -0.02em
- Resolver hit value (day name): 1.625rem italic Fraunces
- Today card time: 1.25rem italic Fraunces
- Day name: 0.75rem Inter 700 uppercase 0.06em letter-spacing
- Caption / eyebrow: 0.625-0.75rem Inter 700 uppercase 0.16-0.18em
  letter-spacing, color Clay
- Button text: 0.875-1rem Inter 600
- Tabular numerals: `font-variant-numeric: tabular-nums` on
  every number (yards, ETA, ZIPs, week number, prices)

**Italic descender clearance (mandatory):**
When using Fraunces italic for display words containing `y g j p q`
(any descender letter) at line-height 1.1 or tighter, add
`padding-bottom: 2px` to the wrapping element. The
ScheduleTimeline today-card time and the resolver hit value
both have this. Audit every italic word before shipping.

### Spacing

- 8-pt grid. Sub-units at 1, 2, 3 for 4px, 8px, 12px.
- Section vertical padding: 64px desktop, 40px tablet, 24px mobile.
- Section gap: 0 between sections of the same tone (cream
  flows into cream), 1px hairline divider (Palm Bark 8% opacity)
  between dark/light transitions.
- Within a section, layer gaps: 16-24px between sub-blocks.

### Radius

- Buttons + pills: full-pill (999px)
- Cards: 16px
- Time pill: full-pill
- Today card: 16px
- Day card: 8px
- FAQ accordion rows: 0 (hairline divider only, no card)
- Input fields: 8px

**Shape consistency rule:** Pick one radius family and stick to
it. This page is "all-pill buttons + 16px cards + 8px small
chips + 0 FAQ rows." Do not mix.

### Elevation

- No generic shadows on white sections.
- The today card uses a single 4px 24px shadow tinted Sun at
  22% opacity.
- The ConversionRail bottom-right pill uses 0 8px 24px
  shadow tinted Palm Bark at 18% opacity.
- The FinalCTABanner uses no shadow (it IS the closer, no
  container shadow needed).
- Day cards: 1px Palm Bark border at 10% opacity, no shadow.
- Resolver + Coverage Check card: 1.5px Clay border at 22%
  opacity, no shadow.

### Borders

- Hairline, 1px, Palm Bark at 10-35% opacity depending on
  hierarchy.
- The today card uses 1.5px Clay (the only 1.5px border on
  the page; border weight signals hierarchy).
- Holiday/skip indicator: 1px dashed Clay at 35% opacity.

### Motion language

Conversational, not aggressive. Pinellas pastoral, not SaaS
dashboard. The motion is what makes the page feel "alive" and
directs attention toward the conversion, not what makes it
"look designed."

- **Scroll-reveal stagger** on the ServiceBento cards, the
  ScheduleTimeline day cards, the FAQ rows. Each item fades
  up 12px with 70ms stagger, once on first viewport entry.
  `whileInView` with `once: true, amount: 0.3`.
- **Resolver result spring slide-in** on the ScheduleTimeline
  submit. `stiffness: 220, damping: 24`.
- **Today card one-time attention bloom** on scroll-into-view.
  1.2s clay-bloom: box-shadow expands to include a 40% Clay
  tinted shadow with a 35% Sun ring at 8px, then settles
  back to the resting shadow. `useInView` + keyframe.
- **Primary CTA breathing pulse** on the ScheduleTimeline
  resolver hit card. 3s ease-in-out clay glow that expands and
  fades. Gated by `prefers-reduced-motion`.
- **Day card hover lift**: 2px translateY + Clay border, 240ms
  ease-out. Gated by reduced motion.
- **CTA arrow nudge**: 2px right translateX on hover, 150ms.
  Gated by reduced motion.
- **Today card pulsing dot**: 2.4s ease-in-out clay ring, runs
  continuously while the today card is in view. Gated.
- **Coverage Check "Got it" result** slides up with a spring
  on submit. Same pattern as the ScheduleTimeline resolver.
- **Sticky rail slide-up**: 240ms ease-out when the hero
  scrolls out, slide-down when FinalCTA scrolls in.

**Reduced motion (mandatory):** All scroll-reveal, breathing
pulse, hover lift, arrow nudge, attention bloom, slide-in
gated by `prefers-reduced-motion: reduce`. The page degrades
to static, instant transitions.

---

## PAGE STRUCTURE

9 sections, top-to-bottom as one conversion funnel. No
section is decorative. Each section either qualifies the
visitor, builds trust, or pushes toward /quote.

### 01  -  Hero (D-0020 editorial split)

- **Tone:** Cream surface, with the OperatorStrip palm-mark
  as a faint background watermark (or skip if budget tight)
- **Layout:** Asymmetric 60/40 desktop, stacked mobile
- **Left column (60%):**
  - Eyebrow: "LAWN CARE IN 33771" (Inter 700 uppercase 0.78rem
    0.16em letter-spacing, color Florida Sand)
  - h1: "Your neighbor's lawnmower." (Fraunces 700, clamp
    2.25-3.75rem, line-height 1.05, letter-spacing -0.02em,
    color Palm Bark)
  - Lede: 1-2 sentences. "Local, solo-operator lawn care in
    Largo and the five adjacent Pinellas ZIPs. Free quotes
    within 24 hours. No contract, no franchise markup."
    (Inter 1.15rem, line-height 1.55, opacity 0.9)
  - CTAs: "Get a free quote" (Sun pill, lg size, with right
    arrow that nudges 2px on hover) + "Call (727) 555-0123"
    (outline variant, Clay border, with phone icon)
- **Right column (40%):**
  - Hero image: Hand-painted storybook ranch house at golden
    hour, garden + lawn in foreground. `/illustrations/largo-
    hero-ranch-house-v3.webp`. Aspect 4:3, rounded 16px.
  - "33771 - LARGO CENTRAL" stamp badge bottom-right of the
    image: Sand Bleached background, Palm Bark text, Clay
    border, 4px radius, slight rotation -1.5deg
  - A small passpost stamp at top-right: "CLEARWATER -
    LARGO" in red ink, rotated +8deg, opacity 0.7, partially
    over the image edge
- **Mobile collapse:** single column, image first or below
  hero copy. CTAs full-width stacked. Hero text padding-top
  max 6rem (do not float halfway down viewport).

### 02  -  Coverage Check (D-0031, form-dominant, no map)

- **Tone:** Dark (Palm Shadow `#2d5a3d` background) with
  sand-bleached text. First conversion decision lands at
  fold 1-2.
- **Eyebrow:** "WHERE I MOW" (Florida Sand 0.8rem 0.16em)
- **h2:** "Six Pinellas neighborhoods. One route." (Fraunces
  700, 1.6-2.4rem, color Sand Bleached)
- **Lede:** "Type your ZIP or neighborhood name. I will get
  back to you with a quote. The six chips below are where I
  mow every week; I am flexible about nearby ZIPs while I
  am building the route." (Inter 0.95rem, opacity 0.85)
- **Form (the only interactive element):**
  - Input: full-width, max 480px centered, Sand Bleached
    background, 18% Palm Bark border, 1.5px on focus with
    shadow ring, 1.15rem Inter, padding 0.85rem 1.1rem
  - Input placeholder: "33771 or neighborhood name"
  - Submit button: Sun background, Palm Bark text, 1.4rem
    padding horizontal, sits inline with input on desktop,
    stacks below on mobile (< 560px)
  - Submit label: "Check coverage" (or just "Check")
- **Result panel** (appears on submit, spring slide-in):
  - Sand Bleached surface, 1.5px Sun 40% border, 4px 16px
    shadow, 12px radius
  - On any 5-digit ZIP or 3+ char text: cream check circle
    icon + "Got it" headline (Inter 0.95rem) + body "I mow
    {ZIP}{ neighborhood if known}. I'll text you within 24
    hours with a quote." (Inter, opacity 0.7)
  - Primary CTA: "Get a free quote" (Sun pill, with right
    arrow), routes to /quote?zip={zip}
- **6 ZIP chips** below the form (centered, max-width 720px,
  visible by default  -  NOT collapsed into details):
  - Cream surface, Palm Bark 18% border, 8px radius, 12px
    padding
  - Text: "33771" (Fraunces 500 1rem) + "Largo (central)"
    (Inter 0.75rem, opacity 0.7)
  - 6 chips in a wrapping flex, gap 12px
  - Each chip links to /areas/{zip}
- **Section padding:** 64px vertical (default rhythm)

### 03  -  Operator Strip (D-0029)

- **Tone:** Cream, single horizontal layout
- **Layout:** 3 columns desktop (portrait 320px | bio flex |
  equipment 240px), stacked mobile
- **Portrait (left, 320px):**
  - `/operator/portrait.webp` (placeholder SVG: a hand-drawn
    silhouette of the operator in a hat against a Pinellas
    landscape). Square, rounded 16px
  - Corner stamp top-right: `/illustrations/corner-stamp.svg`
    (compass-rose motif, 80x80, rotated +4deg)
  - Aspect 1:1, no shadow, the corner stamp is the only
    ornament
- **Bio (center, flex):**
  - h2: "Hi, I'm {Operator Name}." ("Hi, I'm" in Inter
    regular, "{Operator Name}" in Fraunces 500 italic, both
    inline, color Palm Bark)
  - Meta: "{N} years cutting grass in 33771" (Inter 0.75rem
    uppercase 0.12em letter-spacing, with a small clay rule
    above)
  - Body: 2-3 sentence bio in first person. Operator voice,
    no marketing copy. "I'm the guy mowing your neighbor's
    yard. Six years cutting grass in Largo and the five
    adjacent ZIPs. I run solo, on a consistent weekly route,
    so the same person shows up every week. No crew swap, no
    franchise markup." (Inter 1rem, line-height 1.7, opacity
    0.85, max-width 36rem)
  - Stat row (2 stats, horizontal flex, gap 32px, hairline
    divider above):
    - "47" (Fraunces italic 2.5rem) + "YARDS ON THE WEEKLY
      ROUTE" (Inter 0.6875rem uppercase 0.08em)
    - "18h" (Fraunces italic 2.5rem) + "MEDIAN QUOTE
      TURNAROUND" (Inter 0.6875rem uppercase 0.08em)
  - Signature mark at bottom: thin Sun rule + small palm
    illustration (`/illustrations/pinellas-palm-v3-72.webp`,
    72x72) + "LARGO . FLORIDA" caption (Inter 0.625rem
    uppercase, opacity 0.6)
- **Equipment (right, 240px):**
  - Title: "What I run" (Inter 600, 0.875rem, opacity 0.7)
  - 4 items in a vertical list, each:
    - Model name in Fraunces 500 italic (e.g. "Honda HRX217")
    - Use in Inter 0.75rem (e.g. "self-propelled mower")
  - No images, no logos. Pure typography.
- **Section padding:** 80px vertical (loose rhythm)

### 04  -  Service Bento (D-0029)

- **Tone:** Cream surface
- **Layout:** Editorial asymmetric grid (NOT 3-equal cards).
  See "Section-Layout-Repetition Ban" in anti-patterns.
- **Eyebrow:** NONE (D-0030 removed the eyebrow to honor
  the 1/3 rule. The h2 alone is enough.)
- **h2:** "Six things, done well." (Fraunces 400,
  1.75-2.5rem clamp)
- **Lede:** "I keep the service list short on purpose. Six
  things, no crew swap, no upsell. If you need something not
  listed, ask. Half of what I do is the stuff nobody else
  lists." (Inter, opacity 0.78)
- **Grid composition (3 columns × 2 rows, varied cell sizes):**
  - **Top-left (large, 2 cols × 2 rows):** Mowing service
    - Hand-painted hero illustration (full color, storybook
      style): "A neat yard with cut grass and a mower in
      the foreground." `/services/mowing-v3.webp`
    - Eyebrow + h3 stacked over the image
    - Body: 1-2 sentences
    - "Learn more" small link, not a button
  - **Top-right (1 col):** Mulching (smaller, text-only)
    - White card surface, 1px border, 16px radius
    - Just h3 + body + "Learn more"
  - **Mid-left (1 col):** Edging
  - **Mid-right (1 col):** Hedge trimming
  - **Bottom-left (1 col):** Hurricane prep (with Sun 2px
    border to signal seasonal urgency)
  - **Bottom-right (large, 1 col × 2 rows, image+text):**
    Seasonal cleanup
- **Hover:** Card lifts 4px, image scales 1.03, 300ms
  ease-out
- **Bento Background Diversity rule:** At least 2-3 cells have
  real visual variation (images, tints, sun borders). NOT
  all white-on-white text cards.

### 05  -  Pricing Tiers (D-0030)

- **Tone:** Cream
- **Eyebrow:** NONE
- **h2:** "What it costs." (Fraunces 400)
- **Lede:** "Three pricing tiers, one set of hands. Numbers
  are exact; no add-ons, no surprise fees, no portal. You
  pay after each visit or set up monthly: your call." (Inter)
- **Layout:** Editorial 3-column grid (the only "three-equal-
  ish" on the page, because pricing is naturally comparable).
  Featured middle tier.
- **3 tiers:**
  - **Tier 1 (left):** "Most yards, most weeks" (anchor tier)
    - Cream surface, 1px Palm Bark border, 16px radius
    - $48 (Fraunces italic 4rem, color Palm Bark)
    - "/weekly" (Inter 0.875rem, opacity 0.6)
    - "A clear, no-surprises number. Half the yards on the
      route fall in this tier." (Inter, opacity 0.78)
    - "Get a free quote" outline CTA
  - **Tier 2 (center, featured):** "Full-lot refresh" (anchor
    service)
    - Palm Green background, Cream text, 16px radius, 2px
      Sun border (ribbon pulse on hover)
    - $185 (Fraunces italic 5rem, color Sun)
    - "/one-time" (Inter 0.875rem, opacity 0.85)
    - "Skip the weekly plan: full reset. Mulch, edge, trim,
      blow. Most yards go to this once a year." (Inter,
      opacity 0.85)
    - "Get a free quote" Sun pill (primary)
    - "MOST POPULAR" Sun ribbon badge top-right
  - **Tier 3 (right):** "Pre-storm sweep" (urgency-driven)
    - Cream surface, 1px Palm Bark border, 16px radius
    - $95 (Fraunces italic 4rem)
    - "/one-time" (Inter 0.875rem, opacity 0.6)
    - "If a storm is coming, call me. I clear the routes a
      day ahead of landfall. 30 mph wind rule: I work under
      it, I do not climb in it." (Inter, opacity 0.78)
    - "Get a free quote" outline CTA

### 06  -  Process Steps (D-0030)

- **Tone:** Cream
- **Eyebrow:** NONE
- **h2:** "Four steps, no portal." (Fraunces 400)
- **Layout:** Editorial 4-column grid on desktop (1024px+),
  2-col tablet, 1-col mobile
- **Steps (NO "Step 1" labels  -  the actual verb is the label):**
  - **Step 1:** "Tell me about your yard" (Fraunces 500 1.125rem)
    - Body: "You text me your address. I drive by before
      quoting, so the price reflects the actual lot, not a
      guess from a zip." (Inter, opacity 0.78)
    - Visual: small house or speech-bubble pictogram
  - **Step 2:** "Pick a recurring slot" (Fraunces 500 1.125rem)
    - Body: "Same day, same window, every week. You lock in
      the day. I hold the slot. No rebooking, no
      confirmation texts." (Inter, opacity 0.78)
    - Visual: small calendar pictogram
  - **Step 3:** "I show up the same day" (Fraunces 500 1.125rem)
    - Body: "Solo operator, one truck. If a route day is
      Tuesday, you see me Tuesday. If the lawn needs me, I
      am the only one showing up." (Inter, opacity 0.78)
    - Visual: small mower pictogram
  - **Step 4:** "Pay after each visit" (Fraunces 500 1.125rem)
    - Body: "No contract, no portal, no app. Text me when
      the lawn is mowed, I send a text with the total. You
      pay by card or Zelle." (Inter, opacity 0.78)
    - Visual: small receipt pictogram
- **Connector:** A thin clay horizontal rule connecting the
  4 steps on desktop (above 1024px), `::before` pseudo-element
  on the grid

### 07  -  Schedule Timeline (D-0035 through D-0038)

See the separate prompt: `stitch-prompt-schedule-section.md`.
This is the section with the resolver, the today card, the
week strip, the month toggle, and the subscribe CTA. The
full prompt covers visual specs, motion, anti-patterns, and
mobile collapse. The summary spec is:

- Header (compact): h2 + lede + "Week of {date}" meta
- Resolver (Sand Bleached card): input + button, "Find your
  mow day" eyebrow, result panel with primary "Lock in {day}"
  CTA
- Today card (White, Clay border, featured): badge + clock
  icon + time pill + status + note + primary "Book this mow"
  CTA + small mower illustration
- Week strip (7 cards): pictogram + day + yards + clock
  time pill + ZIPs + outline "Book {Day}" mini-CTA
- Month calendar: collapsed behind "See full month" toggle
- Subscribe: small, hairline-separator, ghost CTA

### 08  -  FAQ Accordion

- **Tone:** Cream
- **h2:** "Honest answers." (Fraunces 400, no eyebrow)
- **Lede:** "A few things people ask before the first visit.
  No surprises, no fine print." (Inter, opacity 0.78)
- **Layout:** Single-column list, max-width 56rem, hairline
  dividers between rows (no cards)
- **Each row:** Question (Inter 600 0.95rem) + chevron
  right (rotates 180° on open, color Clay) + answer body
  (Inter 0.95rem line-height 1.6, opacity 0.78, opens
  below the question with a 200ms slide-down)
- **Sample Q&A:**
  - Q: "What if it rains on my scheduled day?" A: "I push
    everyone back one day in sequence. If the rain is heavy
    enough to skip the whole week, I send a text by Wednesday
    so you know."
  - Q: "My gate is locked: how do you get in?" A: "A locked
    gate is fine. A locked gate I do not know about is not.
    Text me the code, or leave it unlocked on your day."
  - Q: "Are the dogs and kids okay while you work?" A: "Yes.
    I shut the gate behind me. The mower noise is loud to you
    for ten minutes; the dogs get over it."
  - Q: "Are the dogs and kids okay while you work?" A: "Yes.
    I shut the gate behind me. The mower noise is loud to you
    for ten minutes; the dogs get over it."
  - Q: "How do dogs and kids stay safe while you work?" A: "I
    work around them. I do not run the mower near a kid or an
    unleashed dog. I move the chips, you move the dog."
  - Q: "How much lead time before the first mow?" A: "Most
    weeks I can start within five business days of a quote.
    The route has room on Tuesdays, Wednesdays, and Fridays.
    Mondays and Saturdays fill up first."
  - Q: "Do you go on holidays?" A: "If a federal holiday
    lands on a route day, I push the route to the next
    business day. I will text the Sunday before."

### 09  -  Final CTA Banner (D-0026)

- **Tone:** Dark (Palm Shadow `#2d5a3d` background, sand-
  bleached text). The closer. The final push.
- **Layout:** Centered, single column, max-width 40rem
- **Eyebrow:** "READY WHEN YOU ARE" (Inter 700 uppercase
  0.8rem 0.08em letter-spacing, color Sun)
- **h2:** "Ready for a yard that looks cared for?" (Fraunces
  700, clamp 2-3.25rem, line-height 1.05, letter-spacing
  -0.02em, color Sand Bleached)
- **Body:** "No obligation. No contract. Local since day one."
  (Inter 1.05rem, line-height 1.55, color Sand Bleached,
  opacity 0.88)
- **CTA:** "Get a free quote" (Sun pill, lg size, with right
  arrow)
- **Visual:** Two small opening quote-mark pictograms above
  the h2 (`/illustrations/quote-mark-v3-56.webp`, 56x45, Sun
  color)
- **Background:** Solid Palm Shadow with two soft radial
  gradients (Sun 26% at 50% 18%, Clay 22% at 80% 100%) using
  mix-blend-mode: screen
- **Border:** 1px Sand 35% border at the top of the inner
  container

### 10  -  Sticky Conversion Rail (D-0037)

Persistent CTA that anchors at the bottom of the viewport,
appears once the user scrolls past the hero, hides when the
FinalCTA scrolls in.

- **Desktop (768px+):** bottom-right pill
  - Cream surface, 1px Clay 25% border, full-pill, 0 8px 24px
    shadow Palm Bark 18%
  - Copy: "Ready when you are." (Inter 0.875rem, weight 500)
  - CTA: "Get a free quote" (Sun pill, md size, with right
    arrow)
  - Position: bottom 20px, right 20px, max-width 28rem
- **Mobile (< 768px):** full-width band at the bottom
  - Cream surface, 1px top border Palm Bark 12%, shadow 0
    -4px 16px Palm Bark 10%
  - Layout: horizontal flex, CTA grows (flex 1 1 auto) +
    "See service area" alt link
  - Padding: 12px 16px + env(safe-area-inset-bottom) bottom
- **Visibility:** IntersectionObserver tracks `#hero` and
  `#final-cta` elements
  - Hidden when hero is intersecting (no duplication)
  - Hidden when final-cta is intersecting (no duplication)
  - Visible between the two
  - Slide transition: 240ms ease-out, transform translateY
  - Reduced motion: instant, no transition
- **Id requirements:** HeroCinematic and FinalCTABanner must
  have `id="hero"` and `id="final-cta"` respectively

---

## CONVERSION-FIRST PRINCIPLE (applied across all sections)

Every interactive moment on this page pushes toward /quote.
Not every section needs a CTA, but the conversion path is
visible at every point:

- **Hero:** "Get a free quote" primary CTA
- **Coverage Check:** Any ZIP input routes to /quote?zip=
- **OperatorStrip:** Bio (no CTA  -  this is the trust section)
- **ServiceBento:** Service cards link to /services/[slug]
- **PricingTiers:** Featured tier has "Get a free quote" CTA
- **ProcessSteps:** 4 steps (no CTA  -  this is the "how it works"
  section)
- **ScheduleTimeline:** Resolver hit, today card, per-day
  cards, and the subscribe all route to /quote or /quote?zip=
- **FAQAccordion:** Q&A only (no CTA  -  this is the "questions"
  section)
- **FinalCTABanner:** "Get a free quote" closer CTA
- **Sticky ConversionRail:** Persistent "Get a free quote"
  between hero and final CTA

**CTA intent is differentiated by verb:**
- Hero / FinalCTA / Rail: "Get a free quote" (general intent)
- Coverage Check hit: "Get a free quote" (already pre-filled
  with the ZIP)
- Resolver hit: "Lock in {day}" (find-your-day intent)
- Today card: "Book this mow" (book-this-day intent)
- Per-day cards: "Book {Day}" (book-that-day intent)
- Subscribe: "Notify me" (notification intent)
- Pricing featured: "Get a free quote" (anchor pricing intent)

The same destination (/quote) with different framings, so
the user can act from whichever moment they reached.

---

## ALTERNATIVE DIRECTION (the "variation")

The current production design is "Field Log"  -  storybook
pastoral, hand-painted illustrations, cream + sun + clay.
This works because the brand is one person, one truck.

If the user wants a **different direction** in Stitch for
comparison, the recommended alternative is **"Local Pinellas"
newspaper editorial**:

### Local Pinellas (newspaper editorial)

- **Vibe:** Reads like a small-town newspaper feature on the
  operator. Pinellas Times meets the typography of a printed
  weekly. Editorial. Considered. Print-feel.
- **Type:**
  - Display: A heavier Fraunces weight (600-700), tighter
    letter-spacing, more dramatic size jumps (6rem+ for the
    h1, 3-4rem for section h2s)
  - Body: Same Inter, but tighter line-height (1.4) and
    narrower column widths (max 60ch)
  - Drop caps: First letter of the h1 in a giant 4-line
    Fraunces italic
  - Bylines: "By {Operator Name}" italic Fraunces at the top
    of each section, like a newspaper column
- **Color:** Mostly monochrome (Palm Bark on Cream), with
  Sun reserved for conversion CTAs only. The only other
  accent is Clay used as a "stamp" color (rotated -2deg
  with a 1px Clay border, used like an editorial correction
  mark). No Sand Bleached cards, no Palm Shadow dark
  sections. The whole page reads as printed paper.
- **Layout:**
  - 12-column editorial grid, narrow column widths, columns
    separated by 1px hairline rules
  - Hero is a full-width photo with a paper-cutout-style
    headline below, like a newspaper front page
  - Section dividers are thin rules + tiny serif numerals
    ("II", "III", "IV")  -  newspaper section marks
  - Service cards are 1-line list items with rule lines, not
    cards
  - Pricing is a 3-row table with hairline rules, not cards
  - FAQ accordion becomes a Q&A column with byline-style
    attribution
  - FinalCTA is a full-bleed dark band that breaks the
    monochrome  -  the "front page" of the page
- **Ornament:**
  - All metadata gets a small "page number" + "section name"
  - The schedule becomes a 7-row table with rule lines, like
    a printed schedule
  - The 6 ZIPs get a "neighborhood index" feel, with letters
    next to each name (A, B, C, D, E, F)
  - The operator portrait becomes a small framed photo with
    a "Press Photo" caption
- **Motion:** Reduced. The newspaper metaphor resists
  animation. Use only the most subtle: a thin underline that
  draws in on a CTA hover, the day card border that thickens
  from 1px to 1.5px on hover, the schedule row that highlights
  on the today row. No scroll-reveal stagger. No breathing
  pulse. The page feels printed.
- **Anti-pattern:** Do NOT use this direction if the user
  wants the conversion-first principle to feel "alive." The
  newspaper direction is more contemplative; it works if the
  brand wants to lean into print heritage and trust.

Both directions share the same color palette, same fonts,
same conversion paths, and same anti-patterns. The difference
is layout density, ornament, and motion language.

---

## ANTI-PATTERNS (do NOT do these)

### Em-dash ban (the #1 AI Tell)

- **No em-dashes (` - `) anywhere on the page.** Not in
  headlines, eyebrows, body copy, button text, alt text,
  attribution, captions. ZERO. Use a period, comma, or "to"
  for ranges.
- **No en-dashes (` to `) as a separator.** Use " to " or " - "
  with a regular hyphen.
- This applies to the prompt itself, the Stitch output, AND
  any text generated by the agent. Audit every word.

### Typography Tells

- **No "Quietly in use at" / "From the field" / "Field notes"
  poetic labels.** Use plain functional language.
- **No version labels in the hero** ("V0.6", "BETA",
  "INVITE-ONLY"). Banner is the only "version" marker, and
  it is in a subtle corner.
- **No section-numbering eyebrows** ("01 / INDEX",
  "06 / how it works", "00 - From the operator").
- **No mid-dot (`·`) as default separator.** Use it max once
  per metadata strip.
- **No "Stage 1 / Stage 2 / Stage 3" generic step labels.**
  The actual verb IS the label.
- **No em-dash in quote attribution.** Use a normal hyphen
  with spaces or a line break.

### Visual Tells

- **No AI-purple / mesh-gradient / glassmorphism.**
- **No warm-beige + brass + oxblood palette.** (Banned
  premium-consumer default  -  this brand uses greens, sun,
  clay.)
- **No "Scroll ↓" cue.** No animated mouse-wheel icons.
- **No pills or labels overlaid on images** (no "Plate 03 ·
  Brand").
- **No photo-credit captions as decoration** ("Field study
  no. 12 · Ines Caetano").
- **No version footers** ("v0.6.2", "last sync 4s ago").
- **No locale / city-name / time / weather strips** ("LIS
  14:23 · 18°C"). Except the legitimate "LARGO . FLORIDA"
  signature mark on the OperatorStrip, which is intentional
  and contextual.
- **No "Reservation 412 of 800"** fake-stock counters.
- **No hand-rolled decorative SVGs as the primary visual
  language.** The 8 field-log pictograms on the schedule day
  cards are the only exception (they are functional pictograms,
  not decoration).
- **No fake screenshot divs.** No div-based terminal
  windows, fake dashboards, fake product UI.

### Layout Tells

- **No three equal feature cards.** The bento grid uses
  varied cell sizes. The pricing tier is the only 3-equal
  on the page (because pricing IS naturally comparable).
- **No "left big headline + right small explainer paragraph"
  split-headers.** Stack the headline and body vertically.
- **No zigzag left-image-right-text alternation** for more
  than 2 sections in a row. Break the pattern.
- **No empty bento cells.** Every cell has real content.
- **No 20-row spec tables** with `border-b` on every row.
  Use chunks, cards, or 2-col grids instead.

### Conversion Tells

- **No two CTAs with the same intent on the same page.**
  Each verb is different (Lock in / Book / Notify / Get a
  quote).
- **No "We respect the French ones"** mock-humble industry
  references in body copy.
- **No "trusted by {logo wall}"** in the hero. Logos go
  UNDER the hero, never inside it. This page does not have
  a logo wall (the brand is pre-revenue) but if added, it
  lives below the ServiceBento, with real SVG marks not plain
  text wordmarks.

### Content Tells

- **No "Acme", "Nexus", "SmartFlow", "Cloudly"** startup-slop
  brand names. The brand is "Largo Lawn"  -  concrete, local,
  real.
- **No "John Doe", "Sarah Chan", "Jack Su"** generic names.
  The operator has a real name; the FAQ uses "you" not
  "Casey R."
- **No fake-precise numbers** without real data. "47 yards
  on the weekly route" is real. Don't add "92% customer
  retention" if it isn't true.
- **No "free on its past"** grammatically-broken strings.
  Re-read every visible string before shipping.

### Color Consistency

- **One accent color (Sun) for the conversion CTAs across
  the WHOLE page.** Do NOT introduce a blue CTA in section 7
  because the bento is green. Stay locked.
- **No section-level theme inversion.** The page is light
  (Cream surface) except for 2 dark sections: Coverage
  Check (Palm Shadow) and FinalCTA (Palm Shadow). These
  two are intentional bookends; the rest of the page is
  consistently light.

### Mobile Tells

- **No `h-screen` full-height hero.** Use `min-h-[100dvh]`
  to prevent iOS Safari address-bar jump.
- **No "it'll work, Tailwind handles it" mobile assumptions.**
  Every multi-column layout must declare its < 768px fallback
  in the same component.
- **No nav with 2 lines on desktop.** 80px max height,
  single line.
- **No CTA that wraps to 2+ lines at desktop.** Shorten
  the label or widen the button.

---

## DARK MODE

Not implemented. Single light theme locked across the page
(accepts Palm Shadow as the only "dark" surface for the
Coverage Check and FinalCTA bookends, both intentional
moments of contrast in an otherwise light composition).

---

## MOBILE COLLAPSE

- Hero: single column, image first or below, CTAs full-width
  stacked, padding-top max 6rem
- Coverage Check: input + button stack vertically below 560px
- OperatorStrip: 3 columns → stacked single column
- ServiceBento: 2-col on tablet, 1-col on mobile, image-first
  in the large cells
- PricingTiers: 1-col stack on mobile (no horizontal
  comparison)
- ProcessSteps: 4-col → 2-col tablet → 1-col mobile
- ScheduleTimeline: see the section-specific prompt
- FAQ: 1-col, full-width rows
- FinalCTA: 1-col centered
- Sticky rail: full-width band on mobile (no pill)

---

## ACCESSIBILITY

- All inputs: visible label (sr-only if visual label is the
  placeholder), required indicator, focus ring, error text
- Coverage Check + ScheduleTimeline resolver: result panel
  has `aria-live="polite"` for screen reader announcement
- Progress bar: `role="progressbar"` with aria-valuenow /
  min / max
- FAQ: `aria-expanded` on the toggle, `aria-controls` pointing
  to the panel id
- All CTAs: visible focus ring (Clay 3px ring at 22% opacity)
- Heading structure: h1 (hero), h2 (section), h3 (subsection
  or card)
- Color contrast: all body text 4.5:1 minimum against surface
  (verified  -  Palm Bark on Cream = 16.5:1, Cream on Palm
  Green = 11.2:1, Palm Bark on Sun = 8.1:1, all pass WCAG AA
  body)
- Reduced motion: gated throughout, see Motion Language

---

## REAL ASSETS

The page uses these real webp illustrations from
`/public/illustrations/` and `/public/`:

- `/illustrations/largo-hero-ranch-house-v3.webp` (hero)
- `/illustrations/mower-side-profile-v3-120.webp` (today card)
- `/illustrations/mower-side-profile-v3-240.webp` (alt sizes)
- `/illustrations/pinellas-palm-v3-72.webp` (operator
  signature)
- `/illustrations/pinellas-palm-v3-120.webp` (pricing)
- `/illustrations/pinellas-palm-v3-600x400.webp` (alt sizes)
- `/illustrations/logo-mark-v3-32/64/128/256.webp` (logo)
- `/illustrations/corner-stamp.svg` (operator portrait)
- `/illustrations/quote-mark-v3-56/120/240/480.webp` (final
  CTA opener)
- `/illustrations/passport-stamp.svg` (hero stamp)
- `/illustrations/paper-grain.svg` (optional background
  texture)
- `/operator/portrait.webp` (operator portrait, placeholder
  SVG)
- `/services/mowing-v3.webp`, `/services/edging-v3.webp`, etc.
  (bento illustrations)
- `/areas/{zip}.webp` (per-area hero images for /areas/[zip]
  pages)

**No fake screenshots. No hand-rolled decorative SVGs beyond
the 8 functional field-log pictograms on the schedule day
cards and the 4 functional step pictograms on ProcessSteps.**

---

## REFERENCE NOTES

- 6 home-area ZIPs: 33770, 33771, 33773, 33774, 33778, 33756
- Quote prefill convention: `/quote?zip={zip}&day={Day}`  - 
  /quote pre-fills the ZIP field and (forward-compatible) the
  day-of-week preference
- Hurricane mode flag: `BUSINESS.hurricaneModeActive` (see
  `lib/business.ts`). When true, a site-wide HurricaneBanner
  mounts and the ServiceBento hurricane card highlights.
- Hurricane operating rule: no outdoor work in named-storm
  conditions or sustained winds >= 30 mph

---

## TIPS FOR STITCH

1. The visual hierarchy reads top-to-bottom. The hero is
   big, the Coverage Check is dark (contrast), the
   OperatorStrip is biographical, the ServiceBento is the
   "what I do" moment, the PricingTiers is the comparison
   moment, the ProcessSteps is the "how it works" moment,
   the ScheduleTimeline is the live data moment, the
   FAQAccordion is the "questions" moment, the FinalCTABanner
   is the dark closer, and the Sticky Rail is the persistent
   CTA between hero and closer. Each section has one job.
2. Sun color (`#e8b65a`) is reserved for the conversion
   CTAs. Don't use it for decorative elements. It is the
   "act now" color.
3. Clay color (`#b5651d`) is reserved for emphasis labels
   and the today-card border. It is the "this matters"
   color.
4. Cream `#faf6f0` is the dominant surface. The page is
   mostly negative space. Resist filling it. Every blank
   area is a place the visitor's eye can rest.
5. The 7 day cards on the schedule should be visually quiet.
   The week strip is reference info, not the conversion
   moment.
6. The hero is the only place where a giant illustration
   carries visual weight. Every other image is either a
   service illustration, a small pictogram, or a logo mark.
7. If the user wants to test the alternative "Local
   Pinellas" newspaper direction, swap the Section 7 prompt
   with the alternative direction block and regenerate.
   The two directions are designed to be run side-by-side
   for comparison.
8. The page is single-language English. No internationalization
   hooks in the design system. If a Spanish variant is needed
   in the future, all copy is in `apps/web/src/lib/content.ts`
   and can be swapped without component changes.
