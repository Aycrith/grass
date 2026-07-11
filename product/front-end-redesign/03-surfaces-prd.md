# PRD-03 — Surface-by-Surface Specifications

**Purpose:** Concrete per-route spec for every page on the Largo Lawn
web app. Each section lists: purpose, key states, content slots,
success criteria, anti-patterns to avoid.

**Audience:** Designer + engineer (joint execution)

---

## Shared design constraints (apply to every surface)

- **Max content width:** 1280px (up from current 1100px)
- **Reading width:** 720px max for long-form copy
- **Vertical rhythm:** `--space-7` (48px) between major sections
- **First paint target:** < 1.0s on 4G mid-tier Android
- **LCP target:** < 2.5s p75
- **Every image:** `loading="lazy"` except hero image (priority hint)
- **Every image:** explicit width/height to prevent CLS
- **Every interactive element:** keyboard accessible, visible focus state
- **Color contrast:** WCAG AA (4.5:1 body, 3:1 large)

---

## 1. Homepage `/`

### Purpose
Convert a first-time visitor (likely from a Google ad, NextDoor post, or
word-of-mouth search) into either: (a) starting a quote, (b) calling, or
(c) remembering Largo Lawn the next time they think about lawn care.

### Hero (above the fold)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Largo Lawn   Services  Areas  Pricing  About  [Q] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   YOUR NEIGHBOR'S                                           │
│   LAWN MOWER.                                               │
│                                                             │
│   Local, solo-operator lawn care in Largo, FL.             │
│   Free quotes within 24 hours. No contract.                 │
│                                                             │
│   ┌──────────────┐  ┌──────────────┐                        │
│   │ Free Quote → │  │ Call (727)...│                        │
│   └──────────────┘  └──────────────┘                        │
│                                                             │
│                       [Hero photo:                          │
│                        yard, mower, golden hour]            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
```

**Content slots:**
- Hero headline (1-3 words, display font, weight 900)
- Hero subhead (1 sentence, body font, weight 500)
- Primary CTA (button, `bg=sun`, `color=palm-bark`)
- Secondary CTA (button outline, phone number)
- Hero image (`.webp`, 2400×1200 desktop / 1200×1500 mobile)

**States:**
- Default: hero photo visible, CTAs centered or right-aligned
- Loading: skeleton for image (gray placeholder with grass-blade motif)
- Error: image fails gracefully (still functional, no broken icon)

**Success criteria:**
- Primary CTA visible without scroll on viewport ≥768px
- LCP element is the hero image OR the headline (whichever comes first in DOM)
- Hero image is < 200 KB compressed
- Both CTAs have a `:focus-visible` style distinct from hover

**Anti-patterns:**
- Stock-photo lawn background (looks fake)
- Animation autoplaying on load (distracting)
- Centered logo above headline (wastes above-the-fold space)

### Operator strip (below hero)

```
┌─────────────────────────────────────────────────────────────┐
│   ┌──────┐  Hi, I'm [Name].                                 │
│   │photo │  Born in Largo, mowing since 2019.               │
│   └──────┘  When you call, you talk to me. When I show      │
│             up to mow, it's me on the mower.                │
└─────────────────────────────────────────────────────────────┘
```

**Content slots:** operator name, photo, 2-sentence bio

**Success criteria:**
- Photo is real (not stock) and warm-toned
- Bio is in first person, conversational, no marketing speak

**Anti-patterns:**
- "Our team of lawn-care professionals" (we are one person)
- Generic "years of experience" claim without specifics

### Service cards (6)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   [photo]    │  │   [photo]    │  │   [photo]    │
│              │  │              │  │              │
│   Mowing     │  │   Edging     │  │   Mulching   │
│   From $48   │  │   included   │  │   From $75   │
│   weekly     │  │   weekly     │  │   per yd     │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Content slots per card:**
- Photo (4:5 aspect, 600×750)
- Title (h3, weight 700)
- Price (with frequency unit: "From $48 / weekly cut")
- Link to `/services/[slug]`

**States:**
- Default: white card on sand-bleached background
- Hover: lift to elevation-2, slight image zoom (1.02 scale, 240ms)

**Success criteria:**
- Card clicks go to service detail
- Price matches `/services/[slug]` page
- Card is keyboard-navigable

**Anti-patterns:**
- Icons instead of photos (feels generic)
- 6 identical cards in a row (overwhelming; consider 3+3 or scroll-snap)
- "Learn more" link text (vague; use service name)

### Social proof (post-launch)

```
┌─────────────────────────────────────────────────────────────┐
│   ⭐⭐⭐⭐⭐                                                │
│   "Showed up exactly when he said he would. Yard looks     │
│    great." — Maria K., 33771 (via Google)                  │
└─────────────────────────────────────────────────────────────┘
```

**Empty state (pre-launch):** Do not show this section. Do not show
placeholder testimonials. The page is honest about the absence.

### Why-us list (3-4 items)

```
┌─────────────────────────────────────────────────────────────┐
│   ✓ Local — 33771 home base                                 │
│   ✓ Solo — no subcontractors, no franchise markup           │
│   ✓ Hurricane-smart — auto-reschedule on bad weather        │
│   ✓ No contract — week-to-week, cancel anytime              │
└─────────────────────────────────────────────────────────────┘
```

### Final CTA strip

```
┌─────────────────────────────────────────────────────────────┐
│   Ready for a yard that looks cared for?                    │
│   ┌──────────────┐                                          │
│   │ Free Quote → │                                          │
│   └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

