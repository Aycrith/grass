# Plan: Adjust Business Offerings Across Website, Ads, and Documentation

> **Status:** FINAL — ready for steward approval.
>
> **Source-grounded in:**
> - `output/reports/2026-07-31_service-expansion-brainstorming.md` (20 ranked services, 2026-07-31)
> - `governance/decisions/0064-paid-acquisition-pilot.md` (binding pilot scope)
> - `governance/decisions/0065-pet-waste-service-ratification.md`
> - `governance/decisions/0066-outbound-sms-consent.md`
> - Three read-only audits (this session, 2026-07-30): documentation, website, ads/GTM
>
> **Scope:** Re-align all customer-facing surfaces (website, ads, GBP, citations, business plan, governance docs) with the **binding 4-state rollout**:
> 1. **Now (State 1)** — pet waste only, Google Search only (D-0064)
> 2. **Stage 7 (State 2)** — expand pet waste to Microsoft + add hurricane prep (after pilot outcome ADR)
> 3. **Year 1 Q2 (State 3)** — add palm trim (after license/subcontractor ADR)
> 4. **Year 1 Q3–Q4 (State 4)** — full service catalog across channels
>
> **No code lands in this plan.** This is a strategy + sequencing document. Each gate ends with a Go/No-Go decision the steward makes.

---

## Context

The user invoked `/effort` (ultracode, xhigh) to "develop the best possible plan and strategy to adjust the business offerings offered through the website and the various advertisements and information for this business and its offerings, all of its documentation, its advertisements, its website, etcetera."

Three independent audits surfaced the same structural problem across three surfaces:

| Surface | Audit finding | Source |
|---|---|---|
| **Documentation** | 11 categories of drift (loan ask, tax, wage, domain cost, service pricing, ZIP list, insurance claim, "since 2020", "47 yards", 5-min vs 18-hour SLA) | Agent 1 (this session) |
| **Website** | 13 strategy-relevant inconsistencies (pricing across 6 surfaces, $1M claim vs terms contradiction, "since 2020" unsubstantiated, 5-min vs 18-hour SLA conflict, synthetic before/after imagery, missing pet-waste image, broken /service-areas link, /pet-waste off-registry) | Agent 2 (this session) |
| **Ads + GTM** | 3 competing stacks of GTM artifacts; the binding one (D-0064) is NOT the most recently authored; CSV `enabled` flags + runbook + command center all contradict D-0064; /pet-waste has GA4 + Meta CAPI + ConsentBanner hard-stop violations | Agent 3 (this session) |

**The single most important finding:** the repo has three competing GTM stacks coexisting, and the binding one is not the most recently authored. Every later file (15-pre-launch-runbook, 20-launch-command-center, 22-zero-budget-deploy-guide, all three CSVs marked `enabled`) instructs the operator to upload and unpause three channels (Google + Microsoft + Meta) with the full GA4 + Meta Pixel + CAPI + Twilio stack — which is exactly what D-0064 §0.9 and the landing-spec §8 prohibit as a hard-stop.

