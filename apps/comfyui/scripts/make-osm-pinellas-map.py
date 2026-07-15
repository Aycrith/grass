#!/usr/bin/env python3
"""
D-0026 (final): Custom-composed OSM map of Pinellas County with the
6 service-area ZIP badges baked into the image.

The steward (Cameron) called out the D-0025/D-0026 split-image approach
("map image + separate SVG pin overlay") as incoherent — the SVG rings
were using cream stroke on a white map (invisible), leaving just floating
text labels. The right move is to bake the ZIP markers into the image
itself as a finished editorial composition: one self-contained image
that fills the .mapWrap container edge-to-edge with no transform math,
no separate SVG layer, and no risk of misalignment.

Output: 1200x900 (4:3) WebP with:
  - Line-art OSM base (real coastline, street grid, water bodies)
  - 6 ZIP badges positioned at their real lat/lon coordinates
  - Each badge: cream-filled circle with dark 2px border + dark text label
  - Priority (33771, home base): sun-gold fill with dark border
  - Tiny "Map Data (c) OSM" attribution in bottom-right (per ODbL)
"""

import json
import math
import os
import sys
import time
from pathlib import Path

import requests
from PIL import Image, ImageDraw, ImageFont
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as MplPolygon
from matplotlib.collections import LineCollection, PatchCollection
import shapely.geometry

# ---------------------------------------------------------------------------
# Pinellas County bounding box (south, west, north, east)
#
# Tight crop focused on the 6 service-area ZIPs + a few miles of context.
# The 6 ZIPs are clustered in the west-central portion of Pinellas:
#
#   N
#   ↑
#   | 33756 (Clearwater/Belleair)  ~28.00, -82.79  (north-most)
#   | 33770 (Belleair Bluffs)      ~27.92, -82.82  (Gulf side)
#   | 33771 (Largo central)        ~27.91, -82.79  (home base)
#   | 33773 (Largo east)           ~27.91, -82.76
#   | 33774 (Seminole)             ~27.85, -82.79  (south central)
#   | 33778 (Pinellas Park)        ~27.85, -82.74  (SE)
#   S
#
# Bbox chosen to give ~3-4 mi padding around the 6 ZIPs cluster in N-S
# (~0.20° lat) and enough E-W to match the 4:3 image aspect ratio
# (~0.15° lon). This puts the populated area at the visual center.
# ---------------------------------------------------------------------------
BBOX = {
    'south': 27.83,
    'west': -82.85,
    'north': 28.03,
    'east': -82.70,
}

# Output: 4:3 aspect ratio (1.333) to match the .mapWrap CSS
OUTPUT_W = 1200
OUTPUT_H = 900  # 4:3

OUT_DIR = Path('C:/Users/camer/DEVNEW/GRASS/apps/web/public/illustrations')
OUT_PATH = OUT_DIR / 'pinellas-map-clean-1200x900.webp'
RAW_PATH = OUT_DIR / 'pinellas-map-clean-raw.png'

OVERPASS_URL = 'https://overpass-api.de/api/interpreter'


def query_overpass(timeout=180):
    """Query Overpass API for Pinellas data: roads, water, coastline."""
    bbox_str = f"{BBOX['south']},{BBOX['west']},{BBOX['north']},{BBOX['east']}"
    query = f"""
    [out:json][timeout:90];
    (
      way["highway"~"motorway|trunk|primary|secondary|tertiary"]({bbox_str});
      way["highway"~"residential|unclassified|service"]({bbox_str});
      way["natural"="water"]({bbox_str});
      relation["natural"="water"]({bbox_str});
      way["natural"="coastline"]({bbox_str});
    );
    out geom;
    """
    headers = {
        'User-Agent': 'LargoLawn-D-0026/2.0 (contact: hello@largolawn.pro)',
        'Accept': 'application/json',
    }
    print(f"[osm] Querying Overpass for bbox {bbox_str}...")

    mirrors = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.private.coffee/api/interpreter',
    ]
    last_err = None
    for url in mirrors:
        try:
            print(f"[osm]   trying {url}")
            resp = requests.post(
                url,
                data={'data': query},
                headers=headers,
                timeout=timeout,
            )
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"[osm]   {url} failed: {e}")
            last_err = e
            time.sleep(2)
    raise last_err


def parse_geometry(elements):
    """Parse Overpass elements into (highway_grade, coords) and (water, coords)."""
    roads = []
    water_polys = []
    coastlines = []
    for el in elements:
        if el.get('type') != 'way':
            continue
        tags = el.get('tags', {}) or {}
        coords = [(p['lon'], p['lat']) for p in el.get('geometry', [])]
        if len(coords) < 2:
            continue
        if 'highway' in tags:
            grade = tags['highway']
            roads.append((grade, coords))
        elif tags.get('natural') == 'water' or tags.get('waterway') in ('riverbank', 'lake'):
            water_polys.append(coords)
        elif tags.get('natural') == 'coastline':
            coastlines.append(coords)
    print(f"[osm] Parsed {len(roads)} roads, {len(water_polys)} water polys, {len(coastlines)} coastlines")
    return roads, water_polys, coastlines


