# D-0059 — Hero: simplification (Path A) and re-extension (Path B)

**One page. Read this first. Full spec in
`0059-hero-simplification-and-extension.md` (123 KB) if you want the
detail.**

---

## The problem (visible in the captures)

`apps/web/audit/d-0050-final/scene-pct-{020,040,060}.png` show real
incoherence in the two cross-fade windows:

- **20% / 40% scroll** — cartoon ranch houses, cartoon sun, cartoon
  mower ghost on top of the real 4K photo. Two houses, two suns.
- **60% scroll** — same cartoon clouds + sun persist on top of the
  painted scene 2. Black saw-tooth band at the bottom.
- **0% / 80% / 100%** — fine. Storybook + painted scene 2 each work
  as their own composition.

The cause: D-0050 added 4 overlays (cartoon operator, callout pill,
route pin, per-ZIP strip) all living *inside* the existing 350svh
hero, and the two cross-fade windows [0.10, 0.40] and [0.40, 0.70]
can't absorb them without ghost-bleed. Same lesson as D-0049 rev 4
(don't mix visual languages), applied one level up.

---

## Path A — ship this week (~6 hours)

**Revert the 4 D-0050 overlays + D-0052 sun animation.** The
overlays duplicate work the sections below the hero already do
better: callout pill → ServiceAreaMap, cartoon operator →
OperatorStrip, route pin → LIVE pill, per-ZIP strip →
ServiceAreaMap. Move them out of the hero, not deeper into it.

**Then do the design pass the cross-fade problem was obscuring:**

1. **Paper-grain overlay** on the storybook layer — 200×200 SVG
   noise pattern, multiply blend at 0.08. Moves the cartoon from
   "flat vector" to "printed storybook page." ~30 lines.
2. **Gouache ranch houses** — two-stop gradient
   (`--ll-sand-bleached` → `--ll-clay` at 0.4) + 1px linework in
   `--ll-palm-bark` at 0.6. Hand-drawn convention, applied to the
   houses that currently look pasted-in. ~80 lines.
3. **Two-phase cross-fade** — soft-fade [0.10, 0.25], then dissolve
   [0.25, 0.40]. The visitor reads "becoming photo" instead of
   "fading away." 4-line change in `useTransform`.
4. **Editorial chrome** on the scene 2 pull-quote — clay square,
   1px horizontal rules, opening-quote boost. The painted scene is
   an *illustration*; the copy should read as a *caption* on it,
   not a third hero headline. ~40 lines CSS + a reusable
   `EditorialChrome` component.

Each addition is independently revertable. 1-3 line change per
revert.

**Path A acceptance:** 8-position capture set at scroll
0/10/20/30/40/60/80/100 shows zero ghost-bleed at 20/30/40/60%.
Named baseline added to Playwright regression suite for those 4
positions so future additions surface the bleed immediately.

**Path A confidence: 0.82.** Revert is mostly deleting code (low
risk). Design pass is small + isolated.

---

## Path B — next week, if you want more (optional)

**Re-extend with scroll-locked pinned scenes, not overlays.** Each
new scene gets its own 100svh with a hard enter/exit (no
cross-fade), so the existing cross-fade windows stay clean.

**My pick: scene 1 (operator arrival) only.** The cartoon storybook
promises "your neighbor's lawnmower" — the operator arrival delivers
that as a literal painted operator pushing a Honda HRX217 across a
Pinellas lawn, same gouache style as scene 2/3.

- **Copy:** `CHAPTER 3 — THE OPERATOR` / `Same operator, every week.` /
  `Honda HRX217. EGO 56V. Greenworks 40V. Echo PAS-225. The same hands,
  the same route, the same six years on the same six ZIPs.`
- **CTAs:** `Meet me → /about` / `Quote me → /quote`
- **Asset work:** fresh ComfyUI generation. ~3-4 hours on the RTX
  3090 + ~1 hour post-processing (PNG → WebP q=82, mobile + desktop
  crops, hand-tune lighting to match scene 2). Generation brief in
  `apps/comfyui/prompts/hero-operator-arrival.md` (to be authored
  before generation).
- **Code work:** new `OperatorArrival` component, 3 new MotionValues,
  section height 350svh → 460svh.
- **Section-height cost:** +110svh for the new scene + hard-cut
  transitions.

The other 3 candidate scenes (route-pin moment, per-ZIP pre-flight,
equipment close-up) all duplicate the sections below the hero. Skip.

**Path B confidence: 0.75.** Hard-cut pattern is new to this
codebase. Painted operator + tool + house + lawn in one frame is
the most complex single asset in the library — the D-0008
re-roll-and-escalate rule is the safety net. Single-commit revert
if it doesn't land.

---

## Why Path A first

The D-0043 → D-0058 burst taught us:

1. **Each addition to the hero is a forced choice about cross-fade
   window.** Current windows are 30% each. Adding anything that
   wants to live in those windows breaks the existing layers.
2. **Visual languages don't mix in transition.** The D-0049 rev 4
   lesson, applied one level up.
3. **The page below is already strong.** 8 sections answer every
   question. Adding "WHERE" or "WHO" inside the hero duplicates work
   that's already done better below.

Path A re-homes the D-0050 additions and uses the freed capacity
to do the design refinements. Ship it, see it in production, get
charter's 2-week KPI data.

Path B is the right way to *re-extend* once Path A is in production.
Hard-cut scene pattern is known motion-design (NYT / Verge
longform) — each scene has its own language, section height is the
only cost. Risk is real but contained.

---

## The art-direction backbone (both paths)

**Three visual languages, one transition rule.** At any scroll
position, exactly one language dominates the viewport (>70%
opacity). The cross-fade is *between* languages, not a window where
multiple languages stack.

**Hand-drawn linework convention.** Every flat-vector element gets
1px stroke in `--ll-palm-bark` at 0.5-0.7. Path A extends to the
ranch houses.

**Editorial chrome convention.** Any "editorial pull-quote" section
gets: clay 8×8 square next to eyebrow, 1px horizontal rules, opening-
quote boost, CTA hover underline. Reusable `EditorialChrome` component
after Path A.

**9-token color discipline.** Every generated asset passes the
existing palette-coverage audit (D-0043's
`apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py`)
before acceptance.

---

## File-by-file (Path A only — Path B in the full spec)

**Reverted (back to pre-D-0050 / D-0052):**

- `apps/web/src/components/sections/HeroStorybookLayer.tsx` — drop
  the cartoon operator + sun animation
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx` — drop
  the callout, route pin, dashboard handoff
- `apps/web/src/components/sections/SecondScene.tsx` — drop the
  per-ZIP strip
- `apps/web/src/lib/content.ts` — drop `hero.callout`,
  `hero.scene3.perZipStrip`, `hero.operatorCartoonAriaLabel`
- `apps/web/src/app/page.tsx` — drop the callout + perZipStrip props

**Modified (design pass):**

- `HeroStorybookLayer.tsx` — paper-grain overlay + ranch-house
  gouache
- `HeroFieldTelemetry.tsx` — two-phase cross-fade + widened grass
  fade-out
- `SecondScene.module.css` — editorial chrome
- `apps/web/src/components/ui/EditorialChrome.tsx` (NEW) — reusable
  editorial chrome component

**Capture + verify:**

- `apps/web/audit/d-0059-path-a/` (NEW) — 8-position capture set,
  zoom captures, ghost-bleed compare, audit memo
- `apps/web/visual/baselines/hero-chromium-{desktop,mobile}.png` —
  refresh after design pass
- `apps/web/visual/baselines/hero-ghost-bleed-chromium-desktop.png`
  (NEW) — named baseline at scroll 20% to catch future regressions

---

## What I need from you

Two things, in order:

1. **Confirm the re-homing in §2.3 of the full spec is what you
   want.** Callout → ServiceAreaMap, cartoon operator → OperatorStrip,
   route pin → LIVE pill, per-ZIP strip → ServiceAreaMap. If any of
   these should stay in the hero, say which.
2. **Path B or not.** My pick is "scene 1 (operator arrival) only,
   after Path A ships and you've had a week with the simplified
   hero." If you want all 4 candidate scenes, or none (Path A is
   the destination), say which.

Once those are settled, I execute Path A. Plan to land it across
2-3 sessions: revert + design pass on day 1, acceptance + baselines
on day 2, ledger entry + capture audit on day 3.
