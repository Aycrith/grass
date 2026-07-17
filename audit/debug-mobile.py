import asyncio, base64, json, urllib.request, websockets

def get():
    return json.loads(urllib.request.urlopen("http://localhost:9400/json", timeout=5).read())

async def main():
    t = get()
    page = next(x for x in t if x.get('type') == 'page')
    print("page target:", page['webSocketDebuggerUrl'][:80])
    async with websockets.connect(page['webSocketDebuggerUrl'], max_size=20_000_000) as ws:
        async def send(m, p=None):
            await ws.send(json.dumps({'id': 1, 'method': m, 'params': p or {}}))
            while True:
                r = json.loads(await ws.recv())
                if r.get('id') == 1: return r
        # Get viewport size first
        layout = await send('Page.getLayoutMetrics')
        print("layout:", {k: v for k, v in layout.get('result', {}).items() if k != 'cssLayoutViewport'})
        css = layout.get('result', {}).get('cssLayoutViewport', {})
        print(f"cssLayoutViewport: w={css.get('clientWidth')} h={css.get('clientHeight')}")
        # Emulate mobile device
        await send('Emulation.setDeviceMetricsOverride', {'width': 393, 'height': 851, 'deviceScaleFactor': 1, 'mobile': True})
        await send('Page.navigate', {'url': 'http://localhost:3000'})
        await asyncio.sleep(5)
        layout = await send('Page.getLayoutMetrics')
        css = layout.get('result', {}).get('cssLayoutViewport', {})
        print(f"after emulation cssLayoutViewport: w={css.get('clientWidth')} h={css.get('clientHeight')}")
        r = await send('Page.captureScreenshot', {'format':'png','captureBeyondViewport':True,'fromSurface':True})
        with open(r'C:\Users\camer\DEVNEW\GRASS\audit\debug-mobile.png', 'wb') as f:
            f.write(base64.b64decode(r['result']['data']))
        print("saved debug-mobile.png")

asyncio.run(main())
