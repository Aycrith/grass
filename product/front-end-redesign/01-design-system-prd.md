# PRD-01 — Design System

**Status:** Draft — tokens pending steward direction
**Audience:** Designer + engineer
**Implementation target:** `apps/web/src/styles/tokens.css` + component-level CSS modules

---

## Purpose

A single source of truth for every visual decision on the Largo Lawn web
app. Every component reads from this document (and the corresponding CSS
tokens). The steward can change the brand by changing values here; nothing
else has to move.

This is the redesign's **most important document** — get this right and
the rest of the surfaces are decoration.

---

## 1. Color

### Current state
The current `globals.css` defines:
- `--ll-green: #1F4E2C` (deep forest)
- `--ll-sand: #D4A574` (Florida earth)
- `--ll-sky: #3B7DD8` (trust blue)
- `--ll-charcoal: #1A1A1A` (near-black)
- `--ll-cream: #FAF6F0` (warm off-white)

### The critique
These five colors are **plausible but placeless**. They could be a
sustainable clothing brand, a coffee roaster, a yoga studio, or a lawn-care
company. The visual signal that says "Florida lawn" is missing.

### Proposal A — "Pinellas-evocative" (default pending steward direction)

```
<<STEWARD: ratify this palette, substitute, or override entirely>>

--ll-palm-shadow:  #2D5A3D  /* deeper, more saturated green */
--ll-palm-light:    #6B9B7E  /* mid-green for hover, secondary surfaces */
--ll-gulf:          #2E6B8C  /* muted blue-green — water/clean-cut horizon */
--ll-sun:           #E8B65A  /* warm afternoon yellow */
--ll-clay:          #B5651D  /* terra cotta, mulch/earth accent */
--ll-sand-bleached: #F4E8D0  /* background, paper-warmth */
--ll-shell:         #FFFFFF  /* pure white — cards on sand-bleached bg */
--ll-palm-bark:     #1A1F1B  /* body text, deeper than pure black */
--ll-sage-muted:    #8FA89B  /* disabled state, meta text */
```

Rationale:
- **Palm-shadow green** is deeper and more saturated than the current
  forest green — reads as "growing things" not "recycled paper."
- **Gulf** is a desaturated blue-green that says "water horizon"
  without being tropical kitsch.
- **Sun** replaces `ll-sky` for CTAs — yellow gets attention without
  screaming, and reads as "summer work."
- **Clay** is a mulch/earth accent used sparingly for destructive
  action buttons (cancel, delete) and hurricane-prep imagery.
- **Sand-bleached** is the new background — warmer and more textured
  than `ll-cream`, suggests boardwalk planks or beach canvas.

### Proposal B — Steward's own palette

If the steward has a different palette in mind (a specific photo, a
favorite color, a designer reference), paste it here:

```
<<STEWARD: paste your palette + rationale here, OR leave empty to
  default to Proposal A>>

--ll-primary:   #______
--ll-secondary: #______
--ll-accent:    #______
--ll-bg:        #______
--ll-text:      #______
--ll-muted:     #______
```

### Usage rules

| Token | Use for | Don't use for |
|---|---|---|
| `--ll-palm-shadow` | Primary buttons, links, header logo | Body text (too dark), backgrounds (too saturated) |
| `--ll-palm-light` | Hover state, secondary buttons, section backgrounds | Primary actions (not strong enough) |
| `--ll-gulf` | Information badges, links to /areas, decorative dividers | Body text (low contrast) |
| `--ll-sun` | CTA buttons that need attention (Free Quote, Send Quote) | Anything decorative (too saturated) |
| `--ll-clay` | Destructive actions, hurricane-warning state | Anything default |
| `--ll-sand-bleached` | Body background, section breaks, hero backdrop | Cards (use `--ll-shell`) |
| `--ll-shell` | Cards on `--ll-sand-bleached` | Body background (too stark against `--ll-palm-shadow` text) |
| `--ll-palm-bark` | Body text, headings | Decorative |
| `--ll-sage-muted` | Disabled states, captions, meta | Anything that needs to be read at speed |

### Contrast requirements (WCAG AA)

- Body text on body background: ≥4.5:1
- Large text (≥24pt) on background: ≥3:1
- Interactive elements (button, link): ≥3:1 against adjacent color
- Hurricane-warning text on `--ll-clay`: ≥4.5:1 (white text)

Run `axe-core` in CI against every page to enforce.

## 2. Typography

### Current state
Single Inter weight ramp (400, 500, 600, 700). One line-height (1.6).
Three heading sizes (h1: 2.5rem, h2: 1.8rem, h3: 1.3rem).

