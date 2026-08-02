# S-06 — Diff Artifact (`output/reports/diff_<from>_to_<to>.md`)

**Document ID:** DOCS-BP-S-06-DIFF-ARTIFACT
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent + build steward

---

## 1. Purpose

This document specifies the diff artifact — the human-readable record of what changed between two versions. Generated automatically by the build pipeline when `--diff <from> <to>` is invoked.

---

## 2. Output location

`output/reports/diff_<from>_to_<to>.md`

For this cycle: `output/reports/diff_v1.0_to_v1.1.md`.

---

## 3. Required sections

### 3.1 Version metadata

```markdown
## Version metadata

| Field | Value |
|---|---|
| From version | 1.0 |
| To version | 1.1 |
| Diff date | 2026-07-28 |
| Variants diffed | long, condensed |
| From SHA | <git-sha> |
| To SHA | <git-sha> |
```

### 3.2 Changed facts

```markdown
## Changed facts

| Fact ID | Old value | New value | Source |
|---|---|---|---|
| fl-min-wage-current | 13.00 USD/hr | 14.00 USD/hr | FL Constitution Amendment 2; 2026 schedule |
| combined-sales-tax | 6.75 percent | 7.0 percent | FL DOR DR-15DSS 2026 |
| industry-net-margin-low | 7.9 percent | 10 percent | NALP / IBISWorld 2026 |
| industry-net-margin-high | 13 percent | 15 percent | Same |
| seed-ask-amount | 10000 USD | 15000 USD | SCORE / Housecall Pro 2026 / IBISWorld |
| pre-money-valuation | 60000 USD | 150000 USD | Solo service pre-revenue norm |
| family-ownership-pct | 15 percent | 9.09 percent | computed from seed-ask / pre-money |
```

### 3.3 Removed wrong facts

```markdown
## Removed wrong facts

- `$13/hr` FL minimum wage (corrected to $14.00/hr now / $15.00/hr Sept 30)
- `6.75%` combined sales tax (corrected to 7.0%)
- `7.9–13%` industry net margin (corrected to 10–15%)
```

### 3.4 Added investor-facing disclosures

```markdown
## Added investor-facing disclosures

- Cap table at LLC formation (founder 90.91%, family 9.09%)
- Use of funds worksheet ($15,000 broken into 6 categories)
- Return expectations (3 scenarios, no guarantees)
- Buyback / exit formula (mutual ROFR, 2.5× SDE OR 1.0× revenue)
- Sunset clause (5-year review, 2.0× capital return fall-away)
- Reporting cadence (monthly email, quarterly P&L, annual K-1)
- Plain-language FAQ (20 questions)
- Summary card (A4 landscape, one-pager)
- Risk disclosure (verbatim, in cover letter and summary card)
- Plain-language email body (300–500 words)
```

### 3.5 Changed sections

```markdown
## Changed sections

- §1 Executive Summary — added $62,100 ARR headline
- §7 Customer Acquisition — added post-credit CAC forecast
- §9 Operations — added named AI provider footnote
- §10 Financial Projections — added first-hire transition model
- §13 The Ask — added cap table, use of funds, return expectations
- §14 Risk Factors — added 3 new risks (R-AI-001, R-GBP-001, R-DRIFT-001)
```

### 3.6 Output hashes

```markdown
## Output hashes

| File | SHA-256 | Size |
|---|---|---:|
| business_plan_grass_condensed_v1.1.pdf | <hash> | <bytes> |
| business_plan_grass_mission1_v1.1.pdf | <hash> | <bytes> |
| cover_letter_v1.1_family.html | <hash> | <bytes> |
| business_plan_grass_summary_card_v1.1.pdf | <hash> | <bytes> |
```

### 3.7 Preflight result

```markdown
## Preflight result

```
$ python scripts/preflight.py --variant all
[PASS] No stale wrong facts.
[PASS] All required footers present.
[PASS] No unresolved placeholders.
[PASS] All attachments Gmail-safe.
Exit 0.
```
```

### 3.8 Reviewer sign-off

```markdown
## Reviewer sign-off

- [ ] Founder initials: ____ Date: ____
- [ ] GRASS executive agent review: ____ Date: ____
- [ ] Build steward review: ____ Date: ____
```

---

## 4. Acceptance evidence

- **B-AC6:** `output/reports/diff_v1.0_to_v1.1.md` exists; covers all 8 sections above.

---

## 5. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |