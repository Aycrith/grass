# Front-End Redesign — PRD Package

**Status:** Draft awaiting steward creative direction
**Owner:** Engineering division + Marketing division (joint)
**Last updated:** 2026-07-11
**Charter reference:** constitution/02-charter.md, governance/05-decision-framework.md

---

## What this package is

A complete front-end redesign brief for the Largo Lawn customer-facing web
app (`apps/web/`). Eight documents cover vision, design system, content
model, per-surface specs, motion, photography, work breakdown, and success
metrics — everything the steward needs to land a design direction that
"makes this look like a real local business that runs a real lawn-care
operation," not a default template.

## Documents in this package

| # | File | Purpose | Audience |
|---|---|---|---|
| 00 | `00-master-prd.md` | Executive vision, problem statement, success criteria, scope/non-scope, stakeholder sign-off checklist | Steward (you) |
| 01 | `01-design-system-prd.md` | Color, typography, spacing, radii, elevation, iconography, motion — concrete token values, with the steward's design direction in `<<…>>` placeholders | Designer + engineer |
| 02 | `02-content-model.md` | What data flows into each surface; what's hard-coded vs. content-sourced; CMS-shaped fields the site needs even if CMS ships later | Engineer |
| 03 | `03-surfaces-prd.md` | Per-route spec for every page: purpose, key states, content slots, success criteria, anti-patterns | Engineer + designer |
| 04 | `04-motion-and-microinteractions.md` | Animation specs (durations, easings, triggers), reduced-motion fallbacks, performance budgets | Designer + engineer |
| 05 | `05-photography-and-illustration-brief.md` | Asset specs: yard photography, brand illustrations, icon style, what NOT to use (stock photo cliches) | Steward (asset procurement) |
| 06 | `06-work-packages.md` | Sequenced ticket breakdown for execution; dependency graph; estimate buckets; what can be parallelized | Engineer (execution) |
| 07 | `07-success-metrics.md` | Quantitative KPIs (CORE Web Vitals, conversion rate, time-to-quote, mobile vs. desktop) + qualitative goals | All |

## Companion routes in `/preview/*`

| Route | What it shows |
|---|---|
| `/preview/design` | Live visual swatches of the design system — color tokens, type scale, components, motion samples. Updates as the steward adds design direction. |
| `/preview/design/surfaces` | Wireframe mockups of each surface with copy slots filled. |
| `/preview/design/comparison` | Side-by-side: current state vs. redesigned state. |

## How to use this package

1. **Steward reviews `00-master-prd.md`** — confirms the problem statement and
   the "what success looks like" check.
2. **Steward provides design direction** — fonts, palette adjustments,
   illustration style, motion philosophy, hero composition, tone of
   imagery. All `<<…>>` placeholders get filled.
3. **Engineering + designer use `01`–`07`** to execute, working through the
   ticket stack in `06-work-packages.md`.
4. **Verification**: `/preview/design` reflects the new direction live;
   `bun run build` is green; lighthouse scores hit the targets in
   `07-success-metrics.md`.

## Out of scope (deferred)

- Native iOS/Android app
- Operator app (separate `/jobs` route, scoped in a different PRD)
- Customer login / quote history (separate auth PRD, post-M3)
- Multilingual (Spanish for 33771 is a future consideration, not in this redesign)
- A/B testing infrastructure (post-redesign; design is uniform for v1)

## Charter compliance

This package does NOT amend `constitution/01-constitution.md` or
`AI_Business_Operating_System_Document_Set/`. All artifacts land under
`product/` (new namespace, no conflict with the legacy archive).