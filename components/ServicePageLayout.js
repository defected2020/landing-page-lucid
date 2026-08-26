import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '../lib/utils';

/* ── Animation Helpers ── */

const sectionAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = (delay = 0.08) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: delay } },
});

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const countUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function useAnim(threshold = 0.15) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold });
  return { ref, inView };
}

/* ── Base Layout Components ── */

export const PageContainer = ({ children, className, ...props }) => (
  <div className={cn('min-h-screen', className)} {...props}>
    {children}
  </div>
);

export const ContentSection = ({ children, $alt, className, ...props }) => (
  <section
    className={cn(
      'py-section',
      $alt ? 'bg-bg-subtle' : 'bg-bg',
      className
    )}
    {...props}
  >
    {children}
  </section>
);

export const Container = ({ children, className, ...props }) => (
  <div className={cn('mx-auto max-w-container px-container', className)} {...props}>
    {children}
  </div>
);

/* ── Animated Section Title ── */

export const SectionTitle = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionAnim}
      className={cn(
        'text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-text text-center mb-4',
        className
      )}
      {...props}
    >
      {children}
    </motion.h2>
  );
};

/* ── Animated Section Description ── */

export const SectionDescription = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <motion.p
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        ...sectionAnim,
        visible: {
          ...sectionAnim.visible,
          transition: { ...sectionAnim.visible.transition, delay: 0.1 },
        },
      }}
      className={cn(
        'text-[clamp(0.9375rem,1vw,1.0625rem)] text-text-muted max-w-[800px] mx-auto mb-12 text-center leading-[1.7]',
        className
      )}
      {...props}
    >
      {children}
    </motion.p>
  );
};

/* ── Animated Cards Grid ── */

