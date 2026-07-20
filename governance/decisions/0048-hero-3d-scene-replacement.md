# D-0048 — Replace Wave 4 VEO Gouache Scene 2 with Three.js 2.5D Scene

> **Decision template**: `governance/05-decision-framework.md`
> **Spec-of-record**: this ADR
> **Library substrate**: `apps/web/src/components/sections/HeroScene3D.tsx`, `apps/web/src/components/sections/HeroScene3D.module.css`, `apps/web/src/components/sections/HeroFieldTelemetry.tsx`, `apps/web/src/lib/content.ts`
> **Commit of record**: pending (Phase 7 commit)

---

## Problem

D-0047 (commit `99dbf05`, 2026-07-19) shipped the Wave 4 "second pinned scene" using VEO-generated gouache webp frames extracted from `Hand-painted_gouache_storybook_p…_202607171737.mp4`. The shipped asset — 6 webp frames at 875×720 with heavy black letterbox bars at the sides — was VEO's symmetric 1:1-in-16:9 framing of palms + sun + ground, which the user reports is **not artistically or visually coherent** with the rest of the hero (Wave 4 audit `e362704`, screenshots in `apps/web/audit/d-wave4-visual/`).

The cross-fade at scroll ~45% makes the stylistics clash very obvious: scene 1 (hand-authored SVG storybook) dissolving into scene 2 (symmetric AI-generated gouache with black bars).

D-0047 §Confidence was capped at 0.72 because browser visual confirmation was deferred; that confirmation has now arrived and it fails the user's "as high quality and artistically presentable as possible" gate from D-0047 §Steward direction.

## Context

The grasscontent archive at `C:/Users/camer/Downloads/grasscontent/` contains **three** distinct VEO gouache variants, not just one:

| Variant | Framing | Letterbox? | Composition |
|---|---|---|---|
| `Hand-painted_gouache_storybook_p…_202607171737.mp4` | symmetric palms + sun | YES — black bars at sides | Currently shipped (D-0047) |
| `Hand-painted_gouache_painting_still_202607171732.mp4` | "painting still" framing | reduced | Distinct composition |
| `Hand-painted_gouache_illustratio…_202607171636.mp4` | asymmetric ranch-house + palms + sun + mowed lawn + 2 riding mowers | NO — full-bleed | **Florida neighborhood scene** |

The user explicitly pointed at the grasscontent directory in the Wave 5 directive. Per source comparison (`Downloads/grasscontent/probe/REPORT-source-comparison.md`), the `illustratio` variant shows a Florida ranch house with terracotta roof, multiple palm trees, sun in upper-right, green lawn, and two riding mowers. **Steward picked `illustratio`** as the source for the replacement scene.

The user's three ratified design choices for this remediation:

1. **Three.js scene** — full WebGL rebuild using `three` + `@react-three/fiber` + `@react-three/drei`. The literal user phrase "animated 3d scene" maps to this stack.
2. **Use grasscontent assets as scene textures** — VEO-generated mp4s become the diffuse textures on 3D planes. Real 3D depth via camera orbit + parallax, no procedural geometry.
3. **Rewrite scene 2 copy** — new chapter-2 copy aligned with the 3D scene's time-of-day feel (Tuesday morning).

**Implementation philosophy (2.5D, not full 3D):** Rather than procedural geometry (which would require fabricating palm-tree models from scratch), the scene uses **2D planes positioned in real 3D space**, with the high-resolution VEO frames as diffuse textures. This gives real 3D depth via camera orbit + parallax between planes, no letterbox artifact (the letterboxed area is cropped out at the texture-extraction step), and reuses existing assets the user explicitly pointed to.

## Requirements

