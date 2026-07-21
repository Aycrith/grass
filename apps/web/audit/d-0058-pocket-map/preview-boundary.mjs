import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { chromium } from 'playwright';

const path = readFileSync('apps/web/audit/d-0058-pocket-map/pinellas-boundary-path.txt', 'utf-8').trim();

const svg = `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fff;">
<svg width="700" height="1000" viewBox="0 0 700 1000" style="background:#f8f4ec;">
  <path d="${path}" fill="rgba(180,200,160,0.5)" stroke="#3a5a3a" stroke-width="1.5" />
  <text x="350" y="500" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#3a5a3a">Pinellas boundary (from OSM)</text>
</svg>
</body></html>`;

writeFileSync('apps/web/audit/d-0058-pocket-map/boundary-preview.html', svg);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 700, height: 1000 } });
await p.goto('file://' + resolve('apps/web/audit/d-0058-pocket-map/boundary-preview.html'), { waitUntil: 'networkidle' });
await p.waitForTimeout(300);
await p.screenshot({ path: 'apps/web/audit/d-0058-pocket-map/boundary-preview.png', fullPage: true });
await b.close();
console.log('rendered');

