# D-0005 — Legal Entity Choice (Florida)

**Status:** Ratified
**Decision date:** 2026-07-10 (Phase 1 workstream; ratified by steward review)
**Decision file:** governance/decisions/0005-entity-choice.md (this file)
**Review date:** 2027-01-10 (6 months post-launch; tax season)
**Owner:** Steward

---

## Context

Mission 1 requires a legal entity. The choice has:
- Tax implications (self-employment tax, pass-through vs corporate).
- Liability implications (piercing the corporate veil).
- Operational implications (banking, hiring, contracts).
- Reversibility implications (entity change is hard and expensive).

## Decision

**Florida Limited Liability Company (LLC), single-member, treated as a disregarded entity for federal tax purposes (default Schedule C).**

### Why LLC over S-Corp

| Factor | LLC | S-Corp | Winner |
|---|---|---|---|
| Setup cost | $125 (FL LLC filing) | $125 + $100 + corporate bylaws | LLC |
| Setup time | 1-3 business days | 2-4 weeks (bylaws + EIN + payroll setup) | LLC |
| Annual maintenance | $138.75 (FL LLC annual report) | $138.75 + payroll tax filings + separate 1120-S | LLC |
| Self-employment tax exposure | Full SE tax on net earnings | Salary must be "reasonable"; distributions escape SE tax | S-Corp (only if MRR >$40K) |
| Liability protection | Strong | Strong | Tie |
| Hiring complexity | Low (sole-member can hire as employee) | Medium (must run payroll even for owner) | LLC |
| Conversion cost | Can elect S-Corp later via 2553 | Harder to back out of | LLC (reversibility) |

**The threshold rule:** Switch to S-Corp election when net business income (after reasonable owner salary) exceeds ~$40K/year. At that point the SE-tax savings from S-Corp outweigh the extra compliance. Until then, LLC is simpler and the savings are not material.

### Why not a sole proprietorship (no entity)

- No liability shield.
- Mixing personal and business credit/payments complicates accounting.
- Banking partners may refuse business credit without an entity.
- $125 is cheap insurance.

### Filing steps (Day 1-3 of operations)

1. File Florida LLC Articles of Organization via Sunbiz ($125).
2. Apply for EIN via IRS (free, 10 min online).
3. Open business bank account (chase, wells fargo, or local credit union).
4. File FL DR-1 (sales tax registration).
5. File DWC-250 (workers comp corporate-officer exemption).
6. Apply for City of Largo BTR ($10 application + $52 annual).
7. Apply for Pinellas County BTR (county fee TBD).
8. Bind general liability insurance ($1M minimum).

### Annual maintenance

| Item | Cost | Due |
|---|---|---|
| FL LLC annual report | $138.75 | May 1 each year (post-formation anniversary) |
| FL sales tax filing | Free (online) | Quarterly + annual |
| IRS Schedule C | Free (TurboTax) | April 15 |
| Pinellas County BTR | ~$30/yr | Annual |
| City of Largo BTR | $52/yr | Annual |
| Registered agent | $0 (acting as own) | n/a |

## Alternatives considered

| Alt | Why rejected |
|---|---|
| Sole proprietorship | No liability shield; messy accounting. |
| S-Corp election Day 1 | Overhead not worth it at <$40K income. |
| C-Corp | Double-taxation, IRS scrutiny, no benefit at this size. |
| LP/LLP | Designed for partnerships; not solo-founder-appropriate. |

## Risks accepted

- **Single-member LLC = no separate employer.** When the first hire happens, must convert to multi-member LLC OR elect S-corp OR create a payroll relationship.
- **Disregarded entity means all LLC income = personal income for tax.** This is what enables Schedule C but means there's no asset shield at the LLC level (it stops creditors, not the IRS).
- **No operating agreement drafted.** For a single-member LLC, FL law treats the LLC as having default rules; an operating agreement is best-practice but not legally required until multi-member.

## When this decision is re-evaluated

| Trigger | Action |
|---|---|
| First hire | Convert to multi-member LLC OR elect S-Corp; ADR required |
| MRR >$5K/mo for 3 months | Re-evaluate S-Corp election |
| Adding second business (Mission 2) | Form a parent holding LLC; this LLC becomes single-member of that |
| Liability incident | Review insurance coverage; possibly re-evaluate entity |

## Implementation triggers

- D-0005 unlocks Step 1 of every license (Sunbiz filing) and Step 2 (EIN).
- Triggers the bank account setup which is required for Stripe payouts.