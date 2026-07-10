# LEGACY ARCHIVE — AI Business Operating System Document Set

**Status:** Frozen as of 2026-07-10. Read-only. Do not edit.

## Why this folder still exists

This is the **historical anchor** of the governance doc set. It was committed as
the first content of the GRASS repository on Day 1 of Phase 0.

The 11 documents in this folder remain canonical for the intent and history of the
original constitution. **New governance artifacts are authored into their proper
locations at the GRASS repository root:**

| Original file | New canonical location (populated Day 3) |
|---|---|
| `01_REPOSITORY_CONSTITUTION.md` | `constitution/01-constitution.md` |
| `02_ORGANIZATION_CHARTER.md` | `constitution/02-charter.md` |
| `03_MULTI_PHASE_EXECUTION_PLAN.md` | `constitution/03-execution-plan.md` |
| `04_SYSTEMS_ARCHITECTURE_SPECIFICATION.md` | `architecture/04-systems-architecture.md` |
| `05_GOVERNANCE_AND_DECISION_FRAMEWORK.md` | `governance/05-decision-framework.md` |
| `06_KNOWLEDGE_AND_MEMORY_ARCHITECTURE.md` | `knowledge/06-knowledge-architecture.md` |
| `07_AGENT_ORGANIZATION_SPEC.md` | `agents/07-agent-organization-spec.md` (origin doc) + per-agent files in `agents/` |
| `08_PROJECT_STATE_LEDGER_SPEC.md` | `state/08-state-ledger-spec.md` |
| `09_REPOSITORY_STRUCTURE.md` | `09-repo-structure.md` (root, archived when executed) |
| `10_FIRST_MISSION_LANDSCAPING_PLAN.md` | `missions/01-landscaping/10-mission-plan.md` (Month 1+) |
| `00_README.md` | This `LEGACY_README.md` |

During Day 3, each document is **moved** (not rewritten) into its new canonical location.
Once moved, this folder remains only for git history traceability. Future Phase-0-era diffs
against the original text should reference this folder.

## Why we kept the originals instead of rewriting them

The constitution treats governance docs as **stable, append-only artifacts**. Even though
the file layout is changing, the content is not — moving the files preserves integrity
checksums and ensures future "what changed?" diffs compare current reality to the original
intent rather than to a previous revision of intent.

If you need to update a governance principle, do not edit these files. Add an amendment
under `constitution/charter-amendments/` and reference the original by file name.
