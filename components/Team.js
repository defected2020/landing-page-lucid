import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import Image from 'next/image';
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
  margin-bottom: 3.5rem;
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
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.7;
`;

const TeamGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MemberCard = styled(motion.div)`
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
  }

  @media (max-width: 639px) {
    order: ${props => props.$mobileOrder ?? 0};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: var(--bg);

  img {
    transition: transform var(--transition-slow);
  }

  ${MemberCard}:hover & img {
    transform: scale(1.03);
  }
`;

const MemberInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const MemberName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.25rem;
`;

const MemberRole = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
`;

const team = [
  {
    name: 'Aline Bornschein',
    role: 'Founder & Machine Learning Engineer',
    image: '/images/aline3.png',
  },
  {
    name: 'George Beard',
    role: 'Founder & Fullstack Developer',
    image: '/images/geroge.png',
  },
];

const Team = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Section id="team">
      <Container>
        <SectionHeader>
          <Eyebrow>Our Team</Eyebrow>
          <Title>The people behind the code</Title>
          <Subtitle>
            A lean, senior team that ships fast and cares deeply about the craft.
          </Subtitle>
        </SectionHeader>

        <TeamGrid
          ref={ref}
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {team.map((member, index) => (
            <MemberCard key={member.name} variants={fadeInUp} $mobileOrder={index === 1 ? -1 : 0}>
              <ImageWrapper>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </ImageWrapper>
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
              </MemberInfo>
            </MemberCard>
          ))}
        </TeamGrid>
      </Container>
    </Section>
  );
};

export default Team;
