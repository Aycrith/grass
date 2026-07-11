# Day-8 Ratification Pack — INDEX

> **Purpose:** Everything needed for steward action on the 6 pending OBJ-M2-* items.
> **Status:** All drafts ready; 0 work remaining on my end.
> **Action:** Sign + execute in the order below.

---

## The 6 items, in execution order

Each item has a **single draft document** that contains every field pre-filled.
You sign once, file once, ship once.

| # | Item | Draft doc | Time required | Cost |
|---|---|---|---|---|
| 1 | Sunbiz LLC filing | [drafts/sunbiz/articles-of-organization.md](sunbiz/articles-of-organization.md) | 30 min online | $125 |
| 2a | City of Largo BTR | [drafts/btr/city-of-largo-btr-application.md](btr/city-of-largo-btr-application.md) | 30 min online | $62 |
| 2b | Pinellas County BTR | [drafts/btr/pinellas-county-btr-application.md](btr/pinellas-county-btr-application.md) | 20 min online | ~$30 |
| 2c | DWC-250 workers comp exemption | [drafts/btr/dwc-250-exemption.md](btr/dwc-250-exemption.md) | 20 min online | $0 |
| 3 | Insurance broker quotes | [drafts/insurance/broker-quote-requests.md](insurance/broker-quote-requests.md) | 1 hr to send 3 emails + 1-2 wks wait | $0 to send; $2.5-4.6K/yr bind |
| 4 | Brand name + domain | [drafts/brand/names-and-decision-matrix.md](brand/names-and-decision-matrix.md) | 1-2 hrs research + 30 min to register | ~$50-100 one-time + $48/yr |
| 5 | Equipment purchase | [drafts/equipment/purchase-plan.md](equipment/purchase-plan.md) | 2-4 hrs vendor research + 4-6 wks lead time | ~$14K |
| 6 | Google Business Profile | [drafts/gbp/profile-content.md](gbp/profile-content.md) | 1-2 hrs to set up + 5-14 days postcard wait | $0 |

## Sequence (dependencies matter)

```
Step 1: Sunbiz LLC filing ($125)                [DAY 1]
   ↓ unlocks
Step 2a: City of Largo BTR ($62)                [DAY 1-2, depends on Step 1]
Step 2b: Pinellas County BTR (~$30)             [DAY 1-2, depends on Step 1]
Step 2c: DWC-250 workers comp exemption ($0)    [DAY 1-2, depends on Step 1]
   ↓ unlocks
Step 3: Insurance broker quotes — SEND ($0)     [DAY 2-3, depends on Step 1]
   ↓ parallel while waiting for quotes
Step 4: Brand name decision ($50-100)           [DAY 3-5, depends on Step 1]
Step 6: GBP profile create ($0, but wait 5-14 days for postcard)  [DAY 3-5]
   ↓ when 3 insurance quotes return
Step 3b: Insurance bind ($2.5-4.6K/yr)          [DAY 7-12, depends on Step 3 quotes returning]
   ↓ unlocks equipment coverage
Step 5: Equipment purchase ($14K)               [DAY 12-21, depends on Step 3b]
   ↓ when equipment delivered and tested
   ↓ ALL GATES PASSED — field work can begin
```

## Critical-path timing

If you start on Monday (Day 1 = Monday):
- **Day 1 (Monday)**: Sunbiz filed + BTR applications drafted, ready to submit
- **Day 1-2 (Mon-Tue)**: BTRs filed + DWC-250 filed
- **Day 2-3 (Tue-Wed)**: Insurance emails sent; brand decision matrix completed
- **Day 3-5 (Wed-Fri)**: GBP profile created (waiting on postcard)
- **Day 7-12 (next week)**: Insurance quotes return, you bind coverage
- **Day 12 (Fri)**: Equipment order placed (zero-turn has 2-6 wk lead time)
- **Day 19-21**: Equipment delivered, tested, registered, insured
- **Day 35-50 (~5-7 weeks from start)**: GBP postcard arrives → first GBP-visible lead possible
- **Day 50+**: Field work can begin with full licensing + insurance + equipment + GBP

## What I'll do after each step

Once you sign and execute each step, post the artifact (PDF, email confirmation, etc.)
to `governance/filings/` and I'll update `state/ledger.yaml` accordingly:

```yaml
- id: OBJ-M2-001
  status: completed
  completed_date: <DATE>
  artifact_ref: governance/filings/grass-llc-articles-of-organization.pdf
```

## What I CANNOT do (and why)

- **Sign documents** — your signature, your identity
- **Pay filing fees** — your money, your bank account
- **Receive mail** — your mailbox (GBP postcard requires real address)
- **Click "I agree" on legal portals** — terms of service require you
- **Make real customer calls** — I have no phone or address
- **File taxes** — TurboTax needs your SSN + your signature

These are the "non-negotiable human action" items. The Charter (`constitution/01-constitution.md`) explicitly requires steward action for irreversible decisions and entity filings — that's a feature, not a bug.

## If you want me to do MORE in parallel

Things I can author now (no human action required):

- ✅ Equipment lead-time tracking script
- ✅ Insurance policy expiration monitor
- ✅ BTR renewal calendar reminder
- ✅ GBP review-request automation (`@grass/notifications-core sendReviewRequest`)
- ✅ Citation submission tracker
- ✅ Customer onboarding flow (post first lead)

Tell me which to prioritize, and I'll add them to the queue.

## Cross-references

- State ledger: `state/ledger.yaml` (OBJ-M2-001 through 006)
- Charter: `constitution/01-constitution.md`
- Decision ADRs: `governance/decisions/`
- Pilot Exception amendment: `constitution/charter-amendments/pilot-exception.md`
- Phase 0 audit: `audit/phase-0/`
- Day-8 plan reference: `C:/Users/camer/.claude/plans/use-c-users-camer-devnew-grass-ai-busine-shiny-parasol.md` (lines referring to "Day 8 ratification pack")