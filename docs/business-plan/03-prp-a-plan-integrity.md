# 03 — PRP-A: Plan Integrity (11 Tasks)

**Document ID:** DOCS-BP-03-PRP-A
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent + build steward
**Review cadence:** Each task verified before send; full PRP-A reviewed quarterly

---

## 1. Purpose

This document is **PRP-A: Plan Integrity** — the first of three PRPs in the spec-driven framework. It contains 11 tasks, each presented as a **full Decision Template** per `governance/05-decision-framework.md` and the constitutional Hard Rule 8 ("Every major decision has rationale, alternatives, risks, and review date").

PRP-A addresses the integrity of the long plan and condensed plan documents themselves — the textual and numerical content. PRP-B (next document) addresses visual evidence. PRP-D (further document) addresses the family-investor package itself.

Each task has: **Problem / Context / Requirements / Alternatives / Evaluation matrix / Decision / Risk / Rollback / Confidence / Review date / Acceptance evidence**.

---

## 2. PRP-A task map

| Task | Title | Effort | Owner | Acceptance ID |
|---|---|---:|---|---|
| A-1 | Propagate three factual corrections to long plan | 60 min | Plan editor | A-AC1 |
| A-2 | Add explicit $62,100 Y1 ARR headline | 30 min | Plan editor | A-AC2, A-AC3 |
| A-3 | Adopt four remaining evaluator recommendations | 90 min | Plan editor | A-AC4 |
| A-4 | Create `output/reports/business_plan_condensed.md` | 30 min | Plan editor | A-AC5 |
| A-5 | Extend `scripts/send_business_plan.py` with family & resend flags | 60 min | Build steward | A-AC6, A-AC7 |
| A-6 | Build `scripts/preflight.py` | 90 min | Build steward | A-AC8 |
| A-7 | Build `content/facts.yaml` + drift-check gate | 90 min | Build steward | A-AC9, A-AC10 |
| A-8 | Build unified `scripts/build_business_plans.py` | 120 min | Build steward | A-AC8, A-AC9 |
| A-9 | Add version stamp to document footers | 30 min | Build steward | A-AC11 |
| A-10 | Re-send or regenerate-in-place (Q5 branch) | 20 min | Founder + build steward | A-AC12 |
| A-11 | Add `SUMMARY.md` to each snapshot directory | 45 min | Build steward | A-AC13 |

**Total PRP-A effort:** ~11 hours; critical path for tonight.

---

## 3. Task A-1 — Propagate Three Factual Corrections to Long Plan

**Problem.** Long plan HTML, MD, and PDF on disk still contain `$13/hr`, `6.75%`, `7.9–13%` while the sent condensed PDF carries the corrected values. The Round 3 condensed PDF is canonical for the reader; the long plan is reference for the founder; the values disagree across the two artifacts.

**Context.** Three rounds have been delivered. Round 3 condensed has the corrections. The long plan is the reference document (used by the founder to ground her during the call, and a fallback if the family investor asks for the longer version). The long plan lives on disk with stale values because corrections have been applied only to the condensed script (`scripts/build_condensed_business_plan.py`).

**Requirements.**
- Long plan must carry **$14.00/hr** (current through 2026-09-29) and **$15.00/hr** (effective 2026-09-30) per FL Constitution Amendment 2 / 2026 FL DOR schedule.
- Long plan must carry **7.0%** sales tax (FL 6% + Pinellas 1.0% surtax, effective 2025-01-01 per FL DOR DR-15DSS 2026).
- Long plan must carry **10–15%** industry net-margin benchmark (NALP/IBISWorld/Aspire 2026).
- Sources cited inline next to each corrected fact.
- The preflight script blocks send if any of these values is missing.

