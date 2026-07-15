#!/usr/bin/env python3
"""
D-0025: Render a real OSM-based Pinellas County line-art map.

The previous D-0024 hand-authored SVG was rejected by the steward
("images you are creating are not coherent enough to meet
acceptance criteria"). The reference image is clearly OSM-based
("Map Data OSM" attribution + clean line-art editorial style).

This script queries the Overpass API for the actual road, water,
and coastline data for the Pinellas peninsula area, then renders
it as a clean black-and-white line-art image similar to the
reference example. Output: apps/web/public/illustrations/
pinellas-map-osm-1200x960.webp (matches the 5:4 aspect ratio of
the ServiceAreaMap section).

Uses the ComfyUI Python environment (shapely + matplotlib + PIL
+ requests). Run with:
  PYTHONIOENCODING=utf-8 & "C:\\ComfyUI\\ComfyUI_windows_portable\\python_embeded\\python.exe" \\
    "C:\\Users\\camer\\DEVNEW\\GRASS\\apps\\comfyui\\scripts\\make-osm-pinellas-map.py"
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
# Tightened on the peninsula — the eastern bound stops at the
# western edge of Old Tampa Bay so the map focuses on Pinellas
# itself with the bridges visible. Mainland Florida is cropped
# to a sliver on the right.
# ---------------------------------------------------------------------------
BBOX = {
    'south': 27.69,
    'west': -82.87,
    'north': 28.05,
    'east': -82.68,
}

OUTPUT_W = 1200
OUTPUT_H = 960  # 5:4 aspect ratio to match the ServiceAreaMap section

OUT_DIR = Path('C:/Users/camer/DEVNEW/GRASS/apps/web/public/illustrations')
OUT_PATH = OUT_DIR / 'pinellas-map-osm-1200x960.webp'

OVERPASS_URL = 'https://overpass-api.de/api/interpreter'


def query_overpass(timeout=180):
    """Query Overpass API for Pinellas data: roads, water, coastline."""
    bbox_str = f"{BBOX['south']},{BBOX['west']},{BBOX['north']},{BBOX['east']}"
    query = f"""
    [out:json][timeout:90];
    (
      // Major roads
      way["highway"~"motorway|trunk|primary|secondary|tertiary"]({bbox_str});
      // Residential + service streets (sampled for performance)
      way["highway"~"residential|unclassified|service"]({bbox_str});
      // Water bodies (Tampa Bay, Gulf, lakes, bays)
      way["natural"="water"]({bbox_str});
      relation["natural"="water"]({bbox_str});
      // Coastline
      way["natural"="coastline"]({bbox_str});
    );
    out geom;
    """
    headers = {
        'User-Agent': 'LargoLawn-D-0025/1.0 (contact: hello@largolawn.pro)',
        'Accept': 'application/json',
    }
    print(f"[osm] Querying Overpass for bbox {bbox_str}...")

    # Try multiple Overpass instances — the public server
    # rate-limits heavily and rejects requests without a User-Agent.
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
    roads = []  # list of (grade, line_coords)
    water_polys = []  # list of (polygon_coords)
    coastlines = []  # list of (line_coords)
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
    # Flip y so north is up
    y = (bbox['north'] - lat) / lat_span * h
    return x, y


def render_map(roads, water_polys, coastlines, bbox, w, h):
    """Render the line-art map to a matplotlib figure."""
    PAD = 30  # px padding on all sides
    fig, ax = plt.subplots(figsize=(w / 100, h / 100), dpi=100)
    ax.set_xlim(-PAD, w + PAD)
    ax.set_ylim(-PAD, h + PAD)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # 1) Water bodies — light gray fill, slightly darker outline
    #    These give the peninsula shape context.
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
            # Only draw large water bodies (skip tiny lakes / ponds)
            if poly.area < 0.0001:
                continue
            xys = [lonlat_to_xy(x, y, bbox, w, h) for x, y in poly.exterior.coords]
            if len(xys) >= 3:
                water_patches.append(MplPolygon(xys, closed=True))
        except Exception:
            continue
    if water_patches:
        ax.add_collection(PatchCollection(
            water_patches, facecolor='#B8C4CC', edgecolor='#7E8A95',
            linewidths=0.4, alpha=0.7, zorder=1,
        ))

    # 2) Coastlines (if no water body polygons cover them) — black lines
    for coords in coastlines:
        xys = [lonlat_to_xy(x, y, bbox, w, h) for x, y in coords]
        if len(xys) >= 2:
            xs, ys = zip(*xys)
            ax.plot(xs, ys, color='#3A4147', linewidth=0.5, zorder=2, alpha=0.7)

    # 3) Roads — line widths by grade
    road_widths = {
        'motorway': 2.0,
        'trunk': 1.8,
        'primary': 1.4,
        'secondary': 1.1,
        'tertiary': 0.9,
        'residential': 0.5,
        'unclassified': 0.4,
        'service': 0.3,
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
    # Group by grade so we can use LineCollection for speed
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


def add_poster_frame(img_path, out_path):
    """Add the editorial poster frame: black border, LARGO wordmark,
    FLORIDA subtitle, coordinates, OSM attribution.

    The reference image has:
      - Outer black border
      - Thin white inset
      - Inner thin black border
      - The map image itself
      - A white bottom strip with the city name, state, and
        coordinates in large editorial typography

    To get the inner black border AROUND THE MAP (not the
    bottom strip), we draw the inner black rectangle to only
    cover the map area + side borders, leaving the bottom
    strip white.
    """
    img = Image.open(img_path).convert('RGB')
    w, h = img.size

    FRAME_W = 30   # outer black border
    INSET = 6     # thin white inset
    INNER = 3     # thin inner black border
    BOTTOM_H = 130  # white bottom strip for typography

    total_w = w + 2 * FRAME_W + 2 * INSET
    total_h = h + 2 * FRAME_W + 2 * INSET + BOTTOM_H

    # All-white canvas
    canvas = Image.new('RGB', (total_w, total_h), (255, 255, 255))
    draw = ImageDraw.Draw(canvas)

    # Step 1: black border around the entire panel
    draw.rectangle([(0, 0), (total_w - 1, total_h - 1)], fill=(0, 0, 0))

    # Step 2: white inset rectangle (everything inside the outer
    # black border is white)
    draw.rectangle(
        [(FRAME_W, FRAME_W),
         (total_w - FRAME_W - 1, total_h - FRAME_W - 1)],
        fill=(255, 255, 255),
    )

    # Step 3: inner black border, ONLY around the map area
    # (not the bottom typography strip). The inner border is
    # at (FRAME_W + INSET) inset from the outer border, and
    # ends just above the bottom strip.
    map_x = FRAME_W + INSET
    map_y = FRAME_W + INSET
    map_w = total_w - 2 * (FRAME_W + INSET)
    map_h = h
    draw.rectangle(
        [(map_x, map_y),
         (map_x + map_w, map_y + map_h)],
        outline=(0, 0, 0),
        width=INNER,
    )

    # Step 4: paste the map image inside the inner border
    canvas.paste(img, (map_x + INNER // 2, map_y + INNER // 2))

    # Step 5: typography on the white bottom strip
    bottom_y = map_y + map_h + 16  # padding below map
    font_paths = [
        'C:/Windows/Fonts/arial.ttf',
        'C:/Windows/Fonts/georgia.ttf',
    ]
    font_xxl = font_xl = font_l = font_s = font_xs = None
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font_xxl = ImageFont.truetype(fp, 52)
                font_xl = ImageFont.truetype(fp, 26)
                font_l = ImageFont.truetype(fp, 18)
                font_s = ImageFont.truetype(fp, 13)
                font_xs = ImageFont.truetype(fp, 10)
                break
            except Exception:
                continue
    if font_xxl is None:
        font_xxl = ImageFont.load_default()
        font_xl = font_l = font_s = font_xs = font_xxl

    # "LARGO" — large, letter-spaced
    word = 'LARGO'
    track_xxl = 14
    letter_widths = [draw.textlength(ch, font=font_xxl) for ch in word]
    total_word_w = sum(letter_widths) + track_xxl * (len(word) - 1)
    cur_x = (total_w - total_word_w) / 2
    for ch, lw in zip(word, letter_widths):
        draw.text((cur_x, bottom_y), ch, font=font_xxl, fill=(0, 0, 0))
        cur_x += lw + track_xxl

    # "FLORIDA" — smaller, letter-spaced
    sub = 'F L O R I D A'
    bbox_sub = draw.textlength(sub, font=font_l)
    draw.text(((total_w - bbox_sub) / 2, bottom_y + 60), sub, font=font_l, fill=(0, 0, 0))

    # Coordinates (centered under the wordmark)
    coords = '27.9095\u00B0N, 82.7873\u00B0W'
    cb = draw.textlength(coords, font=font_s)
    draw.text(((total_w - cb) / 2, bottom_y + 86), coords, font=font_s, fill=(60, 60, 60))

    # OSM attribution (bottom-right, very small)
    attr = 'Map Data \u00A9 OSM'
    ab = draw.textlength(attr, font=font_xs)
    draw.text((total_w - ab - 14, total_h - 18), attr, font=font_xs, fill=(120, 120, 120))

    canvas.save(out_path, 'WEBP', quality=92, method=6)
    print(f"[osm] Saved framed poster: {out_path}")


def main():
    try:
        data = query_overpass()
    except Exception as e:
        print(f"[osm] All Overpass mirrors failed: {e}")
        return 1

    # Save raw response for inspection
    raw_path = OUT_DIR / 'pinellas-overpass-raw.json'
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(raw_path, 'w') as f:
        json.dump(data, f)
    print(f"[osm] Saved raw response: {raw_path}")

    roads, water_polys, coastlines = parse_geometry(data.get('elements', []))

    if not roads and not water_polys and not coastlines:
        print("[osm] No data returned from Overpass")
        return 1

    # Render the bare map at the full target size (no tight crop)
    raw_png = OUT_DIR / 'pinellas-map-osm-raw.png'
    fig = render_map(roads, water_polys, coastlines, BBOX, OUTPUT_W, OUTPUT_H)
    # IMPORTANT: no bbox_inches='tight' — that would crop the
    # figure and break the size contract with the frame step.
    fig.savefig(raw_png, dpi=100, pad_inches=0, facecolor='white')
    plt.close(fig)
    print(f"[osm] Saved raw map: {raw_png}")

    # Add the poster frame + typography
    add_poster_frame(raw_png, OUT_PATH)
    print(f"[osm] Done: {OUT_PATH}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
