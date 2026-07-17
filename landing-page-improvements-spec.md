# Landing Page Improvements — Spec

> **Status:** Draft — awaiting steward sign-off before implementation.  
> **Last updated:** 2026-07-17  
> **Dev server:** http://localhost:3000 (running, verified 200 on `/` and `/services`)

---

## 1. Request summary

Clear all old dev-server processes, restart the app so the steward can view the latest version, then interview the steward to identify which areas of the landing page still require improvement. Output a detailed spec that can be handed to an implementation agent.

---

## 2. Current state

### 2.1 Landing-page composition (9 sections)

| # | Section | Notes |
|---|---------|-------|
| 01 | **HeroMowerScene** | Scroll-driven animated SVG landscape with a mower that crosses on scroll and reveals the headline in its mowed path. |
| 02 | **ServiceAreaMap** | Form-dominant coverage check (ZIP or neighborhood). |
| 03 | **OperatorStrip** | Solo-operator bio + trust signals. |
| 04 | **ServiceBento** | 6-card service grid. |
| 05 | **PricingTiers** | 3-tier pricing presentation. |
| 06 | **ProcessSteps** | How-it-works steps. |
| 07 | **ScheduleTimeline** | Weekly route / field log. |
| 08 | **FAQAccordion** | Common questions. |
| 09 | **FinalCTABanner** | Bottom closer. |
| + | **ConversionRail** | Sticky bottom CTA that appears after the hero scrolls out. |

### 2.2 Dev-server status

- Old processes on ports 3000–3003 were terminated.
- Dev server restarted on **port 3000**.
- A runtime 500 on `/` was caused by `ServiceDirectory.tsx` missing the `'use client'` directive (uses `motion(Link)` + `useFadeUp`). Fixed by adding `'use client';` at the top of the file.
- Both `/` and `/services` now return HTTP 200.

### 2.3 Existing v2 hero direction

A `/hero-v2` route exists with a **Field Telemetry** creative direction:

- Real photograph background (no storybook-painted scene).
- Ken Burns + mowed-band sweep + grass-clipping particles.
- Live "currently mowing" status widget.
- Passport-style "EST 2026 LARGO FL" stamp.
- Field-log telemetry stats strip.
- Kinetic headline (word-by-word reveal).
- Magnetic CTAs retained.

This v2 direction is a candidate for integration into the production homepage.

---

## 3. Interview findings

### 3.1 Overall impression

> "Several sections need meaningful rework."

The steward feels the page is not yet landing — the current direction is not premium or trustworthy enough.

### 3.2 Biggest problem area

**Hero (animated mower scene + headline reveal)**

Specific issues flagged:

| Issue | Detail |
|-------|--------|
| Scroll-driven mower feels confusing / gimmicky | The interaction is not intuitive. |
| Headline reveal is too slow / hidden | Text isn't readable until too late in the scroll. |
| Colors / palette feel wrong | The warm sand palette does not feel like a Florida lawn-care brand. |
| Not premium or trustworthy | Visual tone reads as cheap or amateur. |
| Performance / scroll jank | Animations stutter on scroll. |

### 3.3 Other sections flagged for rework

- **Process Steps** — feels off / needs rework.
- **Schedule Timeline** — flagged for rework.

### 3.4 Conversion concern

> "Users don't know what to do first."

The primary action is not obvious enough. The page needs a clearer first step toward requesting a quote.

### 3.5 Motion / animation

> "Motion is incoherent and non-sensical."

The current animations do not feel cohesive. They should be unified into a coherent, purposeful system.

---

## 4. Design direction

### 4.1 Brand / visual feel

Move away from the warm **sand/cream** palette. The business is in **Florida**, so the visual language should feel **green, lush, and Florida-colored**.

Desired feel:

- **Premium local service** — like a high-end landscape company.
- **Friendly and approachable** — neighborly, solo-operator vibe.
- **AAA-quality interactive experience** — highest-rated interactive/animated 3D concept possible.

### 4.2 Hero direction

The **v2 Field Telemetry** direction is the starting point:

- Real photography / cinematic background.
- Kinetic typography.
- Live status / telemetry widgets.
- Florida-green palette.
- Smooth, performant animations.

The hero should be the highest-polish moment on the page and set the visual language for everything below it.

### 4.3 Reference competitors / benchmarks

Based on web research, the following sites demonstrate premium landscaping presentation:

1. **Signature Landscape Contractors** (`signaturelandscapecontractors.com`)
   - Full-screen video/photography hero.
   - Emphasizes bespoke craftsmanship and personalized results.
   - Clean, modular case-study layouts.

2. **Juniper Landscaping** (`junipercares.com`)
   - Heavy social proof (testimonials from recognizable clients).
   - Animated live counters (e.g., trees installed).
   - Humanizing "people + communities" messaging.

3. **The Time is Now Design and Build** (`thetimeisnowdesignandbuild.com`)
   - Image-heavy design showing total outdoor transformations.
   - Subtle parallax and hover effects.
   - One-stop-shop service delineation.

**Benchmark takeaways for Largo Lawn:**

- Professional photography of real local work.
- Clear, high-contrast quote CTA in nav + sections.
- Local trust signals (Largo/Pinellas neighborhoods, Florida-friendly landscaping).
- Process section that reduces client anxiety.

