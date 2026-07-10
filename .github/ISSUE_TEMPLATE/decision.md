---
name: Decision / ADR
about: Apply the Decision Template from governance/05-decision-framework.md
title: "[DECISION] "
labels: ["decision", "charter:gate"]
assignees: ["steward"]
---

# Decision Request

> Apply the Decision Template from `governance/05-decision-framework.md` verbatim.
> Required fields are marked **MUST**. Optional fields are **SHOUL** / **MAY**.

## Problem (MUST)
> One paragraph. What is being decided and why now?

## Context (MUST)
> Background. What constraints, dependencies, prior decisions, or events led to this?

## Requirements (MUST)
> What must be true of any chosen solution? List as bullets.

## Alternatives (MUST)
> At least 2 alternatives. For each: name, description, and one-line summary.

## Evaluation Matrix (MUST)
> Score alternatives against the requirements. Use a table.
> Include cost, complexity, maintenance, expected lifespan, migration cost.

| Alternative | Fit (1-5) | Cost ($) | Complexity | Maintenance | Lifespan | Migration | Score |
|---|---|---|---|---|---|---|---|
| A — … |  |  |  |  |  |  |  |
| B — … |  |  |  |  |  |  |  |

## Decision (MUST)
> Sentence: "We choose Alternative X because …"

## Risks (MUST)
> At least 3. Each with likelihood, impact, and mitigation.

## Rollback (MUST)
> Concrete steps. Must be executable without the original author.

## Confidence (MUST)
> 0.0 - 1.0. Why this number, not higher?

## Review Date (MUST)
> Concrete date. Charter: every major decision has a review schedule.

## Charter Impact (MUST)
> Does this change constitution or charter? If yes, link amendment PR.

---

## Checklist (MUST all be ✅ to merge)

- [ ] All MUST fields populated above
- [ ] Decision has been recorded in `governance/decisions/NNNN-<slug>.md`
- [ ] State ledger `state/ledger.yaml` updated with `decision_id` and `open_changes[]`
- [ ] Risk register `state/risk-register.yaml` updated if any new risk added
- [ ] Capability registry updated if a new capability is created
- [ ] Rollback plan tested or documented why it cannot be
- [ ] Review date is on calendar (or scheduled to be)