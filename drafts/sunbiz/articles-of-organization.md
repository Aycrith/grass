# OBJ-M2-001 — Sunbiz Florida LLC Filing (DRAFT, ready to file)

> **Status:** Draft, awaiting steward execution.
> **Authorization:** D-0005 (LLC, single-member) — already ratified.
> **Filing URL:** https://search.sunbiz.org/Inquiry/CorporationSearch/ByName (then "File a New Record")
> **Fee:** $125 (online filing) + $25 optional certified copy
> **Processing:** 1-3 business days

---

## Pre-flight checklist

Before opening Sunbiz, have ready:

- [ ] Steward's full legal name (must match SSN/ITIN records)
- [ ] Steward's Florida street address (registered agent address — can be home)
- [ ] Steward's mailing address (if different from registered agent)
- [ ] Effective date (today or up to 90 days forward)

## Draft filing — copy-paste into Sunbiz form fields

### Section 1: Name and Mailing Address

```
Proposed LLC Name:
  GRASS LAWN AND LANDSCAPE LLC

Mailing Address (will appear on record):
  [YOUR STREET ADDRESS LINE 1]
  [CITY], FL  [ZIP]

County of mailing address:
  Pinellas
```

### Section 2: Principal Office / Registered Agent

**Florida requires a Registered Agent** — the person who receives legal mail on behalf of the LLC. For a single-member LLC, the most common and cheapest option is to act as your own registered agent.

```
Registered Agent Name:
  [YOUR FULL LEGAL NAME]

Registered Agent Address (must be a Florida street address — no PO boxes):
  [YOUR HOME OR PRINCIPAL OFFICE STREET ADDRESS]
  [CITY], FL  [ZIP]

Registered Agent Signature:
  [Sign on filing — printed name + signature]

Is the Registered Agent the same as the Member/Manager?
  YES (single-member LLC)
```

### Section 3: Purpose

```
Purpose:
  Any and all lawful business activities permitted under Florida law.
```

### Section 4: Members / Managers

```
Member/Manager:
  Name: [YOUR FULL LEGAL NAME]
  Address: [YOUR STREET ADDRESS]
  City/State/Zip: [CITY], FL  [ZIP]
  Title: MGR (Manager)
```

### Section 5: Effective Date

```
Effective Date:
  [TODAY'S DATE]  (defaults to filing date if blank)
```

### Section 6: Signature

```
Filing Officer Signature:
  [YOUR FULL LEGAL NAME]
  [TITLE: AUTHORIZED MEMBER / MANAGER]
```

---

## After filing — what Sunbiz returns

You'll receive by email within 1-3 business days:

1. **Filed Articles of Organization** (PDF)
   - Save to: `governance/filings/grass-llc-articles-of-organization.pdf`
2. **Certificate of Status** (optional, $8.75)
   - Save to: `governance/filings/grass-llc-certificate-of-status.pdf`
   - Some banks require this to open the account.

## Immediate next steps after Sunbiz

1. **Apply for EIN** at https://www.irs.gov/businesses/small-businesses-self-employed/how-to-apply-for-an-ein
   - Free, 10 min online
   - Save the EIN letter PDF to: `governance/filings/grass-llc-ein-letter.pdf`
2. **Open business bank account** (Chase, Wells Fargo, or a local Pinellas credit union)
   - Required for Stripe payouts
   - Bring: Articles + EIN letter + government ID
3. **File FL DR-1** (sales tax registration) at https://floridarevenue.com/taxes/registration
   - Sales tax ID issued within 3-5 business days
   - Save cert to: `governance/filings/grass-llc-dr1-cert.pdf`
4. **File DWC-250** (workers comp corporate-officer exemption) — see drafts/btr/

## State ledger update (post-filing)

Once filed, update `state/ledger.yaml`:

```yaml
- id: OBJ-M2-001
  status: completed
  completed_date: <DATE>
  artifact_ref: governance/filings/grass-llc-articles-of-organization.pdf
  completion_evidence: sunbiz filing confirmation email
```

## Cross-references

- D-0005 (entity choice rationale): `governance/decisions/0005-entity-choice.md`
- Licensing map: `research/regulatory/largo-licensing-map.yaml`
- DWC-250 exemption filing: `drafts/btr/` (next item)
- BTR filing: `drafts/btr/` (next item)