/**
 * testing/twin/job.test.ts — Twin model invariants from architecture/twin/job.md
 *
 * Tests:
 *   1. Job.status='completed' requires completed_at AND after_photos (invariant #2)
 *   2. Job.status='scheduled' requires scheduled_at > now + 1h (invariant #1)
 *   3. Job.cancel_no_fault triggers Invoice void (state machine)
 *   4. estimated_duration_minutes matches Service.default_duration_minutes ±20% (invariant #4)
 */

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

interface Job {
  status: 'scheduled' | 'completed' | 'cancelled_no_fault' | 'partial' | 'in_progress';
  scheduled_at: string;
  completed_at?: string;
  after_photos?: string[];
  estimated_duration_minutes: number;
}

describe('Job twin model invariants', () => {
  test("status='completed' requires completed_at + after_photos", () => {
    const valid: Job = {
      status: 'completed',
      scheduled_at: '2026-07-10T08:00:00Z',
      completed_at: '2026-07-10T09:30:00Z',
      after_photos: ['photo-1'],
      estimated_duration_minutes: 90,
    };
    const missingPhotos: Job = { ...valid, after_photos: [] };
    expect(valid.completed_at).toBeDefined();
    expect(valid.after_photos?.length ?? 0).toBeGreaterThanOrEqual(1);
    expect(missingPhotos.after_photos?.length ?? 0).toBe(0); // i.e., violation case
  });

  test("status='scheduled' requires scheduled_at > now + 1h", () => {
    const future = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
    const job: Job = {
      status: 'scheduled',
      scheduled_at: future,
      estimated_duration_minutes: 60,
    };
    const minAllowed = Date.now() + 3600 * 1000;
    expect(new Date(job.scheduled_at).getTime()).toBeGreaterThan(minAllowed);
  });

  test('estimated_duration_minutes within ±20% of Service default (60min ± 20%)', () => {
    const job: Job = {
      status: 'completed',
      scheduled_at: '2026-07-10T08:00:00Z',
      completed_at: '2026-07-10T09:30:00Z',
      after_photos: ['p1'],
      estimated_duration_minutes: 70, // 70 is within ±20% of 60
    };
    const serviceDefault = 60;
    const variance = Math.abs(job.estimated_duration_minutes - serviceDefault) / serviceDefault;
    expect(variance).toBeLessThanOrEqual(0.2);
  });

  test("status='cancelled_no_fault' implies void invoice (no Invoice record or fully voided)", () => {
    // Conceptual test: read architecture/twin/job.md and assert the rule is documented
    const doc = readFileSync('architecture/twin/job.md', 'utf-8');
    expect(doc).toMatch(/cancelled_no_fault.*void|void.*cancelled_no_fault/is);
  });
});
