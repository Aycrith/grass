#!/usr/bin/env python3
r"""
GRASS Family Package Sender
============================

Sends the family seed-loan package to the family investor via Gmail SMTP
using the OWL sender (C:/Users/camer/DEVNEW/resumeStuff/scripts/send_email.py).

Pattern (per PRP-D \u00a72, v2.0):
  - HTML body:  the family cover letter (direct, receipts-first, loan-structured)
  - Attachments:
      1. business_plan_grass_condensed.pdf                   (12-page investable document)
      2. business_plan_grass_summary_card_v2.0.html            (one-page business case)
      3. business_plan_grass_family_cover_letter.html          (the body, also attached for archive)

Why the family cover letter as the body (not the condensed plan)?
  The condensed plan is a 12-page PDF that's already attached. The cover letter
  is the direct business-case framing. Putting it in the body gives the family
  investor something readable in the inbox preview.

Subject format (v2.0):
  "Largo Lawn \u2014 business plan + loan request (Largo FL) \u2014 YYYY-MM-DD"

Recipient default: choblo@gmail.com (founder's staging address for verification
before the live send to the family investor).

Preflight (v2.0 \u2014 all blocking):
  - Gmail-strip patterns (script / background-image / position:absolute|fixed)
  - Loan-structure required markers (Largo Lawn, $15,000, 0%, 24 months, forecast disclaimer)
  - Forbidden equity-instrument markers (SAFE / equity stake / valuation cap / post-money)
  - Stale-fact scan (no 6.75%, no $13/hr, no 7.9-13%)
  - Corrected-fact presence (7.0%, 10-15%, $14/hr)

Usage:
    python scripts/send_family_package.py                       # dry-run, default recipient
    python scripts/send_family_package.py --to someone@x.com   # send to one
    python scripts/send_family_package.py --send                # actually send
    python scripts/send_family_package.py --build-only          # rebuild artifacts only
    python scripts/send_family_package.py --no-rebuild          # use existing artifacts
    python scripts/send_family_package.py --subject "..."       # override subject

Environment variables needed (for the OWL sender):
    GMAIL_USER         - Gmail address
    GMAIL_APP_PASSWORD - Gmail App Password (16 chars, no spaces)
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from datetime import date
from pathlib import Path

# cp1252 console fix: force UTF-8 on stdout/stderr so em-dashes survive logging.
# Real protection is PYTHONIOENCODING=utf-8 in the launch env; this is a belt-
# and-suspenders fallback for hosts that launch without it set.
try:
    sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    sys.stderr.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
except (AttributeError, OSError):
    pass
if os.environ.get("PYTHONIOENCODING") != "utf-8":
    os.environ["PYTHONIOENCODING"] = "utf-8"

ROOT = Path(__file__).resolve().parent.parent
PROCUREMENT = ROOT / "output" / "procurement"

BUILD_COVER = ROOT / "scripts" / "build_family_cover_letter.py"
BUILD_CARD = ROOT / "scripts" / "build_summary_card.py"
OWL_SENDER = Path(r"C:/Users/camer/DEVNEW/resumeStuff/scripts/send_email.py")

COVER_HTML = PROCUREMENT / "business_plan_grass_family_cover_letter.html"
CARD_HTML = PROCUREMENT / "business_plan_grass_summary_card_v2.0.html"
CONDENSED_PDF = PROCUREMENT / "business_plan_grass_condensed.pdf"

DEFAULT_RECIPIENTS = ["choblo@gmail.com"]

# Preflight: things Gmail will strip / break
BLOCKING_PATTERNS = [
    ("<script", "contains <script> tag (Gmail strips)"),
    ("background-image", "contains background-image (Gmail strips)"),
    ("background:url", "contains background:url (Gmail strips)"),
    ("position:absolute", "contains position:absolute (Gmail strips)"),
    ("position: fixed", "contains position: fixed (Gmail strips)"),
]

# Required content markers (blocking for family package)
REQUIRED_MARKERS = [
    ("Largo Lawn", "brand name missing"),
    ("$15,000", "loan amount missing"),
    ("0%", "0% interest language missing"),
    ("24 months", "24-month term missing"),
    ("Forecast document; not a guarantee of results", "forecast disclaimer missing"),
]

# Forbidden loan-vs-investment confusion markers (blocking for family package).
# "no SAFE" / "no equity" / "no board seat" are POSITIVE callouts and allowed.
# Detection: a forbidden token only fails when it is NOT preceded by a negation
# marker (no, not, never, without, neither) within 24 characters.
_NEGATIONS = ("no ", "not ", "never ", "without ", "neither ")
def _is_forbidden(needle: str, text: str) -> bool:
    lowered = text.lower()
    nlow = needle.lower()
    i = 0
    while True:
        idx = lowered.find(nlow, i)
        if idx < 0:
            return False
        # check 24 chars before for negation
        prefix = lowered[max(0, idx - 24):idx]
        if not any(prefix.endswith(neg) for neg in _NEGATIONS):
            return True
        i = idx + len(nlow)
    return False

FORBIDDEN_MARKERS = [
    ("SAFE", "SAFE instrument language must not appear in family package"),
    ("equity stake", "equity stake language must not appear in family package"),
    ("valuation cap", "valuation cap language must not appear in family package"),
    ("post-money", "post-money language must not appear in family package"),
]

# Stale-fact markers (blocking for family package)
# Per PRP-A A-1: 6.75% / $13/hr / 7.9-13% are PRE-correction values.
# If any pre-correction value appears in the family package, the build is wrong.
STALE_FACT_PATTERNS = [
    ("6.75%", "stale Pinellas sales tax (6.75% pre-correction; correct value is 7.0%)"),
    ("6.75 %", "stale Pinellas sales tax (6.75% pre-correction; correct value is 7.0%)"),
    ("$13/hr", "stale FL min wage ($13/hr pre-correction; correct is $14/hr current, $15/hr 2026-09-30)"),
    ("$13 /hr", "stale FL min wage"),
    # Stale RANGE only -- bare "7.9" is a legitimate IBISWorld NAICS 561730
    # industry-average citation accepted by preflight.py CORRECTED_FACT_MARKERS.
    # The pre-correction framing was "7.9-13%" as a range; that RANGE is stale.
    ("7.9-13%", "stale landscaping net margin range (7.9-13% pre-correction; correct is 10-15% per NALP/IBISWorld 2026 bracketed benchmark)"),
    ("7.9 &ndash; 13%", "stale landscaping net margin range"),
    ("13% net", "ambiguous net margin -- use 10-15% range with NALP/IBISWorld citation, not a bare 13%"),
]

# Corrected-fact markers (blocking — must be present).
# Note: HTML source uses &ndash; for the en-dash in numeric ranges, so we
# match against BOTH the escaped form and the decoded form.
# Format: list of (alternatives, message). At least one alternative must appear.
CORRECTED_FACT_MARKERS = [
    (["7.0%"], "corrected Pinellas sales tax (7.0%) must appear"),
    (["10–15%", "10&ndash;15%"],
     "corrected industry net margin range (10–15%) must appear"),
    (["$14/hr", "$14 /hr", "$14 "],
     "current FL min wage ($14/hr) must appear OR explicit baseline reference"),
]


def _check_stale_facts(combined: str) -> list[str]:
    """Return blocking errors for any pre-correction fact in the combined artifact text."""
    errors = []
    lowered = combined.lower()
    for needle, msg in STALE_FACT_PATTERNS:
        if needle.lower() in lowered:
            errors.append(f"stale fact: {msg}")
    return errors


def _check_corrected_facts(combined: str) -> list[str]:
    """Return blocking errors for any missing corrected fact.

    Each CORRECTED_FACT_MARKERS entry is a tuple of (alternatives, message).
    The fact is satisfied if ANY alternative is present in `combined`.
    """
    errors = []
    for alternatives, msg in CORRECTED_FACT_MARKERS:
        if not any(alt in combined for alt in alternatives):
            errors.append(f"corrected fact: {msg}")
    return errors


def rebuild() -> None:
    """Rebuild the family cover letter + summary card HTML."""
    print("[build] family cover letter ...")
    r = subprocess.run([sys.executable, str(BUILD_COVER)], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    print(r.stdout.strip())

    print("[build] summary card ...")
    r = subprocess.run([sys.executable, str(BUILD_CARD)], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    print(r.stdout.strip())


def preflight() -> dict:
    """Run blocking preflight gates on the family cover letter + summary card.

    Returns dict with: ok (bool), errors (list[str]), warnings (list[str]),
                       size_kb (float).
    """
    errors: list[str] = []
    warnings: list[str] = []

    if not COVER_HTML.exists():
        return {"ok": False, "errors": [f"family cover letter missing: {COVER_HTML}"],
                "warnings": [], "size_kb": 0.0}
    if not CARD_HTML.exists():
        return {"ok": False, "errors": [f"summary card missing: {CARD_HTML}"],
                "warnings": [], "size_kb": 0.0}
    if not CONDENSED_PDF.exists():
        return {"ok": False, "errors": [f"condensed PDF missing: {CONDENSED_PDF}"],
                "warnings": [], "size_kb": 0.0}

    cover_raw = COVER_HTML.read_text(encoding="utf-8")
    card_raw = CARD_HTML.read_text(encoding="utf-8")

    size_kb = (len(cover_raw) + len(card_raw)) / 1024

    # Gmail-clip warning for the cover letter alone (102KB is the Gmail display cap)
    cover_kb = len(cover_raw) / 1024
    if cover_kb > 102:
        warnings.append(f"cover letter is {cover_kb:.1f}KB (Gmail display clips at 102KB; body will truncate in preview pane)")

    # Blocking: Gmail-strip patterns
    for needle, msg in BLOCKING_PATTERNS:
        if needle.lower() in cover_raw.lower() or needle.lower() in card_raw.lower():
            errors.append(msg)

    # Blocking: required content (loan structure framing)
    for needle, msg in REQUIRED_MARKERS:
        if needle not in cover_raw:
            errors.append(f"required: {msg}")

    # Blocking: forbidden equity-instrument language
    # Use _is_forbidden() so "no SAFE" / "no equity" / "no board seat" callouts
    # are NOT themselves forbidden (they are positive framing for the loan).
    for needle, msg in FORBIDDEN_MARKERS:
        if _is_forbidden(needle, cover_raw):
            errors.append(msg)

    # Blocking: stale-fact scan (no 6.75%, no $13/hr, no 7.9-13%)
    combined = cover_raw + "\n" + card_raw
    errors.extend(_check_stale_facts(combined))
    errors.extend(_check_corrected_facts(combined))

    return {"ok": len(errors) == 0, "errors": errors,
            "warnings": warnings, "size_kb": size_kb,
            "cover_kb": cover_kb}


def build_subject(args_subject: str | None = None) -> str:
    today = date.today().strftime("%Y-%m-%d")
    if args_subject:
        return f"{args_subject} \u2014 {today}"
    return f"Largo Lawn \u2014 business plan + loan request (Largo FL) \u2014 {today}"


def build_plain_text() -> str:
    """Plain-text fallback body. Mirrors the cover letter in linear form."""
    from datetime import timedelta as _td
    today = date.today()
    today_str = today.strftime("%B %d, %Y")
    due = (today + _td(days=7)).strftime("%B %d, %Y")
    return f"""Largo Lawn \u2014 business plan + loan request
({today_str})

I have a specific ask. Here are the receipts before I make it.

The business is solo home-services in Largo and Pinellas County:
residential lawn care, pet waste removal, and pressure washing.
I run every job myself \u2014 no employees in Year 1. The service area
is six ZIPs around our house; about 36,200 households, roughly
13,500 of whom already pay someone for lawn care.

The ask is $15,000 at 0% interest over 24 months, repaid monthly
from the business\u2019s free cash flow. This is a friendly loan, not
an investment \u2014 no equity, no SAFE, no stake, no board seat.
I\u2019m the personal obligor on the debt.

I\u2019m asking you because you\u2019ve been the one family member who\u2019s
asked the sharpest questions about every plan I\u2019ve ever brought
home. You\u2019ll read the numbers first.

What\u2019s in the package: (1) the condensed business plan (12 pages,
attached PDF) is the full case \u2014 market, pricing, funnel, unit
economics, three-year forecast. (2) the summary card (one page,
attached HTML \u2014 open in browser or print A4 portrait) is the
at-a-glance. (3) this letter is the ask.

How I\u2019ll pay it back: Year 1 baseline forecast is $62,100 gross
revenue / $16,590 net profit. Months 1\u20133 are reinvested in
equipment; monthly loan payments begin month 4 at $625/month,
totaling $15,000 by month 27. Fallback if the business underperforms:
I keep operating solo on a reduced scope (lawn-only, no marketing
spend, no pet waste / pressure washing); the loan is paid before
any owner draw. You are senior in the cash waterfall, not junior.

