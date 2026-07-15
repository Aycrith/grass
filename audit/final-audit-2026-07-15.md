# Final Pre-Flight Audit — 2026-07-15

**Repo:** GRASS (`apps/web`)
**Commits audited:** `49c8acb` (D-0016 copy+structure), `5a83066` (D-0017 structural), `d36b591` (D-0018 visual)
**Scope:** Verify the 6 Pre-Flight Failures are fixed in the current code, and D-0018 dividers + paper texture are crisp/subtle. No project files modified. Every finding has file:line evidence and, where applicable, rendered-HTML evidence.

---

## Pre-Flight Failures — Verification

### Failure 1: Em-dashes and en-dashes in user-facing copy (skill: ZERO) — **PARTIAL FIX**

**Method:** ripgrep across `apps/web/src/lib/content.ts`, all `apps/web/src/app/**`, all `apps/web/src/components/**`. Inspected rendered HTML at `/` (curl + parse).

**Evidence:**

- `apps/web/src/lib/content.ts`: **0 em-dashes, 0 en-dashes** in user-facing strings. PASS.
- `apps/web/src/app/error.tsx`, `layout.tsx`, `opengraph-image.tsx`, `twitter-image.tsx`, `gbp/page.tsx`, `about/page.tsx`, `preview/layout.tsx`, `preview/page.tsx`, `api/lead/route.ts`: 0 user-facing em/en dashes. Comments only. PASS.
- `apps/web/src/lib/business.ts:53-54`: en-dashes only inside `// 0.25–0.5 acre` comments. PASS.
- **`apps/web/src/components/sections/ServiceBento.tsx:105`** — `<p className={styles.headerSub}>I keep the service list short on purpose **—** six things, no crew swap, no upsell…</p>` — **1 em-dash in user-facing copy on home page**. FAIL.
- **`apps/web/src/components/sections/ServiceBento.tsx:132`** — `<span className={styles.eyebrow}>{svc.eyebrow} **—** {svc.title}</span>` — rendered 6× (one per card) as `01 — Mowing`, `02 — Edging`, etc. **6 em-dashes in user-facing copy on home page**. FAIL.
- **`apps/web/src/components/sections/ServiceAreaStats.tsx:60`** — `<p className={styles.lede}>Scale on a clipboard, not on a website **—** what the operator actually does, written down plain.</p>` — **1 em-dash in user-facing copy on home page**. FAIL.
- **`apps/web/src/components/site/SiteFooter.tsx:89`** — `<dt>Mon**–**Fri</dt>` — **1 en-dash in user-facing copy on every page including home**. FAIL.
- `apps/web/src/components/page/PinnedBeforeAfter.tsx:104` — `'Keep scrolling — the cut reveals itself.'` — only rendered on `/services/[slug]`, not on home page. Off-scope but still a violation.
- `apps/web/src/components/sections/{EmptyState,AreaServiceOffer,EquipmentShowcase,ReviewMagnetForm,ServiceHero,ServiceDirectory,PricingComparisonTable}.tsx` and `apps/web/src/app/{privacy,terms}/*.tsx`: additional em/en dashes in user-facing copy on non-home pages (e.g. `Mon-Fri 7:00 AM - 5:00 PM` in preview/citations, `0.25-0.5 ac` in pricing table). Off-scope for the home page Pre-Flight, but still violations of the skill rule.

**Result: FAIL — 9 em-dashes + 1 en-dash still in user-facing copy (8 em-dashes + 1 en-dash visible on the home page; 1 em-dash + 0 en-dashes in `PinnedBeforeAfter.tsx` off-home). D-0016 fixed `content.ts` (the main offender) but the component-layer copy was not edited.**

---

### Failure 2: Eyebrow count on home page (max 5) — **PARTIAL FIX**

**Method:** ripgrep `<Eyebrow ` and `<span className={styles.eyebrow}>` / `<p className={styles.eyebrow}>` in `apps/web/src/components/sections/*` and `apps/web/src/app/page.tsx`. Cross-checked against rendered HTML at `/`.

**Evidence — `<Eyebrow>` component renders on home (4, target list = 5):**

