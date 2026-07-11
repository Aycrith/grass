/**
 * @grass/payments-core/tax — Sales tax calculation.
 *
 * Florida state 6% + Pinellas County 0.75% surtax (effective 2025-01-01) = 6.75%.
 * Locked per CLAUDE.md tech stack table; change requires Decision Template.
 */

export const FL_PINELLAS_SALES_TAX_PCT = 6.75;

export function computeTaxCents(subtotal_cents: number, discount_cents = 0): number {
  if (subtotal_cents < 0) throw new Error('subtotal_cents must be ≥ 0');
  if (discount_cents < 0) throw new Error('discount_cents must be ≥ 0');
  const taxable = Math.max(0, subtotal_cents - discount_cents);
  // Round to nearest cent.
  return Math.round((taxable * FL_PINELLAS_SALES_TAX_PCT) / 100);
}

export function computeTotalCents(
  subtotal_cents: number,
  discount_cents: number,
  tip_cents = 0,
): { tax_cents: number; total_cents: number } {
  const tax_cents = computeTaxCents(subtotal_cents, discount_cents);
  const total_cents = subtotal_cents - discount_cents + tax_cents + tip_cents;
  return { tax_cents, total_cents };
}