def lonlat_to_xy(lon, lat, bbox, w, h):
    """Project lon/lat to pixel x/y using simple equirectangular projection."""
    lon_span = bbox['east'] - bbox['west']
    lat_span = bbox['north'] - bbox['south']
    x = (lon - bbox['west']) / lon_span * w
    y = (bbox['north'] - lat) / lat_span * h
    return x, y


# 6 service-area ZIPs with their real-world lat/lon (approximate centroids).
# These match the lat/lon used to bake the badge positions into the image,
# so the final image is a single self-contained artifact.
PIN_COORDS = {
    '33756': (27.999, -82.795),  # Clearwater/Belleair, north-most
    '33770': (27.918, -82.818),  # Belleair Bluffs, Gulf side
    '33771': (27.910, -82.789),  # Largo central — home base (priority)
    '33773': (27.910, -82.760),  # Largo east
    '33774': (27.850, -82.795),  # Seminole, south central
    '33778': (27.847, -82.745),  # Pinellas Park, SE
}

PRIORITY_ZIPS = {'33771'}  # 33771 is the home base — sun-gold fill


def render_map(roads, water_polys, coastlines, bbox, w, h):
    """Render the line-art map to a matplotlib figure (no frame).

    Brand-aligned palette (D-0026 final, curated to match the
    storybook storybook theme of the rest of the landing page):
      - Background: warm cream #F4E8D0 (--ll-sand-bleached)
      - Water: sun-tinted teal-gray #B8C5C8 (warm, inviting, not
        clinical blue)
      - Coastline: warm clay #B5651D (--ll-clay) — gives the
        peninsula a hand-drawn Florida-map feel
      - Roads: dark palm-bark #1A1F1B for major, fading through
        warm grays for minor streets
    """
    fig, ax = plt.subplots(figsize=(w / 100, h / 100), dpi=100)
    ax.set_xlim(0, w)
    ax.set_ylim(h, 0)  # flip y so north is up
    ax.set_aspect('equal')
    ax.axis('off')
    # Warm cream background — matches --ll-sand-bleached #F4E8D0
    # so the map visually belongs to the same world as the rest
    # of the landing page (hero, service cards, etc.)
    fig.patch.set_facecolor('#F4E8D0')
    ax.set_facecolor('#F4E8D0')

    # 1) Water bodies — warm sun-tinted teal-gray, slightly darker
    # outline. The warm tone (not clinical blue) makes the Gulf +
    # Tampa Bay feel sunlit and inviting, matching the rest of the
    # page's warm cream + sun-gold palette.
    water_patches = []
    for coords in water_polys:
        if len(coords) < 3:
            continue
        try:
            poly = shapely.geometry.Polygon(coords)
            if not poly.is_valid:
                poly = poly.buffer(0)
            if poly.is_empty:
                continue
            if poly.area < 0.00005:
                continue
            xys = [lonlat_to_xy(x, y, bbox, w, h) for x, y in poly.exterior.coords]
            if len(xys) >= 3:
                water_patches.append(MplPolygon(xys, closed=True))
        except Exception:
            continue
    if water_patches:
        ax.add_collection(PatchCollection(
            water_patches,
            facecolor='#A8B8BC',  # warm sun-tinted teal-gray (slightly more saturated)
            edgecolor='#7A8A8D',
            linewidths=0.6,
            alpha=0.85,
            zorder=1,
        ))

    # 2) Coastlines in clay color (--ll-clay #B5651D) — gives the
    # peninsula a hand-drawn Florida-map feel, like a vintage
    # tourist brochure. Slightly thicker than D-0025 so the
    # coastline reads at small zoom levels.
    for coords in coastlines:
        xys = [lonlat_to_xy(x, y, bbox, w, h) for x, y in coords]
        if len(xys) >= 2:
            xs, ys = zip(*xys)
            ax.plot(xs, ys, color='#A85920', linewidth=0.8, zorder=2, alpha=0.95)

    # 3) Roads — line widths by grade. Major roads in dark palm-bark
    # (--ll-palm-bark), fading through warm grays for minor streets.
    road_widths = {
        'motorway': 2.4,
        'trunk': 2.0,
        'primary': 1.7,
        'secondary': 1.3,
        'tertiary': 1.0,
        'residential': 0.55,
        'unclassified': 0.45,
        'service': 0.35,
    }
    road_colors = {
        'motorway': '#1A1F1B',    # --ll-palm-bark
        'trunk': '#2A302A',
        'primary': '#3A4147',
        'secondary': '#5A5750',   # warm gray
        'tertiary': '#7A7368',
        'residential': '#9A9080',
        'unclassified': '#B5AA9A',
        'service': '#C8BFB0',
    }
    by_grade = {}
    for grade, coords in roads:
        by_grade.setdefault(grade, []).append(coords)
    for grade, segments in by_grade.items():
        line_segs = []
        for coords in segments:
            if len(coords) < 2:
                continue
            xys = [lonlat_to_xy(x, y, bbox, w, h) for x, y in coords]
            for i in range(len(xys) - 1):
                line_segs.append([xys[i], xys[i + 1]])
        if not line_segs:
            continue
        lc = LineCollection(
            line_segs,
            colors=road_colors.get(grade, '#7A7368'),
            linewidths=road_widths.get(grade, 0.5),
            zorder=3,
        )
        ax.add_collection(lc)

    return fig