export const CardsGrid = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.05);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.07)}
      className={cn(
        'grid gap-4 mb-8 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ── Animated Card ── */

export const Card = ({ children, className, ...props }) => (
  <motion.div
    variants={cardAnim}
    className={cn(
      'bg-bg-elevated border border-border rounded-lg p-8',
      'transition-[border-color,transform] duration-fast',
      'hover:border-border-hover hover:-translate-y-0.5',
      '[&_h3]:font-display [&_h3]:text-[1.125rem] [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mb-3',
      '[&_p]:text-sm [&_p]:text-text-muted [&_p]:leading-[1.6]',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

/* ── Animated Process Step ── */

export const ProcessStep = ({ children, index = 0, className, ...props }) => {
  const { ref, inView } = useAnim(0.2);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, x: -30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={cn(
        'flex items-start gap-6 mb-8',
        'max-[768px]:flex-col max-[768px]:text-center max-[768px]:items-center',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StepNumber = ({ children, className, ...props }) => (
  <div
    className={cn(
      'w-12 h-12 rounded-full bg-accent-muted text-accent',
      'flex items-center justify-center',
      'font-display text-[1.125rem] font-bold shrink-0',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const StepContent = ({ children, className, ...props }) => (
  <div
    className={cn(
      '[&_h3]:font-display [&_h3]:text-[1.25rem] [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mb-2',
      '[&_p]:text-[0.9375rem] [&_p]:text-text-muted [&_p]:leading-[1.6]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

/* ── Tech Tabs (static – interactivity handled in pages) ── */

export const TechTabs = ({ children, className, ...props }) => (
  <div
    className={cn('flex justify-center flex-wrap gap-3 mb-8', className)}
    {...props}
  >
    {children}
  </div>
);

export const Tab = ({ children, $active, className, ...props }) => (
  <button
    className={cn(
      'py-2 px-5 rounded-pill font-display font-medium text-[0.8125rem]',
      'cursor-pointer transition-all duration-fast border',
      $active
        ? 'border-accent bg-accent text-white hover:border-accent'
        : 'border-border bg-transparent text-text-muted hover:border-border-hover hover:text-text',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const TechContent = ({ children, className, ...props }) => (
  <div
    className={cn(
      'bg-bg-elevated border border-border p-8 rounded-lg',
      '[&_h3]:font-display [&_h3]:text-[1.25rem] [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mb-3',
      '[&_p]:text-[0.9375rem] [&_p]:text-text-muted [&_p]:leading-[1.6]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

/* ── Animated Feature Image Section ── */

export const FeatureImageSection = ({ children, $alt, className, ...props }) => (
  <section
    className={cn(
      'pt-0 pb-section',
      $alt ? 'bg-bg-subtle' : 'bg-bg',
      className
    )}
    {...props}
  >
    {children}
  </section>
);

export const FeatureImageGrid = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.1);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.2)}
      className={cn(
        'max-w-container mx-auto px-container',
        'grid grid-cols-1 gap-12 items-center',
        'md:grid-cols-2',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FeatureImageWrapper = ({ children, className, ...props }) => (
  <motion.div
    variants={scaleUp}
    className={cn(
      'relative rounded-lg overflow-hidden border border-border aspect-[16/10]',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

export const FeatureTextContent = ({ children, className, ...props }) => (
  <motion.div
    variants={slideRight}
    className={cn(
      '[&_h3]:font-display [&_h3]:text-[clamp(1.5rem,2.5vw,2rem)] [&_h3]:font-bold [&_h3]:text-text [&_h3]:mb-4',
      '[&_p]:text-[0.9375rem] [&_p]:text-text-muted [&_p]:leading-[1.7] [&_p]:mb-4',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

/* ── Animated Stats Bar ── */

export const StatsBar = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.2);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.1)}
      className={cn(
        'grid grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden mb-12',
        'md:grid-cols-4',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StatItem = ({ children, className, ...props }) => (
  <motion.div
    variants={countUp}
    className={cn('bg-bg-elevated py-8 px-6 text-center', className)}
    {...props}
  >
    {children}
  </motion.div>
);

// Matches an optional prefix (<, ~, etc.), then a number (with optional decimals),
// then everything after as a suffix (%, +, x, M+, /5, s, etc.)
const STAT_RE = /^([<>~≈]?)(\d+(?:\.\d+)?)\s*(.*)$/;

function useCountUp(target, shouldAnimate, duration = 1.2) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) return;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setValue(isFloat ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [shouldAnimate, target, duration]);

  return value;
}

const statNumberClasses =
  'font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold text-accent mb-1 tracking-[-0.02em]';

export const StatNumber = ({ children, className, ...props }) => {
  const text = typeof children === 'string' ? children : String(children);
  const match = text.match(STAT_RE);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  if (!match) {
    // Non-numeric stat (e.g. "Full", "Real-time", "WCAG 2.1", "3–6 wk")
    return (
      <div className={cn(statNumberClasses, className)} {...props}>
        {children}
      </div>
    );
  }

  const [, prefix, numStr, suffix] = match;
  const target = parseFloat(numStr);
  const animated = useCountUp(target, inView);

  return (
    <div ref={ref} className={cn(statNumberClasses, className)} {...props}>
      {prefix}{animated}{suffix}
    </div>
  );
};

export const StatLabel = ({ children, className, ...props }) => (
  <div
    className={cn('text-[0.8125rem] text-text-muted leading-[1.4]', className)}
    {...props}
  >
    {children}
  </div>
);

/* ── Animated Split Content ── */

export const SplitSection = ({ children, $alt, className, ...props }) => (
  <section
    className={cn(
      'py-section',
      $alt ? 'bg-bg-subtle' : 'bg-bg',
      className
    )}
    {...props}
  >
    {children}
  </section>
);

export const SplitGrid = ({ children, $reverse, className, ...props }) => {
  const { ref, inView } = useAnim(0.1);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.15)}
      className={cn(
        'max-w-container mx-auto px-container',
        'grid grid-cols-1 gap-12 items-center',
        'md:grid-cols-2',
        $reverse && 'md:[direction:rtl] md:[&>*]:[direction:ltr]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SplitImage = ({ children, className, ...props }) => (
  <motion.div
    variants={scaleUp}
    className={cn(
      'relative rounded-lg overflow-hidden border border-border aspect-[4/3]',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

export const SplitText = ({ children, className, ...props }) => (
  <motion.div
    variants={slideRight}
    className={cn(
      '[&_h3]:font-display [&_h3]:text-[clamp(1.5rem,2.5vw,2rem)] [&_h3]:font-bold [&_h3]:text-text [&_h3]:mb-4',
      '[&_p]:text-[0.9375rem] [&_p]:text-text-muted [&_p]:leading-[1.7] [&_p]:mb-4',
      '[&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0',
      '[&_li]:text-[0.9375rem] [&_li]:text-text-muted [&_li]:leading-[1.6] [&_li]:pl-6 [&_li]:mb-3 [&_li]:relative',
      '[&_li::before]:content-[""] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-[0.55rem]',
      '[&_li::before]:w-[6px] [&_li::before]:h-[6px] [&_li::before]:rounded-full [&_li::before]:bg-accent',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

/* ── Animated Highlight Box ── */

export const HighlightBox = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.2);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={scaleUp}
      className={cn(
        'bg-highlight border border-[color:var(--highlight-border)] rounded-lg p-10 my-12 text-center',
        '[&_h3]:font-display [&_h3]:text-[1.25rem] [&_h3]:font-bold [&_h3]:text-text [&_h3]:mb-3',
        '[&_p]:text-[0.9375rem] [&_p]:text-text-muted [&_p]:leading-[1.7] [&_p]:max-w-[700px] [&_p]:mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ── Icon Card ── */

export const IconCard = ({ children, className, ...props }) => (
  <motion.div
    variants={cardAnim}
    className={cn(
      'relative overflow-hidden bg-bg-elevated border border-border rounded-lg p-8',
      'transition-[border-color,transform] duration-fast',
      'before:content-[""] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px]',
      'before:bg-[linear-gradient(90deg,var(--accent),transparent)] before:opacity-0 before:transition-opacity before:duration-fast',
      'hover:border-border-hover hover:-translate-y-0.5 hover:before:opacity-100',
      '[&_h3]:font-display [&_h3]:text-[1.125rem] [&_h3]:font-semibold [&_h3]:text-text [&_h3]:mb-3',
      '[&_p]:text-sm [&_p]:text-text-muted [&_p]:leading-[1.6]',
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

export const IconCardIcon = ({ children, className, ...props }) => (
  <div
    className={cn(
      'w-10 h-10 rounded-md bg-accent-muted text-accent',
      'flex items-center justify-center mb-5',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

/* ── CTA Section (animated) ── */

export const CTASection = ({ children, className, ...props }) => (
  <section
    className={cn('py-section bg-cta-gradient-simple text-center', className)}
    {...props}
  >
    {children}
  </section>
);

export const CTATitle = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionAnim}
      className={cn(
        'text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-white mb-4',
        className
      )}
      {...props}
    >
      {children}
    </motion.h2>
  );
};

export const CTAText = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <motion.p
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        ...sectionAnim,
        visible: {
          ...sectionAnim.visible,
          transition: { ...sectionAnim.visible.transition, delay: 0.1 },
        },
      }}
      className={cn(
        'text-[clamp(0.9375rem,1.2vw,1.125rem)] text-white/85 max-w-[700px] mx-auto mb-8 leading-[1.6]',
        className
      )}
      {...props}
    >
      {children}
    </motion.p>
  );
};

export const CTAButton = ({ children, className, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <motion.a
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        ...scaleUp,
        visible: {
          ...scaleUp.visible,
          transition: { ...scaleUp.visible.transition, delay: 0.2 },
        },
      }}
      className={cn(
        'inline-flex items-center justify-center py-3.5 px-10 rounded-pill',
        'font-display font-semibold text-base no-underline',
        'bg-[var(--cta-btn-bg)] text-[color:var(--cta-btn-text)]',
        'transition-all duration-medium',
        'hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]',
        className
      )}
      {...props}
    >
      {children}
    </motion.a>
  );
};

/* ── Default Export ── */

const ServicePageLayout = ({ children, className, ...props }) => (
  <PageContainer className={className} {...props}>
    {children}
  </PageContainer>
);

export default ServicePageLayout;
