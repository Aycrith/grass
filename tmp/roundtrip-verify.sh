#!/usr/bin/env bash
# roundtrip-verify.sh
# Clean post-push clean-clone round-trip verification.
#
# Steps:
#   1. Clone the remote origin/main to a fresh temp dir (isolated).
#   2. Inspect: HEAD SHA, commit count, critical files inventory.
#   3. bun install in apps/web (clean clones have no node_modules).
#   4. Run verify-cascade-byte-lock.sh from the clone (both ./ and bash prefixes).
#   5. Run byte-lock sha256sum -c (the audit-trail anchor).
#   6. Run bun run typecheck (after install).
#   7. Verify remote HEAD matches clone HEAD.
#   8. Cleanup the clone dir.

set -uo pipefail

ROOT="/c/Users/camer/DEVNEW/grass"
CLONE_DIR="/tmp/roundtrip-final-$(date +%s)"

cd "$ROOT" || exit 1

REMOTE_URL=$(git config --get remote.origin.url)
echo "================================================================"
echo "  POST-PUSH CLEAN-CLONE ROUND-TRIP VERIFICATION (final syntax-clean)"
echo "================================================================"
echo ""
echo "  remote URL: $REMOTE_URL"
echo ""

# Step 1 -- clone
[ -d "$CLONE_DIR" ] && rm -rf "$CLONE_DIR"
git clone "$REMOTE_URL" "$CLONE_DIR" 2>&1 | tail -5
CLONE_RC=$?
echo "  clone exit: $CLONE_RC"
echo ""

if [ "$CLONE_RC" -ne 0 ]; then
  echo "*** CLONE FAILED ***"
  rm -rf "$CLONE_DIR"
  exit 1
fi

cd "$CLONE_DIR" || exit 1

# Step 2 -- clone state
echo "  --- Step 2: clone state ---"
CLONE_SHA=$(git rev-parse HEAD)
CLONE_SHA_8=$(echo "$CLONE_SHA" | cut -c1-8)
echo "    clone HEAD (8): $CLONE_SHA_8"
echo "    full: $CLONE_SHA"
echo ""
echo "    -- commit count from root --"
git rev-list --count HEAD
echo ""

# Step 3 -- bun install
echo "  --- Step 3: bun install (apps/web) ---"
cd apps/web
bun install 2>&1 | tail -5
BUN_RC=$?
cd ..
echo "    bun install exit: $BUN_RC"
echo ""

# Step 4 -- verify-script
echo "  --- Step 4: verify-cascade-byte-lock.sh ---"
chmod +x ./scripts/verify-cascade-byte-lock.sh 2>/dev/null
echo "    -- ./prefix invocation --"
./scripts/verify-cascade-byte-lock.sh > /dev/null 2>&1
SLASH_RC=$?
echo "    exit: $SLASH_RC"
echo ""

echo "    -- bash prefix invocation --"
bash ./scripts/verify-cascade-byte-lock.sh > /dev/null 2>&1
BASH_RC=$?
echo "    exit: $BASH_RC"
echo ""

echo "    -- full output verdict line --"
bash ./scripts/verify-cascade-byte-lock.sh 2>&1 | grep -E "CASCADE STATUS|exit|OK|FAIL" | head -20
echo ""

# Step 5 -- byte-lock
echo "  --- Step 5: byte-lock sha256sum -c ---"
(cd apps/web/visual/baselines && sha256sum -c ../audit/2026-07-17-hero-byte-lock-sha256.txt > /dev/null 2>&1)
BYTE_RC=$?
echo "    exit: $BYTE_RC"
echo ""

# Step 6 -- typecheck
echo "  --- Step 6: bun run typecheck ---"
(cd apps/web && bun run typecheck > /dev/null 2>&1)
TC_RC=$?
echo "    exit: $TC_RC"
echo ""

# Step 7 -- remote HEAD match
echo "  --- Step 7: remote vs clone HEAD ---"
REMOTE_SHA=$(git ls-remote origin main 2>/dev/null | awk '{print $1}')
echo "    remote HEAD (8): $(echo "$REMOTE_SHA" | cut -c1-8)"
echo "    clone  HEAD (8): $CLONE_SHA_8"
REMOTE_MATCH=$([ "$REMOTE_SHA" = "$CLONE_SHA" ] && echo YES || echo NO)
echo "    match: $REMOTE_MATCH"
echo ""

# Step 8 -- cleanup
echo "  --- Step 8: cleanup ---"
cd "$ROOT"
rm -rf "$CLONE_DIR" 2>&1
echo "    cleanup OK"
echo ""

# Final verdict
echo "================================================================"
echo "  FINAL VERDICT"
echo "================================================================"
if [ "$BUN_RC" = 0 ] && [ "$SLASH_RC" = 0 ] && [ "$BASH_RC" = 0 ] && [ "$BYTE_RC" = 0 ] && [ "$TC_RC" = 0 ] && [ "$REMOTE_MATCH" = "YES" ]; then
  echo ""
  echo "  *** CASCADE ROUND-TRIP VERIFIED (FRESH CLONE) ***"
  echo ""
  echo "    clone:               $CLONE_RC"
  echo "    bun install:         $BUN_RC"
  echo "    verify (./prefix):   $SLASH_RC"
  echo "    verify (bash prefix):$BASH_RC"
  echo "    byte-lock:           $BYTE_RC"
  echo "    typecheck:           $TC_RC"
  echo "    remote SHAs match:   $REMOTE_MATCH"
  echo ""
  echo "  Anyone with remote URL + bun 1.x + git creds can reproduce:"
  echo "    1. git clone <url>"
  echo "    2. cd apps/web && bun install"
  echo "    3. (back at repo root) ./scripts/verify-cascade-byte-lock.sh"
  echo "  --> exit 0 SHIP-READY-PUSH"
else
  echo ""
  echo "  *** ROUND-TRIP VERIFICATION FAILED ***"
  echo "    clone:               $CLONE_RC"
  echo "    bun install:         $BUN_RC"
  echo "    verify (./prefix):   $SLASH_RC"
  echo "    verify (bash prefix):$BASH_RC"
  echo "    byte-lock:           $BYTE_RC"
  echo "    typecheck:           $TC_RC"
  echo "    remote SHAs match:   $REMOTE_MATCH"
fi
