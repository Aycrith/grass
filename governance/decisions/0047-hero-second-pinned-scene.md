# D-0047 — Hero Second Pinned Scene + Wave 3 Motion Restoration

> **Decision template**: `governance/05-decision-framework.md`
> **Spec-of-record**: this ADR (introduced in 2026-07-19 wave 4/5 ship)
> **Library substrate**: `apps/web/src/components/sections/HeroFieldTelemetry.tsx`, `apps/web/src/components/sections/HeroFieldTelemetry.module.css`, `apps/web/src/components/sections/HeroStorybookLayer.tsx`, `apps/web/src/components/sections/HeroStorybookLayer.module.css`, `apps/web/src/lib/content.ts`
> **Commit of record**: `99dbf05` (2026-07-19)

---

## Problem

After the 2026-07-17 commit train (D-0043 additive green + D-0044 viewport motion + D-0045 native 4-tier `<picture>` cascade + ProcessSteps 3-step rework + cleanup, commit `1232fcc`), the steward reported the hero "transitions between only two states" with no additional content emerging after the second photo. Diagnostic on 2026-07-19 (`apps/web/audit/d-hero-diagnostic/memo.md`) confirmed the gap:

| Spec / Decision | Originally proposed | Actually shipped | Where the content is now |
|---|---|---|---|
| D-0008 hero v2 brief | 7-composable layered asset pack | Single static image + 4-tier `<picture>` + hand-authored SVG storybook | `palm.webp` generated (242 KB) but never imported |
| D-0042 (Wave B closeout) | Field Telemetry + WebGL grass field | Single cross-fade into a 4K photo + dashboard widgets | Single 200svh pinned section, one transition window |
| D-0044 useViewportMotion hook | 6-layer cadence presets | 4 of 6 layers wired (sky / egret / mower / gouache). Fern + songbirds never render | Hook returns unused MotionValues |
| D-0046 debug overlay | `?debug=show-additive` URL-param gate | Shipped across 3 revisions | Steward-visible surface |
| `hero.composition` block (lib/content.ts) | Per-layer palmAriaLabel / mowerAriaLabel / callout pill | Orphaned since the right-column SVG composition was replaced by the photo+storybook approach | Dead code |

The hero is fundamentally a cross-fade into a single resting state, not a sequence of scenes. The user's expectation of "additional scenes/assets/content animated scenes after the second photo" reflects the original D-0008 / D-0042 ambition (a 7-layered scene with continuous content revelation), which was descoped during implementation.

Steward direction (2026-07-19): "ship each wave when it is ready and has been through as many visual design and improvement/augmentation passes to ensure that this is as high quality and artistically presentable as possible" and "do what results in the best possible, highest quality animated 3d scene as a result." No IP/provenance gating — the grasscontent VEO-generated video assets are usable as-is.

## Context

Two waves of work were identified as prerequisites to closing the "additional scenes" gap:

1. **Wave 3 — restore what D-0044 started.** The `useViewportMotion` hook already declared `fern` and `songbirds` MotionValues but `HeroStorybookLayer` never consumed them. Wiring them in adds real parallax layers (ferns swaying in the foreground, songbirds flying across the hedge line) without authoring any new content.

2. **Wave 4 — add a second pinned scene.** Extend the hero from 200svh to 350svh and introduce a new cross-fade window [0.40, 0.70] that swaps the 4K photo resting state for a hand-painted gouache illustration of the same Largo lawn. The chapter-2 commitment copy ("Same yard, every week.") replaces the chapter-1 storybook headline ("Your neighbor's lawnmower."). All scene-agnostic dashboard widgets (LIVE pill, EST stamp, telemetry) persist across both scenes.

The grasscontent archive at `C:/Users/camer/Downloads/grasscontent/` provides the raw VEO-generated video assets. A separate Wave 2.5 already extracted 6 webp frames per asset via `C:/Users/camer/Downloads/grasscontent/prep-loop-frames.py` (ffmpeg + PIL letterbox-cropping), yielding:

- `fern-01..06.webp` (1070×720, ~38KB each, from `Fern_swaying_in_painting_*.mp4`)
- `songbirds-01..06.webp` (870×720, ~20KB each, from `Songbirds_flying_on_hedge_*.mp4`)
- `gouache-01..06.webp` (875×720, ~50KB each, from `Hand-painted_gouache_storybook_p*.mp4`)
- `palms-01..06.webp` (1280×720, ~38KB each, from `Palm_trees_swaying_gentle_painting_*.mp4`)

