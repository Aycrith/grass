# Phase 0 → 6 — 6-Month Roadmap

**Date:** 2026-07-10 | **Author:** Steward (with Claude Code) | **Status:** Final; reviewed before Phase 1 entry.

---

## Purpose

Translate the strategic plan (Hybrid Strangler-Fig, Largo FL 33771, solo
founder, $200/mo infra ceiling) into a **6-month milestone plan** with KPIs,
exit criteria, and decision gates. This file is the operative document that
the executive agent re-reviews weekly and the steward approves monthly.

The charter principle: *"If a Month-6 trade-off exists between landscaping
revenue and OS reusability, OS reusability wins."* This file makes that
trade-off visible every month.

---

## North Star (12-month)

> By **Month 12**: ≥60% capability reusability, ≥8 active agent specs, and a
> profitable landscaping business in Largo FL.
> By **Month 18**: a second mission launches using ≥80% of the same substrate.

---

## Sequenced milestones

| When | Mission 1 workstream | OS workstream | Exit criterion (must be true to advance) |
|---|---|---|---|
| **Month 1** (already underway: Phase 0) | Repo bootstrap, FL licensing map (Day 8), market size, competitor set, pricing floor, SEO keywords, supplier ecosystem — Days 8-15 in parallel | Doc relocation, agent specs (13 drafted by Day 4), state ledger, capability registry seeded, risk register seeded, KPI taxonomy, MCP filesystem, Phase-0 audit trio | `audit/phase-0/*.md` exist. Pre-commit + CI green. MCP smoke test passes. |
| **Month 2** | GBP profile optimization + 25-citation build + 5 paid review-acquisition pilot jobs (closed beta). **No website yet.** | Digital twin models authored for Customer, Property, Service, Crew, Equipment, Vehicle, Job, Invoice, Schedule, Route, Quote, Lead, Marketing, KPI (in `architecture/twin/`). Capability registry graduates `cap_hurricane_mode` from `reserved` to `designed`. | 5 paid pilot jobs invoiced + collected; pilot-vs-twin comparison doc written; at least 1 capability reaches `deployed` status. |
| **Month 3** | Minimal public site (1 landing page, 5 service pages). Jobber $39/mo for admin. Stripe for payments. "Pay Now" SMS-via-email link (no portal SPA). | ≥5 capabilities reach `active` status. ≥1 capability extracted into a shared `platform/packages/*` package. Lead → quote → job → invoice → review loop instrumented end-to-end. | First organic lead → quote → job → invoice → review loop closes end-to-end without manual intervention beyond crew dispatch. |
| **Months 4-6** | Real public site. Service expansion (mulching, hedging, seasonal cleanups, hurricane prep). Recurring customer growth. | Auth, CRM-core, payments-core, scheduling-core, notifications-core extracted into `platform/packages/`; ≥8 agent specs reach `active`; CI green ≥95%; charter-compliance tests run on every PR; ≥25 active recurring customers; ≥$5K MRR. | MRR ≥ $5K; capability reusability ≥60% (cross-mission). Charter-violations: 0 unaddressed. |

---

## KPI scorecard (Month-6 targets)

The full taxonomy lives in `analytics/kpi-taxonomy.md`. This is the
executive-summary subset that the monthly scorecard reports against.

### North Star

- **Mission 1 Gross Margin $ run rate:** $2,750/mo by Month 6.

### Mission 1 — Operational

| KPI | Month 3 target | Month 6 target |
|---|---|---|
| Active recurring customers | 12 | 25 |
| On-time arrival (±30 min) | ≥85% | ≥90% |
| CAC | <$55 | <$45 |
| LTV (12-month) | >$300 | >$400 |
| Gross margin per job | ≥50% | ≥55% |
| Lead → quote conversion | ≥30% | ≥35% |
| Quote → job conversion | ≥55% | ≥60% |

### Mission 1 — Growth

| KPI | Month 3 target | Month 6 target |
|---|---|---|
| Organic impressions (GSC) | 1,500/mo | 5,000/mo |
| GBP calls / month | 12 | 40 |
| Citation count (clean NAP) | 15 | 35 |
| Money-keyword rankings (top 10) | ≥3 | ≥10 |

### OS / Reusability

| KPI | Month 3 target | Month 6 target |
|---|---|---|
| Capabilities registered + active | ≥10 | ≥30 |
| Capability reusability (% used in ≥1 mission) | ≥40% | ≥60% |
| Agent specs in `active` status | ≥3 | ≥8 of 13 |
| State-ledger always-current | 100% | 100% |
| Charter violations logged + remediated | 0 unaddressed | 0 unaddressed |
| Hours of solo-founder time / customer / week | <60 min | <30 min |

### Engineering Health

| KPI | Month 3 target | Month 6 target |
|---|---|---|
| CI green rate | ≥85% | ≥95% |
| MTTR (incident) | <8h | <4h |
| Test coverage on platform code | ≥50% | ≥70% |
| Capabilities without tests | 0 | 0 |
| Infra spend vs $200/mo ceiling | ≤$200/mo | ≤$200/mo |

---

## Decision gates (the things that, if missed, force a course-correction)

