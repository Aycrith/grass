# Amendment convention

Effective 2026-07-17, ratified under D-0015 ratification cycle (the first
explicit invocation of this convention). Charter principle #3
(specification before implementation, immutable per
`constitution/01-constitution.md`) binds each irreversible decision
to a Decision Template entry that has been ratified. This file binds
how AMENDMENTS to existing ADRs are handled.

## Pattern selection

Any change to a previously-ratified ADR (scope extension, in-scope
clarification, requirement refinement, or wholly-new requirement)
MUST be recorded via ONE of the following two patterns:

### Pattern A - In-place amendment (default for in-scope clarifications)

Use when the change:
- tightens the existing requirement set (REMOVES work, not ADDS)
- refines the existing requirement wording without changing intent
- extends the existing requirement to a sibling sub-component that
  was unambiguously in scope but went un-named in the original

The implementation:
- Append a `## Amendment N (YYYY-MM-DD)` section to the existing ADR
  file. The amendment body MUST include: scope, rationale, risk,
  rollback, charter rationale (one-sentence explanation of why this
  is in-scope and not a new decision), review date, and `by:` field.
- Append a single `changelog:` row to `state/ledger.yaml` with
  `decision: <parent-id>` and `decision_subrecord: <amendment-num-or-topic>`
  naming the amendment.
- Ship in the same commit so the audit chain is monochrome.

### Pattern B - Sister ADR (default for new test artifacts or wholly-new requirements)

Use when the change:
- introduces a new test artifact (sister spec file, new
  visual-regression baseline, new CI hook)
- introduces a wholly-new requirement that was not implied by
  the parent ADR's original scope
- shifts the implementation pattern from in-place refill to
  multi-component refactor

The implementation:
- Author a sister ADR file at
  `governance/decisions/NNNN-<sister-slug>.md` (next D-number)
  following the standard Decision Template from
  `governance/05-decision-framework.md`.
- Get steward sign-off in the standard cycle
  (Problem / Context / Requirements / Alternatives / Evaluation
  matrix / Decision / Risk / Rollback / Confidence / Review date
  / Acceptance criteria).
- Then implement. NOT before.

## Charter #3 binding reminder

This convention does NOT replace charter principle #3. Every
amendment, whether Pattern A or Pattern B, must trace to a ratified
ADR or a `decision_subrecord` ledger row BEFORE implementation
lands. The convention's goal is to make the audit chain
searchable, not to relax the spec-before-impl rule.

## Rollback clause for in-place amendment that turned out to be scope creep

If an in-place amendment's section is later determined to be new
scope (not originally named in the parent ADR), the steward lifts
the clause into a sister ADR + strikethrough-revises the in-place
amendment section so the historical record is preserved but the
nothing-actually-shipped status is marked. Strikethrough is the
audit record; deletion would erase the mistake's trace.

## Convention modification

Modifications to this convention itself require:
- A `charter-3 ratification row` in the ledger (per
  `decision: GOVERNANCE-AMENDMENT-CONVENTION-N`).
- A code-review PASS on the proposed modification.
- A steward co-sign line in the convention's `Changelog` body.

The convention is steward-mutable; `constitution/01-constitution.md`
remains immutable per the project's charter hierarchy.

## Known duplications (governance audit trail)

The BLOCKING-classification clause described in #Self-Modification (05b`s `## Changelog` body section requirement) is duplicated in 2 places in `state/ledger.yaml` D-0014-CASCADE-CLOSURE row:

- (a) header sub-point under `KNOWN CARRYOVERS (queued for 2026-07-31 review, with BLOCKING/NON-BLOCKING classification):`
- (b) footer line describing the reclassification

Maintenance contract: if the clause wording changes, update BOTH occurrences; the `BLOCKING (carryover #4 only):` marker is the canonical grep anchor for locating both.

Audit note: this duplication is INTENTIONAL per the governance-legibility pattern (auditor sees the same clause in 2 audit-stamps). It is NOT a code-quality bug. Do not deduplicate via YAML anchors or text replacement.