**Background:** `--ll-palm-shadow` (dark, photo-friendly)
**Text:** `--ll-sand-bleached` or `--ll-shell`

---

## 2. Quote `/quote`

### Purpose
Highest-conversion surface. Reduce friction from "I'm interested" to
"I've sent my details" in under 60 seconds.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│   LARGO LAWN   Services  Areas  Pricing  About  [Free Q]   │
├─────────────────────────────────────────────────────────────┤
│   Free Quote.                                               │
│   No obligation, no contract, response within 24 hours.     │
│                                                             │
│   ┌─────────────────────┐    ┌─────────────────────┐       │
│   │ LOT SIZE            │    │ FREQUENCY           │       │
│   │ [Small ▾]           │    │ [Weekly ▾]           │       │
│   └─────────────────────┘    └─────────────────────┘       │
│                                                             │
│   ┌─────────────────────┐    ┌─────────────────────┐       │
│   │ ZIP CODE            │    │ ADD-ONS              │      │
│   │ [33771 ▾]           │    │ [Edging] [Mulch] ... │       │
│   └─────────────────────┘    └─────────────────────┘       │
│                                                             │
│   ┌──────────────────────────────────────────────┐         │
│   │  Estimated per visit                         │         │
│   │  $48                                          │         │
│   │  ~$208 / month · billed per visit             │         │
│   └──────────────────────────────────────────────┘         │
│                                                             │
│   ┌──────────────────┐  ┌──────────────────┐                │
│   │ First name       │  │ Last name         │               │
│   └──────────────────┘  └──────────────────┘                │
│   ┌──────────────────────────────────────────────┐         │
│   │ Email                                          │        │
│   └──────────────────────────────────────────────┘         │
│   ┌──────────────────────────────────────────────┐         │
│   │ Phone                                          │        │
│   └──────────────────────────────────────────────┘         │
│                                                             │
│   ┌──────────────────────────────────────────────┐         │
│   │           Send me this quote →                 │        │
│   └──────────────────────────────────────────────┘         │
│                                                             │
│   What happens next: ...                                    │
└─────────────────────────────────────────────────────────────┘
```

### Key states

| State | Trigger | Visual change |
|---|---|---|
| Default | Initial render | Calculator visible, estimate $0 |
| Estimating | User changes input | Estimate updates with 240ms ease |
| Submitting | User submits form | Button shows spinner, disabled |
| Success | API returns ok | Form replaced with thank-you card |
| Error | API returns error | Inline error message, form still editable |
| Out-of-area | ZIP outside service | Yellow banner explaining |

### Success criteria
- Form submit success rate ≥40% of unique `/quote` visitors
- Median time on page ≥45s
- Mobile keyboard doesn't obscure CTA button (test on iPhone SE)

### Anti-patterns
- 8-field form (too long; current is 4)
- Hidden pricing until email submitted (loses trust)
- Required phone (it's "recommended")
- Modal popup on arrival (hostile)

---

## 3. Services `/services` and `/services/[slug]`

### Service index

**Purpose:** Browse all six services.

**Layout:** Same card grid as homepage service section, but full-page.

### Service detail (per slug)

**Purpose:** Educate the customer on one service, show pricing, answer
FAQ, drive to quote.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Hero photo: mowing in action, 1600×900]                   │
├─────────────────────────────────────────────────────────────┤
│   Mowing                                                    │
│   From $48 / weekly cut for 1/4-acre lots.                  │
│                                                             │
│   [body copy: 2-3 paragraphs]                              │
│                                                             │
│   What's included:                                          │
│   • Mow + edge + blow                                       │
│   • Grass-cycling (or bagged, your call)                    │
│   • Same day every week (or bi-weekly)                      │
│                                                             │
│   Pricing breakdown                                         │
│   ┌──────────┬─────────┬──────────┐                        │
│   │ Lot size │ Weekly  │ Bi-weekly│                        │
│   ├──────────┼─────────┼──────────┤                        │
│   │ Small    │  $35    │  $39     │                        │
│   │ Medium   │  $48    │  $55     │                        │
│   │ Large    │  $65    │  $75     │                        │
│   └──────────┴─────────┴──────────┘                        │
│                                                             │
│   FAQ (3-5 items)                                           │
│                                                             │
│   ┌──────────────────────┐                                  │
│   │  Get a quote for mowing → │                              │
│   └──────────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Service areas `/areas` and `/areas/[zip]`

### Index

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│   We mow in six Pinellas County ZIPs.                       │
│                                                             │
│   ┌──────┐ ┌──────┐ ┌──────┐                                │
│   │ 33771│ │ 33770│ │ 33773│ ... (map with pins?)          │
│   └──────┘ └──────┘ └──────┘                                │
│                                                             │
│   [Static map showing service area shape]                   │
└─────────────────────────────────────────────────────────────┘
```

