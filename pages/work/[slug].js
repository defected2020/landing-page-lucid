import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SEO, { createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import {
  getPortfolioProjectBySlug,
  getPortfolioSlugs,
} from '../../data/portfolioProjects';

const BodySection = styled.section`
  padding: var(--section-padding) 0 2rem;
  background-color: var(--bg);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Prose = styled.div`
  max-width: 720px;
  margin: 0 auto 3rem;

  p {
    font-size: 1.0625rem;
    line-height: 1.8;
    color: var(--text-muted);
    margin-bottom: 1.25rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-subtle);
`;

const GallerySection = styled.section`
  padding: 2rem 0 var(--section-padding);
  background-color: var(--bg-subtle);
`;

const GalleryTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  text-align: center;
  margin-bottom: 2.5rem;
`;

const GalleryGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 0 var(--container-padding);
`;

const Shot = styled(motion.figure)`
  margin: 0;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const ShotImageWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background-color: var(--bg-subtle);
`;

const Caption = styled.figcaption`
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
`;

const BottomCta = styled.div`
  text-align: center;
  padding: 3rem 0;
  background-color: var(--bg);

  a {
    color: var(--accent);
    font-weight: 600;
    font-size: 0.9375rem;
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--accent-hover);
    }
  }
`;

const ExternalCta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9375rem;
  background-color: var(--accent);
  color: white;
  text-decoration: none;
  transition: all var(--transition-medium);

  &:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 0 20px var(--accent-glow);
  }
`;

export default function WorkCaseStudyPage({ project }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SEO
        title={`${project.name} — Case Study | Lucid Code Labs`}
        description={project.tagline}
        path={`/work/${project.slug}`}
        image={`https://lucidcodelabs.com${project.screenshots[0].src}`}
        type="article"
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Our Work', url: '/work' },
          { name: project.name },
        ])}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title={project.name}
        subtitle={project.tagline}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Our Work', href: '/work' },
          { label: project.name },
        ]}
      >
        <ExternalCta href={project.url} target="_blank" rel="noopener noreferrer">
          Visit live site &#8599;
        </ExternalCta>
      </PageHero>

      <BodySection>
        <Container>
          <Prose>
            {project.summary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Prose>
          <TagsRow>
            {project.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </TagsRow>
        </Container>
      </BodySection>

      <GallerySection>
        <GalleryTitle>Project Gallery</GalleryTitle>
        <GalleryGrid>
          {project.screenshots.map((shot, i) => (
            <Shot
              key={`${shot.src}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
            >
              <ShotImageWrap>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  style={{
                    objectFit: shot.objectFit === 'cover' ? 'cover' : 'contain',
                    objectPosition: shot.objectPosition || 'center',
                  }}
                  priority={i === 0}
                />
              </ShotImageWrap>
              {shot.caption && <Caption>{shot.caption}</Caption>}
            </Shot>
          ))}
        </GalleryGrid>
      </GallerySection>

      <BottomCta>
        <Link href="/work">&larr; All our work</Link>
      </BottomCta>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: getPortfolioSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = getPortfolioProjectBySlug(params.slug);
  if (!project) return { notFound: true };
  return { props: { project } };
}
