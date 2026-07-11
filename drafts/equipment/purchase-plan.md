# OBJ-M2-005 — Equipment (DEFERRED)

> **Status:** **DEFERRED** — steward's equipment access strategy is handled
> outside the GRASS system (borrow/rent/short-term personal arrangements).
> No GRASS-managed artifact required.
> **Authorization:** Steward decision, 2026-07-10.
> **Re-validation trigger:** First paying customer OR first equipment-related
> incident OR $500+ in unbudgeted equipment expenses from personal funds.
> **Original draft:** This file replaced the $14K purchase plan that was
> authored when equipment purchase was an OBJ-M2-005 in-scope item. That
> scope is now closed from GRASS's side.

---

## Why this file exists

GRASS's mission is to be the **organization** that owns the business.
Equipment is a **personal asset** of the operating entity (you, as
sole-member LLC — once formed; as individual, until then). The OS
should not be the buyer of record for equipment because:

1. **Equipment is reversible-loss asset** — it depreciates, breaks, gets
   stolen. The OS shouldn't carry that liability.
2. **Insurance binds to equipment** — until OBJ-M2-003 (insurance) is
   ratified, no equipment has policy coverage. Until then, equipment
   exposure is personal.
3. **Borrowing is the right initial strategy** — for a 5-pilot-job
   validation, borrowing eliminates fixed-asset risk entirely.

## What GRASS will need from equipment access (when reactivated)

The OS only needs three things from your equipment situation, none of
which are procurement:

1. **Capability registration** — what equipment is "registered" to perform
   each `cap_*`? E.g., `cap_mowing_standard` requires "functioning mower
   with sharp blade + functional trimmer." This becomes a checklist in
   `state/capability-registry.yaml` per capability, not per equipment item.
2. **Maintenance log** — when a piece of equipment breaks mid-job, the OS
   needs the incident recorded for KPI purposes (`equipment_uptime_pct`).
3. **Insurance link** — once OBJ-M2-003 binds, equipment list goes on
   the policy's equipment floater. That's the only artifact where
   equipment names appear in GRASS governance.

## Reactivation triggers (when to revisit this draft)

| Trigger | Action |
|---|---|
| First paying customer (real revenue) | Add equipment-access statement to capability registry |
| Equipment-related incident (breakdown, theft, injury) | Author `knowledge/postmortems/PM-EQUIP-001.md` |
| Equipment purchase ≥$500 from any source | Add entry to `state/equipment-register.yaml` (new file, not yet authored) |
| First employee hired | Equipment policy required (charter amendment) |
| Insurance binds | Add equipment list to policy's floater schedule |

## What was here (preserved for reference)

The original draft at this path was a $14,150-17,700 purchase plan for:
commercial zero-turn mower, push mower, edger, blower, string trimmer,
hedge trimmer, hand tools, PPE, trailer, tie-downs, ramps.

That plan is **superseded** by the deferral. If you re-engage equipment
purchase in the future, treat the original draft as one option among
several (used-market path, equipment-rental path, lease-to-own path).

## Cross-references

- Deferral decision: this turn, steward direction
- Original purchase draft: git history (`drafts/equipment/purchase-plan.md`
  prior version, available via `git log -p -- drafts/equipment/purchase-plan.md`)
- Capability registry (equipment-touching caps):
  `state/capability-registry.yaml` (`cap_mowing_standard`,
  `cap_edging_hard_edge`, `cap_hedge_trim`, `cap_mulching_install`)
- Deferred objectives: `state/ledger.yaml` → `objectives.active`
  OBJ-M2-005 (this), OBJ-M2-001 (entity filing), OBJ-M2-002 (BTRs),
  OBJ-M2-003 (insurance bind)
- Active objectives (in-scope): OBJ-M2-004 (brand/domain, $9.15/yr),
  OBJ-M2-006 (GBP + citations + 5 paid pilots)