**Alternatives considered.**
- **A. Propagate to long plan only** — minimal but leaves stale references in operational artifacts.
- **B. Propagate plan + reconcile operational artifacts** (architecture/twin/invoice.md, content/templates/invoice-template.md, research/regulatory/largo-licensing-map.yaml, state/ledger.yaml) — full fix but expands scope beyond the family package.
- **C. Propagate plan + flag operational artifacts as deferred exceptions** (chosen).

**Evaluation matrix.**

| Option | Correctness | Scope | Risk | Tonight-feasible |
|---|:-:|:-:|---|:-:|
| A | Partial | Tighter | Drift remains in ops | ✓ |
| B | Full | Wide | Breaks other artifacts | ✗ |
| C | Full in plan, partial in ops | Tighter | Plan correct, ops flagged | ✓ |

**Decision.** **C** — propagate plan, flag operational artifacts as out-of-cycle source-reconciliation exceptions.

**Risk.** Stale 6.75% in research/regulatory/largo-licensing-map.yaml may mislead the founder or regulator.
**Mitigation.** Add explicit `[RECONCILE-Q3-2026]` marker in each operational file; create a new governance decision **D-0062 (Source Reconciliation Exception)** for the reconciliation cycle.

**Rollback.** Revert script changes; previous long plan archived in `output/snapshots/2026-07-27T20-50_post_business_plan_build/`.

**Confidence.** 95% (corrections are sourced; sources are documented in Round 3 condensed and `business_plan_improvement_analysis.md`).

**Review date.** 2026-09-15 (after next 30-day pilot data lands).

**Acceptance evidence.** A-AC1 — long plan HTML grep contains `$14.00`, `$15.00`, `7.0%`, `10–15%`; absent: `$13/hr`, `6.75%`, `7.9–13%`.

---

## 4. Task A-2 — Add Explicit $62,100 Y1 ARR Headline

**Problem.** $62,100 Y1 ARR is implicit in the cover letter and the at-a-glance page but does not appear as a labeled, distinct line. The `$16,590 baseline net profit` line appears next to it, and a reader may confuse the two — particularly under the stress of a family-investor call.

**Context.** The condensed PDF and the corrected long plan both need a visible, labeled revenue headline. Round 3 added the headline to condensed only.

**Requirements.**
- Insert **$62,100 Y1 gross revenue** in both executive-summary / at-a-glance sections.
- Insert the **pessimistic $30,192** and **stretch $106,560** Y1 ARR as bracketed range below the headline: `($30,192 – $106,560)`.
- Keep `$16,590 baseline net profit` as a separate metric, with explicit "net profit" label.
- Never let the gross and net numbers appear without labels distinguishing them.
- Insert on the summary card as well (per PRP-D §6.8).
- Use a sentence between them: "Gross is the top line — what customers pay. Net is what's left after paying for equipment, insurance, software, marketing, fuel, supplies, and taxes."

**Alternatives considered.**
- **A. Add to at-a-glance only.**
- **B. Add to at-a-glance + footer of every page.**
- **C. Add to at-a-glance + summary card** (chosen).

**Evaluation matrix.**

| Option | Visibility | Intrusiveness | Reader risk | Tonight-feasible |
|---|:-:|:-:|:-:|:-:|
| A | Med | Low | Med | ✓ |
| B | High | Med (footer) | Low | ✓ |
| C | High | Low | Low | ✓ |

**Decision.** **C** — at-a-glance + summary card visibility. Footer per page is excessive.

**Risk.** Reader confuses gross with net.
**Mitigation.** Bold labels, separate lines, color-coded in non-email contexts, plus the explanatory sentence.

**Rollback.** Revert script edits; previous build archived.

**Confidence.** 99%.

**Review date.** 2026-09-01.

**Acceptance evidence.**
- **A-AC2** — `$62,100` present in both plan HTMLs as `Y1 gross revenue`.
- **A-AC3** — `$16,590` retained with explicit "net profit" label, on a separate line below the gross.

---

## 5. Task A-3 — Adopt Four Remaining Evaluator Recommendations in Long Plan

