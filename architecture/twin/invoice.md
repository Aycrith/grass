# Digital Twin — Invoice

> **Definition.** An `Invoice` is the financial record of one or more `Job`s for a `Customer`. Includes line items, tax, payments.
>
> **Owner agent.** finance.
>
> **Cross-ref.** Job, Customer, Property, PaymentRecord.

---

## Schema

```typescript
interface Invoice {
  id: string;                     // UUID
  number: string;                 // Human-readable: 'INV-2026-0042'
  // Identity
  customer_id: string;
  property_id: string;
  job_ids: string[];
  // Financial
  subtotal_cents: number;
  discount_cents: number;         // sum of applied discounts
  tax_cents: number;              // subtotal × 6.75% (FL+Pinellas)
  tip_cents?: number;
  total_cents: number;
  // Line items
  line_items: InvoiceLineItem[];
  // Payment
  payment_status: 'unpaid' | 'paid' | 'partial' | 'refunded' | 'void' | 'overdue';
  amount_paid_cents: number;
  payment_method?: 'card' | 'ach' | 'check' | 'cash';
  stripe_payment_intent_id?: string;
  paid_at?: string;
  // Lifecycle
  issued_at: string;
  due_at: string;                 // typically +14 days
  sent_at?: string;
  reminders_sent: number;
  // Audit
  created_at: string;
  updated_at: string;
}

interface InvoiceLineItem {
  description: string;
  service_id?: string;
  job_id?: string;
  quantity: number;
  unit_price_cents: number;
  line_subtotal_cents: number;
  discount_cents?: number;
  tax_cents: number;
  line_total_cents: number;
  cogs_cents: number;             // for margin tracking
}
```

## Invariants

1. `total_cents = subtotal_cents - discount_cents + tax_cents + (tip_cents || 0)`.
2. `payment_status='paid'` requires `amount_paid_cents = total_cents` AND `paid_at` set.
3. `payment_status='void'` zeroes `amount_paid_cents`.
4. Tax calculation uses the locked rate: FL 6% + Pinellas 0.75% = 6.75% (effective 2025-01-01).
5. Every line item MUST have either `service_id` (catalog service) or `job_id` (custom work).
6. Number sequence is monotonic and gapless (audit-friendly).

## Auto-dunning cadence

| Day post-issuance | Action |
|---|---|
| 0 | Invoice issued, sent via Stripe email + Resend backup |
| 14 | First reminder via SMS (Twilio) |
| 21 | Second reminder via email |
| 30 | Third reminder + phone call queued for sales agent |
| 45 | Service suspension notice + steward escalation |

If `payment_status='overdue'` for >45 days, route to finance agent for collection decision.

## State transitions

```text
draft → issued (after job completion + photo + review)
issued → paid
issued → overdue
issued → partial (customer paid some)
overdue → partial
partial → paid
* → refunded (full or partial)
* → void (cancelled job before issue, error correction)
```

## Cross-references

- **Reads:** Job (what was done), Customer (contact), Service (pricing), Coupon (discounts)
- **Writes:** PaymentRecord, finance reports
- **KPIs derived:** Days-sales-outstanding, gross margin, COGS ratio