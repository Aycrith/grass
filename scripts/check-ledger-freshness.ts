#!/usr/bin/env bun
/**
 * check-ledger-freshness.ts — Warn when state ledger is stale (>7 days)
 *
 * Charter principle: "This ledger is the canonical project handoff mechanism
 * for every future agent." A stale ledger means a future agent cannot resume
 * work without loss of context.
 *
 * Day-2 stub: exits 0 until state/ledger.yaml exists (Day 3).
 */

import { existsSync, statSync } from 'node:fs';

const LEDGER = 'state/ledger.yaml';
const STALE_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

if (!existsSync(LEDGER)) {
  console.log(`✓ ledger-freshness: ${LEDGER} not yet present (Day 3 target). Skipping.`);
  process.exit(0);
}

const stats = statSync(LEDGER);
const ageDays = (Date.now() - stats.mtimeMs) / MS_PER_DAY;

if (ageDays > STALE_DAYS) {
  console.error(
    `✗ ledger-freshness: ${LEDGER} last modified ${ageDays.toFixed(1)} days ago (limit: ${STALE_DAYS}).`,
  );
  console.error('  Charter violation. Update state ledger before committing.');
  process.exit(1);
}

console.log(
  `✓ ledger-freshness: ${LEDGER} is ${ageDays.toFixed(1)} days old (limit: ${STALE_DAYS}).`,
);
process.exit(0);
