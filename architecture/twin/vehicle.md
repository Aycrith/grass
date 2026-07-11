# Digital Twin — Vehicle

> **Definition.** A `Vehicle` is the asset used to transport crew, equipment, and materials between job sites.
>
> **Owner agent.** operations.
>
> **Cross-ref.** Crew (assigned), Job (transport), Insurance, Equipment (trailer).

---

## Schema

```typescript
interface Vehicle {
  id: string;
  kind: 'pickup' | 'van' | 'trailer' | 'utility';
  // Identity
  make: string;                   // 'Ford'
  model: string;                  // 'F-150'
  year?: number;
  vin?: string;
  license_plate?: string;
  // Capacity
  towing_capacity_lbs?: number;
  payload_capacity_lbs?: number;
  // Lifecycle
  status: 'active' | 'broken' | 'maintenance' | 'stored' | 'sold';
  mileage?: number;
  // Maintenance
  maintenance: MaintenancePlan[];
  // Fuel
  fuel_type?: 'gasoline' | 'diesel' | 'electric';
  // Insurance
  insurance_policy_id?: string;
  // Commercial decals
  commercial_decals: boolean;     // advertise business name?
  // Storage
  storage_location?: string;
  // Audit
  created_at: string;
  updated_at: string;
}

interface MaintenancePlan {
  task: string;                   // 'oil change', 'tire rotation', 'brake inspection'
  interval_miles?: number;
  interval_days?: number;
  last_performed_at?: string;
  next_due_at?: string;
  estimated_cost_cents: number;
}
```

## Recommended initial vehicles

| id | kind | make/model | cost (used) | notes |
|---|---|---|---|---|
| veh_pickup_primary | pickup | Ford F-150 XLT (2018-2022) | $22-28K | 1/2 ton sufficient; tow + payload adequate for trailer + equipment |
| veh_trailer_primary | trailer | 16ft open landscape (2020+) | $1.5-2.5K | Steel mesh sides; ramp gate; spare tire |

**Decision at Month 2 acquisition:** used pickup ~$25K + used trailer ~$2K = **~$27K total vehicles**. Optional alternative: rent trailer (~$100/mo) and use only a pickup initially.

## Invariants

1. `status='active'` requires a non-empty `maintenance` plan.
2. `mileage` MUST be updated at least monthly.
3. `commercial_decals=true` requires Business Tax Receipt (per research/regulatory/largo-licensing-map.yaml).
4. Insurance `policy_id` required for any active vehicle.
5. Vehicle used for towing MUST have `towing_capacity_lbs ≥ sum(trailer + equipment weight)`.

## Cross-references

- **Reads:** Job (which vehicle is needed), Route (drive-time accumulation)
- **Writes:** Route (drive times), maintenance
- **KPIs derived:** Fuel cost / mile, maintenance cost / mile, vehicle utilization