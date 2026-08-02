# 16 — Verification Matrix

**Document ID:** DOCS-BP-16-VERIFICATION-MATRIX
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** Before every send; quarterly thereafter

---

## 1. Purpose

This document maps every task in the framework to its **acceptance criterion**, the **proving artifact** (the file or script run that proves it), and the **constitutional hard rule** it satisfies. It is the single matrix that proves the package is ready to send.

If any row is RED (not verified), the package is NOT ready to send. If any row is YELLOW (warning), the founder reviews and signs off.

---

## 2. PRP-A verification (11 tasks, 13 acceptance criteria)

| Task | AC ID | Acceptance criterion | Proving artifact | Constitutional rule | Status |
|---|---|---|---|---|---|
| A-1 | A-AC1 | Long plan HTML contains `$14.00`, `$15.00`, `7.0%`, `10–15%`; absent `$13/hr`, `6.75%`, `7.9–13%` | `scripts/preflight.py --check-facts` | Hard rule 1 (research before assumptions) | ☐ |
| A-2 | A-AC2 | `$62,100` present in both plan HTMLs as `Y1 gross revenue` | `scripts/preflight.py --check-headline` | Hard rule 2 (evidence before opinions) | ☐ |
| A-2 | A-AC3 | `$16,590` retained with "net profit" label on separate line | `scripts/preflight.py --check-headline` | Hard rule 2 | ☐ |
| A-3 | A-AC4 | Four evaluator recommendations present in long plan with citations | `scripts/preflight.py --check-evaluator-recs` | Hard rule 3 (specification before implementation) | ☐ |
| A-4 | A-AC5 | `output/reports/business_plan_condensed.md` exists, < 30,000 bytes, content matches PDF | `wc -c output/reports/business_plan_condensed.md` + `diff` against PDF text | Hard rule 4 (documentation before memory) | ☐ |
| A-5 | A-AC6 | `--family --dry-run` lists condensed PDF + family cover letter + summary card | `python scripts/send_business_plan.py --family --dry-run` | Hard rule 5 (validation before deployment) | ☐ |
| A-5 | A-AC7 | `--resend v1.0 --dry-run` shows correction summary in email body preview | `python scripts/send_business_plan.py --resend v1.0 --dry-run` | Hard rule 5 | ☐ |
| A-6 | A-AC8 | `scripts/preflight.py` exits 0 on all current artifacts; exits 1 on injected failures | `python scripts/preflight.py` + manual `<script>` injection test | Hard rule 5 | ☐ |
| A-7 | A-AC9 | `content/facts.yaml` exists, ≥ 15 facts, schema-compliant | `python scripts/preflight.py --check-facts-schema` | Hard rule 7 (maintainability over velocity) | ☐ |
| A-7 | A-AC10 | `facts.lock.yaml` matches; drift check fails on unversioned fact change | Manual mutation test | Hard rule 7 | ☐ |
| A-8 | A-AC8 | All variants build from one entry point | `python scripts/build_business_plans.py --variant both` | Hard rule 6 (automation before repetition) | ☐ |
| A-9 | A-AC11 | `v1.1` and date present in both plan footers | `scripts/preflight.py --check-footer` | Hard rule 8 (decisions documented) | ☐ |
| A-10 | A-AC12 | Branched execution documented in CHANGELOG | `cat CHANGELOG.md` | Hard rule 8 | ☐ |
| A-11 | A-AC13 | All 3 existing snapshots + 1 new have SUMMARY.md | `ls output/snapshots/*/SUMMARY.md` (expect 4) | Hard rule 4 | ☐ |

---

## 3. PRP-B verification (7 tasks, 7 acceptance criteria)

| Task | AC ID | Acceptance criterion | Proving artifact | Constitutional rule | Status |
|---|---|---|---|---|---|
| B-1 | B-AC1 | Either existing approved asset embedded with disclaimer OR no hero embedded (text-only with brand color band) | Manual inspection of condensed PDF cover | Hard rule 4 (capabilities documented) | ☐ |
| B-2 | B-AC2 | Stripe mockup present on page 5 with "Illustrative" label | `scripts/preflight.py --check-mockup-label --page 5` | Hard rule 4 | ☐ |
| B-3 | B-AC3 | Google review mockup present on page 7 with format-only label | `scripts/preflight.py --check-mockup-label --page 7` | D-0013 (real testimonial policy) | ☐ |
| B-4 | B-AC4 | TOC present, 12 section entries, anchor links resolve to actual sections | `scripts/preflight.py --check-toc` | Hard rule 4 | ☐ |
| B-5 | B-AC5 | `v1.1` and date present in both plan footers | `scripts/preflight.py --check-footer` | Hard rule 7 | ☐ |
| B-6 | B-AC6 | `output/reports/diff_v1.0_to_v1.1.md` exists; covers all 4 categories | `cat output/reports/diff_v1.0_to_v1.1.md` | Hard rule 4 | ☐ |
| B-7 | B-AC7 | GBP mockup present on page 4 with format-only label OR not present (conditional) | Manual inspection of condensed PDF page 4 | Hard rule 4 | ☐ |