### The critique
Inter is the **default of defaults**. It's the typography choice that
signals "we did not make a typography choice." For a local business that
sells craft (clean-cut grass, sharp edges), the typography should reflect
that craft.

### Proposal A — "Editorial warm" (default pending steward direction)

```
<<STEWARD: ratify these fonts, substitute, OR override entirely>>

Display font:  Fraunces (variable serif, optical sizing)
              Used for: h1, hero headlines, service names
              Why: warm, contemporary, has a "made by a person" feel,
                   variable axes (weight + optical size) give a real
                   type-designer's toolset

Body font:    Inter (variable, 400-700)
              Used for: body, h2-h6, UI controls
              Why: excellent legibility, neutral, doesn't fight the
                   display font

Mono font:    JetBrains Mono (used for /quote calculator output,
              phone numbers, ZIP codes)
              Why: technical feel for data, distinct from display + body
```

All three are open-source (Google Fonts / OFL) — **$0 spend**.

If the steward prefers sans-only (no display serif):

```
<<STEWARD: ratify single-font choice + weights>>

--font-display: "Inter", -apple-system, ...
--font-body:    "Inter", -apple-system, ...

Use weights 800/900 for display moments.
```

### Type scale (modular, 1.250 ratio)

```
--text-xs:    0.8rem    /* captions, meta */
--text-sm:    0.9rem    /* small body, table cells */
--text-base:  1rem      /* body */
--text-lg:    1.25rem   /* large body, lead paragraphs */
--text-xl:    1.563rem  /* h3, card titles */
--text-2xl:   1.953rem  /* h2 */
--text-3xl:   2.441rem  /* h1, service page hero */
--text-4xl:   3.052rem  /* homepage hero */
--text-5xl:   3.815rem  /* homepage hero, mobile fallback */
```

### Line-height rules

| Element | Line-height | Letter-spacing |
|---|---|---|
| Body text | 1.6 | 0 |
| Headings (h1-h3) | 1.15 | -0.02em (display) / -0.01em (body) |
| Display headings | 1.05 | -0.03em |
| UI controls | 1.3 | 0 |
| Buttons | 1.2 | 0.01em |

### Weight ramp

| Weight | Use |
|---|---|
| 400 | Body text, descriptions |
| 500 | UI controls, captions with emphasis |
| 600 | Subheadings, button labels |
| 700 | h3-h6, emphasized body |
| 800 | h2 |
| 900 | h1, hero headlines |

## 3. Spacing

### Scale (4px base unit, geometric)

```
--space-1:  0.25rem   /* 4px */
--space-2:  0.5rem    /* 8px */
--space-3:  0.75rem   /* 12px */
--space-4:  1rem      /* 16px */
--space-5:  1.5rem    /* 24px */
--space-6:  2rem      /* 32px */
--space-7:  3rem      /* 48px */
--space-8:  4rem      /* 64px */
--space-9:  6rem      /* 96px */
--space-10: 8rem      /* 128px */
```

### Layout rhythm

- Page vertical rhythm: `--space-7` between major sections
- Card internal padding: `--space-5`
- Hero vertical padding: `--space-9` top, `--space-9` bottom
- Mobile: half each value
- Section header to first content: `--space-3`
- Section header to next section: `--space-8`

## 4. Radii

```
--radius-sm:   4px     /* small chips, badges */
--radius:      8px     /* buttons, inputs */
--radius-lg:   16px    /* cards */
--radius-xl:   24px    /* hero cards, hero image masks */
--radius-full: 9999px  /* pills, avatar */
```

Replace current single 6px radius with this scale.

## 5. Elevation

Three levels, all using subtle `palm-shadow` tint (no gray shadows):

```
--elevation-1: 0 1px 2px rgba(45, 90, 61, 0.05), 0 1px 1px rgba(45, 90, 61, 0.04);
                /* card rest state */

--elevation-2: 0 4px 8px rgba(45, 90, 61, 0.06), 0 2px 4px rgba(45, 90, 61, 0.04);
                /* card hover, dropdown */

--elevation-3: 0 12px 24px rgba(45, 90, 61, 0.10), 0 4px 8px rgba(45, 90, 61, 0.06);
                /* modal, sticky header, hero image float */
```

Tinted shadows read more like "this object is in the world" than gray
shadows which read as "this object is digital."

## 6. Iconography

### Style
**Lucide** (open-source, MIT, ~1,200 icons, tree-shakeable to per-icon).
Used at 1.5px stroke, 24×24 default, scaled by `--space-*` for sizing.

