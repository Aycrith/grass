# RESUMING.md — How to resume GRASS / Largo Lawn after the 2026-07-31 pivot

> **Status:** BINDING — owner (Cameron) paused GRASS at pre-launch to direct focus to a new business/strategy. This file is the **contract for resuming** the work. Anyone (steward, future agent, returning Cameron) who picks up the repo after the pivot date should follow this document.
>
> **Date:** 2026-07-31
> **Pilot status:** PAUSED at pre-launch — no ad spend ever incurred, no customer commitments, no domain purchased.
> **Hard-stop compliance:** CLEAN — all §0.9 hard-stop violations removed.
> **Authoritative references:** D-0067 (pilot-pause-and-preservation), D-0068 (landscape-capability-archive), D-0064 (still binding), `output/plans/2026-07-31_strategy-rollout-adjustment.md` (the 6-gate execution sequence).

---

## 0. The 10-minute resume

If you are reading this cold, here is the 10-minute overview:

1. The repo is **buttoned up**. `git status` may show uncommitted working-tree noise (the 42 landing-page polish WPs from prior work), but the deprecation state is clean — no §0.9 hard-stop violations, no dangling references to deleted modules.
2. The D-0064 paid-acquisition pilot **never launched**. No Google Ads account, no Meta Pixel, no Twilio 10DLC, no GBP, no Sunbiz LLC, no insurance, no customers. Reversible at zero cost.
3. **Read these three ADRs in order:** D-0068 → D-0067 → D-0064. They are the binding posture.
4. **Resume work** by authoring a D-0069 Pilot Outcome ADR (the gate to first ad spend per D-0064 §6) and walking the 6 gates in `output/plans/2026-07-31_strategy-rollout-adjustment.md` §8.

That's it. Continue reading for the full procedure.

---

## 1. Quick verification — is the repo still preserved?

Run these three commands. If they all pass, the preservation is intact.

```bash
# 1. Hard-stop violations are gone
grep -rE "fbq|gtag|__analyticsConsent" apps/web/src/ 2>&1 || echo "CLEAN"

# 2. Charter compliance is green
bun run test:charter

# 3. Typecheck is clean
cd apps/web && bun run typecheck && cd ../..

# 4. Unit tests in apps/web/tests/ are green
bun test apps/web/tests/

# 5. The pivot commit + tag exist
git log --oneline -1
git tag --list 'pre-pivot-2026-07-31'
```

Expected:
- grep returns `CLEAN` (no matches).
- `bun run test:charter` shows 3/3 GREEN.
- `tsc --noEmit` returns 0 errors.
- `bun test apps/web/tests/` shows 107/107 pass, 0 fail.
- The latest commit is the D-0067 cleanup commit; the tag `pre-pivot-2026-07-31` exists.

If any of these fail, see §7 ("If something is broken").

---

## 2. Where the bindings live

Every binding decision is a file in `governance/decisions/`. The active set at the pivot:

| ADR | Status | What it binds |
|---|---|---|
| D-0064 | RATIFIED (binding) | Paid-acquisition pilot scope: Google Search only, pet waste only, free credits only. §0.9 hard-stop: no GA4, no Meta Pixel, no client-side analytics tags. §0.6 circuit-breaker: pause at CAC > $138. |
| D-0065 | RATIFIED (binding) | Pet-waste service ratification for the pilot's duration. §0.7: capability reverts to reserved if pilot aborts (this is what D-0068 records). |
| D-0066 | RATIFIED (binding) | TCPA-compliant SMS consent language on every form. |
| D-0062 | RATIFIED (deferring) | 4 stale-source artifacts deferred to Q3 2026 (no per-item work needed). |
| D-0063 | RATIFIED (binding) | Claude/Anthropic AI provider claim + 6-hour manual-window policy. |
| D-0067 | RATIFIED (new) | Pilot pause + GRASS preservation posture (this pivot). |
| D-0068 | RATIFIED (new) | Landscape capability archive (all 6 capabilities moved to status=reserved). |

All prior ADRs (D-0001 through D-0060) remain validated. None are changed.

---

## 3. The state file diff

State files were annotated on the pivot commit. The diff is documentation-only — no live data changed.

- `state/ledger.yaml` — phase_exit_status flipped to "PAUSED AT PRE-LAUNCH (D-0067)"; D-0064/0065/0066 added to ratified list (these existed as files but were never registered); D-0067 + D-0068 added; changelog entry 2026-07-31; next_actions rewritten to "PIVOT COMPLETE".
- `state/risk-register.yaml` — last_updated 2026-07-31; R-PILOT-001..006 + R-CAP-001..004 + R-SMS-001..004 all annotated with `[STATUS: PAUSED 2026-07-31 per D-0067]`; R-PIVOT-001 added.
- `state/capability-registry.yaml` — last_updated 2026-07-31; all 6 active capabilities → status=reserved; reusability counter updated; POST-PIVOT ARCHIVE section appended.

To re-verify state integrity at any time:

```bash
bun run test:charter  # lint-agents + lint-capabilities + ledger-freshness
```

---

## 4. The 6-gate execution sequence (per D-0064 + 2026-07-31 strategy plan)

