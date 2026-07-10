#!/usr/bin/env bun
/**
 * lint-capabilities.ts — Enforce capability registration charter rule
 *
 * "Every organizational capability must be registered" — capability_id,
 * owner_agent, version, inputs, outputs, consumers, tests, documentation.
 *
 * Day-2 stub: exits 0 until state/capability-registry.yaml exists (Day 3).
 * Full implementation lands Day 3 with seed landscaping capabilities.
 */

import { existsSync } from 'node:fs';

const REGISTRY = 'state/capability-registry.yaml';

if (!existsSync(REGISTRY)) {
  console.log(`✓ lint-capabilities: ${REGISTRY} not yet present (Day 3 target). Skipping.`);
  process.exit(0);
}

console.log(
  '\n⚠ lint-capabilities: STUB MODE — Day-2. Full registry schema enforcement lands Day 3.',
);
console.log(
  '  Will validate: every entry has cap_id, owner_agent, version, inputs, outputs, consumers, tests, documentation, maturity.',
);
console.log('  Will block commits where new code paths reference unregistered capabilities.');
process.exit(0);
