#!/usr/bin/env bun
/**
 * check-ledger-freshness.ts — Enforce "state ledger always-current" rule.
 *
 * Charter principle: "Maintain a machine-readable organizational state."
 * CLAUDE.md hard rule: if state/ledger.yaml is older than 7 days, MUST be flagged.
 *
 * Reads state/ledger.yaml, looks for the `last_updated:` comment header and
 * the file's mtime, and exits 1 if either is older than the freshness
 * threshold (default: 7 days).
 */

import { readFileSync, statSync } from 'node:fs';

const LEDGER = 'state/ledger.yaml';
const FRESHNESS_DAYS = 7;

function parseHeaderDate(content: string): Date | null {
  // Accept either "Last updated: 2026-07-10" inside a comment, or a YYYY-MM-DD
  // on a line of its own. Returns the first match.
  const m = content.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/i);
  if (m?.[1]) return new Date(m[1]);
  const m2 = content.match(/^(\d{4}-\d{2}-\d{2})/m);
  return m2?.[1] ? new Date(m2[1]) : null;
}

const headerDate = (() => {
  try {
    return parseHeaderDate(readFileSync(LEDGER, 'utf-8'));
  } catch {
    return null;
  }
})();

const fileMtime = (() => {
  try {
    return statSync(LEDGER).mtime;
  } catch {
    return null;
  }
})();

const now = new Date();

function ageDaysString(d: Date | null): string {
  if (!d) return 'unknown';
  const ms = now.getTime() - d.getTime();
  const days = ms / (24 * 60 * 60 * 1000);
  return days.toFixed(1);
}

if (!headerDate && !fileMtime) {
  console.error(`✗ ledger-freshness: ${LEDGER} not found or unreadable.`);
  process.exit(1);
}

const headerAgeStr = ageDaysString(headerDate);
const mtimeAgeStr = ageDaysString(fileMtime);

const oldestDate: Date | null = (() => {
  const candidates: Date[] = [];
  if (headerDate) candidates.push(headerDate);
  if (fileMtime) candidates.push(fileMtime);
  return candidates.length ? new Date(Math.min(...candidates.map((d) => d.getTime()))) : null;
})();

if (!oldestDate) {
  console.error(`✗ ledger-freshness: cannot determine staleness for ${LEDGER}.`);
  process.exit(1);
}

const ageDays = (now.getTime() - oldestDate.getTime()) / (24 * 60 * 60 * 1000);

if (ageDays > FRESHNESS_DAYS) {
  console.error(
    `\n✗ ledger-freshness: ${LEDGER} is ${ageDays.toFixed(1)} days old (limit: ${FRESHNESS_DAYS}).\n  Header age: ${headerAgeStr} days\n  File mtime age: ${mtimeAgeStr} days\n  Update the ledger per the cadence in CLAUDE.md before proceeding.`,
  );
  process.exit(1);
}

console.log(
  `✓ ledger-freshness: ${LEDGER} is ${ageDays.toFixed(1)} days old (limit: ${FRESHNESS_DAYS}).`,
);
process.exit(0);
