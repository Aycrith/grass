"""Shared layout primitives for the GRASS business-plan builders.

This module consolidates the HTML/Markdown rendering primitives previously
duplicated across `build_condensed_business_plan.py`, `build_business_plan.py`,
and `build_business_plan_v3.py`. v3 imports from here; the older builders can
be migrated incrementally without changing their output.

Design notes
------------
* Gmail-safe: no <style> blocks in callers' output, no scripts, no
  position:absolute/fixed, no background-image. Every style is inlined.
* Tables-for-layout: every page wrapper is a <table role="presentation"> so
  Gmail renders the layout identically to a browser.
* Accessibility: data_table(..., scope=True) emits <caption> + <th scope="...">;
  layout tables keep role="presentation".
* Brand tokens: GREEN, SAND, SKY, CHARCOAL, CREAM, WHITE, INK, MUTED, RULE,
  RED, LIGHT_SAND, LIGHT_GREEN, LIGHT_SKY — exactly the values used by the
  condensed and full builders.
* Shape consistency (high-end-visual-design §4.4): data is sharp
  (data_table, kv_table, hr_rule have no border-radius), narrative is
  soft at 4px (stat_grid cards, image frames). Callouts use a 4px
  left border only. Single radius scale locked; no mixed systems.
  Do not introduce new radii without updating this rule.

Helpers
-------
    b64_image(rel_path, max_width=None, quality=None)
    page_open(num, title, kicker="")
    page_body(content_html)
    page_white_body(content_html)
    h2(text), h3(text), p(text), lead(text)
    callout(kind, body)
    kv_table(rows)
    data_table(headers, rows, first_col_bold=True, scope=False, caption="")
    hr_rule()
    bullet_list(items)
    stat_grid(stats)
    two_col(left, right)
    table(headers, rows, widths=None)
"""
from __future__ import annotations

import base64
import io
import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

ROOT = Path(r"C:\Users\camer\DEVNEW\GRASS")
ASSETS = ROOT / "output" / "assets"

# ---------------------------------------------------------------------------
# Brand tokens (must match build_condensed_business_plan.py exactly)
# ---------------------------------------------------------------------------

# Palette lock (high-end-visual-design §4.2):
#   * GREEN    — sole accent color (primary action, headers, h1/h2/h3, borders)
#   * SAND     — secondary accent (callout eyebrow, eyebrow band only)
#   * CREAM    — primary surface (page background)
#   * WHITE    — inverted surface (white-body break between cream pages)
#   * RULE     — the only neutral line color
#   * MUTED    — the only neutral text color
#   * INK      — body text on light surfaces
#   * CHARCOAL — emphasized text on light surfaces
# No warm-grey / cool-grey drift; no new accent colors. The token set
# below must stay byte-equal with build_condensed_business_plan.py.

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

PAGE_WIDTH = 720  # max content width in px

BODY_TD = (
    "font-family:Georgia,'Times New Roman',serif;"
    "line-height:1.35;font-size:14px;color:" + INK + ";"
)

# Typography pairing (high-end-visual-design §4.1):
#   * Display / body (h1, h2, h3, paragraph copy, stat values) -> Georgia serif
#   * Labels / eyebrows / footnotes / table headers -> Inter sans
#   * Italic descender clearance: italic Georgia needs leading >= 1.1
#     and padding-bottom >= 4px to clear $, y, g, j, p, q descenders.
#   * Same-family emphasis only - never mix serif + sans inside one headline
#     for "interest"; use bold or italic of the SAME family instead.

SANS_TD = (
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;"
    "line-height:1.6;font-size:16px;color:" + INK + ";"
)
GLOBAL_TD = (
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif;"
    "line-height:1.55;font-size:15px;"
)

# ---------------------------------------------------------------------------
# Image helpers
# ---------------------------------------------------------------------------


