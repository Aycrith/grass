# GRASS Testing — Charter Compliance + Capability Test Harness

> **Charter principle:** "Validation before deployment. CI must be green before merge."
> **Charter principle:** "Every capability must be tested."

This directory holds:
1. **Charter compliance tests** — automated checks for org-wide rules (state, agents, capabilities).
2. **Capability-level unit tests** — per `cap_*` from `state/capability-registry.yaml`, written against the
   digital twin model contracts in `architecture/twin/`.

---

## Test taxonomy

| Layer | Tool | Where | What |
|---|---|---|---|
| Charter compliance | bun test | `testing/charter/*.test.ts` | "agents valid", "capability schema valid", "ledger fresh" |
| Capability unit | bun test | `testing/capabilities/<cap_id>.test.ts` | "cap_mowing_standard honors Service pricing ladder", "cap_hurricane_mode cascades" |
| Twin model invariants | bun test | `testing/twin/<model>.test.ts` | "Job.status='completed' requires after_photos" |
| Workflow | bun test | `testing/workflows/<wf>.test.ts` | "wf_invoice_dunning sends SMS at day 14" |
| Integration | bun test | `testing/integration/*.test.ts` | "Lead → Quote → Job → Invoice → KPI end-to-end" |
| Charter binding rules | bun test | `testing/charter-binding/*.test.ts` | "Service.license_required matches research/regulatory" |

---

## How to run

```bash
# All tests
bun test

# Just charter compliance
bun run test:charter

# One capability
bun test testing/capabilities/cap_mowing_standard.test.ts

# One twin model
bun test testing/twin/job.test.ts
```

---

## What makes a "good" capability test?

1. **Test against the model contract, not the DB.** A test that reads/writes Postgres directly is an integration test, not a capability unit test.

2. **Test the invariant, not the implementation.** "Job.status='completed' requires after_photos" tests the invariant from `architecture/twin/job.md`. The implementation (Postgres CHECK constraint, app-side validation, RPC handler) is irrelevant.

3. **One test per capability, ≥3 cases.** Per the capability registry schema, each cap must have `tests:` reference. Charter principle: 0 capabilities without tests.

4. **No flaky tests.** Time-dependent tests use a clock-injection pattern or are scoped to cron-style explicit runs.

5. **Trace to ADR or Decision Template.** A test for a non-obvious behavior should reference the governance doc that authorized it.

---

## Adding a new test

1. Identify the target (charter rule / capability / twin model / workflow).
2. Pick the right subdirectory.
3. Author the test file using bun's `test()` API.
4. Reference the source: file path + line or capability ID.
5. Run `bun test <file>` and verify pass.
6. Update CI to include the new test directory if not already covered.

---

## What this directory is NOT

- Not for end-to-end browser tests (those go in `apps/web/e2e/`).
- Not for visual regression tests (those go in `apps/web/visual/`).
- Not for production telemetry (that's in `observability/`).

---

## Charter binding tests (must always be green)

These are the non-negotiable tests. Failure = CI blocks merge.

| Test | Source | Invariant |
|---|---|---|
| `agents-valid.test.ts` | `agents/_schema.md` | All agents have required sections |
| `capabilities-valid.test.ts` | `state/capability-registry.yaml` | All caps have required fields |
| `ledger-fresh.test.ts` | `CLAUDE.md` rule | Last updated ≤7 days |
| `irreversible-decisions-have-template.test.ts` | `governance/05-decision-framework.md` | Every irreversible action has template |
| `pilot-exception-invocation.test.ts` | `constitution/charter-amendments/pilot-exception.md` | Every Pilot Exception has 5 fields |
| `capabilities-have-tests.test.ts` | Charter principle | Every active cap has ≥1 test file |
| `twin-models-coverage.test.ts` | Charter principle | Every twin model has ≥1 invariant test |
| `service-licenses-match-regulatory.test.ts` | `research/regulatory/largo-licensing-map.yaml` | Service.license_required matches matrix |

---

## When a test fails

1. **Don't disable the test.** A skipped test is a silent charter violation.
2. **Read the failure carefully.** It usually points to a doc/code drift.
3. **If the test is wrong:** Open a PR with rationale + alternative invariant. Requires steward approval.
4. **If the code is wrong:** Fix the code, not the test.
5. **Log the failure** in `knowledge/postmortems/YYYY-MM-DD-<slug>.md`.

---

## CI integration

The CI pipeline (`.github/workflows/ci.yml`) runs:
- `bun run test:charter` on every push (must pass)
- `bun test` on every PR (must pass)
- `osv-scanner` for supply chain (must pass)
- `gitleaks` for secrets (must pass)

CI green rate is itself a KPI (`engineering_health.ci_green_rate`).