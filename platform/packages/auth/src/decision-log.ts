/**
 * @grass/auth/decision-log — Decision Template gating.
 *
 * Charter binding: every irreversible decision requires a Decision Template
 * entry with a unique `decision_id`, ratifiable only by the steward. This module
 * exposes the runtime gate (`requireSteward(decision_id)`) that service-layer
 * functions call before performing irreversible mutations.
 *
 * Stub behavior: the registry is in-memory for tests; the production backing
 * store is `governance/decisions/<decision_id>.md` parsed by the Knowledge
 * agent at boot.
 */

const RATIFIED: Set<string> = new Set();

export function markRatified(decision_id: string): void {
  RATIFIED.add(decision_id);
}

export function markRevoked(decision_id: string): void {
  RATIFIED.delete(decision_id);
}

export function isDecisionRatified(decision_id: string): boolean {
  return RATIFIED.has(decision_id);
}

export class UnratifiedDecisionError extends Error {
  readonly decision_id: string;
  constructor(decision_id: string) {
    super(
      `UnratifiedDecisionError: decision_id "${decision_id}" is not ratified. Charter binding: irreversible actions require a steward-ratified Decision Template (governance/decisions/<decision_id>.md).`,
    );
    this.name = 'UnratifiedDecisionError';
    this.decision_id = decision_id;
  }
}

export function requireSteward(decision_id: string): void {
  if (!isDecisionRatified(decision_id)) {
    throw new UnratifiedDecisionError(decision_id);
  }
}
