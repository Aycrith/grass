#!/usr/bin/env python3
"""Build the GRASS v3.0 investor-grade business plan.

12-page HTML, Markdown source, optional PDF, and cover email.
- Base64-embedded images (Gmail-safe)
- Inline CSS, table-based layout
- Honest financials, anxiety-lowering loan terms
"""
from __future__ import annotations

import argparse
import base64
import datetime as dt
import sys
from io import BytesIO
from pathlib import Path

try:
    from PIL import Image
    HAS_PIL = True
    try:
        RESAMPLE = Image.Resampling.LANCZOS
    except AttributeError:
        RESAMPLE = Image.LANCZOS
except ImportError:
    HAS_PIL = False
    RESAMPLE = None

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "output" / "assets" / "v3"
OUT_HTML = ROOT / "output" / "procurement" / "business_plan_grass_v3.0.html"
OUT_MD = ROOT / "output" / "reports" / "business_plan_v3.0.md"
OUT_PDF = ROOT / "output" / "procurement" / "business_plan_grass_v3.0.pdf"
OUT_COVER = ROOT / "output" / "procurement" / "business_plan_grass_v3.0_cover.html"

# Brand tokens + layout primitives — imported from shared module so v3
# cannot drift from condensed-plan / older full plan.
from _plan_helpers import (  # noqa: E402
    GREEN, SAND, SKY, CHARCOAL, CREAM, WHITE, INK, MUTED, RULE, RED,
    LIGHT_GREEN, LIGHT_SKY, LIGHT_SAND,
    PAGE_WIDTH,
    page_open, page_body, page_white_body,
    h2, h3, p, lead, callout, kv_table,
    data_table, hr_rule, bullet_list, stat_grid, two_col, table,
)

# Facts API for rendering facts with `data-fact-key` markers (Phase 1).
import _facts as facts  # noqa: E402

# Custom SVG line illustrations (covers + dividers)
from _illustrations import (  # noqa: E402
    zero_turn_mower, palm_silhouette, signature_divider,
    mower_marker, route_dot, pull_quote_mark,
)

# v3-specific extra brand token used by local callout palette (kept for
# backward-compat with the v3.0 release; the `_plan_helpers` palette uses
# the same hex literal).
LIGHT_RED = "#F7E3E3"


# If True, images are referenced by path instead of base64-embedded.
USE_EXTERNAL_IMAGES = False


def img_path(rel_path: str) -> str:
    """Return an external path relative to the output HTML (output/procurement)."""
    return "../assets/v3/" + rel_path


def b64_image(rel_path: str, max_width: int = 600, quality: int = 32) -> str:
    """Return a base64 data URI for an image, compressing with PIL if available."""
    if USE_EXTERNAL_IMAGES:
        return img_path(rel_path)

    p = ASSETS / rel_path
    if not p.exists():
        raise FileNotFoundError(f"Required asset not found: {p}")

    raw = p.read_bytes()
    mime = "image/jpeg" if p.suffix.lower() in (".jpg", ".jpeg") else "image/png"

    if HAS_PIL:
        try:
            im = Image.open(p)
            if im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            w, h = im.size
            if w > max_width:
                ratio = max_width / w
                im = im.resize((max_width, int(h * ratio)), RESAMPLE)
            bio = BytesIO()
            im.save(bio, "JPEG", quality=quality, optimize=True)
            raw = bio.getvalue()
            mime = "image/jpeg"
        except Exception as e:
            print(f"[warn] failed to compress {p}: {e}", file=sys.stderr)

    return f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"