**Problem.** Long plan does not incorporate four unadopted recommendations from `output/reports/business_plan_with_evaluation.md`: gross-margin-to-first-hire model, post-credit CAC forecast, named AI model provider, three additional risks.

**Context.** These are factual gaps that reduce the plan's defensibility for the family investor (and any future external investor). The evaluator's addendum flagged them; Round 3 deferred them for "next cycle." This is the next cycle.

**Requirements.**
1. **First-hire transition model.** 74% founder-only gross margin → 45–55% after first hire; trigger = MRR >$5K/mo for 2 months OR founder >50 hrs/wk for 4 weeks.
2. **Post-credit CAC forecast.** $90–200/customer after 30–60 days when free ad credits close. Cite source: Google Ads 2026 CPC $4–$12 in Pinellas lawn-care vertical; Nextdoor Local Deals benchmark $8–$25/lead; Thumbtack 10–15% close rate.
3. **AI provider decision.** Name **Anthropic Claude** as the primary model family + specify fallback procedure + manual operating window. Cite the foundation: GRASS organization already runs on Claude.
4. **Add risks.** Three risks: AI model concentration (R-AI-001); GBP suspension (R-GBP-001); agent drift (R-DRIFT-001). Each with likelihood × impact × mitigation.

**Alternatives considered.**
- **A. Adopt all four** — recommended.
- **B. Adopt three** (defer AI naming until provider selection criteria formalized).
- **C. Adopt only the financial models** (1+2); defer AI/risks as next-cycle.

**Evaluation matrix.**

| Option | Defensibility | Disclosure depth | Risk of confusion | Tonight-feasible |
|---|:-:|:-:|---|:-:|
| A | High | Full | Low | ✓ |
| B | Med | Partial | Med (un-named provider suspicious) | ✓ |
| C | Med | Partial | Med (risks not surfaced) | ✓ |

**Decision.** **A** — adopt all four. The family investor benefits from transparency on AI risk; deferring would be conspicuous and could create a future disclosure gap.

**Risk.** Naming Claude creates switching cost if org pivots.
**Mitigation.** Footer text: "AI model provider may change; doctrine documented in `architecture/04-systems-architecture.md`."

**Rollback.** Revert script edits.

**Confidence.** 90%.

**Review date.** 2026-10-01.

**Acceptance evidence.** A-AC4 — all four recommendations present in long plan with citations to the original evaluator addendum and 2026 market data.

---

## 6. Task A-4 — Create `output/reports/business_plan_condensed.md`

**Problem.** Condensed PDF is rendered from a Python script directly; no reviewable Markdown source exists. Without a Markdown source, no one can review/grep/diff the condensed content.

**Context.** The condensed PDF is canonical. It must be readable as text for both preflight extraction and human review. Round 3 sent the PDF but the MD was not extracted.

**Requirements.**
- Generate a Markdown source that mirrors the sent canonical PDF content.
- Must be < 30 KB (matches condensed PDF length).
- Format mirrors the long plan MD (heading hierarchy + bullet lists + tables).
- Must include `$62,100` headline (per A-2).
- Must include the 3 corrected facts (per A-1).
- Diff-able: line-by-line correspondence with condensed PDF.

**Alternatives considered.**
- **A. Generate MD from PDF** (reverse-engineer via PDF text extraction).
- **B. Generate MD from script source** (chosen).
- **C. Skip MD, rely on PDF.**

**Evaluation matrix.**

| Option | Accuracy | Maintenance | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | Med (PDF parsing fragile) | Med | ✓ |
| B | High (same source) | High | ✓ |
| C | Low (no reviewable artifact) | Low | ✓ |

**Decision.** **B** — extract from the existing build script (`scripts/build_condensed_business_plan.py`) which holds the canonical condensed content.

**Risk.** MD may diverge from PDF if Python escapes HTML entities.
**Mitigation.** Add regex normalization pass + diff against `business_plan_text_lines.txt` (the existing 43 KB text dump from earlier extraction).

