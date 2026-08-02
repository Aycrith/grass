"""Custom SVG line illustrations for the v3.0 business plan.

These are inline SVG strings rendered inside the cover and section
dividers of the plan. Gmail-safe inline SVG (no scripts, no animation,
no external references). Style: ultra-thin 1.5px strokes with the
brand GREEN as the only color.

Why inline SVG (and not base64 PNG):
- Zero byte overhead vs base64 (which inflates bytes ~33%).
- Renders crisp at any DPI in the PDF (chromium Playwright renders
  SVG via the PDF output pipeline directly).
- Stroke styling uses the brand palette tokens that match the rest
  of the document - no separate color management needed.

Each function returns an HTML <div> wrapping the SVG, ready to drop
into a page_body() or page_white_body() body string. All output uses
no positioning trickery (no position:absolute, no fixed positioning)
so it survives Gmail's HTML sanitizer.
"""
from __future__ import annotations

from _plan_helpers import GREEN, SAND, CHARCOAL, MUTED, INK  # type: ignore

# Use a neutral contrasting ink so the SVG stroke always works on cream + white
STROKE = GREEN
WARM = SAND
DARK = CHARCOAL


def svg_wrap(inner: str, width: int = 320, aria: str = "") -> str:
    """Wrap an SVG fragment in a centered <div>; aria hides it from screen readers."""
    aria_label = aria or "decorative illustration"
    return (
        f'<div role="img" aria-label="{aria_label}" '
        f'style="margin:14px auto 18px auto;text-align:center;'
        f'max-width:{width}px;">'
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" '
        f'width="100%" height="auto" '
        f'style="display:block;margin:0 auto;">'
        f"{inner}"
        f"</svg>"
        f"</div>"
    )


def zero_turn_mower(width: int = 360) -> str:
    """Editorial line drawing: a 36-inch commercial zero-turn mower, side view.

    Two big drive tires, central cutting deck, roll-bar and operator seat.
    Single-stroke line art with subtle warm accent on the deck.
    """
    inner = f"""
    <!-- ground line -->
    <line x1="40" y1="200" x2="360" y2="200" stroke="{STROKE}" stroke-width="1" stroke-dasharray="2,3" opacity="0.5"/>

    <!-- left rear tire -->
    <circle cx="105" cy="178" r="32" fill="none" stroke="{STROKE}" stroke-width="2"/>
    <circle cx="105" cy="178" r="14" fill="none" stroke="{STROKE}" stroke-width="1.5" opacity="0.7"/>
    <circle cx="105" cy="178" r="4" fill="{STROKE}"/>

    <!-- right rear tire -->
    <circle cx="295" cy="178" r="32" fill="none" stroke="{STROKE}" stroke-width="2"/>
    <circle cx="295" cy="178" r="14" fill="none" stroke="{STROKE}" stroke-width="1.5" opacity="0.7"/>
    <circle cx="295" cy="178" r="4" fill="{STROKE}"/>

    <!-- front caster wheels (small) -->
    <circle cx="200" cy="190" r="8" fill="none" stroke="{STROKE}" stroke-width="1.5"/>

    <!-- cutting deck (warm accent) -->
    <path d="M 80 150 L 320 150 L 330 175 L 70 175 Z"
          fill="{WARM}" fill-opacity="0.25"
          stroke="{WARM}" stroke-width="1.5"/>
    <text x="200" y="167" text-anchor="middle"
          font-family="Georgia, serif" font-size="11" fill="{DARK}"
          font-weight="700" letter-spacing="2">36&quot;</text>

    <!-- chassis above deck -->
    <path d="M 90 150 L 110 110 L 290 110 L 310 150"
          fill="none" stroke="{STROKE}" stroke-width="2"/>

    <!-- operator seat -->
    <path d="M 175 110 L 175 85 Q 175 75 185 75 L 215 75 Q 225 75 225 85 L 225 110"
          fill="none" stroke="{STROKE}" stroke-width="2"/>
    <line x1="195" y1="100" x2="205" y2="100" stroke="{STROKE}" stroke-width="1.2"/>

    <!-- roll bar -->
    <path d="M 140 110 Q 200 60 260 110"
          fill="none" stroke="{STROKE}" stroke-width="2"/>

    <!-- control arms -->
    <line x1="160" y1="108" x2="155" y2="135" stroke="{STROKE}" stroke-width="1.5"/>
    <line x1="240" y1="108" x2="245" y2="135" stroke="{STROKE}" stroke-width="1.5"/>
    <circle cx="155" cy="135" r="3" fill="{STROKE}"/>
    <circle cx="245" cy="135" r="3" fill="{STROKE}"/>

    <!-- engine cowl -->
    <rect x="135" y="120" width="130" height="20" fill="none" stroke="{STROKE}" stroke-width="1.5"/>
    """
    return svg_wrap(inner, width=width, aria="36-inch commercial zero-turn mower, side view")


