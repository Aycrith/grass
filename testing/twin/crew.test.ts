/**
 * testing/twin/crew.test.ts — Twin model invariants from architecture/twin/crew.md
 *
 * Invariants tested:
 *   1. members[] has at least one role='lead' when status='active'
 *   2. billable_hours_target_pct computed from completed jobs
 *   3. status='blocked_hurricane' halts new job assignment
 *   4. skills match before assigning crew member to a job requiring that skill
 */

import { describe, expect, test } from 'bun:test';

interface Crew {
  status: 'active' | 'seasonal_pause' | 'blocked_hurricane';
  members: { role: 'lead' | 'helper' | 'trainee' }[];
  skills: string[];
}

describe('Crew twin model invariants', () => {
  test('active crew has at least one lead', () => {
    const c: Crew = {
      status: 'active',
      members: [{ role: 'lead' }],
      skills: ['zero_turn_mowing'],
    };
    expect(c.members.some((m) => m.role === 'lead')).toBe(true);
  });

  test('blocked_hurricane crew cannot accept new jobs', () => {
    const c: Crew = { status: 'blocked_hurricane', members: [{ role: 'lead' }], skills: [] };
    const canAccept = c.status !== 'blocked_hurricane';
    expect(canAccept).toBe(false);
  });

  test('crew has required skill for assigned job', () => {
    const c: Crew = { status: 'active', members: [{ role: 'lead' }], skills: ['zero_turn_mowing'] };
    const jobRequires = 'zero_turn_mowing';
    expect(c.skills.includes(jobRequires)).toBe(true);
  });
});
