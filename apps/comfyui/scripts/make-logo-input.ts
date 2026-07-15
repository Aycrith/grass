/**
 * make-logo-input.ts
 * Generate a 1024x1024 input PNG for the logo mark v3 img2img workflow.
 *
 * The existing apps/web/public/logo-mark.svg has a center blade path that is
 * mathematically zero-width (M 50 78 Q 50 25 50 8 — all x-coords = 50). When
 * rasterized to 1024x1024, the center blade becomes a single pixel wide, which
 * the img2img model treats as noise and erases.
 *
 * This script generates a new 1024x1024 cream-background PNG that depicts the
 * three-blade mark with ACTUAL visible widths — three filled teardrop shapes
 * + a horizontal base line — in the brand primary green #1F4E2C.
 *
 * The output goes to apps/comfyui/outputs/grass-input/logo-mark-input-rgb.png
 * (overwriting the previous near-empty input).
 */
import sharp from "sharp";
import * as path from "node:path";
import * as fs from "node:fs";

const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/grass-input";
const OUT_PATH = path.join(OUT_DIR, "logo-mark-input-rgb.png");

const SIZE = 1024;
const BRAND_GREEN = "#1F4E2C";
const CREAM = "#FAF6F0";

/**
 * Build an SVG that draws three visible blade shapes + a base line.
 * Geometry mirrors the existing logo-mark.svg but with width.
 */
const inputSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${SIZE}" height="${SIZE}">
  <rect width="100" height="100" fill="${CREAM}"/>
  <g fill="${BRAND_GREEN}">
    <!-- Center blade: tall, narrow vertical leaf, max width 5 -->
    <path d="M 50 78
             C 48 60 47 40 47 12
             C 50 10 50 10 53 12
             C 53 40 52 60 50 78 Z" />
    <!-- Left blade: curves from base center-left outward to upper-left tip -->
    <path d="M 38 78
             C 33 60 26 40 19 14
             C 22 18 30 30 38 50
             C 40 60 41 70 41 78 Z" />
    <!-- Right blade: mirror of left -->
    <path d="M 62 78
             C 67 60 74 40 81 14
             C 78 18 70 30 62 50
             C 60 60 59 70 59 78 Z" />
    <!-- Base / soil line -->
    <rect x="12" y="76" width="76" height="4" rx="2" />
  </g>
</svg>`;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await sharp(Buffer.from(inputSvg), { density: 300 })
    .resize(SIZE, SIZE, {
      fit: "contain",
      background: { r: 0xfa, g: 0xf6, b: 0xf0, alpha: 1 },
    })
    .flatten({ background: { r: 0xfa, g: 0xf6, b: 0xf0 } })
    .png()
    .toFile(OUT_PATH);
  const stat = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
