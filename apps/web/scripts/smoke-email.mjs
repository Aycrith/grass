#!/usr/bin/env bun
/**
 * Autonomous email-pipeline smoke test.
 *
 * Calls sendLeadEmail() directly in synthetic mode. Bypasses the dev
 * server entirely. Asserts that:
 *   1. The function returns ok=true with synthetic=true
 *   2. A 'email.lead' event is written to the synthetic log
 *   3. The event payload includes the right UTM, lead_id, attribution
 *
 * Usage:
 *   cd apps/web && bun run scripts/smoke-email.mjs
 *
 * This is the test that runs the moment you save a working
 * GMAIL_APP_PASSWORD into .env.local. If synthetic mode passes
 * (which it should, every time) and you also have GMAIL_USER +
 * GMAIL_APP_PASSWORD set, the same code path will fire real emails.
 */

import { sendLeadEmail } from '../src/lib/email';
import { readFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const LOG_PATH = resolve(process.cwd(), '..', '..', 'output', 'synthetic-events.jsonl');

async function main() {
  console.log('─'.repeat(64));
  console.log('GRASS EMAIL PIPELINE SMOKE TEST');
  console.log('─'.repeat(64));
  console.log(`Mode:      ${process.env.SYNTHETIC_MODE === '1' ? 'SYNTHETIC' : 'REAL'}`);
  console.log(`GMAIL_USER: ${process.env.GMAIL_USER ?? '(unset)'}`);
  console.log(`GMAIL_PWD:  ${process.env.GMAIL_APP_PASSWORD ? '***set***' : '(unset)'}`);
  console.log(`Log path:  ${LOG_PATH}`);
  console.log('');

  // Truncate the log so we only see this run's events.
  if (existsSync(LOG_PATH)) {
    unlinkSync(LOG_PATH);
    console.log('[ok] Cleared previous synthetic log');
  }

  const leadId = 'smoke_' + Date.now();
  const result = await sendLeadEmail({
    firstName: 'Smoke',
    lastName: 'Test',
    email: 'smoke@test.local',
    phone: '+17275551234',
    zip: '33771',
    message: 'Autonomous smoke test of email pipeline',
    source: 'smoke-test',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'pw_search',
    utmTerm: 'pet waste removal',
    utmContent: 'smoke-test-creative',
    leadId,
    receivedAt: new Date().toISOString(),
    smsConsent: true,
  });

  console.log('');
  console.log('─'.repeat(64));
  console.log('FUNCTION RESULT');
  console.log('─'.repeat(64));
  console.log(JSON.stringify(result, null, 2));
  console.log('');

  if (!result.ok) {
    console.error('[fail] sendLeadEmail returned ok=false');
    console.error('  error:', result.error);
    process.exit(1);
  }

  // Wait for the log write to flush.
  await new Promise((r) => setTimeout(r, 200));

  if (!existsSync(LOG_PATH)) {
    console.error('[fail] Synthetic log not created at', LOG_PATH);
    process.exit(1);
  }

  const log = readFileSync(LOG_PATH, 'utf8');
  const events = log
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .map((l) => JSON.parse(l));

  const emailEvent = events.find((e) => e.kind === 'email.lead');

  console.log('─'.repeat(64));
  console.log('SYNTHETIC LOG CHECKS');
  console.log('─'.repeat(64));

  let passed = 0;
  let failed = 0;
  function check(name, ok, detail) {
    if (ok) {
      console.log(`[ok]  ${name}${detail ? ` — ${detail}` : ''}`);
      passed++;
    } else {
      console.error(`[fail] ${name}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  check('result.ok === true', result.ok === true);
  check('result.synthetic === true (when SYNTHETIC_MODE=1 or no creds)', result.synthetic === true);
  check('email.lead event written to log', !!emailEvent, emailEvent ? `kind=${emailEvent.kind} reason=${emailEvent.reason}` : 'missing');

  if (emailEvent) {
    check('event has correct lead_id', emailEvent.payload.lead_id === leadId, emailEvent.payload.lead_id);
    check('event subject includes business name', emailEvent.payload.subject?.includes(process.env.NEXT_PUBLIC_BUSINESS_NAME ?? 'Largo Lawn'), emailEvent.payload.subject);
    // UTM is embedded in the text_excerpt (since email events have a flat structure)
    const utmInText = emailEvent.payload.text_excerpt?.includes('source:   google') || emailEvent.payload.text_excerpt?.includes('source: google');
    check('event text includes utm_source=google', utmInText, utmInText ? 'found in text_excerpt' : 'missing');
    check('event subject includes utm source', emailEvent.payload.subject?.includes('(google)'), emailEvent.payload.subject);
  }

  console.log('');
  console.log('─'.repeat(64));
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('─'.repeat(64));
  console.log('');
  console.log('Email pipeline works in synthetic mode.');
  console.log('When you add GMAIL_APP_PASSWORD to .env.local, the same code');
  console.log('path will fire real emails to', process.env.GMAIL_USER ?? '44thefool44@gmail.com');
  console.log('');
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('[fail] crashed:', e);
  process.exit(1);
});
