/**
 * @grass/payments-core/types — Invoice twin-model contract.
 */

export type PaymentStatus = 'unpaid' | 'paid' | 'partial' | 'refunded' | 'void' | 'overdue';

export interface InvoiceLineItem {
  description: string;
  service_id?: string;
  job_id?: string;
  quantity: number;
  unit_price_cents: number;
  line_subtotal_cents: number;
  discount_cents?: number;
  tax_cents: number;
  line_total_cents: number;
  cogs_cents: number;
}

export interface Invoice {
  id: string;
  number: string;
  customer_id: string;
  property_id: string;
  job_ids: string[];
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  tip_cents?: number;
  total_cents: number;
  line_items: InvoiceLineItem[];
  payment_status: PaymentStatus;
  amount_paid_cents: number;
  payment_method?: 'card' | 'ach' | 'check' | 'cash';
  stripe_payment_intent_id?: string;
  paid_at?: string;
  issued_at: string;
  due_at: string;
  sent_at?: string;
  reminders_sent: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  payment_method: 'card' | 'ach' | 'check' | 'cash';
  amount_cents: number;
  stripe_payment_intent_id?: string;
  paid_at: string;
}

export function invariantTotalMatchesParts(
  inv: Pick<
    Invoice,
    'subtotal_cents' | 'discount_cents' | 'tax_cents' | 'tip_cents' | 'total_cents'
  >,
): boolean {
  const tip = inv.tip_cents ?? 0;
  return inv.total_cents === inv.subtotal_cents - inv.discount_cents + inv.tax_cents + tip;
}

export function invariantPaidImpliesPaidAt(
  inv: Pick<Invoice, 'payment_status' | 'amount_paid_cents' | 'paid_at' | 'total_cents'>,
): boolean {
  if (inv.payment_status !== 'paid') return true;
  return inv.amount_paid_cents === inv.total_cents && Boolean(inv.paid_at);
}

export function invariantVoidImpliesZeroPaid(
  inv: Pick<Invoice, 'payment_status' | 'amount_paid_cents'>,
): boolean {
  if (inv.payment_status !== 'void') return true;
  return inv.amount_paid_cents === 0;
}