**Rollback.** Delete MD file.

**Confidence.** 95%.

**Review date.** 2026-09-01.

**Acceptance evidence.** A-AC5 — file exists, < 30,000 bytes, content matches condensed PDF (per `diff` command in preflight).

---

## 7. Task A-5 — Extend `scripts/send_business_plan.py` with Family & Resend Flags

**Problem.** Current send wrapper only supports the base full variant; missing `--condensed`, `--with-evaluation`, `--family`, `--summary-card`, `--resend`.

**Context.** Family package requires a different send shape (email body + condensed PDF + cover letter + summary card, not the long plan). The existing wrapper has been used for three rounds of staging sends; its behavior is well-understood.

**Requirements.**
- Add flags: `--condensed`, `--with-evaluation`, `--family`, `--summary-card`, `--resend`, `--dry-run`, `--send`, `--no-rebuild`, `--attach-html`, `--pdf-only`, `--to`, `--subject`, `--confirm-recipient`.
- `--family` selects condensed PDF + family cover letter + summary card as attachments.
- `--summary-card` attaches the summary card only.
- `--resend` requires explicit prior version (e.g., `--resend v1.0`) and generates a correction summary as part of the email body.
- All flags must support `--dry-run` and require `--confirm-recipient` (blocks accidental sends).
- Default behavior unchanged (long plan + cover letter).

**Alternatives considered.**
- **A. Extend existing script** (chosen).
- **B. Write new send-family-plan.py.**
- **C. Use OWL directly via shell.**

**Evaluation matrix.**

| Option | Single canonical entry | Drift risk | Maintenance | Tonight-feasible |
|---|:-:|:-:|:-:|:-:|
| A | ✓ | Low | Low | ✓ |
| B | ✗ | Med | Med | ✓ |
| C | ✗ | High | High | ✓ |

**Decision.** **A** — single canonical send wrapper, fewer divergence points.

**Risk.** Adding flags may break existing flows.
**Mitigation.** Default behavior unchanged; only flags opt-in. Snapshot discipline ensures rollback is possible.

**Rollback.** Revert script.

**Confidence.** 90%.

**Review date.** 2026-09-01.

**Acceptance evidence.**
- **A-AC6** — `python scripts/send_business_plan.py --family --dry-run --to [FOUNDER_CONFIRM]` lists condensed PDF + family cover letter + summary card.
- **A-AC7** — `python scripts/send_business_plan.py --resend v1.0 --dry-run` lists the correction summary in the email body preview.

---

## 8. Task A-6 — Build `scripts/preflight.py`

**Problem.** Gmail QA gates currently run inline during build; no standalone script. Build breakage when any gate fails should be loud and explicit, but today it's silent.

**Context.** The existing build scripts have inline checks but no single executable that can be run before send, after send, or in CI. A standalone preflight script is the contract that gates every external artifact.

**Requirements.** Standalone script that runs on any HTML/PDF artifact. Blocking checks:

- **HTML structure.** 0 `background-image`, 0 `background-url`, 0 `position:absolute`, 0 `position:fixed`, 0 `<script>`, balanced `<table>` open/close, all `<img>` have alt, no empty `src`, no `javascript:` hrefs.
- **Content.** No stale wrong facts ($13/hr, 6.75%, 7.9–13%). Required version stamp present. No unresolved `[FOUNDER_CONFIRM]` in family package.
- **PDF structure.** No blank pages. Page count ≥1. No zero-byte attachments. PDF metadata title matches variant.
- **Accessibility.** Min 12pt font (warn-only). WCAG AA contrast (warn-only). No information conveyed by color alone (warn-only).

Warnings (non-blocking): cover letter size threshold, accessibility lint.

**Alternatives considered.**
- **A. Standalone script** (chosen).
- **B. Inline in build.**
- **C. As Makefile target.**

**Evaluation matrix.**

