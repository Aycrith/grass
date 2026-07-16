"""
Capture D-0029 Homepage IA reorder visual proofs.

Mirrors the audit/capture-d0028.py CDP pattern (Chrome headless +
WebSocket) but captures the WHOLE homepage (not a focused section
crop) at desktop (1280x800) and mobile (393x851) viewports. Saves
under audit/d0029-{viewport}-fullpage.png.

Usage:
  audit/capture-d0029.py <port> <url> <out-prefix> <state>
    state in {before, after}
"""

import asyncio
import base64
import json
import sys
import urllib.request

import websockets  # type: ignore


def get_targets(port: str) -> list[dict]:
    raw = urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5).read()
    return json.loads(raw)


async def main() -> None:
    if len(sys.argv) < 5:
        print("usage: capture-d0029.py <port> <url> <out-prefix> <state>")
        sys.exit(2)
    port, url, out_prefix, state = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

    targets = get_targets(port)
    page = next((t for t in targets if t.get("type") == "page"), None)
    if not page:
        print("NO PAGE TARGET")
        sys.exit(1)
    uri = page["webSocketDebuggerUrl"]
    print(f"connecting to {uri[:80]}...")

    ws = await websockets.connect(uri, max_size=20_000_000, ping_interval=20)
    msg_id = 0

    async def send(method: str, params: dict | None = None) -> dict:
        nonlocal ws, msg_id
        try:
            msg_id += 1
            mid = msg_id
            await ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
            while True:
                m = json.loads(await ws.recv())
                if m.get("id") == mid:
                    return m
        except websockets.exceptions.ConnectionClosedError:
            print(f"  [ws closed during {method}, reconnecting...]")
            await asyncio.sleep(0.5)
            targets = get_targets(port)
            page = next((t for t in targets if t.get("type") == "page"), None)
            if not page:
                raise
            ws = await websockets.connect(
                page["webSocketDebuggerUrl"], max_size=20_000_000, ping_interval=20,
            )
            for domain in ("Page", "Runtime"):
                msg_id += 1
                mid = msg_id
                await ws.send(json.dumps({"id": mid, "method": f"{domain}.enable"}))
                while True:
                    m = json.loads(await ws.recv())
                    if m.get("id") == mid:
                        break
            msg_id += 1
            mid = msg_id
            await ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
            while True:
                m = json.loads(await ws.recv())
                if m.get("id") == mid:
                    return m

    async def shoot(filename: str, beyond: bool = True) -> None:
        res = await send(
            "Page.captureScreenshot",
            {"format": "png", "captureBeyondViewport": beyond, "fromSurface": True},
        )
        with open(f"{out_prefix}-{filename}.png", "wb") as f:
            f.write(base64.b64decode(res["result"]["data"]))
        print(f"  saved {out_prefix}-{filename}.png")

    await send("Page.enable")
    await send("Runtime.enable")

    # Pre-warm navigate.
    await send("Page.navigate", {"url": url})
    await asyncio.sleep(8)
    # Real navigate.
    await send("Page.navigate", {"url": url})
    await asyncio.sleep(6)

    # Scroll to top, then full-page capture.
    await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)", "awaitPromise": True})
    await asyncio.sleep(1)
    # Force layout to settle.
    await send(
        "Runtime.evaluate",
        {
            "expression": (
                "document.documentElement.scrollHeight + 'x' + "
                "document.documentElement.clientHeight"
            ),
            "awaitPromise": False,
        },
    )
    await asyncio.sleep(1)

    await shoot(f"fullpage", beyond=True)

    print("DONE")


asyncio.run(main())
