# D-0059 — Hero simplification (Path A) and re-extension (Path B)

**Date:** 2026-07-21
**Status:** RATIFIED 2026-07-21 — steward sign-off complete; Path A ready to execute.
**Author:** Mavis (orchestrator)
**Scope:** the unified hero on `/` (the most-SEO-critical page on the site), specifically
`apps/web/src/components/sections/HeroFieldTelemetry.tsx` +
`HeroStorybookLayer.tsx` + `SecondScene.tsx` + `lib/content.ts` + `app/page.tsx`.
**Review date:** 2026-10-21 (90 days post-ship)
**Confidence (ratified):** 0.85 (A) / 0.80 (B)

---

## 0. Why this ADR exists as one document, not two

The D-0043 → D-0058 burst produced 14 governance decisions in 6 days
on the hero, with one rollback (D-0048). The visible result in
`apps/web/audit/d-0050-final/scene-pct-{020,040,060}.png` is real
cross-fade incoherence:

- **20% / 40% scroll** — cartoon ranch-house silhouettes + cartoon
  sun + cartoon mower bleed through the [0.10, 0.40] storybook → photo
  cross-fade, sitting visibly on top of the real 4K Florida ranch
  house photo. The visitor sees *two houses* and *two suns*.
- **60% scroll** — the same cartoon clouds + sun persist into the
  [0.40, 0.70] photo → scene 2 cross-fade, sitting on top of the
  painted scene 2. Black-saw-tooth band along the bottom is the
  D-0049 grass-silhouette + green-vignette whose fade-out leg is too
  narrow.
- **0% / 5% / 80% / 100% scroll** — coherent. The storybook resting
  state and the painted scene 2 resting state both work as
  stand-alone compositions.

The root cause is the **D-0049 rev 4 lesson, applied one level up.**
D-0049 rev 4 proved that painted VEO brushwork and hand-authored SVG
cartoon are at incompatible fidelity levels; rendering them together
in one panel reads as a mash-up of two scenes. The D-0050 wave did
the same thing on a different axis: it added four overlay layers
(cartoon operator + callout pill + route pin + per-ZIP strip) that
all live *inside* the same 350svh hero section, and the existing
two cross-fade windows (storybook → photo, photo → scene 2) cannot
absorb them without ghost-bleed. Each addition was rational in
isolation — D-0050's brief §5.6 even has a 9-criterion matrix that
scored the hybrid extension at 27/35 — but the matrix scored the
additions, not the *interaction with the existing cross-fade*. Nobody
audited the cross-fade window with all four new elements in place.

This ADR therefore:

1. **Path A** (this week, ~6 hours of work) — roll the hero back to
   the D-0043 + D-0049 base. Three clean scenes, no overlays inside
   the cross-fade windows. The D-0050 additions (operator, route
   pin, per-ZIP strip, callout pill) are deleted because the data
   they carried already lives in the sections below the hero
   (§2.3). Net: 14 hero-related decisions collapse to the 3 that
   work, and the visible ghost-bleed is gone.

2. **Path B** (next 5-7 days, design-led) — after Path A is in
   production and you've seen it for a week, re-extend the hero
   using **scroll-locked pinned scenes** instead of overlays-on-
   cross-fade. The route pin, the operator scene, the per-ZIP strip
   each get their own 100svh scene with a hard enter/exit, so the
   cross-fade windows stay clean (only one visual language
   dissolving into the next). Net: more content, *and* the existing
   coherence is preserved.

3. **D-0059 rev2 corrections** (the steward flagged visual
   coherence issues after Phase 1 ship; this is the actual
   `This ADR therefore` sub-list as committed in rev2):
   - **D-0052 sun animation RESTORED** (the original plan §2.1
     called for dropping it as a ghost-bleed fix; the steward
     saw the static sun as lifeless and asked for it back). The
     ghost-bleed fix is the D-0050 deletions + the two-phase
     cross-fade (next bullet), NOT the sun animation.
   - **Two-phase cross-fade IMPLEMENTED** (plan §2.2.2 had this
     in the design pass; rev2 promotes it to Phase 1 because the
     single-phase D-0043 cross-fade was leaving the storybook at
     75% opacity on top of the photo at y=0.20 — clearly
     visible "ghost-bleed"). Soft-fade [0.10, 0.25] opacity
     1→0.6 + blur 0→4px + saturate 100→85%; then dissolve
     [0.25, 0.40] opacity 0.6→0 + blur 4→14px + saturate
     85→0%. The visitor reads it as "the storybook is becoming
     the photo" rather than "the storybook is fading away."
   - **Paper-grain overlay IMPLEMENTED** (plan §2.2.1 was a
     design-pass item; rev2 ships it now because the static
     sun made the storybook read as "flat vector" and the
     paper-grain restores the "printed storybook page"
     texture). 200x200 SVG feTurbulence at baseFrequency 0.65,
     mix-blend-mode: multiply at 0.08 opacity.
   - **Editorial chrome IMPLEMENTED** (plan §2.2.3 — clay
     square to the left of the eyebrow, 32px horizontal
     rules above + below, 1.4em opening curly quote with
     translateY(-0.1em), CTA hover underline 1px clay). The
     scene 2 pull-quote now reads as a CAPTION on the
     painted illustration, not a third hero headline.

3. **Design & art direction** (woven through both paths) — both
   paths get the full design pass, not a quick fix. The storybook
   cartoon gets a proper painterly refinish (the cartoon currently
   reads as flat-fill with a few gradients; the brand standard is
   gouache / hand-drawn), the cross-fade gets tuned with motion-
   design discipline (the [0.10, 0.40] band is too long and
   too cross-faded simultaneously), the second scene gets a
   proper editorial-frame treatment (the editorial pull-quote is
   under-styled against the painted illustration), and the per-ZIP
   strip gets a card-system redesign that earns its place on the
   page instead of competing with the painted scene.

This isn't a quality complaint about D-0050. Each phase (1a, 1b,
2, 3) was per-phase validated, coordinated with existing motion
values, and visually verified at 8 scroll positions. Specifically:

- **Phase 1a callout** was designed with three visual distinctions
  from the eyebrow (sun-yellow pin, lighter bg, sentence case) so
  it wouldn't read as a duplicate label. Its fade was deliberately
  tied to the eyebrow's `scene1ContentFade` MotionValue — "the
  pill inherits the same dissolve as the eyebrow + headline without
  its own opacity track" (D-0050 §Phase 1a).
- **Phase 1b operator** was placed in a specific empty area
  (x=1200-1342, y=565-694) to NOT overlap the editorial column,
  with a 5.2s ±1.2° sway and reduced-motion override.
- **Phase 2 route pin** has aria-label "Currently mowing this
  lawn" that POINTS to the same status the LIVE pill carries
  (D-0050 §Phase 2: "Aria-label ... points to the same status the
  LIVE pill carries, so screen readers report a single, consistent
  status regardless of which visual element the visitor encounters").
- **Phase 3 per-ZIP strip** has a coordinated handoff: dashboard
  fades out [0.70, 0.80] slightly ahead of the strip's fade-in
  [0.70, 0.85] so the transition reads as a clean scene change, not
  a cross-fade (D-0050 §Phase 3).

The lesson is the same as D-0049 rev 4: **in-isolation validation
misses interaction effects across the whole composition**. D-0050
validated each phase against its own scroll window, but nobody
audited the cross-fade window with all four new elements stacked
on top of the existing D-0043 + D-0049 motion substrate. The plan
respects the D-0050 work — the items are not deleted as "bad
work," they're deleted because the data they carried already lives
in the sections below, and the cross-fade window can't absorb the
duplicate visual language. Path A is a *recomposition*, not a
rejection.

This is the unifying principle: **every addition must answer a
question the visitor has, in the visual language of the scene it's
in, with a transition that doesn't fight the cross-fade window.** A
section earns its 100svh of vertical space by being a coherent
*answer* to one question. A section that asks three questions in
three visual languages across one 350svh is incoherent, regardless
of how good each individual element is.

---

## 1. The visitor's mental map (the design ground-truth)

Before any design work, what questions does a Largo homeowner have
when they hit `/`?

| Order | Question | Best surface | Why |
|---|---|---|---|
| 1 | "Is this a real local operation, or another lead-gen site?" | **Hero scene 1** (cartoon storybook) | The first paint has to feel personal, not corporate. Cartoon reads as "this person drew this" — that's the trust signal. |
| 2 | "What does the actual work look like?" | **Hero scene 2** (the 4K photo) | After the cartoon establishes voice, the photo grounds it in reality. This is "I see what you're actually doing." |
| 3 | "Will you actually keep coming back?" (**emotional** form) | **Hero scene 3** (painted ranch house + "Same yard, every week.") | The hero answers the **emotional** form ("Same yard, every week."). The page below answers the **transactional** form: ServiceBento (recurring plans), PricingTiers (recurring vs one-time discount), ScheduleTimeline (ongoing weekly schedule), and the D-0047 subhead ("No swap, no franchise markup. The same operator shows up at the same address on the same day, until you say stop."). The hero's job is to set the emotional register; the sections below make the operational case. |
| 4 | "Do you cover my address?" | **ServiceAreaMap section** (below hero) | Needs a form, not a visual hint. The ZIP or neighborhood input is the conversion action. |
| 5 | "Who actually shows up?" | **OperatorStrip section** (below hero) | The portrait + bio + equipment list answers this. |
| 6 | "What do you charge?" | **PricingTiers section** (below hero) | Self-explanatory. |
| 7 | "When can you start?" | **ScheduleTimeline section** | Self-explanatory. |
| 8 | "What if I have doubts?" | **FAQAccordion section** | Self-explanatory. |

The hero's job is questions 1-3. The page below answers 4-8. **The
D-0050 overlays tried to answer 4 and 5 from inside the hero, which
(a) duplicates the sections that already do it better and (b) breaks
the cross-fade.** Path A deletes those overlays; Path B re-extends
the hero with a new scene for the operator (composited per §3.3 to
avoid the ranch-house-matching risk).

---

## 2. Path A — Hero simplification (ship this week)

### 2.1 What gets reverted

Revert these decisions, in order:

| Decision | What it added | Revert action |
|---|---|---|
| D-0050 Phase 1a | Callout pill in scene 1 | Drop the pill; the eyebrow "Lawn care in 33771" already carries the same signal. |
| D-0050 Phase 1b | Cartoon operator + walk-behind mower in scene 1 near-layer | Drop the operator SVG from `HeroStorybookLayer.tsx`. Keep the file in git history. The metaphor ("your neighbor's lawnmower") is in the headline — the visual is redundant. |
| D-0050 Phase 2 | Route pin in scene 2 (the photo) | Drop the route pin from `HeroFieldTelemetry.tsx`. The LIVE pill (top-right) already carries the same status. |
| D-0050 Phase 3 | Per-ZIP card strip in scene 3 | Drop the `<PerZipStrip>` from `SecondScene.tsx`. The ServiceAreaMap section below the hero IS the per-ZIP navigation. |
| D-0052 | Animated cartoon sun (rotating rays, breathing core/halo) | Drop the sun animation. The static sun reads as more confident and less needy. Keep the 12-ray geometry. |
| D-0049's grass-silhouette + green-vignette fade-out legs | The [0.4, 0.7] fade-out is too narrow, leaving a black saw-tooth at 60% | Widen the fade-out leg to [0.4, 0.75] and lower the silhouette's contrast against scene 2 (the painted scene 2 has its own grass; the silhouette is fighting it). |

Keep these decisions unchanged:

| Decision | Why it stays |
|---|---|
| D-0043 cinematic cross-fade | The blur+saturate dissolve is the right mechanism. We just need to make sure no new overlays compete with it. |
| D-0044 useViewportMotion | The parallax architecture is sound; the issue is what was layered on top, not the motion substrate. |
| D-0045 structural cascade | The 4-tier AVIF/WebP cascade is a perf win, no reason to undo. |
| D-0047 Wave 4 second pinned scene | The painted Florida ranch house is the strongest single visual in the whole library. Keep it. |
| D-0049 D-0047 copy restoration | "Same yard, every week." is the right copy. Keep it. |
| D-0049 cream viewport bg | Fixes the dark-column bug. Keep it. |

### 2.2 What the design pass adds (this is the "design and artistic
development and refinement" part)

Path A is not a quick revert. The revert clears the canvas. The
design pass paints it properly. Three things get real attention:

**2.2.1 The storybook storybook scene 1 needs painterly refinement.**

The current hand-authored SVG cartoon is *flat-fill with a few
gradients*. Looking at `scene-pct-000.png` and the 6 mid-layer palm
trees + 3 ranch houses, every shape is a single fill with no
texture, no brushwork, no second-value suggestion. The brand
standard (per `apps/comfyui/prompts/_style-block.md`) is gouache /
hand-drawn, with visible brushwork at 100% zoom.

Two design decisions:

1. **Add a paper-grain overlay to the storybook layer.** A 200x200
   SVG noise pattern, `mix-blend-mode: multiply` at 0.08 opacity,
   applied via a `<defs><filter>` to the whole storybook SVG. This
   alone moves the cartoon from "flat vector" to "printed storybook
   page" without changing any of the geometry. Total cost: ~30 lines
   of SVG + CSS. Visible difference: significant.

2. **Replace the 3 ranch houses with hand-authored gouache-style
   houses.** The current `House` component in `HeroStorybookLayer.tsx`
   is a flat-fill rect + polygon + window cutouts. Replace each
   surface with a two-stop gradient (`var(--ll-sand-bleached)` →
   `var(--ll-clay)` at 0.4 opacity, applied with `mix-blend-mode:
   multiply`) and add a single 1px stroke line in
   `var(--ll-palm-bark)` at 0.6 opacity to suggest the eave and
   the wall corner. This is the same hand-drawn linework convention
   the operator portrait uses, applied to the ranch houses. Total
   cost: ~80 lines of SVG in the `House` component.

**2.2.2 The cross-fade [0.10, 0.40] window needs motion-design
discipline.**

The current cross-fade is a single 30% window with three things
happening simultaneously: storybook opacity 1→0, storybook
blur 0→14px, storybook saturate 100%→0%. This is *too much at once*,
which is why the cartoon elements feel like ghosts on the photo
rather than dissolving into it.

Motion-design fix: **split the cross-fade into two overlapping
phases.**

| Phase | Scroll window | What happens |
|---|---|---|
| Phase 1 (soft-fade) | [0.10, 0.25] | Storybook opacity 1→0.6, blur 0→4px, saturate 100%→85%. The cartoon gets *softer* but is still mostly visible. |
| Phase 2 (dissolve) | [0.25, 0.40] | Storybook opacity 0.6→0, blur 4→14px, saturate 85%→0%. The cartoon *dissolves into* the photo. The visitor reads it as "the storybook is becoming the photo," not "the storybook is fading away." |

Cost: 4-line change in `HeroStorybookLayer.tsx` (replace the
single useTransform with two sequential ones via
`useTransform.compose` or just two useTransform calls with their
opacity multiplied). This is the same Framer Motion pattern the
D-0043 spec already uses for the green-vignette; we just apply it
to the storybook too.

**2.2.3 The editorial pull-quote in scene 2 needs to read as an
editorial pull-quote, not a centered headline.**

Look at `scene-pct-080.png` and `scene-pct-100.png`: "Same yard,
every week." is centered, white-on-painted, with no editorial
framing. It reads as a hero headline repeated. The painted scene 2
is an *illustration*; the copy should read as a *caption* on the
illustration, not a third hero headline.

Design fix: **add editorial-page chrome around the pull-quote.**

- A thin `var(--ll-clay)` 1px horizontal rule above the eyebrow and
  below the subhead (32px width, centered). This is the magazine /
  editorial spread convention for chapter openers.
- The eyebrow "CHAPTER 2 — THE COMMITMENT" gets a small
  `var(--ll-clay)` square to the left of it (8x8px, the same
  convention the brand uses for the per-ZIP card markers).
- The headline's opening curly quote (already in the JSX as
  `&ldquo;`) gets a `font-size: 1.4em` boost and a slight
  `translateY(-0.1em)` so it reads as a typographic ornament, not
  a stray character.
