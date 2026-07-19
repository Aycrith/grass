#!/usr/bin/env python3
"""
tmp/print-audit.py -- 2026-07-17 hero palette/coverage audit runner.

Imports the audit module directly via importlib (avoids Git Bash's
/tmp path-mapping quirk), runs the audit against
apps/web/visual/baselines/hero-chromium-desktop.png, writes the
JSON report to apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit-output.json
(byte-locked across future cadences), and prints a human-readable
KPI summary.

Exit codes mirror the audit module's ci_gate verdict (0=PASS,
1=FAIL, 2=bad-args), so the script is suitable as a future cron/CI
gate without translation.
"""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


def main() -> int:
    # Honour the read-only audit invariant: do not let Python's
    # import machinery write a .pyc to __pycache__/ for the audit
    # script we are loading via importlib. Setting this BEFORE
    # spec_from_file_location suppresses the side-effect that v1's
    # direct `python audit.py hero.png` invocation (no import, hence
    # no cache) did not produce.
    sys.dont_write_bytecode = True

    here = Path(__file__).resolve().parent
    root = here.parent

    script = root / 'apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit.py'
    png = root / 'apps/web/visual/baselines/hero-chromium-desktop.png'
    output = root / 'apps/web/visual/audit/2026-07-17-hero-palette-coverage-audit-output.json'

    if not script.is_file():
        print(f'ERROR: audit script not found at {script}', file=sys.stderr)
        return 2
    if not png.is_file():
        print(f'ERROR: hero PNG not found at {png}', file=sys.stderr)
        return 2

    spec = importlib.util.spec_from_file_location('hero_audit', str(script))
    audit_mod = importlib.util.module_from_spec(spec)
    sys.modules['hero_audit'] = audit_mod
    spec.loader.exec_module(audit_mod)

    report = audit_mod.audit(str(png))

    output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')

    print(f'image: {png.relative_to(root).as_posix()}')
    print(f'image_size: {report["image_size"]}')
    print(f'total_pixels_sampled: {report["total_pixels_sampled"]}')
    print(f'sample_fingerprint_sha256: {report["sample_fingerprint_sha256"]}')
    print(f'JSON written to: {output.relative_to(root).as_posix()}')
    print('')
    print('global_coverage_pct:')
    for k, v in report['global_coverage_pct'].items():
        print(f'  {k}: {v}%')
    print('')
    print('grid_3x3_pct:')
    for k, v in report['grid_3x3_pct'].items():
        print(
            f'  {k:>13s}: sand={v["sand"]}%, '
            f'green={v["green"]}%, bg={v["bg"]}%, edge={v["edge"]}%'
        )
    print('')
    re = report['right_edge_5pct']
    print(
        f'right_edge_5pct: n_sampled={re["n_sampled"]}, '
        f'bg_pct={re["bg_pct"]}%, green_pct={re["green_pct"]}%, '
        f'mask_bleed_detected={re["mask_bleed_detected"]}'
    )
    print('')
    g = report['ci_gate']
    print(f'ci_gate: pass={g["pass"]}')
    for r in g['reasons']:
        print(f'  REASON: {r}')
    print('')
    print(f'ci_gate_verdict: {"PASS" if g["pass"] else "FAIL"}')

    return 0 if g['pass'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
