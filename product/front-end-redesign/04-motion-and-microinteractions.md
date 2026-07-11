# PRD-04 — Motion and Microinteractions

**Purpose:** Define every animation on the Largo Lawn web app —
durations, easings, triggers, performance budgets, and reduced-motion
fallbacks.

**Audience:** Designer + engineer

---

## 1. Principles

1. **Restrained by default.** A local business website is not a SaaS
   landing page. Motion should serve comprehension, not impress.
2. **Earned expressiveness.** Animation only on:
   - User-initiated interactions (hover, focus, click)
   - State changes (form submit success, page navigation)
   - Draws attention to a critical update (hurricane mode banner)
3. **Respects `prefers-reduced-motion`.** Every animated property
   collapses to instant when the user prefers reduced motion.
4. **Performance-budgeted.** No animation > 16ms per frame on mid-tier
   Android (Pixel 4a equivalent). Tested via Lighthouse trace + DevTools
   performance tab.
5. **Honest.** No animation that delays visible content (no
   artificial loading screens, no count-up numbers, no skeleton
   screens that lie about what's loading).

## 2. Motion tokens

```
--motion-duration-fast:     150ms   /* hover, focus rings */
--motion-duration-base:     240ms   /* most transitions */
--motion-duration-slow:     400ms   /* page transitions, hero entrance */
--motion-duration-deliberate: 800ms /* hero image fade-in only */

--motion-easing-default:    cubic-bezier(0.4, 0, 0.2, 1)   /* ease-out-quart */
--motion-easing-emphasize:  cubic-bezier(0.2, 0, 0, 1)     /* ease-out-expo */
--motion-easing-emphasize-in: cubic-bezier(0.4, 0, 1, 1)   /* ease-in-expo (for exits) */
```

## 3. Per-element motion specs

### Page entrance (homepage hero)
- **Hero image:** opacity 0 → 1 over 800ms with `--motion-easing-emphasize`
- **Headline:** translateY(8px) + opacity 0 → translateY(0) + opacity 1
  over 400ms, delayed 100ms after image starts
- **Subhead:** same as headline, delayed 200ms
- **CTAs:** same as headline, delayed 300ms

**Reduced-motion fallback:** all elements visible immediately, no
animation.

### Page entrance (other pages)
- **Page content:** opacity 0 → 1 over 240ms
- **No per-element stagger** (gets repetitive after the first page)

**Reduced-motion fallback:** instant.

### Hover states

| Element | Property | Duration | Easing |
|---|---|---|---|
| Card | transform: translateY(-4px), box-shadow | 150ms | default |
| Card image | transform: scale(1.02) | 240ms | default |
| Button | background-color | 150ms | default |
| Link | text-decoration + color | 150ms | default |
| Nav item | background-color | 150ms | default |
| Input | border-color + outline | 150ms | default |

### Focus states
- All focusable elements have a visible focus ring (2px solid
  `--ll-sun`, offset 2px)
- No animation on focus (instant)

### Form interactions
- **Input focus:** border color shifts to `--ll-palm-shadow` over 150ms
- **Error state:** shake animation (4px horizontal, 240ms total)
  + red border + aria-invalid
- **Submit button click:** scale 0.97 → 1 over 150ms
- **Submit success:** form fades out (240ms), thank-you card fades in
  (240ms with 100ms delay)

### Quote calculator live estimate
- **Number change:** count-up animation over 240ms when input changes
- **Reduced-motion:** instant number swap

### Toast notifications
- **Enter:** translateY(20px) + opacity 0 → translateY(0) + opacity 1
  over 240ms
- **Exit:** opacity 1 → 0 over 240ms, then unmount

### Modal/dialog (future, if added)
- **Backdrop:** opacity 0 → 1 over 240ms
- **Dialog:** scale 0.95 + opacity 0 → scale 1 + opacity 1 over 240ms

### Page transitions
- App Router already handles navigation; no extra animation
- Optional: subtle fade between pages (240ms) — only if it doesn't
  hurt perceived performance

## 4. Loading states

### Skeleton screens
- Use **only** for content that's known to be loading (CRM data,
  async content)
- **Do not** show skeletons for static content (always rendered)
- Skeleton color: `--ll-sand-bleached` with subtle pulse (1s,
  opacity 1 → 0.6 → 1)

### Spinners
- Use **only** for user-initiated async actions (form submit, file
  upload)
- Spinner is the brand mark rotating (240ms linear loop, no
  easing variation)

### Progress bars
- Avoid for content loading (use skeleton instead)
- Use for explicit progress (file upload, multi-step form)

## 5. Scroll-linked animation (use sparingly)

### Parallax (only on hero image)
- Hero image translates up at 0.5× scroll velocity
- **Only** on devices with `(pointer: fine)` AND no reduced-motion
- Disabled on mobile, tablets, and reduced-motion

### Sticky header
- Header has `--elevation-3` after scroll > 80px
- Subtle: shadow fades in over 240ms

### Section fade-in on scroll
- **Avoid** by default — feels gimmicky on a small-business site
- Allow only for the testimonials section if implemented

## 6. Reduced-motion fallback

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is the **safety net**, not the strategy. Every animated property
should explicitly handle reduced motion in its CSS Module.

## 7. Performance budget

- **CLS:** ≤ 0.1 (no animation should cause layout shift)
- **INP:** ≤ 200ms p75 (no animation should block input)
- **Animation frame budget:** 16ms per frame at 60fps
- **GPU acceleration:** only `transform` and `opacity` properties
  animated (never width, height, top, left, margin, padding)
- **JS animation libraries:** none for v1 (pure CSS only). If we add
  Motion (Framer Motion successor) later, separate PRD.

## 8. Verification

- Lighthouse "Avoid non-composited animations" passes
- Manual test in Chrome DevTools "Emulate CSS media feature
  prefers-reduced-motion: reduce"
- Trace playback in DevTools Performance tab shows no animation
  > 16ms per frame
- Each page tested on iPhone SE (old mid-tier) via BrowserStack or
  real device if available

## 9. Anti-patterns (do NOT do)

- Auto-playing video on page load
- Parallax on more than one element
- Spinning brand mark as a loader
- Long intro animation (>1s)
- Scroll-jacking (custom scroll behavior that fights the user)
- Marquee / scrolling text
- Hover-triggered audio
- Count-up numbers for KPIs we don't have yet

## 10. What this PRD does NOT cover

- Animation library selection (none for v1)
- Lottie / SVG animations (deferred)
- 3D / WebGL (out of scope)
- Page-transition choreography (App Router default)