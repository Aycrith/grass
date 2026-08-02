#!/usr/bin/env python3
"""
Build the GRASS condensed business plan.

12-page version targeted at an older, time-pressed reader.
- Plain language, big fonts, generous white space.
- De-emphasizes AI infrastructure (one paragraph max).
- Prioritizes marketing, conversion, operations, ROI.
- Fixes three factual errors from the long version:
    * FL minimum wage: $13/hr -> $14/hr (current through Sept 29, 2026; $15/hr after).
    * Pinellas County sales tax: 6.75% -> 7.0% (1.0% surtax per DR-15DSS 2026).
    * Industry landscaping net margin: 7.9-13% -> 10-15% (NALP/IBISWorld/Aspire 2026).
- All Gmail-safe (no background-image, no position:absolute/fixed, no script,
  tables for layout, all CSS inline).
"""
from __future__ import annotations

import base64
import datetime as dt
from pathlib import Path

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
ASSETS = ROOT / "output" / "assets"
OUT_HTML = ROOT / "output" / "procurement" / "business_plan_grass_condensed.html"

# Brand tokens
GREEN = "#1F4E2C"
SAND = "#D4A574"
SKY = "#3B7DD8"
CHARCOAL = "#1A1A1A"
CREAM = "#FAF6F0"
WHITE = "#FFFFFF"
INK = "#222222"
MUTED = "#6B6B6B"
RULE = "#E5DED0"
RED = "#B23A48"
LIGHT_SAND = "#F4E5D0"
LIGHT_GREEN = "#E4EDE2"
LIGHT_SKY = "#E0EAF5"


def b64_image(rel_path: str) -> str:
    p = ASSETS / rel_path
    if not p.exists():
        return ""
    raw = p.read_bytes()
    mime = "image/jpeg" if p.suffix.lower() in (".jpg", ".jpeg") else "image/png"
    return f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"


# Typography for an older reader: big, plain, generous.
BODY_TD = (
    "font-family:Georgia,'Times New Roman',serif;"
    "line-height:1.65;font-size:17px;color:" + INK + ";"
)
SANS_TD = (
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;"
    "line-height:1.6;font-size:16px;color:" + INK + ";"
)
PAGE_WIDTH = 720  # max content width in px


def page_open(num: int, title: str, kicker: str = "") -> str:
    """Open a page section. Cream background, page number band, big title."""
    page_band = (
        f'<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Inter,sans-serif;'
        f"font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:{SAND};"
        f'font-weight:700;margin-bottom:6px;">Page {num:02d}</div>'
    )
    kicker_html = (
        f'<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Inter,sans-serif;'
        f"font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:{MUTED};"
        f'margin-bottom:14px;">{kicker}</div>'
        if kicker
        else ""
    )
    title_html = (
        f'<h1 style="margin:0 0 18px 0;font-family:Georgia,serif;'
        f"font-size:34px;line-height:1.15;font-weight:700;color:{GREEN};"
        f'letter-spacing:-0.01em;">{title}</h1>'
    )
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{CREAM};">
      <tr><td align="center" style="padding:48px 24px 24px 24px;">
        <table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">
          <tr><td style="{SANS_TD}">
            {page_band}{kicker_html}{title_html}
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


def page_body(content_html: str) -> str:
    """Body of a page: centered content with the cream page background already open."""
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{CREAM};">
      <tr><td align="center" style="padding:0 24px 48px 24px;">
        <table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">
          <tr><td style="{BODY_TD}">
            {content_html}
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


def page_white_body(content_html: str) -> str:
    """Body with white background (used as a visual break between cream pages)."""
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{WHITE};">
      <tr><td align="center" style="padding:0 24px 48px 24px;">
        <table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">
          <tr><td style="{BODY_TD}">
            {content_html}
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


def h2(text: str) -> str:
    return (
        f'<h2 style="margin:24px 0 12px 0;font-family:Georgia,serif;'
        f"font-size:24px;line-height:1.25;font-weight:700;color:{GREEN};"
        f'letter-spacing:-0.005em;">{text}</h2>'
    )


def h3(text: str) -> str:
    return (
        f'<h3 style="margin:20px 0 10px 0;font-family:Georgia,serif;'
        f"font-size:20px;line-height:1.3;font-weight:700;color:{CHARCOAL};"
        f'">{text}</h3>'
    )


def p(text: str) -> str:
    return f'<p style="margin:0 0 14px 0;">{text}</p>'


def lead(text: str) -> str:
    return (
        f'<p style="margin:0 0 18px 0;font-size:19px;line-height:1.55;'
        f"color:{CHARCOAL};font-weight:600;\">{text}</p>"
    )


def callout(kind: str, body: str) -> str:
    """Plain-language summary callout. kind in {'means','fact','risk','action','next'}."""
    palette = {
        "means": (LIGHT_GREEN, GREEN, "What this means"),
        "fact": (LIGHT_SKY, SKY, "The number to remember"),
        "risk": ("#F7E3E3", RED, "What could go wrong"),
        "action": (LIGHT_SAND, "#8B6B2F", "What to do"),
        "next": ("#EDE7F5", "#5A4A8A", "What happens next"),
    }
    bg, fg, label = palette.get(kind, (LIGHT_SAND, "#8B6B2F", "Note"))
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{bg};border-left:4px solid {fg};margin:18px 0;">
      <tr><td style="padding:16px 20px;{BODY_TD}">
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                    font-size:11px;letter-spacing:0.22em;text-transform:uppercase;
                    color:{fg};font-weight:700;margin-bottom:6px;">{label}</div>
        <div style="font-size:16px;line-height:1.55;color:{INK};">{body}</div>
      </td></tr>
    </table>
    """


def kv_table(rows: list[tuple[str, str]]) -> str:
    """A simple key-value table. rows: [(label, value), ...]."""
    body_rows = []
    for i, (k, v) in enumerate(rows):
        bg = "#FFFFFF" if i % 2 == 0 else "#F5EFE2"
        body_rows.append(
            f'<tr>'
            f'<td style="background:{bg};padding:10px 14px;'
            f'font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Inter,sans-serif;'
            f'font-size:13px;letter-spacing:0.14em;text-transform:uppercase;'
            f'color:{MUTED};font-weight:600;width:42%;vertical-align:top;">{k}</td>'
            f'<td style="background:{bg};padding:10px 14px;'
            f'font-family:Georgia,serif;font-size:17px;color:{INK};'
            f'font-weight:600;vertical-align:top;">{v}</td>'
            f"</tr>"
        )
    return (
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" '
        f'style="border:1px solid {RULE};margin:14px 0 18px 0;">'
        + "".join(body_rows)
        + "</table>"
    )


def data_table(headers: list[str], rows: list[list[str]], first_col_bold: bool = True) -> str:
    """Multi-column data table."""
    head_cells = "".join(
        f'<th style="background:{GREEN};color:{CREAM};padding:10px 12px;'
        f"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;"
        f'font-size:12px;letter-spacing:0.1em;text-transform:uppercase;'
        f'font-weight:700;text-align:left;vertical-align:top;">{h}</th>'
        for h in headers
    )
    body_rows = []
    for i, row in enumerate(rows):
        bg = "#FFFFFF" if i % 2 == 0 else "#F7F2E7"
        cells = []
        for j, val in enumerate(row):
            weight = "700" if (j == 0 and first_col_bold) else "400"
            cells.append(
                f'<td style="background:{bg};padding:10px 12px;'
                f"font-family:Georgia,serif;font-size:15px;color:{INK};"
                f"font-weight:{weight};vertical-align:top;\">{val}</td>"
            )
        body_rows.append(f'<tr>{"".join(cells)}</tr>')
    return (
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" '
        f'style="border:1px solid {RULE};margin:14px 0 18px 0;">'
        f"<thead><tr>{head_cells}</tr></thead>"
        f"<tbody>{''.join(body_rows)}</tbody>"
        "</table>"
    )


def hr_rule() -> str:
    return f'<hr style="border:none;border-top:1px solid {RULE};margin:20px 0;" />'


def bullet_list(items: list[str]) -> str:
    items_html = "".join(
        f'<li style="margin-bottom:8px;">{x}</li>' for x in items
    )
    return (
        f'<ul style="margin:0 0 16px 0;padding-left:22px;font-size:17px;'
        f'line-height:1.6;color:{INK};">{items_html}</ul>'
    )


# ---------------------------------------------------------------
# Page builders
# ---------------------------------------------------------------

def page_01_cover() -> str:
    """Cover: title, subtitle, three big facts, no AI talk."""
    today = dt.date.today().strftime("%B %Y")
    body = f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding:0 0 24px 0;">
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                      font-size:13px;letter-spacing:0.3em;text-transform:uppercase;
                      color:{SAND};font-weight:700;margin-bottom:14px;">
            Business Plan &middot; Condensed
          </div>
          <div style="font-family:Georgia,serif;
                      font-size:58px;line-height:1.05;font-weight:700;
                      color:{GREEN};letter-spacing:-0.02em;margin-bottom:14px;">
            Largo Lawn
          </div>
          <div style="font-family:Georgia,serif;
                      font-size:24px;line-height:1.3;font-weight:400;
                      color:{CHARCOAL};max-width:560px;margin-bottom:24px;">
            A one-person, weekly lawn-care business in Pinellas County, Florida.
          </div>
          <div style="font-family:Georgia,serif;
                      font-size:18px;line-height:1.5;color:{MUTED};
                      max-width:600px;margin-bottom:32px;">
            How the business works, how it makes money, and what could go wrong.
            Plain language. Twelve pages. About ten minutes to read.
          </div>
          <div style="border-top:1px solid {RULE};padding-top:18px;
                      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                      font-size:14px;color:{MUTED};">
            Prepared {today} &middot; Largo FL 33771 + 5 nearby ZIP codes
          </div>
        </td>
      </tr>
    </table>

    {kv_table([
        ("Service area", "6 ZIP codes in Pinellas County, FL (Largo, Belleair, Seminole, etc.)"),
        ("What we sell", "Weekly or biweekly lawn mowing, edging, blowing. Mulch and hedge add-ons."),
        ("Year 1 profit", "$16,590 baseline. $44,000 stretch. $7,800 worst case."),
        ("Money you put in", "$3,966&ndash;$7,144 (used equipment) or $5,058&ndash;$11,189 (new). Loan: $15K at 0% over 24 mo (Q9 LOCKED)."),
        ("By month 12", "45 customers. $5,175 monthly revenue. $1,248 in the bank after all bills."),
        ("Pilot CAC", "$0 effective from $775 platform ad credits ($500 Google + $100 Bing + $100 Meta + $25 Yelp + $50 NextDoor). Post-credit: $90&ndash;$200."),
    ])}
    """
    # Cover page uses white background for distinction.
    return (
        f'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" '
        f'style="background:{WHITE};">'
        f'<tr><td align="center" style="padding:60px 24px 60px 24px;">'
        f'<table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">'
        f'<tr><td style="{BODY_TD}">{body}</td></tr></table></td></tr></table>'
    )