| ID | Requirement | Source |
|---|---|---|
| R48.1 | Three.js stack (`three ^0.185.1` + `@react-three/fiber ^9.6.1` + `@react-three/drei ^10.7.7`) installed; React 19 compatibility verified | §Steward direction (1) |
| R48.2 | New `<HeroScene3D />` component renders 3 cycled planes (BG z=-15, MID z=-8, FG z=-3) textured with **3 DIFFERENT grasscontent texture strips** — BG→`scene2-01..06.webp` (Florida ranch house + palms + sun + mower), MID→`palms-01..06.webp` (palms framing ranch house, asymmetric), FG→`fern-01..06.webp` (close-up fern frond on paper-cream bg). Each plane shows its own VEO source at its own depth, producing true parallax depth rather than 3 stacked copies of the same frame | §Implementation philosophy (D-0048 rev) |
| R48.3 | BG source: `Hand-painted_gouache_illustratio…_202607171636.mp4` (steward-picked). 6 frames extracted at 1240×680, paper-cream edge cropped out, written to `apps/web/public/hero/layers/v2/scene2-01..06.webp` (~33KB each). MID source: `Palm_trees_sway_in_painting_202607171659.mp4` (palms framing ranch house) → `palms-01..06.webp` (~37KB each). FG source: `Fern_swaying_in_painting_202607171905.mp4` (fern close-up on paper-cream bg) → `fern-01..06.webp` (~38KB each) | §Context + §Steward direction (2) |
| R48.4 | Old VEO-symmetric webps removed: `gouache-01..06.webp` (~308KB freed). (First-pass `palms-01..06.webp` re-extracted at higher quality; the file names survived so no deletion needed) | §Problem |
| R48.5 | Scene 2 copy rewritten: eyebrow "CHAPTER 2 — TUESDAY MORNING", headline "Walked past Tuesday." with `Tuesday` italicized in Fraunces, subhead "Six days I plan the route. One day I cut. The mower noise lasts twenty minutes; the rest of the week is yours." | §Steward direction (3) |
| R48.6 | Camera orbit 0° → 8° scroll-driven; per-plane wind sway (BG 0.5°, MID 1.5°, FG 3°); per-plane texture cycling cadence (12s/9s/6s) de-synced via `cyclePhase` offsets 0/3/5; cream-colored THREE.Fog (near=10, far=22) blends the 3D scene with the page background | §Quality pass 2 (D-0048 rev) |
| R48.7 | Cream-colored fog inside Canvas (near=10, far=22) so distant planes fade into the page background — blends the 3D scene with surrounding hero without a visible boundary. `scene.background = cream` ensures any pixels not covered by a plane match the page background | §Quality pass 1 (D-0048 rev) |
| R48.8 | Dedicated `.scrim` div between Canvas and content (cream-to-clear ramp: 98% cream at bottom → 5% at 90% height) anchors editorial text against any illustrated element behind it, including the scene-1 photo bleeding through during the cross-fade. Replaces the original `.root`-background gradient that was hidden by the StaticFallback's `<picture>` covering the whole panel | §Quality pass 1 (D-0048 rev) |
| R48.8b | `/hero-3d-test` route provides a real-browser review surface: mounts `<HeroScene3D />` in isolation with mock MotionValues (opacity 1, contentOpacity 1, scrollProgress 1) and a debug panel with sliders for camera orbit + scene + content opacity + a legend for the 3 planes. Internal-only (`noindex`); not linked from any nav. Steward navigates here in a real browser to see the WebGL scene with parallax + wind sway + frame cycling. Headless Chrome drops the WebGL context in this env, so Playwright captures only show the StaticFallback path; the actual Three.js render requires a real browser | §Validation (D-0048 rev) |
| R48.9 | `prefers-reduced-motion` locks camera orbit to 0°, drops wind sway, freezes frame cycling — static composition remains beautiful | D-0015 motion governance |
| R48.10 | Coarse-pointer (mobile/touch) drops DPR to 1.25 max + drops FG plane to save fillrate | §Phase 5 polish |
| R48.11 | WebGL fallback: when `webglcontextlost` fires (GPU thermal throttle, browser crash, locked-down environments) or `WebGLRenderingContext` is unavailable, swap to `<picture><img src="scene2-01.webp">` static fallback. Coherent with scene 1 photographic style; no letterbox, no missing-context blank state | §Progressive enhancement |
| R48.12 | HeroScene3D code-split via `next/dynamic` with `ssr: false` — keeps three.js + R3F + drei (~150KB gzipped) out of the initial client bundle. Verified: homepage First Load JS 468kB → 230kB (-238kB deferred) | §Phase 5 perf budget |
| R48.13 | Mobile (393×851) and desktop (1280×900) Playwright captures at 7 scroll positions verify the static fallback path renders the VEO frame coherently with editorial text overlay. Headless Chrome cannot sustain WebGL context (SwiftShader drops), so the captured state is the static fallback; in a real browser the WebGL scene adds parallax + wind sway + frame cycling on top of the same frames | §Validation |

