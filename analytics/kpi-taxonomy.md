# KPI Taxonomy — GRASS

> **Charter principle:** "Every capability must be measurable."
> This file defines every KPI tracked in the organization: name, formula, instrument, target,
> owner agent, and reporting cadence. Mirrored to runtime records in `architecture/twin/kpi.md`.

> **Last updated:** 2026-07-29 (Stage 3 — trustworthy attribution; lifecycle stage derivation;
> attribution field map; pre-Stage-3 NULL semantics).

---

## North Star

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| **Mission 1 GM $ run rate** | GM$ annualized = sum(last_4_weeks.gross_margin_cents) × 13 | Finance dashboard | ≥$50K/yr by Month 12 | executive |

---

## Mission 1 — Operational (weekly)

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| Active recurring customers | count(Customer where status='active' AND cadence≠'one_off') | CRM | ≥25 by Month 6 | sales |
| Weekly job completion rate | jobs completed / jobs scheduled × 100 | Scheduling app | ≥95% | operations |
| On-time arrival (±30min) | jobs arriving within ±30min of scheduled_at / total × 100 | Crew check-in logs | ≥90% | operations |
| CAC | marketing_spend / new_customers | Ad spend + new-customer count | <$45 | finance |
| LTV (12-month) | sum(revenue per customer cohort over 12mo) | Stripe + CRM cohort | >$400 | finance |
| Gross margin per job | (Invoice.total - Job COGS) / Invoice.total × 100 | Invoice ↔ Job | ≥55% | finance |
| Crew utilization | billable_hours / capacity_hours × 100 | Time clock | ≥75% | operations |
| NPS / 5-star review rate | count(5-star reviews) / total reviews × 100 | Google + Jobber | ≥60% 5-star, ≥30 responses | marketing |
| Lead → quote conversion | count(Quote accepted+sent) / count(Lead contacted+) × 100 | CRM funnel | ≥35% | sales |
| Quote → job conversion | count(Quote accepted) / count(Quote sent) × 100 | CRM funnel | ≥60% | sales |

---

## Mission 1 — Growth (monthly)

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| Organic search impressions | sum(GSC impressions) | Google Search Console | ≥5,000/mo by Month 6 | seo |
| GBP calls / month | count(GBP-tracked phone calls) | GBP call tracking | ≥40/mo by Month 6 | marketing |
| Citation count (clean NAP) | count(approved citations matching NAP) | BrightLocal | ≥35 by Month 6 | seo |
| Backlinks from local sources | count(local-domain backlinks) | Ahrefs | ≥10 by Month 6 | seo |

---

## OS / Reusability (charter-proof chart)

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| Capabilities registered + active | count(Capability where status='active') | capability-registry.yaml | ≥30 by Month 6 | architecture |
| Capability reusability | count(Capability where consumers ≥ 1 AND mission_id = 'os') / count(active) × 100 | Capability registry analysis | ≥60% by Month 6 | architecture |
| Agent specs in `active` status | count(agents where status='active') | agents/ directory | ≥8 of 13 by Month 6 | executive |
| Decision log entries with postmortem | count(Decision where status='reviewed') | governance/decisions/ | ≥15 by Month 6 | knowledge |
| State ledger always-current | last_updated ≤ 7 days | scripts/check-ledger-freshness.ts | 100% | steward |
| Charter violations logged + remediated | 0 open | scripts/charter-compliance.ts | 0 | steward |
| Hours of solo-founder time / customer / week | total hours / active customers | Time tracking | <30 min by Month 6 | executive |

---

## Engineering Health

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| CI green rate | passing runs / total runs × 100 | GitHub Actions | ≥95% | qa |
| MTTR (incident) | mean(time from incident_open to incident_close) | Sentry | <4h | qa |
| Test coverage on platform code | covered lines / total lines × 100 | Bun test | ≥70% by Month 4 | qa |
| Capabilities without tests | count(Capability where tests=[]) | capability-registry.yaml | 0 | qa |
| Open charter-violation todos | count(pending TODO markers in charter-compliance) | charter-compliance | 0 | steward |