---

## 5. Goals

1. **Hero redesign** — Replace or heavily rework the scroll-driven mower hero with a premium, Florida-green, AAA-quality interactive/animated experience.
2. **Color palette refresh** — Move from sand/cream to a green/Florida-colored palette while keeping the operator-friendly warmth.
3. **Performance fix** — Eliminate scroll jank; ensure smooth 60 fps on slow/older phones.
4. **Clearer conversion** — Make the first action (request a quote) obvious and easy.
5. **Process Steps rework** — Redesign the how-it-works section.
6. **Schedule Timeline refinement** — Simplify or reimagine the weekly route section.
7. **Coherent motion system** — Unify animations so they feel purposeful, not gimmicky.

---

## 6. Constraints

- **Performance first:** Must work on slow / older phones.
- **Voice:** Keep the operator-first, solo-founder tone.
- **Content:** No placeholder content — everything must be real/usable.
- **Conversion:** Changes must improve quote requests.
- **Accessibility:** Respect `prefers-reduced-motion`.
- **Palette:** Move toward green / Florida colors; sand/cream is considered a mistake.
- **Dependencies:** Prefer existing stack (Next.js 15, Framer Motion, CSS modules). Avoid new heavy libraries unless justified.

---

## 7. Success criteria

The steward will consider the landing page "done" when:

- [ ] Scrolling through it no longer feels cringeworthy.
- [ ] It looks premium and trustworthy.
- [ ] The quote flow is obvious and easy.
- [ ] It loads fast and scrolls smoothly (60 fps on target devices).
- [ ] It works perfectly on mobile.
- [ ] It matches or exceeds the quality of a specific premium competitor/reference site.
- [ ] The hero is the highest-quality interactive/animated 3D experience possible.
- [ ] Motion feels coherent and purposeful, not gimmicky.

---

## 8. Proposed scope (implementation-ready)

### 8.1 Phase 1 — Hero redesign (highest priority)

- Audit `HeroMowerScene.tsx` / `.module.css`.
- Decide whether to:
  - Promote the existing `/hero-v2` Field Telemetry direction to production, or
  - Create a new v3 hero that incorporates the best of v2 plus new AAA-quality interactive/3D elements.
- Replace the scroll-driven mower concept with a performant, premium hero.
- Apply the new green/Florida palette to the hero.
- Ensure headline is readable immediately (no slow reveal).
- Preserve `id="hero"` so the ConversionRail still works.

### 8.2 Phase 2 — Color palette refresh

- Update CSS custom properties (`:root` variables) from sand/cream to green/Florida tones.
- Audit every section for contrast and legibility after the palette change.
- Update `lib/content.ts` if any hardcoded color references exist.

### 8.3 Phase 3 — Performance / motion coherence

- Audit all Framer Motion usage for jank on low-end devices.
- Replace or simplify heavy scroll-driven effects.
- Establish a shared motion language (easing, duration, stagger rules).
- Ensure all motion respects `prefers-reduced-motion`.

### 8.4 Phase 4 — Conversion clarity

- Audit CTA placement and hierarchy.
- Ensure the primary "Get a free quote" action is visually dominant and repeated at key scroll positions.
- Consider adding urgency or social proof near the primary CTA.

### 8.5 Phase 5 — Process Steps + Schedule Timeline rework

- Redesign `ProcessSteps` to feel premium and clear.
- Simplify or reimagine `ScheduleTimeline` so it supports conversion rather than adding cognitive load.

### 8.6 Phase 6 — Validation

- Run Lighthouse / PageSpeed Insights.
- Run Playwright visual regression.
- Test on real mobile devices or device emulation.
- Typecheck and lint pass.

---

## 9. Open questions

1. Should the existing `/hero-v2` Field Telemetry direction be promoted as-is, or should a brand-new v3 hero be designed?
2. Does the steward have existing photography of completed lawns/landscapes to use in the hero?
3. Are there specific Florida plants, grass types, or local landmarks that should appear visually?
4. Should the 9-section structure remain, or can sections be removed/merged?
5. What is the target timeline for these improvements?
6. Is there a specific competitor site the steward wants to match most closely?

---

## 10. Files likely to change

- `apps/web/src/app/page.tsx`
- `apps/web/src/components/sections/HeroMowerScene.tsx` / `.module.css`
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx` / `.module.css`
- `apps/web/src/components/sections/ProcessSteps.tsx` / `.module.css`
- `apps/web/src/components/sections/ScheduleTimeline.tsx` / `.module.css`
- `apps/web/src/app/globals.css` or equivalent (palette variables)
- `apps/web/src/lib/content.ts`
- `apps/web/visual/*` (baselines will need refresh)

---

## 11. Acceptance checklist

- [ ] Dev server starts cleanly and serves `/` without 500 errors.
- [ ] Hero redesign implemented and approved by steward.
- [ ] Palette updated to green/Florida tones.
- [ ] Scroll jank eliminated on target devices.
- [ ] Primary CTA is obvious and repeated appropriately.
- [ ] Process Steps and Schedule Timeline reworked.
- [ ] Motion feels coherent and respects reduced motion.
- [ ] Lighthouse performance score ≥ 90 on mobile.
- [ ] Playwright visual regression baselines refreshed.
- [ ] Typecheck and lint pass.
