import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import services from '../../data/services';
import { getServiceIcon } from '../../components/icons/ServiceIcons';
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

const ServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ServiceCard = styled(motion.div)`
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-fast), transform var(--transition-fast);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);

    .card-image img {
      transform: scale(1.05);
    }
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, var(--bg-elevated), transparent);
    z-index: 1;
  }

  img {
    transition: transform 0.4s ease;
  }
`;

const CardContent = styled.div`
  padding: 1.25rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const IconWrapper = styled.div`
  color: var(--accent);
  margin-bottom: 1.25rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.75rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const LearnMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--accent);
  margin-top: auto;
  transition: gap var(--transition-fast);

  &:hover {
    gap: 0.625rem;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ApproachSection = styled.section`
  padding: var(--section-padding) 0;
  background-color: var(--bg-subtle);
`;

const ApproachGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

const ApproachTitle = styled.h2`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1.5rem;
`;

const ApproachText = styled.p`
  font-size: 0.9375rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const ApproachList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ApproachItem = styled.li`
  color: var(--text-muted);
  font-size: 0.9375rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  padding-left: 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--accent);
  }
`;

const ApproachVisual = styled.div`
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  min-height: 400px;
  border: 1px solid var(--border);
`;

export default function ServicesPage() {
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
        <title>Our Services | Lucid Code Labs</title>
        <meta name="description" content="Explore our comprehensive range of digital services designed to help your business innovate, grow, and succeed in the digital world." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Strategic Solutions for Your Digital Success"
        subtitle="We're not just service providers — we're your strategic partners in navigating the complex digital landscape."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
      />

      <GridSection>
        <Container>
          <ServicesGrid
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => {
              const Icon = getServiceIcon(service.iconName);
              return (
                <Link key={service.id} href={service.link} style={{ textDecoration: 'none' }}>
                  <ServiceCard variants={fadeInUp}>
                    {service.image && (
                      <CardImageWrapper className="card-image">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </CardImageWrapper>
                    )}
                    <CardContent>
                      <IconWrapper>
                        <Icon size={28} />
                      </IconWrapper>
                      <ServiceTitle>{service.title}</ServiceTitle>
                      <ServiceDescription>{service.description}</ServiceDescription>
                      <LearnMore>
                        Learn more
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </LearnMore>
                    </CardContent>
                  </ServiceCard>
                </Link>
              );
            })}
          </ServicesGrid>
        </Container>
      </GridSection>

      <ApproachSection>
        <Container>
          <ApproachGrid>
            <div>
              <ApproachTitle>Our Consultative Approach</ApproachTitle>
              <ApproachText>
                We believe that successful digital solutions begin with a deep understanding of your business. Our approach centers on becoming your trusted advisor.
              </ApproachText>
              <ApproachList>
                <ApproachItem>We begin by thoroughly understanding your business goals, challenges, and unique market position.</ApproachItem>
                <ApproachItem>Our experts analyze your current state and identify opportunities for innovation and transformation.</ApproachItem>
                <ApproachItem>We create tailored strategies designed to achieve your specific objectives and deliver measurable outcomes.</ApproachItem>
                <ApproachItem>Throughout implementation, we maintain clear communication and keep you involved in key decisions.</ApproachItem>
                <ApproachItem>Post-launch, we provide ongoing support and strategic guidance to ensure long-term success.</ApproachItem>
              </ApproachList>
            </div>
            <ApproachVisual>
              <Image
                src="/images/stock/strategy-meeting.jpg"
                alt="Team collaborating on digital strategy"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </ApproachVisual>
          </ApproachGrid>
        </Container>
      </ApproachSection>

      <Footer />
    </>
  );
}
