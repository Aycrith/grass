# OBJ-M2-004 — Brand Name and Domain Selection (DRAFT, $6-10 ceiling)

> **Status:** Decision matrix pre-populated, cash-constrained to $6-10/yr domain only.
> **Authorization:** D-0007 Phase A (strategy ratified).
> **Cash ceiling:** $6-10/yr for the primary domain. NO defensive registrations. NO
> logo spend. NO fictitious-name filing (deferred until post-revenue). NO hosting spend
> (Vercel free tier handles the existing Next.js build).
> **Action:** Steward reviews the matrix + picks 1 from the top 3 — register on
> Cloudflare Registrar or Porkbun (cheapest .com at $9.15/yr with no markup).

---

## Cash constraint (replaces previous $48/yr version)

The original draft priced 1 primary + 3 defensive domains at $48/yr. With
the new $6-10 ceiling, **defensive registrations are deferred** until
pilot revenue covers them. Only the primary domain registers now.

| Item | Old draft | New (cash-min) |
|---|---|---|
| Primary domain | $12/yr | **$6-10/yr** (Porkbun/Cloudflare) |
| Defensive domains | $36/yr | **DEFERRED** |
| Fictitious-name filing | $50 one-time | **DEFERRED** |
| Logo | $0-50 | **DEFERRED** (Canva DIY if needed) |
| Hosting | $0 (Vercel free) | **$0 (already free)** |
| **Total Year 1** | **$50-100 + $48/yr** | **$6-10/yr** |

The minimum-cost TLD paths (in order of preference):

1. **`.com`** via Cloudflare Registrar ($9.15/yr, no markup) or Porkbun ($9.73/yr) — best for NAP consistency, customer trust, and citation portability. If a candidate .com is taken, fall to:
2. **`.net`** via the same registrars ($8-9/yr) — NAP still clean, slightly less customer-recognition. Works for service businesses without complaint.
3. **Cheaper creative TLDs** — `.lawn` doesn't exist as a TLD. Realistic cheap-TLD plays: `.co` ($12-24/yr, too expensive), `.local` ($20+/yr, too expensive). **Skip the TLD discount hunting** — the $1-3 saved isn't worth the NAP-inconsistency risk with citations.

## Pre-scored candidates (5 names)

Per D-0007 framework ([Place feature] + [Service] hybrid, .com preferred, ≤14 chars,
no hyphens, no numbers). Score reflects $/yr at $9.

| # | Name | TLD | $/yr | TESS clear? | Phone-spell | GBP fit | SEO signal | Total (10) |
|---|---|---|---|---|---|---|---|---|
| 1 | **PinellasLawn.com** | .com | $9.15 | likely clear | ✅ PIN-EL-LAS-LAWN | ✅ | strong (county name) | **8.5** |
| 2 | **StarkeyYards.com** | .com | $9.15 | likely clear | ✅ STAR-KEY-YARDS | ✅ | strong (local area) | **8.0** |
| 3 | **LargoLawnCo.com** | .com | $9.15 | likely clear | ✅ LAR-GO-LAWN-CO | ✅ | hyperlocal | **7.5** |
| 4 | **PinellasLawn.net** | .net | $8.50 | likely clear | ✅ PIN-EL-LAS-LAWN | ✅ | strong | **8.0** |
| 5 | **LargoLawn.net** | .net | $8.50 | likely clear | ✅ LAR-GO-LAWN | ✅ | hyperlocal | **7.0** |

**Recommendation: PinellasLawn.com** at $9.15/yr on Cloudflare Registrar.
Strongest SEO + defensible brand + lowest acceptable NAP risk.

## Top 3 — domain-availability-check list (do this FIRST)

Run these on Cloudflare Registrar (`https://dash.cloudflare.com/?to=/:account/domains`)
or Porkbun (`https://porkbun.com/`):

- [ ] PinellasLawn.com
- [ ] StarkeyYards.com
- [ ] PinellasLawn.net (fallback if .com is taken)

Take the first available from this list. Do NOT burn time checking all
five; the top-3 covers 90% of the value.

## Registrar choice (cash-min)

**Cloudflare Registrar** is preferred because:
- At-cost pricing ($9.15/yr .com vs Namecheap's $13-14, GoDaddy's $14-20)
- No renewal markup (Namecheap sometimes raises Year 2 prices)
- Free WHOIS privacy (Namecheap charges $2-5/yr)
- Free DNS, free email forwarding, free DNSSEC
- Already in many security-aware stacks

Alternative: **Porkbun** ($9.73/yr .com, also at-cost, free WHOIS privacy,
slightly better UI for first-time domain buyers).

Do NOT use GoDaddy for this — their $0.99 first-year promo creates a
$14-19 renewal trap.

## Trademark clearance (best-effort, ~10 minutes)

Before registering the chosen domain, run these two quick searches:

- [ ] **USPTO TESS** at https://tmsearch.uspto.gov/
  - Class 037 (building maintenance / landscaping)
  - Class 044 (lawn care / agricultural)
  - Search live + dead marks for the exact phrase
- [ ] **Sunbiz search** at https://search.sunbiz.org/ (Florida fictitious name check)

The full TESS + state trademark search is **deferred to post-revenue**
(when the $50 Sunbiz filing happens anyway). For the $9 domain decision,
the live TESS search is the only required step.

## Social handle check (5 minutes)

For the chosen name, check handle availability:

- [ ] NextDoor business page (https://business.nextdoor.com/)
- [ ] Facebook Business Page (https://business.facebook.com/)
- [ ] Instagram handle (https://www.instagram.com/username/)

If any handle is taken, **note it but don't block registration**. Social
handles and domain don't have to match perfectly — GBP business name
matching the domain is what matters for citations.

## GBP category (categorical SEO finding)

**Choose: "Lawn care service"** — NOT "Landscaper." This is the biggest
free-SEO win available (per `research/competitors/largo-33771.csv`:
47 GBP-verified competitors use "Lawn care service"; 12 use "Landscaper").
Search volume for "lawn care service [city]" is 3.2× higher.

## NAP template (use verbatim across every citation)

```
PinellasLawn
[real address OR SAB-hidden per draft at drafts/gbp/profile-content.md]
727-XXX-XXXX  [Google Voice — see GBP draft]
https://pinellaslawn.com
```

(If you pick a different name from the matrix, substitute the chosen
brand everywhere `PinellasLawn` appears in this draft.)

## Decision Template — populate after selection

```markdown
# D-0010 — Brand Name and Domain Final Selection (Phase B of D-0007)

**Status:** [Ratified]
**Decision date:** [DATE]
**Decision file:** governance/decisions/0010-brand-final.md
**Review date:** [90 days post-launch]
**Owner:** Steward

## Context

D-0007 ratified strategy. D-0010 selects the specific name and domain
within the $6-10/yr cash ceiling.

## Candidates evaluated

| Candidate | $/yr | Reason selected/rejected |
|---|---|---|
| PinellasLawn.com | $9.15 | SELECTED — strongest SEO + brand defensibility |
| StarkeyYards.com | $9.15 | rejected (slightly weaker SEO; Starkey is one street) |
| PinellasLawn.net | $8.50 | rejected (fallback only if .com is taken) |

## Decision

Selected brand: PinellasLawn
Domain: PinellasLawn.com (primary, no defensive registrations)
GBP profile name: "PinellasLawn"
Registrar: Cloudflare (at-cost, no renewal markup)

## Trademark clearance

- [Live TESS search result — paste link or "no live marks found in Class 037 or 044"]

## Implementation

1. Register PinellasLawn.com on Cloudflare Registrar ($9.15/yr, auto-renew on)
2. Update apps/web/src/lib/business.ts and CLAUDE.md to reference PinellasLawn
3. Create GBP profile with name "PinellasLawn" + matching NAP
4. Build 25-citation burst using NAP template (see drafts/gbp/profile-content.md)

## Deferred until post-revenue

- Defensive domain registrations (PinellasLawn.net, .org, PinellasLawnLLC.com)
- Florida Fictitious Name registration ($50 Sunbiz filing)
- Logo design (Canva DIY if needed)
- Full TESS + state trademark clearance (live search only at this step)

## Risks accepted

- Single domain = total loss on renewal lapse → auto-renew mandatory
- TESS clearance is best-effort live search → re-screen annually post-revenue
- Brand-name typo squatting → mitigated when defensive regs become affordable

## Cost summary

| Item | One-time | Annual |
|---|---|---|
| Primary domain | — | $9.15 |
| **Total Year 1** | **$0** | **$9.15** |
```

## State ledger update (post-selection)

```yaml
- id: OBJ-M2-004
  status: completed
  completed_date: <DATE>
  artifact_ref: governance/decisions/0010-brand-final.md
  domains_acquired:
    - PinellasLawn.com  # primary only; defensive deferred
  rebrand_action_required:
    - "Update CLAUDE.md to reference PinellasLawn"
    - "Update apps/web/src/lib/business.ts (name + url fields)"
    - "Update apps/web/src/app/layout.tsx metadataBase"
    - "Update apps/web/src/components/ServicePage.tsx provider.name"
    - "Re-issue GBP profile (no profile yet, so this is automatic)"
```

## Rebrand work (mechanical, ~30 minutes)

The codebase previously used `GRASS Lawn & Landscape` (per
`apps/web/src/lib/business.ts` and CLAUDE.md). Brand has been
selected as `Largo Landscape` (`.pro` TLD, $4.99/yr Vercel) and the
rename has been applied. Files updated:

- `apps/web/src/lib/business.ts` — name, legal_entity, email
- `apps/web/src/app/layout.tsx` — metadataBase + openGraph url
- `apps/web/src/components/ServicePage.tsx` — JSON-LD provider.name
- `apps/web/src/app/gbp/page.tsx` — page title
- `apps/web/src/app/sitemap.ts` — base URL
- `apps/web/src/app/robots.ts` — sitemap URL
- `apps/web/README.md` — name references
- `.env.example` — `NEXT_PUBLIC_APP_URL` and `EMAIL_FROM`
- `state/ledger.yaml` — OBJ-M2-004 brand entry
- `drafts/gbp/profile-content.md` — NAP template

Single PR, reviewable in 60 seconds.

## Cross-references

- D-0007 Phase A strategy: `governance/decisions/0007-brand-domain.md`
- GBP profile draft: `drafts/gbp/profile-content.md`
- SEO keyword universe: `research/seo/largo-keyword-map.md`
- Competitor matrix: `research/competitors/largo-33771.csv`
- Service area: `governance/decisions/0003-service-area.md`
- Deferred items (entity filing, BTRs, insurance, equipment):
  `state/ledger.yaml` → `objectives.active` (items OBJ-M2-001/002/003/005)