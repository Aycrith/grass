/**
 * testing/charter/twin-models-coverage.test.ts — Charter binding: twin models must have invariant tests.
 *
 * Charter principle: every digital twin model in architecture/twin/ must have ≥1 invariant test.
 * Stubs are allowed when the model has zero invariants defined (charter permits early-phase models).
 */

import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TWIN_DIR = 'architecture/twin';
const TEST_DIR = 'testing/twin';

function loadTwinModels(): string[] {
  if (!existsSync(TWIN_DIR)) return [];
  return readdirSync(TWIN_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => f.replace(/\.md$/, ''));
}

function hasInvariants(modelName: string): boolean {
  const path = join(TWIN_DIR, `${modelName}.md`);
  if (!existsSync(path)) return false;
  const content = readFileSync(path, 'utf-8');
  return /^##\s+Invariants\s*$/m.test(content);
}

describe('charter: twin model coverage', () => {
  const models = loadTwinModels();
  for (const model of models) {
    if (!hasInvariants(model)) continue;
    const expectedTest = join(TEST_DIR, `${model}.test.ts`);
    test(`${model} has invariant test`, () => {
      expect(existsSync(expectedTest)).toBe(true);
    });
  }
});
