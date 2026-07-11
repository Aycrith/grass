# Digital Twin — Service

> **Definition.** A `Service` is a sellable unit of work. Each service corresponds to one or more registered `cap_*` capabilities. PRICING for a service is defined in `research/pricing/price-book.yaml`.
>
> **Owner agent.** sales (sells), operations (delivers).
>
> **Cross-ref.** Capability (registry), Job (an instance of a service), Quote (offer), Invoice (billed).

---

## Schema

```typescript
interface Service {
  id: string;
  cap_id: string;                 // FK → state/capability-registry.yaml
  title: string;
  description_short: string;
  description_long?: string;
  // Service-line classification
  service_line: 'mowing' | 'edging' | 'mulching' | 'hedge_trim' | 'hurricane_prep' | 'seasonal_cleanup' | 'fertilization' | 'irrigation' | 'pest_control';
  license_required?: 'fdacs_lcfa' | 'pcclb_irrigation_specialty' | 'fl_482_pco';
  // Pricing
  pricing_model: 'per_visit' | 'per_linear_foot' | 'per_cubic_yard' | 'flat' | 'quote_based';
  pricing_ladder: PricingTier[];
  // Operational defaults
  default_duration_minutes: number;
  solo_crew_min: number;          // 1 = solo founder with no helpers
  solo_crew_max: number;
  equipment_required: string[];   // FK → Equipment.skus
  // Availability
  season: 'year_round' | 'peak_only' | 'winter' | 'hurricane';
  // Lifecycle
  status: 'active' | 'draft' | 'deprecated' | 'seasonal_pause';
  // Audit
  created_at: string;
  updated_at: string;
}

interface PricingTier {
  tier_id: string;
  lot_bucket?: 'small' | 'medium' | 'large';    // for mowing
  cadence?: 'weekly' | 'biweekly' | 'monthly';
  scope_value?: number;                          // for per_linear_foot / per_cubic_yard
  hedge_height?: 'low' | 'medium' | 'tall';
  base_price_cents: number;
  sales_tax_pct: number;                          // 6.75 (configurable)
  total_price_cents: number;
  // COGS
  cogs_cents: number;
  gross_margin_cents: number;
  gross_margin_pct: number;
}
```

## Invariants

1. `cap_id` MUST exist in `state/capability-registry.yaml`.
2. `license_required` MUST be `null` if no license required (sl_mowing etc.) OR match a license in research/regulatory/largo-licensing-map.yaml.
3. `pricing_ladder[]` MUST contain at least one tier for `status='active'`.
4. `season='hurricane'` services have `default_duration_minutes` that includes 30-min safety buffer.
5. `default_duration_minutes > 0`; `solo_crew_min ≤ solo_crew_max`.

## Lifecycle

```text
draft → active (when capability graduates to deployed)
active → seasonal_pause (off-season, e.g., seasonal cleanup off-peak)
seasonal_pause → active (when season returns)
active → deprecated (only after steward's Decision Template entry)
deprecated — terminal state
```

## Service-line → capability mapping

| service_line | cap_id | license_required |
|---|---|---|
| mowing | cap_mowing_standard | null |
| edging | cap_edging_hard_edge | null |
| mulching | cap_mulching_install | null |
| hedge_trim | cap_hedge_trim | null |
| hurricane_prep | cap_hurricane_prep | null |
| seasonal_cleanup | cap_seasonal_cleanup | null |
| fertilization | (deferred) | fdacs_lcfa |
| irrigation | (deferred) | pcclb_irrigation_specialty |
| pest_control | (blocked) | fl_482_pco |

## Cross-references

- **Reads:** Capability (maturity, ownership)
- **Writes:** Quote (price ladder), Job (default duration, equipment)
- **KPIs derived:** Service-mix distribution, AOV per service, margin by service