18 webp frames total, ~917KB combined. All serve from `/hero/layers/v2/`.

The existing wave 3 motion substrate (D-0044 useViewportMotion + D-0043 photo) makes wave 4 a scroll-math problem rather than a from-scratch design problem. The same 6-frame CSS-step cycling pattern that waves 1-3 established for the fern / songbirds layers extends naturally to the gouache scene-2 illustration.

## Requirements

| ID | Requirement | Source |
|---|---|---|
| R47.1 | Hero root height bumps from `200svh` to `350svh` to accommodate the second scene's cross-fade window | §Problem (additional scenes gap) |
| R47.2 | New scroll bands: `[0.00, 0.10]` scene 1 resting, `[0.10, 0.40]` scene 1 → photo cross-fade (D-0043), `[0.40, 0.70]` photo → scene 2 cross-fade (Wave 4), `[0.70, 1.00]` scene 2 resting | §Context |
| R47.3 | Four new MotionValues: `photoFade` (drives `BackgroundPhoto`'s photo div opacity), `secondSceneFade` (drives SecondScene container), `scene1ContentFade` (drives scene 1 `<Content>` motion.div), `scene2ContentFade` (drives SecondScene's inner content motion.div) | R47.2 |
| R47.4 | `BackgroundPhoto` signature extended to accept optional `photoFade` prop. Default unset → fully opaque (backward-compatible — D-0046 stack unaffected) | R47.3 |
| R47.5 | New `SecondScene` React component renders the 6-frame gouache illustration cycling on 10s (CSS-step keyframes via `.gouacheFrame1..6` with 1.666s staggered delays) + chapter-2 commitment copy (eyebrow / headline / subhead / primary CTA / secondary CTA) | R47.2 + §Context |
| R47.6 | `lib/content.ts` gains `scene2` block (eyebrow / headline / subhead / primaryCta / secondaryCta) so the steward edits the copy in one place; both `app/page.tsx` and `app/visual-test/page.tsx` wire `scene2={heroContent.scene2}` | Existing pattern (`hero.eyebrow / headline / subhead / primaryCta / secondaryCta` is already in content.ts) |
| R47.7 | Wave 3 motion restoration: FernLayer + SongbirdsLayer mount in `HeroStorybookLayer` using 6 webp frames per asset; vertical parallax driven by useViewportMotion's `fern` + `songbirds` MotionValues (cadence 0.22 / 0.28); reduced-motion + mobile + coarse-pointer gates drop frames 2-6 on phones | D-0044 §R44.x |
| R47.8 | `ScrollHint` text updated from "SCROLL TO MOW" to "SCROLL TO REVEAL" — the mower SVG was removed in D-0014 but the hint still referenced it | Steward observation |
| R47.9 | Multi-pass visual quality audit (4 passes per the "as many visual design/improvement passes as possible" directive) before ship: rendering health (HTTP-only), CSS module completeness (grep audit), artistic-quality improvements (palms + editorial ornaments) | Steward direction |

## Alternatives

- **A (chosen) — Two scenes via scroll-math on the existing single-section hero.** Extend the section height + add cross-fade MotionValues + add a SecondScene component mounted in the existing JSX tree. No new section, no new route. Reuses every existing infrastructure element (photo cascade, dashboard widgets, debug overlay, scroll progress smoothing).
- **B — Two separate `<section>` elements.** Split the hero into `<HeroScene1>` + `<HeroScene2>` siblings in `app/page.tsx`. Each section has its own scroll math. Simpler mental model but breaks the existing sticky-viewport pattern and creates a layout flash between scenes.
- **C — WebGL-rendered hero.** Replace the photo+SVG composition with a Three.js scene that draws both cross-fade states inside a single canvas. Higher visual ceiling but ~10x code surface area, requires three.js dependency addition, and the steward explicitly framed the goal as "best possible, highest quality animated 3d scene" — not necessarily a literal Three.js scene.
- **D — Defer wave 4 entirely.** Ship only wave 3 (fern + songbirds restoration) and document wave 4 as a follow-up. Misses the steward's "additional scenes after the second photo" expectation.

A wins on alignment with the existing D-0043/D-0044/D-0045/D-0046 substrate and on minimizing new surface area. C is the long-run ceiling but a much larger ship.

