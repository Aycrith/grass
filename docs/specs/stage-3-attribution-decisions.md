# Stage 3 — Trustworthy Attribution at the Lead Record: Final Recommendation Package

Synthesized from three lenses (schema, operational, naming-taxonomy) and the adversarial refutation. Citations are `path:line` or `ADR §`; absolute paths shown for the canonical files.

Canonical files reviewed:
- `C:\Users\camer\DEVNEW\GRASS\analytics\kpi-taxonomy.md` (122 lines, full read)
- `C:\Users\camer\DEVNEW\GRASS\platform\packages\crm-core\src\service.ts`
- `C:\Users\camer\DEVNEW\GRASS\apps\web\src\app\api\lead\route.ts`
- `C:\Users\camer\DEVNEW\GRASS\apps\web\src\app\quote\QuoteCalculator.tsx`
- `C:\Users\camer\DEVNEW\GRASS\apps\web\src\app\contact\ContactForm.tsx`
- `C:\Users\camer\DEVNEW\GRASS\apps\web\src\app\t\[source]\route.ts`
- `C:\Users\camer\DEVNEW\GRASS\architecture\twin\lead.md`, `marketing.md`, `customer.md`, `quote.md`, `job.md`
- `C:\Users\camer\DEVNEW\GRASS\docs\ specs\paid-pilot-landing-spec.md` §5
- `C:\Users\camer\DEVNEW\GRASS\output\gtm\03-google-ads-campaign-draft.md` §419-425
- `C:\Users\camer\DEVNEW\GRASS\governance\decisions\0064-paid-acquisition-pilot.md`, `0065-pet-waste-service-ratification.md`, `0066-outbound-sms-consent.md`
- `C:\Users\camer\.claude\plans\review-the-plans-recently-lucky-catmull.md` Stage 3

---

## 1. TL;DR

**Decision A (Lifecycle storage):** Adopt a **derived** `lifecycle_stage` value (`new | contacted | quoted | booked | collected | retained`) computed by a pure function `leadLifecycleStage(lead, quote?, job?, invoice?, customer?)` and materialized only by the nightly `workflows/nightly-kpi-snapshot.ts` into `KPISnapshot.actual_*` per `analytics/kpi-taxonomy.md:98`. Add exactly three stored override fields on Lead (`lifecycle_stage_override`, `lifecycle_stage_override_at`, `lifecycle_stage_override_by`). **Do not extend `LeadStatus`** — adding `booked`/`collected`/`retained` to that union would change the `Lead contacted+` denominator at `analytics/kpi-taxonomy.md:31` and trigger a Decision Template per `:115-122`. Stage-entry timestamps (`booked_at`, `collected_at`, `retained_at`) live on the owning record (Job, Invoice, Customer) and are **not** copied onto Lead; the only net-new `*_at` on Lead in Stage 3 is `first_touch_at`.

**Decision B (Stage-field timing):** Ship in Stage 3 PR: the **10 attribution fields** (mandatory by Stage 3 §1), the **3 override fields**, an append-only `lead_events` audit table, and the **wire-up of the two already-reserved fields** `first_response_at` (`service.ts:54`) and `converted_customer_id` (`service.ts:55`) that have been declared since pre-Stage-2 but never written. Defer: nullable `*_at` projections on Lead, `LeadStatus='unqualified'` expansion, dedicated Inngest per-transition jobs, cross-table dashboard visualization. Computed `lifecycle_stage` is exposed by read APIs the moment attribution fields start populating — no separate work item required.

**Decision C (Attribution field names):** Adopt the **ten fields from `docs/specs/paid-pilot-landing-spec.md` §5 lines 108-121 verbatim**, in snake_case, with three additions to `architecture/twin/marketing.md` (`utm_term`, `utm_content`, the 6-value `utm_medium` controlled vocabulary) so that `architecture/twin/marketing.md` Invariant #1 ("Every Lead MUST trace to exactly one MarketingCampaign") stays satisfiable. Names: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `landing_path`, `referrer`, `device_class`, `first_touch_at`. All ten are nullable, all captured server-side (no client analytics tags, per D-0064 §0.9). Stop the `QuoteCalculator.tsx:172` squash `${utm.source}:${utm.campaign}` and the `t/[source]/route.ts:50` hardcoded `utm_medium='social'` in the same PR.

**Persistence, redirect, consent, conversion:** First-party `localStorage` key `grass_attribution_v1` (30-day TTL, set on first `/t/[source]` or first landing-path mount, no consent gate because no third-party cookies) bridges cross-page navigation; the server is the source of truth. The `/t/[source]` `CHANNELS` table at `t/[source]/route.ts:15-32` gains a per-row `utm_medium` and per-row passthrough of `gclid`, `utm_term`, `utm_content` from inbound querystring; unknown slugs log instead of silently falling through. `CookieConsent` is simplified to a single no-opt-in notice ("anonymous server-side PostHog only") or removed entirely. **Booked-job conversion** is canonical event = first `Job` (status∈{scheduled,en_route,on_site,in_progress,completed}) linked to the lead via `Quote.id`; surfaced as `lifecycle_stage='booked'` plus an optional materialised `booked_job_id` on Lead for O(1) dashboard reads.

---

## 2. Decision A — Lifecycle storage

**Recommendation: derived `lifecycle_stage` + 3-field stored override + append-only `lead_events` audit.**

The three lenses converge here. The schema lens's "hybrid" (append-only event log + nullable projections), the ops lens's "derive from related entities + 3 manual flags", and the naming lens's `leadLifecycleStage()` pure function are the same design at three levels of detail. The refutation caught that adding `booked`/`collected`/`retained` to `LeadStatus` (which both the schema and ops lenses proposed in some form) is forbidden: it changes the `Lead contacted+` denominator at `analytics/kpi-taxonomy.md:31` and the `Quote accepted+sent` denominator at `:31-32`, which is a Decision-Template event per `:115-122`. The naming lens's "do not touch LeadStatus" rule wins.

### Exact field set

**Net-new stored fields on `Lead` (3 total):**

