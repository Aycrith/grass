# 19 — Implementation Roadmap

**Document ID:** DOCS-BP-19-ROADMAP
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** Continuous; pre-send checklist mandatory

---

## 1. Purpose

This document is the implementation roadmap — what happens tonight, what happens tomorrow morning, what happens after the call. It sequences every task in the framework against the deadline (tomorrow morning 2026-07-29 08:00 EDT) and provides the post-call protocol.

---

## 2. Tonight (2026-07-28 evening → 2026-07-29 06:00 EDT)

### 2.1 Phase 1 — Founder decisions (20 min, blocks all else)

**Owner:** Founder (steward).

| Step | Task | Outcome |
|---|---|---|
| 1.1 | Read `18-founder-decisions.md` Q1–Q16 | All 16 questions understood |
| 1.2 | Resolve every `[FOUNDER_CONFIRM]` placeholder | All defaults replaced or accepted |
| 1.3 | Sign off on `18-founder-decisions.md` §5 checklist | Founder signature recorded |

**Evidence:** Signed checklist in `output/procurement/send_checklist.md`.

### 2.2 Phase 2 — Freeze canonical package and filenames (15 min)

**Owner:** Founder + build steward.

| Step | Task | Outcome |
|---|---|---|
| 2.1 | Confirm canonical artifact: `business_plan_grass_condensed_v1.1.pdf` | Filename frozen |
| 2.2 | Confirm cover letter filename: `cover_letter_v1.1_family.html` | Filename frozen |
| 2.3 | Confirm summary card filename: `business_plan_grass_summary_card_v1.1.pdf` | Filename frozen |
| 2.4 | Confirm long plan filename: `business_plan_grass_mission1_v1.1.pdf` (reference only) | Filename frozen |
| 2.5 | List all artifacts in `output/procurement/` | Manifest recorded |

**Evidence:** Package manifest in `output/procurement/manifest_v1.1.md`.

### 2.3 Phase 3 — Create facts model + provenance (45 min)

**Owner:** Build steward.

| Step | Task | Outcome |
|---|---|---|
| 3.1 | Author `content/facts.yaml` with ≥ 15 facts (per A-7) | Facts YAML created |
| 3.2 | Generate `output/reports/facts.lock.yaml` | Lock file created |
| 3.3 | Implement drift-check in `scripts/preflight.py --check-facts` | Drift check functional |
| 3.4 | Test drift check (mutate one fact, re-run, expect failure) | Drift check validated |

**Evidence:** `python scripts/preflight.py --check-facts` exit 0.

### 2.4 Phase 4 — Correct long plan facts (60 min)

**Owner:** Plan editor.

| Step | Task | Outcome |
|---|---|---|
| 4.1 | Update `scripts/build_business_plan.py` to emit `$14.00/hr` (current) and `$15.00/hr` (Sept 30 onward) | A-1 wage correction |
| 4.2 | Update same script to emit `7.0%` sales tax (FL 6% + Pinellas 1%) | A-1 tax correction |
| 4.3 | Update same script to emit `10–15%` industry net margin | A-1 margin correction |
| 4.4 | Add inline source citations for each correction | Sources cited |
| 4.5 | Render and inspect output | Long plan v1.1 on disk |

**Evidence:** A-AC1.

### 2.5 Phase 5 — Add $62,100 ARR headline (30 min)

**Owner:** Plan editor.

| Step | Task | Outcome |
|---|---|---|
| 5.1 | Update condensed script to insert `$62,100 Y1 gross revenue ($30,192–$106,560)` in at-a-glance | A-2 headline added |
| 5.2 | Add explanatory sentence: "Gross is the top line — what customers pay. Net is what's left after paying for equipment, insurance, software, marketing, fuel, supplies, and taxes." | Clarity sentence added |
| 5.3 | Update long plan at-a-glance section similarly | Long plan headline added |
| 5.4 | Update summary card with both gross + net labels | Summary card updated |

**Evidence:** A-AC2, A-AC3.

### 2.6 Phase 6 — Adopt four evaluator recommendations (90 min)

**Owner:** Plan editor.

| Step | Task | Outcome |
|---|---|---|
| 6.1 | Add first-hire transition model to long plan §10 | A-3 first-hire model |
| 6.2 | Add post-credit CAC forecast to long plan §7 | A-3 CAC forecast |
| 6.3 | Add named AI provider footnote to long plan §9 | A-3 AI provider |
| 6.4 | Add three risks to long plan: R-AI-001, R-GBP-001, R-DRIFT-001 | A-3 risks |
| 6.5 | Add footer text: "AI model provider may change; doctrine documented in `architecture/04-systems-architecture.md`." | A-3 disclosure |

