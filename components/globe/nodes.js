// The neurons of the globe: real cities, with Berlin (home) as the hub.
// Positions are unit vectors in the globe's local frame: y is north,
// longitude 0 faces +z, east runs toward +x.

const CITIES = [
  // name, lat, lon, weight (brightness / how often it starts a signal)
  ['Berlin', 52.52, 13.4, 2.2],
  ['London', 51.51, -0.13, 1.4],
  ['Dublin', 53.35, -6.26, 0.9],
  ['Paris', 48.86, 2.35, 1.2],
  ['Amsterdam', 52.37, 4.9, 1.0],
  ['Munich', 48.14, 11.58, 0.9],
  ['Zurich', 47.38, 8.54, 0.9],
  ['Milan', 45.46, 9.19, 0.8],
  ['Madrid', 40.42, -3.7, 0.9],
  ['Lisbon', 38.72, -9.14, 0.8],
  ['Barcelona', 41.39, 2.17, 0.8],
  ['Stockholm', 59.33, 18.07, 0.9],
  ['Copenhagen', 55.68, 12.57, 0.8],
  ['Oslo', 59.91, 10.75, 0.7],
  ['Helsinki', 60.17, 24.94, 0.8],
  ['Tallinn', 59.44, 24.75, 0.6],
  ['Warsaw', 52.23, 21.01, 0.9],
  ['Prague', 50.08, 14.44, 0.8],
  ['Vienna', 48.21, 16.37, 0.8],
  ['Kyiv', 50.45, 30.52, 0.8],
  ['Athens', 37.98, 23.73, 0.7],
  ['Istanbul', 41.01, 28.98, 1.0],
  ['Moscow', 55.76, 37.62, 0.9],
  ['Tel Aviv', 32.09, 34.78, 1.0],
  ['Cairo', 30.04, 31.24, 0.9],
  ['Dubai', 25.2, 55.27, 1.2],
  ['Riyadh', 24.71, 46.68, 0.8],
  ['Casablanca', 33.59, -7.59, 0.6],
  ['Lagos', 6.52, 3.38, 1.0],
  ['Accra', 5.6, -0.19, 0.6],
  ['Nairobi', -1.29, 36.82, 0.9],
  ['Johannesburg', -26.2, 28.05, 0.8],
  ['Cape Town', -33.93, 18.42, 0.8],
  ['New York', 40.71, -74.01, 1.6],
  ['Toronto', 43.65, -79.38, 1.0],
  ['Montreal', 45.5, -73.57, 0.7],
  ['Chicago', 41.88, -87.63, 1.0],
  ['Austin', 30.27, -97.74, 0.9],
  ['Denver', 39.74, -104.99, 0.7],
  ['Miami', 25.76, -80.19, 0.8],
  ['Mexico City', 19.43, -99.13, 1.0],
  ['San Francisco', 37.77, -122.42, 1.5],
  ['Los Angeles', 34.05, -118.24, 1.1],
  ['Seattle', 47.61, -122.33, 1.0],
  ['Vancouver', 49.28, -123.12, 0.8],
  ['Bogota', 4.71, -74.07, 0.8],
  ['Lima', -12.05, -77.04, 0.7],
  ['Sao Paulo', -23.55, -46.63, 1.2],
  ['Buenos Aires', -34.6, -58.38, 0.9],
  ['Santiago', -33.45, -70.67, 0.7],
  ['Karachi', 24.86, 67.01, 0.7],
  ['Delhi', 28.61, 77.21, 1.1],
  ['Mumbai', 19.08, 72.88, 1.2],
  ['Bangalore', 12.97, 77.59, 1.1],
  ['Singapore', 1.35, 103.82, 1.3],
  ['Jakarta', -6.21, 106.85, 0.9],
  ['Bangkok', 13.76, 100.5, 0.9],
  ['Ho Chi Minh City', 10.82, 106.63, 0.7],
  ['Manila', 14.6, 120.98, 0.8],
  ['Hong Kong', 22.32, 114.17, 1.2],
  ['Shenzhen', 22.54, 114.06, 1.0],
  ['Shanghai', 31.23, 121.47, 1.3],
  ['Beijing', 39.9, 116.41, 1.1],
  ['Seoul', 37.57, 126.98, 1.2],
  ['Tokyo', 35.68, 139.69, 1.5],
  ['Osaka', 34.69, 135.5, 0.8],
  ['Taipei', 25.03, 121.57, 0.9],
  ['Sydney', -33.87, 151.21, 1.1],
  ['Melbourne', -37.81, 144.96, 0.9],
  ['Perth', -31.95, 115.86, 0.6],
  ['Auckland', -36.85, 174.76, 0.7],
];

