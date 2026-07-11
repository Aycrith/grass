# Autonomous Paid Acquisition — Free Ad Credits (DRAFT)

> **Purpose:** Capture the cash-min distribution path that uses
> **free new-account advertising credits** from Google, Meta, Microsoft,
> Yelp, NextDoor, and Thumbtack instead of organic-only growth.
> **Cash cost:** $0 (all ad spend covered by platform promo credits).
> **Domain cost:** $9.15 (unchanged — separate item).
> **Status:** DRAFT — steward reviews then triggers account creation.
> **Output target:** 5 paid pilots within 30 days of GBP-live.

---

## Constraint summary

- Cash available: $9.15 (one domain registration).
- Cash available for distribution: $0.
- Time available: 6-8 hrs total over 14-30 days (per `drafts/README.md`).
- Tools available: GBP dashboard, Cloudflare email forwarding, Vercel
  free site, Google Voice (free), Stripe / Cash App / Venmo for payment.
- Compliance ceiling: SAB-style address (no public storefront), no
  commercial equipment in pilot scope (hand tools only), no employees.
- **New:** Free ad credits available via new-account promos on major
  platforms. We use these to skip the organic-only growth constraint.

---

## Why free ad credits change the distribution math

Organic-only is slow. Free credits let us:

- Buy 5-15 leads in 24-72 hours instead of waiting 14-30 days for
  organic search ranking to mature.
- A/B test messaging in days instead of weeks.
- Reach hyperlocal audiences (33771 ZIP, 1-3 mile radius) in a
  single afternoon.
- Validate demand at $0 cost before committing to a paid-ad strategy
  post-launch.

This is a **distribution accelerant**, not a permanent strategy.
After the credit window closes (typically 30-60 days), we either:
(a) stop advertising and rely on organic + GBP momentum, or
(b) fund ads from pilot revenue and continue with paid acquisition.

---

## Platform-by-platform credit mechanics

### Google Ads — typically $500 free credit

- **What it covers:** Search, Display, YouTube, Discovery, Performance Max.
- **Credit trigger:** New Google Ads account (sometimes requires matching
  $500 spend within 60 days to unlock; sometimes instant credit on
  account creation).
- **Realistic lawn-care CPL:** $5-15 in Largo FL (low competition, local).
- **Expected leads from $500:** 30-100.
- **Conversion to paid pilot:** 5-15% (industry benchmark for service biz).
- **Steward hand-off (15 min):**
  1. Create Google Ads account at ads.google.com using your Google account.
  2. Enter payment method (required for account creation, even with credits).
  3. Set account-level spend cap to the credit amount.
  4. Hand the account ID to Claude Code.
- **Autonomous (Claude Code does):**
  1. Campaign structure (1 Search campaign, hyperlocal geo-target 33771).
  2. Ad copy (3 Responsive Search Ads rotated).
  3. Keyword set (~30 negative-matched service keywords).
  4. Bid management (Maximize Conversions within credit cap).
  5. Daily monitoring + pause if CTR <2% or cost-per-lead >$30.
- **Risk:** If credit requires matching spend, do NOT spend your own
  cash. Use credits only. Set Google Ads billing threshold to $0 so
  no auto-charge occurs after credit exhausts.

### Microsoft (Bing) Ads — typically $100-200 free credit

- **What it covers:** Bing Search, Yahoo, AOL, DuckDuckGo (yes, Bing
  Ads powers DDG now in many regions).
- **Credit trigger:** New account creation, often $100 instant.
- **Realistic lawn-care CPL:** $8-20 (less volume, older demographic
  that converts well for service businesses).
- **Expected leads from $100:** 5-20.
- **Steward hand-off (10 min):** Same as Google, but at
  ads.microsoft.com. Easier approval process.
- **Autonomous:** Campaign structure + copy largely copied from Google
  with keyword adjustments for Bing volume differences.
- **Risk:** Lower lead volume than Google. Worth doing if/when
  Google credit is exhausted, not as primary.

### Meta (Facebook + Instagram) Ads — typically $50-200 free credit

- **What it covers:** Facebook feed, Instagram feed + stories + reels,
  Messenger, Audience Network.