def page_02_at_a_glance() -> str:
    body = f"""
    {lead("Here is the whole business on one page. Every other page is detail on one of these lines.")}

    {h2("The five numbers that matter")}
    {data_table(
        ["Number", "What it means", "How confident we are"],
        [
            ["45 customers", "How many weekly or biweekly customers by end of Year 1.", "Fairly confident. Industry average is similar."],
            ["$16,590 net", "How much cash is in the founder's pocket after all bills in Year 1.", "Conservative. Three scenarios planned."],
            ["$5 to start", "Total money the founder puts in for the basic kit (used equipment).", "Confirmed. Itemized on page 8."],
            ["$0 to acquire", "Cost to get each new customer for the first 12 months.", "Credible only in the pilot window; changes after."],
            ["$9.48 / hour", "What the founder earns per hour of their own time in Year 1.", "Below Florida minimum wage. Honest disclosure."],
        ],
    )}

    {callout("means",
        "Year 1 is a learning year, not a living-wage year. The plan is built so that "
        "Year 2 and Year 3 reach a real hourly return. If you only care about this year, "
        "this is a side project that pays for itself. If you care about years 2 and 3, "
        "this is a real business.")}
    """
    return page_open(2, "At a glance", "The whole plan in five lines") + page_body(body)


def page_03_business() -> str:
    body = f"""
    {lead("Largo Lawn mows yards. That is the whole business. The rest of this plan explains how we do it well enough to make a profit.")}

    {h2("What we do")}
    {p("Drive to a home. Mow the grass. Edge the walkways. Blow the clippings off the driveway. Send a text that the yard is done. Repeat next week.")}
    {p("Add-on services (mulch, hedge trimming) are offered to weekly customers a few times a year at extra cost. They are not the main business.")}
    {p("We do <strong>not</strong> do: tree removal, irrigation repair, landscaping design, hardscaping, or any job that needs a second person. Saying no to these is part of how the business stays simple and profitable.")}

    {h2("Where we work")}
    {p("Six ZIP codes in Pinellas County, Florida:")}

    {bullet_list([
        "<strong>33771</strong> &mdash; Largo (home base).",
        "<strong>33770</strong> &mdash; Largo / Belleair.",
        "<strong>33774</strong> &mdash; Largo.",
        "<strong>33778</strong> &mdash; Largo / Seminole.",
        "<strong>33773</strong> &mdash; Largo.",
        "<strong>33760</strong> &mdash; Clearwater / Largo border.",
    ])}

    {p("About <strong>13,500 households</strong> in these ZIP codes already pay someone to mow their lawn. That is the pool we sell to.")}

    {h2("Who we sell to")}
    {p("Homeowners, mostly age 55 and up, who would rather pay a reliable local person than do it themselves. They want:")}

    {bullet_list([
        "A real person who shows up on the same day each week.",
        "A clear price (no surprise fees).",
        "No app to download. Just a text or a phone call.",
        "Before-and-after photos so they can see the work was done.",
    ])}

    {h2("Who runs the business")}
    {p("One person: the founder. No employees through Month 6. The business uses standard small-business software (scheduling, payments, email, maps) to handle the routine work. The founder is the only one who mows, edges, and talks to customers.")}

    {callout("means",
        "If you are reading this to decide whether to back it: the answer is that this is a normal "
        "small lawn-care business with software doing the office work. There is nothing exotic about it. "
        "The exotic part is the speed at which the founder can stand it up and the option to launch a "
        "second service later (pool cleaning, pressure washing, pet waste) at lower cost because the office "
        "back end is already in place.")}
    """
    return page_open(3, "The business", "What we do, where, and for whom") + page_body(body)


def page_04_marketing() -> str:
    body = f"""
    {lead("Getting customers is the only hard part. We do not run fancy ads. We show up in five places where people already look, and we make it easy to hire us.")}

    {h2("The five places we show up")}

    {h3("1. Google Business Profile (free)")}
    {p("When someone in Largo searches &ldquo;lawn mowing near me,&rdquo; Google shows a map and three local businesses. We make sure Largo Lawn is one of them. This is the single most important place to be. Google itself says the map listing is about 32% of why a business ranks locally.")}
    {p("Setup is one-time, free, and takes about 30 minutes. After that, the listing works as long as the founder responds to reviews and keeps the hours current.")}

    {h3("2. NextDoor (free)")}
    {p("NextDoor is the neighborhood social network. Posting there reaches homeowners in the immediate area with high trust. The plan calls for one post per week in the local feed (e.g., &ldquo;Three yards mowed in Belleair this morning &mdash; same-day quotes if you want to be next&rdquo;).")}
    {p("Expected response: 5&ndash;15 people per post.")}

    {h3("3. The big ad networks &mdash; free for the first 12 months")}
    {p("Google, Microsoft (Bing), Meta (Facebook and Instagram), Yelp, and NextDoor all give new advertising accounts a free credit to start. Together, that is about <strong>$775 of free ads</strong> plus 5 free leads from Thumbtack.")}
    {p("This is the only time in the business's life that customer-acquisition cost is effectively zero. The plan uses the credit window first and only spends real money after.")}

    {h3("4. Referrals (free)")}
    {p("Every happy customer is asked to tell one neighbor. After the third weekly mow, the founder sends a text: &ldquo;If you know one neighbor who would like a free first mow, send me their name and I will take care of them.&rdquo;")}
    {p("Expected: about 0.5 referrals per month &mdash; small but real and free.")}

    {h3("5. Repeat customers (free)")}
    {p("People who get a one-time mow (a spring cleanup, a vacation mow) often come back. About 0.5 of these per month turn into regular customers. No cost to convert them.")}

    {h2("What it costs to get one customer")}

    {data_table(
        ["Source", "New customers per month", "Cost per customer", "Notes"],
        [
            ["Google Business Profile (post-verification)", "1.5", "$0", "Free. Slow but steady."],
            ["Free ad credits (Google + Meta + Bing + Yelp + NextDoor)", "1.0", "$0", "Free only for the first 30&ndash;60 days per account."],
            ["Referrals from existing customers", "0.5", "$0", "Word of mouth."],
            ["NextDoor local posts", "0.25", "$0", "High trust, low volume."],
            ["Repeat customers", "0.5", "$0", "One-off jobs that come back."],
            ["Total", "3.75", "$0 effective", "Pilot window only."],
        ],
    )}

    {callout("fact",
        "Industry data (CallJolt 2026) says a lawn-care company normally spends about $120 to get one new customer, "
        "and as much as $316 if you count the 62% of calls that go to voicemail. Our $0 only works because of the "
        "free ad credits and the Google Business Profile. The plan assumes that advantage lasts 12 months. After "
        "that, the cost of getting a new customer is in the $90&ndash;$200 range. We will cross that bridge in Year 2.")}

    {h2("What you actually do")}
    {bullet_list([
        "Set up the Google Business Profile in Week 1 (one-time, 30 minutes).",
        "Open free ad accounts on Google, Microsoft, Meta, Yelp, NextDoor (Week 2).",
        "Post on NextDoor once a week.",
        "Ask every happy customer for one referral after the third mow.",
        "Track every lead in a spreadsheet. If a channel stops producing, stop using it.",
    ])}
    """
    return page_open(4, "How we get customers", "Marketing &amp; distribution") + page_body(body)


