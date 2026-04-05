import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

/* ── Base Styled Components ── */

export const PageContainer = styled.div`
  min-height: 100vh;
`;

const ContentSectionBase = styled.section`
  padding: var(--section-padding) 0;
  background-color: ${props => props.$alt ? 'var(--bg-subtle)' : 'var(--bg)'};
`;

export const ContentSection = ContentSectionBase;

export const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

/* ── Animated Section Title ── */

const SectionTitleStyled = styled(motion.h2)`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1rem;
  text-align: center;
`;

export const SectionTitle = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <SectionTitleStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionAnim}
      {...props}
    >
      {children}
    </SectionTitleStyled>
  );
};

/* ── Animated Section Description ── */

const SectionDescriptionStyled = styled(motion.p)`
  font-size: clamp(0.9375rem, 1vw, 1.0625rem);
  color: var(--text-muted);
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  line-height: 1.7;
`;

export const SectionDescription = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <SectionDescriptionStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ ...sectionAnim, visible: { ...sectionAnim.visible, transition: { ...sectionAnim.visible.transition, delay: 0.1 } } }}
      {...props}
    >
      {children}
    </SectionDescriptionStyled>
  );
};

/* ── Animated Cards Grid ── */

const CardsGridStyled = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const CardsGrid = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.05);
  return (
    <CardsGridStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.07)}
      {...props}
    >
      {children}
    </CardsGridStyled>
  );
};

/* ── Animated Card ── */

const CardStyled = styled(motion.div)`
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: border-color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }

  h3 {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.6;
  }
`;

export const Card = ({ children, ...props }) => (
  <CardStyled variants={cardAnim} {...props}>{children}</CardStyled>
);

/* ── Animated Process Step ── */

const ProcessStepStyled = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
`;

export const ProcessStep = ({ children, index = 0, ...props }) => {
  const { ref, inView } = useAnim(0.2);
  return (
    <ProcessStepStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      {...props}
    >
      {children}
    </ProcessStepStyled>
  );
};

export const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--accent-muted);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const StepContent = styled.div`
  h3 {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.6;
  }
`;

/* ── Tech Tabs (static – interactivity handled in pages) ── */

export const TechTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

export const Tab = styled.button`
  padding: 0.5rem 1.25rem;
  border: 1px solid ${props => props.$active ? 'var(--accent)' : 'var(--border)'};
  background: ${props => props.$active ? 'var(--accent)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-muted)'};
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: ${props => props.$active ? 'var(--accent)' : 'var(--border-hover)'};
    color: ${props => props.$active ? 'white' : 'var(--text)'};
  }
`;

export const TechContent = styled.div`
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  padding: 2rem;
  border-radius: var(--radius-lg);

  h3 {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.6;
  }
`;

/* ── Animated Feature Image Section ── */

const FeatureImageSectionBase = styled.section`
  padding: 0 0 var(--section-padding);
  background-color: ${props => props.$alt ? 'var(--bg-subtle)' : 'var(--bg)'};
`;

export const FeatureImageSection = FeatureImageSectionBase;

const FeatureImageGridStyled = styled(motion.div)`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FeatureImageGrid = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.1);
  return (
    <FeatureImageGridStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.2)}
      {...props}
    >
      {children}
    </FeatureImageGridStyled>
  );
};

const FeatureImageWrapperStyled = styled(motion.div)`
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 1px solid var(--border);
`;

export const FeatureImageWrapper = ({ children, ...props }) => (
  <FeatureImageWrapperStyled variants={scaleUp} {...props}>{children}</FeatureImageWrapperStyled>
);

const FeatureTextContentStyled = styled(motion.div)`
  h3 {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    color: var(--text);
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 1rem;
  }
`;

export const FeatureTextContent = ({ children, ...props }) => (
  <FeatureTextContentStyled variants={slideRight} {...props}>{children}</FeatureTextContentStyled>
);

/* ── Animated Stats Bar ── */

const StatsBarStyled = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StatsBar = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.2);
  return (
    <StatsBarStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.1)}
      {...props}
    >
      {children}
    </StatsBarStyled>
  );
};

const StatItemStyled = styled(motion.div)`
  background-color: var(--bg-elevated);
  padding: 2rem 1.5rem;
  text-align: center;
`;

