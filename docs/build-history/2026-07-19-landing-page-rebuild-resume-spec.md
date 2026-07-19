# Landing Page Rebuild — Resume Spec

> **Status:** Draft — awaiting steward sign-off before implementation.  
> **Last updated:** 2026-07-18  
> **Scope:** Hero refinement cascade (D-0043/44/45) + ProcessSteps rework + ScheduleTimeline rework.  
> **Out of scope:** Full site redesign, new pages, auth/operator features, paid assets/fonts.  

---

## 1. Request summary

Resume the landing-page rebuild that was interrupted after the governance/spec phase. The current production hero (`HeroFieldTelemetry`, D-0042) is live. A refinement cascade (D-0043 palette rebuild, D-0044 viewport motion architecture, D-0045 structural cascade) was drafted in `apps/web/visual/inventory/2026-07-17-hero-refinement-spec.md` and three ADRs were ratified, but no source code changes have been made yet.

This spec captures the steward's direction from the interview and defines the implementation plan for the next sprint.

---

## 2. Current state

### 2.1 Production hero (D-0042)

- Component: `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
- Architecture: real Florida lawn photograph + animated SVG storybook layer that cross-fades on scroll + live status/field stamp/telemetry widgets.
- Known issues that triggered the cascade:
  - Palette gap: ~14,200 sand pixels in foreground composition vs. target ≤ 2,500.
  - Coverage gap: animation covers only ~89.5% of background vs. target ≥ 98.5%.
  - WebGL grass overlay was removed in D-0042 follow-up; storybook layer is now the only foreground motion.

### 2.2 Drafted but unimplemented

- `governance/decisions/0043-palette-rebuild.md`
- `governance/decisions/0044-viewport-motion-architecture.md`
- `governance/decisions/0045-structural-cascade.md`
- `apps/web/visual/inventory/2026-07-17-hero-refinement-spec.md`

### 2.3 Other landing-page sections

- `ProcessSteps`: four numbered steps, currently static on first paint (D-0030). Flagged as "off" and not conversion-optimized.
- `ScheduleTimeline`: weekly route resolver + today card + day strip. Already conversion-first (D-0036) but flagged for rework.

---

## 3. Interview findings

| Question | Steward answer |
|---|---|
| What was interrupted? | Implement the D-0043/44/45 hero refinement cascade. |
| Have you reviewed the 3 re-roll picks? | No. |
| Scope beyond hero? | Hero cascade + ProcessSteps rework + ScheduleTimeline rework. |
| How handle unreviewed picks? | Include a parallel re-pick contingency in the spec. |
| ProcessSteps direction? | Make it effortless and conversion-focused; propose 2–3 options. |
| ScheduleTimeline direction? | Do not limit availability (0 clients); propose improvements. |
| Cascade order vs. D-0042? | Preserve D-0042 as the initial state; append the cascade as a later chapter/evolution. Do not remove existing work. |
| Spec depth? | Full implementation plan. |
| Done definition? | Implementation complete + steward visual sign-off. |
| Review plan? | Yes, with staged previews. |
| Hard constraints? | No paid assets or fonts; focus on creative design; landing page should be a "flex" / demonstration of artistic creativity and applied capability, channeled as a landing page for a solo-operated lawn/landscaping small business. |
| Timeline? | No specific deadline; quality over speed. |

---

## 4. Scope

### 4.1 In scope

1. **Hero refinement cascade (D-0043/44/45)**
   - D-0043: re-roll asset catalog against brand green band.
   - D-0044: add shared `useViewportMotion` hook + per-layer parallax cadence.
   - D-0045: add 3-tier structural cascade (animated SVG primary + `<picture>` WebP secondary + PNG tertiary fallback).
   - Preserve D-0042 hero as the baseline chapter; cascade is an evolution appended to the existing sequence.

2. **ProcessSteps rework**
   - Move to a 3-step anxiety-removal model.
   - Make each step conversion-focused.
   - Propose 2–3 design options in the spec for steward selection.

3. **ScheduleTimeline rework**
   - Do not introduce availability-limiting UI (0 clients).
   - Propose 2–3 improvement options.

4. **Staged preview / review plan**
   - Local dev preview.
   - `/visual-test` mount surface.
   - Baseline refresh and steward sign-off.

### 4.2 Out of scope

- New pages or routes.
- Auth/operator features.
- Paid assets, fonts, or stock imagery.
- Full site palette refresh beyond the hero and directly affected sections.
- Customer login/quote history portal.

---

## 5. Design direction

### 5.1 Hero cascade

The hero should remain a "flex" of artistic creativity and technical capability, but channeled into a trustworthy local lawn-care landing page.

- **Palette:** move from sand/cream to a green/Florida-evocative palette anchored by `--ll-green #1f4e2c`.
- **Motion:** coherent, scroll-coupled parallax across 6 layers; no gimmicky scroll-driven mower.
- **Fallbacks:** robust 3-tier cascade so the hero looks correct on coarse-pointer, reduced-motion, no-WebGL, and older browsers.
- **Performance:** hero byte-stays ≤ 600 KB; Lighthouse perf ≥ 90 on mobile.

