# Architecture — Digital Twin Models

> **Constitution rule:** "Domain semantics belong with architecture, not app code."
> These 14 models are the **contracts** every capability reads/writes against.
> App code (in `apps/*`) implements these contracts; platform packages (in `platform/packages/*`)
> provide the underlying primitives.

---

## Models

| # | Model | File | Owner agent | Purpose |
|---|---|---|---|---|
| 1 | **Customer** | `customer.md` | sales / operations | Customer master record |
| 2 | **Property** | `property.md` | operations | Physical service location |
| 3 | **Service** | `service.md` | sales / operations | Sellable unit of work |
| 4 | **Crew** | `crew.md` | operations | Field-worker + equipment unit |
| 5 | **Equipment** | `equipment.md` | operations | Mowers, handhelds, tools |
| 6 | **Vehicle** | `vehicle.md` | operations | Pickups, trailers, vans |
| 7 | **Job** | `job.md` | operations | An instance of a Service |
| 8 | **Invoice** | `invoice.md` | finance | Financial record |
| 9 | **Schedule** | `schedule.md` | operations | Daily/weekly crew plan |
| 10 | **Route** | `route.md` | operations | Optimized drive order |
| 11 | **Quote** | `quote.md` | sales | Formal offer to customer |
| 12 | **Lead** | `lead.md` | sales | Pre-customer inquiry |
| 13 | **Marketing** | `marketing.md` | marketing | Spend + content + attribution |
| 14 | **KPI** | `kpi.md` | executive | Measurement contract |

---

## Cross-model flow

```text
        ┌──────────┐
        │   Lead   │
        └────┬─────┘
             │ (qualified)
             ▼
        ┌──────────┐  (accept)  ┌──────────┐
        │  Quote   │────────────►│ Customer │
        └──────────┘             └────┬─────┘
                                      │ (has)
                                      ▼
        ┌──────────┐             ┌──────────┐
        │ Property │◄────────────│   Job    │──┐
        └──────────┘             └────┬─────┘  │ (consumes)
                                     │       ▼
                                     │   ┌──────────┐
                                     │   │ Service  │
                                     │   └──────────┘
                                     │
        ┌──────────┐               ▼
        │ Schedule │◄─────────────┘
        └────┬─────┘
             │ (route)
             ▼
        ┌──────────┐
        │  Route   │
        └──────────┘

        ┌──────────┐                ┌──────────┐
        │  Crew    │───────────────►│ Equipment│ + Vehicle
        └──────────┘                └──────────┘

        ┌──────────┐
        │  Job     │───completed──►┌──────────┐
        └──────────┘               │ Invoice  │
                                   └──────────┘

        ┌──────────┐                ┌──────────┐
        │Marketing │────attribution►│   Lead   │
        └──────────┘                └──────────┘

        ┌──────────┐
        │   KPI    │◄────reads all models, computes metrics
        └──────────┘
```

---

## Why these models, not just tables in Postgres?

1. **Charter principle:** "Maintain a machine-readable organizational state." Twin models are the **semantic** layer; DB tables are the **storage** layer. The semantic layer is reviewable by humans; the storage layer is implementation detail.

2. **Multi-mission reusability:** When Mission 2 launches (Month 15-18), `Customer`, `Property`, `Service`, `Job`, `Invoice`, `Quote`, `Lead` are **80%+ reusable** as-is. Only fields specific to landscaping (`Property.turf_type`, `Service.service_line`) would be mission-specific.

3. **Capability contracts:** Each `cap_*` in the capability registry references one or more twin models it reads/writes. This makes capability-level testing tractable — you test against the model, not the DB schema.

4. **Decision traceability:** Any business decision (e.g., "should we offer fertilization?") requires reasoning about the affected models. The model file IS the decision surface.

---

## What goes in app code, not here

- **Database migrations.** Postgres table creation lives in `platform/packages/database/migrations/`.
- **API routes.** REST/Server Actions in `apps/web/app/api/*`.
- **UI forms.** React components in `apps/web/components/*`.
- **Cron job triggers.** Inngest functions in `workflows/*`.

What does NOT go in app code:
- The semantic structure of "what is a Job" — that's here.
- The pricing ladder — that's here.
- The lifecycle rules — that's here.
- The invariants — that's here.

---

## Change control

- Adding a field → PR to the relevant model file + matching DB migration.
- Adding a model → PR + Decision Template entry + 2nd reviewer (architecture or steward).
- Breaking an invariant → Decision Template entry (charter principle: "No irreversible decision without documented justification").
- Deprecating a model → Decision Template + migration plan.

---

## Cross-references

- **Charter:** `constitution/02-charter.md` (mission, departments)
- **Capability registry:** `state/capability-registry.yaml`
- **Pricing:** `research/pricing/price-book.yaml`
- **KPI taxonomy:** `analytics/kpi-taxonomy.md`
- **State ledger:** `state/ledger.yaml`