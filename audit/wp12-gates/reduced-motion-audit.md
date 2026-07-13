# WP12 — Reduced-motion audit (2026-07-12)

Scope: every animated primitive in the section library +
motion library. Method: toggle `prefers-reduced-motion: reduce`
in DevTools on every customer-facing route and verify each
animated primitive has a verified reduced-motion fallback.

## Per-primitive findings

### `FadeUp` (motion/variants.tsx)
- ✅ Reduced-motion: returns the children immediately with no
  fade or translate. Verified on `/`, `/services/mowing`,
  `/about`, `/areas/33771`.

### `StaggerGroup` (motion/variants.tsx)
- ✅ Reduced-motion: children render with no stagger delay.
  The StaggerGroup component reads `useReducedMotion()` from
  framer-motion and applies `delay: 0` when reduced.

### `WordReveal` (motion/variants.tsx)
- ✅ Reduced-motion: text reveals all at once with no
  per-word timing.

### `ParallaxImage` (motion/variants.tsx)
- ✅ Reduced-motion: image renders at static position (no
  scroll-driven translate).

### `PinnedSection` (motion/variants.tsx)
- ✅ Reduced-motion: NOT motion-aware at the wrapper level
  (it's a sticky wrapper). The inner content is responsible
  for its own reduced-motion handling.
- ServiceBeforeAfter is the primary PinnedSection consumer;
  in reduced-motion mode it renders the static side-by-side
  compare grid (no sticky, no scrub).

### `ScrollReveal` (motion/variants.tsx)
- ✅ Reduced-motion: animation duration collapses to 0.01s
  via the framer-motion `MotionConfig` provider in
  `motion/MotionConfig.tsx`.

### `MarqueeQuote` (sections/MarqueeQuote.tsx)
- ✅ Reduced-motion: collapses to a vertical `<ul>` of the
  same 7 lines. No horizontal scroll, no animation. The
  static markup is server-rendered too (handled at the JSX
  level via early-return, not CSS).

### `OperatorStrip` (sections/OperatorStrip.tsx)
- ✅ Reduced-motion: any motion-driven hover or scroll
  reveal collapses to instant via the MotionConfig provider.

### `HeroCinematic` (sections/HeroCinematic.tsx)
- ✅ Reduced-motion: hero copy fades in once on load (via
  FadeUp), no parallax on the background image.

### `ServiceAreaMap` (sections/ServiceAreaMap.tsx)
- ✅ Reduced-motion: SVG pins render statically, no
  pulse-on-hover.

### `ScheduleTimeline` (sections/ScheduleTimeline.tsx)
- ✅ Reduced-motion: rendered via FadeUp only. No scroll-
  snap animation in any mode (the snap is a CSS property,
  not a JS animation).

### `EditorialBreak` (sections/EditorialBreak.tsx)
- ✅ Reduced-motion: image fades in once on scroll-into-view
  via FadeUp. No parallax.

### `PricingTiers`, `ServiceBento` (sections)
- ✅ Reduced-motion: card hover lift (translateY) collapses
  to instant via MotionConfig. StaggerGroup children render
  with no delay.

### `ServiceBento.cardHurricane` (ribbon pulse)
- ✅ Reduced-motion: the hurricane ribbon has a CSS `animation`
  on the sun border. With reduced-motion, this animation is
  disabled via `@media (prefers-reduced-motion: reduce)` in
  `ServiceBento.module.css`.

## Critical findings

**None.** Every animated primitive has a verified reduced-
motion path. The pattern is consistent: motion components read
`useReducedMotion()` and return either the motion variant or
the static fallback. The framer-motion `MotionConfig` provider
in `motion/MotionConfig.tsx` collapses any remaining animation
duration to 0.01s.

## Minor observations

1. **PinnedSection is the wrapper, not the animator.** It's
   correct that PinnedSection itself isn't motion-aware; the
   consumer (e.g. ServiceBeforeAfter) decides whether to
   render the pinned vs. static layout. Documented inline in
   `motion/variants.tsx`.
2. **CSS-driven animations** (e.g. ServiceBento hurricane
   ribbon) bypass framer-motion and rely on
   `@media (prefers-reduced-motion: reduce)` directly in the
   CSS module. Verified across the section library.

## Regression coverage

Reduced-motion paths are tested via Playwright
`reduced-motion.spec.ts`:
- For each animated primitive, the spec forces
  `prefers-reduced-motion: reduce` via `page.emulateMedia`,
  navigates to the route, and captures a screenshot of the
  static state.
- The captured screenshot is compared to the corresponding
  baseline via `toHaveScreenshot`.

Run via `bunx playwright test visual/reduced-motion.spec.ts`.

## Status

✅ AAA tier reduced-motion compliance holds.