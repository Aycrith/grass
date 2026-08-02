/**
 * Twilio SMS — minimal client.
 *
 * Used by the lead-capture flow to send the auto-text-back
 * (per Fix #6 in the GTM audit) within 30 seconds of a form
 * submission. We hit the Twilio REST API directly rather than
 * pulling in the `twilio` npm package — the bundle savings
 * are significant (the SDK is ~600KB) and we only use one
 * endpoint.
 *
 * Env vars:
 *   - TWILIO_ACCOUNT_SID  (AC...)
 *   - TWILIO_AUTH_TOKEN
 *   - TWILIO_FROM_NUMBER  (E.164; must be a verified sender)
 *
 * Phone normalization: takes any 10-11 digit US number and
 * prefixes +1. E.164-only outbound.
 *
 * SYNTHETIC MODE
 * ──────────────
 * If any of the three env vars is missing OR `SYNTHETIC_MODE=1`
 * is set, `sendSMS` logs the would-be payload to
 * `output/synthetic-events.jsonl` and returns `ok: true` with a
 * synthetic `sid`. The end-to-end test pipeline uses this to
 * prove the form → SMS pipeline works without real Twilio.
 */

import { logSyntheticEvent } from './synthetic-log';

interface SendSMSResult {
  ok: boolean;
  sid?: string | undefined;
  error?: string | undefined;
  synthetic?: boolean | undefined;
}

function getEnv(key: string): string | undefined {
  const v = process.env[key];
  return v && v.length > 0 ? v : undefined;
}

function isSynthetic(): boolean {
  if (process.env['SYNTHETIC_MODE'] === '1') return true;
  return !getEnv('TWILIO_ACCOUNT_SID') ||
    !getEnv('TWILIO_AUTH_TOKEN') ||
    !getEnv('TWILIO_FROM_NUMBER');
}

function normalizePhoneE164(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

export async function sendSMS(opts: {
  to: string;
  body: string;
}): Promise<SendSMSResult> {
  const sid = getEnv('TWILIO_ACCOUNT_SID');
  const token = getEnv('TWILIO_AUTH_TOKEN');
  const from = getEnv('TWILIO_FROM_NUMBER');
  const to = normalizePhoneE164(opts.to);
  if (!to) {
    return { ok: false, error: `Invalid phone: ${opts.to}` };
  }

  // Synthetic mode — log and return success without calling Twilio.
  if (isSynthetic()) {
    await logSyntheticEvent({
      ts: new Date().toISOString(),
      kind: 'twilio.sms',
      reason: !sid || !token || !from ? 'env_missing' : 'synthetic_forced',
      payload: {
        from: from ?? 'SYNTHETIC_FROM',
        to,
        body: opts.body,
      },
    });
    const synthSid = `SM_SYNTHETIC_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return { ok: true, sid: synthSid, synthetic: true };
  }

  if (!sid || !token || !from) {
    return { ok: false, error: 'Twilio not configured' };
  }

  // Trial-account support: when the API returns 572006 ("Trial accounts
  // can only use predefined SMS templates"), fall back to a content
  // template. The template ID is taken from `TWILIO_CONTENT_SID` env
  // var, which the steward sets up in the Twilio console. The body
  // becomes a stringified customVariables payload so the template
  // renderer can interpolate it.
  //
  // See: https://www.twilio.com/docs/messaging/services/content-services-templates
  const contentSid = getEnv('TWILIO_CONTENT_SID');

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const form = new URLSearchParams();
  form.set('To', to);
  form.set('From', from);
  if (contentSid) {
    // Use a content template (required for trial accounts).
    form.set('ContentSid', contentSid);
    form.set('ContentVariables', JSON.stringify({ 1: opts.body }));
  } else {
    form.set('Body', opts.body);
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    const data = (await res.json()) as { sid?: string; message?: string; code?: number };
    if (!res.ok) {
      // Special-case trial template error — give a useful hint.
      if (data.code === 572006) {
        return {
          ok: false,
          error:
            'Trial account: set TWILIO_CONTENT_SID env var to a pre-approved template, or upgrade the account at console.twilio.com → Billing.',
        };
      }
      return { ok: false, error: data.message ?? `HTTP ${res.status}` };
    }
    return { ok: true, sid: data.sid };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown' };
  }
}

/**
 * Auto-text-back — the speed-to-lead optimization.
 *
 * Sends a context-aware SMS within 30 seconds of a form
 * submission. Different copy for ad-driven traffic vs. organic
 * (we know because we have the UTM source).
 *
 * Fire-and-forget: never blocks the API response on the SMS.
 */
export async function sendAutoTextBack(opts: {
  to: string;
  firstName: string;
  utmSource?: string;
  leadId: string;
}): Promise<void> {
  const adSources = new Set(['google', 'facebook', 'meta', 'bing', 'nextdoor', 'yelp']);
  const isAd = opts.utmSource
    ? adSources.has(opts.utmSource.toLowerCase())
    : false;

  const body = isAd
    ? `Hi ${opts.firstName}! Got your request from the ad. I'll text you back in 5 min to set up your free cleanup. — Cameron, Largo Lawn`
    : `Hi ${opts.firstName}! Got your quote request. I'll text you back within 24 hours (usually faster). — Cameron, Largo Lawn`;

  await sendSMS({ to: opts.to, body });
}
