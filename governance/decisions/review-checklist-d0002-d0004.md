# OBJ-DEBT-DECISIONS-002 — D-0002 / D-0003 / D-0004 30-Day Production Review

> **Date authored:** 2026-07-10 | **Status:** Review checklist template.
>
> **When to use:** ≥30 days after first paying customer (D-0002/D-0003/D-0004
> have all been in production for 30+ days).
>
> **What this is:** A pre-authored review checklist so that when the 30-day
> window elapses, the steward (and Claude Code session) can execute the review
> mechanically rather than re-inventing it under time pressure.
>
> **Why author now:** Charter principle: "Maintainability over velocity. Refactor
> weekly, not 'later.'" The checklist itself is the artifact; the actual review
> runs against measured data at the 30-day mark.

---

## Reviewer

Steward (decision authority) + executive-agent (assists with data assembly).

## Method

For each decision (D-0002, D-0003, D-0004), evaluate against 4 dimensions:

1. **Predicted vs. actual cost** — did the predicted monthly cost hold?
2. **Predicted vs. actual operational impact** — did it work as designed?
3. **Reversibility cost** — what would it take to reverse this decision now?
4. **Net charter alignment** — does this decision still serve the long-term capability goal?

Each dimension is rated 1-5:
- 1: Decision has failed; reversal recommended
- 3: Decision is working as predicted; no change
- 5: Decision is working BETTER than predicted; reaffirm

---

## D-0002 — Tech Stack Selection (Next.js + Supabase + Stripe + Vercel + Jobber)

**Ratified:** 2026-07-10 (Phase 0)
**Review trigger:** First 30 days of production traffic
**Original rationale:** See `governance/decisions/0002-tech-stack.md`

### Predicted cost (from D-0002)

| Item | Predicted monthly | Source |
|---|---|---|
| Vercel | $0-20 | Hobby tier until >100GB bandwidth |
| Supabase | $0-25 | Free tier until 500MB DB |
| Stripe | per-transaction | No monthly fee |
| Jobber | $39/mo | Starter plan |
| Resend | $0-20 | Free tier 100 emails/day |
| Twilio | $1-3 per 1000 SMS | Pay-as-you-go |
| **Total** | **<$200/mo infra ceiling** | D-0002 cost ceiling |

### Review dimensions

#### 1. Predicted vs. actual cost

```
Measure:
  - Pull Vercel invoice → /month
  - Pull Supabase invoice → /month
  - Pull Stripe fee summary → /month
  - Pull Jobber invoice → /month
  - Pull Resend usage → /month
  - Pull Twilio usage → /month

Compare to predicted values above.

Score 1-5 based on variance:
  1: actual > 1.5× predicted (budget breach)
  3: actual within ±25% of predicted (acceptable)
  5: actual < 0.75× predicted (under budget — usually good)
```

#### 2. Predicted vs. actual operational impact

```
Measure:
  - Bundle size (Next.js): target <200KB initial JS
  - LCP (largest contentful paint): target <2.5s
  - CLS (cumulative layout shift): target <0.1
  - Lead capture form success rate: target ≥95% submission success
  - Stripe webhook success rate: target 100%
  - Jobber dispatch delay: target <60s

Score 1-5 based on metrics:
  1: any metric >2× off target
  3: all metrics within ±25% of target
  5: all metrics better than target
```

#### 3. Reversibility cost

```
If we needed to leave Vercel today:
  - Next.js app: portable to any Node host (Cloudflare, Fly.io, self-hosted)
  - Cost estimate: 1 week to migrate + $50-200 setup + ongoing ops overhead

If we needed to leave Supabase today:
  - Postgres-only schema: portable to any Postgres provider (Neon, RDS, self-hosted)
  - RLS policies: portable to any Postgres + auth combination
  - Cost estimate: 2-4 weeks + ongoing ops overhead

If we needed to leave Stripe today:
  - Stripe-only features (Connect, Radar): not 1:1 portable
  - Cost estimate: 2-3 weeks engineering + customer comms

If we needed to leave Jobber today:
  - Jobber admin app: REPLACING with self-built is a 4-8 week project
  - Cost estimate: 4-8 weeks + $0 saved (admin app rebuild is net cost)

Score 1-5:
  1: Reversal cost >$10K + 8 weeks
  3: Reversal cost <$2K + 2 weeks
  5: Reversal cost <$500 + 3 days
```

