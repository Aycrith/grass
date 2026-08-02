#!/usr/bin/env python3
"""Generate 5 customer-pipeline mockup images for the v3.0 plan.

Small phone-shaped cards (180x360) at JPEG quality 50 — compresses to
~3-5 KB each so 5 mockups can fit inside the 256 KB HTML ceiling.

Stages shown (one mockup each):
  1. Awareness — Google Business Profile listing
  2. Quote — Stripe invoice
  3. Onboarding — Subscription welcome
  4. Service — Daily route sheet
  5. Retention — Monthly statement
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output" / "assets" / "v3"

# Brand palette (matches _plan_helpers.py)
GREEN = (31, 78, 44)
SAND = (212, 165, 116)
SKY = (59, 125, 216)
CHARCOAL = (26, 26, 26)
CREAM = (250, 246, 240)
WHITE = (255, 255, 255)
INK = (34, 34, 34)
MUTED = (107, 107, 107)
RULE = (229, 222, 208)

# Phone screen dimensions
W, H = 180, 360
CORNER = 14


def _font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    cands = ["georgiab.ttf", "arialbd.ttf", "calibrib.ttf"] if bold else [
        "georgia.ttf", "arial.ttf", "calibri.ttf"
    ]
    for n in cands:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _new() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    """Solid phone screen with bezel. Returns RGB image + draw."""
    img = Image.new("RGB", (W, H), (18, 18, 18))
    inner = Image.new("RGB", (W - 6, H - 6), CREAM)
    img.paste(inner, (3, 3))
    return img, ImageDraw.Draw(img)


def _bar(img, draw, y, label, fill=GREEN, fg=WHITE, size=10):
    """Solid color bar with centered label."""
    draw.rectangle([3, y, W - 3, y + 22], fill=fill)
    f = _font(size, bold=True)
    bbox = draw.textbbox((0, 0), label, font=f)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y + 5), label, fill=fg, font=f)


def _lbl(draw, x, y, txt, fg=MUTED, size=6):
    f = _font(size, bold=True)
    draw.text((x, y), txt, fill=fg, font=f)


def _txt(draw, x, y, txt, fg=INK, size=8, bold=False):
    draw.text((x, y), txt, fill=fg, font=_font(size, bold=bold))


def mockup_1_gbp() -> Image.Image:
    """Stage 1: GBP listing — the surface customers find first."""
    img, draw = _new()
    # Hero band (green)
    draw.rectangle([3, 3, W - 3, 70], fill=GREEN)
    _lbl(draw, 10, 8, "GOOGLE  >  LAWN CARE", size=5, fg=WHITE)
    _txt(draw, 10, 18, "Largo Lawn", fg=WHITE, size=14, bold=True)
    # Draw 5 star shapes manually (no font glyph for ★)
    for i in range(5):
        cx = 10 + i * 9
        cy = 47
        pts = []
        for j in range(10):
            angle = (j / 10) * 2 * 3.14159 - 1.5708
            r = 3.5 if j % 2 == 0 else 1.6
            pts.append((cx + r * (angle and 0.95), cy + r * 0.95))
        draw.polygon(pts, fill=SAND)
    _txt(draw, 60, 41, "5.0  (12)", fg=WHITE, size=8, bold=True)
    _txt(draw, 10, 54, "Open  ·  Largo, FL", fg=WHITE, size=7)

    # GET QUOTE button
    draw.rectangle([10, 78, W - 10, 100], fill=WHITE, outline=GREEN, width=1)
    _txt(draw, W // 2 - 25, 84, "GET QUOTE", fg=GREEN, size=9, bold=True)

    # Info rows
    y = 112
    for label, val in [
        ("ADDRESS", "12321 Seminole Blvd"),
        ("HOURS", "Mon–Sat  7–5"),
        ("PHONE", "(727) 555-0123"),
        ("SERVICE", "Largo 33770–33774"),
    ]:
        _lbl(draw, 10, y, label, size=5)
        _txt(draw, 10, y + 7, val, size=8, bold=True)
        y += 26

    # Photo strip
    _lbl(draw, 10, y + 4, "PHOTOS", size=5)
    y += 16
    for i in range(3):
        x = 10 + i * 55
        draw.rectangle([x, y, x + 50, y + 36], fill=(140, 170, 110),
                       outline=RULE)
        for j in range(2):
            draw.rectangle([x + 4 + j * 22, y + 4, x + 4 + j * 22 + 18,
                            y + 32], fill=(60 + j * 30, 100 + j * 20,
                                            60 + j * 30))
    return img


def mockup_2_quote() -> Image.Image:
    """Stage 2: Stripe quote — what the customer sees in their email."""
    img, draw = _new()
    # Header
    draw.rectangle([3, 3, W - 3, 38], fill=WHITE)
    draw.line([(3, 38), (W - 3, 38)], fill=RULE, width=1)
    _txt(draw, 10, 10, "Largo Lawn", fg=GREEN, size=11, bold=True)
    _lbl(draw, 10, 24, "QUOTE  ·  valid 14 days", size=5)

    # Customer info
    y = 50
    _lbl(draw, 10, y, "PREPARED FOR", size=5)
    _txt(draw, 10, y + 8, "J. Doe", fg=INK, size=8, bold=True)
    _txt(draw, 10, y + 18, "12345 Pine St, 33771", fg=INK, size=7)
    y += 38
    _lbl(draw, 10, y, "ESTIMATED BY", size=5)
    _txt(draw, 10, y + 8, "Cameron, Founder", fg=INK, size=8, bold=True)

    # Line items
    y = 110
    draw.line([(10, y), (W - 10, y)], fill=RULE, width=1)
    _lbl(draw, 10, y + 4, "SERVICE", size=5)
    _lbl(draw, W - 50, y + 4, "PRICE", size=5)
    y += 16
    draw.line([(10, y), (W - 10, y)], fill=RULE, width=1)
    y += 6

    for desc, price in [
        ("Weekly mow+edge+blow", "$48/visit"),
        ("First-cut discount", "−$10"),
    ]:
        _txt(draw, 10, y, desc, fg=INK, size=7)
        _txt(draw, W - 60, y, price, fg=INK, size=7, bold=True)
        y += 18

    # Total
    y += 4
    draw.line([(10, y), (W - 10, y)], fill=INK, width=1)
    y += 6
    _txt(draw, 10, y, "WEEKLY", fg=INK, size=9, bold=True)
    _txt(draw, W - 70, y, "$48/wk", fg=GREEN, size=12, bold=True)

    # Payment note
    y += 26
    _txt(draw, 10, y, "Auto-billed by Stripe weekly.", fg=MUTED, size=7)
    _txt(draw, 10, y + 12, "Cancel anytime.  No contract.", fg=MUTED, size=7)

    # CTA
    y += 32
    draw.rectangle([10, y, W - 10, y + 28], fill=GREEN)
    _txt(draw, W // 2 - 30, y + 8, "ACCEPT", fg=WHITE, size=11, bold=True)
    return img


def mockup_3_onboarding() -> Image.Image:
    """Stage 3: Onboarding — welcome view in the customer app."""
    img, draw = _new()
    # Green welcome header
    draw.rectangle([3, 3, W - 3, 80], fill=GREEN)
    _txt(draw, 10, 12, "Welcome,", fg=WHITE, size=9)
    _txt(draw, 10, 26, "Jordan.", fg=WHITE, size=18, bold=True)
    _txt(draw, 10, 56, "First cut: week of Aug 4.", fg=WHITE, size=8)

    # Subscription card
    y = 90
    draw.rectangle([10, y, W - 10, y + 72], fill=WHITE, outline=RULE, width=1)
    _lbl(draw, 20, y + 6, "ACTIVE SUBSCRIPTION", size=5)
    _txt(draw, 20, y + 18, "Weekly mow+edge+blow", fg=INK, size=9, bold=True)
    _txt(draw, 20, y + 32, "$48 / week  ·  auto-billed", fg=MUTED, size=7)
    # Status dot
    draw.ellipse([W - 24, y + 6, W - 14, y + 16], fill=GREEN)
    draw.line([(20, y + 48), (W - 20, y + 48)], fill=RULE, width=1)
    _txt(draw, 20, y + 52, "TUE  ·  9:00 AM window", fg=INK, size=9, bold=True)
    _txt(draw, 20, y + 64, "Spring/summer schedule", fg=MUTED, size=7)

    # Checklist
    y = 174
    _lbl(draw, 10, y, "BEFORE YOUR FIRST CUT", size=5)
    y += 14
    for txt in [
        "Gate code on file",
        "One dog in backyard",
        "No contract — cancel anytime",
    ]:
        # Draw filled green check-circle manually
        draw.ellipse([10, y + 1, 18, y + 9], fill=GREEN)
        draw.line([(12, y + 5), (14, y + 7)], fill=WHITE, width=1)
        draw.line([(14, y + 7), (16, y + 3)], fill=WHITE, width=1)
        _txt(draw, 22, y, txt, fg=INK, size=8)
        y += 16

    # Quote box (sand)
    y += 8
    draw.rectangle([10, y, W - 10, y + 56], fill=CREAM, outline=SAND, width=1)
    _txt(draw, 20, y + 8, "Same day, same operator,", fg=INK, size=8)
    _txt(draw, 20, y + 22, "same price — every week.", fg=INK, size=8)
    _txt(draw, 20, y + 40, "— Cameron", fg=MUTED, size=7)

    # Bottom nav
    draw.line([(10, H - 28), (W - 10, H - 28)], fill=MUTED, width=1)
    _lbl(draw, 22, H - 22, "SCHEDULE", fg=GREEN, size=5)
    _lbl(draw, 70, H - 22, "BILLING", fg=MUTED, size=5)
    _lbl(draw, 110, H - 22, "MSG", fg=MUTED, size=5)
    _lbl(draw, 140, H - 22, "HELP", fg=MUTED, size=5)
    return img


def mockup_4_service() -> Image.Image:
    """Stage 4: Service — operator's daily route sheet (TUE today)."""
    img, draw = _new()
    # Header
    _lbl(draw, 10, 8, "TODAY", size=5, fg=SAND)
    _txt(draw, 10, 18, "TUE", fg=GREEN, size=22, bold=True)
    _txt(draw, 70, 26, "JUL 22", fg=INK, size=11, bold=True)
    _txt(draw, 70, 42, "South loop  ·  9 stops", fg=MUTED, size=7)

    # Map mini
    draw.rectangle([10, 60, W - 10, 150], fill=CREAM, outline=RULE)
    # Green park area
    draw.rectangle([14, 76, W - 14, 144], fill=(180, 200, 145))
    # Sand path
    draw.line([(14, 130), (W - 14, 76)], fill=SAND, width=2)
    draw.line([(14, 80), (W - 14, 140)], fill=SAND, width=2)
    # Stop dots
    for i, (x, y) in enumerate([(28, 92), (52, 110), (80, 84), (108, 122),
                                (134, 96), (156, 134), (90, 138), (146, 80),
                                (60, 130)]):
        if i < 4:
            color, r = GREEN, 5
        else:
            color, r = MUTED, 3
        draw.ellipse([x - r, y - r, x + r, y + r], fill=color, outline=WHITE)

    # Stops list
    y = 162
    _lbl(draw, 10, y, "NEXT STOPS", size=5)
    y += 14
    stops = [
        ("9:00", "Mrs. Chen", "DONE"),
        ("9:35", "Mr. Patel", "DONE"),
        ("10:10", "Ms. Reyes", "DONE"),
        ("10:45", "J. Doe", "NEXT"),
    ]
    for time, name, status in stops:
        _txt(draw, 10, y, time, fg=MUTED, size=7)
        _txt(draw, 40, y, name, fg=INK, size=8, bold=True)
        col = GREEN if status == "NEXT" else SAND
        _lbl(draw, W - 50, y, status, fg=col, size=5)
        y += 16

    # Day total
    y += 4
    draw.line([(10, y), (W - 10, y)], fill=RULE, width=1)
    y += 6
    _txt(draw, 10, y, "Day total", fg=INK, size=8, bold=True)
    _txt(draw, W - 75, y, "$192", fg=GREEN, size=10, bold=True)
    y += 18
    _txt(draw, 10, y, "Stripe auto-bills end of day.", fg=MUTED, size=7)
    return img