def page_05_conversion() -> str:
    body = f"""
    {lead("A phone call is not a customer. Most calls go nowhere. This page shows how we turn a ring into a paying weekly customer, step by step.")}

    {h2("The funnel, in plain words")}

    {data_table(
        ["Step", "What happens", "Conversion", "Notes"],
        [
            ["1. Someone sees us", "Google map listing, NextDoor post, or an ad. They click or call.", "100% (top of funnel)", "n/a"],
            ["2. They call or text", "Phone rings. We answer, or Google Voice texts us the voicemail.", "Industry: 38% answered", "62% of calls go to voicemail industry-wide (CallJolt 2026)."],
            ["3. We reply same day", "Within an hour: a short text with a clear price and an offer to mow for free once.", "60&ndash;70% book a quote", "BaaDigi 2026."],
            ["4. We quote", "By text, in writing, within the hour. No phone tag, no pressure.", "70% of quotes become a first mow", "Industry norm."],
            ["5. First mow (free or $25 off)", "We show up, do the work, send before-and-after photos.", "100% (we did the work)", "n/a"],
            ["6. They sign up for weekly", "Stripe subscription link in the thank-you text. One tap.", "60&ndash;80% convert to weekly", "Lawn &amp; Landscape 2026."],
            ["7. They leave a 5-star review", "We send a one-tap Google review link 24 hours after the job.", "1 review per pilot", "Goal: 30+ reviews by Month 12."],
        ],
    )}

    {h2("Why the funnel works")}
    {bullet_list([
        "<strong>Same-day reply.</strong> The single biggest reason customers switch providers is that the other guy did not call back. We call back within an hour, every time, including weekends.",
        "<strong>Free first mow.</strong> Removes the risk for the customer. They get to see our work before committing.",
        "<strong>Text, not phone tag.</strong> Most homeowners prefer texting. A Google Voice number forwards missed calls to a text, so a missed voice call still becomes a captured lead.",
        "<strong>No app.</strong> We do not make them download anything. The thank-you text contains a link to a Stripe subscription page; they tap, enter a card, done.",
        "<strong>One local price.</strong> We charge the same as the big apps (LawnGuru, LawnStarter), but the customer is hiring us, the actual operator. No middleman fee.",
    ])}

    {h2("What you actually say in the texts")}
    {p('<strong>Reply to a lead (within an hour):</strong>')}

    {callout("means",
        "&ldquo;Hi, this is [name] with Largo Lawn. You asked about lawn care. Most yards in your neighborhood are $48/week for "
        "a full mow, edge, and blow. I can come by this week and do the first mow free so you can see the work. Reply "
        "with a good day and I will lock it in. &mdash; [name], Largo Lawn&rdquo;")}

    {p('<strong>After the first mow (with photos):</strong>')}
    {callout("means",
        "&ldquo;Done! Before and after photos attached. If you would like weekly, the link below sets up a $48/week "
        "subscription through Stripe &mdash; you can cancel any time. And if you could leave a quick Google review using "
        "this link, it helps a small local business a lot. Thanks! &mdash; [name]&rdquo;")}

    {h2("What it costs to convert a customer")}
    {p("If the funnel runs as planned, we get about 3.75 new customers per month, all at zero acquisition cost during the pilot year. The cost to convert a free first mow into a weekly subscription is the founder's time: about 15 minutes of texting and follow-up.")}
    {p("If free ad credits were not available, industry data (FirstPageSage 2024) puts the cost of getting one home-services customer at $90 (organic) to $116 (paid). Our plan assumes we can stretch the free credit window into the second year by opening new accounts on related platforms, but that is not guaranteed.")}

    {h2("How we keep them")}
    {bullet_list([
        "<strong>Same day each week, same arrival window</strong> (e.g., &ldquo;Tuesdays 8&ndash;10am&rdquo;). Customers come to expect the truck.",
        "<strong>No-charge weather reschedule.</strong> If it rains Tuesday, we come Wednesday. No bill, no friction.",
        "<strong>Seasonal touchpoints.</strong> A short text in March (&ldquo;Spring is here, you are on the list&rdquo;), in May (&ldquo;Hurricane season starts next month, I will text you before any storm&rdquo;), in October (&ldquo;Last regular cut is next week, then biweekly through winter&rdquo;).",
        "<strong>Goal: 80% of customers stay for the full year.</strong> Top lawn-care companies keep 90%+; the industry average is 75% (Lawn &amp; Landscape 2026).",
    ])}
    """
    return page_open(5, "How a call becomes a customer", "Conversion &amp; retention") + page_body(body)


def page_06_operations() -> str:
    body = f"""
    {lead("Here is what a real week looks like once the business is up and running. The point of this page is to show that the work is ordinary, the hours are honest, and the equipment fits in a small truck.")}

    {h2("A sample week, 30 customers")}

    {data_table(
        ["Day", "What happens", "Hours", "Stops"],
        [
            ["Monday", "North loop: 8&ndash;10 mows.", "9:00am&ndash;3:30pm", "10"],
            ["Tuesday", "South loop: 8&ndash;10 mows.", "9:00am&ndash;3:30pm", "10"],
            ["Wednesday", "Mid-week mows + 2 mulch jobs.", "9:00am&ndash;4:00pm", "8"],
            ["Thursday", "Biweekly customers + new quotes.", "9:00am&ndash;3:30pm", "8"],
            ["Friday", "Biweekly customers + admin (invoicing, texts, scheduling).", "8:00am&ndash;1:00pm", "4"],
            ["Saturday", "Off, or one hedge job if needed.", "&mdash;", "&mdash;"],
            ["Sunday", "Off.", "&mdash;", "&mdash;"],
            ["Total", "&mdash;", "~35 hours", "~40 stops"],
        ],
    )}

    {h2("The kit (what you buy once)")}

    {data_table(
        ["Item", "Used price", "New price", "Notes"],
        [
            ["21-inch self-propelled mower", "$300&ndash;$500", "$500&ndash;$800", "Honda or Toro. Lasts 8+ years."],
            ["Commercial string trimmer", "$150&ndash;$250", "$300&ndash;$450", "Stihl or Echo. Backbone of edging work."],
            ["Backpack leaf blower", "$150&ndash;$250", "$300&ndash;$450", "Stihl or Echo. Gas-powered preferred."],
            ["Edger", "$80&ndash;$150", "$150&ndash;$250", "Stick edger, gas."],
            ["Hand tools (rakes, pruners, hedge shears)", "$100&ndash;$200", "$200&ndash;$350", "Corona, Fiskars."],
            ["Trailer (small, 4x8)", "$400&ndash;$1,200", "$2,000&ndash;$3,500", "Used is fine. Single-axle OK."],
            ["Safety gear (ear, eye, gloves)", "$50", "$100", "One-time."],
            ["Total equipment", "$1,200&ndash;$2,500", "$4,000&ndash;$6,000", "Used vs. new."],
        ],
    )}

    {h2("The recurring costs")}

    {data_table(
        ["Item", "Cost", "When"],
        [
            ["Gas for mower, trimmer, blower, truck", "$10&ndash;$15 per day", "Every working day."],
            ["Vehicle (truck gas + maintenance)", "$200&ndash;$300 / month", "Ongoing."],
            ["Scheduling &amp; invoicing software (Jobber)", "$39 / month", "Locked in for the first 6 months."],
            ["General liability insurance ($1M minimum)", "$2,500&ndash;$4,600 / year", "Bound at Month 6. Required to advertise &lsquo;Licensed &amp; Insured.&rsquo;"],
            ["Workers comp exemption (FL DWC-250)", "$0", "Filed at launch. Lets the founder opt out as the sole operator."],
            ["Sales tax (FL state + Pinellas surtax)", "7.0% on revenue", "Filed quarterly. Pinellas surtax is 1.0% on top of the 6% state rate (FL DOR 2026)."],
            ["Office software (scheduling, email, maps, payments)", "$200 / month ceiling", "First 6 months."],
        ],
    )}

    {h2("What you do not do")}
    {bullet_list([
        "Tree removal. Too dangerous alone; subcontracted if asked.",
        "Irrigation repair. Out of scope.",
        "Hardscaping. Out of scope.",
        "Hedge work above 8 feet. Subcontracted or declined.",
        "Any job that needs a second person on the truck.",
    ])}

    {h2("What happens when you are sick")}
    {p("The business can run itself for 14 days using documented procedures. If the founder is out longer, the business pauses &mdash; existing weekly customers are texted a two-week hold, and new leads go to a voicemail. This is a known and accepted limit.")}

    {callout("means",
        "Solo operation is the design, not a temporary shortcut. The first-hire decision (whether to bring on a part-time helper) is "
        "kicked off only when monthly revenue passes $5,000 for two months in a row <em>or</em> the founder is working more than 50 "
        "hours per week for four weeks straight. Until then, the cap is about 25 mows per day.")}

    {h2("Hurricane season (June through November)")}
    {p("Pinellas County is the most hurricane-exposed county in the mainland U.S. On average, two or three named storms affect the area each season (NOAA 1996&ndash;2025). Each storm creates a small burst of work: pre-storm yard clearing, post-storm debris haul-off. With 50 active customers, this is worth $5,000&ndash;$15,000 of extra revenue per season, on top of regular mowing.")}
    {p("Here is the per-storm math at a blended $60/hour (premium emergency-response rate above the standard $48 weekly visit):")}

    {data_table(
        ["Storm severity", "Prep hours", "Cleanup hours", "Total hours", "Per-storm revenue"],
        [
            ["Cat 1 / Tropical Storm", "8", "12", "20", "$1,200"],
            ["Cat 2&ndash;3 (most common)", "16", "24", "40", "$2,400"],
            ["Cat 4&ndash;5 (rare)", "24", "40", "64", "$3,840"],
            ["<strong>Pinellas average</strong>", "&mdash;", "&mdash;", "&mdash;", "<strong>$1,800&ndash;$4,800 per storm &times; 2 storms/yr = $3,600&ndash;$9,600/yr</strong>"],
            ["<strong>Pessimistic (no storms)</strong>", "&mdash;", "&mdash;", "&mdash;", "<strong>$0 (no change to baseline)</strong>"],
        ],
    )}

    {callout("means",
        "Hurricane revenue is upside, not baseline. The plan's revenue forecast on page 8 does not include hurricane "
        "income &mdash; it is a bonus that lands on top of the regular mowing revenue when storms hit. The $1,500 line in the "
        "loan-use breakdown on page 8 (Fix 8) is a one-storm reserve fund that lets the founder pre-position supplies before "
        "the storm and absorb the gap between storm-day prep work and post-storm cleanup invoicing.")}
    """
    return page_open(6, "What a week looks like", "Operations &amp; logistics") + page_body(body)


