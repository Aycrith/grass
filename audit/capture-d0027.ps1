# Capture the ServiceAreaMap section + the whole page for D-0027 review
$ErrorActionPreference = 'Continue'
$outDir = 'C:\Users\camer\DEVNEW\GRASS\audit'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$port = 9334

# Launch Chrome headless with no URL — use CDP to navigate.
# The "Multiple targets are not supported in headless mode" error
# happens when Chrome thinks there are multiple target tabs.
$chrome = Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' `
  -ArgumentList @(
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--disable-features=Translate',
    '--no-first-run',
    '--remote-debugging-port=' + $port,
    '--window-size=1440,900'
  ) -PassThru -RedirectStandardOutput "$outDir\chrome-stdout.log" -RedirectStandardError "$outDir\chrome-stderr.log"

Start-Sleep -Seconds 5

try {
    $targets = Invoke-RestMethod "http://localhost:$port/json" -TimeoutSec 5
    $pageWs = ($targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1).webSocketDebuggerUrl
    if (-not $pageWs) { Write-Output "no page target"; exit 1 }
} catch {
    Write-Output "chrome json error: $_"
    exit 1
}

# Use a Python helper via websockets
$py = @'
import json, asyncio, sys
import websockets

async def main():
    uri = sys.argv[1]
    url = sys.argv[2]
    out_prefix = sys.argv[3]
    async with websockets.connect(uri, max_size=20_000_000) as ws:
        msg_id = 0
        async def send(method, params=None):
            nonlocal msg_id
            msg_id += 1
            await ws.send(json.dumps({"id": msg_id, "method": method, "params": params or {}}))
            while True:
                m = json.loads(await ws.recv())
                if m.get('id') == msg_id:
                    return m

        # Enable page events
        await send('Page.enable')
        await send('Runtime.enable')

        # Navigate to URL and wait for load
        await send('Page.navigate', {'url': url})
        await asyncio.sleep(5)

        # Scroll the ServiceAreaMap section into view (find by heading text)
        await send('Runtime.evaluate', {'expression': "Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Six ZIPs'))?.scrollIntoView({block: 'center'})", 'awaitPromise': True})
        await asyncio.sleep(1.5)

        # Screenshot 1: section (captureBeyondViewport, but with scrollIntoView, the section is in viewport)
        # Use viewport-only screenshot at a tall window so we get section + rail + map
        res = await send('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': True, 'fromSurface': True})
        import base64
        with open(out_prefix + '-section.png', 'wb') as f:
            f.write(base64.b64decode(res['result']['data']))
        print(out_prefix + '-section.png saved')

        # Scroll to top for full-page capture
        await send('Runtime.evaluate', {'expression': 'window.scrollTo(0, 0)'})
        await asyncio.sleep(1.5)
        res = await send('Page.captureScreenshot', {'format': 'png', 'captureBeyondViewport': True, 'fromSurface': True})
        with open(out_prefix + '-full.png', 'wb') as f:
            f.write(base64.b64decode(res['result']['data']))
        print(out_prefix + '-full.png saved')

asyncio.run(main())
'@

$pyFile = "$outDir\capture-d0027.py"
Set-Content -Path $pyFile -Value $py -Encoding utf8

$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
& 'C:\Program Files\Python313\python.exe' $pyFile $pageWs 'http://localhost:3000' 'C:\Users\camer\DEVNEW\GRASS\audit\d0027'

Stop-Process -Id $chrome.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
