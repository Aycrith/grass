// Lightweight HTTP-only Wave 4 verification
// Skips Playwright (Chromium hangs). Probes SSR HTML + asset serving.
import { request } from 'undici';

const BASE = process.env.BASE || 'http://localhost:3002';

async function main() {
  const html = (await request(BASE)).body;
  let body = '';
  for await (const chunk of html) body += chunk;

  // Probe DOM serialization
  const summary = {
    secondSceneMatches: (body.match(/hero-second-scene/g) || []).length,
    gouacheFrameAssets: [...new Set(body.match(/url\(\/hero\/layers\/v2\/gouache-\d+\.webp\)/g) || [])].sort(),
    layerAttrs: ['secondScene', 'gouacheStage', 'gouacheFrame', 'secondSceneContent', 'secondSceneEyebrow', 'secondSceneHeadline', 'secondSceneSubhead', 'secondSceneActions'],
    layerClassMatches: {},
    chapter2ContentMatches: (body.match(/Same yard, every week\./g) || []).length,
    commitmentSubheadMatches: (body.match(/No swap, no franchise markup/g) || []).length,
    chapter2EyebrowMatches: (body.match(/CHAPTER 2 — THE COMMITMENT/g) || []).length,
  };
  for (const cls of summary.layerAttrs) {
    summary.layerClassMatches[cls] = (body.match(new RegExp(`"${cls}"`, 'g')) || []).length;
  }

  // Probe each gouache asset
  const assets = [...new Set([
    ...body.matchAll(/url\(\/hero\/layers\/v2\/gouache-\d+\.webp\)/g),
  ].map((m) => m[0].slice(4, -1)))];
  const assetResults = [];
  for (const url of assets) {
    const r = await request(BASE + url);
    assetResults.push({ url, status: r.statusCode, headers: { 'content-type': r.headers['content-type'], 'content-length': r.headers['content-length'] } });
    for await (const _ of r.body) { void _; }
  }

  // Probe scene 1 content still in DOM (storybook headline)
  const scene1Survives = {
    neighborLawnmower: (body.match(/Your neighbor's lawnmower\./g) || []).length,
    operatorNote: (body.match(/CHAPTER 1 — THE MOW/g) || []).length,
  };

  console.log(JSON.stringify({ summary, assetResults, scene1Survives }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });