/**
 * @grass/crm-core/lead-events — append-only audit log for Lead lifecycle.
 *
 * Stage 3 (per plan `review-the-plans-recently-lucky-catmull.md`):
 * every state transition on a Lead gets a row appended here, so the
 * lifecycle is reconstructable from the audit trail alone — even if
 * the derived `lifecycle_stage` (see lifecycle.ts) drifts out of sync.
 *
 * The table is APPEND-ONLY. There is no update or delete operation
 * exposed. This is the same pattern used in audit-log tables in
 * financial systems: the row is the fact, full stop.
 *
 * In the pilot (cash-min mode) the canonical durable store is the
 * Gmail inbox + the steward-spreadsheet. This module defines the
 * schema + append helper so the route handlers can call
 * `appendLeadEvent()` once a real DB lands. The append helper is
 * currently a no-op stub that returns a synthetic event_id — wire
 * to the real table when the persistence layer is ready.
 *
 * Schema reference: `architecture/twin/lead-event.md` (future twin
 * model — not yet implemented).
 */

import type { LifecycleStage } from './service.ts';

/**
 * Lifecycle event types. New event types require a row in the
 * `lead_events` audit table PLUS the corresponding `leadLifecycleStage()`
 * derivation rule to be updated in lockstep. Adding an event type
 * is a Decision Template event per `analytics/kpi-taxonomy.md:115-122`.
 */
export type LeadEventType =
  | 'lead_captured'
  | 'lead_contacted'
  | 'quote_sent'
  | 'quote_accepted'
  | 'job_scheduled'
  | 'invoice_paid'
  | 'customer_retained'
  | 'lifecycle_overridden'
  | 'attribution_recorded';

/**
 * A single row in the lead_events audit table. Append-only.
 */
export interface LeadEvent {
  /** Unique event ID, server-generated. */
  event_id: string;
  /** Lead this event belongs to. */
  lead_id: string;
  /** Event type (see LeadEventType). */
  event_type: LeadEventType;
  /** Previous lifecycle stage (null for the first event on a lead). */
  from_stage: LifecycleStage | null;
  /** New lifecycle stage after this event. */
  to_stage: LifecycleStage;
  /** ID of the principal that triggered the event. May be a system
   *  workflow ID for automated events. Never PII. */
  actor_id: string;
  /** ISO 8601 UTC timestamp. Server-stamped, never client-stamped. */
  occurred_at: string;
  /** Optional metadata (e.g. quote_id, invoice_id, gclid). */
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Input for `appendLeadEvent()`. The caller passes everything except
 * `event_id` (server-generated) and `occurred_at` (server-stamped).
 */
export interface AppendLeadEventInput {
  lead_id: string;
  event_type: LeadEventType;
  from_stage: LifecycleStage | null;
  to_stage: LifecycleStage;
  actor_id: string;
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Append a LeadEvent to the audit log.
 *
 * Stage 3 implementation: stub. Returns a synthetic LeadEvent with
 * a server-generated event_id and a server-stamped occurred_at.
 * The row is NOT persisted to a real table yet — that's deferred to
 * the persistence-layer implementation (likely `platform/packages/database`).
 *
 * When the real implementation lands, this function will:
 *   1. Open the lead_events table (idempotent migration).
 *   2. INSERT the row with the given fields.
 *   3. Return the inserted row (with server-side event_id and
 *      occurred_at, not the client-stamped ones).
 *
 * Per plan §Acceptance Criteria, appendLeadEvent() MUST be called
 * from every state transition: lead capture, contact, quote sent,
 * quote accepted, job scheduled, invoice paid, customer retained,
 * lifecycle override. The route handler in /api/lead calls this
 * with `event_type: 'lead_captured'` after the Lead row is persisted.
 */
export async function appendLeadEvent(input: AppendLeadEventInput): Promise<LeadEvent> {
  const event_id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const occurred_at = new Date().toISOString();
  const event: LeadEvent = {
    event_id,
    lead_id: input.lead_id,
    event_type: input.event_type,
    from_stage: input.from_stage,
    to_stage: input.to_stage,
    actor_id: input.actor_id,
    occurred_at,
    ...(input.metadata ? { metadata: input.metadata } : {}),
  };
  // TODO(persistence): INSERT into lead_events table when the
  // @grass/database package ships. Until then, the event is logged
  // but not durably stored.
  return event;
}