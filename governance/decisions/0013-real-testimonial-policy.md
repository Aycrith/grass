# D-0013 — Real-Testimonial Policy (WP13 governance)

**Status:** Draft (from WP13 implementation, 2026-07-12)
**Decision date:** 2026-07-12
**Decision file:** `governance/decisions/0013-real-testimonial-policy.md`
**Review date:** First paid-pilot-job completion + 14 days
**Owner:** Steward (with Claude Code as drafter)

---

## Context

The LargoLawn.pro landing page has 14 sections including the
dormant `TestimonialQuote` component. The dormant state is a
deliberate choice rooted in the brand voice from
`brand/guidelines.md`: cannot invent customer quotes, cannot
paraphrase, only direct quotes from owner-recorded conversations
are eligible.

WP13 shipped the infrastructure that activates the moment a
real quote lands:

- `lib/content.ts → social.proof: ReadonlyArray<{quote, name,
  zip?, source?}>` — the canonical proof registry, currently
  empty.
- `TestimonialQuote` — section component that mounts on `/` in
  the 07 position the moment `social.proof[]` has ≥1 item.
- `/review` → `ReviewMagnetForm` — interactive 5-star review
  flow, gated on `reviewPage.reviewMagnetEnabled`, which routes
  4-5 star feedback to the GBP write-a-review URL and 1-3 star
  feedback to `/api/review-handler`.

This decision codifies the policy the steward applies when
deciding whether to seed a real testimonial into
`social.proof[]`.

---

## Decision

Real testimonials on `/` (via the dormant `TestimonialQuote`
component) and on `/review` (via the gated `ReviewMagnetForm`)
are governed by the following rules. These are binding on every
proof-item the steward commits:

### Eligibility

1. **Verbatim quote only.** No invented quotes. No paraphrased
   language. No "weasel-word" rewrites ("the customer said the
   service was great"). The published text must be the exact
   word-for-word transcript of what the customer actually said.

2. **Owner-recorded provenance.** A proof item is eligible only
   if one of these conditions is met:
   - The customer wrote a review (Google, Nextdoor, Yelp,
     Facebook) AND the steward has a screenshot or
     permalink to that review.
   - The owner (operator) had a recorded conversation with the
     customer (in person, phone, text) AND saved the transcript
     or note in the `research/proof/` folder.
   - The customer sent an unsolicited text / email praising
     the work AND the steward has the raw message saved.

3. **Explicit written permission.** Before publishing, the
   steward must have the customer's written permission (text
   reply, email, or signed note) to use their first name +
   neighborhood on the website. The proof-item shape supports
   `zip` as an optional neighborhood hint in lieu of full name.

4. **No financial inducement.** No discount, gift, or future
   service in exchange for the quote. Customers who thank the
   operator after the work is done: yes. Customers who are
   offered something for a quote: no.

### Workflow for seeding a new proof item

1. Save the original source to `research/proof/<date>-<initials>-
   <source>.md` (screenshot, transcript, raw message).
2. Add the proof item to `lib/content.ts → social.proof[]` with
   shape: `{ quote, name, zip?, source? }`.
   - `source` is a free-form string identifying where the
     quote came from (e.g. "Google review 2026-08-12",
     "Owner note from in-person conversation").
3. Open a PR with the source file + content.ts change.
4. Steward reviews; merges. The dormant `TestimonialQuote`
   section auto-activates on `/` the moment the array has ≥1
   item.

### Reactivation of `/review` flow

1. Confirm Google Business Profile is verified.
2. Update `lib/content.ts → reviewPage.gbpUrl` with the live
   write-a-review URL.
3. Flip `reviewPage.reviewMagnetEnabled: true`.
4. Open a PR with the two edits; steward reviews; merges.

---

## Alternatives considered

- **Synthesize quotes from operator voice.** Rejected.
  Brand guidelines prohibit invented customer quotes. The
  `OperatorNote` section already carries the operator's voice;
  customer testimonials must come from customers.

- **Use only third-party widget data (Yelp, Nextdoor).**
  Deferred. Dormant widget opt-in flags exist in
  `lib/content.ts → social` for next-round exploration, but
  they require customer-matching to load. Pulling in widget
  data without matching still falls under this policy.

- **Auto-publish from the review-handler API.** Rejected.
  Until Phase-3 (Supabase + email + moderation queue), the
  `/api/review-handler` endpoint is a stub that only logs.
  Manual steward curation is the policy.

---

## Risks

- **Slow accumulation.** Strict verbatim-only sourcing means
  the testimonials section may be dormant for months. The cost
  is intentional: trust is more valuable than a faster page.
- **Permission revocation.** A customer can withdraw consent.
  When this happens, the steward removes the proof item from
  `social.proof[]` in the same day. The `TestimonialQuote`
  component auto-deactivates if the array becomes empty.

---

## Verification

- `bun run audit:proof` (script to be added) confirms
  `social.proof[]` is empty.
- `grep -r 'invented\|made-up\|placeholder' apps/web/src/lib/
  content.ts` returns no fabricated quotes.
- Lighthouse `categories:accessibility ≥95` confirms proper
  alt + heading order when the section is mounted.

---

## Status

✅ Drafted 2026-07-12. Steward review on next session.
