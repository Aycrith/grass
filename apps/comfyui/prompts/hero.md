---
name: hero
description: DEPRECATED — DO NOT RUN. Superseded by hero-v2.md (2026-07-14, D-0008). v1's single-master/dual-crop pipeline produced blurry blob-field outputs that failed the visual-quality, fidelity, and animation-standards bar (4-of-4 master candidates rejected, 4-of-4 mobile candidates rejected at curate-pick). Kept here for diff traceability only. See apps/comfyui/prompts/hero-v2.md and governance/decisions/0008-hero-v2-asset-pack.md for the current hero brief and ratification.
type: hero
status: deprecated
deprecated_on: "2026-07-14"
superseded_by: hero-v2.md
deprecation_rationale: "v1 outputs failed the keeper bar (see D-0008 §v1 failure). v2 ships keeper-quality painted storybook (desktop.webp 314KB, mobile.webp 191KB) generated with independent desktop + mobile compositions at higher LoRA strength (0.90) and IP-Adapter weight (0.55)."
workflow: hero-landscape.json
resolution: [2400, 1500]
output_paths:
  - apps/web/public/hero/desktop.webp   # v1 output (DEPRECATED — replaced by v2 in commit 72e749c)
  - apps/web/public/hero/mobile.webp    # v1 output (DEPRECATED — replaced by v2 in commit 72e749c)
seed: 4242
style_block: _style-block.md
lora: storybook-landscapes-xl
lora_strength: 0.85
ip_adapter_weight: 0.50
---

# ⚠️ SUPERSEDED — DO NOT RUN THIS PROMPT

This prompt was the v1 hero brief, used to generate the original
desktop.webp (37KB) and mobile.webp (22KB) at commit ac16da8 (Day 17).
Those outputs are **deprecated** and have been replaced by the v2
master scene (commit 72e749c, 2026-07-14).

**Do not invoke this prompt.** It produces substandard output that
fails the keeper bar (visual quality, fidelity, and animation
standards — see D-0008 ratification record).

For the current hero brief, see:
- **`apps/comfyui/prompts/hero-v2.md`** — the active prompt
- **`governance/decisions/0008-hero-v2-asset-pack.md`** — the ratification ADR

This file is kept for diff traceability only. The v1 outputs it
generated remain on disk for one release cycle to allow rollback,
then will be deleted.

---

# Hero — landscape composition (single master, dual-crop)  [DEPRECATED CONTENT BELOW]

# Hero — landscape composition (single master, dual-crop)

## Style engine

This scene runs **with** the storybook LoRA. Prepend trigger words:
`digital storybook illustration, textured brushwork, sharp focus`.
The negative block (brand + LoRA author) is appended by the driver.
IP-Adapter weight is 0.50 — the hero gets its strong style from the
LoRA + composition prompt; IP-Adapter just keeps palette continuity
with the rest of the library.

## Subject

A freshly mowed St. Augustine lawn in a Pinellas residential yard at
**golden hour** (the warm late-afternoon light that makes grass glow).
The lawn is the hero — fills the lower 2/3 of the frame. A modest
ranch-style house or screen porch sits in the upper 1/3. Mid-distance
palm(s) anchor the Florida setting without becoming tropical kitsch.

## Composition

- Rule of thirds. Horizon line at lower-third.
- Slight wide-angle (35mm equivalent).
- Mower visible in mid-distance (small scale) — implies "your neighbor
  just finished", doesn't dominate.
- Painterly depth — the LoRA pulls textures into brushwork; lean into
  that by giving the eye a clear foreground/midground/background path.
- No people (operator is off-frame, suggested by the mower).

## Lighting

Late-afternoon golden hour. Long warm shadows on the grass. The sky is
the `--ll-sand-bleached` color near the horizon, transitioning to
`--ll-gulf` at the top.

## Mood

Quiet, just-finished, residential, capable. **Reads like the
opening spread of a children's book about a Florida neighborhood** —
hand-drawn warmth, not stock photography.

## Crop guidance

Engineer crops in post via `sharp.extract()`:

- **Desktop (2400×1200)** — center horizontal crop, keep the lawn in
  the bottom 2/3 of the frame.
- **Mobile (1200×1500)** — center vertical crop, keep the house
  visible at the top.

## See also

- `apps/comfyui/prompts/_style-block.md` — palette + anti-patterns
- `apps/comfyui/control/ip-style-ref.png` — IP-Adapter style anchor
- Plan §2 — locked decision (single master + 2 crops)