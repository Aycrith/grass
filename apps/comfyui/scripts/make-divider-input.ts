/**
 * make-divider-input.ts
 * Generate a 1024x128 input PNG for the D-0013 painted section divider.
 *
 * The input has:
 *   - cream background (#FAF6F0)
 *   - a single hand-drawn wavy horizontal line in sun-gold (#E8B65A)
 *     centered vertically, occupying ~80% of the width
 *   - a small grass-tuft dot in the center of the line as a brand mark
 *
 * The painted result is intended to sit between major sections of the
 * homepage as a "chapter break" — visible on every scroll transition
 * from one light-background section to the next.
 */
import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";

const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/grass-input";
const OUT_PATH = path.join(OUT_DIR, "divider-input-rgb.png");
const W = 1024;
const H = 128;

// Brand tokens (must match apps/web/src/styles/tokens.css)
const CREAM = { r: 0xfa, g: 0xf6, b: 0xf0 }; // --ll-sand-bleached
const SUN = { r: 0xe8, g: 0xb6, b: 0x5a }; // --ll-sun
const CLAY = { r: 0xc6, g: 0x6b, b: 0x3a }; // --ll-clay (for grass tuft center)

function buildSvg(): string {
  // 80% width, centered. Sinusoidal wave with 3 humps.
  const yMid = H / 2;
  const xStart = W * 0.10;
  const xEnd = W * 0.90;
  const amp = 14; // wave amplitude in px (subtle)
  // Build the wave as a single SVG path with cubic bezier control points
  // for smooth sinusoid (approx via 3 segments).
  const span = xEnd - xStart;
  const seg = span / 3;
  // Endpoints and control points for 3 bezier segments approximating a sine.
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= 6; i++) {
    const x = xStart + (i * span) / 6;
    const phase = (i / 6) * Math.PI * 3; // 1.5 full cycles
    const y = yMid + Math.sin(phase) * amp;
    points.push([x, y]);
  }
  // Build a path with Q (quadratic) for simplicity
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="rgb(${CREAM.r}, ${CREAM.g}, ${CREAM.b})"/>
  <path d="${path}" stroke="rgb(${SUN.r}, ${SUN.g}, ${SUN.b})" stroke-width="6" stroke-linecap="round" fill="none" />
  <!-- Center grass-tuft mark (3 small vertical strokes) -->
  <g transform="translate(${W / 2}, ${yMid - 4})">
    <line x1="0" y1="0" x2="0" y2="12" stroke="rgb(${SUN.r}, ${SUN.g}, ${SUN.b})" stroke-width="3" stroke-linecap="round" />
    <line x1="-8" y1="2" x2="-8" y2="14" stroke="rgb(${SUN.r}, ${SUN.g}, ${SUN.b})" stroke-width="3" stroke-linecap="round" />
    <line x1="8" y1="2" x2="8" y2="14" stroke="rgb(${SUN.r}, ${SUN.g}, ${SUN.b})" stroke-width="3" stroke-linecap="round" />
    <circle cx="0" cy="-2" r="3" fill="rgb(${CLAY.r}, ${CLAY.g}, ${CLAY.b})" />
  </g>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const svg = buildSvg();
  // Render at native resolution — input stays 1024x128 for SDXL to fill.
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(W, H, { fit: "fill" })
    .png()
    .toFile(OUT_PATH);
  const stat = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
