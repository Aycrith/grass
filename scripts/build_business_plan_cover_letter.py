#!/usr/bin/env python3
"""
Build the GRASS business-plan cover-letter email.

This is the "single-screen" executive summary that goes in the email body.
It's intentionally short (target < 100KB so Gmail does not clip it) and links
to the full HTML plan (which is attached separately or delivered as a separate
file the recipient opens in a browser).

Output:
  output/procurement/business_plan_grass_cover_letter.html
"""
from __future__ import annotations

import base64
import datetime as dt
import os
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
ASSETS = ROOT / "output" / "assets"
OUT_HTML = ROOT / "output" / "procurement" / "business_plan_grass_cover_letter.html"


def b64_image(rel_path: str) -> str:
    """Return a data: URL for a local image. Uses _web suffix for fidelity."""
    p = ASSETS / rel_path
    if not p.exists():
        print(f"[warn] missing image: {p}", file=sys.stderr)
        return ""
    raw = p.read_bytes()
    mime = "image/jpeg" if p.suffix.lower() in (".jpg", ".jpeg") else "image/png"
    b64 = base64.b64encode(raw).decode("ascii")
    return f"data:{mime};base64,{b64}"


# Brand tokens
GREEN = "#1F4E2C"
SAND = "#D4A574"
SKY = "#3B7DD8"
CHARCOAL = "#1A1A1A"
CREAM = "#FAF6F0"
INK = "#222"
MUTED = "#6B6B6B"
RULE = "#E5DED0"
GLOBAL_TD = (
    f"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;"
    f"line-height:1.55;font-size:15px;"
)