These gates are the binding procedure. The pilot never launched, so **Gate 1 has been partially executed** (the hard-stop violations are removed). The remaining gates resume where Gate 1 left off.

### Gate 1 — Foundation Cleanup (most of it done)

| Task | Status |
|---|---|
| T1.1: Discard uncommitted GA4/Meta/CAPI/ConsentBanner code | ✅ DONE |
| T1.2: Revert uncommitted `/pet-waste/page.tsx` to spec | TODO (the WIP version on disk is off-spec) |
| T1.3: Revert uncommitted `/api/lead/route.ts` to Stage 2/3 HEAD | ✅ DONE (Stage 2/3 hardening preserved) |
| T1.4: Resolve D-0062 drift items (tax, wage, etc.) | Deferred to Q3 2026 per D-0062 |
| T1.5: Strip unsubstantiated claims | TODO |
| T1.6: Resolve 5-min vs 18-hour SLA conflict | TODO |
| T1.7: Add pet-waste to content registry | TODO |
| T1.8: Update GBP / Yelp / citations | TODO |
| T1.9: Commit state files | ✅ DONE |
| T1.10: Author D-0062 closure ADR | Deferred to Q3 2026 per D-0062 |

### Gate 2 — Pilot Surface (NOT done)

- Buy `largolawn.pro` on Vercel Registrar (~$9.15/yr).
- Configure DNS + Vercel production deployment.
- Author `/pet-waste` against binding spec (5 sections + 1 closer).
- Author single Google Search campaign CSV (`pw-search-largo-fl`).
- Author `docs/specs/paid-pilot-landing-spec.md` (Stage 1 spec).
- Author `docs/runbooks/pilot-operations.md` (the missing artifact).
- Run `bun run smoke-test-prod.mjs https://largolawn.pro` — 8/8 GREEN.

### Gate 3 — Pilot Launch (NOT done)

- Upload `output/gtm/06-google-ads-bulk-import.csv` to Google Ads.
- Apply $500 free credit (or whatever is available).
- Set budget $5/day, schedule Mon–Fri 7a–9p + Sat–Sun 8a–8p, all 6 ZIPs.
- Pause campaign. Wait for steward confirmation.
- Steward unpauses on Monday morning 7 AM.

### Gate 4 — Pilot Outcome ADR (NOT done)

- Author `governance/decisions/0069-pilot-outcome.md` (the D-0064 §6 amendment).
- Document CAC, conversion, retention, LTV/CAC.
- Document next-state decision: expand to hurricane prep (State 2) OR continue OR abort.

### Gate 5 — Service Lineup Expansion (NOT done)

- Hurricane prep landing page + capability registration.
- Palm trim licensing OR subcontractor decision.
- Multi-service catalog pilot.

### Gate 6 — Full Rollout (NOT done)

- Microsoft Search (D-0064 amendment).
- Meta retargeting (D-0064 amendment).
- Nextdoor Local Deals.
- Thumbtack paid.
- Yelp paid (after review velocity threshold).
- Full service catalog expansion.

---

## 5. The 10 open questions for the resumed steward

These are the same 10 questions from the 2026-07-31 strategy plan. The defaults are preserved; the resumed steward can change any of them.

1. Buy the domain now, or wait for Gate 1 to ship? **Default:** Buy now (~$9.15/yr).
2. Discard the uncommitted working tree, or commit selectively? **Default:** Commit selectively (the 42 landing-page polish WPs are reviewed in the steward review).
3. Drop "since 2020" entirely, or replace with verified year? **Default:** Drop entirely.
4. Pick Vercel Registrar ($9.15) or Namecheap ($4.99)? **Default:** Vercel Registrar.
5. Architecture doc before /pet-waste rebuild, or after? **Default:** Before.
6. Gmail SMTP vs Resend? **Default:** Gmail SMTP (already built).
7. "Free first cleanup" or "$7.50 first cleanup"? **Default:** Free first cleanup.
8. Keep the "first 5 neighbors" scarcity frame? **Default:** Keep.
9. Pilot window: 30 days at $5/day, or 60 days at $3/day? **Default:** 30 days at $5/day.
10. Should the family-investor send (PENDING) wait for pilot outcome? **Default:** Wait.

---

## 6. The single commit + tag

The pivot is one commit + one tag. To resume from the pivot:

```bash
# Option A: stay on the current branch, just commit any new work
git checkout main  # or feat/stage-3-trustworthy-attribution
# author D-0069, walk the gates, commit as usual

# Option B: pin to the pivot commit and branch from it
git checkout pre-pivot-2026-07-31
git checkout -b resume-grass-2026-XX-XX   # today's date
# author D-0069, walk the gates, commit as usual
```

The tag `pre-pivot-2026-07-31` is the audit anchor. It cannot be deleted (tags are immutable once pushed). If the steward wants to verify the pivot state, `git show pre-pivot-2026-07-31` shows the exact commit.

---

## 7. If something is broken

Common scenarios:

### "grep finds fbq/gtag in apps/web/src/"

The cleanup is incomplete. Re-run the deletions:

