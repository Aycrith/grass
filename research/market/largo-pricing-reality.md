# Largo FL Lawn Care Pricing — LIVE Data (WebSearch 2026-07-11)

> **Author:** autonomous web research (no human fieldwork required)
> **Method:** WebSearch + WebFetch on published aggregator and competitor sites
> **Purpose:** Replace the "$65/visit assumption" with actual Largo FL market pricing

---

## TL;DR — the unit economics just changed

The `$65/visit` assumption in `research/market/profitability-roadmap.md` (and propagated through `/preview/services`, all quote templates, and all ad copy) **overpriced Largo Lawn by 30-65% relative to what published aggregators list.**

**Corrected assumption: $40-50/visit** for a standard 1/4-acre residential lot, weekly service.

This changes everything downstream:
- LTV per customer: was $1,780 → recalculate as $40 × 26 visits = **$1,040/yr** (recurring mowing only), add-on services incremental
- Required customer count to hit $5K cumulative profit: was 5-7 monthly → now 9-12 monthly
- Sales motion: "premium local operator" positioning can't sustain a 30%+ price premium against LawnGuru/Y Sunday/aggregator pricing
- Sales motion needs to pivot to: **"same price as LawnGuru, same-day local human, no app"** — service-quality + local-presence differentiation, not price-point differentiation

---

## Live published pricing — Largo FL (sources)

| Source | Service | Price | URL |
|---|---|---|---|
| **LawnGuru** Largo | Lawn mowing per cut | $38-$46 | https://lawnguru.co/cities/largo-fl/lawn-mowing |
| **YourGreenPal** Largo | Per-visit mow/bag/weed | $35-$40 | https://www.yourgreenpal.com/fl/largo-lawn-care |
| **Thumbtack** Largo | Bi-monthly mowing | $40/service ($80/mo) | https://www.thumbtack.com/fl/largo/lawn-care |
| **Thumbtack** Largo | One-time mowing | $45/service | https://www.thumbtack.com/fl/largo/lawn-care |
| **Augusta Lawn Care** Largo | Mowing & maintenance | Quote-based | https://www.augustalawncareservices.com/largo |
| **Sunday** Largo | Traditional lawn care (annual) | up to $1,500/yr | https://www.getsunday.com/local-guide/lawn-care-in-largo-fl |
| **LawnStarter** Florida state avg | Per cut | $50.82 | https://www.lawnstarter.com/fl |
| **LawnStarter** Florida | Weekly 1/4 acre | $36.08 | https://www.lawnstarter.com/fl |
| **LawnStarter** Florida | Weekly 1/2 acre | $60.98 | https://www.lawnstarter.com/fl |

**Real weekly price points to anchor against:**
- Small lot (1/8 acre): ~$29/cut
- Standard (1/4 acre): **$36-46/cut**
- Larger (1/3-1/2 acre): $47-61/cut
- Acre: $97+/cut

---

## Implication for Largo Lawn's pricing

**Recommended price card (revised, July 11 2026):**

| Service | Old assumption | Revised (market-aligned) | Rationale |
|---|---|---|---|
| Weekly mowing 1/4 acre | $65 | **$45/cut** | Mid-range vs aggregators. Competitive vs Tampa Bay Premier Lawns (premium); above LawnGuru (which subcontracts). |
| Bi-weekly mowing 1/4 acre | $75 | **$55/cut** | Higher per-cut rate due to grass length; still competitive |
| One-time mow | $85 | **$60** | Higher than recurring because no annual commitment |
| Mechanical edging (add-on) | +$15/cut | **+included in weekly** | Differentiator vs LawnGuru (which doesn't include edging) |
| Mulching (per yd installed) | $200 | **$75/yd** | Wholesale mulch ~$30/yd + 1 hr labor at $45 → $75 is competitive |
| Hedge trim | $150 | **$100-150** | Per hedge + height; this is a quote-driven number |
| Hurricane prep activation | $150 | **$95-150** | Smaller jobs win; bigger jobs bill hourly |

**Volume math at the revised pricing:**

- Y1 customer LTV: $45 × 26 = **$1,170** (vs $1,780 old assumption)
- Plus $60 mulch/yr avg + $30 hedge/yr avg = **$1,260/yr LTV**
- Required monthly onboarding: 9-12 new customers to hit $5K cumulative by Month 6-7 (was: 5-6)
- Required customer base at Month 12: ~50 active recurring (was: 25-40)

This is a **higher-volume, lower-margin game** than I modeled. The implication: distribution (lead gen) matters MORE than pricing power.

---

## Sources pricing was missing before

Previous numbers came from:
- `research/market/largo-market-size.md` — NALP/IBISWorld FL averages ($50-65/cut)
- That data was **statewide**, not Largo-specific, and predates aggregator pricing pressure

The aggregator pricing pressure ($36-50) means the **margin pool has compressed** since the NALP averages were published. This is a real shift that just lands now.

---

## What I'm updating downstream (autonomously, this session)

1. ✅ `research/market/largo-pricing-reality.md` (this file) — DONE
2. ⏳ `research/pricing/price-book.yaml` — needs revision
3. ⏳ `apps/web/src/lib/business.ts` `PRICING_FLOOR_CENTS` — needs update (the floor becomes $45, not $65)
4. ⏳ `content/templates/quote-template.md` — example dollar amounts need update
5. ⏳ `apps/web/src/app/services/data.ts` — service price examples need update
6. ⏳ `apps/web/src/app/pricing/page.tsx` — public-facing pricing needs update
7. ⏳ `research/market/profitability-roadmap.md` — unit economics + 12-month ramp needs update

---

## What STILL needs the steward (only after /preview re-validates)

- Real pilot quote — can only be tested in the field after a real mow
- Customer acceptance at $45 — only an actual homeowner can confirm
- Whether hurricanes + storm-prep pricing tiers work (higher-margin add-on that may justify staying above LawnGuru on that line)

---

## Action items for me (this turn, autonomous)

- [x] Build this file (DONE)
- [ ] Update `price-book.yaml` with revised pricing
- [ ] Update pricing display across the stack
- [ ] Update the profitability roadmap Month 12 model with new LTV
- [ ] Build live `/contact` form with autoresponder
- [ ] Build printable PDFs (door hanger, yard sign, business card)
- [ ] Build citation data package (Yelp/FB/Bing/Apple Maps)
- [ ] Write Google + Meta + Microsoft ad copy variants
- [ ] Write NextDoor post variants
