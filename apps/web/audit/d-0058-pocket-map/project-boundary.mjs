import { readFileSync, writeFileSync } from 'fs';

// Read the GeoJSON
const raw = readFileSync('apps/web/audit/d-0058-pocket-map/pinellas-boundary-raw.geojson', 'utf-8');
const geo = JSON.parse(raw);

console.log('top type:', geo.type);
// polygons.openstreetmap.fr returns bare MultiPolygon/Polygon at top level
const polygons = geo.type === 'MultiPolygon' ? geo.coordinates : [geo.coordinates];
console.log('polygon count:', polygons.length);

// For a vintage map of the entire Pinellas peninsula, we want the
// main polygon (the largest one). The first ring of the first
// polygon is the outer boundary of the mainland peninsula.

const allPolygons = polygons;
console.log('allPolygons[0] rings:', allPolygons[0].length);

// Find all rings from the first polygon (the main one)
const mainRings = allPolygons[0];
console.log('mainRings[0] (outer) point count:', mainRings[0].length);

// Find lat/lon bounds across ALL outer rings
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const poly of allPolygons) {
  for (const pt of poly[0]) {
    const [lon, lat] = pt;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
}
console.log('bounds (lon):', minLon, 'to', maxLon, '=', (maxLon - minLon).toFixed(4), 'deg');
console.log('bounds (lat):', minLat, 'to', maxLat, '=', (maxLat - minLat).toFixed(4), 'deg');

// SVG canvas (vintage map size): 700w x 1000h with 60px padding
const W = 700, H = 1000, PAD = 60;
const mapW = W - 2 * PAD;
const mapH = H - 2 * PAD;
const lonRange = maxLon - minLon;
const latRange = maxLat - minLat;
// At ~28° lat, 1° lon ≈ 98 km, 1° lat ≈ 111 km. So lon/lat ratio is 98/111 = 0.883.
// To preserve aspect, we need to scale by ratio of mapW*latRange vs mapH*lonRange.
const aspectData = lonRange / latRange; // 0.68 for Pinellas
const aspectCanvas = mapW / mapH; // 0.7 for our 700x1000 with padding
// We want the data to fit. Scale by min.
let scale;
if (aspectData / aspectCanvas > 1) {
  // data is wider than canvas — fit to width
  scale = mapW / lonRange;
} else {
  // data is taller than canvas — fit to height
  scale = mapH / latRange;
}
// Now compute the offsets to center
const projW = lonRange * scale;
const projH = latRange * scale;
const offX = PAD + (mapW - projW) / 2;
const offY = PAD + (mapH - projH) / 2;

function project(lon, lat) {
  // lon increases right, lat increases up; SVG y is inverted
  const x = offX + (lon - minLon) * scale;
  const y = offY + (maxLat - lat) * scale; // flip y
  return [x, y];
}

function ringToPath(ring) {
  const pts = ring.map(([lon, lat]) => project(lon, lat));
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
  }
  d += ' Z';
  return d;
}

// Output each ring separately (the first ring of each polygon is the outer boundary;
// subsequent rings are holes — for vintage map we'll just render the outer rings)
const paths = [];
for (const poly of allPolygons) {
  const outerPath = ringToPath(poly[0]);
  paths.push(outerPath);
}

const output = paths.join('\n');
writeFileSync('apps/web/audit/d-0058-pocket-map/pinellas-boundary-path.txt', output);
console.log(`Wrote ${paths.length} path rings to pinellas-boundary-path.txt`);
console.log('Total path length:', output.length, 'chars');
console.log('First 200 chars:', output.substring(0, 200));
