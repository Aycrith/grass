# Audit 3 — Ads + GTM Inventory (2026-07-30)

> **Read-only audit.** Output of the Explore agent dispatched during the strategy-plan session.
>
> **Scope:** Every `output/gtm/**`, `apps/web/src/components/analytics/**`, `apps/web/src/lib/{server-track,twilio,track}.ts`, `apps/web/src/app/api/lead/route.ts`, and the binding governance documents (D-0064, D-0065, D-0066).
>
> **Source:** Agent 3 of 3 (parallel).

---

## The Single Most Important Finding

The repo has **three competing stacks of GTM artifacts coexisting**, and the binding one is **not the most recently authored**.

| Stack | Status | Source of authority |
|---|---|---|
| **Original 6-8 day multi-channel build** | SUPERSEDED | `output/gtm/README.md` (2026-07-29) + D-0064, D-0065, D-0066 |
| **D-0064 single Google Search pilot** | **BINDING** | `governance/decisions/0064-paid-acquisition-pilot.md` (ratified 2026-07-28) |
| **Late "launch all three" reset** | **UNGOVERNED** — contradicts D-0064 | `15-pre-launch-runbook.md`, `20-launch-command-center.html`, `22-zero-budget-deploy-guide.md`, all CSVs marked `enabled`, all runbooks dated 2026-07-29 to 2026-07-30 |

Every later file (runbooks, dashboard, deploy guide, bulk CSVs) instructs the operator to upload and unpause **three** channels (Google + Microsoft + Meta) with the full GA4 + Meta Pixel + CAPI + Twilio stack — which is exactly what D-0064 §0.9 and `docs/specs/paid-pilot-landing-spec.md` §8 prohibit as a hard-stop.

The README on disk is the clearest disclaimer of this:
- `01-landing-page-audit.md` → "superseded for prioritization"
- `02-tracking-stack-spec.md` → "DEFERRED — DO NOT IMPLEMENT"
- `03-google-ads-campaign-draft.md` → "REVISED — DO NOT IMPLEMENT AS-IS"

Yet the code under `apps/web/` (`/api/lead/route.ts`, `src/components/analytics/`, `src/lib/server-track.ts`, `src/lib/twilio.ts`) has been built and merged for the full superseded stack. The /pet-waste page is wired with GA4 server events, Meta CAPI, Twilio auto-text-back, and a ConsentBanner — none of which D-0064 permits before the Stage 6 outcome ADR.

---

## Binding Governance (D-0064, D-0065, D-0066)

**D-0064 — Paid Acquisition Pilot (ratified 2026-07-28, confidence 0.65)**
- Channel: **Google Search ONLY**. Meta, Microsoft, Yelp, Nextdoor, Thumbtack, retargeting, GA4, Meta Pixel, CAPI, CallRail are all explicitly out of scope.
- Service: **pet-waste cleanup only** (per D-0065).
- Landing: `/pet-waste` page with 3-field compact form, tap-to-call, tap-to-text, single-line trust strip of substantiated claims only.
- Spend envelope: **free credits only**; expand only if external investment materializes; continue while profitable.
- Unit economics: first cleanup **$7.50** (50% off), recurring **$15/week**, ~70% gross margin, LTV ≈ $546/yr gross profit per customer.
- **Profitability circuit-breaker:** pause campaign when CAC > 12 weeks of gross profit per customer (**≈ $138/customer**).
- Lead SLA: **5 min during business hours** (Mon–Fri 7a–5p, Sat 8a–2p), next morning after hours.
- SMS consent: **TCPA-compliant checkbox** (per D-0066).
- **Analytics: server-side PostHog only. No GA4, no Meta Pixel, no client tags.**
- All unsubstantiated trust/insurance/history/review claims must be stripped.
- Review date: **2026-08-28** (30 days post-launch or post-1st-paid-customer).

**D-0065 — Pet-Waste Service-Line Ratification**
- Ratifies `cap_pet_waste_cleanup` as a Mission 1 service for the duration of the pilot.
- Reversible: reverts to Month-10 candidate status if the pilot aborts before first customer.
- Insurance: same $1M general liability as mowing/edging/mulching/hedge-trim. No additional rider.

