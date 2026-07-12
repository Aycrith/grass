#!/usr/bin/env bun
/**
 * check-weight.mjs
 *
 * Walks apps/web/public, fails if any webp (or jpg/png raster) exceeds
 * 300 KB. Designed to be called from CI on every PR.
 *
 * Usage:
 *   bun scripts/check-weight.mjs [--max-kb 300] [--root apps/web/public]
 *
 * Exit codes:
 *   0 — all rasters within budget, OR no rasters present yet (transition state)
 *   1 — one or more rasters over budget (printed to stderr)
 *   2 — usage / IO error
 *
 * Note: during the WP0-WP3 transition (ComfyUI not yet generating), apps/web/public
 * is still all-SVG. The script exits 0 with a "no rasters yet" message in that case
 * so CI doesn't fail PRs in flight. Once WP3 lands (19 webps), the script becomes a
 * hard weight budget guard.
 */

import { readdir, stat } from "node:fs/promises";
import { resolve, join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");

const RASTER_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);
const MAX_KB_DEFAULT = 300;

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      args[arg.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const maxKb = Number.parseInt(args["max-kb"] ?? String(MAX_KB_DEFAULT), 10);
  const root = resolve(ROOT, args.root ?? "apps/web/public");
  const maxBytes = maxKb * 1024;

  const offenders = [];
  let scanned = 0;

  for await (const file of walk(root)) {
    const ext = extname(file).toLowerCase();
    if (!RASTER_EXTS.has(ext)) continue;
    scanned++;
    const s = await stat(file);
    if (s.size > maxBytes) {
      offenders.push({
        rel: relative(ROOT, file).replace(/\\/g, "/"),
        kb: Math.round(s.size / 1024),
      });
    }
  }

  if (scanned === 0) {
    console.log(`✓ No raster assets under ${root} yet (transition state — WP3 not landed)`);
    process.exit(0);
  }

  if (offenders.length > 0) {
    console.error(`✗ ${offenders.length} raster(s) over ${maxKb} KB:`);
    for (const o of offenders) {
      console.error(`  ${o.rel}: ${o.kb} KB`);
    }
    process.exit(1);
  }

  console.log(`✓ ${scanned} raster(s) under ${maxKb} KB`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
