#!/usr/bin/env pwsh
# D-0030 Visual system hygiene pass full-page capture.
# Usage: audit/capture-d0030.ps1 [desktop|mobile]
#
# Writes: audit/d0030-{viewport}-after-fullpage.png
$ErrorActionPreference = 'Continue'
$outDir = 'C:\Users\camer\DEVNEW\GRASS\audit'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$viewport = if ($args.Count -gt 0) { $args[0] } else { 'desktop' }
$windowSize = if ($viewport -eq 'mobile') { '393,851' } else { '1280,800' }
$port = 9570 + (Get-Date -Format 'ss')
$url  = 'http://localhost:3000'

Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$chrome = Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' `
  -ArgumentList @(
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--disable-features=Translate', '--no-first-run',
    '--force-device-scale-factor=1',
    '--remote-debugging-address=127.0.0.1',
    "--remote-debugging-port=$port",
    "--window-size=$windowSize"
  ) -PassThru `
  -RedirectStandardOutput "$outDir\chrome-d0030-out.log" `
  -RedirectStandardError  "$outDir\chrome-d0030-err.log"

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

$pyScript = Join-Path $outDir 'capture-d0030.py'
$prefix   = "d0030-$viewport-after"
$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
& 'C:\Program Files\Python313\python.exe' $pyScript $port $url (Join-Path $outDir $prefix)
$pyExit = $LASTEXITCODE

Stop-Process -Id $chrome.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

if ($pyExit -ne 0) {
    Write-Warning "Python capture exited with $pyExit"
    exit $pyExit
}

Write-Host "=== Captured files ==="
Get-ChildItem -Path $outDir -Filter "d0030-$viewport-after-*.png" | Sort-Object Name | ForEach-Object {
    Write-Host ("  {0}  ({1:N0} bytes)" -f $_.Name, $_.Length)
}
