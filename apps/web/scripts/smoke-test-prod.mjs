#!/usr/bin/env node
/**
 * Production smoke test for the GRASS web app.
 *
 * Run after `vercel deploy` to confirm the live site has the
 * right analytics pixels, the form endpoint works, and page
 * response times are within budget.
 *
 * Usage:
 *   node scripts/smoke-test-prod.mjs https://largolawn.pro
 *   node scripts/smoke-test-prod.mjs https://largolawn-xxxxx.vercel.app
 *
 * What it checks:
 *   1. Homepage returns 200 in < 3s
 *   2. /pet-waste returns 200 in < 3s
 *   3. /pet-waste has GA4 measurement ID in the page source
 *      (only if NEXT_PUBLIC_GA4_MEASUREMENT_ID is set)
 *   4. /pet-waste has Meta Pixel base code in the page source
 *      (only if NEXT_PUBLIC_META_PIXEL_ID is set)
 *   5. /api/lead accepts a form payload and returns 200
 *   6. /api/lead response time is < 5s (includes email send)
 *   7. The site has correct meta tags (title, description, canonical)
 *   8. Trust signal: no fabricated star ratings on the page
 *
 * Does NOT check:
 *   - Real email delivery (would require Gmail API access)
 *   - Real GA4 event ingestion (would require GA4 Data API)
 *   - Real Meta CAPI event ingestion (would require Meta Events Manager)
 *
 * For those, use the production lead-notification email as
 * the source of truth: a real lead at 44thefool44@gmail.com
 * with the right attribution is end-to-end proof.
 */

import { performance } from 'node:perf_hooks';

const URL = process.argv[2];
if (!URL) {
  console.error('Usage: node scripts/smoke-test-prod.mjs <url>');
  console.error('Example: node scripts/smoke-test-prod.mjs https://largolawn.pro');
  process.exit(1);
}

const COLORS = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  red: '\x1b[31m', green: '\x1b[32m',
  yellow: '\x1b[33m', cyan: '\x1b[36m', gray: '\x1b[90m',
};
const c = (k, s) => `${COLORS[k]}${s}${COLORS.reset}`;

function log(level, msg) {
  const tag = {
    info: c('cyan', '[i]'), ok: c('green', '[✓]'),
    fail: c('red', '[✗]'), warn: c('yellow', '[!]'),
  }[level];
  console.log(`${tag} ${msg}`);
}

function header(t) {
  console.log('\n' + c('bold', '═'.repeat(64)));
  console.log(c('bold', `  ${t}`));
  console.log(c('bold', '═'.repeat(64)));
}