1. **Day 8 GATE — Licensing map sign-off.** If landscaping-WITHOUT-fertilization-WITHOUT-irrigation-WITHOUT-pest is **not** a legal Day-1 service line, the entire service decomposition must change. Mitigation: cap_mowing_standard stays at `designed` until sign-off.
2. **Day 30 GATE — First pilot job collected.** If no paid pilot job by end of Month 2, double down on closed-beta outreach (Nextdoor, HOA mailing lists). Do not start Month 3 work (public site) until first pilot is collected.
3. **Month 3 GATE — Organic lead close.** If no organic → quote → job → review loop closure by end of Month 3, the SEO thesis is broken — re-evaluate keyword universe before continuing paid acquisition.
4. **Month 6 GATE — Reusability ≥60%.** If capability reusability is below 60%, **Mission 2 selection is paused** (Phase 10 is delayed). The reusability metric is the charter proof; if it can't be hit, the org's structure is wrong.
5. **Month 6 GATE — Infra spend ≤$200/mo.** If breached for any week, postmortem + ADR; do not migrate-to-self-host as a knee-jerk reaction.

---

## Risk ↦ roadmap cross-reference

Active risks live in `state/risk-register.yaml`. The five top risks and how
this roadmap mitigates each:

| Risk | Roadmap mitigation |
|---|---|
| R-CHDRIFT-001 (charter drift) | Capability registration = commit-time lint. Every PR runs `bun run test:charter`. Charter-violation blocks merge, not just docs. |
| R-FLLIC-001 (FL licensing surprise) | Day 8 GATE explicitly steps through every service line. New service lines require re-running the licensing check. |
| R-BURN-001 (solo-founder burnout by M3) | Authority limits encoded in every agent spec (`decides_without_human`, `escalates_when`). Approval-queue budget = 5/day max; exceeded means tighten thresholds. |
| R-INFRA-001 (self-hosting tax pre-PMF) | $200/mo ceiling is a charter rule. Self-host only after MRR > $5K/mo (post Month 6). |
| R-HURR-001 (hurricane season breaks ops) | `cap_hurricane_mode` registered Day 1 of operations. 1-month operating cash reserve before any field crew starts. Hard rule: no outdoor work in named-storm conditions or sustained winds ≥30mph. |

---

## Monthly cadence

| Cadence | Owner | What |
|---|---|---|
| **Daily** | Self (30 min blocked) | CEO review: read `state/ledger.yaml → next_actions`, approve / amend, log decisions. |
| **Weekly** (Monday) | Executive agent + Steward | KPI snapshot; risk-register re-rank; charter-compliance test pass; top-of-debt refresh. |
| **Monthly** (1st) | Executive agent + Steward | **Retrospective postmortem** in `knowledge/postmortems/`. Capability-registry re-rank. Agent-spec promotion review. |
| **Quarterly** | Steward + Claude Code | Charter-amendment review. Pilot-Exception retro. Decision-ADR review. Org-shape question: "Did we learn anything that should change `constitution/02-charter.md`?" |

---

## Phase transitions ahead

| Transition | When | Gate |
|---|---|---|
| **Phase 0 → Phase 1** | Day 5 (now) | This document + audit trio committed. ✅ |
| **Phase 1 → Phase 2** | Day 15 | 6 research artifacts (licensing, market, competitors, pricing, SEO, suppliers). |
| **Phase 2 → Phase 3** | End Month 2 | Pilot jobs invoiced + collected. Digital twin models in `architecture/twin/`. |
| **Phase 3 → Phase 4** | End Month 3 | Lead → quote → job → invoice → review loop instrumented end-to-end. |
| **Phase 4 → Phase 5** | End Month 4 | ≥3 capabilities extracted into `platform/packages/*`. |
| **Phase 5 → Phase 6** | End Month 5 | Charter-compliance tests run on every PR. ≥6 agent specs `active`. |
| **Phase 6 → Phase 7** | End Month 6 | **Reusability ≥60%. MRR ≥ $5K.** |
| **Phase 7 → Phase 8** | End Month 7 | First auto-review-request loop live. |
| **Phase 8 → Phase 9** | End Month 8 | Twin-sim-vs-real reconciliation live. |
| **Phase 9 → Phase 10** | End Month 9 | Mission 1 operating autonomously except for steward-approved spend >$X + customer exceptions. |
| **Phase 10 → Mission 2** | Month 12-15 | 3 candidate verticals scored against capability registry. Charter amendment review. Decision Template entry selecting Mission 2. |

---

## Reviewer checklist

- [x] North Star stated explicitly.
- [x] Every Month has a Mission-1 workstream AND an OS workstream (no month goes pure-product or pure-OS).
- [x] Every Month-3, Month-6 gate has a numerical target AND a defined corrective action.
- [x] Five top risks are explicitly mapped to roadmap mitigations.
- [x] Phase transitions have dates and gates.
- [ ] Reviewed by steward before commit. ← **to be done in this commit**

---

## Refresh cadence

- **Weekly** (Mon executive review): update KPI snapshot column.
- **Monthly** (1st, with retrospective): refresh Month-X actuals vs targets; adjust forward targets.
- **Phase transition**: re-baseline entire file. Archive previous version under `audit/phase-X/6-month-roadmap.md`.