---

## 4. PRP-D verification (7 acceptance criteria)

| Task | AC ID | Acceptance criterion | Proving artifact | Constitutional rule | Status |
|---|---|---|---|---|---|
| D-1 | D-AC1 | Family package complete: email body + cover letter + condensed PDF + summary card | `ls output/procurement/*v1.1*` | Hard rule 4 | ☐ |
| D-2 | D-AC2 | No unconfirmed cap-table terms in family-facing artifacts | `scripts/preflight.py --check-no-placeholders --family-only` | Hard rule 5 | ☐ |
| D-3 | D-AC3 | Every dollar in use-of-funds traceable to receipt, invoice, or ledger entry | `scripts/preflight.py --check-traceability` | Hard rule 2 | ☐ |
| D-4 | D-AC4 | Return expectations include uncertainty (no guaranteed return language) | `scripts/preflight.py --check-no-guarantees` | Hard rule 3 | ☐ |
| D-5 | D-AC5 | Call notes captured post-call (founder prep doc) | `support/10-conference-call-prep.md` filled in | Hard rule 4 | ☐ |
| D-6 | D-AC6 | FAQ in plain language (no jargon; reading-level ≤ 8th grade) | `support/09-family-talking-points.md` §6 review | Hard rule 7 | ☐ |
| D-7 | D-AC7 | Summary card marked "Forecast, not a promise" | `scripts/preflight.py --check-card-disclaimer` | Hard rule 5 | ☐ |

---

## 5. Constitutional compliance matrix

| Hard rule | How verified | Status |
|---|---|---|
| 1. Research before assumptions | All claims cite `research/` artifacts or Decision Templates | ☐ |
| 2. Evidence before opinions | All Q8–Q16 cite 2025–2026 market sources in `18-founder-decisions.md` | ☐ |
| 3. Specification before implementation | This framework exists before any code lands | ☐ |
| 4. Documentation before memory | 20 framework docs precede any build script execution | ☐ |
| 5. Validation before deployment | `scripts/preflight.py` blocks send on any failure | ☐ |
| 6. Automation before repetition | Unified `scripts/build_business_plans.py` replaces 3 separate scripts | ☐ |
| 7. Maintainability over velocity | Facts YAML + lock prevents future drift | ☐ |
| 8. Decisions documented | D-0001 through D-0011 ratified; Q1–Q16 confirmed by founder | ☐ |
| 9. Capabilities registered | 5 capabilities seeded on Day 3 per `state/capability-registry.yaml` | ☐ |
| 10. No irreversible without Decision Template | Family-investment structure uses 16-question template | ☐ |

---

## 6. End-to-end verification (8 commands)

```bash
# 1. Drift check
python scripts/preflight.py --check-facts
# Expected: exit 0; content/facts.yaml matches output/reports/facts.lock.yaml

# 2. Build all variants
python scripts/build_business_plans.py --variant both
# Expected: long + condensed + evaluation rendered, all preflight gates pass

# 3. Build family package
python scripts/build_business_plans.py --variant family
# Expected: cover letter + summary card + condensed PDF generated

# 4. Preflight on all artifacts
python scripts/preflight.py
# Expected: exit 0; no stale wrong facts; all required footers present

# 5. Dry-run send
python scripts/send_business_plan.py --family --dry-run --to [FOUNDER_CONFIRM]
# Expected: lists condensed PDF + family cover letter + summary card; NO placeholders visible

# 6. Diff artifact generation
python scripts/build_business_plans.py --diff v1.0 v1.1
# Expected: output/reports/diff_v1.0_to_v1.1.md generated

# 7. Snapshot discipline
ls output/snapshots/*/SUMMARY.md
# Expected: 3 existing + 1 new = 4 SUMMARY.md files

# 8. Constitution compliance
bun run test:charter
# Expected: all lint checks pass; new governance decisions recognized
```

---

## 7. End-to-end success criteria

- [ ] Family package sent to founder's chosen address by tomorrow morning
- [ ] All 11 PRP-A tasks verified
- [ ] All 7 PRP-B tasks verified (or explicitly deferred-with-justification)
- [ ] All 7 PRP-D artifacts present
- [ ] All 10 support specs present
- [ ] Verification matrix rows all green
- [ ] 24 risks each have a mitigation
- [ ] 16 founder decisions (Q1–Q16) confirmed or carrying recommended defaults
- [ ] Post-call: follow-up email sent within 24 hours; decision logged

---

## 8. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |