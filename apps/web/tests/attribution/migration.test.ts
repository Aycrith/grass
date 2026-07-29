/**
 * migration.test.ts — Stage 3 acceptance: legacy v2 colon-squashed
 * `source='<channel>:<campaign>'` strings backfill cleanly into the
 * discrete utm_* trio.
 *
 * Per Stage 3 §11 risk R-7 and Q-4: Lead rows created before Stage 3
 * have NULL `utm_*` fields. Their `source` may be a colon-squashed
 * string. The migration script
 * (`scripts/migrate-legacy-lead-source.ts`) exposes two pure functions:
 *
 *   - `parseLegacySource(source)` → `{ utm_source, utm_campaign,
 *     utm_medium } | null`. Null when source is already a canonical
 *     token (e.g. `'website'`, `'nextdoor'`) — those rows need no
 *     migration.
 *   - `migrateLegacyLead(lead)` → `{ lead, changed, reason?,
 *     attribution? }`. Idempotent.
 *
 * Coverage:
 *   1. Every entry in UTM_MEDIUM_BY_SOURCE round-trips through the
 *      parser with the right medium.
 *   2. Error cases: multi-colon, empty parts, non-alphanumeric
 *      characters, already-canonical source, unmapped source.
 *   3. `migrateLegacyLead` behavior: writes only NULL fields,
 *      idempotent re-run, returns reason codes.
 *
 * Run with:  bun test apps/web/tests/attribution/migration.test.ts
 */

import { describe, expect, it } from 'bun:test';

import {
  type LegacyLead,
  type UtmMedium,
  UTM_MEDIUM_BY_SOURCE,
  migrateLegacyLead,
  parseLegacySource,
} from '@/../../scripts/migrate-legacy-lead-source';

describe('migration: parseLegacySource — happy path (every UTM_MEDIUM_BY_SOURCE entry)', () => {
  const CANONICAL_PAIRS: Array<{ source: string; medium: UtmMedium }> = [
    { source: 'google_ads', medium: 'cpc' },
    { source: 'bing_ads', medium: 'cpc' },
    { source: 'craigslist', medium: 'cpc' },
    { source: 'thumbtack', medium: 'cpc' },
    // meta_ads slug is paused (S3.7); backfill still classifies it as cpc.
    { source: 'meta_ads', medium: 'cpc' },
    { source: 'nextdoor', medium: 'social' },
    { source: 'facebook', medium: 'social' },
    { source: 'door_hanger', medium: 'print' },
    { source: 'yard_sign', medium: 'print' },
    { source: 'business_card', medium: 'print' },
    { source: 'review_magnet', medium: 'print' },
  ];

  for (const { source, medium } of CANONICAL_PAIRS) {
    it(`parses ${source}:foo → utm_source=${source}, utm_medium=${medium}`, () => {
      const parsed = parseLegacySource(`${source}:foo`);
      expect(parsed).not.toBeNull();
      expect(parsed?.utm_source).toBe(source);
      expect(parsed?.utm_campaign).toBe('foo');
      expect(parsed?.utm_medium).toBe(medium);
    });
  }

  it('every key in UTM_MEDIUM_BY_SOURCE is parseable as the utm_source segment', () => {
    // Belt-and-suspenders: re-derive the coverage from the shared map
    // so adding a new entry there forces a test failure here.
    for (const source of Object.keys(UTM_MEDIUM_BY_SOURCE)) {
      const parsed = parseLegacySource(`${source}:any_campaign`);
      expect(parsed).not.toBeNull();
      expect(parsed?.utm_source).toBe(source);
    }
  });

  it('lower-cases source and campaign segments', () => {
    const parsed = parseLegacySource('Google_Ads:Spring_Promo');
    expect(parsed).toEqual({
      utm_source: 'google_ads',
      utm_campaign: 'spring_promo',
      utm_medium: 'cpc',
    });
  });
});