def cover_image() -> str:
    """Skip the full hero image (130KB base64) — use a CSS-only band instead.

    The cover image is in the attached full plan; the cover letter stays under Gmail's
    102KB display threshold. Flat background (Gmail may strip gradients).
    """
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{CHARCOAL};">
      <tr><td style="padding:48px 48px 56px 48px;{GLOBAL_TD}color:{CREAM};">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{SAND};margin-bottom:18px;font-weight:700;">
          Investor-Ready Business Plan
        </div>
        <div style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8FA88A;margin-bottom:22px;">
          {dt.date.today().strftime("%B %Y")} &middot; Mission 1
        </div>
        <h1 style="margin:0 0 14px 0;font-family:Inter,sans-serif;font-size:40px;line-height:1.05;font-weight:700;color:{CREAM};letter-spacing:-0.015em;">
          GRASS
        </h1>
        <p style="margin:0 0 6px 0;font-size:18px;line-height:1.4;color:{CREAM};font-weight:600;max-width:640px;">
          An autonomous AI organization that repeatedly launches, operates, and improves real businesses.
        </p>
        <p style="margin:14px 0 0 0;font-size:15px;line-height:1.55;color:#D9D2C5;max-width:640px;">
          A self-funding proof-of-concept. Landscaping in Largo, Florida is the first product off the line.
        </p>
        <div style="margin-top:28px;padding-top:18px;border-top:1px solid #2A2A2A;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding-right:30px;color:#9A9A9A;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;width:140px;">Prepared for</td>
              <td style="color:{CREAM};font-size:13px;">Sole investor (the founder)</td>
            </tr>
            <tr>
              <td style="padding-top:4px;padding-right:30px;color:#9A9A9A;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Entity</td>
              <td style="padding-top:4px;color:{CREAM};font-size:13px;">Sole prop &rarr; FL LLC at $500 cash gate</td>
            </tr>
            <tr>
              <td style="padding-top:4px;padding-right:30px;color:#9A9A9A;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Service area</td>
              <td style="padding-top:4px;color:{CREAM};font-size:13px;">Largo FL 33771 + 5 adjacent ZIPs</td>
            </tr>
            <tr>
              <td style="padding-top:4px;padding-right:30px;color:#9A9A9A;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Year-1 ask</td>
              <td style="padding-top:4px;color:{CREAM};font-size:13px;">$0 incremental capital &middot; reinvests cash from Month 3</td>
            </tr>
          </table>
        </div>
      </td></tr>
    </table>
    """


def header_block() -> str:
    # The cover image now IS the header block; keep this as a no-op for back-compat.
    return ""


def executive_summary() -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CREAM};">
      <tr><td style="padding:32px 48px 8px 48px;{GLOBAL_TD};">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{SAND};font-weight:700;margin-bottom:8px;">01 &middot; Executive Summary</div>
        <h2 style="margin:0 0 14px 0;font-family:Inter,sans-serif;font-size:22px;line-height:1.2;font-weight:700;color:{GREEN};">
          The one-paragraph answer
        </h2>
        <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:{INK};">
          A solo founder in Largo FL, working under a written constitution with thirteen AI agents, can operate a real
          home-services business at a $200/month infrastructure ceiling, break even by Month 3, generate $5,000 of MRR
          by Month 12, and exit Year 1 with both $16,000 of net operating cash and a reusable operating system that
          compresses the launch cost of every future mission by 70&ndash;90%.
        </p>
        <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:{INK};">
          The lawn is the receipt. The operating system is the asset.
        </p>

        <table role="presentation" width="100%" cellspacing="6" cellpadding="0" border="0" style="margin:6px 0 6px 0;">
          <tr>
            <td valign="top" style="padding:14px 12px;width:33%;background:#FFFFFF;border:1px solid {RULE};border-radius:6px;">
              <div style="font-family:Inter,sans-serif;font-size:24px;line-height:1;font-weight:700;color:{GREEN};">$3&ndash;5M</div>
              <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};margin-top:6px;">TAM (6-ZIP service area)</div>
            </td>
            <td valign="top" style="padding:14px 12px;width:33%;background:#FFFFFF;border:1px solid {RULE};border-radius:6px;">
              <div style="font-family:Inter,sans-serif;font-size:24px;line-height:1;font-weight:700;color:{GREEN};">$1,387</div>
              <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};margin-top:6px;">Year-1 LTV / customer</div>
            </td>
            <td valign="top" style="padding:14px 12px;width:33%;background:#FFFFFF;border:1px solid {RULE};border-radius:6px;">
              <div style="font-family:Inter,sans-serif;font-size:24px;line-height:1;font-weight:700;color:{GREEN};">74%</div>
              <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};margin-top:6px;">Gross margin / customer</div>
            </td>
          </tr>
          <tr>
            <td valign="top" style="padding:14px 12px;width:33%;background:#FFFFFF;border:1px solid {RULE};border-radius:6px;">
              <div style="font-family:Inter,sans-serif;font-size:24px;line-height:1;font-weight:700;color:{GREEN};">$5,175</div>
              <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};margin-top:6px;">MRR projection (Month 12)</div>
            </td>
            <td valign="top" style="padding:14px 12px;width:33%;background:#FFFFFF;border:1px solid {RULE};border-radius:6px;">
              <div style="font-family:Inter,sans-serif;font-size:24px;line-height:1;font-weight:700;color:{GREEN};">$16.6K</div>
              <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};margin-top:6px;">Year-1 net profit (baseline)</div>
            </td>
            <td valign="top" style="padding:14px 12px;width:33%;background:#FFFFFF;border:1px solid {RULE};border-radius:6px;">
              <div style="font-family:Inter,sans-serif;font-size:24px;line-height:1;font-weight:700;color:{GREEN};">$200</div>
              <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};margin-top:6px;">Monthly infra ceiling (Mo 0&ndash;6)</div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    """