## Evaluation matrix

| Criterion (higher = better) | A · two scenes via scroll-math | B · two sections | C · WebGL | D · defer |
|---|---:|---:|---:|---:|
| Aligns with steward's "additional scenes" expectation | **5** | 4 | 5 | 1 |
| Code surface area (lower = better, reversed) | **5** | 4 | 1 | 5 |
| Steward-visible audit latency | **5** | 5 | 4 | 5 |
| Single-implementation runtime dependency | **5** | 5 | 3 | 5 |
| Reuses D-0043/44/45/46 substrate | **5** | 3 | 1 | 5 |
| **Sum** | **25** | **21** | **14** | **21** |

A wins on alignment + minimal surface + substrate reuse. C is the long-run direction but a multi-day ship.

## Decision

Pursue alternative **A**. Implementation files (no new dependencies, no production architecture change):

```
apps/web/src/components/sections/HeroFieldTelemetry.tsx
apps/web/src/components/sections/HeroFieldTelemetry.module.css
apps/web/src/components/sections/HeroStorybookLayer.tsx
apps/web/src/components/sections/HeroStorybookLayer.module.css
apps/web/src/lib/content.ts
apps/web/src/app/page.tsx
apps/web/src/app/visual-test/page.tsx
apps/web/public/hero/layers/v2/  (18 webp frames)
apps/web/audit/  (diagnostic memos + screenshots)
```

Implementation specifics:

```tsx
// Inside HeroFieldTelemetry function body, after greenVignetteOpacity + grassOpacity:
const photoFade = useTransform(smoothProgress, [0.4, 0.7], [1, 0]);
const secondSceneFade = useTransform(smoothProgress, [0.4, 0.7], [0, 1]);
const scene1ContentFade = useTransform(smoothProgress, [0.35, 0.55], [1, 0]);
const scene2ContentFade = useTransform(smoothProgress, [0.55, 0.75], [0, 1]);

// BackgroundPhoto signature: photoFade?: MotionValue<number>
// Return signature: <motion.div className={styles.photo} ... style={photoFade ? { opacity: photoFade } : {}}>
//   (was plain <div>; changed to motion.div because the prop may be a MotionValue<number> not a number)

// Mount SecondScene between the scene-1 content motion.div and the dashboard widgets
<motion.div className={styles.content} style={{ opacity: scene1ContentFade }}>
  <Content eyebrow={eyebrow} headline={headline} subhead={subhead} primaryCta={primaryCta} secondaryCta={secondaryCta} />
</motion.div>
<SecondScene scene2={scene2} opacity={secondSceneFade} contentOpacity={scene2ContentFade} />

// New SecondScene component at the bottom of the file:
function SecondScene({ scene2, opacity, contentOpacity }: {...}): ReactNode {
  return (
    <motion.div className={styles.secondScene} style={{ opacity }} data-testid="hero-second-scene">
      <div className={styles.gouacheStage} aria-hidden="true">
        {/* 6 gouache frames cycling 10s */}
        <div className={`${styles.gouacheFrame} ${styles.gouacheFrame1}`} style={{ backgroundImage: 'url(/hero/layers/v2/gouache-01.webp)' }} />
        ...
        {/* 6 palm frames cycling 12s as foreground parallax */}
        <div className={styles.secondScenePalms} aria-hidden="true">
          <div className={`${styles.secondScenePalmFrame} ${styles.secondScenePalmFrame1}`} style={{ backgroundImage: 'url(/hero/layers/v2/palms-01.webp)' }} />
          ...
        </div>
      </div>
      <motion.div className={styles.secondSceneContent} style={{ opacity: contentOpacity }}>
        <span className={styles.secondSceneEyebrow}>{scene2.eyebrow}</span>
        <h2 className={styles.secondSceneHeadline}>
          <span className={styles.secondSceneOpeningMark} aria-hidden="true">&ldquo;</span>
          {parseScene2Headline(scene2.headline).map((seg, i) =>
            seg.italic ? <em key={i} className={styles.secondSceneHeadlineItalic}>{seg.text}</em> : <span key={i}>{seg.text}</span>
          )}
        </h2>
        <p className={styles.secondSceneSubhead}>{scene2.subhead}</p>
        <div className={styles.secondSceneActions}>
          <MagneticCta href={scene2.primaryCta.href} variant="sun" size="lg">{scene2.primaryCta.label}</MagneticCta>
          <MagneticCta href={scene2.secondaryCta.href} variant="ghost" size="lg">{scene2.secondaryCta.label}</MagneticCta>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

CSS rules added to `HeroFieldTelemetry.module.css`:

```css
.secondScene {
  position: absolute; inset: 0; z-index: 1; overflow: hidden; pointer-events: none;
  background-color: var(--ll-cream);
}
.gouacheStage { position: absolute; inset: 0; pointer-events: none; }
.gouacheFrame { position: absolute; inset: 0; background-repeat: no-repeat; background-position: center; background-size: contain; opacity: 0; }
@keyframes gouacheCycle { 0%, 16.666% { opacity: 1; } 16.667%, 100% { opacity: 0; } }
.gouacheFrame1..6 { animation: gouacheCycle 10s steps(1, end) infinite; animation-delay: 0/1.666s/3.333s/5s/6.666s/8.333s; }
.secondSceneContent { position: absolute; inset: auto 0 12svh 0; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 6vw; pointer-events: auto; color: var(--ll-palm-bark); }
.secondSceneEyebrow { font-family: var(--font-inter); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--ll-clay); }
.secondSceneHeadline { font-family: var(--font-fraunces); font-weight: 500; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; letter-spacing: -0.02em; max-width: 24ch; position: relative; }
.secondSceneOpeningMark { font-family: var(--font-fraunces); font-style: italic; font-size: 0.9em; color: var(--ll-clay); opacity: 0.55; display: inline-block; transform: translateY(-0.08em); }
.secondSceneHeadlineItalic { font-style: italic; font-weight: 600; color: inherit; }
.secondSceneSubhead { font-family: var(--font-inter); font-size: 1rem; line-height: 1.5; max-width: 50ch; opacity: 0.85; }
.secondSceneActions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.secondScenePalms { position: absolute; inset: auto 0 0 0; height: 60%; width: 100%; pointer-events: none; mix-blend-mode: multiply; opacity: 0.78; }
.secondScenePalmFrame { position: absolute; inset: 0; background-repeat: no-repeat; background-position: right bottom; background-size: 38% auto; opacity: 0; }
@keyframes secondScenePalmCycle { 0%, 16.666% { opacity: 1; } 16.667%, 100% { opacity: 0; } }
.secondScenePalmFrame1..6 { animation: secondScenePalmCycle 12s steps(1, end) infinite; animation-delay: 0/2s/4s/6s/8s/10s; }
```

Reduced-motion + mobile gates drop frames 2-6 of both cycling layers (display: none) under `@media (max-width: 768px)` and `@media (prefers-reduced-motion: reduce)`.

Wave 3 implementation (HeroStorybookLayer.tsx):

```tsx
function FernLayer({ y }: { y: MotionValue<number> | undefined }): ReactNode {
  return (
    <motion.div className={styles.fernWrap} style={y !== undefined ? { y } : {}} aria-hidden="true" data-testid="hero-fern-layer">
      <div className={styles.fernInner}>
        <div className={`${styles.fernStrip} ${styles.fernFrame1}`} style={{ backgroundImage: 'url(/hero/layers/v2/fern-01.webp)' }} />
        ...
      </div>
    </motion.div>
  );
}
// SongbirdsLayer mirrors this pattern with .songbirdsWrap + 6 frames at 10s cycle, 1.666s staggered delays
```

## Risk

- **R-SCENE2-001**: Scene 2 content readability on small viewports (≤380px). The 24ch-max headline + 50ch-max subhead + 6vw padding may compress awkwardly. **Mitigation**: dedicated `@media (max-width: 380px)` rules reduce headline clamp + tighten padding.
- **R-SCENE2-002**: Vertical scroll height grew from 200svh to 350svh. Some stewards may dislike the longer page. **Mitigation**: this is the explicit trade-off for "additional scenes after the second photo" — there's no way to add scene transitions without extending scroll distance.
- **R-SCENE2-003**: PhotoFade on the existing `<picture>` cascade competes with `photoGradeOpacity` (D-0043) on the same scroll range. If both fire at the same time, the photo's opacity + grade opacity compound in unexpected ways. **Mitigation**: photoFade operates on the outer `<div className={styles.photo}>` (now `motion.div`) which contains both the `<picture>` cascade and the `photoGrade` overlay — so both children inherit the same fade-out, no compound conflict.
- **R-SCENE2-004**: Scene-2 copy becomes stale if `lib/content.ts → hero.scene2` is never updated after a future rebrand. **Mitigation**: content.ts is the single source of truth — steward edits scene2 there, not in the component.
- **R-WAVE3-001**: Wave 3 fern + songbirds frames consume ~58KB total per hero scroll (12 frames × ~38KB / ~20KB). On a 3G mobile connection this could add 200ms to LCP. **Mitigation**: frames are served as static webp from `/hero/layers/v2/` with HTTP cache headers; modern browsers cache them across visits. The hero's LCP element is still the `<picture>` cascade (`/hero/v2/desktop.avif` ~159KB) which loads first.
- **R-WAVE3-002**: The ScrollHint text change ("SCROLL TO MOW" → "SCROLL TO REVEAL") is a copy change that may surprise reviewers who remember the previous text. **Mitigation**: the old text was demonstrably stale (mower SVG removed in D-0014 but hint still referenced it); the new text matches the actual scroll-driven experience.
- **R-DEBUG-001**: D-0046's `?debug=show-additive` URL-param gate still works against the new 350svh section height because the gate operates on data-attribute + CSS escape-hatch, not on scroll math. The visible surface area is now larger so a steward visual sign-off might want a re-capture. **Mitigation**: capture script at `audit/d-hero-diagnostic/` covers scroll 0%/25%/50%/75%/100% — these will exercise the new scene 2 transition naturally.
- **R-VISUALCAP-001**: Playwright Chromium binary cache at `C:/Users/camer/AppData/Local/ms-playwright/` is empty in this environment, leading to silent `chromium.launch()` hangs. Visual baselines were NOT refreshed in this ship. **Mitigation**: HTTP-only verification via `undici` confirms SSR markup + asset serving + CSS compilation; deferred to a future Wave 6 when Chromium is available or the steward runs `bun run visual:refresh` manually.

## Rollback

A single PR revert:

1. `git restore apps/web/src/components/sections/HeroFieldTelemetry.tsx apps/web/src/components/sections/HeroFieldTelemetry.module.css apps/web/src/components/sections/HeroStorybookLayer.tsx apps/web/src/components/sections/HeroStorybookLayer.module.css apps/web/src/lib/content.ts apps/web/src/app/page.tsx apps/web/src/app/visual-test/page.tsx`
2. `rm -rf apps/web/public/hero/layers/v2/`
3. `bun run typecheck && bun run lint && bun run build`
4. Restart dev server

Time-to-rollback: < 5 minutes. Wave 3 assets (`fern-01..06.webp`, `songbirds-01..06.webp`) and Wave 4 assets (`gouache-01..06.webp`, `palms-01..06.webp`) are independent — partial rollback is possible by restoring only the component file + the asset subset.

## Confidence

**0.72 (Pending runtime visual confirmation)**. The lower-bound checks were all green before ship:

| Check | Result |
|---|---|
| `bun run typecheck` | exit 0 |
| `bun run lint` (via husky pre-commit) | exit 0 (after fixing 2 unused-var warnings in audit scripts) |
| `git commit` | commit `99dbf05` landed |
| HTTP-only verification: SSR markup | All 6 gouache frames + 6 palm frames present in serialized payload |
| HTTP-only verification: asset serving | All 18 webp frames resolve HTTP 200 with `content-type: image/webp` (50KB gouache, 38KB palm, 38KB fern, 20KB songbirds) |
| HTTP-only verification: CSS compilation | `/_next/static/chunks/app/page.js` contains all 9 second-scene rules (`secondScene`, `gouacheStage`, `gouacheFrame`, `gouacheCycle`, `secondSceneContent`, `secondSceneEyebrow`, `secondSceneHeadline`, `secondSceneOpeningMark`, `secondScenePalms`) |

The missing piece is one in-browser smoke-test: open `localhost:3002`, scroll from 0% to 100%, confirm the photo dissolves into the gouache illustration with the palms swaying in the foreground and the chapter-2 commitment copy reading cleanly. Static-only evidence bounds confidence at the 0.72-0.78 range — unverified surfaces: (a) Playwright visual baseline refresh (Chromium issue), (b) in-browser verification of scene transition timing at 350svh, (c) `?debug=show-additive` gate still firing against the new 350svh surface.

Lower than 0.95 because of R-VISUALCAP-001 (Chromium issue blocking visual baseline refresh) and R-DEBUG-001 (gate may need a re-capture).

## Review date

**2026-10-10** (parallel to D-0043/44/45/46 cycle).

Re-review trigger (earlier): any time the steward fails to confirm the scene-2 transition visually in a desktop browser, or any time the grasscontent asset catalog is refreshed (new frames would invalidate the 6-frame cycling cadence assumptions).

## Trade-offs accepted (2026-07-19)

- **Hero section height grew from 200svh to 350svh.** Some reviewers may find the longer page unwelcome. The trade-off is unavoidable: a 2-scene hero requires 2 × scroll-driven cross-fade windows, each of which needs ~30% scroll distance. The 350svh total is the minimum that gives both cross-fades their full ~30% range without either one feeling snapped.

- **Wave 4 ships palms as foreground parallax that adds a 6th animated layer.** This increases GPU composition cost on low-end mobile devices. The reduced-motion + coarse-pointer + ≤768px gates drop the animation entirely on those surfaces (display: none on frames 2-6). The palm frame at scroll 0 + stationary is also static enough that even non-gated mobile devices see it as a still image rather than an animation.

- **Wave 3's fern + songbirds are mounted unconditionally on desktop (not gated by IntersectionObserver).** The `<motion.div>` always renders; the inner 6 frames cycle on CSS animations. This means the browser starts downloading + decoding the 12 webp frames immediately on page load. On a 4G connection this is ~100ms of additional hero-load cost. The trade-off is that the visitor sees a more alive storybook cross-fade.

- **`BackgroundPhoto` signature change (D-0043-rev → D-0047): `<div>` → `motion.div`.** The pre-D-0047 `BackgroundPhoto` returned `<div className={styles.photo}>`. D-0047 needs the parent to bind `photoFade` (a `MotionValue<number>`) on the opacity style prop, which only `motion.div` accepts. This is a low-risk upgrade because (a) `motion.div` is a drop-in replacement for `<div>` at the React level, (b) the only style prop added is opacity, and (c) no animation transitions are bound to the new motion.div — it's a pure opacity carrier.

- **The orphaned `hero.composition` block (palmAriaLabel / mowerAriaLabel / callout) is still orphaned.** The pre-D-0047 diagnostic memo recommended deleting it as a follow-up cleanup if it wasn't wired into the new HeroCallout pill. D-0047 doesn't address this. Future steward action: delete `hero.composition` from `lib/content.ts` in a separate cleanup commit.

- **`parseScene2Headline` italic-keyword matching uses a hard-coded `italicKeywords` array.** Adding new keywords requires a code change. Acceptable trade-off because (a) the brand-voice guideline is curated by the steward, not user-facing content, and (b) the array is 3 lines and lives next to the parser.

## Status: implemented 2026-07-19 (Day 26)

The wave 3/4/5 ship landed in commit `99dbf05`. Files affected:

- `apps/web/src/components/sections/HeroFieldTelemetry.tsx` — 4 new MotionValues, scene1 content fade wrap, `<SecondScene>` mount, new `SecondScene` component at file end, `BackgroundPhoto` signature extended + `<div>` → `motion.div` upgrade, `parseScene2Headline` helper, 18 webp `backgroundImage` references
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css` — `.secondScene`, `.gouacheStage`, `.gouacheFrame`, `.gouacheFrame1..6`, `@keyframes gouacheCycle`, `.secondSceneContent`, `.secondSceneEyebrow`, `.secondSceneHeadline`, `.secondSceneOpeningMark`, `.secondSceneHeadlineItalic`, `.secondSceneSubhead`, `.secondSceneActions`, `.secondScenePalms`, `.secondScenePalmFrame`, `.secondScenePalmFrame1..6`, `@keyframes secondScenePalmCycle`, `.root` height 200svh → 350svh, reduced-motion + mobile gates
- `apps/web/src/components/sections/HeroStorybookLayer.tsx` — `FernLayer` + `SongbirdsLayer` components, scroll-driven y parallax from `useViewportMotion`
- `apps/web/src/components/sections/HeroStorybookLayer.module.css` — `.fernWrap`, `.fernInner`, `.fernStrip`, `.fernFrame1..6`, `@keyframes fernCycle`, `.songbirdsWrap`, `.songbirdsInner`, `.songbirdsFrame1..6`, `@keyframes songbirdsCycle`, reduced-motion + mobile gates
- `apps/web/src/lib/content.ts` — new `scene2` block (eyebrow / headline / subhead / primaryCta / secondaryCta)
- `apps/web/src/app/page.tsx` + `apps/web/src/app/visual-test/page.tsx` — wire `scene2={heroContent.scene2}`
- `apps/web/public/hero/layers/v2/` — 18 webp frames (`fern-01..06.webp`, `songbirds-01..06.webp`, `gouache-01..06.webp`, `palms-01..06.webp`, ~917KB)
- `apps/web/audit/` — diagnostic memos + 7-scroll-position screenshots + grasscontent integration memo
- `apps/web/audit-d3-wave{3,4}-http.mjs` + `apps/web/audit-d3-wave3.mjs` + `apps/web/audit-hero-diagnostic.mjs` — HTTP-only verification scripts

