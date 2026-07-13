#!/usr/bin/env python3
"""
regen-batch.py — Regenerate the Largo Lawn ComfyUI library with the
new storybook pipeline (SDXL base + storybook-landscapes-xl LoRA +
IPAdapter Plus + new ip-style-ref.png anchor).

For each asset: build workflow JSON, queue to ComfyUI, poll until done,
save outputs to apps/comfyui/outputs/largo-lawn/<slug>/.

Per-asset parameters are inlined below (read from the per-class prompt
markdown frontmatter). 4 candidates per asset for steward selection.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "apps" / "comfyui" / "outputs" / "largo-lawn"
SERVER = "http://127.0.0.1:8188"

# Storybook triggers prepended to every positive prompt (except operator).
STORYBOOK_TRIGGERS = "digital storybook illustration, textured brushwork, sharp focus, "

# Base brand negative.
NEG_BASE = (
    "smiling family, generic green grass texture, palm tree silhouette decoration, "
    "flamingo, sunset as focal point, lawn equipment cutout, AI generated people, "
    "human face, detailed facial features, portrait photography of person, "
    "lorem ipsum, placeholder, coming soon, photo placeholder, stock photo watermark, "
    "shutterstock, istock, getty, blurry phone photo, thumb visible, drone aerial, "
    "winter bare trees, snow, watermark, text, signature, logo, AI artifact, "
    "oversaturated, neon colors, generic suburb"
)

# Storybook LoRA author-supplied negative.
NEG_STORYBOOK = (
    "photo, realistic, photorealistic, 3d render, deformed, black and white, "
    "realism, disfigured, low contrast, anime, cel shaded, vector art, flat color"
)

# ── Asset catalog ───────────────────────────────────────────────────────
# Each entry: slug, positive_prompt, resolution, lora_strength, ip_weight, seed

ASSETS = [
    # ── Operator portrait (no LoRA, IP-Adapter 0.40 — editorial abstraction) ──
    {
        "slug": "operator-portrait",
        "class": "operator",
        "prompt": (
            "stylized editorial illustration, clean lines, flat colors, "
            "operator silhouette from chest up, three quarter profile, "
            "wide-brim straw sun hat in clay color with sand band, "
            "dark palm-bark silhouette shoulders, no facial features, no skin detail, "
            "right hand gripping a mower handle extending out of frame, "
            "sky background bleached sand to gulf blue upper third, "
            "strong golden hour backlight from camera-left, "
            "hat brim shadow over where face would be, "
            "New Yorker profile illustration style"
        ),
        "width": 1200, "height": 1500,
        "lora_strength": 0.0,  # explicitly off
        "ip_weight": 0.40,
        "seed": 7777,
        "neg": NEG_BASE + ", " + NEG_STORYBOOK,
    },
    # ── Service scenes (LoRA 0.75, IP-Adapter 0.55) ──
    {
        "slug": "service-mowing",
        "class": "service",
        "prompt": (
            "freshly mowed stripes on St Augustine grass, "
            "walk-behind mower at mid-distance moving right, "
            "blue sky with painterly clouds, "
            "ranch house in background, palm tree silhouette, "
            "morning golden hour, long warm shadows"
        ),
        "width": 1600, "height": 900,
        "lora_strength": 0.75,
        "ip_weight": 0.55,
        "seed": 1100 + abs(hash("mowing")) % 1000,
    },
    {
        "slug": "service-edging",
        "class": "service",
        "prompt": (
            "clean edge between grass and concrete walkway, "
            "stick edger blade engaged, thin line of turf dust kicked up, "
            "late afternoon long shadows, ranch house background, "
            "warm golden hour side-light, painterly depth"
        ),
        "width": 1600, "height": 900,
        "lora_strength": 0.75,
        "ip_weight": 0.55,
        "seed": 1100 + abs(hash("edging")) % 1000,
    },
    {
        "slug": "service-mulching",
        "class": "service",
        "prompt": (
            "dark hardwood mulch being spread around base of a palm or shrub, "
            "gloved hands visible at work, "
            "freshly mulched bed contrasting with surrounding grass, "
            "morning soft light, ranch house in background"
        ),
        "width": 1600, "height": 900,
        "lora_strength": 0.75,
        "ip_weight": 0.55,
        "seed": 1100 + abs(hash("mulching")) % 1000,
    },
    {
        "slug": "service-hedge-trimming",
        "class": "service",
        "prompt": (
            "hedge shears mid-cut on a row of small green shrubs, "
            "clippings visibly falling, golden hour side-light catching the clippings, "
            "manicured hedge row, ranch fence background"
        ),
        "width": 1600, "height": 900,
        "lora_strength": 0.75,
        "ip_weight": 0.55,
        "seed": 1100 + abs(hash("hedge-trimming")) % 1000,
    },
    {
        "slug": "service-hurricane-prep",
        "class": "service",
        "prompt": (
            "hurricane preparation scene in a Florida residential yard, "
            "patio furniture stacked against a garage, potted plants moved to a covered porch, "
            "tarp draped over a grill, "
            "overcast pre-storm sky heavy with dark grey-blue clouds, "
            "dim cool light, methodical and calm, "
            "no people, painterly depth"
        ),
        "width": 1600, "height": 900,
        "lora_strength": 0.65,  # less style lock per service.md note
        "ip_weight": 0.55,
        "seed": 1100 + abs(hash("hurricane-prep")) % 1000,
    },
    {
        "slug": "service-seasonal-cleanup",
        "class": "service",
        "prompt": (
            "leaf rake pulling a pile of autumn-but-still-Florida leaves into a yard bag, "
            "mature live oak dropping leaves onto St Augustine lawn, "
            "soft warm morning light, ranch house background, "
            "still green foliage in background, painterly depth"
        ),
        "width": 1600, "height": 900,
        "lora_strength": 0.75,
        "ip_weight": 0.55,
        "seed": 1100 + abs(hash("seasonal-cleanup")) % 1000,
    },
    # ── Area scenes (LoRA 0.85, IP-Adapter 0.55 — full hero treatment) ──
    {
        "slug": "area-33771",
        "class": "area",
        "prompt": (
            "Largo downtown central neighborhood establishing shot, "
            "mature live oak trees shading the street, "
            "older ranch homes with mature landscaping, "
            "wide horizontal streetscape, sidewalk and curbside lawns visible, "
            "single mower visible somewhere, "
            "late afternoon golden hour, lived-in maintained feel"
        ),
        "width": 1200, "height": 675,
        "lora_strength": 0.85,
        "ip_weight": 0.55,
        "seed": 2200 + 33771,
    },
    {
        "slug": "area-33770",
        "class": "area",
        "prompt": (
            "Belleair Harbor Bluffs edge neighborhood establishing shot, "
            "larger lots, manicured hedges, "
            "hints of intracoastal water visible in background, "
            "wide horizontal streetscape, sidewalks and curbside lawns, "
            "single edger visible somewhere, "
            "late afternoon golden hour, lived-in maintained feel"
        ),
        "width": 1200, "height": 675,
        "lora_strength": 0.85,
        "ip_weight": 0.55,
        "seed": 2200 + 33770,
    },
    {
        "slug": "area-33778",
        "class": "area",
        "prompt": (
            "Seminole Pinellas Park fringe neighborhood establishing shot, "
            "open lawns with more sun, ranch and manufactured-home mix, "
            "wide horizontal streetscape, sidewalks and curbside lawns, "
            "single mower or edger visible somewhere, "
            "late afternoon golden hour, lived-in maintained feel"
        ),
        "width": 1200, "height": 675,
        "lora_strength": 0.85,
        "ip_weight": 0.55,
        "seed": 2200 + 33778,
    },
    {
        "slug": "area-33773",
        "class": "area",
        "prompt": (
            "East Lake area newer subdivisions establishing shot, "
            "screen porches prominent, fresh sod lawns, "
            "wide horizontal streetscape, sidewalks and curbside lawns, "
            "single mower visible somewhere, "
            "late afternoon golden hour, lived-in maintained feel"
        ),
        "width": 1200, "height": 675,
        "lora_strength": 0.85,
        "ip_weight": 0.55,
        "seed": 2200 + 33773,
    },
    {
        "slug": "area-33774",
        "class": "area",
        "prompt": (
            "Ridgecrest Walsingham corridor neighborhood establishing shot, "
            "palms prominent in landscaping, mid-density, "
            "light commercial visible in background, "
            "wide horizontal streetscape, sidewalks and curbside lawns, "
            "single mower visible somewhere, "
            "late afternoon golden hour, lived-in maintained feel"
        ),
        "width": 1200, "height": 675,
        "lora_strength": 0.85,
        "ip_weight": 0.55,
        "seed": 2200 + 33774,
    },
    {
        "slug": "area-33756",
        "class": "area",
        "prompt": (
            "Clearwater east edge established neighborhood establishing shot, "
            "mature trees, smaller lots, urban-suburban blend, "
            "wide horizontal streetscape, sidewalks and curbside lawns, "
            "single mower visible somewhere, "
            "late afternoon golden hour, lived-in maintained feel"
        ),
        "width": 1200, "height": 675,
        "lora_strength": 0.85,
        "ip_weight": 0.55,
        "seed": 2200 + 33756,
    },
    # ── Equipment tiles (LoRA 0.65, IP-Adapter 0.50 — functional reference) ──
    {
        "slug": "equipment-mower",
        "class": "equipment",
        "prompt": (
            "close-up of a walk-behind lawn mower in action, "
            "deck close to grass, freshly cut clippings visible, "
            "mowing stripes leading away from the deck, "
            "mower fills lower half of frame, yard stretches back, "
            "bright morning light, painterly depth"
        ),
        "width": 800, "height": 600,
        "lora_strength": 0.65,
        "ip_weight": 0.50,
        "seed": 3300 + abs(hash("mower")) % 1000,
    },
    {
        "slug": "equipment-trimmer",
        "class": "equipment",
        "prompt": (
            "close-up of a string trimmer in action against a fence line, "
            "trimmer head mid-spin, grass clippings airborne, "
            "slight motion blur on the spinning head, "
            "tool head fills about 40% of frame, "
            "bright morning light, painterly depth"
        ),
        "width": 800, "height": 600,
        "lora_strength": 0.65,
        "ip_weight": 0.50,
        "seed": 3300 + abs(hash("trimmer")) % 1000,
    },
    {
        "slug": "equipment-blower",
        "class": "equipment",
        "prompt": (
            "close-up of a leaf blower in action across a driveway, "
            "leaves and grass clippings in mid-air, "
            "blower nozzle visible in lower right of frame, "
            "action moving left to right, "
            "bright daytime, painterly depth"
        ),
        "width": 800, "height": 600,
        "lora_strength": 0.65,
        "ip_weight": 0.50,
        "seed": 3300 + abs(hash("blower")) % 1000,
    },
    {
        "slug": "equipment-edger",
        "class": "equipment",
        "prompt": (
            "close-up of a stick edger in action, "
            "clean cut between grass and concrete walkway, "
            "edger blade just engaged, thin line of turf dust kicked up, "
            "tool head fills about 40% of frame, "
            "late afternoon long shadows, painterly depth"
        ),
        "width": 800, "height": 600,
        "lora_strength": 0.65,
        "ip_weight": 0.50,
        "seed": 3300 + abs(hash("edger")) % 1000,
    },
]


def build_workflow(asset):
    """Build the ComfyUI workflow JSON for one asset."""
    positive = asset["prompt"]
    if asset["lora_strength"] > 0:
        positive = STORYBOOK_TRIGGERS + positive
    negative = asset.get("neg", NEG_BASE + ", " + NEG_STORYBOOK)

    wf = {
        "1": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": "sd_xl_base_1.0.safetensors"},
        },
        # LoraLoader only if LoRA is on.
        # Model after LoRA stays at node 2 either way (just clip stays at #1 for negative path).
    }
    if asset["lora_strength"] > 0:
        wf["2"] = {
            "class_type": "LoraLoader",
            "inputs": {
                "model": ["1", 0],
                "clip": ["1", 1],
                "lora_name": "storybook-landscapes-xl.safetensors",
                "strength_model": asset["lora_strength"],
                "strength_clip": asset["lora_strength"],
            },
        }
        model_source_for_ip = "2"
        clip_source_for_text = "2"
    else:
        model_source_for_ip = "1"
        clip_source_for_text = "1"

    wf["3"] = {
        "class_type": "IPAdapterUnifiedLoader",
        "inputs": {
            "model": [model_source_for_ip, 0],
            "preset": "PLUS (high strength)",
        },
    }
    wf["4"] = {
        "class_type": "LoadImage",
        "inputs": {"image": "ip-style-ref.png"},
    }
    wf["5"] = {
        "class_type": "IPAdapter",
        "inputs": {
            "ipadapter": ["3", 1],
            "model": ["3", 0],
            "image": ["4", 0],
            "weight": asset["ip_weight"],
            "weight_type": "style transfer",
            "start_at": 0.0,
            "end_at": 1.0,
        },
    }
    wf["6"] = {
        "class_type": "CLIPTextEncode",
        "inputs": {"clip": [clip_source_for_text, 1], "text": positive},
    }
    wf["7"] = {
        "class_type": "CLIPTextEncode",
        "inputs": {"clip": [clip_source_for_text, 1], "text": negative},
    }
    wf["8"] = {
        "class_type": "EmptyLatentImage",
        "inputs": {
            "width": asset["width"],
            "height": asset["height"],
            "batch_size": 4,
        },
    }
    wf["9"] = {
        "class_type": "KSampler",
        "inputs": {
            "model": ["5", 0],
            "positive": ["6", 0],
            "negative": ["7", 0],
            "latent_image": ["8", 0],
            "seed": asset["seed"],
            "steps": 30,
            "cfg": 7.0,
            "sampler_name": "dpmpp_2m",
            "scheduler": "karras",
            "denoise": 1.0,
        },
    }
    wf["10"] = {
        "class_type": "VAEDecode",
        "inputs": {"samples": ["9", 0], "vae": ["1", 2]},
    }
    wf["11"] = {
        "class_type": "SaveImage",
        "inputs": {"images": ["10", 0], "filename_prefix": f"largo-lawn/{asset['slug']}"},
    }
    return wf


def queue(workflow):
    """Submit workflow to ComfyUI and return prompt_id."""
    req = urllib.request.Request(
        f"{SERVER}/prompt",
        data=json.dumps({"prompt": workflow}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)["prompt_id"]
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code} queueing: {body[:500]}")


def poll(prompt_id, timeout=900):
    """Poll history until prompt completes or times out. Returns output filenames."""
    deadline = time.time() + timeout
    last_status = None
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{SERVER}/history/{prompt_id}", timeout=10) as r:
                hist = json.load(r)
        except (urllib.error.HTTPError, urllib.error.URLError, json.JSONDecodeError):
            time.sleep(3)
            continue
        if prompt_id in hist:
            entry = hist[prompt_id]
            status_obj = entry.get("status", {})
            status_str = status_obj.get("status_str", "")
            if status_str == "error":
                msgs = status_obj.get("messages", [])
                err = next(
                    (m[1].get("exception_message", "") for m in reversed(msgs) if m[0] == "execution_error"),
                    "unknown",
                )
                raise RuntimeError(f"ComfyUI execution error: {err[:500]}")
            outputs = entry.get("outputs", {})
            if outputs:
                files = []
                for out in outputs.values():
                    files.extend(img["filename"] for img in out.get("images", []))
                return files
            # Status string may also indicate completion (e.g., "success").
            if status_str and status_str != last_status:
                print(f"    status: {status_str}", flush=True)
                last_status = status_str
        time.sleep(3)
    raise TimeoutError(f"Prompt {prompt_id} did not finish in {timeout}s")


def main():
    only = None
    skip = set()
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--skip" and i + 1 < len(args):
            skip.add(args[i + 1])
            i += 2
        else:
            only = args[i]
            i += 1
    for asset in ASSETS:
        if asset["slug"] in skip:
            print(f"\n=== {asset['slug']} (skipped) ===", flush=True)
            continue
        if only and asset["slug"] != only:
            continue
        slug = asset["slug"]
        out_dir = OUT_DIR / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        print(f"\n=== {slug} ===", flush=True)
        print(f"  {asset['width']}x{asset['height']} LoRA={asset['lora_strength']} IP={asset['ip_weight']} seed={asset['seed']}", flush=True)
        wf = build_workflow(asset)
        pid = queue(wf)
        print(f"  queued {pid}", flush=True)
        files = poll(pid)
        print(f"  done: {files}", flush=True)


if __name__ == "__main__":
    main()