What I want from you: read the summary card first (5 minutes). If
the numbers hold up for you, read the condensed plan. Let me know
by {due} if you want to talk; I\u2019ll come to you, in person or by
phone.

Thanks,
Cameron

ATTACHMENTS (3)
  1. Largo Lawn Business Plan (condensed) \u2014 12-page PDF
  2. Largo Lawn Summary Card \u2014 one-page HTML, v2.0 (open in browser)
  3. This cover letter \u2014 HTML copy

--
Largo Lawn \u2014 Version 2.0 \u2014 Built {today_str}
Forecast document; not a guarantee of results.
"""


def send_one(to: str, subject: str, body_text: str, body_html: str,
             attachments: list[Path], dry_run: bool, force: bool = False) -> dict:
    """Send a single email via the OWL sender.

    Same subprocess pattern as send_business_plan.py. The OWL sender takes:
      --body / --body-file  -> PLAIN TEXT
      --html-file           -> rendered HTML body (multipart/alternative)
      --attach              -> file path (repeatable)
      --dry-run             -> log only
    """
    tmp_html = PROCUREMENT / ".tmp_family_body.html"
    tmp_html.write_text(body_html, encoding="utf-8")

    cmd = [
        sys.executable,
        str(OWL_SENDER),
        "--to", to,
        "--subject", subject,
        "--body", body_text,
        "--html-file", str(tmp_html),
    ]
    if attachments:
        cmd.append("--attach")
        for a in attachments:
            cmd.append(str(a))
    if dry_run:
        cmd.append("--dry-run")
    if force:
        cmd.append("--force")

    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"

    print(f"\n[send] to={to}")
    print(f"  subject: {subject}")
    print(f"  cmd: {' '.join(cmd[:8])} ... ({len(attachments)} attachment(s))")
    r = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if r.stdout:
        print(r.stdout)
    if r.stderr:
        print(r.stderr, file=sys.stderr)
    success = r.returncode == 0
    if tmp_html.exists():
        try:
            tmp_html.unlink()
        except OSError:
            pass
    return {"to": to, "success": success, "returncode": r.returncode}


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--to", nargs="+", default=None,
                    help="Recipient(s). Default: choblo@gmail.com")
    ap.add_argument("--subject", default=None, help="Override subject prefix")
    ap.add_argument("--send", action="store_true", help="Actually send (default: dry-run)")
    ap.add_argument("--build-only", action="store_true",
                    help="Rebuild artifacts only, do not send")
    ap.add_argument("--no-rebuild", action="store_true",
                    help="Don't rebuild; use what's in output/procurement/")
    ap.add_argument("--force", action="store_true",
                    help="Skip the OWL 24h dedup window")
    args = ap.parse_args()

    # 1. Build (unless told to skip)
    if not args.no_rebuild:
        rebuild()
    elif args.build_only:
        rebuild()

    if args.build_only:
        return 0

    # 2. Preflight
    print()
    pf = preflight()
    print(f"[preflight] cover={pf['cover_kb']:.1f}KB card+cover total={pf['size_kb']:.1f}KB")
    for w in pf["warnings"]:
        print(f"  [warn]  {w}")
    for e in pf["errors"]:
        print(f"  [FAIL]  {e}")
    if not pf["ok"]:
        print("\n[abort] preflight failed; refusing to send", file=sys.stderr)
        return 2

    # 3. Compose
    recipients = args.to or DEFAULT_RECIPIENTS
    subject = build_subject(args.subject)
    body_html = COVER_HTML.read_text(encoding="utf-8")
    body_text = build_plain_text()

    # 4. Attachments (order matters: condensed PDF first, then summary card, then cover letter)
    attachments: list[Path] = [
        CONDENSED_PDF,
        CARD_HTML,
        COVER_HTML,
    ]
    for a in attachments:
        print(f"[attach] {a.name} ({a.stat().st_size/1024:.1f} KB)")

    dry_run = not args.send
    if dry_run:
        print("\n[mode] DRY RUN (use --send to actually deliver)")
    else:
        print("\n[mode] LIVE SEND")

    # 5. Send
    results = []
    for to in recipients:
        results.append(send_one(to, subject, body_text, body_html,
                                attachments, dry_run, args.force))

    print("\n[summary]")
    for r in results:
        status = "OK" if r["success"] else f"FAILED (rc={r['returncode']})"
        print(f"  {r['to']:30s}  {status}")
    n_ok = sum(1 for r in results if r["success"])
    return 0 if n_ok == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())