#### 4. Net charter alignment

```
Re-read D-0002 rationale (next.js + supabase + stripe + vercel + jobber).

Question: Does this stack still maximize long-term capability per $ spent?

Test: If starting Mission 1 over today, would we pick this stack again?
  - Next.js: YES (no alternative App Router with this maturity)
  - Supabase: YES (auth + DB + storage + RLS in one)
  - Stripe: YES (industry standard for SMB payments)
  - Vercel: YES for Mission 1; reconsider at Mission 2 (cost grows)
  - Jobber: YES for Year 1; replace with self-built at MRR >$5K/mo

Score 1-5 based on alignment:
  1: Stack is hindering capability
  3: Stack is neutral / replaceable
  5: Stack is actively compounding capability
```

### Composite D-0002 score

```
weighted_total = 0.30 × cost_score
              + 0.40 × operational_score
              + 0.15 × reversibility_score
              + 0.15 × alignment_score

Reaffirm decision: total ≥ 3.5
Reversal recommended: total < 2.5
Inconclusive (re-review in 30 days): 2.5 ≤ total < 3.5
```

---

## D-0003 — Mission 1 Service Area (Largo, FL 33771)

**Ratified:** 2026-07-10 (Phase 1)
**Review trigger:** First 30 days of production traffic
**Original rationale:** See `governance/decisions/0003-service-area.md`

### Predicted (from D-0003)

- Service area: 33771 + adjacent ZIPs (33770, 33778, 33773, 33774, 33756)
- Target customer count Year 1: 25-50 active recurring
- TAM: ~$4.2M residential lawn (Pinellas, hyperlocal)

### Review dimensions

#### 1. Actual lead distribution by ZIP

```
Measure:
  - Pull all leads from /api/lead over last 30 days
  - Group by ZIP
  - Compare to expected distribution (Largo 33771 should dominate)

Score:
  1: 0 leads from target ZIPs (market doesn't exist)
  3: Some ZIPs over-represented, others silent
  5: Distribution matches expectation + 1+ leads from each target ZIP
```

#### 2. Lead-to-quote conversion

```
Measure:
  - Quotes sent / Leads received
  - Target: ≥35%

Score:
  1: <15% conversion (target market wrong)
  3: 25-35% conversion (target market valid, qualification needs work)
  5: ≥35% conversion
```

#### 3. Distance/route efficiency

```
Measure:
  - Average drive time between jobs (Mapbox Optimization API)
  - Target: ≤15 min between jobs in same route

Score:
  1: >30 min between jobs (service area too dispersed)
  3: 15-30 min between jobs (manageable but not optimal)
  5: ≤15 min between jobs (tight routing)
```

#### 4. ZIP exclusion requests

```
Measure:
  - Count of "Sorry — we don't service your ZIP" responses
  - Note any repeated ZIPs (signal for service area expansion)

Score:
  1: Many requests from same ZIP (clear demand outside area)
  3: Some scattered requests (no clear pattern)
  5: Few requests (service area matches demand)
```

### Composite D-0003 score

```
weighted_total = 0.40 × distribution_score
              + 0.30 × conversion_score
              + 0.20 × routing_score
              + 0.10 × exclusion_score

Reaffirm decision: total ≥ 3.5
Service area expansion recommended: ZIP exclusion score = 1 + 5+ requests from same ZIP
Service area contraction recommended: routing score = 1 (too dispersed)
Inconclusive (re-review): 2.5 ≤ total < 3.5
```

---

## D-0004 — Solo Founder / Lean Operating Model

**Ratified:** 2026-07-10 (Phase 0)
**Review trigger:** First 30 days of production traffic
**Original rationale:** See `governance/decisions/0004-operating-model.md`

