#!/usr/bin/env python3
"""Generate reusable visual assets for the v3.0 investor-grade business plan.

Outputs are saved under output/assets/v3/ and are optimized for base64
embedding in Gmail-safe HTML (total HTML budget < 250 KB).
"""
from __future__ import annotations

from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output" / "assets" / "v3"
OUT.mkdir(parents=True, exist_ok=True)

# Brand palette
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
ORANGE = "#C77D37"
LIGHT_GREEN = "#E4EDE2"
LIGHT_SKY = "#E0EAF5"
LIGHT_SAND = "#F4E5D0"
LIGHT_RED = "#F7E3E3"

# Fonts: prefer a clean sans for charts, fall back to defaults
plt.rcParams["font.family"] = ["DejaVu Sans", "Arial", "sans-serif"]
plt.rcParams["font.size"] = 10
plt.rcParams["axes.facecolor"] = CREAM
plt.rcParams["figure.facecolor"] = CREAM
plt.rcParams["savefig.facecolor"] = CREAM
plt.rcParams["axes.edgecolor"] = RULE
plt.rcParams["axes.labelcolor"] = INK
plt.rcParams["text.color"] = INK
plt.rcParams["xtick.color"] = MUTED
plt.rcParams["ytick.color"] = MUTED


def resize_existing(src: Path, dst: Path, width: int = 800, quality: int = 75) -> Path:
    """Resize and compress an existing image for base64 embedding."""
    im = Image.open(src)
    w, h = im.size
    ratio = width / w
    new_size = (width, int(h * ratio))
    im = im.resize(new_size, Image.LANCZOS)
    im_rgb = im.convert("RGB") if im.mode in ("RGBA", "P") else im
    im_rgb.save(dst, "JPEG", quality=quality, optimize=True)
    return dst


def hero_image() -> Path:
    """Hero: reuse the existing cover image, resized and compressed."""
    src = ROOT / "output" / "assets" / "business_plan_cover.png"
    if not src.exists():
        raise FileNotFoundError(f"Hero source not found: {src}")
    dst = OUT / "hero_v3.jpg"
    resize_existing(src, dst, width=700, quality=65)
    return dst


def service_area_map() -> Path:
    """Service-area map: reuse the existing map image, resized and compressed."""
    src = ROOT / "output" / "assets" / "business_plan_map.png"
    if not src.exists():
        raise FileNotFoundError(f"Map source not found: {src}")
    dst = OUT / "service_area_map_v3.jpg"
    resize_existing(src, dst, width=650, quality=65)
    return dst


