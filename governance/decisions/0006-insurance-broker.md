# D-0006 — Insurance Broker Selection

**Status:** Ratified
**Decision date:** 2026-07-10 (broker category; specific carrier pending quotes)
**Decision file:** governance/decisions/0006-insurance-broker.md (this file)
**Review date:** 2026-12-01 (annual renewal review)
**Owner:** Steward

---

## Context

Mission 1 requires:
- General liability ($1M minimum) before any field work.
- Workers comp exemption filing (DWC-250) for solo founder.
- Insurance rider for hurricane/flood (equipment + business interruption).

Broker selection matters because:
- Premium variance between brokers can be 30-50% for the same coverage.
- A broker who understands Pinellas landscaping will price risks better than a generalist.
- Claims handling quality varies enormously.

## Decision (Phase A — broker category)

**Use a specialist landscaping/lawn-care insurance broker with Florida experience.**

### Why specialist

- Generalist brokers (Geico, Progressive commercial) tend to under-price or over-deny claims for lawn care because they apply generic "small business" rules.
- Specialist brokers (e.g., Hortica, Florist Mutual, or regional FL brokers with landscaping book) understand seasonal risk patterns, equipment-specific coverage, and Florida's regulatory environment.

### Broker candidates (TO RESEARCH — steward must get ≥3 quotes)

| Candidate | Type | How to evaluate |
|---|---|---|
| **Hortica** (hortica.com) | National lawn-care specialist | Direct online quote for FL lawn care; widely used in FL |
| **Florist Mutual Insurance Company** | Regional FL | Smaller book; may have FL-specific expertise |
| **AmTrust Financial** | Landscaping book | National; specialty in lawn care |
| **Insurance Canopy** | Modern digital broker | Quick online quote; good for solo founders |
| **CoverWallet / NEXT Insurance** | Tech-enabled brokers | Easy online UX; competitive for solo |
| **Local Pinellas independent broker** | Local relationship | Best for handling claims; ask for FL lawn-care specialist |

### Required coverage

| Coverage | Minimum | Recommended | Est. annual premium |
|---|---|---|---|
| General liability | $1M per occurrence / $2M aggregate | $2M per occurrence / $4M aggregate | $1,200-1,800 |
| Workers comp | N/A (exempt solo founder via DWC-250) | n/a | $0 |
| Equipment floater | Sum of equipment value | $15K (mower + edger + trimmer + blower + hand tools) | $200-400 |
| Commercial auto | Liability only OR full coverage | Liability only for solo MVP | $800-1,500 |
| Business interruption | 1 month operating cost | 1 month ($1,500-2,000) | $150-300 |
| Hurricane/flood | Equipment + property | Per equipment value (mower ~$5K-10K commercial zero-turn) | $300-600 |
| **Total estimated annual** | | | **$2,650-4,600** |

### Decision matrix (when steward has 3 quotes)

Score each candidate on:

| Criterion | Weight |
|---|---|
| Annual premium (total) | 30% |
| Coverage adequacy (each line item met) | 25% |
| Claims handling reputation | 20% |
| Florida-specific experience | 15% |
| Online service / digital quotes | 10% |

Pick the highest-scored broker whose coverage meets minimums.

## Phase A deliverables (before any quote is requested)

1. Create a list of all equipment with serial numbers and values (for equipment floater).
2. Decide commercial-auto coverage type (liability-only vs full).
3. Confirm sales-tax-registered entity (D-0005) — needed for broker application.

## Risks accepted

- **Under-insurance on equipment.** A commercial zero-turn is $5K-10K; replacing it out-of-pocket is 6-12 months of profit. Mitigation: equipment floater covers this; review annually as fleet grows.
- **Hurricane deductible.** FL hurricane deductibles typically 2-5% of structure value. Mitigation: cash reserve (1-month operating cost) covers deductible + interruption.
- **Workers comp lapse on first hire.** Mitigation: see D-0004 trigger to re-evaluate.

## Phase B (deferred to Phase 2)

Once MRR >$3K/mo, get a quote for:
- Cyber liability (in case customer data is breached via CRM/portal).
- Umbrella policy ($1M additional) for asset growth.

These are not Day-1 requirements.

## When this decision is re-evaluated

| Trigger | Action |
|---|---|
| Annual renewal | Re-shop; premiums change yearly |
| First employee hired | Re-quote workers comp (no longer exempt) |
| Adding commercial auto (vehicle titled to LLC) | Adjust commercial auto |
| Hurricane incident | Re-evaluate flood/wind deductibles |
| MRR >$3K/mo | Add cyber + umbrella |

## Action item for steward

`OBJ-DAY8-003`: Get 3 broker quotes, run decision matrix, ratify D-0006 phase B (carrier name). Commit results by Day 9.