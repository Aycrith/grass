#!/usr/bin/env node
/**
 * preview-layer.mjs — composite an RGBA layer over a colored checker
 * background so we can visually verify the chroma key result.
 *
 * Usage:
 *   node apps/comfyui/scripts/preview-layer.mjs <layer.png> <preview.png> [bg-hex]
 */

import { resolve } from 'node:path';
import sharp from 'sharp';

const [, , layerPath, previewPath, bgHex = '#1f4e2c'] = process.argv;
if (!layerPath || !previewPath) {
  console.error('usage: node preview-layer.mjs <layer.png> <preview.png> [bg-hex]');
  process.exit(1);
}

const layer = await sharp(resolve(layerPath)).png().toBuffer();
const meta = await sharp(resolve(layerPath)).metadata();
const w = meta.width;
const h = meta.height;
const tile = 40;

// Build a 2-color checker SVG using the brand palm-shadow + palm-light tokens.
const c1 = bgHex;
const c2 = '#2d5a3d';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <pattern id="checker" x="0" y="0" width="${tile * 2}" height="${tile * 2}" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="${tile}" height="${tile}" fill="${c1}"/>
      <rect x="${tile}" y="0" width="${tile}" height="${tile}" fill="${c2}"/>
      <rect x="0" y="${tile}" width="${tile}" height="${tile}" fill="${c2}"/>
      <rect x="${tile}" y="${tile}" width="${tile}" height="${tile}" fill="${c1}"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#checker)"/>
</svg>`;
const bg = await sharp(Buffer.from(svg)).png().toBuffer();

await sharp(bg)
  .composite([{ input: layer, top: 0, left: 0 }])
  .png({ quality: 90 })
  .toFile(resolve(previewPath));

console.log(`preview: ${resolve(previewPath)} (${w}x${h} over checker ${c1}/${c2})`);
