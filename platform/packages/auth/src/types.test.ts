/**
 * @grass/auth/types.test — Authority ladder coverage.
 */

import { describe, expect, test } from 'bun:test';
import { AuthorityError, type Principal, assertCan, can } from './types.ts';

const customer: Principal = { kind: 'customer', customer_id: 'c_1' };
const crew: Principal = { kind: 'crew_member', person_id: 'p_1', crew_id: 'cr_1' };
const steward: Principal = { kind: 'steward', agent: 'human:steward' };
const system: Principal = { kind: 'system', workflow_id: 'wf_test' };

describe('@grass/auth authority ladder', () => {
  test('customer:read_own allowed for customer only', () => {
    expect(can(customer, 'customer:read_own')).toBe(true);
    expect(can(crew, 'customer:read_own')).toBe(false);
    expect(can(steward, 'customer:read_own')).toBe(false);
    expect(can(system, 'customer:read_own')).toBe(false);
  });

  test('lead:create allowed for everyone (web form, SMS, etc.)', () => {
    for (const p of [customer, crew, steward, system]) {
      expect(can(p, 'lead:create')).toBe(true);
    }
  });

  test('customer:churn steward-only', () => {
    expect(can(steward, 'customer:churn')).toBe(true);
    expect(can(system, 'customer:churn')).toBe(false);
    expect(can(customer, 'customer:churn')).toBe(false);
    expect(can(crew, 'customer:churn')).toBe(false);
  });

  test('invoice:refund steward-only (irreversible)', () => {
    expect(can(steward, 'invoice:refund')).toBe(true);
    expect(can(system, 'invoice:refund')).toBe(false);
    expect(can(customer, 'invoice:refund')).toBe(false);
    expect(can(crew, 'invoice:refund')).toBe(false);
  });

  test('discount ladder: small = all active agents, medium/large = steward only', () => {
    expect(can(crew, 'discount:apply_small')).toBe(true);
    expect(can(crew, 'discount:apply_medium')).toBe(false);
    expect(can(crew, 'discount:apply_large')).toBe(false);
    expect(can(steward, 'discount:apply_medium')).toBe(true);
    expect(can(steward, 'discount:apply_large')).toBe(true);
  });

  test('hurricane:trigger_mode is steward+system only', () => {
    expect(can(steward, 'hurricane:trigger_mode')).toBe(true);
    expect(can(system, 'hurricane:trigger_mode')).toBe(true);
    expect(can(customer, 'hurricane:trigger_mode')).toBe(false);
    expect(can(crew, 'hurricane:trigger_mode')).toBe(false);
  });

  test('decision:ratify is steward-only', () => {
    expect(can(steward, 'decision:ratify')).toBe(true);
    expect(can(system, 'decision:ratify')).toBe(false);
    expect(can(customer, 'decision:ratify')).toBe(false);
    expect(can(crew, 'decision:ratify')).toBe(false);
  });

  test('assertCan throws AuthorityError for disallowed action', () => {
    expect(() => assertCan(customer, 'customer:churn')).toThrow(AuthorityError);
    try {
      assertCan(customer, 'customer:churn');
    } catch (e) {
      expect(e).toBeInstanceOf(AuthorityError);
      if (e instanceof AuthorityError) {
        expect(e.action).toBe('customer:churn');
        expect(e.principal.kind).toBe('customer');
      }
    }
  });
});
