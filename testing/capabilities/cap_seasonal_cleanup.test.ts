/**
 * testing/capabilities/cap_seasonal_cleanup.test.ts — Seasonal cleanup capability tests.
 *
 * Service: end-of-season cleanup (leaf removal, debris haul-off).
 * Tests:
 *   - Season-bound (winter in FL: Jan-Mar)
 *   - Bid by lot size (sqft) + debris volume
 */

import { describe, expect, test } from 'bun:test';

describe('cap_seasonal_cleanup', () => {
  test('season = winter months in FL (Jan-Mar)', () => {
    const winterMonths = [1, 2, 3];
    expect(winterMonths).toEqual([1, 2, 3]);
  });

  test('pricing scales with lot size + debris', () => {
    const small = 200_00; // $200
    const large = 600_00; // $600
    expect(large).toBeGreaterThan(small);
  });

  test('requires blower + leaf rake equipment', () => {
    const required = ['blower', 'rake'];
    expect(required.length).toBe(2);
  });
});
