#!/usr/bin/env python3
"""Queue a ComfyUI workflow JSON and poll /history until done. Print result filenames."""
import json
import sys
import time
import urllib.error
import urllib.request

WORKFLOW_PATH = sys.argv[1]
SERVER = "http://127.0.0.1:8188"

with open(WORKFLOW_PATH) as f:
    workflow = json.load(f)

req = urllib.request.Request(
    f"{SERVER}/prompt",
    data=json.dumps({"prompt": workflow}).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
try:
    with urllib.request.urlopen(req) as r:
        body = json.load(r)
except urllib.error.HTTPError as e:
    print(f"HTTP {e.code}: {e.reason}", flush=True)
    print(e.read().decode("utf-8", errors="replace"), flush=True)
    sys.exit(1)
prompt_id = body["prompt_id"]
print(f"queued: {prompt_id}", flush=True)

deadline = time.time() + 300
while time.time() < deadline:
    with urllib.request.urlopen(f"{SERVER}/history/{prompt_id}") as r:
        hist = json.load(r)
    if prompt_id in hist:
        result = hist[prompt_id]
        if "outputs" in result:
            for nid, out in result["outputs"].items():
                for img in out.get("images", []):
                    print(f"  -> {img['filename']}", flush=True)
            print(f"DONE in {time.time() - (deadline - 300):.1f}s", flush=True)
            sys.exit(0)
    time.sleep(2)

print("TIMEOUT", flush=True)
sys.exit(1)