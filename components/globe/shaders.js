// GLSL for the neural globe. Colours are passed as raw sRGB vectors and the
// shaders write them straight to the framebuffer, so hex values in the scene
// file appear on screen as written.

// The opening reveal: a wavefront that spreads from home (Berlin) across the
// sphere. uFront is the front's angular radius in radians; it is parked far
// past PI once the reveal has finished.
const reveal = /* glsl */ `
  uniform vec3 uHome;
  uniform float uFront;
  float revealAngle(vec3 p) {
    return acos(clamp(dot(normalize(p), uHome), -1.0, 1.0));
  }
  float revealShown(float ang) {
    return 1.0 - smoothstep(uFront - 0.14, uFront, ang);
  }
  float revealCrest(float ang) {
    float k = (ang - uFront) / 0.05;
    return exp(-k * k);
  }
`;

export const surfaceVert = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vObj;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    vObj = position;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const baseFrag = /* glsl */ `
  uniform vec3 uNight;
  uniform vec3 uDay;
  uniform vec3 uRim;
  uniform vec3 uGrid;
  uniform vec3 uSunDir;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vObj;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float ndv = max(dot(n, v), 0.0);
    float diff = max(dot(n, uSunDir), 0.0);
    vec3 col = mix(uNight, uDay, diff * 0.85);
    float rim = pow(1.0 - ndv, 4.5);
    col += uRim * rim * (0.55 + 0.7 * diff);

    // Graticule every 15 degrees: hairlines sized with fwidth so they stay
    // one pixel wide at any zoom. Meridians thin out toward the poles and
    // skip the atan seam.
    vec3 p = normalize(vObj);
    float lat = asin(clamp(p.y, -1.0, 1.0));
    float lon = atan(p.x, p.z);
    vec2 g = vec2(lat, lon) * (12.0 / 3.14159265);
    vec2 w = fwidth(g);
    vec2 d = abs(fract(g + 0.5) - 0.5) / max(w, vec2(1e-4));
    float latLine = 1.0 - min(d.x, 1.0);
    float lonLine = (1.0 - min(d.y, 1.0)) * smoothstep(0.15, 0.45, cos(lat)) * step(w.y, 0.5);
    float grid = max(latLine, lonLine);
    col += uGrid * grid * (0.18 + 1.3 * rim);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const atmosphereFrag = /* glsl */ `
  uniform vec3 uGlow;
  uniform vec3 uEdge;
  uniform vec3 uSunDir;
  uniform float uLimb;      // -dot(n, v) at the planet's limb for this shell radius
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float f = clamp(-dot(n, v), 0.0, 1.0);
    float s = clamp(f / uLimb, 0.0, 1.0);
    float sun = 0.55 + 0.6 * max(dot(n, uSunDir), 0.0);
    float soft = pow(s, 2.4);
    float edge = pow(s, 11.0);
    vec3 col = (uGlow * soft * 0.9 + uEdge * edge * 0.8) * uIntensity * sun;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Aurora: thin shells over both polar ovals. A wavy lower edge,
// vertical curtain rays drifting along it, and brighter toward the limb
// where the curtains are seen side-on.
export const auroraFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vObj;
  void main() {
    vec3 p = normalize(vObj);
    float lat = abs(asin(clamp(p.y, -1.0, 1.0))); // both hemispheres
    float lon = atan(p.x, p.z);
    float edge = 1.2 + 0.05 * sin(lon * 3.0 + uTime * 0.11) + 0.025 * sin(lon * 7.0 - uTime * 0.17 + 1.3);
    float h = lat - edge;
    float band = smoothstep(-0.02, 0.004, h) * exp(-max(h, 0.0) / 0.055);
    float rays = 0.5 + 0.5 * sin(lon * 90.0 + 3.0 * sin(lon * 11.0 + uTime * 0.35) + uTime * 0.2);
    rays = rays * rays * rays;
    float drift = (0.35 + 0.65 * (0.5 + 0.5 * sin(lon * 2.0 - uTime * 0.09)))
                * (0.6 + 0.4 * sin(lon * 5.0 + uTime * 0.21));
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float ndv = max(dot(n, v), 0.0);
    float graze = 0.3 + 1.1 * (1.0 - ndv) * (1.0 - ndv);
    vec3 col = mix(uLow, uHigh, smoothstep(0.0, 0.09, h));
    float a = band * (0.3 + 0.7 * rays) * drift * graze * uIntensity;
    gl_FragColor = vec4(col * a, 1.0);
  }
