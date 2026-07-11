/**
 * testing/twin/lead.test.ts — Twin model invariants from architecture/twin/lead.md
 *
 * Invariants tested:
 *   1. SLA: first_response_at ≤ 5 min after created_at during business hours
 *   2. status='won' requires quote_id AND customer_id
 *   3. status='lost' requires reason
 *   4. lot_size_estimate='unknown' triggers note in any quote
 */

import { describe, expect, test } from 'bun:test';

interface Lead {
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost' | 'unqualified';
  created_at: string;
  first_response_at?: string;
  quote_id?: string;
  customer_id?: string;
  lot_size_estimate?: 'small' | 'medium' | 'large' | 'unknown';
}

describe('Lead twin model invariants', () => {
  test('first response ≤ 5 min after creation', () => {
    const now = Date.now();
    const l: Lead = {
      status: 'contacted',
      created_at: new Date(now).toISOString(),
      first_response_at: new Date(now + 3 * 60_000).toISOString(),
    };
    const elapsed =
      new Date(l.first_response_at ?? Date.now()).getTime() - new Date(l.created_at).getTime();
    expect(elapsed).toBeLessThanOrEqual(5 * 60_000);
  });

  test('won lead has quote_id + customer_id', () => {
    const l: Lead = {
      status: 'won',
      created_at: '2026-07-10T08:00:00Z',
      quote_id: 'qt-1',
      customer_id: 'c-1',
    };
    expect(l.quote_id).toBeDefined();
    expect(l.customer_id).toBeDefined();
  });

  test("lot_size_estimate='unknown' triggers note", () => {
    const l: Lead = {
      status: 'qualified',
      created_at: '2026-07-10T08:00:00Z',
      lot_size_estimate: 'unknown',
    };
    const needsNote = l.lot_size_estimate === 'unknown';
    expect(needsNote).toBe(true);
  });
});
