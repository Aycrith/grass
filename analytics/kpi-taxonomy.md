# KPI Taxonomy — GRASS

> **Charter principle:** "Every capability must be measurable."
> This file defines every KPI tracked in the organization: name, formula, instrument, target,
> owner agent, and reporting cadence. Mirrored to runtime records in `architecture/twin/kpi.md`.

> **Last updated:** 2026-07-10 (Day-4 of Phase 0).

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