### Per-ZIP

**Layout:** Same shape as service detail but with ZIP-specific hero
photo + neighborhood copy.

**Success criteria:** Each ZIP page has unique, specific copy. Not
"Serving Largo and surrounding areas" — actual named streets, actual
landmarks.

---

## 5. About `/about`

**Purpose:** Trust-building through transparency about who you are.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│   [Large operator portrait, 1600×900]                       │
├─────────────────────────────────────────────────────────────┤
│   Hi, I'm [Name].                                           │
│                                                             │
│   [3-4 paragraphs of bio]                                   │
│                                                             │
│   The gear I use                                            │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│   │ mower│ │ edger│ │ trim │ │ blow│                        │
│   └──────┘ └──────┘ └──────┘ └──────┘                      │
│                                                             │
│   The truck                                                 │
│   [truck photo + caption]                                   │
│                                                             │
│   What I won't do                                           │
│   • Fertilization (not licensed for it)                     │
│   • Irrigation work                                         │
│   • Tree removal at height                                  │
│   • Anything outside my actual capability                    │
│                                                             │
│   When I won't work                                         │
│   • Winds ≥30 mph (hurricane threshold)                     │
│   • Named-storm conditions                                  │
│   • Standing water on the lawn                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Contact `/contact`

**Purpose:** Alternative to /quote for people who prefer to talk.

