/**
 * posthog-payload.test.ts — Stage 3 acceptance: the PostHog
 * `lead_captured` payload is well-formed and contains every
 * attribution field.
 *
 * Per plan `review-the-plans-recently-lucky-catmull.md` Stage 3 §1:
 * PostHog funnels segment by source / medium / campaign / device,
 * so each of those must round-trip from the Lead row into the
 * payload properties without loss.
 *
 * B-5 follow-up: payload construction was extracted from the inline
 * route-handler literal into `buildLeadCapturedEvent()` (a pure
 * function in `@/lib/server-posthog`) so this test can assert the
 * shape without mocking fetch or instantiating NextRequest.
 *
 * Run with:  bun test apps/web/tests/attribution/posthog-payload.test.ts
 */

import { describe, expect, it } from 'bun:test';

import type { Lead } from '@grass/crm-core';
import { buildLeadCapturedEvent } from '@/lib/server-posthog';

const SYNTHETIC_LEAD: Lead = {
  id: 'lead_1700000000000',
  first_name: 'Avery',
  last_name: 'Hernandez',
  email: 'avery@example.com',
  phone: '+17275551234',
  zip: '33771',
  source: 'google_ads',
  status: 'new',
  sms_consent: true,
  utm_source: 'google_ads',
  utm_medium: 'cpc',
  utm_campaign: 'pw_search',
  utm_term: 'lawn care near me',
  utm_content: 'free_first_cleanup',
  gclid: 'CKq7x9AbCp123',
  landing_path: '/contact',
  referrer: 'google.com',
  device_class: 'mobile',
  first_touch_at: '2026-07-29T12:00:00.000Z',
  created_at: '2026-07-29T12:00:00.000Z',
  updated_at: '2026-07-29T12:00:00.000Z',
};

describe('posthog-payload: buildLeadCapturedEvent', () => {
  it('returns a payload with the canonical capture-event shape', () => {
    const payload = buildLeadCapturedEvent(SYNTHETIC_LEAD, 'phc_test_key');
    expect(payload.api_key).toBe('phc_test_key');
    expect(payload.event).toBe('lead_captured');
    expect(payload.distinct_id).toBe(SYNTHETIC_LEAD.id);
  });

  it('passes through every Stage 3 attribution field as a discrete property', () => {
    const payload = buildLeadCapturedEvent(SYNTHETIC_LEAD, 'phc_test_key');
    const p = payload.properties;
    expect(p.utm_source).toBe('google_ads');
    expect(p.utm_medium).toBe('cpc');
    expect(p.utm_campaign).toBe('pw_search');
    expect(p.utm_term).toBe('lawn care near me');
    expect(p.utm_content).toBe('free_first_cleanup');
    expect(p.gclid).toBe('CKq7x9AbCp123');
    expect(p.landing_path).toBe('/contact');
    expect(p.referrer).toBe('google.com');
    expect(p.device_class).toBe('mobile');
    expect(p.first_touch_at).toBe('2026-07-29T12:00:00.000Z');
  });

  it('includes zip + source + sms_consent for funnel segmentation', () => {
    const payload = buildLeadCapturedEvent(SYNTHETIC_LEAD, 'phc_test_key');
    expect(payload.properties.zip).toBe('33771');
    expect(payload.properties.source).toBe('google_ads');
    expect(payload.properties.sms_consent).toBe(true);
  });

  it('null-fills every attribution field when the lead has none', () => {
    // exactOptionalPropertyTypes: true — omit the keys rather than
    // assigning `undefined`. The behavior under test is the runtime
    // null-fill inside buildLeadCapturedEvent, not the type contract.
    const { utm_source: _u, utm_medium: _m, utm_campaign: _c, utm_term: _t, utm_content: _o, gclid: _g, landing_path: _l, referrer: _r, device_class: _d, first_touch_at: _f, ...sparseLead } = SYNTHETIC_LEAD;
    void _u; void _m; void _c; void _t; void _o; void _g; void _l; void _r; void _d; void _f;
    const payload = buildLeadCapturedEvent(sparseLead, 'phc_test_key');
    const p = payload.properties;
    expect(p.utm_source).toBeNull();
    expect(p.utm_medium).toBeNull();
    expect(p.utm_campaign).toBeNull();
    expect(p.utm_term).toBeNull();
    expect(p.utm_content).toBeNull();
    expect(p.gclid).toBeNull();
    expect(p.landing_path).toBeNull();
    expect(p.referrer).toBeNull();
    expect(p.device_class).toBeNull();
    expect(p.first_touch_at).toBeNull();
  });

  it('coerces sms_consent=false (or absent) to a boolean false', () => {
    // Defensive: when sms_consent is absent from the lead row (the
    // pre-D-0066 default), the payload must surface a boolean false,
    // never undefined — PostHog property types matter for funnel
    // filtering. exactOptionalPropertyTypes: true — omit the key.
    const { sms_consent: _s, ...noConsentLead } = SYNTHETIC_LEAD;
    void _s;
    const payload = buildLeadCapturedEvent(noConsentLead, 'phc_test_key');
    expect(payload.properties.sms_consent).toBe(false);
  });

  it('does NOT include PII beyond ZIP / distinct_id / landing_path', () => {
    // The privacy page (B-3 follow-up) commits to a constrained payload:
    // no email, no phone, no first/last name, no message body. Enforce
    // that contract here so a future refactor cannot quietly add PII.
    const payload = buildLeadCapturedEvent(SYNTHETIC_LEAD, 'phc_test_key');
    const allKeys = [
      ...Object.keys(payload),
      ...Object.keys(payload.properties),
    ];
    expect(allKeys).not.toContain('email');
    expect(allKeys).not.toContain('phone');
    expect(allKeys).not.toContain('first_name');
    expect(allKeys).not.toContain('last_name');
    expect(allKeys).not.toContain('message');
  });

  it('distinct_id is the lead.id (server-generated), never a user-supplied identifier', () => {
    const payload = buildLeadCapturedEvent(SYNTHETIC_LEAD, 'phc_test_key');
    expect(payload.distinct_id).toBe(SYNTHETIC_LEAD.id);
    expect(payload.distinct_id).not.toBe(SYNTHETIC_LEAD.email);
    expect(payload.distinct_id).not.toBe(SYNTHETIC_LEAD.phone);
  });
});