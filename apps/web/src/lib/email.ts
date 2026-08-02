/**
 * Email notification — Gmail SMTP via nodemailer.
 *
 * V1 lead-notification path. Default backend for new leads when
 * `LEAD_NOTIFY_MODE` is not explicitly set to `twilio`. Free,
 * already-owned infrastructure: the Gmail account you already have
 * on `44thefool44@gmail.com` plus a 16-char app password from
 * myaccount.google.com → Security → App passwords.
 *
 * Why email-first:
 * - Twilio trial account restricts outbound to verified caller IDs,
 *   so the steward has to verify each customer's number manually.
 *   That's a non-starter for a real lead pipeline.
 * - Auto-text-back is not worth its complexity at <30 leads/week.
 *   The operator can reply manually from Google Voice in <60s.
 * - Gmail SMTP costs $0 forever. No third-party account, no card.
 *
 * Env vars:
 *   - GMAIL_USER              e.g. 44thefool44@gmail.com
 *   - GMAIL_APP_PASSWORD      16-char app password (not the Gmail
 *                             account password)
 *   - LEAD_NOTIFY_TO          optional; defaults to GMAIL_USER
 *
 * Synthetic mode (for pipeline testing without real Gmail creds):
 *   - If GMAIL_USER or GMAIL_APP_PASSWORD is missing OR
 *     `SYNTHETIC_MODE=1`, `sendEmail` logs the would-be payload to
 *     `output/synthetic-events.jsonl` and returns `ok: true` with a
 *     synthetic `messageId`.
 */

import nodemailer from 'nodemailer';
import { logSyntheticEvent } from './synthetic-log';
import { BUSINESS } from './business';

interface SendEmailResult {
  ok: boolean;
  messageId?: string | undefined;
  error?: string | undefined;
  synthetic?: boolean | undefined;
}

function getEnv(key: string): string | undefined {
  const v = process.env[key];
  return v && v.length > 0 ? v : undefined;
}

function isSynthetic(): boolean {
  if (process.env['SYNTHETIC_MODE'] === '1') return true;
  return !getEnv('GMAIL_USER') || !getEnv('GMAIL_APP_PASSWORD');
}

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (cachedTransport) return cachedTransport;
  const user = getEnv('GMAIL_USER');
  const pass = getEnv('GMAIL_APP_PASSWORD');
  if (!user || !pass) {
    throw new Error('Gmail SMTP transport requires GMAIL_USER and GMAIL_APP_PASSWORD');
  }
  cachedTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return cachedTransport;
}

export interface LeadEmailPayload {
  firstName: string;
  lastName?: string | undefined;
  email: string;
  phone?: string | undefined;
  zip: string;
  message?: string | undefined;
  source?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmTerm?: string | undefined;
  utmContent?: string | undefined;
  leadId: string;
  receivedAt: string;
  smsConsent: boolean;
}

