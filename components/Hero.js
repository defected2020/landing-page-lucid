import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

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
const INITIAL_DELAY = 600;

const Hero = () => {
  const { isDark } = useTheme();
  const onImage = !isDark;
  const [phase, setPhase] = useState('idle');
  const [staticText, setStaticText] = useState('');
  const [phraseText, setPhraseText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const currentPhrase = ROTATING_PHRASES[phraseIdx];

  const tick = useCallback(() => {
    switch (phase) {
      case 'typing-static': {
        if (staticText.length < STATIC_LINE.length) {
          setStaticText(STATIC_LINE.slice(0, staticText.length + 1));
        } else {
          setPhase('typing-phrase');
        }
        break;
      }
      case 'typing-phrase': {
        if (phraseText.length < currentPhrase.length) {
          setPhraseText(currentPhrase.slice(0, phraseText.length + 1));
        } else {
          setShowContent(true);
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
  }, [phase, staticText, phraseText, currentPhrase]);

  useEffect(() => {
    if (phase === 'idle') return;
    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    }
    if (phase === 'pause-deleted') {
      const t = setTimeout(() => setPhase('typing-phrase'), PAUSE_AFTER_DELETE);
      return () => clearTimeout(t);
    }
    if (phase === 'typing-static' || phase === 'typing-phrase') {
      const t = setTimeout(tick, TYPE_SPEED);
      return () => clearTimeout(t);
    }
    if (phase === 'deleting') {
      const t = setTimeout(tick, DELETE_SPEED);
      return () => clearTimeout(t);
    }
  }, [phase, tick]);

  useEffect(() => {
    const t = setTimeout(() => setPhase('typing-static'), INITIAL_DELAY);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-bg"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b0d1a] from-0% via-[#0b0d1a] via-[18%] to-transparent to-[40%] after:absolute after:inset-0 after:z-[1] after:bg-gradient-to-r after:from-[rgba(11,13,26,0.5)] after:from-0% after:to-transparent after:to-[50%] after:content-['']">
        <Image
          src="/images/stock/earth-day.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%]"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20256%20256%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27noise%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.9%27%20numOctaves%3D%274%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23noise%29%27%2F%3E%3C%2Fsvg%3E')] bg-[length:256px_256px] bg-repeat opacity-[0.04]" />

      <div className="relative z-[3] mx-auto flex min-h-screen w-full max-w-container items-center px-container">
        <div className="max-w-[620px] py-24 max-md:max-w-full max-md:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-block"
          >
            <Badge variant={onImage ? 'onImage' : 'default'}>
              <ChevronsLeftRight />
              Design · Develop · Deploy
            </Badge>
          </motion.div>

          <h1
            className={cn(
              'mb-6 min-h-[2.2em] text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.1] tracking-[-0.03em]',
              onImage ? 'text-white' : 'text-text'
            )}
          >
            {/* The typewriter starts from an empty string, so the animated spans
                render as an empty <h1> on the server. This carries the real
                headline in the markup for crawlers and screen readers, while the
                visible text below animates to exactly the same words. */}
            <span className="sr-only">{`${STATIC_LINE} ${ROTATING_PHRASES[0]}`}</span>
            <span aria-hidden="true">
              {staticText}
              {staticText.length === STATIC_LINE.length && phraseText && (
                <>
                  <br />
                  {phraseText}
                </>
              )}
              <motion.span
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="ml-1 inline-block h-[0.85em] w-[3px] rounded-sm bg-accent align-baseline"
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={cn(
              'mb-10 max-w-[540px] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.7] max-md:mx-auto',
              onImage ? 'text-white/80' : 'text-text-muted'
            )}
          >
            We combine cutting-edge technology with creative problem-solving to deliver
            software that transforms businesses and delights users.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
