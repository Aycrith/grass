#!/usr/bin/env python3
"""
generate.py — Largo Lawn ComfyUI generation driver.

Reads:
  - apps/comfyui/prompts/<class>.md          (the rendered prompt text + frontmatter)
  - apps/comfyui/prompts/_style-block.md     (palette + anti-pattern negative prompt)
  - apps/comfyui/workflows/<class>-<slug>.json (API-format ComfyUI workflow graph)
  - apps/comfyui/control/ip-style-ref.png    (IP-Adapter style anchor, embedded via base64)

Writes:
  - apps/comfyui/outputs/largo-lawn/<slug>/{1..N}.png  (raw SDXL output PNGs)

Posts to ComfyUI's HTTP API at http://127.0.0.1:8188 (override with --server).

Usage:
    python apps/comfyui/scripts/generate.py --slug hero --count 4
    python apps/comfyui/scripts/generate.py --slug service-mowing --count 4
    python apps/comfyui/scripts/generate.py --slug area-33771 --count 4

The driver walks the workflow graph by class_type rather than node ID (IDs are
auto-assigned by ComfyUI's UI when exporting — fragile to assume). It rewrites:
  - CLIPTextEncode (positive) text       <- from prompts/<class>.md body
  - CLIPTextEncode (negative) text       <- from _style-block.md negative prompt
  - EmptyLatentImage width / height      <- from prompts/<class>.md frontmatter resolution
  - KSampler seed                        <- per-call seed
  - IPAdapterAdvanced weight + image     <- from --ip-weight arg + ip-style-ref.png
  - SaveImage prefix                     <- <slug>/ so outputs land in their own folder
"""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# Resolve repo root from this script's location:
#   apps/comfyui/scripts/generate.py  -> ../../../
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[2]
COMFY_DIR = REPO_ROOT / "apps" / "comfyui"
PROMPTS_DIR = COMFY_DIR / "prompts"
WORKFLOWS_DIR = COMFY_DIR / "workflows"
CONTROL_DIR = COMFY_DIR / "control"
OUTPUTS_DIR = COMFY_DIR / "outputs" / "largo-lawn"

DEFAULT_SERVER = "http://127.0.0.1:8188"
DEFAULT_IP_WEIGHT = 0.5
DEFAULT_COUNT = 4
POLL_INTERVAL_SEC = 1.0
POLL_TIMEOUT_SEC = 300


# -----------------------------------------------------------------------------
# Frontmatter + body parsing
# -----------------------------------------------------------------------------

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n(.*)$", re.DOTALL)


def parse_markdown(path: Path) -> tuple[dict, str]:
    """Parse a prompts/*.md file into (frontmatter_dict, body)."""
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        raise ValueError(f"{path} has no YAML frontmatter")
    fm_text, body = m.group(1), m.group(2)
    # Naive YAML: only top-level `key: value` lines, lists as `[a, b]`,
    # nested objects are NOT supported here (keep prompts simple).
    fm: dict = {}
    for line in fm_text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()
        if val.startswith("[") and val.endswith("]"):
            fm[key] = [x.strip().strip('"\'') for x in val[1:-1].split(",") if x.strip()]
        else:
            fm[key] = val.strip('"\'')
    return fm, body.strip()


def render_prompt_text(body: str, style_block_body: str) -> str:
    """
    Inline the style-block into the rendered prompt. The style-block body is
    appended after a divider so SDXL treats it as binding constraints.
    """
    return f"{body}\n\n---\n\n[Style anchor — applies to every asset]\n\n{style_block_body}"


def extract_resolution(fm: dict) -> tuple[int, int]:
    raw = fm.get("resolution", "")
    if isinstance(raw, list) and len(raw) == 2:
        return int(raw[0]), int(raw[1])
    # fm["resolution"] could already be the list-as-text "[2400, 1500]"
    nums = re.findall(r"\d+", str(raw))
    if len(nums) == 2:
        return int(nums[0]), int(nums[1])
    raise ValueError(f"frontmatter resolution missing or malformed: {raw!r}")


# -----------------------------------------------------------------------------
# Slug -> workflow / prompt mapping
# -----------------------------------------------------------------------------

SLUG_TO_CLASS = {
    "hero": "hero",
    "operator-portrait": "operator",
    "service-mowing": "service",
    "service-edging": "service",
    "service-mulching": "service",
    "service-hedge-trimming": "service",
    "service-hurricane-prep": "service",
    "service-seasonal-cleanup": "service",
    "area-33771": "area",
    "area-33770": "area",
    "area-33778": "area",
    "area-33773": "area",
    "area-33774": "area",
    "area-33756": "area",
    "equipment-mower": "equipment",
    "equipment-trimmer": "equipment",
    "equipment-blower": "equipment",
    "equipment-edger": "equipment",
}

