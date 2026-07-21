# D-0055 — Editorial Field Log section

**Status:** Ratified
**Date:** 2026-07-21
**Owner:** Architecture + Engineering
**Reviewer:** Steward
**Related:** D-0049 (revert + style-mismatch lesson), D-0050 (per-ZIP strip), D-0053 (ambient palms cycle), D-0056 (pre-flight voice)

---

## Context

The 10-section landing page is operational: hero, schedule, service
listing, pricing, process, FAQ, CTA. The visitor sees a working
mowing service, but the **editorial voice** only exists in fragments:

- Hero scene 2 has the "Mowing this lawn right now" route pin (D-0050)
- OperatorStrip has the operator's bio + the painted palms background
- ScheduleTimeline has the pre-flight note (D-0056) and the today card
- FieldLog (this section) is the **first stand-alone editorial moment** — a section that exists to be read, not to convert.

Three diagnostic findings this section closes:

1. **The 6 ZIPs are referenced 4× (form, ambient palms, hero per-ZIP
   strip, schedule) but the visitor never sees the *route* — the
   spatial connection between them.** The FieldLog is the first
   place the route is visible.
2. **The operator's voice is consistent but never has an editorial
   moment.** The pull-quote is the page's first stand-alone quote —
   poetic, not functional.
3. **The brand's visual signatures (passport-stamp, paper-grain,
   hand-drawn cartoon) appear once each.** This section repeats
   them so they read as a *language*, not a one-off.

## Decision

A new `<FieldLog />` section, placed **between `<OperatorStrip />`
and `<ServiceBento />`**, that occupies one viewport-height and
contains five vertical zones in a single 920px-max-width column.

```
┌──────────────────────────────────────────────────────────┐
│  FIELD LOG · WEEK 28                  (eyebrow)          │
│                                                          │
│       "The yard never knows the difference.              │
│        The operator does."                (pull-quote)   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ╭─╮                       ╭─╮    ╭──╮            │  │
│  │  │ │   ~ ~ ~   ╭─╮    ~    │ │    │  │  (route)   │  │
│  │  │ │ ~ ~ ~ ~ ~ │ │ ~ ~ ~ ~ ╰─╯ ~ ~╰──╯            │  │
│  │  ╰─╯      🚜                                        │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│   Forty-seven yards, six ZIPs, the same truck,           │
│   every week. You'll know my face before you know        │
│   my name.                               (field note)   │
│                                                          │
│                                            [STAMP] -2°   │
└──────────────────────────────────────────────────────────┘
```

### 1. Eyebrow

`FIELD LOG · WEEK 28` — 12px Inter 700 uppercase, letter-spacing
0.18em, clay color (`var(--ll-clay)`). Mirrors the day-card
eyebrow register (D-0056 pre-flight) so the editorial content
reads as a *journal entry*, not as a marketing tagline. "Week 28"
is computed at render time from `new Date().getWeek()` (ISO 8601).

### 2. Pull-quote

> "The yard never knows the difference. The operator does."

Fraunces italic 500, palm-bark, 18ch max-width (the .quoteBlock
parent in this section's CSS, NOT the page-default 22ch — see the
font-size trap below). The sentence is the philosophical companion
to hero scene 2's *functional* promise ("mowing this lawn right
now"). The hero sells the service; the field log sells the craft.

**Why "operator," not "lawn," "yard," "customer," or "company":**
the word "operator" is the same word the OperatorStrip uses to
introduce the person doing the work. It's the noun the brand
chose for the role — switching to "team" or "company" would break
the chain.

### 3. Hand-drawn route SVG

720×280 viewBox, 6 houses in a rough geographic cluster, winding
cubic-bezier path, sun-yellow truck marker at "today" (33771).
Hand-authored **flat-fill SVG cartoon** (matches the existing
hero scene 1 operator + houses style — D-0049 lesson: hand-authored
SVG cartoon, not painted VEO brushwork, for a NEW hand-drawn
content piece).

- 6 house rectangles in cream-fill with palm-bark stroke (2px)
- 2 palm trees (the existing hero idiom) at the top edge
- 1 sun in the top-right corner
- Path: 6-segment cubic bezier from origin (0,140) through the
  6 house coordinates to (720,140). Hand-tuned, intentionally
  imperfect curves — the wobble is the "hand-drawn" signal
- Truck marker: 14×10 sun-yellow rounded rect at the "Tue" position
  with a small chimney-stroke to suggest a mower cab

The route is a *spatial* representation of the weekly cadence
that the schedule timeline lists. The same 6 ZIPs the user has
seen in the form, the hero strip, and the schedule are now
spatially connected. This is the section's central function.

### 4. Field note

> "Forty-seven yards, six ZIPs, the same truck, every week. You'll
> know my face before you know my name."

Right-aligned under the route. 14px Inter 400, palm-bark at 78%
opacity. The line uses **specific, falsifiable numbers** (47 yards,
6 ZIPs, every week) — same honesty pattern as SecondScene's
"mowing this lawn" route pin and D-0056's "mower tuned last night"
pre-flight note. The visitor can mentally verify the claim against
the schedule.

### 5. Passport stamp

