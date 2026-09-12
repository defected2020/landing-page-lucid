import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import { portfolioProjects } from '../data/portfolioProjects';
import { staggerContainer, fadeInUp } from './animations/variants';

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
    <section className="bg-bg py-section">
      <div className="mx-auto max-w-container px-container">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[600px]">
            <span className="mb-4 inline-block font-display text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-accent">
              Selected Work
            </span>
            <h2 className="text-[clamp(2rem,3.5vw+0.5rem,3.25rem)] font-bold text-text">
              Projects we&apos;re proud of
            </h2>
          </div>
          <Link href="/work">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-accent transition-[gap] duration-fast ease-smooth hover:gap-2.5">
              View all projects <ArrowIcon />
            </span>
          </Link>
        </div>

        <motion.div
          ref={ref}
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-6"
        >
          {featured.map((project) => (
            <Link key={project.slug} href={`/work/${project.slug}`} className="no-underline">
              <motion.div
                variants={fadeInUp}
                className="group grid grid-cols-1 gap-8 overflow-hidden rounded-lg border border-border bg-bg-elevated transition-[border-color] duration-fast ease-smooth hover:border-border-hover md:grid-cols-[3fr_2fr]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-subtle md:aspect-auto md:min-h-[340px]">
                  <Image
                    src={project.screenshots[0].src}
                    alt={project.screenshots[0].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover object-top transition-transform duration-slow ease-smooth group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10 md:pl-0">
                  <h3 className="mb-2 text-2xl font-bold text-text">{project.name}</h3>
                  <p className="mb-5 text-[0.9375rem] leading-[1.6] text-text-muted">{project.tagline}</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill border border-border px-3 py-1 text-xs font-medium text-text-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-[gap] duration-fast ease-smooth hover:gap-2.5">
                    View case study <ArrowIcon />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedWork;
