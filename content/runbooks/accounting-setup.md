# Runbook 7 — Accounting Setup

> **Use:** Set up before Month 1 starts. Don't wait until tax season.
> **Goal:** Solo operator has full visibility into revenue, expenses, taxes, and cash position — without paying a bookkeeper.
> **Cash gate:** Setup cost < $100. Tools listed are free or near-free.

---

## The five accounts you need

### 1. Business checking account

- **Where:** Local credit union (not a big bank). Pen Air, Grow Financial, or Achieva are good in Pinellas.
- **Why:** Separate business from personal. Quicken / Wave / spreadsheet draws from this. Cleaner at tax time.
- **Cost:** Free for basic business checking. No minimum balance for most.
- **Setup:** ~30 min at a branch. Bring your FL drivers license + your Sunbiz filing (post-Month 1) or sole-prop assumed-name certificate.
- **Don't:** Don't use a personal account for business. Don't commingle.

### 2. Business savings account (for taxes)

- **Where:** Same institution as checking. Linked for auto-transfer.
- **Why:** Hold back ~30% of every taxable payment for federal + FL + self-employment tax. Move it OUT of operating cash so you can't accidentally spend it.
- **Cost:** Free.
- **Setup:** Same visit as checking. Open both accounts in one trip.

### 3. Tax accruals sub-account (inside business savings)

- **How:** Subdivide mentally + spreadsheet. Don't open a third account.
- **Why:** Florida sales tax (6.75%) goes to one bucket. Federal income tax (~15-25%) goes to another. Self-employment tax (15.3%) goes to a third. Don't lose track.

### 4. Square / payment processor

- **Where:** Square (free to set up, 2.6% + 10¢ per transaction).
- **Why:** Customers want to pay by card. Without it, you're losing 20-30% of impulse customers.
- **Cost:** 2.6% + 10¢. On a $75 invoice, that's $2.05. Worth it.
- **Setup:** 15 min online. Connect to your business checking for next-day deposits.
- **Alt:** Venmo Business (1.5% for instant transfer, free for 1-3 day). Zelle (no fee, but tied to your bank). Cash App for Business (similar to Venmo).
- **Don't:** Don't accept personal-pay-app payments on your personal account. Always use the business account.

### 5. Accounting software (free tier)

- **Wave Accounting** — free for invoicing + bookkeeping + receipts. Recommended.
- **QuickBooks Self-Employed** — $15/mo. More robust reports. Worth it post-Month 6.
- **Spreadsheet** — works for Month 1-2 if Wave feels like overkill. Just track: date, customer, service, amount, payment method.

---

## The bookkeeping rhythm

### Daily (5 minutes)

- Open Wave (or spreadsheet). Log yesterday's:
  - Invoices issued
  - Payments received (cash, Venmo, Square)
  - Expenses (fuel, supplies)
- Reconcile your Square deposit against your invoice log.

### Weekly (15 minutes, every Sunday evening)

- Send invoice emails for the week.
- Categorize expenses (fuel, equipment, supplies, marketing).
- Check tax accruals sub-account balance. Should be ~30% of monthly revenue.
- Note upcoming recurring customer visits for the week.

### Monthly (1 hour, last day of month)

