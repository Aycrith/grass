# GRASS — KPI Taxonomy

> **Charter principle:** *"Every capability must be documented, tested, versioned, measurable, discoverable."*
> A KPI is not a number — it is a measurement contract: **formula + instrument + target + owner**.

---

## How to read this document

Each KPI entry has exactly four required fields:

| Field | Why it matters |
|---|---|
| **formula** | Removes ambiguity. Two people computing the same metric get the same number. |
| **instrument** | The specific tool + query. Without it, "LTV" can be 12-month cohort or all-time. |
| **target** | A number with a date. "Be better" is not a KPI; "$400 by Month 6" is. |
| **owner_agent** | The agent whose acceptance criteria this KPI gates. |

If any field is missing, the KPI is **draft** and may not be promoted to a chart on the monthly scorecard.

---

## North Star (the single number that moves the org)

| KPI | Formula | Instrument | Target (Month 6) | Target (Month 12) | Owner |
|---|---|---|---|---|---|
| **Mission 1 Gross Margin $ run rate** | Σ(gross_margin_per_job × jobs/month) last 4 weeks | Stripe + Jobber reconciliation | $2,750/mo | $8,500/mo | executive |

---

## Mission 1 — Operational (weekly cadence)

| KPI | Formula | Instrument | Target (Month 6) | Owner |
|---|---|---|---|---|
| **Active recurring customers** | `count(customers where status=active and cadence>=monthly)` | Jobber / CRM | 25 | operations |
| **Weekly job completion rate** | `completed_jobs / scheduled_jobs` (7-day window) | Schedule app | ≥95% | operations |
| **On-time arrival (±30 min)** | `jobs_arrived_within_window / total_jobs` | Crew check-in logs | ≥90% | operations |
| **CAC** | `paid_acquisition_spend_last_30d / new_customers_last_30d` | Stripe + Jobber + Ad platforms | <$45 | finance |
| **LTV (12-month)** | `Σ revenue per cohort customer over 12 months from acquisition` | Stripe + CRM cohort report | >$400 | finance |
| **Gross margin per job** | `(invoice_total − COGS) / invoice_total` | Invoice − supplier ledger | ≥55% | finance |
| **Crew utilization** | `billable_hours / total_hours_on_clock` | Time clock | ≥75% | operations |
| **NPS / 5-star review rate** | `(5_star_reviews / total_reviews)` | GBP + Jobber | ≥60% 5-star, ≥30 responses | marketing |
| **Lead → quote conversion** | `quotes_sent / leads_received` | CRM funnel | ≥35% | sales |
| **Quote → job conversion** | `jobs_won / quotes_sent` | CRM funnel | ≥60% | sales |
| **Repeat-customer rate** | `returning_customers / total_customers` (rolling 12 mo) | CRM | ≥60% | operations |

---

## Mission 1 — Growth (monthly cadence)

| KPI | Formula | Instrument | Target (Month 6) | Owner |
|---|---|---|---|---|
| **Organic search impressions** | `Σ impressions` from GSC | Google Search Console | 5,000/mo | seo |
| **GBP calls/month** | `count(phone_calls_tracked)` | GBP Insights | 40 | marketing |
| **Citation count (clean NAP)** | `count(citations where name/address/phone matches)` | BrightLocal | ≥35 | seo |
| **Backlinks from local sources** | `count(referring_domains where geo=local)` | Ahrefs | ≥10 | seo |
| **Money-keyword rankings (top 10)** | `count(keywords where position<=10)` | Ahrefs rank tracker | ≥10 keywords | seo |
| **Indexed pages vs published** | `indexed_pages / published_pages` | `site:` operator + sitemap | ≥95% | seo |

---

## OS / Reusability (the charter-proof chart)

> This chart is **the proof** that GRASS is an organization that compounds, not a lawn company. If a Month-6 trade-off exists between landscaping revenue and these metrics, **OS reusability wins.**

