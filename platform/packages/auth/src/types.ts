/**
 * @grass/auth/types — Identity + authority primitives.
 *
 * Principals are how every package identifies who is calling a service action.
 * Actions are exhaustive across the platform; the AUTHORITY table is the single
 * source of truth for "can this principal do that".
 *
 * Charter binding: irreversible actions require a ratified Decision Template;
 * see decision-log.ts for the `requireSteward(decision_id)` guard.
 */

export type Principal =
  | { kind: 'customer'; customer_id: string }
  | { kind: 'crew_member'; person_id: string; crew_id: string }
  | { kind: 'steward'; agent: 'human:steward' }
  | { kind: 'system'; workflow_id: string };

export type Action =
  // Customer-scoped (self only)
  | 'customer:read_own'
  | 'customer:update_own_contact'
  // CRM
  | 'lead:create'
  | 'lead:update'
  | 'lead:qualify'
  | 'customer:create'
  | 'customer:read_all'
  | 'customer:update_any'
  | 'customer:churn'
  // Quotes
  | 'quote:create'
  | 'quote:send'
  | 'quote:accept'
  | 'quote:decline'
  // Jobs
  | 'job:schedule'
  | 'job:reschedule'
  | 'job:complete'
  | 'job:cancel'
  | 'job:read_all'
  // Invoices
  | 'invoice:issue'
  | 'invoice:read_own'
  | 'invoice:read_all'
  | 'invoice:refund'
  | 'invoice:void'
  // Discount ladder
  | 'discount:apply_small'
  | 'discount:apply_medium'
  | 'discount:apply_large'
  // Crew
  | 'crew:assign_to_job'
  | 'crew:hire'
  | 'crew:terminate'
  // Equipment
  | 'equipment:assign'
  | 'equipment:mark_broken'
  // Hurricane
  | 'hurricane:trigger_mode'
  | 'hurricane:clear_mode'
  // Decision governance
  | 'decision:create_template'
  | 'decision:ratify';

const AUTHORITY: Record<Action, Principal['kind'][]> = {
  // Customer self-service (only their own records)
  'customer:read_own': ['customer'],
  'customer:update_own_contact': ['customer'],
  // CRM — leads can be created by anyone (web form), qualified by steward/system only
  'lead:create': ['customer', 'crew_member', 'steward', 'system'],
  'lead:update': ['steward', 'system'],
  'lead:qualify': ['steward', 'system'],
  'customer:create': ['steward', 'system'],
  'customer:read_all': ['steward', 'system'],
  'customer:update_any': ['steward'],
  'customer:churn': ['steward'],
  // Quotes — steward-led
  'quote:create': ['steward', 'system'],
  'quote:send': ['steward', 'system'],
  'quote:accept': ['customer'],
  'quote:decline': ['customer'],
  // Jobs — steward schedules, crew completes
  'job:schedule': ['steward', 'system'],
  'job:reschedule': ['steward', 'system', 'customer'],
  'job:complete': ['crew_member', 'steward', 'system'],
  'job:cancel': ['steward', 'system', 'customer'],
  'job:read_all': ['steward', 'crew_member', 'system'],
  // Invoices — steward issues, customer reads own
  'invoice:issue': ['steward', 'system'],
  'invoice:read_own': ['customer'],
  'invoice:read_all': ['steward', 'system'],
  'invoice:refund': ['steward'],
  'invoice:void': ['steward'],
  // Discounts — ladder by amount (small=any active agent, medium=steward, large=steward + decision)
  'discount:apply_small': ['steward', 'crew_member', 'system'],
  'discount:apply_medium': ['steward'],
  'discount:apply_large': ['steward'],
  // Crew
  'crew:assign_to_job': ['steward', 'system'],
  'crew:hire': ['steward'],
  'crew:terminate': ['steward'],
  // Equipment
  'equipment:assign': ['steward', 'crew_member', 'system'],
  'equipment:mark_broken': ['crew_member', 'steward'],
  // Hurricane mode
  'hurricane:trigger_mode': ['system', 'steward'],
  'hurricane:clear_mode': ['system', 'steward'],
  // Decision governance
  'decision:create_template': ['steward', 'system'],
  'decision:ratify': ['steward'],
};

export function can(principal: Principal, action: Action): boolean {
  return AUTHORITY[action].includes(principal.kind);
}

export class AuthorityError extends Error {
  readonly principal: Principal;
  readonly action: Action;
  constructor(principal: Principal, action: Action) {
    super(
      `AuthorityError: principal of kind "${principal.kind}" may not perform action "${action}"`,
    );
    this.name = 'AuthorityError';
    this.principal = principal;
    this.action = action;
  }
}

export function assertCan(principal: Principal, action: Action): void {
  if (!can(principal, action)) {
    throw new AuthorityError(principal, action);
  }
}