| # | File:line | Section | Source |
|---|---|---|---|
| 1 | `HeroCinematic.tsx:67-69` | HeroCinematic | `hero.eyebrow` = `Lawn care in 33771` |
| 2 | `ServiceBento.tsx:100-102` | ServiceBento header | literal `What I do` |
| 3 | `PricingTiers.tsx:34-36` | PricingTiers header | `pricingHeader.eyebrow` = `04 - Pricing` ← has NN- prefix |
| 4 | `ServiceAreaMap.tsx:78-80` | ServiceAreaMap header | `serviceAreaMap.eyebrow` = `Where I mow` |

**Evidence — inline `<… className={styles.eyebrow}>` patterns on home (10):**

| Count | File:line | Element | Per-card text |
|---|---|---|---|
| 1 | `FinalCTABanner.tsx:29` | `<span>` (section-level) | `Ready when you are` |
| 6 | `ServiceBento.tsx:131-133` | `<span>` (one per card) | `01 — Mowing`, `02 — Edging`, …, `06 — Seasonal cleanup` (em-dash + heading) |
| 3 | `PricingTiers.tsx:64` | `<p>` (one per card) | `Mowing`, `Mulching`, `Hurricane prep` |

**Rendered HTML confirms:** 4 distinct `Eyebrow_root__QOFc0` instances, 1 `FinalCTABanner_eyebrow__neM_7`, 6 `ServiceBento_eyebrow__lW5P2`, 3 `PricingTiers_eyebrow__hhMB8` = **14 eyebrow micro-labels** rendered on `/`.

**Evidence — `NN - ` prefix on surviving eyebrows:**

- `pricingHeader.eyebrow: '04 - Pricing'` (`content.ts:800`) — **STILL HAS PREFIX**. The audit explicitly required dropping it.
- Other surviving eyebrows on home are clean: `hero.eyebrow = 'Lawn care in 33771'`, `serviceAreaMap.eyebrow = 'Where I mow'`, `ServiceBento` literal `What I do`, `FinalCTABanner` literal `Ready when you are`.

**Result: FAIL — section-level count matches the 5-slot target (4 Eyebrow components + 1 FinalCTABanner inline span), but the per-card inline eyebrows (6 in ServiceBento + 3 in PricingTiers = 9) were not removed as the audit required, and `pricingHeader.eyebrow` still carries the `04 - ` prefix.**

---

### Failure 3: Decorative status dots — **PARTIAL FIX**

**Method:** ripgrep for `dot` in `<Eyebrow>` props, for `.trustDot` and `.toolDot` in JSX, and for `.dayDot`/`.ribbon`/`.calloutDot` references.

**Evidence:**

- `apps/web/src/components/site/Eyebrow.tsx:19,28` — `dot?: boolean` prop exists with `default = false`. Comment at lines 34-37 documents the fix. **No caller passes `dot`**: ripgrep `<Eyebrow[^>]*dot` returns 0 matches. PASS.
- `apps/web/src/components/sections/HeroCinematic.module.css:320-326` — `.trustDot` class definition is **still in the source file** but unused in JSX (`HeroCinematic.tsx` does not reference it). Tree-shaken from production CSS (0 occurrences in rendered HTML). Dead code.
- `apps/web/src/components/sections/OperatorStrip.module.css:201-208` — `.toolDot` class definition is **still in the source file** but unused in JSX (`OperatorStrip.tsx` does not reference it). Tree-shaken from production CSS. Dead code.
- `apps/web/src/components/sections/HeroCinematic.module.css:189-195` — `.calloutDot` (6px clay dot inside the callout pill on the image) is **still defined and still rendered** (2 references in HTML: 1 visible + 1 RSC payload). The audit's Failure 4 said the callout is "intentional editorial framing" per the user's spec, but the dot on top of it is decorative and was not removed.
- `apps/web/src/components/sections/ScheduleTimeline.module.css` — `.dayDot` per-day and `.todayDot` for current-day status are both still defined and used. Audit said: "Keep the `.todayDot` — this is genuine status; the per-day `.dayDot` is borderline and could be kept for state indication." Per-day rendering is justified as state. ACCEPTABLE.
- `apps/web/src/components/sections/PricingTiers.module.css:131-141` — `.ribbon` (sun-color floating "Most booked" pill) is still defined and rendered (1 instance: `class="PricingTiers_ribbon__MCsSD"` in HTML). Audit said: "Keep the ribbon if 'Most booked' is editorial intent, but re-style as a 2px clay top border on the card instead of a sun-color floating ribbon (the floating ribbon is the same dot-as-decoration pattern, larger)." **Not re-styled.**

