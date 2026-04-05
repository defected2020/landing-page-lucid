import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { portfolioProjects } from '../data/portfolioProjects';
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

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3.5rem;
  gap: 2rem;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
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
`;

const ViewAll = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: gap var(--transition-fast);
  white-space: nowrap;

  &:hover {
    gap: 0.625rem;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ProjectList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProjectCard = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--transition-fast);

  &:hover {
    border-color: var(--border-hover);
  }

  @media (min-width: 768px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: var(--bg-subtle);

  img {
    transition: transform var(--transition-slow);
  }

  ${ProjectCard}:hover & img {
    transform: scale(1.03);
  }

  @media (min-width: 768px) {
    aspect-ratio: auto;
    min-height: 280px;
  }
`;

const ProjectInfo = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 2.5rem 2.5rem 2.5rem 0;
  }
`;

const ProjectName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const ProjectTagline = styled.p`
  font-size: 0.9375rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-subtle);
`;

const CaseStudyLink = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: gap var(--transition-fast);

  &:hover {
    gap: 0.625rem;
  }
`;

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const FeaturedWork = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const featured = portfolioProjects.slice(0, 4);

  return (
    <Section>
      <Container>
        <HeaderRow>
          <HeaderLeft>
            <Eyebrow>Selected Work</Eyebrow>
            <Title>Projects we&apos;re proud of</Title>
          </HeaderLeft>
          <Link href="/work">
            <ViewAll>
              View all projects <ArrowIcon />
            </ViewAll>
          </Link>
        </HeaderRow>

        <ProjectList
          ref={ref}
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {featured.map((project) => (
            <Link key={project.slug} href={`/work/${project.slug}`} style={{ textDecoration: 'none' }}>
              <ProjectCard variants={fadeInUp}>
                <ImageWrapper>
                  <Image
                    src={project.screenshots[0].src}
                    alt={project.screenshots[0].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    style={{ objectFit: 'cover' }}
                  />
                </ImageWrapper>
                <ProjectInfo>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectTagline>{project.tagline}</ProjectTagline>
                  <Tags>
                    {project.tags.slice(0, 3).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Tags>
                  <CaseStudyLink>
                    View case study <ArrowIcon />
                  </CaseStudyLink>
                </ProjectInfo>
              </ProjectCard>
            </Link>
          ))}
        </ProjectList>
      </Container>
    </Section>
  );
};

export default FeaturedWork;
