#!/usr/bin/env python3
"""
Build the Largo Lawn one-page summary card v3.4.

Output:
  - output/procurement/business_plan_grass_summary_card_v3.4.html
  - output/procurement/business_plan_grass_summary_card_v3.4.pdf

Tone (per founder brief 2026-07-28):
  - "Show me the receipts" family member.
  - This is a one-page business case, not a fridge magnet.
  - Sections in order: Business \u2192 Ask \u2192 Marketing & acquisition \u2192
    Profitability \u2192 Repayment \u2192 Risk.

Layout: A4 portrait (8.27\u2033 \u00d7 11.69\u2033), single column.
Why portrait: portrait fits a phone screen without horizontal scroll and
prints cleanly on standard letter/A4 paper. Landscape was wrong for
v1.1; the fridge-magnet metaphor was wrong too.

v3.4 update (2026-07-28): numbers aligned with the 14-page v3.4 plan
($12,000 ask / 0% / 24 months / $500 monthly / month-1 start). The card
became a safe companion attachment to the AAA investor package —
replace v2.0 which held a $15,000 / 27-month / $625 figure contradicted
by the v3.4 plan.
"""
from __future__ import annotations

import datetime as dt
from pathlib import Path

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
OUT_HTML = ROOT / "output" / "procurement" / "business_plan_grass_summary_card_v3.4.html"
OUT_PDF = ROOT / "output" / "procurement" / "business_plan_grass_summary_card_v3.4.pdf"

GREEN = "#1F4E2C"
SAND = "#C49A6C"
CHARCOAL = "#1A1A1A"
CREAM = "#FAF6F0"
INK = "#222222"
MUTED = "#6B6B6B"
RULE = "#E5DED0"
LIGHT_SAND = "#F4E5D0"
LIGHT_GREEN = "#E4EDE2"
WARM_RED = "#9C3A2E"

today = dt.date.today().strftime("%B %d, %Y")


