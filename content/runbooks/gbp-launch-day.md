# GBP Launch Day — Hour-by-Hour Playbook

> **Use:** Read this runbook end-to-end BEFORE requesting the verification
> postcard. When the postcard arrives, follow it hour-by-hour.
> **Goal:** GBP goes live in <2 hours from postcard arrival. First
> week of GBP posts queued. First direction request / call received
> within 7 days.
> **Owner:** Steward (solo operator) + Mavis (orchestrator,
>  via this runbook + scripts).
> **Companion docs:**
> `drafts/gbp/profile-content.md` (the pre-publication content
>  draft — paste from here),
> `content/marketing/citation-data-package.md` (the 25-citation
>  build),
> `content/assets/gbp-photo-spec.md` (the photo design contract),
> `content/gbp-qa.md` (the Q&A pre-emptive post set),
> `scripts/citation-payload-generator.py` (the citation script),
> `scripts/gbp-photo-process.py` (the photo script).

---

## The 14-day countdown — what to do while waiting

When the verification postcard is requested, Google mails it
within 5-14 days. Use the wait time productively:

### Day 0 — request postcard

- [ ] **Confirm `apps/web/src/lib/business.ts → BUSINESS.address`
      is a real, mail-receivable address.** The postcard will not
      deliver to a P.O. Box.
- [ ] **Confirm `BUSINESS.phone` is the real phone number** (not
      a 555-XX-XXXX placeholder). Some verification calls
      happen by phone.
- [ ] Sign in to `business.google.com` with the same Google
      account the website is verified on (helps NAP consistency
      and unlocks some Google Posts features).
- [ ] Start the GBP creation flow; enter the NAP; pick
      "Lawn care service" as the primary category; add
      "Lawn maintenance service" + "Yard care service" as
      secondaries.
- [ ] **Hide the address** (SAB mode): Settings → Info → clear
      "Show customer-facing address". The address stays on
      file for verification; just hidden from public view.
- [ ] **Request the verification postcard.** It will mail to
      `BUSINESS.address` within 5-14 days.
- [ ] **Set a calendar reminder for Day 14:** "GBP postcard
      check — call Google if not received."

### Day 0-3 — submit 24 non-GBP citations (parallel work)

The GBP is gated on the postcard. The other 24 citations are
not. Use the wait time to submit them.

```bash
# Generate the 25 per-directory submission blocks
python scripts/citation-payload-generator.py emit \
  --output drafts/citations/<today>/
```

Then submit 16 in one sitting (afternoon 1) and the 8 with
screening calls in afternoon 2. See the
`citation-data-package.md → Day-of-execution checklist` for
the priority order.

### Day 0-7 — prepare the GBP launch content

- [ ] **Pre-stage the 10 photos** at `apps/web/public/work/`.
      Run `python scripts/gbp-photo-process.py avatar` for the
      720x720 logo avatar. Process the other 9 work photos.
