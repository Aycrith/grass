import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const out = resolve('apps/web/audit/d-0057-specimen-plate/specimens');
mkdirSync(out, { recursive: true });

const specimens = [
  { name: 'st-augustine', label: 'St. Augustinegrass' },
  { name: 'bermuda', label: 'Bermudagrass' },
  { name: 'zoysia', label: 'Zoysiagrass' },
  { name: 'bahia', label: 'Bahiagrass' },
];

const html = specimens.map(s => `
  <div style="display: inline-block; margin: 16px; padding: 16px; background: #fff;">
    <div style="font-family: sans-serif; font-size: 14px; color: #333; margin-bottom: 8px;">${s.label}</div>
    <div style="width: 340px; height: 340px; border: 1px solid #ccc;">${readFileSync(resolve(`apps/web/src/assets/specimens/${s.name}.svg`), 'utf-8')}</div>
  </div>
`).join('');

const page = `<!doctype html>
<html><head><meta charset="utf-8">
<style>body{margin:0;padding:32px;background:#fff;font-family:sans-serif;}</style>
</head><body>${html}</body></html>`;

writeFileSync(resolve(out, '_preview.html'), page);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto('file://' + resolve(out, '_preview.html'), { waitUntil: 'networkidle' });
await p.waitForTimeout(300);
await p.screenshot({ path: resolve(out, 'all-specimens.png'), fullPage: true });

// Also render each individually
for (const s of specimens) {
  const singlePage = `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fff;">
<div style="width:340px;height:340px;">${readFileSync(resolve(`apps/web/src/assets/specimens/${s.name}.svg`), 'utf-8')}</div>
</body></html>`;
  writeFileSync(resolve(out, `${s.name}-preview.html`), singlePage);
  const pp = await b.newPage({ viewport: { width: 340, height: 340 } });
  await pp.goto('file://' + resolve(out, `${s.name}-preview.html`), { waitUntil: 'networkidle' });
  await pp.waitForTimeout(150);
  await pp.screenshot({ path: resolve(out, `${s.name}.png`) });
  await pp.close();
  console.log(`rendered ${s.name}.png`);
}

await b.close();
console.log('done');