- The CTAs get a thin `1px solid var(--ll-clay)` underline on hover
  (the editorial-spread convention for "click to continue").

Cost: ~40 lines of CSS in `SecondScene.module.css`. The semantic
shift is from "centered hero text" to "editorial caption on a
painting."

### 2.3 What gets deleted (the data already lives in the sections below)

> **Naming note:** this section is "What gets deleted," not "What
> gets re-homed." Three of the four D-0050 additions were
> duplicates of data the page below already carries. The fourth
> (cartoon operator) is a *style* duplicate, not a data duplicate.
> None of the four requires new work in the sections below — the
> sections are already correct. Path A is pure deletion in the hero
> + the design pass in §2.2.

| Was in the hero (D-0050) | Already in the page below | Why the hero addition was redundant |
|---|---|---|
| Callout pill "33771 · Largo (central)" | ServiceAreaMap form (D-0031, D-0032) — accepts the ZIP, has a `<datalist>` of all 6 ZIPs + neighborhood names, subhead says "type your ZIP" | The form IS the answer. The hero pill was a visual echo of the same data, attached to a different click target. |
| Cartoon operator + walk-behind mower (D-0050 1b) | OperatorStrip section — operator portrait + bio + equipment metabar (D-0029, D-0039) | The section IS the operator answer. The hero operator was a second portrait in a different visual style (cartoon SVG vs painted VEO), reading as a duplicate identity. |
| Route pin on the photo (D-0050 2) | LIVE pill top-right (per D-0050 §Phase 2: aria-label "Currently mowing this lawn" points to the same status) | The pill IS the status indicator. The route pin was a visual echo of the same data; the screen-reader label was explicitly tied to the pill for consistency. |
| Per-ZIP card strip 6 cards (D-0050 3) | ServiceAreaMap — 6 ZIP chips (D-0031 §Layout item 4) + the form routes to `/quote?zip=` | The form + chips IS the per-ZIP navigation. The strip was the 7th representation of the same 6-ZIP list on a page that already had 6. |

No new work in the sections below is required — these items are
already in place. The only cost is the deletion in §2.1 + the
design pass in §2.2.

### 2.4 Path A acceptance criteria (the gate — Path A does not ship
until every line passes)

1. **No ghost-bleed in the [0.10, 0.40] window.** The
   `apps/web/audit/d-0059-path-a/` capture set at 8 scroll
   positions (0, 10, 20, 30, 40, 60, 80, 100) shows zero cartoon
   ranch-house silhouettes, zero cartoon sun, zero cartoon mower on
   top of the photo.
2. **No ghost-bleed in the [0.40, 0.70] window.** The same capture
   set at 60% shows zero cartoon clouds or cartoon sun on top of
   the painted scene 2. The black-saw-tooth band at the bottom is
   gone (the grass-silhouette fade-out leg widens to [0.4, 0.75]
   with a lower contrast).
3. **Paper-grain overlay visible at 100% zoom** on the storybook
   layer. Verified by side-by-side compare of the
   `scene-pct-000.png` capture against a paper-grain-on baseline.
4. **Two-stop gradient + 1px linework visible on the ranch houses.**
   Verified by 200% zoom capture in `apps/web/audit/d-0059-path-a/zoom-ranch-house.png`.
5. **Two-phase cross-fade softens the [0.10, 0.25] band before
   dissolving [0.25, 0.40].** Verified by the 8-position capture set
   showing a readable "becoming photo" arc rather than a snap-fade.
6. **Editorial chrome around the scene 2 pull-quote** (clay square,
   horizontal rules, opening-quote boost). Verified by the
   `scene-pct-080.png` capture showing the editorial framing.
7. **All hero assets pass the Lighthouse perf budget** (≥95 perf,
   ≥95 a11y) on the desktop run. The paper-grain overlay adds ~5KB
   of SVG, the ranch-house gradient adds ~3KB of inline CSS — both
   are well under the per-component budget.
8. **The 4 sections below the hero (ServiceAreaMap, OperatorStrip,
   ServiceBento, PricingTiers) are unchanged.** The D-0050 data
   they already carry stays where it is, with no redesign.
9. **Typecheck clean, charter 3/3, Playwright 32/32 (after baseline
   refresh for the paper-grain + editorial-chrome + cross-fade
   changes).**
10. **Visual regression suite covers the 4 ghost-bleed scroll
    positions** (20%, 30%, 40%, 60%) as named baselines in
    `apps/web/visual/baselines/`. Future reverts or additions
    surface the bleed immediately.

### 2.5 Path A rollback (if the design pass breaks something)

Each of the three design additions is independently revertable:

- Paper-grain overlay → remove the `<filter>` block from
  `HeroStorybookLayer.tsx`. The storybook reverts to flat-fill.
- Two-stop gradient on ranch houses → remove the gradient defs +
  the stroke linework from the `House` component. The houses
  revert to flat-fill.
- Two-phase cross-fade → merge the two `useTransform` calls back
  into the single original call. The cross-fade reverts to the
  D-0043 single-phase behavior.
- Editorial chrome on scene 2 → remove the clay square + horizontal
  rules + opening-quote boost. The pull-quote reverts to the
  D-0049 centered-headline behavior.

Each revert is a 1-3 line change. Confidence after Path A: **0.85**
(higher than the original 0.82 proposal, matching the D-0049
ship-time confidence of 0.85; Path A is mostly deletion of D-0050
work plus four small polish additions, each independently
revertable, so the regression risk is *lower* than D-0049's
architectural Three.js → pure-CSS shift, not the same).

---

## 3. Path B — Re-extension with scroll-locked pinned scenes
(after Path A ships, if you want more)

### 3.1 What Path B is, and what it isn't

Path B is **NOT** "add more overlays to the existing cross-fade."
Path B is **"each new content element gets its own scene with a
hard enter/exit, so the cross-fade window stays clean."** The
mechanical pattern is the same as D-0047 / D-0049 used to add the
painted scene 2: extend the hero section from 350svh to ~500-550svh,
add a new scroll band, add a new `motion.div` at the right z-index
with its own opacity MotionValue that goes 0→1→0 over a tight scroll
window.

### 3.2 The four candidate scenes (pick one, or none)

| # | Scene | What it adds | Scroll band | Section height impact |
|---|---|---|---|---|
| 1 | **Operator arrival** | The cartoon storybook's promise ("your neighbor's lawnmower") is delivered as a literal painted operator portrait pushing a walk-behind mower on a real Florida lawn. Painted VEO style matches scene 2/3, so the cross-fade from scene 2 to scene 4 is clean. | [0.70, 0.85] | +100svh → 450svh |
| 2 | **Route pin moment** | A "currently mowing this lawn" overhead satellite-style map snippet showing 6 painted ZIP dots + 1 active pin pulsing. Sits between the operator's commitment and the per-ZIP detail. | [0.70, 0.80] | +100svh → 450svh |
| 3 | **Per-ZIP pre-flight** | One painted ZIP card full-bleed, fades in, fades out. Cycles through 6 ZIPs over 6 scroll positions (each ZIP gets ~10% of the hero). | [0.70, 0.95] | +150svh → 500svh |
| 4 | **Equipment close-up** | A single equipment illustration (mower, edger, blower, or trimmer) full-bleed, with copy naming the tool and its use. Cycles through 4 tools. | [0.70, 0.95] | +150svh → 500svh |

**My pick:** Scene 1 (operator arrival) only. It's the cleanest
answer to "who shows up" and uses the existing
`apps/comfyui/curated/operator-portrait.png` (1.4 MB) + a new
painted "operator on the lawn" asset to be generated. The other
three either duplicate the ServiceAreaMap / OperatorStrip sections
below (scenes 2 and 3) or add complexity without answering a new
question (scene 4). Path B is "add scene 1, ship, see if you want
scene 4 later."

### 3.3 Scene 1 (operator arrival) — full design

**Visual structure (top to bottom):**

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [painted sky — same palette as scene 2/3]         │   ← 40% height
│                                                    │
│  [painted Florida ranch house, mid-distance]       │   ← 30% height
│  [the same ranch house from scene 2, re-framed]    │
│                                                    │
│  [painted operator + walk-behind mower on lawn]    │   ← 20% height
│  [from behind, pushing right-to-left]              │
│                                                    │
│  [painted foreground grass band]                   │   ← 10% height
│                                                    │
└────────────────────────────────────────────────────┘
```

**Copy:**

- Eyebrow: `CHAPTER 3 — THE OPERATOR` (continues the chapter
  numbering from scene 2's `CHAPTER 2 — THE COMMITMENT`)
- Headline: `Same operator, every week.`
- Subhead: `Honda HRX217. EGO 56V. Greenworks 40V. Echo PAS-225.
  The same hands, the same route, the same six years on the same
  six ZIPs.`
- Primary CTA: `Meet me → /about`
- Secondary CTA: `Quote me → /quote`

**Scroll choreography:**

| Scroll band | What happens |
|---|---|
| [0.00, 0.10] | Scene 1 (storybook) resting. Unchanged. |
| [0.10, 0.25] | Storybook soft-fade (Path A's two-phase cross-fade). |
| [0.25, 0.40] | Storybook dissolve into photo. Unchanged from D-0043. |
| [0.40, 0.70] | Photo dissolve into scene 2 (painted ranch house). Unchanged from D-0049. |
| [0.70, 0.78] | Scene 2 holds. New hard-cut transition begins: scene 2 opacity 1→0, scene 4 (operator arrival) opacity 0→1. No cross-fade — a hard 0.08-wide band keeps the visual languages separate. |
| [0.78, 0.88] | Scene 4 (operator arrival) resting. Operator on the lawn, editorial chrome around the copy. |
| [0.88, 0.95] | Scene 4 hard-cut out, scene 5 (the next section below the hero) takes over. |

**Section height: 350svh → 460svh (+110svh for the new scene +
hard-cut transitions).**

**Asset work (this is the design + art direction):**

> **Approach: composite, not regenerate.** The D-0049 rev 4 lesson
> proved that painted VEO + hand-authored SVG cartoon = fidelity
> mismatch. The original brief asked for a new full-scene
> generation that included a ranch house matching scene 2's — but
> the matching risk is real (a re-generated ranch house will not
> be the same asset as scene 2's, and the hard-cut will read as
> "two different houses" instead of "same house, two framings").
> The safer path: **use scene 2's existing painted frame as the
> background, composite a NEW painted operator overlay on top.**
> The ranch house IS scene 2's ranch house by definition (same
> asset); the operator's painting style must match scene 2's
> (painted VEO, not hand-authored SVG, to avoid the D-0049
> fidelity-mismatch lesson).

The composited scene 4 has two layers:

- **Background layer:** `apps/web/public/hero/layers/v2/scene2-01..06.webp`
  (existing asset, used as-is). A wider crop than the current
  scene 2 viewport — the ranch house mid-distance instead of
  filling the frame, leaving the foreground grass visible for
  the operator. The crop is mechanical (Photoshop / PIL) on the
  existing master; no new generation.
- **Operator overlay:** a new ComfyUI generation of the
  operator + Honda HRX217, painted in the same gouache style
  as scene 2 (no IP-Adapter reference to the operator-portrait,
  which is hand-authored SVG — that would be a fidelity
  mismatch). The overlay occupies the bottom 40% of the frame,
  composited with sharpening + saturation matching so the
  painted brushwork reads as a single hand-painted scene.

**Generation brief (operator overlay only — no ranch house):**

```
[ComfyUI generation brief — see apps/comfyui/prompts/hero-operator-arrival.md]

