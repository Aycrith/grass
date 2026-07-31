# `output/plans/` — Strategic & Foundational Plans

> **Authoritative location for plans, strategies, and the audit findings that ground them.**
>
> Plans live here so they are visible to future Claude Code sessions, the steward, and the wider organization — not buried in `~/.claude/plans/` (which is session-only).

---

## Directory Layout

```
output/plans/
├── README.md                                         (this file)
├── 2026-07-30_situation-review-domain-launch.md      (foundation review)
├── 2026-07-31_strategy-rollout-adjustment.md         (4-state execution strategy)
├── RESUMING.md                                       (resume procedure — 2026-07-31 pivot)
└── 2026-07-30_session-audits/
    ├── README.md                                     (audit index)
    ├── 01_documentation-audit.md                     (11 categories of drift)
    ├── 02_website-audit.md                           (13 strategy inconsistencies)
    └── 03_ads-gtm-audit.md                           (3 competing GTM stacks)
```

---

## File Naming Convention

`<YYYY-MM-DD>_<slug>.md` — date + kebab-case slug, lowercased.

For execution-oriented plans, prefer: `YYYY-MM-DD_strategy-<topic>.md`.
For review/foundation plans, prefer: `YYYY-MM-DD_<topic>-review.md`.
For audits, prefer: `YYYY-MM-DD_<scope>-audit.md`.

---

## How Plans Relate to Other Repos

| Repo location | Role | Convention |
|---|---|---|
| `output/plans/` | THIS — strategic plans, session audits, situation reviews | Long-lived, searchable |
| `output/reports/` | Single-shot reports (e.g., `business_plan_improvement_analysis.md`) | Ad-hoc, dated |
| `output/gtm/` | GTM artifacts (runbooks, CSVs, creative) | Working files; tie to ADRs |
| `output/procurement/` | Investor package | Working files |
| `output/snapshots/` | Build snapshots | Versioned |
| `governance/decisions/` | ADRs (D-NNNN) | Ratified only |
| `docs/specs/` | Binding specs | Authored, versioned |
| `docs/business-plan/` | Business plan artifacts | Working files |
| `architecture/` | Architecture docs (incl. twin models) | Long-lived |
| `state/` | Current state (ledger, risk, capabilities) | Always-fresh |
| `~/.claude/plans/` | Session-scoped working plans | Per-session only |

---

## Reading Order for a Fresh Steward Review

If you are new to the project and want to understand the binding strategy in 30 minutes:

1. **`RESUMING.md`** — answers "what's the current state and how do I resume?" (resume procedure, 2026-07-31 pivot)
2. **`2026-07-30_situation-review-domain-launch.md`** — answers "should I buy the domain and what's the current state?" (foundation review)
3. **`2026-07-31_strategy-rollout-adjustment.md`** — answers "how do we adjust the business offerings across all surfaces?" (4-state execution strategy)
4. **`2026-07-30_session-audits/01_documentation-audit.md`** — answers "what facts are inconsistent across the docs?"
5. **`2026-07-30_session-audits/02_website-audit.md`** — answers "what's broken on the website?"
6. **`2026-07-30_session-audits/03_ads-gtm-audit.md`** — answers "what's the state of paid acquisition?"

Total reading time: ~50 minutes.

> **PIVOT NOTICE (2026-07-31):** owner pivoting to a new business/strategy. The D-0064 paid-acquisition pilot is PAUSED at pre-launch (no ad spend ever incurred). All 6 landscaping capabilities moved to status=reserved per D-0068. See `RESUMING.md` for the resume procedure.

---

## For a Future Agent Asked "What's the strategy?"

Point them to `2026-07-31_strategy-rollout-adjustment.md` first. It contains:
- The 4-state rollout (State 1 = pet waste only / Google Search only)
- The 6 implementation gates (with verification)
- The hard-stop violations list (must be cleared)
- The D-0062 drift items (must be resolved)
- The cross-surface decision matrix (per surface, per state)
- The 10 open questions for the founder (with defaults)

That single file is the binding strategy. The other documents are inputs to it.

---

## Provenance and Drift

- **Strategy plan** was approved by the steward on 2026-07-31. Authoritative.
- **Situation review** was approved by the steward on 2026-07-30. **Superseded by** the strategy plan for execution, but preserved as the foundation review.
- **Audits** were produced 2026-07-30 by 3 parallel Explore agents. Read-only. Should be re-run quarterly or after any major doc/website/ADR change.
- **RESUMING.md** was authored 2026-07-31 on the pivot. Authoritative for the resume procedure.

If you find a discrepancy between these plans and the current repo state, the plans are likely stale. Re-run the relevant audit before trusting either.

---

## How to Add a New Plan

1. Use the date-prefix convention: `YYYY-MM-DD_<slug>.md`.
2. Update this README's directory layout.
3. Cross-reference related plans and ADRs in the new file's header.
4. If the plan is **superseded**, mark the older file with `> **Status:** SUPERSEDED by <new-file>.md` at the top.
5. If the plan is **ratified**, also create a corresponding ADR in `governance/decisions/`.

---

## Maintenance

- Friday review: re-read `state/ledger.yaml` and ensure `output/plans/` reflects current state.
- Quarterly audit re-run: regenerate the 3 audit reports under `2026-07-30_session-audits/` (or archive and create a new dated subdirectory).
- DRY-BY-ADR: every irreversible change documented in a plan should also have a corresponding ADR in `governance/decisions/`.
