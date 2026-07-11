/**
 * types.test.ts — Cost guardrails.
 */

import { describe, expect, test } from 'bun:test';
import {
  COST_PER_EMAIL_CENTS,
  COST_PER_SMS_CENTS,
  MONTHLY_SPEND_CEILING_CENTS,
  wouldExceedCeiling,
} from './types.ts';

describe('@grass/notifications-core — spend guardrails', () => {
  test('per-unit costs', () => {
    expect(COST_PER_SMS_CENTS).toBe(0.79);
    expect(COST_PER_EMAIL_CENTS).toBe(0.04);
  });

  test('monthly ceilings locked', () => {
    expect(MONTHLY_SPEND_CEILING_CENTS.total).toBe(20000); // $200
    expect(MONTHLY_SPEND_CEILING_CENTS.sms).toBe(2000);
    expect(MONTHLY_SPEND_CEILING_CENTS.email).toBe(500);
  });

  test('wouldExceedCeiling: sms under cap → false', () => {
    expect(
      wouldExceedCeiling(
        { sms_cents: 1500, email_cents: 200, voice_cents: 0, total_cents: 1700 },
        'sms',
      ),
    ).toBe(false);
  });

  test('wouldExceedCeiling: sms at cap → true', () => {
    expect(
      wouldExceedCeiling(
        { sms_cents: 2000, email_cents: 0, voice_cents: 0, total_cents: 2000 },
        'sms',
      ),
    ).toBe(true);
  });

  test('wouldExceedCeiling: total at cap → true (any kind)', () => {
    const t = { sms_cents: 10000, email_cents: 5000, voice_cents: 5000, total_cents: 20000 };
    expect(wouldExceedCeiling(t, 'email')).toBe(true);
  });
});