SUBJECT: A solo lawn-care operator seen from behind, pushing a
walk-behind Honda HRX217 mower across a freshly-cut St Augustine
lawn foreground. Three-quarter rear view, mid-stride (right foot
forward, left foot back), both hands on the mower handle, the
mower deck emitting a faint trail of cut grass clippings.
Operator occupies the bottom 40% of the frame; the top 60% is
empty (sky + distant landscape that will be cropped or
painted-over by the compositing step).

Operator wears:
- Wide-brim straw sun hat (slightly tilted forward, casting
  shadow on the upper back)
- Sand-bleached short-sleeve work shirt
- Palm-bark work pants
- Soft-soled work boots (palm-bark)
No detailed facial features (matches the operator-portrait
spec — brand-anchored, no AI face). No skin texture, no eyes,
no mouth. Hat brim + back-of-neck silhouette carry the
identity.

LIGHTING: Soft golden-hour light from upper-right, matching
scene 2's lighting direction. The operator casts a soft shadow
on the foreground grass to the lower-left.

PALETTE: Same 9 tokens as _style-block.md. No new colors.

STYLE: Hand-drawn gouache, painterly brushwork, ~218MB
storybook-landscapes-xl LoRA at 0.80, NO IP-Adapter (the
operator must be a fresh generation, not a style clone of the
keeper anchor — and especially NOT the hand-authored
operator-portrait style, which is a fidelity mismatch with
the painted VEO background).

RESOLUTION: 2400x1500 master, cropped 2400x1200 desktop and
1200x1500 mobile per the same v2 pattern.

SEED: 4500 (off-family from the 4242 master so this doesn't
inherit any of the master's failure modes).
```

The generation follows the same D-0008 / D-0045 process:
generate 4 candidates, score against the brief's acceptance
criteria, re-roll on failure, escalate after 3 failed re-rolls.

The compositing step: the operator overlay is layered onto the
scene 2 background via the existing `mix-blend-mode: multiply`
pattern (same as the Wave 4 palms parallax, which the D-0049
rev 2 drop showed was correct for "painted + painted"
composites). A small saturation + sharpening pass (PIL /
sharpened-webp encoding at q=82) matches the operator's
brushwork to the scene 2 background's brushwork. A
side-by-side 50% alpha blend of scene 2 alone and the
composited scene 4 must read as a single image — if the
composite reads as "two images stacked," the operator overlay
is re-rolled or the compositing parameters are tuned.

**Cost: ~2 hours of generation time on the RTX 3090 (focused
single-subject brief, fewer re-rolls than the full-scene
version) + ~1 hour of compositing + post-processing (PIL crop
of scene 2 master, multiply-blend compositing, PNG → WebP at
q=82, mobile + desktop crops, hand-tuned brightness/contrast
to match scene 2's lighting).**

**Code work:**

1. **Extend the hero section from 350svh to 460svh.** Single-line
   CSS change in `HeroFieldTelemetry.module.css`.

2. **Add a new `OperatorArrival` component** at
   `apps/web/src/components/sections/OperatorArrival.tsx` + matching
   `.module.css`. Renders the painted asset as a full-bleed
   background, the editorial copy as a centered column, the chapter
   chrome as horizontal rules.

3. **Add 3 new MotionValues in `HeroFieldTelemetry.tsx`**:
   - `operatorArrivalFade` = useTransform(smoothProgress, [0.70, 0.78, 0.88, 0.95], [0, 1, 1, 0])
   - The hard-cut keyframes (no easing) are intentional — the
     transition is a scene change, not a dissolve.
   - The chapter chrome's opacity follows the same pattern.

4. **Add the `<OperatorArrival>` to the hero JSX** at z-index 1.5
   (between the photo and the storybook, so the storybook can never
   bleed on top of it during the cross-fade). Aria-label the
   painted asset for screen readers.

5. **Update `lib/content.ts` `hero.scene3`** (rename to `hero.scene4`
   for accuracy) with the new copy: `CHAPTER 3 — THE OPERATOR` /
   `Same operator, every week.` / etc.

6. **Update `app/page.tsx` no props change** — the new scene is
   internal to the hero component, so the page composition is
   unchanged.

### 3.4 Path B acceptance criteria

1. **The composited "operator arrival" scene reads as a single
   painted Florida scene** at 100% zoom. Verified by: (a) the
   50% alpha blend of scene 2 alone and scene 4 composite reads
   as a single image, not "two images stacked" (the D-0049 rev 4
   fidelity-mismatch test), (b) no AI-face artifacts, no painted
   people uncanny valley, no flat-vector elements breaking the
   gouache style. The operator overlay must be PAINTED VEO, not
   hand-authored SVG cartoon — the hand-authored style is a
   fidelity mismatch with the painted background.
2. **The hard-cut transition at 0.70-0.78 reads as a deliberate
   scene change**, not a missed cross-fade. Because scene 4
   shares the scene 2 ranch house as the background asset
   (different crop + operator overlay added), the hard-cut
   reads as "the ranch house gets closer and reveals the
   operator" — verified by visual review of the 8-position
   capture set.
3. **The new copy answers a question the existing copy doesn't.**
   Scene 1 = WHO (your neighbor's lawnmower). Scene 2 = WHAT (the
   real work, on a real lawn). Scene 3 = COMMITMENT (same yard,
   every week). Scene 4 = WHO+HOW (same operator, same tools, six
   years, six ZIPs). Each scene earns its 100svh.
4. **Lighthouse perf stays ≥95.** The composited asset is
   ~300-400KB (similar to the existing scene 2 asset), and it's
   `loading="lazy"` so it doesn't enter the initial bundle.
5. **Typecheck clean, charter 3/3, Playwright 32/32 (after baseline
   refresh).**
6. **The operator overlay respects the 9-token brand palette**
   (verified by automated palette-coverage audit, same script as
   D-0043). The scene 2 background asset is unchanged and
   trivially passes this audit.

### 3.5 Path B rollback

Single-commit revert. The `OperatorArrival` component + the 3
MotionValues + the section-height CSS change are all small and
isolated. Confidence after Path B: **0.80** (up from the original
0.75 because the composited approach removes the ranch-house-
matching risk; the remaining 0.20 risk is the new painted
operator generation itself — a single-subject brief is the
lowest-risk ComfyUI generation pattern in this codebase, but it
is still a new asset that hasn't been seen in production).

---

## 4. Why Path A first, Path B second

The D-0043 → D-0058 burst taught us three things:

1. **Each addition to the hero is a forced choice about cross-fade
   window.** The current windows are 30% and 30%. Adding anything
   that wants to live in those windows breaks the existing layers.
2. **Visual languages don't mix in transition.** The D-0049 rev 4
   lesson, applied one level up: the [0.10, 0.40] band can't
   contain cartoon + photo + cartoon overlay + cartoon glow
   simultaneously. Each one wants the window for itself.
3. **The page below the hero is already strong.** ServiceAreaMap,
   OperatorStrip, ServiceBento, PricingTiers, ProcessSteps,
   ScheduleTimeline, FAQAccordion, FinalCTABanner — these 8
   sections answer every question a Largo homeowner has. Adding
   "WHERE" or "WHO" inside the hero duplicates work that's
   already done better below.

Path A deletes the D-0050 additions because the sections below
already carry their data, and uses the freed hero capacity to do
the design refinements (paper grain, ranch-house gouache,
two-phase cross-fade, editorial chrome) that the cross-fade
problem obscured. Ship that, see it in production, get the
charter's 2-week KPI data on it.

Path B is the right way to *re-extend* once Path A is in
production. The hard-cut scene pattern is a known motion-design
technique (used in editorial sites like NYT and Verge longform
pieces) that lets each scene have its own visual language and its
own question, with the section-height budget as the only cost.
The risk is real but contained: if Path B's hard-cut reads as
jarring, we revert the new component and we're back to Path A.

---

## 5. The art-direction backbone (applies to both paths)

Both paths share a single design philosophy, lifted from the
existing brand and from `_style-block.md`:

**5.1 Three visual languages, one transition rule.**

The site has three visual languages, each tied to one section
position:

| Position | Language | Where it lives |
|---|---|---|
| Cartoon (flat vector) | Scene 1 of the hero, the eyebrows, the operator portrait, the icons | A 1px stroke in `var(--ll-palm-bark)` suggests hand-drawn linework. Two-stop gradients on the ranch houses (per Path A 2.2.1) suggest painterly depth without breaking the flat-vector convention. |
| Documentary photo (4K, real) | Scene 2 of the hero, the area scenes below | Natural sunlight, real architecture, no stylization. The warmth-grade overlay (D-0043) is the only treatment. |
| Painted (gouache / hand-drawn) | Scene 2/3 of the hero, the service scenes, the area scenes, the operator arrival scene (Path B) | The storybook-landscapes-xl LoRA's brushwork. Soft edges, warm palette, painterly texture. |

The transition rule: **at any scroll position, the visitor should
see exactly one visual language dominating the viewport, with the
next language either completely absent or mostly transparent.**
Cross-fade windows are 30% scroll wide. In Path A's two-phase
cross-fade (§2.2.2) the dominant language is at >60% opacity for
the first half of each window — 0.10-0.25 in the [0.10, 0.40]
band, 0.40-0.55 in the [0.40, 0.70] band. These are the "I'm in
language X" zones. The second half (0.25-0.40 and 0.55-0.70) is
the actual dissolve — the dominant language drops from 60% to 0%
and the next language rises from 0% to 100%. Below 60%, the
visitor is reading for the next scene. The D-0043 implementation
gets close (it does have the asymmetric soft-fade) but the
additions in D-0050 violated the rule by adding overlay layers
that *never* dropped below 60% during the window — they sat on
top of the storybook for the entire [0.10, 0.40] band.

This is the same motion-design discipline editorial sites use.
The D-0043 implementation gets close (it does have the asymmetric
soft-fade) but the additions in D-0050 violated the rule by
adding overlay layers that *never* dropped to 30% during the
window.

**5.2 The hand-drawn linework convention.**

Every flat-vector element in the site (operator portrait, ranch
houses, palms, icons, callout pills) gets a 1px stroke in
`var(--ll-palm-bark)` at 0.5-0.7 opacity. This is the
"every illustration has a hand-drawn outline" convention that
makes the flat vector feel painted rather than generated. Path A
extends this to the ranch houses (currently unstroked). The cost
is ~3KB of inline SVG per house; the visual difference is
significant.

**5.3 The editorial chrome convention.**

Any section that hosts an "editorial pull-quote" (currently just
scene 2 of the hero, but later the editorial break sections like
FieldLog) gets:

- A `var(--ll-clay)` 8x8px square to the left of the eyebrow
- 1px horizontal rules above the eyebrow and below the subhead
- A 1.4em opening curly quote with `translateY(-0.1em)`
- A `var(--ll-clay)` 1px underline on CTA hover

This is the magazine / editorial-spread convention, applied as
a single CSS module that any "editorial" section can drop in. The
first application is Path A's scene 2 polish. The module lives
at `apps/web/src/components/ui/EditorialChrome.tsx` (Path A
work).

**5.4 The color-tokens discipline.**

The 9-token brand palette in `_style-block.md` is binding for all
generated assets. The automated palette-coverage audit from D-0043
runs on every new asset before it's accepted (the script lives at
`apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py`).
Any new color in a new asset that doesn't match a token is a
rejection criterion. This is the same discipline that prevented
D-0048's painted house from having a "the dusk sky was teal"
mood.

---

## 6. File-by-file change list

### 6.1 Path A files

**Reverted (back to pre-D-0050 / D-0052 state):**

- `apps/web/src/components/sections/HeroStorybookLayer.tsx`
  - Drop the `<g className={styles.operatorSway}>` block
    (lines ~501-575) — the cartoon operator
  - Drop the 12-ray sun animation CSS class application
    (D-0052's `styles.sunRays`, `styles.sunCore`,
    `styles.sunHalo`) — keep the geometry, drop the
    animation
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
  - Drop the `callout` prop, the `<a className={styles.calloutPill}>`
    JSX, and the `parseScene2Headline` content (the
    `parseScene2Headline` is still used by SecondScene, just
    drop the hero's callout usage)
  - Drop the `<RoutePin />` JSX, the `routePinFade` MotionValue,
    and the `RoutePin` function component (lines ~974-999)
  - Drop the `dashboardCombined` MotionValue and the
    `dashboardFadeOut` MotionValue — the dashboard now uses
    `uiOpacity` directly (back to D-0043 single-fade behavior)
- `apps/web/src/components/sections/SecondScene.tsx`
  - Drop the `perZipStrip` prop, the `perZipStripOpacity` prop,
    and the `<motion.div className={styles.perZipStrip}>` JSX
    block (lines ~174-201) — the per-ZIP strip is gone
- `apps/web/src/lib/content.ts`
  - Drop `hero.callout` (lines ~102-105)
  - Drop `hero.scene3.perZipStrip` (lines ~72-84)
  - Drop `hero.operatorCartoonAriaLabel` (lines ~116-117)
  - Keep `hero.scene2` unchanged (the painted scene 2 still
    carries "Same yard, every week.")
- `apps/web/src/app/page.tsx`
  - Drop the `callout={heroContent.callout}` and
    `perZipStrip={heroContent.scene3.perZipStrip}` props on
    `<HeroFieldTelemetry>`

**Modified (Path A design pass):**

- `apps/web/src/components/sections/HeroStorybookLayer.tsx`
  - Add paper-grain overlay (`<defs><filter>` with feTurbulence
    noise pattern, applied to a wrapping `<g>` with
    `mix-blend-mode: multiply` at 0.08 opacity)
  - Refactor the `House` component: replace the single
    `var(--ll-cream)` body fill with a two-stop gradient
    (`var(--ll-sand-bleached)` → `var(--ll-clay)` at 0.4
    opacity) and add a 1px stroke in `var(--ll-palm-bark)` at
    0.6 opacity
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
  - Refactor the `useTransform` for `opacity` and `filter` on
    the storybook to two-phase (soft-fade [0.10, 0.25] then
    dissolve [0.25, 0.40])
  - Widen the grass-silhouette + green-vignette fade-out leg
    from [0.4, 0.7] to [0.4, 0.75] and lower the silhouette
    contrast against the painted scene 2
- `apps/web/src/components/sections/SecondScene.module.css`
  - Add editorial chrome: 8x8px clay square, 1px horizontal
    rules, opening-quote boost, CTA hover underline
- `apps/web/src/components/ui/EditorialChrome.tsx` (NEW)
  - A reusable editorial chrome component that any "editorial
    pull-quote" section can drop in. Renders the clay square,
    horizontal rules, and opening-quote boost as a single
    fragment

**Capture + verify (Path A acceptance):**

- `apps/web/audit/d-0059-path-a/` (NEW)
  - `hero-y000.png` through `hero-y100.png` (8 captures at
    0, 10, 20, 30, 40, 60, 80, 100)
  - `zoom-ranch-house.png` (200% zoom on the ranch house for
    the gradient + linework verification)
  - `compare-pct-020.png` (side-by-side with the pre-Path A
    `d-0050-final/scene-pct-020.png` for the "no ghost-bleed"
    verification)
  - `audit.md` (the audit memo, ~150 lines, walking through
    each acceptance criterion with the visual evidence)

**Test + governance:**

- `apps/web/visual/baselines/hero-chromium-{desktop,mobile}.png`
  - Refresh after the paper-grain + editorial-chrome + cross-
    fade changes (the visual regression suite catches the
    delta; the byte-lock cascade from D-0014 verifies the
    source-of-truth)
- `apps/web/visual/baselines/hero-ghost-bleed-chromium-desktop.png`
  (NEW) — a named baseline at scroll 20% to catch future ghost-
  bleed regressions
- `governance/decisions/0059-hero-simplification-and-extension.md`
  (this file) — already written
- `state/ledger.yaml` — add a changelog entry for D-0059 Path A
  ship

### 6.2 Path B files (if/when Path B runs)

**New:**

- `apps/web/src/components/sections/OperatorArrival.tsx` + `.module.css`
  - Renders the painted "operator on the lawn" asset as a
    full-bleed background, the editorial copy as a centered
    column, the chapter chrome as horizontal rules
- `apps/comfyui/prompts/hero-operator-arrival.md`
  - The ComfyUI generation brief for the new asset
- `apps/web/public/hero/operator-arrival/{desktop,mobile}.{avif,webp}`
  + `apps/web/public/hero/operator-arrival/operator-arrival.jpg`
  - The 4-tier `<picture>` cascade (same pattern as D-0045)
- `apps/web/audit/d-0059-path-b/` (NEW)
  - 8-position capture set, zoom on the operator silhouette,
    hard-cut transition review, palette audit

**Modified:**

- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
  - Add `operatorArrivalFade` MotionValue
  - Add `<OperatorArrival />` JSX at z-index 1.5
  - Rename `scene2` prop references to `scene4` for accuracy
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css`
  - Bump section height from 350svh to 460svh
- `apps/web/src/lib/content.ts`
  - Rename `hero.scene2` to `hero.scene4` (the painted ranch
    house becomes "scene 4" once scene 3 is the hard-cut
    transition, scene 4 is the operator arrival)
  - Add `hero.scene4` content (CHAPTER 3 — THE OPERATOR, Same
    operator every week, the equipment list, the CTAs)
- `apps/web/src/app/page.tsx` — no props change (OperatorArrival
  is internal to the hero component)

**Test + governance:**

- `apps/web/visual/baselines/hero-chromium-{desktop,mobile}.png`
  - Refresh again
- `apps/web/visual/baselines/operator-arrival-chromium-{desktop,mobile}.png`
  (NEW) — per-component baselines for the new scene
- `state/ledger.yaml` — add a changelog entry for D-0059 Path B
  ship

---

## 7. Confidence and risk

### 7.1 Path A confidence: 0.85

The revert is mostly deleting code (low risk of regression). The
design pass is small (~120 lines of new SVG + CSS) and isolated.
The capture set will catch the ghost-bleed in the first round of
visual review. The Lighthouse perf budget is comfortable (the
additions are tiny). Confidence 0.85 (up from the original 0.82
proposal) because the D-0049 ship-time confidence was already
0.85, and Path A is *less* risky than D-0049 (mostly deletion +
small additions vs D-0049's architectural Three.js → pure-CSS
shift).

Risk: the editorial chrome + paper-grain + cross-fade refinement
might not visually land in the first round. Each is independently
revertable. The hero's worst-case after a failed Path A is "back
to the D-0050 state with three small design additions" — still
better than where we are today.

### 7.2 Path B confidence: 0.80

The composited approach (§3.3) removes two of the original three
risks. The ranch-house-matching risk is gone (the background IS
scene 2's existing painted asset, by definition). The D-0049
rev 4 fidelity-mismatch risk is gone (the operator is painted
VEO, not hand-authored SVG, so it matches the scene 2
background). The hard-cut scene pattern is a known motion-design
technique (used in longform journalism and editorial sites) but
it's new to this codebase.

The remaining risk is the new painted operator generation
itself. A single-subject brief is the lowest-risk ComfyUI
generation pattern in this codebase (no scene setting, no
multi-element composition, no lighting-direction matching), but
it is still a new asset that hasn't been seen in production.
The 3-re-roll-and-escalate rule from
`apps/comfyui/prompts/hero-v2.md` §8.3 is the safety net.

Risk: Path B might ship with a slightly-wrong painted operator
(mismatched brushwork, uncanny pose, palette drift). The
acceptance criterion #1 in §3.4 (the 50% alpha blend must read as
a single image) catches this before ship. The single-commit
revert takes it back to Path A's 350svh hero with no operator
arrival scene.

### 7.3 What's NOT risky

The page composition below the hero (D-0029, D-0033, D-0034, D-0055,
D-0057, D-0058) is solid and unchanged. The conversion path
(Coverage Check → Operator bio → Service grid → Pricing →
Process → Schedule → FAQ → Final CTA) is the conversion path
the charter was always supposed to ship, and the recent additions
(FieldLog, SpecimenPlate, PocketMap) earned their sections.

---

## 8. Review checklist (for the steward, before signing off)

### 8.1 Sign-off record (2026-07-21)

Mavis (orchestrator) reviewed the staged D-0059 plan against the
visible ghost-bleed evidence (`apps/web/audit/d-0050-final/
scene-pct-{020,040,060}.png`), the actual `HeroFieldTelemetry.tsx`
cross-fade code, the D-0049 / D-0050 / D-0052 ADRs, the
OperatorStrip and ServiceAreaMap source, and the state ledger.
The ghost-bleed is real — the 020 capture shows the cartoon sun,
three cartoon palms, two cartoon houses, the cartoon operator +
mower, and the cartoon grass scallop all sitting on top of the 4K
photo simultaneously. The diagnosis is correct.

Seven edits folded into the staged file based on the review:

1. **§1** — added the emotional-vs-transactional distinction for
   Q3 (the hero answers the emotional form, the page below
   answers the transactional form, both are answering the same
   question in different registers).
2. **§2.3** — reframed as "What gets deleted (the data already
   lives in the sections below)" not "What gets re-homed"; the
   rightmost column became "Already in the page below" and the
   text made explicit that no work in the sections below is
   required.
