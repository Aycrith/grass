"""
Capture D-0028 Coverage Check screenshots (mobile viewport) for visual review.

Same CDP pattern as audit/capture-d0028.py but mobile-only (393x851)
and split into 3 short scripts so each Chrome session only has to
hold the WebSocket open for ~2-3 screenshots. Splitting avoids the
intermittent `ConnectionClosedError: no close frame received` we hit
when running all 5 states in a single connection on a slower Windows
headless instance.

Usage: capture-d0028-mobile.py <port> <url> <out-prefix>
"""

import asyncio
import base64
import json
import sys
import urllib.request


def get_targets(port: str) -> list[dict]:
    raw = urllib.request.urlopen(f"http://localhost:{port}/json", timeout=5).read()
    return json.loads(raw)


async def main() -> None:
    if len(sys.argv) < 4:
        print("usage: capture-d0028-mobile.py <port> <url> <out-prefix>")
        sys.exit(2)
    port, url, out_prefix = sys.argv[1], sys.argv[2], sys.argv[3]

    import websockets  # type: ignore

    targets = get_targets(port)
    page = next((t for t in targets if t.get("type") == "page"), None)
    if not page:
        print("NO PAGE TARGET")
        sys.exit(1)
    uri = page["webSocketDebuggerUrl"]
    print(f"connecting to {uri[:80]}...")

    async with websockets.connect(uri, max_size=20_000_000) as ws:
        msg_id = 0

        async def send(method: str, params: dict | None = None) -> dict:
            nonlocal msg_id
            msg_id += 1
            await ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                m = json.loads(await ws.recv())
                if m.get("id") == msg_id:
                    return m

        async def shoot(filename: str, beyond: bool = True) -> None:
            res = await send(
                "Page.captureScreenshot",
                {"format": "png", "captureBeyondViewport": beyond, "fromSurface": True},
            )
            with open(f"{out_prefix}-{filename}.png", "wb") as f:
                f.write(base64.b64decode(res["result"]["data"]))
            print(f"  saved {out_prefix}-{filename}.png")

        async def type_and_submit(value: str) -> None:
            """Set the coverage input's value to `value`, dispatch input event,
            then submit the form. Uses the React-friendly value setter."""
            await send(
                "Runtime.evaluate",
                {
                    "expression": (
                        "(function(){"
                        "  const input = document.querySelector('input[name=\"coverage\"]');"
                        "  if (!input) { return 'no input'; }"
                        "  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;"
                        "  setter.call(input, '" + value + "');"
                        "  input.dispatchEvent(new Event('input', { bubbles: true }));"
                        "  const form = input.closest('form');"
                        "  if (form) { form.requestSubmit(); }"
                        "  return 'submitted';"
                        "})()"
                    ),
                    "awaitPromise": False,
                },
            )

        await send("Page.enable")
        await send("Runtime.enable")

        # Headless Chrome's default viewport is 500x700 regardless of
        # --window-size. We force a real iPhone 12-class viewport
        # (393x851 @ DPR 1) so the @media (max-width: 980px) breakpoint
        # in the homepage CSS actually fires. Without this, all our
        # "mobile" captures were rendering at 500px and being treated
        # as desktop by the layout.
        await send(
            "Emulation.setDeviceMetricsOverride",
            {
                "width": 393,
                "height": 851,
                "deviceScaleFactor": 1,
                "mobile": True,
            },
        )

        # Navigate and let the page settle.
        await send("Page.navigate", {"url": url})
        await asyncio.sleep(6)

        scroll_js = (
            "Array.from(document.querySelectorAll('h2'))"
            ".find(h => h.textContent && h.textContent.includes('Six Pinellas'))"
            "?.scrollIntoView({block: 'start'})"
        )

        # ---------- IDLE state (just landed on the page) ----------
        await send("Runtime.evaluate", {"expression": scroll_js, "awaitPromise": True})
        await asyncio.sleep(2)
        await shoot("idle-section", beyond=True)

        # Full page (idle)
        await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)"})
        await asyncio.sleep(1)
        await shoot("idle-full", beyond=True)

        # ---------- HIT state ----------
        await send("Runtime.evaluate", {"expression": scroll_js, "awaitPromise": True})
        await asyncio.sleep(1)
        await type_and_submit("33771")
        await asyncio.sleep(2)
        await shoot("hit-section", beyond=True)

        # Open the "See all six areas" details and shoot the chips
        await send(
            "Runtime.evaluate",
            {
                "expression": "document.querySelector('details')?.setAttribute('open', 'open')",
                "awaitPromise": False,
            },
        )
        await asyncio.sleep(1)
        await shoot("hit-areas-open", beyond=True)

        # ---------- MISS state ----------
        await type_and_submit("99999")
        await asyncio.sleep(2)
        await shoot("miss-section", beyond=True)

        print("DONE")


asyncio.run(main())
