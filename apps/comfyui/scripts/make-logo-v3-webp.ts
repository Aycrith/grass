/**
 * make-logo-v3-webp.ts
 * Take the canonical logo v3 candidate (cream background) and emit
 * transparent-background webp files at the 5 sizes used across the site.
 *
 * Sizes:
 *  - 32   — favicon (browser tab @ 1x, hi-dpi @ 2x)
 *  - 64   — SiteHeader @ 32px display via 2x DPR
 *  - 128  — Brand preview page hero
 *  - 256  — OG image small variant, GBP profile photo low-DPR
 *  - 1024 — OG image / GBP cover high-res fallback
 *
 * Cream background (#FAF6F0 ± 10 in each channel) is keyed to alpha=0
 * so the mark can sit on cream, white, or any other surface.
 */
import sharp from "sharp";
import * as path from "node:path";
import * as fs from "node:fs";

const SRC = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/largo-lawn/grass-v3-img2img/candidate_1_logo_mark_v3_img2img_00007_.png";
const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/web/public/illustrations";

const SIZES = [32, 64, 128, 256, 1024];
const CREAM_R = 0xfa;
const CREAM_G = 0xf6;
const CREAM_B = 0xf0;
const TOL = 30; // generous — picks up paint splatter beyond the mark silhouette

function isCream(r: number, g: number, b: number): boolean {
  return (
    Math.abs(r - CREAM_R) <= TOL &&
    Math.abs(g - CREAM_G) <= TOL &&
    Math.abs(b - CREAM_B) <= TOL
  );
}

async function keyCreamToTransparent(
  srcBuffer: Buffer,
  outPath: string,
  size: number,
): Promise<void> {
  // 1) Trim to content bounds
  const trimmed = await sharp(srcBuffer)
    .trim({
      background: { r: CREAM_R, g: CREAM_G, b: CREAM_B },
      threshold: 12,
    })
    .toBuffer();

  // 2) Resize to target size, keep as RGBA so we can mutate alpha
  const resized = await sharp(trimmed)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resized;
  const { width, height, channels } = info;

  // 3) Key cream-ish pixels to alpha 0
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isCream(r, g, b)) {
      data[i + 3] = 0;
    }
  }

  // 4) Encode as webp
  await sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(outPath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const srcBuffer = fs.readFileSync(SRC);

  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `logo-mark-v3-${size}.webp`);
    await keyCreamToTransparent(srcBuffer, outPath, size);
    const stat = fs.statSync(outPath);
    console.log(`Wrote ${outPath} (${stat.size} bytes, ${size}x${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
