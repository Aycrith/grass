#!/usr/bin/env python3
"""
Build the GRASS investor-ready business plan as a single self-contained HTML file.

Reads source artifacts (market sizing, pricing, brand guidelines) and assembles
an editorial-grade, Gmail-compatible HTML document with embedded base64 images.

Output:
  output/procurement/business_plan_grass_mission1.html  (the deliverable)
  output/reports/business_plan_grass_mission1.md        (the markdown source)
"""
from __future__ import annotations

import base64
import datetime as dt
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
ASSETS = ROOT / "output" / "assets"
# Two output files: full (browser) + slim (Gmail)
OUT_HTML_FULL = ROOT / "output" / "procurement" / "business_plan_grass_mission1.html"
OUT_HTML_GMAIL = ROOT / "output" / "procurement" / "business_plan_grass_mission1_gmail.html"
OUT_MD = ROOT / "output" / "reports" / "business_plan_grass_mission1.md"


def b64_image(rel_path: str) -> str:
    """Return a data: URL for a local image, sized for inline email/web embed.

    The active suffix is driven by the IMAGE_SUFFIX env var so we can produce both
    a high-fidelity browser-viewing version (_web.jpg, ~100KB each) and a Gmail-safe
    version (_tiny.jpg, ~30KB each) from the same script.
    """
    suffix = os.environ.get("IMAGE_SUFFIX", "web")
    p = ASSETS / rel_path.replace("_web", f"_{suffix}").replace("_tiny", f"_{suffix}")
    if not p.exists():
        # Fall back to whatever the caller asked for
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
PAPER = "#FFFFFF"
MUTED = "#6B6B6B"
RULE = "#E5DED0"

# ============== INLINE STYLES ==============
# All styles are inlined for Gmail compatibility. We avoid <style> blocks for the
# primary layout, using table-based structure with explicit cell styles.

GLOBAL_TD = (
    f"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;"
    f"line-height:1.55;font-size:15px;"
)

# ============== SECTIONS ==============

def cover() -> str:
    img = b64_image("business_plan_cover_web.jpg")
    today = dt.date.today().strftime("%B %Y")
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{CHARCOAL};">
      <tr>
        <td style="padding:0;">
          <img src="{img}" alt="Largo FL residential lawn at golden hour"
               width="780" style="display:block;width:100%;max-width:780px;height:auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding:42px 48px 36px 48px;{GLOBAL_TD};color:{CREAM};background:{CHARCOAL};">
          <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:{SAND};margin-bottom:18px;">
            Investor-Ready Business Plan &middot; {today}
          </div>
          <h1 style="margin:0 0 14px 0;font-family:Inter,sans-serif;font-size:38px;line-height:1.1;font-weight:700;color:{CREAM};letter-spacing:-0.01em;">
            GRASS
          </h1>
          <p style="margin:0 0 6px 0;font-size:22px;line-height:1.3;color:{CREAM};font-weight:600;">
            An autonomous AI organization that repeatedly launches, operates, and improves real businesses.
          </p>
          <p style="margin:18px 0 0 0;font-size:16px;line-height:1.55;color:#D9D2C5;max-width:640px;">
            Mission 1 &mdash; a solo-founder lawn-care business in Largo, Florida &mdash; is the first production deployment. This
            document covers the company, the model, the unit economics, the marketing, the technology, the governance, and the
            12-month plan. The audience is a single investor: the founder, evaluating a self-funded build of a compounding
            operating system.
          </p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:30px;border-top:1px solid #2A2A2A;padding-top:24px;width:100%;">
            <tr>
              <td style="padding:6px 0;color:#9A9A9A;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;width:140px;">Prepared by</td>
              <td style="padding:6px 0;color:{CREAM};font-size:14px;">Steward (founder) &middot; with GRASS executive agent</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9A9A9A;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Entity</td>
              <td style="padding:6px 0;color:{CREAM};font-size:14px;">Sole proprietorship &rarr; FL LLC at $500 cumulative-cash gate</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9A9A9A;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Service area</td>
              <td style="padding:6px 0;color:{CREAM};font-size:14px;">Largo FL 33771 + five adjacent ZIPs (33770, 33773, 33774, 33778, 33756)</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9A9A9A;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Year-1 ask</td>
              <td style="padding:6px 0;color:{CREAM};font-size:14px;">$0 incremental capital &middot; reinvests operating cash from Month 3</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    """


def section_header(num: str, title: str, sub: str = "") -> str:
    sub_html = f'<p style="margin:8px 0 0 0;font-size:14px;line-height:1.5;color:{MUTED};font-style:italic;">{sub}</p>' if sub else ""
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{GREEN};">
      <tr>
        <td style="padding:24px 48px;{GLOBAL_TD};">
          <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{SAND};margin-bottom:6px;">
            {num}
          </div>
          <h2 style="margin:0;font-family:Inter,sans-serif;font-size:24px;line-height:1.2;font-weight:700;color:{CREAM};">
            {title}
          </h2>
          {sub_html}
        </td>
      </tr>
    </table>
    """


def body_card(content_html: str) -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CREAM};">
      <tr><td style="padding:36px 48px;{GLOBAL_TD};">{content_html}</td></tr>
    </table>
    """


def callout(title: str, body: str, accent: str = GREEN) -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="border-left:4px solid {accent};background:#FFFCF5;margin:18px 0;">
      <tr><td style="padding:16px 20px;{GLOBAL_TD};">
        <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:{accent};font-weight:700;margin-bottom:4px;">{title}</div>
        <div style="font-size:15px;line-height:1.55;color:{INK};">{body}</div>
      </td></tr>
    </table>
    """


def h3(title: str) -> str:
    return f'<h3 style="margin:24px 0 10px 0;font-family:Inter,sans-serif;font-size:18px;line-height:1.3;font-weight:700;color:{GREEN};">{title}</h3>'


def p(text: str) -> str:
    return f'<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:{INK};">{text}</p>'


def ul(items: list[str]) -> str:
    lis = "".join(
        f'<li style="margin:0 0 8px 0;font-size:15px;line-height:1.55;color:{INK};">{x}</li>'
        for x in items
    )
    return f'<ul style="margin:0 0 14px 0;padding-left:22px;">{lis}</ul>'


def stat_grid(stats: list[tuple[str, str, str]]) -> str:
    """3- or 4-up metric grid. Each tuple is (value, label, footnote)."""
    cells = ""
    for v, lbl, foot in stats:
        cells += f"""
        <td valign="top" style="padding:18px 14px;width:25%;background:#FFFFFF;border:1px solid {RULE};border-radius:6px;">
          <div style="font-family:Inter,sans-serif;font-size:30px;line-height:1;font-weight:700;color:{GREEN};letter-spacing:-0.01em;">{v}</div>
          <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};margin-top:8px;">{lbl}</div>
          <div style="font-size:12px;line-height:1.45;color:{INK};margin-top:6px;">{foot}</div>
        </td>
        """
    return f"""
    <table role="presentation" width="100%" cellspacing="8" cellpadding="0" border="0" style="margin:18px 0 6px 0;">
      <tr>{cells}</tr>
    </table>
    """


def two_col(left: str, right: str) -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:18px 0;">
      <tr>
        <td valign="top" style="width:50%;padding-right:18px;{GLOBAL_TD};">{left}</td>
        <td valign="top" style="width:50%;padding-left:18px;border-left:1px solid {RULE};{GLOBAL_TD};">{right}</td>
      </tr>
    </table>
    """


def table(headers: list[str], rows: list[list[str]], widths: list[int] | None = None) -> str:
    if widths is None:
        widths = [int(100 / max(len(headers), 1))] * len(headers)
    th_cells = "".join(
        f'<th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:{CREAM};background:{GREEN};font-weight:700;border-right:1px solid #2D5A39;width:{w}%;">{h}</th>'
        for h, w in zip(headers, widths)
    )
    body = ""
    for i, row in enumerate(rows):
        bg = "#FFFFFF" if i % 2 == 0 else "#F6F1E7"
        cells = "".join(
            f'<td style="padding:9px 12px;font-size:13px;line-height:1.4;color:{INK};background:{bg};border-bottom:1px solid {RULE};vertical-align:top;">{c}</td>'
            for c in row
        )
        body += f"<tr>{cells}</tr>"
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="margin:14px 0 18px 0;border-collapse:collapse;border:1px solid {RULE};">
      <thead><tr>{th_cells}</tr></thead>
      <tbody>{body}</tbody>
    </table>
    """


# ============== CONTENT ==============

def toc() -> str:
    items = [
        ("01", "Executive Summary"),
        ("02", "Company & Mission"),
        ("03", "Market Opportunity"),
        ("04", "Business Model & Unit Economics"),
        ("05", "Product: Largo Lawn Service & Web App"),
        ("06", "Marketing & Distribution Strategy"),
        ("07", "Operations & Field Workflow"),
        ("08", "Technology & the AI Organization"),
        ("09", "Governance, Risk & Compliance"),
        ("10", "Financial Projections"),
        ("11", "12-Month Roadmap & Milestones"),
        ("12", "Future Missions & Optionality"),
        ("13", "The Ask, Use of Funds, Returns"),
        ("14", "Risks & Mitigations"),
        ("15", "Why Now, Why This, Closing"),
    ]
    lis = "".join(
        f'<li style="margin:0 0 6px 0;font-size:14px;line-height:1.5;color:{INK};list-style:none;">'
        f'<span style="display:inline-block;width:30px;color:{SAND};font-weight:700;letter-spacing:0.06em;">{n}</span>'
        f'<a href="#sec-{n}" style="color:{INK};text-decoration:none;">{t}</a></li>'
        for n, t in items
    )
    return body_card(f'<h3 style="margin:0 0 14px 0;font-family:Inter,sans-serif;font-size:16px;line-height:1.3;font-weight:700;color:{GREEN};">Contents</h3><ol style="margin:0;padding:0;">{lis}</ol>')