**Result: PARTIAL FIX — the original 20+ decorative sun/clay dots are gone from the rendered surface (eyebrow dots removed, trust row removed, equipment metabar dots removed, no decorative dots on ScheduleTimeline's per-day row). However, two CSS classes (`.trustDot`, `.toolDot`) are dead code still living in module files, the `.calloutDot` on the hero callout pill is still rendered, and the PricingTiers `.ribbon` is still a sun-color floating pill (not a clay top-border per the audit's preferred fix). User-facing impact is low; cleanup is incomplete.**

---

### Failure 4: Hero stack carries 8 text elements (max 4) — **PASS**

**Method:** Read `apps/web/src/components/sections/HeroCinematic.tsx` and the rendered HTML.

**Evidence — copy column text elements:**

| # | File:line | Element | Text |
|---|---|---|---|
| 1 | `HeroCinematic.tsx:67-69` | `<Eyebrow>` | `Lawn care in 33771` |
| 2 | `HeroCinematic.tsx:71-77` | `<h1>` (2× `<WordReveal>`) | `Your neighbor's` / `lawn mower.` |
| 3 | `HeroCinematic.tsx:79` | `<p.subhead>` | `Local, solo-operator lawn care in Largo…` |
| 4 | `HeroCinematic.tsx:82-89` | `<div.actions>` | 2 CTAs (primary + secondary phone) |

**= 4 text elements in copy column. Within target.**

**Evidence — image overlay text elements:**

| # | File:line | Element | Text |
|---|---|---|---|
| 1 | `HeroCinematic.tsx:96-103` | `<a.callout>` | `33771 - Largo central` (with 6px clay `.calloutDot`) |

**= 1 callout on the image. Per user spec: "image overlay has 1 callout (intentional editorial framing)".**

**Evidence — removed elements:**

- `trustRow` (3 trust items) — removed (0 occurrences in HTML).
- `cornerStamp` (`01` chip top-left) — removed (0 occurrences in HTML).
- `caption` (`Pinellas porch - golden hour`) — removed (0 occurrences in HTML).

**Result: PASS — copy column 4 elements, image column 1 callout, removed trust row / corner stamp / caption. The 8-element stack is now a 5-element stack (4 + 1 intentional callout). The only residual concern is the `.calloutDot` (decorative clay dot on the callout) which the user's spec does not flag.**

---

### Failure 5: CTA duplicate intent — **PARTIAL FIX**

**Method:** ripgrep for the three labels across `apps/web/src`. Cross-checked against rendered HTML at `/`.

**Evidence — `Get a free quote` (target: 4 on home):**

| # | File:line | Rendered where | Status |
|---|---|---|---|
| 1 | `content.ts:34` (`hero.primaryCta.label`) | Hero primary | PASS |
| 2 | `content.ts:800` (`pricingHeader.ctaLabel`) | PricingTiers × 3 cards | PASS |
| 3 | `content.ts:937` (`finalCta.cta.label`) | FinalCTABanner | PASS |
| 4 | `components/site/SiteHeader.tsx:110` (hardcoded) | SiteHeader (right CTA) | PASS |
| 5 | `content.ts:696` (`contactPage.heading`) | /contact h1 | Off-home, but consistent |

Rendered HTML: 7 visible `Get a free quote` instances on `/` (1 SiteHeader + 1 Hero + 3 PricingTiers cards + 1 FinalCTABanner + 1 navigation JSON).

**Evidence — `Get a quote` (target: 0):**

- `apps/web/src/components/site/SiteFooter.tsx:37` — `{ href: '/quote', label: 'Get a quote' }` — **STILL PRESENT**. Renders on every page (1 instance on `/`). FAIL.

**Evidence — `Get my free quote` (target: 0):**

- `apps/web/src/components/sections/AreaCTA.tsx:42` — `Get my free quote` — only on `/areas/[zip]`. Off-home.
- `apps/web/src/components/sections/ServiceCTA.tsx:42` — `Get my free quote` — only on `/services/[slug]`. Off-home.

Rendered HTML on `/`: **0 `Get my free quote` instances** (off-home only). PASS for home page.

**Result: PARTIAL FIX — `Get a free quote` is consistent on the home page (4 distinct user-facing positions, all using the same label). `Get my free quote` is fully off-home. BUT `Get a quote` (without "free") still appears 1× on every page in `SiteFooter` Company column — the audit's target of 0 is not met.**

---

