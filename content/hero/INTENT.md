# Hero Design Intent — LargoLawn Landing Page

> **The hero is the page's hardest-working 100svh.** It carries the
> brand, the conversion CTA, the service-area signal, and (via scroll)
> a 5-plane scroll-pinned composition that turns a static storybook
> into a working operation. Every visual element on the page is
> downstream of what this section does — read this first before
> touching any hero asset.

> **See also:**
> - `research/hero-integration-plan-2026-07-22.md` — the 16-section
>   plan that documents every decision and rationale (28 KB).
> - `content/hero/manifest.yaml` — every hero asset, source, license.
> - `apps/web/src/components/sections/HeroFieldTelemetry.tsx` — the
>   production code. The big block-comment at the top of the file
>   is the single best summary of the design.
> - `governance/decisions/` — D-0042 through D-0059 (11 decisions)
>   are the ADRs that brought the hero to its current state.

---

## 1. The hero in one paragraph

The hero is a **5-plane scroll-pinned composition** (350svh tall):

```
Plane 0: vignette
Plane 1: BackgroundPhoto       — real 4K photo of a Pinellas lawn
Plane 2: HeroStorybookLayer    — hand-authored SVG: sky + sun +
                                  clouds + far palms + mid palms +
                                  3 ranch houses + 60 grass blades
                                  + 4th cartoon plane (birdbath)
Plane 3: grassSilhouette       — SVG sawtooth grass on the photo
Plane 4: SecondScene           — painted VEO scene 2 (ranch house)
                                  + 5th painted plane (fern micro-
                                  loop overlay, top-right)
```

