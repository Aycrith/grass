/**
 * make-pinellas-map-input.ts
 * Generate a 1024x1024 input PNG for the Pinellas peninsula v3 img2img.
 *
 * The input has:
 *   - gulf-blue water background (matches --ll-gulf at 0.4 opacity)
 *   - solid sand-tan peninsula silhouette at the same coordinates
 *     as apps/web/src/components/sections/ServiceAreaMap.tsx PIN_LAYOUT,
 *     so the painted result lands the land mass where the ZIP pins
 *     already sit
 *   - 6 small ZIP pin dots at the pin coordinates, so the model
 *     "sees" the pins as city markers and paints them into the
 *     land (not floating in water)
 *
 * The painted result is intended to overlay the ServiceAreaMap SVG
 * peninsula path with a storybook gouache version, while keeping
 * the interactive pins + grid + labels in their exact same places.
 */
import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";

const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/grass-input";
const OUT_PATH = path.join(OUT_DIR, "pinellas-map-input-rgb.png");
const W = 800;
const H = 1000;

// Brand tokens (must match apps/web/src/styles/tokens.css)
const WATER = { r: 0x6a, g: 0x9b, b: 0xa8 }; // --ll-gulf at 0.4 alpha over palm-bark dark
const LAND = { r: 0xdd, g: 0xc9, b: 0xad }; // sand tan, ~25% darker than cream
const PIN = { r: 0x1f, g: 0x4e, b: 0x2c }; // --ll-palm-shadow

// Peninsula path (verbatim from ServiceAreaMap.tsx) — in 0..800 × 0..1000 viewBox
const PENINSULA_D = "M 380 120 Q 280 200 280 380 Q 260 540 340 700 Q 360 860 420 940 Q 480 860 460 720 Q 480 560 460 400 Q 480 240 380 120 Z";

const PINS: Array<{ zip: string; x: number; y: number }> = [
  { zip: "33756", x: 380, y: 320 },
  { zip: "33770", x: 360, y: 410 },
  { zip: "33771", x: 380, y: 510 },
  { zip: "33773", x: 420, y: 600 },
  { zip: "33774", x: 360, y: 670 },
  { zip: "33778", x: 320, y: 760 },
];

function buildSvg(): string {
  const pinElements = PINS.map(
    (p) => `<circle cx="${p.x}" cy="${p.y}" r="14" fill="rgb(${PIN.r}, ${PIN.g}, ${PIN.b})" />`,
  ).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="rgb(${WATER.r}, ${WATER.g}, ${WATER.b})"/>
  <path d="${PENINSULA_D}" fill="rgb(${LAND.r}, ${LAND.g}, ${LAND.b})" />
  ${pinElements}
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const svg = buildSvg();
  // Render at the native 800x1000 then upscale to 1024x1280 (5:4) and
  // crop to 1024x1024 by trimming water on the bottom — the model gets
  // a square input with the peninsula in the upper half.
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(1024, 1280, { fit: "fill" })
    .extract({ left: 0, top: 0, width: 1024, height: 1024 })
    .png()
    .toFile(OUT_PATH);
  const stat = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
