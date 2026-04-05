import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import { portfolioProjects } from '../../data/portfolioProjects';
import { staggerContainer, fadeInUp } from '../../components/animations/variants';

const GridSection = styled.section`
  padding: var(--section-padding) 0;
  background-color: var(--bg);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.article)`
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
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

  ${Card}:hover & img {
    transform: scale(1.03);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const CardTagline = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  flex: 1;
`;

const CardLink = styled.span`
  font-size: 0.8125rem;
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

export default function WorkIndexPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Our Work — Case Studies | Lucid Code Labs</title>
        <meta name="description" content="Selected client projects and case studies from Lucid Code Labs." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Our Work"
        subtitle="A selection of projects we have delivered — each with its own goals, constraints, and outcomes."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Our Work' },
        ]}
      />

      <GridSection>
        <Container>
          <Grid
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
          >
            {portfolioProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card variants={fadeInUp}>
                  <ImageWrapper>
                    <Image
                      src={project.screenshots[0].src}
                      alt={project.screenshots[0].alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </ImageWrapper>
                  <CardContent>
                    <CardTitle>{project.name}</CardTitle>
                    <CardTagline>{project.tagline}</CardTagline>
                    <CardLink>
                      View case study
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </CardLink>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Grid>
        </Container>
      </GridSection>

      <Footer />
    </>
  );
}