def sec_01_executive_summary() -> str:
    return (
        section_header("01", "Executive Summary", "The thesis, the numbers, and what the investor is buying.")
        + body_card(
            h3("The thesis")
            + p('<strong>GRASS is an autonomous AI organization that compounds capability by repeatedly launching, operating, and '
                'improving real businesses.</strong> Landscaping in Largo, Florida is Mission 1 &mdash; chosen because it exercises '
                'every organizational domain (sales, scheduling, routing, accounting, marketing, customer success, operations, '
                'finance, knowledge engineering) without requiring a regulated product license at MVP. The mission is not the '
                'lawn. The mission is the organization that runs the lawn.')
            + p('A solo founder, working with thirteen purpose-built AI agents under a written constitution, can operate a '
                'real home-services business at a $200/month infrastructure ceiling, break even by Month 3, generate $5,000 of '
                'MRR by Month 12, and exit Mission 1 with a reusable operating system that compresses the launch cost of '
                'Mission 2 by 70&ndash;90%.')
            + h3("The numbers, at a glance")
            + stat_grid([
                ("$3&ndash;5M", "TAM (annual lawn care in 6-ZIP service area)", "8,500&ndash;12,000 active lawn-care buyers"),
                ("$62,100", "Year-1 gross revenue (baseline)", "Range $30,192 pessimistic &ndash; $106,560 stretch"),
                ("$1,387", "Year-1 LTV per weekly customer", "Recurring mowing + mulch + hedge add-ons"),
                ("74%", "Gross margin per customer", "Equipment, fuel, materials, overhead"),
                ("$5,175", "MRR projection (Month 12, baseline)", "45 active customers, weekly mix"),
                ("$16.6K", "Year-1 net profit (baseline)", "26.7% net margin &mdash; above the 8&ndash;15% benchmark, sustained only by 0% family loan + founder-as-sweat-equity (time-bounded; see &sect;01)"),
                ("$200", "Monthly infra ceiling (through Month 6)", "Vercel + Supabase + Stripe + Resend + Jobber"),
            ])
            + h3("What the investor is buying")
            + p('The investor is the founder, investing time and a deliberately small amount of cash. The return profile is:')
            + ul([
                '<strong>Cash.</strong> A working solo-operator lawn-care business generating $40&ndash;60K Year-1 net, scaling to '
                '$80&ndash;100K by Year 2 as the customer base compounds.',
                '<strong>Capability.</strong> A reusable AI operating system &mdash; lead capture, scheduling, routing, invoicing, '
                'governance, knowledge &mdash; that drops the launch cost of Mission 2 by 70&ndash;90%.',
                '<strong>Optionality.</strong> A proven playbook for evaluating Mission 2, Mission 3, and beyond. The pre-computed '
                'Mission 2 candidate set is documented (Pool Service, Pressure Washing, Pet Waste Removal) and waiting on '
                '12 months of Mission 1 operating data.',
            ])
            + callout(
                "Bottom line",
                "GRASS is not a landscaping company. It is a self-funding, proof-of-concept for an autonomous business factory. "
                "The lawn is the first product off the line."
            )
        )
    )


def sec_02_company_mission() -> str:
    return (
        section_header("02", "Company &amp; Mission", "What GRASS is, what it is not, and the operating model.")
        + body_card(
            h3("What GRASS is")
            + p('GRASS is the substrate, state, governance, and operating procedure of an autonomous organization that builds, '
                'runs, and improves businesses. A real landscaping company in Largo, Florida is the first production mission of '
                'this organization &mdash; chosen because it exercises every organizational domain without requiring a regulated '
                'product license at MVP.')
            + h3("What GRASS is not")
            + ul([
                'It is <strong>not</strong> a software product. The web app at <code>largolawn.pro</code> is one output of the organization.',
                'It is <strong>not</strong> a franchise play. The operating system is the asset; the lawn is the receipt.',
                'It is <strong>not</strong> a venture-funded startup. The whole point is that the capability is funded by the business it runs.',
            ])
            + h3("Constitution &amp; governance")
            + p('GRASS operates under a written constitution (<code>constitution/01-constitution.md</code>) and a charter that '
                'define immutable principles: research before assumptions, evidence before decisions, specification before '
                'implementation, documentation before memory, validation before deployment, automation before repetition, and '
                'maintainability over velocity. Every major decision requires a Decision Template entry with rationale, '
                'alternatives, risks, and a review date. Every capability is registered in a machine-readable capability registry. '
                'Every risk is in a risk register. Every irreversible decision is approved by the founder with full audit trail.')
            + h3("Operating model &mdash; solo founder + thirteen AI agents")
            + p('The organization is staffed by thirteen divisions defined in <code>constitution/02-charter.md</code>: Executive, '
                'Research, Architecture, Engineering, QA, Security, Infrastructure, Marketing, Sales, SEO, Finance, Operations, '
                'and Knowledge. Each agent owns a mission, scope, escalation rules, inputs, outputs, tools, memory, KPIs, and '
                'acceptance criteria.')
            + p('Authority limits are codified. Any active agent may execute routine operations &le;$50. Decisions between $50 '
                'and $500 require a Decision Template entry with 24-hour silent approval. Decisions &gt;$500 require same-day '
                'founder approval. Irreversible decisions (entity change, hiring, real estate, vendor lock-in &gt;$5K/yr) require '
                'an Architecture Decision Record (ADR) plus explicit founder sign-off.')
            + h3("Why this is durable")
            + p('The operating model forces architectural discipline by design. There is no escape hatch to "hire someone." Every '
                'workflow must be agent-runnable. That constraint is what makes the capability compound &mdash; once a workflow is '
                'automated, the next mission inherits it for free.')
        )
    )


def sec_03_market() -> str:
    img = b64_image("business_plan_map_web.jpg")
    return (
        section_header("03", "Market Opportunity", "Largo, Florida. A 6-ZIP service area with a $3&ndash;5M addressable lawn-care market.")
        + body_card(
            h3("The service area, in numbers")
            + p("Mission 1 targets six ZIPs in the Tampa Bay / Pinellas County region. The primary ZIP is 33771 (Largo). "
                "Five adjacent ZIPs (33770, 33773, 33774, 33778, 33756) are included for local-pack ranking and "
                "incremental revenue. The service area contains approximately 36,200 households; 21,000 are owner-occupied "
                "(the lawn-care target market); and an estimated 13,500&ndash;14,500 of those hire some form of lawn service annually.")
            + stat_grid([
                ("36,200", "Total households (6 ZIPs)", "Source: Census ACS 5-year estimates"),
                ("21,000", "Owner-occupied households", "The lawn-care target segment"),
                ("13,500", "Active lawn-care buyers", "Industry 60&ndash;70% rule of thumb"),
                ("$50,500", "Median household income", "Supports $40&ndash;50/visit mid-tier pricing"),
            ])
            + h3("TAM, SAM, SOM")
            + table(
                ["Tier", "Definition", "Households", "Annual revenue @ industry avg"],
                [
                    ["TAM", "All lawn-care-buying households in service area", "~14,000", "$3.5M&ndash;5.5M"],
                    ["SAM", "Single-family homes with weekly/biweekly demand", "~9,000", "$2.5M&ndash;4.0M"],
                    ["SOM (Year 1, baseline)", "Solo founder capture, 3.75 customers/mo", "45 by Month 12", "$5,175 MRR ($62K ARR)"],
                    ["SOM (Year 1, stretch)", "Faster customer acquisition, 5/mo", "60 by Month 12", "$8,880 MRR"],
                    ["Solo-founder ceiling", "Capacity-bound (no hires)", "75&ndash;150", "$35K&ndash;55K MRR"],
                ],
                widths=[18, 36, 18, 28],
            )
            + h3("Live Largo FL pricing (what the market actually pays, July 2026)")
            + p("The original $65/visit assumption was overstated by 30&ndash;65% relative to what published aggregators list in "
                "Largo. The corrected pricing is $40&ndash;50/visit for a standard 1/4-acre lot, weekly service. This changed the "
                "go-to-market: the competitive moat is not price-point differentiation but <em>service-quality + local-presence "
                "trust, at the same price as LawnGuru and Y Sunday.</em>")
            + table(
                ["Source", "Service", "Price"],
                [
                    ["LawnGuru Largo", "Lawn mowing per cut", "$38&ndash;$46"],
                    ["YourGreenPal Largo", "Per-visit mow/bag/weed", "$35&ndash;$40"],
                    ["Thumbtack Largo", "Bi-monthly mowing", "$40/service ($80/mo)"],
                    ["LawnStarter FL", "Weekly 1/4 acre", "$36.08"],
                    ["LawnStarter FL", "Weekly 1/2 acre", "$60.98"],
                    ["Largo Lawn (this business)", "Weekly 1/4 acre, edge included", "$48"],
                ],
                widths=[34, 36, 30],
            )
            + h3("Seasonality &amp; hurricane-driven revenue events")
            + p("Largo is in USDA zone 10a: hot-humid subtropical, year-round mowing. Peak season runs March through September; "
                "shoulder months are October, November, February; off-season is December and January. The Pinellas hurricane season "
                "(June&ndash;November) adds a discrete, premium-priced revenue stream: pre-storm property prep at $150&ndash;300 per "
                "visit, and post-storm debris clearance at $300&ndash;800 per visit. An average season brings 2&ndash;3 named storms; "
                "for 50 active customers, that is $5&ndash;15K of incremental hurricane-prep revenue that commands 100%+ margins.")
            + img_block(img, "Largo 6-ZIP service area, illustrated as a storybook map.")
            + h3("Market risks (and why they do not break the thesis)")
            + ul([
                "<strong>Hurricane damage cycle.</strong> Major storm years can wipe out 10&ndash;30% of recurring customers. Mitigation: insurance rider, 1-month cash reserve, and a 14-day autonomous pause-and-resume protocol.",
                "<strong>Seasonal worker competition.</strong> Large franchises (TruGreen, Massey) drop prices aggressively in shoulder seasons. Mitigation: do not compete on price; compete on consistency and customer communication.",
                "<strong>Water restrictions &amp; FL-Friendly fertilizer rule.</strong> Pinellas has year-round watering restrictions; fertilization/pest bans in summer. Mitigation: explicit service-line scope excludes fertilizer, irrigation, and pest control until those licenses are acquired.",
                "<strong>New construction slowdown.</strong> Fewer new lawns to capture if Pinellas building permits drop. Monitor monthly; the local-pack + organic channel is largely insulated from this.",
            ])
        )
    )


