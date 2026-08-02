#!/usr/bin/env node
/**
 * Vercel deploy helper for the GRASS web app.
 *
 * Wraps the `vercel` CLI with the specific flow for this monorepo:
 *   1. Checks that the vercel CLI is installed
 *   2. Confirms vercel.json is in the right place
 *   3. Walks through the env var checklist
 *   4. Triggers the deploy
 *   5. Runs the smoke test against the deployed URL
 *
 * Usage:
 *   node scripts/deploy-vercel.mjs           # interactive
 *   node scripts/deploy-vercel.mjs --prod    # force production
 *   node scripts/deploy-vercel.mjs --dry-run # walk through, don't deploy
 *
 * The script does NOT type passwords or bypass 2FA. The Vercel
 * CLI's `vercel login` opens a browser, the user completes auth
 * in the browser, and the CLI receives the token. Same pattern
 * for env vars: the user pastes values into the Vercel dashboard
 * (this script does not write secrets to disk).
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(WEB_ROOT, '..', '..');
const VERCEL_JSON = join(WEB_ROOT, 'vercel.json');
const ENV_EXAMPLE = join(REPO_ROOT, 'output', 'gtm', '19-vercel-env.example');

const COLORS = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  red: '\x1b[31m', green: '\x1b[32m',
  yellow: '\x1b[33m', cyan: '\x1b[36m', gray: '\x1b[90m',
};
const c = (k, s) => `${COLORS[k]}${s}${COLORS.reset}`;

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const PROD = args.has('--prod');

function log(level, msg) {
  const tag = {
    info: c('cyan', '[i]'),
    ok: c('green', '[✓]'),
    fail: c('red', '[✗]'),
    warn: c('yellow', '[!]'),
  }[level];
  console.log(`${tag} ${msg}`);
}

function header(t) {
  console.log('\n' + c('bold', '═'.repeat(64)));
  console.log(c('bold', `  ${t}`));
  console.log(c('bold', '═'.repeat(64)));
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts });
}

function tryRun(cmd) {
  try {
    return { ok: true, out: run(cmd) };
  } catch (err) {
    return { ok: false, out: err.stdout?.toString() ?? '', err: err.message };
  }
}

function prompt(question) {
  // Synchronous stdin read — Vercel deploy is a one-shot, no event loop needed.
  process.stdout.write(c('cyan', question + ' '));
  const buf = Buffer.alloc(1024);
  const fd = 0; // stdin
  const n = require('node:fs').readSync(fd, buf, 0, buf.length, null);
  return buf.toString('utf8', 0, n).trim();
}

async function main() {
  header('VERCEL DEPLOY HELPER — GRASS web app');
  console.log(c('gray', `  Web root:    ${WEB_ROOT}`));
  console.log(c('gray', `  Vercel JSON: ${VERCEL_JSON}`));
  console.log(c('gray', `  Env guide:   ${ENV_EXAMPLE}`));
  console.log(c('gray', `  Mode:        ${DRY_RUN ? 'dry-run' : PROD ? 'production' : 'preview'}`));

  // ── Step 1: check vercel CLI ─────────────────────────────
  console.log('\n' + c('bold', 'Step 1: vercel CLI present'));
  const cli = tryRun('vercel --version');
  if (!cli.ok) {
    log('fail', 'vercel CLI not found.');
    log('info', 'Install with: npm i -g vercel  (or  bun add -g vercel)');
    log('info', 'Then re-run this script.');
    process.exit(1);
  }
  log('ok', `vercel CLI: ${cli.out.trim()}`);

  // ── Step 2: vercel.json sanity check ──────────────────────
  console.log('\n' + c('bold', 'Step 2: vercel.json sanity check'));
  if (!existsSync(VERCEL_JSON)) {
    log('fail', `vercel.json not found at ${VERCEL_JSON}`);
    process.exit(1);
  }
  const v = JSON.parse(readFileSync(VERCEL_JSON, 'utf8'));
  log('ok', `framework: ${v.framework ?? 'auto'}`);
  log('ok', `buildCommand: ${v.buildCommand ?? '(default)'}`);
  log('ok', `installCommand: ${v.installCommand ?? '(default)'}`);
  log('ok', `regions: ${(v.regions ?? []).join(', ')}`);

  // ── Step 3: login check ───────────────────────────────────
  console.log('\n' + c('bold', 'Step 3: vercel login state'));
  const who = tryRun('vercel whoami');
  if (who.ok) {
    log('ok', `logged in as: ${who.out.trim().split('\n')[0]}`);
  } else {
    log('warn', 'not logged in to vercel');
    log('info', 'running `vercel login` — this will open a browser');
    if (DRY_RUN) {
      log('warn', 'dry-run: skipping login');
    } else {
      const r = spawnSync('vercel', ['login'], { stdio: 'inherit' });
      if (r.status !== 0) {
        log('fail', 'login failed');
        process.exit(1);
      }
    }
  }

  // ── Step 4: link project (idempotent) ─────────────────────
  console.log('\n' + c('bold', 'Step 4: link to Vercel project'));
  if (DRY_RUN) {
    log('warn', 'dry-run: skipping `vercel link`');
  } else {
    const link = spawnSync('vercel', ['link', '--yes'], {
      cwd: WEB_ROOT, stdio: 'inherit',
    });
    if (link.status !== 0) {
      log('fail', 'vercel link failed');
      process.exit(1);
    }
  }

  // ── Step 5: env var checklist ─────────────────────────────
  console.log('\n' + c('bold', 'Step 5: environment variables'));
  log('info', 'required env vars are documented in:');
  log('info', `  ${ENV_EXAMPLE}`);
  log('info', 'set them in: Vercel dashboard → Project → Settings → Environment Variables');
  console.log();
  const proceed = prompt('Have you set all the required env vars? (y/N)');
  if (proceed.toLowerCase() !== 'y') {
    log('warn', 'paused. set the env vars in the Vercel dashboard, then re-run.');
    log('info', 'see output/gtm/15-pre-launch-runbook.md for the full list');
    process.exit(0);
  }
  log('ok', 'env vars confirmed');

  // ── Step 6: trigger deploy ────────────────────────────────
  console.log('\n' + c('bold', 'Step 6: trigger deploy'));
  if (DRY_RUN) {
    log('warn', 'dry-run: skipping deploy');
  } else {
    const target = PROD ? '--prod' : '';
    const r = spawnSync('vercel', [target, '--yes'], {
      cwd: WEB_ROOT, stdio: 'inherit',
    });
    if (r.status !== 0) {
      log('fail', 'vercel deploy failed');
      process.exit(1);
    }
  }

  // ── Step 7: post-deploy smoke test ────────────────────────
  console.log('\n' + c('bold', 'Step 7: smoke test'));
  if (DRY_RUN) {
    log('warn', 'dry-run: skipping smoke test');
    log('info', 'after deploy, run: node scripts/smoke-test-prod.mjs <url>');
  } else {
    const url = prompt('deployed URL (e.g. https://largolawn.pro):');
    if (url) {
      log('info', `running smoke test against ${url}`);
      const r = spawnSync('node', [
        resolve(__dirname, 'smoke-test-prod.mjs'),
        url,
      ], { stdio: 'inherit' });
      if (r.status !== 0) {
        log('warn', 'smoke test reported issues — see output above');
        log('info', 'fix env vars or page wiring, then re-run this script');
      }
    }
  }

  header('DONE');
  console.log(c('green', '  ✓ deploy complete (or dry-run finished)'));
  console.log();
  console.log(c('gray', '  next: run the pre-launch runbook at'));
  console.log(c('gray', '  output/gtm/15-pre-launch-runbook.md'));
  console.log();
}

main().catch((err) => {
  log('fail', `deploy helper crashed: ${err.message}`);
  console.error(err);
  process.exit(1);
});