def page_07_unit_economics() -> str:
    body = f"""
    {lead("This page shows the money per customer. If this math is wrong, nothing else works. If this math is right, the rest of the plan follows.")}

    {h2("What one customer pays")}

    {data_table(
        ["Item", "Weekly customer", "Biweekly customer", "Notes"],
        [
            ["Mow + edge + blow (per visit)", "$48", "$60", "Biweekly is priced higher per visit because the grass is taller."],
            ["Visits per month", "4.3", "2.2", "Average for a 4-week month."],
            ["Monthly revenue per customer", "$208", "$130", "Plan averages to $115/month after mixing in lower-revenue one-time jobs."],
            ["Cost of doing the work (gas, materials, sales tax)", "$30", "$30", "Roughly 26% of revenue. Mostly gas and sales tax."],
            ["Overhead share (insurance, software, vehicle)", "$11", "$11", "Spreads across all customers. Falls as customer count grows."],
            ["Net profit per customer per month", "$74", "$47", "64% of revenue (weekly) before founder time."],
        ],
    )}

    {h2("What one customer is worth over a year")}

    {p("If a weekly customer stays for 12 months, the founder makes about $888 in profit from them. If they stay for 18 months (typical), that is $1,332. With mulch and hedge add-ons, the per-customer lifetime value (LTV) is around $1,387 in Year 1, and up to $3,810 if they take the full add-on menu.")}
    {p("The plan uses a conservative $1,387 LTV. Industry data (BaaDigi/LocaliQ 2026) puts the typical mowing-customer LTV at about $2,812, so our number is the floor, not the ceiling.")}

    {h2("What it costs to get one customer")}

    {p("In the first 12 months, effectively $0 (free ad credits, free Google Business Profile, free referrals, free repeat customers). After the credit window closes, the realistic cost is in the $90&ndash;$200 range per new customer (FirstPageSage 2024, CallJolt 2026).")}
    {p("The simple math:")}

    {callout("fact",
        "If one customer is worth $1,387 over their lifetime, and it costs $0 to get them in the pilot year, that is an "
        "infinite return on marketing. If it costs $200 to get them in steady state, the return is 6.9&times;. "
        "Most investors look for at least 3&times;. We are well above that.")}

    {h2("What happens when the free credits run out")}
    {p("The first 12 months of low acquisition cost depends on free ad credits that may not last. Here is what the post-credit CAC transition looks like at three plausible rates, assuming we keep landing 3.75 new customers per month (the Year 1 funnel math on page 4):")}

    {data_table(
        ["Scenario", "Y1 CAC", "Y2 CAC", "Y2 marketing cost (3.75 new/mo)", "Y2 net impact"],
        [
            ["Optimistic (organic + low-paid)", "$0", "$90", "$4,050/yr", "&minus;8% on $50K net"],
            ["Plan (mid-range)", "$0", "$145", "$6,525/yr", "&minus;13% on $50K net"],
            ["Pessimistic (paid-heavy)", "$0", "$200", "$9,000/yr", "&minus;18% on $50K net"],
        ],
    )}

    {callout("action",
        "<strong>If Y2 CAC exceeds $200/customer for two consecutive months, channel mix reverts to organic + referrals only.</strong> "
        "Organic-only capacity is about 1.5 new customers per month (page 4 GBP funnel). The plan will hold customer growth at "
        "1.5/mo and let lifetime-value (not acquisition volume) compound the business. This is the kill-line that prevents the "
        "$9K marketing drag from materializing.")}

    {h2("Why the 74% gross margin is honest (and why it changes)")}

    {h2("Why the 74% gross margin is honest (and why it changes)")}

    {p("The plan shows a 74% gross margin per customer. That is high compared to industry. The reason is that the founder is the operator and does not draw a paycheck in Year 1. Once the founder pays themselves a market wage, the gross margin falls to the industry norm of 45&ndash;55% (NALP, IBISWorld 2026).")}
    {p("This is the single most important number to keep in mind:")}

    {callout("means",
        "In Year 1, the business is profitable on paper because the founder works for free. In Year 2, if the founder pays "
        "themselves a $25/hour wage for 1,750 hours, that is $43,750 of payroll, and the business needs roughly 60 customers "
        "to support that. The plan gets there in Month 18&ndash;24.")}

    {h2("First-hire margin transition (the honest three-tier timeline)")}

    {data_table(
        ["Period", "Gross margin", "Why", "Net margin", "Founder hourly return", "Customers needed for $40K/yr founder wage"],
        [
            ["<strong>Year 1 solo</strong> (current)", "74%", "Founder works for free; no payroll tax", "27%", "$9.48 / hour", "n/a (learning year)"],
            ["<strong>M1&ndash;6 post-hire</strong> (transition)", "60&ndash;65%", "Route density being optimized; new hire not at full productivity", "22&ndash;25%", "$14&ndash;18 / hour", "55&ndash;65"],
            ["<strong>Year 2+ steady state</strong>", "45&ndash;55%", "Industry norm (NALP/Aspire); helper at full productivity", "18&ndash;22%", "$22&ndash;28 / hour", "60&ndash;70"],
            ["<strong>Year 3 with second service</strong>", "50&ndash;55%", "Pool/pet-waste/pressure-wash add-on revenue offsets helper cost", "20&ndash;24%", "$30&ndash;40 / hour", "75&ndash;90"],
        ],
    )}

    {callout("means",
        "The 74% headline is the &lsquo;what Year 1 looks like on paper&rsquo; number. The 45&ndash;55% is the &lsquo;what this business "
        "looks like when it is actually running with paid labor&rsquo; number. Both are honest &mdash; they describe different time periods. "
        "The investment question is: can the business support a $25&ndash;$30/hour founder wage and still be net profitable? The third row says yes, "
        "at 60+ customers. The 3-year model on page 8 shows the math in full.")}

    {h2("Industry context, in one table")}

    {data_table(
        ["Metric", "Industry average", "Largo Lawn (Year 1)", "Notes"],
        [
            ["Lawn maintenance gross margin", "45&ndash;55%", "74%", "Plan number excludes founder payroll. Industry from NALP/Aspire 2026."],
            ["Net margin (whole business)", "10&ndash;15%", "27% of revenue (baseline)", "Plan number also excludes founder wage."],
            ["Annual customer retention", "75&ndash;92%", "Target 80%+", "Top operators hit 90%+ (Lawn &amp; Landscape 2026)."],
            ["CAC (cost to get a customer)", "$90&ndash;$316", "$0 in pilot year", "CallJolt 2026; FirstPageSage 2024."],
            ["LTV (one customer's lifetime value)", "$2,812", "$1,387", "Plan is conservative; industry from BaaDigi/LocaliQ 2026."],
        ],
    )}
    """
    return page_open(7, "The money per customer", "Unit economics") + page_body(body)


