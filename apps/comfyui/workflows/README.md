# workflows/ — ComfyUI workflow JSONs (API format)

> **Status (2026-07-11):** Empty. The 11 workflow JSONs land here after
> the steward completes WP0 (ComfyUI server running + MCP wired) — at
> that point the engineer authors them by hand in the ComfyUI web UI
> and exports via **"Save (API Format)"**.

## Why empty

`generate.py` (in `scripts/`) needs the API-format JSON to know which
node inputs to overwrite per asset. Authoring them blind (without the
ComfyUI server running) means guessing at node IDs, and they'll be
wrong. The plan defers them to "post-WP0 step 6 (Claude Code restart)."

## What goes here (one JSON per asset class)

```
workflows/
├── hero-landscape.json             # 2400×1500, crops 2 ways in post
├── operator-portrait-stylized.json # 1200×1500, no face
├── service-mowing.json             # 1600×900
├── service-edging.json
├── service-mulching.json
├── service-hedge-trimming.json
├── service-hurricane-prep.json     # darker mood
├── service-seasonal-cleanup.json
├── area-33771.json                 # pattern; 5 more for other ZIPs
├── equipment-mower.json            # 800×600
└── equipment-{trimmer,blower,edger}.json
```

## How to author (post-WP0)

1. Open ComfyUI web UI at `http://127.0.0.1:8188`.
2. Build the SDXL txt2img graph: CheckpointLoaderSimple → CLIPTextEncode
   (positive + negative) → KSampler → VAEDecode → SaveImage.
3. Add an **IP-Adapter Plus** node loading `control/ip-style-ref.png`
   as `style_model`, weight 0.5.
4. Set image dimensions on an EmptyLatentImage node to match the
   `resolution:` field in the matching `prompts/<class>.md`.
5. Hit **"Save (API Format)"** (not "Save" — that's the UI-format).
6. Save to `workflows/<class>-<slug>.json` with a matching filename.

The driver script (`scripts/generate.py`) reads the API-format JSON,
walks the graph to find the CLIPTextEncode positive node by ID, and
overwrites its `text` input with the rendered prompt for that asset.

## Why API format, not UI format

UI-format JSON embeds the entire frontend UI state (positions, colors,
node groups) — it's 4× the size and includes fields the HTTP API
ignores. API-format is what `POST /prompt` expects.
