#!/usr/bin/env python3
"""Capture a focused screenshot of the ServiceAreaMap section by
scrolling to it via Chrome DevTools Protocol."""
import asyncio
import json
import os
import sys
import websockets
from urllib.request import urlopen

URL = "http://127.0.0.1:3001/"
OUT = r"C:\Users\camer\DEVNEW\GRASS\audit\d0026-map-zoom.png"
PORT = 9334


async def main():
    # Get the websocket URL from Chrome's debug endpoint
    target = json.loads(
        urlopen(f"http://localhost:{PORT}/json/list").read()
    )[0]
    ws_url = target["webSocketDebuggerUrl"]

    async with websockets.connect(ws_url, max_size=8 * 1024 * 1024) as ws:
        # 1. Navigate
        await ws.send(json.dumps({
            "id": 1,
            "method": "Page.enable"
        }))
        await ws.recv()
        await ws.send(json.dumps({
            "id": 2,
            "method": "Page.navigate",
            "params": {"url": URL}
        }))
        # Wait for load
        await asyncio.sleep(4)
        # Drain any pending messages
        try:
            while True:
                await asyncio.wait_for(ws.recv(), timeout=0.5)
        except asyncio.TimeoutError:
            pass

        # 2. Inject JS to scroll the map section into view
        await ws.send(json.dumps({
            "id": 10,
            "method": "Runtime.evaluate",
            "params": {
                "expression": (
                    "(() => {"
                    "  const heads = document.querySelectorAll('h2');"
                    "  for (const h of heads) {"
                    "    if (h.textContent && h.textContent.includes('Six ZIPs')) {"
                    "      h.scrollIntoView({block: 'start'});"
                    "      window.scrollBy(0, -40);"
                    "      return h.textContent;"
                    "    }"
                    "  }"
                    "  return 'not found';"
                    "})()"
                )
            }
        }))
        result = json.loads(await ws.recv())
        print(f"[capture-map] scroll target: {result.get('result', {}).get('result', {}).get('value', '???')}")

        await asyncio.sleep(1.5)

        # 3. Screenshot
        await ws.send(json.dumps({
            "id": 20,
            "method": "Page.captureScreenshot",
            "params": {
                "format": "png",
                "captureBeyondViewport": False
            }
        }))
        result = json.loads(await ws.recv())
        data_b64 = result["result"]["data"]
        import base64
        with open(OUT, "wb") as f:
            f.write(base64.b64decode(data_b64))
        size = os.path.getsize(OUT)
        print(f"[capture-map] saved {OUT} ({size} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
