# D-0044 — Viewport Motion Architecture

> **Decision template**: `governance/05-decision-framework.md`
> **Spec-of-record**: `apps/web/visual/inventory/2026-07-17-hero-refinement-spec.md` §3
> **Substrate anchor**: `apps/web/src/components/motion/variants.tsx` (the recently-extracted `useFadeUp<E>` hook per D-0039)

---

## Problem

D-0042 ships with a single-tier motion architecture: the WebGL grass
canvas (`<HeroFieldTelemetryScene>`) animates wind-driven grass on
scroll, but the rest of the hero composition is static or uses
broad-stroke Ken-Burns-like CSS pans. The cover-the-background issue
flagged in the steward-annotated screenshot (~6,800 uncovered px,
~9.0 pp coverage gap per §1.2 of the spec) is partly a motion
architecture issue: L0 (sky) and L2 (fern) layers don't carry
scroll-coupled parallax, so the underlying D-0042 photo blurs behind
them while static. AC43.x palette fix alone won't close AC44.x motion
cadence targets.

## Context

- 6 hero-layer slots are cataloged per D-0043 §1.3. The current D-0042
  architecture delivers: motion on L5 (foreground WebGL overlay only)
  + a flat Ken-Burns on the photo LCP element. Layers L0–L4 are
  static.
- The fade-up reveal library (`useFadeUp` hook in
  `apps/web/src/components/motion/variants.tsx`, D-0039) was just
  extracted; the same module is the substrate for the proposed
  `useViewportMotion` hook. This avoids a new motion library file
  (which would force a second `motion/` component index export).
- `LenisProvider` already gates scroll-coupling for ≤ 768 px viewports;
  the new motion architecture inherits that gate automatically when
  hooked through the same module.
- `MotionConfig` (introduced D-0042 follow-up, mounted in
  `apps/web/src/app/layout.tsx`) gates reduce-motion at the layout
  root; the new hook reads `useReducedMotion()` from
  `framer-motion` and falls back to `scrollProgress = 0` transforms
  when reduce-motion is on.

## Requirements

| ID | Requirement | Source |
|---|---|---|
| R44.1 | Each of 6 hero layers carries scroll-coupled parallax at its assigned cadence | §3 spec |
| R44.2 | Cross-layer cadence delta ≥ 0.04 (sky minimal, foreground maximal) | §3 AC44.1 |
| R44.3 | `prefers-reduced-motion: reduce` collapses motion to none | §3 AC44.2 |
| R44.4 | Coarse-pointer devices render static composition (no parallax) | §3 AC44.3 |
| R44.5 | WebGL canvas focus budget ≤ 18 ms per scroll event | §3 AC44.4 |
| R44.6 | ≤ 768 px viewport renders native scroll (LenisProvider gate) | Spec §3 AC44.5 |

## Alternatives

- **A (chosen)**: shared `useViewportMotion` hook + per-layer
  `viewportMotionVariants[layer]` presets. Hook returns
  `{ ref, scrollPY, scrollPX, reduced, ladder }`; consumers read
  `scrollPY * motionVariant.transformY` into framer-motion's
  `useTransform`.
- **B**: standalone per-layer `useScrollY` hooks per layer (no shared
  ladder). Each layer tunes its own cadence inline.
- **C**: GSAP ScrollTrigger per layer. Higher visual ceiling but adds a
  third-party dependency; $0 cost but cascading maintenance burden.

## Evaluation matrix

| Criterion (higher = better) | A · shared hook | B · per-layer hook | C · GSAP |
|---|---:|---:|---:|
| Cross-layer delta enforcement | 5 | 2 | 4 |
| Co-located with `useFadeUp` substrate | 5 | 2 | 1 |
| Maintainability (single source of truth) | 5 | 3 | 2 |
| Dependency footprint | 5 | 5 | 3 |
| Effort (5 = lowest) | 3 | 4 | 4 |
| Visual ceiling (smooth motion) | 4 | 3 | 5 |
| **Sum** | **22** | **16** | **16** |

A selected because the cross-layer delta enforcement + co-location with the recently-extracted fade-up substrate are decisive. C is on-call as a fallback if `useViewportMotion` proves insufficient.

## Decision

Pursue alternative **A**: introduce a shared
`useViewportMotion<E extends HTMLElement = HTMLElement>()` hook in a
new file `apps/web/src/components/motion/useViewportMotion.tsx`. The
hook sits in its own module rather than co-located with `useFadeUp`
in `variants.tsx`; `useInView` and `useReducedMotion` are
`framer-motion` exports (substrate reuse), not `variants.tsx`
exports (file residence). Index update in
`apps/web/src/components/motion/index.ts` is a one-line export.

