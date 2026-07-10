# GRASS

> An evolving AI organization that repeatedly launches, operates, and improves real-world businesses.
> **Landscaping & lawn maintenance is Mission 1 — not the destination.**

## What this repository is

**GRASS is not a software project.** It is the substrate, state, governance, and operating procedure of an
autonomous organization that builds, runs, and improves businesses. A real landscaping company in
Largo, Florida is the **first production mission** of this organization — chosen because it exercises
every organizational domain (sales, scheduling, routing, accounting, marketing, customer success,
operations, finance, knowledge engineering) without requiring a regulated product license at MVP.

Every artifact must:

- Make future businesses faster to launch
- Increase organizational capability, not just solve today's problem
- Remain understandable to a newly initialized agent years from now
- Be measurable, version-controlled, reproducible, explainable, and improvable

## What this repository contains today

| Folder | Purpose |
|---|---|
| `AI_Business_Operating_System_Document_Set/` | **Legacy archive.** Original 11-doc governance set. Read-only anchor. Do not edit. |
| `constitution/` | Stable principles + charter amendments (will be populated Day 3) |
| `governance/` | Decision template + ADR log (will be populated Day 3) |
| `architecture/` | Systems architecture + digital twin models (will be populated Day 3) |
| `agents/` | Per-agent specification files (will be populated Days 3-4) |
| `state/` | Machine-readable state ledger, capability registry, risk register (Day 3+) |
| `knowledge/` | Decision log, postmortems, lessons learned (Day 3+) |
| `research/` | Landscape and market research artifacts for each mission (Week 2+) |
| `platform/packages/` | Shared service packages — internal monorepo from Day 1 (Month 3+) |
| `apps/` | Customer- and operator-facing applications (Month 3+) |
| `workflows/`, `prompts/`, `testing/`, `deployment/`, `analytics/`, `audit/` | Operational scaffolding |
| `audit/phase-0/` | Phase 0 audit deliverables (architecture-gap, tech-debt, 6-month-roadmap) — Day 5 |

## Canonical reading order for a new agent session

1. `CLAUDE.md` (to be added Day 3) — single-source index of governance docs and current phase
2. `constitution/01-constitution.md` — immutable principles
3. `constitution/charter-amendments/pilot-exception.md` — Hybrid Strangler-Fig compliance
4. `state/ledger.yaml` — current phase, blockers, decisions, next actions
5. `state/capability-registry.yaml` — what's been registered and at what maturity
6. `state/risk-register.yaml` — top 5 risks with mitigations and review dates
7. `governance/decision-template.md` — required template for irreversible decisions

If any of the above is missing or stale, your first action is to repair or update it — not to proceed.

## Strategy locked-in

| Decision | Choice |
|---|---|
| Sequencing | Hybrid Strangler-Fig (org skeleton in parallel with landscaping MVP) |
| Mission 1 service area | Largo, FL 33771 (Tampa Bay / Pinellas County) |
| Operating model | Solo founder, lean — $200/mo infra ceiling through Month 6 |

Full plan: `/.claude/plans/use-c-users-camer-devnew-grass-ai-busine-shiny-parasol.md`

## License

Apache-2.0 — see `LICENSE`. The steward retains copyright; contributors license under Apache-2.0.

## Status

**Phase 0 (Repository audit and baseline) — Day 1 of 5 in progress.**

| Day | Status |
|---|---|
| Day 1 — git init + LICENSE + README + .gitignore | **In progress** |
| Day 2 — Tooling + CI + secrets contract | Pending |
| Day 3 — Move docs + write CLAUDE.md + agent schema + first 3 specs | Pending |
| Day 4 — Risk register + remaining 9 agent specs + KPI taxonomy | Pending |
| Day 5 — MCP filesystem install + smoke test + Phase 0 audit docs | Pending |

Phase 0 + Phase 1 exit criteria will be satisfied simultaneously at end of Day 5.
