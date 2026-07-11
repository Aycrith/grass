/**
 * testing/charter/capabilities-have-tests.test.ts — Charter binding: capabilities must have tests.
 *
 * Charter principle: "Every capability must be tested."
 * Iterates state/capability-registry.yaml and asserts each active capability has at least
 * one corresponding test file under testing/capabilities/.
 */

import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const REGISTRY = 'state/capability-registry.yaml';
const TEST_DIR = 'testing/capabilities';

// Minimal YAML parser (same shape as scripts/lint-capabilities.ts)
function loadCapabilities(): { id: string; status: string }[] {
  const content = readFileSync(REGISTRY, 'utf-8');
  const lines = content.split('\n');
  const caps: { id: string; status: string }[] = [];
  let current: { id?: string; status?: string } | null = null;

  for (const line of lines) {
    const stripped = line.replace(/\s+$/, '');
    const newCap = stripped.match(/^\s*-\s+cap_id\s*:\s*(.*)$/);
    if (newCap?.[1] !== undefined) {
      if (current?.id) caps.push({ id: current.id, status: current.status ?? '' });
      current = { id: newCap[1].trim() };
      continue;
    }
    const field = stripped.match(/^\s+status\s*:\s*(.*)$/);
    if (field?.[1] !== undefined && current) current.status = field[1].trim();
  }
  if (current?.id) caps.push({ id: current.id, status: current.status ?? '' });
  return caps;
}

describe('charter: capabilities must have tests', () => {
  if (!existsSync(REGISTRY)) {
    test('registry exists', () => {
      expect(existsSync(REGISTRY)).toBe(true);
    });
    return;
  }
  const caps = loadCapabilities();
  for (const cap of caps) {
    if (cap.status === 'deprecated' || cap.status === 'reserved') continue;
    const expectedTest = join(TEST_DIR, `${cap.id}.test.ts`);
    test(`${cap.id} (${cap.status}) has test file`, () => {
      expect(existsSync(expectedTest)).toBe(true);
    });
  }
});
