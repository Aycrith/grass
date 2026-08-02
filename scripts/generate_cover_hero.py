#!/usr/bin/env python3
"""Generate a top-down "freshly mowed lawn with crisp stripes" hero image.

This is the cover image for the v3.0 investor plan. Replaces the prior
side-view mower photo with an editorial aerial composition.

Design:
- 1200x800 canvas (3:2 cinematic editorial spread).
- Top-down view of a freshly mowed lawn with crisp alternating stripes.
- Stripes angled at +18deg for editorial diagonal dynamism.
- Soft circular pivot mark at lower-right (operator pivoted the ZT there).
- Subtle warm golden-hour tint + soft vignette.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output" / "assets" / "v3"

# High-contrast palette for visible crisp stripes
DARK_GREEN = (22, 56, 30)      # deep shadow stripe
MID_GREEN = (54, 108, 64)      # transition band
LIGHT_GREEN = (132, 178, 102) # sun-side stripe
SUN_GREEN = (175, 206, 130)    # brightest highlight at the peak


def gen_stripes(width: int, height: int, stripe_period: int = 96,
                angle_deg: float = 16.0) -> np.ndarray:
    """Anti-aliased alternating green stripes at a positive diagonal.

    Wider stripe period (96px) gives ~9 visible stripes across the image
    instead of 12+, which compresses much better in JPEG (lower high-freq
    DCT energy). Lower frequency = smaller files at the same quality.
    """
    theta = np.deg2rad(angle_deg)
    cos_t, sin_t = np.cos(theta), np.sin(theta)

    y, x = np.mgrid[0:height, 0:width].astype(np.float32)

    # gentle wavy distortion (sinusoidal both axes) keeps the stripes
    # natural-looking but DOESN'T add hard edges for the JPEG encoder.
    proj = x * cos_t + y * sin_t
    proj = proj + 6.0 * np.sin(proj * 0.012)  # subtle wavy distortion

    phase = (proj / stripe_period) * 2 * np.pi
    wave = np.sin(phase)
    t = (wave + 1) / 2  # 0..1

    img = np.zeros((height, width, 3), dtype=np.float32)
    for c in range(3):
        dark = DARK_GREEN[c]
        mid = MID_GREEN[c]
        light = LIGHT_GREEN[c]
        sun = SUN_GREEN[c]
        below = np.clip(t / 0.45, 0, 1)
        above = np.clip((t - 0.55) / 0.45, 0, 1)
        img[..., c] = np.where(
            t < 0.5,
            below * mid + (1 - below) * dark,
            above * sun + (1 - above) * light,
        )

    # subtle grass-blade speckle for natural texture (low amplitude)
    np.random.seed(7)
    speckle = (np.random.rand(height, width) - 0.5) * 8
    img = img + speckle[..., None]

    return np.clip(img, 0, 255).astype(np.uint8)


def gen_pivot_overlay(width: int, height: int,
                      center: tuple[int, int], radius: int = 200) -> Image.Image:
    """Faint darker pivot mark where operator turned the zero-turn.

    Two stacked discs (outer faint + inner darker) with a soft Gaussian
    blur, simulating the darker grass where wheels compressed the blade.
    """
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = center
    # Outer faint disc - where the wheel tracks overlapped
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                 fill=(12, 35, 18, 75))
    # Inner darker disc - pivot point itself
    inner = int(radius * 0.55)
    draw.ellipse([cx - inner, cy - inner, cx + inner, cy + inner],
                 fill=(8, 22, 12, 95))
    img = img.filter(ImageFilter.GaussianBlur(radius=12))
    return img


def gen_wheel_track(width: int, height: int) -> Image.Image:
    """Faint mower-wheel compression stripe running diagonally across the image.

    Two thin parallel bands (the rear wheels of a 36" zero-turn are spaced
    about 36" apart) at the same +16deg angle as the cut stripes. They read
    as a barely-visible darker band where the wheels pressed the grass down
    after the cut. JPEG-friendly: low contrast + soft Gaussian blur.

    Returns RGBA image with transparent background and ~12% opacity bands.
    """
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # The wheel bands run roughly along the stripe direction (+16 deg).
    # Wheel spacing for a 36" ZT is ~36" - on a 900px-wide image at full
    # bleed, that's about 80px apart (1" ~ 2.2px).
    wheel_spacing_px = 80
    band_thickness = 4  # thin band

    # Draw two parallel lines from one edge to the other at +16 deg,
    # offset by wheel_spacing_px perpendicular to the cut direction.
    theta = np.deg2rad(16.0)
    cos_t, sin_t = np.cos(theta), np.sin(theta)
    # perpendicular direction (90deg from stripe direction)
    perp_x, perp_y = -sin_t, cos_t

    cx, cy = width * 0.35, height * 0.55  # start near upper-left third

    def draw_band(offset: float):
        # Draw a line of length (width + height) at the offset perpendicular
        # to the stripe direction
        x1 = cx + offset * perp_x
        y1 = cy + offset * perp_y
        x2 = x1 + (width + height) * cos_t * 0.7
        y2 = y1 + (width + height) * sin_t * 0.7
        draw.line([(x1, y1), (x2, y2)], fill=(10, 28, 14, 35),
                  width=band_thickness)

    draw_band(-wheel_spacing_px / 2)
    draw_band(wheel_spacing_px / 2)

    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    return img


def add_soft_vignette(arr: np.ndarray, strength: float = 0.20) -> np.ndarray:
    """Subtle dark vignette: corners ~20% darker, center unchanged."""
    h, w = arr.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = w / 2, h / 2
    dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    max_d = np.sqrt(cx ** 2 + cy ** 2)
    t = np.clip((dist / max_d - 0.30) / 0.70, 0, 1)
    t = t * t * (3 - 2 * t)
    factor = 1.0 - strength * t
    out = arr.astype(np.float32) * factor[..., None]
    return np.clip(out, 0, 255).astype(np.uint8)


def warm_golden_hour(arr: np.ndarray) -> np.ndarray:
    """Subtle warm filter."""
    out = arr.astype(np.float32)
    out[..., 0] = np.clip(out[..., 0] * 1.03 + 6, 0, 255)
    out[..., 1] = np.clip(out[..., 1] * 1.005, 0, 255)
    out[..., 2] = np.clip(out[..., 2] * 0.92 - 8, 0, 255)
    return np.clip(out, 0, 255).astype(np.uint8)


def main() -> Path:
    width, height = 900, 600
    print(f"[generate] {width}x{height} aerial stripes cover hero")

    # 1. Stripes
    base = gen_stripes(width, height)

    # 2. Pivot mark at lower right
    pivot = gen_pivot_overlay(width, height,
                              center=(int(width * 0.80), int(height * 0.80)),
                              radius=150)
    # 2b. Wheel-track compression stripes (two parallel bands from the ZT
    # rear wheels, perpendicular to the cut direction)
    wheel_track = gen_wheel_track(width, height)

    base_img = Image.fromarray(base, mode="RGB").convert("RGBA")
    base_img = Image.alpha_composite(base_img, pivot)
    base_img = Image.alpha_composite(base_img, wheel_track)
    base_rgb = np.array(base_img.convert("RGB"))

    # 3. Warm filter + vignette
    base_rgb = warm_golden_hour(base_rgb)
    base_rgb = add_soft_vignette(base_rgb, strength=0.20)

    img = Image.fromarray(base_rgb, mode="RGB")

    dst = OUT / "hero_aerial_v3.jpg"
    img.save(dst, "JPEG", quality=80, optimize=True, progressive=True)
    print(f"[ok] {dst} ({dst.stat().st_size:,} bytes)")
    return dst


if __name__ == "__main__":
    main()
