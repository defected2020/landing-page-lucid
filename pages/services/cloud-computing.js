import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import Image from 'next/image';
import {
  PageContainer, ContentSection, Container,
  SectionTitle, SectionDescription, CardsGrid, Card,
  TechTabs, Tab, TechContent,
  CTASection, CTATitle, CTAText, CTAButton,
  FeatureImageSection, FeatureImageGrid, FeatureImageWrapper, FeatureTextContent,
  StatsBar, StatItem, StatNumber, StatLabel,
  SplitSection, SplitGrid, SplitText, SplitImage,
} from '../../components/ServicePageLayout';

export default function CloudComputingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('infrastructure');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageContainer>
      <Head>
        <title>Cloud Computing Services | Lucid Code Labs</title>
        <meta name="description" content="Transform your business with our enterprise cloud computing solutions. Secure, scalable infrastructure, platform services, and cloud-native applications." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Enterprise Cloud Computing Solutions"
        subtitle="Accelerate innovation, enhance scalability, and optimize costs with our comprehensive cloud computing services tailored to your business needs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Cloud Computing' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Strategic Cloud Transformation</SectionTitle>
          <SectionDescription>
            The cloud is not just a technology shift -- it's a business transformation enabler. At Lucid Code Labs, we take a business-first approach to cloud computing, helping you develop a comprehensive cloud strategy aligned with your goals.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Business Agility</h3>
              <p>Rapidly adapt to changing market conditions with on-demand resources, elastic scalability, and global reach that traditional infrastructure cannot match.</p>
            </Card>
            <Card>
              <h3>Cost Optimization</h3>
              <p>Transform capital expenditure into operational costs, pay only for what you use, and benefit from economies of scale that drastically reduce infrastructure expenses.</p>
            </Card>
            <Card>
              <h3>Innovation Acceleration</h3>
              <p>Access cutting-edge technologies like AI, machine learning, IoT, and serverless computing without massive upfront investment or specialized expertise.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/cloud-servers.jpg"
              alt="Cloud server infrastructure"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Scalable Cloud Infrastructure</h3>
            <p>We design and deploy cloud architectures that grow with your business — optimized for performance, security, and cost efficiency across AWS, GCP, and Azure.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>99.99%</StatNumber><StatLabel>Uptime SLA</StatLabel></StatItem>
            <StatItem><StatNumber>50%</StatNumber><StatLabel>Infrastructure Cost Savings</StatLabel></StatItem>
            <StatItem><StatNumber>3x</StatNumber><StatLabel>Deployment Speed</StatLabel></StatItem>
            <StatItem><StatNumber>Zero</StatNumber><StatLabel>Data Breaches</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>Proven Cloud Transformation Framework</SectionTitle>
          <SectionDescription>
            Our cloud transformation methodology ensures a smooth, secure, and value-driven journey to the cloud.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Assessment & Discovery</h3>
              <p>We analyze your existing systems, applications, and infrastructure to identify migration candidates, dependencies, and potential challenges.</p>
            </Card>
            <Card>
              <h3>Strategy & Roadmap</h3>
              <p>We develop a comprehensive cloud strategy and migration roadmap aligned with your business objectives, compliance requirements, and technical constraints.</p>
            </Card>
            <Card>
              <h3>Architecture & Design</h3>
              <p>We design future-state cloud architecture that optimizes for performance, security, scalability, and cost-efficiency.</p>
            </Card>
            <Card>
              <h3>Migration & Modernization</h3>
              <p>We execute the migration using the appropriate strategy for each workload -- rehost, replatform, refactor, or replace -- while minimizing business disruption.</p>
            </Card>
            <Card>
              <h3>Security & Governance</h3>
              <p>We implement robust security controls, identity management, and governance frameworks to protect your data and ensure compliance.</p>
            </Card>
            <Card>
              <h3>Operations & Optimization</h3>
              <p>We establish cloud operations processes, implement monitoring and automation, and continuously optimize for performance and cost.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Cloud Solutions</SectionTitle>
          <SectionDescription>
            Our cloud computing services span the entire spectrum of cloud capabilities -- from infrastructure and platform services to application modernization and DevOps transformation.
          </SectionDescription>

          <TechTabs>
            <Tab $active={activeTab === 'infrastructure'} onClick={() => setActiveTab('infrastructure')}>
              Infrastructure Services
            </Tab>
            <Tab $active={activeTab === 'platform'} onClick={() => setActiveTab('platform')}>
              Platform Services
            </Tab>
            <Tab $active={activeTab === 'application'} onClick={() => setActiveTab('application')}>
              Application Services
            </Tab>
            <Tab $active={activeTab === 'management'} onClick={() => setActiveTab('management')}>
              Management Services
            </Tab>
          </TechTabs>

          <TechContent>
            {activeTab === 'infrastructure' && (
              <div>
                <h3>Cloud Infrastructure Services</h3>
                <p>
                  Build a resilient, secure, and scalable foundation for your applications and data. Our infrastructure services include assessment and design, migration of physical and virtual servers, hybrid and multi-cloud solutions, cloud network design, backup and disaster recovery, and high-performance computing solutions.
                </p>
              </div>
            )}

            {activeTab === 'platform' && (
              <div>
                <h3>Cloud Platform Services</h3>
                <p>
                  Accelerate application development and deployment with container orchestration using Kubernetes, serverless architectures, database modernization, API management, integration services, and messaging and event streaming platforms for reliable, scalable communication.
                </p>
              </div>
            )}

            {activeTab === 'application' && (
              <div>
                <h3>Cloud Application Services</h3>
                <p>
                  Modernize your applications to fully leverage cloud capabilities. Our services include application portfolio assessment, lift and shift migration, application modernization and refactoring, cloud-native development with microservices, SaaS integration, and DevOps transformation with CI/CD pipelines.
                </p>
              </div>
            )}

            {activeTab === 'management' && (
              <div>
                <h3>Cloud Management Services</h3>
                <p>
                  Optimize and govern your cloud environment with cost optimization through right-sizing and reserved instances, comprehensive security and compliance frameworks, performance monitoring and observability, automation and orchestration, site reliability engineering, and Cloud Center of Excellence establishment.
                </p>
              </div>
            )}
          </TechContent>
        </Container>
      </ContentSection>

      <SplitSection>
        <SplitGrid>
          <SplitImage>
            <Image src="/images/stock/server-room.jpg" alt="Modern cloud data center" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Cloud Migration Without the Chaos</h3>
            <p>Moving to the cloud doesn't have to mean months of downtime and uncertainty. Our proven migration framework gets you there safely.</p>
            <ul>
              <li>Zero-downtime migration strategies</li>
              <li>Automated infrastructure as code with Terraform and Pulumi</li>
              <li>Cost optimization reviews — most clients save 30-50%</li>
              <li>24/7 monitoring and incident response from day one</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Accelerate Your Cloud Journey?</CTATitle>
          <CTAText>
            Whether you're just starting your cloud journey or looking to optimize an existing cloud environment, our experts can help you achieve your business objectives while maximizing the value of your cloud investments.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Cloud Strategy Consultation</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
