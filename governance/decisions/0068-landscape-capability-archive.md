# D-0068 — Landscape capability archive (capabilities preserved, status=reserved)

**Date:** 2026-07-31
**Status:** RATIFIED 2026-07-31
**Author:** Claude Code (with steward)
**Scope:** `state/capability-registry.yaml`. All 6 active landscaping capabilities (cap_mowing_standard, cap_edging_hard_edge, cap_mulching_install, cap_hedge_trim, cap_lead_capture_gbp, cap_pet_waste_cleanup) move to status=reserved. The 4 reserved capabilities (cap_hurricane_mode, cap_auto_quote_mowing, cap_review_request, cap_recurring_schedule) remain status=reserved. No capabilities are deleted; the registry is preserved for resumption.
**Review date:** 2027-01-31 (6 months — enough time for the steward to return to GRASS or to confirm the pivot is permanent)
**Confidence (shipped):** 0.90
**Supersedes:** none — this is the first GRASS-wide capability archive.

---

## 0. The decision in one paragraph

Move every Mission 1 landscaping capability in `state/capability-registry.yaml` to `status=reserved`. The 6 active capabilities are preserved exactly as authored; the only field changed is `status:`. The reusability tracker is updated to reflect the archive posture. A "POST-PIVOT ARCHIVE" section is appended to the registry with the resume procedure. This is the companion ADR to D-0067 (pilot-pause-and-preservation).

---

## 1. Problem

The Mission 1 landscaping capabilities were designed with `status: draft` (for the not-yet-built ones) and `status: draft` later (for the pet-waste capability per D-0065). At the pivot, the steward is stepping away from the active codebase. The risk is that an active `status: draft` capability suggests ongoing work to a future agent — which is misleading because the pilot never launched and no code is shipping. The `scripts/lint-capabilities.ts` charter-compliance check treats `status: draft` as "in-flight" and the steward does not want to leave a false "in-flight" trail.

The second tier: per D-0065 §0.7, if the pet-waste pilot aborts before the first paying customer is onboarded, the capability reverts to status=reserved. The pilot aborted (it never launched), so the revert is documented.

---

## 2. Context

What we know at the pivot date:

- All 6 active capabilities are `status: draft` and `maturity: designed` (not yet built). The web app has the customer-facing surfaces for these capabilities but the operational backbone (Sunbiz LLC, insurance, equipment, GBP) was never stood up.
- Pet-waste capability was ratified 2026-07-28 with `status: draft` per D-0065. Per D-0065 §0.7, the documented revert path is status=reserved.
- The 4 reserved capabilities (cap_hurricane_mode, cap_auto_quote_mowing, cap_review_request, cap_recurring_schedule) were already `status: reserved`. They remain so.
- The `scripts/lint-capabilities.ts` accepts four valid statuses: `draft`, `active`, `deprecated`, `reserved`. The `reserved` status is the right semantic for "designed but not in-flight because the steward is paused at the strategy level."

What we explicitly don't know:

- Whether the steward will return to GRASS. The pivot is unconditional.
- Whether the steward will resume with the same 6 capabilities or with a different service mix. The reserved status is reversible — to resume, the steward changes status back to `draft` or `active` and re-runs the lint.

---

## 3. Required registry changes

A successful pivot must:

1. **Set `status: reserved`** on all 6 active capabilities:
   - cap_mowing_standard
   - cap_edging_hard_edge
   - cap_mulching_install
   - cap_hedge_trim
   - cap_lead_capture_gbp
   - cap_pet_waste_cleanup
2. **Add a preservation comment** above each capability documenting the pivot reason: `# STATUS: reserved as of 2026-07-31 per D-0068 (landscape-capability-archive).`
3. **Update `last_updated`** to `2026-07-31`.
4. **Update the reusability counter** — `reserved_capabilities` goes from 4 to 10 (6 active became reserved + 4 were already reserved).
5. **Append a "POST-PIVOT ARCHIVE" section** with the resume procedure.
6. **Run `scripts/lint-capabilities.ts`** to verify schema conformance (it must accept `status: reserved`).

No capability is deleted. No tests reference is removed. No documentation reference is removed. The registry's content is unchanged; only the status flags flip.

---

## 4. Alternatives considered

| Option | Approach | Pro | Con | Verdict |
|---|---|---|---|---|
| A | **This ADR** — set status=reserved on all 6; preserve content | Reversible; semantically correct; auditable | One-time edit | **Selected** |
| B | Delete the 6 capabilities entirely | Cleanest registry | Loses the design work; resumption requires re-authoring | **Rejected** |
| C | Leave status=draft | Lowest effort tonight | Misleading to future agents; R-PILOT-001 risk increases | **Rejected** |
| D | Set status=deprecated | Easier to grep for "abandoned" | "Deprecated" implies "successor exists" which is not the case | **Rejected** |

---

## 5. Decision

**Selected: Option A.** Status=reserved on all 6 active capabilities. Content preserved. Reusability counter updated. Resume procedure appended.

---

## 6. Risk register additions

None new. The companion risk R-PIVOT-001 (from D-0067) covers the preservation posture. The existing R-PILOT-001..006, R-CAP-001..004, R-SMS-001..004 are all annotated with `[STATUS: PAUSED 2026-07-31 per D-0067 — pilot never launched]` and remain scored (not zeroed) so a future reviewer can audit the original risk posture.

---

## 7. Rollback / Resume

The archive is reversible. To resume landscaping work:

1. **Read `output/plans/RESUMING.md`** (the step-by-step resume procedure).
2. **Change `status: reserved` back** to `status: draft` (or `status: active` for fully-deployed capabilities) on the capabilities being resumed.
3. **Re-run `scripts/lint-capabilities.ts`** to verify schema conformance.
4. **Write a D-0069 Pilot Outcome ADR** (per D-0064 §6) before any first ad spend.
5. **Update `last_updated`** to the resume date.

No capability content is lost. The 6 capabilities' `description`, `inputs`, `outputs`, `consumers`, `tests`, `documentation`, `known_limitations`, and `roadmap_links` fields are untouched.

---

## 8. What is NOT changed by this ADR

- **`architecture/twin/service.md`** — the technical service_line enum is preserved. The 6 services remain valid enum values.
- **`apps/web/src/lib/content.ts`** — the website content registry is preserved. The 6 services remain with their pricing, descriptions, and routes.
- **`apps/web/src/app/`** — the customer-facing pages are preserved. `/services/mowing`, `/services/edging`, etc. remain on the site.
- **`research/pricing/price-book.yaml`** — the canonical pricing is preserved.
- **`research/seo/largo-keyword-map.md`** — the keyword map is preserved.
- **Any D-0064/0065/0066 ADR** — these are still RATIFIED.

---

## 9. Related ADRs and references

- **D-0067:** Pilot pause + GRASS preservation posture (companion — the steward-level pivot).
- **D-0065:** Pet-waste service ratification (per §0.7, the documented revert path for pilot abort).
- **D-0064:** Paid acquisition pilot scope (still binding if the steward resumes).
- **`state/capability-registry.yaml`:** All 6 capabilities moved to status=reserved; reusability counter updated; resume procedure appended.
- **`scripts/lint-capabilities.ts`:** The lint that verifies the schema. `reserved` is a valid status.
- **`scripts/charter-compliance.ts`:** Aggregator that runs all charter compliance checks.
- **`output/plans/RESUMING.md`:** The step-by-step resume procedure (newly written).