export const StatItem = ({ children, ...props }) => (
  <StatItemStyled variants={countUp} {...props}>{children}</StatItemStyled>
);

const StatNumberStyled = styled.div`
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
`;

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

export const StatNumber = ({ children, ...props }) => {
  const text = typeof children === 'string' ? children : String(children);
  const match = text.match(STAT_RE);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  if (!match) {
    // Non-numeric stat (e.g. "Full", "Real-time", "WCAG 2.1", "3–6 wk")
    return <StatNumberStyled {...props}>{children}</StatNumberStyled>;
  }

  const [, prefix, numStr, suffix] = match;
  const target = parseFloat(numStr);
  const animated = useCountUp(target, inView);

  return (
    <StatNumberStyled ref={ref} {...props}>
      {prefix}{animated}{suffix}
    </StatNumberStyled>
  );
};

export const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.4;
`;

/* ── Animated Split Content ── */

const SplitSectionBase = styled.section`
  padding: var(--section-padding) 0;
  background-color: ${props => props.$alt ? 'var(--bg-subtle)' : 'var(--bg)'};
`;

export const SplitSection = SplitSectionBase;

const SplitGridStyled = styled(motion.div)`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    direction: ${props => props.$reverse ? 'rtl' : 'ltr'};

    > * {
      direction: ltr;
    }
  }
`;

export const SplitGrid = ({ children, $reverse, ...props }) => {
  const { ref, inView } = useAnim(0.1);
  return (
    <SplitGridStyled
      ref={ref}
      $reverse={$reverse}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.15)}
      {...props}
    >
      {children}
    </SplitGridStyled>
  );
};

const SplitImageStyled = styled(motion.div)`
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--border);
`;

export const SplitImage = ({ children, ...props }) => (
  <SplitImageStyled variants={scaleUp} {...props}>{children}</SplitImageStyled>
);

const SplitTextStyled = styled(motion.div)`
  h3 {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    color: var(--text);
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.6;
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.55rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--accent);
    }
  }
`;

export const SplitText = ({ children, ...props }) => (
  <SplitTextStyled variants={slideRight} {...props}>{children}</SplitTextStyled>
);

/* ── Animated Highlight Box ── */

const HighlightBoxStyled = styled(motion.div)`
  background: var(--highlight-bg);
  border: 1px solid var(--highlight-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  margin: 3rem 0;
  text-align: center;

  h3 {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto;
  }
`;

export const HighlightBox = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.2);
  return (
    <HighlightBoxStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={scaleUp}
      {...props}
    >
      {children}
    </HighlightBoxStyled>
  );
};

/* ── Icon Card ── */

const IconCardStyled = styled(motion.div)`
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    &::before { opacity: 1; }
  }

  h3 {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.6;
  }
`;

export const IconCard = ({ children, ...props }) => (
  <IconCardStyled variants={cardAnim} {...props}>{children}</IconCardStyled>
);

export const IconCardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--accent-muted);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

/* ── CTA Section (animated) ── */

const CTASectionStyled = styled.section`
  padding: var(--section-padding) 0;
  background: var(--cta-gradient-simple);
  text-align: center;
`;

export const CTASection = CTASectionStyled;

const CTATitleStyled = styled(motion.h2)`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`;

export const CTATitle = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <CTATitleStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionAnim}
      {...props}
    >
      {children}
    </CTATitleStyled>
  );
};

const CTATextStyled = styled(motion.p)`
  font-size: clamp(0.9375rem, 1.2vw, 1.125rem);
  color: rgba(255, 255, 255, 0.85);
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

export const CTAText = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <CTATextStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ ...sectionAnim, visible: { ...sectionAnim.visible, transition: { ...sectionAnim.visible.transition, delay: 0.1 } } }}
      {...props}
    >
      {children}
    </CTATextStyled>
  );
};

const CTAButtonStyled = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2.5rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  background-color: var(--cta-btn-bg);
  color: var(--cta-btn-text);
  text-decoration: none;
  transition: all var(--transition-medium);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

export const CTAButton = ({ children, ...props }) => {
  const { ref, inView } = useAnim(0.3);
  return (
    <CTAButtonStyled
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ ...scaleUp, visible: { ...scaleUp.visible, transition: { ...scaleUp.visible.transition, delay: 0.2 } } }}
      {...props}
    >
      {children}
    </CTAButtonStyled>
  );
};
