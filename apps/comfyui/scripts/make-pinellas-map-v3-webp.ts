/**
 * make-pinellas-map-v3-webp.ts
 * Take the canonical Pinellas map v3 candidate and emit a
 * transparent-background webp at the size the SVG needs.
 *
 * Source: 1024×1024 PNG (SDXL model output).
 * Output: 800×1000 webp (matches the ServiceAreaMap SVG viewBox).
 *
 * The painted image is a watercolor of the entire 1024×1024 canvas
 * (water + land + 6 small green markers). We keep the water
 * background as-is and just resize to the SVG viewBox so the
 * painted markers land at the right positions relative to the
 * SVG pins (which sit at the same 800×1000 viewBox coordinates
 * as the original input).
 */
import sharp from "sharp";
import * as path from "node:path";
import * as fs from "node:fs";

const SRC = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/largo-lawn/grass-v3-img2img/candidate_1_pinellas_map_v3_img2img_00002_.png";
const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/web/public/illustrations";
const OUT_PATH = path.join(OUT_DIR, "pinellas-map-v3-800x1000.webp");

const OUT_W = 800;
const OUT_H = 1000;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // The source 1024×1024 was generated from an 800×1000 input that was
  // upscaled to 1024×1280 then cropped to 1024×1024 (the bottom
  // 256px of the original peninsula was cut). To get back to an
  // 800×1000 image that matches the SVG viewBox we:
  //   1. Resize the 1024×1024 source to 800×1000 directly, then
  //      extend downward with water to 800×1250 (the original 4:5
  //      ratio the input was cropped from)
  //   2. Crop back to 800×1000
  //   3. Save as webp
  const srcBuf = fs.readFileSync(SRC);
  const water = { r: 0x6a, g: 0x9b, b: 0xa8 };

  // First pass: resize the source to 800×1000 (preserves the
  // peninsula position as the model painted it)
  const resized = await sharp(srcBuf)
    .resize(OUT_W, OUT_H, { fit: "fill" })
    .toBuffer();

  // Second pass: extend downward with water by 250px (to recover
  // the bottom of the original 4:5 ratio) and crop back
  const out = await sharp({
    create: {
      width: OUT_W,
      height: OUT_H + 250,
      channels: 3,
      background: water,
    },
  })
    .composite([{ input: resized, top: 0, left: 0 }])
    .extract({ left: 0, top: 0, width: OUT_W, height: OUT_H })
    .webp({ quality: 90 })
    .toFile(OUT_PATH);
  const stat = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${stat.size} bytes, ${OUT_W}x${OUT_H})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
