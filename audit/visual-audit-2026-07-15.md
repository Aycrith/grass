# Visual Audit — Largo Lawn Home Page

**Date:** 2026-07-15
**Scope:** `/` (Landing) — 14 sections, `apps/web/src/components/sections/`
**Read-only inspection.** No files modified, no images generated, no commits made.
**Baseline:** the homepage is now consistent in painted storybook across the painted
hero, the painted services cards, the painted operator portrait, and the
v3 `pinellas-palm` + `mower-side-profile` + `logo-mark` accents. The remaining
visual work is concentrated in two zones: (a) small inline line-art icons that
sit on top of painted cards, and (b) the full-section hand-drawn map.

---

## TL;DR

The homepage is 90% there on the painted storybook pivot. The biggest
*visible* gap is **10 hand-authored SVG line-art icons** (6 in `ServiceBentoIcon`,
4 in `ProcessStepIcon`) that sit directly on top of painted v3 webp cards —
they break the visual language every scroll of sections 03 and 05. The next
biggest is the **line-art `quote-mark.svg`** ornament in the closing
`FinalCTABanner`. After that, the only full-bleed hand-drawn section left is
the **`ServiceAreaMap` peninsula**.

---

## 1. Top recommendations (ranked by impact / effort)

### 1.1 · Replace 10 inline line-art icons with painted v3 illustrations
**Effort:** M (2–3 SDXL prompts: one per icon class, gated by the `_style-block.md`
anchor + storybook LoRA at 0.75 + IP-Adapter 0.55, ~1 hr including curation)
**Impact:** HIGH — these icons are the only line-art left in the painted middle
of the page; they sit on top of the painted v3 service webps and the painted
mowing image used as the ProcessSteps header.
**Files to change:**
- `apps/web/src/components/sections/ServiceBentoIcon.tsx` (6 cases:
  `mowing`, `edging`, `mulching`, `hedge-trimming`, `hurricane-prep`,
  `seasonal-cleanup`)
- `apps/web/src/components/sections/ProcessStepIcon.tsx` (4 cases:
  `01` phone, `02` calendar, `03` mower, `04` receipt)
- New: `apps/web/public/illustrations/icon-{mowing,edging,mulching,hedge,
  hurricane,leaves,phone,calendar,mower,receipt}-v3-{72,120}.webp` plus
  matching `.md` prompt files in `apps/comfyui/prompts/`
- Wrapper change: replace inline `<svg>` with `<Illustration src="…" />` so
  the same `Illustration` lazy-loading + `tone="dark"` switch keeps working
  for cards on dark backgrounds

**Outcome:** ten small line-art icons become ten small storybook gouache
accents, the visual language reads continuous from the painted hero down
through the painted cards and into the FAQ.

---

