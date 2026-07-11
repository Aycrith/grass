# Digital Twin — Customer

> **Definition.** A `Customer` is any individual or household that has contracted for at least one paid service from GRASS Mission 1 (Largo FL landscaping).
>
> **Owner agent.** sales (creates), operations (maintains).
>
> **Cross-ref.** Property (where service is rendered), Job (services rendered), Invoice (financial record).

---

## Schema

```typescript
interface Customer {
  id: string;                    // UUID v4
  kind: 'residential' | 'commercial';
  status: 'active' | 'paused' | 'churned' | 'prospect';
  // Contact
  first_name: string;
  last_name: string;
  primary_email: string;          // RFC 5322
  primary_phone: string;          // E.164
  preferred_contact_method: 'sms' | 'email' | 'phone';
  // Address (denormalized for query speed)
  property_id: string;            // FK → Property
  billing_address?: Address;      // optional separate billing address
  // Lifecycle
  source: 'gpb_form' | 'nextdoor' | 'referral' | 'organic' | 'paid_ad' | 'door_hanger';
  acquisition_date: string;       // ISO 8601 date
  first_service_date?: string;
  churned_date?: string;
  churn_reason?: string;
  // Cadence
  cadence?: 'weekly' | 'biweekly' | 'monthly' | 'one_off';
  // Financials (computed by Finance agent)
  ltv_cents: number;
  balance_cents: number;          // outstanding (positive = owes us)
  // Constraints
  flags: CustomerFlag[];
  // Audit
  created_at: string;             // ISO 8601 datetime
  updated_at: string;
}

type CustomerFlag =
  | 'gate_code_required'
  | 'dogs_on_property'
  | 'no_doorbell'
  | 'customer_allergic_to_fumes'  // affects fertilizer/pest decisions
  | 'hoa_restrictions'
  | 'mature_tree_overspray'
  | 'senior_discount_eligible'
  | 'veteran_discount_eligible'
  | 'repeat_complainer';
```

## Invariants

1. A `Customer` MUST have either a `property_id` (if residential) or `billing_address + service_address`.
2. `status='active'` implies `balance_cents` is tracked at every invoice write.
3. `churned_date` is set when `status` transitions to `churned`; never cleared.
4. `primary_email` and `primary_phone` cannot both be empty.
5. `cadence` is required when `status='active'` and at least 2 jobs completed.

## Lifecycle

```text
prospect → active (after first paid invoice)
active   → paused (after 60+ days without a job AND no scheduled future job)
paused   → active (when customer books again)
active   → churned (when customer explicitly cancels or 90+ days paused)
churned  → active (rare; only if customer returns, requires steward approval)
```

## Owner agent actions

| Action | Permission |
|---|---|
| Create (kind=residential, status=prospect) | sales agent, no approval |
| Update contact info | sales agent, no approval |
| Set cadence | sales agent with operations agent co-sign |
| Pause / unpause | operations agent, no approval |
| Mark churned | sales agent (with reason, audited) |
| Apply discount | per research/pricing/price-book.yaml discount-authority ladder |

## Privacy

- PII (email, phone, address) is encrypted at rest in Supabase via RLS-protected columns.
- Customer data access requires `decides_within_scope` of either sales or operations.
- GDPR/CCPA: customer can request export or deletion; route through security agent + steward.

## Cross-references

- **Capabilities that read this model:** `cap_lead_capture_gbp`, `cap_recurring_schedule`, `cap_hurricane_mode`, `cap_auto_quote_mowing`, `cap_review_request`
- **Capabilities that write this model:** `cap_lead_capture_gbp` (status=prospect), sales (status=active), operations (pause/resume)
- **KPIs derived:** LTV, retention, churn rate, repeat-customer rate