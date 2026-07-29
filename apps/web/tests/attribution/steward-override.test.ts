/**
 * steward-override.test.ts — Stage 3 acceptance: lifecycle_stage_override
 * wins over derived stage, and override requires a steward principal.
 *
 * Per plan `review-the-plans-recently-lucky-catmull.md` Stage 3 §11 R-10:
 *   "Steward manual override misuse. lifecycle_stage_override could set
 *    any LifecycleStage without going through the action guards at
 *    service.ts:177, :196. Mitigation: override write path requires
 *    principal.role === 'steward'."
 *
 * Run with:  bun test apps/web/tests/attribution/steward-override.test.ts
 *
 * Strategy: split into two concerns —
 *   1) The pure-function `leadLifecycleStage()` honors any non-null
 *      override value (the derivation simply returns it). The OVERRIDE
 *      is the audit signal; the caller's write path is what enforces
 *      the steward principal check.
 *   2) `setLifecycleOverride()` produces the correct (override, _at, _by)
 *      trio. Service-layer tests at platform/packages/crm-core/ cover
 *      the actual `requireSteward` gate.
 */

import { describe, expect, it } from 'bun:test';

import { type LifecycleInputs, leadLifecycleStage, setLifecycleOverride } from '@grass/crm-core';

const NOW = '2026-07-29T12:00:00.000Z';

type LeadOverrides = {
  [K in keyof LifecycleInputs['lead']]?: LifecycleInputs['lead'][K] | undefined;
};

function baseLead(overrides: LeadOverrides = {}): LifecycleInputs['lead'] {
  return {
    created_at: NOW,
    ...overrides,
  } as LifecycleInputs['lead'];
}

describe('lifecycle: steward override wins over derivation', () => {
  it('override="retained" returns retained even with no related records', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ lifecycle_stage_override: 'retained' }),
    });
    expect(stage).toBe('retained');
  });

  it('override="new" forces a brand-new stage even after first_response_at', () => {
    // Use case: re-engagement campaign — steward marks a Lead "new"
    // because they want it re-entered into the funnel.
    const stage = leadLifecycleStage({
      lead: baseLead({
        first_response_at: NOW,
        lifecycle_stage_override: 'new',
      }),
    });
    expect(stage).toBe('new');
  });

  it('override="booked" advances past quoted even without a Job', () => {
    // Use case: CRM migration — booking recorded in legacy system
    // before crm-core was wired. Steward forces the stage.
    const stage = leadLifecycleStage({
      lead: baseLead({
        first_response_at: NOW,
        lifecycle_stage_override: 'booked',
      }),
      quote: { status: 'sent' },
    });
    expect(stage).toBe('booked');
  });

  it('null override falls through to derivation', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
    });
    expect(stage).toBe('contacted');
  });
});

describe('lifecycle: setLifecycleOverride helper', () => {
  it('returns the override trio with current timestamp', () => {
    const before = Date.now();
    const override = setLifecycleOverride('invoice_paid', 'human:steward');
    const after = Date.now();

    expect(override.lifecycle_stage_override).toBe('invoice_paid');
    expect(override.lifecycle_stage_override_by).toBe('human:steward');

    // ISO 8601 UTC, parseable, between the before/after timestamps.
    const stamped = new Date(override.lifecycle_stage_override_at as string).getTime();
    expect(stamped).toBeGreaterThanOrEqual(before);
    expect(stamped).toBeLessThanOrEqual(after);
  });

  it('produces an override that leadLifecycleStage honors', () => {
    const override = setLifecycleOverride('retained', 'human:steward');
    const stage = leadLifecycleStage({
      lead: baseLead({
        lifecycle_stage_override: override.lifecycle_stage_override,
      }),
    });
    expect(stage).toBe('retained');
  });

  it('accepts every LifecycleStage token', () => {
    const stages = ['new', 'contacted', 'quoted', 'booked', 'invoice_paid', 'retained'] as const;
    for (const stage of stages) {
      const override = setLifecycleOverride(stage, 'human:steward');
      expect(override.lifecycle_stage_override).toBe(stage);
    }
  });
});
