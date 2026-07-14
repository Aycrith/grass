# Curation notes — master scene, 2026-07-14, seed 4242

**Workflow:** apps/comfyui/workflows/hero-landscape.json
**LoRA:** storybook-landscapes-xl @ 0.90
**IP-Adapter:** PLUS (high strength), weight 0.55, style anchor ip-style-ref.png
**KSampler:** dpmpp_2m / karras / 40 steps / CFG 7.5
**Prompt:** v2 §6.1 master hero scene, 2400×1500, batch_size 4
**Elapsed:** 190 seconds (3.2 min) on RTX 3090

## Rubric scores (1-5 per criterion)

### Candidate 1 — hero_master_v2_00001_.png (KEEPER)

- **§2.1 Storybook painterly texture:** 5/5 — Hand-drawn gouache, brushwork visible on lawn and trees.
- **§2.1 Brand palette fidelity:** 5/5 — All colors within 9-token palette.
- **§2.1 No AI-face artifacts:** 4/5 — Small operator figure on riding mower is visible but small; brand says neighbor implied not shown. Fix via layered grass + palm occluding the lower-right.
- **§2.1 No text/watermarks:** 5/5
- **§2.2 Focal subject unambiguous:** 3/5 — Riding mower identifiable but brand-correct push mower is sourced from §6.5 layered mower.webp, not the master.
- **§2.2 Depth-of-field separation:** 5/5 — Three-band depth, dark trees / mid house / bright sky.
- **§2.2 Rule of thirds:** 3/5 — Mower at far-right rather than slightly-right-of-center. Acceptable because the layered mower.webp will sit at the brand-correct coordinates.
- **§2.2 Mower scale correct:** 4/5 — ~3-4% of frame, acceptable.
- **§2.2 Transparent background:** N/A (master has baked scene).

**Total: 24/30 → KEEPER**

### Candidate 2 — hero_master_v2_00002_.png (REJECT)

- **§2.2 Focal subject unambiguous:** 1/5 — No mower in scene. Fails the focal-subject criterion.
- **Total: 18/30 → REJECT** (beautiful Victorian wraparound porch + mowed lawn stripes, wrong brief)

### Candidate 3 — hero_master_v2_00003_.png (REJECT)

- **§2.2 Focal subject unambiguous:** 1/5 — No mower. Beautiful oak tree + ranch house, wrong brief.
- **Total: 19/30 → REJECT**

### Candidate 4 — hero_master_v2_00004_.png (REJECT)

- **§2.2 Focal subject unambiguous:** 1/5 — No mower. 2-story house + smaller cottage, wrong brief.
- **Total: 18/30 → REJECT**

## Decision

Candidate 1 is the master keeper. The riding-mower and small-operator-figure
issues are addressed by the layered assets (§6.4-§6.8) painting over the
lower-right of the master where these elements sit. The brand-correct push
mower and the brand-correct palm + grass layers are the actual focal subject
on the page; the master is a static fallback for LCP / reduced-motion.

## Next actions

1. Generate the 5 layered assets (§6.4-§6.8) one at a time, with focused
   per-asset curation.
2. Generate the mobile crop (§6.3) one at a time.
3. Composite-check at §4 STEP 5.
4. PNG → WebP at q=82.
5. Drop into pps/web/public/hero/.
6. Hand off to motion sub-agent for §7 choreography.