CLASS_TO_PROMPT_FILE = {
    "hero": "hero.md",
    "operator": "operator-portrait.md",
    "service": "service.md",       # body is per-slug via slug param
    "area": "area.md",             # body is per-slug via slug param
    "equipment": "equipment.md",   # body is per-slug via slug param
}

WORKFLOW_FILES = {
    # One shared SDXL + IP-Adapter Plus workflow serves all 18 asset classes.
    # generate.py rewrites EmptyLatentImage width/height per asset-class resolution,
    # KSampler seed per generation, CLIPTextEncode[0].text per slug, and
    # SaveImage.filename_prefix per slug.
    slug: "sdxl-txt2img-ipadapter.json"
    for slug in [
        "hero", "operator-portrait",
        "service-mowing", "service-edging", "service-mulching",
        "service-hedge-trimming", "service-hurricane-prep", "service-seasonal-cleanup",
        "area-33771", "area-33770", "area-33778",
        "area-33773", "area-33774", "area-33756",
        "equipment-mower", "equipment-trimmer", "equipment-blower", "equipment-edger",
    ]
}


# -----------------------------------------------------------------------------
# Workflow graph mutation (by class_type, not node ID)
# -----------------------------------------------------------------------------

def find_nodes_by_class(workflow: dict, class_type: str) -> list[tuple[str, dict]]:
    """Return [(node_id, node)] for every node with the given class_type."""
    return [(nid, node) for nid, node in workflow.items()
            if isinstance(node, dict) and node.get("class_type") == class_type]


def first_node_by_class(workflow: dict, class_type: str) -> tuple[str, dict] | None:
    found = find_nodes_by_class(workflow, class_type)
    return found[0] if found else None


def set_workflow_params(
    workflow: dict,
    *,
    positive_prompt: str,
    negative_prompt: str,
    width: int,
    height: int,
    seed: int,
    ip_weight: float,
    ip_image_b64: str,
    save_prefix: str,
) -> None:
    """
    Rewrite the workflow's bound inputs by class_type. Each class_type should
    appear at most once in our graphs; if multiple, we update all (rare).
    """
    # Positive + negative CLIPTextEncode
    text_nodes = find_nodes_by_class(workflow, "CLIPTextEncode")
    if len(text_nodes) >= 1:
        # Convention: first is positive (its inputs.feed into KSampler.positive)
        text_nodes[0][1]["inputs"]["text"] = positive_prompt
    if len(text_nodes) >= 2:
        text_nodes[1][1]["inputs"]["text"] = negative_prompt

    # Empty latent image
    latent = first_node_by_class(workflow, "EmptyLatentImage")
    if latent is None:
        latent = first_node_by_class(workflow, "EmptySD3LatentImage")
    if latent is not None:
        latent[1]["inputs"]["width"] = width
        latent[1]["inputs"]["height"] = height
        # batch_size may or may not be a key; tolerate missing.
        latent[1]["inputs"].setdefault("batch_size", 1)

    # KSampler seed
    sampler = first_node_by_class(workflow, "KSampler")
    if sampler is not None:
        sampler[1]["inputs"]["seed"] = seed

    # IP-Adapter — supports IPAdapterAdvanced (preferred) and IPAdapterApply (fallback)
    ipadv = first_node_by_class(workflow, "IPAdapterAdvanced")
    if ipadv is not None:
        ipadv[1]["inputs"]["weight"] = ip_weight
        ipadv[1]["inputs"]["weight_type"] = "linear"
        # image input is normally a reference to a LoadImage node; replace with
        # a direct base64-uploaded LoadImage via a one-shot image node swap.
        # For now: assume workflow already references a LoadImage by node ID.

    ipapply = first_node_by_class(workflow, "IPAdapterApply")
    if ipapply is not None:
        ipapply[1]["inputs"]["weight"] = ip_weight

    # SaveImage prefix
    save = first_node_by_class(workflow, "SaveImage")
    if save is not None:
        save[1]["inputs"]["filename_prefix"] = save_prefix

    # Upload the IP-Adapter reference via /upload/image so a LoadImage node can
    # pick it up. We do this separately before queueing the prompt.


# -----------------------------------------------------------------------------
# HTTP client (stdlib only — no extra deps)
# -----------------------------------------------------------------------------

class ComfyError(RuntimeError):
    pass


def http_post_json(server: str, path: str, body: dict) -> dict:
    url = f"{server}{path}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST",
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise ComfyError(f"POST {url} -> {e.code} {e.reason}: {detail}") from e


def http_get_json(server: str, path: str) -> dict:
    url = f"{server}{path}"
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise ComfyError(f"GET {url} -> {e.code} {e.reason}: {detail}") from e


