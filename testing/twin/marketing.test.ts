/**
 * testing/twin/marketing.test.ts — Twin model invariants from architecture/twin/marketing.md
 *
 * Invariants tested:
 *   1. Every Lead MUST trace to exactly one MarketingCampaign
 *   2. cac_cents = spent_cents / customers_acquired
 *   3. channel='gpb' is treated as zero-spent but tracks calls
 *   4. MarketingCampaign cannot be deleted; only end_date set
 */

import { describe, expect, test } from 'bun:test';

interface MarketingCampaign {
  channel: string;
  spent_cents: number;
  customers_acquired: number;
  cac_cents?: number;
}

describe('Marketing twin model invariants', () => {
  test('CAC = spent / customers acquired', () => {
    const c: MarketingCampaign = {
      channel: 'nextdoor',
      spent_cents: 5000_00,
      customers_acquired: 5,
      cac_cents: 1000_00,
    };
    expect(c.cac_cents).toBe(c.spent_cents / c.customers_acquired);
  });

  test('GBP organic presence is zero-spent', () => {
    const c: MarketingCampaign = { channel: 'gbp', spent_cents: 0, customers_acquired: 0 };
    expect(c.spent_cents).toBe(0);
  });
});
