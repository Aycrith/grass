# Digital Twin — Marketing

> **Definition.** A `Marketing` record tracks every paid acquisition spend, content asset, and lead source attribution for CAC analysis.
>
> **Owner agent.** marketing.
>
> **Cross-ref.** Lead (attribution), KPI (marketing's CAC/LTV rollups).

---

## Schema

```typescript
interface MarketingCampaign {
  id: string;
  // Channel
  channel: 'gbp' | 'nextdoor' | 'google_ads' | 'meta_ads' | 'organic_seo' | 'referral' | 'print' | 'door_hanger' | 'yard_sign';
  campaign_name: string;
  // Spend
  budget_cents: number;
  spent_cents: number;
  // Output
  impressions?: number;
  clicks?: number;
  ctr_pct?: number;
  leads_attributed: number;
  // Customer acquisition
  customers_acquired: number;     // leads that converted to won
  cac_cents?: number;             // spent_cents / customers_acquired
  // Timing
  start_date: string;
  end_date?: string;
  // Tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  tracking_phone?: string;         // for call-tracking on GBP
  // Audit
  created_at: string;
  updated_at: string;
}

interface ContentAsset {
  id: string;
  kind: 'blog_post' | 'landing_page' | 'service_page' | 'gbp_post' | 'social_post' | 'video' | 'image';
  title: string;
  url?: string;
  target_keyword?: string;        // primary keyword from research/seo/largo-keyword-map.md
  secondary_keywords?: string[];
  word_count?: number;
  publish_date?: string;
  // Performance
  impressions?: number;
  clicks?: number;
  ctr_pct?: number;
  conversions?: number;            // leads attributed
  // Audit
  created_at: string;
  updated_at: string;
}
```

## Invariants

1. Every `Lead` MUST trace to exactly one `MarketingCampaign` (its source = that campaign's channel + UTM).
2. `cac_cents = spent_cents / customers_acquired` (computed; not stored unless overridden).
3. `channel='gpb'` is treated as zero-spent (organic presence) but has impressions + calls data.
4. `MarketingCampaign` cannot be deleted; only `end_date` set.

## Channel mix rules (per plan)

| Channel | Max % of monthly spend | Why |
|---|---|---|
| GBP organic presence | n/a (no direct spend) | Must-have; no spend |
| Citations | $100 one-time | Day-12 of Month 2 |
| Google Ads | 40% | Targeted, scalable |
| Meta Ads | 0% Month 2-3 | Off until GBP + organic proven |
| Nextdoor local | 15% | Trust signal in Pinellas |
| Door hangers | 10% | Targeted geographic neighborhoods |
| Yard signs | 5% | Brand visibility at customer properties |

## Cross-references

- **Reads:** Lead (for attribution), KPI (for CAC rollup)
- **Writes:** Lead (sets source + UTM)
- **KPIs derived:** CAC by channel, channel mix %, content → lead conversion