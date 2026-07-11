# OBJ-M2-004 — Brand Name and Domain Selection (DRAFT, decision-ready)

> **Status:** Decision matrix pre-populated with recommendation.
> **Authorization:** D-0007 Phase A (strategy ratified).
> **Action:** Steward reviews the matrix + my recommendation, then picks 1 from the top 3.

---

## Pre-scored candidates (5 names)

Per D-0007 framework ([Place feature] + [Service] hybrid, .com only, ≤14 chars, no hyphens, no numbers).

| # | Name | .com available? | TESS clear? | Phone-spell | GBP fit | SEO signal | Total (10) |
|---|---|---|---|---|---|---|---|
| 1 | **PinellasLawn.com** | needs check | likely clear | ✅ PIN-EL-LAS-LAWN | ✅ "Lawn care service" | strong (county name) | **8.5** |
| 2 | **BayAreaLawns.com** | needs check | check TB trademarks | ⚠️ TAMPA-BAY trademark risk | ✅ | moderate (less specific) | 6.5 |
| 3 | **StarkeyYards.com** | likely clear | likely clear | ✅ STAR-KEY-YARDS | ✅ | strong (local street/area) | 8.0 |
| 4 | **LargoLawnCo.com** | needs check | likely clear | ✅ LAR-GO-LAWN-CO | ✅ | hyperlocal (city + service) | 7.5 |
| 5 | **GreenRidgeLawn.com** | likely clear | likely clear | ✅ GREEN-RIDGE-LAWN | ✅ | moderate | 7.0 |

**Recommendation: PinellasLawn.com** (highest score + strongest SEO + defensible).

## Top 3 — domain-availability-check list (do this FIRST before TESS)

Run these on Namecheap / Google Domains / GoDaddy:

- [ ] PinellasLawn.com
- [ ] StarkeyYards.com
- [ ] LargoLawnCo.com

Plus defensive registrations (one-time $30-45):

- [ ] PinellasLawn.net (defensive)
- [ ] PinellasLawnLLC.com (defensive)
- [ ] GRASSLargo.com (legacy placeholder — current code base uses this)

## TESS search — once top candidate is selected

For the chosen name only:
- [ ] USPTO TESS search at https://tmsearch.uspto.gov/
  - Class 037 (building maintenance / landscaping services)
  - Class 044 (lawn care / agricultural services)
  - Search live + dead marks
- [ ] Sunbiz fictitious name search at https://search.sunbiz.org/
- [ ] Florida Department of State trademark search

## Social handle check

For the chosen name:
- [ ] Nextdoor (business page eligibility)
- [ ] Facebook Business Page handle
- [ ] Instagram handle
- [ ] GBP category: "Lawn care service" (NOT "Landscaper" — categorical SEO difference)

## Decision Template — populate after selection

```markdown
# D-0010 — Brand Name and Domain Final Selection (Phase B of D-0007)

**Status:** [Ratified]
**Decision date:** [DATE]
**Decision file:** governance/decisions/0010-brand-final.md
**Review date:** [90 days post-launch]
**Owner:** Steward

## Context

D-0007 ratified strategy. D-0010 selects the specific name and domain.

## Candidates evaluated

| Candidate | Score | Reason selected/rejected |
|---|---|---|
| PinellasLawn.com | 8.5/10 | SELECTED — strongest SEO + defensible |
| StarkeyYards.com | 8.0/10 | rejected (slightly weaker SEO; Starkey is one street, not full area) |
| LargoLawnCo.com | 7.5/10 | rejected (city-specific limits growth if service area expands) |

## Decision

Selected brand: PinellasLawn
Domain: PinellasLawn.com (primary) + 3 defensive registrations
Fictitious name registration: $50 (Sunbiz)
GBP profile name: "PinellasLawn"
Matching handles: Nextdoor, Facebook, Instagram

## Trademark clearance (TESS)

- [TESS search result — paste link]

## Implementation

1. Register PinellasLawn.com on Namecheap (~$12/yr)
2. Register 3 defensive domains (~$36 total)
3. File FL Fictitious Name Registration ($50)
4. Create GBP profile with name "PinellasLawn" + matching NAP
5. Update all reference docs (CLAUDE.md, code) to use new name

## Risks accepted

- TESS clearance is best-effort; annual review of trademark filings
- Domain renewal lapses would be catastrophic — auto-renew enabled
- Brand-name typo squatting — defensive registrations mitigate

## Cost summary

| Item | One-time | Annual |
|---|---|---|
| Primary domain | — | $12/yr |
| 3 defensive domains | — | $36/yr |
| FL Fictitious Name Registration | $50 | — |
| Logo (Canva DIY or Fiverr) | $0-50 | — |
| **Total** | **$50-100** | **$48/yr** |
```

## State ledger update (post-selection)

```yaml
- id: OBJ-M2-004
  status: completed
  completed_date: <DATE>
  artifact_ref: governance/decisions/0010-brand-final.md
  domains_acquired:
    - PinellasLawn.com
    - PinellasLawn.net
    - PinellasLawnLLC.com
    - GRASSLargo.com (legacy placeholder — rebrand or release)
  rebrand_action_required:
    - "Update CLAUDE.md to reference PinellasLawn"
    - "Update apps/web/src/lib/business.ts"
    - "Update all .env.example references"
    - "Re-issue GBP profile"
```

## Note on the placeholder name in code

The codebase currently uses `GRASS Lawn & Landscape` (per apps/web/src/lib/business.ts
and CLAUDE.md). After brand selection:
- If you pick a different name, code refactor is required (CLAUDE.md, business.ts,
  layout.tsx metadata, GBP-stub page).
- If you keep GRASS, no refactor needed.

This is logged as `OBJ-REBRAND-001` placeholder in state/ledger.yaml.