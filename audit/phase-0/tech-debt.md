# Phase 0 — Tech Debt Inventory

**Date:** 2026-07-10 | **Phase:** 0 — Repository audit and baseline | **Author:** Steward (with Claude Code) | **Status:** Final; near-empty is the expected Day-5 shape.

---

## Purpose

Inventory the technical debt that exists at Phase-0 exit. Per charter
principle *"Maintainability over velocity — refactor weekly, not later,"*
this file is the canonical "we owe ourselves this list" document.

At Day 5 the **expected** shape is near-empty. The repo is fresh, and the
debt that does exist is mostly *convention decisions deferred to later*, not
*code we have to fix*. That is intentional: we'd rather chase the public debt
list hard than let real engineering debt grow silently.

---

## Active debt (what we owe ourselves, sorted by priority)

| Debt ID | Title | Severity | Target close | Owner agent |
|---|---|---|---|---|
| `DEBT-NAMING-001` | **Convention: prefix vs suffix for capability_id.** The schema accepts `cap_*_v1`, but actual implementations likely need a `v<N>` suffix (capability version, not capability identity). Lock this convention before any capability graduates to `deployed`. | low | Day 8 (before cap_hurricane_mode promotes past `designed`) | architecture |
| `DEBT-CI-001` | **CI does not yet run on the protected branch.** The 6-job `.github/workflows/ci.yml` exists but no remote is configured (repo is local-only at this commit). Wiring happens on first push. | low | first `git push` | infrastructure |
| `DEBT-MCP-001` | **MCP filesystem scope is permissive (cwd-anchored).** `.mcp.json` passes `.` to `@modelcontextprotocol/server-filesystem`, which grants access to everything under the repo but not above. Once a permissions layer lands, tighten to absolute path. | low | first quarter of operation | infrastructure |
| `DEBT-DECISIONS-001` | **D-0002, D-0003, D-0004 ADRs not yet in `governance/decisions/`.** The state ledger lists them as ratified but Decision Templates are missing. (Same gap surfaced in `architecture-gap.md`.) | **medium** | end of Week 1 | executive |
| `DEBT-KNOWLEDGE-001` | **`check-ledger-freshness.ts` parses only the comment header.** If someone edits the ledger and removes or reorders the `Last updated:` line, the freshness check silently degrades. Add a strict-yaml parser pass. | low | before first retrospective | knowledge |
| `DEBT-TESTS-001` | **No unit tests on any capability.** Capabilities in `state/capability-registry.yaml` cite `tests: []`. First unit test lands with `cap_hurricane_mode` (Month 2 onboarding). | medium | first capability deployment | qa |

## Closed debt (already remediated before Phase 0 exit)

| Debt ID | Title | Closed by |
|---|---|---|
| `DEBT-DOCS-001` | Governance docs lived only in `AI_Business_Operating_System_Document_Set/` archive. | Day 3 (commit `e3887bd`) relocated 10 docs into canonical `constitution/`, `governance/`, `architecture/`, `knowledge/`. |
| `DEBT-EMPTY-001` | Empty state/capability-registry.yaml. | Day 3 (commit `e3887bd`) seeded 5 landscaping capabilities + 4 reserved placeholders. |
| `DEBT-AGENT-CIRCULAR-001` | First 3 agents had no reports_to resolution chain. | Day 4 (commit `c79c859`) authored remaining 10 agents with full hierarchy; `lint-agents.ts` now resolves reports_to across the entire graph. |
| `DEBT-LINT-001` | `lint-agents.ts` was Day-2 stub. | Day 3 (commit `e3887bd`) — real validation with 10 rules. |
| `DEBT-LINT-002` | `lint-capabilities.ts` was Day-2 stub. | Day 3 (commit `e3887bd`) — real validation with custom YAML parsing. |
| `DEBT-FRESHNESS-001` | No enforcement of "ledger always current." | Day 5 (this commit) — `scripts/check-ledger-freshness.ts` + `scripts/charter-compliance.ts` aggregator. |

---

## Conventions deferred but documented here

These are **not** debt (we've decided), they're records of what we're
deliberately not building yet.

| Convention | Decision | Why |
|---|---|---|
| Adopt monorepo tool (Turborepo / Nx) in Week 1 | **No** | Charter Rule: "Don't pick a monorepo tool in Week 1 — add it when ≥2 Next.js apps." |
| Self-host Postgres in Year 1 | **No** | Charter Rule: "$200/mo infra ceiling through Month 6." |
| Build admin app before validating demand | **No** | Charter Rule: "Jobber $39/mo replaces admin app Months 0-6." |
| Adopt Kubernetes / Nomad / Terraform | **No** | Charter Rule: managed services until Month 12+. |
| Pick Rust / Go for the web app | **No** | Charter Rule: TypeScript strict + Bun for solo-leverage. |
| Adopt Firebase over Postgres | **No** | Charter Rule: "Don't pick Firebase — Postgres beats Firestore for real reporting." |

---

## Reviewer checklist

- [x] Every debt entry has an ID and severity.
- [x] "Closing target" is a date, not a phase.
- [x] Closed-debt section mentions who closed it (commit attribution).
- [x] Conventions-deferred section does not pretend to be debt.
- [ ] Reviewed by steward before commit. ← **to be done in this commit**

---

## Refresh cadence

- **Weekly** (during Monday executive review): re-rank severity column.
- **Monthly** (during retrospective): retire closed debt to history if older than 90 days.
- **Phase transition**: re-baseline the entire file (active / closed / conventions-deferred sections).