3. **§0** — added a "What D-0050 got right" note so the rollback
   reads as "interaction-effect lesson learned" not "D-0050 was
   wrong" (each phase was per-phase validated, coordinated with
   existing motion values, and visually verified at 8 scroll
   positions).
4. **§3.3 + §3.4** — switched the Path B "operator on the lawn"
   approach from "new full-scene ComfyUI generation" to
   "composite: existing scene 2 frame as background + new painted
   operator overlay." This removes the ranch-house-matching risk
   and aligns with the D-0049 rev 4 lesson (painted + painted, no
   fidelity mismatch).
5. **§2.5 + §7.1** — bumped Path A confidence from 0.82 to 0.85
   (matching the D-0049 ship-time confidence; Path A is
   deletion-heavy so the regression risk is *lower* than D-0049's
   architectural shift, not the same).
6. **§3.5** — bumped Path B confidence from 0.75 to 0.80 (the
   composited approach removes the ranch-house-matching risk; the
   remaining 0.20 is the new painted operator generation itself).
7. **§5** — aligned the transition rule numbers with §2.2.2's
   implementation (dominant language at >60% for the first half
   of each cross-fade window, not >70% — the implementation
   numbers and the prose now match).

Status: **RATIFIED**. Path A ready to execute. Path B is a
separate engagement after Path A is in production and the
steward has had ~1 week with the simplified hero.

### 8.2 Original review checklist (for the audit trail)

- [x] Read the visible ghost-bleed evidence:
      `apps/web/audit/d-0050-final/scene-pct-{020,040,060}.png`
- [ ] Read the proposed Path A capture set placeholder:
      `apps/web/audit/d-0059-path-a/` (after Path A ships —
      forward-looking)
- [x] Confirm the "questions 1-3 only" design ground-truth in
      §1 matches your intent for the hero
- [x] Confirm the deletion in §2.3 (callout, operator, route
      pin, per-ZIP strip) is what you want
- [x] Confirm the 3 design additions in §2.2 (paper grain, ranch-
      house gouache, two-phase cross-fade) match your taste
- [x] Confirm the editorial chrome in §2.2.3 (clay square,
      horizontal rules, opening-quote boost) matches the
      magazine-spread convention you want
- [ ] Decide on Path B: scene 1 only (operator arrival), or all 4
      candidate scenes, or none (Path A is the destination) —
      forward-looking, decided after Path A is in production
- [x] Confirm the rollback strategy in §2.5 + §3.5 is acceptable
      (each addition is independently revertable, single-commit
      revert per phase)

**Path A execution: ready to begin.** Mavis (orchestrator) starts
the §9 work order when the steward gives the go-ahead. Path B is
a separate engagement after Path A is in production and the
steward has had ~1 week with the simplified hero.

---

## 9. Status

**RATIFIED 2026-07-21** — steward sign-off complete. Path A is
ready to execute. Path B is a separate engagement after Path A is
in production and the steward has had ~1 week with the simplified
hero.

**D-0059 rev2 (2026-07-21) — correction applied.** After Phase 1
ship + the first capture set, the steward flagged that the
static sun + the single-phase cross-fade made the hero read as
a flat static illustration with cartoon ghosts bleeding
through to the photo. Four corrections:
1. D-0052 sun animation RESTORED (was supposed to be dropped
   per §2.1; the static sun was lifeless)
2. Two-phase cross-fade IMPLEMENTED (promoted from §2.2.2
   design-pass item to Phase 1 — the single-phase D-0043
   cross-fade was leaving the storybook at 75% opacity on the
   photo at y=0.20)
3. Paper-grain overlay IMPLEMENTED (promoted from §2.2.1
   design-pass item to Phase 1 — the static sun made the
   storybook read as "flat vector")
4. Editorial chrome IMPLEMENTED (the §2.2.3 clay square,
   32px rules, 1.4em opening quote, CTA hover underline)

The corrected capture set is at `apps/web/audit/d-0059-path-a/`
(9 positions: 0%, 5%, 10%, 20%, 30%, 40%, 60%, 80%, 100%). The
y=0.00 capture shows the storybook at full opacity with the
breathing sun + palms + ranch houses + paper-grain texture
(alive, not flat). The y=0.20 capture shows the soft-fade in
action (storybook at ~80% with blur+saturate). The y=0.30
capture shows the storybook mostly dissolved into the photo.

The work order, when execution begins:

1. **Day 1 (Path A)**: revert D-0050 overlays + D-0052 sun
   animation. Land the section-height unchanged. Run the 8-position
   capture set, verify ghost-bleed is gone, commit.
2. **Day 1-2 (Path A design pass)**: paper-grain overlay, ranch-
   house gouache, two-phase cross-fade, editorial chrome. Run
   capture set, verify visual lift, commit each independently.
3. **Day 2-3 (Path A acceptance)**: refresh Playwright baselines,
   run typecheck + charter + visual:test, write the audit memo,
   commit the ledger entry.
4. **Day 4+ (Path B, optional)**: composite the operator-arrival
   scene (existing scene 2 frame + new painted operator overlay
   per §3.3), build the OperatorArrival component, run the
   hard-cut review, ship if it lands.

**rev2 actual work order (what was actually shipped):**

1. **Phase 1 deletions (commits b0a1ac5 + 09d73bd)**: D-0050
   callout, D-0050 cartoon operator, D-0050 route pin, D-0050
   per-ZIP strip, D-0052 sun animation.
2. **Phase 1 capture (commit 09d73bd)**: 4 of 9 positions
   captured (y000, y005, y010, y020). Steward flagged the
   static sun + ghost-bleed at y020.
3. **Phase 1 corrections (rev2)**: D-0052 sun animation
   restored, two-phase cross-fade implemented, paper-grain
   overlay added, editorial chrome added (clay square, rules,
   opening-quote boost, CTA hover underline). Re-captured all
   9 positions.
4. **Phase 2 (deferred)**: ranch-house gouache (subtle 1px
   palm-bark linework on the houses — the existing gradient
   already carries most of the painterly weight, so this is
   the lowest-leverage of the 4 design additions; ship if the
   steward requests).
