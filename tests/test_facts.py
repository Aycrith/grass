"""Unit tests for the facts API (`scripts/_facts.py`).

Run with:
    cd C:\\Users\\camer\\DEVNEW\\GRASS
    python -m pytest tests/test_facts.py -q
"""
from __future__ import annotations

import sys
from pathlib import Path

# Make `scripts` importable
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from _facts import (  # noqa: E402
    FACTS_PATH,
    LOCK_PATH,
    _cache,
    assert_fact,
    fact,
    facts_drift_warning,
    load_facts,
    money,
    percent,
    render_cell,
    render_md,
)


def test_load_facts_happy_path():
    """Loading returns a dict keyed by fact key."""
    facts = load_facts()
    assert isinstance(facts, dict)
    assert "fl-min-wage-current" in facts
    assert facts["fl-min-wage-current"]["units"] == "USD/hr"


def test_money_formatting():
    """money() returns '$X,XXX' for integer USD facts."""
    # Find a USD fact in the lock file
    facts = load_facts()
    usd_key = next(
        (k for k, v in facts.items() if v.get("units") == "USD" and isinstance(v["value"], (int, float))),
        None,
    )
    assert usd_key, "no USD fact in facts.yaml"
    rendered = money(usd_key)
    assert rendered.startswith("$"), f"money() should start with '$', got {rendered}"
    assert "," in rendered or "." not in rendered  # thousands sep OR no decimal


def test_percent_formatting():
    """percent() returns 'X.X%' for numeric percent facts."""
    facts = load_facts()
    pct_key = next(
        (k for k, v in facts.items() if v.get("units") == "percent" and isinstance(v["value"], (int, float))),
        None,
    )
    assert pct_key, "no percent fact in facts.yaml"
    rendered = percent(pct_key)
    assert rendered.endswith("%"), f"percent() should end with '%', got {rendered}"


def test_missing_key_raises_keyerror():
    """An unknown fact key must raise KeyError (no silent fallback)."""
    try:
        money("definitely-not-a-real-fact-key")
    except KeyError:
        return
    raise AssertionError("expected KeyError on missing fact key")


def test_render_cell_emits_marker():
    """render_cell() must emit a data-fact-key attribute so facts-check can parse it."""
    facts = load_facts()
    some_key = next(iter(facts))
    rendered = render_cell(some_key)
    assert f'data-fact-key="{some_key}"' in rendered, f"marker missing in: {rendered}"


def test_render_cell_body_nonempty():
    """render_cell() body must contain the formatted value."""
    facts = load_facts()
    usd_key = next(
        (k for k, v in facts.items() if v.get("units") == "USD" and isinstance(v["value"], (int, float))),
        None,
    )
    assert usd_key
    rendered = render_cell(usd_key)
    # Strip tags to get body
    inner = rendered.split(">", 1)[1].rsplit("<", 1)[0]
    assert inner.startswith("$"), f"USD render should be '$...', got: {inner}"


def test_scope_filter():
    """load_facts(scope='family-package-v3') must include only matching scopes."""
    if not any(
        v.get("scope") == "family-package-v3"
        for v in load_facts().values()
    ):
        # If no v3-scoped facts exist yet, this test is a no-op (skipped)
        import pytest
        pytest.skip("no facts scoped to family-package-v3 yet")
        return
    scoped = load_facts(scope="family-package-v3")
    assert all(
        v.get("scope") in ("family-package-v3", "all", "family-package")
        for v in scoped.values()
    )


def test_facts_drift_warning_no_drift_in_normal_state():
    """In a normal state (facts.yaml == facts.lock.yaml), no warning is returned."""
    warning = facts_drift_warning()
    assert warning is None, f"unexpected drift warning: {warning}"


def test_assert_fact_passes_on_match():
    """assert_fact() must pass when the value matches."""
    facts = load_facts()
    some_key = next(iter(facts))
    expected = facts[some_key]["value"]
    # Should not raise
    assert_fact(some_key, expected)


def test_render_md_no_html_wrapper():
    """render_md() must NOT contain <span> tags — pure text for Markdown."""
    facts = load_facts()
    usd_key = next(
        (k for k, v in facts.items() if v.get("units") == "USD" and isinstance(v["value"], (int, float))),
        None,
    )
    assert usd_key
    rendered = render_md(usd_key)
    assert "<" not in rendered, f"render_md() should be plain text, got: {rendered}"
    assert rendered.startswith("$")