### 1.2 · Replace `quote-mark.svg` in `FinalCTABanner` with a painted v3 ornament
**Effort:** S (one prompt — the existing `quote-mark.svg` is 921 bytes of
thin-stroke line art in a section that's the page closer)
**Impact:** MEDIUM — this is the **last visual on the page**. A line-art
quote mark after a journey of painted storybook imagery registers as
"templates ran out." A small painted seagull-or-sun-burst ornament closes
the storybook loop.
**Files to change:**
- `apps/web/src/components/sections/FinalCTABanner.tsx:33-37` — swap
  `src="/illustrations/quote-mark.svg"` for the new v3 webp
- New: `apps/web/public/illustrations/quote-mark-v3-120.webp` +
  `apps/comfyui/prompts/quote-mark-v3.md`
- Optional delete: `apps/web/public/illustrations/quote-mark.svg` (only
  reference is this one site)

**Outcome:** the closing CTA's opening mark joins the painted storybook
language and the dark `--ll-palm-shadow` background stops fighting a
thin-stroke SVG.

---

### 1.3 · Paint the full Pinellas peninsula in `ServiceAreaMap`
**Effort:** L (one careful SDXL prompt — the peninsula silhouette has to
read as recognizable Florida-Pinellas, then the 6 ZIP pins must be
re-aligned to a new reference image; the section also carries an
interactive hover/focus sync between the SVG pins and the side-rail
ZIP list)
**Impact:** MEDIUM-HIGH — this is the only **full-bleed, full-section**
hand-authored SVG left on the homepage (sections 01–05, 07–09 all use
painted webp). It's the one place a visitor sees "I drew this in Illustrator"
on a 1280px-wide surface.
**Files to change:**
- `apps/web/src/components/sections/ServiceAreaMap.tsx:62-93` — the
  peninsula `<path>` (and the 6 pin `<Link>` wrappers) stay; the peninsula
  shape becomes a `<image>` background underneath the still-clickable pins
- `apps/web/src/components/sections/ServiceAreaMap.module.css` — pin
  sizing may need to retune (the new painted peninsula will have a
  different aspect ratio)
- New: `apps/web/public/illustrations/pinellas-peninsula-v3.webp` (or
  reuse `areas/*.webp` if one is close enough) + matching prompt
- Keep the click-targets as a transparent SVG overlay so accessibility +
  the WP14 hover/focus sync are preserved

**Outcome:** section 06 stops being the visual outlier; the painted
Peninsula matches the painted wordmark lockup above and the painted
Schedule timeline below.

---

### 1.4 · Replace the 3 lucide-react icons in the `HeroCinematic` trust row
**Effort:** S (one prompt per glyph at small size, or repurpose the
v3 `pinellas-palm` style — the trust row already has a palm at 72px in
the operator signature, so a consistent small-painted-glyph set is
easy)
**Impact:** MEDIUM — above-the-fold, first-paint visible. The hero
image is painted; the trust row right below it is `MapPin` / `Clock` /
`Phone` from lucide-react, which is thin-stroke modern generic. The
reader registers "painted scene + 3 stock icons" as mixed signal.
**Files to change:**
- `apps/web/src/components/sections/HeroCinematic.tsx:90-101` — replace
  the 3 `<MapPin>` / `<Clock>` / `<Phone>` JSX with `<Illustration>`
  wrappers around new v3 glyphs (or skip the icons and use a clay-bullet
  like the OperatorStrip `toolBar` already does — that's the cheapest
  move and matches an existing pattern)
- New: `apps/web/public/illustrations/glyph-{pin,clock,phone}-v3-24.webp`
  (or none if you go the clay-bullet route)
- New prompt file: `apps/comfyui/prompts/glyph-set-v3.md`

**Outcome:** first-paint reads as "all painted, all storybook" — no
modern-icon stock interruption in the trust row.

---

### 1.5 · Upgrade the ScheduleTimeline "today" mower anchor
**Effort:** S (verify sizing, possibly one prompt if the current tile
reads too small)
**Impact:** LOW-MEDIUM — the current `mower-side-profile-v3-120.webp`
(858 bytes) sits at `max-width: 7.5rem` with `mix-blend-mode: multiply`.
The painted detail is there but visually quiet next to the day name +
ZIPs. A larger, more confidently painted mark (mower + a tuft of
St-Augustine grass under it, e.g. 200px wide) would let the "today"
affordance land.
**Files to change:**
- `apps/web/src/components/sections/ScheduleTimeline.tsx:105-110` — bump
  width/height from 120 to 200
- `apps/web/src/components/sections/ScheduleTimeline.module.css` —
  update `.todayMower { max-width: 12.5rem; }` and possibly
  adjust `mix-blend-mode`
- New: `apps/web/public/illustrations/mower-side-profile-v3-200.webp`
  (could just be a 2× upscale of the existing 240px asset already on
  disk, but a v4 with grass tuft would be richer)
- Prompt file (optional): `apps/comfyui/prompts/mower-side-v4.md`

**Outcome:** the "this is the day the mower shows up" moment gets the
visual weight it deserves as a brand-defining trust signal.

---

## 2. Quick wins already noted (on the do-later list)

Per the brief, these are flagged in prior decisions / governance notes
and are already on the radar. Listed here so the next pass picks them up.

| Item | Where it lives | Status |
|---|---|---|
| **v3 painted wordmark** for the `LogoLockup` (replaces Fraunces text) | `LogoLockup.tsx:30`, `LogoLockup.module.css` | current Fraunces 1.3rem @ opsz 144 already reads editorial; upgrade is a polish, not a fix |
| **logo-mark-inverse v3** (light-on-dark painted variant) | `public/logo-mark-inverse.svg` (749 B line art) | needed for the dark `FinalCTABanner` background and possibly the dark `ServiceAreaMap` |
| **apple-touch-icon v3** | `public/apple-touch-icon.svg` (1.3 KB line art) | iOS home-screen painted mark |
| **favicon / icon v3** | `public/icon.svg` (656 B) + `public/manifest.webmanifest` | browser tab + PWA install painted mark |
| **`LogoMark` `variant="line"`** still references `/logo-mark.svg` (868 B line art) | `LogoMark.tsx:35` | kept intentionally per the component comment (GBP asset generation / fallback) — confirm this is the desired behavior, not a leftover |

---

## 3. Dead assets to prune (low effort, cleanup)

`grep` across `apps/web/src` confirms the following are on disk but
referenced by **zero** active components. They are leftovers from the
v1→v3 painted upgrade. Each is dead bytes + dead code-search noise
that will confuse the next SDXL prompt author who's hunting for an
existing asset.

**On disk, no source reference (11 files):**
- `public/illustrations/clock.svg`
- `public/illustrations/compass-dial.svg`
- `public/illustrations/edge-blade-detail.svg`
- `public/illustrations/hedge-line.svg`
- `public/illustrations/leaf-pile.svg`
- `public/illustrations/mulch-pile.svg`
- `public/illustrations/pack-mule.svg`
- `public/illustrations/phone-ringing.svg`
- `public/illustrations/pin-on-map.svg`
- `public/illustrations/storm-front.svg`
- `public/illustrations/wind-direction.svg`

**Superseded by v3 webp (4 files — kept for fallback, but no source ref):**
- `public/illustrations/pinellas-palm.svg` (superseded by `pinellas-palm-v3-*.webp`)
- `public/illustrations/mower-side-profile.svg` (superseded by `mower-side-profile-v3-*.webp`)
- `public/illustrations/grass-blade-cluster.svg` + `…-sm.svg` + `…-md.svg` + `…-lg.svg` + `…-xl.svg` — **all 5 are 1453 bytes**, byte-identical content, with the v3 webp set on disk alongside (`-v3-100/150/200/300.webp`) and **the v3 set is also unreferenced**

**Used by non-home components (keep, but flag for v3 pass):**
- `public/illustrations/empty-state-yard.svg`, `empty-state-hose.svg`,
  `empty-state-before-after.svg` — only referenced by `EmptyState.tsx`,
  which mounts on `/services/[slug]` empty results and similar
  zero-data states, not the home page.

**Pruning action:** delete the 11 unreferenced + 6 superseded (~17 files,
~25 KB total). Update `content/assets/citation-data-package.md:137-138`
which still instructs GBP exports to use the line-art `logo-mark.svg`
and `logo.svg` — point those to the v3 painted webp once a v3 inverse
exists for the dark backgrounds.

---

## 4. Anti-patterns

### 4.1 · Visual inconsistencies
- **Line-art icons on painted cards** — `ServiceBentoIcon` and
  `ProcessStepIcon` are the only inline `<svg>` line art left in the
  painted middle of the page. **Fix = §1.1.**
- **Lucide-react trust row** — `MapPin`/`Clock`/`Phone` in
  `HeroCinematic.tsx:90-101` are thin-stroke modern generic. **Fix = §1.4.**
- **Line-art `quote-mark.svg` closing mark** in `FinalCTABanner.tsx:34`
  is the only file-type-SVG used as a section ornament on the homepage.
  **Fix = §1.2.**
- **`ServiceAreaMap` peninsula silhouette** is the only full-bleed
  hand-drawn SVG left. **Fix = §1.3.**

### 4.2 · Accessibility
- All `Illustration` usages correctly pass `alt=""` for decorative
  contexts (`FinalCTABanner.openingMark`, `ScheduleTimeline.todayMower`,
  `OperatorStrip.bioSignatureMark`, `ServiceAreaStats.mark`, `PricingTiers.headerOrnamentMark`).
- All `ServiceBentoIcon` / `ProcessStepIcon` SVGs are
  `aria-hidden="true"` and the surrounding card title/number carries
  the meaning. Correct.
- `ServiceBento` cards wrap the visual in `<Link aria-label="${svc.title}:
  ${svc.summary}">`. Correct.
- `HeroCinematic` `cornerStamp "01"`, `caption "Pinellas porch — golden
  hour"`, and `callout` are all `aria-hidden="true"` (correct — the
  headline and the linked `MapPin`/`Clock`/`Phone` trust row already
  carry the same information). The `Image` itself has a descriptive
  alt text. No issue.
- One soft concern: the `ScheduleTimeline` "Today" row has both a
  `todayBadge` ("Today" with `aria-label="Today's route"`) **and** a
  `todayMower` illustration with `alt=""`. The badge handles SR, the
  illustration is decorative. Correct, but the `data-today="true"`
  attribute on the day `<li>` is a strong visual signal for sighted
  users that a screen reader user will never perceive beyond the
  "Today" badge. That's fine; flagging in case future-me considers
  adding `aria-current="date"` to the `<li>`.

### 4.3 · No broken SVG paths, no missing alt text, no console warnings
- `grep` for `illustrations/.*\.(svg|webp)` in `apps/web/src` returns
  16 hits; every one resolves to a file that exists in `public/`.
- No `<img>` element in the audited sections is missing an `alt`.
- No component under `sections/` uses `dangerouslySetInnerHTML` or
  inlines raw SVG paths that wouldn't render.

---

## 5. "Don't bother" list

Things that look like visual upgrades but aren't worth the time:

- **Repainting the `LogoLockup` wordmark as v3 webp right now.** The
  current Fraunces 1.3rem @ opsz 144 wordmark
  (`LogoLockup.module.css:18-29`) already reads editorial. The
  painted v3 wordmark is on the do-later list (§2); bump it later,
  not now.
- **Polishing the `Eyebrow` clay dot.** It uses `background: var(--ll-clay)`;
  consistent across the site; works.
- **Upgrading the `MarqueeQuote` "·" interpunct or the curly-quote
  span.** They're Fraunces italic at the right weight; they're fine.
- **Touching the `TrustStrip`.** Intentionally typographic-only (per
  the component comment: "intentionally NOT a marquee … anti-pattern
  list"). Adding a glyph here would weaken the typographic pause
  between hero and OperatorStrip.
- **Replacing the `EditorialBreak` image.** It already uses
  `services.mowing.imageSlot` — painted v3 webp, curated.
- **Re-curating the `Pinellas palm` v3 ornaments.** They're already
  deployed at the right sizes (36/72/120/600×400) and are on-brand
  per `_style-block.md`.
- **Adding motion to `TrustStrip` / `FAQAccordion` / `MarqueeQuote`.**
  All three are intentionally restrained; the motion PRD keeps them
  minimal. Don't drift.
- **Refactoring `LogoMark.module.css`.** 1 class, 1 rule. Leave it.
- **Replacing the `LogoMark` `variant="line"` SVG fallback.** It's
  intentional (GBP asset generation, line-art variants). Document
  the use case in the comment if it's not already, but don't
  repaint.
- **Adding an `aria-label` to the `MarqueeQuote` "“" and "·" spans.**
  They're `aria-hidden="true"` and the parent `<section>` already
  has `aria-label="Operator quotes"`. Correct as-is.
- **Re-styling the `Button` variants.** The PRD locks the variants
  (`primary`, `sun`, `sand`, `outline`, `ghost`, `danger`); they all
  consume token colors; no visual issue.

---

## 6. Inventory appendix (for next-pass context)

### 6.1 Painted v3 assets currently in active use on `/`
| Asset | Where | Format |
|---|---|---|
| Hero image | `HeroCinematic.tsx:154` → `public/hero/mobile.webp` (1200×1500) | painted v2 single scene (WP49) |
| Operator portrait | `OperatorStrip.tsx:50` + `OperatorNote.tsx:55` → `public/operator/portrait.webp` | painted |
| Service webps (6) | `ServiceBento.tsx:124` → `public/services/*.webp` (mowing, edging, mulching, hedge-trimming, hurricane-prep, seasonal-cleanup) | painted v3 |
| Area webps (6) | `ServiceAreaMap.tsx:197` → `public/areas/*.webp` (one per ZIP) | painted v3 |
| Pinellas palm v3 | `OperatorStrip` (72), `PricingTiers` (120), `ServiceAreaStats` (600×400), `SiteFooter` (36) | painted v3 webp |
| Mower side profile v3 | `ScheduleTimeline` (120) | painted v3 webp |
| Logo mark v3 | `LogoMark` (32/64/128/256) + srcSet | painted v3 webp |

### 6.2 Hand-authored SVG still in active use on `/`
| File | Where | Why it should stay / be replaced |
|---|---|---|
| `ServiceBentoIcon.tsx` | `ServiceBento.tsx:130` (6 inline SVGs) | **Replace — §1.1** |
| `ProcessStepIcon.tsx` | `ProcessSteps.tsx:33` (4 inline SVGs) | **Replace — §1.1** |
| `quote-mark.svg` | `FinalCTABanner.tsx:34` | **Replace — §1.2** |
| `ServiceAreaMap` peninsula + pins | `ServiceAreaMap.tsx:62-93` | **Replace peninsula — §1.3**; keep interactive pins as transparent overlay |
| `lucide-react` MapPin/Clock/Phone | `HeroCinematic.tsx:90-101` | **Replace — §1.4** |
| `logo-mark.svg` | `LogoMark.tsx:35` (only when `variant="line"`) | Keep — documented fallback |

### 6.3 Typography
- `globals.css` and the section module CSS files confirm **all h1/h2
  headings across the home page use Fraunces** (e.g.
  `HeroCinematic.module.css:73-75`, `ServiceBento.module.css:18-24`,
  `OperatorStrip.module.css:73-75`, `PricingTiers.module.css:27-29`,
  `ProcessSteps.module.css:41-43`, `FAQAccordion.module.css:26-28`,
  `FinalCTABanner.module.css:118-120`). The storybook serif voice
  is consistent.
- Display utilities (`.display-xl` / `.display-lg` / `.display-sm`)
  exist in `typography.css` and are available; several module
  headers inline the same Fraunces-700 clamp pattern instead of
  using the utility. Refactoring those to use the utility is a
  cosmetic-only win, not worth a dedicated PR — but worth a follow-up
  if a v3 wordmark upgrade is in flight.

### 6.4 Color & motion tokens
- `tokens.css` is comprehensive: 5 brand-locked colors + 9
  Pinellas-evocative derivatives, full 8-pt spacing scale, motion
  duration/easing tokens, elevation, radius, max-width. No one-off
  hex literals were spotted in the audited section modules. CI lint
  per the file header comment is enforcing this.
- `EditorialBreak` uses `tone="dark"` on the `Eyebrow` — confirmed
  via the section CSS (not a contrast regression).

---

## 7. Suggested execution order

If the steward wants the highest signal-per-hour on the next pass:

1. **§1.1 painted icons** (M, 1 hr) — biggest visible regression right now
2. **§1.2 painted quote-mark** (S, 20 min) — closes the painted loop on
   the last section
3. **§1.4 clay-bullet trust row** (S, 15 min if reusing the existing
   OperatorStrip `toolBar` pattern, no new asset) — removes the
   above-the-fold inconsistency
4. **§3 prune 17 dead assets** (S, 10 min) — clears confusion before
   the next SDXL author starts hunting
5. **§1.5 today-mower upgrade** (S, 30 min) — only if a v4 with grass
   tuft is worth the prompt; otherwise leave
6. **§1.3 painted Pinellas map** (L, 2-3 hr) — biggest single win,
   biggest single risk; schedule when there's room for pin-coordinate
   regression testing
7. **§2 do-later v3 wordmark / inverse / apple-touch-icon / favicon**
   (M, 1 hr) — finish the offline-surface painted pass

The §2 do-later batch + §1.1 + §1.2 + §1.4 + §3 are the only items
that move the needle before Phase 3 launch; the rest is polish.
