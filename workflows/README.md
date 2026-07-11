# GRASS Workflows — Orchestrator Inventory

> **Purpose.** Define every recurring automated workflow the org runs.
> Each workflow is triggered by an event (cron, webhook, capability-completion), runs an
> Inngest function (or fallback: Vercel Cron + QStash), and writes an `Activity` record.
>
> **Owner agent.** infrastructure.
> **Charter principle:** "Automation before repetition. If a workflow is repeated, it gets a script in `scripts/`."

---

## Conventions

| Concept | Spec |
|---|---|
| Event source | Inngest event OR Vercel Cron OR Stripe webhook OR GBP webhook |
| Idempotency | Every workflow has a stable `workflow_id` and rejects duplicate runs |
| Activity log | Append to `state/activity-log.yaml` (Phase 2 deliverable) |
| Failure | Auto-retry × 3 with exponential backoff; on persistent failure → charter-compliance warning |
| Approvals | Workflows that touch irreversible state (e.g., entity changes) require steward approval |
| Cost ceiling | Each workflow reports estimated cost to avoid surprise infra spend |

---

## Workflow Inventory

### 1. `wf_nightly_kpi_snapshot` — Daily 02:00 ET
**Trigger.** Cron `0 2 * * *` ET.
**Purpose.** Snapshot every KPI from `analytics/kpi-taxonomy.md` into `state/kpi-snapshots/YYYY-MM-DD.yaml`.
**Reads.** All twin models + Stripe + GSC + GBP call tracking.
**Writes.** `KPISnapshot[]` per the KPI twin model.
**Cost.** $0 (reads only).
**Owner.** executive (definition), infrastructure (run).

### 2. `wf_weekly_schedule_build` — Sunday 20:00 ET
**Trigger.** Cron `0 20 * * 0` ET.
**Purpose.** Build next-week `Schedule` records for all crews based on cadence + new quotes.
**Reads.** Customer, Property, Job (cadence), Quote (pending), Crew capacity.
**Writes.** Schedule records for next 7 days.
**Cost.** Mapbox Optimization v2 calls (~$0.05/day).
**Owner.** operations.

### 3. `wf_invoice_dunning` — Daily 08:00 ET
**Trigger.** Cron `0 8 * * *` ET.
**Purpose.** Apply dunning cadence per Invoice model: day 14 SMS, 21 email, 30 phone call queue, 45 service suspension.
**Reads.** Invoice (payment_status, issued_at).
**Writes.** Stripe email send, Twilio SMS send, Sales agent task assignment.
**Cost.** Twilio $0.0079/SMS, Resend $0.0004/email → ~$5/mo at solo founder scale.
**Owner.** finance.

### 4. `wf_hurricane_mode_check` — Every 30 min during Jun-Nov
**Trigger.** Cron `*/30 * * 6-11 *` ET.
**Purpose.** Check NOAA NHC for active storms in Pinellas County; if sustained winds forecast ≥30mph within 48h → trigger `cap_hurricane_mode`.
**Reads.** NOAA public API.
**Writes.** Hurricane mode state, Customer notifications, Schedule cancellation cascade.
**Cost.** $0 (public API).
**Owner.** operations.

### 5. `wf_lead_response_sla` — Every 5 min during business hours
**Trigger.** Cron `*/5 8-18 * * *` ET.
**Purpose.** Alert sales agent if any new Lead has `first_response_at` null and `created_at` >5min ago.
**Reads.** Lead.
**Writes.** Sales agent Slack/Twilio alert.
**Cost.** $0.
**Owner.** sales.

### 6. `wf_review_request` — Daily 17:00 ET
**Trigger.** Cron `0 17 * * *` ET.
**Purpose.** For each completed Job where no review requested yet, send Twilio SMS asking for Google review.
**Reads.** Job (completed_at, review_requested_at).
**Writes.** Twilio SMS, Job.review_requested_at.
**Cost.** $0.0079/SMS → ~$2-5/mo.
**Owner.** marketing.

### 7. `wf_recurring_invoice` — Every Monday 06:00 ET
**Trigger.** Cron `0 6 * * 1` ET.
**Purpose.** Generate this-week's invoices for recurring customers (weekly/biweekly cadence).
**Reads.** Job (status='completed'), Customer.cadence.
**Writes.** Invoice records.
**Cost.** $0.
**Owner.** finance.

### 8. `wf_charter_compliance_check` — Daily 06:00 ET
**Trigger.** Cron `0 6 * * *` ET.
**Purpose.** Run `bun run test:charter` and on failure, open GitHub issue auto-tagged `charter-violation`.
**Reads.** state/ledger.yaml, agents/, capability-registry.yaml.
**Writes.** GitHub issue via `gh` CLI.
**Cost.** $0.
**Owner.** knowledge.

### 9. `wf_weekly_postmortem_reminder` — Friday 16:00 ET
**Trigger.** Cron `0 16 * * 5` ET.
**Purpose.** Nudge steward + each agent owner to file weekly postmortem in `knowledge/postmortems/`.
**Reads.** Last postmortem date per agent.
**Writes.** Slack/email reminder.
**Cost.** $0.
**Owner.** knowledge.

### 10. `wf_equipment_maintenance_due` — Daily 06:00 ET
**Trigger.** Cron `0 6 * * *` ET.
**Purpose.** For each Equipment with overdue maintenance, alert operations agent.
**Reads.** Equipment (next_due_at).
**Writes.** Operations agent task + (if >14d overdue) charter-compliance warning.
**Cost.** $0.
**Owner.** operations.

---

## Implementation skeleton (Phase 4-5)

When Inngest is wired (Month 3), each workflow becomes:

```typescript
// workflows/wf_nightly_kpi_snapshot.ts
import { inngest } from '@/platform/inngest';

export const nightlyKpiSnapshot = inngest.createFunction(
  { id: 'wf_nightly_kpi_snapshot', name: 'Nightly KPI snapshot' },
  { cron: '0 2 * * *' },
  async ({ step }) => {
    const kpis = await step.run('fetch-kpis', () => computeAllKpis());
    await step.run('write-snapshots', () => writeKpiSnapshots(kpis));
    await step.run('post-scorecard', () => notifyStakeholders(kpis));
  },
);
```

Until Inngest is wired, **Vercel Cron + QStash** is the fallback per the lean-stack rule.

---

## What this directory is NOT

- Not for one-off scripts (those go in `scripts/`).
- Not for long-running services (those are Next.js API routes or workers).
- Not for agent prompts (those go in `prompts/`).

If a workflow triggers from a human action, it's a UI button in `apps/web/*`, not a workflow.

---

## How to add a new workflow

1. Author an entry here with the spec above (no exceptions; this is the registry).
2. Add `cap_*` if it executes a defined capability.
3. Add Decision Template entry if it touches irreversible state.
4. Add a test in `testing/workflows/<name>.test.ts`.
5. Add observability in `observability/traces.yaml`.