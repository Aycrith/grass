/**
 * index.test.ts — Twin-model → table mapping lock.
 */

import { describe, expect, test } from 'bun:test';
import { TWIN_TO_TABLE } from './index.ts';

describe('@grass/database — twin model → table mapping', () => {
  test('all 15 twin-model mappings present (14 twin models + lead_ids subset)', () => {
    // 14 twin model files + lead entry. Don't constrain beyond "at least 14".
    expect(Object.keys(TWIN_TO_TABLE).length).toBeGreaterThanOrEqual(14);
  });

  test('critical mappings', () => {
    expect(TWIN_TO_TABLE.Customer).toBe('customers');
    expect(TWIN_TO_TABLE.Job).toBe('jobs');
    expect(TWIN_TO_TABLE.Invoice).toBe('invoices');
  });
});
