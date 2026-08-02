#!/usr/bin/env node
/**
 * Twilio buy-number CLI — programmatic setup for Largo Lawn.
 *
 * Searches for available 727 local numbers, lets the steward pick one,
 * purchases it, configures the messaging service, and tests SMS.
 * No browser required, no UI clicking, no $0 spend until number is bought.
 *
 * Usage:
 *
 *   # 1. Set credentials (one of these — env vars take priority)
 *   export TWILIO_ACCOUNT_SID=ACxxxxx
 *   export TWILIO_AUTH_TOKEN=your_token
 *
 *   # OR put them in scripts/.twilio-creds.json (gitignored):
 *   #   { "account_sid": "ACxxx", "auth_token": "xxx" }
 *
 *   # 2. Search available 727 numbers
 *   node scripts/twilio-buy-number.cjs search
 *
 *   # 3. Buy a number (interactive — picks from search results)
 *   node scripts/twilio-buy-number.cjs buy
 *
 *   # 4. Buy a specific number by SID
 *   node scripts/twilio-buy-number.cjs buy PNxxxxxxxx
 *
 *   # 5. Send a test SMS to a verified number
 *   node scripts/twilio-buy-number.cjs test +17275551234
 *
 *   # 6. Auto-update .env.local with the bought number
 *   node scripts/twilio-buy-number.cjs update-env
 *
 * What it does NOT do:
 *   - Upgrade the trial account (you do that via the console, $0 cost
 *     if you stay below free-tier limits)
 *   - Verify your personal phone (you do that via the console)
 *   - Send to unverified phones (Twilio blocks this on trial accounts)
 *
 * Cost: ~$1-2/month per local number. Trial accounts can buy numbers
 * but must add a credit card first via the Twilio console.
 */

const { execSync } = require('node:child_process');
const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');
const readline = require('node:readline');

const CREDS_FILE = resolve(__dirname, '.twilio-creds.json');
const ENV_FILE = resolve(__dirname, '../apps/web/.env.local');

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
  const line = '─'.repeat(64);
  console.log('\n' + c('bold', line));
  console.log(c('bold', `  ${title}`));
  console.log(c('bold', line));
}

function loadCreds() {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return {
      account_sid: process.env.TWILIO_ACCOUNT_SID,
      auth_token: process.env.TWILIO_AUTH_TOKEN,
    };
  }
  if (existsSync(CREDS_FILE)) {
    return JSON.parse(readFileSync(CREDS_FILE, 'utf8'));
  }
  return null;
}

function saveCreds(creds) {
  writeFileSync(CREDS_FILE, JSON.stringify(creds, null, 2), 'utf8');
  log('ok', `Credentials saved to ${CREDS_FILE} (add to .gitignore!)`);
}