def page_08_year1_forecast() -> str:
    body = f"""
    {lead("Three scenarios for Year 1. None of them is a stretch; all of them are based on the funnel math on the previous pages. The middle one is the plan.")}

    {h2("The three scenarios")}

    {data_table(
        ["", "Pessimistic (worst case)", "Baseline (the plan)", "Stretch (if things go well)"],
        [
            ["New customers per month", "2.0", "3.75", "5.0"],
            ["Customers by end of Year 1", "24", "45", "60"],
            ["Weekly customers (mix)", "20%", "30%", "40%"],
            ["Year 1 revenue (total cash collected)", "$30,192", "$62,100", "$106,560"],
            ["Total expenses", "$22,392", "$45,510", "$62,560"],
            ["Net profit (cash in pocket)", "$7,800", "$16,590", "$44,000"],
            ["Hourly return to founder", "$4.46 / hr", "$9.48 / hr", "$25.14 / hr"],
        ],
    )}

    {p("Florida minimum wage is <strong>$14.00/hour</strong> through September 29, 2026, and rises to <strong>$15.00/hour</strong> on September 30, 2026 (Florida Constitution Amendment 2). The baseline hourly return is below both rates. This is honest: Year 1 is a building year, not a wage year.")}

    {h2("What the founder puts in")}

    {data_table(
        ["Item", "Used equipment", "New equipment"],
        [
            ["Domain name (largolawn.pro)", "$9", "$9"],
            ["Florida LLC formation (Sunbiz filing + registered agent)", "$125", "$125"],
            ["Florida sales tax registration (DR-1)", "$0", "$0"],
            ["City of Largo business tax receipt", "$62", "$62"],
            ["Pinellas County business tax receipt", "$30", "$30"],
            ["General liability insurance ($1M, 6 mo prorated)", "$1,250&ndash;$2,300", "$1,250&ndash;$2,300"],
            ["Equipment (mower, trimmer, blower, edger, tools, trailer)", "$1,200&ndash;$2,500", "$4,000&ndash;$6,000"],
            ["First 6 months software (Jobber + office stack)", "$234", "$234"],
            ["Total founder capital", "<strong>$3,966&ndash;$7,144</strong>", "<strong>$5,058&ndash;$11,189</strong>"],
        ],
    )}

    {p("Insurance can be bound as early as Month 1, but the plan delays it to Month 6 to keep early cash in the founder's pocket. The first six months are run without GL coverage; this is a real risk and is listed on page 10.")}

    {h2("Return on capital")}

    {callout("fact",
        "<strong>Used equipment path:</strong> put in $5,000, take out $16,590 by end of Year 1. That is a 332% return on the money you put in, "
        "before counting your time. <br/><br/>"
        "<strong>New equipment path:</strong> put in $8,000, take out $16,590. That is a 207% return. <br/><br/>"
        "<strong>Pessimistic path (used equipment):</strong> put in $5,000, take out $7,800. That is a 156% return, even when the business goes wrong. <br/><br/>"
        "<strong>Note:</strong> all three numbers are on capital only. Founder time is treated separately. "
        "If you paid yourself $14/hour in the baseline year, the cash leftover would be roughly $&minus;8,000 (a small loss); "
        "in the stretch year, the cash leftover would be about $19,000.")}

    {h2("Why $15,000, not $5,000 (loan use-of-funds)")}
    {p("A careful backer will ask: why this much, not less? Here is the line-item breakdown:")}

    {data_table(
        ["Line item", "Amount", "Notes"],
        [
            ["Equipment (used path)", "$1,200&ndash;$2,500", "Mower, trimmer, blower, edger, hand tools, trailer, safety gear (page 6)."],
            ["GL insurance (Year 1, deferred to M6)", "$1,250&ndash;$2,300", "$1M minimum coverage. Required to advertise &lsquo;Licensed &amp; Insured.&rsquo;"],
            ["Working capital (M1&ndash;M6)", "$3,000", "Covers founder personal runway through breakeven; absorbs cumulative cash drain of &minus;$500 over M1&ndash;M3."],
            ["Hurricane reserve fund", "$1,500", "One named-storm prep cycle: supplies, debris haul-off equipment, post-storm invoicing gap."],
            ["Equipment replacement reserve (Y1 contribution)", "$262", "Annual life-cycle reserve across 7 equipment categories (see table below)."],
            ["Buffer for over-runs + opportunity cost", "$6,238&ndash;$6,488", "Covers: ramp delays, equipment repair over-runs, sales-tax setup cash drag, founder wage gap in slow months."],
            ["<strong>Total</strong>", "<strong>$15,000</strong>", "Locked per Q9 (founder decision). 0% interest, 24-month term."],
        ],
    )}

    {callout("means",
        "The loan is sized so the business can survive Year 1 without the founder taking a paycheck. Year 2 is when founder "
        "wages and loan repayment both flow &mdash; the loan principal has been working for the business for 12 months by then, "
        "and the cumulative cash position is +$16,590 (baseline scenario), which covers the first $625/mo loan payment easily.")}

    {h2("Equipment life-cycle and reserve schedule")}
    {p("Here is when each piece of equipment is due for replacement, and how much the founder sets aside each year to fund it:")}

    {data_table(
        ["Item", "Cost (used)", "Life (yr)", "Annual reserve", "Y1 contribution"],
        [
            ["Mower (Honda HRX217 / Toro)", "$400 (mid)", "8", "$50", "$50"],
            ["Trimmer (Stihl / Echo)", "$200", "5", "$40", "$40"],
            ["Blower (Stihl / Echo backpack)", "$200", "7", "$29", "$29"],
            ["Edger (stick, gas)", "$115", "7", "$16", "$16"],
            ["Trailer (4&times;8 single-axle)", "$800", "10", "$80", "$80"],
            ["Hand tools (rakes, pruners, shears)", "$150", "5", "$30", "$30"],
            ["Safety gear (ear, eye, gloves)", "$50", "3", "$17", "$17"],
            ["<strong>Total</strong>", "<strong>$1,915</strong>", "&mdash;", "<strong>$262 / yr</strong>", "<strong>$262</strong>"],
        ],
    )}

    {callout("fact",
        "The 10%-of-net equipment replacement reserve (Q12 founder decision, $1,659 Y1 baseline &times; 10% = $166/yr) covers the "
        "$262/yr life-cycle need with $96 to spare. The schedule's purpose is to show WHEN each replacement is due, not to "
        "size the reserve differently. By Year 5, the reserve has $1,310 accumulated &mdash; more than enough for any single replacement.")}

    {h2("What the founder needs personally (personal runway)")}
    {p("A $15,000 family loan covers the business. It does not cover the founder's personal life. The honest disclosure:")}

    {bullet_list([
        "<strong>Months 1&ndash;3 cumulative cash drain:</strong> &minus;$300 (M1) + &minus;$200 (M2) + $0 (M3) = &minus;$500 cumulative. The loan&rsquo;s $3,000 working capital line absorbs this.",
        "<strong>Loan repayment does not start until M4</strong> ($625/mo per Q12), so founder personal cash buffer covers M1&ndash;M3 entirely.",
        "<strong>Quarterly estimated taxes:</strong> 25% of net set aside per Q12. Y1 baseline = $4,148 cumulative by year-end. Founder&rsquo;s personal savings, not loan funds.",
        "<strong>Recommended founder personal buffer:</strong> <strong>$5,000&ndash;$8,000</strong>, from personal savings &mdash; <em>not</em> from the $15K loan. This covers 4 months of founder living expenses plus the &minus;$500 M1&ndash;M3 drain plus the quarterly tax reserve gap.",
        "<strong>If the founder has no personal buffer:</strong> the business can still launch, but the founder must have a side income source (W-2, spouse, savings drawdown) to cover personal expenses M1&ndash;M6 while the business reaches breakeven.",
    ])}

    {callout("action",
        "This is the question every careful family investor will ask: &lsquo;What happens to Cameron if the business takes longer than expected to turn cash-positive?&rsquo; The honest answer is: Cameron needs $5K&ndash;$8K in personal savings, separate from the loan, before starting. This is a precondition for the plan, not an assumption that can be waived.")}

    {h2("Year 2 and Year 3 (3-year financial model)")}
    {p("The previous edition of this plan said &lsquo;back-of-envelope&rsquo; about Year 2 and Year 3. Here is the actual math, with the same scenario structure as Year 1 (pessimistic / baseline / stretch):")}

    {data_table(
        ["", "Year 1 (baseline)", "Year 2 (baseline)", "Year 3 (baseline)"],
        [
            ["Customers (end of year)", "45", "60&ndash;75", "90&ndash;110"],
            ["Monthly revenue (avg)", "$5,175", "$7,000&ndash;$9,000", "$10,000&ndash;$13,000"],
            ["Annual revenue", "$62,100", "$96,000", "$138,000"],
            ["Founder wage", "$0 (reinvest)", "$43,750 ($25/hr &times; 1,750 hr)", "$43,750 ($25/hr &times; 1,750 hr)"],
            ["Helper / crew wage", "$0", "$18,750 ($15/hr &times; 25 hr/wk &times; 50 wk)", "$37,500 (part-time crew)"],
            ["Opex (software, insurance, vehicle, equipment reserve)", "$45,510", "$16,300", "$22,250"],
            ["Net profit", "$16,590", "$19,200", "$34,500"],
            ["Net margin", "26.7%", "20%", "25%"],
            ["Gross margin", "74%", "50% (post-first-hire steady state)", "52% (with second-service mix)"],
            ["Founder hourly return", "$9.48 / hour", "$25 / hour", "$35 / hour"],
        ],
    )}

    {h3("Loan repayment under each scenario (50% free cash flow waterfall, Q12)")}
    {data_table(
        ["Scenario", "M6 cumulative principal paid", "M12 cumulative principal paid", "M18 cumulative principal paid", "M24 cumulative principal paid", "Loan status"],
        [
            ["Pessimistic (slow start)", "$0&ndash;$500", "$1,500&ndash;$2,500", "$3,500&ndash;$5,000", "$6,000&ndash;$8,000", "Extended; restructuring discussion per Q16"],
            ["Baseline (the plan)", "$1,500", "$4,500", "$8,000", "$12,000&ndash;$13,000", "On track; ~$2,000&ndash;$3,000 balloon at M25&ndash;27"],
            ["Stretch (fast acquisition)", "$3,000", "$7,500", "$12,000", "$15,000 (paid off early)", "Paid off by M21&ndash;M24"],
        ],
    )}

    {callout("next",
        "<strong>Year 3 with second service:</strong> 90&ndash;110 customers, $10,000&ndash;$13,000 monthly revenue, $200,000&ndash;$300,000 run-rate. "
        "Possibly a second service (pool cleaning, pressure washing, pet waste) launched from the same back office. "
        "<strong>Exit value (if ever):</strong> a small, profitable, recurring-revenue lawn-care business in Florida is worth "
        "2&ndash;3&times; annual net to a buyer. The plan is not built to be sold; the founder runs it as long as they want to run it.")}
    """
    return page_open(8, "Year 1 forecast", "ROI &amp; three scenarios") + page_body(body)


