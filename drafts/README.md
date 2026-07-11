# Cash-Constrained Launch — INDEX

> **Strategy:** Minimize cash-out. Solve the 2 items that unblock
> distribution and first revenue (brand + GBP → citations → first leads
> → first paid pilots). Defer everything else until pilot revenue covers
> the cash gates.
> **Cash required Year 1:** **$9.15** (one domain registration).
> **Cash gates deferred:** $0 today, $125-4,750 when reactivated.
> **Status:** 6 items split into 2 ACTIVE + 4 DEFERRED.

---

## What this is

The original Day-8 ratification pack proposed 6 simultaneous items with
a combined Year-1 cost of ~$15-22K. Per steward direction 2026-07-10,
that path is replaced by a **cash-min path**:

- **Solve items 4 + 6 first** — these are the two items that unlock
  customer-facing distribution and the opportunity to receive payment
  for work. They share zero cash dependencies and one time dependency
  (item 6 needs item 4's domain for citation NAP).
- **Defer items 1, 2, 3, 5** — these all cost >$0 and all require either
  revenue or external cash to reactivate. Drafts are committed so that
  when pilot revenue or personal funds allow, the work is mechanical.

The four deferred items do not block:
- Receiving payments from pilot customers (Stripe / Cash App / Venmo
  work without an LLC for the first ~5 transactions).
- Earning 5-star GBP reviews from those pilots.
- Building GBP ranking via citations to a domain that exists.

The four deferred items DO become urgent when:
- Pilot revenue crosses ~$500 (OBJ-M2-001 entity filing unlocks
  tax-deductible expenses + banking).
- A paid pilot customer requests documentation (insurance cert,
  BTR number, license) — at that point OBJ-M2-002/003 become blocking.
- A regulatory complaint arrives — reactivation is immediate.

---

## ACTIVE items — execute today

Each item has **a single draft document** with every field pre-filled.
You sign once, file/register once, ship once.

| # | Item | Draft doc | Time required | Cash |
|---|---|---|---|---|
| **4** | Brand + domain | [drafts/brand/names-and-decision-matrix.md](brand/names-and-decision-matrix.md) | 1 hr to pick + 10 min to register | **$9.15/yr** |
| **6** | GBP profile + citations | [drafts/gbp/profile-content.md](gbp/profile-content.md) | 1-2 hrs profile + 2-3 hrs citations | **$0** |

### Sequence

```
Step 4a: Pick brand name from matrix
        [drafts/brand/] → top-3 list → pick 1         [30 min]
Step 4b: Register domain on Cloudflare Registrar    [10 min, $9.15]
        Action auto-renew ON (mandatory)
Step 4c: Update apps/web/src/lib/business.ts         [5 min, I do this]
        + CLAUDE.md + layout.tsx metadataBase        [when you commit the brand]
Step 6a: Create GBP profile with chosen NAP         [1 hr]
        Primary category: "Lawn care service" (not "Landscaper")
Step 6b: Submit verification postcard request       [1 click, GBP dashboard]
        Wait 5-14 days for postcard                  [no action]
Step 6c: Tier-1 citations (Apple Maps, Bing, FB, Yelp)  [45 min]
        NAP template verbatim from draft
Step 6d: Tier-2-5 citations (data aggregators + niche)
        [2-3 hrs spread over the next 14 days]
Step 6e: Receive postcard, enter code               [5 min]
        GBP live.
Step 6f: First GBP-visible lead → quote → first pilot job
        [timing: variable, 2-30 days post-GBP-live]
Step 6g: After 5 paid pilots → 5 reviews → ranking lift
        [constant-state operation starts]
```

**Total active work: ~6-8 hours of steward time over ~14-30 days.**
**Total cash: $9.15.**

---

## DEFERRED items — drafts already authored

Reactivation triggers listed in `state/ledger.yaml → deferred_cash_constrained`.
All drafts ready so reactivation is mechanical when the trigger fires.

| # | Item | Draft doc | Trigger to reactivate | Cash gate |
|---|---|---|---|---|
| 1 | Sunbiz LLC filing | [drafts/sunbiz/articles-of-organization.md](sunbiz/articles-of-organization.md) | First paid pilot revenue OR 30 days post-launch | $125 + recurring BTRs |
| 2a | City of Largo BTR | [drafts/btr/city-of-largo-btr-application.md](btr/city-of-largo-btr-application.md) | First paying customer OR regulatory complaint | $62 + $30/yr renewal |
| 2b | Pinellas County BTR | [drafts/btr/pinellas-county-btr-application.md](btr/pinellas-county-btr-application.md) | Same as 2a | ~$30 + renewal |
| 2c | DWC-250 workers comp exemption | [drafts/btr/dwc-250-exemption.md](btr/dwc-250-exemption.md) | First employee OR first incident | $0 |
| 3 | Insurance binding | [drafts/insurance/broker-quote-requests.md](insurance/broker-quote-requests.md) | First paying customer OR first equipment incident | $2,500-4,600/yr |
| 5 | Equipment access | [drafts/equipment/purchase-plan.md](equipment/purchase-plan.md) (deferral note) | Equipment incident OR $500+ equipment expense | Handled outside GRASS |

---

## Cash ladder (when pilots start paying)

| Pilot revenue milestone | Action | Cash required |
|---|---|---|
| **$0 today** | Execute items 4 + 6 | $9.15 |
| **$500 cumulative** | OBJ-M2-001 (Sunbiz + EIN + bank + DR-1) | $125 one-time |
| **$1,000 cumulative** | OBJ-M2-002 (BTRs + DWC-250) | $92 one-time + $30/yr |
| **$2,500 cumulative** | OBJ-M2-003 (insurance bind) | $2,500-4,600/yr |
| **$5,000 cumulative** | First full equipment upgrade (your call outside GRASS) | Variable |

The whole ladder is **fully funded by the first 10-15 paying customers** at
the $55-95/visit pilot pricing. Conservative read.

---

## What I will and will not do

### I will (no steward action required)

- **Update `apps/web/src/lib/business.ts`** + CLAUDE.md + the JSON-LD
  schema to the chosen brand name. 5-minute diff.
- **Maintain the citation-burn tracker** in
  `state/citation-tracker.yaml` (to be authored when first citation goes live).
- **Author the pilot-job review-request flow** as soon as the GBP review
  link is generated (you paste it, I write the SMS template).
- **Build the post-pilot debrief template** so each of the 5 paid
  pilots produces a capability-improvement ADR.

### I will not (steward identity required)

- **Click "I agree"** on Cloudflare / GBP / domain registrar terms-of-service.
- **Pay the $9.15** with your payment method.
- **Pick up the GBP verification postcard** from your real mailbox.
- **Verify GBP by entering the postcard code** (interactive browser step).
- **Submit pilot-job quotes to real customers** with your contact info.
- **Receive pilot-job payment** into your bank or Stripe account.

These are the non-negotiable human-action items. The Charter (`constitution/01-constitution.md`)
explicitly requires steward action for irreversible decisions and entity-binding
actions — that's a feature, not a bug. They become fewer as deferred items
reactivate on the cash ladder above.

---

## Risk acceptance (operating without LLC + BTRs + insurance)

For the first 5 paid pilots, the operation runs without:

- **An LLC.** Personal liability for incidents. Solo proprietor by default.
  Mitigation: limited pilot scope, signed waiver-of-liability on every quote.
- **Local BTR.** Operating without a Largo BTR is a municipal citation
  risk (~$250 fine) but doesn't affect customer satisfaction or GBP ranking.
  Mitigation: file the BTR draft the day pilot #3 closes (if revenue allows).
- **GL insurance.** Personal assets at risk for property damage or injury.
  Mitigation: hand-tools-only scope (no commercial mower), waiver-of-liability,
  small lots only (≤0.25 acre), no storm/hurricane work until bound.
- **Sales tax registration.** Collecting sales tax without a DR-1 is a
  Florida DOR issue. Mitigation: do not collect FL sales tax until
  OBJ-M2-001 reactivates; invoice customers as "tax not yet collected"
  — alternatively, absorb the tax into the advertised price.

These four risks are documented as acceptable for the cash-min path. The
moment any of them converts from theoretical to actual (incident,
complaint, regulatory letter), reactivation jumps the priority queue.

---

## Cross-references

- State ledger (cash-constrained split): `state/ledger.yaml` →
  `objectives.active` (OBJ-M2-004 + OBJ-M2-006) +
  `deferred_cash_constrained` (OBJ-M2-001/002/003/005)
- Charter: `constitution/01-constitution.md`
- Decision ADRs: `governance/decisions/`
- Mission 2 framework (deferred to Month 10 per charter):
  `research/mission-2/weighted-scores.md` + `pilot-exception-draft.md`
- Pilot Exception amendment: `constitution/charter-amendments/pilot-exception.md`
- Phase 10 readiness: `audit/phase-10/mission-2-readiness.md`
- Phase 0 audit: `audit/phase-0/`
- 30-day review checklist (D-0002/D-0003/D-0004): `governance/decisions/review-checklist-d0002-d0004.md`