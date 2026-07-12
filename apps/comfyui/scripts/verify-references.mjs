#!/usr/bin/env bun
/**
 * verify-references.mjs
 *
 * Walks apps/web/src for <Image src="..."> and <img src="..."> usages,
 * then verifies every referenced local path resolves under apps/web/public.
 *
 * Also reads apps/web/src/lib/content.ts and verifies each services.{slug}.imageSlot
 * entry resolves.
 *
 * External URLs (https://) are skipped — the next.config.mjs remotePatterns
 * allowlist (googleusercontent.com, unsplash.com) governs those.
 *
 * Usage:
 *   bun scripts/verify-references.mjs
 *
 * Exit codes:
 *   0 — all references resolve
 *   1 — one or more unresolved local references (printed to stderr)
 *   2 — usage / IO error
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..", "..");
const SRC_DIR = resolve(ROOT, "apps/web/src");
const PUBLIC_DIR = resolve(ROOT, "apps/web/public");
const CONTENT_FILE = resolve(SRC_DIR, "lib/content.ts");

const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(p);
    } else if (SCAN_EXTS.has(extname(e.name))) {
      yield p;
    }
  }
}

/**
 * Pull every quoted src="/foo" or src='/foo' literal out of a file's text.
 * Matches <Image src="...">, <img src="...">, and bare import-like strings.
 */
function extractLocalSrcs(text) {
  const out = [];
  const re = /\bsrc\s*=\s*(["'`])([^"'`]+)\1/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const val = m[2];
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) continue;
    if (val.startsWith("/")) out.push(val);
  }
  return out;
}

/**
 * Pull imageSlot / hero / mobile / desktop entries out of content.ts.
 * Treats any `imageSlot:` / `heroImage:` / `portrait:` field whose value is
 * a relative path string as a public-dir reference.
 */
function extractContentRefs(text) {
  const out = [];
  const fieldRe = /(imageSlot|heroImage|portrait|heroSrc|portraitSrc)\s*:\s*["'`]([^"'`]+)["'`]/g;
  let m;
  while ((m = fieldRe.exec(text)) !== null) {
    const val = m[2];
    if (val.startsWith("/") || val.startsWith("http") || val.startsWith("data:")) continue;
    out.push({ field: m[1], value: val });
  }
  return out;
}

async function resolveLocal(srcPath) {
  const abs = resolve(PUBLIC_DIR, srcPath.replace(/^\//, ""));
  try {
    const s = await stat(abs);
    return s.isFile();
  } catch {
    return false;
  }
}

async function main() {
  const offenders = [];
  let scannedFiles = 0;

  for await (const file of walk(SRC_DIR)) {
    scannedFiles++;
    const text = await readFile(file, "utf8");
    const refs = extractLocalSrcs(text);
    for (const r of refs) {
      const ok = await resolveLocal(r);
      if (!ok) {
        offenders.push({
          file: relative(ROOT, file).replace(/\\/g, "/"),
          ref: r,
        });
      }
    }
  }

  // Also check lib/content.ts registry explicitly (canonical image-path source).
  try {
    const text = await readFile(CONTENT_FILE, "utf8");
    const refs = extractContentRefs(text);
    for (const { field, value } of refs) {
      const ok = await resolveLocal(value);
      if (!ok) {
        offenders.push({
          file: relative(ROOT, CONTENT_FILE).replace(/\\/g, "/"),
          ref: `${field}: ${value}`,
        });
      }
    }
  } catch {
    // content.ts missing — not a verify-references failure (project may not have it yet)
  }

  if (offenders.length > 0) {
    console.error(`✗ ${offenders.length} unresolved local image reference(s):`);
    for (const o of offenders) {
      console.error(`  ${o.file}: ${o.ref}`);
    }
    process.exit(1);
  }

  console.log(`✓ ${scannedFiles} file(s) scanned, all local image refs resolve`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
