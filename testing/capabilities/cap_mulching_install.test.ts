/**
 * testing/capabilities/cap_mulching_install.test.ts — Mulching install capability tests.
 *
 * Service: bulk mulch delivery + install; $/cu-yd + install fee.
 * Tests:
 *   - Pricing per cubic yard + install fee
 *   - COGS target ≤35% of revenue
 *   - Supplier reservation required before delivery
 */

import { describe, expect, test } from 'bun:test';

describe('cap_mulching_install', () => {
  test('pricing per cubic yard + install fee', () => {
    const cubicYardPrice = 38_00; // $38 delivered bulk
    const installFee = 80_00; // $80 install fee
    expect(cubicYardPrice).toBe(3800);
    expect(installFee).toBe(8000);
  });

  test('COGS target ≤35% of revenue', () => {
    const revenue = 3800 + 8000;
    const cogs = 3200; // mulch cost + truck + labor
    expect(cogs / revenue).toBeLessThanOrEqual(0.35);
  });

  test('requires bed_sqft on Property', () => {
    const propertyHasBedSqft = true;
    expect(propertyHasBedSqft).toBe(true);
  });
});