| Option | Re-usable | CI-friendly | Independent of build | Tonight-feasible |
|---|:-:|:-:|:-:|:-:|
| A | ✓ | ✓ | ✓ | ✓ |
| B | ✗ | ✗ | ✗ | ✓ |
| C | Med | ✓ | ✓ | ✓ |

**Decision.** **A** — standalone, callable from CI, pre-send, post-build, and on-demand.

**Risk.** False positives on legitimate patterns (e.g., a justified `position:absolute` for a layout).
**Mitigation.** Allow-list mechanism with comments; line-level suppression comments.

**Rollback.** Delete script.

**Confidence.** 90%.

**Review date.** 2026-09-01.

**Acceptance evidence.** A-AC8 — `preflight.py` exits 0 on all current artifacts; exits 1 on injected failures (e.g., manually add `<script>` to a build and re-run).

---

## 9. Task A-7 — Build `content/facts.yaml` + Drift-Check Gate

**Problem.** Three facts have already drifted between long and condensed plans. No preventive mechanism exists. Without a facts-of-record, every correction propagates by hand.

**Context.** Tomorrow's family package must not regress. Every fact that has historically drifted (tax, wage, margin) and every fact that will need to be re-cited (ARR, net profit, seed ask, LTV, gross margin) is captured in `content/facts.yaml` with provenance.

**Requirements.** Schema-rich facts YAML with the following fields per fact:

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `id` | string | ✓ | Kebab-case slug (e.g., `fl-min-wage-2026`) |
| `value` | any | ✓ | The current canonical value |
| `units` | string | ✓ | e.g., `USD/hr`, `percent`, `USD/yr` |
| `source` | string | ✓ | URL or file path |
| `effective_date` | ISO date | ✓ | When this value became canonical |
| `review_date` | ISO date | ✓ | When this should be re-verified |
| `confidence` | float (0–1) | ✓ | Source quality |
| `scope` | string | ✓ | `plan`, `pricing`, `legal`, `ops`, `all` |
| `notes` | string | — | Optional context |

**Drift-check algorithm.**

1. Load `content/facts.yaml` and `output/reports/facts.lock.yaml`.
2. Normalize both (strip whitespace, normalize number formatting).
3. Compare; if any fact's `value` differs from the lock, exit 1 with the fact ID.
4. Extract watched facts from generated HTML and compare to YAML.
5. If any watched fact in HTML differs from YAML, exit 1 with the line number.

**Alternatives considered.**
- **A. Simple per-fact YAML** (chosen).
- **B. Full content model with sections + manifests** (PRP-C, deferred).
- **C. Master Markdown source with YAML front-matter** (PRP-C, deferred).

**Evaluation matrix.**

| Option | Tonight-feasible | Drift protection | Next-cycle migration |
|---|:-:|:-:|:-:|
| A | ✓ | High | Easy to extend |
| B | ✗ | High | Already migrated |
| C | ✗ | High | Already migrated |

**Decision.** **A** — pull facts.yaml forward into PRP-A per analysis recommendation; defer full content model.

**Risk.** Facts YAML becomes a parallel source of truth if not all builds consume it.
**Mitigation.** All build scripts must consume YAML (A-8 enforces this). `preflight.py` checks every fact is sourced.

**Rollback.** Delete YAML files; revert build scripts.

**Confidence.** 90%.

**Review date.** 2026-09-15.

**Acceptance evidence.**
- **A-AC9** — `content/facts.yaml` exists, has ≥15 facts, all schema-compliant.
- **A-AC10** — `facts.lock.yaml` matches; drift check fails on unversioned fact change (test by mutating one fact and re-running).

---

## 10. Task A-8 — Build Unified `scripts/build_business_plans.py`

**Problem.** Three separate build scripts (long, condensed, evaluation) each duplicate facts, brand tokens, and preflight logic. Drift root cause.

