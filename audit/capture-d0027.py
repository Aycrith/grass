import json, asyncio, sys, base64
import websockets

async def main():
    port = sys.argv[1]
    url = sys.argv[2]
    out_prefix = sys.argv[3]
    # Find the page target
    import urllib.request
    targets = json.loads(urllib.request.urlopen(f'http://localhost:{port}/json').read())
    page = next((t for t in targets if t.get('type') == 'page'), None)
    if not page:
        print('NO PAGE TARGET'); return
    uri = page['webSocketDebuggerUrl']
    print(f'connecting to {uri[:80]}...')
    async with websockets.connect(uri, max_size=20_000_000) as ws:
        msg_id = 0
        async def send(method, params=None, await_evt=None):
            nonlocal msg_id
            msg_id += 1
            await ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                m = json.loads(await ws.recv())
                if m.get('id') == msg_id:
                    return m
        async def send_recv_events(method, params=None):
            """Send a method that returns event data, not just an ack."""
            nonlocal msg_id
            msg_id += 1
            await ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                m = json.loads(await ws.recv())
                if m.get('id') == msg_id:
                    return m

        await send('Page.enable')
        await send('Runtime.enable')
        # Navigate
        await send('Page.navigate', {'url': url})
        # wait for load event
        await asyncio.sleep(6)

        # Scroll to the ServiceAreaMap section (find by heading text)
        await send('Runtime.evaluate', {
            'expression': "Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.includes('Six ZIPs'))?.scrollIntoView({block: 'start'})",
            'awaitPromise': True
        })
        await asyncio.sleep(2)

        # Screenshot 1: section (top-down layout, map + rail visible)
        res = await send('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': True, 'fromSurface': True})
        with open(out_prefix + '-section.png', 'wb') as f:
            f.write(base64.b64decode(res['result']['data']))
        print(f'{out_prefix}-section.png saved')

        # Screenshot 2: zoom on just the rail (cards row)
        await send('Runtime.evaluate', {
            'expression': "document.querySelector('nav[aria-label=\"Service area ZIP codes\"]')?.scrollIntoView({block: 'center'})",
            'awaitPromise': True
        })
        await asyncio.sleep(1.5)
        res = await send('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': False, 'fromSurface': True})
        with open(out_prefix + '-rail.png', 'wb') as f:
            f.write(base64.b64decode(res['result']['data']))
        print(f'{out_prefix}-rail.png saved')

        # Full page
        await send('Runtime.evaluate', {'expression': 'window.scrollTo(0, 0)'})
        await asyncio.sleep(1)
        res = await send('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': True, 'fromSurface': True})
        with open(out_prefix + '-full.png', 'wb') as f:
            f.write(base64.b64decode(res['result']['data']))
        print(f'{out_prefix}-full.png saved')

asyncio.run(main())
