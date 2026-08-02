/**
 * Lead notification router.
 *
 * Single entry point for the /api/lead route. Decides whether the
 * lead-notification side effect should fire email (default V1) or
 * Twilio SMS (V2 opt-in). Both backends are fire-and-forget — they
 * never block the API response.
 *
 * Decision matrix:
 *   LEAD_NOTIFY_MODE=twilio → Twilio if creds present, else synthetic
 *   LEAD_NOTIFY_MODE=email  → email if creds present, else synthetic
 *   LEAD_NOTIFY_MODE=auto   → email if creds present, else Twilio if
 *                             creds present, else synthetic
 *
 * Why email is the V1 default (per the steward feedback loop):
 *   - The Twilio trial account is restricted to verified caller IDs,
 *     which makes real customer SMS impossible without per-customer
 *     manual verification.
 *   - Manual response from Google Voice scales comfortably to 30+ leads
 *     per week. The operator can reply in <60s per lead, which beats
 *     the speed-to-lead median for a 1-person business.
 *   - Gmail SMTP is free forever with infrastructure the steward
 *     already owns (44thefool44@gmail.com + a 16-char app password).
 *   - Twilio is kept wired in this codebase as a V2 opt-in for when
 *     volume justifies the $1.15/mo number + $0.008/SMS cost.
 */

import { sendLeadEmail, type LeadEmailPayload } from './email';
import { sendAutoTextBack } from './twilio';
import { logSyntheticEvent } from './synthetic-log';

type Mode = 'email' | 'twilio' | 'auto';

function resolveMode(): Mode {
  const raw = process.env['LEAD_NOTIFY_MODE']?.toLowerCase();
  if (raw === 'email' || raw === 'twilio' || raw === 'auto') return raw;
  return 'auto';
}

function emailConfigured(): boolean {
  return Boolean(process.env['GMAIL_USER']) && Boolean(process.env['GMAIL_APP_PASSWORD']);
}

function twilioConfigured(): boolean {
  return Boolean(process.env['TWILIO_ACCOUNT_SID']) &&
    Boolean(process.env['TWILIO_AUTH_TOKEN']) &&
    Boolean(process.env['TWILIO_FROM_NUMBER']);
}

export interface NotifyPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  zip: string;
  message?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  leadId: string;
  smsConsent: boolean;
  receivedAt: string;
}

export interface NotifyResult {
  channel: 'email' | 'twilio' | 'synthetic';
  ok: boolean;
  synthetic?: boolean;
  error?: string;
}

export async function notifyNewLead(payload: NotifyPayload): Promise<NotifyResult> {
  const mode = resolveMode();
  const wantEmail = mode === 'email' || (mode === 'auto' && (emailConfigured() || !twilioConfigured()));
  const wantTwilio = mode === 'twilio' || (mode === 'auto' && twilioConfigured() && !emailConfigured());

  if (wantEmail && emailConfigured()) {
    const emailPayload: LeadEmailPayload = {
      firstName: payload.firstName,
      ...(payload.lastName ? { lastName: payload.lastName } : {}),
      email: payload.email,
      ...(payload.phone ? { phone: payload.phone } : {}),
      zip: payload.zip,
      ...(payload.message ? { message: payload.message } : {}),
      ...(payload.source ? { source: payload.source } : {}),
      ...(payload.utmSource ? { utmSource: payload.utmSource } : {}),
      ...(payload.utmMedium ? { utmMedium: payload.utmMedium } : {}),
      ...(payload.utmCampaign ? { utmCampaign: payload.utmCampaign } : {}),
      ...(payload.utmTerm ? { utmTerm: payload.utmTerm } : {}),
      ...(payload.utmContent ? { utmContent: payload.utmContent } : {}),
      leadId: payload.leadId,
      receivedAt: payload.receivedAt,
      smsConsent: payload.smsConsent,
    };
    const result = await sendLeadEmail(emailPayload);
    return {
      channel: result.synthetic ? 'synthetic' : 'email',
      ok: result.ok,
      ...(result.synthetic ? { synthetic: true } : {}),
      ...(result.error ? { error: result.error } : {}),
    };
  }

  if (wantTwilio && twilioConfigured() && payload.phone) {
    await sendAutoTextBack({
      to: payload.phone,
      firstName: payload.firstName,
      ...(payload.utmSource ? { utmSource: payload.utmSource } : {}),
      leadId: payload.leadId,
    });
    return { channel: 'twilio', ok: true };
  }

  // Nothing configured — log to synthetic for end-to-end testing.
  await logSyntheticEvent({
    ts: new Date().toISOString(),
    kind: 'notify.lead',
    reason: 'no_backend_configured',
    payload: {
      mode,
      email_configured: emailConfigured(),
      twilio_configured: twilioConfigured(),
      lead_id: payload.leadId,
      has_phone: Boolean(payload.phone),
    },
  });
  return { channel: 'synthetic', ok: true, synthetic: true };
}