**Context.** Consolidation is necessary for drift-check gate to work. The new unified entry point loads from `content/facts.yaml` and `content/brand_tokens.yaml`, renders to HTML/PDF, runs preflight, stamps version, generates diff artifact.

**Requirements.** Single entry point with `--variant {long, condensed, evaluation, family, summary-card, both}`. Reads common facts + brand tokens. Calls preflight as build gate. Outputs HTML + PDF + version stamp + diff artifact.

**Build sequence.**

1. Validate dependencies (weasyprint, markdown, etc.).
2. Load `content/facts.yaml`.
3. Drift-check against `facts.lock.yaml`.
4. Render template(s) to HTML.
5. Run `scripts/preflight.py` on HTML.
6. Convert HTML → PDF.
7. Stamp version footer (per A-9).
8. Compute hashes (input + output).
9. Generate diff artifact if `--diff` flag set.
10. Write summary to build log.

**Refuses to write output if any required gate fails.**

**Alternatives considered.**
- **A. Refactor existing scripts into one** (chosen).
- **B. Keep separate scripts, link to shared library.**
- **C. Master Markdown source + manifest** (PRP-C, deferred).

**Evaluation matrix.**

| Option | Single entry point | Drift prevention | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | ✓ | High | ✓ |
| B | ✗ | Med | ✓ |
| C | ✓ | High | ✗ |

**Decision.** **A** — single entry point, shared library.

**Risk.** Refactor may break existing flows.
**Mitigation.** Old scripts archived in `output/snapshots/scripts_archived_v1.0/`. New script is default. Snapshot discipline ensures reproducibility.

**Rollback.** Revert to archived scripts.

**Confidence.** 85%.

**Review date.** 2026-09-15.

**Acceptance evidence.**
- **A-AC8** — `preflight.py` exits 0 on all current artifacts.
- **A-AC9** — all variants build from one entry point; preflight + drift-check gate enforced.

---

## 11. Task A-9 — Add Version Stamp to Document Footers

**Problem.** No document carries version, date, or SHA stamp. Reader cannot tell which version they are looking at; founder cannot tell whether the canonical has been superseded.

**Context.** Reader-facing documents and the summary card must carry a footer that identifies the artifact version, the build date, and a short hash for verification.

**Requirements.** Footer block with the following fields, in this order:

```
Largo Lawn · Mission 1
Version 1.1 · Condensed family-investor package
Built 2026-07-28 · Source SHA: <sha>
Forecast document; not a guarantee of results.
```

Same format across all variants (long, condensed, evaluation, family cover letter, summary card). Footer is small text, monochrome.

**Alternatives considered.**
- **A. Footer on every page** (chosen).
- **B. Footer only on last page.**
- **C. Separate version page.**

**Evaluation matrix.**

| Option | Visibility | Intrusiveness | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | High | Low (small text) | ✓ |
| B | Med | Low | ✓ |
| C | High | Med (extra page) | ✓ |

**Decision.** **A** — every page footer.

**Risk.** Footer takes up space.
**Mitigation.** Small text (8pt), monochrome.

**Rollback.** Revert build script.

**Confidence.** 95%.

**Review date.** 2026-09-01.

**Acceptance evidence.** A-AC11 — `v1.1` and date present in both plan footers; preflight verifies presence.

---

## 12. Task A-10 — Re-Send or Regenerate-in-Place (Q5 Branch)

**Problem.** Q5 — does the founder want to re-send the corrected long plan to themselves (choblo@gmail.com), or just regenerate in place on disk?

**Context.** Condensed already sent as canonical. Re-sending unsolicited may confuse. Founder prefers to keep the staging address clean.

**Requirements.** Two branches:

- **Regenerate in place + archive v1.0** (default). Long plan v1.1 produced on disk; old version archived in `output/snapshots/2026-07-29_post_v1.1/`. Changelog entry. Send log NOT updated (no external send).
- **Resend as v1.1** (only if founder explicitly approves). New cover letter with "(corrected)" marker. Sent email logged.

