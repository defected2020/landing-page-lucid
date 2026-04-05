import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  position: relative;
  padding: 10rem 0 4rem;
  background-color: var(--bg);
  overflow: hidden;
`;

const AccentGlow = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 50%;
  background: radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-glow), transparent);
  pointer-events: none;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  text-align: center;
`;

const BreadcrumbsNav = styled.div`
  margin-bottom: 2rem;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  a {
    color: var(--text-subtle);
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--text-muted);
    }
  }

  span {
    margin: 0 0.5rem;
    color: var(--text-subtle);
    opacity: 0.5;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(0.9375rem, 1.2vw, 1.125rem);
  color: var(--text-muted);
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.7;
`;

const PageHero = ({ title, subtitle, breadcrumbs = [], children }) => {
  return (
    <HeroSection>
      <AccentGlow />
      <Container>
        {breadcrumbs.length > 0 && (
          <BreadcrumbsNav>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span style={{ color: 'var(--text-muted)', opacity: 1 }}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbsNav>
        )}
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </Title>
        {subtitle && (
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle}
          </Subtitle>
        )}
        {children}
      </Container>
    </HeroSection>
  );
};

export default PageHero;