- **Credit trigger:** New Business Manager + new ad account. Sometimes
  a $50 instant credit, sometimes a $100 spend-match credit.
- **Realistic lawn-care CPL:** $3-10 (Largo FL is a smaller market,
  good targeting).
- **Expected leads from $100:** 10-30.
- **Steward hand-off (15 min):**
  1. Create Facebook Business account at business.facebook.com.
  2. Set up Business Manager, create ad account.
  3. Add payment method (still required for credits).
  4. Add Claude Code as a user with Ads Manager access (Editor role).
- **Autonomous:**
  1. Campaign structure: 1 Awareness + 1 Lead campaign.
  2. Audience: 33771 ZIP + 1-3 mile radius + age 30-65 + homeowner +
     interests (Lawn & garden, Home improvement, Gardening).
  3. Creative: 3 image variants + 1 video (15s drone shot of lawn
     before/after — steward shoots on phone).
  4. Lead form: "Free first mow quote — text/call [Google Voice]"
     or "Quote in 60 seconds."
- **Risk:** Meta lead quality is variable. Filter for ZIP code match
  in every lead before responding.

### Yelp Ads — typically $25-50 free credit

- **What it covers:** Yelp search results (above organic).
- **Credit trigger:** New Yelp Business account + first ad campaign.
- **Realistic lawn-care CPL:** $15-30 (Yelp leads convert well for
  service businesses — they're pre-qualified local searchers).
- **Expected leads from $25:** 1-3.
- **Steward hand-off (10 min):** Claim/verify Yelp Business at
  biz.yelp.com. Set up first ad with $25 budget.
- **Autonomous:** Account configuration, response templates, profile
  optimization (photos, hours, services).
- **Risk:** Low volume, but high intent. Always-on play.

### NextDoor Local Deals — typically $50-100 free credit

- **What it covers:** NextDoor neighborhood feed (Largo neighborhoods).
- **Credit trigger:** New NextDoor Business account + first campaign.
- **Realistic lawn-care CPL:** $5-15 (NextDoor is hyperlocal + trust-
  weighted; leads are gold).
- **Expected leads from $50:** 3-10.
- **Steward hand-off (10 min):** Claim business page at
  business.nextdoor.com. Set up Local Deals campaign.
- **Autonomous:** Audience narrowing to 1-2 neighborhoods in 33771,
  creative + copy, response handling.
- **Risk:** NextDoor has strict local-only rules — the address shown
  must be within the neighborhoods you're targeting.

### Thumbtack — variable free credit

- **What it covers:** Thumbtack pro profile + lead credits.
- **Credit trigger:** New pro account, sometimes gives 5-10 free leads.
- **Realistic CPL:** Free credits = $0.
- **Steward hand-off (10 min):** Create pro profile at thumbtack.com,
  add service categories (Lawn Mowing, Hedge Trimming, Mulching).
- **Autonomous:** Profile optimization, lead response templates,
  instant-response automation (within 5 min).
- **Risk:** Thumbtack takes a referral fee on closed jobs. Document
  before committing.

---

## Total credit potential + expected lead volume

| Platform | Likely credit | Est. leads | Est. paid pilots |
|---|---|---|---|
| Google Ads | $500 | 30-100 | 2-8 |
| Microsoft Ads | $100 | 5-20 | 0-2 |
| Meta Ads | $100 | 10-30 | 1-3 |
| Yelp Ads | $25 | 1-3 | 0-1 |
| NextDoor Deals | $50 | 3-10 | 0-2 |
| Thumbtack | ~5 leads | 5 | 0-1 |
| **Total** | **~$775 + 5 leads** | **54-168** | **3-17** |

**Conservative read:** 5 paid pilots is achievable inside the credit
budget at 10% lead-to-pilot conversion. **Stretch read:** 10-15 paid
pilots if Meta + Google both deliver above-benchmark CPL.

---

## Campaign structure (autonomous templates)

### Google Search — primary

```
Campaign: "Largo Lawn Care — Search"
Budget: $500 (credit-only, hard cap)
Geo-target: 33771 + 3 mi radius
Schedule: 7am-7pm daily (no overnight)
Bid strategy: Maximize Conversions (target CPA: $30)

Ad Group 1: "mowing"
Keywords:
  +lawn +mowing +largo +fl
  +lawn +care +largo
  +grass +cutting +largo +fl
  +yard +maintenance +largo
Negative: -diy -rental -equipment -parts

Ad copy (RSA):
  Headlines (15):
    H1: Local Lawn Care in Largo
    H2: $25 Off First Mow
    H3: 5-Star Lawn Service
    H4: Free Quote in 60 Seconds
    H5: Trusted by Largo Neighbors
    H6: Mowing, Edging, Blowing
    H7: Same-Day Quotes
    H8: [Operator Name]'s Local Service
    H9: Lawn Care Made Simple
    H10: Call Now for Free Quote
    H11: Veteran-Owned & Operated (if applicable)
    H12: Serving 33771 + Pinellas
    H13: Clean Cut, Clean Yard
    H14: Text or Call for Quote
    H15: Fast Friendly Local Service
  Descriptions (4):
    D1: Local lawn care startup in Largo FL. $25 off your first mow.
        Same-day quotes. Text or call [Google Voice]. Serving 33771.
    D2: Need a reliable lawn service? We're new, local, and hungry.
        Free quote in 60 seconds. Mowing, edging, blowing. 33771.
    D3: Mowing + edging + blowing + cleanup. Sharp lines. Quick response.
        Text or call [Google Voice]. First mow $25 off.
    D4: Looking for a lawn service near Largo? Local, reliable,
        affordable. Free quote. Text or call now.

Landing page: Vercel /quote (1-page form + phone CTA)
Conversion: Phone call (Google forwarding) OR form submit
```

### Meta (Facebook + Instagram) — secondary

```
Campaign 1: "Largo Lawn — Lead Form"
Objective: Lead
Budget: $50 (credit-only)
Audience:
  Location: 33771 + 5 mi
  Age: 30-65
  Homeowner: yes
  Interests: Lawn & garden, Home improvement, Gardening,
             Homeowners association, Outdoor decor
  Exclude: Recent engagers (exclude past 30 days)

Creative:
  Variant A (image): Drone shot of fresh-cut lawn with overlay
                     "Largo Lawn Pro — $25 Off First Mow"
  Variant B (carousel): 3 cards — before/after/quote-CTA
  Variant C (video): 15s phone-shot of mowing + overlay text

Lead form:
  Headline: Get a Free Quote in 60 Seconds
  Question 1: Your ZIP code (33771/33770/etc.)
  Question 2: Lot size (small / medium / large)
  Question 3: Service needed (mowing / edging / other)
  Question 4: Phone number
  CTA: Get My Quote

Campaign 2: "Largo Lawn — Awareness"
Objective: Reach (video views)
Budget: $30
Creative: 30s time-lapse mow (low-key, authentic)
Geo + audience: same as Campaign 1
Goal: Build retargeting pool for Campaign 1
```

---

## Autonomous campaign management protocol

Once the steward has set up accounts and handed them to Claude Code:

**Daily check (autonomous, 5 min):**
- Pull cost-per-lead + conversion count per campaign.
- Pause any ad set with CPL > $30 (above benchmark).
- Pull search-term report (Google) → add new negatives.
- Pull Meta audience breakdown → pause age/interest bands with CTR <1%.

**Weekly review (autonomous, 15 min):**
- A/B test new headlines / descriptions (rotate weekly).
- Update geo-target if any ZIP underperforms (drop it).
- Reallocate budget from worst CPL campaign to best CPL campaign.
- Adjust bid if impression share drops below 70%.

**Hard guardrails (autonomous):**
- Never exceed the credit cap on any platform.
- Pause all campaigns if credit balance hits $0 (no auto-charge).
- Pause campaigns immediately if CPL >$50 for 3 consecutive days.
- Pause campaigns immediately if lead quality <20% ZIP match.

---

## Steward hand-off (total ~60 min)

In a single sitting, the steward can:

1. **Google Ads account** (15 min) — ads.google.com + payment method
2. **Microsoft Ads account** (10 min) — ads.microsoft.com + payment method
3. **Meta Business + ad account** (15 min) — business.facebook.com +
   payment method + add Claude Code as Editor
4. **Yelp Business account** (5 min) — biz.yelp.com + claim page
5. **NextDoor Business account** (10 min) — business.nextdoor.com
6. **Thumbtack Pro account** (5 min) — thumbtack.com + service categories

Total: ~60 minutes of one-time setup. After that, campaign management
is fully autonomous.

---

## Compliance notes

- All ad platforms require accurate business information. The NAP
  (name, address, phone) in ads MUST match the GBP profile.
- For SAB (service-area business) with no public storefront, use
  the home address — Google's policy allows this as long as it's
  not displayed publicly. Check platform-specific rules.
- If a paid lead asks for insurance / BTR / license documentation
  before booking, that's the reactivation trigger for OBJ-M2-002
  /003. Document the date and revenue from the lead.
- Sales tax: as long as OBJ-M2-001 (DR-1 registration) is deferred,
  do NOT collect FL sales tax on invoices. Mention "tax not collected"
  in the invoice or absorb into advertised price.

---

## Decision template

```markdown
# D-0012 — Autonomous Paid Acquisition via Free Ad Credits

**Status:** [Draft]
**Decision date:** [DATE]
**Decision file:** governance/decisions/0012-autonomous-paid-acquisition.md
**Review date:** [30 days post-account-setup]
**Owner:** Steward (account creation) + Claude Code (campaign mgmt)

## Context

Cash-min launch path is constrained by organic-only growth (slow).
Free new-account ad credits from Google/Meta/Microsoft/Yelp/NextDoor/
Thumbtack unlock immediate hyperlocal paid acquisition at $0 cash.
Total credit potential ~$775 + 5 free leads. Expected 5-15 paid pilots
in 30-60 days.

## Platforms selected

| Platform | Credit | Steward time | Claude Code time |
|---|---|---|---|
| Google Ads | $500 | 15 min | 8 hrs setup + 30 min/day mgmt |
| Microsoft Ads | $100 | 10 min | 2 hrs setup + copy-paste from Google |
| Meta Ads | $100 | 15 min | 6 hrs setup + 30 min/day mgmt |
| Yelp Ads | $25 | 5 min | 1 hr setup |
| NextDoor Deals | $50 | 10 min | 2 hrs setup |
| Thumbtack | ~5 leads | 5 min | 1 hr setup |

## Hard guardrails

- Never exceed credit cap on any platform.
- No auto-charge on any platform (billing threshold = $0).
- Pause campaigns if CPL > $30 sustained for 3 days.
- Reactivation trigger: any paid lead asks for insurance / BTR /
  license documentation → file the relevant deferred objective.

## Cash committed

$0 (domain already paid separately at $9.15).

## Success metrics

- 5 paid pilots within 30 days of GBP-live
- 5 five-star reviews within 14 days of each pilot close
- Cost-per-lead < $15 average across all platforms
- Lead-to-pilot conversion > 10%

## Risks

- Free credit terms may change (promo expiration, region limits).
  Mitigation: act within 14 days of steward setup.
- Platform approval delays (Google Ads sometimes takes 24-72 hrs
  for new accounts). Mitigation: parallelize setup across platforms.
- Lead quality varies, especially Meta. Mitigation: ZIP-code filter
  every lead before responding.

## Review trigger

30 days post-account-setup → measure CPL + conversion → decide
whether to fund continued ads from pilot revenue (move from cash-min
to paid-acquisition-sustained).
```

---

## Cross-references

- Brand brainstorm (LargoLawn / LuxuryLawn families):
  `research/distribution/brand-name-brainstorm.md`
- Original distribution ideas (organic + community):
  `research/distribution/cash-min-distribution-ideas.md`
- GBP profile draft: `drafts/gbp/profile-content.md`
- Cash-min index: `drafts/README.md`
- D-0011 cash-min activation: `governance/decisions/0011-cash-min-activation.md`
- Tech stack (where ads live in the stack):
  `governance/decisions/0002-tech-stack.md`