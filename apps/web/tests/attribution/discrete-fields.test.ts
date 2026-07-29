/**
 * discrete-fields.test.ts — Stage 3 acceptance: every attribution field
 * survives the client → /api/lead → Lead row trip as a discrete column.
 *
 * Per plan `review-the-plans-recently-lucky-catmull.md` Stage 3 §1:
 *   "Full attribution set captured and stored as discrete fields on the
 *    lead record (source, medium, campaign, term, content, gclid,
 *    landing path, referrer, device class, first-touch timestamp) —
 *    not squashed into source."
 *
 * Run with:  bun test apps/web/tests/attribution/discrete-fields.test.ts
 *
 * Strategy: drive `attributionToLeadFields()` from a synthetic payload
 * that mirrors the test URL in
 * `output/gtm/03-google-ads-campaign-draft.md §419-425`, assert all 10
 * discrete fields are populated on the returned Lead-fields subset and
 * none are squashed into a single `source` string.
 */

import { describe, expect, it } from 'bun:test';

import { type AttributionPayload, attributionToLeadFields } from '@/lib/attribution';

const SYNTHETIC_AD_CLICK: AttributionPayload = {
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'pw_search',
  utm_term: 'lawn care near me',
  utm_content: 'free_first_cleanup',
  gclid: 'CKq7x9AbCp123',
  landing_path: '/pet-waste',
  referrer: 'google.com',
  device_class: 'mobile',
  first_touch_at: '2026-07-29T12:00:00.000Z',
  source: 'google', // B-2: canonical channel token, not v2 colon-squash
};

describe('attribution: discrete fields', () => {
  it('exports all 10 attribution fields as discrete keys (no squash)', () => {
    const fields = attributionToLeadFields(SYNTHETIC_AD_CLICK);
    expect(fields.utm_source).toBe('google');
    expect(fields.utm_medium).toBe('cpc');
    expect(fields.utm_campaign).toBe('pw_search');
    expect(fields.utm_term).toBe('lawn care near me');
    expect(fields.utm_content).toBe('free_first_cleanup');
    expect(fields.gclid).toBe('CKq7x9AbCp123');
    expect(fields.landing_path).toBe('/pet-waste');
    expect(fields.referrer).toBe('google.com');
    expect(fields.device_class).toBe('mobile');
    expect(fields.first_touch_at).toBe('2026-07-29T12:00:00.000Z');
  });

  it('preserves nullable semantics — every field may be null', () => {
    const empty: AttributionPayload = {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      gclid: null,
      landing_path: null,
      referrer: null,
      device_class: null,
      first_touch_at: null,
      source: 'website',
    };
    const fields = attributionToLeadFields(empty);
    expect(fields.utm_source).toBeNull();
    expect(fields.utm_medium).toBeNull();
    expect(fields.utm_campaign).toBeNull();
    expect(fields.utm_term).toBeNull();
    expect(fields.utm_content).toBeNull();
    expect(fields.gclid).toBeNull();
    expect(fields.landing_path).toBeNull();
    expect(fields.referrer).toBeNull();
    expect(fields.device_class).toBeNull();
    expect(fields.first_touch_at).toBeNull();
    expect(fields.source).toBe('website');
  });

  it('source is the canonical channel token, NOT a v2 colon-squash', () => {
    // B-2 follow-up: dropped the v2 `deriveLegacySource()` squash on new
    // leads. The `source` field is the canonical channel token (same as
    // utm_source) so `WHERE source IN (...)` filters hit both redirected
    // and direct-arrival leads. The discrete utm_* trio remains the
    // source of truth; `source` is the coarse-grained join key.
    const fields = attributionToLeadFields(SYNTHETIC_AD_CLICK);
    expect(fields.source).toBe('google');
  });

  it('produces a Pick<Lead, ...> shape with the 11 documented keys', () => {
    const fields = attributionToLeadFields(SYNTHETIC_AD_CLICK);
    expect(Object.keys(fields).sort()).toEqual(
      [
        'device_class',
        'first_touch_at',
        'gclid',
        'landing_path',
        'referrer',
        'source',
        'utm_campaign',
        'utm_content',
        'utm_medium',
        'utm_source',
        'utm_term',
      ].sort(),
    );
  });
});