def revenue_chart() -> Path:
    """Monthly revenue + cumulative cash for the baseline scenario.

    2026-07-28 upgrade: gradient bars (vivid green -> faded green by month),
    tighter typography, in-bar value labels, dashed break-even zero line,
    and a "positive cash" annotation at the cumulative-cash crossover.
    """
    months = np.arange(1, 13)
    monthly_revenue = [0, 115, 345, 690, 1150, 1725, 2300, 2875, 3450, 4025, 4600, 5175]
    cumulative_cash = [-300, -200, 0, 300, 1000, 2085, 3500, 5200, 7515, 10400, 13500, 16590]

    fig, ax1 = plt.subplots(figsize=(8.2, 4.4))
    fig.patch.set_facecolor(CREAM)

    # Gradient fill: month 1 fades out, month 12 saturated GREEN
    base_rgba = np.array([31 / 255, 78 / 255, 44 / 255])  # GREEN
    bar_colors = []
    for i in range(12):
        # Fade in: month 1 = 0.40 alpha, month 12 = 0.95
        a = 0.40 + (i / 11) * 0.55
        bar_colors.append((*base_rgba, a))
    bars = ax1.bar(months, monthly_revenue, color=bar_colors,
                   edgecolor=CREAM, linewidth=0.6, label="Monthly revenue")

    # In-bar value labels (only for monthly revenue > $200 to avoid clutter)
    for bar, value in zip(bars, monthly_revenue):
        if value >= 600:
            ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 60,
                     f"${value:,.0f}",
                     ha="center", va="bottom",
                     color=INK, fontsize=7.5, fontweight="bold")

    ax1.set_xlabel("Month", color=MUTED, fontsize=10, fontweight="bold", labelpad=8)
    ax1.set_ylabel("Monthly revenue ($)", color=GREEN, fontsize=10, fontweight="bold")
    ax1.tick_params(axis="y", labelcolor=GREEN, labelsize=8)
    ax1.tick_params(axis="x", labelcolor=MUTED, labelsize=9)
    ax1.set_xticks(months)
    ax1.set_ylim(-100, 5800)
    ax1.yaxis.grid(True, color=RULE, linewidth=0.5, alpha=0.7)
    ax1.set_axisbelow(True)
    for spine in ("top", "right"):
        ax1.spines[spine].set_visible(False)
    ax1.spines["left"].set_color(RULE)
    ax1.spines["bottom"].set_color(RULE)

    # Cumulative cash on twin axis
    ax2 = ax1.twinx()
    ax2.plot(months, cumulative_cash, color=CHARCOAL, marker="o",
             linewidth=2.0, markersize=5,
             markerfacecolor=SAND, markeredgecolor=CHARCOAL, markeredgewidth=0.6,
             label="Cumulative cash")
    ax2.fill_between(months, cumulative_cash, 0,
                     where=[c >= 0 for c in cumulative_cash],
                     color=LIGHT_GREEN, alpha=0.6, interpolate=True)
    ax2.axhline(0, color=SAND, linestyle="--", linewidth=0.9, alpha=0.7)
    ax2.set_ylabel("Cumulative cash ($)", color=CHARCOAL, fontsize=10, fontweight="bold")
    ax2.tick_params(axis="y", labelcolor=CHARCOAL, labelsize=8)
    ax2.set_ylim(-800, 18000)
    for spine in ("top", "left"):
        ax2.spines[spine].set_visible(False)
    ax2.spines["right"].set_color(RULE)

    # Break-even annotation (where cumulative cash crosses $0 at month 3)
    ax2.annotate(
        "Cash positive\nMonth 3",
        xy=(3, 0), xytext=(4.5, 2500),
        fontsize=9, color=CHARCOAL, fontweight="bold", ha="center",
        arrowprops=dict(arrowstyle="-|>", color=CHARCOAL, lw=1.0,
                        connectionstyle="arc3,rad=-0.2"),
        bbox=dict(boxstyle="round,pad=0.4", facecolor=CREAM, edgecolor=CHARCOAL, lw=0.6),
    )

    # Title above the chart
    ax1.set_title(
        "Year 1 baseline: revenue and cash position",
        color=INK, fontsize=12.5, fontweight="bold", loc="left", pad=14,
    )

    # Legend (top-right, inside)
    h1, l1 = ax1.get_legend_handles_labels()
    h2, l2 = ax2.get_legend_handles_labels()
    leg = ax1.legend(
        h1 + h2, l1 + l2,
        loc="upper left", bbox_to_anchor=(0.02, 0.97),
        frameon=False, fontsize=8.5, ncol=2,
        handlelength=1.4, handletextpad=0.4, columnspacing=1.6,
    )
    for text in leg.get_texts():
        text.set_color(INK)

    save_jpeg(fig, OUT / "revenue_chart_v3.jpg", quality=82, dpi=120)
    return OUT / "revenue_chart_v3.jpg"