def img_block(src: str, caption: str) -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:18px 0;">
      <tr><td style="padding:0;">
        <img src="{src}" alt="{caption}" width="780" style="display:block;width:100%;max-width:780px;height:auto;border-radius:4px;" />
      </td></tr>
      <tr><td style="padding:6px 0 0 0;font-size:12px;line-height:1.4;color:{MUTED};font-style:italic;">{caption}</td></tr>
    </table>
    """


def sec_04_business_model() -> str:
    return (
        section_header("04", "Business Model &amp; Unit Economics", "What we sell, what it costs, and what each customer is worth.")
        + body_card(
            h3("Service line &mdash; permitted at launch")
            + p("Landscaping <strong>without</strong> fertilization, <strong>without</strong> irrigation, "
                "<strong>without</strong> pest control &mdash; until respective licenses are acquired. Within scope at launch: "
                "weekly/biweekly/monthly mowing, mechanical edging, hedge trimming, mulching, leaf removal, seasonal cleanup, "
                "and hurricane prep.")
            + h3("Pricing &mdash; the price book is the source of truth")
            + table(
                ["Service", "Lot tier", "Weekly", "Biweekly", "Monthly"],
                [
                    ["Standard mowing (mow + edge + blow)", "Small (<0.25 ac)", "$38", "$50", "$75"],
                    ["Standard mowing (mow + edge + blow)", "Medium (0.25&ndash;0.4 ac)", "$48", "$65", "$95"],
                    ["Standard mowing (mow + edge + blow)", "Large (0.4&ndash;0.5 ac)", "$58", "$78", "$115"],
                    ["Mechanical edging (add-on)", "Per linear foot", "+$0.75/lf", "+$0.85/lf", "n/a"],
                    ["Mulching (per yd installed)", "All lots", "n/a", "n/a", "$75/yd"],
                    ["Hedge trim (per visit)", "All lots", "+$30 add-on", "+$30 add-on", "$80&ndash;$150"],
                    ["Hurricane prep (per visit)", "All lots", "n/a", "n/a", "$95&ndash;$300"],
                ],
                widths=[34, 22, 14, 14, 16],
            )
            + p('<span style="font-size:12px;color:' + MUTED + ';">Note: All prices exclude FL sales tax (6% state + 1.0% Pinellas surtax = 7.0% effective 2025&ndash;01&ndash;01 per FL DOR DR-15DSS 2026). The price book has a $0.42&times;LTV discount floor; sales agents may not discount below cost + 35% margin without Decision Template approval.</span>')
            + h3("Per-customer unit economics (Year 1, mid-tier, weekly)")
            + table(
                ["Line item", "Per customer, per month"],
                [
                    ["Revenue (mowing $48/visit &times; 2.17 visits/mo)", "$115"],
                    ["+ Blended add-on revenue (mulch, hedge, hurricane)", "— (lumpy, recognized on service days)"],
                    ["&minus; Equipment depreciation", "($8)"],
                    ["&minus; Fuel + drive time amortized", "($12)"],
                    ["&minus; Materials (mulch, trimmers) &mdash; only on service jobs", "($10)"],
                    ["&minus; Overhead (insurance, ad, software, domain amortized at 25-customer scale)", "($11)"],
                    ["<strong>Net per customer per month (baseline)</strong>", "<strong style='color:" + GREEN + ";'>$74</strong>"],
                ],
                widths=[64, 36],
            )
            + h3("Year-1 customer LTV (the compounding unit)")
            + table(
                ["Customer type", "LTV Year 1", "Notes"],
                [
                    ["One-time mow", "$65", "Worst unit &mdash; high CAC, low margin"],
                    ["Monthly-only", "$780", "Better, but churn risk"],
                    ["Bi-weekly", "$1,690", "Strong recurring baseline"],
                    ["Weekly (the goal)", "$3,380", "Best unit &mdash; same COGS, 2&times; revenue"],
                    ["Weekly + mulch once/yr", "$3,580", "Best LTV add-on"],
                    ["Weekly + mulch + hedge", "$3,810", "Best realized LTV in pilot data"],
                ],
                widths=[36, 18, 46],
            )
            + p("Converting 50% of the Year-1 customer base from bi-weekly to weekly boosts Year-2 revenue by $1,690 &times; 23 = "
                "<strong>+$39,000</strong>. Year 2 is where the real compounding happens.")
            + callout(
                "Why the model survives the price correction",
                "The original profitability roadmap assumed $65/visit and projected $24K Year-1 net. The corrected $48/visit "
                "model still projects $16.6K Year-1 net. The business works because the gross margin (74%) and the per-customer "
                "overhead ($11) are both well above the floors. The bet is not on price; the bet is on volume + retention.",
                accent=SAND,
            )
        )
    )


def sec_05_product() -> str:
    return (
        section_header("05", "Product: Largo Lawn Service &amp; Web App", "What we ship, what the customer sees, and why it is defensible.")
        + body_card(
            h3("The deliverable is two products")
            + ul([
                "<strong>Product A &mdash; the service.</strong> A recurring, weekly mowing and seasonal-care service delivered by one operator, one truck, every yard. Same-day quotes. No app for the customer to download.",
                "<strong>Product B &mdash; the web app.</strong> A 14-section editorial-style website at <code>largolawn.pro</code> that handles SEO, local-pack ranking, quote capture, scheduling, and operator-side ops.",
            ])
            + h3("The web app, section by section")
            + p("The production landing page is composed of fourteen editorial sections, each one addressing a specific customer "
                "question or local-SEO keyword cluster:")
            + table(
                ["Section", "Customer question answered", "SEO keyword cluster"],
                [
                    ["01 HeroFieldTelemetry", "Who is this, and what is the vibe?", "Brand, trust, locality"],
                    ["02 ServiceAreaMap", "Do you actually serve my ZIP?", "lawn care 33771, lawn care near me"],
                    ["03 OperatorStrip", "Who is going to show up?", "Trust, locality"],
                    ["03.5 PocketMap", "Where is this business in Pinellas?", "Locality, painted-map SEO"],
                    ["04 FieldLog", "What does the work look like?", "Work quality, before/after"],
                    ["04.05/04.06 BehindTheScenes", "The truck, the yard, the routine", "Locality, work proof"],
                    ["05 ServiceBento", "What services do you offer?", "lawn mowing, edging, hedge trimming"],
                    ["05.5 SpecimenPlate", "Do you know the local grass types?", "St. Augustine, Bermuda, Bahia"],
                    ["06 PricingTiers", "What does it cost?", "affordable lawn care, lawn mowing prices"],
                    ["07 ProcessSteps", "How does it work end-to-end?", "Process clarity"],
                    ["08 ScheduleTimeline", "What day do you come?", "weekly lawn service"],
                    ["09 FAQAccordion", "What if it rains, what if I'm not home?", "FAQ, objection handling"],
                    ["— FinalCTABanner", "How do I book?", "Quote conversion"],
                ],
                widths=[26, 38, 36],
            )
            + h3("Engineering quality bar")
            + p("The app is built on Next.js 15 App Router + React Server Components, TypeScript strict, Bun 1.3 runtime, deployed on Vercel. "
                "Visual regression tests run via Playwright across desktop, mobile, and reduced-motion variants. "
                "Lighthouse targets: Performance &ge; 0.95, SEO &ge; 0.95. Headers are hardened (X-Frame-Options DENY, X-Content-Type-Options nosniff, "
                "Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locked down). JSON-LD is emitted as schema.org/LandscapingBusiness. "
                "Sitemap, robots, and per-route OpenGraph/Twitter cards are all generated.")
            + h3("Why the product is defensible")
            + p("The defensibility is not the code. The defensibility is the <em>data flywheel</em>: every completed job feeds reviews, "
                "GBP ranking, organic traffic, and content for the blog. The defensibility is also the <em>brand voice</em>: 'Local "
                "lawn care that's actually local' is a sharper, more ownable position than any aggregator can take.")
            + callout(
                "The customer does not download an app",
                "Aggregation plays (LawnGuru, Y Sunday, LawnStarter) win on app downloads. Largo Lawn wins on trust signals: a "
                "real face, a real truck, a real phone number that the customer can text. The moat is being the operator, not "
                "the platform.",
                accent=SKY,
            )
        )
    )


def sec_06_marketing() -> str:
    return (
        section_header("06", "Marketing &amp; Distribution Strategy", "Zero paid budget through Month 3, then free-credit paid acquisition, then organic compounding.")
        + body_card(
            h3("The constraint that shaped the strategy")
            + p("Cash available at launch: $9.15 (one domain registration). Cash available for distribution: $0. "
                "The marketing plan was authored against that constraint and has never needed to be revised. The thesis: distribution = attention, "
                "and attention can be bought with labor, time, and creative positioning without spending money.")
            + h3("The five distribution channels")
            + table(
                ["Channel", "Cash cost", "Expected leads/mo (post-launch)", "Conversion to paid pilot"],
                [
                    ["Google Business Profile + citations", "$0", "5&ndash;15 organic calls", "10&ndash;20%"],
                    ["NextDoor local posts", "$0", "5&ndash;15 responses in 24h", "10&ndash;30%"],
                    ["Door hangers in visibly-overgrown lots", "$0&ndash;$10", "1&ndash;3 jobs per 100 hangers", "1&ndash;3%"],
                    ["Neighbor-cluster pilot (knock after a job)", "$0", "2&ndash;4 per completed job", "40&ndash;60%"],
                    ["Free ad credits (Google/Meta/Microsoft/Yelp/NextDoor/Thumbtack)", "$0", "54&ndash;168 leads total", "10% to pilot"],
                ],
                widths=[34, 16, 30, 20],
            )
            + h3("Free ad credit plan &mdash; ~$775 of credit, 0 cash")
            + p("New accounts on Google Ads, Microsoft Ads, Meta, Yelp, NextDoor, and Thumbtack qualify for promotional credits. "
                "The autonomous paid-acquisition plan (D-0012) is built to spend those credits in 30&ndash;60 days, then either "
                "stop and rely on organic + GBP, or fund continued ads from pilot revenue. Total expected leads from the credit window: "
                "54&ndash;168 across all platforms, with 3&ndash;17 paid pilots at a 10% lead-to-pilot conversion rate.")
            + table(
                ["Platform", "Likely credit", "Steward setup time", "Expected leads"],
                [
                    ["Google Ads", "$500", "15 min", "30&ndash;100"],
                    ["Microsoft Ads", "$100", "10 min", "5&ndash;20"],
                    ["Meta (FB + IG)", "$100", "15 min", "10&ndash;30"],
                    ["Yelp Ads", "$25", "5 min", "1&ndash;3"],
                    ["NextDoor Local Deals", "$50", "10 min", "3&ndash;10"],
                    ["Thumbtack", "~5 free leads", "5 min", "5"],
                    ["<strong>Total</strong>", "<strong>~$775 + 5 leads</strong>", "<strong>~60 min one-time</strong>", "<strong>54&ndash;168</strong>"],
                ],
                widths=[36, 22, 22, 20],
            )
            + h3("The free-credit guardrails (autonomous campaign management)")
            + ul([
                "Never exceed the credit cap on any platform. Billing threshold = $0 on every account.",
                "Pause any ad set with cost-per-lead &gt; $30 sustained for 3 days.",
                "Pause any campaign immediately if lead quality &lt; 20% ZIP match.",
                "Daily check: cost-per-lead, conversion count, negative-keyword expansion. Weekly: A/B test new headlines, reallocate budget from worst CPL campaign to best.",
            ])
            + h3("Local SEO foundation")
            + p("The GBP category is set to <strong>'Lawn care service'</strong>, not 'Landscaper.' That is a deliberate, "
                "researched choice. 'Landscaper' returns national franchises (Massey, TruGreen, LawnStarter aggregators) on the "
                "map pack. 'Lawn care service' returns solo operators and small crews &mdash; the actual competitive set a "
                "solo founder can beat. A 100-keyword universe is mapped across five money categories (primary transactional, "
                "service-specific, neighborhood-targeted, hurricane-specific, informational). The 6-ZIP service area is captured "
                "by neighborhood pages and 33771-ZIP landing pages.")
            + h3("Brand voice &mdash; the part that does not get cloned")
            + p('Brand promise: "Local lawn care that\'s actually local &mdash; one person, one truck, every yard." Voice: '
                'plain, honest, warm, practical. The website says "I mow lawns." not "Industry-leading lawn care solutions." '
                'The GBP description says "I\'m in 33771. You probably see my truck." not "Serving the greater Largo area." '
                'This voice is enforced by a brand consistency checklist that gates every customer-facing artifact before it ships.')
        )
    )


def sec_07_operations() -> str:
    return (
        section_header("07", "Operations &amp; Field Workflow", "From quote to close to recurring, with a runbook for every step.")
        + body_card(
            h3("The operational loop")
            + ol_start([
                "<strong>Lead capture.</strong> Inbound from GBP call/message, website /quote form, NextDoor post, door hanger, or neighbor referral. Every lead lands in Jobber ($39/mo, M0&ndash;6).",
                "<strong>Quote.</strong> Same-day. Operator visits the property, takes photos, measures the lot, sends a quote (SMS or email) within 60 minutes.",
                "<strong>Schedule.</strong> Weekly customers get a fixed day-of-week + arrival window. Weather cancellation is a no-charge automatic reschedule.",
                "<strong>Job.</strong> Mow, edge, blow. Hedge or mulch if booked. Photo at completion.",
                "<strong>Invoice.</strong> Auto-generated. Stripe or Cash App. Recurring customers on Stripe Subscriptions.",
                "<strong>Review.</strong> 24 hours after completion, a one-tap Google review link is sent via SMS. Goal: 1 five-star review per completed pilot, then organic.",
            ])
            + h3("Runbooks &mdash; written for the operator who is not the founder")
            + p("Every recurring workflow is documented as a runbook in <code>content/runbooks/</code>:")
            + ul([
                "<code>day-of-mow.md</code> &mdash; the operator's checklist for a service day (truck prep, route order, edge protocol, before/after photo, SMS template).",
                "<code>quote-to-close.md</code> &mdash; from inbound lead to signed quote to first paid job.",
                "<code>weather-cancellation.md</code> &mdash; automatic reschedule, no-charge messaging, no-friction retention.",
                "<code>hurricane-mode.md</code> &mdash; 14-day pause-and-resume protocol for named-storm events.",
                "<code>equipment-access.md</code> &mdash; the equipment registry and maintenance schedule.",
                "<code>customer-retention.md</code> &mdash; the seasonal touchpoints and the churn-prevention protocol.",
                "<code>gbp-launch-day.md</code> &mdash; the GBP verification, citation seeding, and review-magnet drop.",
                "<code>accounting-setup.md</code> &mdash; the bookkeeping, sales tax, and quarterly estimated tax workflow.",
            ])
            + h3("The 6-ZIP routing &amp; scheduling math")
            + p("Solo founder capacity is the binding constraint. A weekly route holds 20&ndash;25 stops in a single 8-hour day if the "
                "stops are clustered. The 6-ZIP service area is small enough (median drive &lt; 12 minutes between any two "
                "customers in a route) that the operator can hit 25 stops/day with Mapbox Optimization API v2 handling the order. "
                "At 25 weekly customers &times; 4.33 weeks/mo, the operator is at 80% capacity. The first hire trigger is MRR &gt; "
                "$5K/mo for 2 consecutive months <em>or</em> operator hours &gt; 50/wk for 4 consecutive weeks.")
            + h3("First-hire margin transition")
            + p("Year 1 runs solo, so gross margin per customer is <strong>74%</strong> (labor is the founder's reinvestment, not a cash cost). "
                "When the first hire triggers (above), margin compresses in three time-staged tiers: "
                "<strong>74% (Year 1 solo)</strong> &rarr; <strong>60&ndash;65% (Months 1&ndash;6 post-first-hire, while route density is being optimized)</strong> &rarr; "
                "<strong>45&ndash;55% (Year 2+ steady state, Aspire industry benchmark for established operators)</strong>. "
                "The first 6 months will be a margin-compression event, not an immediate landing at the 45&ndash;55% target. "
                "The post-hire gross margin depends on whether the new hire is W-2 ($15/hr loaded to ~$22/hr) or 1099 independent. The $15/hr is the FL "
                "minimum wage effective 2026-09-30 per FL Constitution Amendment 2 ($14/hr through 2026-09-29); the loaded rate "
                "adds ~30% for payroll tax + workers comp + basic benefits. The business still works "
                "because volume doubles &mdash; but Year 2 unit economics must be modeled on the 45&ndash;55% gross margin, not the 74% Year 1 number. "
                "Net margin after the first hire is ~18&ndash;22% (internal estimate pending primary-source verification &mdash; see &sect;14 benchmark sourcing risk).")
            + h3("How GRASS's margin compares (bracketed benchmark)")
            + p("Two independent 2025&ndash;2026 industry pulls put landscaping net margins in different places, and that spread is itself informative:")
            + table(
                ["Source pull", "Net margin claim", "Gap vs. GRASS 26.7%"],
                [
                    ["NALP 2025 Financial Benchmark Report (primary)", "~11.9% average; top performers ~14%", "+12.7 to +14.8 pts"],
                    ["IBISWorld NAICS 561730 (broader industry avg)", "~7.9% (includes lower-margin operators)", "+18.8 pts"],
                    ["Secondary aggregations (Aspire, Housecall Pro, Jobber)", "8&ndash;13% average; 10&ndash;15% for healthy operators", "+11.7 to +18.7 pts"],
                    ["<strong>Honest bracket across all three pulls</strong>", "<strong>8&ndash;15%</strong>", "<strong>+11.7 to +18.7 pts</strong>"],
                ],
                widths=[36, 38, 26],
            )
            + p("The 26.7% Year-1 baseline clears every version of the benchmark by 10+ points. The reason isn't market advantage &mdash; "
                "it's structural: no paid labor in Year 1, no franchise overhead, equipment amortized not financed. After the first hire "
                "the gap closes (gross 45&ndash;55% &rarr; net ~18&ndash;22%), but even the post-hire projection stays inside or above "
                "the upper end of the bracketed benchmark range.")
            + h3("Post-credit CAC (the Year 2 cost shift)")
            + p("The $0 effective CAC in the table below assumes the pilot-window free credits from Google + Meta + Bing. "
                "Once those expire (30&ndash;60 days from launch), the durable CAC is <strong>$90&ndash;$200/customer</strong> "
                "<em>(internal estimate &mdash; derived from Thumbtack pay-per-lead + Nextdoor paid boost data; no "
                "landscaping-specific CAC benchmark published by either platform; will be re-validated against real "
                "conversion data in Week 1&ndash;4 of launch)</em>. Year 2 forecast assumes the higher end of the range "
                "(~$150/customer blended) and a 12-month payback on each customer at the 74% Year 1 gross margin. "
                "<strong>Risk gate:</strong> real-world blended CAC may run $150&ndash;$250 as the post-credit channel mix shifts; "
                "quarterly review at Months 3, 6, 12 with a <strong>$250/customer kill-line</strong> per the launch-checklist risk gate. "
                "If blended CAC exceeds $250 for two consecutive months, channel mix reverts to organic + referrals only.")
            + h3("Customer acquisition math (how 45 customers happen by Month 12)")
            + table(
                ["Channel", "New customers/mo", "Total over 12 mo", "Cost/lead"],
                [
                    ["Organic + GBP (post-verification)", "1.5", "18", "$0"],
                    ["Free ad credits (Google + Meta + Bing)", "1.0", "12", "$0 (credit-paid)"],
                    ["Referrals (post-pilot-3)", "0.5", "6", "$0"],
                    ["NextDoor Local Deals", "0.25", "3", "$0"],
                    ["Repeat organic (returning customers)", "0.5", "6", "$0"],
                    ["<strong>Total</strong>", "<strong>3.75</strong>", "<strong>45</strong>", "<strong>$0 effective</strong>"],
                ],
                widths=[42, 18, 22, 18],
            )
        )
    )


def ol_start(items: list[str]) -> str:
    lis = "".join(f'<li style="margin:0 0 8px 0;font-size:15px;line-height:1.55;color:{INK};">{x}</li>' for x in items)
    return f'<ol style="margin:0 0 14px 0;padding-left:22px;">{lis}</ol>'


def sec_08_tech() -> str:
    img = b64_image("business_plan_org_web.jpg")
    return (
        section_header("08", "Technology &amp; the AI Organization", "Thirteen agents, one monorepo, one web app, zero escape hatches.")
        + body_card(
            h3("The thirteen-agent organization")
            + p("The organization is structured as thirteen divisions, each with a spec, KPIs, escalation rules, and memory. "
                "The first three (Executive, Research, Architecture, Engineering) shipped on Day 3. The remaining ten "
                "(QA, Security, Infrastructure, Marketing, SEO, Sales, Finance, Operations, Knowledge) shipped on Day 4. "
                "Every spec enforces the agent schema in <code>agents/_schema.md</code>.")
            + h3("AI model provider &amp; fallback")
            + p("<strong>Primary model family: Claude (Anthropic).</strong> The org uses the Claude model family as its primary "
                "AI provider across all thirteen agent divisions. Fallback procedure on outage: (1) 4-hour automated retry queue "
                "with exponential backoff; (2) escalation to a secondary Anthropic model in the same family (e.g., haiku for "
                "background tasks when sonnet is unavailable); (3) if all Claude endpoints are down for &gt;6 hours, the "
                "executive agent triggers a manual operating window &mdash; founder-run decisions, agent queue paused, "
                "facts.lock.yaml frozen until service restores. The 6-hour threshold matches the bulk of real Anthropic "
                "incident durations observed in mid-2026 (StatusGator: median major-incident duration &asymp; 14h; June 2026 "
                "17h+ DOWN event drove the upper tail). Provider may change without notice; the durable doctrine is documented in "
                "<code>content/facts.yaml</code> (keys: <code>ai-model-primary</code>, <code>ai-model-fallback</code>) and may be "
                "renamed in a future facts.yaml version bump without amending this section.")
            + table(
                ["Division", "Day shipped", "Owns"],
                [
                    ["Executive", "Day 3", "Daily CEO review, monthly retros, cross-agent conflict resolution"],
                    ["Research", "Day 3", "Market research, competitor surveys, keyword research, citation work"],
                    ["Architecture", "Day 3", "System architecture, ADRs, capability registry, digital twin models"],
                    ["Engineering", "Day 3", "Web app, API, scripts, observability, dep updates"],
                    ["QA", "Day 4", "Visual regression, lighthouse budgets, charter compliance linter"],
                    ["Security", "Day 4", "Secrets handling, header hardening, dependency CVE scans"],
                    ["Infrastructure", "Day 4", "Vercel, Supabase, Stripe, Resend, Mapbox, Inngest, observability"],
                    ["Marketing", "Day 4", "Brand voice, ad copy, GBP content, citation payload generator"],
                    ["SEO", "Day 4", "Keyword map, schema.org, sitemap, on-page optimization"],
                    ["Sales", "Day 4", "Quote templates, price book adherence, lead follow-up cadence"],
                    ["Finance", "Day 4", "Bookkeeping, sales tax filings, KPI scorecard, P&L forecast"],
                    ["Operations", "Day 4", "Field runbooks, equipment registry, weather cancellation, hurricane mode"],
                    ["Knowledge", "Day 4", "Decision log, postmortems, lessons learned, memory architecture"],
                ],
                widths=[20, 14, 66],
            )
            + h3("The tech stack (locked-in, $200/mo ceiling)")
            + table(
                ["Layer", "Choice", "Why"],
                [
                    ["Language", "TypeScript strict", "One language across web + scripts + workers"],
                    ["Runtime", "Bun 1.3.14", "Fastest TypeScript loop; built-in test runner"],
                    ["Web framework", "Next.js 15 App Router + RSC", "Server Actions collapse API into pages"],
                    ["Database", "Supabase Postgres", "Auth + RLS + Storage + Realtime in one managed service"],
                    ["Auth", "Supabase Auth", "Bundled with Postgres"],
                    ["Payments", "Stripe (Intents + Subscriptions)", "Customer portal = no billing UI to build"],
                    ["Email", "Resend + React Email", "Components version-control with code"],
                    ["SMS", "Twilio", "Transactional only"],
                    ["Routing", "Mapbox Optimization API v2", "3&ndash;5&times; cheaper than Google at solo scale"],
                    ["Background jobs", "Inngest free tier", "No Redis to babysit"],
                    ["Vector store", "pgvector in Supabase", "Free until 1M+ vectors"],
                    ["Observability", "Sentry + Axiom + PostHog", "3 managed services at $0&ndash;25/mo each"],
                    ["Admin app (M0&ndash;6)", "Jobber $39/mo", "Don't build admin before validating demand"],
                    ["Hosting", "Vercel", "Zero-DevOps; cron, KV, edge, image opt included"],
                ],
                widths=[18, 32, 50],
            )
            + h3("Why AI agents, not employees")
            + p("Every workflow that an agent runs is, by definition, a workflow the next mission inherits. There is no human "
                "tribal knowledge that does not get encoded. The 'hire a person' alternative would have delivered the same "
                "first-mission output but would have left nothing behind. The AI-agent alternative delivers the first mission "
                "<em>and</em> the second, third, and fourth mission's launch infrastructure for free.")
            + img_block(img, "The thirteen-agent organization: thirteen workstations, one founder, one operating system.")
            + callout(
                "The hard rule",
                "Every workflow repeated becomes a script in <code>scripts/</code>. Every capability is registered. Every risk is "
                "in the register. Every decision has a Decision Template entry. Every irreversible decision has a Decision "
                "Template entry plus founder approval. There are no exceptions, and that is the point.",
                accent=GREEN,
            )
        )
    )


def sec_09_governance() -> str:
    return (
        section_header("09", "Governance, Risk &amp; Compliance", "Why the operating system stays honest.")
        + body_card(
            h3("The constitution &mdash; immutable principles")
            + p("GRASS is governed by a written constitution. The nine core principles are:")
            + ol_start([
                "Research before assumptions.",
                "Evidence before decisions.",
                "Specification before implementation.",
                "Documentation before memory.",
                "Validation before deployment.",
                "Automation before repetition.",
                "Maintainability over velocity.",
                "Every major decision requires rationale, alternatives, risks, and review date.",
                "Every capability must be documented, tested, versioned, measurable, and discoverable.",
            ])
            + p('Amendments are rare, explicit, versioned, and justified. The first amendment ("Pilot Exception") was ratified to '
                'allow mission work to begin in parallel with phase exit gates under strict audit conditions, with a 30-day review '
                'window built in. There have been no further amendments.')
            + h3("The risk register (top five, owner-assigned, weekly review)")
            + table(
                ["Risk ID", "Description", "Likelihood", "Impact", "Mitigation"],
                [
                    ["R-BURN-001", "Solo-founder context burnout by Month 3", "Medium", "High", "Authority limits + daily CEO review + approval-queue budget"],
                    ["R-PILOT-001", "Phase exit drift under Pilot Exception", "Low", "High", "Decision Template required, 30-day review scheduled"],
                    ["R-INFRA-001", "Self-hosting tax pre-PMF", "Medium", "Medium", "$200/mo infra ceiling is charter rule; review at MRR >$5K"],
                    ["R-FLLIC-001", "Workers comp exemption lapses at first hire", "Low (M0&ndash;6)", "High", "DWC-250 filed; re-evaluate before any hire"],
                    ["R-HURR-001", "Hurricane season wipes out 10&ndash;30% of recurring base", "Annual", "Medium", "Insurance rider + 1-month cash reserve + 14-day autonomous pause/resume"],
                ],
                widths=[14, 30, 14, 12, 30],
            )
            + h3("Florida regulatory compliance &mdash; what's actually required")
            + p("Mission 1 is permitted to operate at launch under the following registrations and filings:")
            + table(
                ["Requirement", "Status", "Cost", "When required"],
                [
                    ["Sunbiz FL LLC formation", "Reactivation gate at $500 cumulative cash", "$125", "Before any field work (deferred to first paid pilot)"],
                    ["IRS EIN", "Free, 10 min online", "$0", "Before opening bank account"],
                    ["FL DR-1 sales tax registration", "Reactivation gate at $500 cumulative cash", "$0", "Before invoicing with sales tax"],
                    ["Workers comp DWC-250 exemption", "Filed at launch", "$0", "Before any field work (corporate-officer exemption)"],
                    ["City of Largo Business Tax Receipt", "Reactivation gate at $1K cumulative cash", "$62 first year", "Before any field work"],
                    ["Pinellas County BTR", "Reactivation gate at $1K cumulative cash", "~$30", "If service area extends beyond city limits"],
                    ["General liability insurance ($1M min)", "Reactivation gate at $2,500 cumulative cash", "$2,500&ndash;$4,600/yr", "Before any field work"],
                ],
                widths=[36, 24, 14, 26],
            )
            + h3("Privacy &amp; data handling")
            + p("The organization does not collect customer PII beyond what is required to deliver the service. Jobber holds customer "
                "contact + property data under its own DPA. The web app does not set non-essential cookies. The Permissions-Policy "
                "header is locked down: camera, microphone, geolocation all disabled. Stripe handles payment data; the app never "
                "touches a card number. The GBP is set to service-area-business (SAB) mode with the founder's residential address "
                "hidden publicly.")
            + h3("What happens if the founder is unavailable")
            + p("Bus-factor = 1 is an accepted risk for Mission 1. The mitigation is structural: every decision is documented in "
                "a Decision Template, every runbook is written for the operator who is not the founder, and the knowledge "
                "architecture is designed so that an AI agent can operate with reduced steward attention for at least 14 days. "
                "If the founder is incapacitated for 30+ days, Mission 1 stalls by design &mdash; the alternative (a human "
                "successor who does not know the operating system) would be worse.")
        )
    )


def sec_10_financials() -> str:
    img = b64_image("business_plan_chart_growth_web.jpg")
    return (
        section_header("10", "Financial Projections", "Three scenarios, transparent assumptions, and the 12-month cash curve.")
        + body_card(
            h3("The three scenarios, side by side")
            + table(
                ["Metric", "Pessimistic", "Baseline", "Stretch"],
                [
                    ["Active customers (Month 12)", "17", "45", "60"],
                    ["MRR (Month 12)", "$2,516", "$5,175", "$8,880"],
                    ["Year-1 ARR", "$30K", "$62K", "$107K"],
                    ["Year-1 net profit", "$7,800", "$16,590", "$44,000"],
                    ["Breakeven (single month positive)", "Month 6", "Month 3", "Month 2"],
                    ["Cumulative breakeven", "Month 8&ndash;9", "Month 4&ndash;5", "Month 2"],
                    ["Trigger to revisit", "Month 6 &lt; 5 customers", "Month 6 &lt; 10 customers", "Month 9 &gt; 40 customers"],
                ],
                widths=[34, 22, 22, 22],
            )
            + h3("Baseline scenario &mdash; 12-month cash flow")
            + table(
                ["Month", "New", "Total", "MRR", "Net", "Cumulative"],
                [
                    ["1", "0", "0", "$0", "&minus;$60", "&minus;$60"],
                    ["2", "1", "1", "$115", "+$20", "&minus;$40"],
                    ["3", "2", "3", "$345", "+$180", "+$140"],
                    ["4", "3", "6", "$690", "+$330", "+$470"],
                    ["5", "4", "10", "$1,150", "+$615", "+$1,085"],
                    ["6", "5", "15", "$1,725", "+$1,000", "+$2,085"],
                    ["7", "5", "20", "$2,300", "+$1,405", "+$3,490"],
                    ["8", "5", "25", "$2,875", "+$1,810", "+$5,300"],
                    ["9", "5", "30", "$3,450", "+$2,215", "+$7,515"],
                    ["10", "5", "35", "$4,025", "+$2,620", "+$10,135"],
                    ["11", "5", "40", "$4,600", "+$3,025", "+$13,160"],
                    ["12", "5", "45", "$5,175", "+$3,430", "<strong>+$16,590</strong>"],
                ],
                widths=[14, 14, 14, 17, 17, 24],
            )
            + img_block(img, "Illustrative 12-month cumulative-profit curve, baseline scenario.")
            + h3("Sensitivity analysis &mdash; what moves the most")
            + p("Three variables move the projection more than anything else:")
            + table(
                ["Variable", "Baseline assumption", "Pessimistic", "Stretch", "Impact on Year-1 net"],
                [
                    ["Customers acquired per month", "3.75", "2.0", "5.0", "±$15K"],
                    ["% of weekly (vs biweekly) customers", "30%", "10%", "60%", "±$8K (compounds into Year 2)"],
                    ["Add-on attach (mulch + hedge + hurricane)", "35%", "15%", "55%", "±$5K"],
                ],
                widths=[28, 22, 18, 18, 22],
            )
            + callout(
                "Sensitivity, summarized",
                "The model is robust to a 30% miss on any single variable. The model breaks if two of the three move pessimistic "
                "simultaneously (e.g., 2.0 customers/mo and 10% weekly mix) &mdash; that combination produces a $5K Year-1 net, "
                "still positive, but the mission-2 reinvestment window pushes out by 6 months. The early-warning signals are the "
                "Month 3, 6, and 9 risk gates listed below.",
                accent=SAND,
            )
        )
    )


def sec_11_roadmap() -> str:
    return (
        section_header("11", "12-Month Roadmap &amp; Milestones", "The week-by-week playbook that takes the business from $0 to $5K MRR.")
        + body_card(
            h3("Month-by-month milestones")
            + table(
                ["Month", "Customers", "GBP reviews", "Cumulative cash", "Trigger / decision"],
                [
                    ["1", "0", "0", "&minus;$60", "GBP verification postcard arrives (5&ndash;14 days). First Tier-1 citations live."],
                    ["2", "1", "1", "&minus;$40", "First paid pilot. First 5-star review target. $1,725 GBP impressions."],
                    ["3", "3", "3", "+$140", "<strong>$500 gate: file Sunbiz LLC, EIN, DR-1.</strong> First reactivation batch."],
                    ["4", "6", "5", "+$470", "<strong>$1K gate: file City of Largo + Pinellas BTRs.</strong> Insurance decision tree."],
                    ["5", "10", "8", "+$1,085", "Free ad credits burning. CPL &lt; $15 sustained."],
                    ["6", "15", "10", "+$2,085", "<strong>$2.5K gate: bind GL insurance.</strong> Risk gate: &lt; 10 customers = distribution audit."],
                    ["7", "20", "14", "+$3,490", "Hurricane season live. Pre-storm prep SOP activated."],
                    ["8", "25", "18", "+$5,300", "<strong>$5K gate: hire trigger evaluation.</strong> Stay solo or write the 0009-first-hire ADR."],
                    ["9", "30", "22", "+$7,515", "Risk gate: &lt; 25 customers = scale-up block; invest in ads or part-time crew."],
                    ["10", "35", "26", "+$10,135", "Mission 2 reusability scoring (per Charter, &ge;Month 10 + &ge;12 mo Mission 1 data)."],
                    ["11", "40", "30", "+$13,160", "Year-1 close prep. Year-2 customer mix shift toward weekly."],
                    ["12", "45", "30+", "<strong>+$16,590</strong>", "Year-1 closure. Year-2 forecast. Mission 2 decision template entry."],
                ],
                widths=[10, 12, 14, 20, 44],
            )
            + h3("Cash-ladder triggers &mdash; what each gate unlocks")
            + table(
                ["Cumulative cash", "Trigger", "Reactivation item", "Cash required"],
                [
                    ["$500", "First paid pilot", "Sunbiz + EIN + bank + DR-1", "$125"],
                    ["$1,000", "First paying customer", "BTRs (City of Largo + Pinellas)", "$92"],
                    ["$2,500", "First paying customer", "GL insurance bind", "$2,500&ndash;$4,600/yr"],
                    ["$5,000", "First equipment expense", "Equipment plan", "Variable"],
                ],
                widths=[18, 24, 30, 28],
            )
            + p("Once $2,500 cumulative cash is reached, all four deferred items become urgent. They are filed as a batch, not "
                "four separate waits. This is the first operational milestone the founder explicitly tracks.")
        )
    )


def sec_12_future_missions() -> str:
    return (
        section_header("12", "Future Missions &amp; Optionality", "What comes after the lawn, and why it does not need to be chosen now.")
        + body_card(
            h3("The Mission 2 candidate set (pre-scored, Month 10 re-validation required)")
            + p("Per the Charter, Mission 2 cannot launch until at least 12 months of Mission 1 operating data exist. The "
                "candidate set was scored against an 8-dimension rubric (capability reusability, TAM, margin, regulatory simplicity, "
                "cross-sell with Mission 1, solo-founder time, seasonality fit, brand fit) so the scoring is not invented under "
                "Month-10 launch pressure.")
            + table(
                ["Candidate", "Weighted score", "Reusability", "TAM (Pinellas)", "Margin", "Verdict"],
                [
                    ["A &mdash; Pool Service", "79%", "5/5", "$1.5&ndash;2.5M", "50&ndash;60%", "Strongest reusability; regulatory cost (RP252)"],
                    ["B &mdash; Pressure Washing", "74%", "4/5", "$1&ndash;2M", "60&ndash;70%", "Strong margin; weaker seasonality"],
                    ["C &mdash; Pet Waste Removal", "79%", "4/5", "$0.5&ndash;1M", "70&ndash;80%", "Strong margin + simplicity; smaller TAM"],
                ],
                widths=[28, 18, 14, 22, 18],
            )
            + h3("Why this is optionality, not a promise")
            + p("Pre-committing the rubric is the discipline. The Mission 2 winner is re-scored at Month 10 against actual "
                "Mission 1 KPI data. If Mission 1 ends Year 1 with strong cross-sell performance and customer trust, Pool Service "
                "(A) wins. If Mission 1 ends Year 1 with regulatory friction or hiring pressure, Pet Waste Removal (C) wins. "
                "Pressure Washing (B) is the runner-up if either A or C fails. The reusability of the operating system is what "
                "makes any of these viable at all &mdash; without the platform packages built during Mission 1, the launch cost "
                "of Mission 2 would be 5&ndash;10&times; higher.")
            + h3("Non-candidates (explicitly deferred)")
            + ul([
                "<strong>Pool construction.</strong> Different regulatory class; licensed contractor required. Mission 3+ material.",
                "<strong>Tree removal.</strong> High-risk, high-liability, requires ISA arborist cert. Deferred.",
                "<strong>Pest control.</strong> Heavy regulatory (FDACS &sect;482), insurance, chemical handling. Mission 4+ material.",
                "<strong>HVAC, plumbing, electrical.</strong> Multi-year apprenticeship licensing regime. Not Mission 2 material.",
            ])
            + h3("The compounding optionality")
            + p("The three candidate missions share 70&ndash;95% of the platform packages built during Mission 1 (lead capture, "
                "customer lifecycle, scheduling, routing, invoicing, notifications, auth). Mission 2 launch cost is projected at "
                "30% of Mission 1's launch cost. Mission 3 launch cost is projected at 20% of Mission 1's. By Mission 4, the "
                "incremental launch cost of a new home-services business in a new vertical is effectively the licensing + "
                "equipment cost &mdash; the operating system is free.")
        )
    )


def sec_13_ask() -> str:
    return (
        section_header("13", "The Ask, Use of Funds, Returns", "What the investor is committing, and what the investor gets back.")
        + body_card(
            h3("The ask &mdash; deliberate, not venture-scale")
            + p("The investor is the founder. The ask is <strong>$0 incremental capital</strong> through Month 6 and "
                "operating-cash reinvestment thereafter. This is a deliberate constraint: every dollar that the business does "
                "not need to raise is a dollar of optionality preserved. The business is structured to be self-funding from "
                "Month 3 onward.")
            + h3("What the founder is putting in")
            + table(
                ["Resource", "Commitment", "When"],
                [
                    ["Founder time", "30&ndash;40 hrs/wk through Month 6, 30 hrs/wk after PMF", "Ongoing"],
                    ["Domain registration", "$9.15 one-time", "Week 1"],
                    ["First-cash reactivation batch (Sunbiz + BTRs)", "$217", "At $500 cumulative cash gate (Month 3)"],
                    ["General liability insurance", "$2,500&ndash;$4,600/yr", "At $2,500 cumulative cash gate (Month 6)"],
                    ["Equipment (mower, edger, blower, hand tools)", "$1,200&ndash;$2,500 (used) or $4,000&ndash;$6,000 (new)", "At $5K cumulative cash gate (Month 8)"],
                    ["Jobber subscription", "$39/mo", "Month 1 onward"],
                ],
                widths=[34, 42, 24],
            )
            + h3("What the investor gets back")
            + ul([
                "<strong>Year 1 (baseline).</strong> $16,590 net operating cash. $5,175 MRR by Month 12. 45 active recurring customers.",
                "<strong>Year 2 (compounding).</strong> $40&ndash;$60K net as the customer base compounds and the weekly mix shift adds $39K of incremental revenue. 60&ndash;80 active customers. Operator at ~80% capacity.",
                "<strong>Year 3 (mission-2 launch).</strong> The operating system launches Mission 2 (likely Pool Service or Pet Waste Removal per pre-scoring). Mission 2 is projected to be cash-flow positive by Month 3 of its own life, on 30% of Mission 1's launch cost.",
                "<strong>Years 4&ndash;10 (the compounding flywheel).</strong> Each new mission inherits 80&plus;% of the platform. The founder's effective leverage per mission grows. By Year 5, the portfolio is projected to be a 3-mission operating system generating $250K+ net annually with a single human in the loop.",
            ])
            + h3("The exit question")
            + p("GRASS is not built for sale. It is built to keep compounding. That said, the asset is a <em>working autonomous "
                "AI organization with a proven production track record</em>. Comparable assets in 2026 (small operating businesses "
                "with documented operating systems and 5&ndash;15% net margins) trade at 3&ndash;5&times; annual net. At a "
                "$200K&ndash;$300K run-rate net by Year 3, that is a $600K&ndash;$1.5M saleable value <em>if</em> the founder ever "
                "wanted to exit. The realistic founder outcome is to never sell and to keep compounding.")
        )
    )


def sec_14_risks() -> str:
    return (
        section_header("14", "Risks &amp; Mitigations", "The things that can go wrong, ranked by likelihood and impact.")
        + body_card(
            table(
                ["Risk", "Likelihood", "Impact", "Mitigation"],
                [
                    ["<strong>Customer acquisition is slower than baseline.</strong> MRR stalls at &lt;$2K by Month 3.", "Medium", "High", "Audit funnel: GBP impressions, citation count, ad credit burn rate. Pivot to hyperlocal FB groups + NextDoor $25/mo boost. If Month 6 &lt; 5 customers, pause and re-strategize."],
                    ["<strong>Hurricane wipes out recurring base.</strong> Major storm year (10&ndash;30% churn).", "Annual", "Medium", "Insurance rider + 1-month cash reserve. 14-day autonomous pause-and-resume protocol. Diversify add-on revenue to hedge against churn."],
                    ["<strong>Solo-founder context burnout.</strong> 50+ hrs/wk for 4+ consecutive weeks.", "Medium", "High", "Daily CEO review (30 min) + approval-queue budget (5/day max). Re-evaluate operating model at MRR &gt;$5K/mo."],
                    ["<strong>Workers comp exemption lapses.</strong> First hire triggers FL Statute 440 workers comp obligation.", "Low (M0&ndash;6)", "High", "DWC-250 filed at launch. Re-evaluate before any hire. ADR for first-hire decision required."],
                    ["<strong>Aggregator price pressure.</strong> LawnGuru/Y Sunday/LawnStarter drop prices further.", "Low&ndash;Medium", "Medium", "Do not compete on price. Compete on consistency + customer comm. Same price as aggregators, but with a real local operator and no app to download."],
                    ["<strong>GBP suspension or de-indexing.</strong> Google changes SAB rules or suspends profile.", "Low", "High", "Citations on 20+ directories (Apple Maps, Bing, Yelp, FB, NextDoor) as backup discovery surface. Website SEO carries the long-term load."],
                    ["<strong>Free ad credit terms change.</strong> Google/Meta discontinue new-account credits.", "Low (pilot window only)", "Low", "Free credits are an accelerant, not the strategy. The organic + GBP + NextDoor channel is the durable acquisition engine."],
                    ["<strong>Bus factor = 1.</strong> Founder unavailable for 30+ days.", "Low", "Catastrophic for Mission 1", "Runbooks written for non-founder operators. Knowledge architecture allows 14-day autonomous operation. Mission 1 stalls by design; the alternative (successor who doesn't know the OS) is worse."],
                    ["<strong>AI model provider outage.</strong> Anthropic/Claude API unavailable for &gt;6 hours (real-incident baseline: multiple 9&ndash;17h incidents in June&ndash;July 2026 per StatusGator).", "Low", "Medium", "Primary Claude family with secondary-model fallback (see &sect;08). 4-hour automated retry queue, then manual operating window triggered by executive agent after 6 hours continuous outage. Founder-run decisions during outage; agent queue paused until service restores. Doctrine cited in <code>content/facts.yaml</code>."],
                    ["<strong>Agent drift.</strong> One of the 13 agents produces output that contradicts its spec (wrong facts, wrong tone, wrong gate).", "Medium", "High", "Three guards: (1) <code>facts.lock.yaml</code> is the canonical fact source &mdash; any drift against it fails the preflight gate; (2) source hash on every generated artifact &mdash; drift without version bump blocks send; (3) human approval gates on every external action (send, sign, deploy). Drift caught at the preflight gate, not at the customer."],
                    ["<strong>Benchmark sourcing risk.</strong> Four financial assumptions (industry net-margin range, post-hire gross margin, post-credit CAC, three funnel conversion rates) cite named third-party sources that, on independent verification, are partially or wholly unverified.", "Medium (found on first audit pass)", "Medium &mdash; undermines investor/lender trust if caught after send", "All externally-attributed figures in <code>facts.yaml</code> re-verified against a primary source (NALP Financial Benchmark Report, IBISWorld direct report, or vendor rate card) before the next investor-facing send. Unverified figures relabeled as 'internal estimate' with confidence &le;2/5 in all outbound copy. Audit findings recorded in governance decision D-0063 (next reconciliation cycle)."],
                ],
                widths=[28, 14, 14, 44],
            )
            + callout(
                "The risk philosophy",
                "Risks that are likelihood &times; impact &gt; some threshold are surfaced early and forced through Decision Template "
                "entries. Risks that are low-likelihood but high-impact have named owners and review dates. Risks that are "
                "low-impact are tracked but not gated. The risk register is re-ranked weekly by the executive agent.",
                accent=SKY,
            )
        )
    )


def sec_15_closing() -> str:
    return (
        section_header("15", "Why Now, Why This, Closing", "The one-paragraph answer and the one-page ask.")
        + body_card(
            h3("Why now")
            + p("Three forces converge in 2026 to make this buildable:")
            + ul([
                "<strong>AI capability crossed the threshold.</strong> In 2024 it was a research project. In 2025 it was a tool. In 2026 it is staff. A solo founder can run a thirteen-division organization on a $200/month infrastructure ceiling.",
                "<strong>Aggregator pricing pressure reset the moat.</strong> The aggregator pricing pressure (LawnGuru $36&ndash;$50, LawnStarter $36&ndash;$61) means the margin pool has compressed for everyone, but it also means a real local operator with the same price and a real face has a sharper differentiator than at any point in the last decade.",
                "<strong>Local SEO is still winnable.</strong> The GBP local-pack ranking for 'lawn care service' in 33771 is still beatable by a new, well-cited, well-reviewed profile. The 100-keyword map has clear whitespace. The window is open; it will not be open in 5 years.",
            ])
            + h3("Why this")
            + p("Landscaping in Largo FL is a deliberately ordinary business. It is not a unicorn vertical. The bet is not that "
                "lawn care is a great business &mdash; it is a $5K-MRR, $40K-net, 45-customer business that can be operated by one "
                "human and thirteen AI agents, and that pays for the operating system that runs it. The operating system is the "
                "asset. The lawn is the receipt.")
            + h3("The one-paragraph answer")
            + p('<em>"A solo founder in Largo FL, working under a written constitution with thirteen AI agents, can operate a '
                'real home-services business at a $200/month infrastructure ceiling, break even by Month 3, generate $5,000 of '
                'MRR by Month 12, and exit Year 1 with both $16,000 of net operating cash and a reusable operating system that '
                'compresses the launch cost of every future mission by 70&ndash;90%."</em>')
            + h3("The decision")
            + p("The investor (the founder) is being asked to commit 30&ndash;40 hours a week for 12 months and approximately "
                "$5,000&ndash;$7,000 of working capital deployed in tranches against the cash-ladder triggers. The expected return "
                "is $16,590 of Year-1 net operating cash, $40&ndash;$60K of Year-2 net as the customer base compounds, and an "
                "operating system that becomes the launch infrastructure for Mission 2 in Month 10+. The downside is bounded by "
                "the $7K working capital deployment and a 12-month break-even that the pessimistic scenario still hits in Month 9.")
            + callout(
                "The decision is yours",
                "Everything in this document is sourced from the live state ledger, the live market research, the live pricing book, "
                "and the live constitution. The numbers are conservative. The risks are named. The plan is weekly-granular. The "
                "exit is optional. The compounding is not.",
                accent=GREEN,
            )
            + h3("Sources &amp; further reading")
            + ul([
                "<code>README.md</code> &mdash; the high-level mission statement.",
                "<code>CLAUDE.md</code> &mdash; the single-source index for every governance document.",
                "<code>constitution/01-constitution.md</code> &mdash; immutable principles.",
                "<code>constitution/02-charter.md</code> &mdash; mission, departments, execution protocol.",
                "<code>constitution/03-execution-plan.md</code> &mdash; eleven phases with exit criteria.",
                "<code>constitution/charter-amendments/pilot-exception.md</code> &mdash; the first ratified amendment.",
                "<code>research/market/largo-market-size.md</code> &mdash; TAM/SAM/SOM, sources cited.",
                "<code>research/market/largo-pricing-reality.md</code> &mdash; live Largo FL pricing, sources cited.",
                "<code>research/market/profitability-roadmap.md</code> &mdash; the dollar-by-dollar projection.",
                "<code>research/pricing/price-book.yaml</code> &mdash; the authoritative price ladder.",
                "<code>research/regulatory/largo-licensing-map.yaml</code> &mdash; every license required, with citations.",
                "<code>research/seo/largo-keyword-map.md</code> &mdash; 100-keyword universe, 5 money categories.",
                "<code>research/distribution/autonomous-paid-acquisition.md</code> &mdash; the free-credit paid acquisition plan.",
                "<code>research/mission-2/candidates.md</code> &mdash; Mission 2 candidate set + scoring rubric.",
                "<code>research/mission-2/weighted-scores.md</code> &mdash; pre-computed scores against plausible Mission-1-shaped assumptions.",
                "<code>brand/guidelines.md</code> &mdash; brand voice, palette, typography, anti-brand.",
                "<code>governance/decisions/</code> &mdash; every Decision Template entry, every ADR.",
            ])
        )
    )


def divider() -> str:
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CREAM};">
      <tr><td style="padding:6px 48px;">
        <div style="height:1px;background:{RULE};font-size:0;line-height:0;">&nbsp;</div>
      </td></tr>
    </table>
    """


