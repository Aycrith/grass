/**
 * @grass/notifications-core/types — Channel + result contracts.
 */

export interface SmsResult {
  sid: string;
  status: 'queued' | 'sent' | 'failed';
  cost_cents: number;
  to: string;
  body: string;
}

export interface EmailResult {
  id: string;
  status: 'queued' | 'sent' | 'failed';
  cost_cents: number;
  to: string;
  subject: string;
}

export type NotificationChannel = 'sms' | 'email' | 'phone';

export const COST_PER_SMS_CENTS = 0.79; // ~$0.0079
export const COST_PER_EMAIL_CENTS = 0.04; // ~$0.0004
export const COST_PER_VOICE_MINUTE_CENTS = 1.4; // ~$0.014

export interface MonthlySpendTracker {
  sms_cents: number;
  email_cents: number;
  voice_cents: number;
  total_cents: number;
}

export const MONTHLY_SPEND_CEILING_CENTS = {
  sms: 2000, // $20
  email: 500, // $5
  voice: 1000, // $10
  total: 20000, // $200 hard ceiling
} as const;

export function wouldExceedCeiling(
  tracker: MonthlySpendTracker,
  kind: 'sms' | 'email' | 'voice',
): boolean {
  if (tracker.total_cents >= MONTHLY_SPEND_CEILING_CENTS.total) return true;
  if (kind === 'sms' && tracker.sms_cents >= MONTHLY_SPEND_CEILING_CENTS.sms) return true;
  if (kind === 'email' && tracker.email_cents >= MONTHLY_SPEND_CEILING_CENTS.email) return true;
  if (kind === 'voice' && tracker.voice_cents >= MONTHLY_SPEND_CEILING_CENTS.voice) return true;
  return false;
}
