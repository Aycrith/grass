# Pre-Flight Audit — 2026-07-15

**Repo:** GRASS (`apps/web`)
**Commit audited:** `642df8596886d0bf86a843e533cc3f2b155837c7` (revert: D-0013, D-0014, D-0013b — painted storybook ornaments below quality bar)
**Scope:** Pre-flight check against the `design-taste-frontend` skill's Pre-Flight Failure list. No files modified. Every finding has file:line evidence.

---

## TL;DR

The home page is **below the pre-flight bar on 6 of the 10 checks**. The dominant issues are: (1) em-dashes and en-dashes are used pervasively in user-facing copy (~50+ hits), (2) eyebrows are rendered on **12 of 14 home-page sections** (max allowed is 5), (3) the hero stack carries **8+ text elements** (max 4), (4) the page carries **20+ decorative sun/clay dots** (max 0 by default), and (5) three different button labels all map to the same `/quote` intent ("Get a free quote" / "Get a quote" / "Get my free quote"). The PricingTiers section uses a 3-equal-card layout (banned default). Marquee quote lengths and the Inter+Fraunces font pairing pass. Decorative SVGs split: hand-drawn illustrations (clock, empty-state-*, quote-mark.svg) should be removed/refactored; the v3 painted webp set is acceptable. The audit will drive the next 1-2 commits: a copy pass (strip em/en dashes) and a structural pass (eyebrow + hero-stack + dot reduction).

---

## Pre-Flight Failures (must fix before next commit)

### Failure 1: Em-dashes and en-dashes in user-facing copy (skill: ZERO)
- **Where:** `apps/web/src/lib/content.ts` — ~50+ hits in user-facing strings
- **What:** Per the skill, em-dash (`—`, U+2014) and en-dash (`–`, U+2013) are forbidden in user-facing text. The codebase uses them pervasively for parenthetical clauses (`— and counting.`), ranges (`2–3 inch`, `April–October`), and emphatic pauses (`— just a flat rate`).
- **Hits in user-facing copy (excerpt — non-exhaustive):**

