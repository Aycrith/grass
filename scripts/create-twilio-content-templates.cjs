#!/usr/bin/env node
/**
 * create-twilio-content-templates.cjs
 *
 * Creates the two Twilio Content templates needed for the lead-capture
 * auto-text-back. Programmatic creation via the Twilio Content API —
 * the alternative (clicking through console.twilio.com) was a
 * friction point for the steward, so we wrap the same API call in a
 * one-shot script.
 *
 * USAGE
 *   # Uses credentials from apps/web/.env.local (TWILIO_ACCOUNT_SID,
 *   # TWILIO_AUTH_TOKEN) or from environment variables.
 *   node scripts/create-twilio-content-templates.cjs
 *
 * OUTPUT
 *   Prints the new template SIDs (HX...) to stdout and writes them
 *   to apps/web/.env.local as TWILIO_CONTENT_SID (ad-driven) and
 *   TWILIO_CONTENT_SID_ORGANIC (organic).
 *
 * IDEMPOTENT
 *   If a template with the same friendly_name already exists, the
 *   script will look it up via the Content API and reuse the SID.
 *   This is important because trial accounts get audited for
 *   "template spam" and we don't want to keep re-creating on every
 *   run.
 */

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

// --- Resolve credentials ---------------------------------------------------

function loadEnvLocal() {
  // Load from apps/web/.env.local if it exists. Simple parser; doesn't
  // handle nested quotes but our values are flat.
  const envPath = path.resolve(__dirname, '..', 'apps', 'web', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
if (!ACCOUNT_SID || !AUTH_TOKEN) {
  console.error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN.');
  console.error('Add them to apps/web/.env.local and re-run.');
  process.exit(1);
}

// --- Templates to create --------------------------------------------------

const TEMPLATES = [
  {
    friendly_name: 'largolawn_ad_autoreply_v1',
    purpose: 'ad-driven (Google/Meta/Bing/Nextdoor/Yelp)',
    body: "Hi {{1}}! Got your request from the ad. I'll text you back in 5 min to set up your free cleanup. — Cameron, Largo Lawn",
    envVar: 'TWILIO_CONTENT_SID',
  },
  {
    friendly_name: 'largolawn_organic_autoreply_v1',
    purpose: 'organic (direct, referral, organic search)',
    body: "Hi {{1}}! Got your quote request. I'll text you back within 24 hours (usually faster). — Cameron, Largo Lawn",
    envVar: 'TWILIO_CONTENT_SID_ORGANIC',
  },
];

// --- HTTP helper ----------------------------------------------------------

function twilioRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'content.twilio.com',
      port: 443,
      path: urlPath,
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(opts, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        try {
          const json = chunks ? JSON.parse(chunks) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${json.message ?? chunks}`));
          }
        } catch (err) {
          reject(new Error(`Bad JSON: ${chunks.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// --- Idempotency: look up an existing template by friendly_name ----------

async function findExistingTemplate(friendlyName) {
  // List all content templates and filter. The Content API doesn't
  // support filtering on list, so we paginate once.
  try {
    const list = await twilioRequest('GET', '/v1/Content?PageSize=50');
    const found = (list.contents ?? []).find(
      (c) => c.friendly_name === friendlyName,
    );
    return found?.sid ?? null;
  } catch (err) {
    console.warn(`  (list lookup failed: ${err.message})`);
    return null;
  }
}

// --- Create a new template -----------------------------------------------

async function createTemplate({ friendly_name, body }) {
  return twilioRequest('POST', '/v1/Content', {
    friendly_name,
    language: 'en',
    types: {
      'twilio/text': { body },
    },
  });
}

// --- Write SIDs to .env.local --------------------------------------------

function updateEnvLocal(sidMap) {
  const envPath = path.resolve(__dirname, '..', 'apps', 'web', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error(`No .env.local at ${envPath}`);
    return;
  }
  let content = fs.readFileSync(envPath, 'utf8');
  for (const [key, sid] of Object.entries(sidMap)) {
    const re = new RegExp(`^${key}=.*$`, 'm');
    if (re.test(content)) {
      content = content.replace(re, `${key}=${sid}`);
    } else {
      content += `\n# Added ${new Date().toISOString().slice(0, 10)} by create-twilio-content-templates.cjs\n${key}=${sid}\n`;
    }
  }
  fs.writeFileSync(envPath, content, 'utf8');
}

// --- Main -----------------------------------------------------------------

async function main() {
  console.log('Creating Twilio Content templates (idempotent)...\n');
  const sidMap = {};
  for (const tpl of TEMPLATES) {
    process.stdout.write(`  ${tpl.friendly_name}  (${tpl.purpose})\n`);
    let sid = await findExistingTemplate(tpl.friendly_name);
    if (sid) {
      console.log(`    ↳ already exists: ${sid}`);
    } else {
      try {
        const result = await createTemplate(tpl);
        sid = result.sid;
        console.log(`    ↳ created: ${sid}`);
      } catch (err) {
        console.error(`    ↳ FAILED: ${err.message}`);
        console.error(
          `    Hint: trial accounts may need templates created in console.twilio.com first.`,
        );
        continue;
      }
    }
    sidMap[tpl.envVar] = sid;
  }
  if (Object.keys(sidMap).length > 0) {
    updateEnvLocal(sidMap);
    console.log(`\nWrote to apps/web/.env.local:`);
    for (const [k, v] of Object.entries(sidMap)) console.log(`  ${k}=${v}`);
  }
  console.log('\nDone. Restart the dev server for the new env vars to take effect.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
