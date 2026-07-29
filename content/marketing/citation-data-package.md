# Citation Data Package — 25-Directory Build (OBJ-M2-006)

> **Purpose:** Single source of truth for the 25 citations required by
> Phase 2 exit criterion OBJ-M2-006. Every entry below has the data the
> steward (or the citation-payload-generator script) needs to file the
> business on that directory.
>
> **Hard rule (NAP consistency):** Name, Address, Phone must be
> character-for-character identical on every platform. The script
> `scripts/citation-payload-generator.py` enforces this by reading
> `apps/web/src/lib/business.ts` and re-rendering the NAP block for
> every directory entry. If a directory's form has a quirk (Yelp
> phone format, Bing URL no-trailing-slash, etc.), the per-directory
> override block specifies it.
>
> **Day-of-execution:** When the steward flips D-0007 phase B
> (publishing authorization), run the script with `--validate-only`
> first, then with `--emit` to drop the per-directory submission
> blocks into a date-stamped subdirectory under
> `drafts/citations/2026-MM-DD/`. Each block is paste-ready into
> the directory's business-profile form.

---

## Table of contents

1. [Master NAP block](#master-nap-block) — copy-paste anywhere
2. [Tier 1 — must-do, 5 days, $0](#tier-1--must-do-7-directories) (7 dirs)
3. [Tier 2 — high-value, 2 weeks, $0](#tier-2--high-value-8-directories) (8 dirs)
4. [Tier 3 — industry + local, month 2-3, mostly $0](#tier-3--industry--local-10-directories) (10 dirs)
5. [Service-area business (SAB) coverage rules](#sab-coverage-rules)
6. [Photo + caption set](#photo--caption-set)
7. [Posting cadence](#posting-cadence)
8. [Verification status by directory](#verification-status-by-directory)
9. [Day-of-execution checklist](#day-of-execution-checklist)
10. [What NOT to do](#what-not-to-do)

---

## Master NAP block

> **Source of truth:** `apps/web/src/lib/business.ts → BUSINESS.*`
> Re-render this block on every directory. **Do not edit by hand.**

**SAB mode (the default — no street address anywhere except GBP verification):**

```
Largo Lawn
Largo, FL 33771
+1-727-313-8011
hello@largolawn.pro
https://largolawn.pro
```

**GBP-only block (includes street address for verification):**

```
Largo Lawn
[street address on file with the steward — see `business.ts`]
Largo, FL 33771
+1-727-313-8011
hello@largolawn.pro
https://largolawn.pro
```

### NAP-consistency rules

- **Name:** "Largo Lawn" — never "LargoLawn" or "Largo Lawn Care" or
  "LargoLawn.pro" or "Largo Lawn Service". A solo brand, one name.
- **Address:** the business operates as a service-area business
  (SAB). Per the steward's explicit instruction (2026-07-26), the
  street address is **not** included in any public-facing citation,
  on the website, in the JSON-LD, or anywhere else. The address
  is held privately by the steward for the single use case of the
  GBP verification postcard (the one directory that requires a
  mail-receivable address). All 24 other directories get the
  city/state/zip only.
- **City:** "Largo" — not "Largo, FL 33771" as a single string
  (the ZIP and state have their own fields on every platform).
- **State:** "FL" — not "Florida".
- **ZIP:** "33771" — 5 digits, no ZIP+4.
- **Phone (display):** "+1-727-313-8011" — the canonical dashed
  form. **Phone (tel):** "+17273138011" — only used in `tel:` hrefs.
- **Email:** "hello@largolawn.pro" — lowercase, no display-name
  prefix.
- **URL:** "https://largolawn.pro" — no trailing slash, include
  `https://` (the script auto-strips it for platforms that reject
  it; see the per-directory override block).

### What if the address ever needs to change?

The address lives in **one place** in the website code
(`apps/web/src/lib/business.ts → BUSINESS.address`). To update
every citation, run `bun scripts/citation-payload-generator.py
emit` after the source change. The script does NOT push to the
directories automatically — it regenerates the paste blocks so
the steward can update each directory manually.

The `addressPublic` flag in `business.ts` is a hard gate: when
`false` (the default), the street address is **never** rendered
on the website or in any citation block. When the steward
flips it to `true` (e.g., for a future storefront), the
address appears everywhere. The citation script respects this
flag — see `scripts/citation-payload-generator.py →
render_nap_block`.

(See `content/marketing/sab-strategy.md` for the policy on
service-area business address visibility — most directories
let you hide the address from public view while keeping it
for verification.)

---

## Tier 1 — must-do, 7 directories

> **Goal:** the 7 directories Google cross-references most often in
> its local pack ranking. Free, all in one afternoon.

| # | Directory | URL | Why it matters | Time | Cost | Verification |
|---|---|---|---|---|---|---|
| 1 | Google Business Profile | business.google.com | The single biggest local SEO factor; gate for Google Maps | 30 min (after postcard) | $0 | Postcard (5-14 days) |
| 2 | Apple Maps Connect | mapsconnect.apple.com | Siri + iPhone default maps; high-income demographic | 10 min | $0 | Apple ID + phone |
| 3 | Bing Places | bingplaces.com | Powers Apple Maps, in-car nav, Cortana; ~10% of local search | 10 min | $0 | Email |
| 4 | Facebook Business Page | facebook.com/business | Largest social graph; lead forms; messenger inquiries | 20 min | $0 | Email |
| 5 | Yelp Business | biz.yelp.com | High-intent local buyers; reviews feed Google's "review count" badge | 20 min | $0 | Phone call |
| 6 | Nextdoor Business | business.nextdoor.com | Hyperlocal neighborhood platform; free local recommendations | 15 min | $0 | Address postcard |
| 7 | LinkedIn Company Page | linkedin.com/company/setup | B2B signal for property managers + commercial; small but nonzero | 15 min | $0 | Email |

**Per-directory notes:**

### 1. Google Business Profile (business.google.com)

- **Critical:** must wait until `apps/web/src/lib/business.ts →
  BUSINESS.address.line1` is a real mail-receivable address (the
  postcard has to deliver). Use the address visible on the website's
  footer + contact page, otherwise the GBP gets suspended.
- **Hide address (SAB mode):** Settings → Info → clear "Show
  customer-facing address". The address is still on file for
  verification; just hidden from public view.
- **Categories:** primary "Lawn care service" (NOT "Landscaper" —
  see `research/seo/largo-keyword-map.md`). Add 2-3 secondary
  ("Lawn maintenance service", "Yard care service", "Gardener").
- **Service area:** use the 6-ZIP block, NOT a radius in miles
  (radius is for non-SAB; the 6-ZIP list is more precise for
  hyperlocal and avoids overlap with competitors in 33760, 33762,
  etc. that we don't serve).
- **Hours:** copy from `BUSINESS.hours`. GBP is picky — exact
  format, 24h or AM/PM, never "by appointment" only.
- **Description:** 750-char limit. Use the **long** variant from
  the [description block](#business-description-1500-char-max).
- **Photos:** upload 10 photos in order. Set the logo as the
  profile photo; the wordmark as the cover photo.
- **Verification:** postcard arrives 5-14 days. Don't request a
  resend for at least 14 days. The code is a 5-digit PIN; enter
  in the dashboard, not via a phone call.

### 2. Apple Maps Connect (mapsconnect.apple.com)

- **Sign-in:** Apple ID. Use the steward personal one if the
  business doesn't have an iCloud-managed Apple ID yet (iCloud
  custom domains cost $0.99/mo minimum, defer).
- **Add Place** → claim the existing pin first if the address
  already auto-created one; otherwise "Add a new place".
- **Categories:** pick "Home Services > Lawn & Garden" or
  "Home Services > Landscaping". The category list is shorter
  than Google's; pick the closest match.
- **URL field:** "https://largolawn.pro" — Apple Maps accepts
  the protocol.
- **Photos:** 1-3 is enough (logo + 1 work photo). Apple
  doesn't render as many as GBP.
- **Verification:** phone call or email to the steward. <1 hour.

### 3. Bing Places (bingplaces.com)

- **Sign-in:** Microsoft account (Outlook, Live, Hotmail, or the
  steward's personal account). No business-domain email needed.
- **Import from Google:** if GBP is already live, Bing has an
  "Import from Google Business Profile" button that pre-fills
  80% of the form. This is the recommended path — paste the
  NAP overrides only if the import missed them.
- **URL field:** "https://largolawn.pro" — Bing auto-strips
  the protocol, so paste "largolawn.pro" instead.
- **Categories:** "Lawn care" (Bing's primary category list is
  shorter than Google's; closest match).
- **Description:** 250-char limit. Use the **medium** variant.

### 4. Facebook Business Page (facebook.com/business)

- **Create a Page** (not a personal profile). Pick
  "Local Business" → "Service" (not "Shopping & Retail" or
  "Company").
- **Username:** "largolawn" — first-come-first-served. The URL
  becomes `facebook.com/largolawn`.
- **Hours:** match GBP exactly. Facebook auto-formats.
- **CTA button:** "Book Now" (links to https://largolawn.pro/quote
  or `/contact`). "Send Message" as a secondary option.
- **Photos:** upload all 10. Facebook is a photo-heavy platform;
  the more the better.
- **Description:** 255-char limit. Use the **medium** variant,
  but also add a "About" section with the long variant (Facebook
  has a separate "About" field that doesn't count against the
  255-char description cap).
- **Verification:** instant for "Local Business" pages; no
  postcard.

### 5. Yelp Business (biz.yelp.com)

- **Claim or create** the business. Yelp may already have an
  unclaimed listing for "Largo Lawn" if any prior customer
  added it.
- **Phone format:** Yelp wants "(727) 555-0123" — the
  parenthesized form, NOT "+1-727-555-0123". The script
  auto-formats the phone when emitting the Yelp block.
- **Website URL:** "largolawn.pro" — no protocol.
- **Categories:** "Landscaping" or "Lawn Services". Yelp's
  primary categories are not as granular as Google's; pick the
  closest match.
- **Services list:** ≤30. Use the [service catalog](#service-catalog-yelp-specific-30-services-listed)
  block.
- **Specialties:** free-text, 5 short bullets. E.g., "Mowing
  (weekly, bi-weekly)", "Mechanical edging", "Mulch install
  (delivered + spread)", "Hedge trim (low/med/tall)",
  "Hurricane prep".
- **History:** "Founded 2026" + 1-2 sentences. Don't fabricate
  more than 1 year of history.
- **Photos:** logo + 3 work photos minimum. Yelp reviewers
  expect to see work, not stock photos.
- **Verification:** phone call within 1 business day. Yelp
  calls from an automated number; answer or call back.

### 6. Nextdoor Business (business.nextdoor.com)

- **Sign-up:** use the steward's personal Nextdoor account to
  claim the business address. Nextdoor is hyperlocal — the
  business will appear in the "Local Favorites" recommendation
  feed for verified neighbors.
- **Categories:** "Landscaping & Lawn Care" or "Home Services"
  if the former isn't available.
- **Posts:** Nextdoor rewards posts (mini-blog style) over
  static profiles. Plan 1-2 posts/month: "Mowed 6 yards in
  Ridgecrest this week, here's the truck", "Hurricane prep
  is on — $95/visit, 24-hour booking".
- **Verification:** address postcard (~7-10 days). Add the
  business to the steward's personal account first, then
  upgrade to a Business Page from the dashboard.
- **NOTE:** Free for a single local business; "Neighborhood
  Favorite" status (paid) is defer until the first 5 paid
  pilots land.

### 7. LinkedIn Company Page (linkedin.com/company/setup)

- **Create a Company Page** → "Small business". Use the
  steward's personal LinkedIn as the admin.
- **Tagline (120 char):** "Local lawn care in Largo FL —
  mow, edge, mulch, hedge, hurricane prep."
- **About (2,000 char):** the **long** variant.
- **Industry:** "Facilities Services" or "Environmental
  Services" — pick the closest match.
- **URL:** custom URL is "linkedin.com/company/largolawn".
- **Logo + cover:** upload both. Cover image size 1128×191.
- **Verification:** instant via email. No postcard.
- **Low value for residential:** LinkedIn is mostly a B2B
  signal. The page exists for the citation, not for leads.
  Skip posting unless property-manager leads start
  materializing.

---

## Tier 2 — high-value, 8 directories

> **Goal:** the 8 directories that consistently surface in local
> pack data aggregators (Moz Local, Yext, BrightLocal). Free, all
> in a week.

| # | Directory | URL | Why | Time | Cost | Verification |
|---|---|---|---|---|---|---|
| 8 | Yellow Pages | yellowpages.com | High DA; legacy trust signal; Apple's directory fallback | 15 min | $0 | Phone or email |
| 9 | Superpages | superpages.com | Verizon-owned; high DA; thryv network | 15 min | $0 | Phone or email |
| 10 | Manta | manta.com | SMB directory; high DA; small-business ad channel | 15 min | $0 | Email |
| 11 | BBB | bbb.org | Trust signal; "A+" rating is a real lead-conversion boost | 30 min | $0 (unaccredited) | Email + documents |
| 12 | MapQuest | mapquest.com/business | Legacy map platform; in-car nav fallback | 15 min | $0 | Email |
| 13 | TomTom | business.tomtom.com | Powers some car infotainment; small but high-trust | 15 min | $0 | Email |
| 14 | Foursquare for Business | business.foursquare.com | Powers location data for many apps; venue-listing API | 20 min | $0 | Email |
| 15 | Citysearch | citysearch.com | Older directory, still has DA; legacy citations | 15 min | $0 | Email |

### Per-directory notes

#### 8. Yellow Pages (yellowpages.com)

- **Claim or add** the listing. Yellow Pages auto-creates
  listings from public records; the steward may need to claim
  an existing one.
- **Categories:** "Lawn & Yard Work" or "Landscape
  Contractors".
- **Description:** 200-char limit. Use the **medium**
  variant, trimmed.
- **Hours, photos, URL:** same as GBP block.
- **Verification:** phone call OR email. Fast.

#### 9. Superpages (superpages.com)

- **Owned by Thryv** (small-business software network). Create
  a free Thryv account, then add the business profile.
- **Categories:** "Lawn & Grounds Maintenance".
- **URL field:** "largolawn.pro" — no protocol.
- **Photos:** 1-3. Logo + 1 work photo is enough.
- **Verification:** email confirmation. <1 hour.

#### 10. Manta (manta.com)

- **Free profile** + optional paid "Manta Pro" tier ($99/yr,
  defer). The free tier is the citation.
- **Categories:** "Lawn & Garden Services" or "Landscape
  Services".
- **Description:** 200-char limit. **Medium** variant.
- **Company description (long):** 1000-char. **Long** variant.
- **Photos:** logo + 1-3 work photos.
- **Verification:** email.

#### 11. BBB (bbb.org)

- **Apply for BBB Accreditation** OR create a free listing
  without accreditation. Accreditation costs ~$500/yr and is
  defer; the free listing is the citation.
- **Categories:** "Lawn & Tree Care" or "Landscape
  Contractors".
- **EIN / business-license fields:** leave blank if not yet
  filed. BBB allows sole-proprietor listings without an EIN
  (you just can't claim "accredited business").
- **Hours, photos:** same.
- **Verification:** email + a phone call from a BBB
  representative. May take 1-2 weeks for the listing to
  appear in search.

#### 12. MapQuest (mapquest.com/business)

- **Claim or add** the listing. MapQuest is a Verizon product
  (same as Superpages). The submission UI is the same.
- **Categories:** "Lawn Services" or "Landscape".
- **URL field:** "largolawn.pro" — no protocol.
- **Photos:** 1-3.
- **Verification:** email.

#### 13. TomTom (business.tomtom.com)

- **MyPlaces** (the consumer side) + business portal. The
  business portal is free; you can add POIs.
- **Categories:** "Garden & Lawn".
- **Coordinates:** optional. If `apps/web/src/lib/business.ts`
  has lat/long, paste. If not, leave blank and TomTom geocodes
  from the address.
- **Photos:** 1.
- **Verification:** email.

#### 14. Foursquare for Business (business.foursquare.com)

- **Create or claim a venue.** Foursquare is now primarily a
  data-licensing platform (powers many apps) but the public
  listing is still crawled.
- **Categories:** "Home / Residential / Lawn & Garden".
- **URL field:** "https://largolawn.pro" — full protocol.
- **Hours:** Foursquare uses a JSON-style hours block; the
  script emits the structured form.
- **Photos:** 1-3.
- **Verification:** email + venue claim phone call.

#### 15. Citysearch (citysearch.com)

- **Owned by CityGrid Media** (a joint IAC/Insight
  Partners property). Legacy directory with high DA.
- **Add or claim** the business.
- **Categories:** "Lawn Services" or "Landscaping".
- **URL field:** "largolawn.pro" — no protocol.
- **Description:** 200-char. **Medium** variant.
- **Photos:** logo + 1-2.
- **Verification:** email. 1-2 weeks to surface in search.

---

## Tier 3 — industry + local, 10 directories

> **Goal:** industry-specific (lawn, home-services) directories
> that pass high-DA links + Pinellas-local directories that
> matter for "Largo lawn care" search. Some have lead-generation
> friction (paid plans); for cash-min mode, only the **free**
> tier of each.

| # | Directory | URL | Why | Time | Cost | Verification |
|---|---|---|---|---|---|---|
| 16 | Angi (formerly Angie's List) | angi.com | Lead-gen; high-intent; $30/lead average | 45 min | $0 to list; pay per lead | Email + phone |
| 17 | HomeAdvisor | homeadvisor.com | Lead-gen; high-intent; home services focus | 45 min | $0 to list; pay per lead | Phone screening |
| 18 | Thumbtack | thumbtack.com | Lead-gen; project-based; growing market share | 30 min | Pay per lead | Email + phone |
| 19 | Porch | porch.com | Lead-gen; project-based; growing market share | 30 min | Pay per lead | Email |
| 20 | Houzz | houzz.com/pro | Design-savvy; landscaping pros; high-end leads | 30 min | $0 to list; pay per lead | Email + photo |
| 21 | Bark | bark.com | Lead-gen; UK-born, growing in US; project-based | 20 min | Pay per lead (optional) | Email |
| 22 | LawnSite | lawnsite.com | Industry forum; citation signal; "credentials" badge | 30 min | $0 | Email |
| 23 | Greater Largo Chamber of Commerce | largochamber.com | Hyperlocal; "member" badge; networking | 30 min | $200-300/yr (defer to pilot revenue) | Email + payment |
| 24 | Patch (Largo Patch) | patch.com | Local news + business listings; high-DA local | 20 min | $0 | Email |
| 25 | CityOf.com | cityof.com/largo | City-specific directory; lower DA but free | 15 min | $0 | Email |

### Per-directory notes

#### 16. Angi (angi.com)

- **Apply for Pro account.** Free to list; you pay per lead
  (~$30/lead average for landscaping). Set the daily-lead
  cap to 1 to start.
- **Profile completeness matters:** 100% profile = 3× more
  leads per Angi's published data. Fill every field.
- **Categories:** "Lawn & Yard Work", "Landscaping".
- **Photos:** 5+ work photos. Angi reviewers weight photos
  heavily.
- **License/insurance fields:** leave blank. Angi allows
  unverified profiles; you get a "background check not
  completed" badge that most customers ignore.
- **Verification:** email + a screening call from an Angi
  rep (~30 min phone interview).
- **Lead-gen cost:** $0 up-front, $30-50 per qualified
  lead. Don't enable pay-per-lead until the GBP is converting
  (Month 2+). Pre-launch, list but don't enable leads.

#### 17. HomeAdvisor (homeadvisor.com)

- **Apply for Pro account.** Free to list; pay per
  lead. Similar model to Angi.
- **Categories:** "Lawn & Yard Work".
- **Profile:** same 100% completion rule as Angi.
- **Photos:** 5+.
- **Screening call:** ~20 min phone interview. HomeAdvisor
  vets pros more aggressively than Angi.
- **Pre-launch:** list, don't enable leads. Wait for GBP
  traction.

#### 18. Thumbtack (thumbtack.com)

- **Pro profile.** Free to list; pay per lead. Thumbtack's
  per-lead cost is lower than Angi ($5-15/lead) but the
  leads are also lower-intent on average.
- **Categories:** "Lawn Mowing", "Landscaping", "Hedge
  Trimming", "Mulching".
- **Photos:** 5+ work photos.
- **Pre-launch:** list, don't enable leads.

#### 19. Porch (porch.com)

- **Pro profile.** Same model as Thumbtack.
- **Categories:** "Lawn & Yard Work".
- **Photos:** 5+.
- **Pre-launch:** list, don't enable leads.

#### 20. Houzz (houzz.com/pro)

- **Pro profile.** Free to list. Lead-gen via "Find Pros"
  search; some paid placement.
- **Categories:** "Landscape Contractors", "Lawn & Yard
  Work".
- **Photos:** 10+ work photos, **ideally with before/after
  pairs**. Houzz is design-oriented; high-quality photos
  get 4× the leads per Houzz's published data.
- **Pre-launch:** list, enable free leads only.

#### 21. Bark (bark.com)

- **Pro profile.** Free to list. Lead-gen via project
  requests; small but growing in Florida.
- **Categories:** "Lawn & Garden Services".
- **Photos:** 3+.
- **Pre-launch:** list, don't enable paid leads.

#### 22. LawnSite (lawnsite.com)

- **Forum profile.** Not a "business directory" but a
  high-DA industry forum. The "credentials" badge in the
  signature + a profile with the business info is a citation.
- **Sign up + introduce yourself** in the "Introduce
  yourself" forum. Be honest: "Solo operator, just starting
  in Largo, FL. Mowing, edging, mulching, hedge trim,
  hurricane prep."
- **No paid plan**; the citation is the forum profile +
  signature link.
- **Time:** 30 min total.
- **Strategic:** LawnSite is the lawn-care industry's
  de-facto community forum. A low-key presence builds
  goodwill with industry suppliers, peer operators, and
  referral partners (e.g., arborists who refer hedge-removal
  work).

#### 23. Greater Largo Chamber of Commerce (largochamber.com)

- **Apply for membership.** Cost: $200-300/yr for a
  solo-operator tier (verify on the chamber's pricing page).
  **DEFER** to OBJ-M2-006 reactivation trigger: "First
  paying customer OR pilot revenue covers the dues".
- **Why it matters:** "Chamber member" badge on the website
  footer is a small but real conversion boost. Also a
  networking source for referral partners (real estate
  agents, property managers).
- **When dues are ready:** apply for membership, list as
  the NAP, add the chamber badge to the website footer.
- **For now:** list the business in the chamber's public
  search by emailing the chamber admin. Free, no badge.

#### 24. Patch (Largo Patch)

- **Add business listing** at patch.com. Patch is a
  hyperlocal news + directory network owned by AOL/Patch
  Media.
- **Categories:** "Home & Garden" or "Lawn & Garden".
- **URL field:** "https://largolawn.pro" — full protocol.
- **Photos:** logo + 1 work photo.
- **Verification:** email. Listing goes live in 1-2 weeks.
- **Optional:** write a "sponsored post" introducing the
  business to Largo Patch readers. ~$50/post; defer.

#### 25. CityOf.com (cityof.com/largo)

- **Free city directory.** Lower DA but free and easy.
- **Categories:** "Landscaping & Lawn Care".
- **Description:** 200-char. **Medium** variant.
- **Photos:** logo.
- **Verification:** email.
- **Time:** 15 min. Last on the list because the lowest
  expected ROI; do it for the "completed 25" tally.

---

## Business description (1500-char max)

> **Source:** the script auto-renders all three variants from
> `apps/web/src/lib/business.ts` + a hardcoded description
> constant in the script config.

### Short (50 char)

```
Local lawn care in Largo FL - mow, edge, mulch, hedge, hurricane prep.
```

### Medium (200 char)

```
Largo Lawn is a locally-owned lawn-care service for homeowners in Largo,
FL and the surrounding Pinellas County ZIPs. Mowing, edging, mulching,
hedge trimming, hurricane prep. Free quotes within 24 hours.
```

### Long (500 char)

```
Largo Lawn provides residential lawn-care services to homeowners in Largo,
FL 33771 and adjacent Pinellas County ZIPs. We're a solo operator - when
you call, you talk to the person doing the work. Services include weekly
and bi-weekly mowing, mechanical edging, mulching and bed maintenance,
hedge trimming, and pre-/post-storm hurricane prep. Quotes are free and
returned within 24 hours. Pricing is mid-market: weekly mowing of a 1/4-acre
lot is $48/visit, edging is included in every visit. Hurricane prep is a
flat $95-150 per activation. No contracts, no subscription required.
Cash, Venmo, Zelle, or card on phone. Locally owned; not a franchise.
```

### Yelp-specific (~1000 char)

```
Locally-owned residential lawn care in Largo, FL 33771 and surrounding
ZIPs. Solo operator - when you call, you talk to the person doing the
work. Services: weekly and bi-weekly mowing, mechanical edging, mulching,
hedge trimming, hurricane prep. Mid-market pricing. Free quotes within
24 hours. No contracts, no subscriptions. Same-day quote; same-week first
visit. Cash, Venmo, Zelle, card-on-phone accepted.
```

### LinkedIn-specific (2000 char)

The long variant. LinkedIn has a 2,000-char About field; the long
500-char description is well under.

---

## Categories (use EXACTLY as listed)

### Primary

`Lawn care service` (NOT "Landscaper" — see
`research/seo/largo-keyword-map.md` for the search-volume
rationale: "lawn care" has 4× the search volume of "landscaper"
in 33771 and a lower keyword difficulty).

### Secondary (pick 2-3)

- `Lawn maintenance service`
- `Yard care service`
- `Gardener`

(`Tree service` is excluded per CLAUDE.md Mission 1 — no tree work
until the appropriate Florida license is acquired.)

---

## Service catalog (Yelp-specific, ≤30 services listed)

```
Mowing (weekly, bi-weekly, monthly)
Mowing (one-time / clean-up)
Edging (mechanical, curbs/walks/beds)
Mulching (delivery + install)
Mulching (refresh, existing beds)
Hedge trimming (low / medium / tall)
Hedge removal
Hurricane pre-storm prep
Hurricane post-storm cleanup
Seasonal cleanup (leaves, branches)
Yard clean-up (one-time)
```

---

## Hours (template — set your actual hours before publishing)

```
Mon:  7:00 AM - 5:00 PM
Tue:  7:00 AM - 5:00 PM
Wed:  7:00 AM - 5:00 PM
Thu:  7:00 AM - 5:00 PM
Fri:  7:00 AM - 5:00 PM
Sat:  8:00 AM - 2:00 PM
Sun:  Closed (hurricane-mode only)
```

> **Source:** `apps/web/src/lib/business.ts → BUSINESS.hours`
> Keep in sync. When the steward changes business hours, run
> the script with `--emit` and update every directory.

---

## Service area (paste into the platform's "Service Area" field)

```
Largo, FL 33771 (primary)
Largo, FL 33770
Largo, FL 33773
Largo, FL 33774
Largo, FL 33778
Clearwater, FL 33756 (edge)
```

**Service radius:** 7 miles from primary ZIP (covers all 6
ZIPs above).

> **Source:** `apps/web/src/lib/business.ts →
> BUSINESS.service_area_zips` (the 6-ZIP array).
> **Order matters** — 33771 is primary on every platform.
> 33756 is the geographic edge; 33778 is the "I do this
> one because it's on the way home" zone.

---

## SAB coverage rules

A **service-area business (SAB)** is one that serves customers
at their location, not at a storefront. Google, Yelp, and most
directories have specific rules for SABs:

- **Address field:** the business operates in strict SAB mode
  (per the steward's explicit instruction, 2026-07-26). The
  street address is **never** included in any public citation
  block. The address is held privately by the steward for the
  single use case of the GBP verification postcard. The
  `render_nap_block` function in
  `scripts/citation-payload-generator.py` enforces this
  policy: the GBP directory is the only one that can include
  the street address, and only for the verification flow.

  - **For the GBP:** the steward enters the address directly
    at `business.google.com` (NOT via the citation script).
    After verification, the steward hides the address from
    public view in the GBP dashboard (Settings → Info → clear
    "Show customer-facing address"). The website, all 24
    other citations, and the JSON-LD all stay in SAB mode.

  - **For all other directories:** the citation block
    contains only city/state/zip. This is the standard SAB
    pattern; most directories accept it.

  - **Do not** use a P.O. Box. Even in SAB mode, the GBP
    requires a real mail-receivable address for the
    verification postcard.
- **Public visibility of address:** on most directories, the
  address is already private by default in SAB mode. The
  citation script enforces this; the steward does not need to
  toggle "hide address" manually on every directory.
- **Service area field:** list the cities/ZIPs you serve,
  not a single "service area radius in miles" (the 6-ZIP
  list is more precise for hyperlocal).
- **Categories:** use "service" categories ("Lawn care
  service"), not "storefront" categories ("Garden center",
  "Nursery").

> **Policy source:** `content/marketing/sab-strategy.md`
> covers the broader SEO + legal-entity rationale. This
> document is the operational checklist for filling out the
> directory forms. The
> `apps/web/src/lib/business.ts → BUSINESS.addressPublic`
> flag is the hard gate — when `false`, the street address
> is never rendered on the website, in any citation block,
> or in the JSON-LD.

---

## Photo + caption set

> **Photo source of truth:** `content/assets/gbp-photo-spec.md`
> + `scripts/gbp-photo-process.py` (the script that turns
> phone photos into GBP-ready JPGs in ~5 seconds each).

| # | Filename | Caption | Min size |
|---|---|---|---|
| 01 | `largolawn-01-logo-mark.png` | `Largo Lawn logo mark.` | 720x720 |
| 02 | `largolawn-02-wordmark.png` | `Your neighbor's lawn mower.` | 1024x576 |
| 03 | `largolawn-03-freshly-mowed-33771.jpg` | `Just finished mowing - 33771.` | 720x720 |
| 04 | `largolawn-04-edging-33774.jpg` | `Mechanical edging - 33774.` | 720x720 |
| 05 | `largolawn-05-mulch-install-33773.jpg` | `Mulch install (3 cu yd) - 33773.` | 720x720 |
| 06 | `largolawn-06-hedge-trim-33770.jpg` | `Hedge trim - 8 ft height - 33770.` | 720x720 |
| 07 | `largolawn-07-truck.jpg` | `Work truck.` | 720x720 |
| 08 | `largolawn-08-prestorm-[storm]-33773.jpg` | `Pre-storm prep - [Storm Name] - 33773.` | 720x720 |
| 09 | `largolawn-09-poststorm-33771.jpg` | `Post-storm cleanup - 33771.` | 720x720 |
| 10 | `largolawn-10-owner.jpg` | `[First name] - Founder, Largo Lawn.` | 720x720 |

**Storage:** `apps/web/public/work/` (also exposed at
`https://largolawn.pro/work/<file>`). Backup to Google Drive
`/largolawn-photos/`.

**Photo script:**
```bash
# Process a phone photo into the GBP-ready JPG:
bun scripts/gbp-photo-process.py photo \
  --type edging \
  --input ~/Photos/IMG_33771.jpg \
  --zip 33774

# Generate the avatar (photo 01) from the brand mark:
bun scripts/gbp-photo-process.py avatar
```

---

## Posting cadence

| Platform | Post type | Frequency |
|---|---|---|
| GBP | Cover photo | 4x/year (seasonal) |
| GBP | Work photos | 2-3/month; ≥1/week during growing season |
| GBP | Google Posts (offers, updates) | 1-2/week |
| Yelp | Photos | Quarterly refresh |
| Facebook | Posts | 2-3/week |
| Facebook | Photos | Mirror GBP; refresh monthly |
| Nextdoor | Posts | 1-2/month |
| LinkedIn | Posts | 1/month (low priority) |
| Bing | Photos | Quarterly |
| Apple Maps | Photos | Low priority; logo + 2-3 is enough |
| Houzz | Photos | Project-based; 1/finished project |
| LawnSite | Forum posts | 1/month in industry thread |

**Total:** ~6-9 posts/month across all platforms. Realistic
for a solo operator with a 30-min "social batch" on Sunday
morning.

---

## Verification status by directory

| # | Directory | Verification | Time | Difficulty |
|---|---|---|---|---|
| 1 | Google Business Profile | Postcard | 5-14 days | Hardest |
| 2 | Apple Maps Connect | Apple ID + phone/email | <1 hour | Easy |
| 3 | Bing Places | Email | <1 hour | Easy |
| 4 | Facebook Business | Email | <1 hour | Easy |
| 5 | Yelp Business | Phone | <1 day | Easy |
| 6 | Nextdoor Business | Address postcard | 7-10 days | Medium |
| 7 | LinkedIn Company | Email | <1 hour | Easy |
| 8 | Yellow Pages | Phone or email | <1 day | Easy |
| 9 | Superpages | Email | <1 hour | Easy |
| 10 | Manta | Email | <1 hour | Easy |
| 11 | BBB | Email + documents | 1-2 weeks | Medium |
| 12 | MapQuest | Email | <1 hour | Easy |
| 13 | TomTom | Email | <1 hour | Easy |
| 14 | Foursquare | Email + venue-claim call | <1 day | Medium |
| 15 | Citysearch | Email | 1-2 weeks | Easy |
| 16 | Angi | Email + screening call | 1-2 weeks | Medium |
| 17 | HomeAdvisor | Phone screening | 1-2 weeks | Medium |
| 18 | Thumbtack | Email + phone | <1 day | Easy |
| 19 | Porch | Email | <1 day | Easy |
| 20 | Houzz | Email + photo review | 1-2 weeks | Medium |
| 21 | Bark | Email | <1 day | Easy |
| 22 | LawnSite | Email | <1 hour | Easy |
| 23 | Greater Largo Chamber | Email + payment | 2-4 weeks | Hard (deferred) |
| 24 | Patch | Email | 1-2 weeks | Easy |
| 25 | CityOf.com | Email | <1 hour | Easy |

**Recommended order:**

1. **Day 1 afternoon (no waiting):** Apple Maps, Bing, Facebook,
   LinkedIn, Superpages, Manta, MapQuest, TomTom, Yellow Pages,
   CityOf.com, LawnSite, Bark, Thumbtack, Porch, Patch, Citysearch.
   (16 directories in one afternoon. Most are <15 min each.)
2. **Day 1 evening:** Yelp, Foursquare, Houzz, Nextdoor, Angi,
   HomeAdvisor, BBB. (7 directories; each has a screening step
   but most are fast.)
3. **Day 1-2:** Request GBP verification postcard. (Gate: needs
   a real mail-receivable address.)
4. **Day 14-21:** Enter GBP verification code; GBP goes live.
5. **Day 30+:** Greater Largo Chamber (when pilot revenue
   covers the $200-300 dues).

---

## Day-of-execution checklist

> **Use this when the steward flips D-0007 phase B (publishing
> authorization) and OBJ-M2-006 is in active "in_progress"
> state.**

- [ ] Confirm `apps/web/src/lib/business.ts → BUSINESS.address`
      is a real, mail-receivable address (not a placeholder).
- [ ] Take / select 10 photos per the [photo + caption set](#photo--caption-set).
- [ ] Run `bun scripts/citation-payload-generator.py --validate-only`.
      Check for placeholder-address warnings and any
      directory-specific quirks (e.g., Yelp phone format).
- [ ] Run `bun scripts/citation-payload-generator.py --emit
      --output drafts/citations/2026-MM-DD/`. Confirm 25
      per-directory submission blocks land in the folder.
- [ ] Submit 16 free-form directories in one sitting (afternoon
      1). See the [recommended order](#verification-status-by-directory)
      table.
- [ ] Submit the 7 directories with screening calls (afternoon
      2). Wait for the calls to land.
- [ ] Request GBP verification postcard (Day 2-3).
- [ ] Enter GBP verification code when it arrives (Day 14-21).
- [ ] Update the website footer + contact page to show the
      badge / "Listed on" markers for each directory.
- [ ] Update `state/ledger.yaml → objectives.active →
      OBJ-M2-006` status: "in_progress (X of 25 citations
      live)".
- [ ] Defer the Greater Largo Chamber until pilot revenue
      covers the dues.

**Total time:** ~4-6 hours of submission work, plus 1-2 weeks
of waiting for verification.
**Total cost:** $0 (the Chamber is deferred).

---

## What NOT to do

- **Don't** use "Landscaper" as a primary category anywhere.
  `Lawn care service` is the right category per SEO research.
- **Don't** use a different name format anywhere — "LargoLawn"
  on one platform and "Largo Lawn" on another = NAP
  inconsistency = ranking penalty.
- **Don't** use a different phone format. The canonical
  display phone is `+1-727-313-8011`; Yelp wants the
  parenthesized form `(727) 313-8011` (the script auto-formats
  for the Yelp directory). Mixing parens and dashes across
  platforms is a NAP inconsistency.
- **Don't** include a street address in any citation block.
  The business operates in SAB (service-area business) mode;
  the street address is private. The `render_nap_block`
  function in `scripts/citation-payload-generator.py` omits
  the address for all directories except the GBP (which
  needs it for the verification postcard). The
  `addressPublic` flag in `business.ts` is a hard gate.
- **Don't** put a P.O. Box in the GBP address field when
  requesting the verification postcard. Google will reject
  the postcard. The street address is private to the steward;
  the GBP dashboard lets you hide it from public view after
  verification.
- **Don't** create the GBP with a placeholder address. Google
  will reject the postcard and may suspend the listing.
- **Don't** enable lead-gen on Angi / HomeAdvisor / Thumbtack
  before the GBP is live. The pre-launch plan is **list, don't
  enable paid leads**. Wait for GBP traction to know the
  baseline conversion rate.
- **Don't** skip directories 22-25 (LawnSite, Patch,
  CityOf.com) just because the DA is lower. Every citation
  counts toward the "consistent NAP" signal that Google's
  local algorithm rewards.
- **Don't** add the website URL with a trailing slash
  (`https://largolawn.pro/`) — the script auto-strips for
  directories that don't allow it.

---

## Cross-references

- `apps/web/src/lib/business.ts` — single source of truth for
  NAP, hours, service-area ZIPs, URL.
- `content/assets/gbp-photo-spec.md` — the photo design
  contract.
- `content/assets/gbp-shooting-day-workflow.md` — the
  on-the-yard 5-shot workflow.
- `scripts/gbp-photo-process.py` — the photo pipeline.
- `scripts/citation-payload-generator.py` — the per-directory
  payload generator (this script + this file = the citation
  build).
- `content/marketing/sab-strategy.md` — the broader SAB SEO +
  legal-entity policy.
- `content/marketing/free-credit-enrollment.md` — Google
  Business Profile free credits / promotional offers.
- `state/ledger.yaml → objectives.active → OBJ-M2-006` —
  the active objective this work serves.
- `state/risk-register.yaml → R-LOCALSEO-001` (Day 4 seed) —
  the local-SEO risk that this build mitigates.
