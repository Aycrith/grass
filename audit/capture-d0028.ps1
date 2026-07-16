#!/usr/bin/env pwsh
# D-0028 Coverage Check capture — combined launcher + CDP driver.
# Usage: audit/capture-d0028.ps1 [desktop|mobile]
#
# Runs in one PowerShell process so Chrome lifecycle is reliable.
# Writes: audit/d0028-{viewport}-{state}.png
$ErrorActionPreference = 'Continue'
$outDir = 'C:\Users\camer\DEVNEW\GRASS\audit'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$viewport = if ($args.Count -gt 0) { $args[0] } else { 'desktop' }
$windowSize = if ($viewport -eq 'mobile') { '393,851' } else { '1440,900' }
# Pick a fresh port per run to avoid stale-Chrome / half-closed
# WebSocket connections from previous captures.
$port = 9360 + (Get-Date -Format 'ss')
$url  = 'http://localhost:3000'

# Kill any lingering chrome
Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Launch Chrome. The `--remote-debugging-address=127.0.0.1` flag
# forces the HTTP/WS endpoint onto IPv4 only; without it modern
# Chrome binds the loopback to ::1 (IPv6) and `Invoke-RestMethod
# http://localhost:PORT/json` returns "actively refused" on
# systems where the IPv4 mapping is unavailable.
$chrome = Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' `
  -ArgumentList @(
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--disable-features=Translate', '--no-first-run',
    '--force-device-scale-factor=1',
    '--remote-debugging-address=127.0.0.1',
    "--remote-debugging-port=$port",
    "--window-size=$windowSize"
  ) -PassThru `
  -RedirectStandardOutput "$outDir\chrome-d0028-out.log" `
  -RedirectStandardError  "$outDir\chrome-d0028-err.log"

# Poll the CDP endpoint until Chrome is ready (max 30s)
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 2
    try {
        $targets = Invoke-RestMethod "http://127.0.0.1:$port/json" -TimeoutSec 3
        if ($targets | Where-Object { $_.type -eq 'page' }) {
            $ready = $true
            break
        }
    } catch {
        Write-Host "  waiting on Chrome CDP ($($i+1)/15)..."
    }
}
if (-not $ready) {
    Write-Error "Chrome never came up on port $port"
    Stop-Process -Id $chrome.Id -Force -ErrorAction SilentlyContinue
    exit 1
}
Write-Host "Chrome ready on port $port"

# Run the Python CDP driver
$pyScript = Join-Path $outDir 'capture-d0028.py'
$prefix   = "d0028-$viewport"
$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
& 'C:\Program Files\Python313\python.exe' $pyScript $port $url (Join-Path $outDir $prefix)
$pyExit = $LASTEXITCODE

# Cleanup Chrome
Stop-Process -Id $chrome.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

if ($pyExit -ne 0) {
    Write-Warning "Python capture exited with $pyExit"
    exit $pyExit
}

Write-Host "=== Captured files ==="
Get-ChildItem -Path $outDir -Filter "d0028-$viewport-*.png" | Sort-Object Name | ForEach-Object {
    Write-Host ("  {0}  ({1:N0} bytes)" -f $_.Name, $_.Length)
}
