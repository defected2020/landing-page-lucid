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
  HighlightBox,
} from '../../components/ServicePageLayout';

export default function DataManagementPage() {
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
        <title>Data Management Services | Lucid Code Labs Software</title>
        <meta name="description" content="Strategic data management solutions to optimize your data ecosystem. We implement secure, scalable, and efficient data infrastructure to turn your data into a valuable asset." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Strategic Data Management Solutions"
        subtitle="Transform your organization's data into a strategic asset with comprehensive data management solutions that ensure quality, security, and accessibility across your enterprise."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Data Management' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Beyond Storage: Data as a Strategic Asset</SectionTitle>
          <SectionDescription>
            In today's data-driven business landscape, organizations are dealing with exponentially growing volumes of data from diverse sources. At Lucid Code Labs, we take a holistic approach to data management that focuses on turning your data ecosystem into a competitive advantage.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Data Architecture</h3>
              <p>Design scalable, flexible data architectures that integrate diverse data sources and support your current and future business needs.</p>
            </Card>
            <Card>
              <h3>Data Governance</h3>
              <p>Establish frameworks that ensure data quality, compliance, and security while enabling appropriate access across your organization.</p>
            </Card>
            <Card>
              <h3>Data Integration</h3>
              <p>Create seamless data flows between systems, applications, and departments for a unified view of your business information.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/data-center.jpg"
              alt="Secure data center infrastructure"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Your Data, Organized and Secure</h3>
            <p>Robust data management solutions that ensure quality, compliance, and accessibility across your entire organization.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>100%</StatNumber><StatLabel>GDPR Compliant</StatLabel></StatItem>
            <StatItem><StatNumber>5x</StatNumber><StatLabel>Query Performance Gain</StatLabel></StatItem>
            <StatItem><StatNumber>99.9%</StatNumber><StatLabel>Data Integrity</StatLabel></StatItem>
            <StatItem><StatNumber>TB-scale</StatNumber><StatLabel>Data Handled</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>A Comprehensive Approach to Data Management</SectionTitle>
          <SectionDescription>
            Our proven data management methodology ensures that your organization establishes a robust foundation for all data-driven initiatives.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Assessment & Strategy</h3>
              <p>We evaluate your current data landscape, business objectives, and challenges to develop a tailored data management strategy.</p>
            </Card>
            <Card>
              <h3>Data Architecture Design</h3>
              <p>We create a blueprint for your data ecosystem that addresses storage, integration, and accessibility requirements.</p>
            </Card>
            <Card>
              <h3>Governance Framework</h3>
              <p>We establish policies, processes, and roles for data ownership, quality management, and compliance.</p>
            </Card>
            <Card>
              <h3>Data Quality Management</h3>
              <p>We implement systems to ensure data accuracy, completeness, consistency, and reliability across your organization.</p>
            </Card>
            <Card>
              <h3>Security & Privacy</h3>
              <p>We design and implement robust security measures that protect sensitive data while ensuring compliance with regulations like GDPR, CCPA, and industry-specific requirements.</p>
            </Card>
            <Card>
              <h3>Master Data Management</h3>
              <p>We create single sources of truth for critical business entities like customers, products, and suppliers.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Data Management Solutions</SectionTitle>
          <SectionDescription>
            Our data management services address every aspect of your data ecosystem, from strategy to implementation and optimization.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Data Strategy Consulting</h3>
              <p>Strategic guidance on how to leverage your data assets to achieve business objectives, including roadmap development and technology selection.</p>
            </Card>
            <Card>
              <h3>Database Design & Optimization</h3>
              <p>Expert design, implementation, and optimization of relational and NoSQL databases for performance, scalability, and reliability.</p>
            </Card>
            <Card>
              <h3>Data Warehousing</h3>
              <p>Implementation of modern data warehousing solutions that consolidate data from multiple sources for reporting and analytics.</p>
            </Card>
            <Card>
              <h3>Data Integration & ETL</h3>
              <p>Development of data pipelines and integration solutions that connect disparate systems and enable seamless data flow across your organization.</p>
            </Card>
            <Card>
              <h3>Data Governance Implementation</h3>
              <p>Establishment of comprehensive governance frameworks including policies, procedures, roles, and tools for effective data management.</p>
            </Card>
            <Card>
              <h3>Data Quality Management</h3>
              <p>Implementation of processes and tools to monitor, measure, and improve the quality of your data assets across the enterprise.</p>
            </Card>
            <Card>
              <h3>Master Data Management</h3>
              <p>Creation of authoritative, single sources of truth for critical business data entities to ensure consistency across systems.</p>
            </Card>
            <Card>
              <h3>Data Architecture Design</h3>
              <p>Design of scalable data architectures that support diverse data types, volumes, and usage patterns while enabling future growth.</p>
            </Card>
            <Card>
              <h3>Data Security & Compliance</h3>
              <p>Design and implementation of robust security measures and compliance frameworks to protect sensitive data and meet regulatory requirements.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection $alt>
        <SplitGrid $reverse>
          <SplitImage>
            <Image src="/images/stock/network-cables.jpg" alt="Data infrastructure cabling" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Data Governance That Actually Works</h3>
            <p>Governance frameworks often gather dust. We build pragmatic, enforceable data governance that teams actually follow — because we make it easy.</p>
            <ul>
              <li>Automated data quality checks and anomaly detection</li>
              <li>Clear data ownership and stewardship models</li>
              <li>Lineage tracking from source to dashboard</li>
              <li>Compliance reporting for GDPR, CCPA, and SOC 2</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <ContentSection>
        <Container>
          <HighlightBox>
            <h3>Drowning in Data Debt?</h3>
            <p>Legacy databases, inconsistent schemas, siloed spreadsheets — we've seen it all. Let us audit your data landscape and build a pragmatic roadmap to get your data house in order.</p>
          </HighlightBox>
        </Container>
      </ContentSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Transform Your Data into a Strategic Asset?</CTATitle>
          <CTAText>
            Let's discuss how our data management solutions can help you achieve your business goals. Our team will work with you to understand your specific challenges and create a tailored approach.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Data Strategy Session</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