/** Build a `sms:+1xxxxxxxxxx` URI for the OS to handle natively. */
function smsHref(phone: string | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `sms:+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `sms:+${digits}`;
  return null;
}

function buildSubject(payload: LeadEmailPayload): string {
  const src = payload.utmSource || payload.source || 'website';
  return `New lead: ${payload.firstName} (${src}) — ${BUSINESS.name}`;
}

function buildText(payload: LeadEmailPayload): string {
  const lines: string[] = [
    `New ${BUSINESS.name} lead — ${payload.receivedAt}`,
    '',
    `Name:     ${payload.firstName}${payload.lastName ? ' ' + payload.lastName : ''}`,
    `Email:    ${payload.email}`,
    ...(payload.phone ? [`Phone:    ${payload.phone}`] : []),
    `ZIP:      ${payload.zip}`,
    ...(payload.message ? [`Message:  ${payload.message}`] : []),
    `Source:   ${payload.source ?? 'website'}`,
    `Consent:  ${payload.smsConsent ? 'SMS opted-in' : 'no SMS'}`,
    '',
  ];
  if (payload.utmSource || payload.utmCampaign) {
    lines.push('Attribution:');
    if (payload.utmSource) lines.push(`  source:   ${payload.utmSource}`);
    if (payload.utmMedium) lines.push(`  medium:   ${payload.utmMedium}`);
    if (payload.utmCampaign) lines.push(`  campaign: ${payload.utmCampaign}`);
    if (payload.utmTerm) lines.push(`  term:     ${payload.utmTerm}`);
    if (payload.utmContent) lines.push(`  content:  ${payload.utmContent}`);
    lines.push('');
  }
  lines.push(`Lead ID: ${payload.leadId}`);
  return lines.join('\n');
}

function buildHtml(payload: LeadEmailPayload): string {
  const smsLink = smsHref(payload.phone);
  const row = (label: string, value: string | undefined): string =>
    value
      ? `<tr><td style="padding:4px 12px 4px 0;color:#666;font-size:13px;vertical-align:top">${label}</td><td style="padding:4px 0;font-size:14px">${value}</td></tr>`
      : '';
  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:16px">
  <div style="border-bottom:2px solid #16a34a;padding-bottom:12px;margin-bottom:16px">
    <div style="font-size:11px;letter-spacing:0.05em;color:#16a34a;font-weight:600;text-transform:uppercase">New lead</div>
    <div style="font-size:20px;font-weight:600;margin-top:2px">${escapeHtml(payload.firstName)}${payload.lastName ? ' ' + escapeHtml(payload.lastName) : ''}</div>
    <div style="font-size:13px;color:#666;margin-top:2px">${BUSINESS.name} · ${escapeHtml(payload.receivedAt)}</div>
  </div>
  <table style="border-collapse:collapse;width:100%">
    ${row('Email', `<a href="mailto:${escapeHtml(payload.email)}" style="color:#16a34a">${escapeHtml(payload.email)}</a>`)}
    ${row('Phone', payload.phone ? (smsLink ? `<a href="${smsLink}" style="color:#16a34a">${escapeHtml(payload.phone)}</a> · <a href="${smsLink}" style="font-size:12px;color:#16a34a">[text this number]</a>` : escapeHtml(payload.phone)) : '—')}
    ${row('ZIP', escapeHtml(payload.zip))}
    ${row('Source', escapeHtml(payload.source ?? 'website'))}
    ${row('SMS consent', payload.smsConsent ? '✅ yes' : 'no')}
  </table>
  ${payload.message ? `<div style="margin-top:16px;padding:12px;background:#f9fafb;border-left:3px solid #16a34a;border-radius:4px"><div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Message</div><div style="font-size:14px;white-space:pre-wrap">${escapeHtml(payload.message)}</div></div>` : ''}
  ${payload.utmSource || payload.utmCampaign ? `<div style="margin-top:16px;font-size:12px;color:#666;border-top:1px solid #e5e7eb;padding-top:12px"><strong>Attribution</strong><br>${payload.utmSource ? `source: ${escapeHtml(payload.utmSource)}<br>` : ''}${payload.utmMedium ? `medium: ${escapeHtml(payload.utmMedium)}<br>` : ''}${payload.utmCampaign ? `campaign: ${escapeHtml(payload.utmCampaign)}<br>` : ''}${payload.utmTerm ? `term: ${escapeHtml(payload.utmTerm)}<br>` : ''}${payload.utmContent ? `content: ${escapeHtml(payload.utmContent)}` : ''}</div>` : ''}
  <div style="margin-top:16px;font-size:11px;color:#999">lead_id: ${escapeHtml(payload.leadId)}</div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendLeadEmail(payload: LeadEmailPayload): Promise<SendEmailResult> {
  if (isSynthetic()) {
    await logSyntheticEvent({
      ts: new Date().toISOString(),
      kind: 'email.lead',
      reason: !getEnv('GMAIL_USER') || !getEnv('GMAIL_APP_PASSWORD') ? 'env_missing' : 'synthetic_forced',
      payload: {
        to: getEnv('LEAD_NOTIFY_TO') ?? getEnv('GMAIL_USER') ?? 'SYNTHETIC_TO',
        from: getEnv('GMAIL_USER') ?? 'SYNTHETIC_FROM',
        subject: buildSubject(payload),
        text_excerpt: buildText(payload).slice(0, 280),
        lead_id: payload.leadId,
      },
    });
    return { ok: true, messageId: `MSG_SYNTHETIC_${Date.now()}`, synthetic: true };
  }

  try {
    const transport = getTransport();
    const user = getEnv('GMAIL_USER')!;
    const info = await transport.sendMail({
      from: `${BUSINESS.name} <${user}>`,
      to: getEnv('LEAD_NOTIFY_TO') ?? user,
      subject: buildSubject(payload),
      text: buildText(payload),
      html: buildHtml(payload),
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}
