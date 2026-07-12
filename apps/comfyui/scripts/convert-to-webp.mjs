#!/usr/bin/env bun
/**
 * convert-to-webp.mjs
 *
 * Converts a curated PNG into the webp that ships in apps/web/public.
 *
 * Usage:
 *   bun scripts/convert-to-webp.mjs --slug <slug>
 *   bun scripts/convert-to-webp.mjs --src <png> --dst <webp> [--max-kb 300] [--quality 80]
 *
 * Slug mode (the common path): maps a known slug to src/dst automatically.
 * The "hero" slug produces two outputs (desktop + mobile crops) from one
 * curated PNG, per plan §2 locked decision (single master + 2 crops).
 *
 * Direct mode: explicit src/dst. Used for ad-hoc conversions and tests.
 *
 * Quality ladder: starts at the requested quality (default 80), drops to
 * 70 then 60 if the encoded file exceeds max-kb (default 300). If still
 * over at q=60, writes anyway and emits a stderr warning — manual review.
 */

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");
const PUBLIC_DIR = resolve(ROOT, "apps", "web", "public");

/**
 * Slug → { src, dsts, crop } map.
 *
 * dsts is an array because "hero" produces two outputs (desktop + mobile).
 * Each dst entry can carry an optional `extract` sharp operation for crops.
 */
const SLUG_MAP = {
  hero: {
    src: resolve(ROOT, "apps/comfyui/curated/hero.png"),
    dsts: [
      {
        path: resolve(PUBLIC_DIR, "hero/desktop.webp"),
        // Center horizontal crop, keep lawn in bottom 2/3 of frame.
        extract: { width: 2400, height: 1200, left: 0, top: 150 },
      },
      {
        path: resolve(PUBLIC_DIR, "hero/mobile.webp"),
        // Center vertical crop, keep house visible at the top. Source is
        // 2400×1496 from SDXL — height capped at 1496 to stay in-bounds.
        extract: { width: 1200, height: 1496, left: 600, top: 0 },
      },
    ],
  },
  "operator-portrait": {
    src: resolve(ROOT, "apps/comfyui/curated/operator-portrait.png"),
    dsts: [
      {
        path: resolve(PUBLIC_DIR, "operator/portrait.webp"),
      },
    ],
  },
  // Service slugs (6): each curated PNG already at the service's target ratio.
  "service-mowing": {
    src: resolve(ROOT, "apps/comfyui/curated/service-mowing.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "services/mowing.webp") }],
  },
  "service-edging": {
    src: resolve(ROOT, "apps/comfyui/curated/service-edging.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "services/edging.webp") }],
  },
  "service-mulching": {
    src: resolve(ROOT, "apps/comfyui/curated/service-mulching.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "services/mulching.webp") }],
  },
  "service-hedge-trimming": {
    src: resolve(ROOT, "apps/comfyui/curated/service-hedge-trimming.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "services/hedge-trimming.webp") }],
  },
  "service-hurricane-prep": {
    src: resolve(ROOT, "apps/comfyui/curated/service-hurricane-prep.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "services/hurricane-prep.webp") }],
  },
  "service-seasonal-cleanup": {
    src: resolve(ROOT, "apps/comfyui/curated/service-seasonal-cleanup.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "services/seasonal-cleanup.webp") }],
  },
  // Area slugs (6 ZIPs).
  "area-33771": {
    src: resolve(ROOT, "apps/comfyui/curated/area-33771.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "areas/33771.webp") }],
  },
  "area-33770": {
    src: resolve(ROOT, "apps/comfyui/curated/area-33770.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "areas/33770.webp") }],
  },
  "area-33778": {
    src: resolve(ROOT, "apps/comfyui/curated/area-33778.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "areas/33778.webp") }],
  },
  "area-33773": {
    src: resolve(ROOT, "apps/comfyui/curated/area-33773.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "areas/33773.webp") }],
  },
  "area-33774": {
    src: resolve(ROOT, "apps/comfyui/curated/area-33774.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "areas/33774.webp") }],
  },
  "area-33756": {
    src: resolve(ROOT, "apps/comfyui/curated/area-33756.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "areas/33756.webp") }],
  },
  // Equipment slugs (4 tools).
  "equipment-mower": {
    src: resolve(ROOT, "apps/comfyui/curated/equipment-mower.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "equipment/mower.webp") }],
  },
  "equipment-trimmer": {
    src: resolve(ROOT, "apps/comfyui/curated/equipment-trimmer.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "equipment/trimmer.webp") }],
  },
  "equipment-blower": {
    src: resolve(ROOT, "apps/comfyui/curated/equipment-blower.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "equipment/blower.webp") }],
  },
  "equipment-edger": {
    src: resolve(ROOT, "apps/comfyui/curated/equipment-edger.png"),
    dsts: [{ path: resolve(PUBLIC_DIR, "equipment/edger.webp") }],
  },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const val = argv[i + 1];
      args[key] = val;
      i++;
    }
  }
  return args;
}

async function ensureDirFor(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function convertOne(inputBuf, dst, quality, maxKb) {
  let pipeline = sharp(inputBuf);

  if (dst.extract) {
    pipeline = pipeline.extract(dst.extract);
  }

  let buf;
  let usedQuality = quality;
  const qualities = [quality, 70, 60].filter((q, i, arr) => arr.indexOf(q) === i);

  for (const q of qualities) {
    buf = await pipeline.clone().webp({ quality: q }).toBuffer();
    if (buf.byteLength <= maxKb * 1024) {
      usedQuality = q;
      break;
    }
    usedQuality = q;
  }

  await ensureDirFor(dst.path);
  await writeFile(dst.path, buf);

  const finalSize = (await stat(dst.path)).size;
  const finalKb = Math.round(finalSize / 1024);
  const relPath = dst.path.replace(ROOT + "\\", "").replace(/\\/g, "/");

  if (finalKb > maxKb) {
    console.warn(
      `⚠ ${relPath}: ${finalKb} KB (over ${maxKb} KB budget at q=${usedQuality}); manual review required`,
    );
    return { ok: false, kb: finalKb, quality: usedQuality };
  }

  console.log(`✓ ${relPath}: ${finalKb} KB @ q=${usedQuality}`);
  return { ok: true, kb: finalKb, quality: usedQuality };
}

async function main() {
  const args = parseArgs(process.argv);
  const maxKb = Number.parseInt(args["max-kb"] ?? "300", 10);
  const quality = Number.parseInt(args.quality ?? "80", 10);

  let srcBuf;
  let dsts;

  if (args.slug) {
    const entry = SLUG_MAP[args.slug];
    if (!entry) {
      console.error(`Unknown --slug "${args.slug}". Known slugs:`);
      console.error(`  ${Object.keys(SLUG_MAP).join(", ")}`);
      process.exit(2);
    }
    srcBuf = await readFile(entry.src);
    dsts = entry.dsts;
  } else if (args.src && args.dst) {
    srcBuf = await readFile(resolve(args.src));
    dsts = [{ path: resolve(args.dst) }];
  } else {
    console.error("Usage: --slug <slug>  OR  --src <png> --dst <webp>");
    console.error("Optional: --quality 80  --max-kb 300");
    process.exit(2);
  }

  const results = [];
  for (const dst of dsts) {
    results.push(await convertOne(srcBuf, dst, quality, maxKb));
  }

  const anyFail = results.some((r) => !r.ok);
  process.exit(anyFail ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
