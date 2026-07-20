# grasscontent Asset Integration Memo

> **Date:** 2026-07-19
> **Owner:** Steward + Claude Code
> **Source:** `C:\Users\camer\Downloads\grasscontent\` (11 MP4 + 1 PNG + 1 MP3) — steward-supplied artistic library
> **Frames inspected:** `C:\Users\camer\Downloads\grasscontent\frames\` (11 JPGs at t=4s, 1280×720)
> **Companion:** `apps/web/audit/d-hero-diagnostic/memo.md` (which assets the missing hero layers need)

## TL;DR

Of 11 video assets, **7 are candidates for integration** into the hero (or a future second-scene) and **4 are off-theme or out-of-scope**. The strongest storytelling matches are:

- **Wave 3 (Option C) — fern + songbirds motion:** `Fern_swaying_in_painting_202607171905.mp4` and `Songbirds_flying_on_hedge_202607171735.mp4` are visually perfect for the two missing `useViewportMotion` layers. Both share the brand palette and would render as looping parallax accents at zero design cost.
- **Wave 4 (Option B) — second pinned scene:** `Hand-painted_gouache_storybook_painting_202607171737.mp4` (sun + four palms, symmetry) is a *drop-in* replacement for the storybook layer once the photo has settled. It would create the genuine "second scene after the photo" moment the user is asking for.
- **Discard:** the two `Egret_standing_in_shallow_water_*.mp4` files and `Seagull_gliding_across_sky_*.mp4` are coastal-water imagery — wrong biome (Pinellas is suburban lawns, not saltwater marsh).

The garden-lawn scenes (`Riding_mower_cutting_lawn_*.mp4` ×2) and the lawn-texture abstract (`Hand-painted_gouache_painting_still_202607171732.mp4`) are *on-palette but content-clashing* with the current hero photographic style — recommend holding for Wave 5+ only if a dedicated "operator on the mower" hero storyboard is built. `Hand-painted_gouache_illustration_202607171636.mp4` (Palm Harbor villa at golden hour) is the highest-fidelity brand match and could anchor a hero re-cut at twice the cost.

## Asset-by-asset classification

| Asset | Frame | Palette fit | Hero slot | Verdict |
|---|---|---|---|---|
| `Fern_swaying_in_painting_202607171905.mp4` | fern frond, deep green → tan, soft cream backdrop | **Excellent** — fern is a brand botanical (used as decorative ornament on `PricingTiers`) | Missing `fern` motion layer (D-0044) | **INTEGRATE — Wave 3** |
| `Songbirds_flying_on_hedge_202607171735.mp4` | tall palm + sun-lit hedge + 2 birds perched | **Excellent** — same palm/sun/grass palette the hero already uses | Missing `songbirds` motion layer (D-0044) | **INTEGRATE — Wave 3** |
| `Hand-pasted_gouache_storybook_painting_202607171737.mp4` | symmetric palms × 4 + sun disc on cream | **Excellent** — straight "storybook" art, parallel to existing `HeroStorybookLayer` SVG | Second pinned scene (Option B) | **INTEGRATE — Wave 4** |
| `Hand-pasted_gouache_illustration_202607171636.mp4` | full Pinellas villa + palms + lawn + sun + 2 riding mowers | **Excellent** — most faithful brand integration of any asset | Optional hero re-cut (Wave 5+) | **HOLD — golden-hour full illustration** |
| `Hand-pasted_gouache_painting_still_202607171732.mp4` | abstract geometric lawn (greens + tans) + clovers | **Good** — brand colors but abstract, no narrative | Optional decorative layer or pattern background | **HOLD — abstract pattern** |
| `Palm_trees_sway_in_painting_202607171659.mp4` *(mis-typed `Palm_trees_sway_in_painting_202607171659.jpg` file)* | villa + palms + sun | **Good** — duplicates storybook aesthetic but with house | Sub-storybook scene if storybook frame is too minimal | **HOLD — secondary storyboard** |
| `Riding_mower_cutting_lawn_202607171601.mp4` | wide aerial: red mower on row of houses with palms | **Mixed** — on-brand palms + warm light but realistic photo style clashes with gouache storybook | "Operator on the job" hero re-cut (Wave 5+) | **HOLD — operator-on-the-job footage** |
| `Riding_mower_cutting_lawn_202607171603.mp4` | close: red mower + operator in red | **Mixed** — same realistic-vs-illustrated tension as above | Same as above | **HOLD — operator close-up footage** |
| `Egret_standing_in_shallow_water_202607172016.mp4` | white egret in shallow water + palm skyline + cream sky | **Off-theme** — saltwater-biome imagery, not Pinellas lawns | None | **DISCARD** |
| `Egret_standing_in_shallow_water_202607172016_202607172038.mp4` | duplicate of above | **Off-theme** | None | **DISCARD** |
| `Seagull_gliding_across_sky_202607171810.mp4` | single gull gliding over water horizon at sunset | **Off-theme** — coastal silhouette, reinforces the saltwater-bird biome mismatch | None | **DISCARD** |

## Recommendations by wave

### Wave 3 (Option C) — restore 6-layer motion

| D-0044 layer | Original intent | Recommended asset | Integration plan |
|---|---|---|---|
| `fern` | Foreground fern silhouette that sways as user scrolls | `Fern_swaying_in_painting_202607171905.mp4` | Extract fern against transparent background as `.webm` + `.webp` (single-frame fallback). Render as foreground layer in `HeroStorybookLayer` with cadence 0.22 from `useViewportMotion`. Position bottom-right of storybook panel, scale to ~30% width |
| `songbirds` | Bird V-shapes drifting across the sky | `Songbirds_flying_on_hedge_202607171735.mp4` | Extract the 2 perched birds + the framing palm against transparent background. Render as mid-layer (between storybook clouds and lawn). Drifts across scroll [0.0, 0.4] via MotionValue. Position upper-third, scale to ~25% width |

**Asset prep needed:** Both MP4s have black letterbox bars (the songbirds frame especially). Before integration, run `ffmpeg` crop filter to remove bars, then either:
1. Export as `.webm` (VP9 alpha channel) for video + transparent fallback
2. Or extract a representative frame at t=4s as `.webp` (transparent if the source frame can be keyed)

Estimated prep time: 30-45 minutes for both.

### Wave 4 (Option B) — second pinned scene after photo

**Strongest candidate:** `Hand-painted_gouache_storybook_painting_202607171737.mp4`. This is a 9-second, perfectly symmetric, palm + sun illustration that already matches the storybook layer's visual language. Replacing or appearing *after* the resting photo, it would create the genuine "second scene after the second photo" effect the user requested in Option B.

**Scene architecture:**
- Hero height extends from `200svh` to `350svh` (per Option B spec)
- Scroll [0.0, 0.4]: original storybook → photo cross-fade (unchanged from current)
- Scroll [0.6, 1.0]: photo fades to opacity 0, gouache scene fades to opacity 1
- Subtle dashboard widgets persist across both scenes (LiveStatus / FieldStamp / TelemetryStats) with content updates between scenes via `heroScene2` block in `lib/content.ts`

**Alternative secondary:** the `Hand-painted_gouache_illustration_202607171636.mp4` (Palm Harbor villa full scene) is *more visually rich* than the storybook painting but pushes the hero closer to "single static illustration" rather than "evolving scene." Recommend deferring to a later Wave 5 if a dedicated operator-moment hero is wanted.

### Discard rationale

The egret and seagull assets depict **saltwater marsh / open Gulf** — a coastal biome that doesn't match Mission 1's Pinellas suburban-lawn service area. If the steward later expands into storm-prep coastal services, these would re-enter scope as storm-front atmospheric inserts. For the current hero, they would create tonal dissonance (the page is about a 1-man lawn-care operation in 33771, not an estuarine wildlife documentary).

## Style / brand consistency notes

Across the 11 frames inspected, three observations stand out:

1. **Gouache illustration > photoreal** for the current hero. The 3 gouache MP4s are visually consistent with the storybook SVG already in `HeroStorybookLayer.tsx`. The 2 riding-mower MP4s are realistic video and would clash with the existing illustrated aesthetic unless the hero itself is rebuilt around video.
2. **The Pinellas house pattern repeats.** Three frames show a single-story stucco villa with palms and emerald lawn — a duplicate motif that suggests the source prompts were templated. This could be a strength (consistent environment) or a weakness (visually repetitive) depending on whether they cut together or stand alone.
3. **All frames carry a star/diamond watermark in the lower right.** This is a generation artifact. It must be cropped or composited over before any asset is shipped to production. `ffmpeg` can mask this with a delogo filter or it can be cropped to `1270×720` to remove the lower-right ~10px region.

## Asset prep checklist (for steward ratification)

Before any Wave 3 / Wave 4 integration, the following prep is required:

- [ ] Remove star watermark (ffmpeg delogo or crop to 1270×720)
- [ ] Remove black letterbox bars on songbirds + fern (ffmpeg crop with auto-detection)
- [ ] Export each as `.webm` (alpha) + `.webp` (single-frame fallback) at 2 sizes (full + 50%)
- [ ] Move finalized files into `apps/web/public/hero/layers/` mirroring the existing layer directory pattern
- [ ] Verify Lighthouse perf score doesn't regress (target: ≥95 desktop, ≥90 mobile)
- [ ] Update `state/capability-registry.yaml` to register each new layer as a hero layer capability with maturity `experimental`
- [ ] Update `governance/decisions/0047-grasscontent-integration.md` to record the asset provenance, license terms (assumed internal-use from VEO generation), and approval trail

## Open questions for the steward

1. **Provenance + licensing:** are these VEO-generated assets usable in production, or are they exploration scratch? The `.mp3` named `brielle_ref.mp3` suggests iterative reference work. We'd want to ratify "use in production" before they appear in the public landing page.
2. **Wave 3 vs Wave 4 priority:** should the missing `fern` + `songbirds` layers ship together (Wave 3), or do we prioritize the second-scene storybook for the visible "additional scene" effect (Wave 4)?
3. **Operator-mower footage:** do we have any underlying intuition that the steward wants a "operator on the job" hero re-cut at some future date? If so, holding the 2 mower MP4s for that makes sense; otherwise they may be better off as supply-catalog-only.

---

## Appendix: file inventory

```
grasscontent/
├── brielle_ref.mp3                              (audio reference, not visual)
├── Screenshot 2026-07-17 185603.png             (steward QA with brown-band + right-edge mask notes)
├── Egret_standing_in_shallow_water_202607172016.mp4              — DISCARD
├── Egret_standing_in_shallow_water_202607172016_202607172038.mp4  — DISCARD
├── Fern_swaying_in_painting_202607171905.mp4                     — Wave 3 (fern layer)
├── Hand-pasted_gouache_illustration_202607171636.mp4             — HOLD (golden-hour full illustration)
├── Hand-pasted_gouache_painting_still_202607171732.mp4           — HOLD (abstract pattern)
├── Hand-pasted_gouache_storybook_painting_202607171737.mp4       — Wave 4 (Option B second scene)
├── Palm_trees_sway_in_painting_202607171659.mp4                  — HOLD (secondary storyboard)
├── Riding_mower_cutting_lawn_202607171601.mp4                    — HOLD (operator-on-the-job footage)
├── Riding_mower_cutting_lawn_202607171603.mp4                    — HOLD (operator close-up footage)
├── Seagull_gliding_across_sky_202607171810.mp4                   — DISCARD
└── Songbirds_flying_on_hedge_202607171735.mp4                    — Wave 3 (songbirds layer)
```

*(Hand-pasted was a typo above for Hand-painted — corrected in narrative.)*