### 5.2 ProcessSteps

Move from a 4-step informational list to a **3-step anxiety-removal model**:

1. **Check coverage** — enter ZIP or neighborhood.
2. **Pick service + get quote** — transparent pricing, no portal.
3. **Relax** — operator shows up, mows, done.

Each step should have a clear micro-CTA pushing toward `/quote`.

### 5.3 ScheduleTimeline

Keep the route transparency but remove any availability-limiting language. Options to evaluate:

- **Option A: Route transparency + conversion.** Keep the weekly route strip, but make every day card a booking entry point.
- **Option B: Simplified next-mow widget.** Show only the next mow day for the visitor's ZIP + a primary CTA.
- **Option C: Operator log / journal.** Replace the calendar with a lightweight "this week on the route" narrative that builds trust.

---

## 6. Detailed implementation plan

### 6.1 Hero cascade implementation

#### Phase 1 — Visual-QA gate (D-0043 prerequisite)

1. Generate `tmid` frame extracts for the 3 re-roll picks if not already present:
   - Egret #2: `Egret_standing_in_shallow_water_202607172016.mp4`
   - Mower #8: `Riding_mower_cutting_lawn_202607171601.mp4`
   - Gouache #10: `Hand-painted_gouache_painting_still_202607171732.mp4`
2. Run `tmp/qa-pick.py` v4.1 to confirm metrics:
   - Sand-region pixels ≤ 2,500
   - Brand-distance admission ≥ 22%
   - Green-channel mean ≥ 60 for ≥ 95% of foreground
3. Present side-by-side to steward in photo viewer.
4. If rejected, re-run `qa-pick.py` with adjusted green-band gate and repeat.

#### Phase 2 — D-0043 palette rebuild

1. Transcode the 6 catalog MP4 sources into WebP keyframes + PNG `tmid` frames.
2. Update `HeroFieldTelemetry` to use the new catalog assets for the storybook layer.
3. Add `useReRollPicks` prop (default `true`) with rollback path to D-0042 assets.
4. Refresh `hero-chromium-{desktop,mobile}.png` baselines.

#### Phase 3 — D-0044 viewport motion architecture

1. Create `apps/web/src/components/motion/useViewportMotion.tsx`.
2. Define per-layer cadence presets:

| Layer | Cadence | Max translateY |
|---|---:|---:|
| L0 sky | 0.05 | 6 px |
| L1 egret | 0.10 | 12 px |
| L2 fern | 0.22 | 28 px |
| L3 mower | 0.18 | 22 px |
| L4 songbirds | 0.28 | 36 px |
| L5 gouache | 0.32 | 44 px |

3. Wire the 6 storybook SVG groups to `useViewportMotion`.
4. Gate parallax on `prefers-reduced-motion`, coarse pointer, and ≤ 768 px viewport.
5. Add `scripts/lint-viewport-motion.ts` to enforce cross-layer delta ≥ 0.04.

#### Phase 4 — D-0045 structural cascade

1. Create `apps/web/src/components/sections/HeroPrimary.tsx` — hand-authored 6-layer animated SVG primary (~280 KB).
2. Add `<picture>` dual-tier fallback inside `HeroFieldTelemetry`:
   - `<source type="image/webp" srcset="...">` (~180 KB)
   - `<img src="...png" loading="lazy">` (~140 KB)
3. Ensure `<canvas>` count on `/` route = 0.
4. Add `useStructuralCascade` prop (default `true`) with rollback to D-0042.
5. Add `apps/web/visual/utils/coverage.ts` to verify animation-covers-background ≥ 98.5%.

### 6.2 ProcessSteps rework

1. Audit current `ProcessSteps.tsx` + `ProcessSteps.module.css`.
2. Propose 2–3 design options to steward (see §5.2).
3. Implement chosen option.
4. Add per-step micro-CTA linking to `/quote`.
5. Refresh component baselines.

### 6.3 ScheduleTimeline rework

1. Audit current `ScheduleTimeline.tsx` + `ScheduleTimeline.module.css`.
2. Propose 2–3 design options to steward (see §5.3).
3. Implement chosen option.
4. Ensure no availability-limiting UI is introduced.
5. Refresh component baselines.

