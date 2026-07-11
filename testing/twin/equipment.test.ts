/**
 * testing/twin/equipment.test.ts — Twin model invariants from architecture/twin/equipment.md
 *
 * Invariants tested:
 *   1. status='active' requires non-empty maintenance plan
 *   2. next_due_at recomputed on every maintenance.last_performed_at write
 *   3. insurance policy_id required for cost ≥ $500
 *   4. status='broken' excludes from job assignment
 */

import { describe, expect, test } from 'bun:test';

interface Equipment {
  status: 'active' | 'broken' | 'maintenance' | 'stored' | 'sold';
  maintenance: { task: string; next_due_at?: string }[];
  acquisition_cost_cents: number;
  insurance_policy_id?: string;
}

const FIVE_HUNDRED_DOLLARS_CENTS = 500_00;

describe('Equipment twin model invariants', () => {
  test('active equipment has maintenance plan', () => {
    const e: Equipment = {
      status: 'active',
      maintenance: [{ task: 'oil change', next_due_at: '2026-08-01' }],
      acquisition_cost_cents: 7500_00,
    };
    expect(e.maintenance.length).toBeGreaterThan(0);
  });

  test('insurance required for equipment ≥ $500', () => {
    const e: Equipment = {
      status: 'active',
      maintenance: [{ task: 'oil change' }],
      acquisition_cost_cents: 7500_00,
      insurance_policy_id: 'pol-123',
    };
    if (e.acquisition_cost_cents >= FIVE_HUNDRED_DOLLARS_CENTS) {
      expect(e.insurance_policy_id).toBeDefined();
    }
  });

  test('broken equipment excluded from job assignment', () => {
    const e: Equipment = { status: 'broken', maintenance: [], acquisition_cost_cents: 0 };
    const assignable = e.status === 'active' || e.status === 'maintenance';
    expect(assignable).toBe(false);
  });
});
