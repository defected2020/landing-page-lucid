// One-off generator for public/globe/land-mask.png (equirectangular, 255 = land).
// Run from a scratch folder with the two deps installed:
//   npm i world-atlas@2 topojson-client@3 && node generate-land-mask.mjs 2048 land-mask.png

// Rasterise Natural Earth 50m land polygons into an equirectangular 8-bit
// grayscale PNG (255 = land). Scanline even-odd fill in lon/lat space.
import fs from 'node:fs';
import zlib from 'node:zlib';
import { feature } from 'topojson-client';

const W = Number(process.argv[2] || 2048);
const H = W / 2;
const out = process.argv[3] || 'land-mask.png';

const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'));
const land = feature(topo, topo.objects.land);
const geoms = land.type === 'FeatureCollection' ? land.features.map((f) => f.geometry) : [land.geometry];

const rings = [];
for (const g of geoms) {
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const poly of polys) for (const ring of poly) rings.push(ring);
}
console.log('rings:', rings.length, 'vertices:', rings.reduce((a, r) => a + r.length, 0));

// Split every edge that jumps across the antimeridian into two segments that
// end on it, and close each ring along the antimeridian so the planar
// even-odd fill sees proper polygons on both sides of the map.
const edges = [];
for (const ring of rings) {
  const portals = [];
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % n];
    if (a[0] === b[0] && a[1] === b[1]) continue;
    if (Math.abs(a[0] - b[0]) > 180) {
      if (Math.abs(a[1]) > 89.9 && Math.abs(b[1]) > 89.9) continue; // polar closing edge
      const side = a[0] > 0 ? 180 : -180;
      const bLon = b[0] + (a[0] > 0 ? 360 : -360);
      const t = (side - a[0]) / (bLon - a[0]);
      const latC = a[1] + t * (b[1] - a[1]);
      edges.push([a[0], a[1], side, latC], [-side, latC, b[0], b[1]]);
      portals.push(latC);
      continue;
    }
    edges.push([a[0], a[1], b[0], b[1]]);
  }
  if (portals.length % 2) {
    // A ring that circles a pole crosses the antimeridian an odd number of
    // times; close it through the pole on its own side.
    const meanLat = ring.reduce((a, v) => a + v[1], 0) / n;
    portals.push(meanLat < 0 ? -90 : 90);
  }
  portals.sort((p, q) => p - q);
  for (let k = 0; k + 1 < portals.length; k += 2) {
    edges.push([180, portals[k], 180, portals[k + 1]], [-180, portals[k], -180, portals[k + 1]]);
  }
}
console.log('edges after antimeridian split:', edges.length);

// Pre-bucket edges by latitude band so each row only scans nearby edges.
const BANDS = 180;
const bands = Array.from({ length: BANDS }, () => []);
for (const [ax, ay, bx, by] of edges) {
  const lo = Math.min(ay, by);
  const hi = Math.max(ay, by);
  const b0 = Math.max(0, Math.floor((lo + 90) / 180 * BANDS));
  const b1 = Math.min(BANDS - 1, Math.floor((hi + 90) / 180 * BANDS));
  for (let k = b0; k <= b1; k++) bands[k].push(ax, ay, bx, by);
}

const px = new Uint8Array(W * H);
let oddRows = 0;
for (let y = 0; y < H; y++) {
  const lat = 90 - (y + 0.5) * 180 / H;
  const band = bands[Math.min(BANDS - 1, Math.max(0, Math.floor((lat + 90) / 180 * BANDS)))];
  const xs = [];
  for (let i = 0; i < band.length; i += 4) {
    const x0 = band[i], y0 = band[i + 1], x1 = band[i + 2], y1 = band[i + 3];
    if ((y0 <= lat) !== (y1 <= lat)) {
      const t = (lat - y0) / (y1 - y0);
      xs.push(x0 + t * (x1 - x0));
    }
  }
  if (xs.length % 2 === 1) oddRows++;
  xs.sort((a, b) => a - b);
  for (let k = 0; k + 1 < xs.length; k += 2) {
    const xa = Math.max(0, Math.round((xs[k] + 180) / 360 * W));
    const xb = Math.min(W, Math.round((xs[k + 1] + 180) / 360 * W));
    for (let x = xa; x < xb; x++) px[y * W + x] = 255;
  }
}
const landFrac = px.reduce((a, v) => a + (v ? 1 : 0), 0) / px.length;
console.log('odd-crossing rows:', oddRows, 'land fraction (pixel, not area):', landFrac.toFixed(3));

// Minimal PNG encoder (grayscale, 8-bit, no filter)
const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  table[n] = c >>> 0;
}
const crc32 = (buf) => {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 0; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const raw = Buffer.alloc((W + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W + 1)] = 0;
  raw.set(px.subarray(y * W, (y + 1) * W), y * (W + 1) + 1);
}
const idat = zlib.deflateSync(raw, { level: 9 });
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync(out, png);
console.log('wrote', out, png.length, 'bytes');
