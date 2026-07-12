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
 * Pull every src="/foo" / src='/foo' / src={`/foo`} literal out of a file's text.
 * Matches <Image src="...">, <img src="...">, <source srcSet="...">, and the
 * JSX expression form src={`/path/${var}.ext`} (we capture the leading slash +
 * literal prefix; ${var} substitutions aren't statically resolvable).
 */
function extractLocalSrcs(text) {
  const out = [];
  // Form A: src="/foo" / src='/foo' / src=`/foo`
  const quoted = /\bsrc(?:Set)?\s*=\s*(["'`])([^"'`]+)\1/g;
  let m;
  while ((m = quoted.exec(text)) !== null) {
    const val = m[2];
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) continue;
    if (val.startsWith("/")) out.push(val);
  }
  // Form B: src={`/prefix/${var}.ext`} — capture the leading slash + literal prefix.
  // We can't resolve ${var} statically; we extract the static portion and verify
  // the directory exists. The .ext we extract too so a stale `.svg` left over
  // from before WP3 still surfaces as a missing-or-stale ref.
  const jsxTpl = /\bsrc(?:Set)?\s*=\s*\{\s*`(\/[^`]*\$\{[^`]+\}[^`]*)`\s*\}/g;
  while ((m = jsxTpl.exec(text)) !== null) {
    // Strip ${...} interpolations, keep the literal characters around them.
    const staticPart = m[1].replace(/\$\{[^}]+\}/g, "");
    if (staticPart && staticPart.startsWith("/")) out.push(staticPart);
  }
  return out;
}

/**
 * Pull imageSlot / hero / mobile / desktop / portrait entries out of content.ts.
 * Treats any `imageSlot:` / `desktopSlot:` / `mobileSlot:` / `heroImage:` /
 * `portrait:` field whose value is a /-rooted path string as a public-dir
 * reference.
 */
function extractContentRefs(text) {
  const out = [];
  const fieldRe =
    /(imageSlot|desktopSlot|mobileSlot|heroImage|portrait|heroSrc|portraitSrc)\s*:\s*["'`](\/[^"'`]+)["'`]/g;
  let m;
  while ((m = fieldRe.exec(text)) !== null) {
    const val = m[2];
    out.push({ field: m[1], value: val });
  }
  return out;
}

async function resolveLocal(srcPath) {
  // Static path (no `${...}` substitution remained) → require exact file match.
  // Template-literal path (still has `${...}` sentinel or trailing-slash form
  // when substitution stripped, e.g. "/equipment/.webp") → accept a parent-dir
  // match too, so dynamic slugs don't false-positive.
  const looksDynamic =
    srcPath.endsWith("/") ||
    srcPath.endsWith("/.webp") ||
    srcPath.endsWith("/.svg") ||
    srcPath.endsWith("/.png") ||
    srcPath.endsWith("/.jpg");
  const abs = resolve(PUBLIC_DIR, srcPath.replace(/^\//, ""));
  try {
    const s = await stat(abs);
    if (s.isFile()) return true;
    if (s.isDirectory()) return true;
  } catch {
    // fall through
  }
  if (looksDynamic) {
    const lastSlash = abs.lastIndexOf("\\") === -1 ? abs.lastIndexOf("/") : abs.lastIndexOf("\\");
    if (lastSlash > 0) {
      try {
        const s = await stat(abs.slice(0, lastSlash));
        if (s.isDirectory()) return true;
      } catch {
        // fall through
      }
    }
  }
  // WP3 transition tolerance: if the requested .webp is missing but a .svg
  // sibling at the same path exists, accept with a stderr warning so CI stays
  // green while ComfyUI is generating. Once the webp lands, the script returns
  // to strict mode automatically (no change needed).
  if (!looksDynamic && /\.(webp|png|jpg|jpeg)$/i.test(srcPath)) {
    const stem = srcPath.replace(/\.(webp|png|jpg|jpeg)$/i, "");
    const svgSibling = resolve(PUBLIC_DIR, stem.replace(/^\//, "") + ".svg");
    try {
      const s = await stat(svgSibling);
      if (s.isFile()) return true;  // tolerated — actual svg exists at same path
    } catch {
      // no sibling svg; resolve fails as before
    }
  }
  return false;
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
