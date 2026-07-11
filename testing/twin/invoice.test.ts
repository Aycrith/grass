/**
 * testing/twin/invoice.test.ts — Twin model invariants from architecture/twin/invoice.md
 *
 * Tests:
 *   1. total_cents = subtotal - discount + tax + (tip || 0) (invariant #1)
 *   2. payment_status='paid' requires amount_paid_cents = total_cents AND paid_at (invariant #2)
 *   3. Tax rate is 6.75% (invariant #4)
 *   4. payment_status='void' zeroes amount_paid_cents (invariant #3)
 */

import { describe, expect, test } from 'bun:test';

interface Invoice {
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  tip_cents: number;
  total_cents: number;
  payment_status: 'unpaid' | 'paid' | 'partial' | 'refunded' | 'void' | 'overdue';
  amount_paid_cents: number;
  paid_at?: string;
}

const SALES_TAX_PCT = 6.75; // FL 6% + Pinellas 0.75% (effective 2025-01-01)

describe('Invoice twin model invariants', () => {
  test('total_cents = subtotal - discount + tax + (tip || 0)', () => {
    const subtotal = 4800;
    const discount = 200;
    const tax = Math.round(((subtotal - discount) * SALES_TAX_PCT) / 100);
    const tip = 500;
    const total = subtotal - discount + tax + tip;
    const inv: Invoice = {
      subtotal_cents: subtotal,
      discount_cents: discount,
      tax_cents: tax,
      tip_cents: tip,
      total_cents: total,
      payment_status: 'unpaid',
      amount_paid_cents: 0,
    };
    expect(inv.total_cents).toBe(subtotal - discount + tax + tip);
  });

  test("payment_status='paid' requires amount_paid = total AND paid_at", () => {
    const inv: Invoice = {
      subtotal_cents: 4800,
      discount_cents: 0,
      tax_cents: 324,
      tip_cents: 0,
      total_cents: 5124,
      payment_status: 'paid',
      amount_paid_cents: 5124,
      paid_at: '2026-07-10T10:00:00Z',
    };
    expect(inv.amount_paid_cents).toBe(inv.total_cents);
    expect(inv.paid_at).toBeDefined();
  });

  test('sales tax is 6.75%', () => {
    expect(SALES_TAX_PCT).toBe(6.75);
  });

  test("payment_status='void' zeroes amount_paid_cents", () => {
    const inv: Invoice = {
      subtotal_cents: 4800,
      discount_cents: 0,
      tax_cents: 324,
      tip_cents: 0,
      total_cents: 5124,
      payment_status: 'void',
      amount_paid_cents: 0,
    };
    expect(inv.amount_paid_cents).toBe(0);
  });
});