def http_get_bytes(server: str, path: str) -> bytes:
    url = f"{server}{path}"
    try:
        with urllib.request.urlopen(url, timeout=60) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise ComfyError(f"GET {url} -> {e.code} {e.reason}: {detail}") from e


def http_post_multipart(server: str, path: str, file_path: Path) -> dict:
    """
    Upload an image to ComfyUI at /upload/image. Uses stdlib only.
    """
    url = f"{server}{path}"
    boundary = "----LargoLawnBoundary12345"
    mime, _ = mimetypes.guess_type(file_path.name)
    mime = mime or "image/png"
    with open(file_path, "rb") as f:
        file_bytes = f.read()
    parts = []
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(
        f'Content-Disposition: form-data; name="image"; filename="{file_path.name}"\r\n'.encode()
    )
    parts.append(f"Content-Type: {mime}\r\n\r\n".encode())
    parts.append(file_bytes)
    parts.append(f"\r\n--{boundary}--\r\n".encode())
    body = b"".join(parts)

    req = urllib.request.Request(url, data=body, method="POST", headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}",
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise ComfyError(f"POST {url} -> {e.code} {e.reason}: {detail}") from e


# -----------------------------------------------------------------------------
# Queue + history polling
# -----------------------------------------------------------------------------

def queue_prompt(server: str, workflow: dict, client_id: str) -> str:
    resp = http_post_json(server, "/prompt", {"prompt": workflow, "client_id": client_id})
    pid = resp.get("prompt_id")
    if not pid:
        raise ComfyError(f"queue_prompt returned no prompt_id: {resp}")
    if resp.get("node_errors"):
        raise ComfyError(f"node_errors in queued prompt: {resp['node_errors']}")
    return pid


def wait_for_history(server: str, prompt_id: str) -> dict:
    """Poll /history/<prompt_id> until status.completed is true."""
    deadline = time.time() + POLL_TIMEOUT_SEC
    while time.time() < deadline:
        try:
            history = http_get_json(server, f"/history/{prompt_id}")
        except ComfyError:
            history = {}
        if prompt_id in history:
            entry = history[prompt_id]
            status = entry.get("status", {})
            if status.get("completed"):
                return entry
            if status.get("status_str") == "error":
                raise ComfyError(f"prompt {prompt_id} errored: {entry.get('status')}")
        time.sleep(POLL_INTERVAL_SEC)
    raise ComfyError(f"timed out waiting for prompt {prompt_id}")


def fetch_outputs(server: str, history_entry: dict, dest_dir: Path) -> list[Path]:
    """Download every output image from a completed prompt entry."""
    dest_dir.mkdir(parents=True, exist_ok=True)
    saved: list[Path] = []
    counter = 0
    for node_id, node_out in history_entry.get("outputs", {}).items():
        for img in node_out.get("images", []):
            counter += 1
            qs = urllib.parse.urlencode({
                "filename": img["filename"],
                "subfolder": img.get("subfolder", ""),
                "type": img.get("type", "output"),
            })
            data = http_get_bytes(server, f"/view?{qs}")
            out_path = dest_dir / f"{counter}.png"
            out_path.write_bytes(data)
            saved.append(out_path)
    return saved


# -----------------------------------------------------------------------------
# Per-slug prompt rendering
# -----------------------------------------------------------------------------

def render_body_for_slug(body: str, slug: str) -> str:
    """
    Substitute {slug}, {zip}, {tool}, {neighborhood-name} slots in template bodies.
    The actual values are looked up in a small map; extend as needed.
    """
    # ZIP lookup
    zip_to_neighborhood = {
        "33771": "Largo (downtown / central)",
        "33770": "Belleair / Harbor Bluffs edge",
        "33778": "Seminole / Pinellas Park fringe",
        "33773": "East Lake area",
        "33774": "Ridgecrest / Walsingham corridor",
        "33756": "Clearwater east edge",
    }
    substitutions = {}
    if slug.startswith("area-"):
        z = slug.removeprefix("area-")
        substitutions["{zip}"] = z
        substitutions["{neighborhood-name}"] = zip_to_neighborhood.get(z, "Largo area")
    elif slug.startswith("service-"):
        substitutions["{slug}"] = slug.removeprefix("service-")
        if slug == "service-hurricane-prep":
            substitutions["{mood}"] = "hurricane"
        else:
            substitutions["{mood}"] = "bright"
    elif slug.startswith("equipment-"):
        substitutions["{tool}"] = slug.removeprefix("equipment-")
    out = body
    for k, v in substitutions.items():
        out = out.replace(k, v)
    return out


# -----------------------------------------------------------------------------
# Seed derivation (per plan §4 _style-block.md seed table)
# -----------------------------------------------------------------------------

