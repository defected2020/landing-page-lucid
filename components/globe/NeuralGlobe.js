import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

// The hero's living planet. Server-renders a CSS poster (also the fallback
// when WebGL is unavailable), then loads the three.js scene on the client
// and fades the canvas in over it.
const NeuralGlobe = ({ className }) => {
  const canvasRef = useRef(null);
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

    import('./globe-scene')
      .then(({ createGlobeScene }) => {
        if (cancelled) return;
        scene = createGlobeScene(canvas, { reducedMotion });
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

    return () => {
      cancelled = true;
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
          'absolute inset-0 block h-full w-full transition-opacity duration-[1600ms] ease-out',
          ready ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
};

export default NeuralGlobe;
