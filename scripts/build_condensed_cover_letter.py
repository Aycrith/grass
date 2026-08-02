#!/usr/bin/env python3
"""
Build a short cover-letter email body for the GRASS condensed business plan.

This is the email body the recipient sees first. It explains the new
"condensed" version vs. the 45-page version sent earlier, and lists the
three factual corrections in plain language.

Output: output/procurement/business_plan_grass_condensed_cover.html
"""
from __future__ import annotations

import datetime as dt
from pathlib import Path

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
OUT = ROOT / "output" / "procurement" / "business_plan_grass_condensed_cover.html"

GREEN = "#1F4E2C"
SAND = "#D4A574"
SKY = "#3B7DD8"
CHARCOAL = "#1A1A1A"
CREAM = "#FAF6F0"
INK = "#222222"
MUTED = "#6B6B6B"
RULE = "#E5DED0"
LIGHT_GREEN = "#E4EDE2"
LIGHT_SKY = "#E0EAF5"
LIGHT_SAND = "#F4E5D0"
RED = "#B23A48"

GLOBAL_TD = (
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;"
    "line-height:1.55;font-size:15px;color:" + INK + ";"
)

today = dt.date.today().strftime("%B %d, %Y")


def html() -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>GRASS Mission 1 &mdash; Condensed Business Plan</title>
</head>
<body style="margin:0;padding:0;background:{CREAM};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
         style="background:{CREAM};">
    <tr><td align="center" style="padding:36px 24px 36px 24px;">
      <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0">
        <tr><td style="{GLOBAL_TD}">

          <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;
                      color:{SAND};font-weight:700;margin-bottom:14px;">
            Business Plan &middot; Condensed Version
          </div>
          <h1 style="margin:0 0 14px 0;font-family:Georgia,serif;
                     font-size:30px;line-height:1.2;font-weight:700;color:{GREEN};">
            Largo Lawn &mdash; 12 pages, plain language
          </h1>
          <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:{CHARCOAL};">
            Attached is a condensed version of the business plan. It covers the
            same material as the 45-page version but is structured for a faster
            read, with bigger fonts, more white space, and prioritized sections
            on marketing, customer conversion, day-to-day operations, and ROI.
          </p>
          <p style="margin:0 0 22px 0;font-size:14px;line-height:1.55;color:{MUTED};">
            Generated {today}. About 10 minutes to read. The full 45-page version
            with the evaluator's addendum is still on file if you want it.
          </p>

          <h2 style="margin:18px 0 8px 0;font-family:Georgia,serif;
                     font-size:18px;font-weight:700;color:{GREEN};">
            What changed
          </h2>
          <ul style="margin:0 0 18px 0;padding-left:22px;font-size:15px;line-height:1.55;color:{INK};">
            <li style="margin-bottom:6px;"><strong>Cut from 45 pages to 12.</strong>
                One concept per page. No nested sub-sections, no bibliographic
                essay, no AI-stack narrative.</li>
            <li style="margin-bottom:6px;"><strong>Three facts corrected</strong>
                from the original (see below). The original is still on file but
                should be regarded as superseded for these three items.</li>
            <li style="margin-bottom:6px;"><strong>De-AI'd.</strong> The plan is
                no longer framed as an &ldquo;autonomous AI organization.&rdquo;
                It is a one-person lawn-care business with standard small-business
                software. The original framing is preserved in the long version.</li>
            <li style="margin-bottom:0;"><strong>Re-prioritized.</strong>
                The marketing, conversion, operations, and ROI sections are the
                longest. Technology, governance, and future-mission sections are
                one paragraph each or omitted.</li>
          </ul>

          <h2 style="margin:18px 0 8px 0;font-family:Georgia,serif;
                     font-size:18px;font-weight:700;color:{GREEN};">
            Three factual corrections
          </h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                 style="border:1px solid {RULE};margin:0 0 18px 0;">
            <tr>
              <td style="background:{LIGHT_SKY};padding:10px 14px;font-size:13px;
                         font-weight:700;color:{SKY};width:34%;vertical-align:top;
                         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                         letter-spacing:0.1em;text-transform:uppercase;">
                Item
              </td>
              <td style="background:{LIGHT_SKY};padding:10px 14px;font-size:13px;
                         font-weight:700;color:{SKY};width:33%;vertical-align:top;
                         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                         letter-spacing:0.1em;text-transform:uppercase;">
                Old claim
              </td>
              <td style="background:{LIGHT_SKY};padding:10px 14px;font-size:13px;
                         font-weight:700;color:{SKY};width:33%;vertical-align:top;
                         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                         letter-spacing:0.1em;text-transform:uppercase;">
                Correct value
              </td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-size:14px;color:{INK};
                         border-top:1px solid {RULE};font-weight:600;vertical-align:top;">
                Florida minimum wage
              </td>
              <td style="padding:10px 14px;font-size:14px;color:{RED};
                         border-top:1px solid {RULE};vertical-align:top;">
                $13.00 / hour
              </td>
              <td style="padding:10px 14px;font-size:14px;color:{GREEN};
                         border-top:1px solid {RULE};font-weight:600;vertical-align:top;">
                $14.00 / hour (current through Sept 29, 2026), then $15.00 / hour
              </td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-size:14px;color:{INK};
                         border-top:1px solid {RULE};background:#FFFFFF;font-weight:600;vertical-align:top;">
                Pinellas County sales tax
              </td>
              <td style="padding:10px 14px;font-size:14px;color:{RED};
                         border-top:1px solid {RULE};background:#FFFFFF;vertical-align:top;">
                pre-correction value (cleared 2026-07-28 by DR-15DSS 2026)
              </td>
              <td style="padding:10px 14px;font-size:14px;color:{GREEN};
                         border-top:1px solid {RULE};background:#FFFFFF;font-weight:600;vertical-align:top;">
                7.0% (1.0% surtax per FL DOR Form DR-15DSS 2026)
              </td>
            </tr>
            <tr>
              <td style="padding:10px 14px;font-size:14px;color:{INK};
                         border-top:1px solid {RULE};font-weight:600;vertical-align:top;">
                Landscaping net margin (industry)
              </td>
              <td style="padding:10px 14px;font-size:14px;color:{RED};
                         border-top:1px solid {RULE};vertical-align:top;">
                7.9&ndash;13%
              </td>
              <td style="padding:10px 14px;font-size:14px;color:{GREEN};
                         border-top:1px solid {RULE};font-weight:600;vertical-align:top;">
                10&ndash;15% (NALP / IBISWorld / Aspire 2026)
              </td>
            </tr>
          </table>

          <h2 style="margin:18px 0 8px 0;font-family:Georgia,serif;
                     font-size:18px;font-weight:700;color:{GREEN};">
            The 12 pages
          </h2>
          <ol style="margin:0 0 18px 0;padding-left:22px;font-size:14px;line-height:1.55;color:{INK};">
            <li style="margin-bottom:4px;"><strong>Cover &amp; at-a-glance.</strong> Five numbers.</li>
            <li style="margin-bottom:4px;"><strong>The business.</strong> What it is, where, for whom.</li>
            <li style="margin-bottom:4px;"><strong>How we get customers.</strong> Five channels, $0 CAC.</li>
            <li style="margin-bottom:4px;"><strong>How a call becomes a customer.</strong> The conversion funnel.</li>
            <li style="margin-bottom:4px;"><strong>What a week looks like.</strong> Operations, equipment, costs.</li>
            <li style="margin-bottom:4px;"><strong>The money per customer.</strong> Unit economics.</li>
            <li style="margin-bottom:4px;"><strong>Year 1 forecast.</strong> Three scenarios, ROI, founder return.</li>
            <li style="margin-bottom:4px;"><strong>Month by month.</strong> The 12-month roadmap.</li>
            <li style="margin-bottom:4px;"><strong>What could go wrong.</strong> Top five risks.</li>
            <li style="margin-bottom:4px;"><strong>What to do in the next 30 days.</strong> Action list.</li>
            <li style="margin-bottom:0;"><strong>Common questions.</strong> FAQ.</li>
          </ol>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                 style="background:{LIGHT_SAND};border-left:4px solid {SAND};margin:18px 0;">
            <tr><td style="padding:14px 18px;">
              <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;
                          color:#8B6B2F;font-weight:700;margin-bottom:4px;
                          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
                What to do with the long version
              </div>
              <div style="font-size:14px;line-height:1.55;color:{INK};">
                The 45-page plan with evaluator's addendum is not wrong; it just
                tries to do too much. Keep it on file as the reference for any
                question the condensed plan does not answer.
                The condensed plan should be the one you read.
              </div>
            </td></tr>
          </table>

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
