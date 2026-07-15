/**
 * make-quote-mark-v3-webp.ts
 * Take the canonical quote-mark v3 candidate (cream background) and
 * emit transparent-background webp files at the sizes used across the site.
 *
 * FinalCTABanner uses 56x45 in the closing mark. Larger sizes are
 * available for future use (preview page hero, GBP assets).
 *
 * Cream background (#FAF6F0 ± 30) is keyed to alpha=0 so the mark
 * can sit on cream, dark, or any other surface.
 */
import sharp from "sharp";
import * as path from "node:path";
import * as fs from "node:fs";

const SRC = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/largo-lawn/grass-v3-img2img/candidate_1_quote_mark_v3_img2img_00007_.png";
const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/web/public/illustrations";

const SIZES = [56, 120, 240, 480];
const CREAM_R = 0xfa;
const CREAM_G = 0xf6;
const CREAM_B = 0xf0;
const TOL = 30;

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
  // 1) The source 1024x1024 has the painted content in the top ~25%
  //    of the image (the two quote marks sit upper-half). Crop the
  //    painted region explicitly: top 0-30% of the image.
  const meta = await sharp(srcBuffer).metadata();
  const contentHeight = Math.floor(meta.height * 0.30);
  const cropped = await sharp(srcBuffer)
    .extract({ left: 0, top: 0, width: meta.width, height: contentHeight })
    .toBuffer();

  // 2) Trim the cropped region to content bounds
  const trimmed = await sharp(cropped)
    .trim({
      background: { r: CREAM_R, g: CREAM_G, b: CREAM_B },
      threshold: 10,
    })
    .toBuffer();

  // 3) Resize to target size, preserve aspect ratio (the mark is wider
  //    than tall because the paired glyphs are side-by-side)
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

  // 4) Key cream-ish pixels to alpha 0
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isCream(r, g, b)) {
      data[i + 3] = 0;
    }
  }

  // 5) Encode as webp
  await sharp(data, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(outPath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const srcBuffer = fs.readFileSync(SRC);

  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `quote-mark-v3-${size}.webp`);
    await keyCreamToTransparent(srcBuffer, outPath, size);
    const stat = fs.statSync(outPath);
    console.log(`Wrote ${outPath} (${stat.size} bytes, ${size}px)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
