# OBJ-M2-002b — Pinellas County Business Tax Receipt (DRAFT, ready to file)

> **Status:** Draft, awaiting steward execution.
> **Authorization:** D-0005 (LLC), research/regulatory/largo-licensing-map.yaml
> **Filing URL:** https://pinellas.gov/occupational-licenses/ (Pinellas County Tax Collector)
> **Fee:** ~$30 (historically; verify at filing portal)

---

## Why a separate filing from City of Largo BTR

Per FL law, a City of Largo BTR does NOT exempt you from the Pinellas County
BTR if your service area extends beyond the city limits. GRASS serves 6 ZIP
codes (33756, 33770, 33771, 33773, 33774, 33778), so both are required.

## Pre-flight checklist

- [ ] City of Largo BTR filed (OBJ-M2-002a)
- [ ] Sunbiz-filed LLC + EIN

## Draft application

Same fields as City of Largo BTR (drafts/btr/city-of-largo-btr-application.md)
with two differences:

```
Jurisdiction:
  Pinellas County (unincorporated OR as secondary to city BTR)

Filing Location:
  Pinellas County Tax Collector
  15th St N (Kenneth City)
  OR via pinellas.gov online portal

Business Activity:
  Same NAICS 561730 — Landscaping Services
  (matches City BTR — DO NOT diverge, causes audit risk)
```

## After filing

1. Save county BTR PDF to: `governance/filings/grass-llc-pinellas-county-btr.pdf`
2. Display alongside City BTR certificate at principal office.
3. Renew annually (Pinellas mails reminder).

## Combined BTR cost summary

| Filing | First-year fee | Renewal |
|---|---|---|
| City of Largo | $62 ($10 application + $52 annual) | $52/yr |
| Pinellas County | ~$30 | ~$30/yr |
| **Annual recurring** | | **~$82/yr** |

## State ledger update (post-filing)

```yaml
- id: OBJ-M2-002
  status: completed
  completed_date: <DATE>
  artifacts:
    - governance/filings/grass-llc-city-of-largo-btr.pdf
    - governance/filings/grass-llc-pinellas-county-btr.pdf
```