# Runbook 5 — Quote-to-Close Playbook

> **Use:** From first customer inquiry to first paid visit. Read this end-to-end before your first quote.
> **Goal:** Convert 50-60% of inbound quote requests into paying customers within 14 days.
> **Principle:** Speed + clarity beats persuasion. Quote in 24 hours. Schedule in 7. Mow in 14.

---

## The funnel

```
Inbound inquiry  →  Quote sent  →  Quote accepted  →  First visit  →  Recurring
     100%              95%             55-65%             95%            60-70%
```

Where you lose money:
- **Inquiry → Quote** (5% lost): customer ghosts before you reply. Fix: reply in 4 hours, not 24.
- **Quote → Accepted** (35-45% lost): customer doesn't reply. Fix: single-touch follow-up on Day 6 (template in `content/templates/follow-up-card.md`).
- **First visit → Recurring** (30-40% lost): one-and-done customers. Fix: the wow cut + the review-magnet card.

---

## Stage 1 — Inbound (first 4 hours)

### Channels (in priority order)

1. **Phone call** — highest-intent. Answer or call back within 1 hour during business hours.
2. **Text message** — high-intent. Reply within 1 hour.
3. **Email** — moderate-intent. Reply within 4 hours.
4. **GBP tap / website contact form** — moderate-intent. Reply within 4 hours.
5. **Door hanger / yard sign callback** — high-intent (already saw the work). Reply within 1 hour.
6. **NextDoor / Thumbtack / referral** — varies. Reply within 4 hours.

### The first reply (any channel)

Use template T1 (welcome) from `content/email-templates.md` — even via text. It:

1. Acknowledges the request.
2. Asks the qualifying questions.
3. Sets a 24-hour window for the quote.
4. Gives a callback number.

Phone inbound uses script S1 from `content/phone-scripts.md`.

### The qualifying questions (ask before quoting)

In this order:

1. **Address** — confirm service area (33771 + 5 adjacent ZIPs).
2. **Property type** — single-family, townhome, vacant lot, commercial?
3. **Lot size** — "rough estimate is fine" → sq ft or fraction of an acre.
4. **Services needed** — mow, edge, mulch, hedge, hurricane prep, one-off or recurring.
5. **Frequency** — one-time, weekly, bi-weekly, monthly, or "as-needed."
6. **Access** — gated? Dogs? Side yard?
7. **When they want it** — "this week, next week, or just planning?"
8. **Decision-maker** — if the inquiry is from a non-owner (spouse, property manager), confirm they'll be available for the walk-through.

If the answer to #1 is outside the service area: polite decline. Don't take the job. Don't refer out. (Referrals eat time and the referred customer is usually high-maintenance.)

---

## Stage 2 — Walk-the-yard (before quote)

When the customer can meet on-site:

1. **Drive to the property** (15-30 min).
2. **Walk with the customer if present.** Otherwise walk alone.
3. **Measure what matters:**
   - Total turf area (estimate by walking it off — paces × pace length).
   - Linear feet of edging (curbs, walks, beds).
   - Hedge row length + height.
   - Bed area for mulch (sq ft).
   - Any obstacles: trees, gardens, playsets, slopes, drainage issues.
4. **Photograph** (4-6 photos): front yard, back yard, problem areas, access notes.
5. **Talk price ranges, not exact prices.** "Recurring mow for a yard this size is typically $[X]-[Y]." Let them anchor.
6. **Identify upsell opportunities** without pushing:
   - "Your beds are getting overgrown — mulch refresh is one of the things people add."
   - "These hedges need a trim — happy to include it in the quote."
   - Don't oversell. The brand is "no contract" — push and you contradict that.

---

## Stage 3 — Quote (within 24 hours)

Use template in `content/templates/quote-template.md`. Always:

1. **Itemize.** Never say "$X for everything." Itemize each service.
2. **Show both one-time and recurring rates.** Customer can compare.
3. **Show sales tax as a separate line.** 6.75% (FL 6% + Pinellas 0.75%).
4. **Set quote validity at 30 days.**
5. **Include the terms.** 24h rain reschedule, 48h satisfaction re-cut, payment options.
6. **Send via email.** PDF attached. Print copy if customer is old-school.
7. **Reply to your own quote email** to confirm send + set the Day-6 follow-up reminder.

### The 30-minute rule

Block 30 minutes on your calendar for "Quote: [address]" right after sending. This is for any customer who replies immediately with "wait, one more question." You're ready.

---

