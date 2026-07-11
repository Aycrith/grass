/**
 * @grass/database — Phase 4-5 stub.
 *
 * Implementation deferred: this package will wrap Supabase Postgres + connection-helper that
 * authenticates the session per Principal so RLS policies enforce visibility.
 *
 * For now, exposes twin-model table mapping constants + a conceptual client interface.
 */

import type { Principal } from '@grass/auth';

export const TWIN_TO_TABLE = {
  Customer: 'customers',
  Property: 'properties',
  Service: 'services',
  Crew: 'crews',
  Equipment: 'equipment',
  Vehicle: 'vehicles',
  Job: 'jobs',
  Invoice: 'invoices',
  Schedule: 'schedules',
  Route: 'routes',
  Quote: 'quotes',
  Lead: 'leads',
  MarketingCampaign: 'marketing_campaigns',
  ContentAsset: 'content_assets',
  KPISnapshot: 'kpi_snapshots',
} as const;

export type TwinModel = keyof typeof TWIN_TO_TABLE;

export interface DbClient {
  query<T>(sql: string, params: unknown[]): Promise<{ rows: T[]; affected_rows: number }>;
  transaction<T>(fn: (tx: DbClient) => Promise<T>): Promise<T>;
}

/**
 * Phase 4-5 implementation: returns a Supabase client whose session is
 * authenticated as `principal` so RLS policies enforce visibility.
 * This stub returns a fake client that throws.
 */
export async function getClient(_principal: Principal): Promise<DbClient> {
  throw new Error('@grass/database: not implemented (Phase 4-5)');
}
