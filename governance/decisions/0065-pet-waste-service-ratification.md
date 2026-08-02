# D-0065 — Pet-waste service-line ratification (Mission 1 capability registration)

**Date:** 2026-07-28
**Status:** RATIFIED 2026-07-28 (companion to D-0064)
**Author:** Claude Code (with steward)
**Scope:** Mission 1 service-line catalog. Adds `cap_pet_waste_cleanup` to `state/capability-registry.yaml`. Resolves pet-waste from Month-10 revalidation candidate to ratified Mission 1 service for the duration of the paid-acquisition pilot (D-0064).
**Review date:** 2026-08-28 (30 days post-launch or post-1st-paid-customer, whichever first)
**Confidence (shipped):** 0.60
**Supersedes:** `research/mission-2/candidates.md` and `research/mission-2/weighted-scores.md` revalidation-status for pet-waste for the duration of this pilot only.

---

## 0. The decision in one paragraph

Ratify **pet-waste cleanup** as a Mission 1 service line for the duration of the paid-acquisition pilot (D-0064), with the following envelope:

1. **Service definition:** Weekly residential pet-waste cleanup. Yard visit, scoop and bag all dog waste, off-yard disposal in household trash (or haul-off by arrangement). Pricing: $7.50 first cleanup (50% off), $15/week recurring. Service area: existing 6 ZIPs (33770, 33771, 33773, 33774, 33778, 33756).
2. **Capability registration:** Add `cap_pet_waste_cleanup` to `state/capability-registry.yaml` with full Mission 1 inputs/outputs/tests/documentation per the capability schema.
3. **Non-license-required:** Pet-waste cleanup does NOT require the GI-BMP fertilizer license, the FDACS Limited Commercial Fertilizer Applicator license, the PCCLB Irrigation System Specialty Contractor license, or any pest-control license. It is a manual labor service. The only license-relevant consideration is the 7% Florida sales tax registration (already Day-1 per risk R-FLLIC-001).
4. **Insurance:** Solo-founder operator carries the same general liability ($1M minimum) as mowing/edging/mulching/hedge-trim work. No additional rider required for pet-waste cleanup.
5. **Operational envelope:** Pilot accepts up to 5 concurrent pet-waste customers before considering a second visit/week. Beyond 5, route density is reviewed.
6. **Capability status:** `status: draft` → `status: active` once the first paying customer is onboarded and the test reference is committed.
7. **Reversibility:** If pilot aborts before first paying customer, capability entry is reverted to `status: reserved` and pet-waste reverts to Month-10 candidate status.

---

## 1. Problem

Pet-waste cleanup appears in `research/mission-2/candidates.md` and `research/mission-2/weighted-scores.md` as a Month-10 revalidation candidate, not a ratified Mission 1 service. The capability registry (`state/capability-registry.yaml`, last updated 2026-07-10) has no pet-waste entry. The paid-acquisition pilot (D-0064) requires pet-waste to be a ratified service line for ads to legitimately advertise it.

This ADR ratifies pet-waste for the pilot's duration without changing the underlying Month-10 revalidation framework for any future Mission 2 selection.

---

## 2. Context

What we know:

- Pet-waste is a manual labor service; no Florida occupational license is required beyond the existing 7% sales tax registration.
- Existing insurance (`research/regulatory/largo-licensing-map.yaml`) covers manual labor within the general liability policy.
- The steward has the equipment and skill set: bucket, scooper, bags, gloves. Listed in `output/gtm/README.md` as a 5-min SLA prerequisite (already procured).
- The 6-ZIP service area is unchanged.
- Pet-waste demand exists in dog-owning households; weighted-scores doc estimated "natural for existing customers."

What we explicitly don't know:

- Exact demand level in the 6-ZIP service area.
- Average yard size and dog count.
- Whether the $15/week price point survives pilot demand without margin pressure.
- Whether pet-waste customers cross-sell to mowing at any meaningful rate.

---

## 3. Requirements

A successful ratification must:

1. Add `cap_pet_waste_cleanup` to `state/capability-registry.yaml` with full Mission 1 schema (cap_id, name, owner_agent, version, status, inputs, outputs, consumers, tests, documentation, maturity, known_limitations, roadmap_links, created, last_updated).
2. Cite price ($7.50 first / $15/week recurring) to `research/pricing/price-book.yaml`.
3. Cite gross margin (~70%) to `research/market/profitability-roadmap.md`.
4. Cite the absence of license requirements to `research/regulatory/largo-licensing-map.yaml`.
5. Document the operational envelope (≤5 concurrent customers before route density review).
6. Specify reversibility (capability reverts to `status: reserved` if pilot aborts pre-customer).

---

## 4. Alternatives considered

| Option | Approach | Pro | Con | Verdict |
|---|---|---|---|---|
| A | **This ADR** — ratify pet-waste for the pilot's duration; revert on abort | Unblocks the pilot; preserves Mission 2 framework | Adds capability entry that may revert | **Selected** |
| B | Re-scope pilot to existing Mission 1 services (mowing, edging, mulching, hedge-trim) | No new capability needed | Steward explicitly chose pet-waste as the wedge | **Rejected** |
| C | Defer pilot until Month-10 revalidation | Cleaner doctrine | Conflicts with steward's "paid acquisition should do most of the work" strategic direction | **Rejected** |
| D | Ratify pet-waste permanently (override Month-10 framework) | Simplest | Removes the revalidation discipline for any future service | **Rejected** |