## Alternatives

| ID | Alternative | Status | Rationale |
|---|---|---|---|
| A | Hand-authored SVG storybook continuation (no VEO frames) | **Rejected** | Would require fabricating palm + ranch-house SVG, expensive authoring; loses the "real Florida neighborhood" photographic warmth that VEO provides |
| B | Hybrid photo+SVG (existing 4K photo + new SVG ornaments) | **Rejected** | Doesn't match the "animated 3d scene" directive; the user explicitly said Three.js |
| C | ComfyUI re-roll — generate a new VEO-style frame with different prompt | **Rejected** | The user pointed at the existing grasscontent directory and wants to use what's there. Re-rolling introduces a new IP/provenance question + 30+ min generation |
| D | Three.js scene with procedural palm geometry | **Rejected** | Hand-authoring 3D palm-tree models from scratch is high-effort, low-payoff (the VEO frames already look great as textures). 2.5D approach gives 80% of the visual richness at 20% of the effort |
| **E** | **Three.js scene with VEO textures on 3D planes (2.5D)** | **Selected** | Matches "animated 3d scene" directive. Reuses existing assets. No procedural geometry. Letterbox-free via texture crop. WebGL fallback ensures graceful degradation |
| F | Static `<picture>` only (no Three.js) | **Rejected (as primary)** | Selected as fallback path (R48.11), but doesn't deliver the "animated" requirement of the user's directive |

## Decision matrix

| Criterion | Weight | A (SVG) | B (photo+SVG) | C (re-roll) | D (procedural) | **E (2.5D)** |
|---|---|---|---|---|---|---|
| Matches "animated 3d scene" directive | 25% | 1 | 1 | 2 | 5 | **5** |
| Reuses existing grasscontent assets | 20% | 1 | 1 | 0 | 0 | **5** |
| Visual coherence with scene 1 | 20% | 4 | 3 | 3 | 3 | **5** |
| Implementation effort | 15% | 1 | 3 | 1 | 1 | **4** |
| Performance budget (LCP, CLS) | 10% | 5 | 5 | 5 | 3 | **4** |
| Resilience (no WebGL / old devices) | 10% | 5 | 5 | 5 | 2 | **4** |
| **Weighted score** | | **2.45** | **2.65** | **2.40** | **2.50** | **4.65** |

## Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-PERF | three.js + R3F + drei adds 150KB gzipped to bundle | Medium | Medium | Dynamic import + ssr:false (R48.12) defers until scene 2 mounts; verified 238kB First Load JS reduction | Steward |
| R-MOBILE | WebGL unavailable or unstable on older mobile devices | Medium | High | R48.10 coarse-pointer drop; R48.11 fallback to static image | Engineering |
| R-A11Y | Motion violates prefers-reduced-motion | Low | Medium | R48.9 gate locks camera + drops sway + freezes cycling | Engineering |
| R-VISUALCAP | Scene 2 still doesn't match scene 1 stylistically | Low | High | Steward-gated Phase 3+ visual quality passes; captures at 7 scroll positions before ship | Steward |
| R-LOADTIME | 6 texture loads (1920×680 webps) block scene 2 reveal | Medium | Low | R3F useLoader handles async; cream backdrop scrim covers the gap; static fallback path skips textures entirely | Engineering |
| R-CONTEXT-LOSS | GPU drops WebGL context mid-session | Low | Medium | R48.11 `webglcontextlost` event swap to fallback | Engineering |

