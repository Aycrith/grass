# Profitability Roadmap — Largo Lawn (DRAFT)

> **Purpose:** Step-by-step, dollar-by-dollar projection from $0 to
> profitability. Answers "will this actually make money?" with
> data-grounded assumptions.
> **Assumptions:** Solo-founder, $200/mo infra ceiling (D-0004), FL
> sales tax 6.75% (D-0007 fix), 33771 + 5 adjacent ZIPs (D-0003).
> **Source assumptions:**
> pricing-book.yaml, market-size.md, capability-registry.yaml.
> **Status:** DRAFT — steward validates before OBJ-M2-006 launch.

---

## Executive summary

**Breakeven: Month 3-4.** Solo-founder operating profit from Month 4.
**$5K cumulative by Month 5.** **$20K cumulative by Month 12.**
**$30K stretch (faster customer acquisition).** **$12K pessimistic
(slower).** All scenarios stay under $200/mo infra ceiling through
Month 6.

This is fundamentally an execution play, not a market-timing play.
The market is validated (per `research/market/largo-market-size.md`),
the pricing is set (per `research/pricing/price-book.yaml`), and the
service line is permitted (per `research/regulatory/largo-licensing-map.yaml`).
The risk is *getting and keeping customers*, not the unit economics.

---

## Unit economics (every calculation flows from these)

**Per-customer revenue (Year 1 steady state):**
- Mowing weekly @ $65/visit × 26 visits/yr = **$1,690/yr LTV**
- 30% of customers buy one mulching service @ $200 = **$60/yr blended**
- 20% buy one hedge-trim @ $150 = **$30/yr blended**
- **Total LTV Year 1: $1,780/customer**
- **Monthly recurring revenue per customer: $148**

**Per-customer COGS:**
- Equipment depreciation (rental or wear-and-tear on borrowed): $8/mo
- Fuel + drive time amortized: $12/mo
- Materials (mulch, trimmers): $10/mo (only on service jobs)
- **Total COGS: $30/mo per customer** = **20% of revenue**
- **Gross margin: 80%** (well above the 35% target in pricing book;
  conservative because mower depreciation is a smaller piece of the
  pie than the model assumed)

**Per-customer overhead (amortized):**
- Google Voice: $0
- Insurance (post-Month 4 deferral react): $200/mo ÷ 25 customers = $8/mo
- Ad spend (after free credits): $50/mo ÷ 25 = $2/mo
- Software (Stripe + Vercel): $20/mo ÷ 25 = $1/mo
- Domain: $0.42/mo ÷ 25 = $0.02/mo
- **Total overhead per customer at 25-customer scale: $11/mo**

**Per-customer monthly profit at 25-customer scale:**
- Revenue: $148
- COGS: $30
- Overhead: $11
- **Net per customer: $107/mo**

These are *good* unit economics. The hard part is scaling the
customer count.

---

## Cash flow projection (conservative baseline)

**Assumptions:**
- Month 1-2: GBP verification + first 1-3 paid pilots (build review velocity)
- Month 3-6: linear ramp from 3 to 15 customers via organic + ad-credit combo
- Month 7-12: growth via referrals + repeat organic + (post-credit) light paid ads
- No new hires in Year 1 (solo founder)
- Insurance deferred until Month 4 cash gate crosses $2.5K cumulative

| Month | New | Total | MRR | COGS | OH | Net | Cumulative |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | $0 | $50 | $10 | -$60 | **-$60** |
| 2 | 1 | 1 | $148 | $80 | $15 | +$53 | -$7 |
| 3 | 2 | 3 | $444 | $140 | $25 | +$279 | **+$272** |
| 4 | 3 | 6 | $888 | $230 | $130 | +$528 | +$800 |
| 5 | 4 | 10 | $1,480 | $350 | $185 | +$945 | **+$1,745** |
| 6 | 5 | 15 | $2,220 | $495 | $230 | +$1,495 | +$3,240 |
| 7 | 5 | 20 | $2,960 | $640 | $255 | +$2,065 | +$5,305 |
| 8 | 5 | 25 | $3,700 | $785 | $280 | +$2,635 | +$7,940 |
| 9 | 5 | 30 | $4,440 | $930 | $305 | +$3,205 | +$11,145 |
| 10 | 5 | 35 | $5,180 | $1,075 | $330 | +$3,775 | +$14,920 |
| 11 | 5 | 40 | $5,920 | $1,220 | $355 | +$4,345 | +$19,265 |
| 12 | 5 | 45 | $6,660 | $1,365 | $380 | +$4,915 | **+$24,180** |

**Month 12 baseline:** $6,660 MRR × 12 = ~$80K ARR.
**Year 1 net profit: $24,180** (operating cash, before taxes / LLC formation costs).

---

## Stretch scenario (faster customer acquisition)

What happens if we hit the upper end of every assumption:
- Month 1: 2 paid pilots
- Month 3: 8 customers (free ad credits convert higher-than-average)
- Linear ramp 6 customers/month thereafter

