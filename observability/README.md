# GRASS Observability

> **Charter principle:** "Maintain a machine-readable organizational state." Observability is the
> machine-readable runtime state. Without it, postmortems become guesswork.

This directory defines the schema for runtime telemetry. The **stack** is locked at Sentry + Axiom + PostHog (per CLAUDE.md Tech Stack table); this directory defines **what** we emit, not **where** it lives.

---

## Three pillars (industry standard)

| Pillar | Tool | Purpose | When added |
|---|---|---|---|
| Logs | Axiom | Structured event stream, low-cost retention | Month 3 |
| Errors | Sentry | Stack traces + impact analysis | Month 3 |
| Metrics + product analytics | PostHog | Conversion funnels + feature usage | Month 3 |

Each pillar emits schemas defined here. App code calls `observability.*` functions; the implementation maps to Sentry/Axiom/PostHog clients.

---

## Schemas

### Log event

```typescript
interface LogEvent {
  ts: string;                  // ISO 8601
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;             // 'web', 'stripe-webhook', 'wf_invoice_dunning', etc.
  agent_id?: string;           // which agent emitted (if any)
  capability_id?: string;      // which capability (if any)
  workflow_id?: string;
  // Context
  customer_id?: string;
  job_id?: string;
  invoice_id?: string;
  // Freeform
  message: string;
  meta?: Record<string, unknown>;
  trace_id?: string;           // for distributed tracing
}
```

### Error event

```typescript
interface ErrorEvent {
  ts: string;
  service: string;
  // Sentry-style
  fingerprint: string;          // grouping key
  exception_type: string;
  message: string;
  stack?: string;
  // Context
  agent_id?: string;
  capability_id?: string;
  workflow_id?: string;
  user?: { id: string; type: 'customer' | 'crew_member' | 'steward' };
  // Charter binding
  irreversible?: boolean;       // if true, escalate to steward
  // Tags
  tags: Record<string, string>;
}
```

### Metric event

```typescript
interface MetricEvent {
  ts: string;
  name: string;                // 'job.completed', 'invoice.paid', 'lead.created'
  value: number;               // optional numeric
  tags: Record<string, string>;
  // Sourcing
  source: 'capability' | 'workflow' | 'kpi_snapshot' | 'manual';
  capability_id?: string;
  workflow_id?: string;
}
```

---

## Required instrumentation

Every capability (`cap_*` in registry) MUST emit at least one metric event on successful execution
and one error event on failure. The minimum required events are listed in
`observability/required-emissions.yaml`.

### Minimum emissions by capability

| Capability | Required emission |
|---|---|
| cap_lead_capture_gbp | metric: `lead.created`, tags: `{source}` |
| cap_mowing_standard | metric: `job.completed`, tags: `{weather, crew_id}` |
| cap_hurricane_mode | metric: `hurricane_mode.triggered`, tags: `{storm_name, max_winds_mph}` |
| cap_auto_quote_mowing | metric: `quote.sent`, tags: `{service_line, source}` |
| cap_review_request | metric: `review_request.sent`, tags: `{cadence}` |
| (every cap) | error event on failure with fingerprint |

---

## PostHog events (product analytics)

```typescript
const ANALYTICS_EVENTS = [
  'customer_signup_completed',
  'quote_sent',
  'quote_accepted',
  'job_scheduled',
  'job_completed',
  'invoice_issued',
  'invoice_paid',
  'review_request_sent',
  'review_submitted',
  'recurring_pause_requested',
  'recurring_resumed',
  'lead_form_submitted',
  'gbp_call_received',
  'gbp_direction_request',
  'organic_search_click',
  'paid_ad_click',
] as const;
```

Each event has an associated funnel tracked in PostHog:

- `Lead → Quote → Job → Invoice → Paid` (revenue funnel)
- `Visitor → Lead → Customer` (acquisition funnel)
- `Job Completed → Review Submitted` (advocacy funnel)

---

## Traces (distributed)

Trace propagation across:
- Web → Stripe webhook
- Web → Twilio outbound
- Inngest workflow → child jobs

Use W3C trace context. Axiom natively supports it.

---

## SLOs (Phase 8-9)

Define Service Level Objectives per service:

| Service | SLO | Target |
|---|---|---|
| web/api | P50 latency | <200ms |
| web/api | P99 latency | <1s |
| workflows | success rate | ≥99.5% |
| workflows | P99 duration | <60s |
| stripe-webhooks | delivery rate | ≥99.9% within 24h |

A service that violates its SLO triggers a Postmortem template entry within 7 days.

---

## Cost projection (Month 3 baseline)

| Tool | Free tier | Estimated at scale |
|---|---|---|
| Sentry | 5K events/mo free | $0-26/mo at solo-founder scale |
| Axiom | 500GB/mo free | $0-25/mo |
| PostHog | 1M events/mo free | $0-25/mo |
| **Total** | | **$0-75/mo** |

Within the $200/mo infra ceiling.

---

## What this directory is NOT

- Not the implementation. The client lives in `platform/packages/observability/` (Phase 4-5).
- Not the dashboard. Dashboards live in PostHog UI; reports exported to `analytics/monthly-scorecard.md`.

---

## Security + privacy

- PII (email, phone, address) is **never** sent to PostHog; pass user_id only.
- Errors redacted via `beforeSend` hooks in Sentry (PII, secrets, tokens).
- Logs in Axiom retained for 90 days; errors in Sentry for 90 days; product events in PostHog for 1 year.

---

## How to add a new event

1. Add the event name + schema to this file.
2. Add a Metric emission to the capability code.
3. Add the event to PostHog (if product analytics).
4. Add a test asserting the event fires when the capability executes.