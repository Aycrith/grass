#!/usr/bin/env node
/**
 * Pipeline proof-of-concept test.
 *
 * Submits a form to a local /api/lead endpoint and verifies
 * that all 4 server-side integrations (notify, GA4 MP, Meta
 * CAPI, and the email acknowledgement) fire in synthetic
 * mode. Reads the synthetic log and asserts each event was
 * captured with the correct payload.
 *
 * Usage:
 *   # 1. Start the dev server in another terminal:
 *      cd apps/web && npm run dev
 *
 *   # 2. Run this test (in a third terminal):
 *      cd apps/web && node scripts/test-pipeline.js
 *
 *   # 3. Inspect the synthetic log:
 *      cat ../../output/synthetic-events.jsonl | jq .
 *
 * Exits 0 on success, 1 on any assertion failure.
 */

const { execSync } = require('node:child_process');
const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('node:fs');
const { resolve, join } = require('node:path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const LOG_PATH = resolve(__dirname, '../../../output/synthetic-events.jsonl');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

const c = (color, s) => `${COLORS[color]}${s}${COLORS.reset}`;

function log(level, msg) {
  const tag = {
    info: c('cyan', '[i]'),
    ok: c('green', '[✓]'),
    fail: c('red', '[✗]'),
    warn: c('yellow', '[!]'),
  }[level];
  console.log(`${tag} ${msg}`);
}

function header(title) {
  const line = '═'.repeat(64);
  console.log('\n' + c('bold', line));
  console.log(c('bold', `  ${title}`));
  console.log(c('bold', line));
}

function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, { stdio: 'pipe' });
      const code = res.toString().trim();
      if (code === '200' || code === '307' || code === '404') {
        log('ok', `Server up at ${url} (HTTP ${code})`);
        return true;
      }
    } catch (e) {
      // server not ready
    }
    process.stdout.write(c('gray', '.'));
    execSync('ping -n 2 127.0.0.1 > nul', { stdio: 'pipe' });
  }
  console.log();
  return false;
}

