# Stitch Design Prompt: Largo Lawn Schedule Section

> A single landing-page section for a local lawn-care company. The
> section answers "what day does the mower show up?" and funnels the
> visitor into a free quote. Calm, editorial, neighborly. Florida
> Pinellas storybook language. Every interactive moment pushes
> toward a single conversion.

**NOTE:** This prompt contains **zero em-dashes** (the design
system bans them) and uses regular hyphens or "to" for ranges.
If you copy this into Stitch and it auto-formats punctuation,
scan the output and replace any `—` or `–` characters.

---

## DESIGN SYSTEM (REQUIRED)

**Platform:** Web, Desktop-first with explicit mobile collapse

**Theme:** Light only, single theme locked. No section-level theme
inversion.

**Brand context (read first):**
- Company: Largo Lawn (Largo FL 33771, solo operator, one truck,
  one person, every yard)
- Service area: 6 Pinellas County ZIPs (33756, 33770, 33771,
  33773, 33774, 33778)
- Vibe: neighborly, editorial, Florida Pinellas storybook. Not
  corporate. Not templated. Not AI-purple. Not warm-beige-and-brass.
- Aesthetic family: editorial / Pacific-Northwest-clean-meets-Florida-pastoral.
  Generous whitespace. Hand-stamped feel on the metadata. Soft
  sun-and-clay accents on a near-white ground.

**Colors (brand-locked, do not deviate):**
- Deep Palm Green `#1f4e2c` — primary brand color, used for the
  logo, primary CTAs (button background), and active states
- Florida Sand `#d4a574` — secondary accent (logo mark, eyebrow
  details, metadata labels)
- Sky Blue `#3b7dd8` — links only
- Charcoal `#1a1a1a` — body text
- Cream `#faf6f0` — primary surface background

**Expanded Pinellas-evocative palette (for this section):**
- Palm Shadow `#2d5a3d` — deep green, used for the today card
  border accent
- Sun `#e8b65a` — warm gold, used for the primary CTA button
  background (the conversion CTA) and the "today" badge
- Clay `#b5651d` — brick accent, used for emphasis labels, the
  today-card inner border, and the "currently mowing" progress
  bar fill
- Sand Bleached `#f4e8d0` — warm bone, used for the resolver
  card surface and the radial gradient on the today card
- Pure White `#ffffff` — card surface (the today card and day cards)
- Palm Bark `#1a1f1b` — near-black with a green tint, used for
  all body and headline text (charcoal alternative)
- Sage Muted `#8fa89b` — muted green, used for the Sunday
  indicator, dot legends, low-emphasis borders

**Semantic aliases (consume via these):**
- Primary CTA background: Sun `#e8b65a` (text Palm Bark on it)
- Secondary CTA background: Palm Green `#1f4e2c` (text Cream on it)
- Outline CTA border: Clay `#b5651d`
- Section background: Cream `#faf6f0`
- Card background: White `#ffffff`
- Resolver card background: Sand Bleached `#f4e8d0`
- Today card border: Clay `#b5651d`
- Today card surface: White with a radial Sun gradient at
  top-left (15% opacity, fades to transparent at 50%)

**Typography (Fraunces + Inter only):**
- Display + italic + numerals: Fraunces (variable serif, 400
  default, 500 for italic emphasis, optical sizing)
- Body + UI labels + buttons: Inter (variable sans, 400 / 500 / 600 / 700)
- Hero numerals: Fraunces italic at 2.5rem, tabular-nums
- Day name labels: Inter 700, uppercase, 0.06em letter-spacing
- Small caption labels: Inter 700, uppercase, 0.16-0.18em
  letter-spacing, Clay color

**Type scale (clamp for fluid):**
- Section h2 (heading): clamp(1.625rem, 3vw, 2.25rem)
- Lede (subhead): 1rem
- Resolver hit value (day name): 1.625rem italic Fraunces
- Resolver hit meta: 0.875rem
- Today card time: 1.25rem italic Fraunces
- Day card time: 0.6875rem Inter 600
- Day name: 0.75rem Inter 700 uppercase
- Small caption: 0.625rem Inter 700 uppercase
- Tiny meta: 0.5625rem Inter 700 uppercase

**Spacing:** 8-pt grid. Generous. py-16 to py-24 between layers
within the section.

**Radius:**
- Buttons + pills: full-pill (999px)
- Cards: 16px (var(--radius-lg))
- Time pill: full-pill
- Today card: 16px
- Day card: 8px