let passed = 0, failed = 0, warned = 0;
function check(name, ok, detail, isWarn = false) {
  if (ok) {
    log('ok', `${name}${detail ? ' — ' + detail : ''}`);
    passed++;
  } else if (isWarn) {
    log('warn', `${name}${detail ? ' — ' + detail : ''}`);
    warned++;
  } else {
    log('fail', `${name}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

async function fetchPage(path) {
  const url = `${URL}${path}`;
  const start = performance.now();
  const res = await fetch(url, { method: 'GET' });
  const elapsed = Math.round(performance.now() - start);
  const body = await res.text();
  return { url, status: res.status, elapsed, body, headers: res.headers };
}

async function postLead() {
  const url = `${URL}/api/lead`;
  const payload = {
    first_name: 'Smoke',
    email: 'smoke@example.com',
    phone: '7273138011',
    zip: '33771',
    sms_consent: true,
    analytics_consent: 'granted',
    form_variant: 'compact',
    event_id: 'smoke-test-' + Date.now(),
    utm_source: 'smoke-test',
    utm_medium: 'manual',
    utm_campaign: 'smoke',
    source: 'smoke-test',
  };
  const start = performance.now();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const elapsed = Math.round(performance.now() - start);
  let body = null;
  try { body = await res.json(); } catch { body = { ok: false, error: 'non-json response' }; }
  return { url, status: res.status, elapsed, body };
}

async function main() {
  header(`PRODUCTION SMOKE TEST — ${URL}`);

  // ── 1. Homepage ──────────────────────────────────────────
  console.log('\n' + c('bold', 'Step 1: Homepage'));
  const home = await fetchPage('/');
  check('Homepage returns 200', home.status === 200, `HTTP ${home.status} in ${home.elapsed}ms`);
  check('Homepage response time < 3s', home.elapsed < 3000, `${home.elapsed}ms`);
  check('Homepage has <title> tag', /<title>[^<]+<\/title>/i.test(home.body));
  const titleMatch = home.body.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) log('info', `  ↳ title: "${titleMatch[1].trim()}"`);
  check('Homepage has canonical URL', /<link rel="canonical" href="[^"]+"/i.test(home.body));
  check('Homepage has meta description', /<meta name="description" content="[^"]+"/i.test(home.body));
  check('Homepage has Open Graph tags', /<meta property="og:title"/i.test(home.body));

  // ── 2. /pet-waste ─────────────────────────────────────────
  console.log('\n' + c('bold', 'Step 2: /pet-waste landing page'));
  const pw = await fetchPage('/pet-waste');
  check('/pet-waste returns 200', pw.status === 200, `HTTP ${pw.status} in ${pw.elapsed}ms`);
  check('/pet-waste response time < 3s', pw.elapsed < 3000, `${pw.elapsed}ms`);
  check('/pet-waste has pet-waste-specific title', /pet waste|free first|cleanup/i.test(pw.body));
  check('/pet-waste has form', /<form/i.test(pw.body));
  check('/pet-waste has phone CTA', /727.313.8011|7273138011/i.test(pw.body));

  // ── 3. No fabricated star ratings (trust signal) ─────────
  console.log('\n' + c('bold', 'Step 3: No fabricated trust claims'));
  const hasFakeStars = /Rated 4\.9 by your neighbors/i.test(pw.body)
    || /★★★★★ Rated/i.test(pw.body);
  check('No fabricated "Rated 4.9" claim on /pet-waste', !hasFakeStars,
    hasFakeStars ? 'FOUND FABRICATED RATING — remove before launch' : 'clean');

  // ── 4. GA4 wiring (conditional) ───────────────────────────
  console.log('\n' + c('bold', 'Step 4: GA4 wiring (if configured)'));
  const ga4Match = home.body.match(/G-[A-Z0-9]{6,12}/);
  if (ga4Match) {
    log('ok', `GA4 measurement ID found: ${ga4Match[0]}`);
    check('GA4 gtag script in page source', /gtag\(/i.test(home.body)
      || /googletagmanager\.com/i.test(home.body));
  } else {
    log('warn', 'No GA4 measurement ID detected. Set NEXT_PUBLIC_GA4_MEASUREMENT_ID in Vercel.');
    warned++;
  }

  // ── 5. Meta Pixel wiring (conditional) ─────────────────────
  console.log('\n' + c('bold', 'Step 5: Meta Pixel wiring (if configured)'));
  const metaMatch = home.body.match(/fbq\(['"]init['"],\s*['"](\d+)['"]/);
  if (metaMatch) {
    log('ok', `Meta Pixel ID found: ${metaMatch[1]}`);
    check('Meta fbq base code in page source', /fbq\(['"]track['"]/i.test(home.body)
      || /connect\.facebook\.net/i.test(home.body));
  } else {
    log('warn', 'No Meta Pixel detected. Set NEXT_PUBLIC_META_PIXEL_ID in Vercel.');
    warned++;
  }

  // ── 6. Form submission (the critical end-to-end) ──────────
  console.log('\n' + c('bold', 'Step 6: /api/lead form submission'));
  const lead = await postLead();
  check('/api/lead returns 200', lead.status === 200, `HTTP ${lead.status} in ${lead.elapsed}ms`);
  check('/api/lead response time < 5s', lead.elapsed < 5000, `${lead.elapsed}ms`);
  if (lead.body) {
    if (lead.body.ok) {
      log('ok', `lead accepted: ${JSON.stringify(lead.body)}`);
    } else {
      log('fail', `lead rejected: ${lead.body.error ?? JSON.stringify(lead.body)}`);
      failed++;
    }
  } else {
    log('fail', '/api/lead returned no JSON body');
    failed++;
  }

  // ── 7. Summary ────────────────────────────────────────────
  header('SUMMARY');
  console.log(`  Checks passed:  ${c('green', String(passed))}`);
  console.log(`  Checks failed:  ${c('red', String(failed))}`);
  console.log(`  Warnings:       ${c('yellow', String(warned))}`);
  console.log();
  if (failed === 0 && warned === 0) {
    console.log(c('green', c('bold', '  ✓ Production site is fully wired and responsive.')));
  } else if (failed === 0) {
    console.log(c('yellow', c('bold', '  ⚠ Site is functional but has warnings to review.')));
  } else {
    console.log(c('red', c('bold', '  ✗ Site has failures. Do not flip the ad switch.')));
  }
  console.log();
  console.log(c('gray', '  Note: this script does NOT verify real email delivery.'));
  console.log(c('gray', '  Submit a test lead above, then check 44thefool44@gmail.com'));
  console.log(c('gray', '  within 30 seconds. That is the end-to-end proof.'));
  console.log();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  log('fail', `smoke test crashed: ${err.message}`);
  console.error(err);
  process.exit(1);
});
