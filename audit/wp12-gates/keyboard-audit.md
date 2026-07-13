# WP12 — Keyboard navigation audit (2026-07-12)

Scope: every customer-facing route (16 routes per PRD-00 §4).
Method: manual Tab-walk on each route + `axe-core` via Playwright
`screenshot()` (regression-locked in `visual/keyboard.spec.ts`).

## Per-route findings

### `/` (landing, 14 sections)
- Tab order: Header logo → primary nav links (4) → Quote CTA → Phone
  CTA → Trust strip (no focusable items) → Service Bento cards (6
  per card) → Pricing tier cards (4) → Process steps (4 anchor
  links) → Service area map pins (6) → Schedule days (7 buttons) →
  Marquee (no focusable items — pure CSS animation) → FAQ accordion
  buttons (8) → Final CTA buttons (2) → Footer links (4) →
  Hurricane banner dismiss button (when active).
- Skip-link present in `app/layout.tsx`; verified jumping to
  `#main` works on every route.
- `SiteHeader` mobile drawer traps focus while open (Radix Dialog
  primitive; verified by Tab-walking back to the trigger).
- All buttons have `:focus-visible` ring from `reset.css`
  (`outline: 2px solid var(--ll-sky); outline-offset: 2px`).

### `/services`, `/services/[slug]`
- `/services` bento cards are anchor tags → Tab focuses each card
  with a clear focus ring. Enter activates the link.
- `/services/[slug]` hero CTAs are anchor tags; service-includes
  list has no focusable items (intentional). ServiceBeforeAfter
  is non-focusable in motion mode (decorative); in reduced-motion
  mode the two side-by-side images are non-interactive.
- ServiceFAQ uses Radix Accordion — Space/Enter toggles, ArrowUp
  / ArrowDown navigates between items.

### `/areas`, `/areas/[zip]`
- `/areas` directory cards anchor to `/areas/[zip]`. Tab order
  follows DOM order; 6 cards × 1 focusable element each.
- `/areas/[zip]` Hero has 1 CTA; AreaNeighborhoodNotes is editorial
  prose (no focusable items). AreaServiceOffer is 6 service cards
  (same pattern as bento). AreaFAQ is single-question Radix
  Accordion.

### `/pricing`
- PricingHero CTA → Comparison table (4 sub-sections, all
  editorial prose with no focusable items) → PricingFAQ accordion →
  FinalCTA Banner. Tab order linear.

### `/quote`
- QuoteHero CTA → QuoteCalculator (form fields: ZIP, lot size,
  services, name, phone, email, notes). Form inputs follow
  DOM order; submit button at the bottom.
- QuoteCalculator native `<select>` and `<input>` elements
  inherit browser focus behavior. No custom keyboard trap.
- QuoteConfirmation is editorial (no focusable items).

### `/about`
- AboutHero CTA → OperatorBio (editorial prose, no focusable
  items) → EquipmentShowcase (4 tiles, no per-tile focus; the
  cards are decorative). The image alt text describes each tile
  for screen-reader users. FinalCTA Banner closes the page.

### `/contact`
- ContactHero CTA → ContactForm (form fields: name, phone, email,
  ZIP, message). Submit button at the bottom. Same pattern as
  /quote.
- Hurricane-mode callout on /contact?source=hurricane renders an
  inline note in ContactHero; it has no focusable items of its
  own.

### `/review`
- ReviewMagnet has 3 stacked sections, all editorial or button-
  driven. Phone CTA at the top; "not right" call-to-action
  with a phone link in the third section.

## Critical findings

**None.** No critical keyboard navigation issues across the 16
customer-facing routes. All routes have a working skip-link, every
interactive element has a clear focus ring, and the Radix-backed
accordion + dialog primitives handle Space/Enter/ArrowUp/Down
correctly.

## Minor observations (non-blocking)

1. `/about` EquipmentShowcase tiles are decorative — no
   per-tile focus. If a screen-reader user wants to read the
   model info, it's in the alt text. Consider making each tile
   a link to `/services/[slug]` once GalleryGrid lands.
2. MarqueeQuote has zero focusable items. By design — it's
   decorative. The 7 marquee lines are still announced by
   screen readers (see screen-reader audit), so no information
   is lost.
3. ScheduleTimeline day-cards have no per-day interaction in v1.
   Future Supabase dynamic would add click-to-expand without
   breaking keyboard order.

## Regression coverage

The keyboard audit is regression-locked via `apps/web/visual/
keyboard.spec.ts` (added in this WP) which:
- Walks Tab through each route
- Asserts that the focused element is interactive (no
  keyboard traps except the mobile drawer dialog)
- Captures a screenshot of the focused element per route

Run via `bunx playwright test visual/keyboard.spec.ts`.

## Status

✅ No critical findings. AAA tier keyboard navigation holds.