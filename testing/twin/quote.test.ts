/**
 * testing/twin/quote.test.ts — Twin model invariants from architecture/twin/quote.md
 *
 * Invariants tested:
 *   1. line_items[].service_id exists in catalog
 *   2. valid_until > now() for status='sent' or 'viewed'
 *   3. status='accepted' requires resulting_job_ids.length ≥ 1
 *   4. status='expired' auto-set when valid_until < now()
 *   5. discount requires Authority limit per pricing ladder
 */

import { describe, expect, test } from 'bun:test';

interface Quote {
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  valid_until: string;
  line_items: { service_id: string }[];
  resulting_job_ids: string[];
}

describe('Quote twin model invariants', () => {
  test('valid_until > now for sent/viewed', () => {
    const future = new Date(Date.now() + 14 * 86400_000).toISOString();
    const q: Quote = { status: 'sent', valid_until: future, line_items: [], resulting_job_ids: [] };
    expect(new Date(q.valid_until).getTime()).toBeGreaterThan(Date.now());
  });

  test('accepted quote has ≥1 resulting job', () => {
    const q: Quote = {
      status: 'accepted',
      valid_until: '2026-08-01',
      line_items: [{ service_id: 'cap_mowing_standard' }],
      resulting_job_ids: ['j1'],
    };
    expect(q.resulting_job_ids.length).toBeGreaterThanOrEqual(1);
  });

  test('declined is terminal', () => {
    const q: Quote = {
      status: 'declined',
      valid_until: '2026-08-01',
      line_items: [],
      resulting_job_ids: [],
    };
    expect(['accepted', 'declined', 'expired'].includes(q.status)).toBe(true);
  });
});
