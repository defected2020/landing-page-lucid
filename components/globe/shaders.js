// GLSL for the neural globe. Colours are passed as raw sRGB vectors and the
// shaders write them straight to the framebuffer, so hex values in the scene
// file appear on screen as written.

export const surfaceVert = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const baseFrag = /* glsl */ `
  uniform vec3 uNight;
  uniform vec3 uDay;
  uniform vec3 uRim;
  uniform vec3 uSunDir;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float ndv = max(dot(n, v), 0.0);
    float diff = max(dot(n, uSunDir), 0.0);
    vec3 col = mix(uNight, uDay, diff * 0.85);
    float rim = pow(1.0 - ndv, 4.5);
    col += uRim * rim * (0.55 + 0.7 * diff);
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

export const dotsVert = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uDotPx;
  uniform float uRefDepth;
  uniform float uRippleSpeed;
  uniform float uRippleLife;
  uniform vec4 uRipples[8];
  uniform vec3 uSunDir;
  varying float vAlpha;
  varying float vBoost;
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

    float twinkle = 0.84 + 0.16 * sin(uTime * (0.5 + aRand * 0.8) + aRand * 40.0);
    float diff = 0.55 + 0.45 * max(dot(n, uSunDir), 0.0);
    vAlpha = smoothstep(-0.02, 0.3, facing) * twinkle * diff;
    vBoost = boost;

    float size = uDotPx * (1.0 + 0.7 * min(boost, 1.0)) * (0.85 + 0.3 * aRand);
    gl_PointSize = facing < -0.02 ? 0.0 : size * uPixelRatio * (uRefDepth / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dotsFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBoost;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float disc = smoothstep(1.0, 0.55, d);
    float hot = min(vBoost, 1.0);
    vec3 col = mix(uColor, uHot, hot);
    float alpha = disc * vAlpha * min(1.0, uOpacity * (1.0 + vBoost));
    gl_FragColor = vec4(col, alpha);
  }
`;

export const linksVert = /* glsl */ `
  attribute float aEnergy;
  attribute float aBase;
  varying float vAlpha;
  varying float vEnergy;
  varying float vBase;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * normalize(position));
    vec3 v = normalize(cameraPosition - wp.xyz);
    vAlpha = smoothstep(0.0, 0.35, dot(n, v));
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
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * position);
    vec3 v = normalize(cameraPosition - wp.xyz);
    float facing = dot(n, v);
    float age = uTime - aFire;
    float flash = (aFire > 0.0 && age > 0.0) ? exp(-age * 2.6) : 0.0;
    float breathe = 0.92 + 0.08 * sin(uTime * 1.7 + aWeight * 9.0);
    vFlash = flash;
    vAlpha = smoothstep(0.0, 0.25, facing);
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
