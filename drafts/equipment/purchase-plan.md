# OBJ-M2-005 — Equipment Purchase Plan (DRAFT, ready to order)

> **Status:** Equipment list, vendor recommendations, and lead-time plan drafted.
> **Authorization:** research/suppliers/largo.yaml + D-0006 (insurance equipment floater).
> **Gate:** Cannot begin field work until (a) insurance bound, (b) equipment delivered + tested.
> **Estimated total:** $9,500-12,500 (with $1,500 contingency).

---

## Equipment list (Phase 1 MVP)

| Item | Purpose | Brand/model recommendation | Est. cost | Lead time |
|---|---|---|---|---|
| Commercial zero-turn mower | Primary mowing tool | Exmark Lazer Z E-Series 60" | $7,500-9,000 | 2-6 weeks (long in hurricane season) |
| Push mower | Small lots + backup | Honda HRX217VKA | $700-900 | In stock at Home Depot |
| Commercial edger | Edging detail | Stihl FC 91 | $350-450 | In stock |
| Backpack blower | Blowing clippings + hurricane prep | Stihl BR 800 C-E | $450-550 | In stock |
| String trimmer | Detail work + edges | Stihl FS 91 R | $350-450 | In stock |
| Hedge trimmer | Hedge service line | Stihl HS 56 C-E | $300-400 | In stock |
| Hand tools (rakes, shovels, loppers) | Misc | Fiskars + A.M. Leonard | $300-400 | In stock |
| Fuel cans + 2-cycle oil | Fuel | Midwest Can + Stihl Ultra | $80-120 | In stock |
| PPE (eye/ear/gloves/boots) | Safety | Stihl + Carhartt | $200-300 | In stock |
| **Equipment subtotal** | | | **~$10,500-12,500** | |
| Trailer (6x12 landscape) | Haul equipment | PJ Trailers or Quality Cargo | $3,500-5,000 | 1-2 weeks |
| Tie-downs, ramps | Trailer safety | Erickson + Rhino Ramps | $150-200 | In stock |
| **Trailer subtotal** | | | **~$3,650-5,200** | |
| **Total** | | | **~$14,150-17,700** | |

## Phase 2 (Month 3+) deferred items

| Item | Est. cost | When |
|---|---|---|
| 2nd commercial zero-turn (for crew scale-up) | $7,500 | Month 3+ if MRR >$2K |
| Ride-on spreader (mulch install efficiency) | $1,500 | Month 4+ |
| 2nd backpack blower | $500 | Month 3+ |
| **Phase 2 subtotal** | **~$9,500** | |

## Vendor recommendations (Pinellas-area, verified in research/suppliers/largo.yaml)

### Primary dealer: SiteOne Landscape Supply (multiple Pinellas locations)

- Address: 11900 66th St N, Largo FL 33773 (closest)
- Phone: (727) 547-3660
- Inventory: mowers (Exmark, Stihl handhelds), fuel, parts
- Lead time on commercial mowers: 2-6 weeks during hurricane season (April-Oct)
- **Best for:** Walk-in purchase, emergency parts, fuel

### Secondary dealer: Horizon Distributors

- Multiple Tampa Bay locations
- Inventory: irrigation supplies (we don't use but good for referrals), chemicals (we don't apply)
- Best for: bulk mulch sourcing

### Specialty: Stihl handheld dealer

- Stihl doesn't sell direct; find a local authorized dealer via stihlusa.com
- Largo-area: most likely Ace Hardware (Starkey Rd) or independent dealer

### Equipment dealers (commercial mowers)

- **Exmark**: Find local dealer via exmark.com (Largo has 1-2 options)
- **Toro**: Also good alternative; price-competitive
- **Husqvarna**: Lower cost option, less commercial-grade durability
- **Dealer Co-op (Tampa)**: Used commercial equipment, refurbished

## Purchase plan — sequenced by lead time

### Week 1 (parallel)

1. **Order commercial zero-turn NOW** — 2-6 week lead time is the bottleneck
   - Vendor: Exmark dealer (call 727-555-XXXX to confirm)
   - Model: Lazer Z E-Series 60" deck (covers 80% of residential lots in 1 pass)
   - Spec: 25hp Kawasaki engine, ROPS (rollover protection), suspension seat
   - Cost: $7,500-9,000
   - Decision: buy new vs. certified pre-owned (CPO)
     - **New**: full warranty, predictable reliability, $7,500-9,000
     - **CPO**: $4,500-6,000, 70-80% of new, often with 90-day warranty
     - **Used (no cert)**: $3,000-5,000, risky for MVP
   - **Recommendation for Year 1: New** (predictable reliability > $3K savings)

2. **Order trailer NOW** — 1-2 week lead time, custom order likely
   - 6x12 tandem-axle landscape trailer with ramp gate
   - Cost: $3,500-5,000
   - Vendor: PJ Trailers (Tampa) or Quality Cargo

### Week 1 (in-stock items, purchase immediately)

3. Push mower — Home Depot or Lowe's (in stock)
4. Commercial edger — SiteOne or local Stihl dealer (in stock)
5. Backpack blower — same (in stock)
6. String trimmer — same
7. Hedge trimmer — same
8. Hand tools — Amazon or Home Depot
9. PPE — Home Depot or Amazon

### Week 2-3 (while waiting for zero-turn + trailer)

- Test all handhelds on a single pilot job (after insurance is bound)
- Set up trailer hitch on personal vehicle (if using personal truck)
- Validate commercial zero-turn delivery date

### Week 4-6 (zero-turn + trailer delivery)

- Take delivery, inspect, register trailer with FL DHSMV
- Add title + registration to insurance (commercial auto)
- First full pilot job with complete equipment

## Cash-flow plan

Recommended funding source (in order):

1. **Personal savings** (assume $10K available — this is the bootstrap fund)
2. **0% APR credit card** for the remaining $4-7K (paid off within 6-12 months from revenue)
3. **Equipment financing** (Toro Financial, John Deere Financial) — DEFER unless rates <8%

**Bootstrap budget per phase:**
- Week 1-2 (in-stock): ~$2,500
- Week 4-6 (zero-turn + trailer): ~$11,500
- **Total: ~$14,000** ($3K under the conservative estimate)

## Insurance implications

Per D-0006, the equipment floater policy is required BEFORE the zero-turn delivery:

- Add Exmark zero-turn ($7,500-9,000) to floater before delivery
- Add trailer ($3,500-5,000) to floater before delivery
- Add all handhelds ($1,200-1,500) to floater before first use

Equipment list to include in broker email: see drafts/insurance/broker-quote-requests.md.

## State ledger update (post-purchase)

```yaml
- id: OBJ-M2-005
  status: completed
  completed_date: <DATE>
  artifacts:
    - drafts/equipment/purchase-plan.md (this file)
    - governance/filings/insurance/equipment-floater-schedule.pdf
    - Receipts in drafts/equipment/receipts/
  gate_protected: "Cannot begin field work before insurance bound"
  next_review_trigger: "Month 3 — evaluate 2nd zero-turn need"
```

## Cross-references

- D-0006 (insurance): `governance/decisions/0006-insurance-broker.md`
- D-0008 (carrier selection): `governance/decisions/0008-insurance-carrier.md` (placeholder, post-Phase B)
- Suppliers research: `research/suppliers/largo.yaml`
- Hurricane mode (cap_hurricane_mode): `state/capability-registry.yaml`