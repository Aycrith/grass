# Digital Twin — Route

> **Definition.** A `Route` is the optimized driving order of `Job`s within a `Schedule`, computed using Mapbox Optimization API v2.
>
> **Owner agent.** operations.
>
> **Cross-ref.** Schedule, Job, Property, Vehicle.

---

## Schema

```typescript
interface Route {
  id: string;
  schedule_id: string;            // FK → Schedule
  date: string;
  // Sequence
  stops: RouteStop[];
  // Computed
  total_distance_miles: number;
  total_drive_time_minutes: number;
  total_service_time_minutes: number;
  total_duration_minutes: number;
  // Provider
  provider: 'mapbox' | 'google' | 'osrm_self_hosted';
  provider_response_cached?: object;
  computed_at: string;
  // Audit
  created_at: string;
  updated_at: string;
}

interface RouteStop {
  sequence: number;               // 1-indexed
  job_id: string;
  property_id: string;
  address: Address;
  arrived_at?: string;
  departed_at?: string;
  actual_service_minutes?: number;
  drive_from_previous_minutes: number;
  drive_from_previous_miles: number;
}
```

## Mapbox Optimization API v2 call pattern

```typescript
const optimizationRequest = {
  waypoints: jobs.map(j => ({
    coordinates: [j.address.lng, j.address.lat],
    approach: 'curb',  // pulls up to address, not street
    radius: 50,        // meters tolerance
  })),
  source: 'first',     // depot = first job's location
  destination: 'last',
  roundtrip: true,
  steps: false,
  annotations: ['duration', 'distance'],
};

const result = await mapbox.optimization(optimizationRequest);
// result.waypoints[i] = assigned sequence
// result.trips[0].distance / duration = totals
```

## Cost

- Mapbox Optimization v2: $0.10 per 100 waypoints (free tier 100K waypoints/mo).
- For solo founder at <50 jobs/day, optimization cost ≈ $0.05/day.

## Invariants

1. `stops.length ≥ 2` (degenerate single-job routes are uncommon).
2. `total_drive_time_minutes ≤ 60` (otherwise, split into 2 days).
3. Re-routing re-occurs when a Job is moved >2 hours from its `scheduled_at`.
4. Always start route from the first job, not from depot (saves drive for solo-founder who starts at home).

## Cross-references

- **Reads:** Schedule (which jobs), Job (service time), Property (lat/lng)
- **Writes:** Schedule (sets route_id)
- **KPIs derived:** Average drive time / job, route density, fuel cost / job