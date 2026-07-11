# Quote Template — Residential Lawn-Care (Largo, FL)

> **Use:** Send within 24 hours of an inbound quote request (see S1 in `content/phone-scripts.md`, T2 in `content/email-templates.md`).
> **Tone:** Plain. Itemized. Friendly. No upsell. No fine print theatrics.
> **Format:** Email body + PDF attachment (this template). PDF lives in `apps/web/public/templates/quote.pdf` post-domain.

---

## Email subject

```
Your quote from Largo Lawn — [customer last name or address]
```

## Email body

```
Hi [first name],

Thanks for reaching out. Here's what I'd do at [address]:

[PASTE QUOTE BODY BELOW]

A few things that aren't on the line items:
  - 24-hour reschedule for rain (no charge, no notice required)
  - Recurring weekly clients save 15% on every visit
  - Free re-cut if anything's not right within 48 hours

To lock in this schedule, just reply "go" with the date you'd
like the first visit. I'll send a confirmation the same day.

If anything on the quote doesn't match what we discussed, say
the word and I'll redo it.

— [Your first name]
Largo Lawn
[phone] · largolawn.pro
```

---

## PDF body (single page)

```
================================================================
                       LARGO LAWN
              YOUR NEIGHBOR'S LAWN MOWER
           hello@largolawn.pro · (727) 555-0123
================================================================

QUOTE #: Q-[YYYYMMDD]-[last name initial][2-digit serial]
DATE:    [Month DD, YYYY]
VALID:   30 days from issue

PREPARED FOR
  [Customer first name] [last name]
  [Street address]
  [City], FL [ZIP]

PROPERTY
  Lot size:    [approx sq ft or "1/4 acre standard"]
  Access:      [notes — gate code, dog, locked side yard]
  Service tier: [Standard / Plus / Premium — see below]

----------------------------------------------------------------
                          SERVICES
----------------------------------------------------------------

MOWING (recurring — weekly)
  - Front, back, side yards, trimmed weekly
  - Edging along walks, curbs, and bed lines every visit
  - Blow-off of all hard surfaces after each cut
    Rate:  $[XX] per visit
    Visits/week:  [1]
    [if monthly:  $[XX] × 4 = $[XXX]/mo]

EDGING (one-time, first visit only)
  - Mechanical edger along [X] linear feet of curb/walk
  - Bed lines redefined where soil has crept onto turf
    Rate:  $[XX] flat

MULCHING (one-time)
  - [X] cubic yards of [color] hardwood mulch delivered
  - Old mulch turned or removed (rate depends on depth)
  - Defined bed edges re-cut before install
    Rate:  $[XX]/yd × [X] yd = $[XXX]
    [Optional haul-away fee: $[XX]]

HEDGE TRIMMING (one-time or seasonal)
  - [X] hedges, approx [Y] total linear feet, up to [Z] ft tall
  - All debris removed from site
    Rate:  $[XX] flat

HURRICANE PREP (June–November)
  - Pre-storm yard walk + vulnerable branch removal
  - Secured items list coordinated with homeowner
    Rate:  $[XX] per activation, $[XX]/hr after first hour

================================================================
                          TOTAL
================================================================

One-time first visit total:   $[XXX]
Recurring monthly (if weekly): $[XXX]/mo
Annual estimate:              $[X,XXX] (before sales tax)

Sales tax (FL + Pinellas):    6.75% added at invoice time.
                              Sales tax registration (Sunbiz DR-1)
                              is deferred until cash basis supports
                              quarterly filing. Until then, this
                              quote shows pre-tax prices.

================================================================
                        TERMS
================================================================

  - First visit within 7 days of "go" reply.
  - Rain reschedules at no charge.
  - 48-hour satisfaction re-cut guarantee.
  - Payment due at visit completion (cash, Venmo, or card
    via Square on phone).
  - Quotes are estimates based on the property description
    at quote time. Material overages (mulch depth, hedge
    height) communicated before continuing.
  - No contract. No subscription. One-off or recurring.
  - Hurricane mode (sustained winds ≥30mph or named storm):
    all outdoor work paused until clearance. See
    largolawn.pro/hurricane-policy (post-domain).

================================================================

ACCEPT

Reply to this email with "go" + preferred first-visit date.

Or call/text: (727) 555-0123

================================================================
```

---

## Notes (don't print, but follow)

- **Don't pre-apply sales tax.** Showing pre-tax is allowed for quotes; tax applies at invoice. Defer DR-1 (FL sales-tax registration) until cash flow supports quarterly filing (~$1,000/mo run-rate). Until then: track accruals in a spreadsheet.
- **"Plus tier"** = same as Standard plus bi-weekly mulch refresh or hedge check.
- **"Premium tier"** = Standard + mulch + hedge + hurricane prep bundled at ~10% off.
- **Walk-the-yard first.** Don't quote mulch or hedge by phone alone. Photos can mislead by 30%.
- **Mention if you can't reach the back yard.** Notes the access constraints in the quote — saves the awkward "we got there and…" conversation on day one.
- **Quote #** helps tracking in your spreadsheet. Format: `Q-YYYYMMDD-LN-XX` (LN = last name initial).

## Why no fine print

The brand guideline commits to plain talk. No "subject to terms and conditions," no "this quote may be revoked at any time." If we say $X, we mean $X. The customer who reads the fine print is the customer we don't want anyway.