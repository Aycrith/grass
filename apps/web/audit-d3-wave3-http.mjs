// Lightweight HTTP-only Wave 3 verification
// Skips Playwright (Chromium hangs). Probes SSR HTML + asset serving.
import { request } from 'undici';

const BASE = 'http://localhost:3001';

async function main() {
  const html = (await request(BASE)).body;
  let body = '';
  for await (const chunk of html) body += chunk;

  // Probe DOM serialization
  const summary = {
    fernLayerMatches: (body.match(/hero-fern-layer/g) || []).length,
    songbirdsLayerMatches: (body.match(/hero-songbirds-layer/g) || []).length,
    fernAssets: [...new Set(body.match(/url\(\/hero\/layers\/v2\/fern-\d+\.webp\)/g) || [])].sort(),
    songbirdsAssets: [...new Set(body.match(/url\(\/hero\/layers\/v2\/songbirds-\d+\.webp\)/g) || [])].sort(),
    layerAttrs: ['fernWrap', 'songbirdsWrap', 'fernInner', 'songbirdsInner'],
    layerClassMatches: {},
  };
  for (const cls of summary.layerAttrs) {
    summary.layerClassMatches[cls] = (body.match(new RegExp(`"${cls}"`, 'g')) || []).length;
  }

  // Probe each asset
  const assets = [...new Set([
    ...body.matchAll(/url\(\/hero\/layers\/v2\/(?:fern|songbirds)-\d+\.webp\)/g),
  ].map((m) => m[0].slice(4, -1)))];
  const assetResults = [];
  for (const url of assets.slice(0, 4)) {
    const r = await request(BASE + url);
    assetResults.push({ url, status: r.statusCode, headers: { 'content-type': r.headers['content-type'], 'content-length': r.headers['content-length'] } });
    for await (const _ of r.body) { void _; }
  }

  console.log(JSON.stringify({ summary, assetResults }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
