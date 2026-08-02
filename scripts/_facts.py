"""Single source of truth for business-plan numbers.

Reads `content/facts.yaml` (the canonical facts file) and provides:
    load_facts(scope='all')     -> dict[key, fact_dict]
    money(key, scope='all')     -> '$12,000'
    percent(key, scope='all')   -> '7.0%'
    fact(key, scope='all')      -> raw value as string
    assert_fact(key, expected)  -> raises AssertionError on mismatch
    render_cell(key, scope='v3') -> HTML span with data-fact-key marker

The cache is keyed on the SHA-256 of facts.yaml. If facts.yaml drifts from
output/reports/facts.lock.yaml, a warning is printed to stderr but loading
still succeeds (the lock is informational; the canonical is facts.yaml).

Render-layer contract: every displayed number in v3 must flow through
`render_cell(key)` (or one of money/percent/fact wrapped in a
<span data-fact-key="...">...</span>). The marker is what
`scripts/build_facts_check.py` parses.
"""
from __future__ import annotations

import hashlib
import sys
from pathlib import Path
from typing import Optional

import yaml

ROOT = Path(__file__).resolve().parent.parent
FACTS_PATH = ROOT / "content" / "facts.yaml"
LOCK_PATH = ROOT / "output" / "reports" / "facts.lock.yaml"

_cache: Optional[dict] = None
_lock_hash: Optional[str] = None


def _sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def load_facts(path: Path = FACTS_PATH, scope: str = "all") -> dict[str, dict]:
    """Load facts.yaml; cache by file SHA-256.

    When `scope` is given (e.g. 'family-package-v3'), filters to facts whose
    scope is the given scope, 'all', or 'family-package-v3'.
    """
    global _cache, _lock_hash
    raw_hash = _sha(path)
    if _cache is None or _lock_hash != raw_hash:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        facts_list = data.get("facts") or []
        _cache = {f["key"]: f for f in facts_list}
        _lock_hash = raw_hash
        if LOCK_PATH.exists():
            lock_hash = _sha(LOCK_PATH)
            if lock_hash != raw_hash:
                print(
                    f"[facts] WARNING: facts.yaml ({raw_hash[:8]}) != "
                    f"facts.lock.yaml ({lock_hash[:8]}); lock is stale",
                    file=sys.stderr,
                )
    if scope == "all":
        return _cache
    return {
        k: v
        for k, v in _cache.items()
        if v.get("scope") in (scope, "all", "family-package-v3")
    }


def money(key: str, scope: str = "all") -> str:
    """Format a USD fact as '$X,XXX' (or as-is for non-numeric)."""
    f = load_facts(scope=scope)[key]
    v = f["value"]
    if isinstance(v, (int, float)):
        return f"${v:,.0f}" if float(v).is_integer() else f"${v:,.2f}"
    return str(v)


def percent(key: str, scope: str = "all") -> str:
    """Format a percent fact as '7.0%' (or as-is for non-numeric / range)."""
    f = load_facts(scope=scope)[key]
    v = f["value"]
    if isinstance(v, (int, float)):
        return f"{v}%"
    s = str(v)
    return s if "%" in s else s + "%"


def fact(key: str, scope: str = "all") -> str:
    """Return the raw value of a fact as a string."""
    return str(load_facts(scope=scope)[key]["value"])


def assert_fact(key: str, expected, scope: str = "all") -> None:
    actual = load_facts(scope=scope)[key]["value"]
    assert actual == expected, f"fact {key}: expected {expected!r}, got {actual!r}"


def render_cell(key: str, scope: str = "v3") -> str:
    """Return HTML-wrapped cell content with data-fact-key marker.

    The marker is what `scripts/build_facts_check.py` parses. Use this helper
    in every `data_table` / `stat_grid` / paragraph cell that displays a fact.
    """
    f = load_facts(scope=scope)[key]
    units = f.get("units", "")
    raw = f["value"]
    if units == "USD":
        if isinstance(raw, (int, float)):
            body = f"${raw:,.0f}" if float(raw).is_integer() else f"${raw:,.2f}"
        else:
            body = str(raw)
    elif units == "percent":
        body = f"{raw}%" if isinstance(raw, (int, float)) else str(raw)
    else:
        body = str(raw)
    return f'<span data-fact-key="{key}">{body}</span>'


def render_md(key: str, scope: str = "v3") -> str:
    """Return the rendered cell body without the HTML wrapper (Markdown use)."""
    f = load_facts(scope=scope)[key]
    units = f.get("units", "")
    raw = f["value"]
    if units == "USD":
        if isinstance(raw, (int, float)):
            return f"${raw:,.0f}" if float(raw).is_integer() else f"${raw:,.2f}"
        return str(raw)
    if units == "percent":
        return f"{raw}%" if isinstance(raw, (int, float)) else str(raw)
    return str(raw)


def all_facts(scope: str = "all") -> list[dict]:
    """Return all facts as a list of dicts (for the facts-check tool)."""
    return list(load_facts(scope=scope).values())


def facts_drift_warning() -> Optional[str]:
    """Return a warning string if facts.yaml != facts.lock.yaml, else None."""
    if not LOCK_PATH.exists():
        return None
    if _sha(FACTS_PATH) != _sha(LOCK_PATH):
        return "facts.yaml and facts.lock.yaml have drifted; consider refreshing the lock."
    return None