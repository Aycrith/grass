# D-0050 — Hero content extension (Phases 1a, 1b, 2, 3 shipped)

**Date:** 2026-07-21
**Status:** Phase 1a, 1b, 2, 3 shipped (commits `b9185c9`, `3859195`, `4c8b2fe`, `db4c92b`).
**Optional Phase 4** (operator + equipment as 4th scene) deferred — see "Future work" below.
**Review date:** 2026-10-21 (90 days post-ship)

---

## Decision

Pursued **Option B (hybrid scene enhancements)** from
`apps/web/audit/d-hero-extension-brief/memo.md` §5 — the recommended
path. Each phase was committed independently so any phase can be
reverted without losing the others.

The three shipped phases add **9 distinct content elements** to the
unified hero (D-0043 / D-0049):

| Phase | Content element | Scene | Scroll window |
| --- | --- | --- | --- |
| 1a | Service-area callout pill (link to /areas/33771) | Scene 1 (cartoon) | 0.00 – 0.35 |
| 1b | Hand-authored cartoon operator + walk-behind mower | Scene 1 (cartoon) | 0.00 – 0.10 (rest) |
| 2  | Sun-yellow location pin + pulse ring on photo | Scene 2 (photo) | 0.50 – 0.65 |
| 3  | 6-card per-ZIP strip (33756 / 33770 / 33771 / 33773 / 33774 / 33778) | Scene 3 (painted) | 0.70 – 1.00 |

Each element was captured across 8 scroll positions in
`apps/web/audit/d-0050-phase-{1a,1b,2,3}/hero-y*.png` and visually
verified before commit. The 3 risks from the brief's risk
assessment that could have applied to this work were all avoided:

- **Asset style mismatch (D-0049 rev 4 lesson)** — the operator is
  hand-authored SVG in the same flat-fill style as the existing
  `PalmTree` / `House` primitives; no painted VEO assets are mixed
  into the cartoon storybook.
- **Jarring overlay on real photo (route pin)** — the pin is 28x32
  px with a 1.8 s pulse ring + soft drop shadow; it occupies a
  5%-in / 5%-hold / 5%-out window and never sits on the ranch
  house or the right-side palm trees.
- **Perf regression (4-7 new images)** — the 6 area images total
  ~400 KB and are `loading="lazy"` so they don't enter the
  initial bundle. The cartoon operator is inline SVG (no asset).

---

## What the hero now answers (4 W's)

The extended hero completes the visitor's mental map in three
scrolls:

| Beat | Question | Element | Phase |
| --- | --- | --- | --- |
| Scene 1 | WHO (your neighbor's lawn mower) | Cartoon storybook + operator pushing mower | 1b |
| Scene 1 | WHERE (33771, central Largo) | Service-area callout pill below the eyebrow | 1a |
| Scene 2 | WHAT (the real work, on a real lawn) | 4K photo + live route pin | 2 |
| Scene 3 | COMMITMENT (same yard, every week) | Painted ranch house + editorial pull-quote | (existing) |
| Scene 3 | WHERE ELSE (the 6 ZIPs) | 6-card per-ZIP strip at the bottom | 3 |

The brief's 9-criterion matrix (memo §5) gave Option B 27/35 vs
21-23 for the alternatives. The actual implementation hit all the
criteria the brief called out:

- ✓ **No new section height, no new scroll math, no perf risk**
  (per-element scroll windows reuse the existing
  scene1ContentFade / secondSceneFade / smoothProgress)
- ✓ **Each visual language stays in its own scene** (cartoon /
  photo / painted), so the D-0049 rev 4 style-mismatch lesson
  doesn't apply
- ✓ **Reuses existing assets** — no new asset creation, no
  re-painting of the cartoon storybook, no re-rendering of
  the photo or scene 2
- ✓ **Reversible** — each phase is a separate commit and can
  be reverted independently
- ✓ **Per-phase visual verification** — every phase was captured
  at 8 scroll positions and visually analyzed before commit

---

## Phase 1a — service-area callout pill

Small clickable pill rendered in scene 1 just below the eyebrow,
left-aligned. Anchor copy `33771 · Largo (central)` linking to
`/areas/33771`. Reuses the eyebrow's pill family (cream tint,
backdrop blur) with three intentional distinctions so the visitor
reads it as a clickable hint, not a duplicate label:

