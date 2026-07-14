#!/usr/bin/env python3
"""
run-img2img.py — Minimal img2img driver for ComfyUI.

Posts a workflow JSON to ComfyUI's HTTP API, polls for completion,
downloads the resulting image(s). Does NOT use the Largo Lawn
generate.py driver (which is txt2img-only) — this is a one-off for
the D-0009 grass asset img2img experiment.

Usage:
    python apps/comfyui/scripts/run-img2img.py --workflow hero-grass-v3-img2img.json --seed 5701
"""

import argparse
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

DEFAULT_SERVER = "http://127.0.0.1:8188"
POLL_INTERVAL_SEC = 1.0
POLL_TIMEOUT_SEC = 300

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[2]
WORKFLOWS_DIR = REPO_ROOT / "apps" / "comfyui" / "workflows"
OUTPUTS_DIR = REPO_ROOT / "apps" / "comfyui" / "outputs" / "largo-lawn" / "grass-v3-img2img"


def upload_input_image(server: str, image_path: Path) -> str:
    """Upload image to ComfyUI's /upload/image endpoint, return the stored filename."""
    # ComfyUI expects multipart/form-data with field 'image'
    import http.client
    import mimetypes
    from email.generator import BytesGenerator
    from io import BytesIO

    boundary = "----MavisImg2ImgBoundary12345"
    body = BytesIO()
    filename = image_path.name

    # multipart preamble
    body.write(f"--{boundary}\r\n".encode())
    body.write(
        f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'.encode()
    )
    ctype = mimetypes.guess_type(filename)[0] or "application/octet-stream"
    body.write(f"Content-Type: {ctype}\r\n\r\n".encode())
    body.write(image_path.read_bytes())
    body.write(f"\r\n--{boundary}--\r\n".encode())

    # Parse server URL
    if server.startswith("http://"):
        host = server[len("http://"):].split(":")[0]
        port = int(server.split(":")[-1].rstrip("/"))
    elif server.startswith("https://"):
        raise NotImplementedError("https not supported")
    else:
        host = server.split(":")[0]
        port = int(server.split(":")[-1].rstrip("/"))

    conn = http.client.HTTPConnection(host, port, timeout=30)
    conn.request(
        "POST",
        "/upload/image",
        body=body.getvalue(),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    resp = conn.getresponse()
    if resp.status != 200:
        raise RuntimeError(f"upload failed: HTTP {resp.status}: {resp.read().decode()}")
    result = json.loads(resp.read().decode())
    conn.close()
    return result.get("name", filename)


def queue_prompt(server: str, workflow: dict, client_id: str) -> str:
    """Post workflow to /prompt, return prompt_id."""
    payload = {"prompt": workflow, "client_id": client_id}
    req = urllib.request.Request(
        f"{server}/prompt",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        result = json.loads(resp.read().decode())
    return result["prompt_id"]


def wait_for_completion(server: str, prompt_id: str, client_id: str) -> list[dict]:
    """Poll /history/{prompt_id} until done. Return list of output image refs."""
    deadline = time.time() + POLL_TIMEOUT_SEC
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(
                f"{server}/history/{prompt_id}", timeout=5
            ) as resp:
                history = json.loads(resp.read().decode())
            if prompt_id in history:
                outputs = history[prompt_id].get("outputs", {})
                images = []
                for node_id, node_out in outputs.items():
                    for img in node_out.get("images", []):
                        images.append(img)
                if images:
                    return images
        except (urllib.error.URLError, json.JSONDecodeError, KeyError):
            pass
        time.sleep(POLL_INTERVAL_SEC)
    raise TimeoutError(f"prompt {prompt_id} did not complete within {POLL_TIMEOUT_SEC}s")


def fetch_image(server: str, image_ref: dict, out_path: Path) -> int:
    """Download image from /view endpoint. Return file size in bytes."""
    params = urllib.parse.urlencode(
        {"filename": image_ref["filename"], "subfolder": image_ref.get("subfolder", ""), "type": image_ref.get("type", "output")}
    )
    with urllib.request.urlopen(f"{server}/view?{params}", timeout=15) as resp:
        data = resp.read()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(data)
    return len(data)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workflow", required=True, help="workflow JSON filename (in apps/comfyui/workflows/)")
    parser.add_argument("--server", default=DEFAULT_SERVER)
    parser.add_argument("--seed", type=int, default=None, help="override the seed in the workflow")
    parser.add_argument("--input-image", default=None, help="override the input image filename referenced in the workflow (e.g. grass-xl-input.png). If set, the file is uploaded first.")
    args = parser.parse_args()

    workflow_path = WORKFLOWS_DIR / args.workflow
    workflow = json.loads(workflow_path.read_text(encoding="utf-8"))

    # Optionally override seed
    if args.seed is not None:
        for node in workflow.values():
            if node.get("class_type") == "KSampler":
                node["inputs"]["seed"] = args.seed
                break

    # Optionally upload a new input image
    if args.input_image:
        img_path = REPO_ROOT / "apps" / "comfyui" / "outputs" / "grass-input" / args.input_image
        if not img_path.exists():
            print(f"ERROR: input image not found: {img_path}", file=sys.stderr)
            return 2
        print(f"Uploading input image: {img_path.name}")
        stored = upload_input_image(args.server, img_path)
        print(f"  -> stored as: {stored}")
        # The workflow may reference the image by filename; ComfyUI strips
        # extension on upload so we update the LoadImage node.
        for node in workflow.values():
            if node.get("class_type") == "LoadImage" and "image" in node["inputs"]:
                current = node["inputs"]["image"]
                if current == args.input_image or current == img_path.stem:
                    # Update to the uploaded name (with extension, as ComfyUI stores)
                    node["inputs"]["image"] = stored
                    print(f"  -> workflow LoadImage updated to: {stored}")

    print(f"Posting workflow: {args.workflow} (seed={args.seed or 'workflow-default'})")
    client_id = f"mavis-img2img-{int(time.time())}"
    prompt_id = queue_prompt(args.server, workflow, client_id)
    print(f"  -> prompt_id: {prompt_id}")

    print("Polling for completion...")
    images = wait_for_completion(args.server, prompt_id, client_id)
    print(f"  -> {len(images)} image(s) produced")

    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    for i, img_ref in enumerate(images, 1):
        out_path = OUTPUTS_DIR / f"candidate_{i}_{img_ref['filename']}"
        size = fetch_image(args.server, img_ref, out_path)
        print(f"  -> {out_path.name} ({size} bytes)")

    print(f"\nDone. Outputs in: {OUTPUTS_DIR}")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
