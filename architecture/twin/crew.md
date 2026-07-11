# Digital Twin — Crew

> **Definition.** A `Crew` is a logical unit of field workers + assigned equipment + a vehicle, scheduled as a unit. Solo-founder MVP has one `Crew` (the steward).
>
> **Owner agent.** operations.
>
> **Cross-ref.** Job (a crew is assigned to each), Equipment, Vehicle, Schedule.

---

## Schema

```typescript
interface Crew {
  id: string;
  name: string;                   // 'Crew-A', 'Crew Solo', etc.
  // Members (Phase 2 starts at solo founder; expands on first hire)
  members: CrewMember[];
  // Capacity
  hours_per_day_capacity: number;  // 8.0 default
  billable_hours_target_pct: number;  // 75 KPI target
  // Skill matrix
  skills: Skill[];
  // Equipment & vehicle (defaults; can be reassigned per job)
  default_equipment_ids: string[];   // FK → Equipment
  default_vehicle_id?: string;       // FK → Vehicle
  // Status
  status: 'active' | 'seasonal_pause' | 'blocked_hurricane';
  // Audit
  created_at: string;
  updated_at: string;
}

interface CrewMember {
  person_id: string;              // FK → Person
  role: 'lead' | 'helper' | 'trainee';
  hourly_cost_cents: number;
  hours_per_week_capacity: number;
  certifications: ('gi_bmp' | 'fl_482_pco' | 'first_aid' | 'cdl')[];
}

type Skill =
  | 'zero_turn_mowing'
  | 'walk_behind_mowing'
  | 'string_trimming'
  | 'hedge_trimming'
  | 'edging'
  | 'blowing'
  | 'chainsaw'
  | 'mulching_install'
  | 'irrigation_inspect'
  | 'fertilizer_apply';
```

## Invariants

1. `members[]` MUST contain at least one `role='lead'` when `status='active'`.
2. `billable_hours_target_pct` is computed from completed jobs and used for KPI.
3. `status='blocked_hurricane'` halts any new job assignment.
4. Skill tags are required before assigning a crew member to a job requiring that skill.
5. `members[].hourly_cost_cents` is used for COGS calculation in Job → Invoice rollup.

## Capacity model

```text
daily capacity (hours) = sum(members[].hours_per_week_capacity / 5)
target billable hours = daily capacity × billable_hours_target_pct / 100
```

For solo-founder MVP: `daily capacity = 8h`, `target billable = 6h` (75%).

## State transitions

```text
active → seasonal_pause (off-season fallback)
seasonal_pause → active (season begins)
active → blocked_hurricane (cap_hurricane_mode triggers)
blocked_hurricane → active (cap_hurricane_mode clears)
```

## Cross-references

- **Reads:** Job (current workload), Equipment (assigned), Vehicle (assigned)
- **Writes:** Schedule (assigns crew to job)
- **KPIs derived:** Crew utilization, billable hours %

## Growth plan (per D-0004)

- **Crew-Solo (current):** the steward only.
- **First hire:** add a `CrewMember` with `role='helper'`; `Crew-Solo` becomes `Crew-A` with 2 members.
- **At MRR >$10K/mo:** add `Crew-B` for service-area expansion.
- **Re-evaluation triggers per D-0004.**