# Paid-Pilot Landing Spec — `/pet-waste`

**Status:** DRAFT (Stage 1 of plan `C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md`)
**Date:** 2026-07-29
**Author:** Claude Code (with steward)
**Scope:** The single landing path for paid Google Search traffic during the pet-waste pilot per D-0064. The existing home page (`/`) and `/quote` are unchanged for organic traffic.
**Supersedes:** For prioritization only — does not replace `output/gtm/01-landing-page-audit.md` (which remains a useful catalog).
**Review date:** 2026-08-29 (with the pilot outcome ADR)

---

## 0. The decision in one paragraph

Build a **single new landing route** at `/pet-waste` with a short, conversion-focused layout: short hero with offer copy and a tap-to-call primary CTA, an inline compact 3-field form, a tap-to-text secondary CTA, a 1-line proof element, and a trust strip that traces only to substantiated claims. **No client-side analytics.** **No GA4, Meta Pixel, CAPI, CallRail, or retargeting.** **The home page is not modified.** This spec is the binding prioritization for Stages 2-4 of the plan; the audit's 16-fix list is no longer the binding fix order.

---

## 1. Problem

The approved plan (`C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md`) requires a single landing path for paid traffic that:

- Surfaces the primary CTA and at least one proof element above the fold without waiting on scroll-driven animation.
- Offers three conversion paths: tap-to-call (`tel:`), tap-to-text (`sms:`), and a 3-field form.
- Reuses existing canonical phone formatting (`BUSINESS.phone` / `BUSINESS.phoneTel` from `apps/web/src/lib/business.ts`).
- Does not regress the design wins landed in WP1-WP89 (liveStatus mobile reposition, trust chips, design-system forms, ZIP persistence, a11y/noscript/reduced-data handling, canonical phone links, D-0059 hero simplification, CLS=0).
- Carries copy that traces only to substantiated claims (per D-0064 §0.10 — strip all unsubstantiated).

The 14-section home page (`apps/web/src/app/page.tsx`) is the wrong landing surface for paid search traffic: cinematic 350svh hero, ~0.7s CTA entrance delay, 5+ editorial sections before the quote form, hidden mobile proof stats. Per the plan's hypotheses (to be tested, not established), this likely suppresses conversion vs. a dedicated message-matched path. Building the dedicated path is cheaper than rebuilding the home page.

---

## 2. Critical files to be created or modified

| File | Action | Stage |
|---|---|---|
| `apps/web/src/app/pet-waste/page.tsx` | **New** | Stage 4 |
| `apps/web/src/app/pet-waste/pet-waste.module.css` | **New** | Stage 4 |
| `apps/web/src/app/pet-waste/PetWasteForm.tsx` | **New** | Stage 4 |
| `apps/web/src/components/contact/PetWasteForm.tsx` (or reuse `ContactForm.tsx` with variant prop) | **New or extend** | Stage 4 |
| `apps/web/src/lib/business.ts` | Extend with `BUSINESS.smsBody` template | Stage 4 |
| `apps/web/src/app/api/lead/route.ts` | Extend `LeadInput` interface with `sms_consent`, attribution fields (Stage 3) | Stages 2 + 3 |
| `apps/web/src/app/privacy/page.tsx` | Add SMS disclosure section per D-0066 | Stage 0 (alongside this spec's ratification) |
| `apps/web/src/components/site/SiteHeader.tsx` | Add tap-to-text alongside tap-to-call | Stage 4 |
| `apps/web/src/components/site/SiteFooter.tsx` | Add `/pet-waste` link | Stage 4 |
| `apps/web/src/components/sections/HeroFieldTelemetry.tsx` | **No change** (home page hero is preserved as-is) | n/a |

---

## 3. Landing path section order (top to bottom, mobile-first)

The `/pet-waste` page is a single short scroll surface. Sections in this order:

1. **Short hero (≤100svh)** — static, no scroll-driven animation, no parallax, no storybook.
   - **Eyebrow:** "Pet-waste cleanup in 33771"
   - **Headline:** "Your yard, scooped."
   - **Subhead:** "Weekly pet-waste cleanup for Largo and the five adjacent Pinellas ZIPs. First cleanup $7.50, then $15/week. No contract."
   - **Primary CTA:** `<a href="tel:+17273138011" class="primary">Call (727) 313-8011</a>` — tap-to-call, no animation gating, available at first paint.
   - **Secondary CTA:** `<a href="sms:+17273138011?&body=Hi%2C%20I%27d%20like%20the%20%247.50%20first%20cleanup">Text us</a>` — tap-to-text.
   - **Trust strip (1 line, above the fold on mobile):** "Serving 33770, 33771, 33773, 33774, 33778, 33756. Quotes within 24 hours. No contract."

2. **Inline form (immediately below hero, no scroll required on mobile)** — compact 3-field form (name, phone, ZIP).
   - **SMS consent checkbox (required):** TCPA-compliant language per D-0066.
   - **Submit button:** "Get my $7.50 first cleanup"
   - **Privacy microcopy (1 line under submit):** "We text back within 5 minutes during business hours (Mon-Fri 7a-5p, Sat 8a-2p). After hours: next morning."

3. **Trust strip (single line)** — verified claims only:
   - "Free quote within 24 hours" (always true)
   - "No contract required" (always true)
   - "Serving 6 Pinellas ZIPs" (matches BUSINESS.service_area_zips — true)
   - **CUT:** "$1M liability insured" (unverified), "Serving 33771 since 2020" (unverified), "5-Star Pet Waste Service" (unverified), "Pinellas County's #1" (unverified), "47 Yards" (unverified), "Family-Owned" (unverified), "Trusted by Largo Neighbors" (unverified), "Same-Day Text Reply" (unverified).

4. **Optional second section (≤50svh)** — what a visit looks like:
   - 3 bullet points: "1. We text to schedule", "2. We scoop, bag, and haul off", "3. Next visit in 7 days".
   - Static SVG illustration (reuse existing `apps/web/public/illustrations/grass-blade-cluster-xl.svg` or similar, no new asset weight).

5. **Footer** — same SiteFooter as the home page, plus link to `/pet-waste` itself.

**Hard rules:**

- Primary CTA and at least one proof element visible without scroll on a 360×640 viewport.
- Primary CTA interactive immediately on load. No entrance delay.
- No scroll-driven animation, parallax, or storybook.
- Form submits to `/api/lead` with the existing endpoint contract + new `sms_consent` field (Stage 2) + new attribution fields (Stage 3).

---

## 4. Conversion paths

Three paths, all using canonical phone formatting:

| Path | Markup | Source of truth |
|---|---|---|
| Tap-to-call | `<a href="tel:+17273138011">Call (727) 313-8011</a>` | `BUSINESS.phoneTel` from `apps/web/src/lib/business.ts` |
| Tap-to-text | `<a href="sms:+17273138011?&body=...">Text us</a>` | `BUSINESS.phoneTel` from `apps/web/src/lib/business.ts` |
| Form | 3-field form (name, phone, ZIP) → POST to `/api/lead` | `BUSINESS.service_area_zips` for ZIP validation |

The `sms:` body is templated: `Hi%2C%20I%27d%20like%20the%20%247.50%20first%20cleanup`. Stored as `BUSINESS.smsBody` so the steward can edit in one place.

The form's `tel:` link fallback is also `BUSINESS.phoneTel`. The success state shows the same phone number.

---

## 5. Form contract (extends Stage 2 + Stage 3 of the plan)

`LeadInput` interface in `apps/web/src/app/api/lead/route.ts` gains these fields (new in Stages 2 and 3):

```ts
interface LeadInput {
  // ... existing fields ...
  sms_consent?: boolean;          // Stage 2 (per D-0066)
  utm_source?: string;            // Stage 3
  utm_medium?: string;            // Stage 3
  utm_campaign?: string;          // Stage 3
  utm_term?: string;              // Stage 3
  utm_content?: string;           // Stage 3
  gclid?: string;                 // Stage 3 (Google Ads click ID)
  landing_path?: string;          // Stage 3 (e.g., "/pet-waste")
  referrer?: string;              // Stage 3
  device_class?: string;          // Stage 3 (mobile/tablet/desktop)
  first_touch_at?: string;        // Stage 3 (ISO timestamp)
}
```

The `/pet-waste` form populates every field from URL params on mount, with fallback to localStorage for `utm_*` and `gclid`. The `/t/[source]` redirect is fixed in Stage 3 so paid traffic arrives with full attribution intact.

---

## 6. Existing utilities to reuse

| Utility | File | Reuse for |
|---|---|---|
| `BUSINESS.phone`, `BUSINESS.phoneTel` | `apps/web/src/lib/business.ts` | Canonical `tel:` / `sms:` formatting |
| `BUSINESS.service_area_zips` | `apps/web/src/lib/business.ts` | ZIP validation in form |
| Shared `Input`, `Button`, `Card` primitives | `apps/web/src/components/ui/` | Form fields and CTAs |
| ZIP persistence logic | `apps/web/src/app/contact/ContactForm.tsx`, `QuoteCalculator.tsx` | Pre-fill ZIP from localStorage |
| `sendLeadResponse` | `@grass/notifications-core` | Auto-acknowledgement (email + SMS where `sms_consent===true`) |
| Server-side PostHog `lead_captured` | `apps/web/src/app/api/lead/route.ts` | Single analytics event source |
| Motion/reduced-motion/no-JS handling | `apps/web/src/components/site/CookieConsent.tsx`, layout patterns | Accessibility preservation |
| AVIF/WebP/JPEG image cascade | `next/image` config | Hero illustration weight |
| `inServiceArea` | `apps/web/src/lib/business.ts` | ZIP validation |

---

## 7. Non-regression list (DO NOT regress these — Stage 4 acceptance criteria)

The following design wins landed in WP1-WP89 must be preserved across Stages 2, 3, and 4. Stage 4 acceptance includes running existing visual/motion/a11y suites green:

- `liveStatus` widget repositioning and the recent mobile `liveStatus` fix.
- Trust chips on `FinalCTABanner` (on the home page only; `/pet-waste` uses the new trust strip from §3).
- Design-system form controls (Input, Button, Card).
- ZIP persistence across coverage, quote, and contact flows.
- A11y improvements: `aria-current`, error focus, noscript fallback, reduced-data video gating.
- Canonical phone source consolidation (the `BUSINESS.phoneTel` migration per `907f302` and `818ff8c`).
- D-0059 hero simplification (the home page hero only — `/pet-waste` does not use it).
- D-0060 five-plane hero architecture (home page hero only).
- CLS=0 across the site.
- Reduced-motion and coarse-pointer gating.

The `/pet-waste` page must not regress these on the home page. The home page is not modified by Stages 2-4 of this spec.

---

## 8. Out of scope (do not build before Stage 6 outcome ADR)

Per D-0064 §0.9, the following are explicitly out of scope for the pilot and must not be implemented in Stages 2-5:

- **GA4 / gtag installation** — server-side PostHog only.
- **Meta Pixel** — server-side PostHog only.
- **Meta Conversions API (CAPI)** — server-side PostHog only.
- **Client/server event-ID deduplication** — no client events to dedupe against.
- **CallRail or any call-tracking SaaS** — manual offline reconciliation.
- **Retargeting audiences** — defer until traffic is meaningful.
- **Multi-campaign / multi-ad-group structure** — single Google Search campaign only.
- **LTV modelling** — measure CAC against booked gross margin only.
- **Full hero/motion redesign** — `/pet-waste` hero is static, ≤100svh; home page hero is preserved.
- **Meta/organic social and SEO content build-out** — out of scope for an ad-led pilot.

Reintroduction of any of the above before the Stage 6 outcome ADR is written is a **hard-stop** per the plan's stop conditions.

---

## 9. Hero / motion / asset / debug-output reduction

Scope is reduction, not redesign:

- **Hero:** static, ≤100svh, no scroll-driven animation, no parallax. No `useScroll`, `useSpring`, `useTransform`.
- **Motion:** if any motion is used, it's a single fade-up on form submit success. No entrance animations on CTAs.
- **Asset weight:** reuse existing SVGs from `apps/web/public/illustrations/` for the optional second section. No new image generation. No BTS videos.
- **Debug output:** zero `console.log` statements on the `/pet-waste` page. Existing production debug logs in `apps/web/src/components/sections/HeroFieldTelemetry.tsx` are out of scope for this spec (they live on the home page hero).

---

## 10. Performance budget

`/pet-waste` must meet these targets on a throttled 4G mobile profile:

- **Lighthouse mobile score ≥ 90** (currently 82 on the home page is stale).
- **LCP < 2.5s** on a 360×640 viewport.
- **CLS = 0** (preserved site-wide; this spec is no exception).
- **TBT < 200ms** (currently ~240ms on the home page is stale).
- **Total JS shipped ≤ 80KB** (no Framer Motion, no scroll-driven components).

The home page is measured separately; its Lighthouse baseline is recorded as a new entry at Stage 4 completion (the 82 score predates the 14-section expansion).

---

## 11. Acceptance criteria

This spec is "ready for Stage 2 build" when:

- [x] Single landing path named (`/pet-waste`).
- [x] Section order defined (5 sections, mobile-first).
- [x] Three CTA paths defined (call, text, form).
- [x] Canonical phone formatting sourced from `BUSINESS.phoneTel`.
- [x] Form contract extended with `sms_consent` and attribution fields.
- [x] Non-regression list defined.
- [x] Out-of-scope list explicitly marked.
- [x] Hero/motion/asset reduction scoped.
- [x] Performance budget defined.
- [ ] Privacy page updated (Stage 0 deliverable, pending).
- [ ] Steward sign-off recorded.

This spec is "complete" after Stage 4 ships and:

- [ ] Visual/motion/a11y suites pass green.
- [ ] New CTA tests pass green.
- [ ] Manual real-device passes on iPhone, mid-range Android, touch laptop.
- [ ] Fresh Lighthouse mobile baseline recorded.
- [ ] Privacy page SMS disclosure published.
- [ ] All claims on the page trace to the substantiated list in §3.

---

## 12. Hypotheses to be tested by the pilot (NOT findings)

The plan labels these as hypotheses; this spec preserves that framing:

- That a dedicated `/pet-waste` landing path converts better than the home page for paid search traffic.
- That tap-to-text alongside tap-to-call lifts response rate.
- That a 3-field compact form converts better than a 6-field form on cold traffic.
- That static hero (no scroll-driven animation) preserves CTA interactivity and LCP.

Each is tested by the pilot, not assumed. Pilot outcome ADR records which hypotheses were supported or refuted.

---

## 13. Related ADRs and references

- **D-0064:** Paid-acquisition pilot scope and spend envelope.
- **D-0065:** Pet-waste service-line ratification.
- **D-0066:** Outbound SMS consent language.
- **`C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md`:** Approved plan; this spec is Stage 1.
- **`output/gtm/01-landing-page-audit.md`:** Original audit (superseded for prioritization; useful as a catalog).
- **`output/gtm/README.md`:** Supersession notice added 2026-07-29.
- **`apps/web/src/lib/business.ts`:** Canonical phone and service area source.
- **`apps/web/src/app/api/lead/route.ts`:** Lead API (extending per Stages 2 + 3).
