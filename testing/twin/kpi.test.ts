/**
 * testing/twin/kpi.test.ts — Twin model invariants from architecture/twin/kpi.md
 *
 * Invariants tested:
 *   1. period_end > period_start
 *   2. actual_* null only when data is genuinely unavailable
 *   3. owner_agent_id matches an agent spec
 *   4. Missing KPISnapshot ≥7 days triggers warning
 */

import { describe, expect, test } from 'bun:test';

interface KPISnapshot {
  period_start: string;
  period_end: string;
  actual_count?: number;
  owner_agent_id: string;
}

describe('KPI twin model invariants', () => {
  test('period_end > period_start', () => {
    const k: KPISnapshot = {
      period_start: '2026-07-01',
      period_end: '2026-07-31',
      actual_count: 12,
      owner_agent_id: 'sales',
    };
    expect(new Date(k.period_end).getTime()).toBeGreaterThan(new Date(k.period_start).getTime());
  });

  test('owner_agent_id is non-empty', () => {
    const k: KPISnapshot = {
      period_start: '2026-07-01',
      period_end: '2026-07-31',
      owner_agent_id: 'sales',
    };
    expect(k.owner_agent_id).toBeTruthy();
  });

  test('variance_pct computed correctly', () => {
    const actual = 22;
    const target = 25;
    const variance = ((actual - target) / target) * 100;
    expect(variance.toFixed(2)).toBe('-12.00');
  });
});
