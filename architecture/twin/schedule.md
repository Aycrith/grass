# Digital Twin — Schedule

> **Definition.** A `Schedule` is the daily/weekly plan mapping `Crew` + `Equipment` + `Vehicle` to `Job`s in time and route order.
>
> **Owner agent.** operations.
>
> **Cross-ref.** Job, Crew, Equipment, Vehicle, Route, Property (for geocoding).

---

## Schema

```typescript
interface Schedule {
  id: string;
  date: string;                   // ISO 8601 date
  crew_id: string;
  vehicle_id?: string;
  // Time slots
  start_time: string;             // '07:30' local
  end_time: string;               // '17:00' local
  // Jobs (ordered)
  job_ids: string[];              // ordered by route sequence
  // Travel
  route_id?: string;              // FK → Route
  drive_time_minutes: number;
  // Exceptions
  weather_hold: boolean;
  hurricane_hold: boolean;
  customer_holds: string[];       // customer_ids who paused service for this day
  // Audit
  created_at: string;
  updated_at: string;
}
```

## Invariants

1. Each `date` has exactly one `Schedule` per `crew_id` (or zero if off-day).
2. `job_ids.length × estimated_duration_minutes + drive_time_minutes ≤ (end_time - start_time) × 60`.
3. `weather_hold=true` blocks all new jobs.
4. `hurricane_hold=true` triggers `cap_hurricane_mode` (no outdoor work).
5. `route_id` is required when `job_ids.length ≥ 2`.

## Schedule generation algorithm

```text
1. Pull all jobs with status='scheduled' and scheduled_at within next 7 days
2. Group by property geo (k-means clustering at 5-mile radius)
3. For each cluster, sequence jobs by route
4. Validate: total drive + work ≤ crew capacity
5. Cap at 6 jobs/day for solo founder (capacity-limited)
6. If >6 jobs/day needed, flag for second-crew expansion
```

## Anti-patterns

- **Single back-to-back:** Jobs at same property should be a bundle (one trip).
- **Cross-ZIP clustering:** Schedule jobs in same ZIP adjacent; reduce drive time.
- **No buffer:** Always add 15-min buffer between jobs (drive variance + setup/cleanup).

## Cross-references

- **Reads:** Job, Crew, Equipment, Vehicle, Property (lat/lng), Route (optional)
- **Writes:** Job (sets scheduled_at), Route (regenerates if jobs shift)
- **KPIs derived:** Schedule density, drive-time %, route optimization %