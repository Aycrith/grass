# D-0011 — Cash-Minimum Activation: Items 4 + 6 (DRAFT, awaiting steward ratification)

**Status:** Draft (from steward direction 2026-07-10)
**Decision date:** [DATE — steward ratifies]
**Decision file:** `governance/decisions/0011-cash-min-activation.md`
**Review date:** [30 days post-launch — trigger reactivation review]
**Owner:** Steward (with Claude Code as drafter)

---

## Context

The original Day-8 ratification pack proposed 6 items with combined
Year-1 cost of ~$15-22K. Steward direction 2026-07-10 restructured to a
cash-minimum path that:

- Solves items 4 (brand + domain) and 6 (GBP + 5 paid pilot jobs)
  with $9.15 total Year-1 spend.
- Defers items 1 (Sunbiz LLC), 2 (BTRs + DWC-250), 3 (insurance), 5
  (equipment) until pilot revenue unlocks the cash gates.
- Generates first paying customers → real revenue → reinvestment in
  the deferred items.

The chassis for this split is already in the repo:

| Artifact | Path | What it does |
|---|---|---|
| Brand draft | `drafts/brand/names-and-decision-matrix.md` | 5 candidates scored, TESS + registrar protocol, rebrand list |
| Brand brainstorm | `research/distribution/brand-name-brainstorm.md` | 12 additional candidates in 5 naming angles |
| Equipment deferral | `drafts/equipment/purchase-plan.md` | Borrow/rent handled outside GRASS |
| GBP draft | `drafts/gbp/profile-content.md` | All fields pre-filled, NAP template included |
| Distribution ideas | `research/distribution/cash-min-distribution-ideas.md` | 8 $0-cost distribution ideas for items 4+6 |
| State ledger | `state/ledger.yaml` | Active vs deferred split with reactivation triggers |
| Cash-min index | `drafts/README.md` | One-page plan for the 14-30 day launch window |

This decision ratifies the split and the execution order.

---

## Candidates evaluated

| Approach | Cash Y1 | Time to first pilot | Risk |
|---|---|---|---|
| **A. Status quo / full ratification pack** | ~$15-22K | 7-10 days (Sunbiz + insurance gate) | High (capital risk before validation) |
| **B. Cash-min (this decision)** | $9.15 | 14-30 days | Medium (operating uninsured) |
| **C. Skip-everything** | $0 | n/a | n/a (no business) |

**B is selected.** A spends before validation; C never launches. B
defers the cash gates behind the cash-min path itself.

---

## Decision

Selected strategy: **Cash-Minimum Activation (Approach B).**

Two ACTIVE objectives, executed in this order:

### OBJ-M2-004 — Brand + Domain
1. Steward: select brand name from the combined ~17-candidate pool
   (5 in matrix + 12 in brainstorm). Default: **HollisLawn.com** at
   $9.73/yr on Porkbun (or **PinellasLawn.com** at $9.15/yr on
   Cloudflare if expansion beyond 33771 is planned).
2. Steward: register the domain with auto-renew ON.
3. Claude Code: 7-minute diff to update business.ts, layout.tsx,
   gbp/page.tsx, CLAUDE.md, NAP template, state ledger.

### OBJ-M2-006 — GBP + 25 citations + 5 paid pilots
4. Steward: create GBP profile using draft (1 hr) and submit
   verification request.
5. Steward: wait 5-14 days for postcard.
6. Claude Code: queue 25 citations across Tier 1-5 (Apple Maps,
   Bing, Facebook, Yelp, data aggregators, niche directories).
7. Steward: enter postcard code when received.
8. Steward: source first 5 paid pilots using distribution ideas
   in `research/distribution/cash-min-distribution-ideas.md`.
   Default execute set: GBP funnel + neighbor-cluster + review-magnet
   card ($0, ~3 hrs).
9. Claude Code: build pilot-job debrief template so each pilot
   produces a capability-improvement ADR.

### OBJ-M2-001/002/003/005 — Deferred
Each carries reactivation trigger + deferral rationale in
`state/ledger.yaml → deferred_cash_constrained`. These activate on
the cash ladder: $500 → $1K → $2.5K → $5K cumulative pilot revenue.

---

## Trademark clearance (recorded for the decision)

