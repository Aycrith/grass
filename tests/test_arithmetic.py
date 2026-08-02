"""Unit tests for v3.0 business-plan arithmetic invariants.

Run with:
    cd C:\\Users\\camer\\DEVNEW\\GRASS
    python -m pytest tests/test_arithmetic.py -q

These tests enforce the self-consistency rules that protect the v3 plan from
the arithmetic bugs that freebuff shipped under time pressure (notably the
$5,688 buffer that summed to $14,000 against a $12,000 total).
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import _facts as facts  # noqa: E402

HTML_PATH = ROOT / "output" / "procurement" / "business_plan_grass_v3.0.html"


def _build_html() -> str:
    """Rebuild v3 HTML (always run from a clean cache)."""
    subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build_business_plan_v3.py"), "--skip-pdf"],
        check=True,
        cwd=str(ROOT),
    )
    return HTML_PATH.read_text(encoding="utf-8")


def test_use_of_funds_buffer_arithmetic_consistent():
    """Buffer + fixed rows = v3-seed-loan-principal exactly."""
    total = int(float(facts.fact("v3-seed-loan-principal")))
    fixed = 5230 + 1750 + 3000 + 1500 + 262  # 11742 (equipment upgraded to 36" zero-turn)
    buffer_expected = total - fixed  # 258
    assert buffer_expected == int(float(facts.fact("v3-use-of-funds-buffer"))), (
        f"facts.yaml says buffer = {facts.fact('v3-use-of-funds-buffer')!r} "
        f"but arithmetic requires {buffer_expected} (total {total} - fixed {fixed})"
    )


def test_use_of_funds_buffer_marker_in_html():
    """The rendered HTML must contain a marker with the correct buffer value."""
    html = _build_html()
    m = re.findall(
        r'data-fact-key="v3-use-of-funds-buffer">([^<]+)</span>',
        html,
    )
    assert m, "no v3-use-of-funds-buffer marker found in HTML"
    rendered = m[0]
    expected = facts.render_md("v3-use-of-funds-buffer")
    assert rendered == expected, (
        f"HTML buffer cell renders {rendered!r} but facts.yaml expects {expected!r}"
    )


def test_no_legacy_5_688_in_html():
    """The old $5,688 buffer must not appear anywhere in v3 HTML."""
    html = _build_html()
    bad = re.findall(r"\$5,688", html)
    assert not bad, f"legacy $5,688 still appears {len(bad)} times in v3 HTML"


def test_total_marker_in_html():
    """The Total row in the use-of-funds table must carry the principal marker."""
    html = _build_html()
    m = re.findall(
        r'data-fact-key="v3-seed-loan-principal">([^<]+)</span>',
        html,
    )
    assert len(m) >= 2, (
        f"expected at least 2 v3-seed-loan-principal markers (Total + Recommended tier); "
        f"found {len(m)}: {m}"
    )
    for v in m:
        assert v == "$12,000", f"unexpected principal render: {v!r}"


def test_unit_economics_waterfall_bars_sum_to_seven():
    """Waterfall bars: Price $48 - COGS $30 - Overhead $11 = weekly net $7.

    Bars `[48, -30, -11, 7]` sum to $14. The displayed "$74 monthly net" is
    a weighted contribution across weekly + biweekly customers ($7 × ~10.5
    weekly-equivalent visits). The test asserts that the bars sum to the
    weekly net ($7 = $48 - $30 - $11), not to the displayed $74 weighted
    figure.
    """
    bars_str = facts.fact("v3-unit-economics-waterfall-bars")  # "48,-30,-11,7"
    bars = [int(x) for x in bars_str.split(",")]
    assert bars == [48, -30, -11, 7], f"unexpected waterfall bars: {bars}"
    # Last bar is the residual (net)
    assert bars[-1] == sum(bars[:-1]), (
        f"waterfall net {bars[-1]} != sum-of-deductions {sum(bars[:-1])}"
    )
    # And the residual equals the weekly net (price - COGS - overhead)
    assert bars[-1] == 48 - 30 - 11, f"weekly net should be $7; got {bars[-1]}"


def test_ask_tiered_string_format():
    """The v3-seed-loan-ask-tiered fact must list 10K / 12K / 15K tiers."""
    val = facts.fact("v3-seed-loan-ask-tiered")
    parts = val.split("/")
    assert parts == ["10000", "12000", "15000"], f"unexpected tiered ask: {val!r}"


def test_html_size_under_250_kb():
    """HTML must be under 250 KiB per spec §7."""
    html = _build_html()
    assert len(html.encode("utf-8")) <= 250 * 1024, (
        f"HTML too large: {len(html.encode('utf-8')):,} bytes (max 256,000)"
    )


def test_html_contains_no_style_block():
    """Spec §7 forbids <style> blocks (Gmail-safe inline-CSS only)."""
    html = _build_html()
    assert "<style>" not in html and "</style>" not in html, (
        "HTML still contains a <style> block (Gmail will strip CSS)"
    )