- Reconcile business checking account (matches every transaction to invoice or expense).
- Reconcile Square payouts (matches deposits to invoices).
- Calculate monthly revenue, monthly expenses, monthly profit.
- Calculate quarterly estimated tax payment (if it's quarter-end).
- File the month's receipts in Google Drive `/finance/[YYYY-MM]/receipts/`.
- Update the cash ladder trigger metrics: $500? $1K? $2.5K? $5K?

### Quarterly (2 hours, 15th of month after quarter end)

- **Quarterly FL sales tax filing** (Form DR-15) — IF registered (post-DR-1 reactivation).
- **Quarterly federal estimated tax** (Form 1040-ES) — recommended even before formal requirement. $500-$1,000/quarter for solo operator with $20-30K/year revenue.
- **Quarterly state estimated tax** (Form F-1120 for corps, F-1040 for individuals).
- Reconcile year-to-date totals against budget.

### Annually (4-6 hours, January-February)

- **Annual FL sales tax return** (Form DR-15) — IF registered.
- **Annual federal tax return** (Form 1040 + Schedule C) — due April 15.
- **Annual state tax return** (Form F-1040) — due May 1 (no extensions for FL).
- **Annual county business tax** (Pinellas County) — due September 30.
- **Annual Sunbiz report** (if LLC) — due May 1.
- **Annual DBPR renewal** (if registered) — varies.

---

## Tax fundamentals for a solo lawn operator in FL

### What you owe (in rough order)

1. **Federal income tax** — 10-25% of net profit, depending on total income. With $30K net profit and no other income, ~10-12% effective.
2. **Self-employment tax** — 15.3% of net profit (covers Social Security + Medicare).
3. **FL sales tax** — 6.75% × taxable sales (collected from customer, remitted to FL DOR).
4. **FL re-employment tax** (unemployment) — minimal for solo operator (you don't pay FUTA/SUTA on yourself, but if you hire someone later, this kicks in).

### What's deductible

- **Mileage** to/from jobs (67¢/mile, 2026 rate — check current).
- **Equipment** (depreciated over 5-7 years, or Section 179 expensed in year of purchase).
- **Supplies** (mulch, trim line, fuel, oil).
- **Insurance** (when active).
- **Marketing** (yard signs, business cards, GBP boost credits).
- **Phone** (proportional to business use).
- **Home office** (only if you have a dedicated space; usually small for solo operator).
- **Education** (any training, certifications, books).
- **Bank fees** (Square fees, wire fees).

### What you DON'T deduct

- Personal food (except while traveling for business, at 50%).
- Personal phone plan in full (only the business-use portion).
- Personal vehicle in full (only business mileage).
- Personal home in full (only home office portion if any).

### Sales tax (DR-1) decision

**Defer until $1,000/month run-rate.** Why:

- Registration is free and fast.
- Quarterly filing is ~1 hour + ~$0 (no fee).
- But there's a $50 late penalty if you forget to file, and FL DOR doesn't send reminders.
- A solo operator with $500/month revenue is at risk of forgetting to file and getting a $50 penalty that wipes out half the tax accrual.

When you cross $1K/month: register, start filing. Net cost: ~30 min/quarter.

**Until then:** track accruals. Show 6.75% on every invoice. Move 6.75% of every taxable payment to the tax accruals sub-account. When you register, you have a clean accruals balance to remit.

---

## The spreadsheet template

If you don't use Wave, here's the minimum:

### Sheet 1: Invoices (rows = invoices)

| Date | Inv # | Customer | Service | Amount | Tax | Total | Method | Paid Y/N | Date Paid |
|---|---|---|---|---|---|---|---|---|---|

### Sheet 2: Expenses (rows = receipts)

| Date | Vendor | Category | Amount | Method | Receipt Y/N |
|---|---|---|---|---|---|

### Sheet 3: Customer list (rows = customers)

| Customer | Address | ZIP | Phone | Email | Cadence | First Visit | Last Visit | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|

### Sheet 4: Monthly P&L (rows = months, columns = categories)

| Month | Revenue | COGS | Gross Profit | Operating Expenses | Net Profit | Tax Accrual | Cash on Hand |
|---|---|---|---|---|---|---|---|

### Sheet 5: Tax accruals (rows = months)

| Month | Sales Tax Collected | Fed Income Accrual | SE Tax Accrual | Total Accrued | Remitted | Balance |
|---|---|---|---|---|---|---|

---

## When to hire a bookkeeper / accountant

- **DIY works for revenue < $50K/year.**
- **At $50K-$100K/year:** consider a part-time bookkeeper ($200-400/month).
- **At $100K+/year:** full-service bookkeeping + quarterly tax planning ($500-800/month).
- **Solo lawn operator in Year 1** will likely stay < $50K. DIY is fine.
- **Year 2-3** if revenue grows past $50K, hire.

---

## What "good accounting" looks like

1. **You always know your cash balance.** Daily.
2. **You always know your monthly profit.** Monthly.
3. **You always know your tax obligations.** Quarterly.
4. **You never get surprised at tax time.** April 15 doesn't feel like a deadline; it's a date you were already prepared for.
5. **Your accountant (when you have one) opens your books and says "this is clean."**

If any of those five are missing, the system isn't working. Adjust.