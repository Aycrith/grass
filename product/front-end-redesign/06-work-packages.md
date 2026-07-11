# PRD-06 — Work Packages

**Purpose:** Concrete sequenced ticket breakdown for executing the
front-end redesign. Each package has a clear deliverable, dependency,
and effort estimate.

**Audience:** Engineering division (execution), Steward (sequencing)

---

## Sequencing strategy

Phases are sequenced by **dependency**: each phase must complete before
the next starts. Within a phase, packages can be parallelized if the
team has multiple agents.

| Phase | Name | Duration | Parallelizable? |
|---|---|---|---|
| A | Steward direction | T+0 → T+response | No (blocks all) |
| B | Design system + tokens | T+1 → T+3 | Mostly parallel |
| C | Asset production | T+1 → T+8 | Yes (parallel with B, D) |
| D | Surface implementation | T+4 → T+10 | Yes (multiple surfaces at once) |
| E | QA + lighthouse pass | T+11 → T+12 | Mostly parallel |
| F | Soft launch + monitoring | T+13 → ongoing | Yes |

---

## Phase A — Steward Direction

### A1. Steward answers Q1–Q8
- **Source:** `00-master-prd.md` § 6
- **Owner:** Steward
- **Duration:** Variable (1 day to 1 week)
- **Blocker:** Yes — every other package depends on this
- **Deliverable:** Updated `01-design-system-prd.md` with concrete
  palette, typography, motion philosophy

### A2. Steward provides operator bio + photo
- **Owner:** Steward
- **Deliverable:** `lib/content.ts` populated with `operator.name`,
  `operator.bio`, `operator.photoSrc`

### A3. Steward provides service-area + service copy
- **Owner:** Steward
- **Deliverable:** `lib/content.ts` populated with per-ZIP
  `neighborhoodNotes`, per-service hero photo paths

---

## Phase B — Design System + Tokens

### B1. Token CSS file
- **Source:** `01-design-system-prd.md` § 1–5
- **Owner:** Engineering
- **Effort:** Small (2-4 hours)
- **Deliverable:** `apps/web/src/styles/tokens.css` with all
  CSS custom properties
- **Acceptance:** Every token from § 1–5 of design-system-prd is
  defined; build is green

### B2. Typography setup
- **Owner:** Engineering
- **Effort:** Small (1-2 hours)
- **Deliverable:** `apps/web/src/styles/typography.css` with type
  scale, weight ramp, line-heights
- **Acceptance:** Headings, body, captions render at correct sizes;
  web fonts load with `font-display: swap`

### B3. Reset + base styles
- **Owner:** Engineering
- **Effort:** Small (1 hour)
- **Deliverable:** `apps/web/src/styles/reset.css`
- **Acceptance:** Consistent across browsers; minimal footprint

### B4. Component CSS modules — atoms
- **Owner:** Engineering
- **Effort:** Medium (4-6 hours)
- **Deliverable:**
  - `components/Button.module.css`
  - `components/Input.module.css`
  - `components/Badge.module.css`
  - `components/LogoMark.module.css`
- **Acceptance:** Each component renders correctly at /preview/design/components

### B5. Component CSS modules — molecules
- **Owner:** Engineering
- **Effort:** Medium (6-8 hours)
- **Deliverable:**
  - `components/Card.module.css`
  - `components/Section.module.css`
  - `components/Quote.module.css`
  - `components/Avatar.module.css`
  - `components/Faq.module.css`
  - `components/Toast.module.css`
- **Acceptance:** Each component renders correctly at /preview/design/components

### B6. Component CSS modules — organisms
- **Owner:** Engineering
- **Effort:** Large (8-12 hours)
- **Deliverable:**
  - `components/Hero.module.css`
  - `components/Nav.module.css`
  - `components/Footer.module.css`
  - `components/Gallery.module.css`
- **Acceptance:** Each renders correctly; mobile drawer works on Nav

### B7. Theme preview route
- **Owner:** Engineering
- **Effort:** Small (2 hours)
- **Deliverable:** `apps/web/src/app/preview/design/page.tsx`
  (extends existing /preview route)
- **Acceptance:** Color swatches, type scale, all components visible
  in a single page

---

## Phase C — Asset Production

### C1. Operator portrait photo session
- **Owner:** Steward
- **Effort:** 30 min (1 session)
- **Deliverable:** `apps/web/public/operator/portrait.webp`

