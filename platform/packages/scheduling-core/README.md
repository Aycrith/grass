# `@grass/scheduling-core` — Job, Schedule, Route

> **Phase:** draft (Phase 4-5 wire to Supabase + Mapbox Optimization v2).
> **Owner agent:** operations.
> **Twin models read/written:** `job`, `schedule`, `route`.

## Capabilities served

| Capability | Function |
|---|---|
| cap_recurring_schedule | `buildWeekSchedule` |
| cap_mowing_standard | `scheduleJob`, `completeJob` |
| cap_hurricane_mode | `cancelJobsForStorm`, `pauseSchedule` |
| (route) | `optimizeRoute` (Mapbox) |

## Public API

```typescript
export async function scheduleJob(input: JobInput, p: Principal): Promise<Job>;
export async function rescheduleJob(job_id: string, newScheduledAt: string, p: Principal): Promise<Job>;
export async function completeJob(job_id: string, completion: JobCompletion, p: Principal): Promise<Job>;
export async function cancelJob(job_id: string, reason: string, p: Principal): Promise<Job>;
export async function buildWeekSchedule(weekStart: string, p: Principal): Promise<Schedule[]>;
export async function optimizeRoute(jobs: Job[], origin: LatLng, p: Principal): Promise<Route>;
export async function cancelJobsForStorm(stormName: string, p: Principal): Promise<{ cancelled: number }>;
```

## Invariants enforced

- Job.status='completed' requires completed_at AND after_photos (≥1).
- Job.status='scheduled' requires scheduled_at > now + 1h.
- estimated_duration_minutes within ±20% of Service.default_duration_minutes.
- Schedule can hold at most `crew.daily_capacity_hours / avg_job_duration` jobs/day.
- Route total drive time ≤ 60 min; split otherwise.

## Hurricane mode cascade

When cap_hurricane_mode triggers:
1. All jobs in affected period → status='cancelled_no_fault'.
2. Customers auto-notified (Twilio + Resend).
3. Any pre-generated invoices are voided.
4. Block new job assignment.

## Tests

- `types.test.ts` — invariant helpers
- `service.test.ts` — hurricane cascade, capacity checks
- `route.test.ts` — Mapbox adapter mocked