def unit_economics_diagram() -> Path:
    """One-customer profit waterfall for a weekly customer (2026-07-28 upgrade).

    McKinsey-style economic bridge: each negative delta is drawn as a
    floating bar starting where the prior running total ends. The first
    bar is the full starting value, intermediate bars are deltas only,
    and the final bar is the residual. Dashed connector lines trace
    the running total across the gap between bars.
    """
    fig, ax = plt.subplots(figsize=(8.0, 3.6))
    fig.patch.set_facecolor(CREAM)

    # Waterfall steps: starting price, then deltas, then final net
    labels = ["Weekly\nprice", "Direct\ncost", "Overhead", "Net per\nvisit"]
    bar_heights = [48, 30, 11, 7]    # 48 - 30 - 11 = 7 (net per visit)
    bar_bottoms = [0, 18, 7, 0]       # anchor each delta on the running total
    # Connector y-values: between bar[i] top and bar[i+1] top, for running
    # total that bridges the two. Week price top is 48. Direct cost top is
    # 18 (since the running total after subtracting 30 from 48 is 18).
    # Overhead top is 7 (running total after subtracting 11 from 18).
    # Net bar is the residual.
    connector_y = [48, 48, 18, 7]    # y where connector line is drawn between bars
    colors = [GREEN, RED, ORANGE, SKY]

    # Connector lines (dashed) drawn behind the bars, tracing the running total
    # at the *top* of each bar, descending to the *top* of the next bar.
    for i in range(3):
        x1 = i + 0.42
        x2 = (i + 1) - 0.42
        # connector y is the top of bar i; it stays flat then descends
        y_top_i = bar_bottoms[i] + bar_heights[i]
        y_top_next = bar_bottoms[i + 1] + bar_heights[i + 1]
        # Flat segment at y_top_i, then drop to y_top_next just before x2
        ax.plot([x1, x2 - 0.15], [y_top_i, y_top_i],
                color=MUTED, linewidth=0.9, linestyle=(0, (3, 3)), zorder=1)
        ax.plot([x2 - 0.15, x2], [y_top_i, y_top_next],
                color=MUTED, linewidth=0.9, linestyle=(0, (3, 3)), zorder=1)

    for i, (h, bottom, color, label) in enumerate(
        zip(bar_heights, bar_bottoms, colors, labels)
    ):
        ax.bar(i, h, bottom=bottom, color=color, edgecolor=CREAM,
               linewidth=1.2, zorder=2, width=0.7)

        # Value label above each bar
        ax.text(i, bottom + h + 1.6, f"${h}",
                ha="center", va="bottom",
                color=INK, fontsize=10, fontweight="bold")
        # Label inside each bar — use contrasting text (WHITE for dark
        # fills, INK for sky blue which is lighter)
        text_color = INK if color == SKY else WHITE
        ax.text(i, bottom + h / 2, label,
                ha="center", va="center",
                color=text_color, fontsize=8.5, fontweight="bold")

    ax.set_xticks(range(4))
    ax.set_xticklabels(["Weekly price", "Direct cost", "Overhead", "Net per visit"],
                       color=MUTED, fontsize=10)
    ax.set_ylabel("Dollars ($)", color=MUTED, fontsize=10)
    ax.set_ylim(-2, 60)
    ax.set_xlim(-0.5, 3.5)
    ax.yaxis.grid(True, color=RULE, linewidth=0.5, alpha=0.7)
    ax.set_axisbelow(True)
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)
    ax.spines["left"].set_color(RULE)
    ax.spines["bottom"].set_color(RULE)
    ax.tick_params(axis="both", labelsize=9, colors=MUTED)

    ax.set_title(
        "Unit economics: one weekly visit",
        color=INK, fontsize=12.5, fontweight="bold", loc="left", pad=12,
    )

    # Subtle caption below chart
    fig.text(
        0.5, -0.02,
        "Price $48 - Direct cost $30 - Overhead $11 = Net $7 per visit",
        ha="center", va="top",
        color=MUTED, fontsize=9, style="italic",
    )

    save_jpeg(fig, OUT / "unit_economics_v3.jpg", quality=82, dpi=120)
    return OUT / "unit_economics_v3.jpg"


def use_of_funds_chart() -> Path:
    """Pie chart of the recommended $12,000 loan allocation.

    Amounts are corrected post-equipment-correction (2026-07-28):
    Equipment $5,230 (36" commercial zero-turn + tools); Buffer $258 residual.
    Sum: 5230 + 1750 + 3000 + 1500 + 262 + 258 = 12,000 (matches principal).
    """
    labels = ["Equipment", "GL insurance", "Working capital", "Hurricane reserve", "Replacement reserve", "Buffer"]
    amounts = [5230, 1750, 3000, 1500, 262, 258]
    colors = [GREEN, SKY, SAND, ORANGE, LIGHT_GREEN, RULE]

    fig, ax = plt.subplots(figsize=(8, 5))
    # Label slices >= $500 directly; small slices (Buffer $258, Replacement $262)
    # are identified via the legend to avoid label crowding at the top of the pie.
    # Larger figure width gives room for legend on the right without overlapping
    # the slice labels (e.g. the $3,000 working-capital label).
    label_text = [f"${a:,}" if a >= 500 else "" for a in amounts]
    wedges, texts, autotexts = ax.pie(
        amounts,
        labels=label_text,
        autopct="",
        startangle=90,
        colors=colors,
        wedgeprops={"edgecolor": CREAM, "linewidth": 1.5},
        textprops={"color": INK, "fontsize": 10, "fontweight": "bold"},
        labeldistance=1.15,
        pctdistance=0.78,
    )
    ax.set_title("Use of Funds: $12,000 Recommended Loan", color=INK, fontsize=13, fontweight="bold")

    # Legend outside the pie on the right - use compact two-column format
    ax.legend(
        wedges,
        [f"{l}  ${a:,}" for l, a in zip(labels, amounts)],
        title="",
        loc="center left",
        bbox_to_anchor=(1.02, 0, 0.55, 1),
        frameon=False,
        fontsize=9,
    )
    save_jpeg(fig, OUT / "use_of_funds_v3.jpg", quality=85, dpi=120)
    return OUT / "use_of_funds_v3.jpg"


