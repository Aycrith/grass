"""Capture browser console errors via Chrome DevTools Protocol (CDP).

Launches headless Chrome with --remote-debugging-port, connects via
WebSocket, captures Runtime.consoleAPICalled + Runtime.exceptionThrown
+ Log.entryAdded events while loading the page, and prints a summary.
"""
import asyncio
import json
import os
import subprocess
import sys
import time
import urllib.request

import websockets


CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
DEBUG_PORT = 9333
TARGET_URL = "http://localhost:3000"
SETTLE_SECONDS = 8


def http_get_json(url, timeout=5):
    with urllib.request.urlopen(url, timeout=timeout) as r:
        return json.loads(r.read())


def launch_chrome():
    user_data = r"C:\Users\camer\AppData\Local\Temp\chrome-cdp-d0025"
    os.makedirs(user_data, exist_ok=True)
    args = [
        CHROME,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        f"--remote-debugging-port={DEBUG_PORT}",
        f"--user-data-dir={user_data}",
        "--no-first-run",
    ]
    return subprocess.Popen(
        args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )


def wait_for_devtools(max_seconds=10):
    end = time.time() + max_seconds
    while time.time() < end:
        try:
            targets = http_get_json(
                f"http://localhost:{DEBUG_PORT}/json/list", timeout=2
            )
            for t in targets:
                if t.get("type") == "page":
                    return t
        except Exception:
            pass
        time.sleep(0.3)
    raise RuntimeError("Chrome devtools did not come up in time")


async def capture(url):
    proc = launch_chrome()
    try:
        target = wait_for_devtools()
        ws_url = target["webSocketDebuggerUrl"]
        errors = []
        console_logs = []
        async with websockets.connect(ws_url, max_size=10_000_000) as ws:
            # A single reader task owns ws.recv() and pushes events
            # into a queue. The send() calls run on the main task.
            queue = asyncio.Queue()

            async def reader():
                try:
                    async for raw in ws:
                        try:
                            queue.put_nowait(json.loads(raw))
                        except Exception:
                            pass
                except Exception:
                    pass

            reader_task = asyncio.create_task(reader())
            # Wait for the reader to attach
            await asyncio.sleep(0.2)

            msg_id = [0]

            async def send(method, params=None):
                msg_id[0] += 1
                my_id = msg_id[0]
                await ws.send(json.dumps({"id": my_id, "method": method, "params": params or {}}))
                # Drain events until we get our id back
                while True:
                    raw = await asyncio.wait_for(queue.get(), timeout=30)
                    m = raw
                    if m.get("id") == my_id:
                        return m
                    # Else it's an event — log it
                    _dispatch_event(m, errors, console_logs)

            # Enable domains
            await send("Runtime.enable")
            await send("Log.enable")
            await send("Page.enable")
            await send("Network.enable")
            # Drain any pending events
            await asyncio.sleep(0.1)
            while not queue.empty():
                try:
                    _dispatch_event(queue.get_nowait(), errors, console_logs)
                except asyncio.QueueEmpty:
                    break

            # Navigate
            await send("Page.navigate", {"url": url})
            # Wait for page to settle
            await asyncio.sleep(SETTLE_SECONDS)
            # Drain final events
            while not queue.empty():
                try:
                    _dispatch_event(queue.get_nowait(), errors, console_logs)
                except asyncio.QueueEmpty:
                    break

            reader_task.cancel()
        return errors, console_logs
    finally:
        try:
            proc.terminate()
            proc.wait(timeout=3)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass


def _dispatch_event(m, errors, console_logs):
    if m.get("method") == "Runtime.consoleAPICalled":
        p = m["params"]
        text = " ".join(
            a.get("value") or a.get("description") or ""
            for a in p.get("args", [])
        )
        console_logs.append((p.get("type"), text))
    elif m.get("method") == "Runtime.exceptionThrown":
        p = m["params"]
        ed = p.get("exceptionDetails", {})
        errors.append({
            "text": ed.get("text", ""),
            "exception": ed.get("exception", {}).get("description", ""),
            "url": ed.get("url", ""),
            "line": ed.get("lineNumber", -1),
            "col": ed.get("columnNumber", -1),
        })
    elif m.get("method") == "Log.entryAdded":
        p = m["params"]
        e = p.get("entry", {})
        console_logs.append((e.get("level"), e.get("text", "")))
    elif m.get("method") == "Network.responseReceived":
        p = m["params"]
        resp = p.get("response", {})
        if resp.get("status", 200) >= 400:
            console_logs.append(("net-error", f"{resp.get('status')} {resp.get('url')}"))


async def _listen(ws, errors, console_logs):
    try:
        async for raw in ws:
            try:
                m = json.loads(raw)
            except Exception:
                continue
            if m.get("method") == "Runtime.consoleAPICalled":
                p = m["params"]
                text = " ".join(
                    a.get("value") or a.get("description") or ""
                    for a in p.get("args", [])
                )
                console_logs.append((p.get("type"), text))
            elif m.get("method") == "Runtime.exceptionThrown":
                p = m["params"]
                ed = p.get("exceptionDetails", {})
                errors.append({
                    "text": ed.get("text", ""),
                    "exception": ed.get("exception", {}).get("description", ""),
                    "url": ed.get("url", ""),
                    "line": ed.get("lineNumber", -1),
                    "col": ed.get("columnNumber", -1),
                })
            elif m.get("method") == "Log.entryAdded":
                p = m["params"]
                e = p.get("entry", {})
                console_logs.append((e.get("level"), e.get("text", "")))
            elif m.get("method") == "Network.responseReceived":
                p = m["params"]
                resp = p.get("response", {})
                if resp.get("status", 200) >= 400:
                    console_logs.append(("net-error", f"{resp.get('status')} {resp.get('url')}"))
    except asyncio.CancelledError:
        pass
    except Exception as e:
        console_logs.append(("listener-error", repr(e)))


def main():
    errors, logs = asyncio.run(capture(TARGET_URL))
    print("\n=== exceptions (uncaught JS errors) ===")
    if not errors:
        print("(none)")
    for e in errors:
        print(json.dumps(e, indent=2))
    print("\n=== console (warn/error only) ===")
    relevant = [
        (t, m) for (t, m) in logs
        if t in ("error", "warning", "net-error", "listener-error")
    ]
    if not relevant:
        print("(none)")
    for t, m in relevant:
        print(f"[{t}] {m}")
    print(f"\n=== total console events: {len(logs)} ===")
    for t, m in logs:
        if t not in ("error", "warning", "net-error", "listener-error"):
            pass  # skip info/log
    if len(logs) > 0:
        # Print first 20 of all logs for context
        print("\n=== first 20 console events (all types) ===")
        for t, m in logs[:20]:
            print(f"[{t}] {m[:200]}")


if __name__ == "__main__":
    main()
