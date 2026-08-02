# 17 — Risk Register (24 Risks)

**Document ID:** DOCS-BP-17-RISK-REGISTER
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** Quarterly; immediately after any risk event

---

## 1. Purpose

This document captures **24 risks** specific to the family seed investment package and its delivery. The register splits into **8 baseline plan-integrity risks** (carried from the v1.0 baseline) and **16 family-investor-specific risks** (added in v2.0).

Each risk has: ID, title, likelihood (1–5), impact (1–5), score (likelihood × impact), mitigation, owner, review date.

**Score legend:**
- 1–4 = Low (green)
- 5–9 = Medium (yellow)
- 10–15 = High (orange)
- 16–25 = Critical (red)

---

## 2. Baseline plan-integrity risks (8)

| ID | Risk | L | I | Score | Mitigation | Owner | Review |
|---|---|:-:|:-:|:-:|---|---|---|
| RISK-1 | Founder does not answer questions before deadline | 3 | 5 | 15 | Recommended defaults documented in `18-founder-decisions.md`; unresolved investment terms block send via preflight | Founder | 2026-07-29 T-0 |
| RISK-2 | Corrections appear in more locations than expected | 3 | 5 | 15 | Search plan sources + generated outputs; facts extraction gate in preflight | Build steward | 2026-09-15 |
| RISK-3 | Long build changes break evaluation variant | 2 | 5 | 10 | Build + verify all variants in unified build script | Build steward | 2026-09-15 |
| RISK-4 | PDF rendering fails | 2 | 3 | 6 | Render immediately after HTML; retain prior artifact | Build steward | 2026-09-01 |
| RISK-5 | Scope changes arrive during implementation | 3 | 5 | 15 | Freeze scope; create follow-up backlog | Founder | Continuous |
| RISK-6 | Gmail preflight fails | 2 | 3 | 6 | Run preflight after every build; allow-list for legitimate exceptions | Build steward | 2026-09-01 |
| RISK-7 | Investor opens wrong version | 3 | 5 | 15 | Versioned filenames, explicit package manifest, archive old files | Founder | Pre-send |
| RISK-8 | Tomorrow deadline missed | 3 | 5 | 15 | Prioritize correctness + family package over polish | Founder | 2026-07-29 T-0 |

**Subtotal baseline score: 97.**

---

## 3. Family-investor-specific risks (16)

| ID | Risk | L | I | Score | Mitigation | Owner | Review |
|---|---|:-:|:-:|:-:|---|---|---|
| **RISK-9** | **Stale 6.75% in operational artifacts conflicts with 7.0% fact** | 4 | 4 | 16 | Source-reconciliation exception; `[RECONCILE-Q3-2026]` markers in 4 files; D-0062 follow-up decision | Build steward | 2026-09-30 |
| **RISK-10** | **Family pressure affects investment decision** | 3 | 5 | 15 | State that investor may decline without relationship consequence; explicit "this is a business decision, not a family obligation" framing in cover letter | Founder | Pre-call |
| **RISK-11** | **Founder and investor misunderstand deal terms** | 3 | 5 | 15 | Separate plan from signed investment agreement; read terms aloud on call; written confirmation post-call | Founder | Post-call |
| **RISK-12** | **Return expectations unrealistic** | 3 | 5 | 15 | Scenarios, no guarantees, explicit downside disclosure in cover letter and summary card | Founder | Pre-send |
| **RISK-13** | **Inaccurate document creates liability/trust damage** | 3 | 5 | 15 | Source citations, founder sign-off, version lock, disclaimer, final fact review | Founder + reviewer | Pre-send |
| **RISK-14** | **Cap table sent with placeholders or wrong percentages** | 2 | 5 | 10 | Hard preflight failure on unresolved `[FOUNDER_CONFIRM]` placeholders | Build steward | Pre-send |
| **RISK-15** | **Illustrative mockups mistaken for live records** | 3 | 3 | 9 | Prominent "Illustrative example — not a live customer record." labels | Plan editor | Pre-send |
| **RISK-16** | **AI narrative distracts from actual business** | 4 | 3 | 12 | Remove from family materials; keep short long-plan footnote only | Plan editor | Pre-send |
| **RISK-17** | **AI provider concentration or outage** | 3 | 3 | 9 | Named provider (Anthropic Claude); fallback procedure; manual operating window documented | Build steward | 2026-10-01 |
| **RISK-18** | **Google Business Profile suspension** | 2 | 4 | 8 | Maintain direct contact methods + alternative acquisition channels (Nextdoor, door hangers) | Founder | Continuous |
| **RISK-19** | **Agent behavior or content drift** | 3 | 4 | 12 | Facts lock, source hashes, preflight, human approval gate | Build steward | Quarterly |
| **RISK-20** | **Family relationship suffers after poor results** | 3 | 5 | 15 | Written expectations, regular updates, no pressure, separate family from business conversations | Founder | Continuous |
| **RISK-21** | **Investor interprets forecast as promise** | 3 | 4 | 12 | Label all forecasts; explain assumptions during call; explicit "forecast, not a guarantee" footer | Founder | Pre-send |
| **RISK-22** | **Wrong recipient or accidental resend** | 1 | 5 | 5 | Explicit `--confirm-recipient` flag in send script; dry-run attachment listing | Founder | Pre-send |
| **RISK-23** | **Founder becomes unavailable after receiving seed funds** | 2 | 4 | 8 | Document access, banking, customer records, continuity plan in `01-audience-delivery-charter.md` §7 | Founder | Post-funding |
| **RISK-24** | **Summary card omits material downside** | 3 | 4 | 12 | Required risk disclosure + return caveat on card; preflight verifies | Plan editor | Pre-send |