def risk_matrix() -> Path:
    """Risk heatmap: likelihood (x) × impact (y)."""
    risks = [
        "Slow customer acquisition",
        "Hurricane disruption",
        "Founder burnout",
        "Aggregator pricing",
        "GBP suspension",
        "Personal runway burn",
        "CAC transition cliff",
        "IRS imputed interest",
    ]
    likelihood = np.array([3, 3, 3, 2, 1, 3, 3, 2])  # 1-5
    impact = np.array([4, 3, 4, 3, 4, 4, 3, 2])  # 1-5
    scores = likelihood * impact

    fig, ax = plt.subplots(figsize=(7, 5.5))
    # 5x5 heatmap background mapped to likelihood 1-5, impact 1-5
    bg = np.zeros((5, 5))
    for i in range(5):
        for j in range(5):
            bg[i, j] = (i + 1) * (j + 1)

    im = ax.imshow(bg, cmap="YlOrRd", alpha=0.55, extent=[0.5, 5.5, 0.5, 5.5], origin="lower")

    # Apply small deterministic jitter to spread overlapping risk dots
    # (multiple risks share likelihood×impact coordinates). This prevents
    # the label collisions that the v3.0 chart exhibited.
    np.random.seed(7)
    jitter_l = likelihood + np.random.uniform(-0.18, 0.18, size=len(risks))
    jitter_i = impact + np.random.uniform(-0.18, 0.18, size=len(risks))

    # Plot risk dots with size proportional to score
    scatter = ax.scatter(
        jitter_l,
        jitter_i,
        s=scores * 18,
        c=scores,
        cmap="YlOrRd",
        edgecolors=INK,
        linewidths=0.6,
        zorder=3,
        vmin=1,
        vmax=25,
    )

    # Add risk labels at jittered positions with leader lines back to true coords
    for i, risk in enumerate(risks):
        ax.annotate(
            risk,
            (jitter_l[i], jitter_i[i]),
            xytext=(8, 0),
            textcoords="offset points",
            fontsize=7,
            va="center",
        )

    ax.set_xticks(np.arange(1, 6))
    ax.set_xticklabels(["1", "2", "3", "4", "5"], fontsize=9)
    ax.set_yticks(np.arange(1, 6))
    ax.set_yticklabels(["1", "2", "3", "4", "5"], fontsize=9)
    ax.set_xlabel("Likelihood", color=MUTED, fontsize=10)
    ax.set_ylabel("Impact", color=MUTED, fontsize=10)
    ax.set_title("Risk Matrix: Likelihood × Impact", color=INK, fontsize=12, fontweight="bold")
    ax.set_xlim(0.5, 5.5)
    ax.set_ylim(0.5, 5.5)

    # Colorbar for score
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.set_label("Score", rotation=270, labelpad=15, color=MUTED)

    save_jpeg(fig, OUT / "risk_matrix_v3.jpg", quality=85, dpi=120)
    return OUT / "risk_matrix_v3.jpg"


