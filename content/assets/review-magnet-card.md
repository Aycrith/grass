# Review-Magnet Card — Spec + Copy

> **Use case:** Hand to customer at job completion. Goal: 1 in 2 cards = a 5-star review.
> **Print:** 25 cards on Avery 5371 (5" × 7" postcard stock) at home, $0 incremental.
> **When to start:** Pilot #1 — print 10 cards for the first 10 jobs.

## Specs

- **Size:** 5" × 7" (heavy enough to feel valuable)
- **Stock:** Avery 5371 matte postcard stock
- **Color:** Two-sided color
- **Material cost:** ~$0.30/card at home printing

## Front

```
[logo-mark centered, 1.5" diameter, top-third]

LARGO LAWN

[2" gap]

LOVED YOUR MOW?

A 30-SECOND GOOGLE REVIEW
HELPS A LOCAL SMALL BUSINESS
MORE THAN YOU KNOW.

[QR code centered, 1.5" square, middle]
scan to leave a review
```

## Back

```
[centered text, ll-charcoal, 14pt]

Thanks for trusting us with your yard.

If you have 30 seconds, scan the QR code on the
other side — your Google review helps a local
small business compete against the big guys.

If anything's not right, text me directly:
(727) 555-0123

We'll make it right.

— [Your first name]

[footer, 8pt gray]
Mow · Edge · Mulch · Hedge · Hurricane Prep
```

## Why this works

- **"Loved your mow?"** is a question, not a directive. People say yes by leaving a review.
- **"Helps a local small business"** is the ask frame. People help small businesses; people distrust corporate CTAs.
- **"If anything's not right, text me directly"** is the trust move. Shows you're confident enough to invite criticism.
- **QR code, not URL.** Phone-first customers. URL is the fallback.

## Drop protocol

1. Complete the job.
2. Walk the lot with the customer if they're home.
3. At the end, hand them the card: *"If you have 30 seconds, this helps a lot."*
4. Send the email follow-up 2 hours later (template T4 in `content/email-templates.md`).
5. Send SMS follow-up S1 same evening.
6. Move on. Don't beg.

## Conversion math

- 10 cards dropped = expect 5-7 reviews over 14 days.
- 5-7 reviews = GBP ranking lift + 30-50% click-through improvement.
- Reviews compound. By 30 reviews, GBP impressions double.

## Home-print instructions

- Avery 5371 (5" × 7") postcards.
- Print 10 cards at first. Test. Order more once format is dialed.
- Use color printer; matte paper.
- Cut the QR code with scissors or paper trimmer. Quarter-inch bleed.

## Post-domain update

- Replace the QR code with one that points to your GBP review form URL (generated after GBP verification).
- Pre-domain: QR points to `https://largolawn.pro/review-placeholder` (404 for now, but the card looks ready).