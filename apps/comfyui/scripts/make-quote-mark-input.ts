/**
 * make-quote-mark-input.ts
 * Generate a 1024×1024 input PNG for the quote-mark v3 img2img workflow.
 *
 * Rasterizes the existing apps/web/public/illustrations/quote-mark.svg
 * to a flat 1024×1024 PNG on a cream background so the SDXL model has a
 * clean target to paint over. The SVG is paired quote glyphs in
 * sun-gold #E8B65A, which is what the v3 should preserve.
 */
import sharp from "sharp";
import * as path from "node:path";
import * as fs from "node:fs";

const SRC = "C:/Users/camer/DEVNEW/GRASS/apps/web/public/illustrations/quote-mark.svg";
const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/grass-input";
const OUT_PATH = path.join(OUT_DIR, "quote-mark-input-rgb.png");

const SIZE = 1024;
const CREAM = { r: 0xfa, g: 0xf6, b: 0xf0 };

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // The existing quote-mark.svg viewBox is 0 0 200 160, with two glyphs
  // roughly 56×42. Rasterize at density 600 (high enough that the thin
  // strokes survive into the SDXL input) and center on the cream square.
  const srcBuf = fs.readFileSync(SRC);
  await sharp(srcBuf, { density: 600 })
    .resize(SIZE, SIZE, {
      fit: "contain",
      background: { ...CREAM, alpha: 1 },
    })
    .flatten({ background: { ...CREAM, alpha: 1 } })
    .png()
    .toFile(OUT_PATH);

  const stat = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
