# CLAUDE.md — GRASS Root Index for Claude Code Sessions

> **Read this first.** Every Claude Code session in this repository must begin here.
> If this file is stale, your first action is to repair it — not to proceed with other work.

---

## What this repository is

**GRASS is an evolving autonomous AI organization**, not a software project. A real
landscaping and lawn maintenance business in **Largo, Florida** is Mission 1 — the first
production implementation, not the destination. Every artifact must increase the organization's
long-term capability and remain understandable years from now.

See `README.md` for the high-level mission statement and `constitution/` for the binding
principles.

---

## Canonical reading order (mandatory)

Read these in order at session start. If any of them is missing, stale, or contradicts your
task, surface that as a blocker before proceeding.

1. **`CLAUDE.md`** (this file) — single-source index. Updated each Friday by the steward.
2. **`state/ledger.yaml`** — current phase, blockers, active decisions, next actions.
   **If this file is older than 7 days, you MUST flag it before doing other work.**
3. **`state/risk-register.yaml`** — top 5 risks with mitigations and review dates.
4. **`state/capability-registry.yaml`** — every registered capability with maturity status.
5. **`constitution/01-constitution.md`** — immutable principles. Cannot be edited, only amended.
6. **`constitution/02-charter.md`** — mission, departments, execution protocol.
7. **`constitution/charter-amendments/`** — ratified amendments (Pilot Exception, etc.).
8. **`constitution/03-execution-plan.md`** — 11 phases (Phase 0–10) with exit criteria.
9. **`governance/05-decision-framework.md`** — Decision Template, required for irreversible decisions.
10. **`agents/`** — per-agent specifications (one markdown per agent).
11. **`knowledge/06-knowledge-architecture.md`** — memory domains and how to write to them.

When reading any governance file, **always read it via the canonical path** under
`constitution/`, `governance/`, `knowledge/`, `state/`, etc. — never via the legacy
`AI_Business_Operating_System_Document_Set/` archive. The legacy archive exists only for
diff traceability.

---

## Current posture and next actions

**Organizational posture:** Post-pivot archive — researching a new business direction.

**Preserved Mission 1 phase:** 2 — Landscaping MVP launch (cash-min mode), paused on
Day 14. The phase was not formally closed.

**Phase exit status:** `PAUSED AT PRE-LAUNCH (D-0067)` — the D-0064 paid-acquisition
pilot never launched; no ad spend, customer commitments, domain purchase, or business
formation occurred.

**Binding preservation decisions:**
- D-0064 — Paid-acquisition pilot remains ratified but paused.
- D-0067 — Pilot pause and repository-preservation posture, ratified 2026-07-31.
- D-0068 — All six Mission 1 capabilities archived as `status=reserved`, ratified 2026-07-31.

**Immediate next actions:**
1. Do not resume landscaping implicitly. The current workstream is research and scoping for a
   new business direction; it is not yet a ratified new mission.
2. Before any irreversible action in the new direction, use the Decision Template in
   `governance/05-decision-framework.md` and obtain steward ratification.
3. To resume Mission 1, follow `output/plans/RESUMING.md`; D-0069 is the gate to first spend.

---

## Hard rules (charter-binding, no exceptions)

1. **Research before assumptions.** Cite sources for every market claim.
2. **Evidence before opinions.** Every recommendation cites a Decision Template, a research
   artifact, or an ADR.
3. **Specification before implementation.** No code lands without an approved spec.
4. **Documentation before memory.** Every artifact is documented before it is added to
   `knowledge/` or referenced from agent specs.
5. **Validation before deployment.** CI must be green before merge.
6. **Automation before repetition.** If a workflow is repeated, it gets a script in
   `scripts/`.
7. **Maintainability over velocity.** Refactor weekly, not "later."
8. **Every major decision** has rationale, alternatives, risks, and review date recorded in
   `governance/decisions/NNNN-<slug>.md`.
9. **Every capability** is registered in `state/capability-registry.yaml` with maturity status.
10. **No irreversible decision** without a Decision Template entry that has been ratified.

---

## Architecture in one paragraph

GRASS is organized as **8 layers** (Governance → Knowledge → Planning → Agents → Shared
Services → Business Applications → Operations → Observability), per
`architecture/04-systems-architecture.md`. Cross-cutting concerns: Security, Identity,
Memory, Logging, Metrics, Testing, Versioning.

Digital twin models live in `architecture/twin/` (Week 5 target) and define Customer,
Property, Service, Crew, Equipment, Vehicle, Job, Invoice, Schedule, Route, Quote, Lead,
Marketing, and KPI. Twin models are authored in architecture, not in app code.

---

## Agent organization

13 divisions defined per `constitution/02-charter.md`:

| Division | Day-3+ spec |
|---|---|
| Executive | `agents/executive.md` |
| Research | `agents/research.md` (Day-3) |
| Architecture | `agents/architecture.md` (Day-3) |
| Engineering | `agents/engineering.md` (Day-3) |
| QA | `agents/qa.md` (Day-4) |
| Security | `agents/security.md` (Day-4) |
| Infrastructure | `agents/infrastructure.md` (Day-4) |
| Marketing | `agents/marketing.md` (Day-4) |
| SEO | `agents/seo.md` (Day-4) |
| Sales | `agents/sales.md` (Day-4) |
| Finance | `agents/finance.md` (Day-4) |
| Operations | `agents/operations.md` (Day-4) |
| Knowledge | `agents/knowledge.md` (Day-4) |

