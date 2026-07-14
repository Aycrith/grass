#!/usr/bin/env node
/**
 * finalize-hero-v2.mjs — convert the v2 keepers to WebP and derive
 * the desktop crop from the master.
 *
 * Reads:
 *   apps/comfyui/outputs/largo-lawn/hero-v2/master_keeper.png   (2400×1500)
 *   apps/comfyui/outputs/largo-lawn/hero-v2/mobile_keeper.png   (1200×1500)
 *   apps/comfyui/outputs/largo-lawn/hero-v2/layers/palm_keeper_rgba.png (1200×896)
 *
 * Writes:
 *   apps/web/public/hero/desktop.webp   2400×1200 crop (top 200px, h 1200px)
 *   apps/web/public/hero/mobile.webp    1200×1500 (no crop)
 *   apps/web/public/hero/layers/palm.webp  1200×896 (already RGBA)
 */

import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const repoRoot = 'C:/Users/camer/DEVNEW/GRASS';
const heroDir = resolve(repoRoot, 'apps/web/public/hero');
const layersDir = resolve(heroDir, 'layers');
await mkdir(heroDir, { recursive: true });
await mkdir(layersDir, { recursive: true });

// Desktop: center horizontal crop, discard top 200px and bottom 100px.
// Per v2 brief §6.2: keep the lawn in the bottom 2/3 of the frame.
const masterSrc = resolve(repoRoot, 'apps/comfyui/outputs/largo-lawn/hero-v2/master_keeper.png');
const desktopDst = resolve(heroDir, 'desktop.webp');
await sharp(masterSrc)
  .extract({ left: 0, top: 200, width: 2400, height: 1200 })
  .webp({ quality: 82 })
  .toFile(desktopDst);
console.log(`desktop: 2400×1200 webp → ${desktopDst}`);

// Mobile: no crop, just convert.
const mobileSrc = resolve(repoRoot, 'apps/comfyui/outputs/largo-lawn/hero-v2/mobile_keeper.png');
const mobileDst = resolve(heroDir, 'mobile.webp');
await sharp(mobileSrc).webp({ quality: 82 }).toFile(mobileDst);
console.log(`mobile: 1200×1500 webp → ${mobileDst}`);

// Palm layer: already RGBA, just convert.
const palmSrc = resolve(
  repoRoot,
  'apps/comfyui/outputs/largo-lawn/hero-v2/layers/palm_keeper_rgba.png',
);
const palmDst = resolve(layersDir, 'palm.webp');
await sharp(palmSrc).webp({ quality: 85, lossless: false }).toFile(palmDst);
console.log(`palm: 1200×896 webp (RGBA preserved) → ${palmDst}`);

console.log('done');
