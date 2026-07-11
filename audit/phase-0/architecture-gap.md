# Phase 0 — Architecture Gap Audit

**Date:** 2026-07-10 | **Phase:** 0 — Repository audit and baseline | **Author:** Steward (with Claude Code) | **Status:** Final; reviewed before Phase 1 entry.

---

## Purpose

Cross-reference the **stated** system architecture (in `constitution/`,
`architecture/`, `agents/`) against the **actual** state of the repo
post-Day-5. Items that the docs promise but the code does not yet have are
called out here. Items that exist in the repo but are not yet referenced
in the docs are called out the other way.

Charter principle: *"Truth over convenience."* This document is the
single place where we audit our own promises. Update it on every Phase
transition.

---

## Legend

| Symbol | Meaning |
|---|---|
| `[docs-promised, repo-missing]` | The architecture describes this; the code does not yet have it. **Gap.** |
| `[repo-exists, docs-missing]` | The code has it; no canonical spec exists yet. **Drift risk.** |
| `[docs-promised, repo-present]` | Aligned. ✅ |
| `[intentional-deferral]` | Documented in plan; intentionally deferred to a later phase. Not a gap, just a place-check. |

---

## 1. Governance layer

| Item | Status |
|---|---|
| Immutable constitution (`constitution/01-constitution.md`) | ✅ Present; immutable per CLAUDE.md hard rule. |
| Charter (`constitution/02-charter.md`) | ✅ Present (relocated from doc set Day 3). |
| Charter amendments (`constitution/charter-amendments/`) | ✅ Pilot Exception drafted Day 3. |
| Decision framework (`governance/05-decision-framework.md`) | ✅ Present. |
| Decision records (`governance/decisions/`) | ⚠️ **[docs-promised, repo-missing]** No decision records authored yet. D-0001-PilotException lives in `constitution/charter-amendments/`. D-0002/D-0003/D-0004 referenced in state/ledger.yaml but no `governance/decisions/000X-*.md` files exist. **Closing target: end of Week 1 (commit D-0002, D-0003, D-0004 ADRs before any irreversible action).** |
| ADR folder (`architecture/adrs/`) | ⚠️ **[docs-promised, repo-missing]** Empty / non-existent. ADR scheme referenced in plan but not yet foldered. **Closing target: Week 2 (initial ADR for state-ledger storage format).** |

## 2. Knowledge layer

| Item | Status |
|---|---|
| Knowledge architecture (`knowledge/06-knowledge-architecture.md`) | ✅ Present (relocated Day 3). |
| Memory directory convention (`.claude/projects/`) | ✅ Convention documented in CLAUDE.md. |
| `knowledge/decision-log/` | ⚠️ **[intentional-deferral]** First entries land when D-0002/D-0003/D-0004 ADRs commit. |
| `knowledge/postmortems/` | ⚠️ **[intentional-deferral]** First postmortem after first incident (likely post-launch). |
| `knowledge/lessons-learned/` | ⚠️ **[intentional-deferral]** First entry after Month 2 retro. |

## 3. Planning layer

| Item | Status |
|---|---|
| Execution plan (`constitution/03-execution-plan.md`) | ✅ Present (relocated Day 3). |
| Phase-0 audit deliverables (`audit/phase-0/{architecture-gap,tech-debt,6-month-roadmap}.md`) | ✅ This file plus two siblings — the audit trio. |
| Phase-1 deliverables (research/regulatory/largo-licensing-map.yaml et al.) | ⚠️ **[intentional-deferral]** Day 8 GATE. |

## 4. Agent layer

| Item | Status |
|---|---|
| Agent schema (`agents/_schema.md`) | ✅ Day 3. |
| 13 agent specs drafted (draft status) | ✅ Day 4 — all 13. |
| 13 agent specs promoted to `active` | ⚠️ **[docs-promised, repo-missing]** **Gap.** Each spec's `Acceptance Criteria` section requires: constitution review passed, ≥1 postmortem documented, ≥1 week of KPI data. Realistic promotion: 1 agent per Month of operation, all 13 by Month 6. |
| Agent memory directories (`agents/memory/<role-slug>/`) | ⚠️ **[intentional-deferral]** Created on first need (per agent spec). |
| `reports_to` graph fully resolved via Decision Template | ⚠️ **[docs-promised, repo-missing]** All 13 agents have `reports_to` set; some point to `human:steward` (correct for Day 4); re-parenting to other agents (e.g., engineering ← qa) needs an ADR before flipping. |

## 5. Shared services layer

