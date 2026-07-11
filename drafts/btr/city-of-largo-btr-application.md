# OBJ-M2-002a — City of Largo Business Tax Receipt (DRAFT, ready to file)

> **Status:** Draft, awaiting steward execution.
> **Authorization:** D-0005 (LLC), research/regulatory/largo-licensing-map.yaml
> **Filing URL:** https://www.largo.com/services/business/business_tax_receipt/index.php (LCAP — Largo Civic Access Portal)
> **Fee:** $10 application + $52 annual = $62 first-year total

---

## Pre-flight checklist

- [ ] Sunbiz-filed LLC (Articles of Organization) — see drafts/sunbiz/
- [ ] EIN letter from IRS
- [ ] Florida driver's license (matches registered agent address)

## Draft application — copy-paste into LCAP form fields

### Section 1: Business Identification

```
Business Name (must match Sunbiz Articles of Organization exactly):
  GRASS LAWN AND LANDSCAPE LLC

Federal Employer ID (EIN):
  [XX-XXXXXXX]

Sunbiz Document Number:
  [L23000XXXXXX]   (from Sunbiz filing confirmation)

Business Structure:
  Limited Liability Company (LLC)

Florida State Sales Tax ID (DR-1):
  [XX-XXXXXXX]   (may be pending — file if not yet issued)
```

### Section 2: Business Location

```
Business Address (physical — must be in Largo city limits OR service area):
  [YOUR STREET ADDRESS OR PRINCIPAL OFFICE]
  [CITY], FL  [ZIP]

Mailing Address (if different):
  [Same as above OR alternate mailing address]

Phone (primary):
  [YOUR BUSINESS PHONE — Google Voice or mobile]

Email:
  [YOUR BUSINESS EMAIL]
```

### Section 3: Business Activity

```
NAICS Code:
  561730 — Landscaping Services

Business Activity Description:
  Residential lawn care and landscaping services — mowing,
  edging, mulching, hedge trimming, hurricane prep, seasonal
  cleanup. Services offered without fertilization, without
  pest control, without irrigation installation per
  research/regulatory/largo-licensing-map.yaml.

Number of Employees (FL):
  0   (solo founder; DWC-250 corporate-officer exemption on file)
  Will update to "1" upon first hire (re-evaluate workers comp)

Will business be conducted from this location?
  YES (principal office) — OR — NO (home-based; see Section 4)
```

### Section 4: Home-Based Business Affidavit (if applicable)

If your principal office is your home, you must sign the City of Largo Home
Occupation affidavit (LCAP auto-prompts this).

```
I certify that the home-based business:
  - Will not change the residential character of the property
  - Will not generate noise, traffic, or odors beyond residential norms
  - Will not display signs visible from the public right-of-way
  - Complies with all HOA requirements (if applicable)
  - Stores equipment in enclosed garage / shed (no outdoor storage visible from street)
```

### Section 5: Signature

```
Applicant Signature:
  [YOUR FULL LEGAL NAME]
  Title: AUTHORIZED MEMBER (or MANAGER)

Date:
  [TODAY'S DATE]
```

---

## After filing

1. City will email BTR certificate within 5-7 business days.
2. Save PDF to: `governance/filings/grass-llc-city-of-largo-btr.pdf`
3. Display the original BTR certificate visibly at your principal office (FL law).
4. Renew annually (City mails reminder ~30 days before due date).

## State ledger update (post-filing)

```yaml
- id: OBJ-M2-002
  status: completed
  completed_date: <DATE>
  artifact_ref: governance/filings/grass-llc-city-of-largo-btr.pdf
  parent_objective: OBJ-M2-001 (must be complete first)
  note: "Also file OBJ-M2-002b (Pinellas County BTR) — separate filing"
```

## Cross-references

- Pinellas County BTR (separate filing): `drafts/btr/pinellas-county-btr-application.md`
- Workers comp DWC-250 exemption: `drafts/btr/dwc-250-exemption.md`
- D-0005: `governance/decisions/0005-entity-choice.md`