Each agent defines its Mission, Scope, Escalates, Inputs, Outputs, Tools, Memory, KPIs, and
Acceptance Criteria per `agents/_schema.md`. Spec is enforced by `scripts/lint-agents.ts`.

---

## Capability registry

`state/capability-registry.yaml` currently preserves six authored Mission 1 capabilities
(mowing, edging, mulching, hedge-trim, lead-capture, and pet-waste cleanup) plus four
conceptual capabilities. All are `status=reserved` under D-0068 and must remain reserved
unless landscaping is explicitly resumed through `output/plans/RESUMING.md`.

A capability for the new direction must be added through a ratified Decision Template with
its YAML entry, decision id, documentation, and test reference. Enforcement remains in
`scripts/lint-capabilities.ts`.

---

## Risk register

`state/risk-register.yaml` was last updated 2026-07-31. Mission 1 pilot, capability, and
SMS risks are preserved in a paused posture. R-PIVOT-001 tracks loss of resumability from
working-tree rot or context loss; D-0067, D-0068, the `pre-pivot-2026-07-31` tag, and
`output/plans/RESUMING.md` are its primary mitigations. Re-review cadence remains weekly
unless a risk record specifies otherwise.

---

## MCP server inventory

| Tier | Server | When added | Status |
|---|---|---|---|
| 1 | `@modelcontextprotocol/server-filesystem` | Day 5 | Installed |
| 2 | `server-github` | Month 2 | Deferred |
| 2 | `server-postgres` | Month 2 | Deferred |
| 2 | `context7` | Month 2 | Deferred |

**Hard rule:** ≤5 MCP servers active per session — MCP tool definitions eat context.

---

## Tech stack (Mission 1 preserved; not inherited automatically)

| Layer | Choice |
|---|---|
| Language | TypeScript strict |
| Runtime | Bun 1.3.14 |
| Framework (web) | Next.js 15 App Router + RSC |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Payments | Stripe |
| Email | Resend + React Email |
| SMS | Twilio |
| Routing | Mapbox Optimization API v2 |
| Background jobs | Inngest free tier |
| Vector store | pgvector in Supabase |
| Observability | Sentry + Axiom + PostHog |
| SEO tools | Ahrefs Lite + BrightLocal |
| Operator app (Months 0-6) | Jobber $39/mo |
| Hosting | Vercel |

**Infra ceiling:** $200/mo through Month 6.

---

## Mission 1 (Landscaping — Largo FL 33771, preserved and paused)

- **Status:** Paused at pre-launch under D-0067; all six authored capabilities are reserved under D-0068.
- **Service area:** Largo, FL 33771 + adjacent ZIPs (33770, 33778, 33773, 33774, 33756)
- **First legal service line:** Landscaping WITHOUT fertilization, WITHOUT irrigation,
  WITHOUT pest control (until respective licenses acquired).
- **Climate:** USDA zone 10a (hot-humid subtropical, year-round mowing).
- **Hurricane season:** June–November (registered capability, see Day-4 work).
- **Sales tax:** 7% total (state 6% + Pinellas 1% surtax).
- **Entity posture:** Florida single-member LLC was selected in D-0005, but no entity was formed before the pause.
- **Insurance:** $1M general liability minimum before any field work.

---

## What NOT to do

- **Do not edit files under `AI_Business_Operating_System_Document_Set/`** — legacy archive.
  For diff traceability only. To amend a principle, create a file under
  `constitution/charter-amendments/`.
- **Do not commit `.env`** or any secrets. Use `.env.example` as the contract; real values
  flow from 1Password CLI.
- **Do not skip the Decision Template** for any irreversible decision. The
  `governance/decisions/` directory exists exactly so this is enforceable.
- **Do not push to a remote** before reading `state/ledger.yaml → next_actions` and
  confirming the steward is ready.
- **Do not run a Lead/Sales/Marketing artifact** without consulting the research division
  first (it must cite at least one research artifact from `research/`).
- **Do not modify `constitution/01-constitution.md`.** It is immutable. Amendments go in
  `constitution/charter-amendments/`.
- **Do not reactivate Mission 1 implicitly.** Keep all six landscaping capabilities reserved,
  preserve the `pre-pivot-2026-07-31` tag, and follow `output/plans/RESUMING.md` for any
  explicit resumption.

---

## Useful commands

```bash
# Verify charter compliance (lint-agents, lint-capabilities, ledger-freshness)
bun run test:charter

# Run full validation: lint + typecheck + charter compliance
bun run validate

# Apply auto-fixes from biome
bun run lint:fix

# See Phase-0 audit artifacts
bun run audit:phase-0
```

---

## Changelog

| Date | Change | Author |
|---|---|---|
| 2026-07-31 | Root index reconciled to D-0067/D-0068 post-pivot archive posture; Mission 1 paused at pre-launch and all six authored capabilities reserved. | Steward (with Claude Code) |
| 2026-07-23 | D-0060 five-plane hero architecture (5 commits, +866/-558 lines). Audio dropped, BTS split, 4th cartoon plane (birdbath) + 5th painted plane (fern) added. See governance/decisions/0060-five-plane-hero-architecture.md and content/hero/INTENT.md §2. | Mavis (orchestrator) |
| 2026-07-10 | Initial creation. Day-3 of Phase 0. | Steward (with Claude Code) |
