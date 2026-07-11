# Mission 2 Pilot Exception — Draft for Steward Use

> **Date:** 2026-07-10 | **Status:** Draft (pre-filled, ready for steward ratification IF invoked).
>
> Charter binding: The 30-day charter amendment review windows are non-skippable.
> A Pilot Exception invokes when (a) a phase exit would block Mission 1 for >14 days,
> OR (b) steward wishes to launch Mission 2 before the Month-10 gate.
>
> **This draft is NOT being ratified now.** It exists so that when (not if) the
> steward feels pressure to launch Mission 2 early, the artifact is ready.

---

## Triggering conditions (from charter Pilot Exception amendment)

A Pilot Exception may be invoked when **any** of:

1. A phase exit would block Mission 1 for >14 days
2. The 12-month Mission 1 gate would block Mission 2 by ≥6 months for documented opportunity cost
3. Re-rating of capability reusability shows ≥85% (vs the 60% target)
4. Mission 1 MRR is ≥$8K/mo for 3 consecutive months
5. Charter amendment review window has elapsed (30 days public comment)

If you find yourself wanting to invoke Pilot Exception, ask:

> "Would I be comfortable explaining this decision at the 30-day charter review?"

If no — don't invoke. If yes — proceed with the 5-field ratification below.

## Required fields (all 5 must be populated before invocation)

### Field 1: Decision Template entry

```markdown
# D-PILOT-M2-EARLY — Pilot Exception for Early Mission 2 Launch

**Status:** [Draft → Ratified]
**Decision date:** [DATE — when steward signs]
**Review date:** [30 days after steward signs, mandatory charter review]
**Owner:** Steward
**Invoked under:** constitution/charter-amendments/pilot-exception.md

## Triggering condition

[Pick from the 5 above and quote it verbatim]

## What we're skipping

[Specific phase gate being waived — e.g., "12-month Mission 1 operational data
requirement; substituting 9 months of data + 3 of 4 'ready to launch' criteria met"]

## What we're NOT skipping

[List the gates still in force — typically: charter amendment review, twin-sim
delta check, ≥60% capability reusability, charter compliance green]

## What we gain

[Quantified opportunity cost — e.g., "$X MRR gained by launching Month 9 vs Month 10"]

## What we risk

[Quantified downside — e.g., "Mission 2 fails in <6 months = $Y sunk cost + Mission 1 distraction"]

## Rollback path

[Concrete reversal — e.g., "If Mission 2 MRR <$500 by Month 6 post-launch, wind down
operations within 30 days; archive artifacts; post-mortem within 60 days"]

## Decision

[Steward ratification signature]

## Charter amendment review (mandatory, 30 days post-ratification)

Will be opened on: [DATE]
Public comment window: 30 days
Decision on continuation: [DATE + 30]
```

### Field 2: Risk register entry

```yaml
- id: RISK-PILOT-M2-EARLY
  title: "Mission 2 launch via Pilot Exception may strain solo-founder capacity"
  likelihood: medium
  impact: high
  owner_agent: executive
  mitigation_link: "drafts/mission-2-early-launch-mitigation.md"
  review_date: "[DATE + 30 days]"
  decision_template_ref: governance/decisions/D-PILOT-M2-EARLY.md
  status: open
```

### Field 3: Explicit rollback path

A Pilot Exception is NOT a permanent phase exit. The rollback path must specify:

```
Triggers for rollback (any one):
  - Mission 2 MRR <$500 by Month 6 post-launch
  - Mission 1 NPS drops by ≥10 points attributable to Mission 2 distraction
  - Charter amendment review denies continuation
  - Regulatory incident in Mission 2 (license lapse, customer complaint)

Rollback steps:
  1. [DATE] — wind down Mission 2 operations (no new customer acquisition)
  2. [DATE + 7 days] — fulfill all outstanding Mission 2 obligations (refund/cancel)
  3. [DATE + 30 days] — archive Mission 2 artifacts to research/mission-2-archive/
  4. [DATE + 60 days] — post-mortem authored
  5. [DATE + 90 days] — Mission 2 decision re-evaluated in next charter review
```

### Field 4: state-ledger `pending_phase_exit` field set

Update `state/ledger.yaml`:

```yaml
phase:
  current: 9
  pending_phase_exit: true
  pending_phase_exit_reason: "Pilot Exception invoked for early Mission 2 launch (D-PILOT-M2-EARLY)"
  pending_phase_exit_review_date: "[DATE + 30 days]"
```

This field is the runtime signal that a Pilot Exception is active. The
charter-compliance script (`scripts/charter-compliance.ts`) checks this field
and fails if `pending_phase_exit: true` and the review date has elapsed without
resolution.

### Field 5: Charter amendment review within 30 days

Mandatory. The 30-day window opens on the Pilot Exception ratification date.
Public comment = comments from any active agent on whether the exception was
justified. At review end, the steward either:

- **Confirms** — Pilot Exception becomes permanent phase exit (with charter amendment)
- **Reverts** — Mission 2 operations cease per rollback path
- **Extends** — Pilot Exception renewed for another 30 days (one-time only)

---

## What this draft enables

If/when steward feels pressure to launch Mission 2 early, the workflow is:

1. Copy this draft to `governance/decisions/D-PILOT-M2-EARLY.md`
2. Fill in 5 fields above
3. Steward signs Decision Template
4. State ledger updated with `pending_phase_exit: true`
5. Mission 2 launch proceeds
6. Charter amendment review opened on Day 0
7. Resolution on Day 30

Without this draft, the steward would have to invent the 5-field structure under
pressure — exactly the "we will game it" risk the Charter exists to prevent.

## What this draft does NOT do

- **Pre-approve** Mission 2 launch. Pilot Exception is a tool, not a permission slip.
- **Bypass** the Charter. Amendment review still happens.
- **Skip** documentation. Every artifact still required.

## Cross-references

- Pilot Exception amendment: `constitution/charter-amendments/pilot-exception.md`
- Mission 2 candidates: `research/mission-2/candidates.md`
- Pre-computed scores: `research/mission-2/weighted-scores.md`
- Phase 10 readiness: `audit/phase-10/mission-2-readiness.md`
- Charter compliance script: `scripts/charter-compliance.ts`