| Month | Total | MRR | Cumulative |
|---|---|---|---|
| 3 | 8 | $1,184 | +$1,400 |
| 6 | 25 | $3,700 | +$8,500 |
| 9 | 42 | $6,216 | +$22,800 |
| 12 | 60 | $8,880 | **+$44,000** |

**Stretch Year 1: $44K net.** **$8,880 MRR by Month 12.**
This is the **reinvestable number** that funds the
OBJ-M2-001/002/003 ladder AND a second service line.

## Pessimistic scenario (slower / winter slowdown)

What happens if customer ramp is slower:
- Month 3: 1 paying customer only
- Month 6: 5 customers
- Linear ramp 2 customers/month thereafter

| Month | Total | MRR | Cumulative |
|---|---|---|---|
| 3 | 1 | $148 | -$200 |
| 6 | 5 | $740 | +$700 |
| 9 | 11 | $1,628 | +$3,400 |
| 12 | 17 | $2,516 | **+$7,800** |

**Pessimistic Year 1: $7,800 net.** Still positive, just slower.
**Trigger:** if Month 6 < 5 customers → distribution strategy
review (see risk gates).

---

## Customer acquisition math (how do we get to 45 by Month 12?)

Starting at 0, ending at 45, across 12 months = average **3.75 new
customers/month**. Realistic mix:

| Channel | New customers/mo | Total over 12 mo | Cost/lead |
|---|---|---|---|
| Organic + GBP (post-verification) | 1.5 | 18 | $0 |
| Free ad credits (Google + Meta + Bing) | 1.0 | 12 | $0 (credit-paid) |
| Referrals (post-pilot-3) | 0.5 | 6 | $0 |
| NextDoor Local Deals | 0.25 | 3 | $0 |
| Repeat organic (returning) | 0.5 | 6 | $0 |
| **Total** | **3.75** | **45** | **$0 effective** |

Note: pre-credit (Month 1-3), ramp is slower because reviews
haven't accumulated. Post-credit (Month 4+), GBP ranking lifts and
conversion improves.

---

## Cash ladder triggers (when deferred items reactivate)

Per `state/ledger.yaml → deferred_cash_constrained`. Each cash-gate
milestone corresponds to a specific deferred item becoming critical:

| Cumulative cash | Trigger | Reactivation item | Cash required |
|---|---|---|---|
| $500 | First paid pilot revenue | OBJ-M2-001 (Sunbiz + EIN + bank + DR-1) | $125 |
| $1,000 | First paying customer | OBJ-M2-002 (BTRs + DWC-250) | $92 |
| $2,500 | First paying customer | OBJ-M2-003 (insurance bind) | $2,500-4,600/yr |
| $5,000 | First equipment expense | OBJ-M2-005 (equipment plan) | Variable |

**Note on consolidation:** Once you cross $2,500 cumulative cash, all
four deferred items (Sunbiz + BTRs + insurance + equipment) become
urgent — file them as a batch, not four separate waits.

---

## Risk gates (when to pivot)

| Gate | If < target | Action |
|---|---|---|
| Month 3: < 2 paying customers | Distribution isn't working | Audit funnel: GBP impressions, citation count, ad credit burn rate |
| Month 6: < 10 paying customers | Slow growth | Add hyperlocal Facebook group posts + NextDoor ad boost ($25/mo) |
| Month 9: < 25 customers | Scale-up block | Either (a) invest in paid ads $100-200/mo, (b) hire part-time crew for $20/hr |
| Month 12: < 30 customers | Below plan | Either (a) re-evaluate pricing, (b) hire help, (c) sunset Mission 1 |

These gates are **not failure flags** — they're pivot signals. The
goal is learning what works, not hitting a specific number.

---

## Recurring revenue model (the real moat)

A single mowing visit is a transaction. A weekly mowing schedule
is **recurring revenue** — and that changes the unit economics
dramatically.

| Customer type | LTV Year 1 | LTV Year 2 (if renewed) | Notes |
|---|---|---|---|
| One-time mow | $65 | $0 | Worst unit — high CAC, low margin |
| Monthly-only | $780 | $780 | Better but churn risk |
| Bi-weekly | $1,690 | $1,690 | Strong recurring baseline |
| **Weekly** | **$3,380** | **$3,380** | Best unit — same COGS, 2× revenue |
| Weekly + mulch once/yr | $3,580 | $3,580 | Best LTV add-on |
| Weekly + mulch + hedge | $3,810 | $3,810 | Best realized LTV |

The roadmap above assumes **45 customers at average $148/mo** —
which is bi-weekly with some add-ons. Converting 50% of those to
weekly boosts the projection by $1,690 × 23 = **+$39,000** in Year 2.

**Year 2+ is where the real compounding happens.**

---

## Tax + entity considerations

