# Digital Twin — Quote

> **Definition.** A `Quote` is a formal offer to a `Customer` to perform one or more `Service`s at a `Property` for a stated price. Converted into `Job`(s) on acceptance.
>
> **Owner agent.** sales.
>
> **Cross-ref.** Customer, Property, Service, Job (post-acceptance).

---

## Schema

```typescript
interface Quote {
  id: string;
  number: string;                 // 'QT-2026-0042'
  // Identity
  customer_id: string;            // possibly null at creation (lead → customer)
  lead_id?: string;               // FK → Lead if customer not yet created
  property_id: string;
  // What
  line_items: QuoteLineItem[];
  // Pricing
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  // Validity
  valid_until: string;            // typically +14 days
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  // Acceptance
  accepted_at?: string;
  declined_at?: string;
  decline_reason?: string;
  // Linked job (on accept)
  resulting_job_ids: string[];
  // Audit
  created_at: string;
  updated_at: string;
}

interface QuoteLineItem {
  description: string;
  service_id: string;
  quantity: number;
  unit_price_cents: number;
  line_subtotal_cents: number;
  discount_cents?: number;
  scope_value?: number;            // for per_linear_foot (e.g., 50 lf)
  scope_unit?: string;             // 'lf', 'cuyd', 'visit'
  cogs_cents?: number;
}
```

## Invariants

1. `line_items[].service_id` MUST exist in `Service` catalog.
2. `valid_until > now()` for `status='sent'` or `'viewed'`.
3. `status='accepted'` requires `resulting_job_ids.length ≥ 1`.
4. `status='expired'` auto-set when `valid_until < now()`.
5. `discount_cents` per line item requires Authority limit per `research/pricing/price-book.yaml`.

## Quote → Lead/Lead → Customer transition

```text
Lead (inquiry) → 
  Quote draft created by sales agent →
  Quote sent (status='sent') →
  Customer created (if not already) on first contact →
  Quote viewed (if customer opens) →
  Quote accepted →
  Job created (one per line item)
  resulting_job_ids = [job_id_1, ...]
```

## Acceptance flow

When customer accepts:
1. New customers: `cap_lead_capture_gbp` upgrades `Customer.status` from 'prospect' to 'active'.
2. Quote → Job fanout: one Job per line item.
3. Invoice is NOT generated at acceptance — only at job completion.
4. Schedule suggests the next available slot based on `Property.address` and crew capacity.

## Cross-references

- **Reads:** Service (pricing ladder), Property, Customer (or Lead)
- **Writes:** Job (on accept), Customer (lead → active conversion)
- **KPIs derived:** Lead → Quote conversion, Quote → Job conversion, avg quote value