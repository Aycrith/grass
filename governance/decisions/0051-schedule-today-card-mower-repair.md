# D-0051 — Schedule today-card mower repair (CSS cascade specificity)

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Engineering
**Reviewer:** Steward
**Related:** D-0049 (hero layered painting cascade), D-0050 (hero extension), WP34 (Illustration inline-style removal)

---

## Context

The `ScheduleTimeline` today card showed a severely oversized mower
illustration (986×986px, the full width of the 986px flex parent)
instead of the designed 88×88px thumbnail. Visual evidence in the
steward's red-circled bug report.

The component renders:

```tsx
<Illustration
  src="/illustrations/mower-side-profile-v3-120.webp"
  width={120}
  height={120}
  className={styles.todayMower}
/>
```

The CSS was:

```css
.todayMower {
  display: block;
  width: 100%;
  max-width: 5.5rem;  /* 88px — should win */
  height: auto;
  ...
}
```

`max-width: 5.5rem` should have capped the image at 88px. It did not.

## Root cause: CSS module cascade across Next.js stylesheets

`Illustration.module.css` declares:

```css
.illustration {
  display: block;
  max-width: 100%;  /* default — consumers are supposed to override */
  height: auto;
}
```

This rule is **duplicated** into three Next.js stylesheets:

1. `app/layout.css` — first loaded
2. `app/page.css` — second; here `.ScheduleTimeline_todayMower__qS6D7`
   lives next to `.Illustration_illustration__z_0h7`. Same specificity
   (0,1,0), so source order within page.css gives `.todayMower` the
   win. **At this point the cascade is correct.**
3. `app/loading.css` — **third**; Next.js bundles `Illustration.module.css`
   into every page-level stylesheet that transitively imports it
   (loading.tsx → not-found.module.css → eventually re-exports the
   Illustration class). Same `.illustration` rule, but because
   loading.css is the LAST stylesheet to load, its `.illustration`
   rule **wins the cascade over** page.css's `.todayMower`.

The final cascade order is therefore:

```
layout.css   .illustration { max-width: 100%; }   ← 1st
page.css     .illustration { max-width: 100%; }   ← 2nd
page.css     .todayMower    { max-width: 5.5rem } ← 3rd (wins within page.css)
loading.css  .illustration { max-width: 100%; }   ← 4th (wins across stylesheets)
```

Loading.css's `.illustration` rule is loaded after page.css's
`.todayMower` rule, and they have the **same specificity** (0,1,0).
By the CSS cascade rules, the later-loaded rule wins. So
`max-width: 100%` is restored, and the img renders at 100% of its
986px flex parent.

## Why other Illustration consumers are not affected

Audited all `<Illustration>` consumers in the codebase:

| Consumer | Class | CSS rule | Computed width | Status |
|---|---|---|---|---|
| `ScheduleTimeline.todayMower` | `.todayMower` | `width: 100%; max-width: 5.5rem` | 88px (after fix) | **was 986px** |
| `OperatorStrip.bioSignatureMark` | `.bioSignatureMark` | `width: clamp(56px, 7vw, 72px)` | 72px | OK (clamp max 72px) |
| `PricingTiers.headerOrnamentMark` | `.headerOrnamentMark` | (width unset, falls to HTML attr) | 120px (HTML intrinsic) | OK |
| `FinalCTABanner.openingMark` | `.openingMark` | `width: clamp(56px, 8vw, 96px)` | 96px | OK (clamp max 96px) |
| `SiteFooter.brandMark` | `.brandMark` | (width unset, falls to HTML attr) | 36px | OK (parent narrower) |

The other consumers all sit inside a parent that is **wider than
the consumer's natural size**, so the restored `max-width: 100%`
happens to produce the intended width by accident. Only
`.todayMower` wants a **hard cap that is smaller than the parent's
width** — and that's exactly where the cascade bug bit.

## Decision

