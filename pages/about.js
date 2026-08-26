import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SEO, { organizationSchema, createBreadcrumbSchema } from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import {
  PageContainer, ContentSection, Container,
  SectionTitle, SectionDescription, CardsGrid, Card,
  CTASection, CTATitle, CTAText, CTAButton,
} from '../components/ServicePageLayout';
import team from '../data/team';
import { CONTACT } from '../data/siteConfig';
import { portfolioProjects } from '../data/portfolioProjects';

export default function AboutPage() {
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
        title="About Lucid Code Labs | Software Studio in Berlin"
        description="Lucid Code Labs is a small software studio in Berlin building AI-powered platforms, web applications, and mobile apps for clients worldwide. Meet the team."
        path="/about"
        jsonLd={[
          organizationSchema,
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About' }]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="A small studio in Berlin, building software that ships"
        subtitle="Lucid Code Labs is a founder-led software studio. We design and build AI-powered platforms, web applications, and mobile products for clients around the world."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <ContentSection>
        <Container>
          <div className="mx-auto max-w-[760px] text-[1.0625rem] leading-[1.8] text-text-muted [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:font-bold [&_h2]:text-text [&_h2:first-child]:mt-0 [&_p]:mb-6">
            <h2>Who we are</h2>
            <p>
              Lucid Code Labs is run by its two founders, and the people you meet are the
              people who do the work. There is no account layer between you and the
              engineers building your product, and nothing gets passed down a chain.
            </p>
            <p>
              We are based in {CONTACT.locality}, Germany, and we work with clients
              globally. Projects have taken us from a wellness network in Rishikesh to a
              festival platform in Koh Phangan and a loyalty product serving retail
              partners.
            </p>

            <h2>How we work</h2>
            <p>
              Design and engineering happen together rather than as a handoff. The person
              shaping an interface is talking to the person building the data model, which
              is how you avoid designs that cannot be built and systems nobody enjoys
              using.
            </p>
            <p>
              We build on a deliberately boring, well-supported foundation — React and
              Next.js on the web, React Native for mobile, and managed infrastructure
              rather than servers you have to babysit. The interesting choices should be in
              your product, not in holding the plumbing together.
            </p>
            <p>
              Every project is handed over as something your team can actually own: a
              readable codebase, a design system rather than a pile of one-off screens, and
              a structure that has room for the features you have not thought of yet.
            </p>

            <h2>What we build</h2>
            <p>
              Our work spans AI-powered platforms, content and booking systems, mobile
              apps, and product design. That has meant live video infrastructure for
              streaming sessions, token-based reward systems with wallet passes and QR
              redemption, multilingual booking flows, and mobile apps with offline-capable
              tracking.
            </p>
          </div>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>The team</SectionTitle>
          <SectionDescription>
            A lean, senior team that ships fast and cares deeply about the craft.
          </SectionDescription>
          <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-6 sm:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name}
                className="overflow-hidden rounded-lg border border-border bg-bg-elevated"
              >
                <div className="relative aspect-square w-full bg-bg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-1 font-display text-lg font-bold text-text">{member.name}</h3>
                  <p className="mb-3 text-sm font-medium text-accent">{member.role}</p>
                  <p className="text-sm leading-[1.6] text-text-muted">{member.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Recent work</SectionTitle>
          <SectionDescription>
            A selection of products we have designed and built end to end.
          </SectionDescription>
          <CardsGrid>
            {portfolioProjects.slice(0, 3).map((project) => (
              <Card key={project.slug}>
                <h3>{project.name}</h3>
                <p>{project.tagline}</p>
                <Link
                  href={`/work/${project.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-accent no-underline transition-colors duration-fast hover:text-accent-hover"
                >
                  Read the case study &rarr;
                </Link>
              </Card>
            ))}
          </CardsGrid>
          <div className="text-center">
            <Link
              href="/work"
              className="text-[0.9375rem] font-semibold text-accent no-underline transition-colors duration-fast hover:text-accent-hover"
            >
              See all our work &rarr;
            </Link>
          </div>
        </Container>
      </ContentSection>

      <CTASection>
        <Container>
          <CTATitle>Have a project in mind?</CTATitle>
          <CTAText>
            Tell us what you are trying to build and we will tell you honestly whether we
            are the right team for it.
          </CTAText>
          <CTAButton href="/#contact">Start a conversation</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