async function twilioApi(creds, method, path, body) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${creds.account_sid}${path}`;
  const auth = Buffer.from(`${creds.account_sid}:${creds.auth_token}`).toString('base64');
  const opts = {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  if (body) {
    opts.body = new URLSearchParams(body).toString();
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

// ─── Subcommands ────────────────────────────────────────────────────────

async function cmdSetup() {
  header('TWILIO SETUP — first-time credential capture');
  console.log(c('gray', '  No credentials found. Let\'s set them up.'));
  console.log();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((r) => rl.question(q, r));
  const sid = await ask(c('cyan', '  Twilio Account SID (starts with AC): '));
  const token = await ask(c('cyan', '  Twilio Auth Token (32 hex chars): '));
  rl.close();
  const creds = { account_sid: sid.trim(), auth_token: token.trim() };
  if (!creds.account_sid.startsWith('AC') || creds.auth_token.length < 32) {
    log('fail', 'Invalid credentials. Account SID must start with AC, token must be 32+ chars.');
    process.exit(1);
  }
  saveCreds(creds);
  log('ok', 'Credentials saved. Run `node scripts/twilio-buy-number.cjs search` next.');
}

async function cmdSearch(creds) {
  header('SEARCH — available 727 local numbers');
  // Search for local numbers in 727 area code with SMS + voice capability.
  const { ok, status, data } = await twilioApi(
    creds,
    'GET',
    '/AvailablePhoneNumbers/US/Local.json?AreaCode=727&PageSize=10&SmsEnabled=true&VoiceEnabled=true',
  );
  if (!ok) {
    log('fail', `Search failed (HTTP ${status})`);
    console.log(JSON.stringify(data, null, 2));
    process.exit(1);
  }
  const numbers = data.available_phone_numbers || [];
  if (numbers.length === 0) {
    log('fail', 'No 727 numbers available. Try other area codes: 813, 941');
    process.exit(1);
  }
  console.log(c('gray', `  Found ${numbers.length} available 727 numbers:\n`));
  numbers.forEach((n, i) => {
    const capabilities = [
      n.capabilities.sms ? 'SMS' : null,
      n.capabilities.voice ? 'voice' : null,
      n.capabilities.mms ? 'MMS' : null,
    ].filter(Boolean).join(', ');
    console.log(c('bold', `  [${i + 1}]`) + ` ${c('green', n.phone_number)}`);
    console.log(c('gray', `      ${n.friendly_name} · ${capabilities} · $${n.price}/mo`));
    console.log(c('gray', `      SID: ${n.sid}`));
    console.log();
  });
  return numbers;
}

async function cmdBuy(creds, sidArg) {
  let sid = sidArg;
  if (!sid) {
    const numbers = await cmdSearch(creds);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise((r) => rl.question(q, r));
    const choice = await ask(c('cyan', '\n  Pick a number (1-' + numbers.length + ') or paste a SID: '));
    rl.close();
    const idx = parseInt(choice, 10);
    if (!isNaN(idx) && idx >= 1 && idx <= numbers.length) {
      sid = numbers[idx - 1].sid;
    } else if (choice.trim().startsWith('PN')) {
      sid = choice.trim();
    } else {
      log('fail', 'Invalid choice.');
      process.exit(1);
    }
  }
  header('BUY — purchasing the number');
  console.log(c('gray', `  SID: ${sid}`));
  const { ok, status, data } = await twilioApi(creds, 'POST', '/IncomingPhoneNumbers.json', {
    PhoneNumberSid: sid,
  });
  if (!ok) {
    log('fail', `Purchase failed (HTTP ${status})`);
    console.log(JSON.stringify(data, null, 2));
    if (data.message?.includes('Trial')) {
      console.log();
      log('warn', 'This is a TRIAL account. Add a credit card in the Twilio console to enable purchases.');
      log('info', 'Console: https://console.twilio.com → Billing → Add credit card');
    }
    process.exit(1);
  }
  log('ok', `Purchased ${data.phone_number} (${data.sid})`);
  log('ok', `Monthly cost: $${data.price}/mo`);
  return data;
}

async function cmdTest(creds, toNumber) {
  if (!toNumber) {
    log('fail', 'Usage: node scripts/twilio-buy-number.cjs test +17275551234');
    process.exit(1);
  }
  // Get the bought number from /api/lead or .env.local
  const env = loadEnv();
  const from = env.TWILIO_FROM_NUMBER;
  if (!from || from.startsWith('SYNTHETIC')) {
    log('fail', 'No real TWILIO_FROM_NUMBER in .env.local. Run `update-env` first.');
    process.exit(1);
  }
  header('TEST — sending SMS');
  console.log(c('gray', `  From: ${from}`));
  console.log(c('gray', `  To:   ${toNumber}`));
  console.log();
  const { ok, status, data } = await twilioApi(creds, 'POST', '/Messages.json', {
    To: toNumber,
    From: from,
    Body: 'Test from Largo Lawn setup. If you got this, SMS is working.',
  });
  if (!ok) {
    log('fail', `Send failed (HTTP ${status})`);
    console.log(JSON.stringify(data, null, 2));
    if (data.message?.includes('unverified')) {
      console.log();
      log('warn', 'Trial account: destination number must be VERIFIED first.');
      log('info', 'Console: https://console.twilio.com → Phone Numbers → Verified Caller IDs');
    }
    process.exit(1);
  }
  log('ok', `SMS sent! SID: ${data.sid}, status: ${data.status}`);
  log('info', `Check ${toNumber} for the message.`);
}

function loadEnv() {
  if (!existsSync(ENV_FILE)) return {};
  const content = readFileSync(ENV_FILE, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env;
}

async function cmdUpdateEnv(creds) {
  header('UPDATE-ENV — fetching the bought number');
  const { ok, status, data } = await twilioApi(creds, 'GET', '/IncomingPhoneNumbers.json?PageSize=20');
  if (!ok) {
    log('fail', `List failed (HTTP ${status})`);
    process.exit(1);
  }
  const numbers = data.incoming_phone_numbers || [];
  const local727 = numbers.find((n) => n.phone_number.startsWith('+1727'));
  if (!local727) {
    log('fail', 'No 727 numbers in this account. Run `buy` first.');
    process.exit(1);
  }
  const env = loadEnv();
  env.TWILIO_ACCOUNT_SID = creds.account_sid;
  env.TWILIO_AUTH_TOKEN = creds.auth_token;
  env.TWILIO_FROM_NUMBER = local727.phone_number;
  // Persist
  const lines = Object.entries(env).map(([k, v]) => `${k}=${v}`);
  writeFileSync(ENV_FILE, lines.join('\n') + '\n', 'utf8');
  log('ok', `Wrote ${ENV_FILE} with:`);
  log('info', `  TWILIO_ACCOUNT_SID=${creds.account_sid}`);
  log('info', `  TWILIO_AUTH_TOKEN=${creds.auth_token.slice(0, 6)}...`);
  log('info', `  TWILIO_FROM_NUMBER=${local727.phone_number}`);
}

async function cmdStatus(creds) {
  header('STATUS — account summary');
  const { data: account } = await twilioApi(creds, 'GET', '.json');
  if (account) {
    console.log(c('bold', `  Account: ${account.friendly_name} (${account.sid})`));
    console.log(c('gray', `  Status: ${account.status}`));
    console.log(c('gray', `  Type:   ${account.type}`));
    console.log(c('gray', `  Balance: $${account.balance || '0.00'}`));
  }
  const { data: numbers } = await twilioApi(creds, 'GET', '/IncomingPhoneNumbers.json?PageSize=20');
  const list = numbers.incoming_phone_numbers || [];
  console.log();
  console.log(c('bold', `  Phone numbers (${list.length}):`));
  list.forEach((n) => {
    console.log(c('green', `    ${n.phone_number}`) + c('gray', ` · ${n.sid} · $${n.price}/mo`));
  });
}

// ─── CLI dispatch ───────────────────────────────────────────────────────

async function main() {
  const sub = process.argv[2];
  if (sub === '--help' || sub === '-h' || !sub) {
    console.log(`
