# D-0002 — Tech Stack Primary Selection for Mission 1

**Status:** Ratified (state/ledger.yaml `decisions.ratified`)
**Decision date:** 2026-07-10 (declarative; ratified by Phase 0 exit sign-off 2026-07-10)
**Decision file:** governance/decisions/0002-tech-stack.md (this file)
**Review date:** 2026-10-10 (after 1 month of production use)
**Owner:** Steward

---

## Context

Mission 1 (landscaping in Largo, FL) requires a tech stack that:
- Supports a solo founder without dedicated DevOps.
- Holds the $200/mo infra ceiling through Month 6.
- Maps cleanly onto the 13-agent org structure and platform/package extraction triggers.
- Avoids over-engineering escape hatches.

## Decision

Adopt the following primary stack for Mission 1:

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript strict | One language across web + scripts + workers. |
| Runtime | Bun 1.3.14 | Fastest TypeScript loop; built-in test runner. |
| Framework (web) | Next.js 15 App Router + RSC | Server Actions collapse API into pages. |
| Database | Supabase Postgres | Auth + RLS + Storage + Realtime in one managed service. |
| Auth | Supabase Auth | Bundled with Postgres. |
| Payments | Stripe (Intents) | Customer portal = no billing UI to build. |
| Email | Resend + React Email | Components version-control with code. |
| SMS | Twilio | Transactional only. |
| Routing | Mapbox Optimization API v2 | 3-5× cheaper than Google at solo scale. |
| Background jobs | Inngest free tier | No Redis to babysit. |
| Vector store | pgvector in Supabase | Free until 1M+ vectors. |
| Observability | Sentry + Axiom + PostHog | 3 managed services at $0-25/mo each. |
| SEO tools | Ahrefs Lite + BrightLocal | Citation work is the actual moat. |
| Admin app (M0-6) | Jobber $39/mo | Don't build admin before validating demand. |
| Hosting | Vercel | Zero-DevOps; cron, KV, edge, image opt included. |
| Lockfile | bun.lock (text) | Bun 1.3+ uses text lockfile; committed. |
| Supply-chain | OSV scanner in CI | Non-negotiable. |

## Alternatives considered

| Alt | Why rejected |
|---|---|
| Rails/Django/Laravel | Convention overhead slows solo founder. |
| Rust/Go for web | Compile-deploy-test loops too slow. |
| Self-hosted Postgres | Charter rule: $200/mo ceiling. |
| Firebase | Postgres beats Firestore for real reporting. |
| Turborepo/Nx in Week 1 | Charter rule: only when ≥2 Next.js apps. |
| TypeORM/Prisma initially | Supabase generated types + drizzle-orm suffice until models stabilize. |

## Risks accepted

- **R-INFRA-001** — Self-hosting tax pre-PMF. Mitigation: $200/mo ceiling is charter rule.
- **Vendor lock-in** (Vercel + Supabase + Stripe). Mitigation: business logic in `platform/packages/*`, vendor glue in `apps/*`.
- **Mapbox price tier changes**. Mitigation: routing layer is a thin wrapper; can swap to OSRM (self-hosted) if Mapbox pricing becomes punitive.

## Constraints

- $200/mo infra ceiling holds through Month 6.
- Self-hosting triggers only after MRR > $5K/mo.
- Monorepo tool added only when ≥2 Next.js apps exist.

## Implementation triggers

- D-0002 unlocks `IMPL-001` (Next.js skeleton), `IMPL-002` (Supabase wiring), `IMPL-003` (Jobber integration), `IMPL-004` (Stripe payment intents).

## Review criteria

At 2026-10-10 (1 month post-launch), re-evaluate against:
1. Actual infra spend vs $200/mo ceiling.
2. Build-vs-buy decisions on each component.
3. Any vendor outage or SLA miss.
4. Cost-of-swap estimate for each component.

If infra is sustained >$200/mo without waiver, escalate per R-INFRA-001.