**Bump the consumer selector to `.todayCardFoot > .todayMower`**
(specificity 0,2,0). The extra parent-class qualifier makes the
consumer's rule beat `.illustration` (0,1,0) regardless of
stylesheet load order. The mobile `@media (max-width: 480px)` rule
that hides the mower on small screens gets the same qualification
for consistency.

```css
/* Qualified with the parent class so specificity (0,2,0) beats the
 * `.Illustration_illustration` rule (0,1,0). Without this, the
 * illustration wrapper's `max-width: 100%` (duplicated across
 * layout/page/loading stylesheets) wins the cascade over our
 * `max-width: 5.5rem`, and the mower renders at 100% of the
 * 986px flex parent instead of the intended 88px. */
.todayCardFoot > .todayMower {
  display: block;
  width: 100%;
  max-width: 5.5rem;
  height: auto;
  opacity: 0.95;
  mix-blend-mode: multiply;
  flex: 0 0 auto;
}

@media (max-width: 480px) {
  .todayCardFoot {
    flex-direction: column;
    align-items: stretch;
  }
  .todayCardFoot > .todayMower {
    display: none;
  }
}
```

## Why not `!important`?

- `!important` would silence the cascade for this consumer but
  doesn't fix the underlying module-duplication pattern. A future
  consumer of `<Illustration>` that wants a hard cap smaller than
  the parent will hit the same trap.
- Parent-class specificity is the same trick `cn()` consumers have
  been using implicitly for years — it's idiomatic for CSS modules
  in this codebase, not an anti-pattern.

## Why not change the Illustration component itself?

Three options considered:

1. **Add a `wrapper` prop to Illustration that accepts a className
   for a wrapper `<div>`** — but the Illustration is a single `<img>`,
   not a div. Wrapping it in a div breaks the current usage pattern
   (e.g. the OperatorStrip's `<span>` parent, the PricingTiers
   `<span>` ornament).
2. **Remove `max-width: 100%` from the Illustration default** — then
   the img would render at its HTML intrinsic size (120×120 here)
   regardless of parent width. That breaks the other consumers
   (headerOrnamentMark, openingMark) which rely on the default
   for fallback sizing.
3. **Move the consumer override to inline style** — `style={{ maxWidth:
   '5.5rem' }}` on the `<img>`. This is exactly the pattern WP34
   removed. It would be regression.

The consumer-side specificity fix is the minimal change that
preserves the WP34 fix (consumer CSS wins over default), fixes the
specific bug, and doesn't require changing the shared component.

## Verification

Playwright inspect on `http://localhost:3000` after dev server
restart + cache wipe:

```json
{
  "src": "mower-side-profile-v3-120.webp",
  "className": "Illustration_illustration__z_0h7 ScheduleTimeline_todayMower__qS6D7",
  "intrinsicNaturalWidth": 120,
  "intrinsicNaturalHeight": 120,
  "computedWidth": "88px",         // was "986px"
  "computedHeight": "88px",        // was "986px"
  "computedMaxWidth": "88px",      // was "100%"
  "computedFlex": "0 0 auto",
  "computedDisplay": "block",
  "rectWidth": 88,
  "rectHeight": 88,
  "parentClass": "ScheduleTimeline_todayCardFoot__RyGCI",
  "parentDisplay": "flex",
  "parentRectWidth": 986
}
```

Visual proof: `apps/web/audit/d-schedule-repair/schedule-timeline-current.png`.
The today card now shows the mower at 88px next to the "Book this mow"
CTA, matching the design intent.

## Artifacts

- Commit: `a57db30 fix(schedule): repair oversized today-card mower (D-0051)`
- File: `apps/web/src/components/sections/ScheduleTimeline.module.css`
- Capture: `apps/web/audit/d-schedule-repair/schedule-timeline-current.png`
- Inspect log: `apps/web/audit/d-schedule-repair/capture-all.log`
