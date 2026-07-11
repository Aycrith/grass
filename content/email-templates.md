# Email Templates — Welcome, Quote-Confirm, Job-Reminder, Review-Request

> **Voice:** Brand voice (`brand/guidelines.md`) — plain, honest, local, warm, practical.
> **From address:** hello@largolawn.pro
> **Sending tool:** Resend + React Email (deferred — use Gmail for now until revenue justifies $20/mo)
> **All emails:** Plain text alternative + HTML rendered by Resend.
> **Length:** Each email under 200 words. People don't read lawn-care emails.

---

## T1 — Welcome (sent within 5 minutes of first contact)

**Subject:** Got your info — here's what happens next

```
Hey [first name],

Thanks for reaching out about [mowing / mulching / etc.]. Quick rundown
of how this works:

1. I'll come by [today / tomorrow] to look at the lot.
2. I'll send you a flat quote by email within 24 hours.
3. If you say yes, I'll get you on the schedule — usually within
   3-5 business days.
4. Day before each visit, you'll get a text confirmation.
5. After the visit, you'll get an invoice by email with a Pay Now link.

No subscription, no contract. Cancel any time, no fee.

Anything I should know about the lot? (gate code, dogs, irrigation,
anything you've been meaning to ask)

Talk soon,
[Your first name]
Largo Lawn · hello@largolawn.pro · (727) 555-0123
```

---

## T2 — Quote Confirm (sent within 24 hours of viewing lot)

**Subject:** Your quote for [address]

```
Hey [first name],

Here's the quote for [address] — same as we discussed:

Service: [bi-weekly mow + edge + blow]
Lot size: [half acre, flat, fenced back]
Per visit: $[X]
Includes: mowing, mechanical edging along all hard surfaces, blowing
clippings off walks and drives, grass-cycling clippings (unless you
want them bagged)

This price holds as long as the lot stays roughly the same. If you add
a fenced area, install irrigation, or want any add-ons (mulching,
hedge-trim, etc.), I'll quote those separately.

Ready to go? Just reply "yes" and I'll get you on the schedule.

Or if anything's off, reply with what you'd change and I'll re-quote.

[Your first name]
Largo Lawn
```

---

## T3 — Job Reminder (sent 24 hours before each visit)

**Subject:** Your mow is tomorrow morning

```
Hey [first name],

Quick reminder — your mow is scheduled for [tomorrow, Tuesday] between
[8:00 and 10:00 AM].

I'll text you the night before if anything changes (rain, schedule
slip). Otherwise, I'll just show up.

Gate code is [X]. Dogs are [inside / in the back / friendly]. Anything
else I should know? Just reply to this email.

Thanks,
[Your first name]
```

---

## T4 — Review Request (sent 2 hours after job completion)

**Subject:** How'd the mow look?

```
Hey [first name],

Just finished your mow. Hope it looks good.

If you have 30 seconds, a quick Google review helps a lot — most of
my new customers find me through reviews from people like you.

[Review link — generated after GBP verification, looks like:
 https://g.page/r/LARGO-LAWN-PROFILE/review]

Thanks so much. See you in two weeks.

[Your first name]
```

### Why 2 hours, not immediately

- They want to see the result before they review it.
- 2 hours gives them time to walk the yard, feel the cut, look at the edges.
- 24 hours = they forget. 2 hours = still top-of-mind.

### If they don't review in 7 days

- One follow-up: "Hey [name] — saw you didn't leave a review yet. No
  pressure at all — if you were happy, even a one-liner helps a ton.
  [link]"
- If still no review in 14 more days: stop asking.

---

## T5 — Quote Follow-Up (sent 7 days after quote if no response)

**Subject:** Still interested?

```
Hey [first name],

Circling back on the quote I sent [date] — wanted to make sure it
didn't get buried.

[If still the right price and timing:] Just reply "yes" and I'll
get you on the schedule.

[If anything changed:] If the price felt off, or the timing's not
right, tell me what'd work better. I'd rather lose the job than
have you not call back.

[Your first name]
```

---

## T6 — Weather Cancel (sent 6:30 AM day-of if rain forces push)

**Subject:** Pushing today's mow to [next clear day]

```
Hey [first name],

Rain's coming through today so we're pushing your mow to
[Wednesday]. No charge for the reschedule.

I'll text you tomorrow morning to confirm the new time.

[Your first name]
```

---

## T7 — Hurricane Mode Activation (sent 48 hours before named-storm impact)

**Subject:** Hurricane prep — we're switching to prep mode

```
Hey [first name],

[Storm name] is forecast to reach Pinellas County by [day]. We're
switching to hurricane prep mode for the next 48 hours:

- No regular mows until the storm passes + 24h.
- If you want pre-storm prep (securing loose items, removing
  vulnerable branches, photo-documenting yard condition for insurance),
  reply "prep" and I'll fit you in before [time tomorrow].
- After the storm, I'll reach out about debris cleanup. If you have
  emergency damage (downed tree on structure, etc.), call me
  directly at (727) 555-0123.

Stay safe,
[Your first name]
```

---

## Email anti-patterns (don't do these)

- ❌ HTML-only with no plain-text alt (some clients strip HTML).
- ❌ Multiple CTAs in one email (Pick A or B, not both).
- ❌ Subject lines in ALL CAPS.
- ❌ Attachments >500 KB (use links instead).
- ❌ Emojis in subject lines.
- ❌ "Hope this email finds you well" (cold and generic).
- ❌ Unsubscribe link missing (CAN-SPAM violation).