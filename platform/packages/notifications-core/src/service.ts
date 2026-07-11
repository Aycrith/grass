/**
 * @grass/notifications-core/service — Phase 4-5 stubs.
 */

import { type Principal, assertCan } from '@grass/auth';
import {
  COST_PER_EMAIL_CENTS,
  COST_PER_SMS_CENTS,
  type EmailResult,
  type MonthlySpendTracker,
  type NotificationChannel,
  type SmsResult,
  wouldExceedCeiling,
} from './types.ts';

export async function sendSms(
  to: string,
  body: string,
  p: Principal,
  tracker?: MonthlySpendTracker,
): Promise<SmsResult> {
  assertCan(p, 'customer:update_own_contact'); // broad check; refine in Phase 4-5
  if (tracker && wouldExceedCeiling(tracker, 'sms')) {
    return { sid: '', status: 'failed', cost_cents: 0, to, body };
  }
  return {
    sid: `SM${Date.now()}`,
    status: 'queued',
    cost_cents: COST_PER_SMS_CENTS,
    to,
    body,
  };
}

export async function sendEmail(
  to: string,
  subject: string,
  _body_html: string,
  p: Principal,
  tracker?: MonthlySpendTracker,
): Promise<EmailResult> {
  assertCan(p, 'customer:update_own_contact');
  if (tracker && wouldExceedCeiling(tracker, 'email')) {
    return { id: '', status: 'failed', cost_cents: 0, to, subject };
  }
  return {
    id: `em_${Date.now()}`,
    status: 'queued',
    cost_cents: COST_PER_EMAIL_CENTS,
    to,
    subject,
  };
}

export async function sendLeadResponse(
  lead: {
    first_name?: string;
    phone?: string;
    email?: string;
    preferred_contact_method?: NotificationChannel;
  },
  p: Principal,
): Promise<SmsResult | EmailResult | null> {
  const channel = lead.preferred_contact_method ?? (lead.phone ? 'sms' : 'email');
  if (channel === 'sms' && lead.phone) {
    return sendSms(lead.phone, `Hi ${lead.first_name ?? 'there'}, thanks for reaching out!`, p);
  }
  if (channel === 'email' && lead.email) {
    return sendEmail(
      lead.email,
      'Your Largo lawn-care inquiry',
      '<p>Got it — we will be in touch shortly.</p>',
      p,
    );
  }
  return null;
}

export async function sendReviewRequest(
  _job: { id: string; customer_id: string; property_id: string },
  _p: Principal,
): Promise<SmsResult> {
  // Phase 4-5: look up customer phone, send Twilio with deep-link to Google review
  return {
    sid: `SM_${Date.now()}`,
    status: 'queued',
    cost_cents: COST_PER_SMS_CENTS,
    to: '+1xxxxxxxxxx',
    body: 'Thanks for choosing us! If we earned 5 stars, would you mind posting a quick Google review? <link>',
  };
}

export async function sendInvoiceReminder(
  invoice: { id: string; number: string; total_cents: number },
  day: number,
  p: Principal,
): Promise<SmsResult | EmailResult> {
  return sendEmail(
    'customer@example.com',
    `Invoice ${invoice.number} — friendly reminder`,
    `<p>Your invoice of $${(invoice.total_cents / 100).toFixed(2)} is ${day} days past due.</p>`,
    p,
  );
}

export async function sendStormNotice(
  customer: { first_name: string; primary_phone: string },
  stormName: string,
  p: Principal,
): Promise<SmsResult> {
  return sendSms(
    customer.primary_phone,
    `Hi ${customer.first_name}, ${stormName} is approaching. We're pausing outdoor work and will auto-reschedule. No action needed.`,
    p,
  );
}

export async function sendJobDispatch(
  _job: { id: string; customer_id: string },
  etaMinutes: number,
  _p: Principal,
): Promise<SmsResult> {
  return {
    sid: `SM_${Date.now()}`,
    status: 'queued',
    cost_cents: COST_PER_SMS_CENTS,
    to: '+1xxxxxxxxxx',
    body: `On the way — ETA ${etaMinutes} min.`,
  };
}