---

## 5. Evaluation matrix

| Criterion | A (this ADR) | B (re-scope to existing services) | C (defer to Month-10) | D (permanent ratification) |
|---|---|---|---|---|
| Unblocks pilot | ✓ | ✓ (re-targeted) | ✗ | ✓ |
| Preserves Mission 2 discipline | ✓ | ✓ | ✓ | ✗ |
| Reversibility | ✓ (on abort) | n/a | n/a | ✗ |
| Aligns with steward direction | ✓ | ✗ | ✗ | ✓ |

---

## 6. Decision

**Selected: Option A.** Ratify pet-waste as a Mission 1 service line for the paid-acquisition pilot (D-0064). Add `cap_pet_waste_cleanup` to the capability registry with `status: draft` and `maturity: designed` until the first paying customer is onboarded. Revert to `status: reserved` if the pilot aborts before then.

---

## 7. Risk register additions

| Risk ID | Title | Likelihood | Impact | Score | Owner | Mitigation |
|---|---|---|---|---|---|---|
| R-CAP-001 | Pilot aborts before first paying customer | 2 (unlikely) | 3 (moderate) | 6 | marketing | Capability reverts to `status: reserved` per §0.7. |
| R-CAP-002 | Pet-waste demand turns out to be thin | 3 (possible) | 3 (moderate) | 9 | marketing | 14-day early read; pause campaign if <3 qualified leads by Day 7. |
| R-CAP-003 | Steward physically cannot keep up with concurrent cleanups | 2 (unlikely) | 3 (moderate) | 6 | operations | Operational envelope (≤5 concurrent) per §0.5. |
| R-CAP-004 | Pet-waste customers do not cross-sell to mowing | 3 (possible) | 2 (minor) | 6 | marketing | Pilot measures conversion only; cross-sell is a stretch goal. |

---

## 8. Rollback

If pilot aborts before first paying customer:

1. Revert `cap_pet_waste_cleanup` to `status: reserved` in `state/capability-registry.yaml`.
2. Add an entry to `state/ledger.yaml` recording the abort and the capability revert.
3. Pet-waste reverts to Month-10 revalidation candidate status.

---

## 9. Capability registry entry (to be added)

```yaml
- cap_id: cap_pet_waste_cleanup
  name: "Weekly residential pet-waste cleanup"
  owner_agent: operations
  status: draft
  version: 0.1.0
  maturity: designed
  mission: "M1"
  description: |
    Weekly residential pet-waste cleanup. Yard visit, scoop and bag all
    dog waste, off-yard disposal in household trash (or haul-off by
    arrangement). Pilot service line for paid-acquisition test per D-0064.
  pricing:
    first_cleanup_usd: 7.50
    recurring_weekly_usd: 15.00
    estimated_gross_margin_pct: 70
  inputs:
    - "Property record (yard size, dog count, gate access)"
    - "Service frequency (default: weekly)"
    - "Customer record (name, phone, address, pet notes)"
    - "Disposal preference (household trash or haul-off)"
  outputs:
    - "Job record (date, duration, yard condition photo optional)"
    - "Invoice line item (cleaning visit)"
    - "Next-service-due estimate (7 days)"
  consumers:
    - "Scheduling agent (assigns to operator route)"
    - "Invoicing agent (creates invoice line)"
    - "Customer success (next-service reminder)"
  tests:
    - "scripts/test-capabilities/cap_pet_waste_cleanup.spec.ts (Day 5+)"
  documentation:
    - "research/pricing/price-book.yaml (price per visit)"
    - "agents/operations.md (operational runbook)"
    - "governance/decisions/0065-pet-waste-service-ratification.md (this ADR)"
  known_limitations:
    - "Pilot scale: ≤5 concurrent customers before route density review"
    - "No automated lot-size or dog-count measurement (manual on first visit)"
    - "Weather cancellation policy same as mowing (hurricane mode Day 1 handles named storms only)"
  roadmap_links:
    - "Auto-quoting from property polygon area (Month 6)"
    - "Cross-sell to mowing service (Month 3, after pilot)"
    - "Subscription cleanup with annual prepay discount (Month 9+)"
  created: "2026-07-28"
  last_updated: "2026-07-28"
```

---

## 10. Related ADRs and references

- **D-0064:** Paid acquisition pilot scope and spend envelope (companion; this ADR ratifies the service line the pilot advertises).
- **D-0066:** Outbound SMS consent language (companion; SMS auto-ack to pet-waste leads).
- **research/mission-2/candidates.md:** Pet-waste Month-10 candidate status (now temporarily overridden for Mission 1 pilot).
- **research/mission-2/weighted-scores.md:** Pet-waste revalidation rubric (still applies for any future Mission 2 selection).
- **research/regulatory/largo-licensing-map.yaml:** Confirms no new license required.
- **research/pricing/price-book.yaml:** Price-point source.
- **research/market/profitability-roadmap.md:** Unit-economics source.
- **state/capability-registry.yaml:** Target file for `cap_pet_waste_cleanup` entry.
