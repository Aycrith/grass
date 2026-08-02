/**
 * Synthetic log — captures all server-side integration events
 * to a JSONL file when running without real API keys.
 *
 * PURPOSE
 * ───────
 * The GTM stack (Twilio, GA4 Measurement Protocol, Meta CAPI,
 * SendGrid) requires API keys, paid accounts, and a domain to
 * fully wire up. The steward has none of those at pilot start.
 * This module lets us prove the entire pipeline works
 * end-to-end on localhost by logging what *would have been
 * sent* to each platform. The synthetic log is the proof
 * artifact for Stage 0/1 — once real keys are added, the
 * identical events flow to the real APIs and the log
 * transparently switches to console-only.
 *
 * WHEN IT FIRES
 * ─────────────
 * Each integration checks its env vars and either:
 *   • Real mode: key present → call the real API.
 *   • Synthetic mode: key missing OR
 *     `SYNTHETIC_MODE=1` env var → log to file + console.
 *
 * The file is at `output/synthetic-events.jsonl` (relative to
 * the monorepo root, NOT the apps/web dir — keeps it in a
 * discoverable place). Each line is one JSON event. The file
 * is rotated to a backup before each test run.
 *
 * SECURITY
 * ────────
 * PII (email, phone, name) is captured in synthetic mode so
 * the steward can inspect the *exact* payload that *would*
 * have been sent to Meta. The file is gitignored. In real
 * mode, this module is dormant.
 */

import { appendFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const LOG_PATH = resolve(process.cwd(), '../../output/synthetic-events.jsonl');

export type SyntheticEventKind =
  | 'twilio.sms'
  | 'ga4.event'
  | 'meta.capi'
  | 'sendgrid.email'
  | 'email.lead'
  | 'notify.lead';

export interface SyntheticEvent {
  /** ISO-8601 timestamp when the event was fired. */
  ts: string;
  /** Which integration this would have hit. */
  kind: SyntheticEventKind;
  /** Reason this synthetic event was emitted. */
  reason: 'env_missing' | 'synthetic_forced' | 'no_backend_configured';
  /** The full payload that would have been sent. */
  payload: Record<string, unknown>;
  /** PII hash (if any). Meta CAPI requires SHA-256 hashes;
   *  we record them here so the steward can verify the hash
   *  matches what the real platform would have seen. */
  pii_hashes?: Record<string, string> | undefined;
}

let initPromise: Promise<void> | null = null;

async function ensureLogFile(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const dir = dirname(LOG_PATH);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  })();
  return initPromise;
}

export function isSyntheticMode(): boolean {
  if (process.env['SYNTHETIC_MODE'] === '1') return true;
  // Default to synthetic when no real keys are present.
  // (Each integration can override this with its own check.)
  return false;
}

export async function logSyntheticEvent(event: SyntheticEvent): Promise<void> {
  await ensureLogFile();
  const line = JSON.stringify(event) + '\n';
  await appendFile(LOG_PATH, line, 'utf8');

  // Also log to console (prefix-tagged so it's easy to grep).
  console.log(
    `[synthetic:${event.kind}] ${event.reason} → ${LOG_PATH}`,
    event.payload,
  );
}

/**
 * Clears the synthetic log file. Test-only.
 */
export async function resetSyntheticLog(): Promise<void> {
  await ensureLogFile();
  await writeFile(LOG_PATH, '', 'utf8');
}

/**
 * Reads all synthetic events from the log. Used by the
 * end-to-end test script to verify what fired.
 */
export async function readSyntheticEvents(): Promise<SyntheticEvent[]> {
  const { readFile } = await import('node:fs/promises');
  if (!existsSync(LOG_PATH)) return [];
  const content = await readFile(LOG_PATH, 'utf8');
  return content
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as SyntheticEvent);
}

export const SYNTHETIC_LOG_PATH = LOG_PATH;
