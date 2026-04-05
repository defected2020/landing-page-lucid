import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import services from '../data/services';
import { getServiceIcon } from './icons/ServiceIcons';
import { staggerContainer, fadeInUp } from './animations/variants';

const Section = styled.section`
  padding: var(--section-padding) 0;
  background-color: var(--bg);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  margin-bottom: 3.5rem;
  max-width: 600px;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 3.5vw + 0.5rem, 3.25rem);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: clamp(0.9375rem, 1vw, 1.0625rem);
  color: var(--text-muted);
  line-height: 1.7;
`;

const BentoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ServiceCard = styled(motion.div)`
  position: relative;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), transform var(--transition-fast);
  grid-column: span 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    grid-column: ${props => props.$featured ? 'span 2' : 'span 1'};
  }

  &:hover {
    border-color: var(--border-hover);
    background-color: var(--bg-subtle);
    transform: translateY(-2px);

    .card-image img {
      transform: scale(1.05);
    }
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, var(--bg-elevated), transparent);
    z-index: 1;
  }

  img {
    transition: transform 0.4s ease;
  }
`;

const CardContent = styled.div`
  padding: 1.25rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const IconWrapper = styled.div`
  color: var(--accent);
  margin-bottom: 1.25rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.75rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const LearnMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--accent);
  transition: gap var(--transition-fast);

  &:hover {
    gap: 0.625rem;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <Section id="services">
      <Container>
        <SectionHeader>
          <Eyebrow>What We Do</Eyebrow>
          <Title>Services built for ambitious teams</Title>
          <Subtitle>
            From AI-powered software to stunning design, we offer everything you need to succeed in the digital world.
          </Subtitle>
        </SectionHeader>

        <BentoGrid
          ref={ref}
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {services.map((service) => {
            const Icon = getServiceIcon(service.iconName);
            return (
              <Link key={service.id} href={service.link} style={{ textDecoration: 'none' }}>
                <ServiceCard
                  variants={fadeInUp}
                  $featured={service.featured}
                >
                  {service.image && (
                    <CardImageWrapper className="card-image">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </CardImageWrapper>
                  )}
                  <CardContent>
                    <IconWrapper>
                      <Icon size={28} />
                    </IconWrapper>
                    <ServiceTitle>{service.title}</ServiceTitle>
                    <ServiceDescription>
                      {service.featured ? service.description : service.shortDescription}
                    </ServiceDescription>
                    <LearnMore>
                      Learn more
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </LearnMore>
                  </CardContent>
                </ServiceCard>
              </Link>
            );
          })}
        </BentoGrid>
      </Container>
    </Section>
  );
};

export default Services;
