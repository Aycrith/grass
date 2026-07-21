import { readFileSync, writeFileSync } from 'fs';

// ====== Load the boundary data ======
const raw = readFileSync('apps/web/audit/d-0058-pocket-map/pinellas-boundary-raw.geojson', 'utf-8');
const geo = JSON.parse(raw);
const polygons = geo.type === 'MultiPolygon' ? geo.coordinates : [geo.coordinates];

// Find lat/lon bounds across ALL outer rings
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const poly of polygons) {
  for (const pt of poly[0]) {
    const [lon, lat] = pt;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
}
const lonRange = maxLon - minLon;
const latRange = maxLat - minLat;

// ====== Project to SVG (700x1000, padded) ======
const W = 700, H = 1000, PAD = 50;
const mapW = W - 2 * PAD;
const mapH = H - 2 * PAD;
const aspectData = lonRange / latRange;
const aspectCanvas = mapW / mapH;
let scale;
if (aspectData / aspectCanvas > 1) {
  scale = mapW / lonRange;
} else {
  scale = mapH / latRange;
}
const projW = lonRange * scale;
const projH = latRange * scale;
const offX = PAD + (mapW - projW) / 2;
const offY = PAD + (mapH - projH) / 2;

function project(lon, lat) {
  const x = offX + (lon - minLon) * scale;
  const y = offY + (maxLat - lat) * scale;
  return [x, y];
}

function ringToPath(ring) {
  const pts = ring.map(([lon, lat]) => project(lon, lat));
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

const mainPath = ringToPath(polygons[0][0]);

// ====== ZIP + landmark coordinates (from real knowledge) ======
// ZIPs ordered by lat (north to south) so labels stack without overlap
const ZIPS = [
  { zip: '33756', name: 'Belleair / Clearwater', lon: -82.7860, lat: 27.9656 },
  { zip: '33770', name: 'Belleair Bluffs',     lon: -82.8200, lat: 27.9190 },
  { zip: '33771', name: 'Largo (central) ★',   lon: -82.7874, lat: 27.9095, isOperator: true },
  { zip: '33773', name: 'Largo (east)',        lon: -82.7531, lat: 27.9081 },
  { zip: '33774', name: 'Largo / Ridgecrest',  lon: -82.7811, lat: 27.8862 },
  { zip: '33778', name: 'Seminole / Largo W.', lon: -82.7982, lat: 27.8510 },
];

const LANDMARKS = [
  { name: 'Clearwater Beach', lon: -82.8276, lat: 27.9776, kind: 'beach' },
  { name: 'Honeymoon Island', lon: -82.8306, lat: 28.0630, kind: 'island' },
  { name: 'Caladesi Island',  lon: -82.8208, lat: 28.0290, kind: 'island' },
  { name: 'Indian Rocks Beach', lon: -82.8456, lat: 27.8960, kind: 'beach' },
  { name: 'Treasure Island',  lon: -82.7685, lat: 27.7690, kind: 'beach' },
  { name: 'St. Petersburg',   lon: -82.6403, lat: 27.7676, kind: 'city' },
  { name: 'Tampa',            lon: -82.4572, lat: 27.9506, kind: 'city' },
];

const projectedZips = ZIPS.map(z => ({ ...z, ...projectInto(z.lon, z.lat) }));
const projectedLandmarks = LANDMARKS.map(l => ({ ...l, ...projectInto(l.lon, l.lat) }));

function projectInto(lon, lat) {
  const [x, y] = project(lon, lat);
  return { x: x.toFixed(1), y: y.toFixed(1) };
}

// ====== Build the SVG ======
const houseIcon = (cx, cy, isOperator) => {
  if (isOperator) {
    // Operator's home base: 5-point star with sun-yellow fill + truck marker
    return `<g transform="translate(${cx} ${cy})">
      <path d="M 0 -10 L 2.94 -3.09 L 9.51 -3.09 L 4.28 1.18 L 5.88 8.09 L 0 3.82 L -5.88 8.09 L -4.28 1.18 L -9.51 -3.09 L -2.94 -3.09 Z"
            fill="var(--ll-sun, #e8b65a)" stroke="var(--ll-clay, #b5651d)" stroke-width="0.8" />
      <circle r="3" fill="var(--ll-clay, #b5651d)" />
    </g>`;
  }
  return `<g transform="translate(${cx - 7} ${cy - 7})">
    <path d="M 0 10 L 0 4 L 7 0 L 14 4 L 14 10 Z" fill="var(--ll-cream, #faf6f0)" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.8" />
    <rect x="5" y="6" width="4" height="4" fill="var(--ll-sepia, #5a3e1f)" />
  </g>`;
};

const landmarkIcon = (cx, cy, kind) => {
  if (kind === 'beach') {
    return `<g transform="translate(${cx} ${cy})">
      <circle r="2.5" fill="none" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.8" />
      <path d="M -5 1 Q -2 -1 0 1 Q 2 3 5 1" fill="none" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.6" />
    </g>`;
  }
  if (kind === 'island') {
    return `<g transform="translate(${cx} ${cy})">
      <ellipse rx="4" ry="2" fill="var(--ll-olive, #6b7d4a)" fill-opacity="0.3" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.6" />
    </g>`;
  }
  // city: a small filled square
  return `<g transform="translate(${cx} ${cy})">
    <rect x="-2" y="-2" width="4" height="4" fill="var(--ll-sepia, #5a3e1f)" />
  </g>`;
};

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Vintage illustrated pocket map of the operator's service area in Pinellas County, Florida">
  <title>Pocket Map — Operator's Service Area, Pinellas County</title>

  <defs>
    <!-- Aged paper background -->
    <radialGradient id="paperBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#f4e8d0" />
      <stop offset="100%" stop-color="#d8c89a" />
    </radialGradient>
    <!-- Water wash (faded blue-grey) -->
    <linearGradient id="waterWash" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#b8c8d0" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#a8b8c0" stop-opacity="0.35" />
    </linearGradient>
    <!-- Pinellas peninsula land wash (faded olive) -->
    <linearGradient id="landWash" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d4d0a0" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#c4be8a" stop-opacity="0.6" />
    </linearGradient>
  </defs>

  <!-- Background: aged paper -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#paperBg)" />

  <!-- Decorative outer border (art-deco / WPA double rule) -->
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="1.5" />
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.5" opacity="0.6" />

  <!-- Title cartouche (top center) -->
  <g transform="translate(${W / 2} 70)">
    <text text-anchor="middle" y="0" font-family="Georgia, serif" font-size="11" font-weight="700" letter-spacing="0.18em" fill="var(--ll-faded-red, #6b3a1d)">POCKET MAP · NO. 06</text>
    <text text-anchor="middle" y="22" font-family="Georgia, serif" font-size="22" font-style="italic" font-weight="500" fill="var(--ll-palm-bark, #1a1f1b)">The Operator's Service Area</text>
    <text text-anchor="middle" y="40" font-family="Georgia, serif" font-size="10" letter-spacing="0.12em" fill="var(--ll-sepia, #5a3e1f)" opacity="0.85">PINELLAS COUNTY · FLORIDA</text>
    <!-- Decorative flourish under title -->
    <line x1="-50" y1="50" x2="50" y2="50" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.4" />
    <circle cx="0" cy="50" r="2" fill="var(--ll-sepia, #5a3e1f)" />
    <circle cx="-50" cy="50" r="1.2" fill="var(--ll-sepia, #5a3e1f)" />
    <circle cx="50" cy="50" r="1.2" fill="var(--ll-sepia, #5a3e1f)" />
  </g>

  <!-- Water wash (under the land) -->
  <rect x="22" y="130" width="${W - 44}" height="${H - 220}" fill="url(#waterWash)" />

  <!-- The Pinellas peninsula (real OSM boundary) -->
  <path d="${mainPath}" fill="url(#landWash)" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="1.4" stroke-linejoin="round" />

  <!-- Water labels -->
  <g font-family="Georgia, serif" font-style="italic" fill="var(--ll-sepia, #5a3e1f)" opacity="0.7">
    <text x="80" y="500" font-size="14" transform="rotate(-90 80 500)">GULF OF MEXICO</text>
    <text x="${W - 50}" y="500" font-size="14" transform="rotate(90 ${W - 50} 500)">TAMPA BAY</text>
  </g>

  <!-- 6 ZIP markers (the operator's service area) — icon + ZIP only, names in legend below -->
  ${projectedZips.map((z, i) => {
    // Label placement: alternate left/right based on map position, with operator special
    const cx = parseFloat(z.x);
    const cy = parseFloat(z.y);
    let dx, anchor, dy = 4;
    if (z.isOperator) {
      // Place operator's number BELOW the star
      dx = 0; anchor = 'middle'; dy = 22;
    } else if (i === 0) {
      dx = 12; anchor = 'start'; dy = 4;
    } else if (i === 1) {
      dx = -12; anchor = 'end'; dy = 4;
    } else if (i === 3) {
      dx = -12; anchor = 'end'; dy = 4;
    } else if (i === 4) {
      dx = 12; anchor = 'start'; dy = 4;
    } else {
      dx = -12; anchor = 'end'; dy = 4;
    }
    return `
  <g key="zip-${i}">
    ${houseIcon(cx, cy, z.isOperator)}
    <text x="${cx + dx}" y="${cy + dy}" text-anchor="${anchor}" font-family="Georgia, serif" font-size="9.5" font-weight="700" fill="var(--ll-palm-bark, #1a1f1b)">${z.zip}</text>
  </g>`;
  }).join('')}

  <!-- Landmarks (in light sepia, smaller) -->
  ${projectedLandmarks.map((l, i) => `
  <g key="lm-${i}">
    ${landmarkIcon(parseFloat(l.x), parseFloat(l.y), l.kind)}
    <text x="${parseFloat(l.x) + (l.kind === 'city' ? 5 : 6)}" y="${parseFloat(l.y) + 3}" font-family="Georgia, serif" font-size="8" fill="var(--ll-sepia, #5a3e1f)" opacity="0.7">${l.name}</text>
  </g>
  `).join('')}

  <!-- Compass rose (bottom-left, decorative) -->
  <g transform="translate(80 ${H - 130})">
    <circle r="32" fill="var(--ll-aged-paper, #ede4d0)" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.8" />
    <circle r="24" fill="none" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.4" opacity="0.6" />
    <!-- 8-point compass star -->
    <g stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.8" fill="var(--ll-aged-paper, #ede4d0)">
      <!-- N -->
      <path d="M 0 -28 L 4 -4 L 0 0 L -4 -4 Z" fill="var(--ll-palm-bark, #1a1f1b)" />
      <!-- S -->
      <path d="M 0 28 L 4 4 L 0 0 L -4 4 Z" />
      <!-- E -->
      <path d="M 28 0 L 4 4 L 0 0 L 4 -4 Z" />
      <!-- W -->
      <path d="M -28 0 L -4 4 L 0 0 L -4 -4 Z" />
      <!-- NE -->
      <path d="M 18 -18 L 3 -1 L 0 0 L 1 -3 Z" opacity="0.5" />
      <!-- SE -->
      <path d="M 18 18 L 3 1 L 0 0 L 1 3 Z" opacity="0.5" />
      <!-- SW -->
      <path d="M -18 18 L -3 1 L 0 0 L -1 3 Z" opacity="0.5" />
      <!-- NW -->
      <path d="M -18 -18 L -3 -1 L 0 0 L -1 -3 Z" opacity="0.5" />
    </g>
    <text y="-36" text-anchor="middle" font-family="Georgia, serif" font-size="9" font-weight="700" fill="var(--ll-palm-bark, #1a1f1b)">N</text>
    <text y="44" text-anchor="middle" font-family="Georgia, serif" font-size="8" fill="var(--ll-sepia, #5a3e1f)">S</text>
    <text x="38" y="3" text-anchor="middle" font-family="Georgia, serif" font-size="8" fill="var(--ll-sepia, #5a3e1f)">E</text>
    <text x="-38" y="3" text-anchor="middle" font-family="Georgia, serif" font-size="8" fill="var(--ll-sepia, #5a3e1f)">W</text>
  </g>

  <!-- Scale bar (moved up to avoid legend overlap) -->
  <g transform="translate(${W - 130} ${H - 90})">
    <text y="-4" text-anchor="middle" font-family="Georgia, serif" font-size="7" letter-spacing="0.12em" fill="var(--ll-sepia, #5a3e1f)" opacity="0.7">SCALE OF MILES</text>
    <g>
      <rect x="0" y="0" width="14" height="5" fill="var(--ll-sepia, #5a3e1f)" />
      <rect x="14" y="0" width="14" height="5" fill="var(--ll-aged-paper, #ede4d0)" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.3" />
      <rect x="28" y="0" width="14" height="5" fill="var(--ll-sepia, #5a3e1f)" />
      <rect x="42" y="0" width="14" height="5" fill="var(--ll-aged-paper, #ede4d0)" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.3" />
      <rect x="56" y="0" width="14" height="5" fill="var(--ll-sepia, #5a3e1f)" />
      <rect x="70" y="0" width="14" height="5" fill="var(--ll-aged-paper, #ede4d0)" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.3" />
      <text x="0" y="14" font-family="Georgia, serif" font-size="6.5" fill="var(--ll-sepia, #5a3e1f)">0</text>
      <text x="42" y="14" text-anchor="middle" font-family="Georgia, serif" font-size="6.5" fill="var(--ll-sepia, #5a3e1f)">5</text>
      <text x="84" y="14" text-anchor="middle" font-family="Georgia, serif" font-size="6.5" fill="var(--ll-sepia, #5a3e1f)">10</text>
    </g>
  </g>

  <!-- Legend (right side, the 6 ZIPs and what they mean) -->
  <g transform="translate(${W - 200} ${H - 270})">
    <rect x="0" y="0" width="180" height="156" fill="var(--ll-aged-paper, #ede4d0)" fill-opacity="0.85" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.6" />
    <text x="90" y="14" text-anchor="middle" font-family="Georgia, serif" font-size="8" font-weight="700" letter-spacing="0.16em" fill="var(--ll-faded-red, #6b3a1d)">LEGEND</text>
    <line x1="10" y1="20" x2="170" y2="20" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.3" />
    <!-- Operator's home base -->
    <g transform="translate(15 32)">
      <path d="M 0 -5 L 1.5 -1.5 L 5 -1.5 L 2.2 0.6 L 3 4 L 0 2 L -3 4 L -2.2 0.6 L -5 -1.5 L -1.5 -1.5 Z" fill="var(--ll-sun, #e8b65a)" stroke="var(--ll-clay, #b5651d)" stroke-width="0.5" />
      <text x="14" y="3" font-family="Georgia, serif" font-size="8" font-weight="600" fill="var(--ll-palm-bark, #1a1f1b)">Operator's home base</text>
    </g>
    <!-- House icon -->
    <g transform="translate(15 50)">
      <path d="M -4 4 L -4 1 L 0 -2 L 4 1 L 4 4 Z" fill="var(--ll-cream, #faf6f0)" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.6" />
      <rect x="-1" y="1" width="2" height="3" fill="var(--ll-sepia, #5a3e1f)" />
      <text x="14" y="3" font-family="Georgia, serif" font-size="8" font-weight="600" fill="var(--ll-palm-bark, #1a1f1b)">Service ZIP</text>
    </g>
    <line x1="10" y1="62" x2="170" y2="62" stroke="var(--ll-sepia, #5a3e1f)" stroke-width="0.3" opacity="0.5" />
    <!-- 6 ZIPs listed -->
    <g transform="translate(10 78)" font-family="Georgia, serif" font-size="7.5">
      <text y="0" font-weight="700" fill="var(--ll-palm-bark, #1a1f1b)">33756</text>
      <text x="40" y="0" opacity="0.85" fill="var(--ll-sepia, #5a3e1f)">Belleair / Clearwater</text>
      <text y="12" font-weight="700" fill="var(--ll-palm-bark, #1a1f1b)">33770</text>
      <text x="40" y="12" opacity="0.85" fill="var(--ll-sepia, #5a3e1f)">Belleair Bluffs</text>
      <text y="24" font-weight="700" fill="var(--ll-clay, #b5651d)">33771 ★</text>
      <text x="40" y="24" font-weight="600" fill="var(--ll-palm-bark, #1a1f1b)">Largo (central)</text>
      <text y="36" font-weight="700" fill="var(--ll-palm-bark, #1a1f1b)">33773</text>
      <text x="40" y="36" opacity="0.85" fill="var(--ll-sepia, #5a3e1f)">Largo (east)</text>
      <text y="48" font-weight="700" fill="var(--ll-palm-bark, #1a1f1b)">33774</text>
      <text x="40" y="48" opacity="0.85" fill="var(--ll-sepia, #5a3e1f)">Largo / Ridgecrest</text>
      <text y="60" font-weight="700" fill="var(--ll-palm-bark, #1a1f1b)">33778</text>
      <text x="40" y="60" opacity="0.85" fill="var(--ll-sepia, #5a3e1f)">Seminole / Largo W.</text>
    </g>
  </g>

  <!-- Footer note -->
  <text x="${W / 2}" y="${H - 40}" text-anchor="middle" font-family="Georgia, serif" font-size="8" font-style="italic" fill="var(--ll-sepia, #5a3e1f)" opacity="0.6">Surveyed &amp; mowed · Largo FL · 2026-07-21</text>
</svg>
`;

writeFileSync('apps/web/audit/d-0058-pocket-map/pocket-map-v1.svg', svg);
console.log(`Wrote pocket-map-v1.svg (${svg.length} chars)`);
