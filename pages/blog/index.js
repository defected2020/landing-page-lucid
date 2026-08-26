import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO, { createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import { PageContainer, ContentSection, Container } from '../../components/ServicePageLayout';
import { getPublishedPosts, estimateReadingTime, formatPostDate } from '../../data/blogPosts';

export default function BlogIndexPage({ posts }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageContainer>
      <SEO
        title="Engineering Blog | Lucid Code Labs"
        description="Practical notes on building software: AI integration, mobile architecture, and the engineering decisions behind the products we ship."
        path="/blog"
        jsonLd={createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Blog' }])}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Engineering notes"
        subtitle="What we have learned building software for clients — architecture decisions, trade-offs, and the things we would do differently."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      />

      <ContentSection>
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-text-muted">
              The first posts are on their way.
            </p>
          ) : (
            <div className="mx-auto flex max-w-[760px] flex-col gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-lg border border-border bg-bg-elevated p-8 transition-[border-color,transform] duration-fast hover:-translate-y-0.5 hover:border-border-hover"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-xs text-text-subtle">
                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <h2 className="mb-3 font-display text-[1.375rem] font-bold leading-snug text-text">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="no-underline transition-colors duration-fast hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mb-5 text-[0.9375rem] leading-[1.7] text-text-muted">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-pill border border-border px-3 py-[0.3rem] text-xs font-medium text-text-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-semibold text-accent no-underline transition-colors duration-fast hover:text-accent-hover"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </ContentSection>

      <Footer />
    </PageContainer>
  );
}

export async function getStaticProps() {
  const posts = getPublishedPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    readingTime: estimateReadingTime(post),
  }));
  return { props: { posts } };
}
