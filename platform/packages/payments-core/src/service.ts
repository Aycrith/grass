/**
 * @grass/payments-core/service — Phase 4-5 stubs.
 * Each function takes a Principal; permanent-writes require steward authority.
 */

import { type Principal, assertCan, requireSteward } from '@grass/auth';
import { computeTaxCents, computeTotalCents } from './tax.ts';
import type { Invoice, Payment } from './types.ts';

export async function createInvoice(
  input: {
    customer_id: string;
    property_id: string;
    job_ids: string[];
    subtotal_cents: number;
    discount_cents?: number;
    tip_cents?: number;
    line_items: Invoice['line_items'];
  },
  p: Principal,
): Promise<Invoice> {
  assertCan(p, 'invoice:issue');
  const discount = input.discount_cents ?? 0;
  const tip = input.tip_cents ?? 0;
  const { tax_cents, total_cents } = computeTotalCents(input.subtotal_cents, discount, tip);
  return {
    id: `inv_${Date.now()}`,
    number: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
    customer_id: input.customer_id,
    property_id: input.property_id,
    job_ids: input.job_ids,
    subtotal_cents: input.subtotal_cents,
    discount_cents: discount,
    tax_cents,
    tip_cents: tip,
    total_cents,
    line_items: input.line_items,
    payment_status: 'unpaid',
    amount_paid_cents: 0,
    issued_at: new Date().toISOString(),
    due_at: new Date(Date.now() + 14 * 86400_000).toISOString(),
    reminders_sent: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function sendInvoice(invoice_id: string, p: Principal): Promise<Invoice> {
  assertCan(p, 'invoice:issue');
  // 'sent' is a delivery state (sent_at set), payment_status remains 'unpaid' until Stripe webhook
  const inv = baseInvoice(invoice_id, 'unpaid');
  return { ...inv, sent_at: new Date().toISOString() };
}

export async function applyPayment(
  invoice_id: string,
  payment: Payment,
  p: Principal,
): Promise<Invoice> {
  assertCan(p, 'invoice:issue');
  const base = baseInvoice(invoice_id, 'paid');
  return {
    ...base,
    amount_paid_cents: payment.amount_cents,
    payment_method: payment.payment_method,
    ...(payment.stripe_payment_intent_id !== undefined
      ? { stripe_payment_intent_id: payment.stripe_payment_intent_id }
      : {}),
    paid_at: payment.paid_at,
  };
}

export async function refundInvoice(
  invoice_id: string,
  decision_id: string,
  p: Principal,
): Promise<Invoice> {
  assertCan(p, 'invoice:refund');
  requireSteward(decision_id); // charter: refunds > $0 require template
  return { ...baseInvoice(invoice_id, 'refunded'), amount_paid_cents: 0 };
}

export async function voidInvoice(invoice_id: string, p: Principal): Promise<Invoice> {
  assertCan(p, 'invoice:void');
  return { ...baseInvoice(invoice_id, 'void'), amount_paid_cents: 0 };
}

export async function runDunningSweep(
  _p: Principal,
): Promise<{ swept: number; suspended: number }> {
  // Phase 4-5: scan invoices, dispatch SMS+email per cadence, escalate overdue
  return { swept: 0, suspended: 0 };
}

function baseInvoice(id: string, status: Invoice['payment_status']): Invoice {
  return {
    id,
    number: '',
    customer_id: '',
    property_id: '',
    job_ids: [],
    subtotal_cents: 0,
    discount_cents: 0,
    tax_cents: computeTaxCents(0),
    total_cents: 0,
    line_items: [],
    payment_status: status,
    amount_paid_cents: 0,
    issued_at: new Date().toISOString(),
    due_at: new Date(Date.now() + 14 * 86400_000).toISOString(),
    reminders_sent: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
