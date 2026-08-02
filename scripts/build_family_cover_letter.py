#!/usr/bin/env python3
"""
Build the family cover letter for the Largo Lawn seed-loan package.

Output: output/procurement/business_plan_grass_family_cover_letter.html

Tone (per founder brief 2026-07-28):
  - "Show me the receipts" family member, not "tell me about your dream".
  - Direct, all-business. No warmth hedge.
  - Lead with the receipts; the ask comes second; the relationship is last.

The condensed PDF has the warmth. This letter has the business case.
"""
from __future__ import annotations

import datetime as dt
from pathlib import Path

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
OUT = ROOT / "output" / "procurement" / "business_plan_grass_family_cover_letter.html"

GREEN = "#1F4E2C"
SAND = "#C49A6C"
CHARCOAL = "#1A1A1A"
CREAM = "#FAF6F0"
INK = "#222222"
MUTED = "#6B6B6B"
RULE = "#E5DED0"
LIGHT_SAND = "#F4E5D0"

GLOBAL_TD = (
    "font-family:Georgia,'Times New Roman',serif;"
    "line-height:1.55;font-size:16px;color:" + INK + ";"
)

today = dt.date.today().strftime("%B %d, %Y")
due = (dt.date.today() + dt.timedelta(days=7)).strftime("%B %d, %Y")


def html() -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Largo Lawn &mdash; Business plan + loan request</title>
</head>
<body style="margin:0;padding:0;background:{CREAM};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
         style="background:{CREAM};">
    <tr><td align="center" style="padding:32px 24px;">
      <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0">
        <tr><td style="{GLOBAL_TD}">

          <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;
                      color:{SAND};font-weight:700;margin-bottom:14px;">
            Largo Lawn &middot; Largo &amp; Pinellas County, FL
          </div>

          <h1 style="margin:0 0 14px 0;font-family:Georgia,serif;
                     font-size:24px;line-height:1.2;font-weight:700;color:{GREEN};">
            Business plan + loan request.
          </h1>

          <p style="margin:0 0 14px 0;">
            I have a specific ask. Here are the receipts before I make it.
          </p>

          <p style="margin:0 0 14px 0;">
            The business is solo home-services in Largo and Pinellas County:
            residential lawn care, pet waste removal, and pressure washing.
            I run every job myself &mdash; no employees in Year 1. The
            service area is six ZIPs around our house; about 36,200
            households, roughly 13,500 of whom already pay someone for
            lawn care.
          </p>

          <p style="margin:0 0 14px 0;">
            The ask is <strong>$15,000 at 0% interest over 24 months</strong>,
            repaid monthly from the business&rsquo;s free cash flow. This
            is a <strong>friendly loan, not an investment</strong> &mdash;
            no equity, no SAFE, no stake, no board seat. I&rsquo;m the
            personal obligor on the debt.
          </p>

          <p style="margin:0 0 14px 0;">
            I&rsquo;m asking you because you&rsquo;ve been the one
            family member who&rsquo;s asked the sharpest questions about
            every plan I&rsquo;ve ever brought home. You&rsquo;ll read
            the numbers first.
          </p>

          <p style="margin:0 0 14px 0;">
            What&rsquo;s in the package: <strong>(1)</strong> the condensed
            business plan (12 pages, attached PDF) is the full case
            &mdash; market, pricing, funnel, unit economics, three-year
            forecast. <strong>(2)</strong> the summary card (one page,
            attached HTML &mdash; open in browser or print A4 landscape)
            is the at-a-glance. <strong>(3)</strong> this letter is the ask.
          </p>

          <p style="margin:0 0 14px 0;">
            How I&rsquo;ll pay it back: Year 1 baseline forecast is
            <strong>$62,100 gross revenue / $16,590 net profit</strong>.
            Months 1&ndash;3 are reinvested in equipment; monthly loan
            payments begin month 4 at <strong>$625/month</strong>,
            totaling $15,000 by month 24. <strong>Fallback if the
            business underperforms:</strong> I keep operating solo on a
            reduced scope (lawn-only, no marketing spend, no pet waste /
            pressure washing); the loan is paid before any owner draw
            or any discretionary spend. You are senior in the cash
            waterfall, not junior.
          </p>

          <p style="margin:0 0 14px 0;">
            What I want from you: read the summary card first
            (5 minutes). If the numbers hold up for you, read the
            condensed plan. Let me know by <strong>{due}</strong> if you
            want to talk; I&rsquo;ll come to you, in person or by phone.
          </p>

          <p style="margin:18px 0 4px 0;">
            Thanks,
          </p>
          <p style="margin:0;font-size:18px;font-weight:700;color:{GREEN};">
            Cameron
          </p>

          <hr style="border:none;border-top:1px solid {RULE};margin:28px 0 10px 0;" />
          <p style="font-size:11px;color:{MUTED};margin:0;">
            Largo Lawn &middot; Version 2.0 &middot; Built {today} &middot;
            Forecast document; not a guarantee of results.
          </p>

        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html(), encoding="utf-8")
    size_kb = OUT.stat().st_size / 1024
    print(f"[ok] wrote {OUT} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()