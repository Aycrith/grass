# S-05 — Version Stamping & Changelog

**Document ID:** DOCS-BP-S-05-VERSIONING
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent + build steward

---

## 1. Purpose

This document specifies how every artifact carries a version stamp and how the changelog is maintained.

---

## 2. Version file (`VERSION`)

Repository root contains a single `VERSION` file:

```
1.1
```

Single line, semver-ish (major.minor). Read by build scripts at build time.

### 2.1 Versioning policy

| Change type | Bump |
|---|---|
| **Major** (1.x → 2.x) | Restructure; new family package; new audience |
| **Minor** (1.0 → 1.1) | Factual corrections; new artifacts (e.g., summary card); new variants |
| **Patch** (deferred) | Cosmetic; typo; whitespace |

This framework is v2.0 of the framework. The artifacts it produces are v1.1.

---

## 3. Footer format

Every artifact (long, condensed, evaluation, family cover letter, summary card) carries the same footer:

```
Largo Lawn · Mission 1
Version 1.1 · <variant-name>
Built 2026-07-28 · Source SHA: <short-sha>
Forecast document; not a guarantee of results.
```

- **Position:** Bottom of every page.
- **Size:** 8pt body.
- **Color:** Monochrome (black or brand gray).
- **Variant names:** `Long reference plan`, `Condensed family-investor package`, `Long + evaluator addendum`, `Family cover letter`, `Summary card`.

---

## 4. Short SHA

`<short-sha>` is the first 7 characters of the Git commit SHA at build time. Computed via:

```bash
git rev-parse --short HEAD
```

If not in a Git repository (e.g., CI artifact), use the build timestamp as fallback:

```
Built 2026-07-28T08:00:00-04:00 · Build ID: <uuid>
```

---

## 5. Changelog (`CHANGELOG.md`)

Repository root contains `CHANGELOG.md`:

```markdown
# Changelog

All notable changes to the family seed investment package.

## [1.1] - 2026-07-28

### Added
- $62,100 Y1 gross revenue headline ($30,192–$106,560 range)
- Summary card (A4 landscape, one-pager)
- First-hire transition model (long plan §10)
- Post-credit CAC forecast (long plan §7)
- Named AI provider footnote (Anthropic Claude)
- Three new risks: R-AI-001, R-GBP-001, R-DRIFT-001
- 16 founder decision placeholders (Q1–Q16)
- 24 risks in risk register
- facts.yaml + drift-check gate
- preflight.py standalone script
- build_business_plans.py unified entry point
- --family, --resend, --summary-card flags in send wrapper
- SUMMARY.md in 3 existing snapshots + 1 new snapshot
- 20 framework documents under docs/business-plan/
- 10 support specifications under docs/business-plan/support/

### Changed
- FL minimum wage: $13/hr → $14.00/hr (now) / $15.00/hr (Sept 30, 2026)
- Pinellas sales tax: 6.75% → 7.0%
- Industry net margin: 7.9–13% → 10–15%
- Domain cost: $9.15 one-time → $4.99/yr (LargoLawn.pro on Vercel)

### Deferred (next cycle)
- D-0062 source reconciliation for 4 operational artifacts
- PRP-C full content model with sections + manifests
- Day-1 cap table as formal legal agreement
- 5-year financial model
```

---

## 6. Per-artifact metadata

Each artifact additionally has internal metadata (PDF properties, HTML `<meta>` tags):

| Field | Value |
|---|---|
| Title | "Largo Lawn Business Plan — <variant>" |
| Author | "Cameron Pike (founder)" |
| Subject | "Family seed investment package" |
| Keywords | "Largo, lawn care, family investment, Florida LLC, v1.1" |
| Created | Build timestamp |

---

## 7. Acceptance evidence

- **A-AC11:** `v1.1` and date present in both plan footers; preflight verifies.

---

## 8. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |