#!/usr/bin/env node
/**
 * GTM account status dashboard — quick check of all integrations.
 *
 * Probes each third-party service and reports:
 *   - Is the env var set?
 *   - Is the credential valid?
 *   - What's missing?
 *
 * Run from anywhere:
 *   node scripts/gtm-status.cjs
 *
 * Outputs a single screen showing the full state of the GTM stack.
 * Useful for: "what's blocking me right now?" + "what do I still need to do?"
 *
 * 2026-07-29: rebuilt for the V1 email-first architecture. The
 * Twilio path is now V2 opt-in via LEAD_NOTIFY_MODE=twilio. The
 * V1 lead-notification default is Gmail SMTP (GMAIL_USER +
 * GMAIL_APP_PASSWORD). The status script reflects that order.
 */

const { execSync } = require('node:child_process');
const { readFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const ENV_FILE = resolve(__dirname, '../apps/web/.env.local');
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
  magenta: '\x1b[35m',
};
const c = (color, s) => `${COLORS[color]}${s}${COLORS.reset}`;

function loadEnv() {
  if (!existsSync(ENV_FILE)) return {};
  const content = readFileSync(ENV_FILE, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return env;
}

function statusDot(state) {
  if (state === 'ok') return c('green', '●');
  if (state === 'partial') return c('yellow', '◐');
  return c('red', '○');
}

function row(label, state, value, hint) {
  const dot = statusDot(state);
  const stateLabel = state === 'ok' ? c('green', 'READY')
    : state === 'partial' ? c('yellow', 'PARTIAL')
    : c('red', 'MISSING');
  const valText = value ? c('gray', value) : c('gray', '—');
  const hintText = hint ? c('gray', `  ${hint}`) : '';
  return `  ${dot} ${c('bold', label.padEnd(28))} ${stateLabel.padEnd(10)} ${valText}${hintText}`;
}

function checkGmail(env) {
  const user = env.GMAIL_USER;
  const pass = env.GMAIL_APP_PASSWORD;
  if (!user) {
    return {
      state: 'missing',
      value: '',
      hint: 'V1 lead notification. Set GMAIL_USER + GMAIL_APP_PASSWORD',
    };
  }
  if (!pass) {
    return {
      state: 'partial',
      value: `user=${user}, no app password`,
      hint: 'myaccount.google.com → Security → App passwords (requires 2FA)',
    };
  }
  return { state: 'ok', value: `${user}, app password set` };
}

async function checkTwilio(env) {
  const sid = env.TWILIO_ACCOUNT_SID;
  const token = env.TWILIO_AUTH_TOKEN;
  const from = env.TWILIO_FROM_NUMBER;
  const contentSid = env.TWILIO_CONTENT_SID;
  const mode = env.LEAD_NOTIFY_MODE;
  if (mode !== 'twilio') {
    return {
      state: 'partial',
      value: `V2 opt-in (LEAD_NOTIFY_MODE=${mode || 'auto'})`,
      hint: 'Default is email; flip to twilio when volume justifies $1.55/mo',
    };
  }
  if (!sid || !token) return { state: 'missing', value: '', hint: 'Add to .env.local' };
  if (!from) return { state: 'partial', value: 'creds set, no FROM number', hint: 'Set TWILIO_FROM_NUMBER' };
  try {
    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}.json`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    if (res.ok) {
      const data = await res.json();
      const trialNote = data.type === 'Trial' ? c('yellow', ' (TRIAL)') : '';
      const contentNote = contentSid
        ? ''
        : c('yellow', ' — trial needs TWILIO_CONTENT_SID for body text');
      return {
        state: 'ok',
        value: `${data.friendly_name}${trialNote}, FROM=${from}${contentNote}`,
      };
    }
    return { state: 'partial', value: `auth failed (HTTP ${res.status})`, hint: 'Check creds' };
  } catch (err) {
    return { state: 'partial', value: 'auth error', hint: err.message };
  }
}

function checkGA4(env) {
  const id = env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const secret = env.GA4_API_SECRET;
  if (!id) return { state: 'missing', value: '', hint: 'analytics.google.com → create property' };
  if (!secret) return { state: 'partial', value: `ID=${id}, no API secret`, hint: 'GA4 Admin → Data Streams → Measurement Protocol API secrets' };
  return { state: 'ok', value: `ID=${id}, secret set` };
}

function checkMeta(env) {
  const pixel = env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = env.META_ACCESS_TOKEN;
  if (!pixel) return { state: 'missing', value: '', hint: 'business.facebook.com → Events Manager → Pixels' };
  if (!token) return { state: 'partial', value: `pixel=${pixel}, no system-user token`, hint: 'Business Settings → System Users → Generate Token' };
  return { state: 'ok', value: `pixel=${pixel}, token set` };
}

function checkPostHog(env) {
  const key = env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return { state: 'missing', value: '', hint: 'posthog.com → project settings' };
  return { state: 'ok', value: `${key.slice(0, 8)}...` };
}

function checkSynthetic(env) {
  const mode = env.SYNTHETIC_MODE;
  if (mode === '1' || mode === 'true') {
    return { state: 'partial', value: 'SYNTHETIC MODE ON', hint: 'All server events log to file instead of calling real APIs' };
  }
  return { state: 'ok', value: 'real-mode', hint: '' };
}

function checkDomain(env) {
  const url = env.NEXT_PUBLIC_SITE_URL;
  if (!url) return { state: 'missing', value: '', hint: 'defaults to https://largolawn.pro' };
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return { state: 'partial', value: url, hint: 'localhost — production deploy needs a real domain' };
  }
  return { state: 'ok', value: url };
}

function checkNotifyMode(env) {
  const mode = (env.LEAD_NOTIFY_MODE || 'auto').toLowerCase();
  return {
    state: 'ok',
    value: mode,
    hint:
      mode === 'auto'
        ? 'auto = email if configured, else twilio, else synthetic'
        : mode === 'email'
        ? 'email-only (uses Gmail SMTP when GMAIL_USER is set)'
        : mode === 'twilio'
        ? 'twilio-only (auto-text-back via Twilio)'
        : `unknown mode "${mode}" — defaults to auto`,
  };
}

async function main() {
  const env = loadEnv();

  console.log();
  console.log(c('bold', '  🌱  LARGO LAWN — GTM STACK STATUS  🌱'));
  console.log(c('gray', `  ${new Date().toISOString()}`));
  console.log();
  console.log(c('bold', '  ── Lead notification (V1 default: email) ─────────────────'));
  console.log();

  const gmail = checkGmail(env);
  console.log(row('Gmail SMTP (V1 default)', gmail.state, gmail.value, gmail.hint));

  const twilio = await checkTwilio(env);
  console.log(row('Twilio SMS (V2 opt-in)', twilio.state, twilio.value, twilio.hint));

  const mode = checkNotifyMode(env);
  console.log(row('LEAD_NOTIFY_MODE', mode.state, mode.value, mode.hint));

  console.log();
  console.log(c('bold', '  ── Conversion tracking ─────────────────────────────────────'));
  console.log();

  const ga4 = checkGA4(env);
  console.log(row('Google Analytics 4', ga4.state, ga4.value, ga4.hint));

  const meta = checkMeta(env);
  console.log(row('Meta Pixel + CAPI', meta.state, meta.value, meta.hint));

  const ph = checkPostHog(env);
  console.log(row('PostHog (analytics)', ph.state, ph.value, ph.hint));

  console.log();
  console.log(c('bold', '  ── App config ─────────────────────────────────────────────'));
  console.log();

  const syn = checkSynthetic(env);
  console.log(row('Synthetic mode flag', syn.state, syn.value, syn.hint));

  const dom = checkDomain(env);
  console.log(row('Site URL', dom.state, dom.value, dom.hint));

  const name = env.NEXT_PUBLIC_BUSINESS_NAME || 'Largo Lawn (default)';
  console.log(row('Business name', 'ok', name, 'rename by setting NEXT_PUBLIC_BUSINESS_NAME'));

  console.log();
  console.log(c('bold', '  ── Quick actions ─────────────────────────────────────────'));
  console.log();
  console.log(c('gray', '  • Run synthetic test:     cd apps/web && node scripts/test-pipeline.cjs'));
  console.log(c('gray', '  • Test Twilio SMS:        cd scripts && node twilio-buy-number.cjs test +1xxx'));
  console.log(c('gray', '  • Show Twilio account:    cd scripts && node twilio-buy-number.cjs status'));
  console.log(c('gray', '  • Setup Gmail SMTP:       docs in output/gtm/05-account-setup-presentation.html'));
  console.log();

  // Summary
  const states = [gmail, twilio, ga4, meta, ph, dom].map((x) => x.state);
  const ready = states.filter((s) => s === 'ok').length;
  const total = states.length;
  console.log(c('bold', `  ${ready}/${total} integrations READY`));
  if (ready === total) {
    console.log();
    console.log(c('green', c('bold', '  ✓ All integrations live. Pipeline is production-ready.')));
  } else if (ready >= 3) {
    console.log();
    console.log(
      c('yellow', `  ⚠ ${total - ready} integration(s) still need setup. Pipeline runs in synthetic mode for the missing ones.`),
    );
  } else {
    console.log();
    console.log(c('red', `  ✗ ${total - ready} integration(s) missing. Pipeline is mostly synthetic.`));
  }
  console.log();
}

main().catch((err) => {
  console.error('Crashed:', err);
  process.exit(1);
});
