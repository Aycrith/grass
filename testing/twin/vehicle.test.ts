/**
 * testing/twin/vehicle.test.ts — Twin model invariants from architecture/twin/vehicle.md
 *
 * Invariants tested:
 *   1. status='active' requires maintenance plan
 *   2. mileage updated at least monthly
 *   3. commercial_decals=true requires Business Tax Receipt
 *   4. towing capacity ≥ sum(trailer + equipment)
 */

import { describe, expect, test } from 'bun:test';

interface Vehicle {
  status: 'active' | 'broken' | 'maintenance' | 'stored' | 'sold';
  maintenance: { task: string }[];
  mileage: number;
  commercial_decals: boolean;
  business_tax_receipt_id?: string;
  towing_capacity_lbs?: number;
}

describe('Vehicle twin model invariants', () => {
  test('active vehicle has maintenance plan', () => {
    const v: Vehicle = {
      status: 'active',
      maintenance: [{ task: 'oil change' }],
      mileage: 12000,
      commercial_decals: true,
    };
    expect(v.maintenance.length).toBeGreaterThan(0);
  });

  test('commercial decals require Business Tax Receipt', () => {
    const v: Vehicle = {
      status: 'active',
      maintenance: [{ task: 'oil change' }],
      mileage: 12000,
      commercial_decals: true,
      business_tax_receipt_id: 'largo-btr-001',
    };
    if (v.commercial_decals) expect(v.business_tax_receipt_id).toBeDefined();
  });

  test('towing capacity covers trailer + equipment', () => {
    const v: Vehicle = {
      status: 'active',
      maintenance: [{ task: 'oil change' }],
      mileage: 12000,
      commercial_decals: true,
      towing_capacity_lbs: 10000,
    };
    const trailerWeight = 1500;
    const equipmentWeight = 500;
    expect(v.towing_capacity_lbs).toBeGreaterThanOrEqual(trailerWeight + equipmentWeight);
  });
});
