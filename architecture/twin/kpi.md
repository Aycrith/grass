# Digital Twin — KPI

> **Definition.** A `KPI` is a measurement contract: formula, instrument, target, actual value, and owner agent. Defined in `analytics/kpi-taxonomy.md`; mirrored as a runtime record each reporting period.
>
> **Owner agent.** executive (definition), individual agents (measurement).

---

## Schema

```typescript
interface KPISnapshot {
  id: string;
  // Identity
  kpi_key: string;                // 'cac' | 'ltv_12mo' | 'gm_per_job' | etc.
  title: string;
  section: 'north_star' | 'mission_operational' | 'mission_growth' | 'os_reusability' | 'engineering_health' | 'security_health';
  // Contract
  formula: string;
  instrument: string;             // specific tool + query
  target_cents?: number;          // for monetary KPIs
  target_pct?: number;            // for percentage KPIs
  target_count?: number;          // for count KPIs
  owner_agent_id: string;         // FK → agents/
  // Period measurement
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  period_start: string;
  period_end: string;
  // Actual
  actual_cents?: number;
  actual_pct?: number;
  actual_count?: number;
  // Variance
  variance_pct?: number;          // (actual - target) / target × 100
  // Source data
  source_data?: object;           // raw inputs (audit-only)
  // Audit
  computed_at: string;
}
```

## Cross-reference to KPI taxonomy

Every KPI in `analytics/kpi-taxonomy.md` has its `KPISnapshot` mirror. Example:

| kpi_key | title | section | owner |
|---|---|---|---|
| gm_run_rate | Mission 1 GM $ run rate | north_star | executive |
| cac | Customer acquisition cost | mission_growth | finance |
| ltv_12mo | LTV (12-month cohort) | mission_operational | finance |
| on_time_arrival | On-time arrival ±30min | mission_operational | operations |
| lead_to_quote | Lead → Quote conversion | mission_operational | sales |
| quote_to_job | Quote → Job conversion | mission_operational | sales |
| organic_impressions | Organic search impressions | mission_growth | seo |
| gbp_calls | GBP calls / month | mission_growth | marketing |
| citation_count | Citation count (clean NAP) | mission_growth | seo |
| cap_reusability | Capability reusability % | os_reusability | architecture |
| agents_active | Agent specs in active status | os_reusability | executive |
| ci_green_rate | CI green rate | engineering_health | qa |
| test_coverage | Test coverage % | engineering_health | qa |
| mttr | MTTR (incident) | engineering_health | qa |
| infra_spend | Infra spend vs ceiling | engineering_health | infrastructure |

(Full taxonomy in `analytics/kpi-taxonomy.md`.)

## Invariants

1. `period_end > period_start`.
2. `actual_*` is null only when data is genuinely unavailable (gap flagged).
3. `owner_agent_id` MUST match an `agents/*.md` spec.
4. Missing `KPISnapshot` for a defined KPI over ≥7 days triggers a `charter-compliance` warning.

## Computation rules

- `variance_pct` = `(actual - target) / target × 100`.
- Negative variance = underperforming (missed target by some %).
- Color code: green (≥95% of target), yellow (80-95%), red (<80%).

## Cross-references

- **Reads:** Customer, Invoice, Job, Lead, Marketing, PostHog, Stripe data
- **Writes:** monthly scorecard, retro docs
- **KPIs derived:** meta — "are we measuring the right things?" (reviewed quarterly)