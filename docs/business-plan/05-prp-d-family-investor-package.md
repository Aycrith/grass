# 05 — PRP-D: Family Investor Package

**Document ID:** DOCS-BP-05-PRP-D
**Status:** ACTIVE
**Applies to:** Mission 1 (Largo Lawn) family seed investment package
**Date:** 2026-07-28
**Owner:** Founder (steward) + GRASS executive agent
**Review cadence:** Before every external send; quarterly thereafter

---

## 1. Purpose

This document is **PRP-D: Family Investor Package** — the third and most important of the three PRPs. It specifies the family-specific investment package: cap table, use of funds, return expectations, FAQ, talking points, summary card. Without PRP-D, the framework produces a document but not a relationship.

PRP-D is what differentiates this v2.0 framework from the v1.0 baseline (which had only PRP-A + PRP-B).

---

## 2. Package contents

The family package sent tomorrow morning contains **exactly four attachments** + a plain-language email body:

| # | Artifact | Format | Role | Source |
|---|---|---|---|---|
| 1 | **Email body** | HTML (Gmail-safe) | Personal greeting, package intro, call invitation | `scripts/build_condensed_cover_letter.py` |
| 2 | **Family cover letter** | HTML (Gmail-safe) | 1-page plain-language cover letter | `scripts/build_business_plan_cover_letter.py` (renamed) |
| 3 | **Condensed business plan v1.1** | PDF (A4 portrait) | Reader-facing investable document, 12 pages | `scripts/build_condensed_business_plan.py` |
| 4 | **Summary card** | PDF (A4 landscape) | One-page at-a-glance card, keep-on-fridge | `scripts/build_business_plans.py --variant summary-card` |

**Optional 5th attachment:** Long plan v1.1 PDF, sent only if family investor explicitly asks on the call. Default: do NOT send.

**Founder's working documents (NOT sent):**
- Plain-language FAQ (`support/09-family-talking-points.md` §6)
- Conference-call talking points (`support/09-family-talking-points.md` §1–4)
- Cap-table worksheet (this document §3)
- Use-of-funds worksheet (this document §4)
- Risk disclosure (this document §5)

---

## 3. Day-1 loan structure (CONFIRMED)

**STATUS UPDATE (2026-07-28):** The founder has selected **Option C — 0% family loan** as the instrument. No equity is issued. No cap table is created. The structure is a simple 24-month loan.

| Field | Value |
|---|---|
| **Lender** | [Family investor name] |
| **Borrower** | Cameron Pike, doing business as Largo Lawn LLC (FL single-member LLC, to be formed at first cash gate) |
| **Principal** | **$15,000** |
| **Interest** | **0% per annum** |
| **Term** | **24 months** from initial disbursement |
| **Disbursement** | Lump sum to Largo Lawn LLC business bank account within 5 business days of LLC formation |
| **Repayment** | **50% of monthly free cash flow** applied to outstanding principal |
| **"Free cash flow"** | Net profit after tax reserve (25%) and equipment replacement reserve (10%) |
| **Repayment start** | Month 3 (after initial operating reserve is built) |
| **Security** | Unsecured; founder is the personal obligor |
| **Default cure** | 90 days missed payment → loan acceleration; borrower may propose restructuring within 30 days |
| **Prepayment** | Borrower may pre-pay in full or in part at any time without penalty |
| **Mid-term review** | Month 12 — if principal not reduced by ≥50%, parties discuss restructuring |
| **Governing law** | Florida |

### 3.1 Alternative instruments considered

The founder considered three options:

- **Option A — YC Post-Money SAFE** ($400K cap, 20% discount, MFN) — deferred; not needed for a loan structure
- **Option B — Revenue Share Agreement** (15% monthly × 36 mo, 1.75× cap) — deferred
- **Option C — 0% family loan** (24 mo, 50% free-cash repayment) — **SELECTED**

### 3.2 Rationale for loan structure

The founder selected the loan structure because:

1. **Simplicity.** No equity, no board seat, no information rights beyond standard monthly email.
2. **Clarity.** Family investor knows exactly what she'll get back: her $15,000 over 24 months.
3. **Alignment with project.** The existing D-0011 cash-min model already assumes founder-funded working capital; this is the same structure.
4. **Family-friendly.** No collection pressure if business fails; founder is the obligor; standard family-loan norms apply.
5. **Tax efficiency.** Loan repayment is not taxable income to the family investor (unlike equity returns which may trigger capital gains).

### 3.3 Cap table — BEFORE loan

| Holder | Ownership |
|---|---:|
| Cameron Pike (founder) | **100%** |
| **Total** | **100%** |

### 3.4 Cap table — AFTER loan

