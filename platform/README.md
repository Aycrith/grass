# Platform — Internal Monorepo Packages

> **Charter principle:** "Internal monorepo packages from Day 1. A package graduates to
> 'extracted' the second it has 2 consumers."
>
> **Phase 6 (continuous):** Shared services extraction. Trigger: a `packages/*` candidate is used
> twice. Authored as a PR with Decision Template entry, backward-compat shim, migration window +
> rollback plan, test coverage delta.

This directory holds the **internal** packages that power both Mission 1 (landscaping) and
future Missions (Mission 2 +). They are the OS substrate, not the customer-facing surface.

---

## Packages (Phase 4-5 deliverable)

| Package | Purpose | Day added | Status |
|---|---|---|---|
| `@grass/auth` | Customer + crew member identity | Phase 0 (stub) | draft |
| `@grass/crm-core` | Customer/Lead/Quote twin-model service layer | Phase 4-5 | draft |
| `@grass/payments-core` | Stripe + Invoice + dunning service layer | Phase 4-5 | draft |
| `@grass/scheduling-core` | Job/Schedule/Route service layer + Mapbox Optimization | Phase 4-5 | draft |
| `@grass/notifications-core` | Twilio SMS + Resend email + review-request | Phase 4-5 | draft |
| `@grass/database` | Postgres schema + migrations + RLS policies | Phase 4-5 | draft |
| `@grass/observability` | Sentry/Axiom/PostHog client wrappers | Phase 4-5 | draft |
| `@grass/decision-log` | Decision Template helpers + governance hooks | Phase 4-5 | draft |

---

## Layout

Each package follows this structure:

```text
platform/packages/<name>/
├── package.json         # name, deps, scripts
├── tsconfig.json        # strict mode + extends root
├── README.md            # what + why + how to consume
├── src/
│   ├── index.ts         # public exports
│   ├── <domain>.ts      # business logic
│   ├── <domain>.test.ts # unit tests
│   └── types.ts         # exported TypeScript types (often twin-model contracts)
└── migrations/          # DB migrations (database pkg only)
```

---

## Authoring rules

1. **Twin model first.** Each package exposes service functions that read/write twin models from
   `architecture/twin/`. The DB schema is implementation; the twin model is contract.

2. **Capability-first tests.** Every public function has ≥1 test that references the
   capability (`cap_*`) it serves.

3. **Decision-template on every irreversible write.** Functions that touch irreversible state
   (delete Customer, void Invoice, etc.) require a `decision_id` parameter. The function fails
   if `decision_id` is missing or unknown.

4. **Observability emission.** Every public function emits a metric event per
   `observability/required-emissions.yaml`. Errors emit error events.

5. **Auth check.** Every public function takes a `principal` arg (`Customer | CrewMember | Steward`)
   and asserts the appropriate authority.

6. **No external services in unit tests.** Stripe, Twilio, Mapbox are mocked; the package
   compiles + tests without network.

---

## When a package graduates from `draft` → `active`

- [ ] All public functions have unit tests
- [ ] README documents the contract
- [ ] At least one Mission 1 capability consumes it
- [ ] Decision Template entry references the package
- [ ] Observability events wired
- [ ] Lint + typecheck + tests pass in CI

---

## Cross-references

- **Twin models:** `architecture/twin/`
- **Capability registry:** `state/capability-registry.yaml`
- **Workflows:** `workflows/`
- **Tests:** `testing/capabilities/<cap_id>.test.ts`
- **Charter:** "Phase 6 (continuous) — Shared services extraction"