| File:line | Snippet | Char |
|---|---|---|
| `apps/web/src/lib/content.ts:30` | `eyebrow: '01 — Lawn care in 33771'` | em |
| `apps/web/src/lib/content.ts:54` | `callout: '33771 — Largo central'` | em |
| `apps/web/src/lib/content.ts:60` | `copy: 'Proudly serving 33771 · 33770 · 33773 · 33774 · 33778 · 33756 — and counting.'` | em |
| `apps/web/src/lib/content.ts:78` | `eyebrow: '06 — Where I mow'` | em |
| `apps/web/src/lib/content.ts:81` | `'We keep the service area tight on purpose — six ZIPs across Largo...'` | em |
| `apps/web/src/lib/content.ts:146` | `beforeAlt: 'A Largo lawn before the first mowing visit — uneven height...'` | em |
| `apps/web/src/lib/content.ts:148` | `afterAlt: 'The same Largo lawn after four weeks of weekly mowing — clean stripes...'` | em |
| `apps/web/src/lib/content.ts:228` | `afterAlt: '...pre-storm sweep — loose debris gone...'` | em |
| `apps/web/src/lib/content.ts:248` | `afterAlt: '...full leaf-season cleanup — clear and ready.'` | em |
| `apps/web/src/lib/content.ts:266` | `eyebrow: '01 — Services'` | em |
| `apps/web/src/lib/content.ts:270` | `tail: 'If you need something not listed — hauling, light brush clearing...'` | em |
| `apps/web/src/lib/content.ts:293` | `intro: '...mow at 3.0–3.5 inches for St. Augustine grass — the optimal height...'` | em + en |
| `apps/web/src/lib/content.ts:296` | `'Riding-mowing for lots 0.5–1 acre'` | en |
| `apps/web/src/lib/content.ts:304` | `'...to $95 per visit (large lots) — recurring customers save 15%'` | em |
| `apps/web/src/lib/content.ts:308` | `'During the growing season (April–October), weekly mowing is ideal...'` | en |
| `apps/web/src/lib/content.ts:312` | `'No — wet mowing causes clumping and ruts...'` | em |
| `apps/web/src/lib/content.ts:325` | `intro: '...all hard surfaces — driveways, sidewalks, patios — and along...'` | em ×2 |
| `apps/web/src/lib/content.ts:328` | `'Cuts a clean 1–1.5" deep edge'` | en |
| `apps/web/src/lib/content.ts:332` | `'Paver-safe depth adjustment — no chipping'` | em |
| `apps/web/src/lib/content.ts:338` | `'Every 2–4 weeks is typical...'` | en |
| `apps/web/src/lib/content.ts:342` | `'Yes — we adjust the edger depth...'` | em |
| `apps/web/src/lib/content.ts:350` | `tagline: 'Bulk mulch delivery and professional installation — pine bark, cypress, or hardwood blends.'` | em |
| `apps/web/src/lib/content.ts:352` | `intro: '...install to a 2–3 inch depth with proper bed-edge definition.'` | en |
| `apps/web/src/lib/content.ts:354` | `'Bulk delivery (truckload) — no bagged-mess on your driveway'` | em |
| `apps/web/src/lib/content.ts:356` | `'2–3 inch depth per UF/IFAS recommendation'` | en |
| `apps/web/src/lib/content.ts:359` | `'Spring (March–May) and fall (Oct–Nov) preferred timing'` | en ×2 |
| `apps/web/src/lib/content.ts:365` | `'Pine bark is our most popular — it breaks down slowly...'` | em |
| `apps/web/src/lib/content.ts:369` | `'...suffocate roots — we recommend removal every 2–3 years.'` | em + en |
| `apps/web/src/lib/content.ts:373` | `'Spring (March–May) and fall (October–November) are ideal — mulch holds winter warmth and summer moisture best.'` | en ×3 + em |
| `apps/web/src/lib/content.ts:382` | `intro: '...need trimming 2–4 times per year...'` | en |
| `apps/web/src/lib/content.ts:407` | `tagline: 'Pre-storm yard securing and post-storm debris removal — June through November in Pinellas County.'` | em |
| `apps/web/src/lib/content.ts:409` | `intro: 'Florida hurricane season runs June 1 – November 30...'` | en |
| `apps/web/src/lib/content.ts:425` | `'No — outdoor work stops when winds hit 30 mph sustained...'` | em |
| `apps/web/src/lib/content.ts:436` | `tagline: 'Spring and fall yard cleanup — leaves, debris, bed prep, and haul-off.'` | em |
| `apps/web/src/lib/content.ts:450` | `'Twice a year is typical — late March (spring) and late November (fall)...'` | em |
| `apps/web/src/lib/content.ts:486` | `eyebrow: '01 — Service areas'` | em |
| `apps/web/src/lib/content.ts:489` | `'...neighborhoods — six ZIPs we know well enough...'` | em |
| `apps/web/src/lib/content.ts:506` | `'...plant selection is common — and strict HOA standards...'` | em |
| `apps/web/src/lib/content.ts:520` | `'Established neighborhood with mature oaks — heavy leaf-drop in spring...'` | em |
| `apps/web/src/lib/content.ts:524` | `'My oak drops leaves every week in spring — is that in the mowing rate?'` | em |
| `apps/web/src/lib/content.ts:525` | `'...drops in March–April can be a separate seasonal cleanup visit.'` | en |
| `apps/web/src/lib/content.ts:534` | `'Our home base — fastest response times for this ZIP...'` | em |
| `apps/web/src/lib/content.ts:539` | `'...Hurricane season is the exception — book early...'` | em |
| `apps/web/src/lib/content.ts:548` | `'...new landscaping — different needs than older neighborhoods.'` | em |
| `apps/web/src/lib/content.ts:553` | `'No — irrigation installation requires the PCCLB Irrigation Specialty license...'` | em |
| `apps/web/src/lib/content.ts:566` | `'My yard has a lot of shade — what grass will actually grow?'` | em |
| `apps/web/src/lib/content.ts:576` | `'Coastal influence — sandy soil and salt air...'` | em |
| `apps/web/src/lib/content.ts:607` | `eyebrow: '01 — Pricing'` | em |
| `apps/web/src/lib/content.ts:616` | `'10% off mowing — lock in price + service priority through hurricane season.'` | em |
| `apps/web/src/lib/content.ts:637` | `'...for your records — your choice at quote-time.'` | em |
| `apps/web/src/lib/content.ts:648` | `eyebrow: '01 — About'` | em |
| `apps/web/src/lib/content.ts:654` | `mission: '...enough — hurricanes, humidity, salt air — and a stressed-out yard...'` | em ×2 |
| `apps/web/src/lib/content.ts:657` | `whySolo: '...one-crew operation — every job is performed by the same person...'` | em |
| `apps/web/src/lib/content.ts:695` | `eyebrow: '01 — Contact'` | em |
| `apps/web/src/lib/content.ts:713` | `eyebrow: '01 — Free quote'` | em |
| `apps/web/src/lib/content.ts:716` | `tagline: '...No subscription, no contract — just a flat rate from a local operator.'` | em |
| `apps/web/src/lib/content.ts:721` | `'...schedule your first mow — usually within the same week.'` | em |
| `apps/web/src/lib/content.ts:737` | `eyebrow: '01 — Leave a review'` | em |
| `apps/web/src/lib/content.ts:740` | `tagline: '...compete against the big guys — and it means the world...'` | em |
| `apps/web/src/lib/content.ts:744` | `comingSoonTail: '...with any feedback — good or bad:'` | em |
| `apps/web/src/lib/content.ts:747` | `notRightBody: '...fester — text or call us and we'll be back...'` | em |
| `apps/web/src/lib/content.ts:749` | `notRightTail: '...solo operator — one bad review we didn't try to fix...'` | em |
| `apps/web/src/lib/content.ts:791` | `body: '...or set up monthly — your call.'` | em |
| `apps/web/src/lib/content.ts:796` | `eyebrow: '04 — Pricing'` | em |
| `apps/web/src/lib/content.ts:850` | `eyebrow: '08 — Questions'` | em |
| `apps/web/src/lib/content.ts:861` | `'My gate is locked — how do you get in?'` | em |
| `apps/web/src/lib/content.ts:874` | `'...have a longer wait — book early.'` | em |
| `apps/web/src/lib/content.ts:878` | `'...one of those, ask — I sometimes make exceptions for yards next door.'` | em |
| `apps/web/src/lib/content.ts:892` | `'You mow, you blow, you edge — every time, not sometimes.'` | em |
| `apps/web/src/components/page/PinnedBeforeAfter.tsx:104` | `'Keep scrolling — the cut reveals itself.'` | em |

- **Fix (rule of thumb for replacement):**
  - **Em-dash as parenthetical separator:** replace with `: ` + sentence break, or `, `, or split into two sentences.
    - `'Same guy, same day, every week — I run the route myself.'` → `'Same guy, same day, every week. I run the route myself.'`
  - **Em-dash as enumeration separator:** replace with `,` or restructure.
    - `'Proudly serving 33771 · 33770 — and counting.'` → `'Proudly serving 33771, 33770 and surrounding ZIPs.'`
  - **En-dash in numeric ranges:** the skill allows `to` or `–` is forbidden — replace with `to`.
    - `'2–3 inch depth'` → `'2 to 3 inch depth'`
    - `'April–October'` → `'April through October'`
    - `'0.5–1 acre'` → `'0.5 to 1 acre'`
    - `'1–1.5"' deep edge'` → `'1 to 1.5" deep edge'`
  - **Em-dash in eyebrow/section numbers** (currently `01 — Services`): the eyebrow itself is a banned-pattern point (see Failure 2). Removing eyebrows eliminates most of these.