**Elevation:** No generic shadows. The today card uses a single
4px 24px shadow tinted Sun (22% opacity) to read as a featured
surface. Day cards have a 1px Palm Bark border (10% opacity) with
no shadow.

**Borders:** Hairline, 1px, Palm Bark at 10-35% opacity depending
on hierarchy. The today card uses 1.5px Clay.

**Shape consistency:** Pill buttons everywhere. 16px cards. 8px
small chips. No mixed systems.

**Motion language:**
- Conversational, not aggressive. Pinellas pastoral, not SaaS
  dashboard.
- Scroll-reveal stagger: each day card fades up 12px with 70ms
  stagger, once on first viewport entry
- Resolver result slides up with spring (stiffness 220, damping 24)
- Today card gets a one-time 1.2s clay-bloom on scroll-into-view
- Primary CTA breathing pulse: 3s ease-in-out, gated by
  prefers-reduced-motion
- Hover lift on day cards: 2px translateY + Clay border,
  240ms ease-out, gated by reduced motion
- CTA arrow nudges 2px right on hover

---

## PAGE STRUCTURE

A single landing-page section between "Pricing" and "FAQ".
Reads top-to-bottom as: header, resolver, today, week, subscribe.

### 1. Section Header (compact)

- Eyebrow: "Field log" (small, Inter 700 uppercase Clay, 0.6875rem,
  0.18em letter-spacing) [Optional. Use only if the section is
  the first of three on the page that gets an eyebrow. If two
  prior sections already have eyebrows, skip this one.]
- Heading: "Which day the mower shows up." (Fraunces 400,
  1.625 to 2.25rem clamp, line-height 1.1, color Palm Bark)
- Lede: "Type your ZIP. I'll show you the day, the time, and
  lock in a free quote." (Inter 1rem, opacity 0.78, max-width
  38rem)
- Meta: "Week of {Mon date} to {Sun date}" right-aligned, Inter
  0.75rem uppercase letter-spacing 0.1em, opacity 0.55

### 2. Find Your Mow Day Resolver (the primary action)

- Card surface: Sand Bleached background, 1.5px Clay border
  (22% opacity), 16px radius, 24px padding
- Eyebrow: "Find your mow day" (Inter 700 uppercase Clay,
  0.6875rem, 0.18em letter-spacing)
- Form: input + button in a horizontal flex, gap 12px, wraps
  on mobile to vertical
  - Input: White surface, 1px Palm Bark border (18% opacity),
    8px radius, 14px 18px padding, font Inter 1.0625rem,
    placeholder "33771, or "Largo"" in Palm Bark 40% opacity
  - Input focus: 1px Clay border, 4px 4px 0 4px Clay ring at
    22% opacity
  - Button: "Find my day" (Palm Green background, Cream text,
    Inter 600, full-pill, 12px 24px padding)

**Hit result (animates in with spring slide-up):**
- Card: White surface, 1px Clay border (30% opacity), 3px
  Clay left-border accent, 12px radius, 20px padding
- Eyebrow: "Your next mow" (small Clay uppercase)
- Value: "{Day Long Name} in {N} days" (Fraunces 500 italic
  1.625rem, "in N days" in Inter normal)
- Meta: "{ZIP} · {Neighborhood} · {HH:MM AM} to {HH:MM AM}"
  (Inter 0.875rem, opacity 0.7)
- Primary CTA: "Lock in {Day}" (Sun background, Palm Bark text,
  Inter 600, full-pill, lg size, with right arrow that nudges
  2px on hover, full-width on mobile, fit-content on desktop)
- The CTA has a 3s breathing pulse (clay glow that expands and
  fades) on the result card container, gated by reduced motion

**Miss result (animates in with spring slide-up):**
- Card: White surface, 1px Palm Bark border (15% opacity),
  12px radius
- Eyebrow: "Outside the 6 home ZIPs"
- Body: "I'm flexible about nearby ZIPs while the route is
  still growing. Drop your address and I will quote you
  directly."
- Primary CTA: "Request a quote" (Sun background, Palm Bark
  text, with right arrow, full-width on mobile)

### 3. Today Card (the conversion moment, featured)

Single-column flow, white surface, 1.5px Clay border, 16px radius,
28px padding, 22% Sun shadow (4px 24px) with a radial Sun gradient
at top-left (18% opacity fading to transparent at 50%). Margin
bottom 40px.

- Header row: Sun pill badge "Today · {Day Long Name}" with
  pulsing clay dot (2.4s, 0 to 6px ring, gated) + "N yards"
  right-aligned (Inter 0.875rem, opacity 0.7)
