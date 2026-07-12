---
name: operator-portrait
description: Operator portrait — stylized editorial abstraction. Plan §2 locked decision: hat + shoulders + mower handle, no detailed facial features. v1 placeholder, swapped for steward phone photo later.
type: operator
workflow: operator-portrait-stylized.json
resolution: [1200, 1500]
output_path: apps/web/public/operator/portrait.webp
seed: 7777
style_block: _style-block.md
---

# Operator portrait — stylized editorial abstraction

## Why this exists

Per the plan §2 locked decision, the v1 operator portrait ships as a
**stylized editorial abstraction**, not a real face. The reasons:

1. Brand guidelines (`brand/guidelines.md:159`) say "use the logo mark
   if you'd rather stay semi-anonymous" — we're picking that option for v1.
2. PRD-05 §9 anti-pattern explicitly bans "AI-generated people (uncanny,
   gets worse every month)" — a fully-realized AI face is the worst-case
   version of that.
3. A stylized abstraction gives the brand a distinct visual signal
   without claiming to be a person we can't actually photograph yet.

When the steward captures a phone photo, this gets replaced — keep the
file path stable.

## Subject

An operator silhouette from the chest up, facing slightly away from
camera (3/4 profile). Visible elements:

- **Wide-brim straw sun hat** — `--ll-clay` with `--ll-sand` band
- **Shoulders + neck** — `--ll-palm-bark` silhouette (no skin detail)
- **Right hand** — gripping a mower handle that extends out of frame
- **Sky behind** — `--ll-sand-bleached` with `--ll-gulf` upper third

No detailed facial features. No eyes, no mouth, no skin texture. The
silhouette + hat shape carry the identity.

## Composition

- Subject centered, fills 70% of frame height.
- Hat brim cuts a horizontal line at upper-third.
- Mower handle enters from lower-right corner at 45°.
- Negative space (sky) on either side of the silhouette.

## Lighting

Strong backlight (golden hour from camera-left). The operator's front
side is in shadow; the hat brim casts a shadow over where the face
would be. This is what makes the abstraction work — without backlight,
the silhouette would have to be drawn.

## Style notes

- Editorial illustration, not photorealistic. Think New Yorker profile
  illustration, not LinkedIn headshot.
- Strong shapes, clean edges. No painterly texture, no impressionism.
- Background can be flat color or extremely soft gradient.

## See also

- `apps/comfyui/prompts/_style-block.md`
- Plan §2 — locked decision rationale