1. Sun-yellow SVG location pin at the leading edge
2. Lighter background tint (palm-bark 32 % vs eyebrow 45 %)
3. Sentence case + tight dot separator (vs eyebrow all-caps +
   0.18 em tracking)

Fade: the pill sits inside the scene 1 content `<motion.div>`
wrapper which already drives `scene1ContentFade` across
[0.35, 0.55], so the pill inherits the same dissolve as the
eyebrow + headline without its own opacity track. No additional
scroll math.

`apps/web/audit/d-0050-phase-1a/hero-y*.png` confirms the pill
is visible in scene 1 only, fades with the storybook, and never
reappears in scene 2 or scene 3.

## Phase 1b — cartoon operator + walk-behind mower

Hand-authored flat-fill SVG operator + walk-behind mower rendered
in the empty middle area of scene 1 (between the editorial
column and the right ranch house). Matches the existing `PalmTree`
/ `House` primitive style — no gradients, no painted detail, no
soft edges. Subtle 5.2 s ±1.2° sway around the operator's feet;
faster than the 8 s palm-tree sway so the operator reads as an
active worker, not a passive prop. Reduced-motion override stops
the animation entirely.

Position: viewBox x = 1200 – 1342, y = 565 – 694 (just past the
editorial column, in the foreground grass). Shirt in
sand-bleached (warm cream) so the figure pops against the dark
green near-layer grass; pants in palm-bark so the feet blend
naturally with the grass to suggest "feet in the lawn."

`apps/web/audit/d-0050-phase-1b/hero-y*.png` confirms the
operator is visible in scene 1 only, fades with the storybook,
and never reappears.

## Phase 2 — route pin

Small sun-yellow SVG location pin (matching the callout pill's
icon) with a 1.8 s pulse ring. Positioned at `right: 14%, bottom:
26%` of the photo — the open freshly-mowed lawn area in the
lower-right, well clear of the ranch house (left third) and the
right-side palm trees (upper-right). 28×32 px on desktop,
22×26 px on mobile. Soft drop shadow (0 2 px 4 px rgba(0,0,0,0.35))
lifts the pin off the green grass.

Fade window [0.50, 0.65] (5 %-in / 5 %-hold / 5 %-out) — the
briefest of all the new content elements, intentionally so:
the pin is a "by the way, I'm here right now" hint, not a focal
point. Aria-label "Currently mowing this lawn" points to the
same status the LIVE pill carries, so screen readers report a
single, consistent status regardless of which visual element
the visitor encounters.

`apps/web/audit/d-0050-phase-2/hero-y*.png` + a debug script
confirm the pin opacity is exactly as designed across the
scroll window: 0 at scroll 0.5, 1.0 at scroll 0.58, 0 at
scroll 0.65+.

## Phase 3 — 6-card per-ZIP strip

Six cards in a horizontal row at the bottom of scene 3, one per
service area ZIP. Each card shows the painted area image (48×48
thumbnail) + ZIP code + neighborhood label and links to
`/areas/[zip]`. Reuses the existing `serviceAreaMap.pinLocations`
labels so the visual + copy language stays consistent.

Coordinated handoff with the dashboard:
- Per-ZIP strip fades in across [0.70, 0.85]
- Dashboard (LIVE pill + FieldStamp + telemetry) fades out
  across [0.70, 0.80] — the strip becomes the new bottom UI
  for scene 3
- Fade-out is slightly ahead of fade-in so the handoff reads as
  a clean scene transition, not a cross-fade

The dashboard is the "live operation" view (scene 1 + photo);
the per-ZIP strip is the "service area navigation" view (scene 3).
They serve different intents; the strip replaces the dashboard
without losing the dashboard's information (the 6 ZIPs in the
strip's eyebrow + the "47 yards on route" + "6 yrs cutting in
33771" from the per-area detail pages carry the same signals).

Editorial content repositioned: `.content` bottom raised from
12svh to 22svh so the strip can occupy the bottom 18svh without
overlapping the CTAs. The content's top still sits above the
ranch house roof, so the editorial pull-quote reads against the
painted cream sky.