def b64_image(rel_path: str, max_width: int | None = None, quality: int | None = None) -> str:
    """Return a data: URL for a local image.

    When `max_width` is given, PIL is used (if available) to resize + JPEG-re-encode
    to keep base64 size small. When PIL is unavailable, the original bytes are
    embedded with a stderr warning. `quality` defaults to 50 when compressing.
    """
    p = ASSETS / rel_path
    if not p.exists():
        print(f"[b64_image] missing: {p}", flush=True)
        return ""

    suffix = p.suffix.lower()
    mime = "image/jpeg" if suffix in (".jpg", ".jpeg") else "image/png"

    if max_width is None:
        raw = p.read_bytes()
        return f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"

    # Compress via PIL
    try:
        from PIL import Image
    except ImportError:
        print("[b64_image] PIL not available; embedding uncompressed", flush=True)
        raw = p.read_bytes()
        return f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"

    q = quality if quality is not None else 50
    img = Image.open(p)
    if img.mode not in ("RGB",):
        img = img.convert("RGB")
    if img.width > max_width:
        ratio = max_width / img.width
        new_h = int(img.height * ratio)
        try:
            resample = Image.Resampling.LANCZOS
        except AttributeError:  # Pillow < 9.1
            resample = Image.LANCZOS
        img = img.resize((max_width, new_h), resample=resample)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=q, optimize=True)
    return f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('ascii')}"


def external_image_src(rel_path: str) -> str:
    """For --external-images mode. Returns a file:// URL relative to ASSETS."""
    return (ASSETS / rel_path).as_uri()


# ---------------------------------------------------------------------------
# Page wrappers
# ---------------------------------------------------------------------------


def page_open(num: int, title: str, kicker: str = "") -> str:
    """Open a page section: cream background, page-number band, kicker, big title.

    The page-number band is intentionally demoted to a small gray running
    header (not a typographic eyebrow) so each page has only one true
    eyebrow: the topic kicker. This keeps the document's editorial eyebrow
    budget under control while preserving the navigational page marker.
    """
    page_band = (
        f'<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Inter,sans-serif;'
        f"font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:{MUTED};"
        f'font-weight:600;margin-bottom:8px;">Page {num:02d}</div>'
    )
    kicker_html = (
        f'<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Inter,sans-serif;'
        f"font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:{GREEN};"
        f'font-weight:700;margin-bottom:14px;">{kicker}</div>'
        if kicker else ""
    )
    title_html = (
        f'<h1 style="margin:0 0 12px 0;font-family:Georgia,serif;'
        f"font-size:28px;line-height:1.1;font-weight:700;color:{GREEN};"
        f'letter-spacing:-0.01em;">{title}</h1>'
    )
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{CREAM};page-break-before:always;page-break-after:avoid;break-before:page;">
      <tr><td align="center" style="padding:18px 24px 6px 24px;">
        <table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">
          <tr><td style="{SANS_TD}">
            {page_band}{kicker_html}{title_html}
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