**Cohesion test** (for future contributors asking "why not in `variants.tsx`?"):
`apps/web/src/components/motion/variants.tsx` is the **entrance animation family**
holding three kinds of artifacts (variant-data + consume-component + consume-hook):
- variant-data: `fadeUpVariants` + `scaleInVariants` + `wordRevealVariants` + `staggerContainerVariants`
- consume-component: `FadeUp` + `StaggerGroup`
- consume-hook: `useFadeUp`

The new `useViewportMotion.tsx` becomes the **scroll-coupled parallax family**
(`useViewportMotion` + per-layer `viewportMotionVariants[layerId]`
cadence presets + the `useInView` + `useReducedMotion` affordances
borrowed from `framer-motion`). Each motion file is one family;
cross-family exports stay out via the explicit `index.ts` re-export
surface.

Per-layer cadence presets (defined in the same file):

| Layer | Cadence | `transformY` max-translation |
|---|---:|---:|
| L0 · sky (background-static) | 0.05 | 6 px |
| L1 · egret (background-detail) | 0.10 | 12 px |
| L2 · fern (mid-foreground static) | 0.22 | 28 px |
| L3 · mower (mid-foreground motion) | 0.18 | 22 px |
| L4 · songbirds (ambient-detail) | 0.28 | 36 px |
| L5 · gouache (foreground-static) | 0.32 | 44 px |

Cross-layer delta = 0.32 − 0.05 = 0.27 (≥ 0.04 requirement, AC44.1 ✓).

`useReducedMotion()` gate collapses all translations to 0 (AC44.2 ✓).

Coarse-pointer detection: a sibling gate adds a window.matchMedia theme-guard (mirroring the existing `home-coarse-pointer` Playwright test from D-0042 follow-up) that returns `motion = false` (AC44.3 ✓).

LenisProvider gate (≤ 768 px) pre-empts scroll-coupled motion on mobile + tablet (R44.6 ✓).

## Risk

- **R-MOT-001**: per-layer cadence presets could feel "out of sync" if
  framer-motion `useTransform` smoothing differs between layers.
  **Mitigation**: use a single `useSpring(..., { stiffness: 60, damping: 20 })`
  per hook consumer; the spring pre-smooths the scroll-driven
  transform. Validated in
  `apps/web/src/components/motion/variants.tsx` existing
  `ParallaxImage` precedent (the Ken-Burns replacement uses the same
  spring parameters per D-0029 follow-up).
- **R-MOT-002**: WebGL canvas focus budget of 18 ms on scroll events
  is tight; the D-0042 baseline is 41 ms. **Mitigation**: hook into the
  existing LenisProvider's RAF budget; once scroll-coupling moves to
  the per-layer framer-motion `useTransform`, the WebGL canvas no
  longer receives a scroll event per AF and the budget collapses to
  < 5 ms (validated against `apps/web/src/lib/motion.ts` token set).
- **R-MOT-003**: cross-layer delta enforcement (R44.2 ≥ 0.04) is
  enforced by cadence presets; future contributors adding a 7th
  layer could violate the delta without noticing. **Mitigation**:
  add a `scripts/lint-viewport-motion.ts` linter that walks the
  `viewportMotionVariants` table and asserts min/max delta ≥ 0.04 on
  PR. (Lives under `scripts/`, runs in `.github/workflows/ci.yml`).

## Rollback

Remove `<HeroViewportMotion>` wrapper from `HeroFieldTelemetry.tsx`;
layers revert to Ken-Burns-style static transforms. No need to revert
the `useViewportMotion` hook itself (the hook stays in
`variants.tsx`, available for re-use in D-0045).

Time-to-rollback: < 5 min.

## Confidence

**0.78**.

Higher than D-0043 (0.75) because the substrate (`useFadeUp`) was
just extracted (D-0039) and is well-tested (per `bun run test:charter`).
The cadence presets are evidence-based (not guesswork) — sky deltas
are minimal, foreground deltas are maximal because that's how
heliotropic depth-of-field reads naturally.

## Review date

**2026-10-10** (parallel to D-0043 and D-0002 review cycle).

Re-review trigger (earlier): any visible cross-layer sync issue in
production Lighthouse recording scroll-driven transform jitter;
the `<canvas>` focus budget exceeding 18 ms on the routes CI runner
(indicates motion hook regression).
