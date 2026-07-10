#!/usr/bin/env bun
/**
 * charter-compliance.ts — Top-level charter compliance sweep
 *
 * Runs all charter enforcement scripts:
 *   - lint-agents.ts (every agent spec matches schema)
 *   - lint-capabilities.ts (every capability registered)
 *   - check-ledger-freshness.ts (state ledger <=7 days old)
 *
 * Charter principle: "Every capability must be documented, tested,
 * versioned, measurable, and discoverable."
 */

import { $ } from 'bun';

const SCRIPTS = [
  'scripts/lint-agents.ts',
  'scripts/lint-capabilities.ts',
  'scripts/check-ledger-freshness.ts',
];

let failed = 0;
for (const script of SCRIPTS) {
  console.log(`\n─── Running ${script} ───`);
  const result = await $`bun run ${script}`.nothrow();
  if (result.exitCode !== 0) {
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n✗ Charter compliance: ${failed} check(s) failed.`);
  process.exit(1);
}

console.log('\n✓ Charter compliance: all checks passed (or no targets yet).');
process.exit(0);