def what_youre_buying() -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CREAM};">
      <tr><td style="padding:24px 48px 8px 48px;{GLOBAL_TD};">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{SAND};font-weight:700;margin-bottom:8px;">02 &middot; What the investor is buying</div>
        <h2 style="margin:0 0 14px 0;font-family:Inter,sans-serif;font-size:22px;line-height:1.2;font-weight:700;color:{GREEN};">
          Three returns, one commitment
        </h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0;">
          <tr>
            <td valign="top" style="width:33%;padding:0 10px 0 0;">
              <div style="font-family:Inter,sans-serif;font-size:14px;font-weight:700;color:{GREEN};margin-bottom:4px;">Cash</div>
              <p style="margin:0;font-size:13px;line-height:1.5;color:{INK};">
                A working solo-operator lawn-care business generating $40&ndash;60K Year-1 net, scaling to $80&ndash;100K by
                Year 2 as the customer base compounds.
              </p>
            </td>
            <td valign="top" style="width:33%;padding:0 10px;border-left:1px solid {RULE};border-right:1px solid {RULE};">
              <div style="font-family:Inter,sans-serif;font-size:14px;font-weight:700;color:{GREEN};margin-bottom:4px;">Capability</div>
              <p style="margin:0;font-size:13px;line-height:1.5;color:{INK};">
                A reusable AI operating system &mdash; lead capture, scheduling, routing, invoicing, governance, knowledge
                &mdash; that drops Mission 2 launch cost by 70&ndash;90%.
              </p>
            </td>
            <td valign="top" style="width:33%;padding:0 0 0 10px;">
              <div style="font-family:Inter,sans-serif;font-size:14px;font-weight:700;color:{GREEN};margin-bottom:4px;">Optionality</div>
              <p style="margin:0;font-size:13px;line-height:1.5;color:{INK};">
                A proven playbook for evaluating Mission 2, Mission 3, and beyond. The pre-computed candidate set is
                documented and waiting on 12 months of Mission 1 data.
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
    """


def highlights() -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CREAM};">
      <tr><td style="padding:24px 48px 8px 48px;{GLOBAL_TD};">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{SAND};font-weight:700;margin-bottom:8px;">03 &middot; The plan in 12 highlights</div>
        <h2 style="margin:0 0 14px 0;font-family:Inter,sans-serif;font-size:22px;line-height:1.2;font-weight:700;color:{GREEN};">
          What's inside
        </h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px 0;border-collapse:collapse;">
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#FFFFFF;border:1px solid {RULE};width:30%;font-weight:700;color:{GREEN};">1. Mission 1 service area</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#FFFFFF;border:1px solid {RULE};border-left:none;">Largo FL 33771 + 5 adjacent ZIPs (33770, 33773, 33774, 33778, 33756). 36,200 households, 13,500 active lawn-care buyers.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#F6F1E7;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">2. Service line at launch</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#F6F1E7;border:1px solid {RULE};border-top:none;border-left:none;">Landscaping without fertilizer, irrigation, or pest control &mdash; until respective licenses are acquired.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#FFFFFF;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">3. Pricing reality</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#FFFFFF;border:1px solid {RULE};border-top:none;border-left:none;">$48/visit weekly for a 1/4-acre lot &mdash; mid-tier vs. aggregators. Same price as LawnGuru/Y Sunday, real local operator.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#F6F1E7;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">4. Marketing &amp; distribution</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#F6F1E7;border:1px solid {RULE};border-top:none;border-left:none;">$0 cash through Month 3; $775 of free ad credits across Google/Meta/Microsoft/Yelp/NextDoor/Thumbtack.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#FFFFFF;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">5. Tech stack</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#FFFFFF;border:1px solid {RULE};border-top:none;border-left:none;">Next.js 15 + Supabase + Stripe + Vercel + Mapbox + Resend. $200/mo infra ceiling. No hires through Month 6.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#F6F1E7;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">6. Operating model</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#F6F1E7;border:1px solid {RULE};border-top:none;border-left:none;">Solo founder + 13 AI agents under a written constitution. Authority limits codified. Bus factor = 1 by design.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#FFFFFF;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">7. Year-1 financials</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#FFFFFF;border:1px solid {RULE};border-top:none;border-left:none;">Pessimistic $7.8K net / Baseline $16.6K / Stretch $44K. Breakeven Month 3 (single-month) / Month 4&ndash;5 (cumulative).</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#F6F1E7;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">8. Cash-ladder triggers</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#F6F1E7;border:1px solid {RULE};border-top:none;border-left:none;">$500 → Sunbiz + EIN + DR-1. $1K → BTRs. $2.5K → GL insurance. $5K → equipment + first-hire ADR trigger.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#FFFFFF;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">9. Governance &amp; risk</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#FFFFFF;border:1px solid {RULE};border-top:none;border-left:none;">Written constitution, Decision Templates for every irreversible decision, risk register re-ranked weekly.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#F6F1E7;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">10. The web app</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#F6F1E7;border:1px solid {RULE};border-top:none;border-left:none;">14-section editorial landing at largolawn.pro, Lighthouse Performance 0.93 / SEO 0.92, Playwright visual regression.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#FFFFFF;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">11. Mission 2 candidates</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#FFFFFF;border:1px solid {RULE};border-top:none;border-left:none;">Pool Service (79%) / Pressure Washing (74%) / Pet Waste Removal (79%) &mdash; pre-scored, Month 10 re-validation.</td>
          </tr>
          <tr>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;background:#F6F1E7;border:1px solid {RULE};border-top:none;width:30%;font-weight:700;color:{GREEN};">12. Compounding</td>
            <td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:#F6F1E7;border:1px solid {RULE};border-top:none;border-left:none;">Mission 2 launch at 30% of Mission 1 cost. Mission 3 at 20%. By Year 5: 3-mission portfolio, $250K+ net, 1 human.</td>
          </tr>
        </table>
      </td></tr>
    </table>
    """