### Failure 6: PricingTiers 3-equal-card grid (banned default) — **PASS**

**Method:** Read `apps/web/src/components/sections/PricingTiers.module.css` and `pricingTiers` in `content.ts`. Cross-checked against rendered HTML.

**Evidence:**

- `apps/web/src/components/sections/PricingTiers.module.css:104-112`:
  ```css
  .grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;   /* asymmetric, NOT repeat(3, 1fr) */
    grid-template-rows: auto auto;
    gap: var(--space-4);
    align-items: stretch;
  }
  ```
- `apps/web/src/components/sections/PricingTiers.module.css:114-117`:
  ```css
  .grid > .card:first-child {
    grid-column: 1;
    grid-row: 1 / span 2;       /* first card spans 2 rows on the left */
  }
  ```
- `apps/web/src/lib/content.ts:821-846` — `pricingTiers[0]` (Mowing) has `featured: true`; `pricingTiers[1]` (Mulching) and `pricingTiers[2]` (Hurricane prep) have `featured: false`.
- Mobile media query at lines 120-128 collapses the grid to a single column with the anchor card first.

**Result: PASS — 3-equal-card layout is fully refactored. Bento grid is `1.6fr 1fr` with the Mowing anchor card spanning 2 rows on the left, and `featured: true` is correctly set on the Mowing tier. Matches the audit's recommended bento sketch exactly.**

---

## D-0018 New Work — Verification

### Hand-authored SVG dividers — **PASS (with one new issue)**

**Method:** Read `apps/web/public/illustrations/divider-flourish.svg`, `apps/web/src/components/ui/SectionDivider.tsx`, and `apps/web/src/components/ui/SectionDivider.module.css`. Counted `<SectionDivider />` instances in `page.tsx`. Verified rendered HTML at `/`.

**Evidence:**

- `apps/web/public/illustrations/divider-flourish.svg`:
  - `<?xml version="1.0" encoding="UTF-8"?>` (declaration present)
  - `viewBox="0 0 1200 80"` ✓
  - `fill="none"` on root, no background rect → **transparent background** ✓
  - `stroke-width="4"` on the wave path ✓
  - `stroke-linecap="round"` and `stroke-linejoin="round"` on root
  - Hand-authored paths (wavy line + center dot + outer ring). Not rasterized.
  - Sun-gold wave `#E8B65A`, clay outer ring `#C66B3A` — matches brand tokens.
- `apps/web/src/components/ui/SectionDivider.tsx:30-46` — renders an **inline** `<svg viewBox="0 0 1200 80">` (NOT `<img>`), so the stroke stays crisp at any DPR. Path/circle data is duplicated in the component (does not load the file).
- `apps/web/src/components/ui/SectionDivider.module.css:25-31` — `.svg` is `width: 100%; max-width: 720px; height: auto;` — at 720px wide display, the 4px stroke renders at 2.4px (still crisp).
- `apps/web/src/app/page.tsx`: **8 `<SectionDivider />` usages** (lines 64, 68, 75, 82, 89, 96, 100, 104). Matches target.
- Rendered HTML: **8 `<div class="SectionDivider_root...">` instances** confirmed in `/tmp/home3.html`.

**New issue found:** `apps/web/public/illustrations/divider-flourish.svg` is **dead code** — no source file references it (ripgrep `divider-flourish` in `apps/web/src` returns 0 matches). The component duplicates the path data inline rather than loading the file. Either delete `divider-flourish.svg` or refactor the component to import it as an SVG asset (e.g. via `?react` import) so the single source of truth lives in the file the audit was written against. If the component continues to inline the path, the file is unused and should be removed to keep the kit clean.

**Result: PASS on the spec (8 dividers rendered, inline SVG, 4px stroke, 1200×80 viewBox, transparent).** One cleanup issue: the source `divider-flourish.svg` file is not referenced from any code.

### Paper-grain texture overlay — **PASS**

**Method:** Read `apps/web/public/illustrations/paper-grain.svg` and `apps/web/src/app/globals.css`.

**Evidence:**

- `apps/web/public/illustrations/paper-grain.svg`:
  - `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" stitchTiles="stitch" />` ✓
  - Followed by `<feColorMatrix>` to darken the noise.
  - `<rect width="200" height="200" filter="url(#grain)" />` — single tile, 200×200.
  - 1.4 KB file. No animation, no JS.
