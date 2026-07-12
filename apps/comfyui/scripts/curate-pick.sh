#!/usr/bin/env bash
# curate-pick.sh — move a generation-time PNG into curated/ for conversion.
#
# Usage:
#   bash scripts/curate-pick.sh <slug> <N>
#
# Example:
#   bash scripts/curate-pick.sh service-mowing 3
#   # moves outputs/largo-lawn/service-mowing/3.png → curated/service-mowing.png
#
# The steward picks N after reviewing outputs/largo-lawn/<slug>/{1..4}.png.
# This script enforces a single "curated" slot per slug — re-running with a
# different N overwrites the previous pick.

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: bash scripts/curate-pick.sh <slug> <N>" >&2
  echo "Example: bash scripts/curate-pick.sh service-mowing 3" >&2
  exit 2
fi

SLUG="$1"
N="$2"

# Resolve repo root relative to this script (apps/comfyui/scripts/ → 3 levels up).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

SRC="${REPO_ROOT}/apps/comfyui/outputs/largo-lawn/${SLUG}/${N}.png"
DST="${REPO_ROOT}/apps/comfyui/curated/${SLUG}.png"

if [ ! -f "${SRC}" ]; then
  echo "✗ Source not found: ${SRC}" >&2
  exit 1
fi

mkdir -p "$(dirname "${DST}")"
mv "${SRC}" "${DST}"

echo "✓ ${SRC} → ${DST}"