| KPI | Formula | Instrument | Target (Month 6) | Owner |
|---|---|---|---|---|
| **Capabilities registered + active** | `count(capabilities where status=active)` | `state/capability-registry.yaml` | ≥30 | qa |
| **Capability reusability** | `count(caps used in ≥1 mission) / count(caps total)` | Cross-ref capability vs mission ledger | ≥60% | architecture |
| **Agent specs in `active` status** | `count(agents where status=active)` | `agents/` directory | ≥8 of 13 | executive |
| **Decision log entries with postmortem** | `count(decisions where postmortem_link!=null) / count(decisions)` | `knowledge/decision-log/` + `knowledge/postmortems/` | ≥15 postmortems | knowledge |
| **State ledger always-current** | `now - ledger.last_updated < 7d ? 1 : 0` | `scripts/check-ledger-freshness.ts` | 100% | executive |
| **Charter violations open** | `count(charter_compliance failures)` | `scripts/charter-compliance.ts` | 0 unaddressed | qa |
| **Hours of solo-founder time / customer / week** | `steward_hours / active_customers` (7-day window) | Manual log | <30 min | executive |
| **Postmortems per month** | `count(postmortems where created_at > now - 30d)` | `ls knowledge/postmortems/` | ≥1 | knowledge |
| **Lessons-learned → charter amendments** | `count(amendments where origin=lessons_learned)` | `constitution/charter-amendments/` | ≥1 per quarter | knowledge |

---

## Engineering Health (weekly cadence)

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| **CI green rate** | `count(green_runs) / count(total_runs)` (7-day window) | GitHub Actions | ≥95% | qa |
| **MTTR (incident)** | `mean(incident_resolved_at − incident_opened_at)` | Sentry | <4h | qa |
| **Test coverage on platform code** | `lines_covered / lines_total` | bun test --coverage | ≥70% | qa |
| **Capabilities without tests** | `count(caps where tests=[])` | Capability registry cross-check | 0 | qa |
| **Open charter-violation todos** | `count(charter_compliance.failures > 7d)` | `scripts/charter-compliance.ts` | 0 | qa |
| **CI pipeline duration** | `mean(workflow_run_duration_seconds)` | GitHub Actions | ≤10 min | infrastructure |
| **Production uptime** | `uptime_seconds / total_seconds` (7-day window) | Vercel + Supabase | ≥99.5% | infrastructure |
| **Deploy frequency** | `count(deploys)` (7-day window) | Vercel deployment logs | ≥5/week | infrastructure |
| **Infra spend vs ceiling** | `Σ(saas_bills) vs $200/mo ceiling` | Vercel + Supabase + Twilio + Resend + Mapbox + Sentry + Axiom + PostHog | ≤$200/mo | infrastructure |

---

## Security Health (weekly cadence)

| KPI | Formula | Instrument | Target | Owner |
|---|---|---|---|---|
| **Secrets in git history** | `count(gitleaks_findings)` | gitleaks scan | 0 | security |
| **Open critical CVEs in deps** | `count(osv_findings where severity=critical)` | OSV scanner | 0 | security |
| **RLS policy coverage** | `count(tables with RLS) / count(tables total)` | Supabase policy audit | 100% | security |
| **MTTR security incident** | `mean(security_incident_resolved − opened)` | Incident log | <2h | security |
| **Secret-rotation cadence** | `now - last_secret_rotation` | 1Password audit log | ≤90 days per secret | security |

---

## Conventions

1. **Percentages** are stored as decimals (`0.95`) but displayed as `95%` on charts.
2. **Windowed metrics** (CAC, LTV) use rolling 30-day windows; never point-in-time.
3. **Targets** include a date by which they apply; rolling forward as we ship.
4. **Targets without a date** are aspirational and may not appear on the monthly scorecard.
5. **Each KPI has exactly one owner_agent.** If two agents need it, they share via a documented handoff.
6. **A KPI without an instrument is not real.** No fake dashboards. If we can't measure it, we don't claim it.

---

## Adding a new KPI

1. Author a draft in `analytics/kpi-taxonomy.md` with all four required fields filled.
2. Add a row to the relevant section's table.
3. Update the owning agent's `KPIs` section to include the new metric.
4. Link the instrument in `.env.example` or `scripts/` as appropriate.
5. Promote from draft to chart after 2 weeks of data showing the instrument works.

---

## Quarterly review

Every quarter, the executive agent leads a review that asks:

- Which KPIs are we measuring but no one is acting on? (delete)
- Which decisions are we making without a KPI? (add)
- Which KPIs have stale targets? (refresh)
- Which KPIs have moved the org? (keep + celebrate)