| Holder | Ownership |
|---|---:|
| Cameron Pike (founder) | **100%** |
| Family investor | **0% (loan, not equity)** |
| **Total** | **100%** |

**No change to cap table.** Loan structure does not dilute founder's ownership.

---

## 4. Use-of-funds worksheet

The $15,000 seed investment, deployed over 6 months from LLC formation:

| Category | Amount | % | Timing | Purpose | Evidence |
|---|---:|---:|---|---|---|
| **Equipment (mid-tier, new residential-grade)** | $9,000 | 60.0% | Months 1–2 | Honda HRX217 ($900), Honda HRC walk-behind ($3,500), STIHL FS 91 R trimmer ($380), STIHL BR 600 blower ($500), trailer ($2,800), hand tools + safety gear + signs ($920) | Procurement scout receipts (see `research/suppliers/procurement-scout-2026-07-21.md`) |
| **GL insurance (6 months)** | $330 | 2.2% | Month 1 | Next Insurance / Insureon FL solo lawn operator $55–$65/mo | Policy + receipts |
| **Licensing & registration (Year 1)** | $310 | 2.1% | Month 1 | Sunbiz LLC $125 + Largo BTR $37.50 + Annual Report $138.75 + DR-1 $5 + EIN $0 | Sunbiz filing receipt + BTRs |
| **Software / communications (6 mo)** | $470 | 3.1% | Months 1–6 | Jobber Core $49/mo monthly × 6 + domain $15 + hosting $72 + phone $120 | Subscription records |
| **Marketing (balanced, 6 mo)** | $3,500 | 23.3% | Months 1–6 | Nextdoor $250/mo + Google Ads $300/mo + 2× door hangers ($500) + yard signs + GBP photo + magnets | Ad receipts |
| **Working capital reserve (6 mo)** | $1,400 | 9.3% | Held | Fuel, repairs, refund cushion, weather buffer | Bank ledger |
| **TOTAL** | **$15,010** | **100%** | 6 months | — | Bank reconciliation |

**Rounded total:** $15,000.

**Every dollar reconciles to a receipt, invoice, or ledger entry.** This is enforced by the founder's monthly 1-page update to the family investor.

### 4.1 Capital deployment ladder (from existing project model)

The project already has a cash-ladder model in `governance/decisions/0011-cash-min-activation.md`. The $15K seed investment replaces the original "founder self-funds" path with a hybrid:

| Cumulative pilot revenue | Trigger | Action | Cash from $15K seed |
|---|---|---|---|
| $0 | Day 1 (LLC formed) | OBJ-M2-001 (Sunbiz + EIN + bank + DR-1) | $125 |
| $0 | Day 1 | OBJ-M2-002 (BTRs + DWC-250) | $92 |
| $0 | Day 1 | OBJ-M2-003 (GL insurance) | $2,500–$4,600 Y1 ($1,500 in Y1 budget) |
| $0 | Months 1–2 | Equipment purchase (Honda + STIHL kit) | $9,000 |
| $0 | Months 1–6 | Software + marketing rollout | $470 + $3,500 = $3,970 |
| $0 | Months 1–6 | Working capital reserve | $1,400 held in bank |

**Net cash deployment from $15K seed:** ~$15,087 (slightly over; reserve absorbs the $87 over).

---

## 5. Loan repayment expectations (no guarantees)

This is the section the family investor will read most carefully.

### 5.1 Plain-language summary

> You are lending the business $15,000 at 0% interest over 24 months. The business promises to repay 50% of its monthly free cash flow until the loan is fully repaid. There is no guaranteed repayment date. If the business fails, some or all of the $15,000 may not be repaid. Cameron (the founder) is personally responsible for the debt.

### 5.2 Detailed repayment mechanics (for the founder to walk through on the call)

**Form of return:** Loan principal repayment. No interest. No equity upside.

**No guaranteed repayment date.** **Substantial risk of partial or total loss.**

**Repayment policy** (per Q12):

1. **First (operating reserve):** Build 3–6 month operating cash reserve (target: $2,500/month × 6 = $15,000).
2. **Second (tax reserve):** Set aside 25% of net profit as tax reserve (federal + state + self-employment).
3. **Third (equipment replacement reserve):** Set aside 10% of net profit as equipment replacement reserve.
4. **Fourth (loan repayment):** 50% of remaining monthly free cash applied to outstanding loan principal.
5. **Fifth (operating reserve top-up):** Remaining cash retained by business.

**Repayment start:** Month 3 (after initial operating reserve is built).

**Repayment scenarios** (forecast, not promise):

