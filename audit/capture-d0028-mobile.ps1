# Capture the D-0028 Coverage Check section in 3 states (idle / hit / miss)
# on the MOBILE viewport (393x851). Saves to audit/d0028-mobile-*.png.
#
# D-0028: split from the desktop capture because Chrome's WebSocket on
# the slower mobile-window headless instance intermittently dies after
# 3-4 screenshots. Keeping the mobile script in its own .ps1 lets each
# invocation be a single short session.
$ErrorActionPreference = 'Continue'
$outDir = 'C:\Users\camer\DEVNEW\GRASS\audit'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$port = 9336
$url  = 'http://localhost:3000'
$windowSize = '393,851'
$prefix     = "C:\Users\camer\DEVNEW\GRASS\audit\d0028-mobile"

# Kill any leftover Chrome instances from a previous run.
Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Launch Chrome headless on its own debug port.
$chrome = Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' `
  -ArgumentList @(
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--disable-features=Translate',
    '--no-first-run',
    '--force-device-scale-factor=1',
    "--remote-debugging-port=$port",
    "--window-size=$windowSize"
  ) -PassThru `
  -RedirectStandardOutput "$outDir\chrome-d0028-mobile-stdout.log" `
  -RedirectStandardError  "$outDir\chrome-d0028-mobile-stderr.log"

Start-Sleep -Seconds 10

# Chrome's debug port can take a few extra seconds to bind on slower
# Windows instances. Retry up to 3 times before giving up.
$pageWs = $null
for ($i = 0; $i -lt 3; $i++) {
    try {
        $targets = Invoke-RestMethod "http://localhost:$port/json" -TimeoutSec 5
        $pageWs = ($targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1).webSocketDebuggerUrl
        if ($pageWs) { break }
    } catch {
        Start-Sleep -Seconds 3
    }
}
if (-not $pageWs) {
    Write-Output "chrome json endpoint did not come up on port $port"
    Stop-Process -Id $chrome.Id -Force -ErrorAction SilentlyContinue
    Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    exit 1
}

$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
& 'C:\Program Files\Python313\python.exe' 'C:\Users\camer\DEVNEW\GRASS\audit\capture-d0028-mobile.py' $port $url $prefix

Stop-Process -Id $chrome.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# List what we captured
Write-Host "=== Captured files ==="
Get-ChildItem -Path $outDir -Filter "d0028-mobile-*.png" | Sort-Object Name | ForEach-Object { Write-Host ("  {0}  ({1:N0} bytes)" -f $_.Name, $_.Length) }
