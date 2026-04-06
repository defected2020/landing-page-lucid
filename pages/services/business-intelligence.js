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
} from '../../components/ServicePageLayout';

export default function BusinessIntelligencePage() {
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
        title="Business Intelligence Solutions | Lucid Code Labs"
        description="Transform your business data into powerful insights with our comprehensive business intelligence solutions. Real-time dashboards, automated reporting, and actionable insights."
        path="/services/business-intelligence"
        jsonLd={[
          createServiceSchema({ name: 'Business Intelligence', description: 'Transform your business data into powerful insights with real-time dashboards and automated reporting.', path: '/services/business-intelligence' }),
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'Business Intelligence' }]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Business Intelligence for Data-Driven Decision Making"
        subtitle="Empower your organization with real-time insights, interactive dashboards, and automated reporting systems that transform complex data into clear business opportunities."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Business Intelligence' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Beyond Data Visualization: Intelligence That Drives Action</SectionTitle>
          <SectionDescription>
            In today's complex business environment, organizations are overwhelmed with data but struggling to extract meaningful insights. At Lucid Code Labs, we take a holistic approach to business intelligence that focuses on outcomes rather than just outputs.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Real-time Dashboards</h3>
              <p>Interactive, dynamic visualizations that present key metrics and KPIs in real-time, enabling immediate insights and faster decision-making across your organization.</p>
            </Card>
            <Card>
              <h3>Automated Reporting</h3>
              <p>Scheduled, customizable reports that deliver critical business information to stakeholders automatically, eliminating manual data collection and processing.</p>
            </Card>
            <Card>
              <h3>Self-Service Analytics</h3>
              <p>Intuitive tools that empower business users to explore data, create visualizations, and answer their own questions without relying on technical teams.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/dashboard-analytics.jpg"
              alt="Business intelligence dashboard with data visualizations"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Data-Driven Decision Making</h3>
            <p>Real-time dashboards and strategic reports that integrate with your existing systems, giving you the insights you need to move fast and stay ahead.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>500+</StatNumber><StatLabel>Dashboards Built</StatLabel></StatItem>
            <StatItem><StatNumber>45%</StatNumber><StatLabel>Reporting Time Saved</StatLabel></StatItem>
            <StatItem><StatNumber>12</StatNumber><StatLabel>Data Sources Connected</StatLabel></StatItem>
            <StatItem><StatNumber>99.5%</StatNumber><StatLabel>Data Accuracy</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>A Strategic Framework for Business Intelligence Success</SectionTitle>
          <SectionDescription>
            Our proven methodology for business intelligence implementation ensures high user adoption, maximum ROI, and long-term success.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Business Discovery</h3>
              <p>We begin by understanding your strategic objectives, decision-making processes, and key questions that drive your business forward.</p>
            </Card>
            <Card>
              <h3>Data Assessment</h3>
              <p>We evaluate your existing data sources, quality, and accessibility to create an implementation plan that addresses data integration challenges.</p>
            </Card>
            <Card>
              <h3>BI Strategy & Roadmap</h3>
              <p>We develop a roadmap aligning your BI initiative with business outcomes, defining key metrics, user personas, and implementation priorities.</p>
            </Card>
            <Card>
              <h3>Data Architecture</h3>
              <p>We design a scalable data architecture that integrates multiple sources into a unified, reliable foundation for all analytics.</p>
            </Card>
            <Card>
              <h3>Dashboard & Report Design</h3>
              <p>We create intuitive visualizations that tell compelling data stories, focusing on user experience and actionable insights.</p>
            </Card>
            <Card>
              <h3>User Enablement</h3>
              <p>We provide training and documentation to ensure users can effectively leverage BI tools to drive decision-making across the organization.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Business Intelligence Solutions</SectionTitle>
          <SectionDescription>
            Our business intelligence offerings span the entire analytics lifecycle, from data strategy to implementation and optimization.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Executive Dashboards</h3>
              <p>Strategic dashboards that provide leadership with high-level KPIs, trend analysis, and performance metrics to guide strategic decision-making and monitor company health.</p>
            </Card>
            <Card>
              <h3>Operational Intelligence</h3>
              <p>Real-time monitoring dashboards that provide operational teams with visibility into daily performance, resource utilization, and process efficiency.</p>
            </Card>
            <Card>
              <h3>Sales & Marketing Analytics</h3>
              <p>Comprehensive dashboards that track campaign performance, sales pipeline, customer acquisition costs, and other critical metrics for revenue generation.</p>
            </Card>
            <Card>
              <h3>Financial Intelligence</h3>
              <p>Financial analytics dashboards that provide visibility into profitability, cash flow, budget variance, and other key financial indicators for fiscal management.</p>
            </Card>
            <Card>
              <h3>Customer Analytics</h3>
              <p>Customer-focused dashboards that reveal behavior patterns, satisfaction metrics, segmentation analysis, and lifetime value to improve customer experience.</p>
            </Card>
            <Card>
              <h3>BI Platform Implementation</h3>
              <p>End-to-end implementation of leading BI platforms like Power BI, Tableau, Looker, or custom solutions built on modern data stack technologies.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection>
        <SplitGrid>
          <SplitImage>
            <Image src="/images/stock/analytics-screen.jpg" alt="Business intelligence analytics" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>BI That Evolves With Your Business</h3>
            <p>Markets shift, teams grow, strategies pivot. Your BI infrastructure should keep pace without needing a rebuild every quarter.</p>
            <ul>
              <li>Modular architecture — add new data sources in days, not months</li>
              <li>Role-based dashboards for executives, managers, and analysts</li>
              <li>Embedded analytics you can white-label into your own products</li>
              <li>Training and enablement so your team owns the platform</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Transform Your Data into a Strategic Asset?</CTATitle>
          <CTAText>
            Let's discuss how our business intelligence solutions can help you achieve your business goals and deliver measurable results. Our team will work with you to create a tailored approach.
          </CTAText>
          <CTAButton href="/#contact">Schedule a BI Strategy Session</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
