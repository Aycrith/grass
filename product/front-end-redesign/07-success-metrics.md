# PRD-07 — Success Metrics

**Purpose:** Define quantitative KPIs and qualitative goals for the
front-end redesign. Used by Phase E (QA) to validate launch and by
Phase F (monitoring) to track post-launch health.

**Audience:** All (engineering, marketing, operations, QA)

---

## 1. Quantitative KPIs

### Performance (Lighthouse CI)

| Metric | Target | Source |
|---|---|---|
| Performance | ≥90 (mobile 4G) / ≥95 (desktop) | Lighthouse CI |
| Accessibility | ≥95 | Lighthouse CI |
| SEO | ≥95 | Lighthouse CI |
| Best Practices | ≥90 | Lighthouse CI |

### Core Web Vitals (Real User Monitoring)

| Metric | Target p75 | Measurement |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | PostHog Web Vitals |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | PostHog Web Vitals |
| INP (Interaction to Next Paint) | ≤ 200ms | PostHog Web Vitals |
| TTFB (Time to First Byte) | ≤ 800ms | Server logs |

### Conversion

| Funnel step | Target | Source |
|---|---|---|
| Homepage → /quote entry | ≥ 8% of unique visitors | PostHog funnel |
| /quote → form start (any field touched) | ≥ 60% | PostHog funnel |
| /quote → form submit | ≥ 40% | PostHog funnel |
| Form submit → lead persisted | 100% | Server log + E2E test |
| Lead → first response (text/email) | ≤ 24 hours, 95% of leads | `sendLeadResponse` log |
| First response → quote accepted | ≥ 50% | CRM |
| Quote accepted → first job scheduled | ≥ 80% | CRM |
| First job → customer retained (≥ 4 weeks) | ≥ 50% | CRM |

### Engagement

| Metric | Target | Source |
|---|---|---|
| Bounce rate (homepage) | ≤ 55% | PostHog |
| Time on /quote | ≥ 45s median | PostHog |
| Time on /services/[slug] | ≥ 60s median | PostHog |
| Returning visitors (30-day) | ≥ 25% | PostHog |
| Mobile share of traffic | ≥ 60% | PostHog device mix |

### Accessibility (axe-core CI)

| Check | Target |
|---|---|
| Color contrast violations | 0 |
| Missing alt text | 0 |
| Missing form labels | 0 |
| Keyboard traps | 0 |
| ARIA misuse | 0 |
| Heading hierarchy violations | 0 |

### Build / Engineering

| Metric | Target |
|---|---|
| `bun run build` exit code | 0 |
| `bun run typecheck` exit code | 0 |
| `bun run lint` exit code | 0 |
| Total JS bundle size (homepage) | ≤ 150 KB gzipped |
| Total CSS bundle size | ≤ 50 KB gzipped |
| Total image weight (homepage) | ≤ 500 KB |
| Lighthouse "Avoid non-composited animations" | pass |
| Routes prerendered (SSG) | ≥ 90% of routes |

## 2. Qualitative goals

### Steward sign-off

The steward should be able to look at the homepage and say:

> "This looks like a real local business, not a template."

If they can't, the redesign is not done regardless of quantitative
metrics.

### Customer signals

After launch, watch for:

- Inbound texts/emails that say "saw your website, looks great"
- Customers who ask to come by and see the truck before scheduling
- Customer reviews that mention the website (rare but gold)
- Zero complaints about "looks like every other lawn service"

### Internal review

Before launch, the steward does a self-review:

- [ ] Can I tell which brand this is from a thumbnail screenshot?
- [ ] Does the operator's personality come through?
- [ ] Is the photo of me / my truck / my yard on the page?
- [ ] If a friend asked me to send them my business website, would
      I be proud to send this link?
- [ ] Does the homepage say anything that the local competitor's
      page doesn't?

If any answer is "no," the redesign is not done.

## 3. Instrumentation

### PostHog events

All of these should fire from the live site:

```
$pageview          — every page view
quote_started      — first input change on /quote
quote_calculated   — every estimate update
quote_submitted    — form submit (with source UTM)
lead_acknowledged  — auto-ack fired by /api/lead
contact_clicked    — tel: link clicked
quote_cta_clicked  — button on homepage/header clicked
service_card_clicked — service card hover for >500ms
area_card_clicked   — area card hover for >500ms
```

### Server logs

- `/api/lead` — log every lead submission with source + UTM
- `/t/[slug]` redirector — log every redirect with UTM
- `/api/lead` errors — alert if error rate > 1%

### Dashboards

PostHog dashboards to set up:

- **Funnel: Homepage → Quote → Submit** — conversion-by-source
- **Web Vitals over time** — p75 LCP, CLS, INP by day
- **Page performance** — Lighthouse scores per route
- **Lead source breakdown** — bar chart of `source` field

## 4. Reporting cadence

| Frequency | What to report |
|---|---|
| Daily (first 7 days) | Conversion rate, Lighthouse, errors |
| Weekly (first month) | Funnel, Vitals, qualitative signals |
| Monthly (after) | Trends, A/B opportunities, content gaps |
| Quarterly | ROI assessment, redesign-priority review |

## 5. Failure modes (what to do if metrics miss)

| Symptom | Likely cause | Action |
|---|---|---|
| LCP > 2.5s | Hero image too large or slow network | Compress more, add preload, lazy-load below-fold |
| Bounce rate > 70% | Hero doesn't communicate value | Iterate on hero copy + image |
| Quote conversion < 20% | Form too long or trust signals missing | Simplify form, add testimonials |
| Accessibility violations | Missing alt text or contrast | Iterate immediately, do not ship |
| Mobile bounce rate higher than desktop | Layout issue on small screens | QA + iterate |

## 6. Anti-metrics (don't measure these)

- "Time on page" for static pages (lighthouse, /privacy) — meaningless
- Bounce rate for /t/[slug] redirector — always bounces by design
- Scroll depth on pricing page (people scroll, doesn't mean anything)
- New vs. returning visitors split (interesting, not actionable)

## 7. What this PRD does NOT cover

- A/B testing framework (post-launch, separate PRD)
- Heatmaps and session replay (post-launch, separate PRD)
- SEO ranking (separate SEO PRD)
- Customer LTV / retention (covered in `research/market/profitability-roadmap.md`)