- **Estimated scope:** 50+ string edits in `lib/content.ts` + 1 in `PinnedBeforeAfter.tsx`. Mechanical pass; no semantic risk.

---

### Failure 2: Eyebrow count on home page exceeds the 1-per-3-sections rule (max 5, current 12-13)
- **Where:** Eyebrow component used on 12 of 14 home-page sections (`apps/web/src/app/page.tsx:1-71`); 1 section uses an inline `<span className={styles.eyebrow}>` (FinalCTABanner). 1 section (MarqueeQuote) has no eyebrow.
- **What:** Per the skill, eyebrows are "anti-slop micro-labels" and the budget is `ceil(sections / 3) = ceil(14/3) = 5`. The current 12-13 instances are more than 2× the budget.
- **Eyebrow locations on `/`:**

| # | File:line | Section | Eyebrow content |
|---|---|---|---|
| 1 | `apps/web/src/components/sections/HeroCinematic.tsx:68-70` | HeroCinematic | `01 - Lawn care in 33771` (hero.eyebrow) |
| 2 | `apps/web/src/components/sections/OperatorStrip.tsx:60-62` | OperatorStrip | `02 - The operator` (inline) |
| 3 | `apps/web/src/components/sections/ServiceBento.tsx:100-102` | ServiceBento | `03 - What I do` (inline) |
| 4 | `apps/web/src/components/sections/PricingTiers.tsx:34-36` | PricingTiers | `04 - Pricing` (pricingHeader.eyebrow) |
| 5 | `apps/web/src/components/sections/EditorialBreak.tsx:59-61` | EditorialBreak | `Every Tuesday, all year` (editorialBreak.eyebrow) |
| 6 | `apps/web/src/components/sections/ServiceAreaStats.tsx:58-60` | ServiceAreaStats | `04.7 - By the numbers` (inline) |
| 7 | `apps/web/src/components/sections/ProcessSteps.tsx:32-34` | ProcessSteps | `05 - How it works` (inline) |
| 8 | `apps/web/src/components/sections/ServiceAreaMap.tsx:78-80` | ServiceAreaMap | `06 - Where I mow` (serviceAreaMap.eyebrow) |
| 9 | `apps/web/src/components/sections/ScheduleTimeline.tsx:60-62` | ScheduleTimeline | (inline — needs const) |
| 10 | `apps/web/src/components/sections/OperatorNote.tsx:42-44` | OperatorNote | `07 - From the operator` (operatorNote.eyebrow) |
| — | `apps/web/src/components/sections/MarqueeQuote.tsx` | MarqueeQuote | (no eyebrow — this is correct) |
| 11 | `apps/web/src/components/sections/FAQAccordion.tsx:31-33` | FAQAccordion | `08 - Questions` (faqHeader.eyebrow) |
| 12 | `apps/web/src/components/sections/FinalCTABanner.tsx:29` | FinalCTABanner | `09 - Ready when you are` (inline span, not Eyebrow component) |

- **Plus: 6 inline card-level eyebrows in ServiceBento** (`apps/web/src/components/sections/ServiceBento.tsx:131-132` — `{svc.eyebrow} — {svc.title}`) and **3 inline eyebrows in PricingTiers** (`apps/web/src/components/sections/PricingTiers.tsx:64` — `<p className={styles.eyebrow}>{tier.eyebrow}</p>`). These are per-card micro-labels that count toward the same anti-slop pattern.
- **Fix:** Cut eyebrows to ≤5 across the home page. Suggested keepers (numbered motif is intentional brand DNA; drop the rest):
  - Keep on **Hero** (entry point)
  - Keep on **ServiceBento** (3rd-section position, sets the "what I do" frame)
  - Keep on **Pricing** (4th-section position, the conversion point)
  - Keep on **ServiceAreaMap** (6th-section position, "where" frame)
  - Keep on **FinalCTA** (9th-section position, closer)
  - **Remove** eyebrows from: OperatorStrip, EditorialBreak, ServiceAreaStats, ProcessSteps, ScheduleTimeline, OperatorNote, FAQAccordion.
  - **Remove** the inline per-card eyebrows in ServiceBento (the card title is enough) and PricingTiers (the price + cadence is enough).
  - **Drop the `dot` prop** on all surviving eyebrows (see Failure 4) — or keep the dot only on Hero if you want a single status indicator.
- **Estimated scope:** 7 eyebrow removals (6 components) + 9 inline-card eyebrow removals (6 in ServiceBento + 3 in PricingTiers). This is the highest-impact pre-flight fix.

---

### Failure 3: Decorative status dots (skill: zero by default; current 20+)
- **Where:** Multiple modules, all using `var(--ll-sun)` for purely decorative bullets rather than status indication.
- **What:** The skill says "colored status dots (background: var(--ll-sun) or var(--ll-clay) for non-status purposes)" are banned by default. The codebase uses 8px sun-color dots with a 3px sun-halo box-shadow in three non-status contexts, plus sun-color 8px sun-halo dots on every `Eyebrow` rendered with the `dot` prop, plus sun-color featured-card ribbons.

- **Decorative dot locations:**

