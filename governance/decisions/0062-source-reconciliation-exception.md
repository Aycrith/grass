# D-0062 — Source Reconciliation Exception (Q3 2026 cycle)

**Date:** 2026-07-28
**Status:** RATIFIED 2026-07-28 (founder disposition: "Create real ADR files (Recommended)")
**Author:** Claude Code (with steward)
**Scope:** 4 operational artifacts that carry pre-correction facts conflicting with the canonical `content/facts.yaml` snapshot.
**Review date:** 2026-09-15 (60 days post-ratification, ahead of Q3 reconciliation cycle)
**Confidence (shipped):** 0.85
**Supersedes:** nothing (first formal record of this exception class)

---

## 0. The decision in one paragraph

Defer reconciliation of **4 operational artifacts** that carry pre-correction facts (the `6.75%` Pinellas sales tax, the `$13/hr` FL min wage, the `OBJ-M2-004` $4.99 domain cost line, and a few inherited stale numerics) to the **Q3 2026 reconciliation cycle** (target 2026-09-15). Stamp each file with the literal marker `[RECONCILE-Q3-2026]` so any reader who lands on one of these artifacts is told explicitly that its numbers do NOT match the canonical snapshot. **Do not** block the 2026-07-28 family-investor live send on these 4 files — none of them is attached to, or referenced by, the 3-attachment family package.

---

## 1. Problem

Exploration of the live state on 2026-07-28 surfaced a class of files that are canonically governed by `content/facts.yaml` (per PRP-A A-7 + S-01) but whose on-disk contents were authored or last-edited **before** the 2026-07-28 lock of `output/reports/facts.lock.yaml` and still carry pre-correction numerics.

| Pre-correction value | Canonical value | Conflicting files (4) |
|---|---|---|
| `6.75%` Pinellas sales tax | `7.0%` (FL 6% + Pinellas 1% surtax) | `architecture/twin/invoice.md`, `content/templates/invoice-template.md`, `research/regulatory/largo-licensing-map.yaml`, `state/ledger.yaml` |
| `$13/hr` FL min wage | `$14/hr` current / `$15/hr` effective 2026-09-30 | `research/regulatory/largo-licensing-map.yaml`, `state/ledger.yaml` |
| `$4.99` OBJ-M2-004 domain cost | `$9.15` (per long plan §13 operational cost table) | `state/ledger.yaml` line 112 |
| `7.9-13%` net margin range (pre-correction framing) | `10-15%` NALP/IBISWorld 2026 bracketed benchmark | none of the 4 directly — sender-pipeline STALE_FACT_PATTERNS catches this on the family package |

The sender pipelines (`scripts/preflight.py` and `scripts/send_family_package.py`) **do** scan the family package for stale facts (Phase A.1 reconciled those lists 2026-07-28). They do **not** scan these 4 operational artifacts, because the family package does not embed or reference any of them.

## 2. Context

- **What changed:** Between the 2026-07-22 ledger freeze and the 2026-07-28 facts.yaml lock, 5 corrections landed: sales tax 6.75% → 7.0%, min wage $13 → $14 ($15 on 2026-09-30), domain cost $4.99 → $9.15, net margin framing 7.9-13% → 10-15%, gross-margin transition 74% → 45-55% (post-first-hire).
- **What did NOT happen:** The 4 operational artifacts above were NOT regenerated. They are downstream consumers of `facts.yaml` but were authored in earlier sessions and have no regeneration script (per-state).
- **What is NOT a problem:** The family package's 3 attachments (condensed PDF, summary card, cover letter) were all rebuilt via `python scripts/send_family_package.py --build-only` on 2026-07-28 and pass the Phase A.7 / A.8 gates. None of the 4 stale-source files is attached to or textually referenced by the family package.
- **Why the exception exists:** This is a class of "twin artifact drift" — operational documentation that mirrors canonical facts but isn't auto-regenerated. The class will recur; this ADR formalizes the policy for handling it without blocking live operations.

## 3. Requirements

A successful resolution of this exception must:

1. **Not block the 2026-07-28 family-investor live send** (Phase B of the customized perfection plan).
2. **Make the drift visible** to any reader of the 4 stale files (no silent inconsistencies).
3. **Schedule the reconciliation** with an owner and a date so it does not dissolve.
4. **Document the recurrence class** so future operational artifacts added under the same pattern get the same marker at authorship time (not at reconciliation time).

## 4. Alternatives considered

| Option | Approach | Pro | Con | Verdict |
|---|---|---|---|---|
| A | Regenerate the 4 artifacts now (before send) | Removes the drift entirely | Requires 4+ hours of content rewrite; risks new copy errors before a high-stakes send; reconciliation scripts don't exist for all 4 files | **Rejected** — late edit risk outweighs drift risk |
| B | Defer with `[RECONCILE-Q3-2026]` stamp on each file (this ADR) | Cheap, explicit, reversible, doesn't block send | Reader still sees stale numbers | **Selected** |
| C | Defer silently (no stamp) | Cheapest | Hides drift from future readers; same trap re-creates next time | **Rejected** — defeats the policy |
| D | Block the send until the 4 artifacts reconcile | Most correct numerically | Family investor call is 2026-07-29 morning; missing the send window is more costly than any of the 4 stale numbers | **Rejected** — disproportionate |

## 5. Evaluation matrix

