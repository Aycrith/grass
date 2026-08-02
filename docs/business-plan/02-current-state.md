# 02 — Current State Assessment

**Document ID:** DOCS-BP-02-CURRENT-STATE
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** After every send round; pre-send verification

---

## 1. Purpose

This document captures the state of every artifact, fact, file, and decision relevant to the family seed investment package as of 2026-07-28. It is the single source of truth for "where things stand." Anyone preparing the package consults this document first; anyone reviewing the package consults this document to validate the build.

If a fact on the package disagrees with a fact in this document, **the package wins** (because the package has been pre-flighted and is canonical); but the discrepancy must be filed in the drift log and resolved in the next cycle.

---

## 2. Canonical artifact

### 2.1 Primary canonical artifact

**`output/procurement/business_plan_grass_condensed.pdf`** — the **condensed PDF** sent at 2026-07-28 00:41:09 EDT to `choblo@gmail.com` (founder's staging address; Round 3 of the package). This is the most recent canonical version of the reader-facing document.

| Property | Value |
|---|---|
| **Filename (current)** | `business_plan_grass_condensed.pdf` |
| **Filename (target)** | `business_plan_grass_condensed_v1.1.pdf` (after this cycle) |
| **Format** | PDF (A4 portrait) |
| **Sent timestamp** | 2026-07-28 00:41:09 EDT |
| **Recipient** | `choblo@gmail.com` (founder's staging address — NOT the family investor yet) |
| **Status** | Sent — confirmed in `~/.owl/sent_emails.jsonl` |
| **Variants sent** | condensed only |
| **Correction status** | Round 3 corrected 3 facts: FL min wage, Pinellas sales tax, industry net margin |

### 2.2 Secondary artifacts (reference only — NOT sent to family)

| Artifact | Role | Sent? |
|---|---|---|
| `output/procurement/business_plan_grass_mission1.pdf` | **Long plan v1.0** — 15 sections, 43 KB text, 74 KB evaluation variant. Reference for founder only. | NO (only on explicit request) |
| `output/procurement/business_plan_grass_mission1_with_evaluation.pdf` | Long plan + evaluator's addendum (35 KB). | NO |
| `output/procurement/business_plan_grass_condensed_cover.html` | Cover letter (existing). | YES (renamed `cover_letter_v1.1_family.html`) |

### 2.3 New artifacts this cycle

After the v1.1 cycle ships:

| Artifact | Filename | Purpose |
|---|---|---|
| Condensed v1.1 | `business_plan_grass_condensed_v1.1.pdf` | Reader-facing document, corrected facts, $62,100 ARR headline, summary card cross-ref |
| Family cover letter v1.1 | `cover_letter_v1.1_family.html` | Family-specific cover letter (plain-language tone, $15K ask) |
| Summary card v1.1 | `business_plan_grass_summary_card_v1.1.pdf` | One-page A4 landscape summary |
| Long plan v1.1 | `business_plan_grass_mission1_v1.1.pdf` | Reference-only corrected long plan (regenerate in place; do NOT resend) |
| Condensed v1.1 MD source | `output/reports/business_plan_condensed.md` | Reviewable Markdown source for the condensed PDF |
| Diff artifact | `output/reports/diff_v1.0_to_v1.1.md` | What changed between long plan v1.0 and v1.1 |

---

## 3. Send log

`~/.owl/sent_emails.jsonl` contains three entries:

| Timestamp (EDT) | Recipient | Variant | Result | Notes |
|---|---|---|---|---|
| 2026-07-27 22:06:49 | choblo@gmail.com | Round 1 long plan (15-section) | success=True | First send |
| 2026-07-27 23:31:01 | choblo@gmail.com | Round 2 plan + evaluator addendum | success=True | Second send |
| 2026-07-28 00:41:09 | choblo@gmail.com | Round 3 condensed plan (canonical) | success=True | Third send; carried the 3 fact corrections |

**Key observation:** All three prior sends were addressed to the founder's own address (`choblo@gmail.com`). The actual family-investor address has **not yet been used** in any send. The founder's address served as a staging channel while the canonical artifact was being shaped. The first send to the family-investor address will be the **T-0 send** of the v1.1 family package described in `01-audience-delivery-charter.md`.

---

## 4. Existing scripts

| Script | Size | Purpose | Modified this cycle? |
|---|---:|---|---|
| `scripts/build_business_plan.py` | 80 KB | Build long plan HTML → PDF | YES (A-1, A-2, A-3, A-9) |
| `scripts/build_condensed_business_plan.py` | 58 KB | Build condensed plan HTML → PDF | YES (A-2, A-9, B-1, B-2, B-3, B-4) |
| `scripts/build_business_plan_with_evaluation.py` | 74 KB | Build long plan + evaluator addendum | YES (A-9) |
| `scripts/build_business_plan_cover_letter.py` | 22 KB | Build cover letter | YES (PRP-D cover letter) |
| `scripts/build_business_plan_pdf.py` | 1.7 KB | Generic PDF wrapper | NO |
| `scripts/build_condensed_business_plan_pdf.py` | 1.5 KB | Condensed PDF wrapper | NO |
| `scripts/build_condensed_cover_letter.py` | 10 KB | Condensed cover letter | YES (PRP-D) |
| `scripts/send_business_plan.py` | 13 KB | Send wrapper (will be extended) | YES (A-5, A-10) |

**New scripts this cycle:**

| Script | Purpose |
|---|---|
| `scripts/preflight.py` | Standalone preflight gate (A-6) |
| `scripts/build_business_plans.py` | Unified build entry point (A-8) |

---

## 5. Snapshot inventory

| Snapshot | Contents | Send status | SUMMARY.md this cycle? |
|---|---|---|---|
| `output/snapshots/2026-07-27T20-50_post_business_plan_build/` | Round 1 long plan artifacts | Sent (founder-staging) | YES (created this cycle) |
| `output/snapshots/2026-07-27T23-06-31_post_business_plan_with_evaluation/` | Round 2 long + evaluator artifacts | Sent (founder-staging) | YES (created this cycle) |
| `output/snapshots/2026-07-28T00-41-26_post_condensed_business_plan/` | Round 3 condensed artifacts | Sent (founder-staging, **canonical**) | YES (created this cycle) |

**New snapshot this cycle:**

| Snapshot | Contents | Status |
|---|---|---|
| `output/snapshots/2026-07-29T_post_v1.1_family_package/` | Family package v1.1 artifacts + preflight log + send log entry | Pre-send (created by build script) |

---

## 6. Drift inventory (corrected-truth table)

The Round 3 condensed PDF carried three corrections. The long plan still has stale values in some sections. Operational artifacts (outside the plan) still have inconsistent values across files.

### 6.1 Plan-level corrections (THIS cycle — propagate to long plan)

| Fact | Stale value | Correct value | Source | Files affected (this cycle) |
|---|---|---|---|---|
| **FL minimum wage** | $13/hr | **$14.00/hr through 2026-09-29 → $15.00/hr from 2026-09-30** | FL Constitution Amendment 2 (ratified 2020); 2026 schedule FL DOR | long plan HTML/MD/PDF |
| **Pinellas County sales tax** | 6.75% (FL 6% + 0.75% Pinellas) | **7.0%** (FL 6% + 1.0% Pinellas) | FL DOR DR-15DSS 2026 (effective 2025-01-01) | long plan HTML/MD/PDF |
| **Industry net margin benchmark** | 7.9–13% | **10–15%** | NALP/IBISWorld/Aspire 2026; cross-referenced by `business_plan_improvement_analysis.md` | long plan HTML/MD/PDF |

### 6.2 Plan-level fact additions (THIS cycle)

| Fact | Value | Where added |
|---|---|---|
| **$62,100 Y1 ARR headline** | $62,100 (baseline; pessimistic $30,192; stretch $106,560) | at-a-glance section + summary card |
| **$15,000 seed ask** | $15,000 (research-backed recommended) | cover letter + summary card + use-of-funds |
| **First-hire transition model** | 74% founder-only gross margin → 45–55% after first hire | long plan §10 |
| **Post-credit CAC forecast** | $90–200/customer after 30–60 days | long plan §7 (CAC) |
| **Named AI provider** | Anthropic Claude (primary); fallback + manual operating window documented | long plan §9 + footnote |

### 6.3 Operational-artifact drift (NEXT cycle — D-0062 reconciliation)

| File | Stale value | Correct value | Risk | Action |
|---|---|---|---|---|
| `architecture/twin/invoice.md` | 6.75% tax | 7.0% | Customer-facing invoice math wrong | Flag with `[RECONCILE-Q3-2026]`; create D-0062 next cycle |
| `content/templates/invoice-template.md` | 6.75% tax | 7.0% | Same as above | Same |
| `research/regulatory/largo-licensing-map.yaml` | 6.75% (legacy section) | 7.0% | Regulator may see stale value | Same |
| `state/ledger.yaml` (line 93) | `strategy_locked.sales_tax_combined_rate_pct: 6.75` | 7.0 | Builds may use stale value | Same |
| `state/ledger.yaml` (line 112) | OBJ-M2-004 domain cost `$4.99` | Plan §13 says `$9.15` | Inconsistent across docs | Same |

**Out-of-scope for this cycle. Create governance decision D-0062 next cycle to resolve.** Flagging each file with `[RECONCILE-Q3-2026]` markers.

### 6.4 Domain cost drift

| File | Value | Source |
|---|---|---|
| `state/ledger.yaml` OBJ-M2-004 | $4.99 (LargoLawn.pro via Vercel) | Steward override 2026-07-10 |
| Long plan §13 | $9.15 one-time | D-0011 original |

**This cycle's resolution:** Use **$4.99** as canonical (matches current ledger and steward override). Update long plan §13 to reference $4.99 with steward override note.

---

## 7. Repository context (snapshot)

| Property | Value | Source |
|---|---|---|
| **Repo name** | GRASS | CLAUDE.md |
| **Mission 1** | Largo Lawn, FL 33771 | D-0003 |
| **Adjacent ZIPs served** | 33770, 33778, 33773, 33774, 33756 | D-0003 |
| **Operating model** | Solo founder / lean | D-0004 (ratified 2026-07-10) |
| **Entity (target)** | FL single-member LLC (disregarded entity, Schedule C) | D-0005 |
| **Brand (target)** | LargoLawn.pro | D-0007-B (steward override 2026-07-10) |
| **Tech stack** | Next.js 15 + Supabase + Stripe + Vercel + Jobber Core | D-0002 |
| **Infra ceiling** | $200/mo through M6 | CLAUDE.md |
| **First legal service line** | Landscaping WITHOUT fertilization/irrigation/pest control | CLAUDE.md |
| **Climate** | USDA zone 10a (year-round mowing) | CLAUDE.md |
| **Hurricane season** | June–November | CLAUDE.md |
| **GL insurance minimum** | $1M before any field work | CLAUDE.md |
| **TAM (6-ZIP, lawn-buying households)** | $3.5M–$5.5M annual | `research/market/largo-market-size.md` |
| **SAM (single-family weekly/biweekly)** | $2.5M–$4.0M annual | Same |
| **Y1 baseline revenue** | $30K–$90K | Same |
| **Per-customer LTV (mid-tier, weekly)** | $1,387/yr | Same |
| **Gross margin (founder-labor)** | 74% | Same |
| **Y1 baseline net profit** | $16,590 | `research/market/profitability-roadmap.md` |
| **Y1 baseline MRR (M12)** | $5,175 | Same |
| **Largo per-cut pricing** | $40–$50 (median $48) | `research/market/largo-pricing-reality.md` |

---

## 8. Personal-finance context (founder-side)

The only direct personal-finance signal in the project tree is the sale of the founder's residence.

| Property | Value | Source |
|---|---|---|
| **Property** | 225 Royal Palm Drive, Largo FL 33771 | `housestuff/README.md` |
| **Listing target** | 2026-10-15 | Same |
| **Closing target** | Feb–Apr 2027 | Same |
| **List price (model v1)** | $325,000 | Same |
| **Walk-away floor (default)** | $260,000 NET | Same |
| **Mortgage balance** | UNKNOWN (not yet disclosed) | Cameron-side variable |
| **Projected net proceeds (range)** | $45K–$295K depending on mortgage payoff | `housestuff/closing/net_proceeds_worksheet.md` |

**Implication for family package:** The house sale represents a near-term liquidity event for the founder. The package does **not** mention the house sale (that's Cameron-side personal finance). However, the founder's existing liquidity position informs the recommended investment structure — the founder is **not** in distress and **does not** need the investment for survival; the investment is for working capital to scale the business. This is a material distinction that shapes the cap-table narrative.

---

## 9. Cap-table state — BEFORE this cycle

The project has **zero documented cap-table artifacts**. There is no `cap-table.yaml`, no SAFE template, no equity-issuance record, no shareholder agreement. The full state of the equity structure today:

| Holder | Ownership | Source |
|---|---:|---|
| Cameron Pike (founder) | **100%** | By construction (D-0004 + D-0005) |
| **Total** | **100%** | — |

This is the state the project enters the v1.1 cycle with. The family investor's stake will be created **at the moment of LLC formation** (per D-0011 cash-min activation: Sunbiz + bank + DR-1 fires at first paid-pilot revenue OR 30 days post-launch).

---

## 10. Cap-table state — TARGET this cycle

After this cycle ships and the family investor agrees:

| Holder | Ownership | Source | Decision |
|---|---:|---|---|
| Cameron Pike (founder) | **~90.91%** | D-0004 (Solo Founder) | Pre-decided |
| Family investor | **~9.09%** | Q11 default | Q11 recommended answer |
| **Total** | **100%** | — | — |

**The 9.09% stake is achieved by $15,000 investment at $150,000 pre-money valuation**, OR by a SAFE with $400,000 valuation cap and 20% discount (which would yield a smaller effective stake but a fixed cap).

**The decision is held until the founder confirms Q10/Q11 in `18-founder-decisions.md` and the family investor confirms her choice on the call.**

---

## 11. Stale-data observations (in-repo contradictions)

These are surfaced from Agent 3's parent-directory survey:

1. **Pinellas sales tax**: ledger line 93 says 6.75%; CLAUDE.md line 184 says 7.0%; price-book.yaml says 6.75%; plan §10 corrected to 7.0% in Round 3. **Three versions in active files.**
2. **FL minimum wage**: long plan §14 shows $13/hr; Round 3 corrected to $14/hr (now) → $15/hr (Sept 30).
3. **Net margin industry benchmark**: long plan shows 7.9–13%; Round 3 corrected to 10–15%.
4. **Domain cost**: ledger OBJ-M2-004 says $4.99/yr; long plan §13 says $9.15 one-time.
5. **CLAUDE.md phase**: says "Phase 0, Day 3 of 5"; ledger says "Phase 2, Day 7 of 30." **CLAUDE.md is stale** (last edit 2026-07-23).
6. **D-0005, D-0006, D-0007B pending stewardship**: per `knowledge/decision-log/index.md` — Sunbiz-formation-submission (due 2026-07-25), Insurance-bind (due 2026-07-30), Brand-name-pick (due 2026-07-20) all marked pending; brand-name was steward-overridden 2026-07-10 to LargoLawn.pro.

**None of these blocks the family-package send tonight** — they are next-cycle hygiene items. They are flagged here so they are visible.

---

## 12. Constitutional compliance

| Hard rule | Status | Notes |
|---|---|---|
| **Research before assumptions** | ✓ | Every plan claim cites a research artifact or a Decision Template |
| **Evidence before opinions** | ✓ | All Q8–Q16 defaults cite 2025–2026 market sources |
| **Specification before implementation** | ✓ | This framework is the spec; build scripts follow |
| **Documentation before memory** | ✓ | This document + 00-cover + 18-founder-decisions all come before any code lands |
| **Validation before deployment** | ✓ | `scripts/preflight.py` is the validation gate before any send |
| **Automation before repetition** | ✓ | Unified `scripts/build_business_plans.py` replaces 3 separate scripts |
| **Maintainability over velocity** | ✓ | facts.yaml + lock prevents future drift |
| **Decisions documented** | ✓ | D-0001 through D-0011 ratified; Q1–Q16 to be confirmed by founder this cycle; D-0062 deferred next cycle |
| **Capabilities registered** | ✓ | 5 capabilities seeded on Day 3 per `state/capability-registry.yaml` |
| **No irreversible decision without Decision Template** | ✓ | Family-investment structure uses 16-question template; founder confirms before send |

---

## 13. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |