import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 50%;
    opacity: 0.35;
  }
`;

const toRad = (deg) => (deg * Math.PI) / 180;

// Simplified continent outlines as [lat, lon] polylines
const CONTINENTS = [
  // North America
  [
    [60,-140],[55,-130],[50,-127],[48,-124],[40,-124],[35,-121],[33,-118],
    [30,-115],[25,-110],[20,-105],[18,-97],[16,-90],[18,-88],[20,-87],
    [22,-85],[25,-82],[27,-80],[30,-82],[30,-85],[32,-85],[35,-77],[38,-76],
    [40,-74],[42,-70],[44,-67],[46,-64],[48,-60],[50,-58],[52,-56],[55,-60],
    [58,-62],[60,-65],[62,-72],[65,-80],[68,-90],[70,-100],[72,-110],[70,-130],
    [65,-140],[62,-148],[60,-150],[58,-155],[57,-160],[58,-165],[60,-165],
    [63,-165],[65,-168],[68,-165],[70,-160],[72,-155],[70,-140],[65,-140],[60,-140],
  ],
  // South America
  [
    [12,-72],[10,-76],[8,-77],[5,-77],[2,-80],[-2,-80],[-5,-81],[-8,-80],
    [-12,-77],[-15,-75],[-18,-71],[-22,-70],[-25,-70],[-28,-71],[-32,-72],
    [-38,-74],[-42,-75],[-46,-76],[-50,-74],[-53,-72],[-55,-69],[-55,-66],
    [-52,-60],[-48,-58],[-42,-55],[-38,-57],[-35,-55],[-30,-50],[-25,-48],
    [-22,-41],[-18,-39],[-15,-39],[-12,-37],[-8,-35],[-5,-35],[-2,-50],
    [0,-50],[3,-52],[5,-60],[8,-62],[10,-67],[12,-72],
  ],
  // Europe
  [
    [36,-6],[38,-9],[40,-9],[43,-9],[44,-2],[46,-2],[48,-5],[49,-2],
    [51,2],[52,5],[54,8],[56,8],[58,10],[60,5],[62,6],[65,12],
    [68,15],[70,20],[70,28],[68,28],[65,25],[62,22],[60,25],[58,22],
    [55,20],[54,14],[52,14],[50,14],[48,17],[46,15],[44,12],[42,14],
    [40,24],[38,24],[36,28],[35,25],[37,15],[38,12],[40,5],[38,0],
    [36,-6],
  ],
  // Africa
  [
    [35,-6],[37,10],[37,12],[33,12],[32,25],[30,33],[22,37],[15,42],
    [12,44],[10,42],[5,42],[0,42],[-5,40],[-10,40],[-15,40],[-18,37],
    [-22,35],[-26,33],[-30,31],[-34,26],[-35,20],[-34,18],[-30,15],
    [-25,15],[-20,12],[-15,12],[-10,14],[-5,12],[0,10],[5,5],[5,0],
    [5,-5],[8,-8],[10,-15],[12,-17],[15,-17],[20,-17],[22,-16],[25,-15],
    [28,-13],[30,-10],[33,-8],[35,-6],
  ],
  // Asia (simplified)
  [
    [42,28],[45,30],[42,42],[38,48],[30,48],[25,56],[20,60],[15,62],
    [10,65],[8,75],[10,78],[18,73],[20,72],[22,70],[24,68],[28,65],
    [30,68],[28,72],[24,78],[20,80],[15,80],[10,80],[8,78],[5,80],
    [2,100],[5,103],[1,104],[-2,106],[-6,107],[-8,114],[-5,120],
    [0,118],[5,118],[10,120],[12,108],[10,106],[15,108],[18,106],
    [22,108],[22,114],[28,120],[30,122],[35,128],[38,130],[40,132],
    [42,132],[45,142],[50,140],[52,143],[55,138],[58,135],[62,135],
    [65,140],[68,172],[70,180],[72,180],[75,140],[72,120],[70,100],
    [68,80],[65,75],[60,60],[55,55],[50,50],[48,42],[45,35],[42,28],
  ],
  // Australia
  [
    [-12,130],[-14,127],[-16,123],[-18,122],[-22,114],[-28,114],
    [-32,115],[-35,117],[-38,145],[-37,150],[-34,151],[-28,153],
    [-24,152],[-20,149],[-18,146],[-16,145],[-14,136],[-12,132],
    [-12,130],
  ],
];

// Major cities: [latitude, longitude, intensity (0-1), population-weight]
const CITIES = [
  [40.71,-74.01,1,3],[34.05,-118.24,0.9,2],[41.88,-87.63,0.8,2],
  [29.76,-95.37,0.7,1.5],[49.28,-123.12,0.6,1],[25.76,-80.19,0.7,1.5],
  [37.77,-122.42,0.8,1.5],[19.43,-99.13,0.8,2.5],
  [51.51,-0.13,1,3],[48.86,2.35,0.9,2.5],[52.52,13.40,0.85,2],
  [55.76,37.62,0.8,2.5],[41.39,2.17,0.7,1.5],[59.33,18.07,0.6,1],
  [40.42,-3.70,0.7,1.5],[41.90,12.50,0.7,1.5],[52.37,4.90,0.6,1],
  [35.68,139.69,1,3],[31.23,121.47,0.95,3],[22.32,114.17,0.85,2],
  [1.35,103.82,0.8,2],[37.57,126.98,0.8,2],[39.90,116.41,0.9,3],
  [28.61,77.21,0.85,3],[19.08,72.88,0.9,3],[13.76,100.50,0.7,2],
  [25.20,55.27,0.75,1.5],[35.69,51.39,0.6,2],
  [-23.55,-46.63,0.9,3],[-34.60,-58.38,0.7,2],[-22.91,-43.17,0.7,2],
  [4.71,-74.07,0.6,1.5],[-12.05,-77.04,0.6,1.5],
  [30.04,31.24,0.7,2],[-33.93,18.42,0.6,1],[6.52,3.38,0.7,2],
  [-33.87,151.21,0.8,1.5],[-37.81,144.96,0.7,1.5],
  [33.45,-112.07,0.5,1],[45.50,-73.57,0.6,1],[47.61,-122.33,0.6,1],
  [48.21,16.37,0.6,1],[50.08,14.44,0.5,1],[53.55,9.99,0.5,1],
  [24.47,54.37,0.5,1],[-1.29,36.82,0.5,1],[33.59,-7.59,0.5,1],
  [14.60,120.98,0.6,2],[-6.21,106.85,0.7,2],[23.81,90.41,0.6,2],
  [13.08,80.27,0.6,2],[31.55,74.35,0.6,2],
];

const project = (lat, lon, cx, cy, r, rot) => {
  const phi = toRad(90 - lat);
  const theta = toRad(lon) + rot;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);
  if (z < -r * 0.1) return null; // hide backside with slight tolerance
  return { x: cx + x, y: cy - y, z, depth: (z + r) / (2 * r) };
};

// Read CSS variable value from the document
const getCSSVar = (name) => {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

const GlobeAnimation = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rotation = 0;
    const startTime = Date.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const elapsed = (Date.now() - startTime) / 1000;

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.52;
      const cy = h * 0.48;
      const r = Math.min(w, h) * 0.38;
      rotation = elapsed * 0.06;

      // Read theme colors from CSS variables
      const sphereInner = getCSSVar('--globe-sphere-inner') || 'rgba(25, 30, 50, 0.9)';
      const sphereMid = getCSSVar('--globe-sphere-mid') || 'rgba(12, 15, 30, 0.85)';
      const sphereOuter = getCSSVar('--globe-sphere-outer') || 'rgba(5, 5, 15, 0.8)';
      const gridColor = getCSSVar('--globe-grid') || 'rgba(99, 102, 241, 0.06)';
      const landFill = getCSSVar('--globe-land-fill') || 'rgba(99, 102, 241, 0.07)';
      const landStroke = getCSSVar('--globe-land-stroke') || 'rgba(130, 140, 255, 0.2)';
      const accentColor = getCSSVar('--accent') || '#6366f1';

      // Determine if light theme based on bg color
      const bgColor = getCSSVar('--bg') || '#0a0a0a';
      const isLight = bgColor.startsWith('#f') || bgColor.startsWith('#e') || bgColor.startsWith('rgb(2');

      // === GLOBE BODY (sphere with subtle fill) ===
      const sphereGrad = ctx.createRadialGradient(
        cx - r * 0.25, cy - r * 0.2, r * 0.05,
        cx, cy, r
      );
      sphereGrad.addColorStop(0, sphereInner);
      sphereGrad.addColorStop(0.6, sphereMid);
      sphereGrad.addColorStop(1, sphereOuter);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // === ATMOSPHERE EDGE GLOW ===
      const atmosAlpha = isLight ? 0.08 : 0.06;
      const atmosPeakAlpha = isLight ? 0.14 : 0.1;
      const atmosGrad = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.12);
      atmosGrad.addColorStop(0, `rgba(80, 120, 255, 0)`);
      atmosGrad.addColorStop(0.3, `rgba(80, 120, 255, ${atmosAlpha})`);
      atmosGrad.addColorStop(0.6, `rgba(99, 102, 241, ${atmosPeakAlpha})`);
      atmosGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = atmosGrad;
      ctx.fill();

      // Clip to globe for all internal drawing
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // === GRID LINES (latitude) ===
      for (let lat = -75; lat <= 75; lat += 15) {
        const points = [];
        for (let lon = -180; lon <= 180; lon += 2) {
          const p = project(lat, lon, cx, cy, r, rotation);
          if (p) points.push(p);
        }
        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            if (Math.abs(points[i].x - points[i - 1].x) < r * 0.3) {
              ctx.lineTo(points[i].x, points[i].y);
            } else {
              ctx.moveTo(points[i].x, points[i].y);
            }
          }
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // === GRID LINES (longitude) ===
      for (let lon = -180; lon < 180; lon += 15) {
        const points = [];
        for (let lat = -90; lat <= 90; lat += 2) {
          const p = project(lat, lon, cx, cy, r, rotation);
          if (p) points.push(p);
        }
        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // === CONTINENT OUTLINES ===
      CONTINENTS.forEach((coastline) => {
        const projected = coastline.map(([lat, lon]) =>
          project(lat, lon, cx, cy, r, rotation)
        );

        // Draw filled land masses
        ctx.beginPath();
        let started = false;
        let prevP = null;
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          if (!p) { started = false; prevP = null; continue; }
          if (prevP && Math.abs(p.x - prevP.x) > r * 0.5) {
            started = false;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
          prevP = p;
        }
        ctx.closePath();
        ctx.fillStyle = landFill;
        ctx.fill();
        ctx.strokeStyle = landStroke;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // === CITY NODES ===
      const visibleCities = [];
      CITIES.forEach((city, i) => {
        const [lat, lon, intensity, weight] = city;
        const p = project(lat, lon, cx, cy, r, rotation);
        if (!p) return;
        visibleCities.push({ ...p, intensity, weight, index: i });
      });

      visibleCities.sort((a, b) => a.depth - b.depth);

      // Connection arcs between nearby large cities
      const arcAlpha = isLight ? 0.12 : 0.08;
      for (let i = 0; i < visibleCities.length; i++) {
        for (let j = i + 1; j < visibleCities.length; j++) {
          const a = visibleCities[i];
          const b = visibleCities[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < r * 0.4 && a.intensity > 0.7 && b.intensity > 0.7) {
            const alpha = Math.max(0, (1 - dist / (r * 0.4))) * arcAlpha * a.depth * b.depth;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2 - dist * 0.12;
            ctx.quadraticCurveTo(midX, midY, b.x, b.y);
            ctx.strokeStyle = isLight
              ? `rgba(79, 70, 229, ${alpha})`
              : `rgba(140, 160, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw city lights
      visibleCities.forEach((city) => {
        const { x, y, depth, intensity, weight, index } = city;
        const pulse = 0.6 + 0.4 * Math.sin(elapsed * 2 + index * 1.3);
        const alpha = depth * intensity * pulse;
        const baseSize = 1 + weight * 1.2;
        const size = baseSize * (0.4 + depth * 0.6);

        if (isLight) {
          // Light theme: use accent-colored dots
          const glowR = size * 6;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
          glow.addColorStop(0, `rgba(79, 70, 229, ${alpha * 0.25})`);
          glow.addColorStop(0.3, `rgba(79, 70, 229, ${alpha * 0.1})`);
          glow.addColorStop(1, 'rgba(79, 70, 229, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(79, 70, 229, ${alpha * 0.9})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(79, 70, 229, ${alpha * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Dark theme: warm city lights
          const glowR = size * 6;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
          glow.addColorStop(0, `rgba(255, 200, 100, ${alpha * 0.2})`);
          glow.addColorStop(0.3, `rgba(255, 180, 80, ${alpha * 0.08})`);
          glow.addColorStop(1, 'rgba(255, 180, 80, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 240, 220, ${alpha * 0.95})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 220, 150, ${alpha * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      ctx.restore(); // Unclip

      // === OUTER ATMOSPHERE (unclipped, on top) ===
      const outerGlowAlpha = isLight ? 0.06 : 0.04;
      const outerPeakAlpha = isLight ? 0.1 : 0.06;
      const outerGlow = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.2);
      outerGlow.addColorStop(0, 'rgba(60, 80, 220, 0)');
      outerGlow.addColorStop(0.4, `rgba(80, 100, 241, ${outerGlowAlpha})`);
      outerGlow.addColorStop(0.7, `rgba(99, 102, 241, ${outerPeakAlpha})`);
      outerGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Specular highlight (top-left light source)
      const specAlpha = isLight ? 0.1 : 0.06;
      const specMidAlpha = isLight ? 0.04 : 0.02;
      const specGrad = ctx.createRadialGradient(
        cx - r * 0.35, cy - r * 0.35, 0,
        cx - r * 0.35, cy - r * 0.35, r * 0.8
      );
      specGrad.addColorStop(0, `rgba(150, 170, 255, ${specAlpha})`);
      specGrad.addColorStop(0.3, `rgba(100, 120, 200, ${specMidAlpha})`);
      specGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = specGrad;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default GlobeAnimation;