### Predicted (from D-0004)

- Solo founder capacity: ~25 active recurring customers before breaking
- First hire trigger: MRR >$5K/mo OR customer count >30
- Hours/wk after PMF: 30 (target)

### Review dimensions

#### 1. Actual hours/wk on operations

```
Measure:
  - Time-tracking (Toggl, Harvest, or manual log) for 4 weeks
  - Compare to predicted 30 hrs/wk target

Score:
  1: >50 hrs/wk (burnout risk; hire signal)
  3: 30-40 hrs/wk (sustainable; on target)
  5: <30 hrs/wk (capacity headroom)
```

#### 2. Customer count vs. capacity

```
Measure:
  - Active recurring customer count
  - Compare to 25-customer capacity target

Score:
  1: <10 customers (under-utilized)
  3: 10-25 customers (sustainable)
  5: ≥25 customers at <40 hrs/wk
```

#### 3. Single-point-of-failure risk

```
Measure:
  - Days with ZERO capacity to respond (sick day, equipment failure)
  - Customer impact: how many cancellations in last 30 days?
  - Target: 0 unexpected cancellations

Score:
  1: Multiple cancellations, no backup plan
  3: Some cancellations, ad-hoc backup
  5: Zero cancellations OR backup coverage in place
```

#### 4. First-hire signal

```
Trigger conditions from D-0004:
  - MRR >$5K/mo for 3 consecutive months
  - Customer count >30
  - Hours/wk >40 sustained

Measure: any trigger met?

Score:
  1: All 3 triggers met (hire NOW)
  3: 1 trigger met (plan hire within 60 days)
  5: 0 triggers met (operating model holds)
```

### Composite D-0004 score

```
weighted_total = 0.40 × hours_score
              + 0.30 × customer_count_score
              + 0.20 × failure_risk_score
              + 0.10 × hire_signal_score

Reaffirm decision: total ≥ 3.5
First hire recommended: hire_signal = 1
Operating model revision: hours_score = 1 OR failure_risk_score = 1
Inconclusive (re-review): 2.5 ≤ total < 3.5
```

---

## Output of this review

Create a new ADR: `governance/decisions/REVIEW-D0002-3-4.md` containing:

```markdown
# 30-Day Production Review of D-0002, D-0003, D-0004

**Status:** [Draft / Ratified]
**Review date:** [DATE — actual review execution date]
**Review window:** First 30 days of production traffic
**Reviewer:** Steward + executive-agent

## Composite scores

| Decision | Composite | Action |
|---|---|---|
| D-0002 (tech stack) | X.X / 5.0 | [Reaffirm / Reverse / Inconclusive] |
| D-0003 (service area) | X.X / 5.0 | [Reaffirm / Expand / Contract / Inconclusive] |
| D-0004 (operating model) | X.X / 5.0 | [Reaffirm / Hire / Revise / Inconclusive] |

## D-0002 detail

[cost_score, operational_score, reversibility_score, alignment_score + raw data]

## D-0003 detail

[distribution, conversion, routing, exclusion scores + raw data]

## D-0004 detail

[hours, customer count, failure risk, hire signal scores + raw data]

## Actions taken

[If any decision reversed/expanded/contracted, list the actions and the new ADR]

## State ledger update

OBJ-DEBT-DECISIONS-002 → completed with this artifact_ref.
```

---

## When this checklist is invalidated

If any of D-0002/D-0003/D-0004 is reversed in the first 30 days, this checklist is invalidated and a new review cycle starts from the reversal point.

## Cross-references

- D-0002: `governance/decisions/0002-tech-stack.md`
- D-0003: `governance/decisions/0003-service-area.md`
- D-0004: `governance/decisions/0004-operating-model.md`
- State ledger objective: OBJ-DEBT-DECISIONS-002
- Charter principle: `constitution/01-constitution.md` ("Refactor weekly, not later")
- Charter-compliance script: `scripts/charter-compliance.ts`