def page_body(content_html: str) -> str:
    """Body of a page: centered content with cream page background already open."""
    return f"""
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
           style="background:{CREAM};">
      <tr><td align="center" style="padding:0 24px 0 24px;">
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
      <tr><td align="center" style="padding:0 24px 0 24px;">
        <table role="presentation" width="{PAGE_WIDTH}" cellspacing="0" cellpadding="0" border="0">
          <tr><td style="{BODY_TD}">
            {content_html}
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


# ---------------------------------------------------------------------------
# Typography primitives
# ---------------------------------------------------------------------------


def h2(text: str) -> str:
    return (
        f'<h2 style="margin:14px 0 6px 0;font-family:Georgia,serif;'
        f"font-size:19px;line-height:1.15;font-weight:700;color:{GREEN};"
        f'letter-spacing:-0.005em;page-break-after:avoid;">{text}</h2>'
    )


def h3(text: str) -> str:
    return (
        f'<h3 style="margin:12px 0 5px 0;font-family:Georgia,serif;'
        f"font-size:16px;line-height:1.2;font-weight:700;color:{CHARCOAL};"
        f'page-break-after:avoid;">{text}</h3>'
    )


def p(text: str) -> str:
    return f'<p style="margin:0 0 7px 0;">{text}</p>'


def lead(text: str) -> str:
    return (
        f'<p style="margin:0 0 10px 0;font-size:15.5px;line-height:1.45;'
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
           style="background:{bg};border-left:4px solid {fg};margin:14px 0;page-break-inside:avoid;">
      <tr><td style="padding:12px 18px;{BODY_TD}">
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
                    font-size:10px;letter-spacing:0.22em;text-transform:uppercase;
                    color:{fg};font-weight:700;margin-bottom:4px;">{label}</div>
        <div style="font-size:15px;line-height:1.5;color:{INK};">{body}</div>
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
            f"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;"
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


def data_table(
    headers: list[str],
    rows: list[list[str]],
    first_col_bold: bool = True,
    scope: bool = False,
    caption: str = "",
) -> str:
    """Multi-column data table.

    When `scope=True`, emits <caption> + <th scope="col/row"> and drops
    role="presentation" so screen readers treat it as a real data table.
    When `scope=False` (default, for layout tables), keeps role="presentation".
    """
    role_attr = "" if scope else 'role="presentation" '
    caption_html = (
        f'<caption style="caption-side:top;text-align:left;font-family:-apple-system,'
        f'BlinkMacSystemFont,\'Segoe UI\',Inter,sans-serif;font-size:12px;'
        f'letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};'
        f'font-weight:700;padding:6px 0;">{caption}</caption>'
        if (scope and caption) else ""
    )
    th_tag_open = '<th scope="col"' if scope else '<th'
    head_cells = "".join(
        f'{th_tag_open} style="background:{GREEN};color:{CREAM};padding:8px 12px;'
        f"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;"
        f'font-size:11px;letter-spacing:0.1em;text-transform:uppercase;'
        f'font-weight:700;text-align:left;vertical-align:top;">{h}</th>'
        for h in headers
    )
    body_rows = []
    for i, row in enumerate(rows):
        bg = "#FFFFFF" if i % 2 == 0 else "#F7F2E7"
        cells = []
        for j, val in enumerate(row):
            weight = "700" if (j == 0 and first_col_bold) else "400"
            if scope and j == 0:
                cell_open = f'<th scope="row" style="background:{bg};padding:8px 12px;font-family:Georgia,serif;font-size:14px;color:{INK};font-weight:{weight};vertical-align:top;text-align:left;">'
                cell_close = "</th>"
            else:
                cell_open = f'<td style="background:{bg};padding:8px 12px;font-family:Georgia,serif;font-size:14px;color:{INK};font-weight:{weight};vertical-align:top;">'
                cell_close = "</td>"
            cells.append(f"{cell_open}{val}{cell_close}")
        body_rows.append(f'<tr>{"".join(cells)}</tr>')
    return (
        f'<table {role_attr}width="100%" cellspacing="0" cellpadding="0" border="0" '
        f'style="border:1px solid {RULE};margin:14px 0 18px 0;">'
        f"{caption_html}"
        f"<thead><tr>{head_cells}</tr></thead>"
        f"<tbody>{''.join(body_rows)}</tbody>"
        "</table>"
    )


def hr_rule() -> str:
    return f'<hr style="border:none;border-top:1px solid {RULE};margin:20px 0;" />'


def bullet_list(items: list[str]) -> str:
    items_html = "".join(
        f'<li style="margin-bottom:3px;line-height:1.4;">{x}</li>' for x in items
    )
    return (
        f'<ul style="margin:0 0 8px 0;padding-left:22px;font-size:14px;'
        f'line-height:1.4;color:{INK};">{items_html}</ul>'
    )


def stat_grid(stats: list[tuple[str, str, str]]) -> str:
    """3- or 4-up metric grid. Each tuple is (value, label, footnote).

    Numbers use Georgia italic at 32px for editorial financial-document dominance.
    The italic tilt + serif contrast against the uppercase sans labels creates
    a magazine-spread feel; line-height 1.15 and pb 4px reserve clear the descender
    on $ when used as a value.
    """
    cells = ""
    for v, lbl, foot in stats:
        cells += f"""
        <td valign="top" style="padding:18px 14px 22px 14px;width:25%;background:#FFFFFF;border:1px solid {RULE};border-radius:4px;">
          <div style="font-family:Georgia,serif;font-size:32px;line-height:1.15;font-weight:700;font-style:italic;color:{GREEN};letter-spacing:-0.015em;padding-bottom:4px;">{v}</div>
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:{MUTED};font-weight:700;margin-top:10px;">{lbl}</div>
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;font-size:12px;line-height:1.45;color:{INK};margin-top:6px;">{foot}</div>
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
    """Width-aware multi-column data table (older build_business_plan.py pattern)."""
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