### Custom icons (need to author)
These are business-specific and don't exist in Lucide:
- Lawn mower (front view)
- Edger (close-up of curb)
- Mulch pile / wheelbarrow
- Hedge trimmer
- Hurricane cone / path
- Yard with sign / 33771 sign

Authored as inline SVG, 24×24 viewBox, 1.5px stroke, `currentColor` for
fill.

## 7. Imagery

### Photography
- Real yards, real grass, real sun
- Steward (you) takes them with phone camera — no photographer cost
- Settings: outdoor, golden hour or overcast (no harsh midday)
- Composition: rule of thirds, mower visible or recently-active yard
- Aspect ratio: 3:2 (landscape), 4:5 (portrait — service cards)

### Illustration
- Empty states (no yards yet): hand-drawn or geometric yard icons
- Map markers (if we add map): circular badges with brand mark
- Decorative dividers: stylized grass blade or horizon line

### Anti-patterns (do NOT use)
- Stock photos of "smiling family in front of perfect lawn"
- Generic green grass texture tiles
- Tropical kitsch (palm tree silhouettes, flamingos)
- Lawn equipment cutouts on white backgrounds
- AI-generated people
- Lorem-ipsum image placeholders visible to end-users

Full brief in `05-photography-and-illustration-brief.md`.

## 8. Motion

### Principles
1. **Restrained by default.** Page loads are still and content-first.
2. **Earned expressiveness.** Motion only on user-initiated interaction
   or to draw attention to a state change (form submit success, lead
   acknowledged).
3. **Respects `prefers-reduced-motion`.** Every animated property has a
   static fallback.
4. **Performance-budgeted.** No animation > 16ms per frame on mid-tier
   Android.

### Tokens

```
--motion-duration-fast:    150ms   /* hover, focus */
--motion-duration-base:    240ms   /* most transitions */
--motion-duration-slow:    400ms   /* page transitions, hero entrance */
--motion-easing-default:   cubic-bezier(0.4, 0, 0.2, 1)   /* ease-out-quart */
--motion-easing-emphasize: cubic-bezier(0.2, 0, 0, 1)     /* ease-out-expo */
```

Full motion spec in `04-motion-and-microinteractions.md`.

## 9. Component inventory (target)

Components needed (each gets a CSS Module + Storybook-style preview page
at `/preview/design/components`):

| Component | Purpose | Status |
|---|---|---|
| `Button` | Primary, secondary, outline, destructive variants | Replace inline `.btn` |
| `Input` | Text, email, tel, select, textarea | Replace inline inputs |
| `Card` | Service card, area card, pricing card | Replace `.card` |
| `Hero` | Composable hero with optional imagery | Replace `.hero` |
| `Section` | Vertical-rhythm wrapper | New |
| `LogoMark` | Inline brand mark, multiple sizes | New |
| `LogoLockup` | Mark + wordmark combined | New |
| `Nav` | Sticky header with mobile drawer | Replace inline `.site-header` |
| `Footer` | NAP block, hours, social, sitemap | Replace inline `.site-footer` |
| `Badge` | Service tier ("Most popular"), status ("Hurricane watch") | New |
| `Quote` | Pull-quote component for testimonials | New |
| `Avatar` | Operator photo | New |
| `Gallery` | Image grid with lightbox | New |
| `Map` | Optional — Leaflet or static image of service area | New |
| `FAQ` | Accessible expand/collapse | New |
| `Calculator` | Existing QuoteCalculator, refactored to design system | Refactor |
| `Toast` | Form submit success | New |
| `Banner` | Hurricane-mode, sale, announcement | New |
| `Skeleton` | Loading state for dynamic content | New |

## 10. Implementation plan

`apps/web/src/styles/` becomes:

```
tokens.css       /* all CSS custom properties */
reset.css        /* minimal reset */
typography.css   /* type scale + utility classes */
layout.css       /* container, section, grid utilities */
components/
  button.module.css
  card.module.css
  hero.module.css
  ...
globals.css      /* only imports above + base html/body */
```

Each page imports `globals.css` (which imports the rest) and uses CSS
Modules per-component. No Tailwind. No styled-components. No CSS-in-JS.

## 11. Verification

- Every component renders correctly in `/preview/design/components`
- Lighthouse Performance ≥90 mobile / ≥95 desktop
- Color contrast audit (`axe-core` CI) passes on every page
- Reduced-motion preference respected (manual test in DevTools)

## 12. What this document does NOT cover

- Detailed copy for every surface → `02-content-model.md`, `03-surfaces-prd.md`
- Motion choreography → `04-motion-and-microinteractions.md`
- Photography direction → `05-photography-and-illustration-brief.md`
- Component-level Storybook stories → engineering work, post-design-system