Twilio buy-number CLI for Largo Lawn

Usage:
  node scripts/twilio-buy-number.cjs setup         First-time credential setup
  node scripts/twilio-buy-number.cjs search        List available 727 local numbers
  node scripts/twilio-buy-number.cjs buy           Buy a number (interactive)
  node scripts/twilio-buy-number.cjs buy PNxxx     Buy a specific number by SID
  node scripts/twilio-buy-number.cjs test +1xxx    Send a test SMS to a verified number
  node scripts/twilio-buy-number.cjs update-env    Write TWILIO_FROM_NUMBER to .env.local
  node scripts/twilio-buy-number.cjs status        Show account + numbers summary
`);
    process.exit(0);
  }

  if (sub === 'setup') return cmdSetup();

  const creds = loadCreds();
  if (!creds) {
    log('fail', 'No credentials found.');
    log('info', 'Run: node scripts/twilio-buy-number.cjs setup');
    process.exit(1);
  }

  switch (sub) {
    case 'search': return cmdSearch(creds);
    case 'buy': return cmdBuy(creds, process.argv[3]);
    case 'test': return cmdTest(creds, process.argv[3]);
    case 'update-env': return cmdUpdateEnv(creds);
    case 'status': return cmdStatus(creds);
    default:
      log('fail', `Unknown subcommand: ${sub}`);
      process.exit(1);
  }
}

main().catch((err) => {
  log('fail', `Crashed: ${err.message}`);
  console.error(err);
  process.exit(1);
});
