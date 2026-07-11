# Digital Twin — Lead

> **Definition.** A `Lead` is an inquiry from a potential `Customer` before they have accepted a Quote or paid for any service. Sources include GBP forms, Nextdoor, paid ads, referrals, organic search, door hangers.
>
> **Owner agent.** sales.
>
> **Cross-ref.** Quote (created from lead), Customer (on conversion).

---

## Schema

```typescript
interface Lead {
  id: string;
  // Source
  source: 'gpb_form' | 'nextdoor' | 'referral' | 'organic' | 'paid_ad' | 'door_hanger' | 'walk_in';
  source_detail?: string;         // 'GBP form 2026-07-15' or 'Nextdoor Highland Lakes neighbor'
  // Contact (pre-customer; may be incomplete)
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  preferred_contact_method?: 'sms' | 'email' | 'phone';
  // Property (may be partial)
  property_address_partial?: string;
  lot_size_estimate?: 'small' | 'medium' | 'large' | 'unknown';
  // Inquiry
  message?: string;
  services_interested?: string[];
  // Lead state
  status: LeadStatus;
  // Routing
  assigned_to?: string;           // sales agent person_id
  first_response_at?: string;     // KPI: ≤5 min target
  quoted_at?: string;
  // Conversion
  quote_id?: string;
  customer_id?: string;           // set on conversion
  // Audit
  created_at: string;
  updated_at: string;
}

type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'quoted'
  | 'won'
  | 'lost'
  | 'unqualified';
```

## Invariants

1. SLA: `first_response_at` ≤ 5 min after `created_at` during business hours (KPI: lead response time).
2. `status='won'` requires `quote_id` AND `customer_id`.
3. `status='lost'` requires reason (in audit log even if not exposed in UI).
4. `lot_size_estimate='unknown'` triggers a "needs property assessment" note in any quote.

## Lead response workflow

```text
Lead created (typically by cap_lead_capture_gbp)
  ↓
[≤5 min] Sales agent responds via preferred_contact_method
  ↓
Status: contacted → qualified (after 2-message exchange or basic info)
  ↓
Quote created (status='draft')
  ↓
Quote sent
  ↓
[+14 days] Quote valid → if no response, status='lost (no response)'
  ↓ OR
Quote accepted → status='won' → Customer created
```

## KPIs (cross-ref analytics/kpi-taxonomy.md)

- Lead response time (≤5 min target)
- Lead → Quote conversion (≥35% target)
- Source distribution (CAC by source for marketing agent decisions)
- Win rate by source (informs next-month ad spend)

## Cross-references

- **Reads:** Service (for "services_interested" validation), Property (if address resolves)
- **Writes:** Quote (on qualification), Customer (on conversion)
- **KPIs derived:** Lead-to-quote, CAC by source, response time