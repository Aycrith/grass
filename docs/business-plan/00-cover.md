# 00 — Cover Specification

**Document ID:** DOCS-BP-00-COVER
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** After each send round; refresh before any external send

---

## 1. Purpose

This document is the cover specification for the GRASS Investor Business Plan spec-driven development framework. It establishes the framework's purpose, audience, terminology, canonical-artifact policy, and delivery boundary. It is the entry point for any reader — human or agent — who needs to understand what the framework does, what it produces, and how to use it.

The framework exists to support one specific delivery: a **$15,000 seed investment package** (research-backed recommended ask per SCORE/Housecall Pro 2026 / IBISWorld NAICS 561730 data) for the founder's older female family member, delivered tomorrow morning via email and followed by a conference call. Every document in the framework ultimately serves that delivery.

---

## 2. Audience

### 2.1 Primary recipient — the family investor

The family investor is the founder's older female family member. She is:

- **Non-technical.** No fluency in AI, software architecture, spreadsheets, or financial modeling.
- **Prudent.** Asks about repayment, downside, and what happens if things go wrong.
- **Relationship-conscious.** Weighs family dynamics alongside financial return; will stress-test whether the founder has considered the impact on relationships.
- **Decision-driven by conversation.** The document supports the call; the call makes the decision.
- **Documentation-oriented.** Will keep the summary card and refer back to the cover letter.

### 2.2 Secondary readers

- **Founder** — receives the package as the operator of Largo Lawn, prepares for the call, executes the business once funded.
- **GRASS autonomous AI organization** — the framework is itself a reusable template for future mission seed rounds.
- **Future external investors** (deferred) — if the org graduates to external capital, the framework expands to include cap table, 5-year model, exit narrative.

### 2.3 What the family investor does NOT need to see

- The 13-agent autonomous AI architecture.
- Mission 2 candidates (pool, pressure wash, pet waste).
- Internal governance terminology (D-0001 through D-0060).
- Technical stack details (Next.js, Supabase, Stripe, Bun).
- The long-range compounding-organization thesis.
- Internal PRP-level engineering work.

---

## 3. Canonical artifact policy

The canonical artifacts for the family investor are:

| Layer | Document | Role |
|---|---|---|
| **Primary** | `output/procurement/business_plan_grass_condensed_v1.1.pdf` | Reader-facing investable document |
| **Secondary** | `output/procurement/business_plan_grass_mission1_v1.1.pdf` | Reference (only sent if founder explicitly approves) |
| **Support** | `output/procurement/cover_letter_v1.1_family.html` | Family-specific cover letter |
| **Handout** | `output/procurement/business_plan_grass_summary_card_v1.1.pdf` | One-page A4 landscape summary card |
| **Working** | `docs/business-plan/05-prp-d-family-investor-package.md` | Cap table, use-of-funds, FAQ, talking points |

The condensed PDF is the document the family investor reads. The long PDF is the document the founder references. The summary card is the document the family investor keeps. The cover letter is the document that frames the package. The working document is the founder's prep.

**Rule:** No placeholder values (`[FOUNDER_CONFIRM]`) may appear in the family-facing artifacts. The preflight script blocks send if any placeholder is visible.

---

## 4. Document map

| # | Document | Purpose |
|---|---|---|
| 00 | Cover (this) | Mission, audience, canonical policy, glossary |
| 01 | Audience & Delivery Charter | Persona, founder responsibilities, tone, package contents |
| 02 | Current State | Canonical artifact, drift inventory, corrected-truth table |
| 03 | PRP-A Plan Integrity | 11 tasks, full Decision Template, A-AC1–13 |
| 04 | PRP-B Visual Evidence | 7 tasks, full Decision Template, B-AC1–6 |
| 05 | PRP-D Family Investor Package | Cap table, use of funds, return expectations, FAQ, talking points, summary card |
| 16 | Verification Matrix | Every task ↔ acceptance criterion ↔ evidence ↔ constitutional rule |
| 17 | Risk Register | 24 risks with likelihood, impact, mitigation |
| 18 | Founder Decisions | Q1–Q16 with recommended answers, rationale, downstream effect |
| 19 | Roadmap | Tonight, tomorrow morning, post-call |
| 20 | Appendices | Glossary, governance references, bibliography, artifact inventory |

### Support specifications (under `support/`)

