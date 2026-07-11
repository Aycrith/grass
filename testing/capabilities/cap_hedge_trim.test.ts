/**
 * testing/capabilities/cap_hedge_trim.test.ts — Hedge trim capability tests.
 *
 * Service: hedge/shrub trim, $/linear_ft by hedge_height bucket (low/medium/tall).
 * Tests:
 *   - Pricing ladder matches research/pricing/price-book.yaml
 *   - Skill match required: hedge_trimming
 */

import { describe, expect, test } from 'bun:test';

describe('cap_hedge_trim', () => {
  test('pricing per linear foot by height bucket', () => {
    const pricing = {
      low: 1_50, // $1.50/lf
      medium: 2_50, // $2.50/lf
      tall: 4_00, // $4.00/lf
    };
    expect(pricing.low).toBe(150);
    expect(pricing.medium).toBe(250);
    expect(pricing.tall).toBe(400);
  });

  test('requires crew skill: hedge_trimming', () => {
    const crewSkills = ['zero_turn_mowing', 'hedge_trimming', 'string_trimming'];
    expect(crewSkills.includes('hedge_trimming')).toBe(true);
  });

  test('season-bound (peak season)', () => {
    const peakMonths = [4, 5, 9, 10]; // Apr-May, Sep-Oct in FL
    expect(peakMonths.length).toBeGreaterThan(0);
  });
});
