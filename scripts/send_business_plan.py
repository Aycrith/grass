#!/usr/bin/env python3
r"""
GRASS Business Plan Sender
==========================

Sends the GRASS Mission 1 business plan via Gmail SMTP using the OWL sender
(C:/Users/camer/DEVNEW/resumeStuff/scripts/send_email.py).

Pattern:
  - HTML body:  the cover letter (well under Gmail's 102KB clip threshold)
  - Attachment: the full plan as PDF (always renders correctly in every client)
  - HTML is also attached as a secondary attachment for browser viewing

Why PDF, not HTML?
  Gmail has a long-standing bug where attached .html files sometimes display
  the raw quoted-printable source instead of rendering the page. PDF always
  works. The GarbageGoober project documented this exact failure mode
  (lines 213-217 of their send_procurement_email.py).

Usage:
    python scripts/send_business_plan.py                              # dry-run, default recipient
    python scripts/send_business_plan.py --to someone@gmail.com      # send to one
    python scripts/send_business_plan.py --to a@x.com b@y.com c@z.com  # send to many
    python scripts/send_business_plan.py --send                        # actually send
    python scripts/send_business_plan.py --attach-html                 # also attach the HTML version
    python scripts/send_business_plan.py --pdf-only                   # PDF only, no HTML
    python scripts/send_business_plan.py --build-only                 # rebuild HTML + PDF only
    python scripts/send_business_plan.py --subject "Custom subject"   # override subject

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

ROOT = Path(__file__).resolve().parent.parent
PROCUREMENT = ROOT / "output" / "procurement"
BUILD_FULL = ROOT / "scripts" / "build_business_plan.py"
BUILD_COVER = ROOT / "scripts" / "build_business_plan_cover_letter.py"
OWL_SENDER = Path(r"C:/Users/camer/DEVNEW/resumeStuff/scripts/send_email.py")

COVER_HTML = PROCUREMENT / "business_plan_grass_cover_letter.html"
FULL_HTML = PROCUREMENT / "business_plan_grass_mission1.html"
GMAIL_HTML = PROCUREMENT / "business_plan_grass_mission1_gmail.html"
FULL_PDF = PROCUREMENT / "business_plan_grass_mission1.pdf"

# v3.0 paths (investor-grade plan)
V3_HTML = PROCUREMENT / "business_plan_grass_v3.0.html"
V3_PDF = PROCUREMENT / "business_plan_grass_v3.0.pdf"
V3_COVER = PROCUREMENT / "business_plan_grass_v3.0_cover.html"
BUILD_V3 = ROOT / "scripts" / "build_business_plan_v3.py"
BUILD_V3_PDF = ROOT / "scripts" / "build_business_plan_v3_pdf.py"

DEFAULT_RECIPIENTS = ["choblo@gmail.com"]


def rebuild_html() -> None:
    print("[build] rebuilding full business plan ...")
    r = subprocess.run([sys.executable, str(BUILD_FULL)], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    print(r.stdout.strip())

    print("[build] rebuilding cover letter ...")
    r = subprocess.run([sys.executable, str(BUILD_COVER)], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    print(r.stdout.strip())


def rebuild_v3() -> None:
    """Rebuild v3.0 HTML + PDF + cover."""
    print("[build] rebuilding v3.0 business plan ...")
    r = subprocess.run([sys.executable, str(BUILD_V3)], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    print(r.stdout.strip())

    print("[build] rebuilding v3.0 PDF ...")
    r = subprocess.run([sys.executable, str(BUILD_V3_PDF)], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  ERROR: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    print(r.stdout.strip())


def run_v3_send(args) -> int:
    """Run preflight + facts-check + OWL send for v3.0 mode."""
    # Preflight the v3 HTML
    pf_r = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "preflight.py"), str(V3_HTML), "--require-corrected"],
        capture_output=True, text=True,
    )
    print(pf_r.stdout)
    if pf_r.returncode != 0:
        print("\n[abort] preflight failed", file=sys.stderr)
        return 2

    # Facts-check the v3 HTML
    fc_r = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build_facts_check.py"),
         "--artifact", str(V3_HTML), "--scope", "family-package-v3"],
        capture_output=True, text=True,
    )
    print(fc_r.stdout)
    if fc_r.returncode != 0:
        print("\n[abort] facts-check failed", file=sys.stderr)
        return 3

    # Build cover letter body (use v3 cover or a generic subject)
    today = date.today().strftime("%Y-%m-%d")
    subject = args.subject if args.subject else f"GRASS v3.0 Investor Plan — {today}"
    body_text = (
        "Attached: GRASS v3.0 investor-grade business plan (12 pages).\n"
        "Primary: PDF (always renders correctly).\n"
        "Secondary: HTML (for browser viewing).\n\n"
        "--\nGRASS | Steward (founder) | confidential"
    )

    if not V3_COVER.exists():
        # Fall back to v3 HTML body if no separate cover exists
        body_html = V3_HTML.read_text(encoding="utf-8") if V3_HTML.exists() else ""
    else:
        body_html = V3_COVER.read_text(encoding="utf-8")

    # Build attachments: PDF + optional HTML + any extra files via --attach-extra
    attachments = [V3_PDF] if V3_PDF.exists() else []
    if args.attach_html and V3_HTML.exists():
        attachments.append(V3_HTML)
    for extra in args.attach_extra or []:
        from pathlib import Path as _Path
        extra_path = _Path(extra)
        if extra_path.exists():
            attachments.append(extra_path)
        else:
            print(f"[warn] --attach-extra file not found: {extra}", file=sys.stderr)

    recipients = args.to or DEFAULT_RECIPIENTS
    results = []
    for to in recipients:
        dry_run = not args.send or args.mode_test
        r = send_one(
            to=to,
            subject=subject,
            body_text=body_text,
            body_html=body_html,
            attachments=attachments,
            dry_run=dry_run,
            force=args.force,
        )
        results.append(r)
        if not r["success"]:
            print(f"  [fail] {to}: exit {r['returncode']}")
            return 4

    n = len(results)
    print(f"\n[summary] {n}/{n} ok (dry_run={not args.send or args.mode_test})")
    return 0


def preflight(p: Path) -> dict:
    """Light preflight: size + structural sanity for the cover letter."""
    if not p.exists():
        return {"ok": False, "errors": [f"file not found: {p}"]}
    raw = p.read_text(encoding="utf-8")
    size_kb = len(raw) / 1024
    errors = []
    if size_kb > 102:
        errors.append(f"size {size_kb:.1f}KB exceeds Gmail 102KB display threshold (will clip preview, but full content viewable)")
    if "<script" in raw.lower():
        errors.append("contains <script> tag (Gmail strips)")
    if "background-image" in raw.lower() or "background:url" in raw.lower():
        errors.append("contains background-image (Gmail strips)")
    if "position:absolute" in raw.lower() or "position: fixed" in raw.lower():
        errors.append("contains position:absolute/fixed (Gmail strips)")
    return {"ok": len([e for e in errors if "exceeds Gmail" not in e]) == 0,
            "errors": errors,
            "size_kb": size_kb,
            "tables": raw.count("<table"),
            "inline_imgs": raw.count("<img")}


def build_subject(extra: str | None = None) -> str:
    today = date.today().strftime("%Y-%m-%d")
    base = f"GRASS Mission 1 Business Plan (Largo FL) \u2014 {today}"
    if extra:
        return f"{extra} \u2014 {base}"
    return base


def build_plain_text(attachments: list[str] | None) -> str:
    today = date.today().strftime("%B %d, %Y")
    lines = [
        f"GRASS \u2014 Mission 1 Business Plan  ({today})",
        "",
        "EXECUTIVE SUMMARY",
        "-----------------",
        "",
        "A solo founder in Largo FL, working under a written constitution with thirteen AI agents,",
        "can operate a real home-services business at a $200/month infrastructure ceiling, break",
        "even by Month 3, generate $5,000 of MRR by Month 12, and exit Year 1 with both $16,000",
        "of net operating cash and a reusable operating system that compresses the launch cost of",
        "every future mission by 70-90%.",
        "",
        "The lawn is the receipt. The operating system is the asset.",
        "",
        "KEY NUMBERS",
        "-----------",
        "  TAM (6-ZIP service area) ............... $3-5M annual",
        "  Year-1 LTV per weekly customer ......... $1,387",
        "  Gross margin per customer .............. 74%",
        "  MRR projection (Month 12, baseline) .... $5,175",
        "  Year-1 net profit (baseline) ........... $16,590",
        "  Monthly infra ceiling (Mo 0-6) ......... $200",
        "",
        "FULL PLAN",
        "---------",
        "",
    ]
    if attachments:
        if len(attachments) == 1:
            lines.append(f"The full 15-section business plan is attached as: {attachments[0]}")
            lines.append("Open the attachment in any PDF reader (Adobe Acrobat, Preview, browser)")
            lines.append("for the full editorial experience (cover image, service-area map, growth")
            lines.append("chart, org chart, all 84 tables). 26 pages, ~670 KB.")
        else:
            lines.append("Two versions of the full 15-section business plan are attached:")
            for a in attachments:
                lines.append(f"  - {a}")
            lines.append("")
            lines.append("The PDF is the primary attachment (always renders correctly).")
            lines.append("The HTML version is for browser viewing if you want the interactive feel.")
    else:
        lines.append("The full 15-section business plan HTML is in the body of this email.")
        lines.append("If Gmail clips the preview, click 'View entire message' to see all 15 sections.")
    lines += [
        "",
        "Every claim in the plan traces to a file in the GRASS repository. The document is",
        "self-contained (no external dependencies) and all images are embedded.",
        "",
        "Sources & live artifacts:",
        "  - research/market/largo-market-size.md         (TAM/SAM/SOM)",
        "  - research/market/largo-pricing-reality.md     (live Largo FL pricing)",
        "  - research/market/profitability-roadmap.md     (dollar-by-dollar projection)",
        "  - research/pricing/price-book.yaml             (authoritative price ladder)",
        "  - research/regulatory/largo-licensing-map.yaml (FL regulatory map)",
        "  - research/seo/largo-keyword-map.md            (100-keyword SEO universe)",
        "  - research/mission-2/candidates.md             (Mission 2 candidate set)",
        "  - constitution/01-constitution.md             (immutable principles)",
        "  - governance/decisions/                       (every Decision Template entry)",
        "",
        "--",
        "GRASS | Steward (founder) | confidential",
    ]
    return "\n".join(lines)


def send_one(to: str, subject: str, body_text: str, body_html: str,
             attachments: list[Path], dry_run: bool, force: bool = False) -> dict:
    """Send a single email via the OWL sender.

    The OWL sender has TWO body flags:
      --body / --body-file  -> loaded as PLAIN TEXT
      --html-file           -> loaded as HTML, sent as multipart/alternative with
                               Content-Type: text/html
    Using --body-file for HTML would make Gmail render the raw source. Always
    pass HTML via --html-file.
    """
    # Write the cover letter to a temp file so OWL can read it via --html-file.
    tmp_html = PROCUREMENT / ".tmp_body.html"
    tmp_html.write_text(body_html, encoding="utf-8")

    cmd = [
        sys.executable,
        str(OWL_SENDER),
        "--to", to,
        "--subject", subject,
        "--body", body_text,                # plain-text fallback
        "--html-file", str(tmp_html),      # rendered HTML body
    ]
    if attachments:
        cmd.append("--attach")
        for a in attachments:
            cmd.append(str(a))
    if dry_run:
        cmd.append("--dry-run")
    if force:
        cmd.append("--force")

    # GarbageGoober pattern: force UTF-8 stdout so the OWL print-after-send
    # step doesn't crash on emojis in the Windows cp1252 console.
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"

    print(f"\n[send] to={to}")
    print(f"  cmd: {' '.join(cmd[:7])} ... ({len(attachments)} attachment(s))")
    r = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if r.stdout:
        print(r.stdout)
    if r.stderr:
        print(r.stderr, file=sys.stderr)
    success = r.returncode == 0
    # cleanup temp
    if tmp_html.exists():
        try:
            tmp_html.unlink()
        except OSError:
            pass
    return {"to": to, "success": success, "returncode": r.returncode}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--to", nargs="+", default=None, help="Recipient(s). Default: choblo@gmail.com")
    ap.add_argument("--subject", default=None, help="Custom subject prefix")
    ap.add_argument("--send", action="store_true", help="Actually send (default: dry-run)")
    ap.add_argument("--build-only", action="store_true", help="Rebuild HTML + PDF only, do not send")
    ap.add_argument("--attach-html", action="store_true", help="Also attach the full HTML plan (PDF is the default)")
    ap.add_argument("--pdf-only", action="store_true", help="Attach only the PDF, skip HTML even if --attach-html was given")
    ap.add_argument("--attach-extra", nargs="+", default=[],
                    help="Extra files to attach beyond the v3 PDF (e.g., a hero image). Multiple paths allowed.")
    ap.add_argument("--no-rebuild", action="store_true", help="Don't rebuild HTML/PDF; use what's there")
    ap.add_argument("--force", action="store_true", help="Skip the OWL 24h dedup window")
    ap.add_argument("--mode", choices=["mission1", "v3"], default="mission1",
                    help="Which plan to send (default: mission1). v3 = investor-grade v3.0 plan.")
    ap.add_argument("--mode-test", action="store_true",
                    help="Force --send to use dry-run via the OWL sender (always set in test mode).")
    args = ap.parse_args()

    if args.mode == "v3":
        # v3 build path: builder + PDF builder, no cover letter rebuild (the v3 builder
        # emits its own cover via build_business_plan_v3.py).
        if not args.no_rebuild:
            rebuild_v3()
        if args.build_only:
            return 0
        # v3 preflight + send
        return run_v3_send(args)

    if not args.no_rebuild and not args.build_only:
        rebuild_html()
    elif args.build_only:
        rebuild_html()
        # Also build the PDF
        print()
        r = subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "build_business_plan_pdf.py")],
            capture_output=True, text=True,
        )
        if r.returncode == 0:
            print(r.stdout.strip())
        else:
            print(f"[warn] pdf build failed: {r.stderr}", file=sys.stderr)
        return 0

    # Preflight the cover letter
    pf = preflight(COVER_HTML)
    print(f"\n[preflight] cover letter: {pf['size_kb']:.1f}KB, {pf['tables']} tables, "
          f"{pf['inline_imgs']} inline images")
    for e in pf["errors"]:
        print(f"  - {e}")
    if not pf["ok"]:
        print("\n[abort] preflight failed", file=sys.stderr)
        return 2

    recipients = args.to or DEFAULT_RECIPIENTS
    subject = build_subject(args.subject)
    body_html = COVER_HTML.read_text(encoding="utf-8")

    # Build the PDF if it doesn't exist or is older than the HTML
    if not args.no_rebuild:
        if not FULL_PDF.exists() or FULL_PDF.stat().st_mtime < FULL_HTML.stat().st_mtime:
            print()
            r = subprocess.run(
                [sys.executable, str(ROOT / "scripts" / "build_business_plan_pdf.py")],
                capture_output=True, text=True,
            )
            if r.returncode != 0:
                print(f"[warn] pdf build failed: {r.stderr}", file=sys.stderr)

    attachments: list[Path] = []
    if not args.pdf_only:
        # PDF is the default attachment (Gmail HTML-attachment bug workaround)
        if FULL_PDF.exists():
            attachments.append(FULL_PDF)
            print(f"[attach] {FULL_PDF.name} ({FULL_PDF.stat().st_size/1024:.1f} KB) — primary, always renders")
        else:
            print(f"[warn] PDF not found: {FULL_PDF}; falling back to HTML", file=sys.stderr)
            if FULL_HTML.exists():
                attachments.append(FULL_HTML)
                print(f"[attach] {FULL_HTML.name} ({FULL_HTML.stat().st_size/1024:.1f} KB) — fallback")
        if args.attach_html and FULL_HTML.exists():
            attachments.append(FULL_HTML)
            print(f"[attach] {FULL_HTML.name} ({FULL_HTML.stat().st_size/1024:.1f} KB) — secondary, for browser viewing")

    # Build the plain text body to mention the attachments
    attachment_names = [a.name for a in attachments]
    body_text = build_plain_text(attachment_names)

    dry_run = not args.send
    if dry_run:
        print("\n[mode] DRY RUN (use --send to actually deliver)")
    else:
        print("\n[mode] LIVE SEND")

    results = []
    for to in recipients:
        results.append(send_one(to, subject, body_text, body_html, attachments, dry_run, args.force))

    print("\n[summary]")
    for r in results:
        status = "OK" if r["success"] else f"FAILED (rc={r['returncode']})"
        print(f"  {r['to']:30s}  {status}")
    n_ok = sum(1 for r in results if r["success"])
    return 0 if n_ok == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