**Layout:** Two-column on desktop, stacked on mobile.
```
┌──────────────────────────┐  ┌─────────────────────────────┐
│  Call or text            │  │ Send a message              │
│  (727) 555-0123          │  │ [name] [email]              │
│  [tap to call]           │  │ [message]                   │
│                          │  │ [Send →]                    │
│  Email                   │  └─────────────────────────────┘
│  hello@largolawn.pro     │
│                          │  ┌─────────────────────────────┐
│  Hours                   │  │ Hours                        │
│  Mon-Fri 7-5             │  │ M-F 7am-5pm                  │
│  Sat 8-2                  │  │ Sat 8am-2pm                  │
│  Sun closed              │  │ Sun closed                   │
│                          │  └─────────────────────────────┘
│  Service area            │
│  [6 ZIPs with links]     │
└──────────────────────────┘
```

---

## 7. Pricing `/pricing`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│   Pricing                                                   │
│   Mid-market rates. No contracts. Pay per visit.             │
│                                                             │
│   ┌──────────────────────────────────────────┐              │
│   │ MOWING                                    │              │
│   │ Small  | $35/wk  | $39/2-wk | $45 once │              │
│   │ Medium | $48/wk  | $55/2-wk | $60 once │              │
│   │ Large  | $65/wk  | $75/2-wk | $85 once │              │
│   └──────────────────────────────────────────┘              │
│                                                             │
│   ┌──────────────────────────────────────────┐              │
│   │ ADD-ONS                                   │              │
│   │ Edging       | included w/ weekly          │           │
│   │ Mulching     | from $75/yd                │           │
│   │ Hedge trim   | from $80                   │           │
│   │ Hurricane    | $95 flat                   │           │
│   └──────────────────────────────────────────┘              │
│                                                             │
│   ┌──────────────────────────────────────────┐              │
│   │ FAQ about pricing                         │              │
│   │ Do you offer senior / military discount?  │              │
│   │ What's the trip fee?                      │              │
│   │ Can I tip?                                │              │
│   └──────────────────────────────────────────┘              │
│                                                             │
│   [Get a quote →]                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. QR codes `/qr`

**Purpose:** Operator-facing — print-ready QR codes.

**Layout:** Same shape as current; styled with new design system.

---

## 9. Redirector `/t/[slug]`

No visual changes — the redirect is 302 with UTM params. Visual
redesign not needed.

---

## 10. Privacy `/privacy` and Terms `/terms`

**Layout:** Match new design system (same typography, spacing, but
long-form reading-optimized).

**Copy:** Real privacy policy + terms, not lorem ipsum.

---

## 11. GBP landing `/gbp`

**Purpose:** People who found Largo Lawn on Google and clicked through.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│   Thanks for finding us on Google.                          │
│                                                             │
│   We're a locally owned lawn-care service in Largo, FL.     │
│   When you call, you talk to me. When I show up, it's me    │
│   on the mower.                                             │
│                                                             │
│   ✓ Locally owned & operated                                │
│   ✓ Solo operator (no subcontractors)                       │
│   ✓ Free quotes within 24 hours                             │
│   ✓ Serving 33771 + 5 adjacent ZIPs                         │
│                                                             │
│   ┌────────────────┐                                        │
│   │ Free Quote →   │                                        │
│   └────────────────┘                                        │
│                                                             │
│   [hours, phone, address (if SAB) or area, NAP block]       │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. Not-found `/not-found`

**Layout:** Warm 404 page with a CTA back to homepage. Maybe a
photo of the operator holding a "404" sign (humor).

---

## What this PRD does NOT cover

- Component-level CSS specs → `01-design-system-prd.md`
- Motion choreography → `04-motion-and-microinteractions.md`
- Asset specs → `05-photography-and-illustration-brief.md`
- Test strategy → separate QA PRD (post-M3)