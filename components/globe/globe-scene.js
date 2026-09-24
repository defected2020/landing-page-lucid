import {
  AdditiveBlending,
  BufferGeometry,
  BackSide,
  Color,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  LineSegments,
  Matrix4,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Quaternion,
  RingGeometry,
  Scene,
  ShaderMaterial,
  FrontSide,
  SphereGeometry,
  Vector3,
  Vector4,
  WebGLRenderer,
} from 'three';
import * as GLSL from './shaders';
import { buildNetwork } from './nodes';
import { loadLandMask } from './land-mask';
import { createSky } from './sky';
import { locateVisitor } from './locate';

// ---------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------
const DEG = Math.PI / 180;
const FOV = 12; // narrow lens from far away: a mild, even perspective
// The planet does not spin. It is turned so the visitor's location (from
// their time zone; Berlin when unknown) sits at the layout's focal point with
// north up, and sways gently about that point: the world revolves around them.
const SWAY = 5 * DEG; // how far it turns either way about the visitor
const SWAY_PERIOD = 48; // seconds per full sway

const BASE_R = 0.994;
const ATMO_R = 1.16;
const NODE_ALT = 1.004;
const RING_ALT = 1.006;

const SLOTS = 24; // concurrent signals
const PPS = 48; // particles per signal (head + tail)
const TRAIL = 0.36; // tail length as a fraction of the arc
const RIPPLES = 8;
const RIPPLE_SPEED = 0.26;
const RIPPLE_LIFE = 1.8;
const RINGS_PER_NODE = 2;
const RING_LIFE = 1.3;
const RING_STAGGER = 0.22;
const MAX_CHAIN = 3;

const AURORA_R = 1.014;
const REVEAL_SPEED = 0.9; // rad/s: the opening wave from Berlin
const SWEEP_RATE = 0.22; // rad/s: the scan across the meridians
const HOVER_PX = 22; // how close the pointer has to be to wake a city
const HOVER_COOLDOWN = 1.6;
const BEACON_EVERY = 3.2; // the visitor's idle heartbeat
const DIALOGUE_EVERY = 6.5; // a signal along the visitor's line to Berlin, alternating direction
const CITY_SIGMA = 0.045; // radians: how far a city's lights spread

const SUN = new Vector3(0.5, 0.75, 0.45).normalize();

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const C = {
  space: '#06070f',
  night: '#070b1f',
  day: '#0e1738',
  rim: '#5865f2',
  glow: '#4d4fdb',
  edge: '#a8c0ff',
  dot: '#7d8bd8',
  dotHot: '#cbd8ff',
  link: '#6366f1',
  linkHot: '#a5b4fc',
  core: '#eef2ff',
  halo: '#818cf8',
  flash: '#a5f3fc',
  head: '#e0fbff',
  tail: '#6366f1',
  ring: '#9bb5ff',
  star: '#e2e8ff',
  starBlue: '#a5b4fc',
  city: '#e6eeff',
  grid: '#1f2a78',
  auroraLow: '#2dd4bf',
  auroraHigh: '#7c6cf2',
  orbit: '#6d7cf5',
  orbitHot: '#c7d2fe',
  sat: '#f0f9ff',
  satTrail: '#93a8ff',
  beam: '#a5f3fc',
  meteor: '#e0e7ff',
};

