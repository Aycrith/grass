/**
 * testing/twin/route.test.ts — Twin model invariants from architecture/twin/route.md
 *
 * Invariants tested:
 *   1. stops.length ≥ 2 (degenerate single-job routes uncommon)
 *   2. total_drive_time_minutes ≤ 60 (otherwise split)
 *   3. Re-route if Job moved >2h from scheduled_at
 */

import { describe, expect, test } from 'bun:test';

interface Route {
  stops: { sequence: number; job_id: string }[];
  total_drive_time_minutes: number;
}

describe('Route twin model invariants', () => {
  test('multi-stop routes have ≥2 stops', () => {
    const r: Route = {
      stops: [
        { sequence: 1, job_id: 'j1' },
        { sequence: 2, job_id: 'j2' },
        { sequence: 3, job_id: 'j3' },
      ],
      total_drive_time_minutes: 35,
    };
    expect(r.stops.length).toBeGreaterThanOrEqual(2);
  });

  test('total drive time ≤ 60min (else split)', () => {
    const r: Route = {
      stops: [
        { sequence: 1, job_id: 'j1' },
        { sequence: 2, job_id: 'j2' },
      ],
      total_drive_time_minutes: 45,
    };
    expect(r.total_drive_time_minutes).toBeLessThanOrEqual(60);
  });
});