| Scenario | Y1 net profit | Y2 net profit | Loan repayment by M12 | Loan fully repaid by |
|---|---:|---:|---:|---:|
| **Pessimistic** | $7,800 | $20,000 | ~$2,500 | M30–M36 (extended) |
| **Baseline** | $16,590 | $50,000 | ~$8,000 | M20–M24 |
| **Stretch** | $44,000 | $90,000 | ~$15,000 | M12–M15 |

**Mid-term review (Month 12):** If principal not reduced by ≥50%, founder and family investor discuss restructuring options (extended term, reduced payment, partial conversion to equity).

### 5.3 Reporting cadence

- **Monthly:** 1-page email update (customers acquired, jobs completed, cash position, loan balance, weather impact, asks for help).
- **Quarterly:** P&L statement (income statement, balance sheet snapshot, loan balance summary).
- **Annually:** In-person or video review meeting (founder's choice of timing).
- **No K-1 required** — loan structure is not a pass-through equity instrument.

### 5.4 Prepayment

- **Founder may pre-pay** the loan in full or in part at any time without penalty.
- **No pre-payment notice required** beyond a courtesy heads-up in the next monthly update.

### 5.5 Sunset / term

- **24-month term** from initial disbursement.
- **Loan fully amortizes by M24** under baseline scenario.
- **Month 12 mid-term review** — if principal not reduced by ≥50%, parties discuss restructuring.
- **Default cure:** 90 days missed payment → loan acceleration; founder may propose restructuring within 30 days; lender may accept or reject in writing.

### 5.6 Downside acknowledgment (verbatim, in cover letter and summary card)

> This is a new local service business. It may take longer to find customers than expected, equipment may break, weather may interrupt work, and the founder may need to change prices or service offerings. The $15,000 may not be repaid quickly, and it is possible that some or all of the loan could be lost. Cameron is personally responsible for repayment. The plan describes a forecast, not a promise.

---

## 6. Plain-language FAQ (founder prep — NOT sent)

These are the questions the family investor is most likely to ask on the call. The founder reads these in advance; the family investor does not receive them in writing (the answers live in the conversation).

**Note:** FAQ is updated for the loan structure (Option C). Some answers differ from the equity-instrument version.

| # | Question | Plain-language answer |
|---|---|---|
| 1 | What is the lawn business, exactly? | "I mow lawns in Largo, Florida, weekly or every other week, for about 50 families. I'll be doing all the work myself for the first year." |
| 2 | Who performs the work? | "I do. Every lawn. No employees in Year 1." |
| 3 | Why Largo? | "I live in Largo, and the local market is underserved — most lawn companies are large franchises that don't return calls. A small local operator can beat them on responsiveness." |
| 4 | What does the weekly $48 service include? | "Mowing, edging, blowing the clippings off hard surfaces. About 30 minutes per yard." |
| 5 | Why is fertilizer not included? | "Florida requires a separate license for fertilizer application. I'm not licensed yet — that's a Year 2 expansion." |
| 6 | What is an LLC? | "A legal structure that separates my personal money from the business money. If something goes wrong with a customer, only the business's money is at risk, not my house or savings." |
| 7 | When will the business become an LLC? | "As soon as we agree on terms and the first pilot customer pays — within the first 30 days." |
| 8 | How is customer money collected? | "Stripe charges the customer's card weekly. The money goes into the business bank account automatically." |
| 9 | What happens if a customer cancels? | "Stripe stops charging them. I move on. Most customers stay for years — the average lawn customer stays 7 years." |
| 10 | What happens if you're sick? | "I have a 2-week buffer in the schedule (Tuesday customers get pushed to Wednesday, etc.). For longer illness, I'd pause new sales and notify customers." |
| 11 | Is this a loan or an investment? | "It's a loan — $15,000 at 0% interest, repaid over 24 months from the business's free cash flow. You don't get equity in the business, but you get your money back as the business earns it." |
| 12 | When will I be repaid? | "Earliest realistic: month 6–9. The business pays 50% of its monthly free cash flow toward the loan. Full repayment expected by month 24 under the baseline plan." |
| 13 | What happens if the business fails? | "I stop spending, close the LLC, and return any unspent money. You lose what was spent on equipment and software, but the loss is bounded by what was deployed. Cameron is personally responsible for any unpaid balance." |
| 14 | Who makes business decisions? | "I do, day-to-day. Big decisions (changing prices, taking on a partner, selling the business) — I'd discuss with you first." |
| 15 | How often will I receive updates? | "Monthly 1-page email. Quarterly P&L. Annual review meeting." |
| 16 | Can I see the books anytime? | "Yes — quarterly P&L is the standard. If you want monthly full books, I'm happy to provide that too." |
| 17 | What's the most likely thing that goes wrong? | "Customer acquisition takes longer than expected. The marketing budget is sized for 25 customers in 4–6 months; if it takes 8 months instead, the loan repayment timeline slips." |
| 18 | What's the upside if it works really well? | "By year 2, the business could be doing $60K–$90K in net profit. Half of monthly free cash goes to repaying your loan, so the loan could be fully repaid by month 12–15 under the stretch scenario." |
| 19 | Why a loan instead of equity? | "Because it's simpler. You get your money back with no equity paperwork. If the business does well, you get repaid faster. If it doesn't, Cameron is personally on the hook — you don't have to worry about stock or SAFE conversion." |
| 20 | Is there anything else I should know? | "Just that I'm grateful you're considering this. And that I'll be transparent with you — monthly updates, honest numbers, and a clear path to repayment or — if things go wrong — an honest conversation about what happens next." |

---

## 7. Conference-call talking points

**Lead with these 7 topics (in order):**

1. **What Largo Lawn does.** Weekly residential lawn care in Largo FL, 1/4-acre average lot, $48/week. Simple, recurring, local.
2. **Why customers would pay for it.** Recurring reliability (same day, same guy, every week), no contract, local operator who picks up the phone.
3. **What the founder will personally do.** All work, day 1. 30–40 hrs/wk through M6; 30 hrs/wk after PMF.
4. **How much money is needed and exactly where it goes.** $15,000 seed. Equipment $9K, insurance $330, licensing $310, software $470, marketing $3,500, reserve $1,400.
5. **What success looks like in Year 1.** $62,100 gross revenue (range $30,192–$106,560); $16,590 net profit (range $7,800–$44,000); 25 customers by M6; 45 by M12.
6. **What could go wrong.** Weather, equipment, slow customer acquisition, founder availability. All disclosed.
7. **What the investor can expect.** Monthly 1-page email, quarterly P&L, annual review meeting; distributions start Month 6–9 if business succeeds.

**Defer unless asked:**
- 13-agent AI architecture
- Mission 2 candidates (pool, pressure wash, pet waste)
- Autonomous-organization narrative
- Technical stack
- Long-range compounding thesis
- Governance decisions (D-0001 through D-0060)
- Source-reconciliation issues (next cycle)

**Call structure (15 minutes):**

| Minutes | Topic | Owner |
|---|---|---|
| 0–2 | Welcome, thanks for time | Founder |
| 2–5 | What Largo Lawn does + why | Founder |
| 5–8 | Use of funds + return expectations | Founder |
| 8–11 | Risk + downside | Founder |
| 11–13 | Q&A | Family investor |
| 13–14 | Next steps | Both |
| 14–15 | Close | Both |

---

## 8. One-page A4 landscape summary card

The summary card is the document the family investor **keeps**. It must be readable on a phone, in print, at 12pt+.

**Layout:** A4 landscape (11.69" × 8.27"), 2 columns.

**Left column (5.5" wide):**

```
LARGO LAWN
Mission 1 of the GRASS organization
Largo, Florida · 33771

WHAT WE DO
Weekly residential lawn care
for about 50 local families.
$48/week for a typical yard.

HOW WE START
Founder runs every lawn personally.
No employees in Year 1.

THE ASK
$15,000 seed investment
for about 9% of the business.
```

**Right column (5.5" wide):**

```
THE NUMBERS (baseline forecast)
$62,100 gross revenue
$16,590 net profit
25 customers by month 6
45 customers by month 12

WHERE THE MONEY GOES
Equipment       $9,000  (60%)
Marketing       $3,500  (23%)
Working capital $1,400  ( 9%)
Licensing       $   310  ( 2%)
Software        $   470  ( 3%)
Insurance       $   330  ( 2%)
                $15,010

WHAT YOU CAN EXPECT
Monthly 1-page update.
Quarterly P&L.
Annual review meeting.
Distributions after Month 6
if business succeeds.

THE RISK
New business. May take longer
than expected. Money may not
be returned. Total loss possible.
Forecast, not a promise.
```

**Footer (small text, monochrome):**

```
Largo Lawn · Mission 1 · Version 1.1
Built 2026-07-28 · Forecast document; not a guarantee of results.
```

**Implementation:** Generated by `scripts/build_business_plans.py --variant summary-card`. Renders to PDF + HTML. Minimum viable tonight: text-only with brand colors; polish later.

---

## 9. Plain-language risk disclosure (verbatim, in cover letter and summary card)

> This is a new local service business. It may take longer to find customers than expected, equipment may break, weather may interrupt work, and the founder may need to change prices or service offerings. The money may not be returned quickly, and it is possible that some or all of the investment could be lost. The plan describes a forecast, not a promise.

---

## 10. Change log

| Date | Change | Author |
|---|---|---|
| 2026-07-28 | Initial creation with v2.0 framework | Founder + GRASS executive agent |