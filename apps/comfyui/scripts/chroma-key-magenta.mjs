#!/usr/bin/env node
/**
 * chroma-key-magenta.mjs — selective HSV-based chroma key for the v2 hero layers.
 *
 * The v2 layer workflow generates each subject on a magenta background so
 * the alpha channel can be extracted in post. The storybook LoRA is strong
 * enough that the model also paints a soft warm-sky gradient — that gradient
 * is valuable for the layered composition (it gives the palm layer a built-in
 * "sun behind" feel) so we keep it.
 *
 * HSV-based key strategy (more robust than RGB):
 *   - Hue in magenta range (290-340°), saturation >= 0.30 → transparent.
 *   - The lower the saturation, the more we keep the pixel (soft pink
 *     gradient stays partially opaque as a backdrop).
 *   - The sun (yellow, hue 40-60°) is never in the magenta range and stays
 *     fully opaque.
 *   - The palm greens (hue 80-140°) are never in the magenta range and stay
 *     fully opaque.
 *
 * Usage:
 *   node apps/comfyui/scripts/chroma-key-magenta.mjs <input.png> <output.png>
 */

import { resolve } from 'node:path';
import sharp from 'sharp';

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error('usage: node chroma-key-magenta.mjs <input.png> <output.png>');
  process.exit(1);
}

const inAbs = resolve(inputPath);
const outAbs = resolve(outputPath);

const { data, info } = await sharp(inAbs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(data.length);

function rgbToHsv(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return [h, s, v];
}

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const [h, s, v] = rgbToHsv(r, g, b);

  // Aggressive magenta/pink key.
  // Magenta hue range: 280-355° in HSV (covers hot pink, fuchsia, dusty pink).
  // Red-leaning-pink (350-360 and 0-15°) also keyed with high saturation.
  let alpha = 1;
  if ((h >= 280 && h <= 355 && s >= 0.1) || ((h >= 350 || h <= 15) && s >= 0.4 && v >= 0.4)) {
    // Inside the magenta/pink range. Higher saturation = more transparent.
    // s=0.10 → keep most opacity (soft pink gradient).
    // s=0.30 → mostly transparent.
    // s>=0.50 → fully transparent.
    let threshold = 0.1;
    let range = 0.3;
    if (h >= 350 || h <= 15) {
      threshold = 0.4;
      range = 0.2;
    }
    const satFactor = Math.max(0, Math.min(1, (s - threshold) / range));
    alpha = 1 - satFactor;
  }

  out[i] = r;
  out[i + 1] = g;
  out[i + 2] = b;
  out[i + 3] = Math.round(alpha * 255);
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 6 })
  .toFile(outAbs);

console.log(`chroma-keyed: ${inAbs} -> ${outAbs} (${width}x${height}, RGBA)`);
