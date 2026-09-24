import {
  AdditiveBlending,
  BufferGeometry,
  DynamicDrawUsage,
  Float32BufferAttribute,
  LineSegments,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';
import * as GLSL from './shaders';

// Everything above the surface that moves on its own clock: satellites on
// fixed orbits (they do not spin with the planet), the downlink beams they
// drop onto cities they pass over, and the occasional meteor.

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;

// r: orbit radius (planet = 1), incl / node in degrees, speed in rad/s,
// phases: one per satellite on that orbit. The planes are chosen to cross
// the visible cap of the planet rather than hide behind it.
const ORBITS = [
  { r: 1.055, incl: 78, node: 72, speed: 0.13, phases: [0.4, 3.5] },
  { r: 1.09, incl: 52, node: 18, speed: 0.1, phases: [2.2, 5.3] },
  { r: 1.13, incl: 104, node: 118, speed: 0.08, phases: [4.1, 1.0] },
];
const ORBIT_SEGMENTS = 256;
const TRAIL_PTS = 22;
const TRAIL_SPAN = 0.14; // radians of orbit the trail covers
const BEAM_PTS = 18;
const BEAM_LIFE = 1.8;
const BEAM_HIT = 0.45; // seconds into a beam when the city fires
const BEAM_COOLDOWN = 5;
const METEOR_PTS = 26;
const METEOR_Z = -9;

const hex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function createSky({ parent, scene, uPixelRatio, colors, track, ctx }) {
  // Orbit frames: the equatorial circle tipped by the inclination about x,
  // then turned to its ascending node about y.
  const X = new Vector3(1, 0, 0);
  const Y = new Vector3(0, 1, 0);
  const orbits = ORBITS.map((o) => {
    const u = new Vector3(1, 0, 0).applyAxisAngle(X, o.incl * DEG).applyAxisAngle(Y, o.node * DEG);
    const v = new Vector3(0, 0, -1).applyAxisAngle(X, o.incl * DEG).applyAxisAngle(Y, o.node * DEG);
    return { ...o, u, v };
  });
  const sats = [];
  orbits.forEach((o, oi) =>
    o.phases.forEach((phase) =>
      sats.push({ orbit: o, oi, phase, angle: phase, nextCheck: 0, coolUntil: 2 + Math.random() * 4 })
    )
  );
  const byOrbit = orbits.map((_, oi) => sats.filter((sat) => sat.oi === oi));
  const orbitPoint = (o, a, out) =>
    out.copy(o.u).multiplyScalar(Math.cos(a)).addScaledVector(o.v, Math.sin(a)).multiplyScalar(o.r);

  // --- Orbit tracks --------------------------------------------------------
  const trackPos = [];
  const trackOrbit = [];
  const trackAng = [];
  const p = new Vector3();
  orbits.forEach((o, oi) => {
    for (let s = 0; s < ORBIT_SEGMENTS; s++) {
      for (const a of [(s / ORBIT_SEGMENTS) * TAU, ((s + 1) / ORBIT_SEGMENTS) * TAU]) {
        orbitPoint(o, a, p);
        trackPos.push(p.x, p.y, p.z);
        trackOrbit.push(oi);
        trackAng.push(a);
      }
    }
  });
  const trackGeo = track(new BufferGeometry());
  trackGeo.setAttribute('position', new Float32BufferAttribute(trackPos, 3));
  trackGeo.setAttribute('aOrbit', new Float32BufferAttribute(trackOrbit, 1));
  trackGeo.setAttribute('aAng', new Float32BufferAttribute(trackAng, 1));
  const uSatA = { value: new Vector3() };
  const uSatB = { value: new Vector3() };
  const trackMat = track(
    new ShaderMaterial({
      vertexShader: GLSL.orbitsVert,
      fragmentShader: GLSL.orbitsFrag,
      uniforms: {
        uColor: { value: new Vector3(...hex(colors.orbit)) },
        uHot: { value: new Vector3(...hex(colors.orbitHot)) },
        uSatA,
        uSatB,
        uOpacity: { value: 0.07 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  const tracks = new LineSegments(trackGeo, trackMat);
  tracks.frustumCulled = false;
  tracks.renderOrder = 2;
  parent.add(tracks);

  // --- Sprites: satellites + trails, beams, meteor -------------------------
  const satBase = 0;
  const satCount = sats.length * (1 + TRAIL_PTS);
  const beamBase = satCount;
  const beamCount = sats.length * BEAM_PTS;
  const meteorBase = beamBase + beamCount;
  const total = meteorBase + METEOR_PTS;

  const pos = new Float32Array(total * 3);
  const size = new Float32Array(total);
  const alpha = new Float32Array(total);
  const glint = new Float32Array(total);
  const color = new Float32Array(total * 3);
  const setColor = (i, c) => {
    color[i * 3] = c[0];
    color[i * 3 + 1] = c[1];
    color[i * 3 + 2] = c[2];
  };
  const cSat = hex(colors.sat);
  const cTrail = hex(colors.satTrail);
  const cBeam = hex(colors.beam);
  const cMeteor = hex(colors.meteor);
  for (let i = 0; i < total; i++) {
    if (i < beamBase) {
      const head = (i - satBase) % (1 + TRAIL_PTS) === 0;
      setColor(i, head ? cSat : cTrail);
      glint[i] = head ? 1 : 0;
    } else if (i < meteorBase) {
      setColor(i, cBeam);
    } else {
      setColor(i, cMeteor);
      glint[i] = i === meteorBase ? 0.5 : 0;
    }
  }
  const geo = track(new BufferGeometry());
  const posAttr = new Float32BufferAttribute(pos, 3).setUsage(DynamicDrawUsage);
  const sizeAttr = new Float32BufferAttribute(size, 1).setUsage(DynamicDrawUsage);
  const alphaAttr = new Float32BufferAttribute(alpha, 1).setUsage(DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('aSize', sizeAttr);
  geo.setAttribute('aAlpha', alphaAttr);
  geo.setAttribute('aGlint', new Float32BufferAttribute(glint, 1));
  geo.setAttribute('aColor', new Float32BufferAttribute(color, 3));
  const mat = track(
    new ShaderMaterial({
      vertexShader: GLSL.spritesVert,
      fragmentShader: GLSL.spritesFrag,
      uniforms: { uPixelRatio },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  const sprites = new Points(geo, mat);
  sprites.frustumCulled = false;
  sprites.renderOrder = 5;
  scene.add(sprites);

  const put = (i, v, s, a) => {
    pos[i * 3] = v.x;
    pos[i * 3 + 1] = v.y;
    pos[i * 3 + 2] = v.z;
    size[i] = s;
    alpha[i] = a;
  };

  const beams = sats.map(() => ({ start: -1, node: -1, hit: false }));
  const meteor = { start: -1, dur: 1, a: new Vector3(), b: new Vector3(), next: 6 + Math.random() * 6 };

  const head = new Vector3();
  const tmp = new Vector3();
  const nodeW = new Vector3();
  const satW = sats.map(() => new Vector3());

  function launchMeteor(time) {
    const fx = 0.08 + Math.random() * 0.6;
    const fy = 0.03 + Math.random() * 0.22;
    const dir = (Math.random() < 0.5 ? 200 : 335) * DEG + (Math.random() - 0.5) * 16 * DEG;
    const len = 0.16 + Math.random() * 0.14;
    ctx.screenToWorld(fx, fy, METEOR_Z, meteor.a);
    ctx.screenToWorld(fx + Math.cos(dir) * len, fy - Math.sin(dir) * len, METEOR_Z, meteor.b);
    meteor.start = time;
    meteor.dur = 0.75 + Math.random() * 0.35;
    meteor.next = time + 9 + Math.random() * 10;
  }

  function update(time, { motion = true } = {}) {
    const scale = ctx.spriteScale();
    const world = parent.matrixWorld;

    // Satellites and their trails
    sats.forEach((sat, si) => {
      const o = sat.orbit;
      sat.angle = sat.phase + o.speed * time;
      const base = satBase + si * (1 + TRAIL_PTS);
      orbitPoint(o, sat.angle, head);
      satW[si].copy(head).applyMatrix4(world);
      put(base, satW[si], 16 * scale, 1);
      for (let k = 1; k <= TRAIL_PTS; k++) {
        const f = k / TRAIL_PTS;
        orbitPoint(o, sat.angle - f * TRAIL_SPAN, tmp).applyMatrix4(world);
        put(base + k, tmp, (4.2 * (1 - f) + 1.4) * scale, Math.pow(1 - f, 1.6) * 0.6);
      }

      // Look for a city below to beam down to
      if (motion && time >= sat.nextCheck && time >= sat.coolUntil && beams[si].start < 0) {
        sat.nextCheck = time + 0.3;
        const node = ctx.findNodeBelow(tmp.copy(head).normalize());
        if (node >= 0) {
          beams[si] = { start: time, node, hit: false };
          sat.coolUntil = time + BEAM_LIFE + BEAM_COOLDOWN + Math.random() * 4;
        }
      }
    });
    // Orbit wakes: the first and second satellite of each orbit
    const wrapped = (a) => ((a % TAU) + TAU) % TAU;
    const firstOn = (oi, n) => byOrbit[oi][n];
    uSatA.value.set(wrapped(firstOn(0, 0).angle), wrapped(firstOn(1, 0).angle), wrapped(firstOn(2, 0).angle));
    uSatB.value.set(wrapped(firstOn(0, 1).angle), wrapped(firstOn(1, 1).angle), wrapped(firstOn(2, 1).angle));

    // Downlink beams: a stream of sparks falling from satellite to city
    beams.forEach((b, si) => {
      const base = beamBase + si * BEAM_PTS;
      const age = time - b.start;
      if (b.start < 0 || age > BEAM_LIFE) {
        b.start = -1;
        for (let k = 0; k < BEAM_PTS; k++) alpha[base + k] = 0;
        return;
      }
      if (!b.hit && age >= BEAM_HIT) {
        b.hit = true;
        ctx.onDownlink(b.node);
      }
      ctx.nodeWorld(b.node, nodeW);
      const env = Math.min(1, age / 0.15) * (1 - Math.max(0, (age - (BEAM_LIFE - 0.6)) / 0.6));
      for (let k = 0; k < BEAM_PTS; k++) {
        const f = (k / BEAM_PTS + age * 1.3) % 1;
        tmp.copy(satW[si]).lerp(nodeW, f);
        put(base + k, tmp, (3.2 + 2.2 * f) * scale, env * Math.sqrt(Math.sin(Math.PI * f)) * 0.85);
      }
    });

    // Meteor
    if (motion && time >= meteor.next) launchMeteor(time);
    const mp = meteor.start < 0 ? 2 : (time - meteor.start) / meteor.dur;
    for (let k = 0; k < METEOR_PTS; k++) {
      const i = meteorBase + k;
      if (mp > 1.4) {
        alpha[i] = 0;
        continue;
      }
      const f = k / METEOR_PTS;
      const t = mp - f * 0.35;
      if (t < 0 || t > 1) {
        alpha[i] = 0;
        continue;
      }
      const eased = 1 - (1 - t) * (1 - t);
      tmp.copy(meteor.a).lerp(meteor.b, eased);
      const fade = Math.pow(Math.sin(Math.PI * Math.min(1, mp)), 0.7);
      put(i, tmp, (3.6 * (1 - f) + 0.8) * scale, Math.pow(1 - f, 1.5) * fade * 0.8);
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  }

  return { update };
}