**D-0066 — Outbound SMS Consent**
- Required checkbox on every form with TCPA-compliant language verbatim.
- Capture as `sms_consent: boolean` on the lead record.
- Send acknowledgement SMS only if `sms_consent === true`.
- 10DLC-registered long code or personal-number audit required before production SMS.

**Landing spec — `docs/specs/paid-pilot-landing-spec.md`**
- 5 sections + 1 closer.
- Hard rules: primary CTA + proof visible on 360×640 without scroll; no scroll-driven animation; no parallax; no `useScroll`/`useSpring`/`useTransform`; form posts to `/api/lead` with `sms_consent` + attribution fields.
- Performance: Lighthouse mobile ≥ 90, LCP < 2.5s, CLS = 0, TBT < 200ms, JS ≤ 80KB.
- **Explicitly out of scope (hard-stop per D-0064):** GA4 / gtag, Meta Pixel, Meta CAPI, client/server event-ID dedupe, CallRail, retargeting, multi-campaign/multi-ad-group, LTV modelling, full hero redesign, Meta/organic social/SEO build-out.

---

## Live Implementation State (working tree)

### `/pet-waste` (binding under D-0064)
5 sections + 1 closer, matches spec. **Current state issues:**
- "since 2020" in trust line (must be removed per D-0064 §0.10)
- "Meet Cameron" callout with generated avatar (FTC truth-in-advertising risk)
- `metadata.robots = { index: false, follow: true }` (correct for paid landing)
- `aggregateRating` JSON-LD correctly absent

### `/api/lead` (`apps/web/src/app/api/lead/route.ts`)
- ✅ Stage 2 hardening: idempotency (sha256, 60s), rate-limit (5/IP/60s), ZIP validation, server-side PostHog, sms_consent gate, SLA echo
- ✅ Stage 3 attribution fields: `utm_source/medium/campaign/term/content`, `gclid`, `landing_path`, `referrer`, `event_id`, `analytics_consent`, `form_variant`
- ❌ **Hard-stop violations in working tree:**
  - `sendGA4ServerEvent({ eventName: 'generate_lead', eventId, clientId, userId, value: 60, ... })` fires when `analytics_consent === 'granted'`
  - `sendMetaConversionEvent({ eventName: 'Lead', eventId, email, phone, ... })` fires on consent
  - `notifyNewLead()` is fire-and-forget after `createLead` — router supports `LEAD_NOTIFY_MODE=email|twilio|auto`
  - `sendLeadResponse()` from `@grass/notifications-core` invoked after persistence
  - PostHog `fireLeadCapturedEvent` fires if `NEXT_PUBLIC_POSTHOG_KEY` is set (this is OK per D-0064 §0.9)
  - `markLeadContacted` called when acknowledgement `status === 'sent'`

### SMS / Twilio
- Twilio sender `+1 737 258 3742` is **trial sandbox** (not A2P 10DLC registered)
- `+1 727 313 8011` (Google Voice) is operator's published number — **NOT SMS-capable for trial outbound**
- Old toll-free `+1 888 996 7141` documented as carrier-rejected under A2P 10DLC
- **R-SMS-002** (likelihood 4, impact 4, score 16) — **highest open risk**

### Notification / CRM plumbing
- Lead persistence: `createLead` from `@grass/crm-core` with `idempotency_key`
- Operator notification: `notifyNewLead` from `@grass/web` lib (Gmail SMTP via `GMAIL_USER` + `GMAIL_APP_PASSWORD` by default)
- Customer auto-text-back: `sendLeadResponse` from `@grass/notifications-core` (gated on `sms_consent` and `phone`)
- Status file: `scripts/gtm-status.cjs` wired to probe all integrations

---

## /api/lead Hard-Stop Violations (Working Tree)