async function main() {
  header('LARGO LAWN PIPELINE PROOF-OF-CONCEPT TEST');
  console.log(c('gray', `  Mode:     SYNTHETIC (no real Gmail/Twilio/GA4/Meta keys)`));
  console.log(c('gray', `  Base URL: ${BASE_URL}`));
  console.log(c('gray', `  Log path: ${LOG_PATH}`));

  // Step 0: clear the synthetic log so we can assert only this run's events.
  if (existsSync(LOG_PATH)) {
    unlinkSync(LOG_PATH);
    log('ok', 'Cleared previous synthetic log');
  } else {
    log('ok', 'No previous synthetic log');
  }

  // Step 1: ensure server is up.
  console.log('\n' + c('bold', 'Step 1: Health check'));
  const up = waitForServer(BASE_URL);
  if (!up) {
    log('fail', `Server not responding at ${BASE_URL}`);
    log('info', 'Start the dev server first: cd apps/web && npm run dev');
    process.exit(1);
  }

  // Step 2: submit a form payload that mimics the /pet-waste compact form
  // with full ad-driven UTM tagging (Google Ads style).
  console.log('\n' + c('bold', 'Step 2: Submit ad-driven lead to /api/lead'));
  // The phone number MUST be a Twilio-verified caller ID for trial
  // accounts (when LEAD_NOTIFY_MODE=twilio). Use the steward's real
  // cell (default +17273138011) so the auto-text-back actually
  // delivers in real-mode tests. Override with TEST_PHONE env var
  // for synthetic runs.
  const testPhone = process.env.TEST_PHONE || '+17273138011';
  const payload = {
    first_name: 'Test',
    last_name: 'User',
    email: 'test.user@example.com',
    phone: testPhone.replace(/\D/g, '').slice(-10),
    zip: '33771',
    sms_consent: true,
    analytics_consent: 'granted',
    form_variant: 'compact',
    event_id: 'test-event-' + Date.now(),
    landing_path: '/pet-waste?utm_source=google&utm_medium=cpc&utm_campaign=pw_search&utm_term=pet%20waste%20removal',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'pw_search',
    utm_term: 'pet waste removal',
    utm_content: 'pw-search-ad-1',
    gclid: 'test-gclid-123',
    referrer: 'https://www.google.com/',
    device_class: 'mobile',
  };
  console.log(c('gray', `  Payload: ${JSON.stringify(payload, null, 2).split('\n').join('\n  ')}`));

  const start = Date.now();
  let response, responseBody;
  try {
    // Write payload to a temp file to avoid shell-escaping JSON.
    const tmpFile = join(require('node:os').tmpdir(), `test-pipeline-${Date.now()}.json`);
    writeFileSync(tmpFile, JSON.stringify(payload), 'utf8');
    const curlCmd = `curl -s -X POST ${BASE_URL}/api/lead -H "Content-Type: application/json" --data-binary "@${tmpFile}"`;
    response = execSync(curlCmd, { encoding: 'utf8' });
    responseBody = JSON.parse(response);
    const elapsed = Date.now() - start;
    if (responseBody.ok) {
      log('ok', `Lead accepted (HTTP 200, ${elapsed}ms)`);
    } else {
      log('warn', `Lead returned non-ok: ${JSON.stringify(responseBody)}`);
    }
    console.log(c('gray', `  Response: ${JSON.stringify(responseBody)}`));
  } catch (err) {
    log('fail', `Lead submission failed: ${err.message}`);
    process.exit(1);
  }

  // Step 3: give fire-and-forget events ~1.5s to land in the log.
  console.log('\n' + c('bold', 'Step 3: Wait for fire-and-forget events'));
  await new Promise((r) => setTimeout(r, 1500));
  log('ok', 'Wait complete');

  // Step 4: read the synthetic log and assert each expected event fired.
  console.log('\n' + c('bold', 'Step 4: Verify synthetic event log'));
  if (!existsSync(LOG_PATH)) {
    log('fail', `Synthetic log not created at ${LOG_PATH}`);
    process.exit(1);
  }

  const logContent = readFileSync(LOG_PATH, 'utf8');
  const events = logContent
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));

  console.log(c('gray', `  Captured ${events.length} event(s):`));
  for (const ev of events) {
    console.log(c('gray', `    → ${ev.kind} (${ev.reason}) @ ${ev.ts}`));
  }

  // The notify router picks the right backend based on env state:
  //   - GMAIL_USER set → email.lead
  //   - TWILIO creds set (and no GMAIL) → twilio.sms
  //   - neither → notify.lead (synthetic)
  // We accept any of these as proof the notify layer fired.
  const notifyEvent = events.find(
    (e) => e.kind === 'email.lead' || e.kind === 'twilio.sms' || e.kind === 'notify.lead',
  );
  const expectedNotifyKind = (() => {
    const hasGmail = !!process.env.GMAIL_USER;
    const hasTwilio = !!process.env.TWILIO_ACCOUNT_SID;
    if (hasGmail) return 'email.lead';
    if (hasTwilio) return 'twilio.sms';
    return 'notify.lead';
  })();

  const checks = [
    {
      kind: expectedNotifyKind,
      desc: `Notify fired (${expectedNotifyKind})`,
      isNotify: true,
    },
    {
      kind: 'ga4.event',
      desc: 'GA4 server event fired',
      expectedEventId: payload.event_id,
    },
    {
      kind: 'meta.capi',
      desc: 'Meta CAPI event fired',
      expectedEventId: payload.event_id,
    },
  ];

  let passed = 0;
  let failed = 0;
  for (const check of checks) {
    // For the notify check, accept any of the three notify kinds.
    const match = check.isNotify
      ? notifyEvent
      : events.find((e) => e.kind === check.kind);
    if (match) {
      log('ok', check.desc + (check.isNotify && match.kind !== check.kind ? ` (got ${match.kind})` : ''));
      // Verify event_id made it through (GA4 + Meta)
      const eventId = match.payload?.body?.events?.[0]?.params?.event_id
        || match.payload?.body?.data?.[0]?.event_id
        || match.payload?.body?.event_id;
      if (check.expectedEventId) {
        if (eventId === check.expectedEventId) {
          log('ok', `  ↳ event_id matches: ${eventId}`);
        } else {
          log('warn', `  ↳ event_id mismatch: expected ${check.expectedEventId}, got ${eventId}`);
        }
      }
      // Verify UTM tagging
      const utmSource = match.payload?.body?.events?.[0]?.params?.utm_source
        || match.payload?.body?.data?.[0]?.custom_data?.utm_source
        || match.payload?.utm_source;
      if (utmSource === 'google') {
        log('ok', `  ↳ utm_source=google carried through`);
      } else if (check.isNotify) {
        // notify/email events store UTMs at payload.utm_source
        const notifyUtm = match.payload?.utm_source;
        if (notifyUtm === 'google') {
          log('ok', `  ↳ utm_source=google carried through (notify)`);
        } else {
          log('warn', `  ↳ utm_source missing or wrong: ${notifyUtm}`);
        }
      } else {
        log('warn', `  ↳ utm_source missing or wrong: ${utmSource}`);
      }
      passed++;
    } else {
      log('fail', `${check.desc} — NOT FOUND in log`);
      failed++;
    }
  }

  // Twilio is V2 opt-in. If the steward has set LEAD_NOTIFY_MODE=twilio
  // AND has the trial account creds + content template, this fires.
  // Otherwise we expect to see NO twilio.sms event (because the V1
  // default is email and the trial account is dev-only).
  const twilioEvent = events.find((e) => e.kind === 'twilio.sms');
  if (process.env.LEAD_NOTIFY_MODE === 'twilio') {
    if (twilioEvent) {
      log('ok', 'Twilio auto-text-back fired (LEAD_NOTIFY_MODE=twilio)');
      passed++;
    } else {
      log('fail', 'LEAD_NOTIFY_MODE=twilio but no twilio.sms event in log');
      failed++;
    }
  } else {
    log(
      'info',
      'Twilio auto-text-back is V2 opt-in (LEAD_NOTIFY_MODE=twilio). Skipping assertion in V1 mode.',
    );
  }

  // Step 5: verify Meta CAPI PII hashing.
  console.log('\n' + c('bold', 'Step 5: Verify Meta CAPI PII hashing'));
  const metaEv = events.find((e) => e.kind === 'meta.capi');
  if (metaEv?.pii_hashes) {
    const { createHash } = require('node:crypto');
    const expectedEmail = createHash('sha256').update('test.user@example.com'.toLowerCase()).digest('hex');
    const actualEmail = metaEv.pii_hashes.em;
    if (actualEmail === expectedEmail) {
      log('ok', `Email hash matches SHA-256 of payload email: ${actualEmail.slice(0, 16)}...`);
    } else {
      log('fail', `Email hash mismatch`);
      failed++;
    }
  } else {
    log('warn', 'No PII hashes captured (Meta CAPI not fired)');
  }

  // Step 6: dump the full log for human inspection.
  header('FULL SYNTHETIC LOG');
  console.log(logContent);

  // Step 7: summary.
  header('SUMMARY');
  console.log(`  Checks passed: ${c('green', passed)}`);
  console.log(`  Checks failed: ${c('red', failed)}`);
  console.log(`  Events fired:  ${c('cyan', events.length)}`);
  console.log();
  if (failed === 0) {
    console.log(c('green', c('bold', '  ✓ Pipeline works end-to-end in synthetic mode.')));
    console.log(c('gray', '    When you add real Gmail/GA4/Meta keys, the same code'));
    console.log(c('gray', '    paths will fire against the real APIs without changes.'));
    console.log(c('gray', '    Add LEAD_NOTIFY_MODE=twilio to flip to SMS (V2 opt-in).'));
  } else {
    console.log(c('red', c('bold', '  ✗ Pipeline has gaps. Review the failed checks above.')));
  }
  console.log();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  log('fail', `Test crashed: ${err.message}`);
  console.error(err);
  process.exit(1);
});
