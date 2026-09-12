import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO, { createArticleSchema, createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import { PageContainer, ContentSection, Container, CTASection, CTATitle, CTAText, CTAButton } from '../../components/ServicePageLayout';
import {
  getPostBySlug,
  getPostSlugs,
  estimateReadingTime,
  formatPostDate,
} from '../../data/blogPosts';

function PostBody({ body }) {
  return (
    <div className="mx-auto max-w-[720px]">
      {body.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h2
              key={i}
              className="mb-4 mt-12 font-display text-[1.5rem] font-bold tracking-[-0.01em] text-text first:mt-0"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={i} className="mb-6 list-none p-0">
              {(block.items || []).map((item, j) => (
                <li
                  key={j}
                  className="relative mb-3 pl-6 text-[1.0625rem] leading-[1.8] text-text-muted before:absolute before:left-0 before:top-[0.7rem] before:h-[6px] before:w-[6px] before:rounded-full before:bg-accent before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mb-6 text-[1.0625rem] leading-[1.8] text-text-muted">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export default function BlogPostPage({ post, readingTime }) {
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
        title={`${post.title} | Lucid Code Labs`}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.date}
        noindex={Boolean(post.draft)}
        jsonLd={[
          createArticleSchema({
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            datePublished: post.date,
          }),
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title },
          ]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <ContentSection>
        <Container>
          <div className="mx-auto mb-10 flex max-w-[720px] flex-wrap items-center gap-3 font-mono text-xs text-text-subtle">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{readingTime} min read</span>
            {post.draft && (
              <span className="rounded-pill border border-warning px-3 py-[0.2rem] font-semibold text-warning">
                Draft — not published
              </span>
            )}
          </div>

          <PostBody body={post.body} />

          <div className="mx-auto mt-12 flex max-w-[720px] flex-wrap gap-2 border-t border-border pt-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill border border-border px-3 py-[0.3rem] text-xs font-medium text-text-subtle"
              >
                {tag}
              </span>
            ))}
          </div>
        </Container>
      </ContentSection>

      <CTASection>
        <Container>
          <CTATitle>Building something like this?</CTATitle>
          <CTAText>
            We design and build AI-powered platforms, web applications, and mobile
            products. Tell us what you are working on.
          </CTAText>
          <CTAButton href="/#contact">Get in touch</CTAButton>
        </Container>
      </CTASection>

      <div className="bg-bg py-12 text-center">
        <Link
          href="/blog"
          className="text-[0.9375rem] font-semibold text-accent no-underline transition-colors duration-fast hover:text-accent-hover"
        >
          &larr; All posts
        </Link>
      </div>

      <Footer />
    </PageContainer>
  );
}

export async function getStaticPaths() {
  return {
    paths: getPostSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { notFound: true };
  return { props: { post, readingTime: estimateReadingTime(post) } };
}