| File:line | Class | Pattern | Count per render | Purpose |
|---|---|---|---|---|
| `apps/web/src/components/sections/HeroCinematic.module.css:324-326` | `.trustDot` | 8px `--ll-sun` + 3px sun halo | 3 (trust row items) | Pure decoration — none of "Serving 6 Pinellas ZIPs" / "24-hour quote turnaround" / "Reply by phone, not a portal" needs a status dot |
| `apps/web/src/components/sections/OperatorStrip.module.css:205-208` | `.toolDot` | 8px `--ll-sun` + 3px sun halo | 4 (equipment list) | Pure decoration on the equipment metabar — the model name + use is the data, the dot adds nothing |
| `apps/web/src/components/sections/ScheduleTimeline.module.css:181` | (`.dayDot` / similar) | `var(--ll-sun)` dot | 7 (one per day) | **Borderline** — could justify as "active/closed" status, but currently every day gets a sun dot regardless of state. Closed-day differentiation needs a separate style, not a same-color decorative dot. |
| `apps/web/src/components/sections/ScheduleTimeline.module.css:231` | (`.todayDot` or similar) | `var(--ll-sun)` | 1 (today) | **Genuine status** — this is OK; today-marker |
| `apps/web/src/components/sections/PricingTiers.module.css:131` | `.ribbon` | `background: var(--ll-sun)` | 1 (featured tier ribbon) | Borderline — "Most booked" ribbon, not strictly decorative. Could keep. |
| `apps/web/src/components/sections/ServiceBento.module.css:119` | (`.featured` ribbon) | `background: var(--ll-clay)` | 1 (mowing featured) | Borderline — "featured" is a real signal. Could keep. |
| Eyebrow `dot` prop — 12 sites (see Failure 2 table) | `.dot` (in `Eyebrow.module.css`) | 6px clay dot | 1 per eyebrow × 12 = 12 | Pure decoration — the eyebrow text already says "01 - Services" |

- **Fix (in priority order):**
  1. **Remove `trustDot` from HeroCinematic** (`.module.css:324-326` and the corresponding JSX at `HeroCinematic.tsx:91-104`). Replace the dot with a 2px clay vertical rule (matches the OperatorNote attribution rule) or remove entirely and let the comma separators do the work.
  2. **Remove `toolDot` from OperatorStrip** (`.module.css:205-208` and JSX at `OperatorStrip.tsx:97-105`). The model name + use label is already a clear list; the dot adds noise.
  3. **Remove `dot` prop from every `Eyebrow` render** — 12 sites. The eyebrow text alone (e.g. `01 - Lawn care in 33771`) is sufficient. Default `dot={false}` in the Eyebrow component (set at `Eyebrow.tsx:30`).
  4. **Keep the ScheduleTimeline `.todayDot`** (`ScheduleTimeline.module.css:231`) — this is genuine status.
  5. **Keep the PricingTiers `.ribbon`** if "Most booked" is the editorial intent, but re-style as a 2px clay top border on the card instead of a sun-color floating ribbon (the floating ribbon is the same dot-as-decoration pattern, larger).
  6. **Keep the ServiceBento featured card** but use a clay left-border treatment (matches the OperatorNote `::before` clay rule idiom at `OperatorNote.module.css:21-30`) instead of a separate ribbon.
- **Estimated scope:** 2 CSS class removals + ~12 JSX `dot` prop removals + 1-2 ribbon re-styles. Clean, mechanical, and removes a meaningful amount of visual noise above-the-fold.

---

### Failure 4: Hero stack carries 8+ text elements (max 4)
- **Where:** `apps/web/src/components/sections/HeroCinematic.tsx:55-128`
- **What:** Per the skill, hero text stack discipline is `eyebrow + headline + subtext + CTAs + trust micro-strip + tagline` capped at **4 elements**. The current hero renders 8 distinct text elements across the copy column and the image overlay slot.

- **Hero text element inventory:**

| # | File:line | Element | Text |
|---|---|---|---|
| 1 | `HeroCinematic.tsx:68-70` | `<Eyebrow>` | `01 - Lawn care in 33771` |
| 2 | `HeroCinematic.tsx:72-78` | `<h1>` (WordReveal × 2 lines) | `Your neighbor's` / `lawn mower.` |
| 3 | `HeroCinematic.tsx:80` | `<p.subhead>` | `Local, solo-operator lawn care in Largo and the five adjacent Pinellas ZIPs. Free quotes within 24 hours. No contract, no franchise markup.` |
| 4 | `HeroCinematic.tsx:82` | `<div.rule>` | (decorative 2px clay rule — does not count as text) |
| 5 | `HeroCinematic.tsx:84-94` | `<div.actions>` | `Get a free quote` + `Call (727) 555-0123` (2 CTAs) |
| 6 | `HeroCinematic.tsx:96-108` | `<div.trustRow>` | 3 trust items: `Serving 6 Pinellas ZIPs` / `24-hour quote turnaround` / `Reply by phone, not a portal` |
| 7 | `HeroCinematic.tsx:120-127` | `<span.cornerStamp>` | `01` (decorative sand-color chip top-left of image) |
| 8 | `HeroCinematic.tsx:128-134` | `<a.callout>` | `33771 - Largo central` (linked to `/areas/33771`) |
| 9 | `HeroCinematic.tsx:135-140` | `<span.caption>` | `Pinellas porch - golden hour` (bottom-left of image) |

