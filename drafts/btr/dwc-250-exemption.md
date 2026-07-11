# OBJ-M2-002c — Florida Workers' Comp DWC-250 Exemption (DRAFT, ready to file)

> **Status:** Draft, awaiting steward execution.
> **Authorization:** D-0005 (LLC, single-member), FL Statute 440
> **Form:** DWC-250 — Notice of Election to be Exempt
> **Filing URL:** https://www.myfloridacfo.com/division/wc/employer/exemption-from-coverage
> **Fee:** $0
> **Processing:** Immediate (online) / 7-14 days (mail)

---

## Charter context

Per `research/regulatory/largo-licensing-map.yaml`:

> **Landscaping is a 'construction' class under FL Statute 440; solo founder qualifies for corporate officer exemption.**

A solo founder LLC with >30% ownership is exempt from mandatory workers' comp
**for themselves only**. The exemption **LAPSES the moment you hire any
employee** (even part-time). Re-evaluate before first hire.

## Pre-flight checklist

- [ ] Sunbiz-filed LLC (Articles of Organization)
- [ ] EIN letter
- [ ] Social Security number (used only to verify identity — not stored publicly)

## Draft filing

### Section 1: Business Information

```
Business Name:
  GRASS LAWN AND LANDSCAPE LLC

Federal Employer ID (EIN):
  [XX-XXXXXXX]

Business Address:
  [YOUR PRINCIPAL OFFICE OR HOME ADDRESS]
  [CITY], FL  [ZIP]

NAICS Code:
  561730 — Landscaping Services
```

### Section 2: Officer Information

```
Officer Name (must match IRS records for the EIN):
  [YOUR FULL LEGAL NAME]

Title:
  Member / Manager

Ownership Percentage:
  100% (sole member)

Social Security Number:
  [XXX-XX-XXXX]  (verified against SSN records)

Date of Birth:
  [MM/DD/YYYY]

Driver's License (FL):
  [LICENSE NUMBER]

Effective Date of Exemption:
  [TODAY'S DATE — defaults to filing date]
```

### Section 3: Signature

```
I certify under penalty of perjury that I am a corporate officer of the
above-named business, that I have a bona fide ownership interest of more
than 30%, and that I am electing to be exempt from workers' compensation
coverage under Florida Statute 440.

Applicant Signature:
  [YOUR SIGNATURE — must match IRS records]

Date:
  [TODAY'S DATE]
```

---

## After filing

1. Confirmation email arrives within 1 business day (online filing).
2. Save confirmation PDF to: `governance/filings/grass-llc-dwc-250-exemption.pdf`
3. Re-evaluate this filing at first hire trigger (see OBJ-DEBT-FIRST-HIRE-001).

## State ledger update (post-filing)

```yaml
- id: OBJ-M2-002c
  status: completed
  completed_date: <DATE>
  artifact_ref: governance/filings/grass-llc-dwc-250-exemption.pdf
  trigger_to_re_evaluate: "first hire (even part-time) — see OBJ-DEBT-FIRST-HIRE-001"
```

## Why this matters operationally

Without DWC-250 exemption filed:
- Workers' comp is mandatory but the policy market requires employer-employee relationship
- A solo founder cannot buy workers' comp for themselves (it's not insurance you buy; it's statutory)
- Penalty for non-compliance: stop-work order + back-premium + fines

With DWC-250 filed:
- You are legally exempt as a 100% owner
- No insurance cost
- Clear record at first hire that you re-evaluated

## Cross-references

- D-0005 (entity): `governance/decisions/0005-entity-choice.md`
- BTR (City + County): `drafts/btr/`
- Insurance broker D-0006: `governance/decisions/0006-insurance-broker.md`
- First hire trigger: state/ledger.yaml OBJ-DEBT-FIRST-HIRE-001 (placeholder)