### C2. Truck + equipment photos
- **Owner:** Steward
- **Effort:** 1 hour (1 session)
- **Deliverable:** `apps/web/public/truck/side.webp` + 4 equipment files

### C3. Hero photo (homepage)
- **Owner:** Steward
- **Effort:** 30 min
- **Deliverable:** `hero/desktop.webp` + `hero/mobile.webp`

### C4. Service hero photos (6)
- **Owner:** Steward
- **Effort:** 2 hours (one job day, take photos during/after each service)
- **Deliverable:** 6 files in `apps/web/public/services/`

### C5. Area hero photos (6)
- **Owner:** Steward
- **Effort:** 2 hours (one drive through each ZIP)
- **Deliverable:** 6 files in `apps/web/public/areas/`

### C6. Work sample photos (8-10)
- **Owner:** Steward
- **Effort:** Accumulated over first 10 jobs
- **Deliverable:** 8-10 files in `apps/web/public/work/`

### C7. Custom icons (6-8)
- **Owner:** Engineer (inline SVG)
- **Effort:** 3-4 hours
- **Deliverable:** `apps/web/src/components/icons/*.tsx`

### C8. Empty-state illustrations (3-4)
- **Owner:** Engineer (inline SVG)
- **Effort:** 2-3 hours
- **Deliverable:** `apps/web/src/components/illustrations/*.tsx`

---

## Phase D — Surface Implementation

### D1. Layout refresh (header, footer, root)
- **Source:** `03-surfaces-prd.md` § shared constraints
- **Owner:** Engineering
- **Effort:** Medium (4-6 hours)
- **Deliverable:** Updated `layout.tsx` + new `Nav` + `Footer`
  components
- **Acceptance:** Sticky header with new design; mobile drawer works;
  footer matches new design system

### D2. Homepage
- **Source:** `03-surfaces-prd.md` § 1
- **Owner:** Engineering
- **Effort:** Large (8-12 hours)
- **Deliverable:** Redesigned `page.tsx` with new Hero, operator strip,
  service cards, why-us, final CTA
- **Acceptance:** LCP < 2.5s, all CTAs functional, mobile layout correct

### D3. Quote /quote
- **Source:** `03-surfaces-prd.md` § 2
- **Owner:** Engineering
- **Effort:** Medium (4-6 hours, calculator logic already exists)
- **Deliverable:** Styled QuoteCalculator + page
- **Acceptance:** Form submit works, all states render, mobile keyboard ok

### D4. Services /services + /services/[slug]
- **Source:** `03-surfaces-prd.md` § 3
- **Owner:** Engineering
- **Effort:** Large (8-10 hours)
- **Deliverable:** Restyled services index + per-service page
- **Acceptance:** Each service has unique hero photo, FAQ renders,
  pricing matches

### D5. Areas /areas + /areas/[zip]
- **Source:** `03-surfaces-prd.md` § 4
- **Owner:** Engineering
- **Effort:** Medium (4-6 hours)
- **Deliverable:** Restyled areas index + per-ZIP page
- **Acceptance:** Map or visual showing coverage, per-ZIP notes visible

### D6. About /about
- **Source:** `03-surfaces-prd.md` § 5
- **Owner:** Engineering
- **Effort:** Medium (3-4 hours)
- **Deliverable:** Operator bio + equipment grid + truck photo + "what
  I won't do" + "when I won't work" sections

### D7. Contact /contact
- **Source:** `03-surfaces-prd.md` § 6
- **Owner:** Engineering
- **Effort:** Small (2-3 hours)
- **Deliverable:** Two-column layout, restyled form

### D8. Pricing /pricing
- **Source:** `03-surfaces-prd.md` § 7
- **Owner:** Engineering
- **Effort:** Small (2-3 hours)
- **Deliverable:** Pricing tables + FAQ + CTA

### D9. QR codes /qr
- **Source:** `03-surfaces-prd.md` § 8
- **Owner:** Engineering
- **Effort:** Small (1-2 hours)
- **Deliverable:** Restyled QR download page using new design system

### D10. Privacy /privacy + Terms /terms
- **Source:** `03-surfaces-prd.md` § 10
- **Owner:** Engineering
- **Effort:** Small (1-2 hours)
- **Deliverable:** Long-form readable layout using new typography