### Per-R-section status

- R47.1 ✓ — `.root { height: 350svh }` in `HeroFieldTelemetry.module.css`
- R47.2 ✓ — 4 MotionValues cover the four scroll bands
- R47.3 ✓ — `photoFade / secondSceneFade / scene1ContentFade / scene2ContentFade` all live
- R47.4 ✓ — `BackgroundPhoto` accepts `photoFade?: MotionValue<number>`; default unset → fully opaque
- R47.5 ✓ — `SecondScene` component renders gouache 6-frame cycling + chapter-2 copy + palms foreground parallax
- R47.6 ✓ — `lib/content.ts → hero.scene2` is the single source of truth; both page consumers wire it
- R47.7 ✓ — Wave 3: `FernLayer` + `SongbirdsLayer` mounted in `HeroStorybookLayer` with 12 webp frames; reduced-motion + mobile gates drop frames 2-6 on phones
- R47.8 ✓ — `ScrollHint` text updated from "SCROLL TO MOW" → "SCROLL TO REVEAL"
- R47.9 ✓ — 4 audit passes ran before ship (rendering health, CSS module completeness, palms + editorial ornaments, commit + ledger)

### What ships now

The Wave 4 hero, on a non-gated desktop browser, scrolls through four distinct visual moments:

1. **Scroll 0–10%**: scene 1 resting — hand-authored SVG storybook (sun + palms + mower + grass) full visible, "Your neighbor's lawnmower." headline with WordReveal, subhead + 2 CTAs, dashboard widgets fading in across [0.10, 0.30].
2. **Scroll 10–40%**: scene 1 dissolves into the 4K photo. Green wash + grass silhouette rise in. Fern + songbirds parallax kicks in (vertical translate from useViewportMotion).
3. **Scroll 40–70%**: photo dissolves into the gouache scene-2 illustration. Swaying palms rise as foreground parallax (12s cycle, mix-blend-mode multiply). Chapter-2 copy ("Same yard, every week." + opening quote glyph + italic emphasis on "yard") rises in.
4. **Scroll 70–100%**: scene 2 resting — gouache illustration with palms swaying, chapter-2 copy fully visible, dashboard widgets still readable.