`;

export const dotsVert = /* glsl */ `
  attribute float aRand;
  attribute float aCity;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uDotPx;
  uniform float uRefDepth;
  uniform float uRippleSpeed;
  uniform float uRippleLife;
  uniform vec4 uRipples[8];
  uniform vec3 uSunDir;
  uniform float uSweep;
  uniform vec4 uCursor;     // xyz: point under the pointer (unit sphere), w: strength
  varying float vAlpha;
  varying float vBoost;
  varying float vCity;
  ${reveal}
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * position);
    vec3 v = normalize(cameraPosition - wp.xyz);
    float facing = dot(n, v);
    vec4 mv = viewMatrix * wp;

    float boost = 0.0;
    for (int i = 0; i < 8; i++) {
      vec4 rp = uRipples[i];
      float age = uTime - rp.w;
      if (rp.w > 0.0 && age > 0.0 && age < uRippleLife) {
        float d = distance(position, rp.xyz);
        float r = age * uRippleSpeed;
        float band = 1.0 - smoothstep(0.0, 0.05 + age * 0.05, abs(d - r));
        float fade = 1.0 - age / uRippleLife;
        boost += band * fade * fade * 1.8;
      }
    }

    // Opening wavefront from home
    float ang = revealAngle(position);
    float shown = revealShown(ang);
    boost += revealCrest(ang) * 2.2;

    // A slow scan that sweeps the meridians, with a soft afterglow behind it
    float lon = atan(position.x, position.z);
    float lag = mod(uSweep - lon, 6.2831853);
    boost += exp(-lag * 6.0) * 0.5;

    // Pointer spotlight
    float cd = distance(position, uCursor.xyz);
    boost += uCursor.w * exp(-cd * cd / 0.0045) * 1.3;

    // City lights: stronger on the night side, flickering slightly
    float sunDot = dot(n, uSunDir);
    float night = 1.0 - smoothstep(-0.1, 0.45, sunDot);
    float flicker = 0.78 + 0.22 * sin(uTime * (1.8 + aRand * 3.0) + aRand * 60.0);
    vCity = aCity * (0.55 + 0.45 * night) * mix(1.0, flicker, aCity);

    float twinkle = 0.84 + 0.16 * sin(uTime * (0.5 + aRand * 0.8) + aRand * 40.0);
    float diff = 0.55 + 0.45 * max(sunDot, 0.0);
    vAlpha = smoothstep(-0.02, 0.3, facing) * twinkle * diff * shown;
    vBoost = boost;

    float size = uDotPx * (1.0 + 0.7 * min(boost, 1.0)) * (0.85 + 0.3 * aRand) * (1.0 + 0.55 * aCity);
    gl_PointSize = facing < -0.02 ? 0.0 : size * uPixelRatio * (uRefDepth / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dotsFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform vec3 uCity;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBoost;
  varying float vCity;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float disc = smoothstep(1.0, 0.55, d);
    float hot = min(vBoost, 1.0);
    vec3 col = mix(uColor, uCity, min(vCity * 1.3, 1.0));
    col = mix(col, uHot, hot);
    float alpha = disc * vAlpha * min(1.0, uOpacity * (1.0 + vBoost) + vCity * 0.9);
    gl_FragColor = vec4(col, alpha);
  }
`;

export const linksVert = /* glsl */ `
  attribute float aEnergy;
  attribute float aBase;
  varying float vAlpha;
  varying float vEnergy;
  varying float vBase;
  ${reveal}
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * normalize(position));
    vec3 v = normalize(cameraPosition - wp.xyz);
    vAlpha = smoothstep(0.0, 0.35, dot(n, v)) * revealShown(revealAngle(position));
    vEnergy = aEnergy;
    vBase = aBase;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const linksFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vEnergy;
  varying float vBase;
  void main() {
    float e = min(vEnergy, 1.0);
    vec3 col = mix(uColor, uHot, e);
    gl_FragColor = vec4(col, vAlpha * (uOpacity * vBase + e * 0.8));
  }