## Stage 4 — Single-touch follow-up (Day 6)

Use template in `content/templates/follow-up-card.md`. Email + text at the same time.

**This is the only follow-up.** No second, no third. If they don't reply, the quote expires in 30 days.

---

## Stage 5 — Quote accepted (within 24 hours of acceptance)

Use template T3 (visit confirmation) from `content/email-templates.md`. Confirm:

1. **Date + time of first visit.**
2. **Address verified.**
3. **Access confirmed** (gate code, dog, etc.).
4. **First-visit scope** (often: mow + edge + blow; mulch and hedge on second visit if quoted).
5. **Payment method.** Cash / Venmo / Zelle / Square on phone. Don't ask for payment upfront.
6. **Review-magnet card** will be hand-delivered at visit end.
7. **Calendar invite sent.** Even informal — text "save the date" works.

### Schedule confirmation (24 hours before)

Template S9 ("Schedule confirm — [day]"). Confirms and asks about any access changes.

### Day-of (S4 — on the way)

Text 30 minutes before arrival: *"On the way — ETA [X]."*

---

## Stage 6 — First visit (Day 0)

Runbook 1 — Day-of-Mow — covers this in detail. Key points for first visit:

1. **Text customer (if home)** at arrival: *"On site — starting now."*
2. **Walk the lot together** before starting if the customer is home. Show them what you'll do.
3. **Do the full work** (mow + edge + blow minimum; mulch + hedge if quoted).
4. **Walk the lot together** when done. *"Anything you want me to adjust?"*
5. **Hand the review-magnet card** (template in `content/assets/review-magnet-card.md`).
6. **Hand the invoice** (carbon copy or PDF).
7. **Collect payment.** Cash / Venmo / Zelle / Square.
8. **Receipt.** Create R-XXXX with date, amount, method.
9. **Convert to recurring.** If quote was one-off and the customer is happy: *"Same time next week?"*

---

## Stage 7 — Recurring conversion (after 1-3 visits)

The math: a $75/week customer × 52 weeks = $3,900/year. A $75 one-off customer × 1 visit = $75.

Recurring is 52× more valuable. Convert early.

### The ask (at end of visit #1)

*"Would you like me to put you on a regular schedule? Same day next week works for most of my clients — I can keep you on a standing slot so you don't have to think about it."*

### If they say yes

- Block the recurring slot on your calendar.
- Add to the recurring spreadsheet with cadence.
- Invoice on the same cadence.
- Auto-send template T3 (visit confirmation) every Sunday for the upcoming week.

### If they say no

- Accept it. Don't push.
- One-off is fine. Many customers convert after 3-4 one-offs.
- After visit #3, ask again: *"You've been great to work with — would recurring make sense? Same-day-every-week keeps you on priority if the weather gets weird."*

### If they say "next year"

- Set a reminder for April 1 ("recurring season starts"). One-touch re-engagement in spring.

---

## Stage 8 — Renewal + retention (continuous)

Recurring customers churn at ~5-10%/month without intervention. To keep them:

1. **Quality.** Don't cut corners. The wow-cut every time.
2. **Reliability.** Show up when you said. Weather reschedules happen but they're handled.
3. **Communication.** Text "on the way" + "done, invoice attached" every visit. Cumulatively: 4 touches/month/customer.
4. **Review-magnet card at every visit.** Reviews compound.
5. **Quarterly check-in.** January, April, July, October: *"How's everything going? Anything we should adjust?"* Template in `content/email-templates.md` (T5 variant).
6. **Holiday courtesy.** November: hand-deliver a holiday card. Not a gift — a card. "$20 off your December service if you'd like a pre-holiday cut." Low-cost retention play.

---

## Common drop-off points and fixes

| Drop-off | Cause | Fix |
|---|---|---|
| Inquiry → Quote | Slow reply | Reply within 4 hours, every time |
| Quote → Accepted | Customer ghost | Day-6 single-touch follow-up |
| First visit → Recurring | Customer "tries once" | Ask explicitly at end of visit #1 |
| Recurring churn | Quality or reliability issue | Quarterly check-in + wow-cuts every visit |
| Recurring churn | Price increase | 30-day notice + offer to renegotiate scope |

---

## What "closing" means

A "closed" deal = first paid visit completed. Not "quote accepted." Customers cancel between acceptance and visit. Customers cancel between visit and recurring. The deal is closed when money has changed hands for work performed.

Track conversion rates by stage in your spreadsheet. After 50 quotes, you'll know your numbers. After 100, you'll know your business.