| # | Document | Purpose |
|---|---|---|
| 01 | Content Model & Facts | `content/facts.yaml` schema, drift-check algorithm |
| 02 | Build Pipeline | `scripts/build_business_plans.py` architecture |
| 03 | Preflight & Gmail QA | HTML/PDF/accessibility gates |
| 04 | Send Wrapper & Resend | `--condensed`, `--family`, `--resend` flags |
| 05 | Version Stamping | VERSION, footer block, CHANGELOG |
| 06 | Diff Artifact | `output/reports/diff_<from>_to_<to>.md` |
| 07 | Snapshot Discipline | SUMMARY.md format, archival rules |
| 08 | Visual Evidence | Image specs, accessibility, mockup labeling |
| 09 | Family Talking Points | Call agenda, expected questions, defer list |
| 10 | Conference Call Prep | Pre/on/post-call checklists |

---

## 5. Glossary (for non-technical readers)

| Term | Plain-language definition |
|---|---|
| **Largo Lawn** | The Mission 1 lawn care business operating in Largo, FL 33771. |
| **Seed investment** | Money given to start or grow a small business. The investor becomes a partial owner. |
| **Equity** | Ownership. If you buy 15% equity, you own 15% of the business. |
| **Cap table** | A table that shows who owns what % of the business. |
| **LLC** | Limited Liability Company. A legal structure that separates personal money from business money. |
| **ARR** | Annual Recurring Revenue. How much money the business expects to bring in over a year, if it continues at current pace. |
| **Gross revenue** | Total money customers pay before subtracting costs. |
| **Net profit** | Money left over after paying all the bills. |
| **Gross margin** | Gross revenue minus the cost of providing the service (e.g., fuel, supplies), expressed as a %. |
| **CAC** | Customer Acquisition Cost. How much it costs to get one new customer. |
| **LTV** | Lifetime Value. How much money one customer pays over the time they stay a customer. |
| **Mission 1** | The first production business the GRASS organization is launching. (Largo Lawn.) |
| **Mission 2** | The next business, not yet launched. Pool, pressure wash, pet waste are candidates. |
| **GRASS** | The autonomous AI organization that runs the business. Internal name only. |
| **Forecast** | A prediction based on current information. Not a guarantee. |
| **Founding team** | The founder (Cameron Pike) plus the AI agents that run the business. |
| **Pre-money valuation** | What the business is worth before the new investment. |
| **Post-money valuation** | What the business is worth after the new investment. Pre-money + new money = post-money. |
| **Distribution** | Sharing profits with owners. |
| **Reserve** | Money kept aside for unexpected costs or slow months. |
| **K-1** | A tax form that shows an investor's share of business income. |
| **Working capital** | Money available for day-to-day operations. |
| **GL insurance** | General Liability insurance. Covers damage or injury to customers or the public. |
| **BTR** | Business Tax Receipt. A local business license. |
| **GBP** | Google Business Profile. The listing that shows up when customers search "lawn care near me." |
| **Distributable cash** | Net profit minus the operating reserve. The amount available to share with owners. |

---

## 6. Operating principles

The framework operates under these principles, in order of priority:

1. **Correctness first.** Every dollar on the page must be defensible. Every claim must be sourced.
2. **Family-package second.** The package is the deliverable; everything else is internal work.
3. **Polish third.** Visual evidence is supportive, not central.
4. **Architecture deferred.** Full PRP-C content model is next cycle; facts.yaml is enough for tonight.

These are explicit constitutional rules (per `constitution/01-constitution.md` Hard Rules 1, 3, 5, 6, 7):

- Research before assumptions.
- Evidence before opinions.
- Specification before implementation.
- Documentation before memory.
- Validation before deployment.
- Automation before repetition.
- Maintainability over velocity.

---

## 7. Delivery boundary

The framework produces:

- ✓ Corrected long plan v1.1 (HTML, PDF, MD)
- ✓ Updated condensed plan v1.1 (HTML, PDF, MD)
- ✓ Family cover letter v1.1 (HTML)
- ✓ Summary card v1.1 (HTML, PDF)
- ✓ Snapshot summaries for all 3 existing snapshots
- ✓ Diff artifact v1.0 → v1.1
- ✓ Preflight script
- ✓ Unified build script
- ✓ Version stamp + CHANGELOG
- ✓ Content/facts.yaml + drift-check
- ✓ All 20 framework documents
- ✓ Send log entry in `~/.owl/sent_emails.jsonl`

The framework does NOT produce (next cycle):

- Day-1 cap table as a formal equity agreement (that's a legal document, drafted separately)
- 5-year financial model (next cycle)
- External-investor-grade compliance (next cycle)
- Source-reconciliation for the 6.75% operational artifacts (D-0062, next cycle)
- Full content model / manifest architecture (PRP-C, next cycle)

---

## 8. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |
