# `@grass/auth` — Identity + authority

> **Phase:** draft (Phase 0–5 stubs; Phase 4-5 wire to Supabase Auth).
> **Owner agent:** security.
> **Twin models read:** `customer`, `crew`.

---

## What it does

Provides principal types and authority checks. Every public function in every other
`@grass/*` package takes a `principal: Principal` arg; this package owns the type and the
`can(principal, action)` helper.

```typescript
type Principal =
  | { kind: 'customer'; customer_id: string }
  | { kind: 'crew_member'; person_id: string; crew_id: string }
  | { kind: 'steward'; agent: 'human:steward' }
  | { kind: 'system'; workflow_id: string }; // for Inngest workflows
```

## Authority ladder (per governance/decisions/0004-operating-model.md)

| Action | Authority |
|---|---|
| Read own customer record | customer |
| Read own job schedule | customer |
| Update own contact info | customer |
| Create Lead | system (cap_lead_capture_gbp) |
| Create Customer | system, steward (≥$50 acquisition) |
| Pause/resume service | crew_member, system |
| Issue refund | steward only (Decision Template required) |
| Apply discount >$50 | steward only (per pricing ladder) |
| Hire/term crew member | steward only |
| Read all Customers | crew_member (own crew only), steward |

---

## Public API

```typescript
export type { Principal, Action };
export function can(principal: Principal, action: Action): boolean;
export function assertCan(principal: Principal, action: Action): void;
export function requireSteward(decision_id: string): void; // throws if no template entry
```

---

## Phase 4-5: Wire to Supabase Auth

When wired:

1. Customers log in via magic link (no passwords).
2. Crew members log in via SMS OTP.
3. Steward logs in via Supabase Auth + TOTP.
4. Row-Level Security (RLS) on every Customer/Job/Invoice table enforces principal scope
   at the DB layer (defense in depth).

---

## Tests

`src/principal.test.ts` covers the can/assertCan helpers against the authority ladder.
`src/decision-log.test.ts` covers requireSteward's contract.

---

## Cross-references

- **Twin models:** `architecture/twin/customer.md`, `architecture/twin/crew.md`
- **Decision:** `governance/decisions/0004-operating-model.md`
- **Charter rule:** "Every public function takes a `principal` arg"