def mockup_5_retention() -> Image.Image:
    """Stage 5: Retention — monthly statement + referral ask."""
    img, draw = _new()
    _lbl(draw, 10, 8, "JULY 2026  ·  MONTHLY STATEMENT", size=5, fg=SAND)
    _txt(draw, 10, 18, "Hi Jordan,", fg=GREEN, size=14, bold=True)

    # Statement card
    y = 44
    draw.rectangle([10, y, W - 10, y + 90], fill=WHITE, outline=RULE, width=1)
    _lbl(draw, 20, y + 6, "4 CUTS THIS MONTH", size=5)
    _txt(draw, 20, y + 16, "TUE  Jul 1, 8, 15, 22", fg=INK, size=9, bold=True)
    _txt(draw, 20, y + 30, "All on time, same operator.", fg=INK, size=7)
    _lbl(draw, 20, y + 50, "TOTAL BILLED", size=5)
    _txt(draw, 20, y + 60, "$192.00", fg=GREEN, size=18, bold=True)
    _lbl(draw, W - 50, y + 70, "PAID  ✓", fg=GREEN, size=6)

    # YTD
    y = 144
    _txt(draw, 10, y, "Year to date  ·  21 cuts  ·  $1,008 paid",
         fg=MUTED, size=7)

    # Referral block
    y = 162
    draw.rectangle([10, y, W - 10, y + 100], fill=GREEN)
    _txt(draw, 20, y + 8, "Refer a neighbor", fg=WHITE, size=11, bold=True)
    _txt(draw, 20, y + 28, "Give $25, get $25.", fg=WHITE, size=9, bold=True)
    _txt(draw, 20, y + 46, "When they sign up for weekly,", fg=WHITE, size=7)
    _txt(draw, 20, y + 58, "you both get $25 off.", fg=WHITE, size=7)
    # Share button
    draw.rectangle([20, y + 70, W - 20, y + 90], fill=WHITE)
    _txt(draw, W // 2 - 18, y + 76, "SHARE", fg=GREEN, size=9, bold=True)

    # Thanks
    y = 274
    _txt(draw, 10, y, "Thanks for being a customer —", fg=INK, size=8)
    _txt(draw, 10, y + 12, "see you Tuesday.", fg=INK, size=8)
    _txt(draw, 10, y + 28, "— Cameron, Largo Lawn", fg=MUTED, size=7)

    # Footer
    y = H - 32
    draw.line([(10, y), (W - 10, y)], fill=RULE, width=1)
    _txt(draw, 10, y + 6, "Next visit: Tue Aug 5, 9:00 AM", fg=INK, size=7)
    _txt(draw, 10, y + 18, "Reply STOP to opt out.", fg=MUTED, size=6)
    return img


def main() -> list[Path]:
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"[generate] 5 pipeline mockups at {W}x{H} px (compress target)")

    targets = [
        ("pipeline_1_gbp_v3.jpg", mockup_1_gbp),
        ("pipeline_2_quote_v3.jpg", mockup_2_quote),
        ("pipeline_3_onboarding_v3.jpg", mockup_3_onboarding),
        ("pipeline_4_service_v3.jpg", mockup_4_service),
        ("pipeline_5_retention_v3.jpg", mockup_5_retention),
    ]

    paths = []
    for name, fn in targets:
        img = fn()
        dst = OUT / name
        # Quality 30 with optimize + progressive — solid color blocks
        # compress very well at this size. Stays under 7 KB per file.
        img.save(dst, "JPEG", quality=30, optimize=True, progressive=True)
        size = dst.stat().st_size
        print(f"[ok] {dst.name}  ({size:,} bytes)")
        paths.append(dst)
    return paths


if __name__ == "__main__":
    main()
