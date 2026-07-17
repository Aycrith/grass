import asyncio, json, urllib.request, websockets

async def main():
    t = json.loads(urllib.request.urlopen("http://localhost:9400/json", timeout=5).read())
    page = next(x for x in t if x.get("type") == "page")
    print("page target:", page["webSocketDebuggerUrl"][:80])
    async with websockets.connect(page["webSocketDebuggerUrl"], max_size=20_000_000) as ws:
        async def send(m, p=None):
            await ws.send(json.dumps({"id": 1, "method": m, "params": p or {}}))
            while True:
                r = json.loads(await ws.recv())
                if r.get("id") == 1: return r

        async def check(url, label):
            await send("Page.navigate", {"url": url})
            await asyncio.sleep(5)
            r = await send("Runtime.evaluate", {
                "expression": "Array.from(document.querySelectorAll('select')).map(s => s.value)",
                "returnByValue": True,
            })
            print(f"{label}: {r['result']['result']['value']}")

        await check("http://localhost:3000/quote", "default")
        await check("http://localhost:3000/quote?zip=33771", "?zip=33771 (in service area)")
        await check("http://localhost:3000/quote?zip=33778", "?zip=33778 (in service area, not home)")
        await check("http://localhost:3000/quote?zip=99999", "?zip=99999 (out of area)")
        await check("http://localhost:3000/quote?zip=3377", "?zip=3377 (4 digits)")

asyncio.run(main())
