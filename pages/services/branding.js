import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
} from '../../components/ServicePageLayout';

export default function BrandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageContainer>
      <Head>
        <title>Branding & Visual Identity Services | Lucid Code Labs Software</title>
        <meta name="description" content="Create a powerful brand identity that resonates with your audience and differentiates your business. Our strategic branding solutions build recognition, trust, and loyalty." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Strategic Branding & Visual Identity"
        subtitle="Build a distinctive, memorable brand that communicates your unique value and creates meaningful connections with your target audience."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Branding & Visual Identity' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Brand as a Strategic Business Asset</SectionTitle>
          <SectionDescription>
            In today's crowded marketplace, a strong brand is essential for standing out, building trust, and creating lasting customer relationships. At Lucid Code Labs, we approach branding as a strategic business initiative that directly impacts your organization's growth and success.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Strategic Foundation</h3>
              <p>Research-driven brand strategies that align with your business objectives and resonate with your target audience.</p>
            </Card>
            <Card>
              <h3>Distinctive Identity</h3>
              <p>Memorable visual systems that capture your brand's essence and create recognition in a crowded marketplace.</p>
            </Card>
            <Card>
              <h3>Consistent Implementation</h3>
              <p>Comprehensive guidelines and assets that ensure brand consistency across all channels and touchpoints.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/branding.jpg"
              alt="Brand design workspace with color palettes"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Brands That Stand Out</h3>
            <p>We craft visual identities that resonate with your audience and differentiate you in the market — from logo systems to comprehensive brand guidelines.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>50+</StatNumber><StatLabel>Brands Crafted</StatLabel></StatItem>
            <StatItem><StatNumber>90%</StatNumber><StatLabel>Client Retention</StatLabel></StatItem>
            <StatItem><StatNumber>3–6 wk</StatNumber><StatLabel>Brand Delivery</StatLabel></StatItem>
            <StatItem><StatNumber>Full</StatNumber><StatLabel>IP Ownership</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>A Strategic Process for Building Powerful Brands</SectionTitle>
          <SectionDescription>
            Our proven branding methodology ensures that your brand identity is built on solid strategic foundations and effectively communicates your unique value.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Discovery & Research</h3>
              <p>We conduct in-depth research into your industry, competitors, target audience, and internal stakeholders to understand perceptions, expectations, and opportunities.</p>
            </Card>
            <Card>
              <h3>Brand Strategy Development</h3>
              <p>Based on our research, we define your brand positioning, personality, values, value proposition, and messaging framework -- the strategic elements that guide all brand expressions.</p>
            </Card>
            <Card>
              <h3>Visual Identity Design</h3>
              <p>We create distinctive visual elements including logo, color palette, typography, imagery style, and design system that capture your brand's essence and create recognition.</p>
            </Card>
            <Card>
              <h3>Brand Voice & Messaging</h3>
              <p>We develop a consistent brand voice and key messages that communicate your value proposition clearly and resonate with your target audience.</p>
            </Card>
            <Card>
              <h3>Brand Guidelines</h3>
              <p>We document comprehensive guidelines that ensure consistent application of your brand across all touchpoints and by all team members.</p>
            </Card>
            <Card>
              <h3>Implementation Support</h3>
              <p>We provide guidance and assistance in rolling out your new or refreshed brand across all channels and touchpoints, with ongoing support for brand management.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Branding Solutions</SectionTitle>
          <SectionDescription>
            Our branding services cover every aspect of creating, refreshing, and implementing powerful brand identities.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Brand Strategy</h3>
              <p>Research-driven development of brand positioning, personality, values, and messaging frameworks that align with your business objectives.</p>
            </Card>
            <Card>
              <h3>Logo Design</h3>
              <p>Creation of distinctive, versatile logos and marks that become recognizable symbols of your brand identity.</p>
            </Card>
            <Card>
              <h3>Visual Identity Systems</h3>
              <p>Development of comprehensive visual frameworks including color palettes, typography, imagery styles, and design elements.</p>
            </Card>
            <Card>
              <h3>Brand Guidelines</h3>
              <p>Creation of detailed documentation for consistent application of your brand across all touchpoints and by all team members.</p>
            </Card>
            <Card>
              <h3>Brand Voice & Messaging</h3>
              <p>Development of distinctive tone, language, and key messages that communicate your brand's personality and value proposition.</p>
            </Card>
            <Card>
              <h3>Marketing Collateral</h3>
              <p>Design of business cards, stationery, brochures, presentation templates, and other print materials that showcase your brand.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection>
        <SplitGrid>
          <SplitImage>
            <Image src="/images/stock/brand-design.jpg" alt="Brand identity design process" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>More Than a Logo</h3>
            <p>A brand is every touchpoint your customer experiences. We design systems — not just assets — that work across every channel and scale with your growth.</p>
            <ul>
              <li>Logo system with responsive variants for every context</li>
              <li>Typography, color, and component design tokens</li>
              <li>Brand voice and messaging guidelines</li>
              <li>Digital-first assets: social templates, email signatures, presentations</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Build a Powerful Brand?</CTATitle>
          <CTAText>
            Let's discuss how our branding solutions can help your organization create meaningful connections with your audience and stand out in your market.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Brand Strategy Session</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