The existing `passport-stamp.svg` asset (used in the equipment
showcase corner) placed bottom-right at -2° tilt. Same size
(60px) and same register as the equipment showcase use, so the
visitor who scrolled past the equipment section **recognizes
the stamp and registers the section as the same brand language**.

## Design rationale

**Single column, max-width 920px.** A wide column would break the
field-notebook feel — the content reads as a page from a working
journal, not a landing-page section. 920px is the same max-width
as the schedule timeline's day cards, so the section feels
continuous with the schedule.

**Background: cream + paper-grain texture.** The `body::before`
in `globals.css` already paints a paper-grain.svg at 5% opacity
across the entire page. FieldLog doesn't add a new background
rule — it inherits the paper grain, which makes the section
read as a "torn-out page" from the same notebook the rest of
the page is drawn on.

**Vertical rhythm: 5 zones, equal breathing.** Each zone is
separated by `var(--space-7)` (32px) of vertical space. The route
SVG gets `var(--space-8)` (48px) above and below because the
visual mass is heavier than text.

**Animations: 3 entry animations, all `prefers-reduced-motion`
gated:**

| Element | Animation | Period | Easing |
|---|---|---|---|
| `.quoteBlock` | opacity 0→1 + y 16→0 | 0.6s | cubic-bezier(0.16,1,0.3,1) |
| `.routePath` | stroke-dashoffset 720→0 | 1.6s | cubic-bezier(0.16,1,0.3,1) |
| `.stamp` | scale 1.4→1 + rotate -12°→-2° | 0.4s | cubic-bezier(0.4,0,0.2,1) |
| `.fieldNote` | opacity 0→1 + y 8→0, delay 0.9s | 0.5s | cubic-bezier(0.16,1,0.3,1) |

**Path draw-in is the central animation.** stroke-dashoffset
`720→0` over 1.6s reads as the operator "drawing the route" with
a pen — the same hand-drawn aesthetic as the rest of the section.
The path's `pathLength` is set to 720 to make the animation
length stable.

**Stamp slam is the punchline.** The stamp starts at scale 1.4
and rotate -12° (the "lifted" state, just above the page), then
lands at scale 1.0 and rotate -2° (the "stamped" state, slightly
tilted left because real stamps don't land perfectly level). The
slam is timed to peak when the path draw-in is at 80% — the
stamp "validates" the route as the path completes.

**Field note fade-up is delayed 0.9s.** The visitor reads the
pull-quote → watches the route draw → reads the field note. The
delay forces a small pause that turns the field note into a
"second read" of the same idea.

**Trigger: Framer Motion `whileInView`.** The animations only
fire when the section enters the viewport (IntersectionObserver
via `useInView`). This is critical because the section sits in
the middle of a long page; the visitor might scroll past it
fast. Animations only fire when the visitor is actually looking
at the section.

## The font-size trap (lessons learned)

The first implementation used `max-width: 22ch` on the pull-quote
parent `.quoteBlock`. This looked correct on a desktop monitor
but the line was reading as **only 12ch wide on the rendered
page** — the quote broke after "yard" instead of using the full
available width.

Root cause: `ch` units are *font-size-dependent*. 1ch at body
16px ≈ 10px, but 1ch at Fraunces 52px (the pull-quote font size)
≈ 27px. So 22ch resolved to ~220px instead of the expected 220px
on a paragraph. The fix was to drop max-width to 18ch so the
resolves to ~480px (which is the visual width I wanted).

This is a non-obvious failure mode and it's documented in the
`memo.md` for future sections that use ch units inside large-font
parents.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .quoteBlock, .routePath, .stamp, .fieldNote {
    opacity: 1;
    transform: none;
    transition: none;
    animation: none;
  }
  .routePath { stroke-dashoffset: 0; }
}
```

All four animations collapse to identity. The pull-quote renders
in place, the route renders fully drawn, the stamp renders at
its final -2° tilt, and the field note renders in place. The
section reads as a static page — same content, no motion.

## Verification

- TypeScript: `tsc --noEmit` passes (committed in c9423f1)
- Visual: `apps/web/audit/d-0055-field-log/field-log-final.png` shows
  the section in its final rendered state
- Mobile: `field-log-mobile.png` shows the section at 390px width
  (iPhone 14 Pro) — single column, stamp pinned bottom-right
  with `.fieldNote { padding-right: 60px }` to clear the stamp
- Mid-animation: `field-log-mid-anim.png` shows the path at
  ~50% draw-in (after viewport entry, t=0.8s)
- Context: `field-log-context.png` shows the section between
  OperatorStrip and ServiceBento

## Artifacts

- Commit: `c9423f1 feat(field-log): D-0055 editorial field-log section with hand-drawn route map`
- Files: `apps/web/src/components/sections/FieldLog.tsx` (280 lines), `FieldLog.module.css` (210 lines)
- Export: `apps/web/src/components/sections/index.ts` (added FieldLog)
- Page: `apps/web/src/app/page.tsx` (inserted between OperatorStrip and ServiceBento)
- Captures: `apps/web/audit/d-0055-field-log/{field-log-final,context,mid-anim,mobile}.png`
- Design brief: `apps/web/audit/d-0055-field-log/memo.md` (15.7KB)
- Sketch: `apps/web/audit/d-0055-field-log/route-svg-sketch.svg`
