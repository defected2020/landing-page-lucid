import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SEO, { createBreadcrumbSchema, createCaseStudySchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import {
  getPortfolioProjectBySlug,
  getPortfolioSlugs,
} from '../../data/portfolioProjects';
import { getCaseStudyContent } from '../../data/caseStudyContent';

export default function WorkCaseStudyPage({ project, caseStudy }) {
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
        title={caseStudy?.metaTitle || `${project.name} — Case Study | Lucid Code Labs`}
        description={caseStudy?.metaDescription || project.tagline}
        path={`/work/${project.slug}`}
        image={project.screenshots[0].src}
        type="article"
        jsonLd={[
          createCaseStudySchema({
            name: project.name,
            description: caseStudy?.metaDescription || project.tagline,
            path: `/work/${project.slug}`,
            image: project.screenshots[0].src,
            url: project.url,
          }),
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Our Work', url: '/work' },
            { name: project.name },
          ]),
        ]}
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
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-pill bg-accent px-8 py-3 font-display text-[0.9375rem] font-semibold text-white no-underline transition-all duration-medium hover:-translate-y-px hover:bg-accent-hover hover:shadow-[0_0_20px_var(--accent-glow)]"
        >
          Visit live site &#8599;
        </a>
      </PageHero>

      <section className="bg-bg pt-section pb-8">
        <div className="mx-auto max-w-container px-container">
          <div className="mx-auto mb-12 max-w-[720px]">
            {project.summary.map((p, i) => (
              <p
                key={i}
                className="mb-5 text-[1.0625rem] leading-[1.8] text-text-muted last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-pill border border-border px-3 py-[0.3rem] text-xs font-medium text-text-subtle"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {caseStudy && (
        <section className="bg-bg pb-section">
          <div className="mx-auto max-w-container px-container">
            <div className="mx-auto max-w-[760px]">
              <h2 className="mb-4 font-display text-[1.5rem] font-bold text-text">
                The challenge
              </h2>
              <p className="mb-12 text-[1.0625rem] leading-[1.8] text-text-muted">
                {caseStudy.challenge}
              </p>

              <h2 className="mb-4 font-display text-[1.5rem] font-bold text-text">
                Our approach
              </h2>
              <ul className="mb-12 list-none p-0">
                {caseStudy.approach.map((item, i) => (
                  <li
                    key={i}
                    className="relative mb-4 pl-6 text-[1.0625rem] leading-[1.8] text-text-muted before:absolute before:left-0 before:top-[0.75rem] before:h-[6px] before:w-[6px] before:rounded-full before:bg-accent before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mb-6 font-display text-[1.5rem] font-bold text-text">
                What we built
              </h2>
              <div className="mb-12 grid grid-cols-1 gap-4">
                {caseStudy.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="rounded-lg border border-border bg-bg-elevated p-6"
                  >
                    <h3 className="mb-2 font-display text-[1.0625rem] font-semibold text-text">
                      {h.title}
                    </h3>
                    <p className="text-[0.9375rem] leading-[1.7] text-text-muted">
                      {h.detail}
                    </p>
                  </div>
                ))}
              </div>

              {caseStudy.stack.length > 0 && (
                <>
                  <h2 className="mb-6 font-display text-[1.5rem] font-bold text-text">
                    Technology
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {caseStudy.stack.map((group) => (
                      <div key={group.category}>
                        <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-text-subtle">
                          {group.category}
                        </h3>
                        <ul className="list-none p-0">
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="mb-2 text-[0.9375rem] leading-[1.6] text-text-muted"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-bg-subtle pt-8 pb-section">
        <h2 className="mb-10 text-center text-[1.75rem] font-bold text-text">
          Project Gallery
        </h2>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-container">
          {project.screenshots.map((shot, i) => (
            <motion.figure
              key={`${shot.src}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              className="m-0 overflow-hidden rounded-lg border border-border bg-bg-elevated"
            >
              <div className="relative aspect-[16/10] w-full bg-bg-subtle">
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
              </div>
              {shot.caption && (
                <figcaption className="px-5 py-4 text-sm leading-[1.5] text-text-muted">
                  {shot.caption}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </section>

      <div className="bg-bg py-12 text-center">
        <Link
          href="/work"
          className="text-[0.9375rem] font-semibold text-accent no-underline transition-colors duration-fast hover:text-accent-hover"
        >
          &larr; All our work
        </Link>
      </div>

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
  return { props: { project, caseStudy: getCaseStudyContent(params.slug) } };
}
