#!/usr/bin/env node
/**
 * generate-hero-v2-cascade.mjs
 *
 * Generate the WebP + AVIF fallback tiers for the D-0045 structural
 * cascade from the existing v2 4K hero photo.
 *
 * Usage:
 *   bun apps/comfyui/scripts/generate-hero-v2-cascade.mjs
 *
 * Outputs:
 *   apps/web/public/hero/v2/desktop.webp
 *   apps/web/public/hero/v2/desktop.avif
 *   apps/web/public/hero/v2/mobile.webp
 *   apps/web/public/hero/v2/mobile.avif
 */

import { mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');
const outDir = resolve(repoRoot, 'apps/web/public/hero/v2');
const src = resolve(outDir, 'hero-green-grass.jpg');

const variants = [
  {
    name: 'desktop',
    width: 1600,
    height: 900,
    webp: { quality: 70, effort: 4 },
    avif: { quality: 50, effort: 4, chromaSubsampling: '4:2:0' },
  },
  {
    name: 'mobile',
    width: 768,
    height: 1024,
    webp: { quality: 70, effort: 4 },
    avif: { quality: 50, effort: 4, chromaSubsampling: '4:2:0' },
  },
];

async function fileSizeKb(path) {
  const { size } = await stat(path);
  return Math.round(size / 1024);
}

const BUDGET_KB = 250; // per-variant budget for the loaded asset

async function generate() {
  await mkdir(outDir, { recursive: true });

  const sourceMeta = await sharp(src).metadata();
  console.log(`source: ${src}`);
  console.log(`source dimensions: ${sourceMeta.width}×${sourceMeta.height}`);

  for (const v of variants) {
    const resized = sharp(src)
      .rotate() // honor EXIF orientation before resize
      .resize(v.width, v.height, {
        fit: 'cover',
        withoutEnlargement: true,
        position: 'centre',
      })
      .withMetadata({}); // strip EXIF/GPS metadata and reduce bytes

    const webpPath = resolve(outDir, `${v.name}.webp`);
    await resized.clone().webp(v.webp).toFile(webpPath);

    const avifPath = resolve(outDir, `${v.name}.avif`);
    await resized.clone().avif(v.avif).toFile(avifPath);

    const webpKb = await fileSizeKb(webpPath);
    const avifKb = await fileSizeKb(avifPath);

    if (webpKb > BUDGET_KB) {
      console.warn(`⚠ ${v.name}.webp exceeds ${BUDGET_KB} KB budget: ${webpKb} KB`);
    }
    if (avifKb > BUDGET_KB) {
      console.warn(`⚠ ${v.name}.avif exceeds ${BUDGET_KB} budget: ${avifKb} KB`);
    }

    console.log(
      `${v.name}: webp ${v.width}×${v.height} @ ${webpKb} KB, avif ${v.width}×${v.height} @ ${avifKb} KB`,
    );
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
