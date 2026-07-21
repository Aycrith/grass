import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { chromium } from 'playwright';

const svg = readFileSync('apps/web/audit/d-0058-pocket-map/pocket-map-v1.svg', 'utf-8');

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<style>body{margin:0;padding:24px;background:#fff;display:flex;justify-content:center;}</style>
</head><body>${svg}</body></html>`;

writeFileSync('apps/web/audit/d-0058-pocket-map/preview.html', html);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 800, height: 1100 } });
await p.goto('file://' + resolve('apps/web/audit/d-0058-pocket-map/preview.html'), { waitUntil: 'networkidle' });
await p.waitForTimeout(300);
await p.screenshot({ path: 'apps/web/audit/d-0058-pocket-map/pocket-map-v1.png', fullPage: true });
await b.close();
console.log('rendered');