| Field | Type | Required? | Source of truth |
|---|---|---|---|
| `lifecycle_stage_override` | `LifecycleStage \| null` | optional | Steward manual write only; principal.role === 'steward' required |
| `lifecycle_stage_override_at` | ISO 8601 UTC string \| null | optional | Auto-stamped on override write |
| `lifecycle_stage_override_by` | `string \| null` (principal id) | optional | Audit per `analytics/kpi-taxonomy.md:56` (Decision reviewed_by convention) |

**Wire-up of two pre-existing reserved fields (zero schema change):**

| Field | Type | Currently | Target |
|---|---|---|---|
| `first_response_at` | ISO 8601 string \| undefined | Declared `service.ts:54`, never written by any route path | Set on first `acknowledgement_status='sent'` at `route.ts:303-311` branch |
| `converted_customer_id` | `string \| null` | Declared `service.ts:55`, computed at `service.ts:201` but never persisted | Persist the value computed at `service.ts:201` in the route handler that calls `convertLeadToCustomer` |

**Append-only sibling table (additive, no migration of existing rows):**

```
lead_events(
  id            uuid pk,
  lead_id       text fk -> lead.id,
  event_type    text,   -- 'status_change' | 'manual_override' | 'lifecycle_change'
  from_status   text,   -- LeadStatus
  to_status     text,   -- LeadStatus
  actor         text,   -- principal id; 'system' for auto
  reason        text,   -- free-form; required for manual_override
  occurred_at   timestamptz default now(),
  idempotency_key text  -- nullable; reuse Lead.idempotency_key contract
)
```

Write path: every status transition in `service.ts:127` (new), `:182` (qualified), `:201` (won), the implicit `contacted` transition when `acknowledgement_status` flips to `sent`, and any `lifecycle_stage_override` write emits one `lead_events` row. Fire-and-forget on the hot path, queue-backed so `crm-core` remains runtime-agnostic (no Postgres triggers) per `architecture/twin/lead.md` doctrine.

**Derived value set (`LifecycleStage`):**

```
type LifecycleStage =
  | 'new'        // Lead.status='new' — crm-core service.ts:127
  | 'contacted'  // Lead.status='contacted' OR first_response_at != null — analytics/kpi-taxonomy.md:31 verbatim
  | 'quoted'     // exists Quote WHERE lead_id = L.id AND status IN ('sent','accepted')
  | 'booked'     // exists Job WHERE quote_id IN (Quote.id for L) AND status IN (scheduled..completed)
  | 'collected'  // exists Invoice WHERE customer_id = L.converted_customer_id AND status='paid'
  | 'retained'   // Customer.status='active' AND cadence≠'one_off' for ≥90 days
```

**Deviations from plan prose (justified, flagged for steward sign-off in §11):**

- Plan text says `lead` as first stage → use `new` (CF-01: collides with `CustomerStatus='lead'` at `service.ts:20-23`).
- Plan text says `paid` as fifth stage → use `collected` (CF-02: collides with paid-traffic vocabulary `utm_medium='cpc'`, source `paid_search` introduced in the same Stage 3 PR; "paid lead" becomes ambiguous in both directions).
- Plan text says `booked | paid | retained` end-to-end → map to `booked | collected | retained`. Definitionally identical to plan prose; only the tokens change.

**Rejected alternatives (one-line each):**