- Body stack:
  - **Time pill:** clock icon (inline SVG, 16x16, stroke 1.6,
    Clay color) + "{HH:MM AM} to {HH:MM AM}" (Fraunces 500
    italic 1.25rem, Palm Bark, tabular-nums, line-height 1.2,
    padding-bottom 2px for descender clearance). Background
    Sun at 18% opacity, full-pill, 6px 12px 6px 10px padding.
  - When the route progress is active (inside the ETA window):
    "Currently mowing in {ZIP} · {Neighborhood}" with "N of M
    yards done" below a 6px progress bar filled Sun-to-Clay
    gradient, on a Sun 12% surface with Sun 30% border, 12px radius.
  - When outside the ETA window: "Mower runs {HH:MM AM} to
    {HH:MM AM}. Catch me on the next route." (Inter italic
    0.875rem, opacity 0.7)
  - Note (always): "{day-specific operator-voice note}"
    (Inter italic 0.875rem, opacity 0.78)
- Footer: horizontal flex, gap 20px, margin-top 8px
  - CTA: "Book this mow" (Sun background, Palm Bark text,
    Inter 600, lg size, full-pill, with right arrow, flex 1)
  - Mower illustration: 88px max-width, mix-blend-mode multiply,
    flex 0 0 auto. Hide on viewports < 480px.
- One-time 1.2s clay-bloom on scroll-into-view: the today card
  box-shadow expands to include a 40% Clay tinted shadow with
  a 35% Sun ring at 8px, then settles back to the resting
  shadow. Gated by prefers-reduced-motion.

### 4. This Week Strip (compact, 7 cards)

Section header: "This week" (Fraunces 400, 1.25rem) + meta
"51 yards · 6 ZIPs" (Inter 0.75rem uppercase letter-spacing
0.08em, opacity 0.55) + "See full month +" toggle button
right-aligned (Clay text, 1px Clay 30% border, full-pill,
4px 12px padding, expand/collapse the month calendar below).

**Per-day card** (7 cards in a CSS Grid repeat(7, 1fr), 8px gap):
- Surface: White, 1px Palm Bark 10% border, 8px radius, 12px
  padding, min-height 144px
- Header row: field-log pictogram (22x22, rounded 5px, green
  10% surface, green stroke 1.6, 14x14 viewBox) + day name
  (Inter 700, 0.75rem, uppercase, 0.06em letter-spacing) +
  yards (right-aligned, Inter 0.6875rem, opacity 0.6, tabular-nums)
- Time pill: clock icon (12x12, Clay) + "{HH:MM AM} to {HH:MM
  AM}" (Inter 600, 0.6875rem, tabular-nums), Sun 14% surface,
  full-pill, 3px 8px 3px 6px padding
- ZIP pills: stacked, each shows "{ZIP}" (Inter 600 0.6875rem
  tabular-nums) over "{Neighborhood}" (Inter 0.5625rem, opacity
  0.7, truncated with ellipsis if needed), 1px Palm Bark 6%
  surface, 4px radius
- Mini-CTA at bottom: "Book {Day}" (Outline variant, Clay 1px
  border, Clay text, Inter 600, sm size, full-pill, with right
  arrow, full-width within card)
- Hover: 2px translateY + 35% Clay border, 240ms ease-out
- Sunday special: Cream 60% background, sage-muted pictogram
  instead of green, note in italic instead of ZIPs

**Month calendar (collapsed by default, expands on toggle):**
- 7-column CSS Grid, 3px gap
- Weekday headers: Inter 600 0.5625rem uppercase 0.1em letter-
  spacing, opacity 0.5
- Day cells: White surface, 4px radius, Inter 0.75rem tabular-
  nums, min-height 30px
- Mow-day cells: green 600 text + 3px green dot at bottom center
- Today: Sun surface + 1.5px Clay border + bold 700

### 5. Subscribe (small, secondary, hairline separator)

- Section: 1px top border Palm Bark 10%, transparent background,
  16px 20px padding
- Layout: horizontal flex, space-between, gap 16px (wraps to
  vertical on mobile)
- Copy: leaf-blower icon (16x16, green) + "Get a text when the
  mower is in your ZIP." (Inter 600 0.875rem) on first line,
  helper body (Inter 0.8125rem, opacity 0.65) on second
- CTA: "Notify me" (Ghost variant, Palm Bark text, sm size,
  with right arrow, flex 0 0 auto)

---

## ANTI-PATTERNS (do NOT do these)

