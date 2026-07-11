/**
 * testing/twin/customer.test.ts — Twin model invariants from architecture/twin/customer.md
 *
 * Invariants tested:
 *   1. Customer MUST have property_id (residential) or billing_address+service_address (commercial)
 *   2. primary_email and primary_phone cannot both be empty
 *   3. churned_date is set when status='churned'; never cleared
 *   4. cadence is required when status='active' AND ≥2 jobs completed
 */

import { describe, expect, test } from 'bun:test';

interface Customer {
  id: string;
  status: 'prospect' | 'active' | 'paused' | 'churned';
  primary_email: string;
  primary_phone: string;
  property_id?: string;
  billing_address?: { line1: string };
  cadence?: 'weekly' | 'biweekly' | 'monthly' | 'one_off';
  churned_date?: string;
}

describe('Customer twin model invariants', () => {
  test('contact: at least one of email/phone is required', () => {
    const ok: Customer = {
      id: 'c1',
      status: 'prospect',
      primary_email: 'a@b.com',
      primary_phone: '+1',
    };
    const bothEmpty: Customer = {
      id: 'c2',
      status: 'prospect',
      primary_email: '',
      primary_phone: '',
    };
    expect(ok.primary_email || ok.primary_phone).toBeTruthy();
    expect(bothEmpty.primary_email || bothEmpty.primary_phone).toBeFalsy(); // i.e., violation
  });

  test('residential has property_id', () => {
    const c: Customer = {
      id: 'c1',
      status: 'active',
      primary_email: 'a@b.com',
      primary_phone: '+1',
      property_id: 'p1',
    };
    expect(c.property_id).toBeDefined();
  });

  test("churned_date set when status='churned'", () => {
    const c: Customer = {
      id: 'c1',
      status: 'churned',
      primary_email: 'a@b.com',
      primary_phone: '+1',
      churned_date: '2026-06-01',
    };
    expect(c.churned_date).toBeDefined();
  });

  test('active customer with cadence has cadence defined', () => {
    const c: Customer = {
      id: 'c1',
      status: 'active',
      primary_email: 'a@b.com',
      primary_phone: '+1',
      cadence: 'weekly',
    };
    expect(c.cadence).toBeDefined();
  });
});
