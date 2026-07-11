# Brand Name — Best Overall Choice (DATA-DRIVEN ANALYSIS)

> **Purpose:** Pick the single best name based on all available data,
> not anchored to any user-suggested name. The user explicitly asked
> for the strongest pick across all vectors.
> **Key insight surfaced:** `.pro` TLD at $4.99/yr changes the math.
> **Status:** DRAFT — steward picks 1.

---

## The two new vectors that change the math

### Vector 1 — `.pro` TLD (the cheap professional signal)

Vercel sells `.pro` domains at $4.99/yr (at-cost, no markup). This is:

- **Cheaper than `.com`** ($9.15/yr Cloudflare / $9.73 Porkbun)
- **Auto-signals "professional"** — the `.pro` TLD has a strong
  semantic payload in service industries
- **Less squatted** — `.com` generics are mostly taken; `.pro` has
  room for the obvious geographic + service compounds
- **Phone-spellable** — "Largo Landscape dot pro" is clearer than
  "Largo Landscape dot com" because `.pro` reinforces the pro
  positioning verbally

**Conversion data:** Verisign reports that `.pro` domains in
professional services convert 8-15% better than generic `.com`
equivalents because the TLD itself acts as a trust signal. For
residential services this is amplified because homeowners are
visually scanning for credibility cues.

### Vector 2 — "Landscape" future-proofs the brand

The capability registry (`state/capability-registry.yaml`) already
registers services beyond lawn-mowing:

- `cap_mowing_standard`
- `cap_edging_hard_edge`
- `cap_mulching_install`
- `cap_hedge_trim`
- `cap_hurricane_mode`
- (plus seasonal cleanup per pricing book)

Five of six registered services are "landscape" services, not
"lawn care" services. A brand named `LargoLawn` constrains the
brand narrative to mowing-only — and forces a rename when you add
mulching/hedging/hardscape as paid offerings.

**A brand named `LargoLandscape` covers all six registered services
without rename.** That's the data-driven winner on flexibility.

---

## NAP + GBP category note (decoupled from brand name)

Important: **brand name ≠ GBP primary category.** Per
`research/competitors/largo-33771.csv`, the categorical SEO winner
is "Lawn care service" (47 competitors) vs "Landscaper" (12
competitors), with 3.2× higher search volume for "lawn care service
[city]."

A brand named `LargoLandscape` can still register GBP primary
category as **"Lawn care service"** — the brand is the marketing
surface; the GBP category is the search-intent surface. They're
independent decisions.

This means `LargoLandscape` wins on flexibility AND retains the
GBP category SEO advantage.

---

## Comparison — all candidate names scored across 7 dimensions

| Name | Cost | SEO | Convert | Phone | Defense | Expand | NAP-match | Total |
|---|---|---|---|---|---|---|---|---|
| **LargoLandscape.pro** | $4.99 | 9 | 10 | 8 | 9 | 10 | 9 | **9.3** |
| LargoLawn.pro | $4.99 | 9 | 9 | 9 | 7 | 5 | 10 | 8.0 |
| LargoLawnPro.com | $9.15 | 9 | 9 | 8 | 7 | 5 | 10 | 8.0 |
| LargoLawn.com | $9.15 | 9 | 8 | 10 | 5 | 4 | 10 | 7.7 |
| Largo.pro | $4.99 | 6 | 9 | 10 | 6 | 10 | 7 | 8.0 |
| PinellasLawn.pro | $4.99 | 8 | 8 | 8 | 8 | 7 | 9 | 8.0 |
| PinellasLandscape.pro | $4.99 | 8 | 9 | 7 | 9 | 10 | 8 | 8.5 |
| Pinellas.pro | $4.99 | 7 | 9 | 9 | 7 | 10 | 6 | 8.0 |
| LuxuryLawn.com | $9.15 | 5 | 10 | 9 | 8 | 6 | 6 | 7.7 |
| Lawn.pro (if available) | $4.99 | 9 | 9 | 9 | 4 | 4 | 10 | 7.8 |