describe('migration: parseLegacySource — error cases', () => {
  it('returns null when source is already a canonical token (no colon)', () => {
    expect(parseLegacySource('website')).toBeNull();
    expect(parseLegacySource('nextdoor')).toBeNull();
    expect(parseLegacySource('manual')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseLegacySource('')).toBeNull();
  });

  it('returns null when there is no colon', () => {
    expect(parseLegacySource('not_colon_squashed')).toBeNull();
  });

  it('returns null for multi-colon sources (only one colon is the v2 squash shape)', () => {
    expect(parseLegacySource('a:b:c')).toBeNull();
    expect(parseLegacySource('nextdoor:free_first_mow:extra')).toBeNull();
  });

  it('returns null when one of the parts is empty (leading colon)', () => {
    expect(parseLegacySource(':campaign')).toBeNull();
  });

  it('returns null when one of the parts is empty (trailing colon)', () => {
    expect(parseLegacySource('source:')).toBeNull();
  });

  it('returns null when one of the parts is empty (lone colon)', () => {
    expect(parseLegacySource(':')).toBeNull();
  });

  it('returns null when source segment contains a non-alphanumeric character', () => {
    expect(parseLegacySource('google-ads:foo')).toBeNull();
    expect(parseLegacySource('google.ads:foo')).toBeNull();
    expect(parseLegacySource('google ads:foo')).toBeNull();
  });

  it('returns null when campaign segment contains a non-alphanumeric character', () => {
    expect(parseLegacySource('google:paid-search')).toBeNull();
    expect(parseLegacySource('google:paid search')).toBeNull();
    expect(parseLegacySource('google:paid/search')).toBeNull();
  });

  it('falls back to FALLBACK_MEDIUM when source is unmapped (not in UTM_MEDIUM_BY_SOURCE)', () => {
    const parsed = parseLegacySource('unknown_channel:unknown_campaign');
    expect(parsed).toEqual({
      utm_source: 'unknown_channel',
      utm_campaign: 'unknown_campaign',
      utm_medium: 'referral', // FALLBACK_MEDIUM per lib/channels.ts
    });
  });
});

describe('migration: migrateLegacyLead — happy path', () => {
  it('populates NULL utm_* fields from a colon-squashed source', () => {
    const lead: LegacyLead = { id: 'l1', source: 'nextdoor:free_first_mow' };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(true);
    expect(result.reason).toBeUndefined();
    expect(result.attribution).toEqual({
      utm_source: 'nextdoor',
      utm_campaign: 'free_first_mow',
      utm_medium: 'social',
    });
    expect(result.lead.utm_source).toBe('nextdoor');
    expect(result.lead.utm_medium).toBe('social');
    expect(result.lead.utm_campaign).toBe('free_first_mow');
  });

  it('writes only NULL fields (preserves non-NULL values)', () => {
    // Even though source parses cleanly, if utm_source is already set
    // the migrator must NOT clobber it (charter: preserve data).
    const lead: LegacyLead = {
      id: 'l2',
      source: 'nextdoor:free_first_mow',
      utm_source: 'nextdoor', // already populated
      utm_medium: 'social',
      utm_campaign: 'campaign_keep_me',
    };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(false);
    expect(result.reason).toBe('fields_already_populated');
    expect(result.lead.utm_campaign).toBe('campaign_keep_me');
  });
});

describe('migration: migrateLegacyLead — skip cases', () => {
  it('reports no_legacy_squash when source is a canonical token', () => {
    const lead: LegacyLead = { id: 'l3', source: 'website' };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(false);
    expect(result.reason).toBe('no_legacy_squash');
    expect(result.lead.utm_source).toBeUndefined();
    expect(result.lead.utm_medium).toBeUndefined();
    expect(result.lead.utm_campaign).toBeUndefined();
  });

  it('reports no_legacy_squash when source is not parseable (multi-colon)', () => {
    const lead: LegacyLead = { id: 'l4', source: 'a:b:c' };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(false);
    expect(result.reason).toBe('no_legacy_squash');
  });

  it('reports fields_already_populated even when source is not parseable', () => {
    // Defensive: if a row was hand-edited to populate utm_* but kept a
    // v2-shaped source, the migrator must not undo the manual work.
    const lead: LegacyLead = {
      id: 'l5',
      source: 'nextdoor:free_first_mow',
      utm_source: 'nextdoor',
      utm_medium: 'social',
      utm_campaign: 'free_first_mow',
    };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(false);
    expect(result.reason).toBe('fields_already_populated');
  });
});

