# Digital Twin — Property

> **Definition.** A `Property` is the physical location where work is performed. A `Customer` has one or more `Property` records; each `Property` has zero or more scheduled `Job`s.
>
> **Owner agent.** operations.
>
> **Cross-ref.** Customer (who owns/manages), Job (where work happens), Service (what is done), HurricaneMode (suspend all jobs on this property).

---

## Schema

```typescript
interface Property {
  id: string;
  customer_id: string;            // FK → Customer
  kind: 'residential' | 'commercial';
  // Address
  address: Address;
  access_notes?: string;          // "gate code 1234", "dogs in yard", etc.
  // Lot characteristics
  lot_size_sqft?: number;          // for pricing tier
  lawn_sqft?: number;
  turf_type?: 'st_augustine' | 'bermuda' | 'bahia' | 'zoysia' | 'centipede' | 'mixed';
  irrigation_present: boolean;
  hardscape_sqft?: number;         // driveways, walkways — affects edging
  bed_sqft?: number;               // planted beds — affects mulching/hedge
  // Trees & obstacles
  trees?: Tree[];
  obstacles?: Obstacle[];
  // Hazards
  hazards?: HazardFlag[];
  // Photo history
  photos: PropertyPhoto[];
  // Audit
  created_at: string;
  updated_at: string;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;                  // 'FL'
  zip: string;                    // '33771'
  lat?: number;
  lng?: number;
}

interface Tree {
  species?: string;               // 'oak', 'palm', 'pine'
  height_ft?: number;
  trunk_diameter_in?: number;
  location_note?: string;
}

type Obstacle = 'pool' | 'playset' | 'fence' | 'retaining_wall' | 'garden_bed';

type HazardFlag =
  | 'steep_terrain'
  | 'soft_ground_after_rain'
  | 'bee_near_door'
  | 'aggressive_dogs'
  | 'low_wires'
  | 'gas_lines_marked';

interface PropertyPhoto {
  id: string;
  url: string;
  taken_at: string;
  taken_by?: string;              // job_id or crew member name
  notes?: string;
}
```

## Invariants

1. A `Property` MUST have `address.city + address.state + address.zip` (no missing geocoding for service area).
2. `lot_size_sqft` is required for the pricing tier to be computed.
3. `turf_type` is required before any fertilization service can be scheduled (charter principle: GI-BMP).
4. `hazards` are checked before every job dispatch.
5. `access_notes` MUST be included in crew dispatch instructions.
6. Photo history MUST grow (≥1 photo per quarter per active property).

## Lot bucket pricing tiers

| Bucket | Lawn sqft | Mowing tier |
|---|---|---|
| Small | <10,890 | $38/weekly |
| Medium | 10,890-17,424 | $48/weekly |
| Large | 17,424-21,780 | $58/weekly |
| Very Large | >21,780 | Quote-based |

(10,890 sqft ≈ 0.25 acre, 17,424 ≈ 0.4 acre, 21,780 ≈ 0.5 acre)

## Owner agent actions

| Action | Permission |
|---|---|
| Create property (linked to customer) | operations or sales agent |
| Update lot_size_sqft / turf_type | operations agent, no approval |
| Add photo | operations agent at job completion |
| Add hazard | operations agent, no approval |
| Remove property | steward (charter principle: only irreversible ops on customer master data) |

## Cross-references

- **Reads:** Job (to determine workload), Customer (for contact + cadence)
- **Writes:** Job (records completion + photos), HurricaneMode (pauses scheduling)
- **KPIs derived:** Average lot size, lawn density, irrigation prevalence