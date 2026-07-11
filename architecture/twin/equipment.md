# Digital Twin — Equipment

> **Definition.** An `Equipment` is a piece of field equipment used to deliver services. Includes commercial mowers, handhelds, chainsaws, trailers.
>
> **Owner agent.** operations.
>
> **Cross-ref.** Crew (assigned), Job (used), Supplier (acquired from), Insurance (covered by).

---

## Schema

```typescript
interface Equipment {
  id: string;
  // Identity
  kind: 'mower_zero_turn' | 'mower_walk_behind' | 'string_trimmer' | 'hedge_trimmer' | 'blower' | 'edger' | 'chainsaw' | 'trailer' | 'truck' | 'generator';
  make: string;                   // 'Exmark'
  model: string;                  // 'Lazer Z 60"'
  year?: number;
  serial_number?: string;
  // Acquisition
  acquired_date: string;
  acquired_from?: string;         // supplier name
  acquisition_cost_cents: number;
  // Lifecycle state
  status: 'active' | 'broken' | 'maintenance' | 'stored' | 'sold';
  hours_logged?: number;          // for engine-driven equipment
  // Maintenance schedule (recurring)
  maintenance: MaintenancePlan[];
  // Storage
  storage_location?: string;       // home garage, rented storage, etc.
  // Insurance
  insurance_policy_id?: string;
  insured_value_cents: number;
  // Audit
  created_at: string;
  updated_at: string;
}

interface MaintenancePlan {
  task: string;                   // 'oil change', 'blade sharpen', 'air filter'
  interval_hours?: number;         // engine-hour based
  interval_days?: number;         // calendar-based
  last_performed_at?: string;
  next_due_at?: string;
  estimated_cost_cents: number;
}
```

## Equipment roster (initial — per research/suppliers/largo.yaml starter kit)

| id | kind | make/model | new cost | used cost (1-2 yr) | maintenance plan |
|---|---|---|---|---|---|
| eq_mower_primary | mower_zero_turn | Exmark Lazer Z 60" | $11,000 | $7,500 | oil @ 100h, blades @ 25h, air filter @ 50h |
| eq_mower_backup | mower_walk_behind | Honda HRX217 | $700 | $400 | annual service |
| eq_trimmer_primary | string_trimmer | Stihl FS 91 R | $380 | $220 | line replacement as needed |
| eq_trimmer_backup | string_trimmer | Echo SRM-225 | $300 | $150 | line replacement as needed |
| eq_hedge | hedge_trimmer | Stihl HS 56 | $350 | $185 | blade sharpen monthly |
| eq_blower | blower | Stihl BR 600 | $550 | $300 | air filter quarterly |
| eq_edger | edger | Stihl FC 91 | $350 | $175 | annual service |
| eq_chainsaw | chainsaw | Stihl MS 250 | $400 | $250 | chain sharpen per use |

## Invariants

1. `status='active'` requires a non-empty `maintenance` plan.
2. `next_due_at` is recomputed on every `maintenance.last_performed_at` write.
3. A `maintenance` task overdue by >14 days triggers a charter-compliance warning.
4. Insurance `policy_id` required for any `acquisition_cost_cents` ≥ $500.
5. When `status='broken'`, that equipment is excluded from job assignment.
6. When `status='sold'`, equipment record is read-only.

## Cross-references

- **Reads:** Job (which equipment is needed), Crew (which is available)
- **Writes:** Schedule (assigns equipment to crew), maintenance (logs task)
- **KPIs derived:** Equipment downtime, maintenance cost / revenue %, utilization per unit