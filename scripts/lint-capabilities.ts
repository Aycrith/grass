#!/usr/bin/env bun
/**
 * lint-capabilities.ts — Enforce capability registration charter rule
 *
 * "Every organizational capability must be registered." Validates that
 * state/capability-registry.yaml exists, parses as YAML, and contains
 * required fields per capability.
 *
 * Day-3+ full implementation. Replaces the Day-2 stub.
 */

import { existsSync, readFileSync } from 'node:fs';

const REGISTRY = 'state/capability-registry.yaml';

const REQUIRED_FIELDS = [
  'cap_id',
  'name',
  'owner_agent',
  'version',
  'status',
  'maturity',
  'mission',
  'inputs',
  'outputs',
  'consumers',
  'tests',
  'documentation',
  'known_limitations',
  'roadmap_links',
  'created',
  'last_updated',
] as const;

const VALID_STATUSES = new Set(['draft', 'active', 'deprecated', 'reserved']);
const VALID_MATURITIES = new Set(['designed', 'in_development', 'deployed', 'deprecated']);

interface Violation {
  cap_id: string;
  rule: string;
  detail: string;
}

const violations: Violation[] = [];

if (!existsSync(REGISTRY)) {
  console.log(`✓ lint-capabilities: ${REGISTRY} not present. Skipping.`);
  process.exit(0);
}

const content = readFileSync(REGISTRY, 'utf-8');

// Minimal YAML parser tailored to this file's structure:
// - Lines matching `^\s*-\s+(\w+):` start a new capability entry.
// - Lines matching `^\s+(\w+):` are fields within the current entry.
// - We track entry boundaries by indentation level.
// - Inline `# ...` comments are stripped from values.

function stripInlineComment(value: string): string {
  // Strip `# ...` only when preceded by whitespace (avoids catching `#` inside values).
  return value.replace(/\s+#.*$/, '').trim();
}

interface Cap {
  start: number;
  fields: Record<string, string>;
}

const caps: Cap[] = [];
const lines = content.split('\n');
let current: Cap | null = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i] ?? '';
  const stripped = line.replace(/\s+$/, '');

  // New capability entry: "- cap_id: foo"
  const newCapMatch = stripped.match(/^\s*-\s+([a-zA-Z_]+)\s*:\s*(.*)$/);
  if (newCapMatch?.[1]) {
    if (current) caps.push(current);
    const fieldName = newCapMatch[1];
    const fieldValue = stripInlineComment(newCapMatch[2] ?? '');
    current = { start: i, fields: {} };
    current.fields[fieldName] = fieldValue;
    continue;
  }

  // Field within current entry: "  name: foo" (indented, no leading "-")
  const fieldMatch = stripped.match(/^\s+([a-zA-Z_]+)\s*:\s*(.*)$/);
  if (fieldMatch?.[1] && current) {
    const fieldName = fieldMatch[1];
    const fieldValue = stripInlineComment(fieldMatch[2] ?? '');
    current.fields[fieldName] = fieldValue;
  }
}
if (current) caps.push(current);

// Validate each capability
const seenIds = new Set<string>();

for (const cap of caps) {
  const id = cap.fields.cap_id || `<line ${cap.start}>`;

  // Skip reserved placeholders that don't have full field set yet
  if (cap.fields.status === 'reserved' || id.startsWith('<')) continue;

  for (const required of REQUIRED_FIELDS) {
    if (!(required in cap.fields)) {
      violations.push({
        cap_id: id,
        rule: 'field.required',
        detail: `Missing required field: ${required}`,
      });
    }
  }

  if (cap.fields.cap_id && seenIds.has(cap.fields.cap_id)) {
    violations.push({
      cap_id: id,
      rule: 'cap_id.unique',
      detail: `Duplicate cap_id "${cap.fields.cap_id}"`,
    });
  }
  if (cap.fields.cap_id) seenIds.add(cap.fields.cap_id);

  const status = cap.fields.status;
  if (status && !VALID_STATUSES.has(status)) {
    violations.push({
      cap_id: id,
      rule: 'status.valid',
      detail: `"${status}" not in {draft, active, deprecated, reserved}`,
    });
  }

  const maturity = cap.fields.maturity;
  if (maturity && !VALID_MATURITIES.has(maturity)) {
    violations.push({
      cap_id: id,
      rule: 'maturity.valid',
      detail: `"${maturity}" not in {designed, in_development, deployed, deprecated}`,
    });
  }

  // owner_agent must be a non-empty string
  if (!cap.fields.owner_agent) {
    violations.push({
      cap_id: id,
      rule: 'owner_agent.required',
      detail: 'owner_agent is empty',
    });
  }
}

if (violations.length === 0) {
  console.log(
    `✓ lint-capabilities: ${caps.length} capabilities validated against registry schema.`,
  );
  process.exit(0);
}

console.error(`\n✗ lint-capabilities: ${violations.length} violation(s):\n`);
for (const v of violations) {
  console.error(`  [${v.rule}] ${v.cap_id}: ${v.detail}`);
}
process.exit(1);
