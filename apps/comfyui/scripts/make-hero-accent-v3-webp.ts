/**
 * make-hero-accent-v3-webp.ts
 * Convert D-0014 hero h1 accent v3 candidate PNG → multi-size webp
 * with cream background removed (binary chroma-key) and trimmed to bbox.
 *
 * Source: apps/comfyui/outputs/largo-lawn/grass-v3-img2img/candidate_1_hero_accent_v3_img2img_00003_.png
 * Outputs: apps/web/public/illustrations/hero-accent-v3-{720,1440}.webp
 */
import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";

const SRC = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/largo-lawn/grass-v3-img2img/candidate_1_hero_accent_v3_img2img_00003_.png";
const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/web/public/illustrations";
const OUT_BASENAME = "hero-accent-v3";

const CREAM = { r: 0xfa, g: 0xf6, b: 0xf0 };
const TOLERANCE = 20;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const meta = await sharp(SRC).metadata();
  console.log(`Source: ${path.basename(SRC)} — ${meta.width}x${meta.height}`);

  const { data, info } = await sharp(SRC)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;

  const rgba = Buffer.alloc(w * h * 4);
  let bbox = { minX: w, minY: h, maxX: -1, maxY: -1 };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const dist = Math.abs(r - CREAM.r) + Math.abs(g - CREAM.g) + Math.abs(b - CREAM.b);
      const opaque = dist > TOLERANCE;
      const dstI = (y * w + x) * 4;
      rgba[dstI] = r;
      rgba[dstI + 1] = g;
      rgba[dstI + 2] = b;
      rgba[dstI + 3] = opaque ? 255 : 0;
      if (opaque) {
        if (x < bbox.minX) bbox.minX = x;
        if (x > bbox.maxX) bbox.maxX = x;
        if (y < bbox.minY) bbox.minY = y;
        if (y > bbox.maxY) bbox.maxY = y;
      }
    }
  }

  if (bbox.maxX < 0) {
    throw new Error("No opaque pixels found — chroma key too aggressive");
  }

  const margin = 4;
  const cropLeft = Math.max(0, bbox.minX - margin);
  const cropTop = Math.max(0, bbox.minY - margin);
  const cropW = Math.min(w - cropLeft, bbox.maxX - bbox.minX + 1 + margin * 2);
  const cropH = Math.min(h - cropTop, bbox.maxY - bbox.minY + 1 + margin * 2);
  console.log(`Opaque bbox: ${bbox.minX}..${bbox.maxX} × ${bbox.minY}..${bbox.maxY}`);
  console.log(`Crop: left=${cropLeft} top=${cropTop} w=${cropW} h=${cropH}`);

  const cropped = await sharp(rgba, {
    raw: { width: w, height: h, channels: 4 },
  })
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    .png()
    .toBuffer();

  for (const targetW of [720, 1440]) {
    const targetH = Math.max(40, Math.round((cropH / cropW) * targetW));
    const outPath = path.join(OUT_DIR, `${OUT_BASENAME}-${targetW}.webp`);
    await sharp(cropped)
      .resize(targetW, targetH)
      .webp({ quality: 88, alphaQuality: 100, effort: 6 })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`  -> ${outPath} (${stat.size} bytes, ${targetW}x${targetH})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
