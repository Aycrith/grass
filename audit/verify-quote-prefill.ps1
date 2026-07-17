$ErrorActionPreference = 'Continue'
$port = 9400
$userData = 'C:\Users\camer\DEVNEW\GRASS\audit\chrome-quote-data'

$chrome = Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' `
  -ArgumentList @(
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--disable-features=Translate', '--no-first-run',
    '--force-device-scale-factor=1',
    "--user-data-dir=$userData",
    "--remote-debugging-port=$port",
    '--window-size=1440,900'
  ) -PassThru `
  -RedirectStandardOutput "C:\Users\camer\DEVNEW\GRASS\audit\debug-out.log" `
  -RedirectStandardError  "C:\Users\camer\DEVNEW\GRASS\audit\debug-err.log"

Start-Sleep -Seconds 8

$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
& 'C:\Program Files\Python313\python.exe' 'C:\Users\camer\DEVNEW\GRASS\audit\verify-quote-prefill.py'

Stop-Process -Id $chrome.Id -Force -ErrorAction SilentlyContinue
Get-Process -Name chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
