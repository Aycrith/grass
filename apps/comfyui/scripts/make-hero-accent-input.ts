/**
 * make-hero-accent-input.ts
 * Generate a 1024x128 input PNG for the D-0014 hero h1 painted
 * brushstroke accent.
 *
 * The input has:
 *   - cream background (#FAF6F0)
 *   - a hand-painted wavy brushstroke in sun-gold (#E8B65A)
 *     occupying ~60% of the width (shorter than the section
 *     divider — the h1 accent is decorative, not a horizontal
 *     rule)
 *   - a small clay-painted grass tuft / sun-burst at the left
 *     edge as a brand mark (signals "this is a storybook accent")
 *
 * Painted result is intended to sit directly below the hero h1
 * ("Your neighbor's / lawn mower.") as a hand-painted underline.
 * Width is ~400-500px on desktop to match the visual weight of
 * the h1 — narrower than the column width so it reads as an
 * accent, not a rule.
 */
import sharp from "sharp";
import * as fs from "node:fs";
import * as path from "node:path";

const OUT_DIR = "C:/Users/camer/DEVNEW/GRASS/apps/comfyui/outputs/grass-input";
const OUT_PATH = path.join(OUT_DIR, "hero-accent-input-rgb.png");
const W = 1024;
const H = 128;

const CREAM = { r: 0xfa, g: 0xf6, b: 0xf0 };
const SUN = { r: 0xe8, g: 0xb6, b: 0x5a };
const CLAY = { r: 0xc6, g: 0x6b, b: 0x3a };

function buildSvg(): string {
  const yMid = H / 2;
  // Brushstroke occupies 20% to 80% of width (60% of total)
  const xStart = W * 0.10;
  const xEnd = W * 0.80;
  const span = xEnd - xStart;
  // Two humps (one up, one down) for a more dynamic shape
  const amp = 18;
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= 8; i++) {
    const x = xStart + (i * span) / 8;
    const phase = (i / 8) * Math.PI * 2;
    const y = yMid + Math.sin(phase) * amp;
    points.push([x, y]);
  }
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="rgb(${CREAM.r}, ${CREAM.g}, ${CREAM.b})"/>
  <path d="${path}" stroke="rgb(${SUN.r}, ${SUN.g}, ${SUN.b})" stroke-width="8" stroke-linecap="round" fill="none" />
  <!-- Left-edge sun-burst brand mark: 5 short rays + center dot -->
  <g transform="translate(${W * 0.05}, ${yMid})">
    <line x1="0" y1="0" x2="-22" y2="0" stroke="rgb(${CLAY.r}, ${CLAY.g}, ${CLAY.b})" stroke-width="3" stroke-linecap="round" />
    <line x1="0" y1="0" x2="-16" y2="-13" stroke="rgb(${CLAY.r}, ${CLAY.g}, ${CLAY.b})" stroke-width="3" stroke-linecap="round" />
    <line x1="0" y1="0" x2="-16" y2="13" stroke="rgb(${CLAY.r}, ${CLAY.g}, ${CLAY.b})" stroke-width="3" stroke-linecap="round" />
    <circle cx="-3" cy="0" r="6" fill="rgb(${SUN.r}, ${SUN.g}, ${SUN.b})" />
  </g>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const svg = buildSvg();
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
