import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

// The hero's living planet. Server-renders a CSS poster (also the fallback
// when WebGL is unavailable), then loads the three.js scene on the client
// and fades the canvas in over it.
const NeuralGlobe = ({ className }) => {
  const canvasRef = useRef(null);
  const hqRef = useRef(null);
  const tipRef = useRef(null);
  const tipNameRef = useRef(null);
  const tipMetaRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let scene = null;
    let cancelled = false;
    let inView = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const syncActive = () => {
      if (scene) scene.setActive(inView && document.visibilityState === 'visible');
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncActive();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);
    document.addEventListener('visibilitychange', syncActive);

    // Let hydration and the first paint finish before the scene's chunk is
    // even requested; the poster carries the hero until then.
    const whenIdle = (fn) =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(fn, { timeout: 2500 })
        : window.setTimeout(fn, 600);
    const cancelIdle = (id) =>
      typeof window.cancelIdleCallback === 'function' ? window.cancelIdleCallback(id) : window.clearTimeout(id);

    const idleId = whenIdle(() => {
      if (cancelled) return;
      import('./globe-scene')
      .then(({ createGlobeScene }) => {
        if (cancelled) return;
        scene = createGlobeScene(canvas, {
          reducedMotion,
          labels: {
            hq: hqRef.current,
            tip: tipRef.current,
            tipName: tipNameRef.current,
            tipMeta: tipMetaRef.current,
          },
        });
        syncActive();
        return scene.ready.then(() => {
          if (!cancelled) setReady(true);
        });
      })
      .catch((err) => {
        // No WebGL (or a shader failure): the poster stays.
        // eslint-disable-next-line no-console
        console.warn('Neural globe unavailable, keeping the poster.', err);
      });
    });

    return () => {
      cancelled = true;
      cancelIdle(idleId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncActive);
      if (scene) scene.destroy();
    };
  }, []);

  return (
    <div className={cn('globe-poster absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={cn(
          'absolute inset-0 block h-full w-full transition-opacity [transition-duration:900ms] ease-out',
          ready ? 'opacity-100' : 'opacity-0'
        )}
      />
      {/* Labels pinned to cities by the scene: home, and whichever city the
          pointer is over. Positioned with transforms only. */}
      <div ref={hqRef} className="globe-label" style={{ opacity: 0 }}>
        <span className="globe-label__stem" />
        <span className="globe-label__tag">
          <span className="globe-label__pulse" />
          Berlin <span className="globe-label__meta">HQ</span>
        </span>
      </div>
      <div ref={tipRef} className="globe-label" style={{ opacity: 0 }}>
        <span className="globe-label__stem" />
        <span className="globe-label__tag">
          <span ref={tipNameRef} />
          <span ref={tipMetaRef} className="globe-label__meta" />
        </span>
      </div>
    </div>
  );
};

export default NeuralGlobe;