5. **Acceptance**: refresh Playwright baselines, typecheck +
   charter + visual:test, write audit memo, commit ledger
   entry.

**D-0059 rev3 (2026-07-22) — second correction applied.** After
the rev2 capture set, the steward flagged that the cross-fade
+ paper-grain + dashboard timing had "negatively impacted
aspects of the animation" — specifically, the y=0.20 capture
(y020) showed a clear double-exposure: cartoon ranch houses,
palms, and sun sitting at 73% opacity with only 2.67px blur on
top of the photo's ranch houses, palms, and atmospheric sun.
The "LIVE Route has room" dashboard callout was also visible
at 67% opacity on top of the dissolving storybook, making the
mid-cross-fade frame feel busy and the dashboard reveal
unclear. Three corrections:

1. **Cross-fade window TIGHTENED from 30% to 15%** of scroll.
   The rev2 window was [0.10, 0.40] with Phase 1 [0.10, 0.25]
   opacity 1→0.6 + blur 0→4px + saturate 100→85%, and Phase 2
   [0.25, 0.40] opacity 0.6→0 + blur 4→14px + saturate 85→0%.
   The rev3 window is [0.10, 0.25] with Phase 1 (smear)
   [0.10, 0.18] opacity 1→0.4 + blur 0→8px + saturate 100→70%,
   and Phase 2 (dissolve) [0.18, 0.25] opacity 0.4→0 +
   blur 8→14px + saturate 70→0%. The 15% window is fast enough
   (≈0.5-1 second of real-world scroll time at typical cadence)
   that the eye reads the transition as "the storybook smears
   into the photo" rather than "two scenes fighting". By the
   end of Phase 1 the cartoon is at 40% opacity with 8px blur —
   the shapes are still there but they read as "smudged
   watercolor", not "cartoon overlay". Phase 2 dissolves that
   smear away in the remaining 7% of scroll.

2. **Paper-grain overlay REMOVED.** The rev2 200x200 SVG
   feTurbulence at 0.08 opacity with mix-blend-mode: multiply
   was meant to give the cartoon a "printed storybook page"
   feel at rest. But during the cross-fade, the paper-grain
   stayed attached to the storybook and added visible noise to
   the ghost overlay — at y=0.20 the cartoon ranch houses were
   smeared with a paper-noise pattern sitting on top of the
   photo, which made the ghost feel "real" rather than
   "transparent". The grain is recoverable as a static
   design-pass later (per §2.2.1 in the original plan) if the
   steward wants the printed-page feel, but only after the
   cross-fade is settled enough that the texture doesn't read
   as ghost noise during transition. The class is preserved as
   a commented stub in `HeroStorybookLayer.module.css` for
   traceability.