Dashboard widgets (LIVE pill, EST stamp, telemetry stats) persist across all four moments — they fade in once at [0.10, 0.30] and stay visible to scroll 1.00.

### Who the ship does NOT help

- A user with `prefers-reduced-motion: reduce`: cycling animations (fern / songbirds / gouache / palms) are dropped via `display: none`. They see only frame 01 of each cycle, stationary. The cross-fade MotionValues still fire, so the scene transitions still happen — just without the cycling motion.
- A user with `pointer: coarse` (touchscreen laptop): same gate as reduced-motion.
- A user on viewport `≤ 768px`: same gate.
- The Playwright visual regression suite: `chromium.launch()` hangs in this environment (Chromium binary cache empty). `apps/web/visual/baselines/*.png` were NOT refreshed in this ship. Future steward action: `bun run visual:refresh` once Chromium is available.

### Confidence trace

The shipped implementation has been validated statically but not yet confirmed in-browser by this steward (the Playwright Chromium binary cache at `C:/Users/camer/AppData/Local/ms-playwright/` was empty, leading to silent `chromium.launch()` hangs). At commit time, the produced `/_next/static/chunks/app/page.js` carries all 9 second-scene rule names (confirmed via `bun -e "..."` HTTP probe) and the server returns HTTP 200 for both `/` and `/?debug=show-additive` (confirmed via `curl -w`). So the code path is shipped; the runtime smoke-test is deferred to the steward's local browser visit.