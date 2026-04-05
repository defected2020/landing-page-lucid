import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { staggerContainer, fadeInUp } from './animations/variants';

const Section = styled.section`
  padding: var(--section-padding) 0;
  background-color: var(--bg-subtle);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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
`;

const StepsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const StepCard = styled(motion.div)`
  position: relative;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem 1.5rem;
  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;
  }
`;

const StepNumber = styled.span`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 800;
  color: var(--accent);
  opacity: 0.15;
  line-height: 1;
  display: block;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.6;
`;

const Connector = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    position: absolute;
    top: 50%;
    right: -0.5rem;
    width: 1rem;
    height: 1px;
    border-top: 1px dashed var(--border-hover);
    z-index: 1;
  }
`;

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We learn about your business, goals, and users to define the right problem.',
  },
  {
    number: '02',
    title: 'Strategy & Planning',
    description: 'A clear roadmap with milestones, tech choices, and scope agreement.',
  },
  {
    number: '03',
    title: 'Design & Development',
    description: 'Iterative sprints with design reviews and working software at every stage.',
  },
  {
    number: '04',
    title: 'Testing & Refinement',
    description: 'Rigorous QA, user testing, and performance optimization before launch.',
  },
  {
    number: '05',
    title: 'Launch & Support',
    description: 'Smooth deployment with ongoing monitoring, updates, and partnership.',
  },
];

const Process = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Section id="journey">
      <Container>
        <SectionHeader>
          <Eyebrow>How We Work</Eyebrow>
          <Title>From vision to launch</Title>
        </SectionHeader>

        <StepsGrid
          ref={ref}
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {steps.map((step, index) => (
            <StepCard key={step.number} variants={fadeInUp}>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
              {index < steps.length - 1 && <Connector />}
            </StepCard>
          ))}
        </StepsGrid>
      </Container>
    </Section>
  );
};

export default Process;