| Criterion | A (regen) | B (stamp) | C (silent) | D (block send) |
|---|---|---|---|---|
| Blocks send? | YES (4+ hrs) | NO | NO | YES (4+ hrs + copy churn) |
| Drift visible to readers? | N/A (no drift) | YES | NO | N/A |
| Reversible? | NO (rewrite committed) | YES (delete stamp) | YES (always) | NO (send missed) |
| Cost (founder hours) | 4+ | <0.25 | 0 | 4+ |
| Probability of new copy error | medium | low | zero | medium |
| Satisfies Requirement 1 (no-block)? | NO | YES | YES | NO |
| Satisfies Requirement 2 (visible)? | YES | YES | NO | YES |
| Satisfies Requirement 3 (scheduled)? | YES (immediate) | YES | NO | YES (immediate) |
| Satisfies Requirement 4 (class doc)? | PARTIAL | YES | NO | PARTIAL |

**Selected: Option B (defer with stamp).** Wins on every "blocks send" / "visible" / "reversible" / "class doc" axis. Cost is <15 minutes (4 file edits).

## 6. Decision

**Defer reconciliation of the 4 operational artifacts to Q3 2026 reconciliation cycle, target 2026-09-15.** For each of the 4 files, add the literal marker `[RECONCILE-Q3-2026]` at the top of the file (or in the existing "drift" comment block if present), with a one-line pointer to this ADR (D-0062) and to `content/facts.yaml` as the canonical reference. Do NOT modify any numeric value during the deferral — the stamp alone is sufficient signal.

### 6.1 Marker placement

For each of the 4 files, the marker goes:
- `architecture/twin/invoice.md`: top of file, after the title heading, in the existing "drift discipline" comment block.
- `content/templates/invoice-template.md`: top of file, after the title heading.
- `research/regulatory/largo-licensing-map.yaml`: top of file, in the YAML `notes:` field of the affected keys (e.g., `sales_tax`).
- `state/ledger.yaml`: top of file, in the existing "drift discipline" comment block. (Reconciled in Phase A.4 of the perfection plan; the marker is part of that refresh.)

### 6.2 Owner and schedule

- **Owner:** Claude Code (research division per `agents/research.md`; reconciliation is data-update work, not engineering).
- **Schedule:** Phase A.4 of the customized perfection plan (2026-07-28) for the marker placements. Actual reconciliation: Q3 2026 cycle, target 2026-09-15.
- **Tracking:** Persistent Tracking Items table of the perfection plan; calendar reminder 2026-09-08 (7-day warning) and 2026-09-15 (target).

## 7. Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Reader sees stale value in one of the 4 files and propagates it elsewhere | Medium | Medium | Stamp makes the drift visible; sender-pipeline preflight gates scan the family package directly, so propagation to investor is blocked |
| 2026-09-15 reconciliation slips (no founder attention) | Medium | Low | Calendar reminder; this ADR is the durable record; the 4 markers auto-surface as grep-friendly text in any audit |
| New twin artifact is added in the same pattern (no marker) | Low | Low | Requirement 4 of this ADR requires future artifacts to be stamped at authorship, not at reconciliation; documented in `agents/research.md` Day-3+ work |
| Family investor asks about the 4 files specifically | Low | Medium | The condensed plan PDF (12 pages, attached) is the canonical reference; the 4 files are internal twin artifacts, not investor-facing |

## 8. Rollback

If the deferral proves wrong (e.g., founder decides to regenerate now anyway), the rollback is:
1. Remove `[RECONCILE-Q3-2026]` markers from the 4 files (1 command, `sed -i '/\[RECONCILE-Q3-2026\]/d' <files>`).
2. Regenerate the 4 files against `content/facts.yaml` (4+ hours of content rewrite per file, no shared regeneration script).
3. Update this ADR's status from "RATIFIED" to "SUPERSEDED by regeneration; see new D-NNNN."
4. Notify Claude Code's research division to update the day-3+ work on twin-artifact drift to reflect that auto-regeneration is now preferred over stamping.

No irreversible commitment is made by this ADR — the stamp-only path is reversible at any time before 2026-09-15.

## 9. Confidence

**0.85** (shipped). The selected path is the cheapest non-blocking option that still makes drift visible. The risk surface is small (none of the 4 files is investor-facing) and the schedule is tight (2026-09-15 = 49 days post-ratification). The confidence is not 0.95+ because the marker-only discipline depends on a 2026-09-15 reconciliation actually happening; calendar reminders and persistent tracking items mitigate but do not eliminate the slip risk.

## 10. Review date

**2026-09-15.** If reconciliation has not begun by 2026-09-08 (one week prior), Claude Code escalates to founder via the steward channel. If founder is unavailable, the 4 markers remain in place and the review date moves forward to 2026-12-15 (Q4 cycle), with a new ADR D-NNNN superseding this one.

---

## Appendix A — The 4 files (full path + drift summary)

| File | Pre-correction value | Canonical value | Lines (approx) | Marker placement |
|---|---|---|---|---|
| `architecture/twin/invoice.md` | `6.75%` sales tax | `7.0%` | ~45 | top comment block |
| `content/templates/invoice-template.md` | `6.75%` sales tax | `7.0%` | ~120 | top of file |
| `research/regulatory/largo-licensing-map.yaml` | `6.75%` sales tax, `$13/hr` min wage | `7.0%`, `$14/hr` | ~80 | YAML `notes:` field per key |
| `state/ledger.yaml` | `6.75%` sales tax, `$13/hr` min wage, `$4.99` OBJ-M2-004 | `7.0%`, `$14/hr`, `$9.15` | ~314 | top comment block |

## Appendix B — Relationship to other ADRs

- **D-0063** (Claude/Anthropic AI provider claim) — independent decision; not blocked by this exception.
- **D-0060** (Five-plane hero architecture) — visual; not affected.
- **D-0059** (Hero simplification + extension) — visual; not affected.
- **D-0050** (Hero content extension) — visual; not affected.
- **PRP-A A-7** (facts.yaml lock + drift discipline) — the canonical-source policy this exception operates under.

---

**End of D-0062.**