---

## Security Health

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| Secrets in repo | count(gitleaks findings) | gitleaks pre-commit + CI | 0 | security |
| Dependabot alerts open (high+critical) | count(GitHub alerts severity≥high) | GitHub Security | 0 | security |
| OSV-Scanner CVEs in supply chain | count(OSV findings) | osv-scanner | 0 | security |
| Capabilities without security review | count(Capability where reviewed_by=NULL) | capability-registry | 0 by Month 4 | security |
| On-time Hurrican-mode trigger test | passed / total quarterly drills | manual drill log | 100% | operations |

---

## Charter Compliance

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| Pilot Exception invocations | count(governance/decisions/PILOT-*) | governance/decisions/ | 0 unless invoked | steward |
| Decision template adherence | count(decision records using template / total decision records) | audit | 100% | knowledge |
| Memory hygiene (weekly) | memory files ≤90 days old / total | scripts/charter-compliance.ts | 100% | knowledge |

---

## How KPIs are computed at runtime

1. Each KPI definition in this file gets mirrored to a `KPISnapshot` (see `architecture/twin/kpi.md`).
2. Nightly Inngest job (`workflows/nightly-kpi-snapshot.ts` — Phase 4 deliverable) computes `actual_*` from source models.
3. Variance_pct = (actual - target) / target × 100.
4. Color code: green (≥95% of target), yellow (80-95%), red (<80%).
5. Monthly scorecard doc published in `analytics/monthly-scorecard.md`.

---

## Owner-agent pairing (why each KPI has a single owner)

A KPI without a single owner becomes a committee. A committee is a deferred decision. Each KPI's owner agent is responsible for:
- Defining the formula (locked in this file).
- Maintaining the instrument (the tool or query that surfaces the data).
- Reporting variance to the steward on the cadence listed.
- Filing a Postmortem template entry when variance is red for ≥2 consecutive periods.

If you disagree with the target, file a Decision Template entry; don't unilaterally change it.

---

## Changes to this file

- Add a KPI → PR + steward approval + add row to twin model's `KPI` cross-reference.
- Change a target → Decision Template entry (charter principle).
- Deprecate a KPI → steward approval + 30-day wind-down.
- Quarterly review by executive agent against mission goals.

---

## Stage 3 — Trustworthy Attribution Additions (2026-07-29)

Three additions landed with Stage 3 (per plan
`review-the-plans-recently-lucky-catmull.md` Stage 3 — server-side
PostHog only, no client tags):

### 3.1 — Lead Lifecycle Stage (derived)

Lifecycle is a *derived* value, not a stored enum on Lead. This keeps
`LeadStatus` (the 6-value operational state machine in
`platform/packages/crm-core/src/service.ts:12`) stable — extending it
would change the `Lead contacted+` denominator for `Lead → quote
conversion` above, which is a Decision Template event per the
"Changes to this file" rule.

Derivation: `leadLifecycleStage()` in
`platform/packages/crm-core/src/lifecycle.ts`. Pure function. Forward-
only (a Lead that reached `booked` and then the customer churned is
still `invoice_paid`).

| Stage | Source signal |
|---|---|
| `new` | Default — no outbound contact yet |
| `contacted` | `Lead.first_response_at` is set (route handler writes it on `acknowledgement_status: 'sent'`) |
| `quoted` | At least one Quote for the lead has `status: 'sent'` or `'accepted'` |
| `booked` | At least one Job linked via Quote has `status: scheduled \| en_route \| on_site \| in_progress \| completed` |
| `invoice_paid` | At least one Invoice for the converted customer has `paid_at` set |
| `retained` | Customer exists with `status: 'active' \| 'prospect'` AND no `churned_at` |

Steward override: if `Lead.lifecycle_stage_override` is non-null, it
wins. Override writes require `principal.role === 'steward'`. The
override trio (`override`, `_at`, `_by`) is the audit trail on the
row itself.