```bash
rm -rf apps/web/src/components/analytics/
rm apps/web/src/lib/server-track.ts apps/web/src/lib/track.ts apps/web/src/lib/event-id.ts
# Then re-verify the cleanup:
grep -rE "fbq|gtag|__analyticsConsent" apps/web/src/ 2>&1 || echo "CLEAN"
```

If the references persist in `apps/web/src/app/contact/ContactForm.tsx`, `apps/web/src/components/site/SiteHeader.tsx`, `apps/web/src/app/layout.tsx`, `apps/web/src/app/api/lead/route.ts`, or `apps/web/src/types/window.d.ts`, the import lines and tracking calls are still there. See the D-0067 ADR §3 for the exact edit list.

### "bun run typecheck fails"

The most common cause is a leftover import. Run `git diff --stat HEAD` and look for any file that imports from `@/lib/track`, `@/lib/server-track`, `@/lib/event-id`, or `@/components/analytics`. The deleted modules are the only ones that should be missing.

### "bun run test:charter fails"

The capability registry parser may reject the new status. The valid statuses are {draft, active, deprecated, reserved} per `scripts/lint-capabilities.ts:127`. If you see "not in {draft, active, deprecated, reserved}", you've used a non-standard status.

### "The tag doesn't exist"

The pivot commit was never tagged. Run:

```bash
# Find the pivot commit
git log --oneline | grep -i "pilot-pause\|preservation" | head -1
# Tag it
git tag -a pre-pivot-2026-07-31 <sha> -m "Pre-pivot GRASS preservation snapshot (D-0067)"
```

### "The pre-pivot tag is missing from the remote"

The pivot commit was never pushed. The tag exists locally. To push:

```bash
git push origin pre-pivot-2026-07-31    # only the tag, not the commits
```

(Do not push the pivot commit itself unless the steward is ready — the steward-controlled policy applies per CLAUDE.md.)

---

## 8. What is NOT covered by this preservation

These are the things the pivot commit did NOT touch:

- **The 42 uncommitted landing-page polish WPs** in the working tree. They are working-tree noise from prior work (per the prior session memory). The steward can review them at leisure via `git diff --stat` and `git status --porcelain`.
- **The 7 baseline regeneration mismatches** in `apps/web/visual/`. These are pre-existing visual regression test failures from prior landing-page work. Not from the pivot commit.
- **542 biome lint errors** elsewhere in the codebase. Pre-existing. Not from the pivot commit.
- **The 22 Playwright visual test failures** in `apps/web/visual/*.spec.ts` that bun test picks up. Pre-existing infrastructure issue (bun test should exclude `*.spec.ts` Playwright files). Not from the pivot commit.
- **The `.playwright-mcp/`, `GRASS_backup_tmp/`, `output/`, `scripts/__pycache__/` directories** in the working tree. Untracked working-tree noise. Not from the pivot commit.
- **The 1 untracked `deploy-vercel.mjs` file** with an ESLint require-style import error. Pre-existing. Not from the pivot commit.
- **The D-0062 drift items** (tax 6.75% → 7.0%; FL wage $13 → $14/$15; domain $4.99 → $9.15; loan ask $12K → $15K). These remain DEFERRED to Q3 2026 per the original D-0062 ADR. The pivot did not resolve them.

---

## 9. The new/changed files at the pivot

For archaeology:

- **Created:**
  - `governance/decisions/0067-pilot-pause-and-preservation.md`
  - `governance/decisions/0068-landscape-capability-archive.md`
  - `output/plans/RESUMING.md` (this file)
- **Modified:**
  - `apps/web/src/app/layout.tsx` — AnalyticsProvider + ConsentBanner removed.
  - `apps/web/src/app/api/lead/route.ts` — GA4/CAPI fire-path removed; server-side PostHog preserved.
  - `apps/web/src/app/contact/ContactForm.tsx` — trackFormStart + trackGenerateLead + eventId state removed.
  - `apps/web/src/components/site/SiteHeader.tsx` — trackContactClick removed.
  - `apps/web/src/types/window.d.ts` — gtag/fbq/dataLayer/__analyticsConsent globals removed.
  - `state/ledger.yaml` — phase annotate, D-0064/0065/0066/0067/0068 added, changelog entry.
  - `state/risk-register.yaml` — R-PIVOT-001 added, paused annotations on R-PILOT/R-CAP/R-SMS.
  - `state/capability-registry.yaml` — all 6 capabilities → status=reserved, reusability updated.
- **Deleted:**
  - `apps/web/src/components/analytics/` (5 files)
  - `apps/web/src/lib/server-track.ts`
  - `apps/web/src/lib/track.ts`
  - `apps/web/src/lib/event-id.ts`

---

## 10. The one-line bottom line

**The repo is in a buttoned-up preserved state. The pilot never launched. No irreversible ops occurred. To resume, read D-0068 → D-0067 → D-0064, then walk the 6 gates in `output/plans/2026-07-31_strategy-rollout-adjustment.md` §8 starting from T1.2.** The tag `pre-pivot-2026-07-31` is the audit anchor; the pivot commit is the preservation baseline; this document is the resume contract.
