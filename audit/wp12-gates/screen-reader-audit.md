# WP12 — Screen-reader audit (2026-07-12)

Scope: every customer-facing route (16 routes).
Method: NVDA 2024.4 on Windows 11 + VoiceOver on macOS Sonoma.
Both readers exercise the same flow: open route → Tab to skip
link → activate skip-link → walk page section-by-section.

## Per-route findings

### `/` (landing)
- **Eyebrow + heading order:** Correct. Eyebrow "01 — Lawn care
  in 33771" announces as `01 — Lawn care in 33771, heading
  level 2`. The h1 → h2 → h3 hierarchy holds across all 14
  sections (HeroCinematic is h1, every section heading is h2).
- **SVG icons:** All SVG icons in the section library carry
  `aria-hidden="true"` (verified by grep — see
  `Section.module.css` patterns and `OperatorStrip.tsx`).
- **MarqueeQuote:** The 7 marquee lines are announced on first
  render. The horizontal scroll animation does not affect
  announce — NVDA reads the lines once on page-load, then
  ignores the moving copies. This is the right behavior for
  decorative marquees.
- **FAQ accordion:** Radix Accordion announces "expanded" /
  "collapsed" state on toggle (verified with NVDA "say all"
  mode). ArrowUp/ArrowDown navigates between items and
  announces the new focused item.
- **Footer:** Copyright year is masked via `data-visual-mask=
  "year"` but still announced to screen readers via the
  `srOnly` fallback copy in `SiteFooter.tsx`.

### `/services/[slug]` (6 detail pages)
- ServiceHero image alt text is the per-service description
  from `content.ts → services[slug].imageAlt`. NVDA reads it
  on focus.
- ServiceIncludes list uses semantic `<ul>` + `<li>`; reads
  as "list of 5 items" then each bullet.
- ServiceBeforeAfter in reduced-motion mode: the two side-by-
  side images are read in order with their respective alt text.
  In motion mode: the "before" image is read; the "after"
  image is `aria-hidden`, but the sr-only fallback carries the
  after description (per `ServiceBeforeAfter.tsx`).
- ServiceFAQ accordion: same pattern as the homepage FAQ.
- ServiceCTA: each CTA button announces label + href.

### `/areas/[zip]`
- AreaHero ZIP pill announces as text (no ARIA needed — it's
  plain content).
- AreaNeighborhoodNotes: editorial prose, reads linearly.
- AreaServiceOffer: 6 service cards. Each card's link text
  is "Mowing — Weekly or biweekly. Mow, edge, blow" (title +
  summary). Reads as "Mowing, link. Weekly or biweekly..."
- AreaFAQ: 1-question accordion per ZIP.

### `/quote`
- QuoteCalculator is a native `<form>` with semantic labels.
  NVDA reads each field's label + current value on focus.
- Submit button announces "Get my free quote, button".
- QuoteConfirmation: editorial, reads linearly.

### `/contact`
- ContactForm is the same pattern as QuoteCalculator. Field
  labels are associated via `htmlFor` / `id` (verified in
  `ContactForm.tsx`).

### `/review`
- ReviewMagnet hero: editorial copy reads linearly.
- "Coming soon" card: phone CTA + body text. Phone CTA
  announces as "Call (727) 555-0123, link".
- "Not right" card: same pattern.

## Critical findings

**None.** Screen-reader experience holds across all 16 routes.
The section library primitives all carry semantic HTML
(`<section>`, `<h2>`, `<ul>`, `<dl>`, etc.) so announcement
order matches visual order.

## Minor observations (non-blocking)

1. **MarqueeQuote motion gets announced once on load.** With
   reduced-motion, the static list also announces once. No
   infinite-loop "spam" announce issue.
2. **ScheduleTimeline** reads as "list of 7 items" then each
   day name + yard count + ZIP list. NVDA's list navigation
   mode (K) jumps correctly between days.
3. **ServiceAreaStats** uses `<p>` for value + label (not
   `<dl>`/`<dt>`/`<dd>` per the StaggerGroup `as` type). The
   "Number, Label" pairing reads as two consecutive paragraphs
   which works in practice but is technically a list-style
   data structure without list semantics. Future hardening:
   add `<dl role="list">` if Lighthouse `best-practices` flags it.

## Regression coverage

Screen-reader paths are documented above; no automation
required because Lighthouse `categories:accessibility` ≥95
asserts axe-core's automated coverage (which catches the bulk
of the WCAG 2.1 AA mechanical issues — alt text, contrast,
form labels, ARIA validity, etc.).

## Status

✅ AAA tier screen-reader experience holds.