- **Extend `LeadStatus` with `booked | collected | retained | unqualified`.** Forbidden by `analytics/kpi-taxonomy.md:115-122` (denominator change → Decision Template event) and by naming lens CF-06 (`won` and `booked` become synonyms).
- **Dual-write `status` + `lifecycle_stage` columns.** Drift inevitable; the `accepted+sent` notation at `kpi-taxonomy.md:31` assumes a single status field per record (taxonomy constraint #3).
- **Pure event-sourcing (`current_status` derived from `lead_events` only).** Breaks every read at `service.ts:127, :182, :201`; no charter-binding reason to undertake it at 25 customers (taxonomy `:23` target).

---

## 3. Decision B — Stage-field timing

**Recommendation: add-now-minimal (10 attribution + 3 override + 2 wire-ups + 1 audit table) + defer projections.**

The schema lens's "add_now_minimal_defer_rest" is the right shape; the naming lens's "compute at read; materialize nightly; never write on the lead-capture request path" is the right cadence; the ops lens's "only the 3 manual override flags + the 2 auto-set reserved fields" is too narrow — Stage 3 §1 mandates the attribution field set NOW, and the ops lens's proposed extension of `LeadStatus` (`unqualified`) is forbidden by Decision A above.

### Minimum-viable set in this PR (12 changes)

1. Add 10 nullable attribution fields to `Lead` interface in `platform/packages/crm-core/src/service.ts:43-71` (names verbatim, types per Decision C).
2. Add 3 nullable override fields (`lifecycle_stage_override*`) to the same interface.
3. Add `LifecycleStage` type alias and `leadLifecycleStage()` pure function in `crm-core`.
4. Wire `first_response_at` write in `apps/web/src/app/api/lead/route.ts` on the `acknowledgement_status='sent'` branch (`:303-311`).
5. Wire `converted_customer_id` write on the route that calls `convertLeadToCustomer` (`service.ts:201`) — this is the existing 1-call path, just persist what was being computed-and-discarded.
6. Create `lead_events` append-only table (DDL in this PR; no data backfill required for new rows).
7. Stop the squash at `apps/web/src/app/quote/QuoteCalculator.tsx:171-172`; send all 10 fields discretely in the form payload.
8. Add UTM capture to `apps/web/src/app/contact/ContactForm.tsx` (currently zero hits for `utm_*` — `apps/web/src/app/contact/ContactForm.tsx` full read).
9. Update `apps/web/src/app/t/[source]/route.ts:48-50`: extend each `CHANNELS` row with `utm_medium`, pass through `gclid`/`utm_term`/`utm_content` from inbound querystring, log unknown slugs instead of silent fallthrough at `:43-46`.
10. Widen `Lead.source` union at `service.ts:21` from 6 members to include `paid_ad`, `paid_search`, `door_hanger`, `walk_in` so the unsound `as`-cast at `route.ts:250-258` becomes sound (also fixes architecture/twin lead.md `gpb_form` typo — see §11 risk CF-05).
11. Update `PostHog` `lead_captured` event at `route.ts:355-364` to include attribution fields as PostHog properties (not as `lead.source`) so server-side analytics mirrors the new contract (D-0064 §0.9 "exactly one analytics source").
12. Update `analytics/kpi-taxonomy.md` in the same commit per Stage 3 §4 (Attribution field vocabulary + Lead lifecycle stages + Paid search CAC row) — see §9.

### Deferred to Stage 3.1 / Stage 4

- Nullable `qualified_at | quoted_at | booked_at | collected_at | retained_at` projections on Lead — derivable from `lead_events` + downstream state changes; compute on read.
- `LeadStatus='unqualified'` expansion — would change `Lead contacted+` denominator semantics; requires DT per `kpi-taxonomy.md:115-122`; coordinate with finance + sales owner-pairing duty at `:106-113`. Suggest opening as ADR-0067 in this PR's follow-up queue but not landing here.
- `fbclid | msclkid | yclid | ttclid` — explicitly out of pilot scope per D-0064 §0.1; reintroduce only when those networks activate via a fresh ADR.
- Cross-table dashboard component — ship the data in Stage 3; visualisation in Stage 4 dashboard work per `MEMORY.md` "v3 pipeline section" precedent (2026-07-28).
- 14-day auto-suggest for `lost` — cron job to land with Stage 4 Inngest worker per `analytics/kpi-taxonomy.md:98` reference to `workflows/nightly-kpi-snapshot.ts`.

### Test gate (verbatim from plan §Acceptance Criteria)

`Stage 3 attribution tests green (synthetic ad-click URL produces a lead record with every field populated correctly, including through a /t/ redirect)`. Test files: `apps/web/tests/attribution/` — synthetic ad-click URL pattern from `output/gtm/03-google-ads-campaign-draft.md §419-425` final-URL shape: `https://largolawn.pro/pet-waste?utm_source=google&utm_medium=cpc&utm_campaign=pw_search&utm_term=lawn+care+near+me&utm_content=free_first_cleanup&gclid=CKq7x9...`, redirected through `/t/google-ads`, landing on `/quote`, submitting the form, asserting all 10 fields populate on the Lead row.

---

## 4. Decision C — Attribution field names (exact)

**Recommendation: ten fields verbatim from `docs/specs/paid-pilot-landing-spec.md §5:108-121` + one pre-existing reservation, all snake_case, all nullable.**

Repo-wide ripgrep confirms zero collisions in `analytics/kpi-taxonomy.md`, `crm-core`, and the twin models for any of these names (CF-10 in the naming audit). Three of them (`utm_source`, `utm_medium`, `utm_campaign`) are already anchored to `architecture/twin/marketing.md` MarketingCampaign; the other seven are net-new to the marketing twin and must be added there in the same change so Invariant #1 stays satisfiable.

| # | Field | Type | Required? | Owner | Authority |
|---|---|---|---|---|---|
| 1 | `utm_source` | `string \| null` | optional | marketing | `architecture/twin/marketing.md` (pre-existing) + spec §5:110 |
| 2 | `utm_medium` | `string \| null` (controlled vocab: `cpc \| social \| referral \| email \| print`) | optional | marketing | `architecture/twin/marketing.md` (pre-existing, vocab extended) + spec §5:111 |
| 3 | `utm_campaign` | `string \| null` | optional | marketing | `architecture/twin/marketing.md` (pre-existing) + spec §5:112 |
| 4 | `utm_term` | `string \| null` (search-only) | optional | seo | `output/gtm/03-google-ads-campaign-draft.md §419-425` + spec §5:113 (net-new to marketing twin) |
| 5 | `utm_content` | `string \| null` | optional | marketing | `output/gtm/03-google-ads-campaign-draft.md §419-425` + spec §5:114 (net-new to marketing twin) |
| 6 | `gclid` | `string \| null` (vendor token, lowercase, verbatim) | optional | marketing | spec §5:115. Per D-0064 §0.1 the only in-scope click-id in pilot. |
| 7 | `landing_path` | `string \| null` (pathname only, e.g. `/pet-waste`) | optional | marketing | spec §5:116. NOT `landing_page` (would imply a page record). |
| 8 | `referrer` | `string \| null` (hostname only) | optional | seo | spec §5:117. Two-r spelling (HTTP header `Referer` is the historical typo — never use it in code). |
| 9 | `device_class` | `'mobile' \| 'tablet' \| 'desktop' \| null` | optional | marketing | spec §5:118. Server-derived from `User-Agent` header (use `ua-parser-js` or ~3KB equivalent). Raw UA is NOT stored. |
| 10 | `first_touch_at` | ISO 8601 UTC string \| null | optional | marketing | spec §5:119. Set ONCE in `createLead` (`service.ts:127`) from request timestamp; immutable thereafter; never overwritten on idempotent re-submit (the `idempotency_key` short-circuit at `route.ts:120-131` returns the existing row). Disambiguation note: `first_touch_at` = visitor-side first landing (attribution); NOT the SLA clock — see `first_response_at`. |

### Naming-convention rules (binding on Stage 3 and after)

These are derived from `analytics/kpi-taxonomy.md` and the existing `crm-core` field names; the full audit is in the naming lens. The load-bearing subset:

- **snake_case everywhere** (taxonomy: `gross_margin_cents`, `marketing_spend`, `new_customers`, `billable_hours`; crm-core: `acknowledgement_status`, `first_response_at`, `idempotency_key`).
- **Timestamps `_at` suffix, ISO 8601 UTC `Z`-suffixed** (crm-core: `created_at`, `updated_at`, `first_response_at`; spec §5).
- **Vendor tokens verbatim and lowercase** (`gclid`, not `click_id`; future `msclkid`, `fbclid` get their own columns).
- **The state field is always `status`** — `lead_status` is permanently banned (`analytics/kpi-taxonomy.md:23, :51, :53-54` all use `status` against four different records).
- **`stage` is permanently reserved** for the paid-pilot 7-stage rollout (D-0064 §10 file table; `// Stage 2 additions` comment at `service.ts`). Only `lifecycle_stage` and its three `lifecycle_stage_override*` siblings may use the word.
- **`source_detail`** (twin `lead.md:18`): leave unimplemented; add a twin note banning UTM values in it (CF-11).

### Fields explicitly excluded with reason

| Excluded | Reason |
|---|---|
| `ip` | Privacy; `route.ts:133-140` uses transiently for rate limit only, never persisted per `architecture/twin/lead.md` PII discipline. |
| `user_agent` (raw) | Derived into `device_class` instead; raw UA strings are unbounded and PII-adjacent. |
| `fbclid`, `msclkid`, `yclid`, `ttclid` | Out of pilot scope per D-0064 §0.1. |
| `utm_id` | Not a standard UTM parameter; Google's click identifier is `gclid`. |
| `full_landing_url`, `full_referrer_url` | PII risk — query strings frequently contain UTM tokens that double-store data. Pathname only / hostname only. |
| `session_id`, `visitor_id` | PostHog's `distinct_id` (currently `lead.id` at `route.ts:355-364`) is the canonical session handle. Second session key breaks `kpi-taxonomy.md` "exactly one analytics source" rule. |
| `attribution`, `attribution_source`, `attribution_data` | The word is spoken for by image/photo credit (D-0024 / D-0043 precedent; 30+ hits in `content.ts`, `ServiceBeforeAfter.tsx`, `OperatorNote.tsx`, LICENSE). Use the discrete `utm_*` names. |

---

## 5. Persistence mechanism

**Recommendation: server-side capture at `/api/lead` (source of truth) + first-party `localStorage` key `grass_attribution_v1` (cross-page/refresh bridge).**

Stage 3 §1 mandates: "Attribution survives navigation between landing path, /quote, and /contact, and survives page reload." The current QuoteCalculator (`apps/web/src/app/quote/QuoteCalculator.tsx:116-122`) reads from `window.location.search` only, which loses attribution on refresh and on `/contact` (which has zero UTM capture — full file read). The fix is two-layer.

### Server-side capture (primary, source of truth)

- `/api/lead` reads the ten attribution fields from the POST body (which the forms populate from `localStorage` and from `window.location.search` at submit time).
- Server-side derivation at `route.ts`:
  - `landing_path` — from a new `X-Landing-Path` request header (set by a tiny middleware on first request), or fallback to a pathname parsed from `Referer`.
  - `referrer` — from `Referer` header, hostname-only.
  - `device_class` — from `User-Agent` header, parsed by `ua-parser-js`.
  - `first_touch_at` — `Date.now()` at `createLead` (`service.ts:127`); NEVER overwritten on idempotent re-submit because the `idempotency_key` short-circuit at `route.ts:120-131` returns the existing lead before `createLead` runs.
  - All `utm_*` and `gclid` — passthrough from the form body.
- Lead row is the source of truth for attribution; everything else is a read-side projection.

### Client-side bridge (secondary, cross-page/refresh)

- Single `localStorage` key `grass_attribution_v1` (versioned suffix so we can migrate the schema without breaking reads).
- TTL: **30 days** (covers the longest realistic referral-to-quote window; longer TTL is fine but expires the `gclid` Google-side attribution credit).
- Schema: `{"utm_source":..., "utm_medium":..., "utm_campaign":..., "utm_term":..., "utm_content":..., "gclid":..., "landing_path":..., "referrer":..., "device_class":..., "first_touch_at":...}`.
- Write triggers:
  - First hit on any `/t/[source]` route (the redirector writes before the 302 fires).
  - First hit on `/quote`, `/contact`, or `/pet-waste` (page-mount `useEffect`).
  - First-touch semantics: once written, `first_touch_at`, `utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `landing_path` are immutable for the TTL window. `utm_term`, `utm_content`, `referrer`, `device_class` are last-touch (overwritten on each new visit) for remarketing-style analysis.
- Read triggers:
  - `QuoteCalculator.tsx` mount: hydrate hidden form fields from `localStorage`, fall back to `window.location.search`.
  - `ContactForm.tsx` mount: same.
- Form submit: every field flows into the POST body to `/api/lead`; the server overwrites `first_touch_at` only if it's missing on the Lead row.
- No consent gate: localStorage is first-party; no third-party cookies; D-0064 §0.9 mandates server-side PostHog only; D-0066 SMS consent gate covers SMS-specific use of phone data.

### Why not cookies

First-party cookies are equivalent for this purpose but harder to scope to a single path (`/`) without server-set headers. localStorage keeps the migration contained to the SPA without route-handler changes. Keep cookies in reserve for the (deferred) cross-device stitching work.

### Why not URL params alone

Stage 3 §1 explicitly requires survival across navigation and reload; URL params die on refresh and on cross-page navigation that doesn't forward them. The current `t/[source]/route.ts:48-50` already does URL-param forwarding for three fields; we keep that as a fallback for crawlers/no-JS, but localStorage is the primary bridge.

---

## 6. /t/[source] redirect fix

**Recommendation: extend `CHANNELS` rows with `utm_medium`; pass through `gclid`/`utm_term`/`utm_content`; log unknown slugs.**

`apps/web/src/app/t/[source]/route.ts:50` hardcodes `url.searchParams.set('utm_medium', 'social')` for every channel — 12 of the 16 channels at `route.ts:15-32` are mislabelled (Stage 3 §3 violation; CF-04 in the naming audit). The fix is additive and lands in the same PR.

### Per-channel `utm_medium` remap

Controlled vocabulary per Decision C: `cpc | social | referral | email | print`. Mapping (each row's `utm_medium` becomes the value the redirect sets, NOT `'social'`):

| Channel slug | Destination | `utm_source` (unchanged) | `utm_campaign` (unchanged) | `utm_medium` (NEW) |
|---|---|---|---|---|
| `google-ads` | `/quote` | `google_ads` | `paid_search` | `cpc` |
| `bing-ads` | `/quote` | `bing_ads` | `paid_search` | `cpc` |
| `meta-ads` | `/quote` | `meta_ads` | `paid_social` | `cpc` (or delete slug — see §11 risk) |
| `nextdoor-free-mow` | `/quote` | `nextdoor` | `free_first_mow` | `social` |
| `nextdoor-general` | `/quote` | `nextdoor` | `general_intro` | `social` |
| `nextdoor-hurricane` | `/quote` | `nextdoor` | `hurricane_prep` | `social` |
| `nextdoor-referral` | `/quote` | `nextdoor` | `referral_credit` | `social` |
| `nextdoor-local-deal` | `/quote` | `nextdoor` | `local_deal` | `social` |
| `fb-marketplace` | `/quote` | `facebook` | `marketplace_listing` | `social` |
| `fb-group` | `/quote` | `facebook` | `group_post` | `social` |
| `craigslist` | `/quote` | `craigslist` | `tampa_bay` | `referral` |
| `thumbtack` | `/quote` | `thumbtack` | `lead_gen` | `referral` |
| `door-hanger` | `/quote` | `door_hanger` | `neighborhood_drop` | `print` |
| `yard-sign` | `/quote` | `yard_sign` | `curb_appeal` | `print` |
| `business-card` | `/contact` | `business_card` | `in_person` | `print` |
| `review-card` | `/review` | `review_magnet` | `post_service` | `print` |

Note: vocab uses `print` for physical collateral rather than `offline` (a negation; naming lens reserved-list rationale).

### Passthrough

For each redirect, also forward these if present on the inbound querystring (currently lost):
- `gclid` (Google auto-appends; verbatim lowercase)
- `utm_term` (search-keyword)
- `utm_content` (creative name)

The redirect handler at `route.ts:38-52` extends: `url.searchParams.set(channel.utm_medium_field, channel.utm_medium)` (per-row lookup, replacing the literal `'social'`); `if (inbound.gclid) url.searchParams.set('gclid', inbound.gclid)`; same for `utm_term`, `utm_content`.

### Unknown-slug handling

Currently `route.ts:43-46` silently falls through to `/quote` with no UTM params. Replace with: `console.warn({event: 't_unknown_slug', slug, ts: Date.now()})` (structured log; future PostHog event hook), then redirect to `/quote` with `utm_source='unknown'`, `utm_medium='referral'`, `utm_campaign='unattributed_redirect'`. Attribution is preserved (visible in PostHog as a spike) instead of silently lost.

---

## 7. CookieConsent reconciliation

**Recommendation: simplify to a single no-opt-in notice; remove the consent-gate UX.**

D-0064 §0.9: "Analytics: Server-side PostHog only (the `lead_captured` event already wired in `apps/web/src/app/api/lead/route.ts`). No GA4, no Meta Pixel, no client tags." The privacy page's "anonymous PostHog" claim is currently accurate; the `CookieConsent` component (if it claims to gate anything) is misleading. Stage 3 §1: "CookieConsent is either made accurate for the current no-client-tag reality or removed."

Decision: **remove** the consent-gate UX, keep a footer notice that says:

> We use one anonymous analytics service (server-side PostHog, no cookies, no cross-site tracking). We store attribution on our server when you submit a quote request so we can measure which ad brought you here. We do not use Google Analytics, Meta Pixel, or any client-side tracker. Read the [privacy policy](/privacy).

Rationale:
- No opt-in required when no consent-requiring cookies/tags are set (GDPR/CCPA threshold).
- `localStorage` for attribution is first-party, scoped to this origin, no third-party transfer → no consent gate.
- PostHog is server-side (`route.ts:355-364` fires from `apps/web/src/app/api/lead/route.ts`); `distinct_id` is `lead.id`, not a client cookie.
- D-0066 SMS consent remains separate and mandatory (TCPA); it stays on the lead form, untouched.

Open question for steward (§11): if `CookieConsent` is wired into a banner layout we don't want to disturb visually, the alternative is to keep the banner and rewrite the body copy to match the no-client-tag reality. Functionally identical; pick whichever the marketing team prefers.

---

## 8. Booked-job canonical conversion

**Recommendation: canonical event = first `Job` linked via `Quote.id` to the lead, with `Job.status ∈ {scheduled, en_route, on_site, in_progress, completed}`. Surfaces as `lifecycle_stage='booked'` (derived) and optionally a materialised `booked_job_id` field on Lead for O(1) dashboard reads.**

Stage 3 §1: "Booked job is the canonical conversion; lead is a leading indicator." Per `architecture/twin/job.md` JobStatus is the authoritative state machine for a unit of booked work; per `architecture/twin/quote.md` QuoteStatus drives the `Quote → job conversion` KPI at `analytics/kpi-taxonomy.md:32` (owner sales, target ≥60%). The conversion event is therefore: a Quote transitions to `accepted` (`service.ts:393`) AND a Job is created for that Quote (Job is currently operator-app-managed via Jobber per CLAUDE.md tech stack; crm-core does not own Job creation).

### Derivation (Decision A's pure function)

```
lifecycle_stage(lead) === 'booked'
  ⇔ exists Job j
       WHERE j.quote_id IN (SELECT id FROM quote WHERE lead_id = lead.id)
         AND j.status IN ('scheduled','en_route','on_site','in_progress','completed')
```

This is the same 5-table pattern the naming lens flagged, but it is bounded to two joins (`quote` + `job`) and runs only on dashboard reads + nightly snapshot, never on the lead-capture hot path. Cost: ~5ms per dashboard row at 25 customers (well under the 100-customer threshold at which `architecture/twin/job.md` doctrine recommends materialised projections).

### Optional materialised field on Lead

For O(1) KPI reads at the Stage 6 dashboard (which per the ops lens renders 6 KPI tiles), add `booked_job_id: string | null` to Lead, set the first time a Job is detected for one of the lead's quotes. This is a write-time projection (computed by the Inngest event hook when Job.created fires), not a hot-path computation. Net migration cost: one nullable column, zero backfill required (NULL = "not booked").

### Why not `LeadStatus='booked'`

CF-06 (naming lens audit): `booked` next to `won` in `LeadStatus` is an unresolvable synonym pair — both signal "conversion" to a casual reader. `won` stays Lead-scoped and sales-owned (taxonomy `:31`/`:32`); `booked` is funnel-scoped and Job-derived. The `LeadStatus` union at `service.ts:13-19` stays at 6 values.

### Booked-job KPI hook (Stage 6 inputs)

Per the ops lens, the Stage 6 continue/kill decision reads:

```
Paid search CAC          = marketing_spend on utm_source=google_ads AND utm_medium=cpc
                           / count(Lead where utm_medium='cpc' AND lifecycle_stage='booked')
Lead → quote (per channel)= count(Quote accepted+sent WHERE Lead.utm_source=X)
                           / count(Lead contacted+ WHERE utm_source=X)
Quote → job (per channel)= count(Quote accepted WHERE Lead.utm_source=X)
                           / count(Quote sent WHERE Lead.utm_source=X)
Cost per booked job      = marketing_spend on utm_campaign=X
                           / count(Lead where utm_campaign=X AND converted_customer_id IS NOT NULL)
Cohort retention at 30d  = count(Customer status='active' AND created_at > 30 days ago
                               WHERE source Lead.utm_source=X)
                           / count(Customer WHERE source Lead.utm_source=X
                               AND created_at > 30 days ago)
Channel ROI              = sum(Invoice total_cents WHERE Customer.source Lead.utm_source=X
                               AND Invoice.status='paid')
                           - sum(marketing_spend on utm_source=X)
```

All six queries resolve against the attribution fields from Decision C + the `converted_customer_id` wire-up from Decision B + the Job-derived `booked` stage. No new tables needed beyond `lead_events`.

---

## 9. Taxonomy additions (`analytics/kpi-taxonomy.md` in same PR)

Stage 3 §4 of the plan: "Field names match `analytics/kpi-taxonomy.md`; new fields added to the taxonomy in the same change." The current taxonomy is a KPI formula dictionary with no attribution section and no lifecycle section; both are net-new (verified by full-file read). Three additions land in the same PR.

### Addition 1 — Attribution field vocabulary (new section, after the existing KPI table)

| Field | Type | Source of truth | Owner |
|---|---|---|---|
| `utm_source` | `string \| null` | Inbound URL param; `architecture/twin/marketing.md` MarketingCampaign.utm_source | marketing |
| `utm_medium` | `string \| null` (vocab: `cpc \| social \| referral \| email \| print`) | Inbound URL param; CHANNELS table at `apps/web/src/app/t/[source]/route.ts:15-32` | marketing |
| `utm_campaign` | `string \| null` | Inbound URL param; `architecture/twin/marketing.md` MarketingCampaign.utm_campaign | marketing |
| `utm_term` | `string \| null` | Inbound URL param (Google auto-appends); `output/gtm/03-google-ads-campaign-draft.md §419-425` | seo |
| `utm_content` | `string \| null` | Inbound URL param (Google auto-appends); `output/gtm/03-google-ads-campaign-draft.md §419-425` | marketing |
| `gclid` | `string \| null` | Inbound URL param (Google auto-appends) | marketing |
| `landing_path` | `string \| null` (pathname only) | `X-Landing-Path` request header at `/api/lead` | marketing |
| `referrer` | `string \| null` (hostname only) | `Referer` request header at `/api/lead` | seo |
| `device_class` | `'mobile' \| 'tablet' \| 'desktop' \| null` | Server-parsed `User-Agent` at `/api/lead` | marketing |
| `first_touch_at` | ISO 8601 UTC string \| null | `Date.now()` at `createLead` (`platform/packages/crm-core/src/service.ts:127`); immutable thereafter | marketing |

### Addition 2 — Lead lifecycle stages (new section)

| Stage | Derivation predicate | KPI anchor (verbatim) | Owner |
|---|---|---|---|
| `new` | `Lead.status='new'` | `crm-core/src/service.ts:127` | sales |
| `contacted` | `Lead.status='contacted' OR first_response_at != null` | `analytics/kpi-taxonomy.md:31` `count(Lead contacted+)` | sales |
| `quoted` | `exists Quote WHERE lead_id=L.id AND status IN ('sent','accepted')` | `analytics/kpi-taxonomy.md:31` `count(Quote accepted+sent)` | sales |
| `booked` | `exists Job WHERE quote_id IN (Quote.id for L) AND status IN (scheduled,en_route,on_site,in_progress,completed)` | `analytics/kpi-taxonomy.md:32` `Quote → job conversion ≥60%` | sales |
| `collected` | `exists Invoice WHERE customer_id=L.converted_customer_id AND status='paid'` | `analytics/kpi-taxonomy.md:28` `Gross margin per job ≥55%` | finance |
| `retained` | `Customer.status='active' AND cadence≠'one_off'` for ≥90 days | `analytics/kpi-taxonomy.md:23` `Active recurring customers ≥25 by Month 6` | sales |

Note: derived values only; not stored on Lead. The three override fields (`lifecycle_stage_override`, `_at`, `_by`) live on the Lead contract but are not stage values — they are steward escape hatches.

### Addition 3 — One new KPI row (sibling to existing CAC at `analytics/kpi-taxonomy.md:26`)

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| **Paid search CAC** | `marketing_spend on utm_source=google_ads AND utm_medium=cpc / count(Lead where utm_medium='cpc' AND converted_customer_id IS NOT NULL)` | CRM funnel + ad spend | <$45 | finance |

Naming note: `Paid search CAC` is a **sibling** of the existing CAC row at `:26`, not a redefinition. Both share the same owner per the single-owner rule at `:107`. The existing row's denominator is unchanged (no Decision Template triggered).

### Header metadata changes

- `Last updated:` 2026-07-10 → 2026-07-29 (today's date per `MEMORY.md` + system context).
- Add cross-reference to `architecture/twin/lead.md` and `architecture/twin/marketing.md` in the "Related" footer.

---

## 10. Stage 3 acceptance criteria checklist

Mapping every requirement from `plans/review-the-plans-recently-lucky-catmull.md` Stage 3 to the proposed solution:

| # | Plan requirement | Proposed solution | Verification |
|---|---|---|---|
| 1 | "Full attribution set captured and stored as discrete fields on the lead record (source, medium, campaign, term, content, gclid, landing path, referrer, device class, first-touch timestamp) — not squashed into `source`." | Decision C adds 10 nullable discrete fields. `QuoteCalculator.tsx:172` squash removed. | `apps/web/tests/attribution/discrete-fields.test.ts` |
| 2 | "Attribution survives navigation between landing path, /quote, and /contact, and survives page reload." | §5 localStorage bridge `grass_attribution_v1` (30d TTL, first-touch immutable) + server-side capture. | `apps/web/tests/attribution/persistence.test.ts` (mount /t/google-ads → /quote → refresh → /contact → submit; assert all 10 fields present on Lead row) |
| 3 | "/t/[source] no longer hardcodes `utm_medium=social`; paid channels labelled correctly per `analytics/kpi-taxonomy.md`." | §6 CHANNELS table per-row `utm_medium`; `cpc` for google-ads/bing-ads, `social` for nextdoor/fb, `referral` for craigslist/thumbtack, `print` for door-hanger/yard-sign/business-card/review-card. | `apps/web/tests/attribution/redirect-medium.test.ts` (snapshot each channel) |
| 4 | "Field names match `analytics/kpi-taxonomy.md`; new fields added to the taxonomy in the same change." | §9 three additions (Attribution field vocabulary, Lead lifecycle stages, Paid search CAC row) land in the same PR. | `bun run test:charter` lint pass on the taxonomy; review-app diff includes §9 sections |
| 5 | "Lead lifecycle representable end-to-end: lead → contacted → quoted → booked → paid → retained; steward can set stage manually. Booked job is the canonical conversion; lead is a leading indicator." | Decision A derived `lifecycle_stage` (6 stages with `collected` rename per CF-02); Decision B 3 stored override fields on Lead; §8 Job-derived canonical conversion. | `apps/web/tests/attribution/lifecycle-derivation.test.ts` (synthetic lead → quote → job → invoice progression; assert stage transitions); `apps/web/tests/attribution/steward-override.test.ts` (override write requires `principal.role === 'steward'`) |
| 6 | "Exactly one analytics event source: server-side PostHog. No gtag, no Meta, no client analytics added, so no consent gate required and the privacy page's anonymous-PostHog claim remains accurate." | Decision B step 11 keeps `lead_captured` event; no client tags added; §7 CookieConsent simplification or removal. | Grep `apps/web/src` for `gtag\|fbq\|metaPixel\|analytics(` → 0 hits. Privacy page wording unchanged. |
| 7 | "CookieConsent is either made accurate for the current no-client-tag reality or removed; must not remain cosmetic while claiming to gate something." | §7 recommend removal + footer notice. | Component either deleted or copy reviewed by steward |
| 8 | Test gate: "Stage 3 attribution tests green (synthetic ad-click URL produces a lead record with every field populated correctly, including through a /t/ redirect)." | Decision B test gate file; `output/gtm/03-google-ads-campaign-draft.md §419-425` URL pattern used as test fixture. | `bun test apps/web/tests/attribution` → 100% green |

### Cross-cutting acceptance (from plan §Acceptance Criteria and D-0064 §11)

- D-0064 §11 "Analytics posture is fixed (server-side PostHog only)": Decision B step 11 + §7.
- D-0064 §0.9 "No GA4, no Meta Pixel, no client tags": Decision C excludes `fbclid`/`msclkid`/`yclid`/`ttclid`; §7 removes consent gate UX.
- D-0064 §0.1 "Channel: Google Search ONLY. Meta/Microsoft/Yelp/Nextdoor/Thumbtack/CAPI/retargeting are explicitly OUT of scope": see §11 open question on whether `meta-ads` slug should stay.
- D-0066 §0/§3.5/§9 "TCPA consent + STOP/HELP": untouched by this PR (no schema change to `sms_consent` or `acknowledgement_*`); Decision B step 4 wires `first_response_at` alongside the existing acknowledgement flow.

---

## 11. Risks & open questions

### Risks (in priority order)

**R-1 (HIGH).** Schema drift if `analytics/kpi-taxonomy.md` is not updated in the same commit. Stage 3 §4 is explicit; current taxonomy lacks both an Attribution Field Set section and a Lead Lifecycle Stage Map section. Mitigation: §9 lands three additions in this PR; the `Last updated:` header bumps to 2026-07-29.

**R-2 (HIGH).** `LeadStatus` enum fragmentation. `service.ts:13-19` has 6 values (no `unqualified`); `architecture/twin/lead.md` has 7 (adds `unqualified`, also has typo `gpb_form`). If we expand `LeadStatus` in Stage 3 without reconciling, every KPI formula at `kpi-taxonomy.md:31-32` (`Lead contacted+`, `Quote accepted+sent`) becomes ambiguous. Mitigation: Decision A forbids `LeadStatus` expansion in Stage 3; the `unqualified` requirement is deferred and proposed as ADR-0067.

**R-3 (HIGH).** Unsound TypeScript cast at `route.ts:250-258`. The 6-member `Lead.source` union at `service.ts:21` does not include `'facebook'`, `'google_ads'`, `'bing_ads'`, `'meta_ads'`, `'thumbtack'`, `'door_hanger'`, `'craigslist'`, `'business_card'`, `'review_magnet'` — yet `t/[source]/route.ts:15-32` emits exactly these tokens. Mitigation: Decision B step 10 widens the union as part of Stage 3.

**R-4 (MEDIUM).** `/t/[source]/route.ts:50` blanket `utm_medium='social'` mislabels google-ads/bing-ads/meta-ads as organic social. Mitigation: §6 extends CHANNELS with per-row `utm_medium`.

**R-5 (MEDIUM).** PII leakage in `landing_path` and `referrer`. Even with hostname-only referrer and pathname-only landing_path, deep links can encode UTM tokens that double-store data. Mitigation: on write, strip query string for both fields; server-side header parsing only.

**R-6 (MEDIUM).** `first_touch_at` mutability. If overwritten on every retry, original first-touch timestamp is lost. Mitigation: `first_touch_at` is set ONLY inside `createLead` (`service.ts:127`), never on the route's idempotent short-circuit path (`route.ts:120-131` returns the existing lead before `createLead` runs).

**R-7 (MEDIUM).** Backward-compat for existing leads. Rows created before Stage 3 have NULL attribution fields and `lead_events` gaps. Dashboards reading `count(Lead where utm_source='google')` must filter `WHERE utm_source IS NOT NULL`. Mitigation: one-time backfill parses legacy `source='nextdoor:free_first_mow'` strings into discrete `utm_source`/`utm_campaign` where possible; document NULL semantics in the taxonomy's Attribution Field Vocabulary section.

**R-8 (LOW).** `lead_events` write amplification. Every status transition writes two rows (Lead.status + lead_events). Mitigation: fire-and-forget pattern (PostHog-style at `route.ts:355-364`), not transactional with the Lead write.

**R-9 (LOW).** CookieConsent accuracy. D-0064 §0.9 mandates server-side PostHog only. Mitigation: §7 removes or rewrites the component; privacy page wording unchanged.

**R-10 (LOW).** Steward manual override misuse. `lifecycle_stage_override` could set any LifecycleStage without going through the action guards at `service.ts:177, :196`. Mitigation: override write path requires `principal.role === 'steward'`; KPI formulas continue to ignore `lifecycle_stage_override` (use derived `lifecycle_stage` only); every override writes a `lead_events` row of `event_type='manual_override'` with `reason`.

**R-11 (MEDIUM).** UTM vocabulary mismatch between `output/gtm/03-google-ads-campaign-draft.md §419-425` and `analytics/kpi-taxonomy.md`. Mitigation: lift the UTM enum from the deferred draft into the taxonomy's new Attribution Field Vocabulary section (§9 Addition 1) so it has a single canonical home; add a redirect note in `output/gtm/03-google-ads-campaign-draft.md` README.

### Open questions for the steward (must resolve before code lands)

**Q-1.** **`collected` vs `paid` for the fifth lifecycle stage (CF-02).** Plan prose says `paid`; this synthesis says `collected` to avoid collision with the same PR's paid-traffic vocabulary (`utm_medium='cpc'`, source `paid_search`). Confidence is high but this is a token override of plan text. Confirm: `collected` (recommended) or `paid`?

**Q-2.** **Keep `meta-ads` slug in `/t/[source]` CHANNELS?** D-0064 §0.1 puts Meta explicitly out of scope with a hard-stop on reintroduction. A live redirect slug for an out-of-scope channel is a governance smell. Options: (a) keep + label `cpc` (consistent with §6), (b) keep + label `cpc` but add a governance lint that flags out-of-scope slugs, (c) delete the slug and 302 to a "channel paused" page. Recommend (c) — cleaner governance.

**Q-3.** **`LeadStatus='unqualified'` expansion (ADR-0067 candidate).** Both schema and ops lenses assume this expansion; Decision A defers it because it's a Decision Template event. Should the Stage 3 PR include ADR-0067 to ratify it, or punt to Stage 4?

**Q-4.** **Backfill strategy for legacy `source='nextdoor:free_first_mow'` rows.** Recommend a one-shot migration that parses the colon-separated squash and writes `utm_source`/`utm_campaign` where parseable. Confirm: ship the backfill in Stage 3 PR or as a separate small PR?

**Q-5.** **CookieConsent: remove or rewrite?** §7 recommends removal + footer notice. If the marketing team has visual reasons to keep the banner, the alternative is rewriting the body copy to match the no-client-tag reality. Functionally identical; pick the path with the least collateral.

**Q-6.** **`first_response_at` write path.** Two options: (a) set inside `updateLeadAcknowledgement` at `service.ts:144-169` on first `'sent'` status (one source of truth, but couples ack flow to lifecycle); (b) set in the route handler at `route.ts:303-311` branch only (route owns the wire-up, crm-core stays lifecycle-agnostic). Recommend (b) — `updateLeadAcknowledgement` should not gain a lifecycle side-effect it doesn't already have.

**Q-7.** **Add `converted_quote_id` field on Lead?** `architecture/twin/lead.md` has a `quote_id` field; crm-core does not. Per CF-04 the twin should converge to `converted_quote_id` (paired with `converted_customer_id`) for symmetry and to support §8's booked-job derivation. Recommend: add as nullable field in this PR; backfill `NULL` is acceptable for pre-Stage-3 leads.

**Q-8.** **Fix `Customer.churned_date` → `churned_at`?** `architecture/twin/customer.md:61` violates the naming convention `_at` suffix for timestamps (taxonomy convention rule #2). Recommend: opportunistic rename in a separate PR — don't mix into Stage 3 to keep the PR scope tight.

---

## Summary for the steward

Three decisions, twelve changes in one PR, six open questions to resolve. The attribution namespace is provably empty (verified by full read of `analytics/kpi-taxonomy.md` 122 lines + repo-wide ripgrep for the ten field names — CF-10), so all field names from `docs/specs/paid-pilot-landing-spec.md §5` are collision-free. The lifecycle namespace is NOT empty (`status`, `contacted`, `sent`, `accepted`, `one_off` are live in KPI formulas at `:23, :31-32`); the cleanest path is to derive `lifecycle_stage` and add three stored override fields without touching `LeadStatus`. The two value-level token overrides vs plan prose (`new` for `lead`, `collected` for `paid`) are the only contested calls; both have direct evidence in live code. The Stage 3 test gate (synthetic ad-click URL → lead record → every field populated → through `/t/` redirect) is the single integration test that proves the whole composition.