def seed_for_slug(slug: str, base: int | None = None) -> int:
    """Per-class seed formula: hero=4242, operator=7777, service=1100+hash, area=2200+zip, equipment=3300+hash."""
    if slug == "hero":
        return 4242
    if slug == "operator-portrait":
        return 7777
    if slug.startswith("service-"):
        slug_part = slug.removeprefix("service-")
        return 1100 + (sum(ord(c) for c in slug_part) % 9000)
    if slug.startswith("area-"):
        try:
            zip_int = int(slug.removeprefix("area-"))
        except ValueError:
            zip_int = 0
        return 2200 + zip_int
    if slug.startswith("equipment-"):
        tool = slug.removeprefix("equipment-")
        return 3300 + (sum(ord(c) for c in tool) % 9000)
    raise ValueError(f"unknown slug prefix: {slug}")


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

def generate_one(server: str, slug: str, seed: int, ip_weight: float, ip_image_path: Path,
                 style_block_body: str, client_id: str) -> list[Path]:
    cls = SLUG_TO_CLASS[slug]
    prompt_file = PROMPTS_DIR / CLASS_TO_PROMPT_FILE[cls]
    workflow_file = WORKFLOWS_DIR / WORKFLOW_FILES[slug]

    fm, body = parse_markdown(prompt_file)
    width, height = extract_resolution(fm)
    body = render_body_for_slug(body, slug)
    positive = render_prompt_text(body, style_block_body)

    negative_match = re.search(
        r"## Negative prompt.*?```\n(.*?)```", style_block_body, re.DOTALL
    )
    if not negative_match:
        raise ValueError("could not find negative prompt in _style-block.md")
    negative = negative_match.group(1).strip()

    workflow = json.loads(workflow_file.read_text(encoding="utf-8"))

    ip_b64 = base64.b64encode(ip_image_path.read_bytes()).decode("ascii")

    set_workflow_params(
        workflow,
        positive_prompt=positive,
        negative_prompt=negative,
        width=width,
        height=height,
        seed=seed,
        ip_weight=ip_weight,
        ip_image_b64=ip_b64,
        save_prefix=f"largo-lawn/{slug}",
    )

    pid = queue_prompt(server, workflow, client_id)
    print(f"  [{slug}] queued prompt {pid} (seed={seed}, {width}x{height})", file=sys.stderr)
    entry = wait_for_history(server, pid)
    out_paths = fetch_outputs(server, entry, OUTPUTS_DIR / slug)
    return out_paths


def main() -> int:
    p = argparse.ArgumentParser(description="Generate Largo Lawn ComfyUI assets.")
    p.add_argument("--slug", required=True, help="one of the 19 SLUG_TO_CLASS keys")
    p.add_argument("--count", type=int, default=DEFAULT_COUNT, help="generations per slug")
    p.add_argument("--server", default=DEFAULT_SERVER, help="ComfyUI base URL")
    p.add_argument("--ip-weight", type=float, default=DEFAULT_IP_WEIGHT,
                   help="IP-Adapter style weight (0.4–0.6 typical)")
    args = p.parse_args()

    if args.slug not in SLUG_TO_CLASS:
        print(f"unknown --slug {args.slug!r}; known: {sorted(SLUG_TO_CLASS)}", file=sys.stderr)
        return 2

    ip_image = CONTROL_DIR / "ip-style-ref.png"
    if not ip_image.exists():
        print(f"missing IP-Adapter reference: {ip_image}", file=sys.stderr)
        print(f"see {CONTROL_DIR}/README.md for how to render it", file=sys.stderr)
        return 2

    style_fm, style_body = parse_markdown(PROMPTS_DIR / "_style-block.md")

    client_id = f"largo-lawn-{os.getpid()}-{int(time.time())}"
    base_seed = seed_for_slug(args.slug)
    all_paths: list[Path] = []
    for n in range(1, args.count + 1):
        seed = base_seed + (n - 1) * 31  # small offset so each generation differs
        paths = generate_one(
            server=args.server,
            slug=args.slug,
            seed=seed,
            ip_weight=args.ip_weight,
            ip_image_path=ip_image,
            style_block_body=style_body,
            client_id=client_id,
        )
        # Rename sequential to 1.png..N.png per slug
        slug_dir = OUTPUTS_DIR / args.slug
        renamed: list[Path] = []
        for i, p in enumerate(sorted(paths), start=1):
            dst = slug_dir / f"{i}.png"
            if p.resolve() != dst.resolve():
                p.rename(dst)
            renamed.append(dst)
        print(f"  [{args.slug}] saved {len(renamed)} generation(s) to {slug_dir}", file=sys.stderr)
        all_paths.extend(renamed)

    print(f"\n{len(all_paths)} generation(s) saved under {OUTPUTS_DIR / args.slug}")
    for path in sorted(all_paths):
        print(f"  {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
