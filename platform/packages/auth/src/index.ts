/**
 * @grass/auth — Identity + authority primitives.
 *
 * Re-exports Principal, Action, can, assertCan, AuthorityError,
 * requireSteward, isDecisionRatified, markRatified, markRevoked,
 * UnratifiedDecisionError.
 */

export {
  type Action,
  AuthorityError,
  assertCan,
  can,
  type Principal,
} from './types.ts';
export {
  UnratifiedDecisionError,
  isDecisionRatified,
  markRatified,
  markRevoked,
  requireSteward,
} from './decision-log.ts';
