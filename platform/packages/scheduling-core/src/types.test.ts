/**
 * types.test.ts — Invariant helpers from architecture/twin/job.md.
 */

import { describe, expect, test } from 'bun:test';
import {
  invariantCompletedHasPhotos,
  invariantDurationWithinTolerance,
  invariantScheduledFuture,
} from './types.ts';

describe('@grass/scheduling-core — invariants', () => {
  test('completed requires completed_at + ≥1 after_photo', () => {
    expect(
      invariantCompletedHasPhotos({
        status: 'completed',
        completed_at: '2026-07-10T10:00:00Z',
        after_photos: ['p1'],
      }),
    ).toBe(true);
    expect(
      invariantCompletedHasPhotos({
        status: 'completed',
        after_photos: ['p1'],
      } as Parameters<typeof invariantCompletedHasPhotos>[0]),
    ).toBe(false);
    expect(
      invariantCompletedHasPhotos({
        status: 'completed',
        completed_at: '2026-07-10T10:00:00Z',
        after_photos: [],
      }),
    ).toBe(false);
  });

  test('scheduled requires scheduled_at > now + 1h', () => {
    const future = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
    const tooSoon = new Date(Date.now() + 30 * 60_000).toISOString();
    expect(invariantScheduledFuture({ status: 'scheduled', scheduled_at: future })).toBe(true);
    expect(invariantScheduledFuture({ status: 'scheduled', scheduled_at: tooSoon })).toBe(false);
  });

  test('duration within ±20% of service default', () => {
    expect(invariantDurationWithinTolerance(70, 60)).toBe(true);
    expect(invariantDurationWithinTolerance(55, 60)).toBe(true); // 8% < 20%
    expect(invariantDurationWithinTolerance(40, 60)).toBe(false); // 33% > 20%
  });
});
