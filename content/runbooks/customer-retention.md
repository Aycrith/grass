# Runbook 6 — Customer Retention Playbook

> **Use:** Stop churn before it happens. Read before Month 3 (when you have recurring clients to retain).
> **Goal:** < 5% monthly recurring churn. Industry average for solo lawn-care is 8-12%/month.
> **Principle:** Retention is cheaper than acquisition. A $75/week customer retained for 3 years = $11,700. Replacing them = ~$200 in quote/invoicing/waiver/orientation time + 1-3 month ramp before they're profitable.

---

## Why customers churn (and how to prevent it)

### 1. Quality drift (40% of churn)

**Symptom:** Grass gets scalped. Edges get ragged. Missed spots. Blowing leaves clippings on the porch.

**Fix:**
- Quality bar is "wow" every visit, not "looks fine."
- Self-audit monthly: drive your own route and walk the lots as a customer would.
- After 6 months, ask 1-2 trusted customers to give you honest feedback.

### 2. Reliability drift (30% of churn)

**Symptom:** Showed up late without texting. Skipped a visit without telling them. Weather reschedule went poorly.

**Fix:**
- Text template S4 (on the way) before every visit.
- Never no-show. If something's wrong, text template S3 or T6.
- After a missed or late visit, send a personal apology text. Free service next visit. This recovers 90% of "I'm considering switching" customers.

### 3. Price shock (15% of churn)

**Symptom:** Customer pays first invoice, balks at second. Or: customer is fine for 6 months, then a new operator quotes them 30% less and they switch.

**Fix:**
- Price increases get 30-day advance notice (template in `content/email-templates.md` T5 variant).
- Annual increases should not exceed 8%. Customers can absorb 8% but not 15%.
- When raising prices, frame as scope change: *"We're adding mechanical edging to all weekly visits — rates go up $[X] starting [date]."* Easier to swallow than a flat increase.

### 4. Life change (10% of churn)

**Symptom:** Customer moves. Customer sells the house. Customer's kids grow up and the yard isn't a priority anymore. Customer goes through a divorce.

**Fix:**
- Can't prevent most life changes.
- Move-out courtesy: offer to do a final clean-cut free. They remember you and refer the new homeowner.
- New-homeowner handoff: leave a door hanger at the new owner's address (with the seller's permission). *"We mowed this lawn for [X years]. The new owner may want the same."*

### 5. Better offer (5% of churn)

**Symptom:** Customer's neighbor gets a flyer from a competitor offering 20% off.

**Fix:**
- Don't match price wars. Don't play the discount game.
- Reinforce value: *"We've been mowing this yard for [X months]. We know your hedges, your dog, your gate code. Switching costs you at least a month of orientation with a new operator."*
- This argument wins 80% of the time. The other 20% were going to leave anyway.

---

## The retention cadence

### Daily (per customer)

- Text template S4 (on the way) before every visit.
- Text template S5 (done) or invoice email after every visit.
- Drop review-magnet card if visit went well.

### Weekly

- Recurring customers get a "this week" reminder Sunday night (template T5 variant). One-touch only.

### Monthly

- Invoice by email or print copy. Recurring customers on autopay get a receipt only.
- Quality check: randomly pick 1 customer/week and visit their yard unannounced mid-cycle. Walk it as a customer would. Note anything off.

### Quarterly

- Check-in email (T5 variant). 5 minutes per customer. Catches the slow-leak churn before it becomes a cancellation.
- Note: This is the "is everything OK?" email. NOT the upsell email. There's a difference.

### Annually

- April (start of growing season): re-quote or confirm scope. Some customers have changed yards (new garden, new pool). Adjust scope.
- November (hurricane season end): thank-you + hurricane prep reflection. Sets up for next year's hurricane prep sales.
- December (holiday): hand-deliver a card. Not a gift — a card. Customers are tired of getting cheap merchandise from every vendor. A handwritten card stands out.

---

## Recovery scripts

### "I'm thinking of switching operators."

Customer text or email: *"We've been considering trying someone else this year."*

Reply within 4 hours:

*"Hi [first name], I appreciate you telling me. Would you be open to sharing what would make this a better fit? I want to make sure we earn the business, not just assume it. If there's something specific I can adjust — service scope, schedule, communication — I'm glad to talk. If you'd just like to try someone different, I get it. Either way, thanks for being a customer. — [Your first name]"*

Outcomes:
- 60% give you a specific issue you can fix. Fix it. Customer stays.
- 30% say "just trying it out." Set a re-engagement reminder for 90 days.
- 10% say "we've already booked someone." Wish them well, offer to leave the door open for return.

### "Can you do [service] for less?"

Reply: *"I can take a look at scope. What if we [remove X, simplify Y] — does that get to the budget? Or, alternatively, I can move you to bi-weekly instead of weekly. Happy to find a way."*

Don't negotiate price without negotiating scope. Discounting without scope reduction is how you go broke.

### "You missed a spot."

This is the most common complaint. Reply within 24 hours, no-charge re-visit within 48 hours. Don't argue. Don't ask for photos. Just go.

### "The grass is too short."

Reply within 24 hours: *"Sorry — I cut it lower than usual. I'll adjust for next week. Watering can help it recover; if it's a hot week, deep water 2x. No charge this week."*

### "Your team damaged [something]."

Reply within 4 hours, in person or phone: *"I'm coming out to look at this today."* Then go look. Don't fix it remotely. Don't blame-shift. Don't minimize. Customer wants to feel heard and see action.

---

## The "wow" moments that drive retention

These are the things customers remember and tell neighbors about:

1. **First-visit handoff.** Walk the lot together. Explain what you did and why. Customer feels informed.
2. **Storm recovery.** After a hurricane, you're there before anyone else. Send the check-in text (template S8). Customers remember who showed up.
3. **Quarterly check-in.** Most operators go silent between visits. A 3-line email catches people off-guard. *"Just checking — anything we should adjust for the spring growing season?"* Some respond with work; all respond with appreciation.
4. **Holiday card.** A handwritten card in December. "$25 off your December service if you'd like a pre-holiday cut." Most customers don't redeem — but they remember.
5. **The 5-year anniversary.** At 5 years of recurring service, send a hand-written thank-you note. Don't include a coupon. Just: *"Thanks for 5 years. The yard looks great. — [Your name]"* 5-year customers refer at 4× the rate of 1-year customers.

---

## The math

Target metrics:

| Metric | Target | Source |
|---|---|---|
| Monthly recurring churn | < 5% | Spreadsheet |
| Net Promoter Score (informal) | > 8/10 | Quarterly check-in |
| Repeat-customer rate | > 70% | Spreadsheet |
| Annual customer LTV | > $1,780 | Cash-min research |
| Customer-acquisition cost | < $50 | Spreadsheet |
| LTV:CAC ratio | > 35:1 | Computed |

If your CAC > $50, your distribution isn't working. If churn > 5%, your quality is drifting. If NPS < 7, your communication is off. Track these. Adjust the runbook quarterly.