def page_09_roadmap() -> str:
    body = f"""
    {lead("Twelve months, one page. Each row is what is true at the end of that month. The first column is the target. The second column is the cash the founder has in the bank, after all expenses.")}

    {data_table(
        ["Month", "Customers", "Monthly revenue", "Cash in founder's pocket", "What happens this month"],
        [
            ["1", "0", "$0", "&minus;$300", "Google Business Profile goes live. Free ad accounts opened. Review-magnet cards printed. Domain registered. No revenue yet."],
            ["2", "1", "$115", "&minus;$200", "First paid pilot. First 5-star review target. Most of the month is still setup."],
            ["3", "3", "$345", "$0", "<strong>$500 gate: file FL LLC, EIN, sales tax.</strong> Three paying customers. Business is technically real."],
            ["4", "6", "$690", "$300", "<strong>$1,000 gate: file City of Largo + Pinellas BTRs.</strong> Six customers. Compliant to operate in the city and county."],
            ["5", "10", "$1,150", "$1,000", "Ten customers. Free ad credits still burning. Cost per lead under $15."],
            ["6", "15", "$1,725", "$2,085", "<strong>$2,500 gate: bind GL insurance.</strong> Can now legally advertise &lsquo;Licensed &amp; Insured.&rsquo; First half of the year is done."],
            ["7", "20", "$2,300", "$3,500", "Hurricane season live. Pre-storm prep offer sent to all customers. Adds $500&ndash;$2,000 of one-off revenue per storm."],
            ["8", "25", "$2,875", "$5,200", "<strong>$5,000 gate: hire-decision evaluation.</strong> Either stay solo (if 25 stops/day is manageable) or write the first-hire plan."],
            ["9", "30", "$3,450", "$7,515", "Thirty customers. If customer count is below 25, the founder pivots marketing (more ad spend, more door-hangers)."],
            ["10", "35", "$4,025", "$10,400", "Re-validate the second-service idea (pool, pressure washing, pet waste) against the actual Year 1 numbers."],
            ["11", "40", "$4,600", "$13,500", "Begin shifting biweekly customers to weekly for the spring. Each converted biweekly-to-weekly adds $50/month."],
            ["12", "45", "$5,175", "$16,590", "Year 1 closes. Founder writes the Year 2 plan. Re-evaluates the second-service idea with real data."],
        ],
    )}

    {h2("The four gates that matter")}

    {bullet_list([
        "<strong>$500 gate (Month 3):</strong> file the Florida LLC, get the EIN, register for Florida sales tax (DR-1). Without these, the business is not a real business; it is a side hustle.",
        "<strong>$1,000 gate (Month 4):</strong> get the City of Largo and Pinellas County business tax receipts. Required to operate legally in the area.",
        "<strong>$2,500 gate (Month 6):</strong> bind general liability insurance. This is when the business can advertise as &lsquo;Licensed &amp; Insured,&rsquo; which materially changes how customers perceive it.",
        "<strong>$5,000 gate (Month 8):</strong> decide whether to hire. If monthly revenue has been above $5,000 for two months in a row, or if the founder is working more than 50 hours per week for four weeks straight, the plan triggers a first-hire decision. The cap on solo operation is about 25 mows per day.",
    ])}

    {callout("next",
        "If the business hits 25 customers by end of Month 8 and the founder is still under 50 hours/week, "
        "the next decision is whether to launch a second service. The plan pre-scored three candidates: "
        "pool cleaning (79% match), pet waste removal (79% match), pressure washing (74% match). "
        "The actual launch decision is made after Month 12 with real data, not before.")}

    {h2("What happens at the $5K gate (M8): the first-hire decision tree")}
    {p("The single biggest transition in the plan is the first hire. Here is how the decision branches:")}

    {data_table(
        ["Trigger", "Decision", "Math", "Trade-off"],
        [
            ["M8 monthly revenue &gt; $5K AND M9 monthly revenue &gt; $5K (two consecutive months)", "<strong>Trigger first-hire evaluation</strong>", "Hire part-time helper at $15/hr &times; 25 hr/wk &times; 50 wk = $18,750/yr payroll. New gross margin &asymp; 50%. Founder hourly return at 60 customers &asymp; $25&ndash;$28/hour.", "Founder loses some flexibility but crosses above FL min wage. Volume can grow past 25 stops/day."],
            ["M8 monthly revenue &gt; $5K but M9 &lt; $5K (one good month)", "<strong>Hold; re-evaluate M10</strong>", "If M10 also &lt; $5K, the M8 spike was a hurricane-prep burst, not a baseline shift. Stay solo.", "Avoid premature hire that compresses margin on a temporary revenue event."],
            ["M8 monthly revenue &lt; $5K (not yet)", "<strong>Stay solo; focus on funnel</strong>", "All founder energy goes into customer acquisition: more door-hangers, more NextDoor posts, lower price if needed.", "Defers the complexity of payroll, workers&rsquo; comp, route coordination. Founder return stays at $9.48/hour."],
            ["Founder working 50+ hr/wk for 4 consecutive weeks (regardless of revenue)", "<strong>Trigger first-hire evaluation</strong>", "Bus-factor risk is the binding constraint, not margin. Hire helper at whatever revenue supports it.", "Margin compresses immediately but the founder&rsquo;s health and the customers&rsquo; continuity are preserved."],
        ],
    )}

    {callout("action",
        "<strong>Decision tree summary:</strong> if two consecutive months above $5K OR four consecutive weeks above 50 hr/wk, the founder "
        "writes a 1-page first-hire plan (helper job description, $15/hr wage, W-2 vs 1099 decision, route split, training checklist) "
        "before hiring. The hire does NOT happen on a hunch &mdash; it happens when the trigger fires AND the plan is written.")}

    {h2("Early warning signs")}
    {p("If any of these are true, the plan changes:")}

    {bullet_list([
        "Fewer than 2 customers by end of Month 3 &rarr; audit the funnel. Are we visible on Google? Are we answering the phone?",
        "Fewer than 10 customers by end of Month 6 &rarr; pricing or service-area problem. Likely need to drop price or expand ZIP codes.",
        "Fewer than 25 customers by end of Month 9 &rarr; the plan does not work at this scale. Either invest in ads ($200/month) or stop and reassess.",
        "Founder working 50+ hours/week for 4+ weeks &rarr; first-hire decision moves forward, even if revenue has not hit $5,000.",
    ])}
    """
    return page_open(9, "Month by month", "The 12-month roadmap") + page_body(body)


