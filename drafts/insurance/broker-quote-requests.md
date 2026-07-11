# OBJ-M2-003 — Insurance Broker Quote Requests (DRAFT, ready to send)

> **Status:** Draft emails ready to send.
> **Authorization:** D-0006 (broker category ratified)
> **Goal:** Get 3 quotes within 7-10 business days.
> **Total estimated annual premium:** $2,650-4,600 (per D-0006)

---

## Pre-flight checklist

- [ ] Sunbiz-filed LLC
- [ ] Equipment list with values (see drafts/equipment/equipment-list.md)
- [ ] Vehicle VIN + coverage choice (liability-only OR full)
- [ ] D-0006 reviewed: `governance/decisions/0006-insurance-broker.md`

## Coverage you're requesting quotes for

Per D-0006 decision matrix:

| Coverage | Minimum | Recommended |
|---|---|---|
| General liability | $1M / $2M aggregate | $2M / $4M aggregate |
| Workers comp | N/A (DWC-250 exempt) | n/a |
| Equipment floater | Sum of equipment value | $15K |
| Commercial auto | Liability only OR full | Liability only |
| Business interruption | 1 month op cost ($1.5K-2K) | Same |
| Hurricane/flood | Equipment value (mower ~$5K-10K) | Same |

## Equipment list to include in broker email

> Copy from drafts/equipment/equipment-list.md once final.

## Three brokers to email

### Broker 1: Hortica (national lawn-care specialist)

```
To:          quotes@hortica.com
Subject:     FL Landscaping Insurance Quote Request — Solo Founder LLC

Body:

Hello,

I'm requesting a quote for commercial insurance for my newly-formed Florida
LLC. Details below.

BUSINESS:
  GRASS LAWN AND LANDSCAPE LLC
  Sunbiz Document #: [L23000XXXXXX]
  EIN: [XX-XXXXXXX]
  NAICS: 561730 — Landscaping Services
  Operations start: [ANTICIPATED DATE — e.g., 30 days from filing]
  Service area: Pinellas County FL (ZIPs 33756, 33770, 33771, 33773, 33774, 33778)
  Employees: 0 (solo founder; FL DWC-250 corporate-officer exemption on file)

COVERAGE REQUESTED:
  - General liability: $2M per occurrence / $4M aggregate
  - Equipment floater: $15K (see attached equipment list)
  - Commercial auto: liability only on 202X [MAKE/MODEL], VIN [VIN]
  - Business interruption: 1 month operating cost (~$2K)
  - Hurricane/wind: equipment only (no structure)

EQUIPMENT (full list attached):
  - 2024 Commercial zero-turn mower — $7,500
  - 2024 Push mower — $900
  - 2024 Commercial edger — $650
  - 2024 Backpack blower — $450
  - Hand tools (rakes, shovels, hedge clippers) — $400
  - Total equipment value: ~$9,900

PILOT WORK: I'll be doing roughly 5-10 residential visits/week to start, growing
to 25-30/week by Month 6. No commercial contracts yet.

Could you provide a quote within 7-10 business days? Happy to schedule a call
if helpful.

Thank you,
[YOUR NAME]
[PHONE]
[EMAIL]
```

### Broker 2: Insurance Canopy (digital broker, fast turnaround)

```
To:          [contact form on insurancecanopy.com]
Subject:     FL Landscaping — Insurance Quote Request

[same body, minus the policy details — Insurance Canopy's intake form is on their site]
```

### Broker 3: Local Pinellas independent broker

```
To:          [find via Google "landscaping insurance broker Pinellas County FL"]
Subject:     FL Lawn-Care Insurance — Looking for FL-Specialized Broker

Body:

Hello,

I'm a solo founder launching a residential lawn-care business in Largo, FL.
I'm specifically looking for a broker with Florida landscaping experience
(not a generalist — I want someone who understands FL hurricane exposure,
seasonal workforce patterns, and Pinellas County's regulatory environment).

I have a draft equipment list and operating plan ready to share. Could you
provide an initial conversation / quote within 7-10 days?

Key details (similar to above):
  - GRASS LAWN AND LANDSCAPE LLC (single-member FL LLC)
  - NAICS 561730, Pinellas County service area
  - Solo founder (DWC-250 exempt)
  - Coverage scope per attached

If you're not the right person, could you refer me to a colleague who
specializes in lawn care / landscaping in FL?

Thank you,
[YOUR NAME]
```

---

## Decision matrix — populate when quotes return

Per D-0006, score each candidate on these weighted criteria:

| Criterion | Weight | Broker 1 | Broker 2 | Broker 3 |
|---|---|---|---|---|
| Annual premium (total) | 30% | | | |
| Coverage adequacy | 25% | | | |
| Claims handling reputation | 20% | | | |
| Florida-specific experience | 15% | | | |
| Online service / digital quotes | 10% | | | |
| **Weighted total** | | | | |

Pick highest-scored broker whose coverage meets minimums.

## Decision template (after quote selection)

Create new ADR at `governance/decisions/0008-insurance-carrier.md`:

```markdown
# D-0008 — Insurance Carrier Selection (Phase B of D-0006)

**Status:** [Draft / Ratified]
**Decision date:** [DATE]
**Decision file:** governance/decisions/0008-insurance-carrier.md
**Review date:** [NEXT YEAR, ~annual renewal]
**Owner:** Steward

## Context

D-0006 Phase A ratified broker category (FL-specialist).
Phase B selects the specific carrier based on 3 received quotes.

## Quotes received

| Broker | Annual premium | Coverage score | FL expertise | Total weighted |
|---|---|---|---|---|
| Broker 1 | $X | X/10 | X/10 | X.X |
| Broker 2 | $X | X/10 | X/10 | X.X |
| Broker 3 | $X | X/10 | X/10 | X.X |

## Decision

Selected broker: [NAME]
Annual premium: $[AMOUNT]
Effective date: [DATE]
Policy #: [NUMBER]

## Alternatives considered

- Higher-premium broker with better claims handling — REJECTED because
  the score difference is within noise and the saving is material for
  a solo-founder Year 1 budget.
- Lower-premium broker with less FL expertise — REJECTED because FL
  hurricane exposure is unique and under-pricing risk outweighs the
  $300-500 savings.

## Risks accepted

- [Per broker's actual exclusions and deductibles]

## Implementation

- Bind coverage effective [DATE]
- Add insurance broker contact to `agents/operations.md` references
- Add policy PDFs to `governance/filings/insurance/[policy-name].pdf`
```

## After carrier is bound

1. Update `state/ledger.yaml` OBJ-M2-003 status to completed.
2. Add policy docs to `governance/filings/insurance/`.
3. **Critical:** Do NOT begin any field work before coverage is bound.
   Insurance is the Day-8 GATE for `sl_mowing_standard` per licensing map.

## State ledger update (post-binding)

```yaml
- id: OBJ-M2-003
  status: completed
  completed_date: <DATE>
  artifact_ref: governance/decisions/0008-insurance-carrier.md
  policy_pdfs:
    - governance/filings/insurance/general-liability.pdf
    - governance/filings/insurance/equipment-floater.pdf
    - governance/filings/insurance/commercial-auto.pdf
    - governance/filings/insurance/business-interruption.pdf
  next_review_date: <NEXT YEAR>
  gate_protected: "OBJ-M2-005 (equipment purchase — must precede field work)"
```