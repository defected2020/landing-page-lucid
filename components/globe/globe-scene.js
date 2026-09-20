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
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import * as GLSL from './shaders';
import { buildNetwork } from './nodes';
import { loadLandMask } from './land-mask';

// ---------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------
const DEG = Math.PI / 180;
const FOV = 12; // narrow lens from far away: a mild, even perspective
const SPIN_RATE = (2 * Math.PI) / 360; // one revolution every six minutes
const TILT = 12 * DEG; // pole tipped toward us: the Arctic is the quiet rim, the busy mid-latitudes sit mid-frame
const START_LON = 4; // Europe centre-right at load, the Atlantic and US coast under the headline

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
};

// Screen-space placement of the globe, as fractions of the canvas size.
function layoutFor(width, height) {
  const aspect = width / height;
  if (aspect < 0.95) {
    return { cx: 0.5, cy: 1.42, r: 0.92, mobile: true, dots: 2.3, nodePx: 9, headPx: 18, ring: 0.03 };
  }
  return { cx: 0.68, cy: 1.34, r: 1.15, mobile: false, dots: 2.8, nodePx: 10, headPx: 26, ring: 0.04 };
}

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
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 40);
  const tilt = new Group();
  tilt.rotation.x = TILT;
  const spin = new Group();
  spin.rotation.y = -START_LON * DEG;
  tilt.add(spin);
  scene.add(tilt);

  // Shared uniforms
  const uTime = { value: 0 };
  const uPixelRatio = { value: 1 };
  const uRefDepth = { value: 3 };
  const uDotPx = { value: 3 };
  const uNodePx = { value: 9 };
  const uHeadPx = { value: 7 };
  const uSunDir = { value: SUN };

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
  const net = buildNetwork();
  const nodeCount = net.nodes.length;
  const nodeVec = net.nodes.map((n) => new Vector3(n.pos[0], n.pos[1], n.pos[2]));
  const nodeFacing = new Float32Array(nodeCount);

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
    if (l.backbone) return;
    const [start, count] = linkRanges[li];
    for (let k = 0; k < count; k++) linkBase[start + k] = 1;
  });
  linkGeo.setAttribute('aBase', new Float32BufferAttribute(linkBase, 1));
  const linkMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.linksVert,
      fragmentShader: GLSL.linksFrag,
      uniforms: {
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
    const SLICE = 40;
    for (let r0 = 1; r0 < rows; r0 += SLICE) {
      for (let ri = r0; ri < Math.min(rows, r0 + SLICE); ri++) {
        const lat = -Math.PI / 2 + (ri / rows) * Math.PI;
        const c = Math.cos(lat);
        const count = Math.max(1, Math.round((2 * Math.PI * c) / spacing));
        const offset = ri % 2 ? 0.5 : 0;
        for (let ci = 0; ci < count; ci++) {
          const lon = ((ci + offset) / count) * 2 * Math.PI - Math.PI;
          if (!mask.isLand(lat, lon)) continue;
          pos.push(c * Math.sin(lon), Math.sin(lat), c * Math.cos(lon));
          rand.push(Math.random());
        }
      }
      await yieldToMain();
      if (state.destroyed) return;
    }
    const geo = track(new BufferGeometry());
    geo.setAttribute('position', new Float32BufferAttribute(new Float32Array(pos), 3));
    geo.setAttribute('aRand', new Float32BufferAttribute(new Float32Array(rand), 1));
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
          uColor: { value: rgb(C.dot) },
          uHot: { value: rgb(C.dotHot) },
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
    const dpr = Math.min(window.devicePixelRatio || 1, layout.mobile ? 2 : 1.5);
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
      w[i] = net.nodes[i].weight * visible * (i === net.home ? 1.6 : 1);
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

  function openingBurst() {
    const home = net.home;
    net.adjacency[home].forEach((link, k) => {
      events.push({ at: 0.5 + k * 0.14, type: 'spawn', node: home, link, depth: 1 });
    });
  }

  // --- Frame loop ----------------------------------------------------------
  function render() {
    uTime.value = state.time;
    renderer.render(scene, camera);
  }

  function frame(nowMs) {
    if (state.destroyed) return;
    state.raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, Math.max(0, (nowMs - state.lastMs) / 1000));
    state.lastMs = nowMs;
    state.time += dt;

    spin.rotation.y += SPIN_RATE * dt;
    parallax.x += (parallax.tx - parallax.x) * Math.min(1, dt * 2.5);
    parallax.y += (parallax.ty - parallax.y) * Math.min(1, dt * 2.5);
    camera.position.x = parallax.x * 0.16;
    camera.position.y = parallax.y * 0.1;
    camera.lookAt(0, 0, 0);

    updateFacing();
    choreograph(dt);
    render();
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
    updateFacing();
    const lit = [net.home];
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
    render();
  }

  // --- Events --------------------------------------------------------------
  const onPointer = (e) => {
    parallax.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    parallax.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
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

  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reducedMotion && hasFinePointer) window.addEventListener('pointermove', onPointer, { passive: true });

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
      openingBurst();
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
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
