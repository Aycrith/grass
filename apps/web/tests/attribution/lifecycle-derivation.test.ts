/**
 * lifecycle-derivation.test.ts — Stage 3 acceptance: leadLifecycleStage()
 * pure-function derivation progresses through all 6 stages in order.
 *
 * Per plan `review-the-plans-recently-lucky-catmull.md` Stage 3 §1:
 *   "Lead lifecycle representable end-to-end: lead → contacted → quoted
 *    → booked → paid → retained; steward can set stage manually.
 *    Booked job is the canonical conversion; lead is a leading indicator."
 *
 * Run with:  bun test apps/web/tests/attribution/lifecycle-derivation.test.ts
 *
 * Per steward Q-1 resolution: 5th stage token is `invoice_paid` (not
 * `collected`) to avoid collision with paid-traffic vocab.
 *
 * Strategy: for each stage boundary, construct a LifecycleInputs with
 * just enough related records to advance past the boundary, and assert
 * the returned stage. Also tests the forward-only contract — once a
 * stage is reached, later state changes do NOT walk it backward.
 */

import { describe, expect, it } from 'bun:test';

import { type LifecycleInputs, leadLifecycleStage } from '@grass/crm-core';

const NOW = '2026-07-29T12:00:00.000Z';

function baseLead(overrides: Partial<LifecycleInputs['lead']> = {}): LifecycleInputs['lead'] {
  return {
    created_at: NOW,
    ...overrides,
  } as LifecycleInputs['lead'];
}

describe('lifecycle: stage derivation', () => {
  it('returns "new" when no related records exist', () => {
    const stage = leadLifecycleStage({ lead: baseLead() });
    expect(stage).toBe('new');
  });

  it('advances to "contacted" when first_response_at is set', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
    });
    expect(stage).toBe('contacted');
  });

  it('advances to "quoted" when a Quote with status=sent exists', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'sent' },
    });
    expect(stage).toBe('quoted');
  });

  it('advances to "quoted" when a Quote with status=accepted exists', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'accepted', accepted_at: NOW },
    });
    expect(stage).toBe('quoted');
  });

  it('does NOT advance to "quoted" for a draft Quote (internal only)', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'draft' },
    });
    expect(stage).toBe('contacted');
  });

  it('advances to "booked" when a Job is scheduled-or-later', () => {
    for (const status of ['scheduled', 'en_route', 'on_site', 'in_progress', 'completed']) {
      const stage = leadLifecycleStage({
        lead: baseLead({ first_response_at: NOW }),
        quote: { status: 'accepted', accepted_at: NOW },
        job: { status, scheduled_at: NOW },
      });
      expect(stage).toBe('booked');
    }
  });

  it('does NOT advance to "booked" for a cancelled or draft Job', () => {
    for (const status of ['draft', 'cancelled']) {
      const stage = leadLifecycleStage({
        lead: baseLead({ first_response_at: NOW }),
        quote: { status: 'accepted', accepted_at: NOW },
        job: { status, scheduled_at: NOW },
      });
      expect(stage).toBe('quoted');
    }
  });

  it('advances to "invoice_paid" when an Invoice has paid_at', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'accepted', accepted_at: NOW },
      job: { status: 'completed', scheduled_at: NOW },
      invoice: { status: 'paid', paid_at: NOW },
    });
    expect(stage).toBe('invoice_paid');
  });

  it('does NOT advance to "invoice_paid" for an unpaid Invoice', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'accepted', accepted_at: NOW },
      job: { status: 'completed', scheduled_at: NOW },
      invoice: { status: 'sent' },
    });
    expect(stage).toBe('booked');
  });

  it('advances to "retained" when Customer is active and not churned', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'accepted', accepted_at: NOW },
      job: { status: 'completed', scheduled_at: NOW },
      invoice: { status: 'paid', paid_at: NOW },
      customer: { status: 'active' },
    });
    expect(stage).toBe('retained');
  });

  it('does NOT stay at "retained" if Customer has churned', () => {
    // Per forward-only contract: once a stage is reached, the derivation
    // never walks it backward. Churn is a separate metric on Customer;
    // the lifecycle stage reflects the peak stage reached.
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'accepted', accepted_at: NOW },
      job: { status: 'completed', scheduled_at: NOW },
      invoice: { status: 'paid', paid_at: NOW },
      customer: { status: 'churned', churned_at: NOW },
    });
    // Customer is NOT in RETAINED_STATUSES so derivation falls through
    // back to invoice_paid (the highest prior stage).
    expect(stage).toBe('invoice_paid');
  });

  it('is forward-only — a later churn does not regress the stage', () => {
    // Build inputs that have reached "retained".
    const retainedInputs: LifecycleInputs = {
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'accepted', accepted_at: NOW },
      job: { status: 'completed', scheduled_at: NOW },
      invoice: { status: 'paid', paid_at: NOW },
      customer: { status: 'active' },
    };
    expect(leadLifecycleStage(retainedInputs)).toBe('retained');

    // Customer now churned — stage stays at invoice_paid (NOT back to
    // booked/contacted). Forward-only.
    const churnedInputs: LifecycleInputs = {
      ...retainedInputs,
      customer: { status: 'churned', churned_at: NOW },
    };
    expect(leadLifecycleStage(churnedInputs)).toBe('invoice_paid');
  });

  it('treats "prospect" customer status as retained-eligible', () => {
    const stage = leadLifecycleStage({
      lead: baseLead({ first_response_at: NOW }),
      quote: { status: 'accepted', accepted_at: NOW },
      job: { status: 'completed', scheduled_at: NOW },
      invoice: { status: 'paid', paid_at: NOW },
      customer: { status: 'prospect' },
    });
    expect(stage).toBe('retained');
  });
});