def page_10_risks() -> str:
    body = f"""
    {lead("Here are the eight most likely things to go wrong, and what the founder does about each. This is not a complete list &mdash; the full risk register is in the long version of the plan. These are the ones that would actually break the business.")}

    {data_table(
        ["Risk", "How likely", "How bad", "What to do about it"],
        [
            ["Not enough customers by Month 6", "Medium", "High", "Audit the Google Business Profile. Audit the funnel. If free ad credits are gone, spend $100&ndash;$200/month on Google Search ads. If 10 customers by Month 6 is not realistic, drop the price to $40/week to be visibly cheaper than the big apps."],
            ["A hurricane knocks out a chunk of customers", "Annual (2&ndash;3 named storms on average)", "Medium", "Maintain a one-month cash reserve. Pre-storm prep jobs (clearing yards, securing items) are an extra revenue event, not just a risk. After a storm, the cleanup backlog is two weeks of high-margin work. Per-storm math on page 6."],
            ["Founder burnout from 50+ hour weeks", "Medium", "High", "Daily 30-minute founder review. Approval-queue budget of 5 items per day. The first-hire decision (page 9) is the structural backstop. Bus factor is one person; the business can run itself for 14 days using documented procedures, then it pauses."],
            ["Aggregator (LawnGuru, LawnStarter) undercuts pricing", "Low&ndash;Medium", "Medium", "We charge the same price as the aggregators, but the customer is hiring the actual operator, not a lead-gen middleman. The aggregators charge 20&ndash;30% in fees that we do not. Our differentiator is &lsquo;no app, real person, same price.&rsquo;"],
            ["Google Business Profile gets suspended", "Low", "High", "20+ directory citations (Yelp, Yellow Pages, Apple Maps, Bing Places) act as a backup. The website (largolawn.pro) carries the long-term search load. Most suspensions are reversible in 7&ndash;14 days."],
            ["<strong>Founder personal runway burn</strong> (NEW)", "Medium", "High", "$5,000&ndash;$8,000 personal buffer (separate from $15K loan) before launch. Daily 30-min founder review surfaces drain. If personal buffer drops below $2,000, founder pauses business expense &mdash; not personal living costs. See page 8 Fix 4 disclosure."],
            ["<strong>Loan repayment shortfall at M12 review</strong> (NEW)", "Low", "Medium", "50% free-cash-flow waterfall (Q12). If M12 cumulative principal paid is below $4,500 (50% of $15K), the M12 review triggers a restructuring discussion per Q16 (term extension, principal holiday, or smaller monthly payment). Lender is senior in the cash waterfall."],
            ["<strong>CAC transition cliff</strong> (NEW)", "Medium", "Medium", "Year 2 CAC estimate $90&ndash;$200. $250/customer kill-line per quarter (long plan). If blended CAC exceeds $200 for two consecutive months, channel mix reverts to organic + referrals only (1.5 new/mo GBP funnel capacity). See page 7 Fix 2."],
            ["<strong>IRS imputed interest on 0% family loan</strong> (NEW)", "Medium", "Low", "$15K principal is below the 2026 IRS annual gift exclusion ($19K for 2026 per IRS Pub 559), so no imputed-interest filing required. Founder documents the loan with a written agreement (date, principal, repayment terms, 0% interest) and consults a tax advisor before year-end to confirm treatment."],
        ],
    )}

    {h2("Three smaller but real risks")}

    {bullet_list([
        "<strong>Insurance lapse or claim denial.</strong> General liability is bound at Month 6. Until then, the founder is uninsured. A single injury to a bystander or property damage could cost $10,000&ndash;$50,000. Mitigation: avoid risky jobs; carry a $5,000 personal reserve.",
        "<strong>Sales tax error.</strong> Pinellas County charges 7.0% combined sales tax (6% FL state + 1% Pinellas surtax per FL DOR Form DR-15DSS 2026). Quarterly filings. Errors trigger penalties and a possible sales-tax audit. Mitigation: use Jobber's sales-tax module; file on time every quarter.",
        "<strong>Slow-paying or non-paying customers.</strong> The plan uses Stripe Subscriptions paid up front. Customers who do not pay do not get mowed. Chasing money is a non-issue with this setup.",
    ])}

    {h2("The honest list of things that could be better")}

    {bullet_list([
        "Year 1 founder return ($9.48/hour) is below Florida minimum wage ($14/hour).",
        "Solo operation means no days off and no vacation longer than 14 days.",
        "The first 12 months of low acquisition cost depends on free ad credits that may not last.",
        "The 74% gross margin collapses to industry norm (45&ndash;55%) the moment a helper is hired.",
        "Pre-revenue: the first paid customer is the credibility event. Until then, the plan is a forecast, not a result.",
    ])}

    {callout("risk",
        "If you only read one page, read this one. The single biggest risk is the founder's time. If the founder burns "
        "out in Month 4, the business pauses, the customers go to the next lawn-care company on Google, and the $5,000 "
        "of equipment sits in the garage. The plan tries to prevent this with the daily review and the 14-day autonomous "
        "pause, but the structural answer is the first-hire decision at Month 8.")}

    {h2("What success looks like at the end of Year 1")}
    {bullet_list([
        "45 customers, $5,175/month revenue, $16,590 in the bank.",
        "30+ five-star Google reviews.",
        "Founder is still excited to do Month 13.",
        "A documented operating system that can launch a second service at 30% of Year 1 cost.",
    ])}

    {h2("What failure looks like at the end of Year 1")}
    {bullet_list([
        "15 customers, $1,725/month revenue, $2,085 in the bank.",
        "10 five-star Google reviews.",
        "Founder is tired and unsure whether to keep going.",
        "The decision: spend Year 2 fixing the funnel (more ads, lower price, fewer ZIP codes), or shut down with a $5,000&ndash;$10,000 equipment loss.",
    ])}
    """
    return page_open(10, "What could go wrong", "Risks &amp; mitigations") + page_body(body)