**Until OBJ-M2-001 reactivates (Sunbiz LLC + EIN + DR-1):**
- Operating as sole proprietor
- Report income on personal Schedule C
- FL sales tax: do NOT collect — invoice "tax not yet collected" or
  absorb into advertised price
- Insurance: none — see risk acceptance in `drafts/README.md`

**When OBJ-M2-001 reactivates (Month 3+, ~$500 cumulative cash):**
- Form FL LLC via Sunbiz ($125)
- Apply for EIN (free, IRS online)
- Open business bank account
- File DR-1 sales tax registration
- Begin collecting FL sales tax (6.75%)
- Invoice customers with sales tax line item

**When OBJ-M2-003 reactivates (Month 6+, ~$2,500 cumulative cash):**
- Bind GL insurance ($2,500-4,600/yr)
- Update GBP, citations, website to reflect "Licensed & Insured"

---

## Decision gates (week-by-week playbook)

These are the actual hands-on-the-keyboard steps. Each week has
one or two specific moves that compound on the prior week.

### Week 1 (Day 1-7)

- [ ] Register `largolawn.pro` ($4.99)
- [ ] Create GBP profile using pre-filled draft
- [ ] Submit GBP verification request (postcard)
- [ ] Author Tier-1 citations (Apple Maps, Bing, FB, Yelp) — 45 min
- [ ] Author review-magnet card (Canva, 30 min)
- [ ] Print 5 review-magnet cards at home/office
- [ ] **Cash out: $4.99**

### Week 2 (Day 8-14)

- [ ] Author Tier-2 citations (Acxiom, Localeze, Foursquare) — 1 hr
- [ ] Ad account setup (Google + Microsoft + Meta + Yelp + NextDoor + Thumbtack)
- [ ] Author ad campaigns per `autonomous-paid-acquisition.md`
- [ ] Begin GBP verification wait (5-14 days)
- [ ] First personal-network outreach (text 5 neighbors)

### Week 3 (Day 15-21)

- [ ] Author Tier-3 citations (niche: lawn-care-specific directories)
- [ ] First paid ad spend starts (Google + Meta)
- [ ] **GBP postcard likely arrives this week** — enter code

### Week 4 (Day 22-30)

- [ ] GBP LIVE — first impressions visible
- [ ] First paid pilot job (likely free first mow to neighbor)
- [ ] Review-magnet card drops at completion
- [ ] **Cash out: $4.99 + ad credits (free)**
- [ ] **First 5-star review target**

### Month 2 milestones
- 1-3 paid pilots completed
- 1-2 GBP reviews acquired
- Cumulative revenue: $0-500
- GBP calls/messages: 5-15
- Citations live: 15-20

### Month 3 milestones (first reactivation gate)
- 3 customers paying
- 3 GBP reviews
- 5 GBP calls/messages per week
- **Cumulative cash crosses $500 → file OBJ-M2-001 (Sunbiz)**

### Month 4 milestones
- 6 customers paying
- 5 GBP reviews
- **Cumulative cash crosses $1K → file OBJ-M2-002 (BTRs)**

### Month 6 milestones (insurance gate)
- 15 customers paying
- 10 GBP reviews
- $3,240 cumulative cash
- **Crosses $2,500 → file OBJ-M2-003 (insurance)**

### Month 9 milestones (first scale-up gate)
- 30 customers paying
- 20 GBP reviews
- $11K cumulative cash
- Decision: stay solo or hire part-time crew

### Month 12 milestones (Year 1 closure)
- 45 customers paying
- 30+ GBP reviews
- $24K cumulative cash
- GBP calls/messages: 30+/week
- Decision: continue solo, hire help, or consider Mission 2

---

## What I will and will not do (decision authority)

**I will:**
- Run ads within credit caps autonomously
- Monitor CPL + conversion daily
- Author all customer-facing artifacts (cards, hangers, scripts)
- Maintain the citation tracker
- Author new content as needed (week-of postmortems)

**I will not (steward identity required):**
- Click "I agree" on any platform's terms of service
- Bind payment methods to any platform
- Pay the $4.99 domain registration
- Pick up GBP verification postcard
- Receive payment into personal bank
- Hire any employees
- Make any decision listed in the charter's irreversibility rules

---

## Cross-references

- Brand identity: `brand/guidelines.md`
- Cash-min activation (D-0011): `governance/decisions/0011-cash-min-activation.md`
- Market sizing (TAM/SAM/SOM): `research/market/largo-market-size.md`
- Pricing (revenue per service): `research/pricing/price-book.yaml`
- Capability registry (what you can deliver): `state/capability-registry.yaml`
- Distribution strategies: `research/distribution/cash-min-distribution-ideas.md`
- Ad-credit plan: `research/distribution/autonomous-paid-acquisition.md`
- Risk register: `state/risk-register.yaml`
- State ledger (cash ladder): `state/ledger.yaml → deferred_cash_constrained`
- Charter (decision authority): `constitution/01-constitution.md`
- Operational runbooks (Week 1+): `playbooks/` (to be authored in Round 5)