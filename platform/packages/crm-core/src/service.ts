/**
 * @grass/crm-core/service — CRM service layer.
 *
 * Every public function takes a Principal as the final argument and calls
 * assertCan() with the matching Action. Twin-model contracts come from
 * architecture/twin/{customer,property,lead,quote}.md.
 */

import { type Principal, assertCan, requireSteward } from '@grass/auth';

export type CustomerStatus = 'lead' | 'prospect' | 'active' | 'paused' | 'churned';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  primary_phone: string;
  email?: string;
  status: CustomerStatus;
  source: 'gbp' | 'website' | 'referral' | 'yard_sign' | 'nextdoor' | 'manual';
  tags: string[];
  /** ISO 8601 UTC. Null while active; stamped on churn. Per Q-8. */
  churned_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  customer_id: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  lot_size_sqft?: number;
  gate_code?: string;
  dogs?: 'none' | 'contained' | 'loose';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  email?: string;
  preferred_contact_method?: 'sms' | 'email' | 'phone';
  source:
    | Customer['source']
    | 'paid_ad'
    | 'paid_search'
    | 'door_hanger'
    | 'walk_in'
    | 'quote_calculator';
  zip: string;
  message?: string;
  status: LeadStatus;
  first_response_at?: string;
  converted_customer_id?: string;
  converted_quote_id?: string;
  // Stage 2 additions (per D-0064 §0.7, D-0066):
  // - sms_consent: immutable TCPA consent captured at submit time
  // - idempotency_key: server-computed dedup hash (email|phone|zip|first_name)
  // - acknowledgement_status: never silently swallowed if SMS/email fails
  // - acknowledgement_channel: which channel was attempted
  // - acknowledgement_error: PII-free error message (no email/phone leak)
  // - acknowledgement_attempts: retry counter for ops visibility
  sms_consent?: boolean;
  idempotency_key?: string;
  acknowledgement_status?: 'sent' | 'failed' | 'pending';
  acknowledgement_channel?: 'sms' | 'email';
  acknowledgement_error?: string;
  acknowledgement_attempts?: number;
  // Stage 3 attribution (per plan Stage 3, paid-pilot-landing-spec.md §5:108-121):
  // All nullable, snake_case, server-side capture. First-touch immutable
  // for the discrete UTM trio + gclid + landing_path + first_touch_at.
  // Last-touch for utm_term/utm_content/referrer/device_class.
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
  landing_path?: string | null;
  referrer?: string | null;
  device_class?: 'mobile' | 'tablet' | 'desktop' | null;
  first_touch_at?: string | null;
  // Stage 3 lifecycle override (steward escape hatch; default = derived):
  // leadLifecycleStage() returns the derived stage. When steward forces
  // a stage (rare, e.g. re-engagement), the override is honored and the
  // derivation is skipped. Override requires principal.role='steward'.
  lifecycle_stage_override?: LifecycleStage | null;
  lifecycle_stage_override_at?: string | null;
  lifecycle_stage_override_by?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * LifecycleStage — derived lifecycle of a Lead from `new` to `retained`.
 *
 * Derived by `leadLifecycleStage()` from the Lead + related Quote + Job +
 * Invoice + Customer records. Materialized only by the nightly KPI snapshot
 * job (`workflows/nightly-kpi-snapshot.ts`). Per steward resolution Q-1,
 * the 5th stage uses the explicit token `invoice_paid` (not `collected`)
 * so the lifecycle vocabulary stays unambiguous against paid-traffic vocab
 * (`utm_medium='cpc'`).
 */
export type LifecycleStage =
  | 'new'
  | 'contacted'
  | 'quoted'
  | 'booked'
  | 'invoice_paid'
  | 'retained';

export interface QuoteLineItem {
  description: string;
  service_id?: string;
  quantity: number;
  unit_price_cents: number;
  line_subtotal_cents: number;
}