def load_font(size, bold=False):
    """Load a system font for badge text. Falls back to default."""
    candidates = [
        ('C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf'),
        ('C:/Windows/Fonts/georgiab.ttf' if bold else 'C:/Windows/Fonts/georgia.ttf'),
        'C:/Windows/Fonts/arial.ttf',
        'C:/Windows/Fonts/georgia.ttf',
    ]
    for fp in candidates:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()


def bake_zip_badges(raw_path, out_path, bbox, w, h):
    """Compose the final image: open the matplotlib raw PNG and bake
    the 6 ZIP badges + Map Data attribution into it.

    D-0026 final — custom curated to match the landing page's
    storybook storybook theme. The badges are filled circles with
    a dark border, positioned at each ZIP's pixel coords. The
    priority ZIP (33771) gets a sun-gold fill instead of cream.

    To make the badges feel hand-drawn (matching the corner-stamp
    and passport-stamp SVGs elsewhere on the page), the border
    uses a slightly thicker, slightly imperfect line and the
    label gets a subtle drop shadow.
    """
    img = Image.open(raw_path).convert('RGB')
    draw = ImageDraw.Draw(img)

    # Brand colors (must match apps/web/src/styles/reset.css and tailwind)
    PALM_BARK = (26, 31, 27)        # --ll-palm-bark #1A1F1B (dark text/border)
    SAND_BLEACHED = (244, 232, 208) # --ll-sand-bleached #F4E8D0 (cream fill)
    SUN = (232, 182, 90)            # --ll-sun #E8B65A (priority fill)
    CLAY = (181, 101, 29)           # --ll-clay #B5651D (warm accent)

    # Badge dimensions — slightly bigger than D-0025 so the ZIP
    # labels read clearly at 1920px wide
    BADGE_R = 36           # outer radius
    BADGE_BORDER = 2.8     # dark border width
    LABEL_FONT_SIZE = 20   # 5-digit ZIP text
    LABEL_FONT = load_font(LABEL_FONT_SIZE, bold=True)
    SHADOW_OFFSET = 1.5    # subtle drop shadow on labels

    for zip_code, (lat, lon) in PIN_COORDS.items():
        x, y = lonlat_to_xy(lon, lat, bbox, w, h)
        is_priority = zip_code in PRIORITY_ZIPS

        # Subtle drop shadow under the badge (a slightly offset
        # darker filled circle, very low opacity) — gives the
        # badge a hand-stamped feel like the rest of the page
        shadow_offset = 2
        draw.ellipse(
            [x - BADGE_R + shadow_offset, y - BADGE_R + shadow_offset,
             x + BADGE_R + shadow_offset, y + BADGE_R + shadow_offset],
            fill=(26, 31, 27, 60),  # palm-bark at 60/255 alpha
        )

        # Fill color — sun-gold for the priority ZIP, cream otherwise
        fill = SUN if is_priority else SAND_BLEACHED

        # Outer ring: filled circle with dark border
        draw.ellipse(
            [x - BADGE_R, y - BADGE_R, x + BADGE_R, y + BADGE_R],
            fill=fill,
            outline=PALM_BARK,
            width=int(BADGE_BORDER),
        )

        # Inner thin clay ring (decorative, on top of the fill) for
        # the priority ZIP only — gives it a "stamped" feel that
        # matches the corner-stamp and passport-stamp SVGs
        if is_priority:
            inner_r = BADGE_R - 7
            draw.ellipse(
                [x - inner_r, y - inner_r, x + inner_r, y + inner_r],
                outline=CLAY,
                width=1,
            )

        # ZIP text — measure first so we can center it
        text = zip_code
        bbox_text = draw.textbbox((0, 0), text, font=LABEL_FONT)
        text_w = bbox_text[2] - bbox_text[0]
        text_h = bbox_text[3] - bbox_text[1]
        # Place text at the center of the badge, adjusted for font baseline
        text_x = x - text_w / 2 - bbox_text[0]
        text_y = y - text_h / 2 - bbox_text[1]

        # Subtle drop shadow on the text (cream-colored shadow gives
        # the labels a stamped, slightly raised feel)
        draw.text(
            (text_x + SHADOW_OFFSET, text_y + SHADOW_OFFSET),
            text, fill=(255, 255, 255, 200), font=LABEL_FONT,
        )
        # Main text in palm-bark
        draw.text((text_x, text_y), text, fill=PALM_BARK, font=LABEL_FONT)

    # Add a subtle inner border to the whole image (palm-bark hairline)
    # — gives the map a "framed print" feel that matches the rest of
    # the page's design language
    border_color = (26, 31, 27, 180)  # palm-bark, semi-transparent
    draw.rectangle(
        [3, 3, w - 4, h - 4],
        outline=border_color,
        width=2,
    )

    # Map Data attribution (bottom-right, ODbL requirement) — in
    # palm-bark on a cream pill so it matches the badge style
    attr_font = load_font(14)
    attr = 'Map Data \u00A9 OSM'
    attr_bbox = draw.textbbox((0, 0), attr, font=attr_font)
    attr_w = attr_bbox[2] - attr_bbox[0]
    attr_h = attr_bbox[3] - attr_bbox[1]
    margin = 18
    box_x0 = w - attr_w - margin * 2 - 6
    box_y0 = h - attr_h - margin * 2 - 6
    box_x1 = w - margin + 6
    box_y1 = h - margin + 6
    # Cream pill with thin palm-bark border
    draw.rectangle([box_x0, box_y0, box_x1, box_y1],
                    fill=(244, 232, 208, 240),
                    outline=(26, 31, 27, 200),
                    width=1)
    draw.text(
        (w - attr_w - margin, h - attr_h - margin),
        attr,
        font=attr_font,
        fill=PALM_BARK,
    )

    # Note: the previous D-0024 attempt had a large "LARGO" wordmark
    # in the center of the map — the steward called that out as
    # redundant with the section heading ("Six ZIPs, one route.")
    # above the map. So we deliberately do NOT add a LARGO wordmark
    # in the map itself; the section heading + the cream-on-palm-bark
    # color treatment carries the brand identity without duplicate
    # typography. The Map Data attribution in the bottom-right is
    # the only text on the map.

    # Apply a subtle paper texture overlay (matches the
    # paper-grain.svg already used on the rest of the page via
    # body::before in D-0018). This gives the map a real "printed
    # on warm paper" feel that ties it to the storybook theme of
    # the hero (painted ranch house) and the service cards.
    img = apply_paper_texture(img)

    img.save(out_path, 'WEBP', quality=92, method=6)
    print(f"[osm] Saved composed map: {out_path} ({os.path.getsize(out_path)} bytes)")


