# Hero Design Intent — LargoLawn Landing Page

> **The hero is the page's hardest-working 100svh.** It carries the
> brand, the conversion CTA, the service-area signal, and (via scroll)
> a 3-scene narrative that turns a static storybook into a working
> operation. Every visual element on the page is downstream of what
> this section does — read this first before touching any hero asset.

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

The hero is a **3-scene scroll-pinned composition** (350svh tall):

```
[0.00, 0.10]  Scene 1 resting
              Hand-authored SVG storybook: sun + clouds + far palms
              + mid palms + 3 ranch houses + 60 grass blades.
              Editorial copy: "Your neighbor's lawn mower."

[0.10, 0.25]  Scene 1 dissolves
              Storybook blurs (0 → 14px) + desaturates (100% → 0%)
              + fades opacity 1 → 0. Real 4K photo of a Pinellas
              lawn cross-fades in below.

[0.25, 0.40]  Dashboard widgets rise
              LIVE pill (top-right), EST stamp (bottom-left),
              4-stat telemetry strip (bottom-right). Single shared
              fade-in, no staged element exits.

[0.40, 0.70]  Photo dissolves to Scene 2
              The photo cross-fades out as the painted gouache
              scene 2 (a Florida ranch house with palms, sun, mowed
              lawn) cross-fades in. Painted editorial pull-quote:
              "Same yard, every week."

[0.70, 1.00]  Scene 2 resting
              Painted scene 2 + editorial pull-quote + a small
              palms micro-loop in the lower-right corner.
```

The hero is **NOT** a static image. It is a choreographed sequence
that proves (via the painted → photo → painted cross-fade) that the
brand illustration IS the working operation.

---

## 2. Asset classification (the painted-vs-real rule)

The hero's source library (`C:/Users/camer/Downloads/grasscontent/`
+ `apps/web/public/hero/`) contains 14 mp4 clips + 1 audio. They
fall into 5 tiers, and **the tiers do not mix**.

| Tier | Aesthetic | Use on the page | Files |
|---|---|---|---|
| **A. Painted hero** | Hand-authored SVG cartoon | Scene 1 background | `BackgroundSky`, `Clouds`, `FarLayer`, `MidLayer`, `NearLayer` (all in `HeroStorybookLayer.tsx`) |
| **B. Painted hero BG/MID** | VEO-painted gouache | Scene 2 background | `Hand-painted_gouache_illustratio_*` → `apps/web/public/hero/layers/v2/scene2-01..06.webp` |
| **C. Painted micro-loops** | VEO-painted gouache | On-disk, not currently mounted (rejected for cartoon scene per D-0049 rev 4; available for future 4-plane rebuild) | `Fern_swaying_in_painting`, `Palm_trees_sway_in_painting`, `Songbirds_flying_on_hedge` → `fern-*.webp`, `palms-*.webp`, `songbirds-*.webp` |
| **D. Painted secondary** | VEO-painted gouache | Reserved for future secondary sections | `painting_still` (top-down lawn), `Egret_standing_in_shallow_water`, `Seagull_gliding_across_sky` |
| **E. Real photographic** | 4K cell-phone footage | Quarantined — `BehindTheScenes` section only, NOT in hero | `Riding_mower_cutting_lawn_*` → `apps/web/public/hero/bts/real-mower-NN.mp4` |
| **F. Audio** | MP3 ambient loop | Hero-only, user toggle, muted by default | `brielle_ref.mp3` (renamed) → `apps/web/public/hero/audio/ambient-loop.mp3` |

**Why E does not enter the hero:** the painted gouache world and the
real photographic world are at incompatible fidelity levels. Mixing
them reads as "stock gallery with one photo thrown in" — the v1
bleed failure mode. The hero is 100% painted; real footage lives
in its own section with its own visual identity (white card on
cream, dashed border, paper-tape label).

**Why C is on disk but not mounted:** the painted micro-loops
(ferns, palms, songbirds) were originally added to the storybook
in D-0044 and removed in D-0049 rev 4 because the painted
brushwork clashed with the hand-authored SVG cartoon. The webp
strips stay on disk so a future 4-plane rebuild (using re-painted
cartoon-style assets, not the existing VEO brushwork) can slot
back in without re-running the prep pipeline.

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

## 5. The audio: muted by default, opt-in, opt-out for data savings

The hero's ambient audio is `brielle_ref.mp3` (renamed to
`ambient-loop.mp3` in `apps/web/public/hero/audio/`). Behavior:

- **Muted by default.** Autoplay policies on mobile + desktop
  browsers require a user gesture before any audio plays, so
  muted-by-default is the only defensible default.
- **Click the toggle** to start. Sets volume to 30%, persists
  the choice in `localStorage` under `largo.hero.audio.muted`.
- **`prefers-reduced-data: reduce`** omits the audio element
  entirely. The user does not pay the data cost.
- **Native `<audio loop preload="none">`** — no Web Audio API
  bundle cost, no autoplay-policy gymnastics. The element is
  a DOM node; it keeps playing after the hero scrolls off.
- **Toggle position:** bottom-right of the hero, 28px desktop /
  32px mobile. Z-index 12 (above LiveStatus + TelemetryStats at
  z 11). 60% opacity until hover.

The audio's loop seam should be verified by spectrogram in a
future QA pass — the file is 2.74s and the assumption is that
the loop is seamless, but this has not been verified.

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