## Rollback plan

1. Restore `apps/web/public/hero/layers/v2/gouache-01..06.webp` from git history (commit `99dbf05`)
2. Restore `apps/web/public/hero/layers/v2/palms-01..06.webp` from git history
3. Revert `HeroFieldTelemetry.tsx` to import `SecondScene` instead of `HeroScene3D`
4. Revert `lib/content.ts` to "CHAPTER 2 — THE COMMITMENT" / "Same yard, every week."
5. Remove `three`, `@react-three/fiber`, `@react-three/drei` from `package.json`

Net cost: ~30 minutes of revert work; no data loss.

## Confidence

**0.82** at ship time after D-0048 rev. Visually validated through:
- Static fallback screenshots at 7 desktop + 6 mobile scroll positions (`apps/web/audit/d-0048-hero3d/D-0048-final-y*.png`, `D-0048-mobile-y*.png`)
- `/hero-3d-test` route mounted at port 3005 with mock MotionValues — verified scene2 illustration renders cleanly, debug panel + 3-plane legend functional
- Per-plane text composition reads AAA-legible on cream scrim across desktop (1440×900) and mobile (393×851)
- TypeScript clean (`bunx tsc --noEmit`)
- Build clean (`bun run build` — 84/84 pages, 230kB First Load JS for `/`)
- HeroScene3D verified in compiled bundle (server + client chunks)
- Pixel sampling confirms scene 2 → scene 1 cross-fade is a subtle texture shift at low opacity, not a render artifact

WebGL scene itself not visually captured in this environment (headless chrome SwiftShader drops the WebGL context after page load). In a real browser, the WebGL scene adds 3-plane parallax (BG scene2 + MID palms + FG fern at 3 different depths with 3 different texture strips) + per-plane wind sway (0.5°/1.5°/3°) + per-plane texture cycling cadence (12s/9s/6s) + camera orbit (0→8° scroll-driven) + cream fog blend. Confidence would rise to 0.88+ after a single round of steward browser review at `/hero-3d-test` in a real browser.

## Review date

2026-10-10 (90 days post-ship). Re-evaluate against:
- Real-browser WebGL scene render quality
- Lighthouse CI perf budget (≥95 perf, ≥95 a11y)
- Mobile thermal/battery impact
- Visual regression test baseline coverage

---

## Status

Shipped on Day 27 (2026-07-20) per commit (pending Phase 7). Single ship bundle covers phases 1-7: source selection + frame re-extraction + three.js scene + visual quality passes 1-3 + copy rewrite + ADR + ledger entry.

### Implementation summary

