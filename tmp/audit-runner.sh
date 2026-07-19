#!/usr/bin/env bash
# audit-runner.sh -- executes the hero palette/coverage audit and
# captures both the raw JSON and a KPI summary. Read-only on the
# image; only writes to /tmp.

set +e

# Robust path resolution: try POSIX-mapped first, then C:/ style.
ROOT='/c/Users/camer/DEVNEW/grass'
[ -d "$ROOT" ] || ROOT='C:/Users/camer/DEVNEW/grass'
[ -d "$ROOT" ] || { echo "ERROR: cannot locate REPO ROOT"; exit 1; }

cd "$ROOT" || { echo "ERROR: cannot cd to $ROOT"; exit 1; }

SCRIPT='apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py'
PNG='apps/web/visual/baselines/hero-chromium-desktop.png'
OUT='/tmp/hero-palette-coverage-output.json'

echo '====================================================================='
echo '  HERO PALETTE / COVERAGE AUDIT v2 -- EXECUTION'
echo '====================================================================='
echo "  repo:  $ROOT"
echo "  script: $SCRIPT"
echo "  target: $PNG"
echo "  output: $OUT"
echo ''

echo '--- 1. py_compile (syntax check) ---'
python -m py_compile "$SCRIPT"
PYC_RC=$?
echo "  py_compile exit: $PYC_RC"
[ "$PYC_RC" -ne 0 ] && { echo "  ABORT: script does not compile"; exit 1; }
echo ''

echo '--- 2. PNG file presence ---'
if [ ! -f "$PNG" ]; then
  echo "  ABORT: PNG not found at $PNG"
  exit 1
fi
PNG_BYTES=$(wc -c < "$PNG")
PNG_SHA=$(sha256sum "$PNG" | cut -c1-12)
echo "  PNG: YES ($PNG_BYTES B, sha256-12: $PNG_SHA)"
echo ''

echo '--- 3. RUN AUDIT ---'
python "$SCRIPT" "$ROOT/$PNG" > "$OUT" 2>"$OUT.stderr"
RUN_RC=$?
echo "  run exit: $RUN_RC  (0=pass / 1=ci-gate-fail / 2=bad-args)"
echo "  out bytes: $(wc -c < $OUT)   stderr: $(wc -c < $OUT.stderr 2>/dev/null || echo 0)"
[ "$RUN_RC" -eq 2 ] && { echo "  ABORT: bad args"; cat "$OUT.stderr"; exit 1; }
echo ''

if [ "$RUN_RC" -ne 0 ] && [ "$RUN_RC" -ne 1 ]; then
  echo '  ERROR: unexpected rc != 0/1/2'
  cat "$OUT.stderr"
  exit 1
fi

echo '--- 4. KEY METRICS ---'
python << 'PYEOF'
import json
data = json.load(open('/tmp/hero-palette-coverage-output.json'))
print('  image_size: ' + str(data['image_size']))
print('  total_pixels_sampled: ' + str(data['total_pixels_sampled']))
print('  sample_fingerprint_sha256: ' + data['sample_fingerprint_sha256'])
print('  global_coverage_pct:')
for k, v in data['global_coverage_pct'].items():
    print(f'    {k}: {v}%')
print('  grid_3x3_pct:')
for k, v in data['grid_3x3_pct'].items():
    print(f'    {k:>13s}: sand={v["sand"]}%, green={v["green"]}%, bg={v["bg"]}%, edge={v["edge"]}%')
print('  right_edge_5pct:')
re = data['right_edge_5pct']
print(f'    n_sampled={re["n_sampled"]}, bg_pct={re["bg_pct"]}%, green_pct={re["green_pct"]}%, bleed={re["mask_bleed_detected"]}')
print('  ci_gate:')
g = data['ci_gate']
print(f'    pass: {g["pass"]}')
for r in g['reasons']:
    print(f'    REASON: {r}')
PYEOF
echo ''

echo '--- 5. ci_gate final verdict ---'
python -c "
import json
d = json.load(open('/tmp/hero-palette-coverage-output.json'))
if d['ci_gate']['pass']:
    print('  >>> CI_GATE_VERDICT: PASS  (no regression detected)')
else:
    print('  >>> CI_GATE_VERDICT: FAIL  (regression(s) detected -- see reasons above)')
"
echo ''
echo 'DONE'