Materialization: nightly
`workflows/nightly-kpi-snapshot.ts` snapshots
`KPISnapshot.actual_lead_lifecycle_*` per stage for slow-changing
reporting. Real-time lifecycle lookup is on-read via
`leadLifecycleStage()`.

### 3.2 — Attribution Field Map

The Lead row carries 10 nullable snake_case attribution fields
(verbatim from `docs/specs/paid-pilot-landing-spec.md §5:108-121`).
First-touch immutable: `utm_source`, `utm_medium`, `utm_campaign`,
`gclid`, `landing_path`, `first_touch_at`. Last-touch updates on each
capture: `utm_term`, `utm_content`, `referrer`, `device_class`.

| # | Field | Capture point | Type |
|---|---|---|---|
| 1 | `utm_source` | URL param on landing/redirect, persisted to localStorage `grass_attribution_v1` | `string \| null` |
| 2 | `utm_medium` | URL param OR per-row in `t/[source]/route.ts:CHANNELS` (vocab: `cpc \| social \| referral \| email \| print`) | `string \| null` |
| 3 | `utm_campaign` | URL param | `string \| null` |
| 4 | `utm_term` | URL param (Google auto-appends for paid search) | `string \| null` |
| 5 | `utm_content` | URL param (Google auto-appends for A/B tests) | `string \| null` |
| 6 | `gclid` | URL param (Google auto-appends; verbatim lowercase) | `string \| null` |
| 7 | `landing_path` | `window.location.pathname` at first capture | `string \| null` |
| 8 | `referrer` | `document.referrer`, hostname-only (stripped of `www.`) | `string \| null` |
| 9 | `device_class` | UA parser → `mobile \| tablet \| desktop` | `mobile \| tablet \| desktop \| null` |
| 10 | `first_touch_at` | `Date.now()` on first write to localStorage (immutable thereafter) | ISO 8601 UTC `string \| null` |

Capture contract:
- Client-side capture in `apps/web/src/lib/attribution.ts`
- Persisted to `localStorage` key `grass_attribution_v1` (30-day TTL)
- Spread into form payload by `ContactForm.tsx` and `QuoteCalculator.tsx`
- Server-side persistence via `createLead()` in
  `platform/packages/crm-core/src/service.ts`
- PostHog `lead_captured` event includes all 10 fields as discrete
  properties for funnel segmentation

### 3.3 — Pre-Stage-3 NULL Semantics

Leads persisted before Stage 3 was deployed (i.e., before commit
`27f4814` on 2026-07-29) have NULL attribution fields. They also have
`source='nextdoor:free_first_mow'` style legacy strings (the v2 source
taxonomy). The Stage 3 PR ships a one-shot migration
(`platform/scripts/migrate-legacy-source.ts`) that:

- Parses `source='nextdoor:free_first_mow'` →
  `utm_source='nextdoor'`, `utm_medium='social'`,
  `utm_campaign='free_first_mow'`, `source='nextdoor'`
- Parses any `source` matching `^(\w+):(\w+)$` →
  `utm_source=$1`, `utm_campaign=$2`, `utm_medium='social'`
- Leaves `source='website'` and other canonical tokens untouched
- Idempotent: re-running is safe (it only writes fields that are
  currently NULL)

NULL semantics for the affected leads:
- Lifecycle stage derivation still works (uses Lead + Quote + Job +
  Invoice + Customer, NOT attribution fields)
- KPI filters that segment by `utm_source IS NULL` will correctly
  group pre-Stage-3 leads under a "pre-attribution" bucket
- CAC calculations on pre-Stage-3 leads use `source` (legacy) as
  the channel key; CAC on post-Stage-3 leads use `utm_source`

### 3.4 — Lifecycle Event Audit Table

Append-only `lead_events` table (schema stub at
`platform/packages/crm-core/src/lead-events.ts`). Every state
transition writes a row. The route handler writes
`event_type='lead_captured'` after `createLead`. Other writers
(quote_sent, quote_accepted, job_scheduled, invoice_paid,
customer_retained, lifecycle_overridden) land with their respective
handlers in later stages.