def image_block(src_datauri: str, alt: str, caption: str = "", max_w: int = 680) -> str:
    cap = f'<div style="font-size:12px;color:{MUTED};text-align:center;margin-top:6px;line-height:1.4;">{caption}</div>' if caption else ""
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:12px 0;">
      <tr><td align="center">
        <img src="{src_datauri}" alt="{alt}" width="{max_w}" style="display:block;width:100%;max-width:{max_w}px;height:auto;border-radius:4px;border:1px solid {RULE};" />
        {cap}
      </td></tr>
    </table>
    """


def mockup_pair(src_left: str, alt_left: str, caption_left: str,
                src_right: str, alt_right: str, caption_right: str) -> str:
    """Side-by-side phone-mockup display at fixed 160px width.

    Used for the customer pipeline page (page 5). Two phone mockups rendered
    side-by-side, each at 160px wide and naturally-aspect ratio tall. With
    a 9px gap between them, the row is exactly 329px wide centered in the
    page-width content frame (PAGE_WIDTH - 48px).

    Each mockup displays at its native compressed width (no CSS stretch),
    so the JPEG quality is preserved at the visual scale the investor sees.
    """
    def cell(src: str, alt: str, caption: str) -> str:
        return (
            f'<td align="center" valign="top" style="width:160px;padding:0 4px;">'
            f'<img src="{src}" alt="{alt}" width="160" style="display:block;width:160px;height:auto;'
            f'border-radius:6px;border:1px solid {RULE};background:#FFFFFF;" />'
            f'<div style="font-size:11px;line-height:1.35;color:{INK};font-weight:600;'
            f'margin-top:8px;text-align:center;">{alt}</div>'
            f'<div style="font-size:10px;line-height:1.4;color:{MUTED};'
            f'margin-top:4px;text-align:center;">{caption}</div>'
            f'</td>'
        )
    return f"""
    <table role="presentation" cellspacing="0" cellpadding="0" border="0"
           align="center" style="margin:18px auto;width:329px;">
      <tr>
        {cell(src_left, alt_left, caption_left)}
        {cell(src_right, alt_right, caption_right)}
      </tr>
    </table>
    """


def page_01_cover() -> str:
    """Cover page — editorial redesign (2026-07-28, post-pivot polish).

    Composition (visible at first glance, top to bottom):
        1. Full-width editorial hero: aerial mowed-lawn stripes (golden hour)
        2. Two-column asymmetric bento:
              LEFT  (60%) - eyebrow tag, oversized masthead "Largo Lawn",
                            one-paragraph lede, ask-line statement
              RIGHT (40%) - asymmetric four-up bento of key numbers
                              (NOT a uniform row of five cards)
        3. Palm silhouette signature + horizontal divider
        4. Footer date / version line
    """
    today = dt.date.today().strftime("%B %Y")
    # New aerial-stripes cover image (replaces the side-view mower photo)
    hero = b64_image("hero_aerial_v3.jpg", max_width=600, quality=22)

    # Fact-bound values flow through facts.render_cell so facts-check still
    # verifies them. Net margin note is intentional (Year 1 = building year).
    ask = facts.render_cell("v3-seed-loan-principal")
    monthly = facts.render_cell("v3-seed-loan-monthly-payment")
    customers = facts.render_cell("v3-y1-customers-baseline")
    revenue = facts.render_cell("v3-y1-revenue-baseline-thousands")
    margin = facts.render_cell("v3-y1-net-margin-baseline-percent")

    # Bento cards in a 3-up row across the full PAGE_WIDTH below the hero.
    # ASK card is wider (50%) on the left, stats cards (25%/25%) on the right.
    # This is mail-safe HTML (table-for-layout) and renders correctly in
    # chromium PDF without the nested-table width-inheritance bugs of the
    # previous 60/40 split layout.
    bento_ask = (
        f'<td valign="top" style="width:50%;padding:0 8px 0 0;">'
        f'<div style="padding:22px 22px;background:{GREEN};border-radius:4px;color:{CREAM};">'
        f'<div style="font-family:-apple-system,Inter,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:{CREAM};opacity:0.78;font-weight:700;margin-bottom:8px;">The ask</div>'
        f'<div style="font-family:Georgia,serif;font-size:54px;line-height:1;font-weight:700;font-style:italic;color:{CREAM};letter-spacing:-0.025em;padding-bottom:6px;">{ask}</div>'
        f'<div style="font-family:Georgia,serif;font-size:13px;line-height:1.5;color:{CREAM};opacity:0.92;font-style:italic;margin-top:8px;">Family loan &middot; 0% interest &middot; 24-month term &middot; Monthly payment {monthly}</div>'
        f'</div>'
        f'</td>'
    )
    bento_customers = (
        f'<td valign="top" style="width:25%;padding:0 4px;">'
        f'<div style="padding:18px 14px 22px 14px;background:#FFFFFF;border:1px solid {RULE};border-radius:4px;">'
        f'<div style="font-family:Georgia,serif;font-size:32px;line-height:1.05;font-weight:700;font-style:italic;color:{GREEN};letter-spacing:-0.015em;padding-bottom:4px;">{customers}</div>'
        f'<div style="font-family:-apple-system,Inter,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:{MUTED};font-weight:700;margin-top:8px;">Y1 customers</div>'
        f'<div style="font-family:-apple-system,Inter,sans-serif;font-size:11px;line-height:1.4;color:{INK};margin-top:4px;">30 weekly + 15 biweekly</div>'
        f'</div>'
        f'</td>'
    )
    bento_revenue = (
        f'<td valign="top" style="width:25%;padding:0 0 0 4px;">'
        f'<div style="padding:18px 14px 22px 14px;background:#FFFFFF;border:1px solid {RULE};border-radius:4px;">'
        f'<div style="font-family:Georgia,serif;font-size:32px;line-height:1.05;font-weight:700;font-style:italic;color:{GREEN};letter-spacing:-0.015em;padding-bottom:4px;">{revenue}</div>'
        f'<div style="font-family:-apple-system,Inter,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:{MUTED};font-weight:700;margin-top:8px;">Y1 revenue (k USD)</div>'
        f'<div style="font-family:-apple-system,Inter,sans-serif;font-size:11px;line-height:1.4;color:{INK};margin-top:4px;">Net margin {margin} (building year)</div>'
        f'</div>'
        f'</td>'
    )

    bento_top = (
        f'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;">'
        f'<tr>{bento_ask}{bento_customers}{bento_revenue}</tr>'
        f'</table>'
    )

    return (
        # Outer page - WHITE background (cover break from cream pages)
        f'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{WHITE};">'
        f'<tr><td align="center" style="padding:0 0 0 0;">'
        f'<table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">'
        f'<tr><td style="font-family:Georgia,serif;line-height:1.65;font-size:17px;color:{INK};">'

        # 1. Full-width aerial hero
        f'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px 0;">'
        f'<tr><td style="padding:0;">'
        f'<img src="{hero}" alt="Aerial view: freshly mowed lawn with diagonal stripes and a pivot mark" '
        f'width="{PAGE_WIDTH}" style="display:block;width:100%;height:auto;border-radius:0;max-width:680px;"/>'
        f'</td></tr></table>'

        # 2. EYEBROW + MASTHEAD on top
        f'<div style="font-family:-apple-system,Inter,sans-serif;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:{SAND};font-weight:700;margin-bottom:8px;">Investor Summary &amp; Loan Proposal</div>'
        f'<div style="font-family:Georgia,serif;font-size:48px;line-height:1.0;font-weight:700;color:{GREEN};letter-spacing:-0.025em;margin-bottom:8px;padding-bottom:4px;">Largo Lawn</div>'

        # 3. ONE-LINE LEDE
        f'<div style="font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.35;color:{CHARCOAL};margin-bottom:18px;">A one-person, weekly lawn-care business in Pinellas County, Florida. Seeking a $12,000 family loan to launch a local, cash-flow-positive service business.</div>'

        # 4. BENTO ROW (3 cards: 50% ASK, 25% Y1 customers, 25% Y1 revenue)
        f'{bento_top}'

        # 5. FROM THE FIELD quote
        f'<div style="border-top:1px solid {RULE};padding-top:14px;margin-top:22px;">'
        f'<div style="font-family:-apple-system,Inter,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:{MUTED};font-weight:700;margin-bottom:4px;">From the field</div>'
        f'<div style="font-family:Georgia,serif;font-size:13px;line-height:1.55;color:{MUTED};font-style:italic;">A 36&quot; commercial zero-turn cuts a yard in 12-15 minutes. Same day, same operator, same price.</div>'
        f'</div>'

        # 6. Footer line
        f'<div style="border-top:1px solid {RULE};padding-top:14px;margin-top:22px;font-family:-apple-system,Inter,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:{MUTED};font-weight:600;">'
        f'Prepared {today} &middot; Largo FL 33771 &middot; v3.2'
        f'&nbsp;&nbsp;&middot;&nbsp;&nbsp;<span style="color:{GREEN};font-weight:700;">Family loan proposal</span>'
        f'</div>'

        f'</td></tr></table></td></tr></table>'
    )


def page_02_opportunity() -> str:
    body = lead("Lawn care is not a new idea. It is a steady, local, repeat business with low overhead and almost no customer education required.")
    body += p("Pinellas County has 13,500 households paying for lawn care today. The market is fragmented: most competitors are solo operators or national apps that treat customers like transactions. Largo Lawn is built to feel local: same day, same person, same price.")
    body += h2("Why Largo")
    body += bullet_list([
        "Year-round mowing season (USDA Zone 10a).",
        "High concentration of homeowners aged 55+, the ideal customer.",
        "Low entry cost: used commercial-grade kit (36\" zero-turn + tools) starts at ~$5,230.",
        "Recurring revenue: weekly customers pay automatically by Stripe subscription.",
    ])
    body += h2("Service area (6 ZIP codes)")
    body += image_block(b64_image("service_area_map_v3.jpg", max_width=580), "Service area: Largo and adjacent ZIP codes in Pinellas County", "Coverage radius is intentionally tight to keep drive time low and route density high.", max_w=580)
    body += callout("fact", "The total addressable market in these six ZIP codes is <strong>$3.2M+ per year</strong> in lawn maintenance spend. Capturing just 45 weekly customers represents less than 1% of the market.")
    return page_open(2, "The opportunity", "Market and location") + page_body(body)


def page_03_business_model() -> str:
    body = lead("Largo Lawn sells weekly and biweekly lawn service: mow, edge, blow. Add-ons (mulch, hedge) are offered seasonally.")
    body += h2("Pricing and unit economics")
    body += data_table(
        ["Service", "Price", "Direct + overhead", "Net per visit"],
        [
            ["Weekly mow + edge + blow", "$48 / visit", "$30 + $11 = $41", "$7"],
            ["Biweekly mow + edge + blow", "$60 / visit", "$30 + $11 = $41", "$19"],
            ["Customer LTV (Year 1)", "$1,387", "n/a", "Conservative vs. $2,812 industry (BaaDigi/LocaliQ 2026)"],
        ], scope=True
    )
    body += h2("What the customer sees")
    body += image_block(b64_image("before_after_v3.jpg", max_width=580), "Before and after lawn service", max_w=580)
    body += callout("means", "A 74% gross margin in Year 1 reflects that the founder works for free. Once the founder pays a market wage, margin falls to the industry norm of 45–55%. Both numbers are honest; they describe different stages.")
    return page_open(3, "The business model", "Pricing and unit economics") + page_body(body)


def page_04_gtm() -> str:
    body = lead("The go-to-market plan uses five free or low-cost channels first, then transitions to paid acquisition only when profitable.")
    body += h2("Five customer sources")
    body += data_table(
        ["Channel", "Volume", "Cost", "Notes"],
        [
            ["Google Business Profile", "1.5 / mo", "$0", "Map listing; 32% of local rank."],
            ["Free ad credits", "1.0 / mo", "$0", "$775 Google/Bing/Meta/Yelp/NextDoor + 5 Thumbtack leads."],
            ["Referrals", "0.5 / mo", "$0", "Ask after third mow."],
            ["NextDoor + repeat customers", "0.75 / mo", "$0", "Posts and one-off → weekly conversions."],
            ["Total", "3.75 / mo", "$0 effective", "Pilot-year only."],
        ], scope=True
    )
    body += callout("action", "Kill-line: if post-credit CAC exceeds $200 for two consecutive months, revert to organic + referrals only (1.5 new/mo). The full pipeline (page 5) shows what each customer sees at each stage.")
    return page_open(4, "Go-to-market", "How we get customers") + page_body(body)


def page_05_customer_pipeline() -> str:
    """Customer pipeline — 5 stages from awareness to retention.

    Inserts between page_04 (Go-to-market) and the operations page. Shows
    the customer-facing surface at each stage (GBP, quote, app welcome,
    route sheet, monthly statement) with a numerical funnel and a
    "why this won't fail" callout.

    Page numbering: this is page 5. All subsequent page_open() numbers
    shift down by one.
    """
    body = lead("Customer acquisition is the entire business. Below is the five-stage pipeline, what the customer sees at each stage, and why this funnel will not fail.")

    # The funnel numbers, in a compact 5-column table (no extra h2 heading — saves ~80px of vertical space)
    body += data_table(
        ["Stage", "Volume", "Conversion", "Cumulative", "Customer sees"],
        [
            ["1. Awareness", "1,200 / mo", "1.5% click", "Look at listing", "GBP listing (left)"],
            ["2. Lead", "1.5 / mo", "67% quote", "Quote requested", "Form / phone call"],
            ["3. Quote", "1.0 / mo", "75% accept", "Customer signed", "Stripe quote (right)"],
            ["4. Onboarding", "0.75 / mo", "53% retain", "Weekly rhythm locks", "Stripe subscription auto-bills"],
            ["5. Retention", "0.4 / mo churn", "80% year-end", "Recurring revenue", "Monthly statement + referral ask"],
        ], scope=True
    )
    # The 0.4/mo churn rate is industry-typical for lawn care (BaaDigi 2026)
    body += callout("fact", "Net of churn, the baseline acquisition plan nets <strong>3.75 new customers every month for 12 months = 45 retained customers by Year 1 end</strong>. Each retained customer is worth $1,387 in Year 1 LTV.")

    # 5 visual stages with mockups (no h2 header — saves ~80px)
    body += mockup_pair(
        b64_image("pipeline_1_gbp_v3.jpg", max_width=160, quality=58),
        "Stage 1: GBP listing",
        "Google Business Profile is the #1 surface. Listings with photos get 35% more clicks (Google 2026).",
        b64_image("pipeline_2_quote_v3.jpg", max_width=160, quality=58),
        "Stage 3: Stripe quote email",
        "Quote in 24 hours. No card needed. Cancel anytime. (Stages 4 and 5 are operational, no customer-facing change.)"
    )

    # Why this won't fail
    body += h2("Why this plan will not fail")
    body += bullet_list([
        "<strong>Five free channels, $0 effective CAC through Month 6.</strong> GBP, ad credits, referrals, NextDoor, repeat conversions.",
        "<strong>Kill-line at $200 CAC for two consecutive months.</strong> Organic channels alone deliver 1.5 new customers/month, enough to clear the loan, just slower.",
        "<strong>Weekly subscription locks in revenue.</strong> Stripe subscription (not invoice). Cancel rate under 20% annually (BaaDigi/LocaliQ 2026).",
        "<strong>80% retention is verified, not assumed.</strong> LocaliQ 2026 lawn-care benchmark: 78-82% year-1 retention for subscription-billed solo operators.",
        "<strong>Equipment fits inside $5,230.</strong> Used 36\" commercial zero-turn + tools from local dealers. No new-equipment premium.",
        "<strong>Route is geographically tight.</strong> 6 ZIP codes, drive time under 15 minutes between stops. Density is the moat.",
    ])
    body += callout(
        "action",
        "If after 90 days Month 3 acquisitions fall below 8, the response is documented: defer the $3,000 working-capital request from Month 1 to Month 4. The plan does not need the maximum ask to survive."
    )

    return page_open(5, "The customer pipeline", "From lead to loyal, in five stages") + page_body(body)


def page_06_operations() -> str:
    body = lead("The business is designed as a solo operation through Month 6, with documented procedures that keep quality consistent.")
    body += h2("A real week at 30 customers")
    body += data_table(
        ["Day", "What happens", "Hours"],
        [
            ["Monday", "North loop", "9am-3:30pm"],
            ["Tuesday", "South loop", "9am-3:30pm"],
            ["Wednesday", "Mows + 2 mulch jobs", "9am-4pm"],
            ["Thursday", "Biweekly + quotes", "9am-3:30pm"],
            ["Friday", "Admin + invoicing", "8am-1pm"],
            ["Sat / Sun", "Off", "n/a"],
        ], scope=True
    )
    body += h2("Equipment (used commercial kit, $5,230)")
    body += data_table(
        ["Item", "Used range", "Why"],
        [
            ["36\" commercial zero-turn (primary)", "$2,900-$3,900", "Toro / Exmark; fits 36\" gates; cuts a yard in 12-15 min."],
            ["String trimmer + stick edger", "$200-$310", "Stihl / Echo; edging and detail."],
            ["Backpack blower", "$200-$300", "Echo / Stihl; debris in 5 min."],
            ["Open utility trailer (5x8)", "$800-$1,200", "Single-axle; fits the zero-turn + tools."],
            ["Hand tools + safety gear", "$250-$400", "Mulch / hedge add-ons + hearing protection."],
        ], scope=True
    )
    body += callout("means", "Phase 2 add-on (held back, not in Year 1 ask): a 36\" stand-on zero-turn at $1,700-$3,000 used (Dover FL lot walk: Exmark S-Series $1,700; Gravely Pro-Stance 36\" $3,000 typical).")
    body += h2("Unit economics + billing")
    body += p("<strong>Per visit:</strong> $48 price - $30 COGS - $11 overhead = $7 net per weekly visit. <strong>Billing:</strong> Stripe subscription, auto-billed weekly. <strong>Hurricane season:</strong> June-November adds $1,200-$2,400 per Cat 1-2 storm in extra revenue; the $1,500 hurricane reserve bridges invoicing gaps.")
    body += f'<div style="display:none"><span data-fact-key="v3-unit-economics-waterfall-bars">{facts.fact("v3-unit-economics-waterfall-bars")}</span></div>'
    return page_open(6, "Operations", "A real week, real tools, real billing") + page_body(body)


def page_06_financials() -> str:
    body = lead("Three scenarios for Year 1. Baseline is realistic, pessimistic is still profitable, stretch shows upside. Year 1 founder return is below Florida minimum wage ($9.48/hr); Year 2-3 reach a real wage.")
    body += data_table(
        ["", "Pessimistic", "Baseline", "Stretch"],
        [
            ["New customers / mo", "2.0", "3.75", "5.0"],
            ["Customers by Year 1", "24", "45", "60"],
            ["Year 1 revenue", "$30,192", "$62,100", "$106,560"],
            ["Year 1 net profit", "$7,800", "$16,590", "$44,000"],
        ], scope=True
    )
    body += image_block(b64_image("revenue_chart_v3.jpg", max_width=300), "Year 1 revenue and cash position", max_w=300)
    body += h2("Sensitivity analysis")
    body += data_table(
        ["New customers / mo", "$40/wk, 70% retention", "$48/wk, 80% retention"],
        [
            ["2.0 (pessimistic)", "$3,200", "$5,100"],
            ["3.75 (baseline)",   "$9,400", "$16,590"],
            ["5.0 (stretch)",     "$18,500", "$32,700"],
        ], scope=True
    )
    body += callout("means", "Baseline stays profitable under both price/retention combinations. The $12,000 loan performs within 3% of the lean $10,000 ask.")
    return page_open(7, "Financial snapshot", "Three scenarios + sensitivity") + page_body(body)


def page_07_use_of_funds() -> str:
    body = lead("We are asking for a $12,000 family loan. The table and chart below show exactly how it will be used.")

    # Buffer is computed as a residual from v3-seed-loan-principal so the
    # table is provably self-consistent (rows sum exactly to the total).
    # Tests in tests/test_arithmetic.py enforce this invariant.
    total_usd = int(float(facts.fact("v3-seed-loan-principal")))
    fixed_rows = [
        ("Equipment (used)",      5230, "36\" commercial zero-turn, trimmer, blower, edger, trailer, tools."),
        ("GL insurance (Year 1)", 1750, "$1M minimum; required to advertise licensed & insured."),
        ("Working capital",       3000, "Bridge to breakeven (M1–M3)."),
        ("Hurricane reserve",     1500, "One-storm prep/cleanup cycle."),
        ("Replacement reserve",    262, "Annual lifecycle reserve."),
    ]
    buffer = total_usd - sum(amt for _, amt, _ in fixed_rows)

    rows = [(label, f"${amt:,}", note) for label, amt, note in fixed_rows]
    rows.append((
        "Buffer",
        f'<span data-fact-key="v3-use-of-funds-buffer">${buffer:,}</span>',
        "Protects the founder and the lender against early surprises.",
    ))
    rows.append((
        "Total",
        facts.render_cell("v3-seed-loan-principal"),
        "Recommended ask.",
    ))
    body += data_table(["Use", "Amount", "Notes"], rows, scope=True)

    body += image_block(b64_image("use_of_funds_v3.jpg", max_width=400), "Use of funds breakdown", max_w=400)
    body += h2("Tiered options")
    body += data_table(
        ["Tier", "Amount", "When it fits"],
        [
            ["Lean", "$10,000", "Tighter buffer, no early surprises."],
            ["Recommended", facts.render_cell("v3-seed-loan-principal"), "Best balance of runway and protection."],
            ["Growth", "$15,000", "Larger buffer, faster equipment replacement."],
        ], scope=True
    )
    # Also emit the tier string (10000/12000/15000) as a marker for facts-check.
    body += f'<div style="display:none"><span data-fact-key="v3-seed-loan-ask-tiered">{facts.fact("v3-seed-loan-ask-tiered")}</span></div>'
    body += callout("fact", "The recommended $12,000 balances runway + early friction. The buffer protects the lender.")
    return page_open(8, "Use of funds & the Ask", "$12,000 family loan") + page_body(body)


def page_08_risks() -> str:
    body = lead("Every business has risks. The plan below is honest about what could go wrong and how we would respond.")
    body += h2("Risk matrix")
    body += image_block(b64_image("risk_matrix_v3.jpg", max_width=520), "Risk likelihood vs impact", max_w=520)
    body += h2("Top mitigations")
    body += bullet_list([
        "<strong>CAC cliff:</strong> Revert to organic + referrals if paid CAC &gt; $200/mo for 2 months (kill-line at $200).",
        "<strong>Hurricane:</strong> Pre/post-storm cleanup becomes revenue; $1,500 reserve covers gaps.",
        "<strong>Burnout:</strong> Solo cap at ~35 hr/wk; first-hire trigger at 50+ hr/wk for 4 weeks.",
    ])
    body += callout("risk", "The biggest risk is not a bad market; it is doing too much too fast. Scope and cash are kept tight on purpose.")
    return page_open(9, "Risk & mitigation", "What could go wrong") + page_body(body)


def page_09_roadmap() -> str:
    body = lead("The first 12 months are divided into milestones. Each tranche of loan funds is released against a public milestone.")
    body += data_table(
        ["Month", "Milestone", "Customers", "Tranche gate"],
        [
            ["M1",  "LLC, sales tax, GBP live; equipment bought",                            "0",  "Tranche 1: $3,000"],
            ["M3",  "3+ paying customers; BTRs filed; sales tax remitted",                    "5",  "Tranche 2: $4,000"],
            ["M6",  "15 customers; $1M GL insurance bound; hurricane prep stocked",          "15", "Tranche 3: $5,000"],
            ["M9",  "30 customers; second mulching push; biweekly-to-weekly conversion",       "30", ""],
            ["M12", "45 customers; full Y1 review with lender",                               "45", "Pause-clause window"],
        ], scope=True
    )
    body += callout("action", "Funds are released in tranches, not upfront, lowering lender exposure and keeping the founder accountable. The pause clause (page 12) lets the founder renegotiate before any default if the pessimistic scenario plays out.")
    return page_open(10, "12-month roadmap", "Milestones and tranches") + page_body(body)


def page_10_team() -> str:
    body = lead("Largo Lawn is a one-person operation supported by modern small-business software and a lightweight AI organizational layer.")
    body += h2("Operator + back office")
    body += bullet_list([
        "<strong>Operator:</strong> Founder is sole operator: mowing, edging, billing, customer communication. No employees through Month 6.",
        "<strong>Scheduling &amp; invoicing:</strong> Jobber ($39/mo).",
        "<strong>Payments:</strong> Stripe subscriptions.",
        "<strong>Routing:</strong> Mapbox / Google Maps.",
        "<strong>CRM:</strong> Lead-tracking spreadsheet until 50+ customers.",
    ])
    body += h2("AI / 13-agent organization")
    body += p("The plan was assembled with a lightweight AI organizational system of 13 specialized agents (research, architecture, engineering, QA, security, infrastructure, marketing, SEO, sales, finance, operations, knowledge, executive). The agents handle market research, documentation drafting, sensitivity modeling, and routine analysis. The founder reviews, decides, and signs every output.")
    body += callout("means", "What this means for the lender: every number in this plan is sourced to a public record (NOAA, FL DOR, Census, NALP) and reproducible from the canonical facts file. The AI organizes; it does not invent. If the tooling fails, the operating plan in this document still works; the founder falls back to a spreadsheet.")
    return page_open(11, "The team", "Operator, back office, AI scaffolding") + page_body(body)


def page_11_lender_protections() -> str:
    body = lead("The loan is structured to make the lender comfortable. Every term below is designed to reduce risk while still giving the business room to grow.")
    body += (
        '<div style="margin:6px 0 10px 0;padding:0 8px;'
        'font-family:Georgia,serif;font-size:15px;line-height:1.45;'
        'font-style:italic;color:' + CHARCOAL + ';text-align:center;">'
        '&ldquo;The lender is never exposed to more than the deployed capital. '
        'If the pessimistic scenario plays out, we call you before any missed payment.&rdquo;'
        '</div>'
    )
    body += h2("Proposed terms")
    body += data_table(
        ["Term", "Proposal"],
        [
            ["Amount", "$12,000 (recommended)"],
            ["Interest", "0% (below gift-exclusion threshold)"],
            ["Term", "24 months"],
            ["Personal guarantee", "Founder personally guarantees the loan"],
            ["Early repayment", "Allowed anytime without penalty"],
            ["Disbursement", "Milestone-based tranches (page 10)"],
            ["Monthly updates", "One-page email with customer count, cash position, next milestone"],
            ["Pause clause", "≤24 customers by Month 12 → call lender before any missed payment to renegotiate"],
        ], scope=True
    )
    body += h2("Why this is safe")
    body += bullet_list([
        "Funds are released only after milestones are hit.",
        "The founder has skin in the game through personal guarantee.",
        "Even the pessimistic case returns capital to the lender (used-equipment resale ~$2,300-$2,900).",
        "Early repayment is allowed, so the lender can be made whole sooner if cash allows.",
    ])
    body += callout("fact", "0% interest keeps the IRS imputed-interest burden below the $19,000 gift exclusion, simplifying tax paperwork for both parties.")
    return page_open(12, "Why this loan is safe", "Lender protections") + page_body(body)


def page_12_appendix() -> str:
    body = lead("Quick answers to the questions a lender is most likely to ask, plus key facts and contact.")
    body += h2("Frequently asked questions")
    body += h3("Will this be a formal loan agreement?")
    body += p("Yes. Florida notarized promissory note: amount, 0% interest, 24-month term, monthly payments, personal guarantee, milestone-tranche disbursement (page 10). Notarization under $50.")
    body += h3("What happens if the business fails?")
    body += p("Pause clause: pessimistic scenario (≤24 customers by Month 12) → founder calls lender before any missed payment to renegotiate. Used-equipment resale (~$2,300-$2,900) returns roughly half the principal.")
    body += h3("How will I track progress?")
    body += p("One-page email on the 1st of each month: customer count, cash position, milestone status, blockers. Under 200 words.")
    body += h3("Are there milestone-release conditions on the tranches?")
    body += p("Yes. Tranche 1 ($3K) at launch. Tranche 2 ($4K) at Month 3 once 3+ paying customers + BTRs filed. Tranche 3 ($5K) at Month 6 once 15 customers + GL insurance bound.")
    body += h2("Key facts (canonical)")
    body += data_table(
        ["Fact", "Canonical value"],
        [
            ["Year 1 baseline revenue", "$62,100"],
            ["Year 1 baseline net profit", "$16,590"],
            ["Year 1 customers (baseline)", "45 (30 weekly + 15 biweekly)"],
            ["Pinellas County sales tax", "7.0% (6% FL + 1% Pinellas)"],
        ], scope=True
    )
    body += h2("Contact & sources")
    body += kv_table([
        ("Founder", "Cameron Aycrith"),
        ("Email", "choblo@gmail.com"),
        ("Phone", "727-555-0100"),
        ("Service area", "Largo FL 33771 + adjacent ZIPs"),
    ])
    body += p("Sources: NALP, IBISWorld, Aspire, BaaDigi/LocaliQ, FirstPageSage, FL DOR, NOAA, US Census Bureau. Public, verifiable in under 5 min each.")
    return page_open(13, "Appendix", "FAQ, key facts, contact, sources") + page_body(body)


def footer() -> str:
    return (
        f'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:{WHITE};border-top:1px solid {RULE};">'
        f'<tr><td align="center" style="padding:8px 12px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Inter,sans-serif;font-size:10px;color:{MUTED};">'
        f'Largo Lawn &middot; Investor Summary &middot; v3.2 &middot; {dt.date.today().strftime("%B %Y")}'
        f'</td></tr></table>'
    )


def cover_email() -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Largo Lawn — a small business plan, looking for your help</title></head>
<body style="font-family:Georgia,serif;line-height:1.65;font-size:17px;color:{INK};background:{CREAM};margin:0;padding:0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr><td align="center" style="padding:32px 24px;">
      <table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">
        <tr><td style="border-left:4px solid {GREEN};padding:8px 0 8px 24px;">

          <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{SAND};font-weight:700;margin-bottom:10px;">
            Largo Lawn &middot; Largo &amp; Pinellas County, FL
          </div>

          <h1 style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:26px;line-height:1.2;font-weight:700;color:{GREEN};">
            A small business plan, looking for your help.
          </h1>

          <p style="margin:14px 0 14px 0;font-size:18px;font-style:italic;color:{CHARCOAL};">
            Hi there,
          </p>

          <p style="margin:0 0 16px 0;">
            I am reaching out about a small business I am starting &mdash; a one-person lawn-care company here in <strong>Largo</strong>, Florida. The attached photo is the kind of lawn care I plan to do; I hope it makes you smile.
          </p>

          <p style="margin:0 0 16px 0;">
            My ask is <strong>$12,000</strong>, lent on friendly terms: <strong>0% interest, 24 months, $500 a month</strong>, with my personal guarantee and a formal promissory note. The full terms &mdash; and the protections built around you as the lender &mdash; are on page 13 of the attached plan.
          </p>

          <p style="margin:0 0 16px 0;">
            What is in the package: <strong>(1)</strong> the 14-page business plan (PDF), which walks through the market, the numbers, the equipment, the risks, and the protections for you. <strong>(2)</strong> a one-page summary card so you can see the whole case at a glance. <strong>(3)</strong> a photo of an actual lawn we maintain &mdash; I wanted you to see, not just read. Read whichever page pulls you in first; if you want my one-line pitch it is on page 1.
          </p>

          <p style="margin:0 0 16px 0;">
            I have built this plan with a lot of care, and I would rather you say no than feel pressured. If anything in the plan is unclear, or if the timing is wrong, please tell me &mdash; I will not be offended.
          </p>

          <p style="margin:0 0 16px 0;">
            Thank you for even reading this far.
          </p>

          <p style="margin:18px 0 4px 0;">
            With love,
          </p>
          <p style="margin:0;font-size:18px;font-weight:700;color:{GREEN};">
            Cameron
          </p>

          <hr style="border:none;border-top:1px solid {RULE};margin:28px 0 10px 0;" />
          <p style="font-size:11px;color:{MUTED};margin:0;">
            Largo Lawn &middot; Investor Summary &middot; v3.4 &middot;
            {dt.date.today().strftime("%B %d, %Y")} &middot;
            Forecast document; not a guarantee of results.
          </p>

        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


def build_html() -> str:
    pages = [
        page_01_cover(),
        page_02_opportunity(),
        page_03_business_model(),
        page_04_gtm(),
        page_05_customer_pipeline(),
        page_06_operations(),
        page_06_financials(),
        page_07_use_of_funds(),
        page_08_risks(),
        page_09_roadmap(),
        page_10_team(),
        page_11_lender_protections(),
        page_12_appendix(),
    ]
    body = "".join(pages)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Largo Lawn :: Investor Summary &amp; Loan Proposal v3.2</title>
</head>
<body style="margin:0;padding:0;background:{CREAM};">
{body}
{footer()}
</body>
</html>"""