`;

export const nodesVert = /* glsl */ `
  attribute float aFire;
  attribute float aWeight;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uRefDepth;
  uniform float uNodePx;
  varying float vFlash;
  varying float vAlpha;
  ${reveal}
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * position);
    vec3 v = normalize(cameraPosition - wp.xyz);
    float facing = dot(n, v);
    float age = uTime - aFire;
    float ang = revealAngle(position);
    float flash = (aFire > 0.0 && age > 0.0) ? exp(-age * 2.6) : 0.0;
    flash = max(flash, revealCrest(ang));
    float breathe = 0.92 + 0.08 * sin(uTime * 1.7 + aWeight * 9.0);
    vFlash = flash;
    vAlpha = smoothstep(0.0, 0.25, facing) * revealShown(ang);
    vec4 mv = viewMatrix * wp;
    float size = uNodePx * (0.65 + 0.4 * aWeight) * (1.0 + 1.5 * flash) * breathe;
    gl_PointSize = size * uPixelRatio * (uRefDepth / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const nodesFrag = /* glsl */ `
  uniform vec3 uCore;
  uniform vec3 uHalo;
  uniform vec3 uFlash;
  varying float vFlash;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = smoothstep(0.34, 0.0, d);
    float halo = pow(max(1.0 - d, 0.0), 2.4) * 0.6;
    vec3 col = mix(uHalo, uCore, core);
    col = mix(col, uFlash, vFlash * 0.85);
    float a = (core + halo) * vAlpha * (1.0 + vFlash * 1.2);
    gl_FragColor = vec4(col, a);
  }
`;

export const ringsVert = /* glsl */ `
  attribute float aFire;
  uniform float uTime;
  uniform float uLife;
  uniform float uMaxScale;
  varying float vAlpha;
  varying float vR;
  void main() {
    float age = uTime - aFire;
    float live = (aFire > 0.0 && age > 0.0 && age < uLife) ? 1.0 : 0.0;
    float t = clamp(age / uLife, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 2.6);
    float scale = live * mix(0.12, 1.0, e) * uMaxScale;
    vAlpha = (1.0 - t) * (1.0 - t);
    vR = length(position.xy);
    vec4 wp = modelMatrix * instanceMatrix * vec4(position.xy * scale, 0.0, 1.0);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const ringsFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vR;
  void main() {
    float band = smoothstep(0.74, 0.86, vR) * smoothstep(1.0, 0.93, vR);
    gl_FragColor = vec4(uColor, band * vAlpha * 0.7);
  }
`;

export const pulsesVert = /* glsl */ `
  attribute vec3 aP0;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute float aOffset;
  attribute float aStart;
  attribute float aDuration;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uRefDepth;
  uniform float uHeadPx;
  uniform float uTrail;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float progress = (uTime - aStart) / aDuration;
    float t = progress - aOffset * uTrail;
    float visible = (aStart > 0.0 && t >= 0.0 && t <= 1.0) ? 1.0 : 0.0;
    float tt = clamp(t, 0.0, 1.0);
    vec3 p = mix(mix(aP0, aP1, tt), mix(aP1, aP2, tt), tt);
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = viewMatrix * wp;
    float tail = 1.0 - aOffset;
    float endFade = smoothstep(0.0, 0.05, tt) * smoothstep(1.0, 0.95, tt);
    vAlpha = visible * pow(tail, 1.25) * endFade;
    vMix = aOffset;
    float size = uHeadPx * (0.28 + 0.72 * pow(tail, 1.3)) * (0.9 + 0.2 * aSeed);
    gl_PointSize = visible * size * uPixelRatio * (uRefDepth / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const pulsesFrag = /* glsl */ `
  uniform vec3 uHead;
  uniform vec3 uTail;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float glow = pow(max(1.0 - d, 0.0), 1.4);
    float core = smoothstep(0.36, 0.0, d);
    vec3 col = mix(uHead, uTail, vMix);
    col = mix(col, vec3(1.0), core * (1.0 - vMix) * 0.7);
    gl_FragColor = vec4(col, (glow * 1.1 + core * 1.4) * vAlpha);
  }
`;

// Orbit tracks: faint dashes, lit up in a fading wake behind each satellite.
export const orbitsVert = /* glsl */ `
  attribute float aOrbit;
  attribute float aAng;
  varying float vOrbit;
  varying float vAng;
  void main() {
    vOrbit = aOrbit;
    vAng = aAng;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const orbitsFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform vec3 uSatA;       // angle of each orbit's first satellite
  uniform vec3 uSatB;       // ... and its second
  uniform float uOpacity;
  varying float vOrbit;
  varying float vAng;
  void main() {
    float a = vOrbit < 0.5 ? uSatA.x : (vOrbit < 1.5 ? uSatA.y : uSatA.z);
    float b = vOrbit < 0.5 ? uSatB.x : (vOrbit < 1.5 ? uSatB.y : uSatB.z);
    float lag = min(mod(a - vAng, 6.2831853), mod(b - vAng, 6.2831853));
    float wake = exp(-lag * 7.0);
    float dash = step(0.45, fract(vAng * 40.0));
    vec3 col = mix(uColor, uHot, wake);
    gl_FragColor = vec4(col, uOpacity * dash + wake * 0.32);
  }
`;

// Screen-sized sprites positioned on the CPU: satellites, their trails,
// downlink beams and meteors, all in one draw call.
export const spritesVert = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aGlint;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vGlint;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vGlint = aGlint;
    vColor = aColor;
    gl_PointSize = aAlpha > 0.001 ? aSize * uPixelRatio : 0.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const spritesFrag = /* glsl */ `
  varying float vAlpha;
  varying float vGlint;
  varying vec3 vColor;
  void main() {
    vec2 q = abs(gl_PointCoord - 0.5) * 2.0;
    float d = length(q);
    float glow = pow(max(1.0 - d, 0.0), 1.8);
    float core = smoothstep(0.28, 0.0, d);
    float cross = (exp(-q.x * 16.0) * exp(-q.y * 2.2) + exp(-q.y * 16.0) * exp(-q.x * 2.2)) * vGlint;
    vec3 col = mix(vColor, vec3(1.0), core * 0.6);
    gl_FragColor = vec4(col, (glow * 0.8 + core + cross) * vAlpha);
  }
`;

export const starsVert = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aTint;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vTint;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vAlpha = 0.6 + 0.4 * sin(uTime * (0.4 + aPhase * 0.6) + aPhase * 20.0);
    vTint = aTint;
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * mv;
  }
`;

export const starsFrag = /* glsl */ `
  uniform vec3 uWhite;
  uniform vec3 uBlue;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.25, d);
    gl_FragColor = vec4(mix(uWhite, uBlue, vTint), a * vAlpha * uOpacity);
  }
`;