| File | Violation | D-0064 § | Fix |
|---|---|---|---|
| `src/lib/server-track.ts` | GA4 MP + Meta CAPI | §0.9 | REMOVE (T1.1) |
| `src/components/analytics/AnalyticsProvider.tsx` | Client-side consent gate | §0.9 | REMOVE (T1.1) |
| `src/components/analytics/ConsentBanner.tsx` | Reverses S3.10 | §0.9 | REMOVE (T1.1) |
| `src/components/analytics/GoogleAnalytics.tsx` | GA4 client | §0.9 | REMOVE (T1.1) |
| `src/components/analytics/MetaPixel.tsx` | Meta Pixel client | §0.9 | REMOVE (T1.1) |
| `src/lib/track.ts` | `window.gtag` / `window.fbq` | §0.9 / Stage 3 | REMOVE (T1.1) |
| `src/lib/twilio.ts` | `sendAutoTextBack` wired | §0.1 (10DLC) | NOT wired to /api/lead |
| `src/app/api/lead/route.ts` | `sendGA4ServerEvent` calls | §0.9 | STRIP (T1.3) |
| `src/app/api/lead/route.ts` | `sendMetaConversionEvent` calls | §0.9 | STRIP (T1.3) |
| `src/app/api/lead/route.ts` | `analytics_consent` field | §0.9 | DEFAULT 'denied' (T1.3) |
| `src/app/api/lead/route.ts` | `event_id` for CAPI dedup | §0.9 | REMOVE (T1.3) |

---

## Current `output/gtm/` Directory Inventory

| Path | Size | Mtime | Status |
|---|---|---|---|
| `README.md` | 19,615 B | 2026-07-29 | Active (with supersession notice) |
| `01-landing-page-audit.md` | 23,257 B | 2026-07-28 | "superseded for prioritization" |
| `02-tracking-stack-spec.md` | 33,715 B | 2026-07-28 | **DEFERRED** per D-0064 |
| `03-google-ads-campaign-draft.md` | 20,398 B | 2026-07-28 | **REVISED** — DO NOT IMPLEMENT AS-IS |
| `04-build-report.md` | 16,270 B | 2026-07-29 | ⚠️ Claims P0 built (contradicts D-0064) |
| `05-account-setup-presentation.html` | 41,596 B | 2026-07-29 | ⚠️ Embeds Twilio auth token in plaintext |
| `05-pipeline-proof-run.jsonl` | 2,058 B | 2026-07-29 | Synthetic events |
| `06-google-ads-bulk-import.csv` | 3,903 B | 2026-07-29 | **10 rows enabled** — needs review |
| `07-citation-claim-checklist.md` | 6,436 B | 2026-07-29 | Citation checklist |
| `08-twilio-buy-number-usage.md` | 4,849 B | 2026-07-29 | Twilio CLI guide |
| `09-google-business-profile-setup.md` | 5,742 B | 2026-07-29 | GBP setup |
| `dev-server.log` | 364 B | 2026-07-29 | Dev server proof |
| `10-post-pilot-playbook.md` | 9,383 B | 2026-07-29 | Day 7/14/30 optimization |
| `11-organic-channel-templates.md` | 11,829 B | 2026-07-29 | Nextdoor/Yelp/Thumbtack templates |
| `12-meta-ads-bulk-import.csv` | 2,860 B | 2026-07-29 | **5 rows paused** ✅ |
| `13-microsoft-ads-bulk-import.csv` | 3,163 B | 2026-07-29 | **8 rows enabled** ❌ (must be paused) |
| `14-honest-first-30-days-projection.md` | 8,573 B | 2026-07-29 | Three-scenario model |
| `15-pre-launch-runbook.md` | 8,679 B | 2026-07-29 | ⚠️ 3-channel violation |
| `16-ab-test-plan.md` | 9,441 B | 2026-07-29 | 7 A/B tests |
| `17-pinellas-competitor-analysis.md` | 8,275 B | 2026-07-29 | Poop911 positioning |
| `18-zero-review-trust-builders.md` | 8,118 B | 2026-07-29 | "no fake stars" playbook |
| `19-vercel-env.example` | 2,529 B | 2026-07-29 | Vercel env reference |
| `20-launch-command-center.html` | 28,254 B | 2026-07-30 | ⚠️ 3-channel violation + compromised password |
| `21-twilio-verified-recipient.md` | 3,809 B | 2026-07-30 | ⚠️ Twilio auth token in `curl` example |
| `22-zero-budget-deploy-guide.md` | 10,092 B | 2026-07-30 | Mostly D-0064-aligned |
| `.env.local.template` | — | 2026-07-30 | ⚠️ Live Twilio Account SID `AC[REDACTED-twilio-sid]` and auth token `[REDACTED-twilio-token]` — ROTATE IMMEDIATELY |
| `creative/` | 8 PNGs | 2026-07-30 | All generated |