Scroll choreography (time windows in 0..1 of the hero's 350svh):

```
[0.00, 0.10]  Storybook resting (planes 2 + 4h cartoon visible)
[0.10, 0.25]  Storybook dissolves (blur 0→14px, saturate 100%→0%,
              opacity 1→0) as the real 4K photo (plane 1) cross-
              fades in
[0.25, 0.40]  Dashboard widgets (LIVE pill, EST stamp, telemetry
              strip) rise in as a single shared fade
[0.40, 0.70]  Photo (plane 1) cross-fades out as painted scene 2
              (plane 4) cross-fades in. The 5th painted plane
              (fern micro-loop) becomes visible during this window
              and stays visible through the resting state
[0.70, 1.00]  Scene 2 resting (planes 4 + 5p painted visible).
              The fern is the most reactive element — the painted
              scene "is" while the fern "lives"
```

The hero is **NOT** a static image. It is a choreographed sequence
that proves (via the painted → photo → painted cross-fade) that the
brand illustration IS the working operation.

---

## 2. The 5-plane architecture (the 2026-07-23 expansion)

The hero is structured as 5 visual planes, each with its own
parallax cadence, animation, and visual role:

| # | Plane | Style | Source | Parallax | Role |
|---|---|---|---|---|---|
| 0 | Vignette | CSS | n/a | 0.0× fixed | Edge darkening for text legibility |
| 1 | Real photograph | Photo | `hero-green-grass.jpg` + AVIF/WebP | scroll-driven scale + cross-fade | The "working operation" anchor |
| 2 | Hand-authored SVG storybook | Cartoon | `HeroStorybookLayer.tsx` (BackgroundSky, Clouds, FarLayer, MidLayer, NearLayer, BirdbathLayer) | 0.15–1.20× | The brand illustration |
| 3 | Grass silhouette | SVG | `grassSilhouette` motion.div in `HeroFieldTelemetry.tsx` | scroll-driven opacity | Foreground mask on the photo |
| 4 | Painted VEO scene 2 | Painted | `scene2-01..06.webp` (6-frame CSS-step cycle) | 0.32× (gouache layer) | The editorial "Same yard, every week" moment |
| 5 | Painted VEO fern overlay | Painted | `fern-01..06.webp` (6-frame CSS-step cycle, multiply blend at 0.65 opacity) | n/a (sits in scene 2's local z-stack) | The "alive detail" in scene 2 |

The "4th cartoon plane" (plane 2's BirdbathLayer sub-component) and
the "5th painted plane" (plane 4's `.fernLayer` sub-component) are
the 2026-07-23 additions that filled the previous gaps:
- The 4th cartoon plane (hand-drawn birdbath with a small bird) sits
  in the foreground dead space — the lower-center area between the
  houses and the grass band. It is the focal point of the dead space.
- The 5th painted plane (fern micro-loop, mirrored via scaleX(-1) to
  anchor at the top-right) overlays the painted scene 2 with a
  subtle 8s cycle. It is the "alive detail" in the scene 2 resting
  state.

---

## 2. Asset classification (the painted-vs-real rule)

The hero's source library (`C:/Users/camer/Downloads/grasscontent/`
+ `apps/web/public/hero/`) contains 14 mp4 clips. They fall into
5 tiers, and **the tiers do not mix**.

| Tier | Aesthetic | Use on the page | Files |
|---|---|---|---|
| **A. Painted hero** | Hand-authored SVG cartoon | Scene 1 background + 4th cartoon plane | `BackgroundSky`, `Clouds`, `FarLayer`, `MidLayer`, `NearLayer`, `BirdbathLayer` (all in `HeroStorybookLayer.tsx`) |
| **B. Painted hero BG/MID** | VEO-painted gouache | Scene 2 background | `Hand-painted_gouache_illustratio_*` → `apps/web/public/hero/layers/v2/scene2-01..06.webp` |
| **C. Painted micro-loops** | VEO-painted gouache | **Fern is now MOUNTED** as the 5th painted plane (above scene 2). Palms + songbirds remain on disk for future secondary use. | `Fern_swaying_in_painting` → `fern-01..06.webp` (mounted); `Palm_trees_sway_in_painting`, `Songbirds_flying_on_hedge` → `palms-*.webp`, `songbirds-*.webp` (reserved) |
| **D. Painted secondary** | VEO-painted gouache | Reserved for future secondary sections | `painting_still` (top-down lawn), `Egret_standing_in_shallow_water`, `Seagull_gliding_across_sky` |
| **E. Real photographic** | 4K cell-phone footage | Quarantined — `BehindTheScenes` section (split into 2 instances: "The truck" + "The yard"), NOT in hero | `Riding_mower_cutting_lawn_*` → `apps/web/public/hero/bts/real-mower-{01,02}.mp4` |
| **F. Audio** | — | **REMOVED 2026-07-23 per steward decision** ("audio isn't necessary"). The hero is 100% visual. | n/a (was `brielle_ref.mp3` → `apps/web/public/hero/audio/ambient-loop.mp3`; deleted) |

**Why E does not enter the hero:** the painted gouache world and the
real photographic world are at incompatible fidelity levels. Mixing
them reads as "stock gallery with one photo thrown in" — the v1
bleed failure mode. The hero is 100% painted; real footage lives
in its own section with its own visual identity (white card on
cream, dashed border, paper-tape label), split into 2 instances
since 2026-07-23 ("The truck" + "The yard") so the operator identity
and the craft signal each get their own editorial moment.

**Why C fern is mounted but palms/songbirds are not:** per the
D-0049 rev 4 painted/cartoon lesson, painted VEO brushwork
stacks with painted VEO brushwork (and only with itself). The
fern is mounted as a multiply-blend overlay ABOVE the painted
scene 2 (Tier B), which satisfies the rule. The palms and
songbirds are larger painted scenes (full-bleed frame strips, not
foreground details) — they would compete with scene 2 if overlaid,
which is the D-0049 rev 2 reason palms was dropped. They stay on
disk for future secondary use.

---

## 3. The painted-vs-cartoon lesson (D-0049 rev 4 — the rule that must not be re-broken)

**VEO-painted gouache brushwork** and **hand-authored SVG cartoon**
are at different fidelity levels:

- The SVG cartoon is flat-fill, perfect arcs, 60fps animation
  primitives — it reads as a designed illustration.
- The VEO gouache is brushy, watercolor-textured, hand-painted
  — it reads as a real painted artwork.

Rendered together in the same panel, the eye reads them as **two
different scenes fighting for the same space**, not as foreground
depth on a coherent background. The eye sees:
- A flat house (cartoon) + a brushy house (VEO) = "two houses"
- A flat palm (cartoon) + a brushy palm (VEO) = "two palms"
- A sun emoji (cartoon) + a sunburst (VEO) = "two suns"

**The rule:** painted VEO brushwork and hand-authored SVG cartoon
do not coexist in the same visual register. Either:
- The scene is all cartoon (current Scene 1) — use SVG only
- The scene is all painted (current Scene 2) — use VEO only
- The scene is all photo (the [0.10, 0.40] photo band) — use photo only

If a future iteration wants to add a 4th plane to the hero, the
4th plane must be either:
- A new SVG cartoon layer (matching the existing style)
- A new painted VEO layer that REPLACES the cartoon scene entirely

It must NOT be a mix.

---

## 4. Locked palette tokens (no deviations)

Every color used in the hero is a `--ll-*` token in
`apps/web/src/styles/tokens.css`. There are no one-off hex values
in the hero CSS modules. If a new asset (a future gravel-path loop,
a future hedge-trim loop) introduces a color outside the locked
palette, the asset is wrong, not the palette.

| Token | Hex | Use |
|---|---|---|
| `--ll-green` | `#1f4e2c` | Primary brand green, CTA hover |
| `--ll-sand` | `#d4a574` | Secondary accent, Florida earth |
| `--ll-sky` | `#3b7dd8` | Trust / links / focus rings |
| `--ll-charcoal` | `#1a1a1a` | Body text |
| `--ll-cream` | `#faf6f0` | Backgrounds (warm off-white) |
| `--ll-palm-shadow` | `#2d5a3d` | Deep green, section bg |
| `--ll-palm-light` | `#6b9b7e` | Subdued green, tag bg |
| `--ll-grass-mow` | color-mix(green 30%, palm-shadow) | Freshly-cut grass |
| `--ll-grass-deep` | color-mix(palm-shadow 70%, green) | Deep grass |
| `--ll-sun` | `#e8b65a` | Warm gold, ribbon / badge / CTA |
| `--ll-sun-pale` | color-mix(sun 30%, cream) | Very light peach, hero sky |
| `--ll-sun-light` | color-mix(sun 50%, cream) | Light warm yellow, hero sky |
| `--ll-sun-deep` | color-mix(sun 70%, cream) | Deeper warm orange, hero sky |
| `--ll-clay` | `#b5651d` | Brick accent, emphasis |
| `--ll-sand-bleached` | `#f4e8d0` | Warm bone, section bg, paper-tape |
| `--ll-shell` | `#ffffff` | Pure white, card bg |
| `--ll-palm-bark` | `#1a1f1b` | Near-black with green tint, outlines |
| `--ll-sage-muted` | `#8fa89b` | Muted green, borders / dividers |

The `color-mix(in oklab, ...)` derivatives are computed at use
time, not pre-mixed — so changing `--ll-sun` propagates to
`--ll-sun-pale/-light/-deep` automatically.

---

## 5. Audio: removed 2026-07-23 per steward decision ("audio isn't necessary")

The hero previously carried an ambient audio loop
(`brielle_ref.mp3` renamed to `ambient-loop.mp3` in
`apps/web/public/hero/audio/`) with a `MuteToggle` component
for opt-in playback. This shipped in commit `17d8491` on
`feat/hero-audio-bts-2026-07-22` but was removed on 2026-07-23
per the steward's direct decision that audio isn't necessary
for the landing page. The hero is now 100% visual.

If a future iteration wants ambient audio back, the prior
implementation pattern is documented in git history (commits
`17d8491` and `6cf4b4a`). The tradeoffs (autoplay policy,
localStorage persistence, `prefers-reduced-data: reduce`
opt-out, loop seam verification) are all addressed in
`research/hero-integration-plan-2026-07-22.md` §9.

---

## 6. The "do not" list (read this before making changes)

- **Do not mix painted VEO brushwork with the hand-authored SVG
  cartoon in the same scene.** See §3. This is the single most
  important rule.
- **Do not add new colors to the hero outside the locked palette.**
  See §4. If a new asset needs a new color, escalate — do not
  one-off a hex value in a CSS module.
- **Do not apply a "painterly" CSS filter to real footage to
  force it into the hero.** The result looks uncanny, not painted.
  See `research/hero-integration-plan-2026-07-22.md` §13.
- **Do not delete the four files at
  `apps/web/public/hero/v2/`** (`hero-green-grass.jpg`,
  `desktop.avif/webp`, `mobile.avif/webp`). They are the active
  production photo layer loaded by the `<picture>` element in
  `BackgroundPhoto`. The only true orphan in the hero tree is
  the (now-deleted) `apps/web/public/hero/layers/palm.webp` v1
  attempt.
- **Do not commit `.env` or any secrets to the hero asset tree.**
  Use `.env.example` as the contract.
- **Do not push to a remote before reading
  `state/ledger.yaml → next_actions` and confirming the steward
  is ready.** This is the GRASS-wide rule, not hero-specific,
  but it applies.

---

## 7. Scripts (for the next iteration)

| Script | What it does |
|---|---|
| `scripts/prep-loop-frames.py` | Original Wave 4 prep. Re-extracts scene2 + palms + ferns from the VEO source clips at the 1240:680:20:20 crop (no black letterbox bars). |
| `scripts/prep-fern-bottom-anchored.py` | New (2026-07-22). Bottom-anchored fern strip. Use this if a future iteration wants fern fronds entering from the top of a 4th grass-band plane with the tip rooted in the band. |
| `scripts/prep-grass-tuff-strip.py` | New (2026-07-22). Grass-tuft foreground strip from the illustratio source. Use this if a future iteration wants to replace the SVG NearLayer with a painted VEO grass band. |
| `scripts/palette-validate.py` | New (2026-07-22). Brand-token compliance check for any new image asset. Reports which pixels are within brand tolerance and which are outliers. |
| `scripts/hero-capture.py` | New (2026-07-22). Playwright-based visual capture at 3 viewports. Use this for visual regression baseline captures before/after a hero change. |

All scripts have a `--dry-run` mode that prints the planned
operations without writing. Run from the project root with
`python scripts/<name>.py --help` to see all options.

---

## 8. Open questions (for the steward)

These are the decisions only the steward can make:

1. **Should the 4-plane hero rebuild (painted micro-loops
   re-mounted as a 4th plane) ever happen?** The assets are
   on disk and the prep scripts are written. The blocker is
   the painted/cartoon lesson in §3 — the answer depends on
   whether the steward wants the future 4th plane to be
   cartoon (matching the SVG style) or painted (replacing
   the SVG cartoon entirely).
2. **Should the birdbath from the chosen `illustratio` source
   be lifted out as a static sprite in the foreground?** It
   was a hero-plan decision (#2) that turned out to be N/A for
   the current 3-scene composition. If a 4-plane rebuild
   happens, revisit this.
3. **Should the audio file be re-edited for a cleaner loop
   seam?** The current `ambient-loop.mp3` is the raw
   `brielle_ref.mp3` (2.74s, 80KB). The loop seam is
   unverified.
4. **Should the `BehindTheScenes` section be promoted to a
   full editorial moment** (with a hand-drawn route map
   overlay, a pull-quote, etc.) matching the FieldLog
   treatment? It currently sits in a single card.

---

## 9. Changelog (design decisions, newest first)

| Date | Decision | What changed |
|---|---|---|
| 2026-07-22 | Wave 4 → 2.5D rebuild reverted to pure-CSS | SecondScene re-uses scene2-*.webp as full-bleed background instead of Three.js planes. D-0049. |
| 2026-07-22 | Audio integration + BehindTheScenes | 3-item revised scope shipped on `feat/hero-audio-bts-2026-07-22` branch. Commit `17d8491`. |
| 2026-07-19 | Painted micro-loops REMOVED from storybook | Ferns + palms + songbirds webp strips stayed on disk but were no longer mounted in the storybook. D-0049 rev 4. |
| 2026-07-17 | Wave 4 — second pinned scene | Painted scene 2 (illustratio) introduced as a scroll-locked editorial moment. D-0048. |
| 2026-07-15 | Cinematic cross-fade | Storybook → photo with blur + saturate dissolve. D-0043. |
| 2026-07-15 | HeroFieldTelemetry (3-scene composition) | Replaces HeroCinematic (SDXL painterly), HeroMowerScene (200svh scroll-pinned SVG), HeroFieldTelemetryScene (WebGL). D-0042. |
