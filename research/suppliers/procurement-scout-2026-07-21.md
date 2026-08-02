# GRASS Mission 1 Equipment Procurement Scout (2026-07-21)

> Cross-project data pull. **Source data lives outside GRASS**, in the
> GarbageGoober repo (which is the project that actually has the multi-
> platform scraper stack). This file is a pointer + context for GRASS
> agents; the actual listings + comps + scored CSV are in
> `C:/Users/camer/DEVNEW/GarbageGoober/output/procurement/`.

## Why this lives outside GRASS

GRASS's charter (CLAUDE.md "Hard rules" + research/suppliers/largo.yaml
header) says the platform's tools come from GarbageGoober's scraper stack
for any data-collection work. GarbageGoober's `scrapers_v3.py` provides
the multi-platform scrapers (FB Marketplace, Craigslist, OfferUp, Mercari)
and the dedup / path-guard / cookie management. GRASS does not duplicate
this stack -- it consumes GarbageGoober's outputs.

The two new driver scripts added to GarbageGoober for this scout:
- `procurement_scan.py` -- procurement-tuned variant of `daily_scan.py`
- `procurement_aggregate.py` -- merges listings + eBay comps, scores deals

## What was pulled

- **10 equipment items** from `research/suppliers/largo.yaml` starter kit
  (Exmark Lazer Z 60", Honda HRX217, Stihl FS 91, Echo SRM-225, Stihl HS 56,
  Stihl BR 600, Stihl FC 91, landscape trailer, Stihl MS 250, 5-7 kW generator)
- **279 kept listings** across all 10 items (after procurement filter)
- **eBay fair-price comps** for each item (n=2-11 per item, US used market)

## Key finding: `research/suppliers/largo.yaml` used-price targets are
## OPTIMISTIC for 5 of 10 items

| Item | YAML target | eBay comps median | Gap |
|------|-------------|-------------------|-----|
| Stihl FS 91 trimmer | $180-250 | $350 | YAML 40% low |
| Stihl HS 56 hedge trimmer | $150-220 | $287 | YAML 30% low |
| Stihl FC 91 edger | $150-200 | ~$380 (n=1) | YAML 50% low |
| Open landscape trailer | $1,500-2,500 | $5,299 | YAML 60% low |
| Stihl MS 250 chainsaw | $150-220 | $275 | YAML 10% low |

**Implication:** the `~$6,650-9,650 used` equipment budget in the yaml is
likely 20-30% under actual market for the Stihl + trailer line items.
Plan for $9K-$13K used, or look at lower-tier Stihl models and a smaller
12-ft utility trailer.

## Where to read

- **Full report:** `C:/Users/camer/DEVNEW/GarbageGoober/output/procurement/scans/2026-07-21T103018/procurement_summary.md`
- **Per-listing scored CSV:** `.../procurement_scored.csv`
- **Per-item CSVs:** `.../<item_id>.csv` (10 of them)
- **eBay comps JSON:** `C:/Users/camer/DEVNEW/GarbageGoober/output/procurement/ebay_comps_2026-07-21.json`

## Compliance

- This was a **research-side scout**, NOT an equipment purchase.
- **OBJ-M2-005** (Equipment access handled outside GRASS -- borrow/rent
  short-term) remains DEFERRED per steward direction.
- No money was spent; no new equipment was acquired.
- The report is preparation for when the steward decides to reactivate
  equipment acquisition (trigger: equipment-related incident OR first
  full-time hire OR $500+ equipment expense).

## Re-runnability

```
.venv/Scripts/python.exe procurement_scan.py
.venv/Scripts/python.exe procurement_aggregate.py \
    --scan-dir output/procurement/scans/<new-timestamp> \
    --comps output/procurement/ebay_comps_2026-07-21.json
```

Recommend a monthly pass to track price trends (FB inventory turns over fast).

---

Ledger entry: `GRASS/state/ledger.yaml` 2026-07-21 entry (Day 28).
GAP-006 status: `partially_resolved` (data acquired; steward review pending).