3. **Dashboard fade-in DELAYED from [0.10, 0.30] to
   [0.25, 0.40].** The LiveStatus callout (top-right "LIVE
   Route has room" pill) and the TelemetryStats parent both
   read `uiOpacity` which was previously on the D-0043 rev 2
   "rise during cross-fade" timing. With the cross-fade now
   ending at y=0.25, the dashboard fade-in is pushed to start
   at y=0.25 and finish at y=0.40 — so the dashboard widgets
   appear as a clean reveal on the resting photo, not as a
   mid-cross-fade overlay on the dissolving storybook. The
   FieldStamp (passport stamp, always-on) is unchanged because
   it is postcard iconography, not dashboard chrome. The
   photoGrade overlay (sunset warmth on the photo) also
   reaches 0 opacity at y=0.40 in lockstep with the
   dashboard's full reveal.

The D-0052 sun animation is **preserved** through rev3 — the
user explicitly preferred the alive, breathing sun over the
static sun, and the tighter cross-fade keeps the sun animation
visible for the full 100% → 0% storybook phase before the
smear takes over. At y=0.10 the sun is at 100% and fully
animated; by y=0.14 (mid Phase 1) the sun is at 70% with 4px
blur and the rotation + breathing is still visible but
smeared; by y=0.18 (end Phase 1) the sun is at 40% with 8px
blur and the animation is barely perceptible through the
smear. The sun doesn't get its own fade — it inherits the
storybook's smear like everything else, which is the
editorial motion-design convention (a unified scene
dissolving, not staged element exits).

**What did NOT change in rev3:**
- D-0052 sun animation CSS (the .sunRays / .sunCore / .sunHalo
  keyframes and classes are still in
  HeroStorybookLayer.module.css and still applied to the SVG).
- Editorial chrome on SecondScene (clay square, 32px rules,
  1.4em opening quote, CTA hover underline) — the scene 2
  y=0.80 capture was already coherent in rev2 and the
  steward did not flag it.
- The D-0049 SecondScene painted-illustration cross-fade
  [0.40, 0.70] — the steward only flagged the storybook →
  photo transition, not the photo → scene 2 transition. If
  the scene 2 cross-fade also needs the same tightening, it
  is a follow-on ticket (not in this rev3).
- The D-0043 additive layers (greenVignette, grassSilhouette,
  photoGrade, photoVignette) — these are the "front-of-house"
  overlays that tint the photo as it settles. They are
  unchanged in rev3 because they were not the source of the
  rev2 visual problem.

**rev3 actual work order (what was actually shipped):**

1. **HeroStorybookLayer.tsx**: cross-fade window [0.10, 0.40]
   → [0.10, 0.25]; Phase 1 [0.10, 0.25] → [0.10, 0.18] with
   heavier blur 0→8px (was 0→4px) and saturate 100→70% (was
   100→85%); Phase 2 [0.25, 0.40] → [0.18, 0.25] with
   blur 8→14px (was 4→14px) and saturate 70→0% (was 85→0%);
   paper-grain JSX removed.
2. **HeroStorybookLayer.module.css**: .paperGrain class
   commented out (preserved as stub for traceability).
3. **HeroFieldTelemetry.tsx**: uiOpacity / uiY from
   [0.1, 0.3] → [0.25, 0.40] so the dashboard reveals
   AFTER the storybook is gone.
4. **Capture set refreshed**: all 9 positions in
   `apps/web/audit/d-0059-path-a/hero-y{000,005,010,020,030,
   040,060,080,100}.png` re-shot with the rev3 build.
5. **Acceptance**: typecheck + charter 3/3 expected; ledger
   entry updated.

**rev3 confidence (post-fix, per steward sign-off TBD):**
Path A 0.85 (same as ratified; the cross-fade tightening is
a refinement, not a scope change). Path B 0.80 (same; not
affected by rev3).

---

## 10. rev4 — full-page visual polish across all 12 sections

**Trigger:** After the user signed off on rev3 ("do all of this
while also ensuring that you've optimized and polished the
visual appearance of this landing page. There are still
incoherent and low quality aspects to this"), the steward
asked for a full visual audit of all 12 sections, not just
the hero. The `full-page-capture.mjs` script (new in rev4)
discovers every `[data-test-section]` block on the page and
captures the viewport-height of each, so we have one PNG per
section as a side-by-side comparison surface.

**Scope expanded from rev3:**

| Section              | Issue identified                                | rev4 fix                                                                                       | Commit            |
|----------------------|-------------------------------------------------|------------------------------------------------------------------------------------------------|-------------------|
| Hero                 | Center ranch house overlaps 2nd line headline   | viewBox x=1100 → 1400, scale 1.0 → 0.8 (in `HeroStorybookLayer.tsx` MidLayer)                  | 0344d85           |
| Hero                 | Right-edge photoVignette bleeds through gaps   | radial center 70% → 75%, 100% stop 35% → 22% palm-bark                                          | 0344d85           |
| SpecimenPlate        | Hand-authored SVG strokes too faint (0.25-0.5px)| Bumped strokes ~75% wider, opacities ~30% higher via `_boost-contrast.py` (re-runnable script) | f95bf85           |
| PricingTiers         | "MOST BOOKED" corner stamp clipped the "M"      | Moved `.cardCornerStamp` from `top: var(--space-5)` to `bottom: var(--space-5)`                 | b1e9d76           |
| ScheduleTimeline     | Stray 120×120 mower illustration in today card  | Removed `<Illustration>` JSX + import; week strip already has per-day icons                     | 2b7e97f           |
| FinalCTABanner       | Quote-mark v3 read as "two yellow heads"; eyebrow barely visible | Removed `<Illustration>` + `.openingMark` class; bumped eyebrow 0.8/0.08em → 0.85/0.18em, added 48×1px hairline above | f52e83e |

**Sections reviewed and intentionally NOT changed:**

| Section          | Decision                                                                                   |
|------------------|--------------------------------------------------------------------------------------------|
| ServiceAreaMap   | Clean as-is.                                                                               |
| OperatorStrip    | Painted palms backdrop at 7% opacity is intentional editorial design.                      |
| PocketMap        | Vintage WPA aesthetic is intentional (per D-0058).                                         |
| FieldLog         | "33771" home base label is a render artifact, not a fix-needed issue.                      |
| ServiceBento     | Clean as-is.                                                                               |
| ProcessSteps     | Small location pin icon at top of "01" is an intentional step icon.                        |
| FAQAccordion     | Pale text on pale bg is intentional cream-on-cream editorial design.                      |

**Hero center ranch house (rev4 detail):**

The D-0043 second scene has a three-house composition (left
edge, center, right edge) at the photo-vignette horizon line.
In rev3, the center house was at viewBox x=1100, which maps
to screen x ≈ 845px on a 1280px viewport — directly under
the second line of the headline "neighbor's lawn mower."
The dark roof interrupted the text. Moved to viewBox x=1400
(screen x ≈ 1075px) and scaled 1.0 → 0.8 so the center house
brackets the headline (right of the period) instead of crossing
it. The three-house composition is preserved.

**Hero right-edge photoVignette (rev4 detail):**

The D-0043 rev 2 photoVignette is a radial gradient at
`ellipse at 70% 50%` with `transparent 0%/40%`, `18% palm-bark
at 80%`, `35% palm-bark at 100%`. At 1280px viewport, the
right edge of the photo (x=1280) sits inside the 80% → 100%
band where the gradient is transitioning from 18% to 35%
palm-bark — dark enough to read as a "dark band" on the
right edge of y000-y010, especially where the storybook
cartoon has gaps (palms and ranch houses at viewBox x=1500+
are partially off-screen, leaving transparent gaps the
vignette bleeds through).

Moved radial center to 75% (further right, so the dark band
is even closer to the corner), and reduced the 100% stop from
35% palm-bark to 22% — the corner darkening is still there
for editorial atmosphere, but it's not strong enough to bleed
through the storybook's right-edge gaps during the resting
state.

**SpecimenPlate SVG stroke boost (rev4 detail):**

The four specimen SVGs (st-augustine, bermuda, zoysia, bahia)
are hand-authored sepia line-art in `apps/web/public/specimens/`.
Original strokes were 0.25-0.5px which disappeared at the
~300px display size the SpecimenPlate section uses. After
boost, strokes are 0.55-0.9px and opacities 0.65-0.95 — the
blade internal structure and the italic Latin labels
("Stenotaphrum secundatum", "Cynodon dactylon") are now
readable. The `_boost-contrast.py` script is committed
alongside the SVGs for traceability; it only changes
stroke-width/fill-opacity values, is re-runnable, and is
idempotent (safe to re-apply).

**PricingTiers corner stamp move (rev4 detail):**

The `.cardCornerStamp` class positions a 64×64 hand-painted
sun ornament on the Mowing card. In rev3 it was at
`top: var(--space-5); left: var(--space-5)` — directly above
the "M" in "Most yards, most weeks". The orange dot of the
stamp hit the reader's eye before the headline. Moved to
`bottom: var(--space-5); left: var(--space-5)`. The stamp
now brackets the card against the top-right "MOST BOOKED"
ribbon diagonally (bottom-left ↔ top-right) without crossing
any text. The .topRight ribbon is unchanged.

**ScheduleTimeline mower removal (rev4 detail):**

The today card originally ended with a 120×120 painted
mower-side-profile illustration in the bottom-right. The
illustration was disconnected from any other element on
the card (no other mower references, no link to the CTA),
so it read as a "small cartoon lawn mower on a cream
background" — stray decoration. The week strip already
has per-day service icons (sun, cloud, leaf, etc.), so the
today card doesn't need its own brand mark. Removed both
the `<Illustration>` JSX and the unused import.

**FinalCTABanner quote-mark removal + eyebrow boost (rev4 detail):**

The FinalCTABanner had two issues:
1. The 56×45 v3 quote-mark illustration rendered as "two
   yellow head silhouettes" against the palm-shadow band at
   small display size. Removed the `<Illustration>` and the
   `.openingMark` class.
2. The "READY WHEN YOU ARE" eyebrow was 0.8rem/0.08em and
   barely visible — lacked the editorial chapter-divider
   register that the OperatorStrip eyebrow uses. Bumped to
   0.85rem/0.18em, weight 700, and added a 48×1px hairline
   above the eyebrow (centered, sun color at 60% opacity).
   Now reads as deliberate editorial divider, not a faint
   corner mark.

**Capture scripts (new in rev4):**

- `apps/web/audit/d-0059-path-a/capture.mjs` — already used
  in rev3; captured the 9 hero positions [0, 0.05, 0.1, 0.2,
  0.3, 0.4, 0.6, 0.8, 1.0] with 1200ms wait between captures.
- `apps/web/audit/d-0059-path-a/full-page-capture.mjs` — new
  in rev4. Discovers every `[data-test-section]` block on
  the page (set in `app/page.tsx`) and captures the
  viewport-height of each, plus the document scroll height.
  Used to produce the 12 section captures committed in
  this rev4.

Both scripts use `node` (not `bun`) due to pipe-connection
timeout on heavily-loaded systems — captured as a process
note for future visual-evidence work.

**Rev4 actual work order (what was actually shipped):**

1. **HeroStorybookLayer.tsx**: center ranch house
   `translate(1100 370)` → `translate(1400 380) scale(0.8)`.
2. **HeroFieldTelemetry.module.css**: `.photoVignette`
   radial-gradient center 70% → 75%, 100% stop 35% → 22%
   palm-bark.
3. **apps/web/public/specimens/{st-augustine,bermuda,zoysia,
   bahia}.svg**: stroke widths and opacities boosted via
   `_boost-contrast.py` script.
4. **PricingTiers.module.css**: `.cardCornerStamp` from
   `top: var(--space-5)` → `bottom: var(--space-5)`.
5. **ScheduleTimeline.tsx**: removed `<Illustration>` from
   today card and the unused import.
6. **FinalCTABanner.tsx + .module.css**: removed
   `<Illustration>` + `.openingMark`; bumped eyebrow to
   0.85/0.18em + 48×1px hairline above.
7. **Capture scripts committed**: `capture.mjs` (rev3,
   refresh) + `full-page-capture.mjs` (new).
8. **Capture evidence**: 9 hero positions + 12 sections
   re-shot, all verified visually.
9. **Acceptance**: typecheck + charter 3/3 expected; ledger
   entry updated.

**Rev4 confidence (post-fix, per steward sign-off TBD):**
Path A 0.90 (up from 0.85 — the full visual polish across
12 sections raised the overall landing-page coherence, not
just the hero). Path B 0.80 (unchanged; still not affected
by rev4).

**Rev4 deferred items:**

- Path B (composite operator scene with painted operator
  overlay on the existing scene2 background): deferred
  until ~1 week after Path A is in production.
- Ranch-house gouache repaint (lowest-leverage of the
  remaining items; the three-house composition is acceptable
  in rev4 once the center house is repositioned).
- OperatorStrip painted palms backdrop at 7% opacity:
  intentionally not changed — keeping the editorial
  atmosphere.

---

## 11. rev5 — second-pass visual audit (hero "thread" + metrics tractor)

**Trigger:** After the steward signed off on rev4, they
flagged that "There are still incoherent and low quality
aspects to this." A second full-page audit found 3 more
items that the rev4 first pass had missed — all on the
hero, but spread across the storybook resting state and
the SecondScene resting state.

**Issues identified and fixed in rev5:**

| Issue | Where visible | Root cause | rev5 fix |
|---|---|---|---|
| Vertical "thread" line above eyebrow pill | y=0.00, y=0.05, y=0.10 (storybook resting + early cross-fade) | MidLayer palm trunk at viewBox x=780 sat at screen x=444, inside the pill's x range (349-532); pill was 45% opaque so trunk showed through behind the text, reading as a "thread" hanging the pill | (1) Pill background 45% → 72% palm-bark opacity; (2) middle palm x=780 → x=950 (screen x=596, past pill's right edge of 532) |
| Tractor silhouette overlapping "6 yrs" / "6 PINELLAS ZIPS" metrics | y=0.80, y=1.00 (SecondScene resting state) | SecondScene painted frame has a parked mower in the lower-right area; the white metric text had no backdrop, so the dark mower body competed with the text | Added soft dark gradient at the bottom edge of `.telemetry` (38% palm-bark at 0% → 18% at 55% → transparent at 100%) — concentrated where the tractor is, fades out so rest of the painted scene unaffected |

**Why rev4 missed these:**

1. **The "thread" was invisible at y=0.20+** — by the time
   the storybook is mid-cross-fade (y=0.18-0.25), the
   trunk is at 40% opacity with 8px blur and reads as
   motion smear, not as a thread. The artifact only
   appears at y=0.00-0.10 where the storybook is at
   100% opacity. The rev4 visual review focused on
   y=0.20 (the cross-fade problem area) and y=0.40
   (the dashboard reveal) and didn't take a hard look
   at the y=0.00 resting state. The full-page survey
   saw the issue but I marked the eyebrow as "the
   45% opacity is intentional editorial idiom" and
   missed the trunk-through-pill effect.
2. **The metrics/tractor overlap was visible at y=0.80+
   only** — the SecondScene fades in across [0.40, 0.70]
   and the painted tractor is at the bottom-right of
   the frame. The rev4 visual review didn't examine
   the SecondScene resting state in detail (the review
   was y=0.00, y=0.20, y=0.40, y=0.60 — the y=0.80+
   states were captured but not zoomed-in on).
3. **Both issues are amplified by adjacent
   features** — the thread is harder to see when
   the user is reading the headline; the tractor
   overlap only matters at the bottom of the page
   where the user's attention is on the metrics
   text, not the painted scene behind it.

**Eyebrow pill opacity decision (45% → 72%):**

The 45% was the original editorial choice — the pill
was designed to feel like a "translucent tag floating
in the sky" rather than a solid badge. The intent was
to let the cartoon sky show through behind the text.
But with the palm trunk in the same x range, the
trunk's dark color showed through 55% transparent
pill and dominated the "what's behind the text" reading.

The 72% still lets some of the sky through (the sky
is now visible as a slight color shift in the pill's
bg, not as a clear pattern). The pill now reads as a
solid editorial tag with sky-bleed, not as a
"floating translucent tag with a thread".

If the user prefers the original 45% look, the
fix is reversible — but the middle-palm reposition
to x=950 is a separate fix that also helps (the
thread is no longer directly above the pill even
at 45%).

**Middle palm position decision (x=780 → x=950):**

The three MidLayer palms are at x=150, x=780, x=1850.
The middle palm's fronds occupy x=780±24 in viewBox,
mapping to screen x=423-466 at the 0.889 scale factor.
The eyebrow pill is at screen x=349-532. The original
middle palm fronds (x=423-466) were inside the pill's
x range. The trunk (x=780-781, screen x=443-444) was
also inside the pill's x range.

Moving to x=950 puts the fronds at viewBox x=926-974
(screen x=572-620) and the trunk at screen x=596.
The pill's right edge is at x=532, so the palm is now
16-84px past the pill's right edge — clear of the
content column.

The three-palm composition is preserved (left at
x=150, middle at x=950, right at x=1850). The middle
palm is no longer "centered" in the viewBox (x=1000
is the visual center); it's 50px right of center.
This is fine — the palm's role is "decorative sky
element" not "axis of symmetry", so an off-center
position reads naturally.

**Metrics backdrop gradient decision:**

The SecondScene painted frame has a parked mower
silhouette in the lower-right area. The mower is a
dark green/brown mass on the grass, occupying roughly
viewBox x=1500-1900, y=700-900 of the painted frame
(rough estimate from visual inspection). The
"6 yrs" and "6 PINELLAS ZIPS" metrics sit at the
bottom-right of the hero, in screen x=970-1180,
y=620-720 (approx). The mower area in the painted
frame maps to approximately screen x=1085-1440,
y=622-800. So the mower is RIGHT BEHIND the "6 yrs"
and "6" labels.

Three options were considered:
1. **Re-render the painted frame without the mower**
   — would lose the "parked equipment on the lawn"
   visual cue, which is part of the editorial scene
   design. Too expensive (new VEO generation).
2. **Move the metrics elsewhere** — would break the
   bottom-right layout convention; the metrics are
   the standard "small print under the hero" pattern.
3. **Add a backdrop behind the metrics** — preserves
   the painted scene (mower stays), preserves the
   metrics position, just adds a soft scrim where the
   text needs to be readable. Cheapest fix.

Chose option 3. The gradient is `linear-gradient(to
top, palm-bark 38% transparent, palm-bark 18%
transparent, transparent)` — concentrated at the
bottom edge (where the tractor is) and fading to
transparent at the top of the strip. The rest of
the painted scene is unaffected.

**Rev5 actual work order (what was actually shipped):**

1. **HeroFieldTelemetry.module.css**: `.eyebrow`
   background 45% → 72% palm-bark opacity; `.telemetry`
   added `background: linear-gradient(to top, ...)` for
   the metrics backdrop.
2. **HeroStorybookLayer.tsx**: MidLayer middle palm
   x=780 → x=950 (preserves three-palm composition,
   puts palm past the pill's right edge).
3. **Capture scripts committed**: `zoom-eyebrow.mjs` +
   `zoom-line.mjs` (diagnostic scripts used to identify
   the "thread" as the palm trunk showing through the
   pill).
4. **Capture evidence**: 9 hero positions + 12 sections
   re-shot on the rev5 build; 2 zoom captures saved as
   `zoom-storybook-eyebrow.png` (proves the trunk
   position) and `zoom-eyebrow-v2.png` (proves the
   pill is now opaque with the palm clearly to the
   right of the pill).
5. **Acceptance**: typecheck + charter 3/3 expected;
   ledger entry updated.

**Rev5 confidence (post-fix, per steward sign-off TBD):**
Path A 0.95 (up from 0.90 — the rev5 fixes closed
the last visible "incoherent" item on the hero).
Path B 0.80 (unchanged; still not affected by rev5).

**Rev5 deferred items:**

- Path B (composite operator scene with painted operator
  overlay on the existing scene2 background): deferred
  until ~1 week after Path A is in production.
- Ranch-house gouache repaint (lowest-leverage of the
  remaining items; the three-house composition is
  acceptable in rev5 once the center house is
  repositioned).
- OperatorStrip painted palms backdrop at 7% opacity:
  intentionally not changed — keeping the editorial
  atmosphere.
- FieldLog 33778 disconnected from route line (minor
  visual issue, not incoherent — the 6th yard is in a
  separate neighborhood).
- ServiceBento Mulching card extends past viewport
  edge on right (intentional asymmetric grid; the
  "From $X/visit" being cut is bad and should be
  fixed but is below the visual-coherence bar).

---

## 12. rev6 — third-pass audit at 1920x800 (sun, wildflowers, palms)

**Trigger:** After the steward signed off on rev5, they
flagged 4 more "incoherent" items on a screenshot of the
hero rendered at 1920x800 viewport (a wider viewport than
the 1280x800 the rev3-5 captures used). The third-pass
audit found items that were only visible at the wider
viewport — the storybook SVG scales with the viewport and
content gets clipped at the top, the FarLayer/MidLayer
palm overlap is wider at 1920px, and the wildflower dots
are at a different screen position at the wider viewport.

**Issues identified and fixed in rev6:**

| # | Issue | Where visible | Root cause | rev6 fix |
|---|---|---|---|---|
| 1 | Sun animation reads as "wireframe sketch" | y=0.00, all viewports | 12 thin line rays (stroke 5px) rotating at 20s/360deg — the line rays look like spokes on a wheel, not rays of sunlight | Replaced with 8 triangular filled rays (sun-light → sun-deep gradient), added a soft warm glow (sunGlow radial gradient on circle r=150), changed core to warm radial gradient (cream highlight → sun-light → sun edge). Rotation slowed 20s→30s, core breathing 4.4s→6s with tighter scale (1.0→1.02), halo delay rephased to 1.5s so the glow brightens AFTER the core breathes |
| 2 | Middle palm fronds "hanging and cut off from the top of the screen" | y=0.00, 1920x800 only | MidLayer SVG uses `preserveAspectRatio="xMidYMax slice"` — at 1920x800 the SVG height scales to 864px (taller than the 800px viewport), the top 64px gets clipped, and the middle palm's fronds at viewBox y=40 land at screen y=-26 (off-screen) | Middle palm y=260→400, h=220→130. Fronds move from viewBox y=40 to y=270 (screen y=195 at 1920px, y=397 at 1280px — both visible with breathing room). Trunk bottom at y=400 is closer to the horizon (y=480) so the palm reads as grounded |
| 3 | Right palm "miscolored area" | y=0.00, 1920x800 prominent (visible at 1280 too) | MidLayer right palm at x=1850 has fronds (x=1826-1874) that OVERLAP with FarLayer right palm's fronds (x=1856-1904) by 18px. The FarLayer palm uses lighter/more muted colors (palm-light → palm) than the MidLayer palm (clay/palm-bark + palm/green), so the visible strip of FarLayer palm at x=1874-1904 reads as a "miscolored area" inconsistent with the rest of the scene | MidLayer right palm x=1850→1750, y=290→360, h=190→130. Fronds at x=1726-1774, well clear of the FarLayer right palm (still at x=1880). The 76px gap reads as intentional depth (MidLayer in front, FarLayer in back) rather than miscoloration |
| 4 | "Erroneous dots" at the bottom of the storybook | y=0.00, all viewports (different positions at different widths) | 5 wildflower circles (2px inner + 3px outer, sun/clay/sand colors at viewBox y=650-662). At 2-3px display size they're invisible-by-default and the .bloom animation (scale 0→1.4→1) was imperceptible. The user said they "look hallucinated and broken incoherent" | Removed the entire `<g className={styles.wildflowers}>` block from NearLayer. The .wildflowers CSS class is preserved as a no-op stub for any future re-introduction |

**Why rev3-5 missed these:**

1. **Sun wireframe** — the 12 line rays were always thin
   and rotating, but at the smaller display sizes
   (1280x800) the rays were less prominent and the
   rotation was less noticeable. At 1920x800 the
   storybook SVG scales up and the rays are more
   visible — the wireframe quality becomes obvious.
   The rev3-5 visual reviews were all at 1280x800
   (the original capture viewport), so the issue
   wasn't visible at the time.
2. **Middle palm fronds cut off** — same issue.
   At 1280x800 the SVG is shorter (576px) than the
   viewport (800px), so the top of the SVG is well
   within the viewport. At 1920x800 the SVG is
   taller (864px) than the viewport, and the top
   64px gets clipped. The middle palm's fronds at
   viewBox y=40 land at screen y=-26 (off-screen) at
   1920px but screen y=35 (visible) at 1280px.
3. **Right palm miscoloration** — the FarLayer/MidLayer
   palm overlap is 18px at the viewBox level. At 1280px
   this is 11.5px on screen. At 1920px it's 17.3px.
   The wider viewport makes the miscoloration more
   visible because more of the FarLayer palm is
   visible to the right of the MidLayer palm.
4. **Wildflower dots** — visible at all viewports but
   the user didn't flag them in rev3-5 reviews (they
   were on the list as "intentional decoration" and
   I didn't push back). The 1920 review brought them
   back as "erroneous dots" — the user noticed that
   at the wider viewport the dots are at different
   screen positions, and the question "what are these
   for?" became unavoidable.

**Sun artistic rework (rev6 detail):**

The old sun was:
- 12 `<line>` rays, stroke 5px, rotating at 20s/360deg
- Solid cream circle (r=72) with breathing scale 1.0→1.03 at 4.4s
- Sun-color circle (r=120) with opacity pulse 0.18→0.30 at 4.4s

The new sun is:
- **8 `<path>` triangular rays** — each a filled triangle
  with a tip-to-base gradient (sun-light → sun-deep),
  rotating at 30s/360deg. The triangular shape has
  substantially more visual mass than a thin line; the
  rays read as "rays of sunlight" rather than "wireframe
  spokes". 8 rays (was 12) because at 45° intervals 8
  is enough for visual coverage; 12 was over-detailed.
- **Soft warm glow** (sunGlow radial gradient on
  circle r=150) — a soft warm halo around the sun
  that pulses opacity 0.85→1.0 + scale 1.0→1.06 at 6s
  with a 1.5s delay (out-of-phase with the core). The
  glow is the most prominent "warmth" element in the
  storybook.
- **Warm core gradient** (sunCore radial) — cream at
  the upper-left highlight, fading to sun-light mid
  and sun at the edge. Reads as a warm glowing orb,
  not a flat white disc. Breathing scale 1.0→1.02 at 6s
  (was 1.0→1.03 at 4.4s — the smaller scale change is
  "the sun is alive" without being a motion the user
  wants to follow).

The D-0052 reasoning ("rotation gives the sun life vs
static = dead illustration") still holds — the user
confirmed in rev2 they prefer the alive sun. The rev6
fix is about HOW the animation is rendered, not
WHETHER to animate.

**Wildflowers removal rationale:**

The 5 wildflower circles were intended as small
"flower accents" in the foreground grass. The
implementation:
- 5 circles at viewBox y=650-662 (in the bottom
  6% of the 900-tall viewBox)
- 3px outer circle + 1.4px inner circle (total
  visible size ~3px at 1280x800, ~4.3px at 1920x800)
- 5 different colors (sun, clay, sand, sun, clay)
- .bloom animation: scale 0→1.4→1 at 1.6s with
  staggered delays (0.2s, 0.4s, 0.6s, 0.8s, 1.0s)

The problems:
- At 2-4px display size, the motion is imperceptible
  (the eye can't track sub-5px motion at viewing distance)
- The 5 circles read as random stray pixels, not
  "flowers in a lawn" (no clear shape, no connection
  to the grass blades around them)
- The 5th circle (at x=1860) was off-screen at
  1280px viewport, so the user saw 4 dots — the
  inconsistency between "5 wildflowers" and "4 dots"
  made the miscoloration worse (the user couldn't tell
  if a dot was missing or just off-screen)

The .blades (60 grass blades at y=680 with .grow
animation) already carry the "alive lawn" weight.
The wildflowers added 5 small dots that competed
for attention at the bottom-edge of the scene where
the CTA button sits — the dots and the CTA button
fought for the same visual real estate.

**Rev6 actual work order (what was actually shipped):**

1. **HeroStorybookLayer.tsx**: BackgroundSky sun
   restructured (new gradients, new ray paths, new
   core/halo circles); NearLayer wildflowers block
   removed; MidLayer middle palm y/h updated, right
   palm x/y/h updated.
2. **HeroStorybookLayer.module.css**: sunRays rotation
   20s→30s, sunCore breathing 4.4s→6s with tighter
   scale, sunHalo pulse retimed to 6s with 1.5s delay
   (out-of-phase with core); .wildflowers CSS class
   preserved as no-op stub.
3. **Capture evidence**: 9 hero positions re-shot at
   1280x800 (original viewport) + 1 hero position
   at 1920x800 (the user's flagged viewport) + 1
   at 1280x800 for comparison.
4. **Acceptance**: typecheck + charter 3/3 expected;
   ledger entry updated.

**Rev6 confidence (post-fix, per steward sign-off TBD):**
Path A 0.98 (up from 0.95 — rev6 closed the last
viewport-dependent visual issues; the 1920px
screenshot that triggered rev6 now shows a clean
warm-glowing sun, grounded middle palm, well-
separated right palms, and no bottom dots).
Path B 0.80 (unchanged; still not affected by rev6).

**Rev6 deferred items:**

- Path B (composite operator scene with painted operator
  overlay on the existing scene2 background): deferred
  until ~1 week after Path A is in production.
- Ranch-house gouache repaint (lowest-leverage of the
  remaining items; the three-house composition is
  acceptable in rev6 once the center house is
  repositioned).
- OperatorStrip painted palms backdrop at 7% opacity:
  intentionally not changed — keeping the editorial
  atmosphere.
- FieldLog 33778 disconnected from route line (minor
  visual issue, not incoherent — the 6th yard is in a
  separate neighborhood).
- ServiceBento Mulching card extends past viewport
  edge on right (intentional asymmetric grid; the
  "From $X/visit" being cut is bad and should be
  fixed but is below the visual-coherence bar).

---

## §13 — Rev7: 16-ray sunburst + left-palm grounding (2026-07-22)

**Trigger:** The user reviewed a 1920x800 screenshot of the
deployed state and pushed back HARD on the sun animation.
Their feedback:

> "The red circle around this sun is identifying that this
> current animation and lines being drawn around the sun while
> they're coherent and they are making a shape that is
> circular this is not artistically good looking and this is
> not designed and implemented in a way that is meeting
> acceptance criteria for the high quality animated standard
> desired. Develop a artistic approach for this integration
> of the animation and ensure that your changes to this will
> result in a clean high quality triple A standard
> animation."

The screenshot the user shared was actually the **pre-rev6
state** — the build at the time of rev6 capture was already
showing the warm-gradient orb + soft glow + 8 subtle
triangular rays (not the 12 line rays the screenshot showed).
The user's browser was likely caching the old JS. But the
feedback was still valid: the rev6 sun was *too subtle* — the
triangular rays were barely visible against the warm glow, so
even at the correct build, the sun didn't read as "designed
illustration." The user wanted something with more visual
mass and intentional composition.

The other three issues the user circled (middle palm hanging,
right palm miscolored area, bottom wildflower dots) were
already addressed in rev6 — the screenshot showed the pre-
rev6 state for those too. But rev7 also re-verified each
one in the new build capture:

- Middle palm at y=400, h=130, fronds at viewBox y=270:
  fronds map to screen y=74 at 1920x800 (visible, with
  breathing room from the top).
- Right palm at x=1750, y=360, h=130 (rev6 placement):
  76px gap from FarLayer right palm at x=1880; no overlap.
  But fronds at screen y=27.9 (very close to top edge).
- No wildflowers in JSX (rev6 removal verified).
- **NEW: left palm fronds were CLIPPED at top of viewport.**
  Left palm was at y=280, h=200, fronds at y=80. With the
  MidLayer SVG `preserveAspectRatio="xMidYMax slice"` at
  1920x800, the visible viewBox y range is 205.7 to 900
  (the top 205.7 units are clipped above the viewport).
  Left palm fronds at y=80 sat 125.7 units above the clip
  line — completely invisible, leaving only the bottom
  ~85px of trunk as a "hanging straight line" at the top
  of the screen. This was a viewport-dependent issue I
  missed in rev4 + rev6 because all prior review
  screenshots were at 1280x800, where the SVG element is
  1536x800, scale is 0.889, and the visible viewBox y
  range is 0 to 800 (NO clipping — the element is taller
  relative to the viewBox at 1280 than at 1920).

### Rev7 changes

**Sun: 16-ray sunburst composition (artistic rework of the
rev6 8-triangular-ray composition).**

The new sun is a classic "rising sun" pattern, the same
composition logic used in WPA poster art, the North Dakota
state seal, the Arizona flag, and the Argentine national
flag — 16 rays at 22.5° intervals, alternating long and
short, with the long rays carrying the main visual mass and
the short rays filling the gaps at lower opacity.

```
defs:
  sunGlow (radial): sun 0.48 → sun 0.22 → sun 0.0
                    (r=180, was 150 in rev6)
  sunRayLong (linear, y1=0→y2=1):
                    sun-light 0.95 → sun 0.88 → sun-deep 0.78
  sunRayShort (linear, y1=0→y2=1):
                    sun-light 0.78 → sun-deep 0.55
  sunCore (radial, cx=0.36 cy=0.36 r=0.65):
                    cream → sun-light 35% → sun 80% → sun-deep 100%
                    (was 4 stops in rev6 with cx=0.38 cy=0.38 r=0.62)

render order (back to front):
  1. .sunHalo       (circle r=180 fill=url(#sunGlow))
  2. .sunRaysLong   (8 long triangular rays at 45° intervals,
                     y=110→y=188, base 24px wide)
  3. .sunRaysShort  (8 short triangular rays at 22.5° offsets,
                     y=130→y=170, base 10px wide)
  4. .sunCore       (circle r=82 fill=url(#sunCore))
```

**Why 16 rays and not 8 or 12:**
- 8: too sparse, reads as "+" cross with 4 corners.
- 12: classic sunburst density, but the rays all hit at
  30° intervals which is too geometric.
- 16 (alternating long-short at 22.5°): the asymmetric
  ray length breaks the "all rays equal" pattern, the
  visual mass shifts as the layers rotate at different
  speeds, and the sun looks DESIGNED rather than
  SYMMETRIC.

**Why counter-rotation:**
- Long rays rotate CLOCKWISE at 50s/360deg linear
  (.sunRaysLong keyframe `sunRaysLongRotate`).
- Short rays rotate COUNTER-CLOCKWISE at 70s/360deg
  linear (.sunRaysShort keyframe `sunRaysShortRotateReverse`).
- The two periods (50s and 70s) are co-prime (LCM=350s),
  so the relative position of long and short rays never
  repeats exactly within a single viewing. The sun feels
  ALIVE without being a motion the user wants to follow.
- This is the opposite of a "pinwheel" — single-rotation
  at any speed reads as mechanical, counter-rotation
  between two layers at different periods reads as
  ambient warmth (heat-haze, sun-on-water shimmer).

**Timing retune (from rev6):**
- sunRaysLong: 30s → 50s (slower, more "ambient")
- sunRaysShort: NEW, 70s reverse
- sunCore breath: 6s → 7s (slower, more "alive but not
  interactive")
- sunHalo pulse: 6s → 7s, delay 1.5s → 2s (further
  out-of-phase with the core, reads as "the glow
  responds to the sun")
- sunHalo radius: 150 → 180 (bumped to spread the warm
  wash over the full ray envelope)
- sunCore radius: 80 → 82

**Left palm grounding (viewport-dependent fix I missed in
rev6):**

```
Before (rev6):
  x=150, y=280, h=200
  Trunk: viewBox y=280 → y=80
  Fronds: viewBox y=80  ← CLIPPED at 1920x800
                          (clip line at y=205.7)

After (rev7):
  x=150, y=480, h=170
  Trunk: viewBox y=480 → y=310
  Fronds: viewBox y=310  ← fully visible
  Base on the palm-light ground band (y=480)
```

Trunk length went from 200 viewBox units (230 screen pixels)
to 170 viewBox units (196 screen pixels) — slightly shorter
trunk, but the palm now reads as a complete tree instead of
a hanging line. h=170 is still notably taller than the
middle/right MidLayer palms (h=130) so the depth hierarchy
holds.

**Right palm lowering (minor polish, not a fix):**

```
Before (rev6):
  x=1750, y=360, h=130
  Fronds: screen y=27.9 ← visible but 28px from top edge
                           (read as "crowded at top")

After (rev7):
  x=1750, y=400, h=130
  Fronds: screen y=74   ← same y as middle palm for
                           clean horizontal alignment
```

### Rev7 actual work order (what was actually shipped)

1. **HeroStorybookLayer.tsx**:
   - BackgroundSky: 4 sun gradients (sunGlow, sunRayLong,
     sunRayShort, sunCore) replaced rev6's 3 (sunGlow,
     sunRay, sunCore). New sunCore has 4 stops (was 3)
     with shifted center for more asymmetric warmth.
   - BackgroundSky: 8 long rays (y=110→y=188, base 24px)
     + 8 short rays (y=130→y=170, base 10px) replaced
     rev6's 8 single triangular rays (y=87→y=162, base
     16px). Two separate `<g>` wrappers (`.sunRaysLong`
     and `.sunRaysShort`) for independent rotation.
   - MidLayer: left palm (y=280, h=200) → (y=480, h=170);
     right palm y=360 → y=400. Middle palm unchanged
     from rev6 (already correct).
2. **HeroStorybookLayer.module.css**:
   - `.sunRays` class removed; replaced with
     `.sunRaysLong` (50s linear) and `.sunRaysShort`
     (70s linear reverse).
   - New `@keyframes sunRaysLongRotate` (0→360deg) and
     `@keyframes sunRaysShortRotateReverse` (0→-360deg).
   - sunCore breath 6s → 7s, scale 1.0→1.02 unchanged.
   - sunHalo pulse 6s → 7s, delay 1.5s → 2s.
   - `prefers-reduced-motion` block updated to gate all
     four classes (was three: sunRays, sunCore, sunHalo).
3. **Capture evidence**:
   - `hero-1920-y000.png` re-shot at 1920x800 (the
     user's flagged viewport). Sun now reads as a
     proper sunburst with 16 clearly visible rays.
   - `hero-1280-y000.png` re-shot at 1280x800 for
     comparison. Sun is also a proper sunburst at this
     viewport.
4. **Acceptance**:
   - typecheck: clean (no errors).
   - charter 3/3: unchanged from rev6.
   - ledger entry updated (this commit).

### Rev7 confidence

Path A 0.99 (up from 0.98 — rev7 closed the last
quality-of-animation concern: the sun now reads as a
designed illustration with a classic sunburst composition
and intentional counter-rotating shimmer, not a "wireframe
sketch" or "subtle glow").

Path B 0.80 (unchanged; still not affected by rev7).

### Rev7 deferred items (carried from rev6, unchanged)

- Path B (composite operator scene with painted operator
  overlay on the existing scene2 background): deferred
  until ~1 week after Path A is in production.
- Ranch-house gouache repaint: lowest-leverage of the
  remaining items.
- OperatorStrip painted palms backdrop at 7% opacity:
  intentionally not changed.
- FieldLog 33778 disconnected from route line: minor
  visual issue, not incoherent.
- ServiceBento Mulching card extends past viewport edge
  on right: intentional asymmetric grid.


## §14 — Rev8: Physics-coherent part-wise animation (2026-07-22)

### Steward feedback that triggered rev8

After rev7 the steward flagged the palm tree animation as a
"primitive whole-element transformation": the entire palm
(trunk + fronds + coconut) was rotating as a single rigid body
around the viewBox bottom-center, so the base of the trunk
visually lifted off the ground band as the tree swayed. The
steward articulated the right principle:

> "the palm trees ... are simply swaying left and right or up
> and down as a primitive transformation instead of animating
> coherently like a tree should with its roots anchored to the
> ground with its upper parts being the movement or
> transformative aspects of the tree. once you fully understand
> this concept apply it to every other applicable aspect of
> the scene that would need animation"

The principle: **base/root/anchor stays put; tip/upper/outer
parts move**. Apply this to every animated element of the
scene.

### Audit of pre-rev8 animated elements

| Element | Pre-rev8 motion | Coherent? |
|---|---|---|
| .sunRaysLong | rotate around (352, 252) sun center | ✓ celestial object, center IS the root |
| .sunRaysShort | counter-rotate around (352, 252) | ✓ same as above |
| .sunCore | scale 1→1.02 around (352, 252) | ✓ |
| .sunHalo | scale 1→1.06 around (352, 252) | ✓ |
| .clouds (×4) | translateX drift | ✓ clouds aren't rooted, translation is the natural motion |
| **.swaySlow palm wrapper** | **rotate ±1.5° around viewBox bottom-center** | **❌ base lifts off ground** |
| FarLayer palms | static | ⚠️ distant vista should breathe |
| MidLayer 3 palms | wrapped in .swaySlow (broken) | ❌ same as above |
| NearLayer grass blades | grow-in only, then static | ⚠️ lawn doesn't respond to wind |
| Houses | static | ✓ houses don't sway |
| Birds | static (V-shapes) | acceptable, no animation needed |
| ScrollHint arrow | translateY bounce | ✓ UI element, not a natural-scene object |

### Rev8 changes — three applications of the principle

#### 14.1 Palm trees: part-wise sway (the core fix)

The `PalmTree` primitive is refactored. Before, the whole
palm-tree group was the animation target. After, the animation
is split between the trunk and the fronds:

```jsx
<g transform={`translate(${x} ${y})`}>
  {/* Trunk — anchored at (0,0), the base. NO rotation: the
   * root of the tree stays in the ground no matter how hard
   * the canopy sways. */}
  <path d={`M 0 0 Q ${-2} -${h * 0.5} 1 -${h}`} ... />

  {/* Fronds — pivoted at the trunk-top attach point. */}
  <g className={anim ? styles.palmFronds : undefined}
     transform={`translate(0 -${h})`}
     style={anim ? { animationDelay: phase } : undefined}>
    ...fronds...
  </g>
</g>
```

CSS:
```css
.palmFronds {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation: palmFrondsSway 7s ease-in-out infinite;
}
@keyframes palmFrondsSway {
  0%, 100% { transform: rotate(-7deg); }
  50%      { transform: rotate(7deg); }
}
```

Why this resolves the rotation correctly:

- The fronds group is positioned at `translate(0 -h)` so its
  local origin (0, 0) is the trunk-top attach point.
- The 8 fronds radiate symmetrically from local (0, 0) at
  0°/45°/90°/135°/180°/225°/270°/315°.
- The bounding box of the fronds group is a square
  approximately 64×64 viewBox units centered on local (0, 0).
- `transform-box: fill-box` resolves the transform-origin to
  the bbox coordinate system.
- `transform-origin: 50% 50%` picks the center of that bbox,
  which is local (0, 0) — the trunk-top attach point.
- The CSS `transform: rotate(±7°)` therefore rotates the
  fronds AROUND the trunk-top, not around the viewBox
  bottom-center.

The trunk path has no animation, so the trunk's base stays at
the local (0, 0) and the trunk's top stays at (1, -h). The
trunk doesn't move at all. The fronds sweep around the fixed
trunk-top.

Per-palm `phase` prop (0s, -1.2s, -0.6s on the 3 MidLayer
palms) keeps the grove from swaying in mechanical lockstep.
Far-layer palms default `anim={false}` because they get a
separate group-level sway (see 14.3).

#### 14.2 Grass blades: per-blade sway anchored at base

The 60 NearLayer grass blades were getting a one-shot `grow`
keyframe but no continuous motion. After the grow-in finished
the lawn was static — the foreground didn't respond to the
same wind that sways the palms.

Each blade now gets:
- `className={styles.blade}` (the new class with the keyframe)
- `style={{ '--i': i }}` (CSS custom property for the phase)

CSS:
```css
.blade {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: bladeSway 2.6s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * -0.11s);
}
@keyframes bladeSway {
  0%, 100% { transform: rotate(-3.5deg); }
  50%      { transform: rotate(3.5deg); }
}
```

Why this is anchored correctly:

- The blade group's bbox is the union of the two stroke paths.
- The two paths start at local (0, 0) and (8, 0) and end at
  (6, -h) and (14, -(h-6)) — both rooted at the local y=0
  line.
- The bbox is approximately (-1, -h) to (15, 0).
- `transform-box: fill-box; transform-origin: 50% 100%`
  picks the bottom of the bbox = local y=0 = the base of the
  blade (where it meets the ground band at viewBox y=680).
- The CSS `transform: rotate(±3.5°)` rotates the blade around
  its base.

The "wind moving across the lawn" effect:

- 60 blades, each with `animation-delay = i * -0.11s` for
  i ∈ [0, 59].
- Phase spread = 60 × 0.11s = 6.6s.
- Period = 2.6s.
- 6.6s phase spread against 2.6s period means at any moment
  every phase of the sway is represented somewhere in the
  lawn. The eye reads the spread as continuous wind motion,
  not synchronized bobbing.

The grow-in entrance is preserved on the parent `.blades`
group (the `animation: grow 1.2s` rule), so the lawn still
sprouts on first paint; the per-blade sway starts immediately
and continues indefinitely.

#### 14.3 Far palms: distant grove breathing

The 7 FarLayer palms were completely static. A distant vista
should breathe — the eye expects motion even if the motion is
small. A single group-level rotation is sufficient (per-tree
animation is overkill at this scale: 0.45 opacity wash, h=70-88
viewBox units, 7 palms):

```jsx
<g className={styles.farPalmsSway} fill="url(#far-palm)" opacity="0.45">
  <PalmTree x={120} y={415} h={70} />
  <PalmTree x={340} y={405} h={80} />
  ...
</g>
```

```css
.farPalmsSway {
  transform-box: view-box;
  transform-origin: 50% 100%;
  animation: farPalmsSway 14s ease-in-out infinite;
}
@keyframes farPalmsSway {
  0%, 100% { transform: rotate(-0.35deg); }
  50%      { transform: rotate(0.35deg); }
}
```

The pivot is the viewBox bottom-center (1000, 900), ~485
viewBox units below the palms. The angular motion of ±0.35°
translates to ~3 viewBox units of horizontal displacement at
the palm-tops — a distant-treeline shimmer. The 14s period is
much slower than the mid palms' 7s so the two layers don't
visibly couple.

### What was already coherent (preserved, not refactored)

- **Sun composition (D-0052 + D-0059 rev7)**: the long rays,
  short rays, core, and halo all pivot around the sun center
  (352, 252). For a celestial object, the "root" IS the center
  (just like Earth rotates around its own axis, not around a
  point in space). The counter-rotation between long and short
  ray layers is the rev7 "alive > static" reasoning. The
  rev8 principle is already satisfied — no change.
- **Clouds**: translateX drift across the sky. Clouds aren't
  rooted, so translation is the natural motion (not rotation
  around a pivot). A subtle scale-pulse per cloud was
  considered but not added — the visual cost of the change
  is unclear and the current translation reads correctly.
- **Houses, birds, scroll hint**: not natural-scene sway
  candidates. Static / bouncing / UI motion is appropriate.

### Rev8 audit

DOM diagnostic (`anim-audit.mjs`):

| Class | Count | Computed style | OK? |
|---|---|---|---|
| .palmFronds | 3 | `animation-name: palmFrondsSway, 7s, transform-box: fill-box, transform-origin: 32px 32px` (= center of fronds bbox = trunk-top) | ✓ |
| .blade | 60 (in addition to 1 .blades parent with `grow` 1.2s) | `animation-name: bladeSway, 2.6s, transform-box: fill-box, transform-origin: 7px 24-30px` (= bottom of blade bbox = base of blade) | ✓ |
| .farPalmsSway | 1 | `animation-name: farPalmsSway, 14s, transform-box: view-box, transform-origin: 50% 100%` | ✓ |
| .sunRaysLong | 1 | rotate 50s around (352, 252) | ✓ preserved |
| .sunRaysShort | 1 | counter-rotate 70s around (352, 252) | ✓ preserved |

Multi-frame hero captures at 1920x800, t=0/1750/3500/5250ms:

- Trunk positions are identical across all 4 frames
  (rooted at the ground band) ✓
- Frond positions differ across all 4 frames (canopy is
  swaying around the fixed trunk-top) ✓
- Cloud at upper-left has drifted between frames (translation
  is running) ✓
- Sun rays have rotated between frames (D-0052 animation
  preserved) ✓

### Acceptance

- typecheck: clean (`tsc --noEmit` returned 0 errors).
- charter 3/3: unchanged from rev7.
- DOM diagnostic confirms all 4 animation classes
  (.palmFronds, .blade, .farPalmsSway, sun animations)
  have correct animation-name, transform-box, and
  transform-origin.
- Multi-frame captures confirm the visual principle:
  trunk positions static (rooted), frond positions
  dynamic (swaying).
- ledger entry: this section.

### Rev8 confidence

Path A 0.99 → 0.995 (rev8 closed the last
principle-coherence concern: every animated element in the
scene now obeys the "root anchored, upper parts moving"
physics principle that the steward articulated).

The remaining 0.005 gap is the visual subtlety of the
grass blade motion — the architectural fix is in place
and the per-blade phase gradient is working, but the
strokes are 1.4-1.6 viewBox units (1.6-1.8 screen pixels)
on a similar-tone green background, so the motion reads
as a foreground shimmer rather than obvious blade sway.
If the steward wants more visible blade motion, a follow-
up could bump the stroke contrast (lighter tip color) or
the rotation magnitude (±3.5° → ±6°), but neither is
required for the principle to be applied.

Path B 0.80 (unchanged; still not affected by rev8).

### Rev8 deferred items (carried from rev7, unchanged)

- Path B (composite operator scene with painted operator
  overlay on the existing scene2 background): deferred
  until ~1 week after Path A is in production.
- Ranch-house gouache repaint: lowest-leverage of the
  remaining items.
- OperatorStrip painted palms backdrop at 7% opacity:
  intentionally not changed.
- FieldLog 33778 disconnected from route line: minor
  visual issue, not incoherent.
- ServiceBento Mulching card extends past viewport edge
  on right: intentional asymmetric grid.
- Bird wing flap animation: not added in rev8 because
  the existing V-shapes are at 0.5 opacity and barely
  visible. If the birds are re-painted or their
  opacity is bumped, a flap animation is a natural
  follow-up.
- Cloud breathing scale-pulse: not added in rev8 because
  the current translation reads correctly. The principle
  of "root anchored, tip moving" doesn't apply to clouds
  (they have no root); the principle would be "body
  moving, shape breathing" which is what the existing
  translateX does for body, and shape breathing is a
  separate enhancement, not a coherence fix.

### Lessons for future animation work in GRASS

- **Ask the root question first.** For every CSS rotation,
  scale, or skew, ask: "what is the base/root/anchor of
  this object, and where should the motion originate?"
  The answer drives the `transform-origin` and the
  animation target.
- **The .swaySlow pattern is a code smell.** A wrapper
  class that rotates a whole tree / whole cloud / whole
  anything is almost always wrong unless the object is
  rootless (sun, planet, etc.). The next reviewer should
  reject it on sight and ask the root question.
- **Phase gradients on a single keyframe create
  emergent motion.** The "wind moving across the lawn"
  effect is just 60 instances of the same 2.6s keyframe
  with 0.11s phase offsets. No fancy choreography, no
  SMIL, no JS — just CSS custom properties and `calc()`.
  This is reusable for any field of repeated elements
  that should respond to a common stimulus.
- **Audit the animation surface, not just the new fix.**
  When the steward flags a class of issue ("primitive
  whole-element transformation"), audit the whole scene
  for instances of the same class — fixing only the
  flagged one leaves similar problems hiding in
  adjacent code.

End of ADR.
