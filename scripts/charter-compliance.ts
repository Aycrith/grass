#!/usr/bin/env bun
/**
 * charter-compliance.ts — Top-level charter compliance aggregator.
 *
 * Runs every charter-binding check (lint-agents, lint-capabilities,
 * ledger-freshness) and returns a single pass/fail exit status.
 * Invoked by `bun run test:charter` and CI's charter-compliance job.
 *
 * Charter principle: "Every charter-binding invariant must be enforceable
 * from CI, not just by review."
 */

import { spawnSync } from 'node:child_process';

interface CheckResult {
  name: string;
  script: string;
  ok: boolean;
}

const results: CheckResult[] = [];

// Inline the child-process spawns here rather than import the other scripts,
// because each script already has its own exit code contract and we just want
// to chain them with a single combined status.

function run(name: string, script: string): void {
  const r = spawnSync('bun', ['run', script], { stdio: 'inherit' });
  results.push({ name, script, ok: r.status === 0 });
}

run('lint-agents', 'scripts/lint-agents.ts');
run('lint-capabilities', 'scripts/lint-capabilities.ts');
run('ledger-freshness', 'scripts/check-ledger-freshness.ts');

console.log('\n--- Charter compliance summary ---');
for (const r of results) {
  console.log(`${r.ok ? '✓' : '✗'} ${r.name} (${r.script})`);
}
const allOk = results.every((r) => r.ok);
console.log(
  allOk ? '\n✓ Charter compliance: all checks passed.' : '\n✗ Charter compliance: failures above.',
);
process.exit(allOk ? 0 : 1);