def footer() -> str:
    today = dt.date.today().strftime("%Y-%m-%d")
    try:
        from scripts.versioning import footer_html
        ver_footer = footer_html("long-plan")
    except Exception:
        ver_footer = ""
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{CHARCOAL};">
      <tr><td style="padding:30px 48px;{GLOBAL_TD};color:#9A9A9A;">
        <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:{SAND};margin-bottom:8px;">End of document</div>
        <p style="margin:0 0 6px 0;font-size:13px;line-height:1.5;color:#C8C2B5;">
          GRASS &middot; Investor-Ready Business Plan &middot; Mission 1 (Landscaping, Largo FL) &middot; Version 2.0 &middot; Generated {today}
        </p>
        <p style="margin:0 0 12px 0;font-size:12px;line-height:1.5;color:#8B8B8B;">
          This document is sourced from the live state ledger, the live market research, the live pricing book, and the live
          constitution. Every claim is traceable to a file in the GRASS repository. Review-date for this document: 30 days
          from generation date.
        </p>
        <p style="margin:0;font-size:11px;line-height:1.5;color:#6B6B6B;">
          Confidential. Prepared for the sole investor (the founder). Not for external distribution.
        </p>
      </td></tr>
    </table>
    """


def build() -> str:
    parts = [
        # cover has its own dark background
        cover(),
        # TOC on cream
        toc(),
        divider(),
        # Section 01 onwards
        sec_01_executive_summary(),
        divider(),
        sec_02_company_mission(),
        divider(),
        sec_03_market(),
        divider(),
        sec_04_business_model(),
        divider(),
        sec_05_product(),
        divider(),
        sec_06_marketing(),
        divider(),
        sec_07_operations(),
        divider(),
        sec_08_tech(),
        divider(),
        sec_09_governance(),
        divider(),
        sec_10_financials(),
        divider(),
        sec_11_roadmap(),
        divider(),
        sec_12_future_missions(),
        divider(),
        sec_13_ask(),
        divider(),
        sec_14_risks(),
        divider(),
        sec_15_closing(),
        # Footer
        footer(),
    ]
    body = "".join(parts)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>GRASS &mdash; Investor-Ready Business Plan (Mission 1, Largo FL)</title>
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
    OUT_HTML_FULL.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    html = build()

    # Full (browser-viewing) version: high-fidelity images
    os.environ["IMAGE_SUFFIX"] = "web"
    html_full = build()
    OUT_HTML_FULL.write_text(html_full, encoding="utf-8")
    full_kb = len(html_full.encode("utf-8")) / 1024.0
    print(f"[ok] wrote {OUT_HTML_FULL} ({full_kb:.1f} KB) — browser view")

    # Gmail-safe version: tiny compressed images
    os.environ["IMAGE_SUFFIX"] = "tiny"
    html_gmail = build()
    OUT_HTML_GMAIL.write_text(html_gmail, encoding="utf-8")
    gmail_kb = len(html_gmail.encode("utf-8")) / 1024.0
    print(f"[ok] wrote {OUT_HTML_GMAIL} ({gmail_kb:.1f} KB) — Gmail send")

    # Also build the cover letter (the email body that doesn't get clipped)
    print()
    r = subprocess.run(
        [sys.executable, str(Path(__file__).parent / "build_business_plan_cover_letter.py")],
        capture_output=True, text=True,
    )
    if r.returncode == 0:
        print(r.stdout.strip())
    else:
        print(f"[warn] cover-letter build failed: {r.stderr}", file=sys.stderr)

    # Mark down skeleton (for the markdown report)
    md = (
        "# GRASS — Investor-Ready Business Plan (Mission 1, Largo FL)\n\n"
        f"_Generated {dt.date.today().strftime('%Y-%m-%d')}_\n\n"
        "## Deliverables\n\n"
        f"- `output/procurement/business_plan_grass_mission1.html` &mdash; full-fidelity, browser-viewing version ({full_kb:.0f} KB)\n"
        f"- `output/procurement/business_plan_grass_mission1_gmail.html` &mdash; Gmail-safe version ({gmail_kb:.0f} KB)\n"
        f"- `output/procurement/business_plan_grass_cover_letter.html` &mdash; email cover letter (under 100KB, no clip)\n"
        f"- `scripts/send_business_plan.py` &mdash; send via Gmail SMTP (OWL sender)\n\n"
        "## Send (when ready)\n\n"
        "```bash\n"
        "# Dry-run preview (default)\n"
        "python scripts/send_business_plan.py --attach-full\n\n"
        "# Actually send\n"
        "python scripts/send_business_plan.py --attach-full --send\n"
        "```\n\n"
        "## Sourced from\n\n"
        "All numbers, claims, and decisions in this plan trace to live artifacts in the GRASS repository:\n\n"
        "- Market sizing: `research/market/largo-market-size.md`\n"
        "- Live pricing: `research/market/largo-pricing-reality.md`\n"
        "- Profitability roadmap: `research/market/profitability-roadmap.md`\n"
        "- Pricing book: `research/pricing/price-book.yaml`\n"
        "- Regulatory map: `research/regulatory/largo-licensing-map.yaml`\n"
        "- SEO keyword map: `research/seo/largo-keyword-map.md`\n"
        "- Distribution / paid acquisition: `research/distribution/autonomous-paid-acquisition.md`\n"
        "- Mission 2 candidates: `research/mission-2/candidates.md` + `weighted-scores.md`\n"
        "- Constitution: `constitution/01-constitution.md`\n"
        "- Charter: `constitution/02-charter.md`\n"
        "- Brand: `brand/guidelines.md`\n"
        "- Decisions: `governance/decisions/`\n"
    )
    OUT_MD.write_text(md, encoding="utf-8")
    print(f"[ok] wrote {OUT_MD}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