### D11. GBP landing /gbp
- **Source:** `03-surfaces-prd.md` § 11
- **Owner:** Engineering
- **Effort:** Small (1-2 hours)
- **Deliverable:** Restyled GBP landing

### D12. Not-found /not-found
- **Source:** `03-surfaces-prd.md` § 12
- **Owner:** Engineering
- **Effort:** Trivial (1 hour)
- **Deliverable:** Warm 404 page with brand voice

---

## Phase E — QA + Lighthouse Pass

### E1. axe-core accessibility audit
- **Owner:** Engineering + QA
- **Effort:** 2-3 hours
- **Deliverable:** `scripts/axe-audit.ts` runs against every page,
  reports violations
- **Acceptance:** Zero violations on every page

### E2. Lighthouse CI integration
- **Owner:** Engineering
- **Effort:** 2-3 hours
- **Deliverable:** `.github/workflows/lighthouse.yml` runs on every PR
- **Acceptance:** All four categories hit targets from `07-success-metrics.md`

### E3. Manual mobile testing
- **Owner:** QA + Engineering
- **Effort:** 3-4 hours
- **Deliverable:** Tested on iPhone SE, mid-tier Android, iPad
- **Acceptance:** No layout issues; CTAs tappable; keyboard accessible

### E4. Reduced-motion verification
- **Owner:** QA
- **Effort:** 1-2 hours
- **Deliverable:** All animated properties collapse to instant under
  reduced-motion
- **Acceptance:** Manual test passes; `04-motion-and-microinteractions.md`
  spec honored

### E5. Cross-browser smoke test
- **Owner:** QA
- **Effort:** 2 hours
- **Deliverable:** Chrome, Safari, Firefox, Edge — all surfaces render
- **Acceptance:** Visual parity within 1% color deviation

### E6. Color contrast audit
- **Owner:** QA + Engineering
- **Effort:** 1-2 hours
- **Deliverable:** All foreground/background pairs hit WCAG AA
- **Acceptance:** axe-core reports zero violations

---

## Phase F — Soft Launch + Monitoring

### F1. Deploy to Vercel
- **Owner:** Engineering
- **Effort:** 1 hour
- **Deliverable:** Live at production URL
- **Acceptance:** Build green, DNS cutover successful

### F2. PostHog event verification
- **Owner:** Engineering
- **Effort:** 1-2 hours
- **Deliverable:** Homepage → /quote funnel events firing
- **Acceptance:** Events visible in PostHog

### F3. Real-user monitoring enabled
- **Owner:** Engineering
- **Effort:** 1 hour
- **Deliverable:** Web Vitals RUM reporting to PostHog
- **Acceptance:** Dashboard shows real-user LCP, CLS, INP

### F4. First-week observation
- **Owner:** Marketing + Engineering
- **Effort:** 1 hour/day for 7 days
- **Deliverable:** Daily check-in on conversion rate, bounce rate,
  Lighthouse scores
- **Acceptance:** Metrics trending toward targets from
  `07-success-metrics.md`

---

## Dependency graph (visual)

```
A1 ──┬──> B1 ──> B4 ──> B5 ──> B6
     │
     ├──> B2 ──┐
     ├──> B3 ──┤
     │
     └──> C* (parallel with B)
              │
              └──> D* (after B + C complete)
                       │
                       └──> E* (after D complete)
                                │
                                └──> F* (after E complete)
```

A2, A3 (steward-provided content) blocks D2, D5, D6.

---

## Effort totals (engineering hours, ballpark)

| Phase | Effort | Days @ 6h/day |
|---|---|---|
| B — Design system | 24-34 hours | 4-6 days |
| C — Engineering assets | 5-7 hours (icons, illustrations) | 1-2 days |
| D — Surface implementation | 38-55 hours | 6-9 days |
| E — QA | 11-16 hours | 2-3 days |
| F — Launch | 4-6 hours | 1 day |
| **Total engineering** | **82-118 hours** | **14-20 days** |

Plus Phase C stewardship: ~6-8 hours total for photos (1 day +
accumulated over jobs).

**At autonomous-pace (single AI agent + steward):** 4-6 calendar weeks
end-to-end.

---

## What this PRD does NOT cover

- Pricing for designer or contractor work (none — fully autonomous)
- Launch marketing (separate PRD)
- A/B testing infrastructure (post-launch)