---

## KPI / SLA / Pause-Trigger Table

| Metric | Value | Source |
|---|---|---|
| Lead SLA during business hours | 5 minutes | D-0064 §0.7 |
| Lead SLA after hours | Next business morning | D-0064 §0.7 |
| **CAC circuit-breaker (binding)** | **Pause when CAC > $138/customer** | D-0064 §0.6 |
| Pet-waste target CAC | $40–60 | D-0064 / 14-honest-first-30-days-projection.md |
| Pet-waste CPL target | $20–30 | 03-google-ads-campaign-draft.md |
| Lead-to-booked target | 30%+ cold, 50-60%+ retargeting | 03-google-ads-campaign-draft.md |
| Show-up rate target | 80%+ realistic | 14-honest-first-30-days-projection.md |
| Close rate target | 30%+ cold, 60%+ retargeting | 03-google-ads-campaign-draft.md |
| 30-day retention | 90%+ | 03-google-ads-campaign-draft.md |
| LTV (12 months) | $720 | 14-honest-first-30-days-projection.md |
| LTV/CAC | 4–6x (profitable) | 14-honest-first-30-days-projection.md |
| MRR per customer | $60 (12 × $15/wk) | D-0064 / unit economics |
| Google CPC cap (pet waste) | $3.00 | 03-google-ads-campaign-draft.md |
| Ad CTR pause threshold | < 1% | 03-google-ads-campaign-draft.md |
| Keyword pause threshold | > $20 spend with 0 conversions | 03-google-ads-campaign-draft.md |
| Quality Score target | 7+ | 03-google-ads-campaign-draft.md |
| Lighthouse mobile | ≥ 90 | docs/specs/paid-pilot-landing-spec.md |
| LCP | < 2.5s on throttled 4G | spec |
| CLS | 0 | spec |
| TBT | < 200ms | spec |
| Total JS | ≤ 80KB | spec |
| Pet-waste first-day kill signal | < 3 qualified leads by Day 7 | D-0064 R-PILOT-001 |
| Day 14 kill signal | No qualified leads | D-0064 R-PILOT-004 |
| Day 30 kill signal | CPA > $80 sustained, < 2 customers by Day 60 | 10-post-pilot-playbook.md |
| Day 30 budget cap | < $500 ($500 free credit covers 30 days at $16/day) | 10-post-pilot-playbook.md |

---

## Hard Contradictions to Fix Before Any Launch

