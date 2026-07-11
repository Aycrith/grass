# Mission 2 — Candidate Verticals for Reusability Scoring

> **Date:** 2026-07-10 | **Status:** Framework only — Mission 2 selection deferred to Month 10+.
>
> Per the Charter: Mission 2 cannot launch until at least 12 months of Mission 1
> operating data exist. This document captures the three candidate verticals +
> the reusability scoring rubric that will be applied at Month 10.

## Why "3 candidates" not "20"

The Charter mandates scoring **at least 3 candidates** against capability registry
reusability. The point is not exhaustive enumeration — it's comparative judgment
between a small number of plausible Mission 2s that exercise different platform
packages in different proportions. Three candidates from three different vertical
clusters (home services, knowledge services, digital services) is sufficient.

## Candidate A — Pool Service (Home services cluster)

**Vertical:** Residential pool cleaning + maintenance, similar service area (Pinellas).

**What reuses from Mission 1:**
- Lead capture flow (GBP + website form → CRM)
- Customer + Property + Service + Quote + Invoice + Job lifecycle
- Crew scheduling + routing
- SMS/email notifications (job dispatch, review request)
- Sales tax + payments
- Hurricane mode (pause scheduling during storms — pools drain differently)
- Auth authority ladder

**What's new:**
- Water chemistry models (chlorine, pH, alkalinity, cyanuric acid)
- Equipment registry expanded (pumps, filters, heaters)
- Compliance: FL pool contractor license (RP252 cert + $5K bond)
- Insurance rider (pool-specific liability)
- Service cadence — weekly visits during summer, biweekly in winter

**Why this is a strong candidate:** Highest reusability — shares 90%+ of
platform packages. Same geographic area, same customer persona, same seasonal
demand shape.

**Why this is a weak candidate:** Lower TAM (smaller total spend per pool
vs. lawn), recurring but cheaper per visit, and adds a regulatory layer that
isn't reusable. Hurricane prep actually gets MORE important (pool pumps +
equipment are storm-damaged).

## Candidate B — Pressure Washing (Home services cluster)

**Vertical:** Driveway + house-wash + deck cleaning service.

**What reuses from Mission 1:**
- Lead capture, customer, property, quote, invoice lifecycle
- Scheduling + routing (same crews, different equipment)
- Notifications
- Sales tax + payments
- Auth

**What's new:**
- Service-pricing model is per-square-foot (not per-visit) — quotes are 2D
- Equipment: pressure washer + surface cleaner + soft-wash system
- New "soft wash" capability (low-pressure chemical mix for siding)
- Insurance: surface-damage rider
- Compliance: FL doesn't license pressure washing specifically, but chemical
  application (sodium hypochlorite) crosses into FDACS §482 territory

**Why this is a strong candidate:** Strong seasonality (high in spring, low in
winter), strong add-on to existing lawn customers (cross-sell), low startup
cost (~$1-2K equipment).

**Why this is a weak candidate:** Some regulatory overlap with pest control
(chlorine is regulated in some contexts), smaller tickets, episodic (not
recurring) which doesn't build LTV.

## Candidate C — Pet Waste Removal (Home services cluster)

**Vertical:** Subscription-based dog-poop-scooping service, weekly visits.

**What reuses from Mission 1:**
- Lead capture, customer, property, quote, invoice, subscription billing
- Crew scheduling + routing (multiple stops per visit)
- Notifications (dispatch, completion)
- Sales tax (FL does not tax pet services, so zero-rate case)
- Auth

**What's new:**
- Subscription billing (recurring invoices auto-issued weekly/biweekly)
- Per-stop pricing model
- Photo proof of completion (required by customer trust)
- Capability: `cap_subscription_billing`, `cap_photo_proof_of_service`
- Route density much higher than mowing (3-4x stops per route)

**Why this is a strong candidate:** Pure recurring revenue, very low COGS,
existing-customer cross-sell is strong, low regulatory complexity, high
reusability for subscription-billing capability.

**Why this is a weak candidate:** Smaller TAM locally, requires customer
trust-building (gate code, dog behavior), sensitive to dog-ownership rate.

## Cross-cutting scoring rubric

Score each candidate on:

| Dimension | Weight | 1 = poor | 5 = excellent |
|---|---|---|---|
| **Capability reusability** (% of existing platform used) | 25% | <50% | ≥90% |
| **TAM** in chosen service area | 15% | <$500K/yr | >$5M/yr |
| **Margin** (gross after COGS) | 15% | <30% | ≥55% |
| **Regulatory simplicity** | 15% | Multi-state license | No new license |
| **Cross-sell potential with Mission 1** | 10% | None | Strong |
| **Solo-founder time** (hrs/wk after PMF) | 10% | >40 hrs | <10 hrs |
| **Seasonality fit with Mission 1** | 5% | Inverse (bad) | Symmetric (good) |
| **Brand fit** (do customers trust us) | 5% | Off-brand | Natural extension |

**Pass:** ≥70% weighted total + reusability ≥3.

## Next steps (Month 10 trigger)

1. Pull Mission 1 KPI scorecard — reusability, customer LTV, ops hours
2. Re-score each candidate against actual measured values
3. Steward review + Decision Template entry
4. If multiple candidates pass, run twin-sim on the top 2 before choosing
5. Charter amendment review (30-day public comment window)
6. Mission 2 research kickoff (Day 1 of new Phase 0)

## Non-candidates (explicitly deferred)

- **Pool construction** — different regulatory class, requires licensed
  contractor, not a service business — defer to Mission 3+
- **Tree removal** — high-risk, high-liability, requires ISA arborist cert —
  defer
- **Pest control** — heavy regulatory (FDACS §482), insurance, chemical
  handling — defer to Mission 4+
- **HVAC, plumbing, electrical** — contractor licensing regime, requires
  Multiple years apprenticeship — not Mission 2 material

## Reference

- Capability registry: `state/capability-registry.yaml`
- Charter phase 10: `constitution/03-execution-plan.md`
- Mission 1 KPI scorecard: `analytics/monthly-scorecard.md` (template)
- Twin-sim-vs-real reconciliation: `audit/phase-9/` (Month 9 deliverable)