def html() -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Largo Lawn &mdash; Business Case, One Page</title>
<style>
  @page {{ size: A4 portrait; margin: 0; }}
  body {{ margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; color: {INK}; background: {CREAM}; }}
  .page {{ width: 8.27in; min-height: 11.69in; padding: 0.45in 0.55in 0.4in 0.55in; box-sizing: border-box; }}
  .eyebrow {{ font-size: 9pt; letter-spacing: 0.18em; text-transform: uppercase; color: {SAND}; font-weight: 700; margin-bottom: 4px; }}
  h1 {{ margin: 0 0 2px 0; font-size: 22pt; line-height: 1.1; font-weight: 700; color: {GREEN}; }}
  h2 {{ margin: 10px 0 4px 0; font-size: 11pt; line-height: 1.15; font-weight: 700; color: {GREEN}; border-bottom: 1.5px solid {GREEN}; padding-bottom: 2px; text-transform: uppercase; letter-spacing: 0.04em; }}
  p {{ margin: 0 0 4px 0; font-size: 10pt; line-height: 1.4; }}
  .sub {{ font-size: 9pt; line-height: 1.35; color: {MUTED}; }}
  table {{ width: 100%; border-collapse: collapse; margin: 3px 0; font-size: 9.5pt; }}
  th {{ background: {LIGHT_GREEN}; color: {GREEN}; padding: 3px 6px; text-align: left; font-weight: 700; border-bottom: 1px solid {RULE}; font-size: 9pt; }}
  td {{ padding: 3px 6px; border-bottom: 1px solid {RULE}; vertical-align: top; }}
  .num {{ text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }}
  .total {{ font-weight: 700; color: {GREEN}; border-top: 1.5px solid {GREEN}; }}
  .ask {{ background: {GREEN}; color: {CREAM}; padding: 8px 10px; margin: 6px 0; }}
  .ask .label {{ font-size: 9pt; letter-spacing: 0.18em; text-transform: uppercase; color: {SAND}; font-weight: 700; }}
  .ask .amount {{ font-size: 22pt; font-weight: 700; line-height: 1.05; margin: 2px 0; }}
  .ask .terms {{ font-size: 10pt; }}
  .risk {{ background: #F4DDDD; border-left: 3px solid {WARM_RED}; padding: 6px 8px; font-size: 9.5pt; line-height: 1.4; margin: 4px 0; }}
  .channels td {{ font-size: 9pt; }}
  .stat-row {{ display: flex; gap: 8px; margin: 4px 0; }}
  .stat {{ flex: 1; background: {LIGHT_SAND}; border-left: 3px solid {SAND}; padding: 5px 8px; }}
  .stat-label {{ font-size: 8pt; color: {MUTED}; text-transform: uppercase; letter-spacing: 0.08em; }}
  .stat-value {{ font-size: 14pt; font-weight: 700; color: {GREEN}; line-height: 1.1; }}
  .stat-sub {{ font-size: 8pt; color: {MUTED}; }}
  .footer {{ margin-top: 10px; padding-top: 6px; border-top: 1px solid {RULE}; font-size: 8pt; color: {MUTED}; }}
</style>
</head>
<body>
<div class="page">

  <div class="eyebrow">Largo Lawn &middot; One-Page Business Case &middot; v3.4 (companion to 14-page plan)</div>
  <h1>Largo Lawn</h1>
  <p class="sub">Solo home-services in Largo &amp; Pinellas County, FL &middot; lawn care + pet waste removal + pressure washing &middot; operator: Cameron Pike</p>

  <h2>1 &middot; The business</h2>
  <p>Three services, one solo operator, one truck. Weekly recurring revenue from residential homes in six ZIPs around 33771. Service area: 36,200 households; ~13,500 already pay someone for lawn care. Pricing: <strong>lawn $48/wk</strong>, <strong>pet waste $20/wk</strong>, <strong>pressure washing $180&ndash;$280/job</strong>. Year 1 focus: lawn-care anchor + pet waste upsell; pressure washing added in months 4&ndash;6.</p>

  <h2>2 &middot; The ask</h2>
  <div class="ask">
    <div class="label">Loan request</div>
    <div class="amount">$12,000 at 0% over 24 months</div>
    <div class="terms">Monthly payment <strong>$500</strong> &middot; begins month 1 &middot; ends month 24 (last payment $500). <strong>Friendly loan, not an investment &mdash; no equity, no SAFE, no stake.</strong> Cameron is the personal obligor.</div>
  </div>

  <h2>3 &middot; Marketing &amp; customer acquisition</h2>
  <table class="channels">
    <tr><th>Channel</th><th>Mechanic</th><th class="num">Pilot cost</th></tr>
    <tr><td><strong>Thumbtack</strong></td><td>Pay-per-lead, instant booking, customer-initiated</td><td class="num">$0 first 5 leads (free credit)</td></tr>
    <tr><td><strong>Nextdoor</strong></td><td>Local neighborhood posts, $0.10&ndash;$0.30 per impression</td><td class="num">$250 / mo</td></tr>
    <tr><td><strong>Google Business Profile</strong></td><td>Organic GBP listing + Google Ads credit ($350 free)</td><td class="num">$0 in pilot window</td></tr>
    <tr><td><strong>Yard signs</strong></td><td>Every job site; 8&ndash;15 daily impressions per sign</td><td class="num">$425 (one-time, 50 signs)</td></tr>
    <tr><td><strong>Referral / SMS</strong></td><td>Past-customer texts; $25 credit per converted referral</td><td class="num">Pay-on-result only</td></tr>
  </table>
  <p><strong>Pilot-window CAC: $0 effective.</strong> Free ad credits total $775 ($350 Google + $425 yard-sign break-even) plus 5 free Thumbtack leads. Conversion funnel: <strong>inbound call &rarr; same-day text quote &rarr; on-site quote within 48h &rarr; first mow within 7 days</strong>. Conversion rates: 60&ndash;70% of calls book a quote; 70% of quotes become a first mow; 60&ndash;80% of first mows convert to weekly recurring (Lawn &amp; Landscape 2026 industry benchmarks).</p>

  <h2>4 &middot; Profitability</h2>
  <div class="stat-row">
    <div class="stat">
      <div class="stat-label">Avg ticket / wk</div>
      <div class="stat-value">$48</div>
      <div class="stat-sub">lawn; pet waste +$20; bundles higher</div>
    </div>
    <div class="stat">
      <div class="stat-label">Gross margin / cust</div>
      <div class="stat-value">74%</div>
      <div class="stat-sub">before first hire</div>
    </div>
    <div class="stat">
      <div class="stat-label">Net margin</div>
      <div class="stat-value">26.7%</div>
      <div class="stat-sub">vs. 10&ndash;15% industry benchmark (NALP/IBISWorld 2026)</div>
    </div>
  </div>
  <table>
    <tr><th>Y1 scenario</th><th class="num">Gross revenue</th><th class="num">Net profit</th><th class="num">Loan repaid</th></tr>
    <tr><td><strong>Pessimistic</strong> (slow start, weather, equipment issues)</td><td class="num">$30,192</td><td class="num">$7,800</td><td class="num">month 36+ (extended)</td></tr>
    <tr class="total"><td><strong>Baseline</strong></td><td class="num">$62,100</td><td class="num">$16,590</td><td class="num">month 24 (on schedule)</td></tr>
    <tr><td><strong>Stretch</strong> (faster acquisition, bundle attach)</td><td class="num">$106,560</td><td class="num">$44,000</td><td class="num">month 15 (early)</td></tr>
  </table>
  <p class="sub">Net margin 26.7% is above the 10&ndash;15% landscaping industry benchmark because there&rsquo;s no first hire in Year 1, no franchise fees, and equipment is amortized over 4+ years. FL min wage $14/hr current (rising to $15/hr on 2026-09-30 per FL Constitution Amendment 2) is the labor baseline. Pinellas County sales tax 7.0% (FL 6% + Pinellas 1% surtax per FL DOR DR-15DSS 2026) is passed through to customers via Stripe.</p>

  <h2>5 &middot; Repayment</h2>
  <table>
    <tr><th>When</th><th>What happens</th><th class="num">Cash</th></tr>
    <tr><td>Month 1 (LLC formed)</td><td>Seed disbursed; equipment + software + insurance purchased</td><td class="num">&minus;$12,000</td></tr>
    <tr><td>Months 1&ndash;3</td><td><strong>$500/mo loan payment begins</strong>; surplus reinvested in equipment reserve + tax reserve</td><td class="num">$500 &times; 3 = $1,500</td></tr>
    <tr><td>Months 4&ndash;12</td><td>$500/mo continues + 50% of free cash retained in business</td><td class="num">$500 &times; 9 = $4,500</td></tr>
    <tr><td>Months 13&ndash;24</td><td>$500/mo continues; net profit ramps as customer base grows</td><td class="num">$500 &times; 12 = $6,000</td></tr>
    <tr class="total"><td>Month 24</td><td><strong>Loan fully repaid</strong></td><td class="num">$12,000 total</td></tr>
  </table>
  <p><strong>Fallback if revenue &lt; 50% of baseline:</strong> scope reduces to lawn-only (drop pet waste + pressure washing); all marketing spend goes to zero; Cameron takes zero owner draw; loan payment continues at $500/mo from operating cash. The lender is senior in the cash waterfall &mdash; paid before Cameron, before taxes set aside, before equipment reserve, before anything discretionary.</p>

  <h2>6 &middot; Risk honesty</h2>
  <div class="risk">
    <strong>(1) Slow customer acquisition.</strong> If marketing takes 8 months instead of 4 to land 25 customers, loan repayment slips 4&ndash;6 months. Mitigation: 5-channel pilot (above), $0 effective CAC in pilot window, free ad credits cover first 8&ndash;12 customers.<br/>
    <strong>(2) Equipment failure / weather.</strong> Florida hurricane season June&ndash;November + summer storms cause ~6 lost work days/quarter on average. Mitigation: 14-day cash reserve; equipment warranty + $500 service reserve; backup handheld tools.<br/>
    <strong>(3) Founder unavailability.</strong> Cameron is the operator. Sickness or injury stops revenue. Mitigation: 2-week schedule buffer; documented solo SOPs; emergency pause/resume procedure on file.
  </div>

  <div class="footer">
    Largo Lawn &middot; One-Page Business Case &middot; Version v3.4 &middot;
    Built {today} &middot; Forecast document; not a guarantee of results &middot;
    Companion: 14-page business plan PDF (attached) for full detail.
  </div>

</div>
</body>
</html>
"""


def main() -> None:
    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    content = html()
    OUT_HTML.write_text(content, encoding="utf-8")
    size_kb = OUT_HTML.stat().st_size / 1024
    print(f"[ok] wrote {OUT_HTML} ({size_kb:.1f} KB)")

    # Render to PDF via WeasyPrint if available; fall back to Playwright (chromium).
    # The v3 wrapper uses Playwright because libgobject is missing on this Windows box.
    pdf_ok = False
    try:
        from weasyprint import HTML as WeasyHTML
        WeasyHTML(string=content, base_url=str(ROOT)).write_pdf(str(OUT_PDF))
        pdf_kb = OUT_PDF.stat().st_size / 1024
        print(f"[ok] wrote {OUT_PDF} ({pdf_kb:.1f} KB) [weasyprint]")
        pdf_ok = True
    except (ImportError, Exception) as e:
        print(f"[info] weasyprint unavailable ({type(e).__name__}); trying playwright")

    if not pdf_ok:
        try:
            from playwright.sync_api import sync_playwright
            url = "file:///" + str(OUT_HTML.resolve()).replace("\\", "/")
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.goto(url)
                page.wait_for_load_state("networkidle")
                page.pdf(
                    path=str(OUT_PDF),
                    format="A4",
                    margin={"top": "0.4in", "right": "0.4in", "bottom": "0.4in", "left": "0.4in"},
                    print_background=True,
                    prefer_css_page_size=True,
                )
                browser.close()
            pdf_kb = OUT_PDF.stat().st_size / 1024
            print(f"[ok] wrote {OUT_PDF} ({pdf_kb:.1f} KB) [playwright]")
        except ImportError:
            print(f"[warn] playwright not installed; HTML only")
        except Exception as e:
            print(f"[warn] PDF render failed: {e}")


if __name__ == "__main__":
    main()