def _load_font(size: int):
    """Load a TrueType font, falling back to default if unavailable."""
    import platform
    candidates = []
    if platform.system() == "Windows":
        candidates = [
            r"C:\Windows\Fonts\segoeui.ttf",
            r"C:\Windows\Fonts\arial.ttf",
            r"C:\Windows\Fonts\calibri.ttf",
        ]
    else:
        candidates = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
    for path in candidates:
        try:
            from PIL import ImageFont
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def before_after_photo() -> Path:
    """Before / after lawn photo pair."""
    src = ROOT / "output" / "assets" / "business_plan_cover.png"
    if not src.exists():
        raise FileNotFoundError(f"Hero source not found: {src}")

    im = Image.open(src).convert("RGB")
    target_width, target_height = 900, 400
    im = im.resize((target_width, target_height), Image.LANCZOS)

    # Split into before (left) and after (right)
    before_half = im.crop((0, 0, target_width // 2, target_height))
    after_half = im.crop((target_width // 2, 0, target_width, target_height))

    # Degrade "before" half: desaturate, darken, add warm/yellow cast
    before_array = np.array(before_half).astype(float)
    # Desaturate partially
    gray = before_array.mean(axis=2, keepdims=True)
    before_array = 0.6 * before_array + 0.4 * gray
    # Darken
    before_array = before_array * 0.75
    # Yellow/brown cast
    before_array[:, :, 0] = np.clip(before_array[:, :, 0] * 1.05, 0, 255)
    before_array[:, :, 2] = before_array[:, :, 2] * 0.85
    before_half = Image.fromarray(before_array.astype(np.uint8))

    # Enhance "after" half slightly
    after_array = np.array(after_half).astype(float)
    after_array = np.clip(after_array * 1.05 + 10, 0, 255)
    after_half = Image.fromarray(after_array.astype(np.uint8))

    # Combine
    combined = Image.new("RGB", (target_width, target_height))
    combined.paste(before_half, (0, 0))
    combined.paste(after_half, (target_width // 2, 0))

    # Add labels
    draw = ImageDraw.Draw(combined)
    font_title = _load_font(42)
    font_sub = _load_font(22)

    # Overlay semi-transparent dark strip for text
    strip = Image.new("RGBA", (target_width, 60), (0, 0,0, 160))
    combined.paste(strip, (0, target_height - 60), strip)

    draw.text((target_width // 4, target_height - 45), "BEFORE", fill=WHITE, font=font_title, anchor="mm")
    draw.text((3 * target_width // 4, target_height - 45), "AFTER", fill=WHITE, font=font_title, anchor="mm")
    draw.text((target_width // 2, 25), "Largo Lawn  ·  Weekly Mow, Edge & Blow", fill=WHITE, font=font_sub, anchor="mm")

    dst = OUT / "before_after_v3.jpg"
    combined.save(dst, "JPEG", quality=75, optimize=True)
    return dst


def gbp_mockup() -> Path:
    """Google Business Profile mockup card."""
    w, h = 700, 360
    img = Image.new("RGB", (w, h), WHITE)
    draw = ImageDraw.Draw(img)

    # Header bar
    draw.rectangle([0, 0, w, 80], fill=GREEN)
    font_title = _load_font(32)
    font_sub = _load_font(18)
    font_small = _load_font(16)
    font_tiny = _load_font(13)

    draw.text((30, 20), "Largo Lawn", fill=WHITE, font=font_title)
    draw.text((30, 58), "Lawn care service · Largo, FL", fill=CREAM, font=font_small)

    # Body background
    draw.rectangle([0, 80, w, h], fill=CREAM)

    # Rating
    draw.text((30, 100), "★★★★★", fill="#F5A623", font=font_sub)
    draw.text((150, 104), "5.0  ·  12 reviews", fill=MUTED, font=font_tiny)

    # Info rows
    rows = [
        ("Address", "1234 Seminole Blvd, Largo, FL 33771"),
        ("Hours", "Mon–Fri, 7am–6pm"),
        ("Phone", "(727) 555-0142"),
        ("Website", "largolawn.pro"),
    ]
    y = 145
    for label, value in rows:
        draw.text((30, y), label, fill=MUTED, font=font_tiny)
        draw.text((130, y), value, fill=INK, font=font_small)
        y += 35

    # Action buttons
    button_y = y + 10
    button_width = 140
    button_height = 36
    buttons = [("Website", GREEN), ("Directions", SKY), ("Call", SAND)]
    x_offset = 30
    for text, color in buttons:
        draw.rounded_rectangle([x_offset, button_y, x_offset + button_width, button_y + button_height], radius=6, fill=color)
        draw.text((x_offset + button_width // 2, button_y + button_height // 2), text, fill=WHITE, font=font_tiny, anchor="mm")
        x_offset += button_width + 18

    dst = OUT / "gbp_mockup_v3.jpg"
    img.save(dst, "JPEG", quality=85, optimize=True)
    return dst


def stripe_invoice_mockup() -> Path:
    """Stripe invoice mockup."""
    w, h = 600, 420
    img = Image.new("RGB", (w, h), CREAM)
    draw = ImageDraw.Draw(img)

    font_title = _load_font(26)
    font_sub = _load_font(18)
    font_body = _load_font(16)
    font_small = _load_font(13)

    # Header
    draw.rectangle([0, 0, w, 100], fill=CHARCOAL)
    draw.text((40, 30), "Largo Lawn", fill=WHITE, font=font_title)
    draw.text((40, 62), "Invoice #LL-001", fill="#AAAAAA", font=font_small)
    draw.text((w - 40, 45), "PAID", fill="#4CD964", font=font_title, anchor="rm")

    # Invoice body
    y = 130
    draw.text((40, y), "Bill to", fill=MUTED, font=font_small)
    draw.text((40, y + 18), "Jane Homeowner", fill=INK, font=font_body)
    draw.text((40, y + 40), "123 Oak St, Largo, FL 33771", fill=MUTED, font=font_small)

    draw.text((w - 40, y), "Date", fill=MUTED, font=font_small, anchor="ra")
    draw.text((w - 40, y + 18), "Jul 28, 2026", fill=INK, font=font_body, anchor="ra")

    # Line items
    y = 230
    draw.line([(40, y), (w - 40, y)], fill=RULE, width=1)
    y += 15
    draw.text((40, y), "Weekly lawn service", fill=INK, font=font_body)
    draw.text((w - 40, y), "$48.00", fill=INK, font=font_body, anchor="ra")
    y += 28
    draw.text((40, y), "  · Mow, edge, blow", fill=MUTED, font=font_small)
    y += 35
    draw.line([(40, y), (w - 40, y)], fill=RULE, width=1)
    y += 15
    draw.text((40, y), "Subtotal", fill=MUTED, font=font_body)
    draw.text((w - 40, y), "$48.00", fill=INK, font=font_body, anchor="ra")
    y += 28
    draw.text((40, y), "Tax (7.0%)", fill=MUTED, font=font_body)
    draw.text((w - 40, y), "$3.36", fill=INK, font=font_body, anchor="ra")
    y += 35
    draw.text((40, y), "Total", fill=INK, font=font_sub)
    draw.text((w - 40, y), "$51.36", fill=INK, font=font_sub, anchor="ra")

    # Footer
    draw.text((w // 2, h - 30), "Paid via Stripe · Subscription renews weekly", fill=MUTED, font=font_small, anchor="mm")

    dst = OUT / "stripe_invoice_v3.jpg"
    img.save(dst, "JPEG", quality=85, optimize=True)
    return dst


def file_size_kb(path: Path) -> float:
    return path.stat().st_size / 1024


def save_jpeg(fig, path: Path, quality: int = 85, dpi: int = 120) -> None:
    """Save a matplotlib figure as a JPEG via PIL for size control."""
    tmp_png = path.with_suffix(".tmp.png")
    try:
        fig.savefig(tmp_png, dpi=dpi, bbox_inches="tight", pad_inches=0.02, facecolor=CREAM)
        plt.close(fig)
        im = Image.open(tmp_png)
        im_rgb = im.convert("RGB")
        im_rgb.save(path, "JPEG", quality=quality, optimize=True)
    finally:
        if tmp_png.exists():
            tmp_png.unlink()


def main() -> None:
    generated = []
    generated.append(("hero_v3.jpg", hero_image()))
    generated.append(("service_area_map_v3.jpg", service_area_map()))
    generated.append(("before_after_v3.jpg", before_after_photo()))
    generated.append(("gbp_mockup_v3.jpg", gbp_mockup()))
    generated.append(("stripe_invoice_v3.jpg", stripe_invoice_mockup()))
    generated.append(("revenue_chart_v3.jpg", revenue_chart()))
    generated.append(("unit_economics_v3.jpg", unit_economics_diagram()))
    generated.append(("use_of_funds_v3.jpg", use_of_funds_chart()))
    generated.append(("risk_matrix_v3.jpg", risk_matrix()))

    print(f"\nGenerated {len(generated)} assets in {OUT}:")
    total_kb = 0.0
    for name, path in generated:
        kb = file_size_kb(path)
        total_kb += kb
        print(f"  {name:30s} {kb:6.1f} KB  ({path})")
    print(f"\nTotal size: {total_kb:.1f} KB")
    print(f"Output directory: {OUT}")


if __name__ == "__main__":
    main()
