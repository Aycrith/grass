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
    """Render the line-art map to a matplotlib figure (no frame)."""
    fig, ax = plt.subplots(figsize=(w / 100, h / 100), dpi=100)
    ax.set_xlim(0, w)
    ax.set_ylim(h, 0)  # flip y so north is up
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # 1) Water bodies — light gray fill, slightly darker outline
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
            facecolor='#C4CED6',
            edgecolor='#7E8A95',
            linewidths=0.4,
            alpha=0.55,
            zorder=1,
        ))

    # 2) Coastlines (lighter — water body fills carry the shape)
    for coords in coastlines:
        xys = [lonlat_to_xy(x, y, bbox, w, h) for x, y in coords]
        if len(xys) >= 2:
            xs, ys = zip(*xys)
            ax.plot(xs, ys, color='#3A4147', linewidth=0.4, zorder=2, alpha=0.6)

    # 3) Roads — line widths by grade
    road_widths = {
        'motorway': 2.2,
        'trunk': 2.0,
        'primary': 1.6,
        'secondary': 1.2,
        'tertiary': 1.0,
        'residential': 0.55,
        'unclassified': 0.45,
        'service': 0.35,
    }
    road_colors = {
        'motorway': '#1A1F1F',
        'trunk': '#2A3030',
        'primary': '#3A4147',
        'secondary': '#4A5157',
        'tertiary': '#5A6167',
        'residential': '#7A8187',
        'unclassified': '#9AA1A7',
        'service': '#B0B7BD',
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
            colors=road_colors.get(grade, '#5A6167'),
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

    The badges are filled circles with a dark border, positioned at
    each ZIP's pixel coords. The priority ZIP (33771) gets a sun-gold
    fill instead of cream.
    """
    img = Image.open(raw_path).convert('RGB')
    draw = ImageDraw.Draw(img)

    # Brand colors (must match apps/web/src/styles/reset.css and tailwind)
    PALM_BARK = (26, 31, 27)        # --ll-palm-bark #1A1F1B (dark text/border)
    SAND_BLEACHED = (244, 232, 208) # --ll-sand-bleached #F4E8D0 (cream fill)
    SUN = (232, 182, 90)            # --ll-sun #E8B65A (priority fill)

    # Badge dimensions
    BADGE_R = 32           # outer radius
    BADGE_BORDER = 2.5     # dark border width
    LABEL_FONT_SIZE = 18   # 5-digit ZIP text
    LABEL_FONT = load_font(LABEL_FONT_SIZE, bold=True)

    for zip_code, (lat, lon) in PIN_COORDS.items():
        x, y = lonlat_to_xy(lon, lat, bbox, w, h)
        is_priority = zip_code in PRIORITY_ZIPS

        # Fill color
        fill = SUN if is_priority else SAND_BLEACHED

        # Outer ring: filled circle with dark border
        draw.ellipse(
            [x - BADGE_R, y - BADGE_R, x + BADGE_R, y + BADGE_R],
            fill=fill,
            outline=PALM_BARK,
            width=int(BADGE_BORDER),
        )

        # ZIP text — measure first so we can center it
        text = zip_code
        bbox_text = draw.textbbox((0, 0), text, font=LABEL_FONT)
        text_w = bbox_text[2] - bbox_text[0]
        text_h = bbox_text[3] - bbox_text[1]
        # Place text at the center of the badge, adjusted for font baseline
        text_x = x - text_w / 2 - bbox_text[0]
        text_y = y - text_h / 2 - bbox_text[1]
        draw.text((text_x, text_y), text, fill=PALM_BARK, font=LABEL_FONT)

    # Map Data attribution (bottom-right, ODbL requirement)
    attr_font = load_font(13)
    attr = 'Map Data \u00A9 OSM'
    attr_bbox = draw.textbbox((0, 0), attr, font=attr_font)
    attr_w = attr_bbox[2] - attr_bbox[0]
    attr_h = attr_bbox[3] - attr_bbox[1]
    margin = 14
    box_x0 = w - attr_w - margin * 2 - 6
    box_y0 = h - attr_h - margin * 2 - 6
    box_x1 = w - margin + 6
    box_y1 = h - margin + 6
    # White pill behind the text for legibility
    draw.rectangle([box_x0, box_y0, box_x1, box_y1], fill=(255, 255, 255, 235))
    draw.text(
        (w - attr_w - margin, h - attr_h - margin),
        attr,
        font=attr_font,
        fill=(90, 90, 90),
    )

    img.save(out_path, 'WEBP', quality=92, method=6)
    print(f"[osm] Saved composed map: {out_path} ({os.path.getsize(out_path)} bytes)")


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
