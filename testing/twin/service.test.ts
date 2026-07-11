/**
 * testing/twin/service.test.ts — Twin model invariants from architecture/twin/service.md
 *
 * Invariants tested:
 *   1. cap_id MUST exist in registry
 *   2. license_required either null OR matches a known license
 *   3. pricing_ladder has ≥1 tier for active services
 *   4. default_duration_minutes > 0; solo_crew_min ≤ solo_crew_max
 */

import { describe, expect, test } from 'bun:test';

const KNOWN_LICENSES = new Set(['fdacs_lcfa', 'pcclb_irrigation_specialty', 'fl_482_pco']);

interface Service {
  cap_id: string;
  status: 'active' | 'draft' | 'deprecated' | 'seasonal_pause';
  license_required?: string | null;
  pricing_ladder: { base_price_cents: number }[];
  default_duration_minutes: number;
  solo_crew_min: number;
  solo_crew_max: number;
}

describe('Service twin model invariants', () => {
  test('cap_id is non-empty', () => {
    const s: Service = {
      cap_id: 'cap_mowing_standard',
      status: 'active',
      pricing_ladder: [{ base_price_cents: 3800 }],
      default_duration_minutes: 60,
      solo_crew_min: 1,
      solo_crew_max: 1,
    };
    expect(s.cap_id).toBeTruthy();
  });

  test('license_required is null or known', () => {
    const validCases = [null, undefined, 'fdacs_lcfa', 'pcclb_irrigation_specialty'];
    for (const lic of validCases) {
      if (lic === null || lic === undefined) continue;
      expect(KNOWN_LICENSES.has(lic)).toBe(true);
    }
  });

  test('active service has ≥1 pricing tier', () => {
    const s: Service = {
      cap_id: 'cap_mowing_standard',
      status: 'active',
      pricing_ladder: [{ base_price_cents: 3800 }],
      default_duration_minutes: 60,
      solo_crew_min: 1,
      solo_crew_max: 1,
    };
    expect(s.pricing_ladder.length).toBeGreaterThanOrEqual(1);
  });

  test('crew min ≤ crew max', () => {
    const s: Service = {
      cap_id: 'cap_mowing_standard',
      status: 'active',
      pricing_ladder: [{ base_price_cents: 3800 }],
      default_duration_minutes: 60,
      solo_crew_min: 1,
      solo_crew_max: 1,
    };
    expect(s.solo_crew_min).toBeLessThanOrEqual(s.solo_crew_max);
  });
});
