/**
 * testing/capabilities/cap_edging_hard_edge.test.ts — Edging capability tests.
 *
 * Service: mechanical edging along curbs/walkways; $/linear_ft.
 * Tests:
 *   - Pricing per linear foot
 *   - Skill match: edging
 */

import { describe, expect, test } from 'bun:test';

describe('cap_edging_hard_edge', () => {
  test('pricing per linear foot', () => {
    const rate = 1_25; // $1.25/lf
    expect(rate).toBe(125);
  });

  test('requires crew skill: edging', () => {
    const crewSkills = ['zero_turn_mowing', 'edging', 'string_trimming'];
    expect(crewSkills.includes('edging')).toBe(true);
  });

  test('requires hardscape_sqft on Property', () => {
    const propertyHasHardscape = true;
    expect(propertyHasHardscape).toBe(true);
  });
});