def palm_silhouette(width: int = 280) -> str:
    """Editorial palm silhouette with horizon - evokes Largo FL.

    A simple palm: trunk + fronds, with a horizon line. Used as a
    section divider.
    """
    inner = f"""
    <!-- horizon -->
    <line x1="20" y1="180" x2="380" y2="180" stroke="{STROKE}" stroke-width="1" opacity="0.4"/>
    <!-- trunk: gentle curve -->
    <path d="M 200 180 Q 195 130 198 80 Q 200 60 200 40"
          fill="none" stroke="{STROKE}" stroke-width="2.5" stroke-linecap="round"/>
    <!-- trunk segments (palm bark lines) -->
    <line x1="194" y1="160" x2="204" y2="160" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <line x1="194" y1="135" x2="204" y2="135" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <line x1="195" y1="110" x2="203" y2="110" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <line x1="197" y1="80" x2="203" y2="80" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <line x1="198" y1="55" x2="202" y2="55" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>

    <!-- fronds (8 lines radiating from crown at 200,40) -->
    <g stroke="{STROKE}" stroke-width="2" stroke-linecap="round" fill="none">
      <path d="M 200 40 Q 130 30 80 60"/>
      <path d="M 200 40 Q 145 25 120 5"/>
      <path d="M 200 40 Q 175 15 165 -10"/>
      <path d="M 200 40 Q 200 10 200 -15"/>
      <path d="M 200 40 Q 225 15 235 -10"/>
      <path d="M 200 40 Q 255 25 280 5"/>
      <path d="M 200 40 Q 270 30 320 60"/>
      <path d="M 200 40 Q 200 50 200 70"/>
    </g>

    <!-- coconut cluster under crown -->
    <circle cx="195" cy="55" r="3" fill="{STROKE}"/>
    <circle cx="200" cy="58" r="3" fill="{STROKE}"/>
    <circle cx="205" cy="55" r="3" fill="{STROKE}"/>

    <!-- sun behind the palm (warm accent) -->
    <circle cx="320" cy="80" r="22" fill="{WARM}" fill-opacity="0.35"/>
    <circle cx="320" cy="80" r="22" fill="none" stroke="{WARM}" stroke-width="1" opacity="0.5"/>
    """
    return svg_wrap(inner, width=width, aria="Palm tree silhouette with setting sun")


def signature_divider(width: int = 400) -> str:
    """Editorial divider element: a thin horizontal rule + LARGO FL chapter mark.

    Used at section openers. The chapter mark uses small caps letterspaced
    style and a thin connecting rule to the right, evoking a print-book chapter.
    """
    inner = f"""
    <line x1="40" y1="120" x2="160" y2="120" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <text x="200" y="118" text-anchor="middle" dominant-baseline="middle"
          font-family="Georgia, serif" font-size="10" fill="{STROKE}"
          letter-spacing="5" font-weight="600">LARGO  ·  FLORIDA</text>
    <line x1="240" y1="120" x2="360" y2="120" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    """
    return svg_wrap(inner, width=width, aria="section divider")


def mower_marker(width: int = 200) -> str:
    """Small mower glyph + width mark. Useful as inline icon next to prices.

    A 36" zero-turn seen from above (oval deck + three wheel marks).
    """
    inner = f"""
    <!-- deck top-down view -->
    <ellipse cx="200" cy="120" rx="100" ry="38" fill="none" stroke="{STROKE}" stroke-width="2"/>
    <ellipse cx="200" cy="120" rx="86" ry="30" fill="none" stroke="{STROKE}" stroke-width="1" opacity="0.4"/>
    <!-- operator seat circle -->
    <circle cx="200" cy="120" r="14" fill="none" stroke="{STROKE}" stroke-width="2"/>
    <circle cx="200" cy="120" r="4" fill="{STROKE}"/>
    <!-- front wheels -->
    <circle cx="146" cy="100" r="5" fill="{STROKE}"/>
    <circle cx="146" cy="140" r="5" fill="{STROKE}"/>
    <!-- rear wheels -->
    <circle cx="254" cy="100" r="8" fill="none" stroke="{STROKE}" stroke-width="2"/>
    <circle cx="254" cy="140" r="8" fill="none" stroke="{STROKE}" stroke-width="2"/>
    <!-- 36" width measurement bar -->
    <line x1="100" y1="180" x2="300" y2="180" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <line x1="100" y1="175" x2="100" y2="185" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <line x1="300" y1="175" x2="300" y2="185" stroke="{STROKE}" stroke-width="1" opacity="0.5"/>
    <text x="200" y="200" text-anchor="middle"
          font-family="Georgia, serif" font-size="11" fill="{DARK}"
          font-weight="600">36&quot; gate clearance</text>
    """
    return svg_wrap(inner, width=width, aria="Top-down zero-turn with 36-inch width")


def pull_quote_mark(width: int = 80) -> str:
    """Editorial pull-quote glyph: oversized serif opening quotation mark."""
    inner = f"""
    <text x="50%" y="80" text-anchor="middle" dominant-baseline="middle"
          font-family="Georgia, serif" font-size="180" fill="{STROKE}"
          font-weight="700" opacity="0.18">&ldquo;</text>
    """
    return svg_wrap(inner, width=width, aria="opening pull quote")


def route_dot(width: int = 280) -> str:
    """6-dot route map: 6 ZIP service area as a stylized horizontal route.

    A horizontal line with 6 evenly-spaced dots, each dot colored to
    imply service-area coverage.
    """
    inner = f"""
    <line x1="30" y1="120" x2="370" y2="120" stroke="{STROKE}" stroke-width="1.5" opacity="0.4"/>
    """
    for i, x in enumerate(range(60, 350, 56)):
        inner += f'<circle cx="{x}" cy="120" r="9" fill="{STROKE}" fill-opacity="0.85"/>\n'
        inner += f'<circle cx="{x}" cy="120" r="4" fill="#FAF6F0"/>\n'
        inner += (
            f'<text x="{x}" y="155" text-anchor="middle" '
            f'font-family="-apple-system,Inter,sans-serif" font-size="10" '
            f'letter-spacing="1.5" fill="{STROKE}" font-weight="700">'
            f'3377{1+(i%4)}</text>\n'
        )
    return svg_wrap(inner, width=width, aria="Six ZIP service-area route")
