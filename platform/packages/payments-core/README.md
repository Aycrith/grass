# `@grass/payments-core` — Stripe + Invoice + dunning

> **Phase:** draft (Phase 4-5 wire to Stripe via webhook).
> **Owner agent:** finance.
> **Twin models read/written:** `invoice`.

## Sales tax (locked)

Florida state 6% + Pinellas 0.75% surtax (effective 2025-01-01) = **6.75%** total.

## Public API

```typescript
export function computeTaxCents(subtotal_cents: number, discount_cents = 0): number;
export async function createInvoice(input: InvoiceInput, p: Principal): Promise<Invoice>;
export async function sendInvoice(invoice_id: string, p: Principal): Promise<Invoice>;
export async function applyPayment(invoice_id: string, payment: Payment, p: Principal): Promise<Invoice>;
export async function refundInvoice(invoice_id: string, decision_id: string, p: Principal): Promise<Invoice>;
export async function voidInvoice(invoice_id: string, p: Principal): Promise<Invoice>;
export async function runDunningSweep(p: Principal): Promise<{ swept: number; suspended: number }>;
```

## Auto-dunning cadence (per architecture/twin/invoice.md)

| Day post-issuance | Action |
|---|---|
| 0 | Stripe email + Resend backup |
| 14 | Twilio SMS (1st reminder) |
| 21 | Resend email (2nd) |
| 30 | Phone-call task assigned to sales agent |
| 45 | Service suspension + steward escalation |

## Decision-template requirements

| Function | decision_id required? |
|---|---|
| `createInvoice` | no |
| `sendInvoice` | no |
| `applyPayment` | no |
| `refundInvoice` | yes (steward approval) |
| `voidInvoice` | only if total > $500 |

## Tests

- `tax.test.ts` — tax math, fixed amount, rounding
- `service.test.ts` — invariants: total_cents = subtotal - discount + tax + tip
- `dunning.test.ts` — cadence schedule, escalation paths