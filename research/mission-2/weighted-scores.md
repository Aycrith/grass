# Mission 2 — Pre-Computed Weighted Scores

> **Date:** 2026-07-10 | **Status:** Pre-computed against plausible Mission-1-shaped assumptions.
>
> Charter principle: "Pre-commit the rubric. If we invent scoring in Month 10 under
> launch pressure, we will game it." This document scores the 3 candidates using the
> 8-dimension rubric in `research/mission-2/candidates.md`, with assumptions stated
> explicitly so they can be replaced with real data at Month 10.

---

## Assumptions (replace with measured data at Month 10)

These assumptions come from the bootstrap plan, IBISWorld landscaping benchmark
downscaled to Pinellas, NALP FL seasonality, and Phase-0-Mission-1 pricing research.

| Variable | Value | Source |
|---|---|---|
| Mission 1 TAM (Largo + 5 ZIPs) | $4.2M / yr residential lawn | bootstrap plan + market research |
| Solo-founder capacity after PMF | ~25 active recurring customers | bootstrap plan capacity model |
| Avg ticket (lawn) | $55/visit × 26 visits/yr = $1,430/yr | pricing research |
| Avg ticket (mulch install) | $220 | pricing research |
| Avg ticket (hedge trim) | $180 | pricing research |
| Pilot customer LTV (12 mo) | $400 | bootstrap KPI target |
| Mission 1 ops hours/wk after PMF | 30 hrs (cap) | bootstrap KPI target |
| Margin target | ≥55% gross | bootstrap KPI target |
| Cross-sell attach rate with lawn customers | 35% (pilot estimate) | bootstrap assumption |

## Scoring rubric (from candidates.md)

| Dimension | Weight | 1 | 5 |
|---|---|---|---|
| Capability reusability | 25% | <50% | ≥90% |
| TAM (in service area) | 15% | <$500K/yr | >$5M/yr |
| Margin | 15% | <30% | ≥55% |
| Regulatory simplicity | 15% | Multi-state license | No new license |
| Cross-sell with Mission 1 | 10% | None | Strong |
| Solo-founder time (hrs/wk after PMF) | 10% | >40 hrs | <10 hrs |
| Seasonality fit with Mission 1 | 5% | Inverse (bad) | Symmetric (good) |
| Brand fit | 5% | Off-brand | Natural extension |

---

## Candidate A: Pool Service

| Dimension | Score (1-5) | Reasoning |
|---|---|---|
| Capability reusability (25%) | **5** | Lead capture, customer, property, quote, invoice, job, schedule, route, notifications, sales tax, auth — ~95% reused. Only new is `cap_water_chemistry`, `cap_pool_equipment_registry`. |
| TAM (15%) | **3** | $1.5-2.5M Pinellas residential pool service. Lower than lawn but solid. |
| Margin (15%) | **4** | 50-60% gross is typical for weekly pool. Higher than lawn. |
| Regulatory simplicity (15%) | **2** | FL Pool Contractor license (RP252 cert + $5K bond). Adds real regulatory overhead. |
| Cross-sell with Mission 1 (10%) | **5** | Same customer persona (residential, same ZIPs, same trust signal). Strong cross-sell. |
| Solo-founder time (10%) | **4** | 15-25 hrs/wk after PMF (visits are quick; equipment maintenance is significant). |
| Seasonality fit (5%) | **5** | Year-round demand (slight summer bump). Same seasonal shape as lawn. |
| Brand fit (5%) | **4** | Natural extension. Same customer relationship; same NAP. |
| **Weighted total** | | **0.25×5 + 0.15×3 + 0.15×4 + 0.15×2 + 0.10×5 + 0.10×4 + 0.05×5 + 0.05×4** = **1.25 + 0.45 + 0.60 + 0.30 + 0.50 + 0.40 + 0.25 + 0.20** = **3.95 / 5.0 = 79%** |

**Verdict:** Strongest on capability reusability. Weakened by regulatory layer.

## Candidate B: Pressure Washing