Card design: compact horizontal layout (48×48 image + ZIP +
label), cream-tinted bg (88 % cream + transparent) with
backdrop blur, brand palette, hover lift (`translateY(-3px)` +
palm-bark border darken + soft shadow + image scale 1.04).
Responsive: 6 cards desktop, 3×2 tablet, 2×3 mobile. Images
are `loading="lazy"` so the 6 area illustrations (~400 KB
total) don't enter the initial bundle.

`apps/web/audit/d-0050-phase-3/hero-y*.png` confirms the strip
is visible in scene 3 only, the editorial content sits above
it cleanly, the dashboard fades out as the strip fades in,
and the ranch house + sun + clouds are all visible.

---

## Open questions (deferred to future review)

The brief's §9 open questions were resolved during implementation
where the answer was clear from the existing assets; the remaining
ambiguities are deferred:

- **Q1 (Phase 1 operator direction):** Resolved — hand-authored
  cartoon operator approved as a faithful match to the storybook
  style. No new asset generation needed.
- **Q2 (Phase 2 route pin source):** Resolved — pin reads as
  "the operator is right here on this lawn" with a sample
  address implied by the LIVE pill's existing "Mowing now
  1274 6th St NE, 33771" text. No real-time geolocation needed.
- **Q3 (Phase 3 strip vs reclaimed fern + songbirds):** Resolved
  — strip is the higher-impact choice. Fern + songbirds remain
  in git history (commit `b330cf8`) for potential re-painted-
  cartoon-style substitution.
- **Q4 (Phase 4 4th scene):** **DEFERRED**. Phase 4 would add a
  dedicated operator + equipment scene (consolidating
  `OperatorStrip` section 03 below the hero). After 90 days of
  production data, we can decide if the section is now redundant
  given the per-ZIP strip carries some of its information.
- **Q5 (asset regeneration):** Not needed — every shipped phase
  reuses existing assets.

---

## Future work

- **Phase 4 (operator + equipment as 4th scene):** deferred. If
  the steward reviews the production hero and wants more
  operator + equipment content, the existing
  `apps/web/public/operator/portrait.webp` and
  `apps/web/public/equipment/*.webp` are ready to be slotted
  into a 4th scene. The hero section is currently 350svh;
  adding a 4th scene would extend it to ~500svh and add a
  cross-fade band.
- **Optional aria-label cleanup:** the brief's §7.4 mentions 3
  orphan aria-labels in `hero.composition` (`palmAriaLabel`,
  `mowerAriaLabel`, `grassAriaLabel`). These are still orphans
  after D-0050 (the cartoon operator now has its own
  `operatorCartoonAriaLabel`). Cleanup is safe to do but not
  blocking.
- **OperatorStrip consolidation:** if Phase 4 ships, the
  `OperatorStrip` section 03 below the hero is likely
  redundant. We can reduce it to a thin trust strip (just
  the operator's name + 1 stat) or remove it entirely.

---

## Files this decision touched

Modified:
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
  (added callout, operator, route pin, dashboard handoff)
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css`
  (added .calloutPill, .routePin, .routePinPulse, .routePinIcon)
- `apps/web/src/components/sections/HeroStorybookLayer.tsx`
  (added <OperatorSway> group with hand-authored SVG operator)
- `apps/web/src/components/sections/HeroStorybookLayer.module.css`
  (added .operatorSway keyframes + transform-origin)
- `apps/web/src/components/sections/SecondScene.tsx`
  (added <PerZipStrip> + perZipStripOpacity prop)
- `apps/web/src/components/sections/SecondScene.module.css`
  (added .perZipStrip, .perZipCard, etc; raised .content bottom
  from 12svh to 22svh)
- `apps/web/src/lib/content.ts` (added hero.callout, hero.scene3.
  perZipStrip, hero.operatorCartoonAriaLabel)
- `apps/web/src/app/page.tsx` (pass-through for new props)
- `apps/web/src/app/visual-test/page.tsx` (same)
- `apps/web/src/app/hero-3d-test/page.tsx` (same)

Created (visual verification):
- `apps/web/audit/d-0050-phase-1a/hero-y*.png` (8 captures)
- `apps/web/audit/d-0050-phase-1b/hero-y*.png` (8 captures)
- `apps/web/audit/d-0050-phase-2/hero-y*.png` (8 captures) +
  pin-area-zoom.png, pin-only.png
- `apps/web/audit/d-0050-phase-3/hero-y*.png` (8 captures)

No new assets created. No new components added (all 3 phases
are additions to existing components).