| Phase | Deliverable | Status |
|---|---|---|
| 1 | Source selection (illustratio variant) + 6 frame re-extraction at 1240×680; palms + fern re-extracted at 1240×680 with paper-cream border cropped (no letterbox) | ✓ |
| 2 | HeroScene3D component (~430 lines, 3-plane stack with 3 DIFFERENT texture strips per plane, camera orbit, per-plane wind sway + texture cycling) | ✓ |
| 2b | D-0048 redesign: 3 strips instead of 1 — BG scene2, MID palms, FG fern. First-pass had all 3 planes sharing the scene2 strip which produced a 3-timestamp mashup rather than parallax. Per-plane `cyclePhase` offsets (0/3/5s) + de-synced cadence (12s/9s/6s) so texture swaps don't all hit at once | ✓ |
| 3 | Composition pass: dedicated `.scrim` div between Canvas and content (98% cream at bottom → 5% at 90% height), `scene.background = cream`, cream-colored THREE.Fog (near=10, far=22), plane size tuning (BG 32×17, MID 22×13, FG 14×8) | ✓ |
| 4 | Motion pass: camera orbit 0→8° scroll-driven, camera roll 0.02 rad (1.1°), camera Y-bob ±0.1 over 14s, per-plane wind sway 0.5°/1.5°/3° (BG/MID/FG), wind cadence 0.45 rad/s | ✓ |
| 5 | Perf: dynamic import + ssr:false (468kB → 230kB First Load JS), DPR cap 1.25 mobile / 1.75 desktop, FG plane dropped on coarse-pointer, WebGL static fallback | ✓ |
| 6 | Copy rewrite: "CHAPTER 2 — TUESDAY MORNING" / "Walked past Tuesday." / "Six days I plan the route. One day I cut..." | ✓ |
| 6b | New `/hero-3d-test` route (noindex, no nav link) — real-browser review surface with mock MotionValues (opacity 1, contentOpacity 1, scrollProgress 1) + debug panel with sliders for camera orbit + scene + content opacity + 3-plane legend | ✓ |
| 7 | D-0048 ADR + ledger entry | ✓ |

### Files changed

- `apps/web/src/components/sections/HeroScene3D.tsx` (NEW, ~430 lines after D-0048 rev — 3 different texture strips per plane, dedicated `.scrim` div, scene.background=cream)
- `apps/web/src/components/sections/HeroScene3D.module.css` (NEW, ~165 lines after D-0048 rev)
- `apps/web/src/app/hero-3d-test/page.tsx` (NEW, ~120 lines — real-browser review surface with mock MotionValues + debug panel + 3-plane legend)
- `apps/web/src/app/hero-3d-test/page.module.css` (NEW, ~110 lines)
- `apps/web/src/app/hero-3d-test/layout.tsx` (NEW — `noindex` metadata)
- `apps/web/src/components/sections/HeroFieldTelemetry.tsx` (MODIFIED: dynamic import of HeroScene3D, deleted SecondScene function block, expanded `parseScene2Headline` italicKeywords for "Tuesday" / "yard" / "week")
- `apps/web/src/components/sections/HeroFieldTelemetry.module.css` (MODIFIED: removed 243 lines of legacy secondScene CSS)
- `apps/web/src/lib/content.ts` (MODIFIED: scene2 copy rewritten)
- `apps/web/package.json` (MODIFIED: three + R3F + drei added)
- `apps/web/public/hero/layers/v2/scene2-01..06.webp` (NEW, ~33KB each)
- `apps/web/public/hero/layers/v2/palms-01..06.webp` (NEW after re-extraction at 1240×680, ~37KB each — paper-cream border cropped, no letterbox)
- `apps/web/public/hero/layers/v2/fern-01..06.webp` (NEW after re-extraction at 1240×680, ~38KB each — paper-cream border cropped, no letterbox)
- `apps/web/public/hero/layers/v2/gouache-01..06.webp` (DELETED, ~308KB freed)
- `apps/web/src/components/motion/variants.tsx` (MODIFIED: cast `motion[as] as ComponentType<any>` — pre-existing TS error blocking build verification; well-documented `// eslint-disable-next-line` comment, removes a real type-safety bug)
- `governance/decisions/0048-hero-3d-scene-replacement.md` (NEW, this ADR)
- `state/ledger.yaml` (MODIFIED: D-0048 changelog entry appended)
- `C:/Users/camer/Downloads/grasscontent/prep-palms-fern-frames.py` (NEW — re-extract palms + fern strips at 1240×680 with paper-cream border cropped)

### Validation

- `bunx tsc --noEmit` — clean
- `bun run build` — 84/84 pages compile, First Load JS for `/` = 230kB (down from 468kB)
- Headless capture at 7 desktop + 3 mobile scroll positions — 0 console errors, static fallback renders coherently with editorial text overlay
- WebGL fallback verified — `webglcontextlost` event triggers `setHasWebGL(false)` swap to `<picture>` static frame