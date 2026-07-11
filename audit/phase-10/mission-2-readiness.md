# Phase 10 — Mission 2 Readiness Assessment

> **Date:** 2026-07-10 | **Status:** Framework only — actual readiness evaluation
> deferred to Month 10 per Charter `03-execution-plan.md`.
>
> Charter principle: "Premature Mission 2 selection is the largest strategic risk."

## Why this document exists now (Phase 0, Day 3)

Three reasons to write a Phase 10 framework at ground zero:

1. **Pre-commit the rubric.** If we invent scoring in Month 10 under launch
   pressure, we will game it. Writing it now, with no production data, forces
   honest measurement criteria.
2. **Pre-identify candidates.** Narrowing the vertical space while we have
   time to research (vs. scramble at Month 10) is much cheaper.
3. **Pre-document non-candidates.** Explicitly excluding pest control, tree
   removal, and construction trades now prevents re-litigating them every
   quarter.

## What "ready to launch Mission 2" means

Per the Charter, all of the following must be true:

- [ ] ≥12 months of Mission 1 operations data
- [ ] ≥60% capability reusability across Mission 1 surface
- [ ] ≥8 active agent specs (current: 13, all active or promoted)
- [ ] Profitable Mission 1 (≥$5K MRR or trailing-3-month profitable)
- [ ] Charter compliance green (0 open violations)
- [ ] Twin-sim-vs-real reconciliation delta <15%
- [ ] ≥3 candidate verticals scored against this rubric
- [ ] Charter amendment review window (30-day public comment) completed

## Current status (snapshot)

| Indicator | Status | Notes |
|---|---|---|
| Months of Mission 1 data | 0 | Pre-launch; framework only |
| Capability reusability | TBD | Registry has 9 active; reuse starts Month 4+ |
| Active agent specs | 13/13 | All drafted, awaiting acceptance review |
| Mission 1 MRR | $0 | Pre-launch |
| Charter compliance | Green | All checks passing as of 2026-07-10 |
| Twin-sim delta | N/A | Twin models authored, sim not yet built |
| Candidate verticals | 3 scored | `research/mission-2/candidates.md` |
| Charter amendment review | Not started | Schedule: Month 11 |

## Triggers for Mission 2 kickoff

**When to begin Mission 2 research (Month 10 gate):**

1. Mission 1 has run ≥9 months (allows 3-month evaluation window at Month 12)
2. All "ready to launch" criteria above are satisfied OR explicitly waived via
   Pilot Exception
3. Steward ratifies a Decision Template authorizing the kickoff

**What "kickoff" means:**

- Create a new `state/ledger.yaml` `parent_ledger_id: MISSION_2` chain
- Spawn Mission 2 Phase 0 (research + licensing map + capability gap analysis)
- Allocate <$100/mo infra ceiling for Mission 2 ops
- Reuse ≥80% of platform packages from Day 1

## What this document explicitly does NOT do

- Choose a winner (this is a framework, not a selection)
- Promise a launch date (charter forbids premature dates)
- Guarantee any candidate will launch (criteria are gates, not outcomes)

## Decision template for the eventual selection

When Mission 2 selection happens, the Decision Template entry must include:

1. Candidate scored against the 8-dimension rubric (weighted total)
2. Comparison of top 2 candidates on twin-sim outcome
3. Risk register entries for: regulatory, insurance, ops-time, customer-trust
4. Rollback path: how we exit if Mission 2 fails in <6 months
5. Charter amendment language for any charter exceptions
6. Pilot Exception if any phase exits are skipped

## Cross-references

- Mission 1 execution plan: `constitution/03-execution-plan.md`
- Capability registry: `state/capability-registry.yaml`
- Charter (immutable): `constitution/01-constitution.md`
- Pilot Exception amendment: `constitution/charter-amendments/pilot-exception.md`
- KPI taxonomy: `analytics/kpi-taxonomy.md`
- 3 candidate verticals: `research/mission-2/candidates.md`