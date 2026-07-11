# D-0003 — Mission 1 Service Area Selection

**Status:** Ratified
**Decision date:** 2026-07-10
**Decision file:** governance/decisions/0003-service-area.md (this file)
**Review date:** 2026-09-01 (after first 60 days of operation)
**Owner:** Steward

---

## Context

Mission 1 is a real landscaping business. Service area must be:
- Hyperlocal enough for solo founder to dominate SEO.
- Diverse enough for climate to validate the business case.
- Documented well enough that licensing, pricing, and competitor analysis are tractable.

## Decision

**Service area: Largo, Florida, ZIP 33771, plus adjacent ZIPs 33770, 33773, 33774, 33778, 33756.**

### Why Largo specifically

| Factor | Why this matters |
|---|---|
| **USDA zone 10a** (hot-humid subtropical) | Year-round mowing revenue; validates climate-driven demand model. |
| **Hurricane season** (June-November) | Tests the charter's resilience requirements (registered capability `cap_hurricane_mode`). |
| **Florida licensing regime** | Well-documented; license map (research/regulatory/largo-licensing-map.yaml) Day-8 GATE. |
| **Mature competitor set** | Validates market; means we compete on execution, not first-mover. |
| **Single-city hyperlocal SEO tractable** | One city's keyword universe fits in 100-keyword cluster; one GBP profile; one local citation build. |
| **Solo founder DOMs the area** | A solo founder can run 25-50 recurring customers in 1 city. Multi-city is a Phase-7 problem. |

### Why Pinellas (not Hillsborough or Pasco)

- Pinellas is one of the most densely populated counties in FL — concentrated customer base, short drive times.
- 33771's median household income supports $80+ avg quote value.
- Adjacent ZIPs share the same climate + competitor set; expanding the service radius by 5-10 miles is operationally trivial.

### What this decision does NOT lock

- **Specific street addresses or routes.** Those are operations-layer (cap_recurring_schedule).
- **Specific customer list.** That's lead-capture work (cap_lead_capture_gbp).
- **Sub-vertical.** Landscaping WITHOUT fertilization/irrigation/pest (per license map Day-1 decomposition).

## Alternatives considered

| Alt | Why rejected |
|---|---|
| Tampa proper | Too competitive; larger operators with deep SEO moats. |
| St. Petersburg | Adjacent; defer to Phase 7 if Largo succeeds. |
| Hillsborough County | Different licensing (county-level pest rules); doubles compliance surface. |
| Pasco County | Less mature market; lower revenue ceiling per day. |
| Sarasota | 2-hour drive from central Pinellas; not solo-founder-routable. |
| Multi-city at launch | Charter rule: don't expand before PMF in one city. |

## Risks accepted

- **R-FLLIC-001** — Florida licensing surprise mid-launch. Mitigation: licensing map Day-8 GATE; service decomposition explicitly excludes fertilization/irrigation/pest.
- **R-HURR-001** — Hurricane season breaks ops. Mitigation: `cap_hurricane_mode` registered Day 1; hard rule no outdoor work in named-storm conditions.
- **Single-city risk** — If Largo fails, expansion requires re-doing all research. Mitigation: research outputs are abstracted at city/county level; re-targeting Hillsborough costs ~1 week.

## Service area boundary

| ZIP | City | Status |
|---|---|---|
| 33771 | Largo | Primary |
| 33770 | Largo | Primary |
| 33773 | Largo | Primary |
| 33774 | Largo | Primary |
| 33778 | Largo | Primary |
| 33756 | Clearwater (edge) | Adjacent — included for routing convenience |

## Implementation triggers

- D-0003 unlocks `OBJ-DAY8-001` (licensing map), `OBJ-DAY9-001` (market size), `OBJ-DAY10-001` (competitor CSV), `OBJ-DAY13-001` (pricing + SEO + suppliers).

## Review criteria

At 2026-09-01 (60 days post-launch):
1. Customer distribution by ZIP. >80% from 33771-33774 is healthy; if 33756 dominates, recalibrate.
2. Drive-time analysis from staging location. Average <20 min between jobs.
3. Adjacent ZIP expansion candidate analysis (33708, 33762, 33764) — if MRR supports it.

If expansion is justified at review, write `0008-service-area-expansion.md`.