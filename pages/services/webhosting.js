import React, { useState, useEffect } from 'react';
import SEO, { createServiceSchema, createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import Image from 'next/image';
import {
  PageContainer, ContentSection, Container,
  SectionTitle, SectionDescription, CardsGrid, Card,
  CTASection, CTATitle, CTAText, CTAButton,
  FeatureImageSection, FeatureImageGrid, FeatureImageWrapper, FeatureTextContent,
  StatsBar, StatItem, StatNumber, StatLabel,
  SplitSection, SplitGrid, SplitText, SplitImage,
  HighlightBox,
} from '../../components/ServicePageLayout';

export default function WebhostingPage() {
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
        title="Web Hosting Services | Lucid Code Labs"
        description="Secure, scalable, and high-performance web hosting solutions tailored to your business needs. We provide reliable infrastructure to keep your digital presence online 24/7."
        path="/services/webhosting"
        jsonLd={[
          createServiceSchema({ name: 'Web Hosting', description: 'Secure, scalable, and high-performance web hosting solutions tailored to your business needs.', path: '/services/webhosting' }),
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'Web Hosting' }]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Reliable, Secure Web Hosting Solutions"
        subtitle="Ensure your digital presence is always online with our enterprise-grade hosting infrastructure, designed for performance, security, and scalability."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Webhosting' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Beyond Basic Hosting: Infrastructure as a Strategic Asset</SectionTitle>
          <SectionDescription>
            In today's digital-first world, your website and web applications are often the primary touchpoint with your customers. At Lucid Code Labs, we approach web hosting as a critical business service that directly impacts user experience, conversion rates, and brand perception.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Performance Optimization</h3>
              <p>Tailored server configurations, content delivery networks, and caching strategies to ensure fast load times across all devices and locations.</p>
            </Card>
            <Card>
              <h3>Security & Compliance</h3>
              <p>Comprehensive security measures including SSL certificates, firewalls, malware scanning, and compliance with industry regulations.</p>
            </Card>
            <Card>
              <h3>Scalability</h3>
              <p>Elastic infrastructure that grows with your business, handling traffic spikes and expanding as your digital presence evolves.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/webhosting.jpg"
              alt="Web hosting server infrastructure"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Hosting You Can Rely On</h3>
            <p>Managed hosting solutions tailored to your application's needs — with monitoring, automatic scaling, and 99.9% uptime so you never have to worry.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>99.99%</StatNumber><StatLabel>Guaranteed Uptime</StatLabel></StatItem>
            <StatItem><StatNumber>&lt;200ms</StatNumber><StatLabel>Global Response Time</StatLabel></StatItem>
            <StatItem><StatNumber>Auto</StatNumber><StatLabel>Scaling on Demand</StatLabel></StatItem>
            <StatItem><StatNumber>24/7</StatNumber><StatLabel>Monitoring & Support</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>A Systematic Approach to Hosting Excellence</SectionTitle>
          <SectionDescription>
            Our proven hosting methodology ensures that your digital presence remains secure, available, and performant at all times.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Requirements Analysis</h3>
              <p>We analyze your application's technical requirements, expected traffic patterns, security needs, and business priorities.</p>
            </Card>
            <Card>
              <h3>Infrastructure Design</h3>
              <p>Based on the analysis, we design a tailored hosting architecture using the most appropriate technologies and platforms.</p>
            </Card>
            <Card>
              <h3>Performance Optimization</h3>
              <p>We implement caching strategies, content delivery networks, and server-side optimizations to ensure maximum speed.</p>
            </Card>
            <Card>
              <h3>Security Implementation</h3>
              <p>We deploy comprehensive security measures including SSL certificates, firewalls, intrusion detection, and regular security audits.</p>
            </Card>
            <Card>
              <h3>Monitoring Setup</h3>
              <p>We establish robust monitoring systems that track performance, uptime, and security, with automated alerts for any issues.</p>
            </Card>
            <Card>
              <h3>Backup & Disaster Recovery</h3>
              <p>We implement automated backup solutions and disaster recovery plans to protect against data loss and minimize downtime.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Hosting Solutions</SectionTitle>
          <SectionDescription>
            Our hosting services cover every aspect of your web infrastructure needs, from basic website hosting to complex, multi-region application deployments.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Shared Hosting</h3>
              <p>Cost-effective hosting solutions for small to medium websites with balanced resources and essential features for reliable performance.</p>
            </Card>
            <Card>
              <h3>VPS Hosting</h3>
              <p>Virtual private servers with dedicated resources offering greater control, scalability, and performance for growing businesses.</p>
            </Card>
            <Card>
              <h3>Dedicated Server Hosting</h3>
              <p>Fully dedicated physical servers providing maximum performance, security, and customization for high-traffic websites and applications.</p>
            </Card>
            <Card>
              <h3>Cloud Hosting</h3>
              <p>Flexible, scalable cloud infrastructure that adapts to your needs in real-time, ensuring optimal resource utilization and cost efficiency.</p>
            </Card>
            <Card>
              <h3>Managed WordPress Hosting</h3>
              <p>Specialized hosting optimized for WordPress sites with automated updates, enhanced security, and performance optimizations.</p>
            </Card>
            <Card>
              <h3>E-commerce Hosting</h3>
              <p>Hosting solutions designed specifically for online stores with PCI compliance, enhanced security, and optimized for conversion.</p>
            </Card>
            <Card>
              <h3>High-Availability Hosting</h3>
              <p>Redundant hosting infrastructure with automatic failover mechanisms to ensure near-zero downtime for mission-critical applications.</p>
            </Card>
            <Card>
              <h3>Content Delivery Network (CDN)</h3>
              <p>Global content distribution networks that cache your website at edge locations worldwide, dramatically improving load times for all users.</p>
            </Card>
            <Card>
              <h3>DevOps-Enabled Hosting</h3>
              <p>Modern hosting environments with CI/CD integration, containerization support, and infrastructure-as-code capabilities for agile development.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection $alt>
        <SplitGrid $reverse>
          <SplitImage>
            <Image src="/images/stock/server-room.jpg" alt="Managed hosting infrastructure" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Hosting That Grows With You</h3>
            <p>Whether you're launching an MVP or handling millions of monthly visitors, our hosting scales seamlessly so performance never suffers.</p>
            <ul>
              <li>Managed deployments with zero-downtime rollouts</li>
              <li>Global CDN for sub-200ms page loads worldwide</li>
              <li>Automated backups with one-click restore</li>
              <li>DDoS protection and WAF included</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <ContentSection>
        <Container>
          <HighlightBox>
            <h3>Tired of Slow, Unreliable Hosting?</h3>
            <p>We'll migrate your site or app to our managed infrastructure — free of charge. Most migrations complete in under 48 hours with zero downtime.</p>
          </HighlightBox>
        </Container>
      </ContentSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Upgrade Your Web Hosting?</CTATitle>
          <CTAText>
            Let's discuss how our hosting solutions can enhance your digital presence with improved performance, security, and reliability. Our team will work with you to design a hosting environment tailored to your specific needs.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Hosting Consultation</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