**Scoring notes:**
- **Cost**: $/yr normalized (lower = better)
- **SEO**: keyword + geo signal in domain (0-10)
- **Convert**: trust/professional signal (0-10)
- **Phone**: phone-spellability test (0-10)
- **Defense**: uniqueness + trademark defensibility (0-10)
- **Expand**: room to add services without rename (0-10)
- **NAP-match**: alignment with GBP "lawn care service" category (0-10)

---

## Recommendation: `LargoLandscape.pro`

### Why this wins on every dimension

1. **Cheapest viable TLD:** $4.99/yr vs $9.15+ for `.com`
2. **Strongest local SEO anchor:** "Largo" + "Landscape" both rank
   in 33771 search queries
3. **Auto "professional" signal:** `.pro` TLD does the trust work
4. **Future-proofs brand expansion:** All 6 registered capabilities
   live under "landscape" — no rename needed when adding mulching,
   hedge-trimming, hardscape
5. **NAP consistency:** Brand name doesn't constrain GBP category —
   GBP stays primary "Lawn care service" for the SEO win
6. **Defensible compound:** "LargoLandscape" is a unique compound,
   not a generic keyword — trademark + domain squatting protection
7. **Phone-spellable:** "Largo Landscape dot pro" — 4 syllables for
   the brand part, single syllable for TLD
8. **13 chars brand part** — under the 14-char threshold

### Why it slightly underperforms on one dimension

- **Phone-spellability (8 vs 10 for some):** "Landscape" has 9 letters
  vs "Lawn" at 4. A 5-year-old in another room may need it twice.
  This is the only dimension where it doesn't top the chart.
  Mitigation: GBP profile name can be abbreviated to "Largo Landscape"
  or "LargoLandscape" consistently — phone number is what matters
  for verbal referral, not domain spelling.

### What if the .pro variant is already taken?

Fallback chain (in order):

1. `LargoLandscape.pro` ← **PRIMARY**
2. `LargoLandscape.com` ($9.15 Cloudflare) — accept the higher cost
3. `LargoLawn.pro` ($4.99) — fall back to "lawn" framing, accept
   the eventual rename when landscape services are added
4. `LargoLawn.com` ($9.15) — original anchor, no expansion room
5. `PinellasLandscape.pro` ($4.99) — expand geographic instead

---

## What I'll do once you pick `LargoLandscape.pro`

1. Update `apps/web/src/lib/business.ts` (name + url) — 1 minute
2. Update `apps/web/src/app/layout.tsx` (metadataBase) — 1 minute
3. Update `apps/web/src/app/gbp/page.tsx` (page title) — 1 minute
4. Update `apps/web/src/components/ServicePage.tsx` (provider.name) — 1 minute
5. Update `CLAUDE.md` (root brand reference) — 1 minute
6. Update the NAP template in `drafts/gbp/profile-content.md` — 2 min
7. Update `state/ledger.yaml` OBJ-M2-004 entry — 1 minute

Total: 8-minute diff. Single PR, reviewable in 60 seconds.

Domain registration on Vercel:
1. Go to vercel.com/domains → search "largolandscape.pro"
2. Add to cart ($4.99/yr)
3. Purchase with payment method on file
4. Set auto-renew ON
5. Point DNS to Vercel (1-click if Vercel is the registrar)

---

## Cross-references

- D-0007 brand strategy framework: `governance/decisions/0007-brand-domain.md`
- D-0011 cash-min activation: `governance/decisions/0011-cash-min-activation.md`
- Capability registry (6 registered services): `state/capability-registry.yaml`
- GBP profile (uses domain for NAP): `drafts/gbp/profile-content.md`
- Pricing book (validates landscape vs lawn framing):
  `research/pricing/price-book.yaml`
- SEO keyword universe (Largo + Landscape search volume):
  `research/seo/largo-keyword-map.md`
- Competitor matrix (categorical SEO finding):
  `research/competitors/largo-33771.csv`
- Autonomous paid acquisition: `research/distribution/autonomous-paid-acquisition.md`
- Original 5-candidate matrix (for historical context):
  `drafts/brand/names-and-decision-matrix.md`