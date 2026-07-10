# Charter Amendment: Pilot Exception

> **Status:** Proposed for Day-3 ratification. Effective on commit.
> **Amends:** `constitution/02-charter.md` ("Work only through gated phases. Never skip phases.")
> **Ratification:** First commit containing this file.

## Problem

The Charter requires "work only through gated phases" and "never skip phases." The Hybrid
Strangler-Fig sequencing strategy (see `/.claude/plans/use-c-users-camer-devnew-grass-ai-busine-shiny-parasol.md`)
correctly identifies that phasing and **shipping to customers** are different concerns, but the
charter as written does not distinguish them. This creates a binary choice: either ship nothing
until Phase N exits (no revenue, no market validation) or skip phases entirely (charter violation).

## Context

A solo founder in the first 6 months cannot afford 14-day phase blocks. Phase 1 (constitution/
governance/state ledger) is the only phase where it is reasonable to refuse any mission work
until exit criteria are met. From Phase 2 onward, mission work and OS work are interleaved by
design. Without a formal exception mechanism, the charter becomes a paper gate that is silently
worked around — exactly the "documentation before memory → documentation without enforcement"
failure mode the charter exists to prevent.

## Resolution

Add the following paragraph to `constitution/02-charter.md` immediately after the
"Work only through gated phases" section, in the section on EXECUTION PROTOCOL:

> ### Pilot Exception
>
> When a phase exit would block Mission 1 for more than 14 days, a Pilot Exception may be
> invoked. Pilot Exception requires all five of the following:
>
> 1. **Decision Template entry.** A `governance/decisions/NNNN-<slug>.md` record exists
>    with full Problem, Context, Requirements, Alternatives, Evaluation Matrix, Decision,
>    Risks, Rollback, Confidence, and Review Date populated.
> 2. **Risk register entry.** A new entry is added to `state/risk-register.yaml` describing
>    the specific risk the Pilot creates and its mitigation.
> 3. **Explicit rollback path.** The Decision Template's Rollback field contains concrete
>    steps executable without the original author.
> 4. **State ledger `pending_phase_exit` flag set.** `state/ledger.yaml` records
>    `pending_phase_exit: true` with the Phase ID and Pilot identifier.
> 5. **Charter-amendment review within 30 days.** A review session is scheduled before
>    Day 30 post-Pilot-invocation; outcome recorded in the same decision record.
>
> Pilot runs do not grant Phase exit. A phase exit requires its own Decision Template entry
> with all original exit criteria satisfied.

## Charter principles preserved

This amendment does not weaken any charter principle. It encodes the existing principle
"no irreversible decision may occur without documented justification" by mandating a
Decision Template entry **before** a Pilot can run. The other four requirements ensure
that Pilot activity is auditable, reversible, and explicitly time-boxed.

| Principle | Pilot Exception compliance |
|---|---|
| Research before assumptions | Unchanged — Pilot still requires Decision Template |
| Evidence before decisions | Unchanged — alternatives + matrix required |
| Specification before implementation | Unchanged — Pilot scope must be specified |
| Documentation before memory | Unchanged — Decision record is the documentation |
| Validation before deployment | Unchanged — Pilot includes its own validation |
| Automation before repetition | Unchanged — Pilot informs future automation |
| Maintainability over velocity | Pilot is exception, not default; velocity still bounded |
| Every major decision: rationale + alternatives + risks + review date | **Strengthened** — Pilot mandates all five fields |

## Acceptance criteria

- [x] Decision Template entry recorded before this amendment ratified (governance/decisions/0001-pilot-exception.md)
- [x] Risk register entry added (R-PILOT-001: phase exit drift)
- [x] Rollback path documented (amend the amendment or supersede)
- [x] State ledger `pending_phase_exit` field added (Day-3 ledger commit)
- [x] Charter-amendment review scheduled (Day 30 post-ratification)

## Review schedule

Re-review this amendment Day 30 post-ratification (target: 2026-08-09). Outcomes to assess:
- Number of Pilots invoked.
- Pilot → Phase exit conversion rate.
- Any near-misses where Pilot drifted into untracked territory.