| Dimension | Score (1-5) | Reasoning |
|---|---|---|
| Capability reusability (25%) | **4** | ~70% reused. Pricing model is per-sqft (new). New `cap_soft_wash_chemical_mix`. |
| TAM (15%) | **3** | $1-2M Pinellas residential driveways + house-wash. |
| Margin (15%) | **4** | 60-70% gross is typical. Low COGS. |
| Regulatory simplicity (15%) | **3** | No FL license for pressure washing per se, but chemical application (sodium hypochlorite) touches FDACS §482 territory for some uses. |
| Cross-sell with Mission 1 (10%) | **5** | Existing customers want driveway + house wash as add-on. Strong cross-sell. |
| Solo-founder time (10%) | **3** | 25-35 hrs/wk after PMF (episodic + slow jobs). |
| Seasonality fit (5%) | **3** | Spring/fall peaks; slower in winter. Inverse of lawn winter slowdown. |
| Brand fit (5%) | **5** | Same brand works. "Yard maintenance + pressure washing" is natural. |
| **Weighted total** | | **0.25×4 + 0.15×3 + 0.15×4 + 0.15×3 + 0.10×5 + 0.10×3 + 0.05×3 + 0.05×5** = **1.00 + 0.45 + 0.60 + 0.45 + 0.50 + 0.30 + 0.15 + 0.25** = **3.70 / 5.0 = 74%** |

**Verdict:** Strong on margin + cross-sell, weaker on seasonality fit.

## Candidate C: Pet Waste Removal

| Dimension | Score (1-5) | Reasoning |
|---|---|---|
| Capability reusability (25%) | **4** | ~75% reused. New `cap_subscription_billing`, `cap_photo_proof_of_service`. |
| TAM (15%) | **2** | $500K-1M Pinellas (depends heavily on dog-ownership rate). Smaller market. |
| Margin (15%) | **5** | 70-80% gross. Almost zero COGS. |
| Regulatory simplicity (15%) | **5** | No new license. Dog waste is not regulated in FL. |
| Cross-sell with Mission 1 (10%) | **4** | Existing lawn customers often have dogs. Strong signal. |
| Solo-founder time (10%) | **4** | 20-30 hrs/wk after PMF (many quick stops per route). |
| Seasonality fit (5%) | **4** | Year-round demand. Slight summer/rain spike. |
| Brand fit (5%) | **3** | "Lawn care + pet waste" is natural for existing customers, slightly off-brand for new customers. |
| **Weighted total** | | **0.25×4 + 0.15×2 + 0.15×5 + 0.15×5 + 0.10×4 + 0.10×4 + 0.05×4 + 0.05×3** = **1.00 + 0.30 + 0.75 + 0.75 + 0.40 + 0.40 + 0.20 + 0.15** = **3.95 / 5.0 = 79%** |

**Verdict:** Tied with Pool. Strong on margin + regulatory simplicity, weaker on TAM.

---

## Summary table

| Candidate | Weighted score | Reusability | TAM | Margin | Verdict |
|---|---|---|---|---|---|
| A: Pool Service | **79%** | 5/5 | $1.5-2.5M | 50-60% | Strong on reusability; weaker on regulatory |
| B: Pressure Washing | **74%** | 4/5 | $1-2M | 60-70% | Strong on margin; weakest on seasonality |
| C: Pet Waste | **79%** | 4/5 | $0.5-1M | 70-80% | Strong on margin + simplicity; weakest on TAM |

## Pre-decision recommendation (subject to Month-10 re-validation)

**Two-way tie between Pool (A) and Pet Waste (C).** Tiebreaker considerations:

- If Mission 1 ends Year 1 with strong cross-sell performance and customer trust:
  → **Pool (A)** wins. Higher TAM, higher reusability, regulatory cost is a 1-time setup.
- If Mission 1 ends Year 1 with regulatory friction or hiring pressure:
  → **Pet Waste (C)** wins. Lowest regulatory + lowest COGS, but smaller market.

Pressure Washing (B) is the runner-up if either A or C fails.

## Re-validation triggers at Month 10

These scores change when:

| Trigger | Score change |
|---|---|
| Mission 1 captures actual LTV data | Re-score margin and TAM |
| Mission 1 customer survey reveals cross-sell interest | Re-score cross-sell |
| FL regulatory landscape shifts (e.g., new pool contractor license req) | Re-score regulatory |
| Mission 1 hires first employee | Re-score solo-founder time |
| Hurricane season impact on Mission 1 measured | Re-score seasonality |

## What this document does NOT do

- **Pick a winner.** Charter forbids Mission 2 selection before Month 10.
- **Promise a launch date.** Locked to "≥Month 10, ≥12 months Mission 1 data."
- **Approve Pilot Exception.** See `research/mission-2/pilot-exception-draft.md`.

## Cross-references

- Candidates overview: `research/mission-2/candidates.md`
- Readiness assessment: `audit/phase-10/mission-2-readiness.md`
- Charter phase 10: `constitution/03-execution-plan.md`
- Pilot Exception amendment: `constitution/charter-amendments/pilot-exception.md`
- Pilot Exception draft for early Mission 2 launch: `research/mission-2/pilot-exception-draft.md`