### 6.4 Staged preview / review plan

1. **Local dev preview:**
   - `cd apps/web && bun dev`
   - Review `/` and `/visual-test#hero`.
2. **Visual-test mount:**
   - `/visual-test#hero` → D-0042 baseline
   - `/visual-test#hero-cascade-preview` → 3-tier cascade stacked
3. **Baseline refresh:**
   - `bun run visual:refresh`
   - Steward side-by-side review of `hero-chromium-{desktop,mobile}.png`.
4. **Sign-off gate:**
   - Steward approves picks, ProcessSteps option, and ScheduleTimeline option.

---

## 7. Acceptance criteria

### 7.1 Hero cascade

- [ ] D-0043: sand-region pixels ≤ 2,500; brand-distance admission ≥ 22%; green-channel mean ≥ 60 for ≥ 95% of foreground.
- [ ] D-0044: 6 layers move at assigned cadences; cross-layer delta ≥ 0.27; parallax disabled on reduced-motion, coarse-pointer, and ≤ 768 px.
- [ ] D-0045: `<canvas>` count on `/` = 0; hero bytes ≤ 600 KB; animation-covers-background ≥ 98.5%.
- [ ] Lighthouse performance on `/` ≥ 90 (mobile).
- [ ] Playwright routes spec passes on chromium-desktop and chromium-mobile.
- [ ] Charter compliance `bun run test:charter` passes.

### 7.2 ProcessSteps

- [ ] 3-step anxiety-removal model implemented.
- [ ] Each step has a clear micro-CTA toward `/quote`.
- [ ] Reduced-motion respected.
- [ ] Component baseline refreshed.

### 7.3 ScheduleTimeline

- [ ] No availability-limiting UI.
- [ ] Conversion path to `/quote` is obvious.
- [ ] Reduced-motion respected.
- [ ] Component baseline refreshed.

### 7.4 Overall

- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Steward visual sign-off obtained.

---

## 8. Rollback plan

| Decision | Rollback action | Time |
|---|---|---|
| D-0043 palette rebuild | Set `useReRollPicks={false}` on `HeroFieldTelemetry` | < 10 min |
| D-0044 viewport motion | Remove `<HeroViewportMotion>` wrapper | < 5 min |
| D-0045 structural cascade | Set `useStructuralCascade={false}` | < 30 min |
| Full cascade | `git checkout 63e0b467 -- apps/web/src/components/sections/HeroFieldTelemetry.tsx` + re-baseline | < 30 min |

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Re-roll picks fail steward eye-QA | Parallel re-pick contingency; fallback to CSS overlay tint if re-pick overruns 4 h. |
| Hand-authored SVG primary diverges from catalog fidelity | Staged preview + steward sign-off before production. |
| Byte budget exceeded | Pre-author SVG with build-time size check; fallback to 2-tier cascade. |
| Cross-browser SVG/SMIL inconsistency | Restrict SMIL to translate + opacity only; test on firefox project. |
| ProcessSteps/ScheduleTimeline options rejected | Propose early, iterate before heavy implementation. |

---

## 10. Open questions

1. Which of the 2–3 ProcessSteps design options does the steward prefer?
2. Which of the 2–3 ScheduleTimeline design options does the steward prefer?
3. Does the steward want the cascade to be the default production hero immediately after sign-off, or run as an A/B preview first?

---

## 11. Files likely to change

- `apps/web/src/components/sections/HeroFieldTelemetry.tsx`
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css`
- `apps/web/src/components/motion/useViewportMotion.tsx` (new)
- `apps/web/src/components/motion/index.ts`
- `apps/web/src/components/sections/HeroPrimary.tsx` (new)
- `apps/web/src/components/sections/ProcessSteps.tsx`
- `apps/web/src/components/sections/ProcessSteps.module.css`
- `apps/web/src/components/sections/ScheduleTimeline.tsx`
- `apps/web/src/components/sections/ScheduleTimeline.module.css`
- `apps/web/src/app/visual-test/page.tsx`
- `apps/web/visual/utils/coverage.ts` (new)
- `scripts/lint-viewport-motion.ts` (new)
- `apps/web/visual/baselines/*`
- `state/ledger.yaml`

---

## 12. Next steps after spec approval

1. Run the D-0043 visual-QA gate and confirm/re-pick assets.
2. Implement D-0043 palette rebuild.
3. Implement D-0044 viewport motion architecture.
4. Implement D-0045 structural cascade.
5. Propose and implement ProcessSteps options.
6. Propose and implement ScheduleTimeline options.
7. Run validation suite and obtain steward visual sign-off.