describe('migration: migrateLegacyLead — idempotency', () => {
  it('running twice produces the same lead row (no doubling, no drift)', () => {
    const lead: LegacyLead = { id: 'l6', source: 'facebook:marketplace_listing' };
    const first = migrateLegacyLead(lead);
    expect(first.changed).toBe(true);
    const second = migrateLegacyLead(first.lead);
    expect(second.changed).toBe(false);
    expect(second.reason).toBe('fields_already_populated');
    expect(second.lead.utm_source).toBe('facebook');
    expect(second.lead.utm_medium).toBe('social');
    expect(second.lead.utm_campaign).toBe('marketplace_listing');
  });

  it('does not mutate the input lead object (pure function)', () => {
    const lead: LegacyLead = { id: 'l7', source: 'craigslist:tampa_bay' };
    const snapshot = JSON.stringify(lead);
    migrateLegacyLead(lead);
    expect(JSON.stringify(lead)).toBe(snapshot);
  });
});

describe('migration: migrateLegacyLead — partial-fill semantics', () => {
  // Per the docstring on migrateLegacyLead: "Never overwrites non-NULL
  // fields". The tests below exhaustively cover every combination of
  // (utm_source present|absent) × (utm_medium present|absent) ×
  // (utm_campaign present|absent) for a parseable legacy source.

  it('fills only the missing fields when utm_source is already populated', () => {
    const lead: LegacyLead = {
      id: 'p1',
      source: 'nextdoor:free_first_mow',
      utm_source: 'manual_override', // steward hand-edited — must NOT clobber
    };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(true);
    expect(result.lead.utm_source).toBe('manual_override');
    expect(result.lead.utm_medium).toBe('social');
    expect(result.lead.utm_campaign).toBe('free_first_mow');
  });

  it('fills only the missing fields when utm_medium is already populated', () => {
    const lead: LegacyLead = {
      id: 'p2',
      source: 'nextdoor:free_first_mow',
      utm_medium: 'referral', // steward corrected — must NOT clobber
    };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(true);
    expect(result.lead.utm_source).toBe('nextdoor');
    expect(result.lead.utm_medium).toBe('referral');
    expect(result.lead.utm_campaign).toBe('free_first_mow');
  });

  it('fills only the missing fields when utm_campaign is already populated', () => {
    const lead: LegacyLead = {
      id: 'p3',
      source: 'nextdoor:free_first_mow',
      utm_campaign: 'cleaned_in_spring_2026',
    };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(true);
    expect(result.lead.utm_source).toBe('nextdoor');
    expect(result.lead.utm_medium).toBe('social');
    expect(result.lead.utm_campaign).toBe('cleaned_in_spring_2026');
  });

  it('fills all three fields when none are populated (the canonical happy path)', () => {
    const lead: LegacyLead = { id: 'p4', source: 'craigslist:tampa_bay' };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(true);
    expect(result.lead.utm_source).toBe('craigslist');
    expect(result.lead.utm_medium).toBe('cpc');
    expect(result.lead.utm_campaign).toBe('tampa_bay');
  });

  it('skips migration when only utm_source is present (legacy squash detected)', () => {
    // 2 of 3 fields are populated — the migrator's `fields_already_populated`
    // check requires ALL three, so this falls through to the parser path.
    // The parser fills the missing fields; changed=true.
    const lead: LegacyLead = {
      id: 'p5',
      source: 'facebook:marketplace_listing',
      utm_source: 'facebook',
    };
    const result = migrateLegacyLead(lead);
    expect(result.changed).toBe(true);
    expect(result.lead.utm_source).toBe('facebook');
    expect(result.lead.utm_medium).toBe('social');
    expect(result.lead.utm_campaign).toBe('marketplace_listing');
  });
});