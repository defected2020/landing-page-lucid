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

export default function ProcessAutomationPage() {
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
        <title>Process Automation Services | Lucid Code Labs Software</title>
        <meta name="description" content="Streamline operations, reduce costs, and eliminate errors with intelligent process automation solutions. Transform manual workflows into efficient digital processes." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Intelligent Process Automation Solutions"
        subtitle="Transform manual, time-consuming workflows into streamlined digital processes that reduce costs, eliminate errors, and free your team to focus on high-value work."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Process Automation' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>From Manual Processes to Intelligent Automation</SectionTitle>
          <SectionDescription>
            In today's competitive business environment, operational efficiency is a critical factor for success. At Lucid Code Labs, we take a strategic approach to process automation that focuses on delivering measurable business outcomes.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>End-to-End Automation</h3>
              <p>Comprehensive solutions that automate entire business processes from start to finish, eliminating manual handoffs and bottlenecks.</p>
            </Card>
            <Card>
              <h3>Intelligent Decision-Making</h3>
              <p>AI-powered automation that can make decisions based on data, rules, and patterns, handling complex scenarios without human intervention.</p>
            </Card>
            <Card>
              <h3>Integration-First Design</h3>
              <p>Automation solutions that seamlessly connect with your existing systems and applications, creating a unified process flow.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/automation.jpg"
              alt="Process automation technology"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Automate the Repetitive, Focus on What Matters</h3>
            <p>We identify bottlenecks in your workflows and build intelligent automation that saves time, reduces errors, and frees your team for higher-value work.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>80%</StatNumber><StatLabel>Manual Tasks Eliminated</StatLabel></StatItem>
            <StatItem><StatNumber>12x</StatNumber><StatLabel>Faster Processing</StatLabel></StatItem>
            <StatItem><StatNumber>0</StatNumber><StatLabel>Human Errors</StatLabel></StatItem>
            <StatItem><StatNumber>6 mo</StatNumber><StatLabel>Average ROI Payback</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>A Systematic Approach to Process Transformation</SectionTitle>
          <SectionDescription>
            Our proven methodology ensures that automation initiatives deliver maximum business value while minimizing implementation risks.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Process Discovery & Analysis</h3>
              <p>We document current workflows, identify inefficiencies, and quantify the potential impact of automation.</p>
            </Card>
            <Card>
              <h3>Process Redesign</h3>
              <p>Before automating, we optimize processes to eliminate unnecessary steps and incorporate best practices.</p>
            </Card>
            <Card>
              <h3>Technology Selection</h3>
              <p>We identify the most appropriate automation technologies based on your specific requirements, existing systems, and long-term objectives.</p>
            </Card>
            <Card>
              <h3>Solution Design</h3>
              <p>Our team designs the automated workflow, including integration points, business rules, exception handling, and user interfaces.</p>
            </Card>
            <Card>
              <h3>Development & Testing</h3>
              <p>We develop custom automation solutions and rigorously test across all scenarios, including edge cases and exceptions.</p>
            </Card>
            <Card>
              <h3>Deployment & Monitoring</h3>
              <p>After implementation, we establish monitoring systems to track performance metrics and identify opportunities for continuous improvement.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Process Automation Solutions</SectionTitle>
          <SectionDescription>
            Our process automation services address a wide range of business needs, from simple task automation to complex enterprise-wide transformation.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Robotic Process Automation (RPA)</h3>
              <p>Implementation of software robots that mimic human interactions with digital systems, automating repetitive tasks across applications without changing existing infrastructure.</p>
            </Card>
            <Card>
              <h3>Business Process Automation (BPA)</h3>
              <p>End-to-end automation of complex business processes, integrating multiple systems and incorporating business rules and decision logic.</p>
            </Card>
            <Card>
              <h3>Workflow Automation</h3>
              <p>Design and implementation of automated workflows that route information, assign tasks, and track progress through multi-step business processes.</p>
            </Card>
            <Card>
              <h3>Document Automation</h3>
              <p>Intelligent capture, processing, and routing of documents with automated data extraction, validation, and integration with core business systems.</p>
            </Card>
            <Card>
              <h3>AI-Powered Automation</h3>
              <p>Integration of artificial intelligence technologies like machine learning, natural language processing, and computer vision to automate complex cognitive tasks.</p>
            </Card>
            <Card>
              <h3>Integration Solutions</h3>
              <p>Creation of custom APIs and integration solutions that connect disparate systems to enable seamless process automation across your technology ecosystem.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection>
        <SplitGrid>
          <SplitImage>
            <Image src="/images/stock/robot-hand.jpg" alt="Automation and robotics" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Start Small, Scale Fast</h3>
            <p>You don't need to automate everything at once. We identify your highest-impact, lowest-risk processes first — proving value before scaling.</p>
            <ul>
              <li>Process mining to discover hidden automation opportunities</li>
              <li>RPA for legacy systems without API access</li>
              <li>AI-powered document processing and data extraction</li>
              <li>Human-in-the-loop workflows for complex decisions</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Transform Your Business Processes?</CTATitle>
          <CTAText>
            Let's discuss how our process automation solutions can help your organization reduce costs, improve efficiency, and create exceptional experiences for both customers and employees.
          </CTAText>
          <CTAButton href="/#contact">Schedule an Automation Consultation</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
