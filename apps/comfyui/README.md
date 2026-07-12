# apps/comfyui/ — Largo Lawn asset-generation workspace

Project-side workspace for generating the 19 raster assets (hero × 2,
service × 6, area × 6, equipment × 4, operator × 1) that replace the
SVG placeholders under `apps/web/public/`. Lives outside the
customer-facing bundle (under `apps/` not `apps/web/`) so generation
tooling never ships to production.

## Layout

```
apps/comfyui/
├── README.md                          ← you are here
├── prompts/                           ← markdown prompt templates
│   ├── _style-block.md                ← shared style anchor (referenced by all others)
│   ├── hero.md
│   ├── operator-portrait.md
│   ├── service.md                     ← template with {slug, mood} slots
│   ├── area.md                        ← template with {zip, neighborhood-name} slots
│   └── equipment.md                   ← template with {tool} slot
├── workflows/                         ← API-format ComfyUI workflow JSONs
│   └── README.md                      ← how to author + export (post-WP0)
├── control/                           ← IP-Adapter reference images
│   ├── ip-style-ref.png               ← ONE image, used as IP-Adapter style anchor for all assets
│   └── README.md                      ← how to choose + update the anchor
├── scripts/
│   ├── generate.py                    ← POSTs workflow JSON + prompt to ComfyUI /prompt endpoint (post-WP0)
│   ├── curate-pick.sh                 ← mv outputs/{slug}/N.png → curated/{slug}.png
│   ├── convert-to-webp.mjs            ← sharp convert curated/*.png → apps/web/public/{slug}.webp @ q=80
│   ├── check-weight.mjs               ← walks apps/web/public, fails if any webp > 300 KB
│   └── verify-references.mjs          ← walks apps/web/src, fails if any <Image src>/<img src> unresolved
├── outputs/                           ← .gitignored; raw PNGs land here during generation
│   └── largo-lawn/                    ← project subfolder, isolated from any prior ComfyUI outputs
└── curated/                           ← .gitignored; steward-selected keepers, before conversion
```

## Roles

**Steward owns:**

- Prompt edits (creative direction)
- Curation (picking the keeper from each generation batch)
- Final asset selection (alt text, before/after preference)
- Running WP0 (ComfyUI server + MCP wiring)

**Engineer owns:**

- Workflow JSON authoring (after WP0 — needs ComfyUI web UI to export)
- The `generate.py` driver (after WP0 — needs to know the ComfyUI HTTP API shape)
- Conversion scripts (`convert-to-webp`, `check-weight`, `verify-references`)
- CI integration (asset-weight + references jobs — see WP4)
- Component path swaps (`hero/desktop.svg` → `hero/desktop.webp`, etc. — done in WP3)

## Steady-state workflow (post-WP0)

For each of the 19 assets:

1. Engineer runs `bun scripts/generate.py --slug <slug> --count 4` (or `--slug <slug> --mood hurricane` etc.).
   Reads `prompts/<class>.md` + the workflow JSON for that class, calls
   ComfyUI's `/prompt` endpoint 4 times with varied seeds, downloads
   outputs to `outputs/largo-lawn/<slug>/{1..4}.png`.

2. Steward opens each PNG, picks the keeper (alt text + reason in a comment if needed).

3. Engineer runs `bash scripts/curate-pick.sh <slug> 3` (mvs `3.png` → `curated/<slug>.png`).

4. Engineer runs `bun scripts/convert-to-webp.mjs --slug <slug>` (converts `curated/<slug>.png` → `apps/web/public/<path>/<slug>.webp` at quality 80, asserts ≤ 300 KB; auto-steps down to 70 / 60 if oversized).

5. CI runs `check-weight.mjs` + `verify-references.mjs` on PRs (catches any drift).

## Current state (2026-07-11)

- WP2 scaffolding lands the parts that don't need the ComfyUI HTTP API:
  README, prompts, the standalone scripts (`convert-to-webp`,
  `check-weight`, `verify-references`, `curate-pick`), control/ + workflows/
  READMEs, .gitignore entries, `sharp` devDep on `apps/web`.
- WP2 deferred parts (need WP0 — ComfyUI server + MCP wiring):
  workflow JSONs (11 of them, one per asset class), `generate.py` driver.
- These deferred parts land as a follow-up commit after WP0 step 6 (Claude Code restart).

## See also

- `product/front-end-redesign/05-photography-and-illustration-brief.md` §9 — anti-patterns (every prompt's `avoid:` cross-references this list).
- `C:\Users\camer\.claude\plans\the-front-end-website-linked-quill.md` §4 WP2-WP4 — full plan context.
- `apps/web/src/styles/tokens.css` — palette anchor every prompt references.