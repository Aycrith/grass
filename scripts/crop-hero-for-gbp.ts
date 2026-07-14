/**
 * crop-hero-for-gbp.ts
 *
 * Generates Google Business Profile (GBP) photo assets from the WP49 v2
 * hero master scene. Output sizes match Google's GBP spec:
 *   - cover photo:    1024 × 576  (16:9, min recommended for cover)
 *   - profile photo:   720 × 720  (1:1, used as GBP profile thumbnail)
 *   - small logo:      250 × 250  (1:1, used for "logo" GBP field)
 *
 * Source files:
 *   - apps/web/public/hero/desktop.webp   2400×1200 v2 master (ranch house)
 *   - apps/web/public/logo-mark.svg        100×100 viewBox grass-mark SVG
 *
 * Outputs land in drafts/gbp/assets/ (NOT in apps/web/public/ — these are
 * steward-upload artifacts for Cameron to manually upload to GBP, not
 * web app assets). Re-run any time the hero master is regenerated.
 *
 * Usage:
 *   bun run scripts/crop-hero-for-gbp.ts
 */

import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HERO_DESKTOP = resolve(REPO_ROOT, 'apps/web/public/hero/desktop.webp');
const LOGO_MARK_SVG = resolve(REPO_ROOT, 'apps/web/public/logo-mark.svg');
const OUT_DIR = resolve(REPO_ROOT, 'drafts/gbp/assets');

interface CropSpec {
  name: string;
  out: string;
  width: number;
  height: number;
  source: 'hero' | 'logo';
}

const SPECS: CropSpec[] = [
  {
    name: 'cover photo (16:9)',
    out: 'gbp-cover-1024x576.webp',
    width: 1024,
    height: 576,
    source: 'hero',
  },
  {
    name: 'profile photo (1:1)',
    out: 'gbp-profile-720x720.webp',
    width: 720,
    height: 720,
    source: 'hero',
  },
  {
    name: 'small logo (1:1)',
    out: 'gbp-logo-250x250.webp',
    width: 250,
    height: 250,
    source: 'logo',
  },
];

async function cropHero(spec: CropSpec): Promise<{ bytes: number; ms: number }> {
  const t0 = performance.now();
  const meta = await sharp(HERO_DESKTOP).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Could not read ${HERO_DESKTOP}`);
  }

  // Compute source crop box. sharp.extract() is in source pixels, top-left origin.
  // For 16:9 cover from 2:1 master: trim sides to (height * 16/9) wide.
  // For 1:1 profile from 2:1 master: take the centered square of side=height.
  const targetAspect = spec.width / spec.height;
  const sourceAspect = meta.width / meta.height;
  let cropW: number;
  let cropH: number;
  if (sourceAspect > targetAspect) {
    // source is wider than target → keep source height, narrow sides
    // (e.g. 2400x1200 2:1 source → 16:9 cover at 2134x1200)
    cropH = meta.height;
    cropW = Math.round(meta.height * targetAspect);
  } else if (sourceAspect < targetAspect) {
    // source is narrower than target → keep source width, crop top/bottom
    // (e.g. portrait source → 1:1 square at sourceWidth x sourceWidth)
    cropW = meta.width;
    cropH = Math.round(meta.width / targetAspect);
  } else {
    // aspects match → no crop
    cropW = meta.width;
    cropH = meta.height;
  }
  const left = Math.round((meta.width - cropW) / 2);
  const top = Math.round((meta.height - cropH) / 2);

  const out = await sharp(HERO_DESKTOP)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(spec.width, spec.height, { fit: 'fill' })
    .webp({ quality: 85, effort: 5 })
    .toBuffer();

  const outPath = resolve(OUT_DIR, spec.out);
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(out).toFile(outPath);
  const fs = await import('node:fs/promises');
  const stat = await fs.stat(outPath);
  return { bytes: stat.size, ms: Math.round(performance.now() - t0) };
}

async function cropLogo(spec: CropSpec): Promise<{ bytes: number; ms: number }> {
  const t0 = performance.now();
  const out = await sharp(LOGO_MARK_SVG)
    .resize(spec.width, spec.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, effort: 5 })
    .toBuffer();

  const outPath = resolve(OUT_DIR, spec.out);
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(out).toFile(outPath);
  const fs = await import('node:fs/promises');
  const stat = await fs.stat(outPath);
  return { bytes: stat.size, ms: Math.round(performance.now() - t0) };
}

async function main(): Promise<void> {
  console.log(`[crop-hero-for-gbp] reading hero from: ${HERO_DESKTOP}`);
  console.log(`[crop-hero-for-gbp] writing outputs to: ${OUT_DIR}`);
  await mkdir(OUT_DIR, { recursive: true });

  for (const spec of SPECS) {
    const result = spec.source === 'hero' ? await cropHero(spec) : await cropLogo(spec);
    const kb = (result.bytes / 1024).toFixed(1);
    console.log(`  ✓ ${spec.name.padEnd(20)} → ${spec.out}  (${kb} KB, ${result.ms} ms)`);
  }

  console.log(`\n[crop-hero-for-gbp] done. ${SPECS.length} assets ready for GBP upload.`);
  console.log('Next step: Cameron uploads these to GBP via business.google.com.');
  console.log('Cover → "Add cover photo"   Profile → "Add profile photo"   Logo → "Add logo"');
}

main().catch((err) => {
  console.error('[crop-hero-for-gbp] FAILED:', err);
  process.exit(1);
});