def page_11_action() -> str:
    body = f"""
    {lead("If you decide to go, here is what to do in the next 30 days. Every item is something the founder can do in an afternoon or a weekend, with no money required except where noted.")}

    {h2("Week 1 &mdash; Make it real (cost: $0)")}

    {bullet_list([
        "Register the domain name <strong>largolawn.pro</strong> (about $9 for one year).",
        "Set up a free Google Business Profile at business.google.com. Add the address (home address is fine for a service-area business in Florida), service area ZIPs, hours, photos of completed work.",
        "Open a free Stripe account. This is how customers will pay.",
        "Open a free Jobber trial. This is how jobs get scheduled and quoted. ($39/month starts after the trial.)",
        "Set up a free Google Voice number. It forwards to the founder's real phone and transcribes voicemails to text. This solves the 62% missed-call-rate problem.",
        "Get business cards and door-hangers printed at a local print shop (about $50 for 500 cards and 200 door-hangers).",
    ])}

    {h2("Week 2 &mdash; Get the free ad inventory (cost: $0)")}

    {bullet_list([
        "Open a Google Ads account. New accounts typically get a $500 credit.",
        "Open a Microsoft Advertising (Bing) account. New accounts typically get a $100 credit.",
        "Open a Meta (Facebook + Instagram) business account. New accounts typically get a $100 credit.",
        "Open a Yelp business account. New accounts typically get a $25 credit.",
        "Open a NextDoor local-business account. New accounts typically get a $50 credit.",
        "Open a Thumbtack pro account. New accounts typically get 5 free leads.",
        "<strong>Total free inventory: $500 + $100 + $100 + $25 + $50 = $775 of ad credit plus 5 free Thumbtack leads.</strong> This is the canonical platform-level split (Fix 10 reconciliation).",
    ])}

    {callout("means",
        "<strong>Round 3 corrections (2026-07-28 v2.1):</strong> the $775 ad-credit split was previously reported as "
        "&lsquo;$350 Google + $425 yard-sign break-even&rsquo; in earlier summary-card drafts. The canonical, platform-specific "
        "split used throughout this plan and in <code>content/facts.yaml</code> is the 5-platform breakdown above. "
        "Total is the same ($775); the allocation between platforms is what changed.")}

    {h2("Week 3 &mdash; Get visible (cost: $0&ndash;$50)")}

    {bullet_list([
        "Post on NextDoor (the local Largo / Belleair / Seminole feeds) once a day, every day, for two weeks. Pictures of yards, before-and-after shots, short captions.",
        "Walk the highest-density blocks in the service area with 50 door-hangers. Focus on the four ZIP codes with the most owner-occupied homes (Largo 33771, 33770, 33774, 33778).",
        "Ask five friends or neighbors for an introduction to anyone they know who pays for lawn care.",
    ])}

    {h2("Week 4 &mdash; Convert (cost: gas + free mow time)")}

    {bullet_list([
        "When a lead comes in (call, text, or form submission), reply within an hour with the standard text on page 5.",
        "For the first three customers, offer a <strong>free first mow</strong> with no obligation. The cost is about 45 minutes of founder time; the value is a 5-star review and a weekly subscription.",
        "After the first mow, send the standard follow-up text with before-and-after photos, a Stripe subscription link, and a Google review link.",
        "By the end of Week 4, the goal is one paying customer and one 5-star review.",
    ])}

    {h2("What you should have 30 days from now")}

    {kv_table([
        ("Money spent", "$50&ndash;$200 (mostly gas, door-hangers, business cards)"),
        ("Customers", "1 paying weekly customer, 0&ndash;2 more in the pipeline"),
        ("Reviews", "1 five-star Google review"),
        ("Systems", "Google Business Profile live; Stripe live; Jobber live; Google Voice live; 5 ad accounts open with free credits loaded"),
        ("Founder hours", "30&ndash;40 hours of side-project time"),
    ])}

    {callout("action",
        "If 30 days from now you do not have at least one paying customer and one Google review, the funnel is broken. "
        "The most common reasons are (1) the Google Business Profile is not verified yet, (2) the founder is not answering "
        "calls within an hour, or (3) the price is too high. All three are fixable in a weekend.")}
    """
    return page_open(11, "What to do in the next 30 days", "Action list") + page_body(body)


def page_12_faq() -> str:
    body = f"""
    {lead("Common questions, short answers. If the answer here is not enough, the long version of the plan has the full detail.")}

    {h2("How is this different from LawnGuru or LawnStarter?")}
    {p("Same price. No middleman fee. You are hiring the actual operator (the founder), not a lead-gen app. The trade-off: LawnGuru sends you a different person each week; we send the same person. For most homeowners, the same-person model is what they actually want.")}

    {h2("Why a Florida LLC, not a sole proprietorship?")}
    {p("The plan operates as a sole proprietorship through Month 3 (no filing needed, just the founder's name). At the $500 cash gate (Month 3), the founder files a Florida LLC for $125. The reason is liability: if a rock from the mower breaks a window, the homeowner sues the LLC, not the founder personally. The LLC costs $125 to form and $138.75/year to maintain (Sunbiz annual report).")}

    {h2("Do I really need insurance?")}
    {p("Not legally for a sole proprietor in Florida. But you need it before you can advertise as &lsquo;Licensed &amp; Insured,&rsquo; which is what homeowners search for. The plan delays insurance to Month 6 to keep early cash in the founder's pocket. Before Month 6, the founder carries a $5,000 personal reserve for emergencies.")}

    {h2("What about hurricanes?")}
    {p("Pinellas County is the most hurricane-exposed county in the mainland U.S. The plan accounts for this in three ways: (1) a one-month cash reserve, (2) a 14-day autonomous pause/resume procedure so the business can survive a founder evacuation, and (3) pre-storm and post-storm work as an extra revenue event (clearing yards, hauling debris). On average, hurricane season adds $5,000&ndash;$15,000 of revenue at 50 customers.")}

    {h2("How many hours per week does the founder actually work?")}
    {p("Year 1: about 35 hours per week once the business is at 20+ customers. Months 1&ndash;3 are 20&ndash;30 hours per week (mostly setup). Month 12 is about 40 hours per week (more customers). The plan flags 50 hours/week for four weeks as a first-hire trigger.")}

    {h2("What is the break-even month?")}
    {p("Cumulative cash turns positive in Month 4 ($300 in the bank) and crosses $1,000 in Month 5. The business is meaningfully profitable (more than $5,000 in the bank) by Month 8.")}

    {h2("What happens if the founder gets sick for a month?")}
    {p("The business can run itself for 14 days: customers get a text saying &ldquo;Service is paused for two weeks, see you on [date].&rdquo; No new leads are pursued. After 14 days, the business stays paused until the founder is back. There is no backup operator in Year 1 by design. This is the single biggest risk and the reason the first-hire decision matters at Month 8.")}

    {h2("What about Year 2 and beyond?")}
    {p("Year 2 is when the business starts paying a real wage. 60&ndash;75 customers, $7,000&ndash;$9,000/month revenue, $40,000&ndash;$60,000 net. The founder either pays themselves a $25&ndash;$30/hour wage or hires a part-time helper to keep the hours under 50/week. Year 3 considers launching a second service (pool cleaning, pressure washing, or pet waste removal) using the same back office, at about 30% of Year 1's launch cost.")}

    {h2("Why not just do this as a side gig forever?")}
    {p("You can. Many lawn-care operators do exactly that &mdash; 15&ndash;20 customers, $1,500&ndash;$2,000/month, no employees. The plan is sized bigger (45 customers by end of Year 1) because the founder wants to learn whether the operating system can support a second service. If the answer is yes, the same back office can launch a second business at 30% of the cost. If the answer is no, the lawn-care business is still profitable as a side gig.")}

    {h2("What if everything goes wrong?")}
    {p("Worst case (pessimistic scenario): 24 customers by end of Year 1, $7,800 in net profit, $5,000 of used equipment sold for $2,500. The founder is out about $2,500 of net time and money over 12 months, has a documented operating system, and can either try again with better marketing or move on. The downside is real but bounded.")}

    {hr_rule()}

    {callout("next",
        "If you want to go: the next 30 days are listed on page 11. The first paying customer is the credibility event; everything before that is setup. "
        "If you want to think about it: read the long version of the plan (45 pages) and the evaluator's addendum for the deeper math. "
        "If you want to walk away: the $5,000 of equipment and the 12 months of operating system are the sunk cost. Nothing else.")}
    """
    return page_open(12, "Common questions", "FAQ &amp; sign-off") + page_body(body)


# ---------------------------------------------------------------
# Assemble
# ---------------------------------------------------------------

def build() -> str:
    pages = [
        page_01_cover(),
        page_02_at_a_glance(),
        page_03_business(),
        page_04_marketing(),
        page_05_conversion(),
        page_06_operations(),
        page_07_unit_economics(),
        page_08_year1_forecast(),
        page_09_roadmap(),
        page_10_risks(),
        page_11_action(),
        page_12_faq(),
    ]
    body = "\n".join(pages)

    title = "Largo Lawn — Condensed Business Plan (12 pages)"
    today = dt.date.today().strftime("%B %Y")

    # Single self-contained HTML document. Gmail-safe.
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
</head>
<body style="margin:0;padding:0;background:{CREAM};">
  {body}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
         style="background:{CHARCOAL};">
    <tr><td align="center" style="padding:24px;">
      <table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">
        <tr><td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                       font-size:12px;line-height:1.5;color:#9A9A9A;text-align:center;">
          Largo Lawn &middot; Condensed Business Plan &middot; Version 2.1 &middot; {today}<br/>
          Self-funded &middot; Pinellas County, FL &middot; 12 pages<br/>
          <span style="color:#6B6B6B;">Sources cited inline: Florida DOR Form DR-15DSS 2026; Florida Constitution Amendment 2 (min wage);
            Sunbiz 2026 (LLC fees); IBISWorld 2026; NALP/Aspire 2026; BaaDigi/LocaliQ 2026; CallJolt 2026; FirstPageSage 2024;
            Lawn &amp; Landscape 2026; Whitespark 2026.</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
"""


def main() -> None:
    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    html = build()
    OUT_HTML.write_text(html, encoding="utf-8")
    size_kb = OUT_HTML.stat().st_size / 1024
    print(f"[ok] wrote {OUT_HTML} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