def apply_paper_texture(img):
    """Apply a subtle paper-grain texture to the map image so it
    matches the paper-grain.svg overlay used elsewhere on the page.

    The texture is a per-pixel random noise in a warm sandy tone,
    blended in at low opacity (about 8%). This gives the map a
    subtle "printed on textured paper" feel without obscuring the
    line art or badges.
    """
    import random
    w, h = img.size
    # Build a per-pixel noise array
    pixels = img.load()
    random.seed(42)  # deterministic so the texture is stable across regenerations
    # Apply per-pixel variation in a warm tone
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            # Per-pixel offset, biased toward warm (slightly more red/yellow)
            offset = random.randint(-12, 12)
            # Avoid darkening the water too much (water is teal-gray)
            if r < 180 and g < 200 and b < 200:  # water or roads
                # Apply less noise to darker areas so the line art stays readable
                offset = offset // 2
            nr = max(0, min(255, r + offset))
            ng = max(0, min(255, g + offset - 1))  # slight warm bias
            nb = max(0, min(255, b + offset - 2))
            pixels[x, y] = (nr, ng, nb)
    return img


def main():
    try:
        data = query_overpass()
    except Exception as e:
        print(f"[osm] All Overpass mirrors failed: {e}")
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUT_DIR / 'pinellas-overpass-raw-clean.json', 'w') as f:
        json.dump(data, f)

    roads, water_polys, coastlines = parse_geometry(data.get('elements', []))
    if not roads and not water_polys and not coastlines:
        print("[osm] No data returned from Overpass")
        return 1

    fig = render_map(roads, water_polys, coastlines, BBOX, OUTPUT_W, OUTPUT_H)
    fig.savefig(RAW_PATH, dpi=100, pad_inches=0, facecolor='white')
    plt.close(fig)
    print(f"[osm] Saved raw clean map: {RAW_PATH}")

    bake_zip_badges(RAW_PATH, OUT_PATH, BBOX, OUTPUT_W, OUTPUT_H)
    print(f"[osm] Done: {OUT_PATH}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