- [ ] **Stage the 7-day GBP post queue** in a Google Doc or
      spreadsheet. See the [7-day post queue](#7-day-post-queue)
      section below.
- [ ] **Stage the GBP Q&A** in a separate Google Doc. Copy
      the Q&A from `content/gbp-qa.md` so you can paste each
      Q&A pair into the GBP dashboard when it goes live.
- [ ] **Confirm the GBP attribute set** (women-owned, veteran-
      owned, etc.) is empty (or filled correctly). See the
      [attribute set](#attribute-set) section.
- [ ] **Set up GBP insights baseline**: before launch, take a
      screenshot of the GBP dashboard at "0 views, 0 calls,
      0 directions". This is the t=0 baseline you'll measure
      against.

### Day 7-14 — handle the rest of the operational chain

- [ ] Print 50 door hangers (use `content/assets/door-hanger.md`
      for the design). Distribute within a 5-mile radius of the
      primary ZIP.
- [ ] Print 100 business cards (use `content/assets/business-card.md`
      for the design). Keep a stack in the truck.
- [ ] Print 1 yard sign (use `content/assets/yard-sign.md` for
      the design). Place on a high-visibility yard only with
      the customer's explicit permission.
- [ ] Set up a Twilio number for the business (or port the
      existing number). Twilio free tier covers ~$0.10/day of
      inbound SMS.
- [ ] Set up the free credit enrollments from
      `content/marketing/free-credit-enrollment.md` ($1,350+
      in ad credits, $0 cash out).
- [ ] Confirm `quote-to-close.md` runbook is read end-to-end
      and the quote template is ready
      (`content/templates/quote-template.md`).
- [ ] Set a calendar reminder: "GBP postcard expected today
      or tomorrow."

### Day 14+ — postcard check

If the postcard hasn't arrived by Day 14:
- [ ] **Do not** request a resend yet. The 14-day window is
      the median; some postcards take 21 days.
- [ ] **Day 21:** If still not received, request a resend via
      the GBP dashboard. The resend goes to the same address.
- [ ] **Day 28:** If still not received after 2 attempts,
      contact Google Business Profile support. There's a
      chat widget in the dashboard.

---

## Postcard arrival — hour-by-hour

### Hour 0:00 — open the postcard

- [ ] The postcard has the business name, address, and a
      **5-digit verification PIN** in big bold type. Don't
      discard the postcard yet.
- [ ] Photograph the postcard (front + back) and save to
      `audit/gbp-verification-<date>/`.
- [ ] Open `business.google.com` → your business →
      "Verify" → "Enter code".
- [ ] Enter the 5-digit PIN. The dashboard will refresh
      within 60 seconds.

### Hour 0:05 — GBP is now live

- [ ] **Take a screenshot of the live GBP dashboard.** This
      is t=0 for the metrics baseline.
- [ ] **Verify the NAP one more time** on the live dashboard.
      Any drift between business.ts and the live GBP is a
      problem to fix in the first 24 hours.
- [ ] **Verify the public-facing listing** by searching Google
      for "Largo Lawn" and "lawn care 33771". The GBP should
      appear in the local 3-pack.

### Hour 0:15 — initial settings

- [ ] **Hours:** confirm the live hours match `BUSINESS.hours`.
      GBP is picky — exact format, AM/PM or 24h.
- [ ] **Service area:** the 6-ZIP list. NOT a single radius.
- [ ] **Description:** paste the long variant from
      `citation-data-package.md → Business description (long
      variant)`. 750-char limit.
- [ ] **Opening date:** "2026" or specific month if known. Don't
      fabricate; "less than a year" is OK.
- [ ] **Phone:** confirm the real phone is showing, not a 555
      placeholder.
- [ ] **Website:** confirm the URL is `https://largolawn.pro`
      with the protocol.
- [ ] **Booking URL:** if Google Business Profile has the
      booking feature, set it to `https://largolawn.pro/quote`.
- [ ] **Attributes:** open the [attribute set](#attribute-set)
      section below.
- [ ] **Special hours:** none at launch. Google will let you
      set holiday hours in late November.
- [ ] **Messaging:** enable GBP messaging. Customers can text
      the business from the GBP. Set auto-reply to:
      ```
      Hi! Thanks for reaching out to Largo Lawn. We'll
      text you back within 1 business hour during our
      operating hours (Mon-Fri 7-5, Sat 8-2). For a same-
      day quote, share your address and lot size. —
      [First name], Largo Lawn
      ```
- [ ] **Q&A:** paste the pre-emptive Q&A from
      `content/gbp-qa.md` one pair at a time. Start with the
      top 3 (rain, frequency, license/insurance) so they're
      visible in the live dashboard.

### Hour 0:30 — first GBP post (the cover post)

GBP Posts are like mini-blog entries that appear in the
listing. The first post is the most important.

- [ ] Click "Add update" → "Add post" (or "Create post").
- [ ] **Post type:** "What's new" (the default).
- [ ] **Photo:** use the GBP cover photo (the freshly-mowed
      lawn, ideally with the truck visible in the background
      for a "this is real" signal).
- [ ] **Caption:**
      ```
      Hey neighbors — Largo Lawn is officially open for
      business. Mowing, edging, mulching, hedge trim, and
      pre-/post-storm hurricane prep. Free quotes within
      24 hours, no contracts, mid-market pricing. Type
      your ZIP at largolawn.pro to check coverage.
      ```
- [ ] **CTA button:** "Book online" → `https://largolawn.pro/quote`.
- [ ] Publish.

### Hour 0:45 — first-week setup

- [ ] **Stage the 7-day post queue** (see below) so the
      business is visible 7 days in a row.
- [ ] **Schedule each post** in the GBP dashboard (or paste
      the text into a calendar reminder; some GBP features
      let you schedule posts in advance).
- [ ] **Confirm Google Maps listing** is live. Open Google
      Maps, search for "Largo Lawn 33771", and confirm the
      business pin is in the right place. If the pin is
      off, click "Suggest an edit" → "Pin location" and
      drag it to the right spot.
- [ ] **Confirm Google Search listing** is live. Search
      "lawn care 33771" and "lawn care Largo" — the GBP
      should be in the local 3-pack within 7 days of
      verification.

### Hour 1:00 — first 24h monitoring

- [ ] **Set up GBP email alerts.** GBP sends an email
      when: (1) a new review is posted, (2) a Q&A is
      asked, (3) a photo is uploaded by a customer, (4)
      a message is received. The default is to send to
      the GBP owner's email. **Confirm the alerts are
      going to the right inbox.**
- [ ] **Set up GBP SMS alerts** (if available). Faster
      than email for time-sensitive items (especially
      new messages).
- [ ] **Check Insights** dashboard one more time before
      closing the launch window.

### Hour 1-24 — passive monitoring

- [ ] Don't refresh the dashboard every 5 minutes. GBP
      Insights has a 24-hour lag; checking once at Hour
      1 and once at Hour 24 is enough.
- [ ] If a Q&A is asked by a non-owner: reply within
      4 hours. Pre-staged answers cover 80% of
      questions; the rest are usually address-specific.
- [ ] If a review is posted: reply within 24 hours.
      Reviews are the #1 ranking factor; quick replies
      signal engagement.

### Day 2-7 — first week of posts

- [ ] Post 1 GBP post per day for the first 7 days. See
      the [7-day post queue](#7-day-post-queue) below.
- [ ] Day 7 review: check Insights for first-week
      numbers. Expect 50-200 views, 5-20 search
      appearances, 1-5 direction requests, 0-2 calls
      (industry medians for a new GBP in a medium-density
      service area).

### Day 7-30 — settle-in

- [ ] Continue posting 1-2 GBP posts per week.
- [ ] Add 2-3 new work photos to the GBP photo set.
- [ ] Reply to every Q&A, every review, every message
      within 24 hours.
- [ ] Day 30 review: check Insights for first-month
      numbers. Compare to industry medians.

---

## 7-day post queue

Post 1 per day for the first 7 days. Use the same
"What's new" post type with a different photo each day.

| Day | Caption | Photo |
|---|---|---|
| 1 | "Hey neighbors — Largo Lawn is officially open for business. Mowing, edging, mulching, hedge trim, and pre-/post-storm hurricane prep. Free quotes within 24 hours, no contracts, mid-market pricing. Type your ZIP at largolawn.pro to check coverage." | Cover photo (freshly-mowed lawn + truck) |
| 2 | "Mowing schedule for this week: Ridgecrest on Monday, Belleair Bluffs on Tuesday, Seminole on Wednesday. Same truck, same Tuesday, every week. Book at largolawn.pro/quote." | Truck or trailer photo |
| 3 | "What's the difference between mowing and edging? Mowing cuts the grass. Edging cuts the lawn-to-curb transition so the line is crisp against the walk. We include edging in every mow — it's not a separate charge. Pictured: a 33774 curb after a Tuesday visit." | Edging close-up |
| 4 | "Mid-week storm prep. We're checking the radar every 6 hours from Sunday through Wednesday. Pre-storm yard prep is $95-150 per activation; post-storm cleanup is hourly. Text us at (727) 555-0123 if you want on the prep list." | Pre-storm or work-in-progress photo |
| 5 | "Friday lawn refresh in 33773. 1/4-acre lot, weekly mow, mechanical edging along the driveway. Took 38 minutes, no bagging, no contracts. Same time next Friday." | Friday work photo |
| 6 | "Saturday hours: 8 AM to 2 PM. We do Saturday mows for customers who can't be home on weekdays. The rest of the week is route days — Tuesday 33771, Wednesday 33773, etc. Coverage check at largolawn.pro." | Saturday work photo (or wide shot of a finished yard) |
| 7 | "Week 1 of Largo Lawn in the books. 6 yards mowed, 2 edging-only visits, 1 mulch job booked for next week. Thanks to the neighbors who trusted us with the first visit. Next week's route is locked in." | Owner portrait or work-in-progress |

---

## Attribute set

GBP "Attributes" are the labels that appear under your
business name ("Identifies as: women-owned", "Accessibility:
wheelchair-accessible", etc.). For Largo Lawn in 2026:

### Always set (or leave blank honestly)

- **Identifies as:** leave blank unless the operator
  identifies with one of the categories (women-owned,
  veteran-owned, Latino-owned, Black-owned, LGBTQ+-owned).
  Do not falsely claim any identity.
- **Accessibility:** set the relevant flags. Most residential
  lawn care is a "mobile service" that goes to the customer,
  not a storefront. The "wheelchair-accessible" attribute
  doesn't apply to mobile services. The "free parking lot"
  doesn't apply either. Leave the accessibility attributes
  empty.

### Set if true

- **Service options:** "Onsite services" — TRUE for any
  service-area business. "Online estimates" — TRUE if the
  website's `/quote` page is functional. "Same-day
  appointments" — TRUE if the steward can commit to same-day
  (rare; default to "next-day").
- **Payments:** "Cash", "Venmo", "Zelle", "Credit cards" —
  set all that apply. Don't claim Apple Pay or Google Pay
  unless the steward actually accepts them.
- **Planning:** "Appointment required" — TRUE for the first
  month. After the route is established, "Accepts drop-ins"
  can be set.
- **From the business:** "Owned by [name]" — set if the
  steward wants personal transparency. "Identifies as" — see
  above.

### Do NOT set

- "Veteran-owned" unless the operator is a veteran.
- "Women-owned" unless the operator identifies as such.
- Any attribute that requires an "official" certification
  (e.g., "Minority-owned" certifications from the SBA).

---

## Pre-launch measurement baseline

Before requesting the verification postcard, capture a
baseline of the website + the absence of GBP:

| Metric | t=0 baseline | Day 7 target | Day 30 target |
|---|---|---|---|
| GBP views | 0 | 50-200 | 500-1,500 |
| GBP search appearances | 0 | 5-20 | 100-400 |
| GBP direction requests | 0 | 1-5 | 20-50 |
| GBP calls | 0 | 0-2 | 5-20 |
| GBP messages | 0 | 0-1 | 2-10 |
| Website sessions | (whatever it is) | +20% | +50% |
| Quote requests | (whatever it is) | 1-3 | 10-25 |

These are medians for a new GBP in a medium-density service
area (33771 has ~25K residents, 2-3K residential lots, 8-12
competing lawn care GBPs). Steward's actual numbers will
vary.

---

## What this runbook does NOT do

- Doesn't write the ad copy (that's in
  `content/marketing/ad-copy-decks.md`)
- Doesn't set up the free ad credits (that's in
  `content/marketing/free-credit-enrollment.md`)
- Doesn't set up conversion tracking (that requires GBP
  Insights to be live for 7+ days; do it in Week 2)
- Doesn't replace the steward — the steward is the operator;
  this runbook is the checklist, not the autopilot

---

## What to do AFTER launch

- **Week 1:** 1 post per day; reply to every Q&A, review,
  message within 24 hours.
- **Week 2-4:** 1-2 posts per week; refresh work photos
  every 2 weeks.
- **Week 4-12:** 1 post per week; post frequency is the
  single biggest engagement driver.
- **Quarterly:** refresh the cover photo (4x/year, once
  per season).
- **Ongoing:** monitor the citation NAP consistency with
  `scripts/citation-drift-monitor.py` (if available); fix
  any drift within 30 days.
