#!/usr/bin/env python3
"""
GRASS Business Plan Versioning (A-9 + S-05)

Reads VERSION (single integer line at repo root), gathers build metadata,
emits:
  - VERSION (current version)
  - footer_html() / footer_text() — render the standard footer block
  - footer_md() — for Markdown sources
  - build_stamp() — {date, sha, source_hash, facts_version, corrections}

Footer format:
  Largo Lawn · Mission 1
  Version {ver} · {variant}
  Built {date} · Source SHA: {sha}
  Forecast document; not a guarantee of results.

Usage (importable from other scripts):
    from scripts.versioning import footer_html, footer_text, build_stamp
"""
from __future__ import annotations

import datetime as dt
import hashlib
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION_FILE = ROOT / "VERSION"

DEFAULT_VERSION = "2.0"
DEFAULT_FACTS_VERSION = "v1"  # bump when facts.yaml schema changes


def read_version() -> str:
    if not VERSION_FILE.exists():
        return DEFAULT_VERSION
    raw = VERSION_FILE.read_text(encoding="utf-8").strip()
    # version is just the integer/float line
    return raw.splitlines()[0].strip() if raw else DEFAULT_VERSION


def git_sha(short: bool = True) -> str:
    """Return current git SHA, or 'no-git' if no repo / git unavailable."""
    try:
        r = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=str(ROOT),
            capture_output=True, text=True, timeout=5,
        )
        if r.returncode != 0:
            return "no-git"
        sha = r.stdout.strip()
        return sha[:12] if short else sha
    except Exception:
        return "no-git"


def source_hash(paths: list[Path]) -> str:
    """SHA-256 (first 12) over the concatenation of files' contents."""
    h = hashlib.sha256()
    for p in paths:
        if p.exists():
            h.update(p.read_bytes())
    return h.hexdigest()[:12]


def build_stamp(variant: str, source_paths: list[Path] | None = None) -> dict:
    """Return a dict with date, sha, source_hash, facts_version, version, variant."""
    return {
        "version": read_version(),
        "variant": variant,
        "date": dt.datetime.now().strftime("%Y-%m-%d"),
        "sha": git_sha(),
        "source_hash": source_hash(source_paths or []),
        "facts_version": DEFAULT_FACTS_VERSION,
    }


def footer_html(variant: str, source_paths: list[Path] | None = None) -> str:
    """Standard footer block for HTML emails (table-based, Gmail-safe)."""
    s = build_stamp(variant, source_paths)
    return f'''<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;border-top:1px solid #E5DED0;">
  <tr><td style="font-family:Georgia,serif;font-size:11px;color:#6B6B6B;padding-top:8px;">
    Largo Lawn &middot; Mission 1<br/>
    Version {s["version"]} &middot; {s["variant"]}<br/>
    Built {s["date"]} &middot; Source SHA: {s["sha"]} &middot; Source hash: {s["source_hash"]}<br/>
    Forecast document; not a guarantee of results.
  </td></tr>
</table>'''


def footer_text(variant: str, source_paths: list[Path] | None = None) -> str:
    s = build_stamp(variant, source_paths)
    return (
        f"Largo Lawn · Mission 1\n"
        f"Version {s['version']} · {s['variant']}\n"
        f"Built {s['date']} · Source SHA: {s['sha']} · Source hash: {s['source_hash']}\n"
        f"Forecast document; not a guarantee of results."
    )


def footer_md(variant: str, source_paths: list[Path] | None = None) -> str:
    s = build_stamp(variant, source_paths)
    return (
        f"---\n\n"
        f"*Largo Lawn · Mission 1 · Version {s['version']} · {s['variant']} · "
        f"Built {s['date']} · Source SHA: `{s['sha']}` · Source hash: `{s['source_hash']}` · "
        f"Facts model {s['facts_version']} · Forecast document; not a guarantee of results.*"
    )


if __name__ == "__main__":
    # quick CLI test
    import sys
    variant = sys.argv[1] if len(sys.argv) > 1 else "test"
    print(footer_text(variant))