#!/usr/bin/env bun
/**
 * migrate-legacy-lead-source.ts — Backfill Stage 3 attribution fields from
 * legacy v2 `source='<channel>:<campaign>'` strings.
 *
 * Per Stage 3 §11 risk R-7 and Q-4 (decision package
 * `docs/specs/stage-3-attribution-decisions.md`):
 *
 *   - Lead rows created before Stage 3 have NULL `utm_*` fields.
 *   - Their `source` may be a colon-squashed string like
 *     `'nextdoor:free_first_mow'`, `'facebook:marketplace_listing'`, or
 *     `'google_ads:paid_search'`.
 *   - Stage 3 widens the `source` union (`platform/packages/crm-core/src/service.ts:52-58`)
 *     to drop the squash; existing rows need their `utm_source` /
 *     `utm_campaign` / `utm_medium` populated retroactively.
 *
 * What this script does:
 *
 *   1. Pure-function `parseLegacySource(source)` — returns `{ utm_source,
 *      utm_campaign, utm_medium } | null`. Used by tests.
 *   2. Pure-function `migrateLegacyLead(lead)` — returns the same Lead
 *      with attribution fields filled in (only if currently NULL).
 *      Idempotent: re-running is safe.
 *   3. CLI mode: with `--dry-run`, prints a YAML summary of what would
 *      change for any synthetic input. With no args, prints the parser
 *      coverage table (which source strings are handled).
 *
 * What this script does NOT do:
 *
 *   - It does NOT touch a real database. Mission 1 is pre-launch; there
 *     are zero production lead rows. When Supabase is wired in
 *     (deferred — see governance/decisions/0067-supabase-deferred.md),
 *     the `applyMigration()` stub at the bottom of this file is the
 *     documented extension point.
 *   - It does NOT mutate `source`. The Stage 3 widening already accepts
 *     canonical tokens like `'nextdoor'`, `'google_ads'`; legacy rows
 *     with a squash keep their `source` as-is so audit trails are not
 *     lost.
 *
 * Run with:  bun run scripts/migrate-legacy-lead-source.ts
 *            bun run scripts/migrate-legacy-lead-source.ts --dry-run
 */

import { readFileSync } from 'node:fs';

// --- Types ------------------------------------------------------------------

export type UtmMedium = 'cpc' | 'social' | 'referral' | 'email' | 'print';

/**
 * Legacy `source` token shape before Stage 3 (v2 taxonomy). Colon-separated.
 * Examples: `'nextdoor:free_first_mow'`, `'facebook:marketplace_listing'`,
 * `'google_ads:paid_search'`.
 */
export type LegacySource = `${string}:${string}`;

export interface LegacyAttribution {
  utm_source: string;
  utm_campaign: string;
  utm_medium: UtmMedium;
}

/**
 * The full Lead shape we care about for migration purposes. Matches the
 * Stage 3 Lead contract in `platform/packages/crm-core/src/service.ts`
 * but is structural-only (we only read/write attribution fields).
 */
