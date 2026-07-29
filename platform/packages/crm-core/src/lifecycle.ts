/**
 * @grass/crm-core/lifecycle — lead lifecycle derivation.
 *
 * Stage 3 (per plan `review-the-plans-recently-lucky-catmull.md`):
 * lifecycle stages live as a *derived* value, not as a stored enum on
 * Lead. This keeps `LeadStatus` (the 6-value operational state machine
 * at `service.ts:12`) stable — extending it would change the
 * `Lead contacted+` KPI denominator in `analytics/kpi-taxonomy.md:31-32`,
 * which is a Decision Template event per `kpi-taxonomy.md:115-122`.
 *
 * The derivation is a pure function so it's trivially testable and the
 * nightly `workflows/nightly-kpi-snapshot.ts` job can materialize it into
 * `KPISnapshot.actual_*` without coupling the crm-core to any scheduler.
 *
 * Per steward resolution Q-1: the 5th stage uses the explicit token
 * `invoice_paid` (not `collected`) so the lifecycle vocabulary stays
 * unambiguous against paid-traffic vocab (`utm_medium='cpc'`).
 *
 * Stage order (advances forward, never backward without steward override):
 *   new          — no outbound contact yet
 *   contacted    — first outbound acknowledgement sent (first_response_at set)
 *   quoted       — at least one Quote sent to the lead
 *   booked       — at least one Job scheduled/en-route/on-site/in-progress/completed
 *   invoice_paid — at least one Invoice paid
 *   retained     — Customer status='active' AND no churn event AND recurring cadence
 *
 * Steward override: if `lead.lifecycle_stage_override` is non-null, it wins.
 * Override write requires `principal.role === 'steward'` (gated at the
 * setter in `service.ts`). The override trio is `(override, override_at,
 * override_by)` so the audit trail is on the row itself.
 */

import type {
  Customer,
  CustomerStatus,
  Lead,
  LifecycleStage,
  Quote,
  QuoteStatus,
} from './service.ts';

/**
 * Minimal Job input — Job type doesn't exist in crm-core yet (it lives in
 * `architecture/twin/job.md` as a future twin model). When the Job type
 * lands, swap this for `Pick<Job, 'status' | 'scheduled_at'>`.
 */
export interface LifecycleJob {
  status: string;
  scheduled_at?: string;
}

/**
 * Minimal Invoice input — same as Job: future twin model. When Invoice
 * type lands, swap this for `Pick<Invoice, 'status' | 'paid_at'>`.
 */
export interface LifecycleInvoice {
  status: string;
  paid_at?: string;
}

export interface LifecycleInputs {
  lead: Pick<
    Lead,
    | 'lifecycle_stage_override'
    | 'created_at'
    | 'converted_customer_id'
    | 'converted_quote_id'
    | 'first_response_at'
  >;
  /** Most recent Quote for this lead (or null if none yet). */
  quote?: Pick<Quote, 'status' | 'accepted_at'> | null;
  /** Most recent Job linked via Quote.job_ids (or null if none yet). */
  job?: LifecycleJob | null;
  /** Most recent Invoice for the converted customer (or null if none yet). */
  invoice?: LifecycleInvoice | null;
  /** Customer record (only present after `convertLeadToCustomer`). */
  customer?: Pick<Customer, 'status' | 'churned_at'> | null;
}

/**
 * Job statuses that count as "booked" for lifecycle purposes. Mirrors
 * the canonical conversion definition in the Stage 3 acceptance test:
 * a Job is booked when it's scheduled or further along in the field
 * workflow. Drafts and cancelled jobs do NOT advance the lifecycle.
 */
const BOOKED_JOB_STATUSES: ReadonlySet<string> = new Set([
  'scheduled',
  'en_route',
  'on_site',
  'in_progress',
  'completed',
]);

/**
 * Quote statuses that count as "quoted" for lifecycle purposes. Drafts
 * don't count (they're internal), but `sent` and `accepted` do.
 */
const QUOTED_STATUSES: ReadonlySet<QuoteStatus> = new Set(['sent', 'accepted']);

/**
 * CustomerStatus values that count as "retained" — active AND not churned.
 * `paused` and `churned` do NOT advance to retained.
 */
const RETAINED_STATUSES: ReadonlySet<CustomerStatus> = new Set(['active', 'prospect']);

/**
 * Derive the current LifecycleStage from the Lead + related records.
 *
 * Forward-only: once a stage is reached, the derivation never walks it
 * backward. This is intentional — a Lead that reached `booked` and then
 * the customer churned is still `invoice_paid` (or `booked` if no
 * invoice yet). Churn detection is a separate metric on Customer.
 *
 * @param inputs - Lead + (optional) related Quote, Job, Invoice, Customer.
 * @returns The current LifecycleStage.
 */
export function leadLifecycleStage(inputs: LifecycleInputs): LifecycleStage {
  // 1. Steward override wins. If override is set, skip derivation entirely.
  //    The override trio is itself the audit trail (override + _at + _by).
  if (inputs.lead.lifecycle_stage_override) {
    return inputs.lead.lifecycle_stage_override;
  }

  // 2. Retained: Customer is active/prospect AND not churned.
  if (
    inputs.customer &&
    RETAINED_STATUSES.has(inputs.customer.status) &&
    !inputs.customer.churned_at
  ) {
    return 'retained';
  }

  // 3. Invoice paid: at least one Invoice has paid_at.
  if (inputs.invoice?.paid_at) {
    return 'invoice_paid';
  }

  // 4. Booked: at least one Job is in a scheduled-or-later status.
  if (inputs.job && BOOKED_JOB_STATUSES.has(inputs.job.status)) {
    return 'booked';
  }

  // 5. Quoted: at least one Quote has been sent or accepted.
  if (inputs.quote && QUOTED_STATUSES.has(inputs.quote.status)) {
    return 'quoted';
  }

  // 6. Contacted: first outbound acknowledgement has been recorded.
  if (inputs.lead.first_response_at) {
    return 'contacted';
  }

  // 7. Default: brand-new lead with no outbound contact yet.
  return 'new';
}

/**
 * Set a steward lifecycle override. Pure helper; the caller is
 * responsible for authorization (`requireSteward(decision_id)`) and
 * persistence (`updateLead` with the override trio).
 *
 * @param stage - Stage to force.
 * @param steward_id - ID of the steward authorizing the override.
 * @returns The new override trio to write back to Lead.
 */
export function setLifecycleOverride(
  stage: LifecycleStage,
  steward_id: string,
): Pick<
  Lead,
  'lifecycle_stage_override' | 'lifecycle_stage_override_at' | 'lifecycle_stage_override_by'
> {
  return {
    lifecycle_stage_override: stage,
    lifecycle_stage_override_at: new Date().toISOString(),
    lifecycle_stage_override_by: steward_id,
  };
}