**Evidence:** A-AC4.

### 2.7 Phase 7 — Build family package text, FAQ, risk disclosure (60 min)

**Owner:** Founder + plan editor.

| Step | Task | Outcome |
|---|---|---|
| 7.1 | Write plain-language email body (300–500 words) | Email body drafted |
| 7.2 | Update cover letter (per `scripts/build_business_plan_cover_letter.py`) | Cover letter v1.1 drafted |
| 7.3 | Write summary card text per `05-prp-d-family-investor-package.md` §8 | Summary card text drafted |
| 7.4 | Write plain-language FAQ (per `support/09-family-talking-points.md` §6) | FAQ drafted |
| 7.5 | Write conference-call talking points (per `support/09-family-talking-points.md` §1–4) | Talking points drafted |

**Evidence:** All 5 artifacts present in `output/procurement/` + `docs/business-plan/support/`.

### 2.8 Phase 8 — Resolve cap table / use-of-funds / return terms (30–60 min)

**Owner:** Founder.

| Step | Task | Outcome |
|---|---|---|
| 8.1 | Confirm $15K investment amount (Q8) | Amount confirmed |
| 8.2 | Confirm SAFE vs. RSA vs. loan (Q9) | Instrument confirmed |
| 8.3 | Confirm pre-money valuation (Q10) | Valuation confirmed |
| 8.4 | Confirm ownership % (Q11) | Ownership confirmed |
| 8.5 | Confirm distribution policy (Q12) | Distribution confirmed |
| 8.6 | Confirm Q13–Q16 | All confirmed |
| 8.7 | Verify no `[FOUNDER_CONFIRM]` placeholders remain | All resolved |

**Evidence:** Signed `18-founder-decisions.md` §5.

### 2.9 Phase 9 — Implement or specify unified build + preflight (60–90 min)

**Owner:** Build steward.

| Step | Task | Outcome |
|---|---|---|
| 9.1 | Build `scripts/build_business_plans.py` (A-8) | Unified entry point |
| 9.2 | Build `scripts/preflight.py` (A-6) | Preflight gate |
| 9.3 | Wire `scripts/send_business_plan.py` extensions (A-5) | Send wrapper extended |
| 9.4 | Run dry-run build of all variants | All variants build |

**Evidence:** `python scripts/build_business_plans.py --variant both` exit 0.

### 2.10 Phase 10 — Version stamp + diff artifact (20 min)

**Owner:** Build steward.

| Step | Task | Outcome |
|---|---|---|
| 10.1 | Add version footer to all variants (A-9) | Footer stamped |
| 10.2 | Generate diff artifact `output/reports/diff_v1.0_to_v1.1.md` (B-6) | Diff created |
| 10.3 | Update CHANGELOG.md with v1.1 entry | Changelog current |

**Evidence:** A-AC11, B-AC6.

### 2.11 Phase 11 — Create summary card MVI (30–45 min)

**Owner:** Plan editor + build steward.

| Step | Task | Outcome |
|---|---|---|
| 11.1 | Author summary card template per `05-prp-d-family-investor-package.md` §8 | Template ready |
| 11.2 | Render to HTML and PDF | Files created |
| 11.3 | Verify disclaimer footer | Footer present |

**Evidence:** `output/procurement/business_plan_grass_summary_card_v1.1.pdf` exists.

### 2.12 Phase 12 — Add snapshot SUMMARY.md (45 min)

**Owner:** Build steward.

| Step | Task | Outcome |
|---|---|---|
| 12.1 | Create `output/snapshots/2026-07-27T20-50_post_business_plan_build/SUMMARY.md` | Summary written |
| 12.2 | Create `output/snapshots/2026-07-27T23-06-31_post_business_plan_with_evaluation/SUMMARY.md` | Summary written |
| 12.3 | Create `output/snapshots/2026-07-28T00-41-26_post_condensed_business_plan/SUMMARY.md` | Summary written |
| 12.4 | Create `output/snapshots/2026-07-29T_post_v1.1_family_package/SUMMARY.md` | New snapshot created |

**Evidence:** A-AC13.

### 2.13 Phase 13 — Create condensed MD source (30 min)

**Owner:** Plan editor.

| Step | Task | Outcome |
|---|---|---|
| 13.1 | Generate `output/reports/business_plan_condensed.md` from build script | MD source created |
| 13.2 | Diff against PDF text dump | MD matches PDF |
| 13.3 | Verify < 30 KB | Size verified |

**Evidence:** A-AC5.

### 2.14 Phase 14 — Final preflight + attachment review (20 min)

**Owner:** Founder + reviewer.

