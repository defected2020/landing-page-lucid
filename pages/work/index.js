import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SEO, { createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import { portfolioProjects } from '../../data/portfolioProjects';
import { staggerContainer, fadeInUp } from '../../components/animations/variants';

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
      <SEO
        title="Our Work — Case Studies | Lucid Code Labs"
        description="Explore our portfolio of client projects — AI platforms, web applications, mobile apps, and digital experiences delivered by Lucid Code Labs."
        path="/work"
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Our Work' },
        ])}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Our Work"
        subtitle="A selection of projects we have delivered — each with its own goals, constraints, and outcomes."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Our Work' },
        ]}
      />

      <section className="py-section bg-bg">
        <div className="mx-auto max-w-container px-container">
          <motion.div
            className="grid grid-cols-1 gap-6 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3"
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
          >
            {portfolioProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="no-underline text-inherit"
              >
                <motion.article
                  variants={fadeInUp}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated transition-[border-color,transform] duration-fast hover:-translate-y-0.5 hover:border-border-hover"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-bg-subtle">
                    <Image
                      src={project.screenshots[0].src}
                      alt={project.screenshots[0].alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-slow group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="mb-2 text-xl font-bold text-text">{project.name}</h2>
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-text-muted">
                      {project.tagline}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-accent transition-[gap] duration-fast hover:gap-2.5">
                      View case study
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </motion.article>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
