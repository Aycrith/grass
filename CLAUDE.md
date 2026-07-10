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

## Current phase and next actions

**Phase:** 0 — Repository audit and baseline

**Day-of-Phase:** 3 of 5

**Active decisions requiring steward attention:** (mirrored from `state/ledger.yaml`)
- D-0001 — Pilot Exception ratification (this amendment, in this commit)
- D-0002 — Tech stack primary selection (Next.js + Supabase + Stripe + Vercel + Jobber)
- D-0003 — Mission 1 service area (Largo, FL 33771) — already ratified
- D-0004 — Solo founder / lean operating model — already ratified

**Immediate next actions:**
1. Day 3 of 5: Author first 3 agent specs (research, architecture, engineering); instantiate
   state ledger; seed capability registry.
2. Day 4: Author remaining 9 agent specs; seed risk register; define KPI taxonomy.
3. Day 5: Install Tier-1 MCP filesystem server; run smoke test protocol; write audit/phase-0
   deliverables.

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

Every organizational capability is registered in `state/capability-registry.yaml`. 5
landscaping capabilities are seeded on Day 3 (mowing, edging, mulching, hedge-trim,
lead-capture). New capabilities are added via PR with the YAML entry, decision_id, and
test reference. Enforced by `scripts/lint-capabilities.ts`.

---

## Risk register

5 risks seeded on Day 4 per the bootstrap plan. Each risk has likelihood, impact, owner
agent, mitigation link, and review date. Re-reviewed weekly. Enforced by ledger freshness
script.

---

## MCP server inventory

| Tier | Server | When added | Status |
|---|---|---|---|
| 1 | `@modelcontextprotocol/server-filesystem` | Day 5 | Pending |
| 2 | `server-github` | Month 2 | Deferred |
| 2 | `server-postgres` | Month 2 | Deferred |
| 2 | `context7` | Month 2 | Deferred |

**Hard rule:** ≤5 MCP servers active per session — MCP tool definitions eat context.

---

## Tech stack (locked-in for Mission 1)

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

## Mission 1 (Landscaping — Largo FL 33771)

- **Service area:** Largo, FL 33771 + adjacent ZIPs (33770, 33778, 33773, 33774, 33756)
- **First legal service line:** Landscaping WITHOUT fertilization, WITHOUT irrigation,
  WITHOUT pest control (until respective licenses acquired).
- **Climate:** USDA zone 10a (hot-humid subtropical, year-round mowing).
- **Hurricane season:** June–November (registered capability, see Day-4 work).
- **Sales tax:** 7% total (state 6% + Pinellas 1% surtax).
- **Entity:** To be decided Day 8 (research output).
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
| 2026-07-10 | Initial creation. Day-3 of Phase 0. | Steward (with Claude Code) |