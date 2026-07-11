# D-0004 — Solo Founder / Lean Operating Model

**Status:** Ratified
**Decision date:** 2026-07-10
**Decision file:** governance/decisions/0004-operating-model.md (this file)
**Review date:** 2026-10-01 (3 months post-launch)
**Owner:** Steward

---

## Context

GRASS is an AI organization that compounds capability. Mission 1 (landscaping) is the first business it operates. The operating model must:
- Maximize learning rate per dollar of capital.
- Force architectural discipline (no escape hatches to "hire someone").
- Be reversible if it stops working (i.e., can hire without rewriting everything).

## Decision

**Operating model: solo founder, lean, with AI agents as the only "staff."**

### Constraints (charter-binding)

| Constraint | Why |
|---|---|
| ≤1 human (steward) | Forces every workflow to be agent-runnable. |
| $200/mo infra ceiling through Month 6 | Prevents "burn $5K/mo on managed services because revenue isn't real yet" trap. |
| No hiring through Month 6 | Re-evaluate at MRR >$5K/mo or when solo founder hours exceed 50/wk sustainably. |
| Admin app = Jobber $39/mo | Don't build admin before validating demand. |
| All agents have explicit authority limits | Approval-queue budget = 5/day max; exceeded means tighten thresholds. |

### Authority limits (charter principle: burnout mitigation, R-BURN-001)

| Decision class | Authority |
|---|---|
| Routine ops (≤$50 spend) | Any active agent may execute |
| $50-$500 spend | Decision Template entry + 24h silent approval |
| >$500 spend | Same-day steward approval required |
| Irreversible (entity change, hiring, real estate, vendor lock-in >$5K/yr) | Steward explicit, ADR required |

### Daily CEO review

- 30 min blocked on steward's calendar.
- Reads `state/ledger.yaml → next_actions`.
- Approves / amends / defers each item.
- Logs decisions in `knowledge/decision-log/NNNN-*.md`.

### Weekly retrospective

- Monday: charter-compliance test pass, KPI snapshot, risk-register re-rank, top-of-debt refresh.
- Run by `executive` agent.
- One short postmortem doc, not stacked.

### Quarterly charter review

- Reviews Pilot Exception retro.
- Reviews Decision ADRs.
- Asks: "Did we learn anything that should change `constitution/02-charter.md`?"

## Alternatives considered

| Alt | Why rejected |
|---|---|
| Solo founder + 1 part-time helper Month 1 | Workers comp exemption lapses (R-FLLIC-001); complexity grows before capability proven. |
| 2 co-founders | Splits learning rate; doubles capital requirement; halve ownership. |
| Solo founder + AI agents + VAs in Month 2 | Same Workers Comp issue; charter principle: hire only when AI can't replace. |
| Full-team launch with $50K seed | Fundamentally different thesis (need capital → not an OS experiment). |

## Risks accepted

- **R-BURN-001** — Solo-founder context burnout by Month 3. Mitigation: authority limits + daily CEO review + approval-queue budget.
- **Bus-factor = 1.** If steward is incapacitated for 30+ days, Mission 1 stalls. Mitigation: knowledge architecture (charter principle: "documentation before memory"); agents must be able to operate with reduced steward attention for at least 14 days.
- **Single-decision-maker bottleneck.** Mitigation: approval-queue budget; tighten thresholds if exceeded.

## When this decision is re-evaluated

| Trigger | Action |
|---|---|
| MRR >$5K/mo for 2 consecutive months | Write `0009-first-hire.md` ADR |
| Steward hours >50/wk for 4 consecutive weeks | Write `0009-first-hire.md` ADR |
| Charter-violation rate >0/wk for 3 weeks | Pause Mission 1; charter review |
| Month 6 retro | Default re-evaluation |

## Implementation triggers

- D-0004 unlocks every agent spec's `Escalates (requires human)` thresholds.
- Authority limits appear verbatim in `agents/executive.md` and inform every other agent's escalation rules.