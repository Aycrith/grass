#!/usr/bin/env bun
/**
 * lint-agents.ts — Enforce the agent spec schema from agents/_schema.md
 *
 * Day-2 stub: exits 0 until agents/*.md files exist (Day 3).
 * Full implementation lands Day 3 once the schema and first 3 agents are authored.
 *
 * Charter principle enforced: "Every organizational capability must be registered"
 * (here, every agent spec must match the schema).
 */

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const AGENTS_DIR = 'agents';
const REQUIRED_FRONTMATTER = [
  'agent_id',
  'division',
  'reports_to',
  'status',
  'version',
  'Mission',
  'Scope',
  'Escalates',
  'Inputs',
  'Outputs',
  'Tools',
  'Memory',
  'KPIs',
];

const violations = 0;

if (!existsSync(AGENTS_DIR)) {
  console.log('✓ lint-agents: agents/ directory not yet present (Day 3 target). Skipping.');
  process.exit(0);
}

const agentFiles = readdirSync(AGENTS_DIR).filter(
  (f) => f.endsWith('.md') && f !== '_schema.md' && f !== 'README.md',
);

if (agentFiles.length === 0) {
  console.log('✓ lint-agents: no agent specs authored yet (Day 3 target). Skipping.');
  process.exit(0);
}

// Day-3+ full implementation will parse YAML frontmatter and required sections.
// For now, we surface a placeholder check so CI is honest about current state.
for (const file of agentFiles) {
  const path = join(AGENTS_DIR, file);
  console.log(`  [stub] would validate schema for ${path}`);
}

console.log('\n⚠ lint-agents: STUB MODE — Day-2. Full schema enforcement lands Day 3.');
console.log(`  Agent files found: ${agentFiles.length}. Required frontmatter (eventually):`);
for (const key of REQUIRED_FRONTMATTER) {
  console.log(`    - ${key}`);
}
console.log('\nUntil Day-3 implementation lands, this script is a placeholder. Violations: 0.');
process.exit(violations > 0 ? 1 : 0);