**Subtotal family-investor score: 200.**

---

## 4. Risk heat map (visual)

| Score band | Count | Risk IDs |
|---|---:|---|
| **Critical (16–25)** | 1 | RISK-9 |
| **High (10–15)** | 13 | RISK-1, RISK-2, RISK-3, RISK-5, RISK-7, RISK-8, RISK-10, RISK-11, RISK-12, RISK-13, RISK-14, RISK-16, RISK-19, RISK-20, RISK-21, RISK-24 |
| **Medium (5–9)** | 9 | RISK-4, RISK-6, RISK-15, RISK-17, RISK-18, RISK-22, RISK-23 |
| **Low (1–4)** | 0 | — |

**Total risk score: 297.**

**Highest single risk:** RISK-9 (Stale 6.75% in operational artifacts) — Critical. Mitigation: D-0062 governance decision next cycle.

---

## 5. Top 5 risks to actively manage (before send)

| Rank | Risk | Why it's top-5 | Active mitigation |
|---|---|---|---|
| 1 | RISK-9 | Operational tax-rate drift creates audit risk if a customer sees different rates on different documents | D-0062 next cycle; explicit `[RECONCILE-Q3-2026]` markers in 4 files |
| 2 | RISK-11 | Misunderstood deal terms are the single biggest source of family-investment disputes | Read terms aloud on call; written confirmation post-call |
| 3 | RISK-13 | Inaccurate documents create liability for the founder | Founder sign-off + version lock + final fact review before send |
| 4 | RISK-20 | Family relationships can be damaged irreversibly by poor business outcomes | Monthly updates + no pressure + explicit "you can decline" framing |
| 5 | RISK-12 | Unrealistic return expectations lead to disappointment | Three scenarios (pessimistic/baseline/stretch) + explicit no-guarantee language |

---

## 6. Constitutional hard-rule risks (5)

These are risks that, if realized, would violate constitutional hard rules:

| ID | Risk | Constitutional rule violated | Mitigation |
|---|---|---|---|
| CR-1 | Plan sent with unresolved placeholders | Hard rule 8 (decisions documented) | Preflight blocks send |
| CR-2 | Family-investor decision made without Decision Template | Hard rule 10 (no irreversible without Decision Template) | PRP-D §3 cap table uses Decision Template format |
| CR-3 | Investment amount changed without rationale | Hard rule 8 (decisions documented) | `18-founder-decisions.md` captures every change |
| CR-4 | Distribution policy changed without founder sign-off | Hard rule 8 | Sign-off checklist in `18-founder-decisions.md` §5 |
| CR-5 | Scope changed without updating framework | Hard rule 7 (maintainability over velocity) | Backlog discipline + scope freeze |

---

## 7. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework (24 risks) | Founder + GRASS executive agent |