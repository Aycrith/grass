# PRD-00 — Front-End Redesign Master

**Steward:** [your name] (operating as product owner)
**Authoring team:** Engineering + Marketing divisions
**Date:** 2026-07-11
**Status:** Draft v0.1 — awaiting steward creative direction

---

## 1. Problem statement

The current Largo Lawn web app (`apps/web/`) is functional — it has every
required surface, lead capture wired through `@grass/crm-core`, accurate
service pricing, all six service-area ZIPs documented, the GBP landing
page ready, attribution redirectors in place. It builds green. It serves
the steward for a localhost preview.

But it looks like a default template. A resident of 33771 landing on the
homepage cannot distinguish it from a thousand other small-business
landing pages on the web. There is no:

- **Tactile sense of place.** Pinellas County is coastal Florida — bright,
  warm, sandy, palm-shadowed. The current cream-and-green palette is
  tasteful but placeless.
- **Visible craft.** Lawn-care work is a physical craft: the clean edge,
  the stripes in the cut, the smell of fresh mulch. The current cards
  reduce all of that to a bullet list.
- **Local proof.** No photos of yards, no first-name of the operator, no
  sign of the actual place this business serves.
- **Editorial distinction.** Inter is the default SaaS font; system
  borders are the default everywhere. Nothing in the visual language says
  "we mowed 5 yards on this street last week."
- **Trust signals.** Testimonials, before/afters, "this is our truck,"
  "this is the corner of Walsingham and Indian Rocks where we started" —
  none of it.

**Net effect:** a 33771 resident who Googles "lawn care near me" lands on
a page that looks the same as every LawnStarter ad they just scrolled past.
The differentiator (local, solo, named-operator) is buried in copy that
they will not read.

## 2. Goal

Convert the current template-shaped surface into a **distinctive local
business web presence** that:

1. Signals "this is a real person who works in this neighborhood" within
   3 seconds of page load.
2. Carries through visual language from the print collateral
   (door hanger, yard sign, business card) — the steward should see the
   same brand on the lawn sign in front of a 33771 house and on the
   website they hand the homeowner.
3. Lifts the homepage-to-quote conversion rate from current baseline
   (≈0%, because no traffic yet) to a measurable target post-launch
   (target in `07-success-metrics.md`).
4. Performs at Lighthouse ≥90 across all four categories on a mid-tier
   Android over 4G.
5. Is fully editable by the steward once shipped — colors, fonts, copy,
   imagery — without writing code.

## 3. Non-goals (this PRD)

- Build a customer login / quote history portal (separate auth PRD).
- Build an operator / crew app (separate `apps/operator` PRD, post-M3).
- Translate the site to Spanish (deferred — second-largest 33771 language
  per Census 2024 is English ≈84%, Spanish ≈8%).
- Re-architect the data model (this PRD only changes presentation).
- Re-platform (Next.js 15 App Router stays; no Vercel-only features that
  would lock us out of self-hosting).

## 4. Success criteria

| Criterion | Target | How measured |
|---|---|---|
| Lighthouse Performance | ≥90 (mobile, 4G) | Lighthouse CI in pipeline |
| Lighthouse Accessibility | ≥95 | Lighthouse CI in pipeline |
| Lighthouse SEO | ≥95 | Lighthouse CI in pipeline |
| Lighthouse Best Practices | ≥90 | Lighthouse CI in pipeline |
| LCP (Largest Contentful Paint) | ≤2.5s p75 | Web Vitals, RUM via PostHog |
| CLS (Cumulative Layout Shift) | ≤0.1 p75 | Web Vitals, RUM via PostHog |
| INP (Interaction to Next Paint) | ≤200ms p75 | Web Vitals, RUM via PostHog |
| Homepage → `/quote` start rate | ≥8% of unique visitors | PostHog funnel |
| `/quote` → form submit rate | ≥40% of visitors | PostHog funnel |
| Form submit → lead persisted | 100% (server-enforced) | E2E test + lead log |
| Bounce rate (homepage) | ≤55% | PostHog |
| Time on `/quote` page | ≥45s median | PostHog |
| Mobile share of traffic | ≥60% (post-launch, expected) | PostHog device mix |
| Brand recall in steward review | "Looks like a real local business, not a template" | Qualitative steward sign-off |

## 5. Stakeholders

| Stakeholder | Role | Sign-off needed on |
|---|---|---|
| Steward (you) | Product owner, creative director | All creative direction, scope changes |
| Engineering division | Implementation | PRs, build green |
| Marketing division | Copy, photography, attribution | All customer-facing copy |
| Operations division | Forms, lead capture, CRM | `/api/lead` end-to-end |
| QA division | Tests, accessibility | Per-surface acceptance |

