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

export default function DigitalGrowthPage() {
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
        title="Digital Growth & Performance Services | Lucid Code Labs"
        description="Accelerate your business growth with data-driven digital marketing strategies. Optimize your online presence, increase conversions, and maximize ROI across channels."
        path="/services/digital-growth"
        jsonLd={[
          createServiceSchema({ name: 'Digital Growth & Performance', description: 'Data-driven digital marketing strategies to optimize your online presence and maximize ROI.', path: '/services/digital-growth' }),
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'Digital Growth' }]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Strategic Digital Growth & Performance"
        subtitle="Accelerate your business with data-driven digital marketing strategies that optimize your online presence, increase conversions, and maximize ROI across all channels."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Digital Growth & Performance' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Growth-Driven Digital Strategy</SectionTitle>
          <SectionDescription>
            In today's digital landscape, businesses face increasing competition for customer attention. At Lucid Code Labs, we approach digital growth as a systematic process that combines strategic thinking, creative execution, and continuous optimization.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Data-Driven Decisions</h3>
              <p>Strategic marketing initiatives based on comprehensive data analysis and audience insights rather than assumptions.</p>
            </Card>
            <Card>
              <h3>Conversion Optimization</h3>
              <p>Systematic approach to improving user experience and messaging to increase conversion rates across all digital touchpoints.</p>
            </Card>
            <Card>
              <h3>Multi-Channel Strategy</h3>
              <p>Cohesive approach that integrates multiple digital channels to create seamless customer journeys that drive growth.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/digital-growth.jpg"
              alt="Digital growth metrics and analytics"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Growth That Compounds</h3>
            <p>Strategic optimization across every digital channel — from SEO and conversion rate optimization to performance marketing and analytics-driven iteration.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>3.2x</StatNumber><StatLabel>Average ROAS</StatLabel></StatItem>
            <StatItem><StatNumber>150%</StatNumber><StatLabel>Organic Traffic Growth</StatLabel></StatItem>
            <StatItem><StatNumber>45%</StatNumber><StatLabel>Conversion Rate Lift</StatLabel></StatItem>
            <StatItem><StatNumber>Weekly</StatNumber><StatLabel>Performance Reports</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>The Science Behind Digital Growth</SectionTitle>
          <SectionDescription>
            Our proven methodology ensures that your digital marketing initiatives are strategic, measurable, and consistently optimized for maximum performance.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Discovery & Analysis</h3>
              <p>We conduct comprehensive audits of your current digital presence, analyze competitor strategies, and identify market opportunities and audience insights.</p>
            </Card>
            <Card>
              <h3>Strategy Development</h3>
              <p>Based on our analysis, we create a tailored digital strategy that defines target audiences, channels, messaging, and specific KPIs aligned with your business objectives.</p>
            </Card>
            <Card>
              <h3>Conversion Funnel Optimization</h3>
              <p>We map the customer journey and optimize each stage of your conversion funnel to guide prospects smoothly from awareness to conversion.</p>
            </Card>
            <Card>
              <h3>Content & Creative Development</h3>
              <p>We create compelling, audience-centric content and creative assets that resonate with your target audience and support your strategic objectives.</p>
            </Card>
            <Card>
              <h3>Campaign Execution</h3>
              <p>We implement integrated campaigns across appropriate channels, ensuring consistent messaging and optimal resource allocation.</p>
            </Card>
            <Card>
              <h3>Continuous Optimization</h3>
              <p>We employ A/B testing, performance analysis, and iterative improvements to continuously enhance campaign effectiveness and ROI.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Digital Growth Solutions</SectionTitle>
          <SectionDescription>
            Our digital growth services encompass every aspect of online marketing and performance optimization.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Digital Strategy</h3>
              <p>Development of comprehensive digital marketing strategies that align with your business objectives and provide a roadmap for growth.</p>
            </Card>
            <Card>
              <h3>Search Engine Optimization (SEO)</h3>
              <p>Technical and content optimization to improve organic search visibility and drive qualified traffic to your website.</p>
            </Card>
            <Card>
              <h3>Pay-Per-Click Advertising (PPC)</h3>
              <p>Strategic paid search and display advertising campaigns that maximize ROI through targeted audience segmentation and optimization.</p>
            </Card>
            <Card>
              <h3>Social Media Marketing</h3>
              <p>Strategic organic and paid social media campaigns that build brand awareness, engagement, and conversions across relevant platforms.</p>
            </Card>
            <Card>
              <h3>Conversion Rate Optimization (CRO)</h3>
              <p>Data-driven analysis and testing to improve website performance and increase the percentage of visitors who take desired actions.</p>
            </Card>
            <Card>
              <h3>Email & Marketing Automation</h3>
              <p>Personalized email campaigns and automation workflows that nurture leads, build relationships, and drive conversions throughout the customer lifecycle.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection $alt>
        <SplitGrid $reverse>
          <SplitImage>
            <Image src="/images/stock/marketing-growth.jpg" alt="Digital marketing strategy" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Growth Is a System, Not a Hack</h3>
            <p>We don't chase vanity metrics. Every tactic we deploy is tied to revenue impact and measured with rigour.</p>
            <ul>
              <li>Full-funnel attribution from first touch to closed deal</li>
              <li>A/B testing frameworks with statistical significance</li>
              <li>SEO technical audits and content strategy</li>
              <li>Paid media management across Google, Meta, and LinkedIn</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <ContentSection>
        <Container>
          <HighlightBox>
            <h3>Free Growth Audit</h3>
            <p>We'll analyze your current digital presence — SEO health, conversion bottlenecks, and competitive positioning — and deliver a prioritized action plan. No strings attached.</p>
          </HighlightBox>
        </Container>
      </ContentSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Accelerate Your Digital Growth?</CTATitle>
          <CTAText>
            Let's discuss how our data-driven digital marketing strategies can help your business attract more customers, increase conversions, and maximize ROI across all digital channels.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Digital Strategy Session</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
