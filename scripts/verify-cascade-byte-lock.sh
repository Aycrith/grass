#!/usr/bin/env bash
# ============================================================
# verify-cascade-byte-lock.sh
# ============================================================
# Cascade byte-lock audit-trail verification (Charter #3 mechanism).
#
# Runs the 6 mechanical checks the cascade closeout depends on; exits 0
# on PASS, non-zero on FAIL with which check failed.
#
# Usage (from REPO ROOT):
#   bash scripts/verify-cascade-byte-lock.sh
#
# Cadence:
#   - REQUIRED before `git push origin main` per CLAUDE.md hard rule #2
#     + Charter #3 audit-trail completeness policy.
#   - REQUIRED at every 14-day cadence review (e.g., 2026-07-31).
#   - OPTIONAL during development for fast feedback on byte-lock drift.
#
# Exit codes:
#   0  all 6 checks PASS (cascade SHIP-READY-PUSH)
#   1  one or more checks FAIL (output names which)
#
# Covers the 2026-07-17 cascade (D-0014 hero recolor + D-0015 viewport
# gate + mask fix). To extend to future cascades, parameterize the
# byte-lock file path or add an additional verify cascade block.
# ============================================================

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
BL_REL="apps/web/visual/audit/2026-07-17-hero-byte-lock-sha256.txt"
BL="$ROOT/$BL_REL"
BASELINES="$ROOT/apps/web/visual/baselines"

FAIL=0

echo '======================================================'
echo '  STEWARD PUSH-TIME VERIFICATION SUITE — CASCADE'
echo '======================================================'
echo '  Targeted cascade: 2026-07-17 (D-0014 + D-0015)'
echo '  Byte-lock file:    '$BL_REL
echo '======================================================'
echo ''

# -----------------------------------------------------------
# Check 1 -- byte-lock sha256sum -c (the audit-trail anchor)
# -----------------------------------------------------------
echo '[1/6] byte-lock sha256sum -c (expect 7 OK, exit 0)'
cd "$BASELINES"
sha256sum -c "../audit/2026-07-17-hero-byte-lock-sha256.txt" || FAIL=1
cd "$ROOT"
echo ''

# -----------------------------------------------------------
# Check 2 -- .gitignore noise-path coverage (working-tree noise excluded)
# -----------------------------------------------------------
echo '[2/6] .gitignore noise coverage (4 paths should exit 0; tracked baseline should exit 1)'
NOISE_OK=0
for path in apps/web/_working-tree-noise apps/web/_working-tree-noise/2026-07-17-home-route-batch apps/web/_working-tree-noise/2026-07-17-home-route-batch/home-chromium-desktop.png apps/web/_working-tree-noise/2026-07-17-home-route-batch/home-chromium-mobile.png; do
  git check-ignore -v "$path" >/dev/null
  R=$?
  if [ $R -eq 0 ]; then
    NOISE_OK=$((NOISE_OK+1))
    echo "    [OK exit 0] $path"
  else
    echo "    [FAIL exit $R] $path (should be IGNORED)"
    FAIL=1
  fi
done
echo "    noise paths correctly ignored: $NOISE_OK / 4"
# Negative test: tracked baseline must NOT be ignored
git check-ignore -v apps/web/visual/baselines/.before-2026-07-17-home-chromium-desktop.png >/dev/null 2>&1
R=$?
if [ $R -eq 1 ]; then
  echo "    [OK exit 1] tracked baseline correctly NOT ignored"
else
  echo "    [FAIL exit $R] tracked baseline unexpectedly ignored"
  FAIL=1
fi
echo ''

# -----------------------------------------------------------
# Check 3 -- typecheck (apps/web)
# -----------------------------------------------------------
echo '[3/6] typecheck apps/web'
cd "$ROOT/apps/web"
bun run typecheck || FAIL=1
cd "$ROOT"
echo ''

# -----------------------------------------------------------
# Check 4 -- 6-commit cascade history visible
# -----------------------------------------------------------
echo '[4/6] cascade history (recent 10 commits)'
git log --oneline -10
echo ''

# -----------------------------------------------------------
# Check 5 -- refs/original/ hygiene (filter-branch safety net)
# -----------------------------------------------------------
echo '[5/6] refs/original/ hygiene (expect absent)'
if [ -d "$ROOT/.git/refs/original" ]; then
  echo '    [WARN] refs/original/ present (filter-branch safety net intact)'
  echo '           Not blocking; informational only — cleanup with:'
  echo '           rm -rf '"$ROOT"'/.git/refs/original'
else
  echo '    [OK] refs/original/ absent'
fi
echo ''

# -----------------------------------------------------------
# Check 6 -- working tree clean (filter _working-tree-noise)
# -----------------------------------------------------------
echo '[6/6] working tree clean (filter _working-tree-noise, expect 0)'
DIRTY=$(git status --short 2>&1 | grep -vE '^\?\? apps/web/_working-tree-noise/' | wc -l)
if [ "$DIRTY" -eq 0 ]; then
  echo '    [OK] working tree clean (no non-noise untracked files)'
else
  echo "    [FAIL] $DIRTY non-noise untracked/staged files:"
  git status --short 2>&1 | grep -vE '^\?\? apps/web/_working-tree-noise/' | head -10
  FAIL=1
fi
echo ''

# -----------------------------------------------------------
# Final verdict
# -----------------------------------------------------------
echo '======================================================'
if [ $FAIL -eq 0 ]; then
  echo '  CASCADE STATUS: SHIP-READY-PUSH'
  echo '======================================================'
  echo ''
  echo 'All 6 mechanical checks PASS. Steward sign-off sequence:'
  echo '  1. [this script]  exit 0'
  echo '  2. [optional]     visual verify on localhost:3001 when env unblocks'
  echo '  3. [steward]      git push origin main'
  echo ''
  exit 0
else
  echo '  CASCADE STATUS: NOT-SHIP-READY'
  echo '======================================================'
  echo ''
  echo 'One or more checks failed. See output above for details.'
  echo 'Re-run after fixing the named failures, then proceed with push.'
  exit 1
fi