// Long-haul backbone links on top of the regional nearest-neighbour web.
const BACKBONE = [
  ['Berlin', 'New York'],
  ['Berlin', 'Dubai'],
  ['Berlin', 'Tel Aviv'],
  ['Berlin', 'Mumbai'],
  ['Berlin', 'Toronto'],
  ['London', 'New York'],
  ['London', 'Lagos'],
  ['London', 'Singapore'],
  ['Lisbon', 'Sao Paulo'],
  ['Madrid', 'Mexico City'],
  ['Madrid', 'Bogota'],
  ['New York', 'Sao Paulo'],
  ['Miami', 'Bogota'],
  ['San Francisco', 'Tokyo'],
  ['Los Angeles', 'Sydney'],
  ['Seattle', 'Seoul'],
  ['Vancouver', 'Hong Kong'],
  ['Dubai', 'Singapore'],
  ['Dubai', 'Nairobi'],
  ['Dubai', 'Mumbai'],
  ['Singapore', 'Sydney'],
  ['Singapore', 'Tokyo'],
  ['Hong Kong', 'Sydney'],
  ['Cairo', 'Nairobi'],
  ['Lagos', 'Johannesburg'],
  ['Moscow', 'Beijing'],
  ['Istanbul', 'Delhi'],
  ['Santiago', 'Auckland'],
];

const DEG = Math.PI / 180;
const NEAREST = 3; // regional links per node
const REGIONAL_MAX = 0.62; // radians, roughly 4000 km
const SAME_PLACE = 0.04; // radians, roughly 250 km: a visitor this close to a city is in it

export function latLonToVector(lat, lon) {
  const phi = lat * DEG;
  const theta = lon * DEG;
  const c = Math.cos(phi);
  return [c * Math.sin(theta), Math.sin(phi), c * Math.cos(theta)];
}

const angleBetween = (a, b) => {
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return Math.acos(Math.min(1, Math.max(-1, d)));
};

// visitor: { lat, lon } or null. The visitor becomes a node of their own
// (or takes over the city they are in), linked straight to Berlin.
export function buildNetwork(visitor = null) {
  const nodes = CITIES.map(([name, lat, lon, weight]) => ({
    name,
    lat,
    lon,
    weight,
    pos: latLonToVector(lat, lon),
  }));
  const index = new Map(nodes.map((n, i) => [n.name, i]));

  let user = -1;
  if (visitor) {
    const pos = latLonToVector(visitor.lat, visitor.lon);
    let nearest = SAME_PLACE;
    nodes.forEach((n, i) => {
      const d = angleBetween(n.pos, pos);
      if (d < nearest) {
        nearest = d;
        user = i;
      }
    });
    if (user < 0) {
      nodes.push({ name: 'You', lat: visitor.lat, lon: visitor.lon, weight: 1.4, pos });
      user = nodes.length - 1;
    }
  }
  const home = index.get('Berlin');

  const linkKeys = new Set();
  const links = [];
  const addLink = (a, b, backbone = false, featured = false) => {
    if (a === b) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (linkKeys.has(key)) {
      if (featured) links.find((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a)).featured = true;
      return;
    }
    linkKeys.add(key);
    links.push({ a, b, backbone, featured, dist: angleBetween(nodes[a].pos, nodes[b].pos) });
  };

  nodes.forEach((node, i) => {
    const near = nodes
      .map((other, j) => ({ j, d: angleBetween(node.pos, other.pos) }))
      .filter(({ j, d }) => j !== i && d < REGIONAL_MAX)
      .sort((p, q) => p.d - q.d)
      .slice(0, NEAREST);
    near.forEach(({ j }) => addLink(i, j));
  });
  BACKBONE.forEach(([a, b]) => addLink(index.get(a), index.get(b), true));
  // The visitor's own line to the studio: always drawn.
  if (user >= 0 && user !== home) addLink(user, home, true, true);

  const adjacency = nodes.map(() => []);
  links.forEach((link, li) => {
    adjacency[link.a].push(li);
    adjacency[link.b].push(li);
  });

  return { nodes, links, adjacency, home, user };
}