## 6. Open questions for the steward

These are the creative-direction decisions only the steward can make.
Engineering will not proceed until each is answered.

| # | Question | Default if unanswered |
|---|---|---|
| Q1 | Is the brand voice **plain-functional** (current Inter, sage green) or **editorial-distinctive** (display serif + earthy accents)? | Plain-functional |
| Q2 | Do we use **real photography** of yards (you take them) or **stylized illustration** (commission an artist) or **both**? | Real photography |
| Q3 | Should the homepage feature a **hero photo** (your mower on a yard), a **brand mark + wordmark only**, or a **rotating seasonal image** (hurricane prep in season, fresh-cut in summer)? | Hero photo |
| Q4 | Is motion **restrained** (hover + page transitions only) or **expressive** (parallax, scroll-linked, cursor interactions)? | Restrained |
| Q5 | Do we display the **operator's name and face** prominently (one-person business = trust signal) or keep the brand abstract? | Operator name + face |
| Q6 | Color palette: **current green-cream-sand** OR **Pinellas-evocative** (palm-shadow green, gulf-blue, sun-bleached sand, terra cotta)? | Pinellas-evocative |
| Q7 | Illustration style for empty states, map markers, iconography: **flat geometric**, **line-art organic**, **hand-drawn**, **isometric**? | Flat geometric |
| Q8 | Should we localize per-ZIP imagery (different photo for 33771 vs 33756) or stay unified? | Unified |

## 7. Scope by surface

The full surface-by-surface PRD is in `03-surfaces-prd.md`. The scope
table here is a high-level preview:

| Surface | Status today | In-scope for redesign |
|---|---|---|
| `/` (homepage) | Centered cream hero, 6 service cards, plain list | Hero composition, service cards with imagery, social proof, operator bio, sticky quote CTA |
| `/services` | 6-card grid | Same as above but service-indexed |
| `/services/[slug]` | Long-form marketing page | Same as above, service-specific hero image |
| `/areas` | 6-card grid | Map visualization, per-ZIP imagery, per-ZIP operator notes |
| `/areas/[zip]` | Long-form area page | Hero photo of that ZIP's signature street, neighborhood-specific copy |
| `/pricing` | Pricing table | Pricing tiers with comparison, FAQ, calculator embed |
| `/about` | About page | Operator bio, photo, equipment list, vehicle, before/after gallery |
| `/contact` | Contact form | Form + map + NAP + hours + text/email options |
| `/quote` | Live calculator (just shipped) | Calculator with imagery, testimonials, scheduling widget |
| `/review` | Placeholder | Post-launch: redirect to GBP review form |
| `/gbp` | GBP landing | Reinforce NAP consistency, hours, service list |
| `/privacy` `/terms` | Stub | Match new visual language |
| `/qr` | QR download page | Match new visual language |
| `/t/[slug]` | Redirector | No visual change needed |

## 8. Charter compliance checklist

- [ ] No edits to `constitution/01-constitution.md`
- [ ] No edits to `AI_Business_Operating_System_Document_Set/`
- [ ] No decisions made without steward input on Q1–Q8
- [ ] No spend: no fonts licensed from paid sources, no stock photo
  purchases, no design-tool subscriptions required
- [ ] Engineering hours logged in `state/ledger.yaml`
- [ ] Capability registrations updated for any new components
- [ ] Decision Template used for any irreversible decision (e.g.,
  "we will use Sanity CMS for blog content")

## 9. Timeline

This PRD package is the front-loaded design phase. Execution phase
(`06-work-packages.md`) is sequenced:

| Phase | Duration | Deliverable |
|---|---|---|
| **Phase A — Steward direction** | T+0 to T+steward-response | Q1–Q8 answered |
| **Phase B — Design system tokens** | T+1 to T+3 | `01-design-system-prd.md` finalized, code tokens merged |
| **Phase C — Surface implementation** | T+4 to T+10 | All 13 surfaces redesigned, build green |
| **Phase D — Photography & assets** | T+1 to T+8 (parallel) | 20+ yard photos, 3 illustrations, 8 icons |
| **Phase E — QA + lighthouse pass** | T+11 to T+12 | All metrics hit |
| **Phase F — Soft launch** | T+13 | DNS cutover, real traffic, monitoring |

## 10. Approval

| Required from | Date |
|---|---|
| Steward (vision + Q1–Q8 answers) | __________ |
| Engineering lead (technical feasibility) | __________ |
| Marketing lead (copy direction) | __________ |

Once all three are signed, Phase B begins.