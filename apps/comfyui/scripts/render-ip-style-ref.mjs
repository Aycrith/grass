#!/usr/bin/env bun
/**
 * render-ip-style-ref.mjs
 *
 * Renders apps/web/public/hero/desktop.svg at 2× display size into
 * apps/comfyui/control/ip-style-ref.png. This PNG is the IP-Adapter
 * style anchor — every one of the 19 SDXL generations references it
 * at weight 0.5 (per apps/comfyui/control/README.md).
 *
 * Why hero/desktop.svg:
 *   It's the most-curated SVG composition in the library (already anchored
 *   to the --ll-* palette, compositionally correct, no anti-patterns). The
 *   IP-Adapter transfers STYLE (palette + lighting + grain), not content,
 *   so feeding it the existing brand composition is the strongest possible
 *   cross-page consistency lock.
 *
 * Run once, after WP0 (ComfyUI server up) but before the first generation:
 *   bun apps/comfyui/scripts/render-ip-style-ref.mjs
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");

const SVG_PATH = resolve(ROOT, "apps/web/public/hero/desktop.svg");
const OUT_PATH = resolve(ROOT, "apps/comfyui/control/ip-style-ref.png");

// 2× display size. Hero desktop displays at 2400×1200 → ref is 4800×2400.
// Sharp upscales by integer factor with reasonable default filter.
const SCALE = 2;

async function main() {
  let svg = await readFile(SVG_PATH, "utf8");
  // Sharp uses libxml, which strictly forbids `--` inside XML comments
  // (per the XML spec). hero/desktop.svg has comments like
  // "<!-- low-contrast so it doesn't dominate -->" — strip them all before
  // rasterizing. The IP-Adapter style anchor cares about pixels, not markup.
  svg = svg.replace(/<!--[\s\S]*?-->/g, "");

  const buf = await sharp(Buffer.from(svg))
    .resize({
      width: 2400 * SCALE,
      height: 1200 * SCALE,
      fit: "fill",
    })
    .png()
    .toBuffer();

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, buf);

  const sizeKb = Math.round(buf.byteLength / 1024);
  console.log(`✓ ${OUT_PATH} (${sizeKb} KB, 4800×2400)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