**Alternatives considered.**
- **A. Regenerate by default; resend only on explicit approval** (chosen).
- **B. Always resend.**
- **C. Always regenerate.**

**Evaluation matrix.**

| Option | Spamming risk | Founder control | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | Low | High | ✓ |
| B | Med | Low | ✓ |
| C | Low | Low | ✓ |

**Decision.** **A** — minimize unsolicited send volume.

**Risk.** Family investor may want to see the long plan.
**Mitigation.** Long plan reference is offered in the follow-up call if asked.

**Rollback.** Snapshot archive restores v1.0.

**Confidence.** 95%.

**Review date.** 2026-09-01.

**Acceptance evidence.** A-AC12 — branched execution; either branch documented in `CHANGELOG.md`.

---

## 13. Task A-11 — Add `SUMMARY.md` to Each Snapshot Directory

**Problem.** Three existing snapshots have no `SUMMARY.md` — they are not self-describing. Snapshot discipline depends on the snapshot being understandable in isolation.

**Context.** The three prior snapshot directories are dated 2026-07-27 (long plan), 2026-07-27 (long + evaluator), 2026-07-28 (condensed). All three were created by `scripts/build_*.py` but none carries a self-describing summary.

**Requirements.** Each snapshot has `SUMMARY.md` with:

- Timestamp (UTC + EDT)
- Version (e.g., v1.0)
- Variant(s) included
- Files included (with hashes)
- What changed (brief)
- What was sent (recipient, timestamp, result)
- Send status (success/failure)
- Known limitations
- Source SHA
- Founder approval status
- Rollback reference (e.g., "Restore from `output/snapshots/2026-07-27T20-50_post_business_plan_build/` to revert")

**Alternatives considered.**
- **A. Generate retroactively for existing 3 + mandate for future** (chosen).
- **B. Schema in a script.**
- **C. Skip.**

**Evaluation matrix.**

| Option | Self-describing | Reproducibility | Tonight-feasible |
|---|:-:|:-:|:-:|
| A | ✓ | High | ✓ |
| B | ✓ | High | ✗ (script) |
| C | ✗ | Low | ✓ |

**Decision.** **A** — retroactive + mandate.

**Risk.** Manual entry error.
**Mitigation.** Auto-generate from build log; manual fields are minimum (8 fields).

**Rollback.** Delete SUMMARY.md files.

**Confidence.** 95%.

**Review date.** 2026-09-01.

**Acceptance evidence.** A-AC13 — all 3 existing snapshots + any future snapshot have SUMMARY.md.

---

## 14. PRP-A summary

| Task | Effort | Confidence | Acceptance ID |
|---|---:|:-:|---|
| A-1 — Three factual corrections | 60 min | 95% | A-AC1 |
| A-2 — $62,100 ARR headline | 30 min | 99% | A-AC2, A-AC3 |
| A-3 — Four evaluator recs | 90 min | 90% | A-AC4 |
| A-4 — Condensed MD source | 30 min | 95% | A-AC5 |
| A-5 — Send wrapper flags | 60 min | 90% | A-AC6, A-AC7 |
| A-6 — Preflight script | 90 min | 90% | A-AC8 |
| A-7 — Facts YAML + drift | 90 min | 90% | A-AC9, A-AC10 |
| A-8 — Unified build script | 120 min | 85% | A-AC8, A-AC9 |
| A-9 — Version stamp footer | 30 min | 95% | A-AC11 |
| A-10 — Re-send branch | 20 min | 95% | A-AC12 |
| A-11 — Snapshot SUMMARY.md | 45 min | 95% | A-AC13 |
| **Total** | **~11 hours** | **avg 92%** | **13 ACs** |

Critical path tonight: A-7 → A-8 → A-6 → A-5 → A-1 → A-2 → A-3 → A-9 → A-11 → A-10 → A-4 → send.

---

## 15. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |