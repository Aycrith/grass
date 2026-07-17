// Capture browser console errors via Chrome DevTools Protocol (CDP).
// Uses raw WebSocket + manual protocol messages (no extra deps).
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  // Launch chrome with remote debugging
  const chromeProc = spawn(
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--remote-debugging-port=9333',
      '--user-data-dir=C:\\Users\\camer\\AppData\\Local\\Temp\\chrome-cdp-d0025',
    ],
    { stdio: 'pipe' }
  );

  // Wait for chrome to be ready
  await new Promise(r => setTimeout(r, 2500));

  // Get the WebSocket URL
  const targets = await getJson('http://localhost:9333/json/list');
  const target = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = target.webSocketDebuggerUrl;
  console.log('WS:', wsUrl);

  const WebSocket = require('ws');
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const errors = [];
  const logs = [];

  await new Promise((resolve) => ws.on('open', resolve));

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const myId = ++id;
      const msg = JSON.stringify({ id: myId, method, params });
      ws.on('message', function onMsg(data) {
        const m = JSON.parse(data);
        if (m.id === myId) {
          ws.off('message', onMsg);
          resolve(m);
        }
      });
      ws.send(msg);
    });
  }

  ws.on('message', (data) => {
    const m = JSON.parse(data);
    if (m.method === 'Runtime.consoleAPICalled') {
      const text = m.params.args.map(a => a.value || a.description).join(' ');
      logs.push(`[${m.params.type}] ${text}`);
    } else if (m.method === 'Runtime.exceptionThrown') {
      errors.push(JSON.stringify(m.params.exceptionDetails, null, 2));
    } else if (m.method === 'Log.entryAdded') {
      const e = m.params.entry;
      if (e.level === 'error' || e.level === 'warning') {
        logs.push(`[${e.level}] ${e.text}`);
      }
    }
  });

  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  // Wait for page to fully load + run scripts
  await new Promise(r => setTimeout(r, 8000));

  console.log('\n=== console messages ===');
  for (const l of logs) console.log(l);
  console.log('\n=== exceptions ===');
  for (const e of errors) console.log(e);
  if (errors.length === 0) console.log('(none)');

  ws.close();
  chromeProc.kill();
}

main().catch(e => { console.error('error:', e); process.exit(1); });