- **Counted generously (image column merged into the hero total):** 8 text elements. **Counted strictly (copy column only):** 5 — eyebrow + headline + subhead + actions row + trust row. Either way, well over 4.
- **Fix (keep 4, demote the rest):**
  - **Keep:** `Eyebrow` (1), `Headline` (2), `Subhead` (3), `Primary CTA + Secondary CTA` (4 — count the row as one slot).
  - **Remove from above-the-fold:** `trustRow` (3 items) — move to the next section break (TrustStrip already exists for service-area state). If the trust signals are critical, fold them into the subhead: `"Local, solo-operator lawn care in Largo and the five adjacent Pinellas ZIPs. Free quotes within 24 hours. No contract, no franchise markup. Same guy, same day, every week."`
  - **Remove from the image:** `cornerStamp` (`HeroCinematic.tsx:120-127`) and `caption` (`HeroCinematic.tsx:135-140`) — both are pure decoration. The image alone carries the brand.
  - **Demote the `callout`** to a hover-only state on the image (show on focus/hover) — it currently sits visible at all times on top of the photo and competes with the primary CTA. The same ZIP info is already in the eyebrow (`01 - Lawn care in 33771`).
- **Estimated scope:** ~30 lines of JSX in `HeroCinematic.tsx` + corresponding CSS in `HeroCinematic.module.css`. The hero becomes a clean 4-slot stack: eyebrow, headline, subhead, dual CTA.

---

### Failure 5: CTA duplicate intent (3 phrasings → same `/quote` route)
- **Where:** Home page primary and secondary CTAs.
- **What:** Per the skill, "two CTAs with the same intent" is a fail. The current home page has **3 distinct button labels** all routing to `/quote`, plus a phone-call secondary.

| File:line | Label | Route | Intent |
|---|---|---|---|
| `apps/web/src/lib/content.ts:33-35` (rendered at `HeroCinematic.tsx:84-89`) | `Get a free quote` | `/quote` | Quote request |
| `apps/web/src/lib/content.ts:36-38` (rendered at `HeroCinematic.tsx:90-93`) | `Call (727) 555-0123` | `tel:+17275550123` | Phone (different intent — OK as secondary) |
| `apps/web/src/lib/content.ts:785-790` → `pricingHeader.ctaLabel` (rendered at `PricingTiers.tsx:80`) × 3 cards | `Get a quote` | `/quote` | Quote request (DUPLICATE) |
| `apps/web/src/lib/content.ts:937-941` → `finalCta.cta` (rendered at `FinalCTABanner.tsx:53-58`) | `Get my free quote` | `/quote` | Quote request (DUPLICATE) |
| `apps/web/src/components/sections/ServiceBento.tsx:138-140` × 6 cards | `Learn more` | `/services/[slug]` | Service detail (different intent — OK) |

