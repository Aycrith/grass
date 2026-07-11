# Digital Twin — Job

> **Definition.** A `Job` is an instance of a `Service` scheduled to be performed on a `Property` by a `Crew` using `Equipment` and (typically) a `Vehicle`. Jobs are the unit of work execution.
>
> **Owner agent.** operations.
>
> **Cross-ref.** Service, Property, Customer, Crew, Equipment, Vehicle, Invoice, Schedule.

---

## Schema

```typescript
interface Job {
  id: string;
  // Identity
  quote_id?: string;              // FK → Quote (if from a quote)
  invoice_id?: string;            // FK → Invoice (set on completion)
  // What
  customer_id: string;
  property_id: string;
  service_id: string;
  // Who
  crew_id: string;
  vehicle_id?: string;
  equipment_ids: string[];
  // When
  scheduled_at: string;           // ISO 8601 datetime
  estimated_duration_minutes: number;
  // Where
  address: Address;
  // State
  status: JobStatus;
  // Completion
  completed_at?: string;
  actual_duration_minutes?: number;
  actual_equipment_ids_used?: string[];
  // Photos
  before_photos?: string[];
  after_photos?: string[];
  // Notes
  customer_notes?: string;
  crew_notes?: string;
  // Quality control
  qa_spot_check?: QASpotCheck;
  // Audit
  created_at: string;
  updated_at: string;
}

type JobStatus =
  | 'scheduled'
  | 'en_route'
  | 'on_site'
  | 'in_progress'
  | 'completed'
  | 'partial'                   // some services done, some not
  | 'cancelled_no_fault'
  | 'cancelled_with_fault'
  | 'no_show_crew'
  | 'no_show_customer'
  | 'deferred_weather';

interface QASpotCheck {
  checked_at: string;
  spot_check_id?: string;
  passed: boolean;
  notes?: string;
  photo_ids?: string[];
}
```

## Invariants

1. `status='scheduled'` requires `scheduled_at > now() + 1h` (no last-second scheduling unless steward override).
2. `status='completed'` requires `completed_at` AND `after_photos.length >= 1`.
3. `status='cancelled_*'` triggers refund-or-credit logic (no Invoice record, or fully voided Invoice).
4. `estimated_duration_minutes` MUST match `Service.default_duration_minutes` ±20%.
5. Jobs cannot span days; if work requires 2 days, create 2 jobs.

## State machine

```text
scheduled → en_route (crew marks departure)
en_route → on_site (GPS check-in ±15 min window)
on_site → in_progress (work begins)
in_progress → completed (crew marks complete + photos uploaded)
in_progress → partial (some services done; rest deferred)
* → cancelled_no_fault (weather, customer request, hurricane)
* → cancelled_with_fault (crew error, scope creep)
* → deferred_weather (reschedule)

completed → qa_spot_check (10% sample)
```

## Hurricane mode interaction

When `cap_hurricane_mode` triggers:
- All scheduled jobs in the affected period are auto-moved to `cancelled_no_fault`.
- Customers auto-notified via Twilio + Resend (cap_hurricane_mode trigger).
- No Invoice generated; if Invoice was pre-generated, it's voided.

## Cross-references

- **Reads:** Customer, Property, Service (for default duration + equipment), Quote (optional), Crew (capacity)
- **Writes:** Schedule (occupies a slot), Invoice (post-completion)
- **KPIs derived:** Completion rate, on-time arrival, duration variance, QA pass rate