The 20-service brainstorm (`output/reports/2026-07-31_service-expansion-brainstorming.md`) ranks pet waste (#1), hurricane prep+cleanup (#2), palm trim (#3), pool cage clean (#4), weekly mowing (#5) as the top 5 — but D-0064 currently authorizes ONLY pet waste for any paid acquisition. Promoting the other top-5 services requires:

1. D-0064 amendment (or new ADR for the staging) per the hard-stop rule
2. Capability registration in `state/capability-registry.yaml`
3. Pricing/insurance/availability verification
4. Twin model update (`architecture/twin/service.md`)
5. Cross-surface propagation (website + ads + GBP + docs)

**The strategy must sequence these approval gates so the business can grow without breaking the binding pilot scope.**

---

## 1. Strategic Frame — The 4-State Rollout

All customer-facing surfaces must present the same service catalog at any given moment. The catalog evolves in 4 discrete states, each gated by an ADR or pilot outcome.

### State 1 — Pet Waste Only (Now, binding under D-0064)

**Authorized scope:**
- **Service:** Pet waste cleanup only (D-0065).
- **Channel:** Google Search only (D-0064 §0.1). No Meta, Microsoft, Yelp, Nextdoor, Thumbtack, retargeting.
- **Landing:** `/pet-waste` page with 3-field form, tap-to-call, tap-to-text.
- **Trust:** Single line of substantiated claims only. No star ratings, no "since 2020", no "$1M insured" without policy number.
- **Spend:** Free credits only; pause if CAC > $138.

**Hard-stop violations in current repo** (must be stripped):
- `apps/web/src/lib/server-track.ts` (GA4 MP + Meta CAPI)
- `apps/web/src/components/analytics/AnalyticsProvider.tsx` + `ConsentBanner.tsx`
- `apps/web/src/lib/track.ts` (window.gtag / window.fbq)
- `apps/web/src/app/api/lead/route.ts` GA4 + Meta CAPI fires
- `output/gtm/15-pre-launch-runbook.md` (3-channel unpause, GA4 + Meta setup steps)
- `output/gtm/20-launch-command-center.html` (same + compromised password reference)
- `output/gtm/13-microsoft-ads-bulk-import.csv` rows marked `enabled` (must be `paused`)
- `output/gtm/12-meta-ads-bulk-import.csv` (must remain `paused`)
- `output/gtm/.env.local.template` (live Twilio SID/token — must be rotated)
- `output/gtm/05-account-setup-presentation.html` + `21-twilio-verified-recipient.md` (live credentials in plaintext)

**Authorization:** D-0064, D-0065, D-0066 (binding).

### State 2 — Pet Waste + Hurricane Prep (Stage 7+, after pilot outcome ADR)

**Trigger:** Pilot outcome ADR (Stage 6) ratifies CAC ≤ $138 + ≥5 customers OR identifies a positive trajectory.

**Authorized scope expansion:**
- **Service:** Pet waste + hurricane prep+cleanup (no license required).
- **Channels:** Google Search + Microsoft Search (gated on pilot learnings); Meta still out of scope.
- **Landing:** New `/services/hurricane-prep` page with seasonal pricing.

**Why hurricane prep first (matches brainstorm #2):**
- No additional license required (Florida hurricane prep is unrestricted for non-arborist work).
- Registered capability already exists in `state/capability-registry.yaml` (hurricane prep+cleanup).
- Seasonal urgency (June–November) creates natural promotion windows.
- Solo-operator feasible (6-hour job max for typical residential lot).
- Synergistic with pet waste customers (already on the route).

**Hard requirements before greenlighting:**
- Hurricane pricing ladder ratified (current: $175 pre / $350 light / $650 heavy per `output/gtm/03-google-ads-campaign-draft.md`).
- Operator safety cert (chain saw, ANSI Z89.1 hard hat) verified.
- Insurance rider verified for storm debris.
- D-0064 amendment ADR (`D-0067-...`) ratifying the expansion.

### State 3 — Pet Waste + Hurricane Prep + Palm Trim (Year 1, Q2)

**Trigger:** Hurricane prep+cleanup pilot establishes ≥10 customers + positive unit economics.

**Authorized scope expansion:**
- **Add:** Palm tree trim (requires Florida certified arborist license OR subcontractor relationship).
- **Channels:** Add Meta retargeting (warm audiences only) + organic Nextdoor + Thumbtack profile.
- **Cross-sell:** Palm trim promo to existing pet waste customers during route.

**Hard requirements:**
- Arborist license OR subcontractor agreement ratified (D-0068).
- Palm trim pricing ladder ($85–$250 per palm, height-dependent).
- Palm trim insurance rider ($1M general liability may be insufficient above 25' palms).

### State 4 — Full Service Catalog (Year 1, Q3–Q4)

**Trigger:** Three-service pilot produces consistent LTV/CAC ≥ 4x.

**Authorized scope:**
- **Add:** Weekly mowing, hedge trim, mulching, edging, seasonal cleanup (all already registered).
- **Channels:** Google Search + Microsoft + Meta retargeting + Yelp + Thumbtack + Nextdoor Local Deals.
- **Cross-sell:** Customer-segment pricing (recurring bundle at 10% off).

**Hard requirements:**
- D-0069 (or successor) ADR ratifying the multi-service paid catalog.
- Licensed services (fertilization, pest, irrigation) STILL excluded until licensing acquired.
- Per-service operator availability verified (do not advertise services operator can't deliver).

### State 5+ (Year 2+) — Beyond Pilot

**Candidates from brainstorm (Year 2):**
- Gutter cleaning
- Landscape lighting
- Real estate prep
- Senior lawn care
- Seasonal planting
- Vacation rental turnovers

**Future licensed (deferred until license acquired):**
- Fertilization (Florida Limited Commercial Fertilizer License)
- Pest control (Florida Pest Control Operator)
- Irrigation (Plumbing/irrigation specialty license)

---

## 2. Decision Tree — Which Strategy for Each Surface

Every customer-facing surface must be evaluated against the 4-state rollout. The strategy per surface:

| Surface | State 1 (Now) | State 2 | State 3 | State 4 |
|---|---|---|---|---|
| **`/` homepage** | 6 services + pet waste featured | + hurricane prep | + palm trim | Full catalog |
| **`/pet-waste`** | D-0064-compliant landing | Update periodically | Update periodically | Update periodically |
| **`/services/[slug]`** | 6 service pages | + hurricane-prep | + palm-trim | No change |
| **`/pricing`** | Mowing tier + pet waste ladder | + hurricane prep | + palm trim | No change |
| **Google Search ads** | `pw-search-largo-fl` only | + `hp-search-largo-fl` | + `pt-search-largo-fl` | All active |
| **Microsoft ads** | PAUSED (CSV) | ENABLE after pilot ADR | ENABLE | ENABLE |
| **Meta ads** | PAUSED (CSV) | PAUSED | ENABLE retargeting only | ENABLE |
| **GBP** | "Pet waste removal service" only | + "Lawn care service" | + "Tree service" | Full |
| **GBP description** | Pet waste only | + hurricane prep | + palm trim | Full service list |
| **Nextdoor** | Organic first reply only | Same | Local Deals enabled | Local Deals |
| **Thumbtack** | Pro profile only | Same | Same | Per-lead paid |
| **Yelp** | Free business page | Same | Same | Paid after review velocity |
| **Business plan** | 6 service catalog | + hurricane prep | + palm trim | Full catalog |
| **Capability registry** | 6 registered | + hurricane_prep | + palm_trim | Full |
| **Drift markers (D-0062)** | Unresolved | Resolve at pilot Stage 6 | Resolve at State 3 | All resolved |

---

## 3. Tier 1 — Foundation Cleanup (Before Any Launch)

The foundation is the same regardless of state. These are hard-stops and drift items that must be closed before any spend.

### 3.1 Discard uncommitted hard-stop violations

**Code (must be removed from working tree):**
- `apps/web/src/lib/server-track.ts` — GA4 MP + Meta CAPI (D-0064 §0.9 violation)
- `apps/web/src/components/analytics/` — `AnalyticsProvider.tsx`, `ConsentBanner.tsx`, `GoogleAnalytics.tsx`, `MetaPixel.tsx`
- `apps/web/src/lib/track.ts` — `window.gtag`, `window.fbq` (Stage 3 gate violation)
- `apps/web/src/lib/twilio.ts` — `sendAutoTextBack` (10DLC unregistered; SMS likely not delivering)
- `apps/web/src/app/pet-waste/page.tsx` — current version off-registry, has unsubstantiated claims
- `apps/web/src/app/api/lead/route.ts` — GA4 + Meta CAPI fires on `analytics_consent === 'granted'` (D-0064 §0.9 violation)

**Documentation (must be deprecated or re-stamped):**
- `output/gtm/03-google-ads-campaign-draft.md` — mark REPLACED
- `output/gtm/04-build-report.md` — inaccurate post-D-0064
- `output/gtm/05-account-setup-presentation.html` — purge Twilio credentials
- `output/gtm/06-google-ads-bulk-import.csv` — verify `enabled` flags against pilot posture
- `output/gtm/13-microsoft-ads-bulk-import.csv` — flip to `paused` (D-0064 excludes Microsoft)
- `output/gtm/15-pre-launch-runbook.md` — rewrite to single Google Search campaign, no GA4/Meta
- `output/gtm/20-launch-command-center.html` — same rewrite + purge compromised password
- `output/gtm/21-twilio-verified-recipient.md` — purge `curl -u AC...:3bb4...` example
- `output/gtm/.env.local.template` — purge live Twilio SID/token

### 3.2 Resolve D-0062 drift items

From `state/ledger.yaml` (still uncommitted):
- **Tax rate:** 6.0% FL + 1.0% Pinellas = 7.0% total. Reconcile in: `research/pricing/price-book.yaml`, `architecture/twin/invoice.md`, `output/procurement/business_plan_*.html`, `apps/web/src/lib/business.ts` (if hardcoded).
- **FL min wage:** $14/hr (2026 effective) or $15/hr (2026 election). Reconcile in all surfaces.
- **Domain cost:** $4.99 (Vercel Registrar) or $9.15 (Namecheap). Pick canonical = $9.15/yr.
- **Loan ask:** $15,000 (per `output/procurement/business_plan_grass_condensed.html` AND `docs/business-plan/05-prp-d-family-investor-package.md`). NOT $12,000 (the older v3.0 artifact).
- **Service pricing:** Lawn mowing tiers in `research/pricing/price-book.yaml` ($38–$115 by lot/frequency) vs. `$25+ per visit` (Google/Meta) vs. `$45 average` (Google draft) vs. `$40-60` (Thumbtack). Pick canonical = price-book tier table.
- **ZIP list:** 6 ZIPs (33770, 33771, 33773, 33774, 33778, 33756). Verify `content/facts.yaml` is canonical.
- **Pet waste pricing:** $7.50 first + $15/wk (D-0064, D-0065) vs. $0 free (ads) vs. $25 biweekly (D-0064 only) vs. $40 one-time (draft). Layer as: **free first → $15/wk recurring → $25 biweekly → $40 one-time**.
- **Hurricane prep:** $175 pre / $350 light / $650 heavy. Reconcile in capability registry.
- **Insurance claim:** `$1M Liability Insured` (D-0065) vs. `terms/page.tsx` still in binding queue. Reconcile.
- **Tenure claim:** "since 2020" (ads + /pet-waste) vs. "since 2026" (GBP + Yelp). **Recommendation: drop "since" entirely** per D-0064 §0.10.

### 3.3 Fix claims register (D-0064 §0.10)

Unsubstantiated claims to strip:
- **"5-Star Pet Waste Service"** / **"5-Star Dog Waste Service"** / **"5-Star Lawn Care"** — unsubstantiated
- **"Pinellas County's #1"** / **"Pinellas County's Pet Waste Pros"** — unsubstantiated superlative
- **"Trusted by Largo Neighbors"** / **"Trusted by 47 Yards in 33771"** / **"Trusted by Dog Owners"** — unsubstantiated
- **"Family-Owned"** — untrue (operator is solo)
- **"Veteran-Owned"** — only if true; verify before using
- **"Stop Calling Franchises"** — emotional copy; A/B test, not baseline
- **"$1M Liability Insured"** — replace with "Fully insured — policy on request" until policy number is in hand
- **"Since 2020"** — drop unless operator confirms actual tenure

### 3.4 Fix the 5-min vs 18-hour SLA conflict

**Current state:**
- `/pet-waste` page: "5-min text reply during business hours"
- `/api/lead` route: same SLA
- `OperatorStrip` component: "47 yards" "18h median"

**The 18-hour SLA in `OperatorStrip` is a different metric (response time after first contact, not first reply).** Either:
- Rename to "18h median response" (clearer language), OR
- Remove the metric entirely (it implies slow service)

**Recommendation:** Remove the 18h median from `OperatorStrip` for the pilot; revisit if data justifies it after 30 days.

### 3.5 Bring /pet-waste into the registry

**Current state:** `/pet-waste/page.tsx` is off-registry (no `<JsonLd>` for `Service` schema, no entry in `apps/web/src/lib/content.ts`).

**Fix:** Add `pet-waste` to `apps/web/src/lib/content.ts` as the 7th registered service. Sync:
- Homepage ServiceBento references
- Sitemap
- `aggregateRating` JSON-LD (still gated per `18-zero-review-trust-builders.md`)
- Footer link

### 3.6 Replace generated imagery with real or placeholder

**Current state:** All 8 images in `output/gtm/creative/` appear generated. The "Meet Cameron" callout pairs an operator-name narrative with a generic young-man image.

**Risk:** FTC truth-in-advertising exposure.

**Fix:** Either:
- Use a real operator photo (with documented consent), OR
- Change the copy to not depict a specific person (e.g., "Your local operator" not "Cameron")

**For the pilot:** Use a clean illustrative image (no specific person) until real photo is available.

### 3.7 Sync GBP and citations

**Current state:** GBP description says "Largo, Seminole, and Pinellas Park" (3 cities). 6 ZIPs are the canonical service area.

**Fix:** Update GBP description to explicitly name all 6 ZIPs. Same for Yelp, Nextdoor, Bing Places, Apple Maps.

---

## 4. Tier 2 — Pilot Surface (State 1, Now)

After Tier 1 is complete, the pilot surface is ready. The pilot runs on Stage 2/3 at HEAD (genuinely green), with /pet-waste rebuilt against the spec.

### 4.1 /pet-waste Rebuild Spec

**Section order (5 + 1 closer, per `docs/specs/paid-pilot-landing-spec.md`):**
1. **Dark hero** — eyebrow / H1 / subhead / sun-pill primary CTA ("Claim my free cleanup") / bordered secondary CTA ("Text 727-313-8011") with `sms:` pre-fill / 1-line trust strip (no unsubstantiated claims).
2. **Claim form** — 3-step "How I'll respond" card row (5-min text → 1-hour visit → customer call), then `ContactForm` with `variant="compact"`, then "Meet Cameron" callout (with real photo OR no specific person).
3. **ProcessSteps** (reused from homepage).
4. **"What I don't do" honesty block** — 6 explicit limitations.
5. **Page-local FAQ** (5 Q&As).
6. **FinalCTABanner** closer.

**Trust strip (binding):**
- "Solo operator serving 33770, 33771, 33773, 33774, 33778, 33756."
- "Free first cleanup — $15/wk after. No contract."
- "Reply within 5 minutes during business hours (Mon-Fri 7a-5p, Sat 8a-2p)."

**Trust strip (NOT allowed):**
- "Since 2020"
- "5-Star"
- "Trusted by 47 yards"
- "$1M insured" (without policy number)
- "Family-owned"
- "Veteran-owned" (unless verified)

**JSON-LD:** FAQPage with `provider: LandscapingBusiness`. `aggregateRating` OMITTED until 5+ verified reviews.

**Metadata:** `metadata.robots = { index: false, follow: true }` (paid-traffic only).

**Tap-to-call / tap-to-text:** Always available at first paint.

**Form contract:** `sms_consent` (D-0066 TCPA checkbox), `utm_source/medium/campaign/term/content`, `gclid`, `landing_path`, `analytics_consent: 'denied'` (default; no granted path until D-0064 amendment).

### 4.2 Google Search Campaign (Single, Binding)

**Campaign:** `pw-search-largo-fl` (one only).

**Ad groups:**
- A: `pet waste removal` [Exact] + 8 close variants
- B: `dog waste` [Exact] + 8 close variants
- C: City + ZIP [Phrase] (all 6 ZIPs + Largo + Pinellas Park)
- D: `pooper scooper` [Phrase] + 8 close variants

**Headlines (max 30 char, 15 per RSA):**
- "Free First Pet Waste Cleanup"
- "Weekly Yard Scooping Service"
- "$15/Wk. No Contract."
- "Text Us Today — 727-313-8011"
- "Same-Day Text Reply"
- "Local Solo Operator"
- "Your Neighbor on the Route"
- "Pinellas County Pet Waste"
- "Free First Cleanup — Limited"
- "Stop Scooping. Start Living."
- "Book in 60 Seconds"
- "Largolawn.pro"

**Descriptions (max 90 char, 4 per RSA):**
- "Weekly or biweekly pet waste cleanup for your yard. Free first cleanup. $15/wk or $25 biweekly."
- "Local solo operator serving 33770, 33771, 33773, 33774, 33778, 33756. Same-day text reply."
- "Stop wasting your weekends. We scoop, you relax. Free first cleanup. Text 727-313-8011."
- "Trusted by your neighbors in Pinellas. $15/wk per yard. Free first cleanup. 5-min text reply."

**Callouts:**
- "Free First Cleanup"
- "No Contract"
- "Same-Day Text Reply"
- "Local Operator"

**Price extension:** Weekly $15/wk · Biweekly $25 · Free first $0 · One-time $40.

**Negative keyword list (campaign-level):**
- `jobs, employment, hiring, career, apply, salary, diy, how to, instructions, tutorial, yourself, free, cheap, used, refurbished, discount, coupon, reviews, complaints, scam, lawsuit, commercial, wholesale, bulk, supplier, franchise, company, corporate, course, training, certification, wikipedia, youtube, sample, template`

**Geo target:** All 6 ZIPs + 5-mile radius (not extending to St. Pete / Clearwater in draft).

**Schedule:** Mon–Fri 7a–9p, Sat–Sun 8a–8p.

**Bidding:** Maximize Conversions (default), Target CPA after 30 conversions.

**Budget:** $5/day (15 free-credit days = ~30 days at $15/day cap).

**Conversion tracking:** Form submit → handled via `/api/lead` → server-side PostHog `lead_captured` event (no GA4).

**Pause triggers:**
- CAC > $138/customer (binding under D-0064 §0.6)
- < 3 qualified leads by Day 7 (D-0064 R-PILOT-001)
- No qualified leads by Day 14 (R-PILOT-004)

### 4.3 /api/lead cleanup

**Strip:**
- All GA4 server-side event calls
- All Meta CAPI calls
- `analytics_consent` field (default to `denied` and no granted path)
- `event_id` field (no CAPI dedup needed)
- `device_class`, `first_touch_at` (not needed without CAPI)

**Keep:**
- `idempotency_key` (sha256 of name+email+phone+zip, 60s window)
- Rate limit (5/IP/60s)
- Service-area ZIP validation
- PII-safe error logs
- Server-side PostHog `lead_captured` event
- `sms_consent` gate (D-0066)
- SLA message (5 min during hours, next morning after hours)

### 4.4 GBP setup (1-channel, no paid)

**Category:** "Pet waste removal service" (the real GBP category; not "Waste management service" as the runbook says).

**Service area:** All 6 ZIPs (33770, 33771, 33773, 33774, 33778, 33756).

**Description (binding):**
> "Solo operator offering pet waste cleanup for dog owners in 33770, 33771, 33773, 33774, 33778, 33756. Free first cleanup. $15/wk after. No contract. Text 727-313-8011 — you'll talk to the same person who shows up."

**Hours:** Mon–Fri 7a–5p, Sat 8a–2p.

**Phone:** 727-313-8011.

**Website:** `https://largolawn.pro/pet-waste`.

**Photos:** Use real before/after pet waste cleanup (when available) or stock-clear yard image (no people).

**Reviews:** Do not add fabricated reviews. Use GBP auto-review-ask after 7 days post-service.

---

## 5. Tier 3 — Service Lineup Expansion (State 2 → State 3)

These tiers are NOT now. They activate after each gate's ADR is ratified.

### 5.1 Hurricane Prep+Cleanup (State 2)

**Trigger:** Pilot outcome ADR (D-0067 candidate) ratifies CAC ≤ $138 + ≥5 customers.

**Files to update:**
- `state/capability-registry.yaml` — confirm `cap_hurricane_prep` is registered
- `apps/web/src/app/services/hurricane-prep/page.tsx` — ratify spec
- `apps/web/src/lib/content.ts` — add hurricane prep to registry
- `apps/web/src/lib/business.ts` — add hurricane pricing
- `architecture/twin/service.md` — add `service_line: 'hurricane_prep'`
- `output/gtm/06-google-ads-bulk-import.csv` — add `hp-search-largo-fl` campaign
- `docs/specs/hurricane-prep-landing-spec.md` — author (new)
- `governance/decisions/0067-hurricane-prep-expansion.md` — author (new ADR)

**Pricing ladder (canonical):**
- Pre-storm $175 (≤ 1 hour, 1 hurricane kit visit)
- Post-storm light $350 (≤ 3 hours, debris removal)
- Post-storm heavy $650 (≤ 6 hours, full debris haul)

**Insurance:** Same $1M general liability. Add storm-debris rider if operator pursues above 6 hours.

**Channel:** Google Search only (matches State 2). Add `hp-search-largo-fl` analogue to `06-google-ads-bulk-import.csv`.

**Seasonal timing:** Promote aggressively May–November; dormant December–April.

### 5.2 Palm Tree Trim (State 3)

**Trigger:** Hurricane prep pilot establishes ≥10 customers + positive unit economics.

**Hard requirements:**
- Florida certified arborist license, OR
- Subcontractor relationship with licensed arborist (D-0068 ADR)

**Files to update:**
- `state/capability-registry.yaml` — register `cap_palm_trim`
- `apps/web/src/app/services/palm-trim/page.tsx` (new)
- `apps/web/src/lib/content.ts` — add palm trim
- `architecture/twin/service.md` — add `service_line: 'palm_trim'`
- `governance/decisions/0068-palm-trim-licensed.md` — license OR subcontractor

**Pricing ladder (candidate, pending ratification):**
- < 15' palm: $85
- 15'–25' palm: $150
- 25'–40' palm: $250
- > 40' palm: requires bucket truck (subcontractor)

**Channel:** Google Search + organic Nextdoor. Meta retargeting only after pilot outcome.

### 5.3 Weekly Mowing (State 4)

**Trigger:** Three-service pilot produces LTV/CAC ≥ 4x.

**Note:** Weekly mowing is already on the website (State 1), but is NOT in the paid pilot. Paid promotion of weekly mowing came up in two paths:

1. **Google draft `LC-Search` Ad Group** — currently in `output/gtm/03-google-ads-campaign-draft.md` but NOT in the Google-only CSV `06-google-ads-bulk-import.csv` (which only has PW campaigns).
2. **Microsoft/Bing `LC-Search` Ad Group** — in `output/gtm/13-microsoft-ads-bulk-import.csv` (must remain `paused`).

**Decision:** Weekly mowing stays on the website as organic content (no paid amplification) until State 4. Franchises are too competitive for a solo operator to win on price alone.

**File to update:** `apps/web/src/app/services/lawn-mowing/page.tsx` — add organic-CTA ("Free quote, no obligation") and FAQ pointed to ContactForm.

### 5.4 Hedge Trim, Mulching, Edging, Seasonal Cleanup (State 4)

These are already registered capabilities (per brainstorm §3). They are already on the website (6 services). They are eligible for paid promotion at State 4 when the multi-service catalog is ratified.

**File to update:** `apps/web/src/lib/content.ts` — confirm all 6 are registered and linkable.

---

## 6. Tier 4 — Channel Expansion (Post-Pilot)

Channels unlock in sequence, not in parallel. Each is a separate ADR.

### 6.1 Microsoft Search (Stage 7+)

**Trigger:** Pilot CAC ≤ $138 + ≥5 customers.

**D-0064 amendment:** New ADR (D-0067) ratifying Microsoft Search addition.

**Files to update:**
- `output/gtm/13-microsoft-ads-bulk-import.csv` — flip `enabled` from `paused`
- `docs/specs/microsoft-ads-spec.md` — author (new)
- `apps/web/src/app/api/lead/route.ts` — add `msclkid` capture

**Budget:** $5/day for Microsoft (alongside $5/day Google = $10/day total).

### 6.2 Meta Retargeting (Year 1, Q2)

**Trigger:** Microsoft pilot ≥30 days + positive unit economics.

**D-0064 amendment:** New ADR (D-0069) ratifying Meta retargeting scope.

**Hard limits:**
- Retargeting ONLY (warm audiences from site visitors + customer list)
- NO cold prospecting on Meta
- NO Lookalike audiences until 100+ emails (existing list-building plan needed)
- Jobber / GBP / CRM integration required before customer-list retargeting

**Files to update:**
- `output/gtm/12-meta-ads-bulk-import.csv` — flip `enabled` for retargeting rows only
- `docs/specs/meta-retargeting-spec.md` — author (new)
- `apps/web/src/components/analytics/MetaPixel.tsx` — re-introduce (this is the post-amendment surface)
- `apps/web/src/lib/server-track.ts` — re-introduce Meta CAPI (post-amendment)

### 6.3 Nextdoor Local Deals (Year 1, Q3)

**Trigger:** Meta retargeting ≥30 days + positive unit economics.

**Files to update:**
- `output/gtm/11-organic-channel-templates.md` — flip to Local Deals enabled
- `apps/web/src/app/contact/page.tsx` — add Nextdoor attribution field

### 6.4 Thumbtack Paid (Year 1, Q4)

**Trigger:** Three-service pilot produces LTV/CAC ≥ 4x.

**Files to update:**
- `output/gtm/11-organic-channel-templates.md` — add Thumbtack spend allocation
- `apps/web/src/lib/utm.ts` — add `thumbtack` source mapping

### 6.5 Yelp Paid (Year 2+)

**Trigger:** Review velocity ≥1 verified review per 2–3 cleanups + 50+ reviews total.

**Files to update:**
- `output/gtm/11-organic-channel-templates.md` — flip to paid Yelp
- `apps/web/src/app/reviews/page.tsx` (new) — surface verified reviews

**Why Yelp last:** review velocity is the bottleneck. Without 50+ reviews, paid Yelp is wasted spend.

---

## 7. Tier 5 — Documentation Sync (Continuous)

Documentation is the single source of truth that ALL surfaces reference. Currently it's fragmented.

### 7.1 The Drift Triad

The three artifacts that must agree at all times:

| Artifact | Role | Sync trigger |
|---|---|---|
| `content/facts.yaml` | Canonical numerics (tax, wage, ZIP, domain, pricing) | On any pricing/state change |
| `state/capability-registry.yaml` | Canonical service catalog (caps + maturity) | On any new/discontinued service |
| `architecture/twin/service.md` | Canonical service_line enum (technical) | On any new service_line |

**Failure mode:** these three drift → website, ads, and docs all reference different sources → user-visible inconsistencies.

**Mitigation:** A single `bun run validate:drift` script that diffs the three artifacts and fails if any disagreement. This is the operational implementation of the once-weekly "situation report" cycle.

### 7.2 Cross-Surface Synchronization

Every surface must read from the canonical sources. The surfaces are:

1. **Website** (`apps/web/src/lib/content.ts`, `business.ts`, JSON-LD)
2. **Ads** (`output/gtm/*.csv`, `output/gtm/03-*.md`)
3. **GBP** (`output/gtm/09-google-business-profile-setup.md`)
4. **Citations** (Yelp, Nextdoor, Thumbtack, Bing Places, Apple Maps — `output/gtm/11-organic-channel-templates.md`)
5. **Business plan** (`output/procurement/business_plan_*.html`, `docs/business-plan/*.md`)
6. **Capability registry** (`state/capability-registry.yaml`)
7. **Twin model** (`architecture/twin/service.md`, `architecture/twin/invoice.md`)
8. **Pricing** (`research/pricing/price-book.yaml`)
9. **Process & SOPs** (`knowledge/06-knowledge-architecture.md`, agent specs)

**Current state:** Each surface has its own copy. Drift is implicit.

**Fix:** Standardize on a content-hash version stamp. Every surface includes `last_synced_at` + `drift_marker` that references the canonical source version. If `drift_marker` is older than the canonical source's `last_modified`, the surface is flagged stale.

### 7.3 Drift Markers (D-0062 closure)

From `state/ledger.yaml`:
- D-0062 — `tax_6_75_to_7_0` — CRITICAL
- D-0062 — `fl_min_wage_13_to_14_15` — HIGH
- D-0062 — `domain_cost_4_99_to_9_15` — MEDIUM
- D-0062 — `loan_ask_15K_canonical` — HIGH
- D-0062 — `pricing_ladder_reconcile` — HIGH
- D-0062 — `since_2020_unsupported` — MEDIUM
- D-0062 — `insurance_claim_unverified` — HIGH
- D-0062 — `pet_waste_pricing_ladder` — HIGH
- D-0062 — `md_5min_18h_sla_conflict` — MEDIUM
- D-0062 — `palm_trim_license_unspecified` — DEFERRED (Year 1, Q2)
- D-0062 — `hurricane_prep_pricing_ladder` — HIGH

**Closing rule:** Each drift item gets a verified-edits-pass + an ADR if the decision is irreversible (e.g., dropping "since 2020" is reversible; locking in $15K ask is irreversible).

### 7.4 The Once-Weekly Reconciliation Cycle

A repeatable script: `bun run reconcile:weekly`

1. Read `state/ledger.yaml` — verify <7 days old.
2. Read `state/capability-registry.yaml` — verify services match website.
3. Read `state/risk-register.yaml` — verify top 3 risks still mitigated.
4. Read `content/facts.yaml` — verify pricing ladder matches `research/pricing/price-book.yaml`.
5. Read `output/gtm/*.csv` — verify CSV `enabled` flags match current ADR scope.
6. Read `architecture/04-systems-architecture.md` — verify runtime diagram present.
7. Run `git status` — flag uncommitted hard-stop violations.
8. Emit a one-page report: `state/weekly-reconciliation/<date>.md`.

**Why:** replaces the "single agent asked for a situation report" pattern with a standing discipline. Founder runs this every Friday as part of CLAUDE.md's "single source index" refresh.

---

## 8. Implementation Sequence — The 6 Gates

Each gate is a Go/No-Go the steward approves. Gates are deliberately sequenced so the cheapest, most reversible actions happen first.

### Gate 1 — Foundation Cleanup (Tier 1)

**Effort:** 18–24 hours agent work + 1 steward click.

**Tasks:**
- T1.1: Discard uncommitted GA4/Meta/CAPI/ConsentBanner code.
- T1.2: Revert uncommitted `/pet-waste/page.tsx` to spec.
- T1.3: Revert uncommitted `/api/lead/route.ts` to Stage 2/3 HEAD.
- T1.4: Resolve D-0062 drift items (tax, wage, domain, loan ask, pricing ladder).
- T1.5: Strip unsubstantiated claims (5-star, $1M, since 2020, etc.).
- T1.6: Resolve 5-min vs 18-hour SLA conflict.
- T1.7: Add pet-waste to `apps/web/src/lib/content.ts` registry.
- T1.8: Update GBP description + Yelp + Nextdoor + Thumbtack profiles for 6-ZIP consistency.
- T1.9: Commit `state/ledger.yaml`, `state/risk-register.yaml`, `state/capability-registry.yaml` updates.
- T1.10: Author or update `governance/decisions/0067-...` (D-0062 closure ADR).

**Verification:**
- `bun run test:charter` green.
- `bun run validate` green.
- `git status` — no uncommitted hard-stop violations.
- `grep -r "fbq\|gtag" apps/web/src/lib/` — empty.
- `grep -r "5-?Star\|since 2020\|47 yards\|1M ins" apps/web/src/` — empty (or restricted to binding surfaces only).

**Stops the press if:** Any hard-stop violations remain in the working tree, or any D-0062 drift item is unresolved.

### Gate 2 — Pilot Surface (Tier 2)

**Effort:** 12–16 hours agent work + 1 steward click.

**Tasks:**
- T2.1: Buy `largolawn.pro` on Vercel Registrar (~$9.15/yr).
- T2.2: Configure DNS + Vercel production deployment.
- T2.3: Author `/pet-waste` against binding spec (5 sections + 1 closer, no unsubstantiated claims).
- T2.4: Author single Google Search campaign CSV (`pw-search-largo-fl`).
- T2.5: Wire `/api/lead` to keep Stage 2/3 (drop GA4/CAPI/ConsentBanner).
- T2.6: Author `docs/specs/paid-pilot-landing-spec.md` (Stage 1 spec steward sign-off).
- T2.7: Author `docs/runbooks/pilot-operations.md` (the missing artifact).
- T2.8: Confirm Google Ads $500 free credit availability.
- T2.9: Run `apps/web/scripts/smoke-test-prod.mjs https://largolawn.pro` — 8/8 GREEN.
- T2.10: Run `apps/web/scripts/smoke-email.mjs` — real email arrives within 30s.

**Verification:**
- `https://largolawn.pro/` returns 200.
- `https://largolawn.pro/pet-waste` returns 200 with no unsubstantiated claims.
- `https://largolawn.pro/sitemap.xml` includes `/pet-waste`.
- Submit real lead from `/pet-waste` → reaches operator inbox + PostHog `lead_captured` fires server-side.
- `git status` clean.

**Stops the press if:** Unsubstantiated claims remain, or unsubscribed tracking is detected, or the smoke test fails.

### Gate 3 — Pilot Launch (Tier 2-3)

**Effort:** 1 steward click + 30 days observation.

**Tasks:**
- T3.1: Upload `output/gtm/06-google-ads-bulk-import.csv` to Google Ads.
- T3.2: Apply $500 free credit (or whatever is available).
- T3.3: Set budget $5/day, schedule Mon–Fri 7a–9p + Sat–Sun 8a–8p, all 6 ZIPs + 5-mile radius.
- T3.4: Pause campaign. Wait for steward confirmation.
- T3.5: Steward confirms: smoke test green, GBP verified, /pet-waste reviewed, claims register clean.
- T3.6: Steward unpauses campaign on Monday morning 7 AM.
- T3.7: Steward replies to every lead within 5 minutes during business hours.

**Verification (post-launch):**
- Day 7: ≥3 qualified leads (D-0064 R-PILOT-001 floor).
- Day 14: CAC within $40–60 range (pet waste target).
- Day 30: ≥1 paying customer; CAC ≤ $138 (binding circuit-breaker).
- Day 30: Review velocity ≥1 verified review per 3 cleanups.

**Stops the press if:** Day 7 < 3 qualified leads OR Day 14 CAC > $80 sustained.

### Gate 4 — Pilot Outcome ADR (Stage 6)

**Effort:** 4–6 hours agent work + 1 steward sign-off.

**Tasks:**
- T4.1: Author `/governance/decisions/0067-pilot-outcome.md` (D-0067 D-0064 amendment).
- T4.2: Document pilot CAC, conversion, retention, LTV/CAC.
- T4.3: Document pause/resume triggers hit.
- T4.4: Document next-state decision: expand to hurricane prep (State 2) OR continue pet waste only OR abort pilot.

**Decisions:**
- **Continue State 1** (CAC > $138, low conversion) — ABORT.
- **Activate State 2** (CAC ≤ $138, ≥5 customers) — add hurricane prep + Microsoft Search.
- **Continue State 1 + add organic channels** (CAC $40–60, ≥5 customers, owner wants to consolidate) — add Yelp organic, Nextdoor organic, Thumbtack organic.

**Verification:**
- D-0067 ADR ratified.
- If State 2: D-0068 (hurricane prep expansion) drafted.
- If ABORT: pet waste reverts to Month-10 candidate status per D-0065 reversibility clause.

### Gate 5 — Service Lineup Expansion (Tier 3)

**Effort:** 36–48 hours agent work spread over 60–90 days.

**Tasks:**
- T5.1: Hurricane prep — author landing page, register capability, add to website, run pilot.
- T5.2: Palm trim — license OR subcontractor decision, register capability, add to website.
- T5.3: Multi-service catalog pilot — measure LTV/CAC, decide on State 4.

**Verification:**
- State 2 launched: hurricane prep + ≥10 customers, CAC ≤ $80.
- State 3 launched: palm trim + ≥10 customers, license verified.

### Gate 6 — Full Rollout (Tier 4)

**Effort:** 60–80 hours agent work spread over 90–180 days.

**Tasks:**
- T6.1: Microsoft Search (D-0064 amendment, post-pilot).
- T6.2: Meta retargeting (D-0064 amendment, post-Microsoft).
- T6.3: Nextdoor Local Deals (organic + paid).
- T6.4: Thumbtack paid.
- T6.5: Yelp paid (after review velocity threshold).
- T6.6: Full service catalog expansion (mowing, hedge, mulch, edging, seasonal cleanup).

**Verification:**
- LTV/CAC ≥ 4x sustained across all channels.
- ≥100 verified reviews.
- ≥50 active recurring customers.

---

## 9. Implementation Order — Within Each Gate

### 9.1 Building order (per surface)

When implementing any surface, the order matters:

1. **Canonical source first** — `content/facts.yaml` or `state/capability-registry.yaml`. Update FIRST.
2. **Twin model second** — `architecture/twin/service.md`. Update to reflect canonical.
3. **Capability registry third** — verify `state/capability-registry.yaml` matches.
4. **Business constants fourth** — `apps/web/src/lib/business.ts`. Update pricing, ZIP list, etc.
5. **Content registry fifth** — `apps/web/src/lib/content.ts`. Add service entry.
6. **Page templates sixth** — `/services/[slug]/page.tsx` or new landing page.
7. **Homepage / pricing / footer** — update references.
8. **JSON-LD + sitemap** — sync technical metadata.
9. **Ads** — update CSV + bulk import.
10. **GBP / citations** — update descriptions.
11. **Business plan** — propagate to `output/procurement/`.
12. **Drift verification** — `bun run validate:drift` (new script).

### 9.2 Per-feature checklist (template)

For each new service or major surface change, run this checklist:

```markdown
- [ ] Canonical source updated (`content/facts.yaml` or `state/capability-registry.yaml`)
- [ ] Twin model updated (`architecture/twin/service.md`)
- [ ] Capability registered (`state/capability-registry.yaml`)
- [ ] Decision Template drafted if irreversible (`governance/decisions/NNNN-...md`)
- [ ] Business constants updated (`apps/web/src/lib/business.ts`)
- [ ] Content registry updated (`apps/web/src/lib/content.ts`)
- [ ] Page template created (`apps/web/src/app/services/[slug]/page.tsx`)
- [ ] Homepage references updated (`apps/web/src/app/page.tsx`)
- [ ] Pricing tier table updated (`apps/web/src/app/pricing/page.tsx`)
- [ ] Footer links updated (`apps/web/src/components/site/Footer.tsx`)
- [ ] JSON-LD updated (`apps/web/src/lib/jsonld.ts`)
- [ ] Sitemap rebuilt (`apps/web/src/app/sitemap.ts`)
- [ ] Ads CSV updated (`output/gtm/06-google-ads-bulk-import.csv`)
- [ ] GBP description updated (`output/gtm/09-google-business-profile-setup.md`)
- [ ] Citations updated (`output/gtm/11-organic-channel-templates.md`)
- [ ] Business plan updated (`output/procurement/business_plan_*.html`)
- [ ] Drift verification passes (`bun run validate:drift`)
- [ ] Test coverage updated (`apps/web/tests/`)
- [ ] Charter compliance passes (`bun run test:charter`)
- [ ] Typecheck passes (`bun run typecheck`)
- [ ] Lint passes (`bun run lint`)
- [ ] Visual regression passes (`bun run test:visual`)
```

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| D-0062 drift items remain unresolved at Gate 1 | Medium | High | Hard-blocker in T1.4; verification script `validate:drift` |
| Uncommitted GA4/Meta code persists in working tree | High | High | Hard-blocker in T1.1; `grep -r "fbq\|gtag"` must be empty |
| /pet-waste off-registry at launch | High | High | T1.7 + T2.3; smoke test includes sitemap check |
| Pilot outcome is "continue" but CAC climbs past $138 in Week 5 | Medium | High | D-0064 §0.6 circuit-breaker; pause + D-0067 ADR |
| Family investor responds positively but pilot is not yet stable | Medium | High | Plan explicitly defers investor response to post-pilot outcome |
| Twilio A2P 10DLC remains unregistered at launch | Medium | High | SMS acks paused; D-0066 still binding; `sendAutoTextBack` not wired |
| Operator portrait is generated image paired with "real person" copy | Medium | Medium | T3.6: replace with real photo OR drop the "Meet Cameron" specific-person narrative |
| Surface drift (website says 7.0%, ads say 6.75%) | High | Medium | T7.1: drift verification script + weekly reconciliation cycle |
| Storm debris insurance insufficient for hurricane prep pilot | Medium | High | T5.1: insurance rider verified before State 2 launch |
| Arborist license acquisition delays palm trim (State 3) | High | Medium | State 3 trigger is license OR subcontractor; either path documented |

---

## 11. Open Questions for the Founder

These are branch points the steward must decide. The plan defaults are below; change any of them.

1. **Buy the domain now, or wait for Gate 1 to ship?**
   - **Default:** Buy now (Gate 2) — domain is cheap and reversible; needed for GBP.
2. **Discard the uncommitted working tree, or commit selectively?**
   - **Default:** Discard — every item in the working tree violates D-0064.
3. **Drop "since 2020" entirely, or replace with verified year?**
   - **Default:** Drop entirely — D-0064 §0.10; safer to underclaim than overclaim.
4. **Pick Vercel Registrar ($9.15) or Namecheap ($4.99)?**
   - **Default:** Vercel Registrar — DNS + Vercel share one admin.
5. **Should the architecture doc (A3.1) be written before /pet-waste rebuild, or after?**
   - **Default:** Before — writing the doc surfaces hidden assumptions.
6. **Gmail SMTP (Nodemailer) vs Resend (D-0002)?**
   - **Default:** Gmail SMTP — already built, working, free. Resend is a future migration.
7. **Should payment be defined as "Free first cleanup" or "$7.50 first cleanup"?**
   - **Default:** Free first cleanup — better conversion per `16-ab-test-plan.md`; $7.50 is the cohort valuation.
8. **Should the "first 5 neighbors on your street" scarcity frame stay?**
   - **Default:** Keep in subhead and Meta copy; A/B test against no-scarcity per `16-ab-test-plan.md`.
9. **Pilot window: 30 days at $5/day Google, or 60 days at $3/day?**
   - **Default:** 30 days at $5/day — get to "did it work or not" faster.
10. **Should the family-investor send (PENDING) wait for pilot outcome, or proceed now?**
    - **Default:** Wait — pilot outcome informs the business plan adjustments.

---

## 12. Verification — How to Confirm Each Gate Is Green

After each gate, the steward can verify by running:

```bash
# Gate 1 — Foundation Cleanup
git status                                          # uncommitted state files committed
git diff --stat                                     # no uncommitted GA4/Meta
grep -r "fbq\|gtag" apps/web/src/lib/               # should be empty
grep -r "5-?Star\|since 2020\|47 yards\|1M ins" apps/web/src/  # empty
bun run test:charter                                # green
bun run validate                                    # green

# Gate 2 — Pilot Surface
curl -sI https://largolawn.pro/pet-waste | head -1  # 200 OK
curl -s https://largolawn.pro/sitemap.xml | grep pet-waste  # present
node apps/web/scripts/smoke-test-prod.mjs https://largolawn.pro  # 8/8 green
node apps/web/scripts/smoke-email.mjs               # email arrives within 30s

# Gate 3 — Pilot Launch
# (manual: visit Google Ads, verify campaign uploaded, paused, ready)
# (manual: submit real lead from /pet-waste, confirm notify + PostHog)

# Gate 4 — Pilot Outcome ADR
ls governance/decisions/0067-*.md                   # present
grep -E "(CAC|SMS|circuit-breaker|next-state)" governance/decisions/0067-*.md  # all present

# Gate 5 — Service Lineup Expansion
# (manual: visit /services/hurricane-prep, verify landing page)
# (manual: submit hurricane prep lead, confirm notify)

# Gate 6 — Full Rollout
# (manual: visit /pricing, verify all 8 services listed)
# (manual: verify each ad channel per matrix)
```

---

## 13. Source Paths Critical

Files this plan references (read-only):

**Binding Governance:**
- `governance/decisions/0064-paid-acquisition-pilot.md`
- `governance/decisions/0065-pet-waste-service-ratification.md`
- `governance/decisions/0066-outbound-sms-consent.md`
- `docs/specs/paid-pilot-landing-spec.md`

**State / Capability:**
- `state/ledger.yaml` (D-0062 drift items)
- `state/capability-registry.yaml` (6 registered caps)
- `state/risk-register.yaml` (top 5 risks)
- `content/facts.yaml` (canonical numerics)
- `architecture/twin/service.md` (service_line enum)
- `architecture/twin/invoice.md` (tax drift)
- `architecture/04-systems-architecture.md` (23 lines, needs rebuild)

**Pricing & Research:**
- `research/pricing/price-book.yaml` (mowing tier table)
- `output/reports/2026-07-31_service-expansion-brainstorming.md` (20 ranked services)
- `output/reports/business_plan_improvement_analysis.md` (Mavis 2026-07-28 inventory)

**Website (current state):**
- `apps/web/src/lib/business.ts` (NAP + ZIP)
- `apps/web/src/lib/content.ts` (service registry)
- `apps/web/src/lib/reviews.ts` (PENDING_AGGREGATE_RATING = true)

**Website (HARD-STOP violations to remove):**
- `apps/web/src/lib/server-track.ts`
- `apps/web/src/components/analytics/AnalyticsProvider.tsx`
- `apps/web/src/components/analytics/ConsentBanner.tsx`
- `apps/web/src/lib/track.ts`
- `apps/web/src/lib/twilio.ts`
- `apps/web/src/app/api/lead/route.ts`
- `apps/web/src/app/pet-waste/page.tsx`

**Ads / GTM (binding for State 1):**
- `output/gtm/06-google-ads-bulk-import.csv` (single channel)
- `output/gtm/12-meta-ads-bulk-import.csv` (paused)
- `output/gtm/13-microsoft-ads-bulk-import.csv` (paused)
- `output/gtm/22-zero-budget-deploy-guide.md` (D-0064 aligned)

**Ads / GTM (must be deprecated):**
- `output/gtm/03-google-ads-campaign-draft.md` (REVISED)
- `output/gtm/15-pre-launch-runbook.md` (3-channel violation)
- `output/gtm/20-launch-command-center.html` (3-channel violation)
- `output/gtm/05-account-setup-presentation.html` (creds in plaintext)
- `output/gtm/.env.local.template` (live Twilio SID/token)

**Business Plan:**
- `output/procurement/business_plan_grass_v3.0.html` (older — $12K ask)
- `output/procurement/business_plan_grass_condensed.html` (current — $15K ask)
- `docs/business-plan/05-prp-d-family-investor-package.md` ($15K ask)

---

## 14. One-Line Bottom Line

**The binding strategy is: launch pet waste only on Google Search only (D-0064), discard the uncommitted hard-stop violations, resolve D-0062 drift, and progressively expand the service catalog and channel mix only after each gate's ADR is ratified.** The repo currently has three competing GTM stacks coexisting; the binding one is the one under D-0064. Every surface — website, ads, GBP, citations, business plan, governance — must read from the same canonical sources (`content/facts.yaml`, `state/capability-registry.yaml`, `architecture/twin/service.md`) and be gated by a verifiable ADR before any new service or channel is activated. The whole roadmap from #1 (pet waste) to #20 (drone yard mapping) is sequenced behind gates; the steward authorizes each gate independently.

---

## 15. Plan-Mode Fit Check

**Observed fit issues:**

- The `/effort` skill (ultracode) was invoked but the skill's primary contract (multi-agent orchestration with adversarial verify) is not visible. The plan was synthesized sequentially from 3 Explore agents → 1 review.
- The `forge-skills:architecture-and-contracts` skill's expected output paths (`/forge/prd.md`, `.forge/architecture.md`, `.forge/contracts/`, `.forge/adr/`) are absent. The repo uses `constitution/`, `governance/`, `architecture/`, `knowledge/` instead. A future session may need to reconcile the `.forge/` vs GRASS-native conventions.
- The plan does not execute code or make non-readonly tool calls. All 6 gates end with a Go/No-Go decision point the steward approves.
- The 4-state rollout strategy is informed by the brainstorm but constrained by D-0064. The user's request to "adjust the business offerings" is answered with the staged rollout, not a wholesale catalog expansion.

**No fit issues for the user's actual request** (comprehensive strategy for adjusting offerings across all surfaces).

---

## 16. Next Step (User-Driven)

The steward reviews this plan. Three decisions are recommended before Gate 1:

1. **Confirm the 4-state rollout** (State 1 = pet waste only / Google Search only; State 2 = + hurricane prep; State 3 = + palm trim; State 4 = full catalog).
2. **Confirm the hard-stop violations list** (GA4/Meta/ConsentBanner/Twilio auto-text).
3. **Confirm the D-0062 drift closures** (tax 7.0%, wage $14/$15, $9.15 domain, $15K loan ask, drop "since 2020", etc.).

After confirmation, the agent begins Gate 1 implementation per the ordering in §9.1.
