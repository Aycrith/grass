# Citation Data Package — Yelp / Facebook / Bing / Apple Maps Connect

> **Use:** Paste each block into the corresponding platform's business-profile
> creation form. Strict NAP (Name/Address/Phone) consistency across every
> citation is the single highest-leverage local-SEO factor after the GBP itself.
>
> **Tier 1 directories (do these first, $0 spend, takes 1-2 hours total):**
> 1. Apple Maps Connect (appleseeds id at register.apple.com)
> 2. Bing Places (bingplaces.com)
> 3. Facebook Business Page (facebook.com/business)
> 4. Yelp Business (biz.yelp.com)
> 5. Google Business Profile (business.google.com — needs verification postcard)

---

## NAP block (use this EXACTLY, character-for-character, on every platform)

```
Largo Lawn
123 Main Street (placeholder — steward fills real address before publication)
Largo, FL 33771
(727) 555-0123
hello@largolawn.pro
largolawn.pro
```

**NAP-consistency rules:**
- "Largo Lawn" — same on every platform (no "LargoLawn", no "Largo Lawn Care", no "LargoLawn.pro")
- Address: trailing "FL" abbreviation (not "Florida"); ZIP code is its own field
- Phone: `(727) 555-0123` — parentheses + space + dash format; no `+1`, no dots, no extensions
- Email: lowercase, no display-name prefix
- URL: no trailing slash, no `https://` (most platforms normalize)

---

## Business description (1500-char max for most platforms)

**Short (50 char):**
```
Local lawn care in Largo FL — mow, edge, mulch, hedge, hurricane prep.
```

**Medium (200 char):**
```
Largo Lawn is a locally-owned lawn-care service for homeowners in Largo,
FL and the surrounding Pinellas County ZIPs. Mowing, edging, mulching,
hedge trimming, hurricane prep. Free quotes within 24 hours.
```

**Long (500 char):**
```
Largo Lawn provides residential lawn-care services to homeowners in Largo,
FL 33771 and adjacent Pinellas County ZIPs. We're a solo operator — when
you call, you talk to the person doing the work. Services include weekly
and bi-weekly mowing, mechanical edging, mulching and bed maintenance,
hedge trimming, and pre-/post-storm hurricane prep. Quotes are free and
returned within 24 hours. Pricing is mid-market: weekly mowing of a 1/4-acre
lot is $48/visit, edging is included in every visit. Hurricane prep is a
flat $95-150 per activation. No contracts, no subscription required.
Cash, Venmo, Zelle, or card on phone. Locally owned; not a franchise.
```

**Yelp-specific (Yelp limits to ~1000 char; tighten if needed):**
```
Locally-owned residential lawn care in Largo, FL 33771 and surrounding
ZIPs. Solo operator — when you call, you talk to the person doing the
work. Services: weekly and bi-weekly mowing, mechanical edging, mulching,
hedge trimming, hurricane prep. Mid-market pricing. Free quotes within
24 hours. No contracts, no subscriptions. Same-day quote; same-week first
visit. Cash, Venmo, Zelle, card-on-phone accepted.
```

---

## Categories (use EXACTLY as listed)

**Primary:** `Lawn care service` (NOT "Landscaper" — see `research/seo/largo-keyword-map.md`)

**Secondary (pick 2-3):**
- `Lawn maintenance service`
- `Yard care service`
- `Gardener`
- `Tree service` (only if you actually trim trees; out of scope per CLAUDE.md Mission 1)

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
Mon:  7:00 AM – 6:00 PM
Tue:  7:00 AM – 6:00 PM
Wed:  7:00 AM – 6:00 PM
Thu:  7:00 AM – 6:00 PM
Fri:  7:00 AM – 6:00 PM
Sat:  8:00 AM – 2:00 PM
Sun:  Closed (hurricane-mode only)
```

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

**Service radius:** 7 miles from primary ZIP (covers all 6 ZIPs above).

---

## Photos (have these ready as JPG, 720×720 minimum)

Recommended GBP photo set (see `content/assets/gbp-photo-spec.md` for shot list):
1. Logo (mark only, on cream background) — `apps/web/public/logo-mark.svg` exported to PNG at 720×720
2. Logo wordmark (full) — `apps/web/public/logo.svg` exported to PNG at 1024×576
3. Freshly-mowed lawn photo (bright daylight, edges crisp)
4. Mechanical edging close-up
5. Mulch install mid-job
6. Hedge trim finished
7. Truck / trailer (only if it looks professional)
8. Pre-storm yard prep
9. Post-storm cleanup
10. Owner portrait (work clothes, on a finished yard)

**Photo file naming convention:** `largolawn-{NN}-{slug}.jpg` (e.g., `largolawn-01-logo-mark.png`)

**Where to upload:** `apps/web/public/work/` (already specified in gbp-photo-spec.md). Backup to Google Drive `/largolawn-photos/`.

---

## Photo captions (paste with each photo)

```
01: Largo Lawn logo mark.
02: Your neighbor's lawn mower.
03: Just finished mowing — 33771.
04: Mechanical edging — 33774.
05: Mulch install (3 cu yd) — 33773.
06: Hedge trim — 8 ft height — 33770.
07: Work truck.
08: Pre-storm prep — [Storm Name] — 33773.
09: Post-storm cleanup — 33771.
10: [First name] — Founder, Largo Lawn.
```

---

## Posting cadence

- **GBP cover photo:** Once per season (4×/year)
- **GBP work photos:** 2-3/month; minimum 1/week during growing season
- **Yelp / Facebook photos:** Mirror the GBP set; refresh quarterly
- **Bing / Apple Maps:** Less critical for photos; logo + 2-3 work photos is sufficient

---

## Verification status (which platforms require)

| Platform | Verification | Time | Notes |
|---|---|---|---|
| Google Business Profile | Postcard | 5-14 days | Hardest; gate for everything else |
| Apple Maps Connect | Apple ID + phone/email | <1 hour | Easy |
| Bing Places | Email | <1 hour | Easy |
| Facebook | Email + business email | <1 hour | Easy |
| Yelp | Phone | <1 day | Easy |

**Recommended order:** Apple Maps → Bing → Facebook → Yelp → GBP. The first four can all be done in one afternoon. GBP is gated by the postcard.

---

## What NOT to do

- **Don't** use "Landscaper" as a primary category anywhere (lowercase the competitor fight; Lawn care service is the right category per SEO research)
- **Don't** use a different name format anywhere — "LargoLawn" on one platform and "Largo Lawn" on another = NAP inconsistency = ranking penalty
- **Don't** use a different phone format
- **Don't** put a P.O. Box in the address field if you're a service-area business (SAB) — use the home address (you can hide it from public view on GBP later)
- **Don't** create the GBP with placeholder address "123 Main Street" — Google will reject the postcard

---

## Day-of-execution checklist (when steward authorizes)

- [ ] Replace placeholder address with real address
- [ ] Take / select 10 photos per the spec above
- [ ] Create Apple Maps Connect entry — paste NAP, paste short description, upload logo
- [ ] Create Bing Places entry — same NAP, paste medium description, upload logo
- [ ] Create Facebook Business Page — same NAP, paste long description, upload all 10 photos
- [ ] Create Yelp Business Page — same NAP, paste Yelp description, upload logo + 3 work photos
- [ ] Defer GBP until verification postcard can be mailed to real address

**Total time:** 2-3 hours for all four platforms.
**Total cost:** $0.
**Total expected impact:** Local SEO ranking lift within 30-60 days; consistent NAP = single biggest non-GBP ranking factor.