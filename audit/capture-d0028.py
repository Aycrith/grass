"""
Capture D-0028 Coverage Check screenshots for visual review.

Mirrors the audit/capture-d0027.py CDP pattern (Chrome headless +
WebSocket) but captures the NEW Coverage Check section in three
states (idle / hit / miss) at both desktop (1280x800) and mobile
(393x851) viewports. Saves under audit/d0028-*.png.

The capture is resilient to mid-session WebSocket disconnects: on a
``ConnectionClosedError`` the script re-fetches the target list
from the CDP HTTP endpoint and reopens the WS. This handles the
``Page.navigate`` case where the page target may be invalidated
when Chrome's headless mode reissues the renderer process.

Usage:
  audit/capture-d0028.ps1 [desktop|mobile]
"""

import asyncio
import base64
import json
import sys
import urllib.request

import websockets  # type: ignore


def get_targets(port: str) -> list[dict]:
    # Use 127.0.0.1 explicitly — modern Chrome binds the loopback
    # to ::1 (IPv6) by default and `localhost` may resolve there
    # while the IPv4 mapping is unavailable on this system.
    raw = urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5).read()
    return json.loads(raw)


async def main() -> None:
    if len(sys.argv) < 4:
        print("usage: capture-d0028.py <port> <url> <out-prefix>")
        sys.exit(2)
    port, url, out_prefix = sys.argv[1], sys.argv[2], sys.argv[3]

    # Initial WS connect to the first page target.
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
        """Send a CDP command and await its response. Auto-reconnect
        on ConnectionClosedError by re-resolving the page target
        (the renderer process is sometimes recycled on navigate)."""
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
            # Resolve a fresh page target.
            await asyncio.sleep(0.5)
            targets = get_targets(port)
            page = next((t for t in targets if t.get("type") == "page"), None)
            if not page:
                raise
            ws = await websockets.connect(
                page["webSocketDebuggerUrl"], max_size=20_000_000, ping_interval=20,
            )
            # Re-enable the domains we need.
            for domain in ("Page", "Runtime"):
                msg_id += 1
                mid = msg_id
                await ws.send(json.dumps({"id": mid, "method": f"{domain}.enable"}))
                while True:
                    m = json.loads(await ws.recv())
                    if m.get("id") == mid:
                        break
            # Retry the original command.
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

    # Pre-warm navigate. On dev server, this triggers the initial
    # compile. The second navigate is the one we actually screenshot.
    await send("Page.navigate", {"url": url})
    await asyncio.sleep(8)
    await send(
        "Runtime.evaluate",
        {"expression": "document.body && document.body.scrollHeight", "awaitPromise": False},
    )
    await asyncio.sleep(1)

    # Real navigation.
    await send("Page.navigate", {"url": url})
    await asyncio.sleep(6)

    scroll_js = (
        "Array.from(document.querySelectorAll('h2'))"
        ".find(h => h.textContent && h.textContent.includes('Six Pinellas'))"
        "?.scrollIntoView({block: 'start'})"
    )

    # ---------- IDLE state ----------
    await send("Runtime.evaluate", {"expression": scroll_js, "awaitPromise": True})
    await asyncio.sleep(2)
    await shoot("idle-section", beyond=True)

    await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)"})
    await asyncio.sleep(1)
    await shoot("idle-full", beyond=True)

    # ---------- HIT state (33771) ----------
    await send("Runtime.evaluate", {"expression": scroll_js, "awaitPromise": True})
    await asyncio.sleep(1)
    await send(
        "Runtime.evaluate",
        {
            "expression": (
                "(function(){"
                "  const input = document.querySelector('input[name=\"coverage\"]');"
                "  if (!input) { return 'no input'; }"
                "  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;"
                "  setter.call(input, '33771');"
                "  input.dispatchEvent(new Event('input', { bubbles: true }));"
                "  const form = input.closest('form');"
                "  if (form) { form.requestSubmit(); }"
                "  return 'submitted';"
                "})()"
            ),
            "awaitPromise": False,
        },
    )
    await asyncio.sleep(2)
    await shoot("hit-section", beyond=True)

    # ---------- MISS state (99999) ----------
    await send(
        "Runtime.evaluate",
        {
            "expression": (
                "(function(){"
                "  const input = document.querySelector('input[name=\"coverage\"]');"
                "  if (!input) { return 'no input'; }"
                "  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;"
                "  setter.call(input, '99999');"
                "  input.dispatchEvent(new Event('input', { bubbles: true }));"
                "  const form = input.closest('form');"
                "  if (form) { form.requestSubmit(); }"
                "  return 'submitted';"
                "})()"
            ),
            "awaitPromise": False,
        },
    )
    await asyncio.sleep(2)
    await shoot("miss-section", beyond=True)

    # ---------- Areas details open ----------
    await send(
        "Runtime.evaluate",
        {
            "expression": "document.querySelector('details')?.setAttribute('open', 'open')",
            "awaitPromise": False,
        },
    )
    await asyncio.sleep(1)
    await shoot("hit-areas-open", beyond=True)

    print("DONE")


asyncio.run(main())