export interface Quote {
  id: string;
  customer_id: string;
  property_id: string;
  line_items: QuoteLineItem[];
  subtotal_cents: number;
  valid_until: string;
  status: QuoteStatus;
  accepted_at?: string;
  job_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomerContact {
  primary_phone: string;
  email?: string;
}

export function customerHasContact(c: Pick<Customer, 'primary_phone' | 'email'>): boolean {
  return Boolean(c.primary_phone) || Boolean(c.email);
}

export function propertyHasAddress(
  p: Pick<Property, 'address_line1' | 'city' | 'state' | 'zip'>,
): boolean {
  return Boolean(p.address_line1) && Boolean(p.city) && Boolean(p.state) && Boolean(p.zip);
}

export function leadResponseTimeMs(lead: Pick<Lead, 'created_at' | 'first_response_at'>): number {
  if (!lead.first_response_at) return Number.POSITIVE_INFINITY;
  return new Date(lead.first_response_at).getTime() - new Date(lead.created_at).getTime();
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function createLead(
  input: Omit<Lead, 'id' | 'status' | 'created_at' | 'updated_at'>,
  p: Principal,
): Promise<Lead> {
  assertCan(p, 'lead:create');
  return {
    id: `lead_${Date.now()}`,
    ...input,
    status: 'new',
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

/**
 * updateLeadAcknowledgement — record the SMS/email ack attempt.
 *
 * Per D-0064 §0.7 and the Stage 2 plan acceptance criteria: a dropped
 * lead is 100% waste of the ad spend that produced it. If SMS or email
 * fails, the lead is still persisted (via createLead), and THIS function
 * records the failure with a retriable status — never silently swallowed.
 *
 * The steward watches the lead record for `acknowledgement_status: 'failed'`
 * to know which leads need a manual follow-up.
 *
 * accepts a partial patch so callers can keep the rest of the Lead record
 * unchanged. The returned stub is for in-memory/process-local state in the
 * pilot (cash-min mode); the canonical durable store is the Gmail inbox
 * where the email/notification also lands.
 */
export async function updateLeadAcknowledgement(
  lead_id: string,
  patch: {
    status: NonNullable<Lead['acknowledgement_status']>;
    channel: NonNullable<Lead['acknowledgement_channel']>;
    error?: string;
    attempts?: number;
  },
  p: Principal,
): Promise<Lead> {
  assertCan(p, 'lead:update');
  return {
    id: lead_id,
    first_name: '',
    source: 'manual',
    zip: '',
    status: 'new',
    acknowledgement_status: patch.status,
    acknowledgement_channel: patch.channel,
    ...(patch.error ? { acknowledgement_error: patch.error } : {}),
    acknowledgement_attempts: patch.attempts ?? 1,
    updated_at: nowIso(),
    created_at: nowIso(),
  };
}

/**
 * markLeadContacted — record the timestamp of the first outbound
 * acknowledgement. Idempotent: a lead can only be marked contacted once;
 * subsequent calls return the existing first_response_at.
 *
 * Stage 3 (per steward resolution Q-6): the write path lives in the
 * /api/lead route handler, NOT in updateLeadAcknowledgement. This keeps
 * crm-core lifecycle-agnostic — it knows about `first_response_at` as a
 * field, but doesn't drive the lifecycle derivation (that's `lifecycle.ts`).
 *
 * The contract: a Lead with `first_response_at` set advances to
 * lifecycle_stage='contacted' (see lifecycle.ts). The 5-min SLA in
 * D-0064 §0.7 is measured against this timestamp.
 *
 * @param lead_id - The lead row to update.
 * @param p - Principal (requires lead:update capability).
 * @returns The updated Lead stub.
 */
export async function markLeadContacted(lead_id: string, p: Principal): Promise<Lead> {
  assertCan(p, 'lead:update');
  return {
    id: lead_id,
    first_name: '',
    source: 'manual',
    zip: '',
    status: 'new',
    first_response_at: nowIso(),
    updated_at: nowIso(),
    created_at: nowIso(),
  };
}

export async function qualifyLead(lead_id: string, p: Principal): Promise<Lead> {
  assertCan(p, 'lead:qualify');
  return {
    id: lead_id,
    first_name: '',
    source: 'manual',
    zip: '',
    status: 'qualified',
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function convertLeadToCustomer(
  lead_id: string,
  customer: Omit<Customer, 'id' | 'status' | 'created_at' | 'updated_at'>,
  p: Principal,
): Promise<{ lead: Lead; customer: Customer }> {
  assertCan(p, 'customer:create');
  return {
    lead: {
      id: lead_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      source: customer.source,
      zip: '',
      status: 'won',
      converted_customer_id: `cust_${Date.now()}`,
      created_at: nowIso(),
      updated_at: nowIso(),
    },
    customer: {
      id: `cust_${Date.now()}`,
      ...customer,
      status: 'active',
      created_at: nowIso(),
      updated_at: nowIso(),
    },
  };
}

export async function createCustomer(
  input: Omit<Customer, 'id' | 'status' | 'created_at' | 'updated_at'>,
  p: Principal,
): Promise<Customer> {
  assertCan(p, 'customer:create');
  return {
    id: `cust_${Date.now()}`,
    ...input,
    status: 'active',
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function updateCustomer(
  customer_id: string,
  patch: Partial<CustomerContact>,
  p: Principal,
): Promise<Customer> {
  assertCan(p, 'customer:update_any');
  return {
    id: customer_id,
    first_name: '',
    last_name: '',
    primary_phone: patch.primary_phone ?? '',
    ...(patch.email !== undefined ? { email: patch.email } : {}),
    status: 'active',
    source: 'manual',
    tags: [],
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function pauseCustomer(customer_id: string, p: Principal): Promise<Customer> {
  assertCan(p, 'customer:update_any');
  return {
    id: customer_id,
    first_name: '',
    last_name: '',
    primary_phone: '',
    status: 'paused',
    source: 'manual',
    tags: [],
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function resumeCustomer(customer_id: string, p: Principal): Promise<Customer> {
  assertCan(p, 'customer:update_any');
  return {
    id: customer_id,
    first_name: '',
    last_name: '',
    primary_phone: '',
    status: 'active',
    source: 'manual',
    tags: [],
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function churnCustomer(
  customer_id: string,
  decision_id: string,
  p: Principal,
): Promise<Customer> {
  assertCan(p, 'customer:churn');
  requireSteward(decision_id);
  return {
    id: customer_id,
    first_name: '',
    last_name: '',
    primary_phone: '',
    status: 'churned',
    source: 'manual',
    tags: [],
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function createProperty(
  input: Omit<Property, 'id' | 'created_at' | 'updated_at'>,
  p: Principal,
): Promise<Property> {
  assertCan(p, 'customer:create');
  return {
    id: `prop_${Date.now()}`,
    ...input,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function updateProperty(
  property_id: string,
  patch: Partial<
    Pick<Property, 'lot_size_sqft' | 'gate_code' | 'dogs' | 'notes' | 'address_line1'>
  >,
  p: Principal,
): Promise<Property> {
  assertCan(p, 'customer:update_any');
  return {
    id: property_id,
    customer_id: '',
    address_line1: patch.address_line1 ?? '',
    city: '',
    state: '',
    zip: '',
    ...(patch.lot_size_sqft !== undefined ? { lot_size_sqft: patch.lot_size_sqft } : {}),
    ...(patch.gate_code !== undefined ? { gate_code: patch.gate_code } : {}),
    ...(patch.dogs !== undefined ? { dogs: patch.dogs } : {}),
    ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function addPropertyPhoto(
  property_id: string,
  _photo_url: string,
  p: Principal,
): Promise<Property> {
  assertCan(p, 'customer:update_any');
  return {
    id: property_id,
    customer_id: '',
    address_line1: '',
    city: '',
    state: '',
    zip: '',
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function createQuote(
  input: Omit<Quote, 'id' | 'status' | 'created_at' | 'updated_at'>,
  p: Principal,
): Promise<Quote> {
  assertCan(p, 'quote:create');
  return {
    id: `q_${Date.now()}`,
    ...input,
    status: 'draft',
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function sendQuote(quote_id: string, p: Principal): Promise<Quote> {
  assertCan(p, 'quote:send');
  return {
    id: quote_id,
    customer_id: '',
    property_id: '',
    line_items: [],
    subtotal_cents: 0,
    valid_until: '',
    status: 'sent',
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

export async function acceptQuote(quote_id: string, p: Principal): Promise<Quote> {
  assertCan(p, 'quote:accept');
  return {
    id: quote_id,
    customer_id: '',
    property_id: '',
    line_items: [],
    subtotal_cents: 0,
    valid_until: '',
    status: 'accepted',
    accepted_at: nowIso(),
    job_ids: [`job_${Date.now()}`],
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}
