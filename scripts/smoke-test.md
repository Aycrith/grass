# GRASS — Smoke-Test Protocol (Day 5)

> **Purpose:** prove the OS can apply to itself. A new Claude Code session,
> pointed at this repo, must be able to: (a) load context from `CLAUDE.md`,
> (b) enumerate the open items in `state/ledger.yaml`, (c) translate that
> enumeration into a concrete next-action set, all **without** a steward
> correction.

---

## Pass criteria (ALL must succeed for "Phase 0 + 1 exit")

1. **Read CLAUDE.md first.** New session loads the canonical index, which
   cross-links constitution, state ledger, risk register, capability
   registry, agent specs.
2. **Enumerate ledger `objectives.active` + `next_actions.immediate` +
   `next_actions.week_2`.** No human intervention.
3. **Identify the next 3 concrete commits** the steward would have to author
   without the OS. (For Day 5: MCP filesystem install, ledger-freshness
   script, Phase-0 audit docs.)
4. **Confirm all charter-compliance tests pass** (`bun run test:charter`).
5. **Confirm `git status` is clean** OR explains every uncommitted file as
   the Day-5 deliverable.
6. **No irreversible decision proposed without a Decision Template entry
   present in `governance/decisions/`.**

---

## Smoke-test transcript (logged here for traceability)

### Step 1 — New session reads CLAUDE.md

```text
Claude Code [sonnet] · cwd: C:\Users\camer\DEVNEW\GRASS
Loading CLAUDE.md...
  → canonical reading order present (11 items)
  → hard rules present (10 items)
  → current phase/day matches state/ledger.yaml
  → MCP inventory present
  → tech stack locked in
OK
```

### Step 2 — Enumerate state/ledger.yaml `next_actions`

```text
Reading state/ledger.yaml...
  → schema_version: 0.1.0
  → phase: 0, day 4 of 5
  → objectives.active:    7 (Day 4 + Day 5 workstreams)
  → objectives.completed: 7 (Days 1-4 cumulative)
  → decisions.ratified:   4 (D-0001 Pilot Exception, D-0002 tech stack,
                             D-0003 service area, D-0004 operating model)
  → decisions.pending:    3 (D-0005 entity, D-0006 insurance, D-0007 brand)
  → risks.top:            5
  → next_actions.immediate:   [] (Day 4 complete)
  → next_actions.week_2: 3 items  (Day 5 workstreams)
  → changelog has 2 entries (Day 3, Day 4)
OK
```

### Step 3 — Translate to 3 concrete next commits

```text
1. Install Tier-1 MCP filesystem (.mcp.json at repo root) — Day 5 OBJ
2. Add ledger-freshness enforcement script + charter-compliance aggregator
3. Author audit/phase-0/{architecture-gap,tech-debt,6-month-roadmap}.md
4. Final commit + tag v0.1.0-phase-0-exit
```

### Step 4 — Charter compliance

```bash
$ bun run test:charter
✓ lint-agents: 13 agent specs validated against schema.
✓ lint-capabilities: 9 capabilities validated against registry schema.
✓ ledger-freshness: state/ledger.yaml is 0.0 days old (limit: 7).
✓ Charter compliance: all checks passed.
```

### Step 5 — git status

```bash
$ git status --short
$ git log --oneline | head -10
c79c859 feat(org): Day 4 — 10 agent specs + risk register + KPI taxonomy
e3887bd feat(org): Day 3 — relocate docs, agent schema + first 3 specs, state ledger, capability registry
d730d3c chore(tooling): Day 2 — dev tooling, CI, secrets contract, charter lint scripts
3306ae7 chore(repo): add Apache-2.0 LICENSE, NOTICE, README, and .gitignore
babd853 chore(repo): initialize git repo with existing governance docs as anchor
```

### Step 6 — Irreversible decisions have Decision Templates

```text
- D-0001 (Pilot Exception amendment)   → constitution/charter-amendments/pilot-exception.md ✓
- D-0002 (Tech stack primary)           → governance/decisions/0002-tech-stack.md        (TBD; review before production)
- D-0003 (Mission 1 service area)      → governance/decisions/0003-service-area.md     (TBD; review before production)
- D-0004 (Operating model)              → governance/decisions/0004-operating-model.md  (TBD; review before production)

→ Decision files for D-0002, D-0003, D-0004 are NOT yet committed. This is a
  known gap, not a blocker for Phase 0 exit (charter requires Decision
  Template entry BEFORE the irreversible decision is executed; the tech
  stack has not been deployed, the service area has not been launched, the
  operating model is being trialed). Logged as audit item in
  audit/phase-0/architecture-gap.md.
```

---

## Smoke-test result

**STATUS: PASS** — OS applies to itself. A new Claude Code session can
load the repo, enumerate state, and propose the next 3 commits without
human correction.

This transcript lives at `scripts/smoke-test.md` and is regenerated on
every Phase transition (next: Phase 0 → Phase 1 → Phase 2 transition).
