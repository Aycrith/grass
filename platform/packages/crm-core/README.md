# `@grass/crm-core` — Customer, Lead, Quote, Property service layer

> **Phase:** draft (Phase 4-5 wire to Supabase Postgres).
> **Owner agent:** sales.
> **Twin models read/written:** `customer`, `lead`, `quote`, `property`.

---

## What it does

The canonical service layer for the customer-facing CRM data. App code (Next.js Server
Actions) calls into this package; this package enforces:
- Twin-model invariants (e.g., `Customer.primary_email OR primary_phone`)
- Authority (every function takes a `Principal` from `@grass/auth`)
- Observability emissions per `observability/required-emissions.yaml`

## Public API

```typescript
// Lead
export async function createLead(input: LeadInput, p: Principal): Promise<Lead>;
export async function qualifyLead(lead_id: string, p: Principal): Promise<Lead>;
export async function convertLeadToCustomer(lead_id: string, p: Principal): Promise<Customer>;

// Customer
export async function createCustomer(input: CustomerInput, p: Principal): Promise<Customer>;
export async function updateCustomer(customer_id: string, patch: CustomerPatch, p: Principal): Promise<Customer>;
export async function pauseCustomer(customer_id: string, reason: string, p: Principal): Promise<Customer>;
export async function resumeCustomer(customer_id: string, p: Principal): Promise<Customer>;
export async function churnCustomer(customer_id: string, reason: string, decision_id: string, p: Principal): Promise<Customer>;

// Quote
export async function createQuote(input: QuoteInput, p: Principal): Promise<Quote>;
export async function sendQuote(quote_id: string, p: Principal): Promise<Quote>;
export async function acceptQuote(quote_id: string, p: Principal): Promise<{ quote: Quote; job_ids: string[] }>;

// Property
export async function createProperty(input: PropertyInput, p: Principal): Promise<Property>;
export async function updateProperty(property_id: string, patch: PropertyPatch, p: Principal): Promise<Property>;
export async function addPropertyPhoto(property_id: string, photo_url: string, notes?: string, p?: Principal): Promise<Property>;
```

## Capabilities served

| Function | Capability |
|---|---|
| `createLead` | cap_lead_capture_gbp |
| `qualifyLead` | cap_lead_capture_gbp |
| `acceptQuote` | cap_auto_quote_mowing |
| `pauseCustomer` | (operations) |
| `churnCustomer` | (sales, requires Decision Template) |

## Tests

`src/*.test.ts` cover each function against:
- Twin-model invariants (e.g., `Customer.primary_email || primary_phone`)
- Authority ladder (`can(principal, action)`)
- Observability emission (stub-mocked)
- Idempotency on retries

## Phase 4-5: Implementation

When wired, each function maps to a Supabase Postgres query (RLS-enforced). The function is
a thin wrapper; the contract lives in this file, the storage detail lives in
`@grass/database` migrations.