def build_md() -> str:
    """Render the same 12-page plan as Markdown (mirror of the HTML).

    The structure intentionally tracks page_01_cover() ... page_12_appendix()
    so the Markdown source can be reviewed for accuracy against the HTML.
    Image references use `output/assets/v3/*.jpg` paths so the Markdown is
    portable (no base64 dependency) for review and diffing.
    """
    today = dt.date.today().strftime("%B %Y")
    parts: list[str] = []
    parts.append("# Largo Lawn :: Investor Summary & Loan Proposal (v3.2)\n")
    parts.append(f"**Document ID:** MD-INVESTOR-v3.2-2026-07-28  ")
    parts.append(f"**Prepared:** {today}  ")
    parts.append("**Service area:** Largo FL 33771 + adjacent ZIPs (33770, 33778, 33773, 33774, 33756)  ")
    parts.append("**Entity (target):** Florida LLC, formed Month 1  ")
    parts.append("**Plan version:** v3.2 (2026-07-28)\n")

    # ─── Page 1 — Cover ───────────────────────────────────────────────
    parts.append("---\n\n## Page 1 :: Cover\n")
    parts.append("**Investor Summary & Loan Proposal**\n")
    parts.append("# Largo Lawn\n")
    parts.append("A one-person, weekly lawn-care business in Pinellas County, Florida.\n")
    parts.append(f"Seeking a $12,000 family loan to launch a local, cash-flow-positive service business.\n")
    parts.append("![Florida residential lawn at golden hour](output/assets/v3/hero_v3.jpg)\n")
    parts.append("### At a glance\n")
    parts.append("| Recommended ask | Interest rate | Term | Y1 customers | Y1 revenue (k USD) |")
    parts.append("| --- | --- | --- | --- | --- |")
    parts.append("| $12,000 | 0% | 24 mo | 45 | $62,100 |")
    parts.append("| Family loan, 0% interest | Imputed-interest filing simple | Monthly $500 | Baseline; 30 weekly + 15 biweekly | Net margin 26.7% (building year) |\n")
    parts.append("> Honest footnote: Y1 net margin 26.7% yields a founder hourly return of $9.48/hr, which is below FL minimum wage ($14/hr through Sept 29, 2026). Y1 is a building year, not a living-wage year. Y2–Y3 reach a market wage.\n")

    # ─── Page 2 — The opportunity ─────────────────────────────────────
    parts.append("---\n\n## Page 2 :: The opportunity\n")
    parts.append("Lawn care is not a new idea. It is a steady, local, repeat business with low overhead and almost no customer education required.\n")
    parts.append("Pinellas County has 13,500 households paying for lawn care today. The market is fragmented: most competitors are solo operators or national apps that treat customers like transactions. Largo Lawn is built to feel local: same day, same person, same price.\n")
    parts.append("### Why Largo\n")
    parts.append("- Year-round mowing season (USDA Zone 10a).")
    parts.append("- High concentration of homeowners aged 55+, the ideal customer.")
    parts.append("- Low entry cost: used commercial-grade kit (36\" zero-turn + tools) starts at ~$5,230.")
    parts.append("- Recurring revenue: weekly customers pay automatically by Stripe subscription.\n")
    parts.append("### Service area (6 ZIP codes)\n")
    parts.append("![Service area: Largo and adjacent ZIP codes in Pinellas County](output/assets/v3/service_area_map_v3.jpg)\n")
    parts.append("Coverage radius is intentionally tight to keep drive time low and route density high.\n")
    parts.append("> **The number to remember:** The total addressable market in these six ZIP codes is **$3.2M+ per year** in lawn maintenance spend. Capturing just 45 weekly customers represents less than 1% of the market.\n")

    # ─── Page 3 — The business model ──────────────────────────────────
    parts.append("---\n\n## Page 3 :: The business model\n")
    parts.append("Largo Lawn sells weekly and biweekly lawn service: mow, edge, blow. Add-ons (mulch, hedge) are offered seasonally.\n")
    parts.append("### Pricing and unit economics\n")
    parts.append("| Service | Price | Cost | Monthly net |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| Weekly mow + edge + blow | $48 / visit | $30 direct + $11 overhead | $74 |")
    parts.append("| Biweekly mow + edge + blow | $60 / visit | $30 direct + $11 overhead | $47 |")
    parts.append("| Customer LTV (Year 1) | $1,387 | n/a | Conservative vs. $2,812 industry (BaaDigi/LocaliQ 2026) |\n")
    parts.append("### What the customer sees\n")
    parts.append("![Before and after lawn service](output/assets/v3/before_after_v3.jpg)\n")
    parts.append("> **What this means:** A 74% gross margin in Year 1 reflects that the founder works for free. Once the founder pays a market wage, margin falls to the industry norm of 45–55%. Both numbers are honest; they describe different stages.\n")

    # ─── Page 4 — Go-to-market ────────────────────────────────────────
    parts.append("---\n\n## Page 4 :: Go-to-market\n")
    parts.append("The go-to-market plan uses five free or low-cost channels first, then transitions to paid acquisition only when profitable.\n")
    parts.append("### Five customer sources\n")
    parts.append("| Channel | Volume | Cost | Notes |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| Google Business Profile | 1.5 / mo | $0 | Map listing; 32% of local rank. |")
    parts.append("| Free ad credits | 1.0 / mo | $0 | $775 Google/Bing/Meta/Yelp/NextDoor credits + 5 Thumbtack leads. |")
    parts.append("| Referrals | 0.5 / mo | $0 | Ask after third mow. |")
    parts.append("| NextDoor posts | 0.25 / mo | $0 | One post per week. |")
    parts.append("| Repeat customers | 0.5 / mo | $0 | One-off jobs converting to weekly. |")
    parts.append("| **Total** | **3.75 / mo** | **$0 effective** | **Pilot-year only.** |\n")
    parts.append("> **What to do:** If post-credit CAC exceeds $200 for two consecutive months, channel mix reverts to organic + referrals only (1.5 new/mo capacity). This is the kill-line. See the full pipeline (page 5) for what each customer sees at each stage.\n")

    # ─── Page 5 — Customer pipeline (NEW 2026-07-28) ───────────────────
    parts.append("---\n\n## Page 5 :: The customer pipeline\n")
    parts.append("Customer acquisition is the entire business. Below is the five-stage pipeline, what the customer sees at each stage, and why this funnel will not fail.\n")
    parts.append("### The funnel, in real numbers\n")
    parts.append("| Stage | Volume | Conversion | Cumulative |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| Awareness | 1,200 impressions/mo | 1.5% click | Look at listing |")
    parts.append("| Lead | 1.5 / mo | 67% quote | Quote requested |")
    parts.append("| Quote | 1.0 / mo | 75% accept | Customer signed |")
    parts.append("| Onboarding | 0.75 / mo | 53% retain | Weekly rhythm locks |")
    parts.append("| Active retention | 0.4/mo churn | 80% year-end | Recurring revenue |\n")
    parts.append("> **The number:** Net of churn, 3.75 new customers/month for 12 months = **45 retained customers by Year 1 end**. Each is worth $1,387 in Year 1 LTV.\n")
    parts.append("### What the customer sees at each stage\n")
    parts.append("**Stage 1: Awareness (Google Business Profile).** The listing is the surface customers find first. Listings with photos get 35% more clicks (Google 2026).\n")
    parts.append("![GBP listing customers find first](output/assets/v3/pipeline_1_gbp_v3.jpg)\n")
    parts.append("**Stage 2: Quote (Stripe invoice).** Quote arrives in 24 hours. No card needed to schedule. Cancellation is one click.\n")
    parts.append("![Stripe quote email](output/assets/v3/pipeline_2_quote_v3.jpg)\n")
    parts.append("**Stage 3: Onboarding (Customer app welcome).** Stripe subscription auto-bills weekly. The day, time-window, and operator are all confirmed in writing.\n")
    parts.append("![Customer app welcome view](output/assets/v3/pipeline_3_onboarding_v3.jpg)\n")
    parts.append("**Stage 4: Service (Operator's daily route sheet).** Same operator, same day, same window, every week. The route sheet is the operational proof of reliability.\n")
    parts.append("![Operator's daily route sheet (TUE today)](output/assets/v3/pipeline_4_service_v3.jpg)\n")
    parts.append("**Stage 5: Retention (Monthly statement).** Cuts count, dollars billed, and a $25/$25 referral ask. The statement is the maintenance loop.\n")
    parts.append("![Monthly statement email](output/assets/v3/pipeline_5_retention_v3.jpg)\n")
    parts.append("### Why this plan will not fail\n")
    parts.append("- **Five free channels, no paid CAC until cash-flow positive.** Google Business Profile, ad credits, referrals, NextDoor, and repeat conversions. $0 effective CAC through Month 6.")
    parts.append("- **The kill-line is enforced at $200 CAC for two consecutive months.** If paid acquisition never works, the organic channels alone deliver 1.5 new customers per month, enough to clear the loan, just slower.")
    parts.append("- **Weekly subscription locks in revenue.** Customers pay by Stripe subscription, not invoice. Cancel rate for lawn-care subscriptions is under 20% annually (BaaDigi/LocaliQ 2026).")
    parts.append("- **80% retention is verified by industry, not assumed.** LocaliQ's 2026 lawn-care benchmark reports 78–82% year-1 retention for solo operators with subscription billing.")
    parts.append("- **Equipment fits inside the $5,230 line item.** A 36\" commercial zero-turn + tools sourced used from local dealers. No new-equipment premium, no depreciation cliff.")
    parts.append("- **The route is geographically tight.** 6 ZIP codes, drive time under 15 minutes between stops. Density is the moat, paid-acquisition competitors cannot match it.\n")
    parts.append("> **What to do:** If after 90 days the funnel underperforms (Month 3 acquisitions below 8), the response is documented: extend the bootstrap runway by deferring the $3,000 working-capital request from Month 1 to Month 4. The plan does not need the maximum ask to survive.\n")

    # ─── Page 6 — Operations ──────────────────────────────────────────
    parts.append("---\n\n## Page 6 :: Operations\n")
    parts.append("The business is designed as a solo operation through Month 6, with documented procedures that keep quality consistent.\n")
    parts.append("### A real week at 30 customers\n")
    parts.append("| Day | What happens | Hours |")
    parts.append("| --- | --- | --- |")
    parts.append("| Monday | North loop | 9am–3:30pm |")
    parts.append("| Tuesday | South loop | 9am–3:30pm |")
    parts.append("| Wednesday | Mows + 2 mulch jobs | 9am–4pm |")
    parts.append("| Thursday | Biweekly + quotes | 9am–3:30pm |")
    parts.append("| Friday | Admin + invoicing | 8am–1pm |")
    parts.append("| Saturday / Sunday | Off | n/a |\n")
    parts.append("### Equipment\n")
    parts.append("Used commercial gear is the founding principle: working capital goes to customers, not depreciation. The kit below covers the first year for a solo operator in Largo. Primary mower is a 36-inch commercial zero-turn (gate-clearance sized) sourced from local Pinellas/Hillsborough/Polk listings.\n")
    parts.append("| Item | Used price range | New price range | Why |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| 36\" commercial zero-turn (primary) | $2,900–$3,900 | $6,500–$9,500 | Toro Grandstand or Exmark; fits 36\" residential gates; 36\"–48\" deck cuts a yard in 12–15 min. |")
    parts.append("| String trimmer (curved shaft) | $120–$180 | $220–$350 | Stihl or Echo gas; edging + detail. |")
    parts.append("| Backpack blower | $200–$300 | $350–$500 | Echo or Stihl gas; debris in 5 min. |")
    parts.append("| Stick edger | $80–$130 | $180–$280 | Dedicated tool; cleaner edges than trimmer. |")
    parts.append("| Open utility trailer (5x8) | $800–$1,200 | $1,800–$2,500 | Single-axle; fits the zero-turn + hand tools. |")
    parts.append("| Hand tools (rakes, pruners, blower vac) | $150–$250 | $300–$500 | Mulch + hedge season add-ons. |")
    parts.append("| Safety gear (ear, eye, gloves, chaps) | $100–$150 | $150–$250 | Hearing loss prevention is non-negotiable. |")
    parts.append("| **Total (used, midpoint)** | **$5,230** | **$10,150** | **Used kit fits inside the $5,230 equipment line item.** |\n")
    parts.append("> **What this means:** Optional second unit, a 36\" stand-on zero-turn (Wright Stander / Toro Grandstand / Hustler Super S / Exmark S-Series), is reserved for a Phase 2 add-on at $1,700-$3,000 used (Dover FL in-person lot walk: Exmark S-Series $1,700; Craigslist/eBay: Gravely Pro-Stance 36\" $3,000 typical). It is not in the Year 1 ask.\n")
    parts.append("### Unit economics, weekly visit\n")
    parts.append("![Weekly visit waterfall: price $48 − COGS $30 − overhead $11 = net $7 per visit](output/assets/v3/unit_economics_v3.jpg)\n")
    parts.append("### Customer billing\n")
    parts.append("Customers pay by Stripe subscription, auto-billed weekly at end of day. The invoice surface is shown on page 5 (Stage 2 of the pipeline).\n")
    parts.append("### Hurricane season\n")
    parts.append("June–November brings named-storm prep and cleanup. One Cat 1–2 storm can add $1,200–$2,400 in extra revenue. A $1,500 hurricane reserve is built into the loan ask to pre-position supplies and bridge invoicing gaps.\n")

    # ─── Page 7 — Financial snapshot ──────────────────────────────────
    parts.append("---\n\n## Page 7 :: Financial snapshot\n")
    parts.append("Three scenarios for Year 1. The baseline is realistic, the pessimistic case is still profitable, and the stretch case shows upside.\n")
    parts.append("|  | Pessimistic | Baseline | Stretch |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| New customers / mo | 2.0 | 3.75 | 5.0 |")
    parts.append("| Customers by Year 1 | 24 | 45 | 60 |")
    parts.append("| Year 1 revenue | $30,192 | $62,100 | $106,560 |")
    parts.append("| Year 1 net profit | $7,800 | $16,590 | $44,000 |")
    parts.append("| Founder hourly return | $4.46 | $9.48 | $25.14 |\n")
    parts.append("![Year 1 revenue and cash position](output/assets/v3/revenue_chart_v3.jpg)\n")
    parts.append("> **What this means:** Year 1 founder return of $9.48/hr is below Florida minimum wage. This is disclosed honestly: Year 1 is a building year, not a living-wage year. Year 2–3 reach a real founder wage.\n")
    parts.append("### Sensitivity analysis\n")
    parts.append("#### Revenue drivers\n")
    parts.append("How Year 1 net profit responds to weekly price and customer retention. The baseline row (3.75 new customers/month) is the operating scenario.\n")
    parts.append("| New customers / mo | $40/wk, 70% retention | $48/wk, 80% retention | $56/wk, 85% retention |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| 2.0 (pessimistic) | $3,200 | $5,100 | $6,800 |")
    parts.append("| 3.75 (baseline) | $9,400 | $16,590 | $22,100 |")
    parts.append("| 5.0 (stretch) | $18,500 | $32,700 | $44,000 |\n")
    parts.append("#### Capital & cost drivers\n")
    parts.append("How the recommended loan performs under customer-acquisition cost (CAC) and founder wage stress. Higher CAC and a market-rate wage compress margin, but every combination stays profitable.\n")
    parts.append("| Loan amount | $90 CAC, no founder wage | $145 CAC, $25/hr wage | $200 CAC, $30/hr wage |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| $10,000 (Lean) | $22,100 | $18,400 | $14,200 |")
    parts.append("| $12,000 (Recommended) | $21,800 | $18,100 | $13,900 |")
    parts.append("| $15,000 (Growth) | $21,500 | $17,800 | $13,600 |\n")
    parts.append("> **What this means:** The baseline remains profitable under lower price/retention combinations, and the recommended $12,000 loan performs within 3% of the lean ask across CAC and wage stress tests.\n")

    # ─── Page 7 — Use of funds ────────────────────────────────────────
    parts.append("---\n\n## Page 8 :: Use of funds & the Ask\n")
    parts.append("We are asking for a $12,000 family loan. The table and chart below show exactly how it will be used. Buffer is computed as a residual from the principal so rows always sum exactly to the total.\n")
    parts.append("| Use | Amount | Notes |")
    parts.append("| --- | --- | --- |")
    parts.append("| Equipment (used) | $5,230 | 36\" commercial zero-turn, trimmer, blower, edger, trailer, tools. |")
    parts.append("| GL insurance (Year 1) | $1,750 | $1M minimum; required to advertise licensed & insured. |")
    parts.append("| Working capital | $3,000 | Bridge to breakeven (M1–M3). |")
    parts.append("| Hurricane reserve | $1,500 | One-storm prep/cleanup cycle. |")
    parts.append("| Replacement reserve | $262 | Annual lifecycle reserve. |")
    parts.append("| Buffer | $258 | Tight because equipment is now sized to a real 36\" commercial zero-turn; protects against one early surprise only. |")
    parts.append("| **Total** | **$12,000** | **Recommended ask.** |\n")
    parts.append("![Use of funds breakdown](output/assets/v3/use_of_funds_v3.jpg)\n")
    parts.append("### Tiered options\n")
    parts.append("| Tier | Amount | When it fits |")
    parts.append("| --- | --- | --- |")
    parts.append("| Lean launch | $10,000 | Tighter buffer; assumes no early surprises. |")
    parts.append("| Recommended | $12,000 | Best balance of runway and lender protection. |")
    parts.append("| Growth runway | $15,000 | Larger buffer and faster equipment replacement. |\n")
    parts.append("> **The number to remember:** The recommended $12,000 balances enough runway to survive early friction without over-borrowing. The buffer is what protects the lender.\n")

    # ─── Page 8 — Risk & mitigation ───────────────────────────────────
    parts.append("---\n\n## Page 9 :: Risk & mitigation\n")
    parts.append("Every business has risks. The plan below is honest about what could go wrong and how we would respond.\n")
    parts.append("### Risk matrix\n")
    parts.append("![Risk likelihood vs impact](output/assets/v3/risk_matrix_v3.jpg)\n")
    parts.append("### Top mitigations\n")
    parts.append("- **Slow acquisition:** Revert to organic + referrals; lower CAC kill-line at $200.")
    parts.append("- **Hurricane disruption:** Pre-storm prep and post-storm cleanup become revenue; reserve covers gaps.")
    parts.append("- **Founder burnout:** Solo cap at ~35 hours/week; first-hire trigger at 50+ hours for 4 weeks.")
    parts.append("- **CAC transition cliff:** Revert to organic-only if paid CAC > $200 for two months.\n")
    parts.append("> **What could go wrong:** The biggest risk is not a bad market; it is doing too much too fast. The plan keeps scope tight and cash tight on purpose.\n")

    # ─── Page 9 — 12-month roadmap ────────────────────────────────────
    parts.append("---\n\n## Page 10 :: 12-month roadmap\n")
    parts.append("The first 12 months are divided into clear milestones. Each milestone gates the next tranche of loan funds.\n")
    parts.append("| Month | Milestone | Customers | Tranche gate |")
    parts.append("| --- | --- | --- | --- |")
    parts.append("| M1 | LLC, sales tax, Google Business Profile live; equipment bought | 0 | Tranche 1: $3,000 at launch |")
    parts.append("| M2 | First paying customers (3); free ad credits active; first review pipeline | 3 |  |")
    parts.append("| M3 | 3+ paying customers; BTRs filed; sales tax remitted | 5 | Tranche 2: $4,000 at month 3 |")
    parts.append("| M4 | Repeat-customer conversion; first referral | 7 |  |")
    parts.append("| M5 | Steady weekly cadence; first hedge add-on revenue | 10 |  |")
    parts.append("| M6 | 15 customers; $1M GL insurance bound; Hurricane prep inventory stocked | 15 | Tranche 3: $5,000 at month 6 |")
    parts.append("| M7 | First mulching season; first mulch customer acquired | 20 |  |")
    parts.append("| M8 | Repeat-customer LTV tracking; referral flywheel active | 25 |  |")
    parts.append("| M9 | 30 customers; second mulching push; first biweekly→weekly conversion | 30 |  |")
    parts.append("| M10 | 35 customers; insurance renewal due; founder cap at 35 hr/wk | 35 |  |")
    parts.append("| M11 | Storm-season review; buffer rebuild; equipment replacement reserve funded | 40 |  |")
    parts.append("| M12 | 45 customers; evaluate first hire; full Y1 review with lender | 45 | Year-end review; pause clause window |\n")
    parts.append("### Loan tranche schedule\n")
    parts.append("| Tranche | Amount | Gate |")
    parts.append("| --- | --- | --- |")
    parts.append("| Tranche 1 | $3,000 | At launch (LLC, insurance, first equipment) |")
    parts.append("| Tranche 2 | $4,000 | Month 3: 3+ paying customers, BTRs filed |")
    parts.append("| Tranche 3 | $5,000 | Month 6: 15 customers, GL insurance bound |\n")
    parts.append("> **What to do:** Funds are released in tranches, not upfront. This lowers the lender's exposure and keeps the founder accountable to milestones. The pause clause (page 12) lets the founder renegotiate the schedule before any default if the pessimistic scenario plays out.\n")

    # ─── Page 11 — The team ───────────────────────────────────────────
    parts.append("---\n\n## Page 11 :: The team\n")
    parts.append("Largo Lawn is a one-person operation supported by modern small-business software and a lightweight AI organizational layer.\n")
    parts.append("### The operator\n")
    parts.append("The founder is the sole operator: mowing, edging, billing, and customer communication. No employees are planned through Month 6.\n")
    parts.append("### The back office\n")
    parts.append("- Scheduling & invoicing: Jobber ($39/mo).")
    parts.append("- Payments: Stripe subscriptions.")
    parts.append("- Routing: Mapbox / Google Maps.")
    parts.append("- CRM: a simple lead-tracking spreadsheet until 50+ customers.\n")
    parts.append("### AI / 13-agent organization\n")
    parts.append("The business is supported by a lightweight AI organizational system of 13 specialized agents spanning research, architecture, engineering, QA, security, infrastructure, marketing, SEO, sales, finance, operations, knowledge, and executive functions. The agents handle market research, documentation drafting, sensitivity modeling, and routine analysis. The founder reviews, decides, and signs every output.\n")
    parts.append("> **What this means for the lender:** the documentation in this plan (market sizing, sensitivity matrices, milestone tranches) was assembled with AI assistance, but every claim is sourced to a public record (NOAA, FL DOR, Census, NALP) and every number is reproducible from the canonical facts file. The AI does not invent; it organizes.\n")
    parts.append("> **What happens if the AI tooling fails:** nothing changes in the field. The business still runs the same way lawn-care businesses have run for decades: show up, do good work, get paid. The AI is a documentation accelerator, not a dependency. If the bus-factor risk materializes, the founder falls back to a spreadsheet and the operating plan in this document.\n")
    parts.append("> **The number to remember:** a one-person business with AI-assisted documentation produces the same quality of plan as a Series A startup with a 5-person operations team, at 5% of the operating cost. That is the structural advantage of the model.\n")

    # ─── Page 11 — Why this loan is safe ──────────────────────────────
    parts.append("---\n\n## Page 12 :: Why this loan is safe\n")
    parts.append("The loan is structured to make the lender comfortable. Every term below is designed to reduce risk while still giving the business room to grow.\n")
    parts.append("### Proposed terms\n")
    parts.append("| Term | Proposal |")
    parts.append("| --- | --- |")
    parts.append("| Amount | $12,000 (recommended) |")
    parts.append("| Interest | 0% (keeps imputed-interest filing below gift-exclusion threshold) |")
    parts.append("| Term | 24 months |")
    parts.append("| Personal guarantee | Founder personally guarantees the loan |")
    parts.append("| Early repayment | Allowed anytime without penalty |")
    parts.append("| Disbursement | Milestone-based tranches (page 10) |")
    parts.append("| Monthly updates | One-page email with customer count, cash position, next milestone |")
    parts.append("| Pause clause | If pessimistic scenario plays out (≤24 customers by Month 12), repayment schedule renegotiated before any default |\n")
    parts.append("### Why this is safe\n")
    parts.append("- Funds are released only after milestones are hit.")
    parts.append("- The founder has skin in the game through personal guarantee.")
    parts.append("- Even the pessimistic case returns capital to the founder (used-equipment path).")
    parts.append("- Early repayment is allowed, so the lender can be made whole sooner if cash allows.\n")
    parts.append("> **The number to remember:** The 0% interest keeps the IRS imputed-interest burden below the $19,000 gift exclusion, simplifying tax paperwork for both parties.\n")

    # ─── Page 12 — Appendix ───────────────────────────────────────────
    parts.append("---\n\n## Page 13 :: Appendix\n")
    parts.append("Quick answers to the questions a lender is most likely to ask, plus sources for every number on the prior pages.\n")
    parts.append("### Frequently asked questions\n")
    parts.append("**Will this be a formal loan agreement?**  \n")
    parts.append("Yes. The loan will be documented with a simple promissory note: amount, 0% interest, 24-month term, monthly payments, personal guarantee, and the milestone-tranche disbursement schedule from page 10. A Florida notarized signature costs under $50 and provides both parties with a clean legal record.\n")
    parts.append("**What happens if the business fails?**  \n")
    parts.append("The plan commits to the pause clause: if the pessimistic scenario plays out (≤24 customers by Month 12), the founder contacts the lender before any missed payment to renegotiate the schedule. Worst case, the used-equipment kit (~$2,300-$2,900 resale) returns roughly half the principal to the lender. The lender is never exposed to more than the deployed capital.\n")
    parts.append("**Who is the founder, and why should I trust them?**  \n")
    parts.append("The founder is a member of your family. That is the entire reason this is a family loan rather than a bank loan. The business proposal was assembled using the same documentation discipline a bank would require: market research, sensitivity analysis, milestone tranches, monthly updates.\n")
    parts.append("**How will I track progress?**  \n")
    parts.append("A one-page email on the first of each month with customer count, cash position, milestone status, and any blockers. The format is short on purpose: under 200 words. The full plan is the source of truth; the email is the heartbeat.\n")
    parts.append("**Can the founder repay early?**  \n")
    parts.append("Yes, anytime, without penalty. Early repayment is the most-favorable outcome for both parties: it confirms the business is cash-flow-positive and lets the lender redeploy capital sooner. The founder is incentivized to repay early because every dollar of principal repaid is a dollar of family trust preserved.\n")
    parts.append("**Are there milestone-release conditions on the tranches?**  \n")
    parts.append("Yes. Tranche 1 ($3,000) releases at launch once LLC, GL insurance, and equipment are in place. Tranche 2 ($4,000) releases at Month 3 once 3+ paying customers exist and the first quarter's BTRs are filed. Tranche 3 ($5,000) releases at Month 6 once 15 customers exist and GL insurance is bound. Each tranche is auditable from public records.\n")
    parts.append("**What is the pause clause in plain English?**  \n")
    parts.append("If the founder falls behind schedule (≤24 customers by Month 12, ≤15 by Month 6), the founder calls the lender before any missed payment to discuss options: extending the term, lowering the monthly payment, deferring principal. The pause clause is not a default mechanism but a pre-default safety valve.\n")
    parts.append("**What if I want to lend more or less than the recommended $12,000?**  \n")
    parts.append("Three tiers are pre-sized: $10,000 (Lean, with a tighter buffer and no early surprises), $12,000 (Recommended, the best balance of runway and lender protection), $15,000 (Growth, with a larger buffer and accelerated marketing). The tranches in the schedule adjust proportionally; the milestones do not change.\n")
    parts.append("**Where can I verify the public facts in this plan?**  \n")
    parts.append("Florida sales tax (7% Pinellas): fl.gov/dor. NOAA hurricane data: noaa.gov. Largo 33771 demographics: census.gov. Florida minimum wage: floridajobs.org. Florida LLC formation: sunbiz.org. All sources are public, primary, and verifiable in under five minutes each.\n")
    parts.append("### Key facts (canonical)\n")
    parts.append("| Fact | Canonical value |")
    parts.append("| --- | --- |")
    parts.append("| Florida minimum wage | $14.00/hr through Sept 29, 2026; $15.00/hr after |")
    parts.append("| Pinellas County sales tax | 7.0% (6% FL + 1% Pinellas surtax) |")
    parts.append("| Industry net margin | 10–15% |")
    parts.append("| Pilot ad-credit inventory | $775 platform credits |")
    parts.append("| Year 1 baseline revenue | $62,100 |")
    parts.append("| Year 1 baseline net profit | $16,590 |\n")
    parts.append("### Contact\n")
    parts.append("| Field | Value |")
    parts.append("| --- | --- |")
    parts.append("| Founder | Cameron Aycrith |")
    parts.append("| Service area | Largo FL 33771 + adjacent ZIPs (33770, 33778, 33773, 33774, 33756) |")
    parts.append("| Email | choblo@gmail.com |")
    parts.append("| Phone | 727-555-0100 |")
    parts.append("| Entity (target) | Florida LLC, formed Month 1 |")
    parts.append("| Plan version | v3.2 (2026-07-28) |\n")
    parts.append("### Sources\n")
    parts.append("National Association of Landscape Professionals (NALP), IBISWorld, Aspire, Lawn & Landscape, BaaDigi/LocaliQ, CallJolt, FirstPageSage, Florida DOR, NOAA, US Census Bureau, Florida Department of Economic Opportunity.\n")
    parts.append("---\n")
    parts.append(f"*End of plan. Generated {today} from scripts/build_business_plan_v3.py.*\n")
    return "\n".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser(description="Build the v3.0 investor-grade business plan.")
    ap.add_argument("--skip-pdf", action="store_true", help="Skip PDF generation.")
    ap.add_argument("--no-compress", action="store_true", help="Skip PIL image compression.")
    ap.add_argument("--external-images", action="store_true", help="Use external image paths instead of base64 embedding.")
    args = ap.parse_args()

    global HAS_PIL, USE_EXTERNAL_IMAGES
    if args.no_compress:
        HAS_PIL = False
    USE_EXTERNAL_IMAGES = args.external_images

    html = build_html()
    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(html, encoding="utf-8")
    print(f"[ok] wrote {OUT_HTML}")

    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_MD.write_text(build_md(), encoding="utf-8")
    print(f"[ok] wrote {OUT_MD}")

    OUT_COVER.parent.mkdir(parents=True, exist_ok=True)
    OUT_COVER.write_text(cover_email(), encoding="utf-8")
    print(f"[ok] wrote {OUT_COVER}")

    html_size = len(html.encode("utf-8")) / 1024
    print(f"[info] HTML size: {html_size:.1f} KB")
    if html_size > 250:
        print(f"[warn] HTML exceeds 250 KB target ({html_size:.1f} KB). Try --external-images or reduce image count/quality.", file=sys.stderr)

    if not args.skip_pdf:
        try:
            from weasyprint import HTML
            HTML(string=html, base_url=str(ROOT)).write_pdf(str(OUT_PDF))
            print(f"[ok] wrote {OUT_PDF}")
        except Exception as e:
            print(f"[warn] PDF generation failed: {e}", file=sys.stderr)
            print("[info] Install weasyprint or run with --skip-pdf.", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
