import React, { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import { ChevronsLeftRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import NeuralGlobe from './globe/NeuralGlobe';

const STATIC_LINE = 'We Build Software';
const ROTATING_PHRASES = [
  'That Matters',
  'That Counts',
  'That Uplifts',
  'That Scales',
  'That Lasts',
  'That Transforms',
  'That Changes the World',
];
const TYPE_SPEED = 45;
const DELETE_SPEED = 20;
const PAUSE_AFTER_TYPE = 2400;
const PAUSE_AFTER_DELETE = 300;
// The page opens on the complete first headline (it is in the server HTML,
// so it is the Largest Contentful Paint the moment the page renders); the
// typewriter then cycles through the other phrases.
const INITIAL_HOLD = 3200;

const Hero = () => {
  const { isDark } = useTheme();
  const onImage = !isDark;
  const [phase, setPhase] = useState('hold');
  const [phraseText, setPhraseText] = useState(ROTATING_PHRASES[0]);
  const [phraseIdx, setPhraseIdx] = useState(0);

  const currentPhrase = ROTATING_PHRASES[phraseIdx];

  const tick = useCallback(() => {
    switch (phase) {
      case 'typing': {
        if (phraseText.length < currentPhrase.length) {
          setPhraseText(currentPhrase.slice(0, phraseText.length + 1));
        } else {
          setPhase('pausing');
        }
        break;
      }
      case 'deleting': {
        if (phraseText.length > 0) {
          setPhraseText(phraseText.slice(0, -1));
        } else {
          setPhraseIdx((prev) => (prev + 1) % ROTATING_PHRASES.length);
          setPhase('pause-deleted');
        }
        break;
      }
      default:
        break;
    }
  }, [phase, phraseText, currentPhrase]);

  useEffect(() => {
    const delays = {
      hold: INITIAL_HOLD,
      pausing: PAUSE_AFTER_TYPE,
      'pause-deleted': PAUSE_AFTER_DELETE,
      typing: TYPE_SPEED,
      deleting: DELETE_SPEED,
    };
    const t = setTimeout(() => {
      if (phase === 'hold' || phase === 'pausing') setPhase('deleting');
      else if (phase === 'pause-deleted') setPhase('typing');
      else tick();
    }, delays[phase]);
    return () => clearTimeout(t);
  }, [phase, tick]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#06070f]"
    >
      <NeuralGlobe className="z-0" />

      {/* Veils: settle the space under the navbar and keep the copy legible
          over the planet without dimming the whole scene. */}
      <div className="hero-veil pointer-events-none absolute inset-0 z-[1]" />

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20256%20256%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noise%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.9%27%20numOctaves%3D%274%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23noise%29%27%2F%3E%3C%2Fsvg%3E')] bg-[length:256px_256px] bg-repeat opacity-[0.04]" />

      <div className="relative z-[3] mx-auto flex min-h-screen w-full max-w-container items-center px-container">
        <div className="max-w-[620px] py-24 max-md:max-w-full max-md:text-center">
          <m.div
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <Badge variant={onImage ? 'onImage' : 'default'}>
              <ChevronsLeftRight />
              Design · Develop · Deploy
            </Badge>
          </m.div>

          <h1
            className={cn(
              'mb-6 min-h-[2.2em] text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.1] tracking-[-0.03em]',
              onImage ? 'text-white' : 'text-text'
            )}
          >
            {STATIC_LINE}
            <br />
            {phraseText}
            <m.span
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="ml-1 inline-block h-[0.85em] w-[3px] rounded-sm bg-accent align-baseline"
            />
          </h1>

          {/* Names the studio in full rather than opening with a slogan. This is
              the first prose an AI search crawler reads, and "Lucid Code Labs"
              has to be separable from Lucid Labs GmbH, an unrelated Berlin AI
              agency. Keep the first sentence self-contained and quotable; see
              GEO-ANALYSIS.md. */}
          <m.p
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              'mb-10 max-w-[540px] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.7] max-md:mx-auto',
              onImage ? 'text-white/80' : 'text-text-muted'
            )}
          >
            Lucid Code Labs is a founder-led software studio in Berlin, building
            AI-powered platforms, web applications and mobile apps for clients
            worldwide. The people you meet are the people who write the code.
          </m.p>

          <m.div
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex gap-4 max-md:justify-center max-[480px]:flex-col max-[480px]:items-center"
          >
            <Button asChild>
              <a href="#contact">Get Started</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className={cn(
                onImage &&
                  'border-white/25 bg-transparent text-white/85 hover:border-white/50 hover:bg-white/10 hover:text-white'
              )}
            >
              <a href="/services">Explore Services</a>
            </Button>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