- **Quote-intent labels on `/`:** `Get a free quote`, `Get a quote`, `Get my free quote` — three different phrasings of the same `/quote` action.
- **Fix (pick one and stick with it):**
  - **Standardize to `Get a free quote`** across the home page. This is the most explicit (it tells the user the price is free, which is the actual value prop — fence-sitting owners want to know they won't be charged for an estimate).
  - Update `pricingHeader.ctaLabel` (`content.ts:789`) to `'Get a free quote'`.
  - Update `finalCta.cta.label` (`content.ts:939`) to `'Get a free quote'`.
  - The pricing-tier cards can use the same `Get a free quote` since they all link to the same route.
- **Estimated scope:** 2 string edits in `content.ts`. Fixes the "where is the form?" clarity problem for users who scan the page top-to-bottom and see inconsistent micro-copy.

---

### Failure 6: PricingTiers uses 3-equal-card layout (banned default)
- **Where:** `apps/web/src/components/sections/PricingTiers.tsx:62-90` and `apps/web/src/components/sections/PricingTiers.module.css:90-94`
- **What:** Per the skill, "three equal-width feature cards in a row" is banned as a default. PricingTiers is `grid-template-columns: repeat(3, 1fr)` — a textbook 3-equal-card row.

```css
/* PricingTiers.module.css:90-94 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* <-- banned 3-equal layout */
  gap: var(--space-4);
  align-items: stretch;
}
```

The three cards are: Mowing $48, Mulching $185 (featured, sun-ribbon + shadow-3), Hurricane prep $95. The featured one is `transform: translateY(-8px)` (line 119) which lifts it, but visually it's still 3 equal columns.

- **Fix (recommended):** Reframe as a **table-comparison layout** that already exists elsewhere (`PricingComparisonTable.tsx`) — OR — **break the grid into a bento**: hero card (mowing, the most-bought) spans 2 columns on desktop, with mulching + hurricane as a 2-col stack. This matches the editorial weight of ServiceBento (which the audit confirms is good) and avoids the banned 3-equal pattern.
  - **Bento sketch (desktop):** `Mowing 8 col | Mulching 4 col` (row 1) + `Hurricane prep 4 col | Mulching 4 col` (row 2, if mulching spans both rows) OR `Hurricane prep 4 col | Trust card 4 col` (testimonial invite + service call).
  - **Cheaper fix:** keep the 3-card structure but **collapse the grid to 2 cards in a 1+1 split** with mulching as the featured (lifts + spans full-width below the others), and move hurricane prep into a `/pricing#hurricane` table-comparison row below.
  - **Simplest fix:** convert the section from "3 pricing cards" to a "1 anchor card + 2-line tier list" — anchor card (mowing) is the most-booked full-price call-out, with mulching + hurricane as typographic tier-rows underneath. This reads as a price list, not a card grid.
- **Estimated scope:** 1 layout refactor. Highest-impact structural change in this audit, but the file is small (~95 lines of CSS, ~80 lines of TSX).

---

## Pre-Flight Warnings (should fix)

### Warning 1: Inter is the only sans-serif typeface
- **Where:** `apps/web/src/styles/typography.css:9-19` and `apps/web/src/app/layout.tsx:32-43`
- **What:** The site uses Inter (sans) for body + nav + eyebrows + micro-copy, and Fraunces (serif, variable axes opsz) for `h1.display`, `h2.display`, `.display-xl/lg/sm`. The skill's "more editorial sans" suggestion (Cabinet Grotesk, Söhne, etc.) is not literally violated — Fraunces is doing the editorial work — but the eyebrow + micro-copy typography (Inter) reads as utility / generic startup. The eyebrow at `01 - Lawn care in 33771` looks indistinguishable from any other Inter-rendered uppercase tracked label.
- **Fix (optional):** Swap Inter for **Söhne** (or **Cabinet Grotesk**) for the eyebrow + small-caps micro-copy only, keep Inter for body. The cost is one more next/font/google import + one more CSS variable. Alternative: keep Inter but tighten the eyebrow kerning/weight/letter-spacing to feel more editorial (e.g. `letter-spacing: 0.16em` instead of `0.12em`, `font-weight: 500` instead of `600`).

### Warning 2: Section padding rhythm is uneven (5 distinct values across 14 sections)
- **Where:** Mixed `padding-block` values on home page sections.
- **What:** The skill expects a tight rhythm (e.g. `py-12/16/20/24` mix). The current page uses 5 distinct section paddings:

| Section | padding-block | Value |
|---|---|---|
| HeroCinematic (own `.root`) | `var(--space-10)` | 64px |
| TrustStrip (own `.root`) | `var(--space-5)` | 20px |
| OperatorStrip (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| ServiceBento (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| PricingTiers (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| EditorialBreak (own `.root`) | `0` outer + `var(--space-13)` inner copy | 0 / 128px |
| ServiceAreaStats (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| ProcessSteps (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| ServiceAreaMap (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| ScheduleTimeline (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| OperatorNote (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| MarqueeQuote (own `.root`) | `var(--space-8)` | 40px |
| FAQAccordion (Section `rhythm="loose"`) | `var(--space-13)` | 128px |
| FinalCTABanner (own `.root`) | `var(--space-7)` + top `var(--space-8)` | 32px / 40px |

- The spread is {20, 32, 40, 64, 128}. Most sections use 128px (via `Section rhythm="loose"`), but the four non-Section components (HeroCinematic, TrustStrip, MarqueeQuote, FinalCTABanner) are outliers.
- **Fix:** Standardize on 2-3 padding values. Recommended: hero (96-128px), body (64-80px), thin-bands (32-40px). Update:
  - `TrustStrip.module.css:11` from `--space-5` (20px) → `--space-7` (32px) or `--space-8` (40px) to match other dark "band" sections.
  - `MarqueeQuote.module.css:17,81` from `--space-8` (40px) → `--space-10` (64px) to match the body rhythm.
  - `FinalCTABanner.module.css:66-67` from `--space-7` + top `--space-8` → `--space-10` symmetric to align with the body rhythm (this is the page closer, deserves full padding).
  - `HeroCinematic.module.css:36` from `--space-10` (64px) → keep at 64px or bump to `--space-12` (96px); the section's `min-height: clamp(640px, 88vh, 880px)` already carries the hero weight.

### Warning 3: Hand-rolled decorative SVGs should be removed or replaced
- **Where:** `apps/web/public/illustrations/` and `apps/web/public/` root.
- **What:** Per the skill, decorative SVGs are "strongly discouraged as default but acceptable when single, simple geometric mark." Several of the SVGs in the kit are hand-drawn illustrations that exceed the simple-geometric-mark bar.

| File | Referenced? | Type | Verdict |
|---|---|---|---|
| `apps/web/public/illustrations/clock.svg` | No (search shows zero references in `src/`) | Hand-drawn analog clock — 11+ SVG elements (face, ticks, hands, hub, sun arc) | **REMOVE** (unreferenced) — if it WAS used and got removed, the file should be deleted |
| `apps/web/public/illustrations/empty-state-before-after.svg` | Yes (`EmptyState.tsx:42`) | Hand-drawn before/after panels with text labels, weeds, sky | **REFACTOR** — too complex for a "no content yet" empty state. Replace with a single geometric mark (circle + line) or a small typographic line "Coming soon" |
| `apps/web/public/illustrations/empty-state-hose.svg` | Yes (`EmptyState.tsx:36`) | Hand-drawn hose forming a question mark | **REFACTOR** — too elaborate. Replace with a single `?` glyph in Fraunces italic, sun-color, on the sand-bleached surface |
| `apps/web/public/illustrations/empty-state-yard.svg` | Yes (`EmptyState.tsx:30`) | Hand-drawn grass + sun + cloud, gradient bg | **REFACTOR** — replace with a single 80px sun-color dot or a 3-line grass-blade SVG (max 5 paths) |
| `apps/web/public/illustrations/quote-mark.svg` | Yes (`app/preview/brand/page.tsx:119`) | Hand-drawn paired quotation glyphs (2 paths) | **KEEP** — small, geometric, single use in brand preview only |
| `apps/web/public/illustrations/logo-mark-v3-{32,64,128,256,1024}.webp` | Yes (`LogoMark.tsx:29-34`, `app/preview/brand/page.tsx:61-62`) | Painted storybook mark, ComfyUI-generated | **KEEP** — active brand mark, painted per D-0011 |
| `apps/web/public/illustrations/mower-side-profile-v3-{120,240}.webp` | Yes (`ScheduleTimeline.tsx:106`) | Painted mower side profile | **KEEP** — active in `ScheduleTimeline` |
| `apps/web/public/illustrations/pinellas-map-v3-800x1000.webp` | Yes (`ServiceAreaMap.tsx:102`) | Painted Pinellas map | **KEEP** — active in `ServiceAreaMap` |
| `apps/web/public/illustrations/pinellas-palm-v3-{72,120,600x400}.webp` | Yes (`SiteFooter.tsx:61`, `OperatorStrip.tsx:78`, `PricingTiers.tsx:47`, `ServiceAreaStats.tsx:50`) | Painted palm mark, 3 sizes | **KEEP** — active brand mark |
| `apps/web/public/illustrations/quote-mark-v3-{56,120,240,480}.webp` | Yes (`FinalCTABanner.tsx:37`, `app/preview/brand/page.tsx:99-100`) | Painted quote glyph, 4 sizes | **KEEP** — active ornament |
| `apps/web/public/apple-touch-icon.svg` | Yes (`manifest.webmanifest:20`) | Favicon | **KEEP** — favicon |
| `apps/web/public/icon.svg` | Yes (Next.js convention `/icon.svg` route) | Favicon | **KEEP** — favicon |
| `apps/web/public/logo.svg` | Yes (`app/preview/brand/page.tsx:40`) | Wordmark logo | **KEEP** — brand preview |
| `apps/web/public/logo-lockup.svg` | No (zero references) | Mark + wordmark pairing | **REMOVE** — unreferenced |
| `apps/web/public/logo-mark-inverse.svg` | No (zero references) | Inverse-color mark | **REMOVE** — unreferenced |
| `apps/web/public/logo-mark-mono.svg` | No (zero references) | Mono-color mark | **REMOVE** — unreferenced |
| `apps/web/public/logo-mark.svg` | Yes (`LogoMark.tsx:44`, `app/preview/brand/page.tsx:81`) | Mark only | **KEEP** — line-art fallback |

- **Fix:**
  - Delete `clock.svg` (unreferenced).
  - Delete `logo-lockup.svg`, `logo-mark-inverse.svg`, `logo-mark-mono.svg` (unreferenced).
  - Refactor the 3 empty-state SVGs to single-geometric-mark forms (a sun-color 80px circle for "yard", a Fraunces `?` glyph for "hose", a single horizon line for "before/after"). The current versions are storybook-painted, which contradicts the post-D-0013b revert direction.
  - Keep all v3 painted webp illustrations — they're the active brand kit.

### Warning 4: EyebrowConvention uses em-dashes that read as numbering motif
- **Where:** `apps/web/src/lib/content.ts:30, 78, 266, 486, 607, 648, 695, 713, 737, 796, 850, 957, 971` (13 eyebrows numbered `01 — ...`, `04.7 — ...`, etc.)
- **What:** Independent of Failure 1, the eyebrow numbering motif itself (the `01 —` / `02 —` / `04.7 —` pattern) is a Mavis-style AI tell. The skill flags numbered-eyebrows as an anti-slop pattern when overused. 13 numbered eyebrows on a 14-section home page is overused. (This overlaps with Failure 2 but is a separate concern — even after cutting to 5, the surviving eyebrows should drop the `01 -` prefix and read as plain category labels, e.g. `Pricing` instead of `04 - Pricing`.)
- **Fix:** When implementing Failure 2, also drop the `NN - ` prefix on the 5 surviving eyebrows. Use the bare category label only.

### Warning 5: HeroCinematic callout pill duplicates the eyebrow
- **Where:** `apps/web/src/components/sections/HeroCinematic.tsx:128-134`
- **What:** The hero renders two separate ZIP-anchored labels:
  - **Eyebrow** (line 68-70): `01 - Lawn care in 33771`
  - **Callout pill** on the image (line 128-134): `33771 - Largo central` (linked to `/areas/33771`)
  Both say the same thing ("this is the 33771 area"). The callout is decorative repetition.
- **Fix:** Either drop the callout (already covered in Failure 4) OR drop the eyebrow and let the callout do the section-numbering. Pick one.

---

## Pre-Flight Passes (verified clean)

- **Marquee quote lengths:** All 7 lines in `operatorMarquee` (`content.ts:889-897`) are under 80 characters:
  - `Same guy, same Tuesday.` — 22 chars
  - `The mulch goes in the bed, not on the lawn.` — 41 chars
  - `You mow, you blow, you edge — every time, not sometimes.` — 55 chars (after Failure 1 fix: drop em-dash → `You mow, you blow, you edge. Every time, not sometimes.` — 51 chars)
  - `If I can't do it Tuesday, you'll know by Sunday night.` — 56 chars
  - `A locked gate is fine. A locked gate I do not know about is not.` — 64 chars
  - `I do not subcontract. You booked me, you get me.` — 51 chars
  - `I would rather tell you do not need a service than sell you one.` — 67 chars
  All fit comfortably on a single marquee line at any viewport ≥ 360px.
- **ServiceBento uses 6-card asymmetric bento:** `apps/web/src/components/sections/ServiceBento.tsx:113-150` and `.module.css`. Layout is 8-col featured mowing + 4-col mulching (row 1) + 4+4 edging+hedge (row 2) + 4-col hurricane (row 3) + 12-col seasonal cleanup callout. This is the GOOD pattern the skill asks for — the 3-equal-card problem is contained to PricingTiers (Failure 6).
- **Typography is a 2-font pairing:** Inter (sans, body/nav/eyebrow/micro) + Fraunces (serif variable, display only). The `next/font/google` imports at `layout.tsx:32-43` are correct, no Google Fonts CDN `@import`. Both `font-display: swap`, both preloaded.
- **Section component has rhythm variants:** `<Section rhythm="default|tight|loose|hero">` at `Section.tsx:13` and `Section.module.css:7-22`. The default = 64px, tight = 32px, loose = 128px, hero = 96px+80vh. The variant system is sound; the issue is which sections override it (Warning 2).
- **No invented customer quotes:** `social.proof: []` is empty by design (`content.ts:990-996`), and the `Empty-state invariant` comment locks the empty array until steward supplies real reviews. TestimonialQuote component renders nothing when array is empty. This is exactly the brand-voice rule the brand guidelines require.
- **EditorialBreak italic-on-photo is a single deliberate moment:** The comment at `EditorialBreak.tsx:13-15` explicitly notes the italic-Fraunces headline is the only italic-on-photo in the section library. Reads as intentional editorial weight, not a pattern.
- **Reduced-motion fallbacks are wired through every motion primitive:** WordReveal, FadeUp, ParallaxImage, PinnedBeforeAfter, MarqueeQuote all collapse to static variants on `prefers-reduced-motion: reduce`. This is consistent with the brand-voice promise of no motion-franchise patterns.

---

## Detailed Counts

- **Em-dashes found in user-facing text:** **~50+** in `apps/web/src/lib/content.ts` + **1** in `apps/web/src/components/page/PinnedBeforeAfter.tsx:104`. Plus en-dashes (`–`) in numeric ranges and date spans — another **~25+** instances. Comments are not counted.
- **En-dashes found in user-facing text:** ~25 in `content.ts` (line numbers in Failure 1 table above).
- **Eyebrows on home page:** **12 via Eyebrow component** (Hero, OperatorStrip, ServiceBento, PricingTiers, EditorialBreak, ServiceAreaStats, ProcessSteps, ServiceAreaMap, ScheduleTimeline, OperatorNote, FAQAccordion, FinalCTABanner-as-span) + **6 inline card eyebrows in ServiceBento** + **3 inline card eyebrows in PricingTiers** = **21 eyebrow micro-labels** on 14 sections. Max allowed = **5**.
- **CTA intents on home page (consolidated):**
  - **Quote request** (`/quote`): `Get a free quote` (hero), `Get a quote` (pricing × 3), `Get my free quote` (final CTA) — **3 distinct labels, 1 intent** = FAIL
  - **Phone call** (`tel:...`): `Call (727) 555-0123` (hero secondary) — 1 distinct label, 1 intent = OK
  - **Service detail** (`/services/[slug]`): `Learn more` (ServiceBento × 6) — 1 distinct label, 1 intent = OK
- **Quote lengths (operatorMarquee):** 22, 41, 55, 56, 64, 51, 67 chars. All ≤ 80 chars.
- **Decorative SVG count:**
  - **REMOVE (unreferenced):** `clock.svg`, `logo-lockup.svg`, `logo-mark-inverse.svg`, `logo-mark-mono.svg` (4 files)
  - **REFACTOR (active, complex hand-drawn):** `empty-state-before-after.svg`, `empty-state-hose.svg`, `empty-state-yard.svg` (3 files)
  - **KEEP (active, simple geometric or painted brand kit):** `quote-mark.svg`, all `logo-mark-v3-*.webp`, `mower-side-profile-v3-*.webp`, `pinellas-map-v3-*.webp`, `pinellas-palm-v3-*.webp`, `quote-mark-v3-*.webp`, `apple-touch-icon.svg`, `icon.svg`, `logo.svg`, `logo-mark.svg` (16 files)
- **Section padding spread (home page, 14 sections):** `20px` (TrustStrip), `32-40px` (MarqueeQuote, FinalCTABanner), `64px` (HeroCinematic), `128px` (10 sections via Section rhythm="loose"). 4 distinct values, with the trust strip + final banner as the thinnest outliers and the body sections unified at 128px.

---

## Suggested Commit Order (drives next 1-2 commits)

1. **Commit A (copy + structure pass):**
   - Fix Failure 1: replace all em-dashes and en-dashes in `content.ts` user-facing strings.
   - Fix Failure 5: standardize home-page CTAs to `Get a free quote` in `content.ts` `pricingHeader.ctaLabel` and `finalCta.cta.label`.
   - Fix Failure 2 part 1: remove `dot` prop from all 12 `<Eyebrow>` renders in home-page components (and set `dot={false}` as the default in `Eyebrow.tsx`).
   - Fix Failure 3 part 1: remove `.trustDot` and `.toolDot` CSS classes + their JSX references.
   - Estimated LOC: ~80 string edits in `content.ts`, ~20 JSX edits, ~15 CSS line removals.

2. **Commit B (eyebrow + hero-stack + structural pass):**
   - Fix Failure 2 part 2: cut eyebrows from 12 to 5 on the home page (remove from OperatorStrip, EditorialBreak, ServiceAreaStats, ProcessSteps, ScheduleTimeline, OperatorNote, FAQAccordion; remove inline card eyebrows from ServiceBento × 6 and PricingTiers × 3).
   - Fix Failure 4: collapse hero stack to 4 elements (eyebrow + headline + subhead + actions); remove `trustRow`, `cornerStamp`, `caption`; demote `callout` to hover state.
   - Fix Failure 6: refactor PricingTiers from 3-equal grid to bento or 1+2 split.
   - Fix Warning 1 (optional): swap Inter for Söhne/Cabinet Grotesk on eyebrows only.
   - Fix Warning 2: standardize section padding on 2-3 values.
   - Fix Warning 3: delete 4 unreferenced SVGs; refactor 3 empty-state SVGs to geometric marks.
   - Fix Warning 4: drop `NN - ` prefix on the 5 surviving eyebrows.
   - Fix Warning 5: drop the hero callout (already covered in Failure 4) or the eyebrow.
   - Estimated LOC: ~200 lines across 14 component + 14 CSS module files.

---

**Audit complete. No files modified.**