def cta_block(attachment_note: str) -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{GREEN};">
      <tr><td style="padding:28px 48px;{GLOBAL_TD};color:{CREAM};">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{SAND};font-weight:700;margin-bottom:8px;">04 &middot; The full plan</div>
        <h2 style="margin:0 0 12px 0;font-family:Inter,sans-serif;font-size:22px;line-height:1.2;font-weight:700;color:{CREAM};">
          All 15 sections, 84 tables, fully cited
        </h2>
        <p style="margin:0 0 12px 0;font-size:14px;line-height:1.55;color:#D9D2C5;max-width:640px;">
          The full 15-section business plan &mdash; market sizing, unit economics, marketing, operations, technology, governance,
          financials, roadmap, future missions, the ask, risks, and the closing &mdash; is attached as
          <code style="background:#244A30;padding:1px 5px;border-radius:3px;font-size:12px;color:{SAND};">{attachment_note}</code>
          (PDF, 26 pages, ~670 KB). Open in any PDF reader &mdash; Adobe Acrobat, Preview, your browser, even your phone.
        </p>
        <p style="margin:0 0 0 0;font-size:13px;line-height:1.55;color:#A8A29A;max-width:640px;">
          Every claim traces to a file in the GRASS repository. The document is self-contained (no external dependencies) and
          all images are embedded.
        </p>
      </td></tr>
    </table>
    """


def footer() -> str:
    today = dt.date.today().strftime("%Y-%m-%d")
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CHARCOAL};">
      <tr><td style="padding:24px 48px;{GLOBAL_TD};color:#9A9A9A;">
        <p style="margin:0 0 6px 0;font-size:12px;line-height:1.5;color:#C8C2B5;">
          GRASS &middot; Investor-Ready Business Plan &middot; Mission 1 (Landscaping, Largo FL) &middot; Version 2.0 &middot; Generated {today}
        </p>
        <p style="margin:0;font-size:11px;line-height:1.5;color:#6B6B6B;">
          Confidential. Prepared for the sole investor (the founder). Not for external distribution.
        </p>
      </td></tr>
    </table>
    """


def build(attachment_note: str = "business_plan_grass_mission1.html") -> str:
    body = "".join([
        cover_image(),
        executive_summary(),
        what_youre_buying(),
        highlights(),
        cta_block(attachment_note),
        footer(),
    ])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>GRASS &mdash; Mission 1 Business Plan (Executive Summary)</title>
</head>
<body style="margin:0;padding:0;background:{CREAM};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CREAM};">
  <tr>
    <td align="center" style="padding:0;">
      <table role="presentation" width="780" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:780px;background:{CREAM};">
        <tr><td style="padding:0;">
{body}
        </td></tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
"""


def main() -> int:
    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    html = build()
    OUT_HTML.write_text(html, encoding="utf-8")
    size_kb = len(html.encode("utf-8")) / 1024.0
    print(f"[ok] wrote {OUT_HTML} ({size_kb:.1f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