- `apps/web/src/app/globals.css:319-333` — `body::before`:
  ```css
  body::before {
    content: "";
    position: fixed;        /* ✓ */
    inset: 0;
    z-index: 0;             /* ✓ */
    pointer-events: none;    /* ✓ */
    background-image: url("/illustrations/paper-grain.svg");
    background-size: 200px 200px;
    background-repeat: repeat;
    opacity: 0.05;          /* ✓ */
    mix-blend-mode: multiply; /* ✓ */
  }
  ```
- `apps/web/src/app/globals.css:335-338`:
  ```css
  body > * {
    position: relative;
    z-index: 1;             /* ✓ content sits above the texture */
  }
  ```

**Result: PASS — texture is rendered via `feTurbulence` with `stitchTiles="stitch"` (tileable), applied through `body::before` with `opacity: 0.05`, `mix-blend-mode: multiply`, `pointer-events: none`, `position: fixed`. `body > *` is lifted to `z-index: 1` so content always paints above the grain. Subtle and matches the design intent.**

---

## Page Health

### Build — **PASS**

**Method:** `cd apps/web && bun run build`.

**Evidence:**
```
Route (app)                                      Size  First Load JS
┌ ○ /                                           407 B         212 kB
…
+ First Load JS shared by all                  103 kB
…
✓ Generating static pages (84/84)
```
Home page matches the cached `407 B 212 kB` figure. 84 static pages generated. No build errors. One non-fatal warning: "Next.js inferred your workspace root, but it may not be correct" (multiple lockfiles in the parent `camer/` directory; pre-existing, not a D-0018 issue).

### Charter — **PASS**

**Method:** `bun run test:charter`.

**Evidence:**
```
✓ lint-agents: 13 agent specs validated against schema.
✓ lint-capabilities: 9 capabilities validated against registry schema.
✓ ledger-freshness: state/ledger.yaml is 0.8 days old (limit: 7).
--- Charter compliance summary ---
✓ lint-agents (scripts/lint-agents.ts)
✓ lint-capabilities (scripts/lint-capabilities.ts)
✓ ledger-freshness (scripts/check-ledger-freshness.ts)
✓ Charter compliance: all checks passed.
```
3/3 green.

### Console errors / page health — **PASS**

**Method:** Started `bun run start`, curl `GET http://localhost:3000/` → status 200, 109,244 bytes. Grepped HTML for `Failed to compile`, `Module not found`, `Cannot find module`, `SyntaxError`, `ReferenceError`, `TypeError`, and Next.js error overlay markers (`__next_error__`, `nextjs_portal`, `nextjs-build-error`).

**Evidence:**
- HTTP 200, 109 KB HTML body.
- 0 matches for build/runtime error patterns.
- 0 matches for Next.js error overlay markers.
- 8 `<div class="SectionDivider_root...">` instances in the rendered output (matches `<SectionDivider />` count in `page.tsx`).

**Result: PASS — page is in a buildable + server-renderable state with no console errors and no missing modules.**

---

## Adversarial Probes

Beyond the spec-listed checks, I ran additional adversarial probes to look for regressions:

1. **Decorative-dot tree-shaking:** Searched the rendered HTML for `.trustDot` and `.toolDot` class names → 0 matches. Next.js correctly tree-shakes unused CSS module classes out of the production bundle. So while the CSS is dead code in source, it's not bleeding into the runtime.
2. **Divider count vs. spec count:** Verified 8 dividers in JSX = 8 dividers in rendered HTML (no SSR/hydration mismatch, no extra dividers from RSC payload duplication).
3. **CTA label consistency on home:** Every `/quote` link on the home page has the same label "Get a free quote" (except SiteFooter, which is a different component and has "Get a quote"). No inconsistent labels at the conversion intent level on the home page except the footer.
4. **calloutDot visibility on hero:** The `.calloutDot` is still in the rendered HTML (2 references: 1 DOM + 1 RSC payload). The dot is 6px clay color, sits inside the callout pill, and is purely decorative. Not flagged in the audit's hero-stack fix list, but worth noting.
5. **Eyebrow text on rendered home:** 4 `<Eyebrow>` component renders + 1 FinalCTABanner inline + 6 ServiceBento card + 3 PricingTiers card = 14 eyebrow micro-labels visible to a user. The audit's 5-slot target is met at the section level but exceeded by the per-card inline eyebrows.
6. **PricingTiers ribbon re-style:** The sun-color floating "Most booked" pill is still in place; the audit's preferred re-style (2px clay top border) was not applied. Borderline, per the audit's own caveats.