1. **Channel scope** — D-0064 says Google Search only. CSVs (06, 13) have rows marked `enabled`. Runbook, command center, deploy guide all instruct three-channel unpause.
2. **Tracking stack** — D-0064 §0.9 says server-side PostHog only. `/api/lead` already fires GA4 + Meta CAPI when consent is granted.
3. **CSV `enabled` flags** — 06-google-ads-bulk-import.csv (10 rows enabled), 13-microsoft-ads-bulk-import.csv (8 rows enabled), 12-meta-ads-bulk-import.csv (5 rows paused) — Microsoft and Google are flipped from intended state.
4. **Scarcity frame "first 5 neighbors on your street"** — Used in /pet-waste subhead, Meta copy, Nextdoor templates. /pet-waste currently has the scarcity frame; spec doesn't.
5. **Tenure claim** — "Since 2020" in /pet-waste and ads; "since 2026" in GBP and Yelp bio. D-0064 §0.10 says unsubstantiated history claims must be stripped.
6. **Insurance claim** — "$1M Liability Insured" used in ads and callouts. D-0064 §0.10 says unsubstantiated insurance claims must be stripped.
7. **Customer-count claim** — "Trusted by 47 Yards in 33771" (Google H8) — unsubstantiated, must be removed.
8. **Star-rating / review-count claims** — "5-Star Pet Waste Service" / "5-Star Lawn Care" / "Pinellas County's #1" / "Pinellas County's Pet Waste Pros" / "Trusted by Largo Neighbors" / "Trusted by Dog Owners" / "Family-Owned" / "Stop Calling Franchises" — all unsubstantiated, must be removed.
9. **"Veteran-owned" attribute** — listed as optional GBP attribute. Only claim if true.
10. **Insurance inconsistency** — D-0065 says $1M general liability; the GBP "Add attributes" includes "Free estimates" / "Veteran-owned" / "Online quotes" but does not list "Insured" — should be added once the policy number is on hand.
11. **Lookalike pre-condition** — `12-meta-ads-bulk-import.csv` Lookalike row requires "100+ emails" but no email list-building plan exists.
12. **Lookalike geo** — "Pinellas County FL (excl 7mi from home)" — conflicts with 6-ZIP service area.
13. **Meta cold-dog-owners body copy** — lists 5 ZIPs and omits 33756 — bug.
14. **Microsoft copy** — says "$15/Week — Same Day Text" but binding offer is "Free first cleanup, then $15/wk" — Microsoft headline drops the free offer.
15. **Pricing ladder in copy vs. price-book** — Lawn care copy says $25+ per visit or $45 average; price-book has $38–$115 tier table.
16. **Domain default** — `22-zero-budget-deploy-guide.md` says use Vercel `*.vercel.app`; the runbook says buy `largolawn.pro` for $12. `NEXT_PUBLIC_SITE_URL` is the single switch.
17. **Twilio A2P 10DLC** — documented block; no upgrade in flight. Live `sendAutoTextBack` path is wired but probably not delivering.
18. **Security** — `05-account-setup-presentation.html`, `21-twilio-verified-recipient.md`, `.env.local.template` all contain live-looking Twilio credentials. `20-launch-command-center.html` references a compromised password. **These should be treated as compromised, rotated/revoked, removed from history, and replaced with placeholders.**
19. **Creative identity** — All 8 images appear generated. Pairing the solo-operator narrative with a generated face risks FTC truth-in-advertising exposure.
20. **A/B test queue** — `16-ab-test-plan.md` lists 7 tests. No test infrastructure (`?h=A` / `?h=B` query params, GA4 split) is built.
21. **Privacy page SMS disclosure** — D-0066 §0 requires updating `apps/web/src/app/privacy/page.tsx` to disclose SMS as a contact channel.
22. **`/t/[source]` redirect** — Stage 3 attribution fix referenced in D-0064 §10 and the landing spec §2 — needs verification that it's wired.
23. **No postpaid nurture, onboarding, abandoned-lead, quote-follow-up, reactivation, or referral sequences** — All absent from GTM output.
24. **No LTV modelling** — D-0064 §8 out of scope, but downstream of pilot the 90-day retention rate needs measurement.

---

## Files to Deprecate or Re-Stamp

- `03-google-ads-campaign-draft.md` — mark REPLACED
- `04-build-report.md` — inaccurate post-D-0064
- `05-account-setup-presentation.html` — purge credentials
- `06-google-ads-bulk-import.csv` + `13-microsoft-ads-bulk-import.csv` — flip status to `paused` (or remove)
- `15-pre-launch-runbook.md` — rewrite to honor D-0064
- `20-launch-command-center.html` — same rewrite, plus purge compromised password
- `21-twilio-verified-recipient.md` — purge the `curl -u AC...:3bb4...` example
- `.env.local.template` — purge live Twilio SID/token

## Files to Author (currently missing)

- A revised, single, binding Google Search campaign draft (Stage 5)
- A pilot-outcome ADR template (Stage 6)
- A 90-day review decision tree
- A real operator portrait of Cameron Pike with documented consent
- A real "before/after" pet-waste photo
- An A/B test harness (`?h=A` / `?h=B` query-param routing + GA4 split)
- Email/SMS nurture sequences for after the first paid cleanup

---

## Security Action Items

1. **Rotate Twilio account** — `[REDACTED-twilio-sid]` is in 3 files and exposed. Treat as compromised.
2. **Rotate Gmail app password** — referenced in `20-launch-command-center.html`.
3. **Purge credential references** — replace all with placeholders in `output/gtm/`.
4. **Block git-history** — consider BFG Repo-Cleaner on all 3 files; or `git filter-repo` to drop credential lines.

---

## What this audit did NOT cover

- Documentation-only drift (covered by Audit 1).
- Website visual + component contents (covered by Audit 2).
- `output/procurement/` artifacts (covered by Audit 1).
- Memory / knowledge architecture (intentional omission).