- [Live TESS search result — paste link or "no live marks found in
  Class 037 or 044"]

---

## Implementation steps (when steward ratifies)

1. **T+0 (ratification):** Update this file's status to "Ratified".
   Update `state/ledger.yaml` OBJ-M2-004 → in_progress.
2. **T+0 to T+1 day:** Steward picks brand. Registers domain. Auto-renew
   verified ON.
3. **T+1 day:** Claude Code runs the 7-minute diff.
4. **T+1 to T+2 days:** GBP profile created. Verification request
   submitted. Pilot 25-citation roster queued.
5. **T+5 to T+14 days:** GBP postcard arrives. Code entered. GBP live.
6. **T+14 to T+30 days:** Distribution ideas execute. First 5 paid
   pilots sourced and completed.
7. **T+30 days:** Review this decision. Reactivation triggered at
   the appropriate cash-ladder step.

---

## Deferred until post-revenue

- Sunbiz LLC filing ($125 once pilot revenue ≥ $500)
- City of Largo BTR + Pinellas County BTR ($92 once pilot revenue
  ≥ $1K — or earlier if regulatory complaint)
- DWC-250 workers comp exemption ($0 once first employee hired —
  not applicable to solo founder until then)
- Insurance binding ($2,500-4,600/yr once pilot revenue ≥ $2.5K —
  or earlier if first equipment incident)
- Defensive domain registrations (`brand.net`, `brand.org`,
  `brandLLC.com`)
- Florida fictitious-name registration ($50 one-time)
- Logo design (Canva DIY if needed at $0)
- Full TESS + state trademark clearance (live search only at this step)

---

## Risks accepted (operating without LLC + BTRs + insurance)

- **Personal liability for incidents** — solo proprietor by default.
  Mitigation: hand-tools-only scope (no commercial mower yet),
  signed waiver-of-liability on every quote, small lots only
  (≤0.25 acre), no storm/hurricane work until insurance binds.
- **Municipal citation risk** — operating without a Largo BTR is
  ~$250 fine. Mitigation: file the BTR draft the day pilot #3 closes
  if revenue allows.
- **Personal assets at risk** — no GL insurance coverage on
  equipment damage or injury. Mitigation: borrow/rent equipment
  (not own until insurance binds), hand-tools-only.
- **FL sales tax collection without DR-1** — invoice customers as
  "tax not yet collected" or absorb into advertised price.
- **Steward time risk** — solo founder burnout if distribution
  takes longer than planned. Mitigation: 5-pilot review at 30 days;
  if <3 closed, pivot approach.

These four risks are documented as acceptable for the cash-min path.
The moment any converts from theoretical to actual (incident,
complaint, regulatory letter), reactivation jumps the priority queue.

---

## Cost summary

| Item | One-time | Annual |
|---|---|---|
| Primary domain | — | **$9.15** (or $9.73) |
| GBP verification postcard | $0 (Google sends) | — |
| Citations | $0 | — |
| **Total Year 1** | **$0** | **$9.15** |

---

## Success criteria

| Metric | 30-day target | Source |
|---|---|---|
| Domain registered and resolving | Yes | Cloudflare dashboard |
| GBP live | Yes (postcard entered) | GBP dashboard |
| Citations live | ≥ 15 of 25 | citation-burn tracker |
| Paid pilots closed | ≥ 3 of 5 (5 by 60 days) | Bank/Cash App/Stripe |
| Five-star reviews | ≥ 3 of 5 pilots left reviews | GBP dashboard |
| Cash outflow (ex-domain) | $0 | Bank records |
| Steward time spent | ≤ 8 hours | Calendar log |

If 30 days → <3 closed pilots → trigger review with adjusted
distribution approach.

---

## Cross-references

- Original 6-item ratification pack: git history
  (`drafts/` prior version, all 6 drafts still present)
- Brand matrix: `drafts/brand/names-and-decision-matrix.md`
- Brand brainstorm: `research/distribution/brand-name-brainstorm.md`
- GBP draft: `drafts/gbp/profile-content.md`
- Cash-min index: `drafts/README.md`
- Distribution ideas: `research/distribution/cash-min-distribution-ideas.md`
- State ledger: `state/ledger.yaml`
- Capability registry: `state/capability-registry.yaml`
- D-0002 (tech stack), D-0003 (service area), D-0004 (operating model),
  D-0007 (brand strategy phase A): `governance/decisions/`
- Charter hurricane rule: `constitution/01-constitution.md`
- Pilot Exception amendment: `constitution/charter-amendments/pilot-exception.md`