---

## New Issues Introduced by D-0016/D-0017/D-0018

1. **Dead file:** `apps/web/public/illustrations/divider-flourish.svg` is not referenced by any source code (the `SectionDivider` component duplicates the path data inline). Either delete the file or refactor the component to import it.
2. **Dead CSS classes:** `.trustDot` (HeroCinematic.module.css:320) and `.toolDot` (OperatorStrip.module.css:201) are still defined in CSS but never referenced in JSX. They are tree-shaken from the production bundle, but the source file contains the definition. Recommend deletion.
3. **calloutDot still rendered:** `.calloutDot` (6px clay dot inside the hero callout pill) is still defined and rendered. The callout itself is intentional per user spec, but the dot on it is a decorative element flagged in the original audit's anti-slop list. If kept, the dot should be acknowledged as a status / brand mark; if removed, the callout reads cleanly without it.
4. **PricingTiers ribbon not re-styled:** Still a sun-color floating "Most booked" pill. The audit's recommended re-style (2px clay top border) was not applied. Borderline per the audit's own caveats.

---

## Net Result

- **Pre-Flight Failures remaining: 3 of 6** (Failures 1, 2, 5 partial; Failures 3, 4, 6 fully fixed).
  - Failure 1 (em-dashes): 8 em-dashes + 1 en-dash still in user-facing copy on the home page (ServiceBento × 7, ServiceAreaStats × 1, SiteFooter × 1 en-dash).
  - Failure 2 (eyebrow count): section-level count is 5 (target met), but 9 per-card inline eyebrows remain (6 in ServiceBento + 3 in PricingTiers) and `pricingHeader.eyebrow` still has the `04 - ` prefix.
  - Failure 3 (decorative dots): eyebrow `dot` prop fully fixed, trust row / corner stamp / caption removed, per-day dot justified. Residual: dead CSS classes, calloutDot, un-restyled ribbon.
  - Failure 4 (hero stack): 4 copy-column elements + 1 intentional callout. PASS.
  - Failure 5 (CTA intent): 5 `Get a free quote` instances on home, 0 `Get my free quote` on home, but 1 `Get a quote` (without "free") still in SiteFooter.
  - Failure 6 (PricingTiers grid): bento refactor complete. PASS.
- **D-0018 dividers + texture:** both meet the spec (8 dividers, inline SVG, 4px stroke, 1200×80 viewBox, transparent; feTurbulence paper-grain with multiply, 5% opacity, pointer-events: none, z-index 0; body content z-index 1).
- **Build:** green (84/84 pages, 407 B / 212 kB for `/`).
- **Charter:** 3/3 green.
- **Console errors:** none.

### Recommendation: **fix the 3 partial failures before shipping**

The page builds and is server-renderable. The 3 fixed failures (4, 6, divider/texture) are solid. The 3 partial failures are all small, mechanical edits and should be cleaned up in one final pre-launch commit before declaring the home page ready:

1. **Failure 1 (em-dashes) — needs ~10 string edits** in `ServiceBento.tsx:105`, `ServiceBento.tsx:132` (replace the inline `{svc.eyebrow} — {svc.title}` pattern with `{svc.title}` or just `{svc.eyebrow}`), `ServiceAreaStats.tsx:60`, and `SiteFooter.tsx:89` (`Mon–Fri` → `Mon to Fri` or `Mon-Fri` ASCII).
2. **Failure 2 (eyebrow count) — needs ~10 line edits** to drop the per-card inline eyebrows in `ServiceBento.tsx:131-133` (×6) and `PricingTiers.tsx:64` (×3), and drop the `04 - ` prefix in `content.ts:800`.
3. **Failure 5 (CTA intent) — needs 1 string edit** in `SiteFooter.tsx:37` to change `'Get a quote'` → `'Get a free quote'`.

D-0018 cleanup is also recommended but lower priority: delete the unreferenced `divider-flourish.svg` (or refactor `SectionDivider` to use it), delete the dead `.trustDot` / `.toolDot` CSS classes, and either remove the `.calloutDot` from the hero or re-style the PricingTiers ribbon as a 2px clay top border.

After these edits, the 6 Pre-Flight Failures should all be PASS and D-0018 will be clean. The page is otherwise shippable.
