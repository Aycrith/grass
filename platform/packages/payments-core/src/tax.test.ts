/**
 * tax.test.ts — Sales tax lock + rounding to nearest cent.
 */

import { describe, expect, test } from 'bun:test';
import { FL_PINELLAS_SALES_TAX_PCT, computeTaxCents, computeTotalCents } from './tax.ts';
import {
  invariantPaidImpliesPaidAt,
  invariantTotalMatchesParts,
  invariantVoidImpliesZeroPaid,
} from './types.ts';

describe('@grass/payments-core — tax lock', () => {
  test('FL+Pinellas combined = 6.75%', () => {
    expect(FL_PINELLAS_SALES_TAX_PCT).toBe(6.75);
  });

  test('computeTaxCents: $100 subtotal = $6.75 tax', () => {
    expect(computeTaxCents(10_000)).toBe(675);
  });

  test('computeTaxCents: tax on (subtotal - discount)', () => {
    // $50 with $10 discount → taxable = $40 → 6.75% → $2.70
    expect(computeTaxCents(5_000, 1_000)).toBe(270);
  });

  test('computeTaxCents: rounds to nearest cent', () => {
    // $1.97 subtotal → 1.97 * 0.0675 = 0.132975 → rounds to 13 cents
    expect(computeTaxCents(197)).toBe(13);
  });

  test('computeTaxCents: rejects negative', () => {
    expect(() => computeTaxCents(-100)).toThrow();
  });

  test('computeTotalCents: subtotal - discount + tax + tip', () => {
    const r = computeTotalCents(5_000, 1_000, 200); // $50 - $10 disc, $2 tip
    expect(r.tax_cents).toBe(270);
    expect(r.total_cents).toBe(5000 - 1000 + 270 + 200);
  });
});

describe('@grass/payments-core — invariants', () => {
  test('total = subtotal - discount + tax + tip', () => {
    expect(
      invariantTotalMatchesParts({
        subtotal_cents: 5000,
        discount_cents: 1000,
        tax_cents: 270,
        tip_cents: 200,
        total_cents: 5000 - 1000 + 270 + 200,
      }),
    ).toBe(true);
  });

  test('paid implies amount_paid = total AND paid_at set', () => {
    expect(
      invariantPaidImpliesPaidAt({
        payment_status: 'paid',
        amount_paid_cents: 4500,
        paid_at: '2026-07-10T10:00:00Z',
        total_cents: 4500,
      }),
    ).toBe(true);
    expect(
      invariantPaidImpliesPaidAt({
        payment_status: 'paid',
        amount_paid_cents: 1000,
        total_cents: 4500,
      } as Parameters<typeof invariantPaidImpliesPaidAt>[0]),
    ).toBe(false);
  });

  test('void implies amount_paid = 0', () => {
    expect(invariantVoidImpliesZeroPaid({ payment_status: 'void', amount_paid_cents: 0 })).toBe(
      true,
    );
    expect(invariantVoidImpliesZeroPaid({ payment_status: 'void', amount_paid_cents: 100 })).toBe(
      false,
    );
  });
});