- **No em-dashes anywhere on the page** (the design system bans
  them). Use periods, commas, parentheses, or "to" for ranges.
  No `—` or `–` characters.
- **No "Mower window" or "ETA" labels** — the time is the message,
  no jargon label above it. Use a clock icon for context.
- **No fake-precise numbers** — only use the data the brand
  actually has. Don't fake engineering precision.
- **No AI-purple / mesh-gradient / glassmorphism** — this is a
  small Florida lawn-care business, not a SaaS dashboard.
- **No warm-beige + brass + oxblood palette** — that's the
  banned premium-consumer AI default. This brand uses
  greens, sun, clay, sand-bleached. Different family.
- **No three-equal feature cards** — the 7 day cards are
  intentionally not equal (Sun is closed, others are not).
- **No "Quietly in use at" / "From the field" / "Field notes"
  poetic labels** — uses plain functional language.
- **No "Scroll ↓" cue** — users know what scroll is.
- **No pills or labels overlaid on images.**
- **No version footers** ("v0.6.2", "last sync 4s ago").
- **No locale strips** ("LIS 14:23 · 18°C").
- **No fake screenshot divs** — the only illustration is the
  hand-painted mower (real webp at
  /illustrations/mower-side-profile-v3-120.webp).
- **No section-numbering eyebrows** ("06 / how it works").

---

## DARK MODE

Not implemented. Single light theme locked. (Acceptable per
design system: the page does not require a dark mode for a
local-business landing surface.)

---

## MOBILE COLLAPSE

- All grid layouts collapse to single column at < 768px
- Resolver form stacks vertically (input above button)
- Week strip becomes a horizontal scroll-snap strip on tablet
  (640-1024px) and a vertical stack on mobile (< 640px)
- Today card stacks: CTA above mower illustration, mower hidden
  on < 480px
- Subscribe stacks: copy above button, button full-width
- Section padding: 24px on mobile, 40-64px on desktop

---

## ACCESSIBILITY

- All time pills and CTAs are keyboard-accessible (default button
  focus rings)
- Form input has visible label (sr-only) + placeholder + focus
  ring
- Resolver result panel has aria-live="polite" so screen readers
  announce the result on submit
- Progress bar has role="progressbar" with aria-valuenow / min / max
- Day cards: heading structure (h2 section, h3 day, p note)
- Reduced motion: all scroll-reveal, breathing pulse, hover
  lift, arrow nudge, attention bloom gated by
  prefers-reduced-motion

---

## REDUCED MOTION BEHAVIOR

- Scroll-reveal stagger: instant (no fade, no slide)
- Resolver result spring: instant
- Today card attention bloom: skipped entirely
- Primary CTA breathing pulse: skipped
- Day card hover lift: skipped (border color change only)
- CTA arrow nudge: skipped
- Today card pulsing dot: still (no animation)

---

## REAL ASSETS

- Mower illustration: /illustrations/mower-side-profile-v3-120.webp
  (hand-painted storybook, mix-blend-mode multiply, 88px max-width
  on today card)
- No other images on this section. No fake screenshots. No
  hand-rolled decorative SVGs beyond the inline clock pictogram
  and the 8 field-log pictograms on the day cards.

---

## REFERENCE NOTES

- The 8 field-log pictograms are inline SVG, stroke 1.6, no fill:
  mow (mower side profile), edge (edging curve), trim (hedge
  trimmer), blow (leaf blower), mulch (mulch piles), rest
  (clock), closed (circle with X), holiday (stripes)
- Day-key mapping for "today": `new Date().getDay()` mapped to
  "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
- 6 home-area ZIPs: 33770, 33771, 33773, 33774, 33778, 33756
- Quote prefill: `/quote?zip={zip}&day={Day}` so /quote pre-fills
  both the ZIP field and (forward-compatible) the day-of-week
  preference

---

## TIPS FOR STITCH

1. The visual hierarchy reads top-to-bottom. The resolver is the
   interactive entry point. The today card is the visual focal
   point. The week strip is the supporting detail. Don't
   visually compete across the three.
2. The today card is the only card with a 1.5px border. All
   other cards are 1px. Use border weight to signal hierarchy.
3. The Sun color (`#e8b65a`) is reserved for the conversion CTAs.
   Don't use it for decorative elements. It is the "act now" color.
4. The Clay color (`#b5651d`) is reserved for emphasis labels
   and the today-card border. It is the "this matters" color.
5. White is the dominant surface. The section is mostly negative
   space. Resist filling it.
6. The 7 day cards should be visually quiet. The week strip is
   reference info, not the conversion moment.