// Screen-space placement of the globe, as fractions of the canvas size.
function layoutFor(width, height) {
  const aspect = width / height;
  if (aspect < 0.95) {
    return { cx: 0.5, cy: 1.42, r: 0.92, fx: 0.5, fy: 0.85, mobile: true, dots: 2.3, nodePx: 9, headPx: 18, ring: 0.03 };
  }
  // fx / fy: where on screen the visitor's location is placed
  return { cx: 0.68, cy: 1.34, r: 1.15, fx: 0.74, fy: 0.54, mobile: false, dots: 2.8, nodePx: 10, headPx: 26, ring: 0.04 };
}

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const formatCoord = (lat, lon) =>
  `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}  ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;

const v3a = new Vector3();
const v3b = new Vector3();
const v3c = new Vector3();

// Control point of the quadratic arc between two surface points.
function arcControl(p0, p2, dist, out) {
  const lift = 0.025 + 0.16 * dist;
  out.addVectors(p0, p2).multiplyScalar(0.5);
  const len = 2 * NODE_ALT * (1 + lift) - out.length();
  return out.normalize().multiplyScalar(len);
}

function bezier(p0, p1, p2, t, out) {
  const u = 1 - t;
  out.set(
    u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z
  );
  return out;
}

// Hand the main thread back between start-up steps so no single task runs long.
const yieldToMain = () =>
  new Promise((resolve) => {
    if (typeof window.scheduler?.yield === 'function') window.scheduler.yield().then(resolve, resolve);
    else setTimeout(resolve, 0);
  });

const roulette = (weights) => {
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
};

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------
export function createGlobeScene(canvas, options = {}) {
  const reducedMotion = !!options.reducedMotion;
  const labels = options.labels || {};
  const section = canvas.closest('section');

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(new Color(C.space), 1);

  const state = {
    destroyed: false,
    active: true,
    raf: 0,
    lastMs: 0,
    time: 0,
    built: false,
    revealAt: -1,
    nextBeacon: 2,
    nextDialogue: 3.5,
    dialogueOut: true,
    dprCap: Infinity, // lowered if the first frames run slow
    perfFrames: 0,
    perfSum: 0,
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 40);
  const tilt = new Group();
  const spin = new Group(); // the planet's own frame; oriented by orient()
  tilt.add(spin);
  const baseQuat = new Quaternion();
  const swayQuat = new Quaternion();
  scene.add(tilt);

  // Shared uniforms
  const uTime = { value: 0 };
  const uPixelRatio = { value: 1 };
  const uRefDepth = { value: 3 };
  const uDotPx = { value: 3 };
  const uNodePx = { value: 9 };
  const uHeadPx = { value: 7 };
  const uSunDir = { value: SUN };
  const uHome = { value: new Vector3(0, 0, 1) };
  const uFront = { value: reducedMotion ? 10 : 0 };
  const uSweep = { value: 0 };
  const uCursor = { value: new Vector4(0, 0, 1, 0) };

  let layout = layoutFor(1, 1);
  let width = 1;
  let height = 1;
  let camDist = 4;
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

  const disposables = [];
  const track = (o) => {
    disposables.push(o);
    return o;
  };

  // --- Base sphere and atmosphere -----------------------------------------
  const baseGeo = track(new SphereGeometry(BASE_R, 96, 64));
  const baseMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.surfaceVert,
      fragmentShader: GLSL.baseFrag,
      uniforms: {
        uNight: { value: rgb(C.night) },
        uDay: { value: rgb(C.day) },
        uRim: { value: rgb(C.rim) },
        uGrid: { value: rgb(C.grid) },
        uSunDir,
      },
    })
  );
  const base = new Mesh(baseGeo, baseMat);
  base.renderOrder = 0;
  spin.add(base);

  const atmoGeo = track(new SphereGeometry(ATMO_R, 96, 64));
  const atmoMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.surfaceVert,
      fragmentShader: GLSL.atmosphereFrag,
      uniforms: {
        uGlow: { value: rgb(C.glow) },
        uEdge: { value: rgb(C.edge) },
        uSunDir,
        uLimb: { value: Math.sqrt(1 - (BASE_R / ATMO_R) ** 2) },
        uIntensity: { value: 1.0 },
      },
      side: BackSide,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    })
  );
  const atmosphere = new Mesh(atmoGeo, atmoMat);
  atmosphere.renderOrder = 6;
  spin.add(atmosphere);

  // Aurora over both polar ovals, so it shows whichever hemisphere faces us.
  const auroraGeo = track(new SphereGeometry(AURORA_R, 192, 12, 0, Math.PI * 2, 5 * DEG, 32 * DEG));
  const auroraSouthGeo = track(
    new SphereGeometry(AURORA_R, 192, 12, 0, Math.PI * 2, 143 * DEG, 32 * DEG)
  );
  const auroraMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.surfaceVert,
      fragmentShader: GLSL.auroraFrag,
      uniforms: {
        uTime,
        uLow: { value: rgb(C.auroraLow) },
        uHigh: { value: rgb(C.auroraHigh) },
        uIntensity: { value: 0.75 },
      },
      side: FrontSide,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    })
  );
  [auroraGeo, auroraSouthGeo].forEach((geo) => {
    const aurora = new Mesh(geo, auroraMat);
    aurora.renderOrder = 5;
    spin.add(aurora);
  });

  // --- Stars ---------------------------------------------------------------
  const starCount = 2400;
  const starPos = new Float32Array(starCount * 3);
  const starSize = new Float32Array(starCount);
  const starPhase = new Float32Array(starCount);
  const starTint = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    const z = -8 - Math.random() * 6;
    const spread = (camDist - z) * Math.tan((FOV / 2) * DEG);
    starPos[i * 3] = (Math.random() * 2 - 1) * spread * 3.2;
    starPos[i * 3 + 1] = (Math.random() * 2 - 1) * spread * 1.3;
    starPos[i * 3 + 2] = z;
    const big = Math.random() < 0.1;
    starSize[i] = big ? 2.6 + Math.random() * 1.8 : 1.0 + Math.random() * 1.4;
    starPhase[i] = Math.random();
    starTint[i] = Math.random() < 0.3 ? Math.random() : 0;
  }
  const starGeo = track(new BufferGeometry());
  starGeo.setAttribute('position', new Float32BufferAttribute(starPos, 3));
  starGeo.setAttribute('aSize', new Float32BufferAttribute(starSize, 1));
  starGeo.setAttribute('aPhase', new Float32BufferAttribute(starPhase, 1));
  starGeo.setAttribute('aTint', new Float32BufferAttribute(starTint, 1));
  const starMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.starsVert,
      fragmentShader: GLSL.starsFrag,
      uniforms: {
        uTime,
        uPixelRatio,
        uWhite: { value: rgb(C.star) },
        uBlue: { value: rgb(C.starBlue) },
        uOpacity: { value: 0.95 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  const stars = new Points(starGeo, starMat);
  stars.frustumCulled = false;
  stars.renderOrder = -1;
  scene.add(stars);

  // --- Network: nodes, links, rings, signals -------------------------------
  const net = buildNetwork(options.visitor === undefined ? locateVisitor() : options.visitor);
  // The node the view centres on: the visitor, or Berlin when unknown.
  const focus = net.user >= 0 ? net.user : net.home;
  const nodeCount = net.nodes.length;
  const nodeVec = net.nodes.map((n) => new Vector3(n.pos[0], n.pos[1], n.pos[2]));
  const nodeFacing = new Float32Array(nodeCount);
  uHome.value.copy(nodeVec[focus]);

  // Nodes
  const nodeGeo = track(new BufferGeometry());
  const nodePos = new Float32Array(nodeCount * 3);
  const nodeWeight = new Float32Array(nodeCount);
  const nodeFire = new Float32Array(nodeCount).fill(-1);
  net.nodes.forEach((n, i) => {
    nodePos[i * 3] = n.pos[0] * NODE_ALT;
    nodePos[i * 3 + 1] = n.pos[1] * NODE_ALT;
    nodePos[i * 3 + 2] = n.pos[2] * NODE_ALT;
    nodeWeight[i] = n.weight;
  });
  nodeGeo.setAttribute('position', new Float32BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute('aWeight', new Float32BufferAttribute(nodeWeight, 1));
  const nodeFireAttr = new Float32BufferAttribute(nodeFire, 1).setUsage(DynamicDrawUsage);
  nodeGeo.setAttribute('aFire', nodeFireAttr);
  const nodeMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.nodesVert,
      fragmentShader: GLSL.nodesFrag,
      uniforms: {
        uTime,
        uPixelRatio,
        uRefDepth,
        uNodePx,
        uHome,
        uFront,
        uCore: { value: rgb(C.core) },
        uHalo: { value: rgb(C.halo) },
        uFlash: { value: rgb(C.flash) },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  const nodes = new Points(nodeGeo, nodeMat);
  nodes.frustumCulled = false;
  nodes.renderOrder = 3;
  spin.add(nodes);

  // Links: every link is the same arc its signals travel on.
  const linkControls = net.links.map((l) =>
    arcControl(
      v3a.copy(nodeVec[l.a]).multiplyScalar(NODE_ALT),
      v3b.copy(nodeVec[l.b]).multiplyScalar(NODE_ALT),
      l.dist,
      new Vector3()
    )
  );
  const linkRanges = [];
  const linkVerts = [];
  net.links.forEach((l, li) => {
    const p0 = v3a.copy(nodeVec[l.a]).multiplyScalar(NODE_ALT);
    const p2 = v3b.copy(nodeVec[l.b]).multiplyScalar(NODE_ALT);
    const segments = Math.min(48, Math.max(8, Math.round(l.dist / 0.035)));
    const start = linkVerts.length / 3;
    for (let s = 0; s < segments; s++) {
      bezier(p0, linkControls[li], p2, s / segments, v3c);
      linkVerts.push(v3c.x, v3c.y, v3c.z);
      bezier(p0, linkControls[li], p2, (s + 1) / segments, v3c);
      linkVerts.push(v3c.x, v3c.y, v3c.z);
    }
    linkRanges.push([start, segments * 2]);
  });
  const linkGeo = track(new BufferGeometry());
  linkGeo.setAttribute('position', new Float32BufferAttribute(new Float32Array(linkVerts), 3));
  const linkEnergyAttr = new Float32BufferAttribute(new Float32Array(linkVerts.length / 3), 1).setUsage(
    DynamicDrawUsage
  );
  linkGeo.setAttribute('aEnergy', linkEnergyAttr);
  const linkBase = new Float32Array(linkVerts.length / 3);
  net.links.forEach((l, li) => {
    if (l.backbone && !l.featured) return;
    const [start, count] = linkRanges[li];
    for (let k = 0; k < count; k++) linkBase[start + k] = l.featured ? 2.6 : 1;
  });
  linkGeo.setAttribute('aBase', new Float32BufferAttribute(linkBase, 1));
  const linkMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.linksVert,
      fragmentShader: GLSL.linksFrag,
      uniforms: {
        uHome,
        uFront,
        uColor: { value: rgb(C.link) },
        uHot: { value: rgb(C.linkHot) },
        uOpacity: { value: 0.075 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  const links = new LineSegments(linkGeo, linkMat);
  links.frustumCulled = false;
  links.renderOrder = 2;
  spin.add(links);
  const linkEnergy = new Float32Array(net.links.length);

  // Rings that expand from a firing node
  const ringCount = nodeCount * RINGS_PER_NODE;
  const ringGeo = track(new RingGeometry(0.74, 1.0, 48));
  const ringFire = new Float32Array(ringCount).fill(-1);
  const ringFireAttr = new InstancedBufferAttribute(ringFire, 1).setUsage(DynamicDrawUsage);
  ringGeo.setAttribute('aFire', ringFireAttr);
  const ringMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.ringsVert,
      fragmentShader: GLSL.ringsFrag,
      uniforms: {
        uTime,
        uLife: { value: RING_LIFE },
        uMaxScale: { value: 0.04 },
        uColor: { value: rgb(C.ring) },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  const rings = new InstancedMesh(ringGeo, ringMat, ringCount);
  rings.frustumCulled = false;
  rings.renderOrder = 4;
  {
    const m = new Matrix4();
    const q = new Quaternion();
    const up = new Vector3(0, 0, 1);
    const one = new Vector3(1, 1, 1);
    for (let i = 0; i < nodeCount; i++) {
      q.setFromUnitVectors(up, nodeVec[i]);
      v3a.copy(nodeVec[i]).multiplyScalar(RING_ALT);
      m.compose(v3a, q, one);
      for (let k = 0; k < RINGS_PER_NODE; k++) rings.setMatrixAt(i * RINGS_PER_NODE + k, m);
    }
    rings.instanceMatrix.needsUpdate = true;
  }
  spin.add(rings);

  // Signals: one Points object, a fixed number of slots
  const particleCount = SLOTS * PPS;
  const pP0 = new Float32Array(particleCount * 3);
  const pP1 = new Float32Array(particleCount * 3);
  const pP2 = new Float32Array(particleCount * 3);
  const pOffset = new Float32Array(particleCount);
  const pStart = new Float32Array(particleCount).fill(-1);
  const pDuration = new Float32Array(particleCount).fill(1);
  const pSeed = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    pOffset[i] = (i % PPS) / (PPS - 1);
    pSeed[i] = Math.random();
  }
  const pulseGeo = track(new BufferGeometry());
  pulseGeo.setAttribute('position', new Float32BufferAttribute(new Float32Array(particleCount * 3), 3));
  const pP0Attr = new Float32BufferAttribute(pP0, 3).setUsage(DynamicDrawUsage);
  const pP1Attr = new Float32BufferAttribute(pP1, 3).setUsage(DynamicDrawUsage);
  const pP2Attr = new Float32BufferAttribute(pP2, 3).setUsage(DynamicDrawUsage);
  const pStartAttr = new Float32BufferAttribute(pStart, 1).setUsage(DynamicDrawUsage);
  const pDurationAttr = new Float32BufferAttribute(pDuration, 1).setUsage(DynamicDrawUsage);
  pulseGeo.setAttribute('aP0', pP0Attr);
  pulseGeo.setAttribute('aP1', pP1Attr);
  pulseGeo.setAttribute('aP2', pP2Attr);
  pulseGeo.setAttribute('aOffset', new Float32BufferAttribute(pOffset, 1));
  pulseGeo.setAttribute('aStart', pStartAttr);
  pulseGeo.setAttribute('aDuration', pDurationAttr);
  pulseGeo.setAttribute('aSeed', new Float32BufferAttribute(pSeed, 1));
  const pulseMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.pulsesVert,
      fragmentShader: GLSL.pulsesFrag,
      uniforms: {
        uTime,
        uPixelRatio,
        uRefDepth,
        uHeadPx,
        uTrail: { value: TRAIL },
        uHead: { value: rgb(C.head) },
        uTail: { value: rgb(C.tail) },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  const pulses = new Points(pulseGeo, pulseMat);
  pulses.frustumCulled = false;
  pulses.renderOrder = 5;
  spin.add(pulses);
  const slotFreeAt = new Float32Array(SLOTS);

  // Ripples through the land dots
  const ripples = new Float32Array(RIPPLES * 4);
  let rippleCursor = 0;

  // --- Land dots (built once the mask has loaded) --------------------------
  let dots = null;
  let dotMat = null;

  async function buildDots(mask) {
    // Rows of dots along parallels, half-step staggered, so the lattice reads
    // as a calm grid and follows the spin without spiral banding. Sampled in
    // slices of rows, yielding in between, to stay clear of long tasks.
    const radiusPx = layout.r * height;
    const spacingPx = layout.mobile ? 9.5 : 8.5;
    const spacing = Math.max(0.0055, spacingPx / radiusPx); // radians
    const rows = Math.round(Math.PI / spacing);
    const pos = [];
    const rand = [];
    const city = [];
    const SLICE = 40;
    // City lights: each dot glows by its closeness to the network's cities,
    // plus a sparse sprinkle of towns so the night side is never empty.
    const near = Math.cos(CITY_SIGMA * 3.2);
    const cityGlow = (x, y, z) => {
      let g = 0;
      for (let i = 0; i < nodeCount; i++) {
        const v = nodeVec[i];
        const d = x * v.x + y * v.y + z * v.z;
        if (d < near) continue;
        const a2 = 2 * (1 - d); // angle squared, small-angle
        g += (net.nodes[i].weight / 2.2) * Math.exp(-a2 / (CITY_SIGMA * CITY_SIGMA));
      }
      if (Math.random() < 0.035) g = Math.max(g, 0.18 + Math.random() * 0.3);
      return Math.min(1, g);
    };
    for (let r0 = 1; r0 < rows; r0 += SLICE) {
      for (let ri = r0; ri < Math.min(rows, r0 + SLICE); ri++) {
        const lat = -Math.PI / 2 + (ri / rows) * Math.PI;
        const c = Math.cos(lat);
        const count = Math.max(1, Math.round((2 * Math.PI * c) / spacing));
        const offset = ri % 2 ? 0.5 : 0;
        for (let ci = 0; ci < count; ci++) {
          const lon = ((ci + offset) / count) * 2 * Math.PI - Math.PI;
          if (!mask.isLand(lat, lon)) continue;
          const x = c * Math.sin(lon);
          const y = Math.sin(lat);
          const z = c * Math.cos(lon);
          pos.push(x, y, z);
          rand.push(Math.random());
          city.push(cityGlow(x, y, z));
        }
      }
      await yieldToMain();
      if (state.destroyed) return;
    }
    const geo = track(new BufferGeometry());
    geo.setAttribute('position', new Float32BufferAttribute(new Float32Array(pos), 3));
    geo.setAttribute('aRand', new Float32BufferAttribute(new Float32Array(rand), 1));
    geo.setAttribute('aCity', new Float32BufferAttribute(new Float32Array(city), 1));
    dotMat = track(
      new ShaderMaterial({
        vertexShader: GLSL.dotsVert,
        fragmentShader: GLSL.dotsFrag,
        uniforms: {
          uTime,
          uPixelRatio,
          uRefDepth,
          uDotPx,
          uSunDir,
          uRippleSpeed: { value: RIPPLE_SPEED },
          uRippleLife: { value: RIPPLE_LIFE },
          uRipples: { value: ripples },
          uHome,
          uFront,
          uSweep,
          uCursor,
          uColor: { value: rgb(C.dot) },
          uHot: { value: rgb(C.dotHot) },
          uCity: { value: rgb(C.city) },
          uOpacity: { value: 0.62 },
        },
        transparent: true,
        depthWrite: false,
        blending: NormalBlending,
      })
    );
    dots = new Points(geo, dotMat);
    dots.frustumCulled = false;
    dots.renderOrder = 1;
    spin.add(dots);
  }

  // --- Layout / resize -----------------------------------------------------
  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    width = w;
    height = h;
    layout = layoutFor(w, h);
    const dpr = Math.min(window.devicePixelRatio || 1, layout.mobile ? 2 : 1.5, state.dprCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    uPixelRatio.value = dpr;
    uDotPx.value = layout.dots;
    uNodePx.value = layout.nodePx;
    uHeadPx.value = layout.headPx;
    ringMat.uniforms.uMaxScale.value = layout.ring;

    const aspect = w / h;
    const visibleHeight = 1 / layout.r; // world units spanning the canvas at z = 0
    camDist = visibleHeight / (2 * Math.tan((FOV / 2) * DEG));
    camera.aspect = aspect;
    camera.position.z = camDist;
    camera.updateProjectionMatrix();
    uRefDepth.value = camDist - 1;
    tilt.position.set((layout.cx - 0.5) * visibleHeight * aspect, -(layout.cy - 0.5) * visibleHeight, 0);
    orient();
  }

  // Turn the planet so the focus node lands on the layout's focal point with
  // north pointing up the screen there: map the node's local east / north /
  // up frame onto the same frame at the focal point.
  const basisFrom = new Matrix4();
  const basisTo = new Matrix4();
  function orient() {
    camera.position.set(0, 0, camDist);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    tilt.updateMatrixWorld(true);
    const up = new Vector3(0, 1, 0);
    const frame = (n, out) => {
      const north = up.clone().addScaledVector(n, -up.dot(n)).normalize();
      const east = new Vector3().crossVectors(north, n);
      return out.makeBasis(east, north, n);
    };
    // Where the focal pixel meets the sphere, relative to the planet's centre
    const dir = new Vector3((layout.fx * 2 - 1), -(layout.fy * 2 - 1), 0.5).unproject(camera).sub(camera.position).normalize();
    const oc = camera.position.clone().sub(tilt.position);
    const b = oc.dot(dir);
    const h = b * b - (oc.lengthSq() - 1);
    const t = h > 0 ? -b - Math.sqrt(h) : -b; // off the disc: nearest point to the ray
    const target = camera.position.clone().addScaledVector(dir, t).sub(tilt.position).normalize();
    frame(nodeVec[focus], basisFrom);
    frame(target, basisTo);
    basisTo.multiply(basisFrom.transpose());
    baseQuat.setFromRotationMatrix(basisTo);
    applySway(reducedMotion ? 0 : state.time);
  }

  function applySway(time) {
    swayQuat.setFromAxisAngle(nodeVec[focus], SWAY * Math.sin((time / SWAY_PERIOD) * Math.PI * 2));
    spin.quaternion.multiplyQuaternions(baseQuat, swayQuat);
  }

  // --- Signal choreography -------------------------------------------------
  const events = []; // { at, type: 'arrive' | 'spawn', node, link, depth }
  let nextSpawnAt = 0.6;

  function flashNode(i) {
    nodeFire[i] = state.time;
    nodeFireAttr.needsUpdate = true;
  }

  function fireNode(i) {
    flashNode(i);
    for (let k = 0; k < RINGS_PER_NODE; k++) ringFire[i * RINGS_PER_NODE + k] = state.time + k * RING_STAGGER;
    ringFireAttr.needsUpdate = true;
    const base = rippleCursor * 4;
    ripples[base] = nodeVec[i].x;
    ripples[base + 1] = nodeVec[i].y;
    ripples[base + 2] = nodeVec[i].z;
    ripples[base + 3] = state.time;
    rippleCursor = (rippleCursor + 1) % RIPPLES;
  }

  function otherEnd(linkIdx, nodeIdx) {
    const l = net.links[linkIdx];
    return l.a === nodeIdx ? l.b : l.a;
  }

  function spawnSignal(fromNode, linkIdx, depth) {
    let slot = -1;
    for (let s = 0; s < SLOTS; s++) {
      if (slotFreeAt[s] <= state.time) {
        slot = s;
        break;
      }
    }
    if (slot < 0) return;
    const link = net.links[linkIdx];
    const toNode = otherEnd(linkIdx, fromNode);
    const p0 = v3a.copy(nodeVec[fromNode]).multiplyScalar(NODE_ALT);
    const p2 = v3b.copy(nodeVec[toNode]).multiplyScalar(NODE_ALT);
    const p1 = linkControls[linkIdx];
    const duration = 0.8 + link.dist * 1.2;
    const start = slot * PPS;
    for (let i = start; i < start + PPS; i++) {
      pP0[i * 3] = p0.x;
      pP0[i * 3 + 1] = p0.y;
      pP0[i * 3 + 2] = p0.z;
      pP1[i * 3] = p1.x;
      pP1[i * 3 + 1] = p1.y;
      pP1[i * 3 + 2] = p1.z;
      pP2[i * 3] = p2.x;
      pP2[i * 3 + 1] = p2.y;
      pP2[i * 3 + 2] = p2.z;
      pStart[i] = state.time;
      pDuration[i] = duration;
    }
    pP0Attr.needsUpdate = true;
    pP1Attr.needsUpdate = true;
    pP2Attr.needsUpdate = true;
    pStartAttr.needsUpdate = true;
    pDurationAttr.needsUpdate = true;
    slotFreeAt[slot] = state.time + duration * (1 + TRAIL) + 0.05;
    linkEnergy[linkIdx] = Math.max(linkEnergy[linkIdx], 0.55);
    flashNode(fromNode);
    events.push({ at: state.time + duration, type: 'arrive', node: toNode, link: linkIdx, depth });
  }

  function pickOrigin() {
    const w = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) {
      const visible = nodeFacing[i] > 0.15 ? 1 : 0.15;
      w[i] = net.nodes[i].weight * visible * (i === net.home ? 1.6 : 1) * (i === net.user ? 1.8 : 1);
    }
    return roulette(w);
  }

  function pickLink(nodeIdx, excludeLink) {
    const options = net.adjacency[nodeIdx].filter((l) => l !== excludeLink);
    if (!options.length) return -1;
    const w = options.map((l) => (nodeFacing[otherEnd(l, nodeIdx)] > 0.1 ? 1 : 0.3));
    return options[roulette(w)];
  }

  function updateFacing() {
    tilt.updateMatrixWorld(true);
    v3c.setFromMatrixPosition(spin.matrixWorld);
    const toCam = v3b.copy(camera.position).sub(v3c).normalize();
    for (let i = 0; i < nodeCount; i++) {
      v3a.copy(nodeVec[i]).applyMatrix4(spin.matrixWorld).sub(v3c).normalize();
      nodeFacing[i] = v3a.dot(toCam);
    }
    centre.copy(v3c);
    spinInverse.copy(spin.matrixWorld).invert();
  }

  function choreograph(dt) {
    // Deliveries and chained firings that are due
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      if (e.at > state.time) continue;
      events.splice(i, 1);
      if (e.type === 'arrive') {
        fireNode(e.node);
        linkEnergy[e.link] = 1;
        if (e.depth < MAX_CHAIN) {
          const r = Math.random();
          const branches = r < 0.5 ? 1 : r < 0.75 ? 2 : 0;
          for (let b = 0; b < branches; b++) {
            const link = pickLink(e.node, e.link);
            if (link >= 0) {
              events.push({
                at: state.time + 0.08 + Math.random() * 0.22,
                type: 'spawn',
                node: e.node,
                link,
                depth: e.depth + 1,
              });
            }
          }
        }
      } else if (e.type === 'spawn') {
        spawnSignal(e.node, e.link, e.depth);
      }
    }

    // Fresh signals from a weighted random neuron
    if (state.time >= nextSpawnAt) {
      nextSpawnAt = state.time + 0.26 + Math.random() * 0.34;
      const origin = pickOrigin();
      const link = pickLink(origin, -1);
      if (link >= 0) spawnSignal(origin, link, 1);
    }

    // Link afterglow decay
    const decay = Math.exp(-1.7 * dt);
    let any = false;
    for (let li = 0; li < linkEnergy.length; li++) {
      if (linkEnergy[li] > 0.002) {
        linkEnergy[li] *= decay;
        any = true;
      } else {
        linkEnergy[li] = 0;
      }
    }
    if (any || linkEnergyAttr.needsUpdate) {
      const arr = linkEnergyAttr.array;
      for (let li = 0; li < linkRanges.length; li++) {
        const [start, count] = linkRanges[li];
        const e = linkEnergy[li];
        for (let k = 0; k < count; k++) arr[start + k] = e;
      }
      linkEnergyAttr.needsUpdate = true;
    }
  }

  // The link between the visitor and Berlin, if they are not in Berlin.
  const dialogueLink = net.links.findIndex((l) => l.featured);

  // The reveal spreads from the visitor; their neighbourhood lights up first,
  // then a signal leaves for Berlin.
  function openingBurst() {
    net.adjacency[focus].forEach((link, k) => {
      if (link === dialogueLink) return;
      events.push({ at: state.time + 0.35 + k * 0.14, type: 'spawn', node: focus, link, depth: 1 });
    });
    if (dialogueLink >= 0) events.push({ at: state.time + 0.9, type: 'spawn', node: focus, link: dialogueLink, depth: 1 });
  }

  // Now and then a signal travels the visitor's line to Berlin, one way and
  // then the other.
  function dialogue() {
    if (dialogueLink < 0) return;
    const from = state.dialogueOut ? net.user : net.home;
    state.dialogueOut = !state.dialogueOut;
    spawnSignal(from, dialogueLink, MAX_CHAIN);
  }

  // A clicked city fires down every one of its links at once.
  function burst(i) {
    fireNode(i);
    net.adjacency[i].forEach((link, k) => {
      events.push({ at: state.time + 0.05 + k * 0.07, type: 'spawn', node: i, link, depth: 1 });
    });
  }

  function addRipple(p) {
    const b = rippleCursor * 4;
    ripples[b] = p.x;
    ripples[b + 1] = p.y;
    ripples[b + 2] = p.z;
    ripples[b + 3] = state.time;
    rippleCursor = (rippleCursor + 1) % RIPPLES;
  }

  // The visitor's idle heartbeat: a single soft ring.
  function beacon() {
    ringFire[focus * RINGS_PER_NODE] = state.time;
    ringFireAttr.needsUpdate = true;
  }

  // --- Screen-space helpers ------------------------------------------------
  const centre = new Vector3();
  const spinInverse = new Matrix4();
  const scratch = new Vector3();
  const rayDir = new Vector3();
  const world = new Vector3();

  function nodeWorld(i, out) {
    return out.copy(nodeVec[i]).multiplyScalar(NODE_ALT).applyMatrix4(spin.matrixWorld);
  }

  function toScreen(p, out) {
    scratch.copy(p).project(camera);
    out.x = (scratch.x * 0.5 + 0.5) * width;
    out.y = (-scratch.y * 0.5 + 0.5) * height;
    return out;
  }

  // Where a canvas pixel lands on the planet, as a unit vector in the
  // spinning frame; false when it misses.
  function pickSurface(px, py, out) {
    rayDir
      .set((px / width) * 2 - 1, -(py / height) * 2 + 1, 0.5)
      .unproject(camera)
      .sub(camera.position)
      .normalize();
    scratch.copy(camera.position).sub(centre);
    const b = scratch.dot(rayDir);
    const h = b * b - (scratch.lengthSq() - 1);
    if (h < 0) return false;
    out
      .copy(camera.position)
      .addScaledVector(rayDir, -b - Math.sqrt(h))
      .applyMatrix4(spinInverse)
      .normalize();
    return true;
  }

  function screenToWorld(fx, fy, z, out) {
    const half = (camera.position.z - z) * Math.tan((FOV / 2) * DEG);
    return out.set((fx * 2 - 1) * half * camera.aspect + camera.position.x, (1 - fy * 2) * half + camera.position.y, z);
  }

  // --- Satellites, beams, meteors -------------------------------------------
  const nodeTilt = new Vector3();
  const sky = createSky({
    parent: tilt,
    scene,
    uPixelRatio,
    colors: C,
    track,
    ctx: {
      spriteScale: () => (layout.mobile ? 0.75 : 1),
      screenToWorld,
      nodeWorld,
      // The brightest visible city under a satellite (dir: unit, tilted frame)
      findNodeBelow(dir) {
        const reach = Math.cos(0.17);
        let best = -1;
        let bestWeight = 0;
        for (let i = 0; i < nodeCount; i++) {
          if (nodeFacing[i] < 0.3) continue;
          nodeTilt.copy(nodeVec[i]).applyMatrix4(spin.matrix);
          if (nodeTilt.dot(dir) > reach && net.nodes[i].weight > bestWeight) {
            best = i;
            bestWeight = net.nodes[i].weight;
          }
        }
        return best;
      },
      onDownlink(i) {
        fireNode(i);
        const link = pickLink(i, -1);
        if (link >= 0) events.push({ at: state.time + 0.12, type: 'spawn', node: i, link, depth: 1 });
      },
    },
  });

  // --- Pointer: spotlight, hover labels, clicks ------------------------------
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const interactive = !reducedMotion && hasFinePointer;
  const pointer = { x: 0, y: 0, inside: false };
  const hover = { node: -1, last: -1, alpha: 0, firedAt: new Float32Array(nodeCount).fill(-10) };
  const surfacePoint = new Vector3();
  const screenPt = { x: 0, y: 0 };

  function setHover(i) {
    if (i === hover.node) return;
    hover.node = i;
    if (section) section.style.cursor = i >= 0 ? 'pointer' : '';
    if (i >= 0 && labels.tipName) {
      const n = net.nodes[i];
      labels.tipName.textContent = n.name;
      if (labels.tipMeta) labels.tipMeta.textContent = formatCoord(n.lat, n.lon);
    }
  }

  function interact(dt) {
    let hit = false;
    let best = -1;
    if (pointer.inside) {
      hit = pickSurface(pointer.x, pointer.y, surfacePoint);
      let bestD = HOVER_PX * HOVER_PX;
      for (let i = 0; i < nodeCount; i++) {
        if (nodeFacing[i] < 0.2) continue;
        toScreen(nodeWorld(i, world), screenPt);
        const dx = screenPt.x - pointer.x;
        const dy = screenPt.y - pointer.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
    }
    const cur = uCursor.value;
    if (hit) cur.set(surfacePoint.x, surfacePoint.y, surfacePoint.z, cur.w);
    cur.w += ((hit ? 1 : 0) - cur.w) * Math.min(1, dt * 5);
    setHover(best);
    if (best >= 0 && state.time - hover.firedAt[best] > HOVER_COOLDOWN) {
      hover.firedAt[best] = state.time;
      fireNode(best);
      const link = pickLink(best, -1);
      if (link >= 0) spawnSignal(best, link, 1);
    }
  }

  const labelPt = { x: 0, y: 0 };

  function placeLabel(el, i, alpha) {
    if (alpha < 0.002) {
      if (el.dataset.hidden !== '1') {
        el.style.opacity = '0';
        el.dataset.hidden = '1';
      }
      return;
    }
    el.dataset.hidden = '0';
    toScreen(nodeWorld(i, world), labelPt);
    const lean = labelPt.x > width - 250 ? 'left' : 'right';
    if (el.dataset.side !== lean) el.dataset.side = lean;
    el.style.transform = `translate3d(${labelPt.x.toFixed(1)}px, ${labelPt.y.toFixed(1)}px, 0)`;
    el.style.opacity = alpha.toFixed(3);
  }

  function updateLabels(dt) {
    // No tip for home (it has its own label) or for a visitor who is not in a
    // listed city: their node is only an approximation.
    const tipOn = hover.node >= 0 && hover.node !== net.home && net.nodes[hover.node].name !== 'You';
    const since = state.revealAt < 0 ? 0 : state.time - state.revealAt;
    if (labels.hq) {
      const a = layout.mobile
        ? 0
        : smoothstep(0.25, 0.5, nodeFacing[net.home]) * smoothstep(0.8, 1.6, since) * (tipOn ? 0.45 : 1);
      placeLabel(labels.hq, net.home, a);
    }
    if (labels.tip) {
      hover.alpha += ((tipOn ? 1 : 0) - hover.alpha) * Math.min(1, dt * 10);
      if (tipOn) hover.last = hover.node;
      if (hover.last >= 0) placeLabel(labels.tip, hover.last, hover.alpha);
    }
  }

  // --- Frame loop ----------------------------------------------------------
  function render() {
    uTime.value = state.time;
    renderer.render(scene, camera);
  }

  // If the first seconds run slow, drop the resolution once rather than stutter.
  function watchPerformance(dt) {
    if (state.perfFrames >= 150) return;
    state.perfFrames++;
    if (state.perfFrames > 30) state.perfSum += dt;
    if (state.perfFrames === 150 && state.perfSum / 120 > 1 / 42 && renderer.getPixelRatio() > 1) {
      state.dprCap = Math.max(1, renderer.getPixelRatio() * 0.7);
      resize();
    }
  }

  function frame(nowMs) {
    if (state.destroyed) return;
    state.raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, Math.max(0, (nowMs - state.lastMs) / 1000));
    state.lastMs = nowMs;
    state.time += dt;

    applySway(state.time);

    parallax.x += (parallax.tx - parallax.x) * Math.min(1, dt * 2.5);
    parallax.y += (parallax.ty - parallax.y) * Math.min(1, dt * 2.5);
    camera.position.x = parallax.x * 0.16;
    camera.position.y = parallax.y * 0.1;
    camera.lookAt(0, 0, 0);

    const front = (state.time - state.revealAt) * REVEAL_SPEED;
    uFront.value = front > 3.4 ? 10 : front;
    uSweep.value = state.time * SWEEP_RATE;
    if (state.time >= state.nextBeacon) {
      beacon();
      state.nextBeacon = state.time + BEACON_EVERY;
    }
    if (state.time >= state.nextDialogue) {
      dialogue();
      state.nextDialogue = state.time + DIALOGUE_EVERY;
    }

    updateFacing();
    if (interactive) interact(dt);
    choreograph(dt);
    sky.update(state.time);
    updateLabels(dt);
    render();
    watchPerformance(dt);
  }

  function start() {
    if (state.raf || state.destroyed) return;
    state.lastMs = performance.now();
    state.raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  function renderStill() {
    // A composed still for reduced motion: a few neurons mid-fire.
    state.time = 10;
    state.revealAt = 0;
    updateFacing();
    const lit = [focus];
    for (let i = 0; i < nodeCount && lit.length < 7; i++) {
      if (nodeFacing[i] > 0.35 && Math.random() < 0.25) lit.push(i);
    }
    lit.forEach((i, k) => {
      const link = pickLink(i, -1);
      if (link >= 0) {
        state.time = 10 - 0.5 - k * 0.1;
        spawnSignal(i, link, 1);
      }
      state.time = 10 - 0.35;
      fireNode(i);
    });
    state.time = 10;
    choreograph(0);
    sky.update(state.time, { motion: false });
    updateLabels(1);
    render();
  }

  // --- Events --------------------------------------------------------------
  const onPointer = (e) => {
    parallax.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    parallax.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
  };
  const onPointerOut = (e) => {
    if (!e.relatedTarget) pointer.inside = false;
  };
  // Clicking (or tapping) the planet sends a ripple out from that spot and
  // sets off the nearest city. Text and controls keep their own clicks.
  const onClick = (e) => {
    if (!state.built || reducedMotion || !section || !section.contains(e.target)) return;
    if (e.target.closest('a, button, input, textarea, select, label, h1, p, [role="button"]')) return;
    const rect = canvas.getBoundingClientRect();
    if (!pickSurface(e.clientX - rect.left, e.clientY - rect.top, surfacePoint)) return;
    addRipple(surfacePoint);
    let best = -1;
    let bestDot = Math.cos(0.3);
    for (let i = 0; i < nodeCount; i++) {
      const d = nodeVec[i].dot(surfacePoint);
      if (nodeFacing[i] > 0.1 && d > bestDot) {
        bestDot = d;
        best = i;
      }
    }
    if (best >= 0) burst(best);
  };
  const onContextLost = (e) => {
    e.preventDefault();
    stop();
  };
  const onContextRestored = () => {
    if (state.active && !reducedMotion) start();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);

  const ro = new ResizeObserver(() => {
    resize();
    if (reducedMotion && state.built) renderStill();
  });
  ro.observe(canvas);
  resize();

  if (interactive) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
  }
  if (!reducedMotion) window.addEventListener('click', onClick);

  const ready = (async () => {
    const mask = await loadLandMask({ scale: layout.mobile ? 0.5 : 1 });
    if (state.destroyed) return;
    await yieldToMain();
    await buildDots(mask);
    if (state.destroyed) return;
    // Compile the shader programs before the first frame, in parallel where
    // the driver allows, instead of stalling the first render call.
    if (renderer.extensions.has('KHR_parallel_shader_compile')) await renderer.compileAsync(scene, camera);
    else renderer.compile(scene, camera);
    if (state.destroyed) return;
    state.built = true;
    if (reducedMotion) {
      renderStill();
    } else {
      state.revealAt = state.time;
      openingBurst();
      updateFacing();
      render();
      if (state.active) start();
    }
  })();

  return {
    ready,
    setActive(on) {
      state.active = on;
      if (reducedMotion || !state.built) return;
      if (on) start();
      else stop();
    },
    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      stop();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('click', onClick);
      if (section) section.style.cursor = '';
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
