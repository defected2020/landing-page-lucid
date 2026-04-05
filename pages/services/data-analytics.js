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

export default function DataAnalyticsPage() {
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
        <title>Data Analytics Services | Lucid Code Labs Software</title>
        <meta name="description" content="Turn raw data into actionable insights with our data analytics solutions. We help you make informed decisions and identify new business opportunities." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Data-Driven Insights for Strategic Decision Making"
        subtitle="Transform your raw data into actionable intelligence that drives business growth, operational efficiency, and competitive advantage in today's data-rich environment."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Data Analytics' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Beyond Reports: Actionable Intelligence</SectionTitle>
          <SectionDescription>
            In today's business landscape, data is abundant but insights are scarce. At Lucid Code Labs, we take a business-first approach to data analytics, designing solutions that deliver relevant insights directly aligned with your business goals.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Descriptive Analytics</h3>
              <p>Understand what has happened in your business through comprehensive data visualization, dashboards, and reports that make complex data easy to comprehend and act upon.</p>
            </Card>
            <Card>
              <h3>Diagnostic Analytics</h3>
              <p>Discover why events occurred through root cause analysis and correlation studies that identify the drivers behind your business outcomes and performance trends.</p>
            </Card>
            <Card>
              <h3>Predictive Analytics</h3>
              <p>Anticipate future outcomes with statistical models and machine learning algorithms that identify patterns in your data to forecast trends and future scenarios.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/dashboard-analytics.jpg"
              alt="Data analytics dashboard"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>From Raw Data to Clear Insights</h3>
            <p>Custom analytics pipelines and visualization tools that help you uncover patterns, predict outcomes, and make confident, data-backed decisions.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>10M+</StatNumber><StatLabel>Data Points Processed Daily</StatLabel></StatItem>
            <StatItem><StatNumber>60%</StatNumber><StatLabel>Faster Decision Making</StatLabel></StatItem>
            <StatItem><StatNumber>35%</StatNumber><StatLabel>Average Revenue Uplift</StatLabel></StatItem>
            <StatItem><StatNumber>Real-time</StatNumber><StatLabel>Dashboard Updates</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>How We Transform Data into Value</SectionTitle>
          <SectionDescription>
            Our data analytics methodology follows a structured yet flexible approach designed to deliver quick wins while building toward long-term analytics maturity.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Discovery & Assessment</h3>
              <p>We evaluate your current data ecosystem, business objectives, and analytics capabilities to identify opportunities and challenges.</p>
            </Card>
            <Card>
              <h3>Data Strategy</h3>
              <p>We develop a roadmap that outlines how to leverage your data assets to achieve specific business outcomes, including governance and technology selection.</p>
            </Card>
            <Card>
              <h3>Data Architecture</h3>
              <p>We design or optimize your data infrastructure to ensure data quality, accessibility, and security -- creating a solid foundation for all analytics initiatives.</p>
            </Card>
            <Card>
              <h3>Analytics Development</h3>
              <p>We build custom analytics solutions, from interactive dashboards to complex predictive models, that address your specific business questions.</p>
            </Card>
            <Card>
              <h3>Insight Activation</h3>
              <p>We integrate analytics into your business processes and decision-making workflows to ensure insights drive tangible actions.</p>
            </Card>
            <Card>
              <h3>Continuous Improvement</h3>
              <p>We monitor performance, gather feedback, and refine analytics solutions to deliver increasing value over time with knowledge transfer and capability building.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Data Analytics Solutions</SectionTitle>
          <SectionDescription>
            Our data analytics services can be tailored to address specific challenges or delivered as end-to-end solutions.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Business Intelligence</h3>
              <p>Interactive dashboards and reporting solutions that provide real-time visibility into key performance indicators and business metrics across your organization.</p>
            </Card>
            <Card>
              <h3>Customer Analytics</h3>
              <p>Deep insights into customer behavior, preferences, and journeys that enable personalized experiences, targeted marketing, and improved customer satisfaction.</p>
            </Card>
            <Card>
              <h3>Operational Analytics</h3>
              <p>Performance analysis and optimization solutions that identify inefficiencies, reduce costs, and streamline processes across your business operations.</p>
            </Card>
            <Card>
              <h3>Predictive Modeling</h3>
              <p>Advanced statistical models and machine learning algorithms that forecast sales, demand, customer churn, and other critical business outcomes.</p>
            </Card>
            <Card>
              <h3>Data Visualization</h3>
              <p>Intuitive visual representations of complex data that make insights accessible and actionable for stakeholders across your organization.</p>
            </Card>
            <Card>
              <h3>Analytics Training & Enablement</h3>
              <p>Customized training programs and workshops that build data literacy and analytical capabilities within your organization.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection>
        <SplitGrid $reverse>
          <SplitImage>
            <Image src="/images/stock/data-viz.jpg" alt="Data visualization dashboard" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>From Insight to Action</h3>
            <p>Beautiful dashboards are meaningless if they don't drive decisions. We build analytics solutions that connect directly to your workflows.</p>
            <ul>
              <li>Automated alerts when KPIs deviate from targets</li>
              <li>Self-service reporting for non-technical stakeholders</li>
              <li>Predictive models that forecast trends before they happen</li>
              <li>Integration with Slack, email, and your existing tools</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Transform Your Data into Business Value?</CTATitle>
          <CTAText>
            Let's discuss how our data analytics solutions can help you achieve your business goals. Our team will work with you to understand your specific challenges and create a tailored solution.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Data Strategy Session</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