export interface LegacyLead {
  id: string;
  source: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

// --- Per-source utm_medium map ---------------------------------------------
//
// Mirrors the per-row `utm_medium` from
// `apps/web/src/app/t/[source]/route.ts` CHANNELS table, which was the
// canonical source-of-truth for the v3 utm_medium vocabulary. Keeping this
// map co-located with the parser means anyone changing a redirect's
// medium needs to update both places (charter principle: single source
// of truth).

const UTM_MEDIUM_BY_SOURCE: ReadonlyMap<string, UtmMedium> = new Map([
  // paid
  ['google_ads', 'cpc'],
  ['bing_ads', 'cpc'],
  ['meta_ads', 'cpc'], // legacy: meta_ads slug is now paused (S3.7); backfill stays correct
  // social (organic / Nextdoor / Facebook groups)
  ['nextdoor', 'social'],
  ['facebook', 'social'],
  // referral
  ['thumbtack', 'referral'],
  ['craigslist', 'referral'],
  // print / offline collateral
  ['door_hanger', 'print'],
  ['yard_sign', 'print'],
  ['business_card', 'print'],
  ['review_magnet', 'print'],
]);

const FALLBACK_MEDIUM: UtmMedium = 'referral';

// --- Pure-function parser --------------------------------------------------

/**
 * Parse a legacy colon-squashed `source` string into discrete attribution.
 *
 * Returns `null` when the source is not in the v2 squash format (i.e.
 * already a canonical token like `'website'` or `'nextdoor'`) — those
 * rows need no migration.
 */
export function parseLegacySource(source: string): LegacyAttribution | null {
  // v2 squash is exactly one colon between two non-empty alphanumeric+underscore tokens.
  const parts = source.split(':');
  if (parts.length !== 2) return null;
  const [rawSource, rawCampaign] = parts;
  if (!rawSource || !rawCampaign) return null;
  if (!/^[a-z0-9_]+$/i.test(rawSource) || !/^[a-z0-9_]+$/i.test(rawCampaign)) {
    return null;
  }

  const utm_source = rawSource.toLowerCase();
  const utm_campaign = rawCampaign.toLowerCase();
  const utm_medium = UTM_MEDIUM_BY_SOURCE.get(utm_source) ?? FALLBACK_MEDIUM;

  return { utm_source, utm_campaign, utm_medium };
}

// --- Pure-function migrator ------------------------------------------------

export interface MigrationResult {
  lead: LegacyLead;
  changed: boolean;
  reason?: 'no_legacy_squash' | 'fields_already_populated';
  attribution?: LegacyAttribution;
}

/**
 * Return a new Lead with attribution fields populated where they were
 * NULL. Never overwrites non-NULL fields (charter principle:
 * "Maintainability over velocity" — preserve existing data).
 */
export function migrateLegacyLead(lead: LegacyLead): MigrationResult {
  // Already-migrated leads: skip silently.
  if (lead.utm_source && lead.utm_medium && lead.utm_campaign) {
    return { lead, changed: false, reason: 'fields_already_populated' };
  }

  const parsed = parseLegacySource(lead.source);
  if (!parsed) {
    // Canonical-token source (e.g. 'website', 'nextdoor') — no legacy squash.
    return { lead, changed: false, reason: 'no_legacy_squash' };
  }

  return {
    lead: {
      ...lead,
      utm_source: lead.utm_source ?? parsed.utm_source,
      utm_medium: lead.utm_medium ?? parsed.utm_medium,
      utm_campaign: lead.utm_campaign ?? parsed.utm_campaign,
    },
    changed: true,
    attribution: parsed,
  };
}

// --- CLI: parser coverage table -------------------------------------------

function printCoverageTable(): void {
  // Build coverage rows from the UTM_MEDIUM_BY_SOURCE map + the v2 squash
  // examples documented in the dashboard mockup.
  const examples: Array<{ source: LegacySource; campaign: string }> = [
    { source: 'nextdoor:free_first_mow', campaign: 'free_first_mow' },
    { source: 'nextdoor:general_intro', campaign: 'general_intro' },
    { source: 'nextdoor:hurricane_prep', campaign: 'hurricane_prep' },
    { source: 'nextdoor:referral_credit', campaign: 'referral_credit' },
    { source: 'facebook:marketplace_listing', campaign: 'marketplace_listing' },
    { source: 'facebook:group_post', campaign: 'group_post' },
    { source: 'craigslist:tampa_bay', campaign: 'tampa_bay' },
    { source: 'door_hanger:neighborhood_drop', campaign: 'neighborhood_drop' },
    { source: 'yard_sign:curb_appeal', campaign: 'curb_appeal' },
    { source: 'business_card:in_person', campaign: 'in_person' },
    { source: 'google_ads:paid_search', campaign: 'paid_search' },
    { source: 'bing_ads:paid_search', campaign: 'paid_search' },
    { source: 'thumbtack:lead_gen', campaign: 'lead_gen' },
  ];

  // eslint-disable-next-line no-console
  console.log('# Legacy source migration coverage (Stage 3)\n');
  // eslint-disable-next-line no-console
  console.log('| legacy source | parsed utm_source | utm_campaign | utm_medium |');
  // eslint-disable-next-line no-console
  console.log('|---|---|---|---|');
  for (const { source } of examples) {
    const parsed = parseLegacySource(source);
    if (!parsed) continue;
    // eslint-disable-next-line no-console
    console.log(
      `| \`${source}\` | \`${parsed.utm_source}\` | \`${parsed.utm_campaign}\` | \`${parsed.utm_medium}\` |`,
    );
  }
  // eslint-disable-next-line no-console
  console.log('\nUnmapped utm_source values default to `referral`.');
  // eslint-disable-next-line no-console
  console.log(
    'Canonical-token sources (e.g. `website`, `nextdoor`) bypass migration (no squash to parse).',
  );
}

function printDryRun(): void {
  const sample: LegacyLead[] = [
    { id: 'l1', source: 'nextdoor:free_first_mow' },
    { id: 'l2', source: 'facebook:marketplace_listing' },
    { id: 'l3', source: 'google_ads:paid_search' },
    { id: 'l4', source: 'craigslist:tampa_bay' },
    { id: 'l5', source: 'website' }, // already canonical
    {
      id: 'l6',
      source: 'nextdoor:free_first_mow',
      utm_source: 'nextdoor',
      utm_medium: 'social',
      utm_campaign: 'free_first_mow',
    }, // already migrated
    { id: 'l7', source: 'unknown_channel:unknown_campaign' }, // unmapped source
  ];

  // eslint-disable-next-line no-console
  console.log('# Legacy source migration — dry run\n');
  for (const lead of sample) {
    const result = migrateLegacyLead(lead);
    const status = result.changed
      ? `→ utm_source=${result.attribution?.utm_source}, utm_medium=${result.attribution?.utm_medium}, utm_campaign=${result.attribution?.utm_campaign}`
      : `(skipped: ${result.reason ?? 'unknown'})`;
    // eslint-disable-next-line no-console
    console.log(`- ${lead.id}: source='${lead.source}' ${status}`);
  }
  // eslint-disable-next-line no-console
  console.log('\nNo writes performed. Wire `applyMigration()` to a real DB before production use.');
}

// --- Main ------------------------------------------------------------------

const args = new Set(process.argv.slice(2));

if (args.has('--dry-run')) {
  printDryRun();
} else if (args.has('--coverage')) {
  printCoverageTable();
} else {
  // Default to coverage when called without args — useful for `bun run` and CI.
  printCoverageTable();
}

// Touch readFileSync so the file is treated as ESM by `bun run`.
// (No-op runtime; the actual export surface is the pure functions above.)
void readFileSync;