| Step | Task | Outcome |
|---|---|---|
| 14.1 | Run `scripts/preflight.py` on all artifacts | Exit 0 |
| 14.2 | Manually open each PDF on phone, laptop, tablet | Visual verification |
| 14.3 | Read email body in plain-text mode | Tone check |
| 14.4 | Read cover letter in plain-text mode | Tone check |
| 14.5 | Verify summary card reads at 12pt+ on phone | Readability check |
| 14.6 | Sign final preflight checklist | Founder signature |

**Evidence:** Signed `output/procurement/send_checklist.md`.

### 2.15 Phase 15 — Send canonical family package (10 min)

**Owner:** Founder.

| Step | Task | Outcome |
|---|---|---|
| 15.1 | `python scripts/send_business_plan.py --family --dry-run --to <recipient> --confirm-recipient` | Dry-run output verified |
| 15.2 | `python scripts/send_business_plan.py --family --send --to <recipient> --confirm-recipient` | Email sent |
| 15.3 | Verify entry in `~/.owl/sent_emails.jsonl` | Send log updated |
| 15.4 | Verify attachment hashes | Hashes match |
| 15.5 | Confirm send log with recipient (text or call) | Send confirmed |

**Evidence:** Send log entry + recipient confirmation.

### 2.16 Critical path tonight

```
Phase 1 (decisions)
  → Phase 8 (cap table terms)
  → Phase 3 (facts YAML)
  → Phase 4 (long plan corrections)
  → Phase 5 (ARR headline)
  → Phase 6 (evaluator recs)
  → Phase 9 (build scripts)
  → Phase 10 (version stamp + diff)
  → Phase 11 (summary card)
  → Phase 12 (snapshots)
  → Phase 13 (condensed MD)
  → Phase 14 (final preflight)
  → Phase 15 (send)
```

**Phases 2, 7 are parallel paths.**

---

## 3. Tomorrow morning (2026-07-29 06:00–12:00 EDT)

| Time | Action | Owner |
|---|---|---|
| 06:00 | Founder reviews package; reconfirms recipient address | Founder |
| 06:30 | Run final `scripts/preflight.py` | Founder |
| 07:00 | Re-check email body, cover letter, summary card | Founder |
| 07:30 | Print summary card (keep one, send one) | Founder |
| 08:00 | Send via `scripts/send_business_plan.py --family --send` | Founder |
| 08:30 | Verify send log entry | Founder |
| 09:00 | Check inbox / send log; verify attachments | Founder |
| 12:00 | Family member likely to have opened the email | — |

**Founder does NOT follow up by phone before the call.**

---

## 4. Conference call (2026-07-29 evening, 15 minutes)

| Minutes | Topic | Notes |
|---|---|---|
| 0–2 | Welcome, thanks for time | Founder |
| 2–5 | What Largo Lawn does + why | Founder |
| 5–8 | Use of funds + return expectations | Founder |
| 8–11 | Risk + downside | Founder |
| 11–13 | Q&A | Family investor |
| 13–14 | Next steps | Both |
| 14–15 | Close | Both |

**Detailed agenda:** `support/09-family-talking-points.md` §1.
**Detailed Q&A prep:** `support/09-family-talking-points.md` §6.
**Detailed defer list:** `support/09-family-talking-points.md` §7.

---

## 5. Post-call (within 24 hours, 2026-07-30)

| Step | Task | Owner | Evidence |
|---|---|---|---|
| 5.1 | Capture every question + answer in `support/10-conference-call-prep.md` post-call section | Founder | Filled notes |
| 5.2 | Send plain-language follow-up email | Founder | Email log |
| 5.3 | Confirm decision: proceeding, deferring, declining, or revisions | Founder | Decision recorded |
| 5.4 | If proceeding: schedule next step (signing, wire transfer, LLC formation) | Founder | Calendar invite |
| 5.5 | If revisions: capture as new decision; do NOT silently edit canonical plan | Founder + GRASS | New ADR |
| 5.6 | Update `18-founder-decisions.md` with final confirmed values | Founder | Updated doc |
| 5.7 | If new canonical needed: trigger v1.2 cycle | Founder | New plan version |

---

## 6. Phase freeze

Until the send completes (Phase 15), all framework documents are FROZEN. No edits without founder approval. This prevents accidental scope drift during the critical path.

After send, normal change management resumes.

---

## 7. What this roadmap does NOT cover (next-cycle)

- Day-1 cap table as a formal legal agreement (separate legal doc)
- 5-year financial model (next cycle)
- External-investor-grade compliance (next cycle)
- Source-reconciliation for 6.75% operational artifacts (D-0062, next cycle)
- Full content model / manifest architecture (PRP-C, next cycle)
- Long-term post-funding operations (covered in `governance/decisions/0011-cash-min-activation.md`)

---

## 8. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |