# Agent Specification Schema

> The canonical schema every agent file in `agents/<role-slug>.md` MUST match.
> Enforced by `scripts/lint-agents.ts`. Blocks pre-commit and CI on missing fields.

## Why a schema

Charter principle: *"Every organizational capability must be registered."* Agents
are the primary units of capability. If two agents ship with different fields, downstream
tools (orchestrator, capability registry, risk register, KPIs dashboard) cannot compose them.
A fixed schema keeps the org legible to a newly initialized agent and to humans years from now.

## File location

`agents/<role-slug>.md` — one file per agent. The role slug is kebab-case, lower-case,
unique across the org. Examples: `research.md`, `architecture.md`, `engineering.md`.

`agents/memory/<role-slug>/README.md` — long-form memory, lazy-created, version-controlled.
Agents may write here freely. The spec is the contract; the memory is the context.

## Required schema

Every agent file MUST contain the following sections, in this order. All fields are required
unless marked **OPT**.

```markdown
# <Role Title>

agent_id: <string, unique across org>
division: Executive|Research|Architecture|Engineering|QA|Security|Infrastructure|Marketing|SEO|Sales|Finance|Operations|Knowledge
reports_to: <agent_id | human:steward>
status: draft|active|deprecated
version: <semver, e.g. 0.1.0>

## Mission
[One sentence — what this agent's existence owes the org.]

## Scope (decides on own)
- [Decision type 1 — what this agent finalizes without escalation]
- [Decision type 2]
- ...

## Escalates (requires human)
- Spend threshold: <dollar amount> per decision
- Reversibility: <list decision classes that are irreversible>
- Charter impact: <yes/no — does this agent ever propose charter amendments?>
- When [specific condition]: escalate to [<agent_id> | human:steward]

## Inputs
- [Data source 1 — file path, API, agent output]
- [Upstream agent 2]
- ...

## Outputs
- [Artifact 1 — doc path, PR, ticket, scheduled job]
- [Artifact 2]
- ...

## Tools
- [MCP server 1 with rate limit]
- [CLI tool 1]
- [API 1 with rate limit and credentials reference]

## Memory
- working: <session-scoped path, e.g. .claude/sessions/<agent_id>/>
- long_term: agents/memory/<role-slug>/README.md
- references: [list of constitution/charter/capability entries this agent cites]

## KPIs (3-7 quantitative, measurable weekly)
- <Metric name>: <target> (instrument: <where measured>)
- ...

## Acceptance Criteria for promotion draft → active
- [ ] Constitution review passed
- [ ] Decision-template used for top 3 irreversible decisions in past 30 days
- [ ] Memory schema populated (at least one postmortem or runbook)
- [ ] Documented at least 1 postmortem
- [ ] KPIs have instruments and 1+ week of data
```

## Validation rules (enforced by `scripts/lint-agents.ts`)

1. **All top-level required fields present** (agent_id, division, reports_to, status, version).
2. **`agent_id` is unique across the org** — no two agents share an id.
3. **`division` is one of the 13 canonical divisions** (see `constitution/02-charter.md`).
4. **`reports_to` resolves to a real agent_id or `human:steward`** — no dangling references.
5. **`status ∈ {draft, active, deprecated}`** — no other values.
6. **`version` is semver** — `MAJOR.MINOR.PATCH`, all numeric.
7. **All section headers present** in order: Mission, Scope, Escalates, Inputs, Outputs, Tools, Memory, KPIs, Acceptance Criteria.
8. **`Escalates` block contains at least one concrete escalation rule** (spend threshold, irreversibility, or specific condition).
9. **`KPIs` block contains 3-7 entries**, each with metric name and target.
10. **`Acceptance Criteria` block contains at least 4 checkboxes.**

## Promotion rules

- `draft` → `active`: requires all Acceptance Criteria checked in the last 30 days AND a
  constitution review pass recorded in the agent's memory directory.
- `active` → `deprecated`: requires a deprecation ADR in `governance/decisions/` with migration
  plan for any consumer agent.
- `deprecated` agents may NOT be referenced by new artifacts. Existing references must
  post a migration ticket.

## When this schema changes

The schema is governed by `state/ledger.yaml → schema_version`. Schema changes require:
1. ADR in `governance/decisions/` describing change rationale and migration impact.
2. Bump `schema_version` in state ledger.
3. Update `scripts/lint-agents.ts` to new schema.
4. Update all existing agent files to new schema in a single PR.

## See also

- `agents/07-agent-organization-spec.md` — original high-level division definition (legacy).
- `governance/05-decision-framework.md` — Decision Template required for irreversible decisions.
- `state/capability-registry.yaml` — capabilities agents own (one-to-many: agent → capabilities).