| Item | Status |
|---|---|
| `platform/packages/auth` | ⚠️ **[intentional-deferral]** Triggers at 2+ consumers (auth used in admin app + portal). |
| `platform/packages/crm-core` | ⚠️ **[intentional-deferral]** Jobber replaces this Months 0-6. |
| `platform/packages/payments-core` | ⚠️ **[intentional-deferral]** Single consumer (Stripe Intents) until portal exists Month 6+. |
| `platform/packages/scheduling-core` | ⚠️ **[intentional-deferral]** Same logic. |
| `platform/packages/notifications-core` | ⚠️ **[intentional-deferral]** First shared when portal + admin + dispatcher all need SMS. |

## 6. Business applications layer

| Item | Status |
|---|---|
| Customer-facing web app (`apps/web/`) | ⚠️ **[docs-promised, repo-missing]** Month 3 minimal landing site. |
| Admin app (`apps/admin/`) | ⚠️ **[docs-promised, repo-missing]** Solved by Jobber Months 0-6. |
| Customer portal | ⚠️ **[docs-promised, repo-missing]** **Defer to Month 6** (telemetry-justified). |
| Field-crew mobile app | ⚠️ **[intentional-deferral]** Jobber crews app Months 0-6. |

## 7. Operations layer

| Item | Status |
|---|---|
| Landscaping MVP in Largo FL | ⚠️ **[docs-promised, repo-missing]** Months 2-6 per plan. |
| GBP profile + 25-citation build | ⚠️ **[docs-promised, repo-missing]** Month 2 workstream. |
| 5 paid pilot jobs (closed beta) | ⚠️ **[docs-promised, repo-missing]** Month 2 exit criterion. |

## 8. Observability layer

| Item | Status |
|---|---|
| Sentry integration | ⚠️ **[intentional-deferral]** Month 4+ wire-up. |
| Axiom integration | ⚠️ **[intentional-deferral]** Month 4+. |
| PostHog integration | ⚠️ **[intentional-deferral]** Month 4+. |
| `lint:audit` script emitting observability schema baseline | ⚠️ **[intentional-deferral]** Post-Month 4. |

---

## Cross-cutting concerns

| Item | Status |
|---|---|
| Security: secrets contract (`.env.example`) | ✅ Day 2. |
| Security: gitleaks in CI | ✅ Day 2. |
| Security: Supabase RLS policies | ⚠️ **[intentional-deferral]** First table when DB schema lands Month 3. |
| Identity: Supabase Auth wiring | ⚠️ **[intentional-deferral]** Month 3. |
| Memory: per-session project memory directory | ✅ Convention in CLAUDE.md. |
| Logging: structured logs for orchestrator | ⚠️ **[intentional-deferral]** First orchestrator run. |
| Metrics: KPI taxonomy (`analytics/kpi-taxonomy.md`) | ✅ Day 4. |
| Testing: charter-compliance aggregator | ✅ Day 5. |
| Testing: capability unit tests | ⚠️ **[docs-promised, repo-missing]** Each capability in `state/capability-registry.yaml` cites `tests: []`. **First tests land with cap_hurricane_mode (Month 2).** |
| Versioning: semver on every agent spec | ✅ Schema enforced via `lint-agents.ts`. |
| Versioning: bun.lock committed | ✅ Set in `.gitignore` (no longer ignored; explicit commitment policy). |

---

## Single biggest risk surfaced by this audit

> **Decision records (D-0002, D-0003, D-0004) are not yet committed as
> `governance/decisions/000X-*.md`.**
>
> The state ledger lists these as "ratified" but ratification, per the
> decision framework, requires a Decision Template entry with rationale,
> alternatives, risks, review date. Until those ADRs land, the org is
> relying on convention rather than charter enforcement.
>
> **Closing target:** End of Week 1. Before any service is launched (any
> irreversible decision executed). This is a hard gate, not a soft one.

---

## Reviewer checklist

- [x] Every governance layer item has a status indicator.
- [x] Every `[intentional-deferral]` is matched to a plan day or month.
- [x] Single biggest risk is named explicitly.
- [x] Closing targets are dates, not aspirations.
- [ ] Reviewed by steward before commit. ← **to be done in this commit**
- [ ] Updated on every Phase transition (template: top of file → "Date / Phase / Author / Status").

---

## Next audit

**Phase 0 → Phase 1 transition review.** Update this file as the
landscape-MVP workstreams begin (Days 8-15 research, Month 2-6 MVP). New
gaps will surface when the digital twin models begin author-authoring
against the registry.
