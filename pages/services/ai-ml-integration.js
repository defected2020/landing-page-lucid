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

export default function AIMLIntegrationPage() {
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
        title="AI & Machine Learning Integration | Lucid Code Labs"
        description="Enhance your existing systems with AI & ML capabilities. From natural language processing to computer vision and predictive analytics, we integrate intelligent solutions into your business."
        path="/services/ai-ml-integration"
        jsonLd={[
          createServiceSchema({ name: 'AI & Machine Learning Integration', description: 'Enhance your existing systems with AI & ML capabilities — NLP, computer vision, and predictive analytics.', path: '/services/ai-ml-integration' }),
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'AI & ML Integration' }]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="AI & Machine Learning Integration"
        subtitle="Enhance your existing systems with intelligent capabilities that transform data into insights, automate processes, and deliver personalized experiences to your customers."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'AI & ML Integration' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Seamless Integration of Intelligence</SectionTitle>
          <SectionDescription>
            In today's competitive landscape, businesses are looking for ways to leverage artificial intelligence and machine learning without completely overhauling their existing technology infrastructure. At Lucid Code Labs, we take a pragmatic approach to AI integration, identifying strategic points in your existing workflows where AI can create the most value.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Intelligent Automation</h3>
              <p>Enhance your business processes with AI-powered automation that can handle complex decision-making, adapt to changing conditions, and continuously improve over time.</p>
            </Card>
            <Card>
              <h3>Predictive Capabilities</h3>
              <p>Integrate predictive models into your applications that forecast trends, identify opportunities, and anticipate potential issues before they impact your business.</p>
            </Card>
            <Card>
              <h3>Personalization Engines</h3>
              <p>Add machine learning-driven personalization to your customer touchpoints that deliver tailored experiences, recommendations, and interactions.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>40%</StatNumber><StatLabel>Average Cost Reduction</StatLabel></StatItem>
            <StatItem><StatNumber>3x</StatNumber><StatLabel>Processing Speed Gain</StatLabel></StatItem>
            <StatItem><StatNumber>95%+</StatNumber><StatLabel>Model Accuracy Target</StatLabel></StatItem>
            <StatItem><StatNumber>24/7</StatNumber><StatLabel>Automated Monitoring</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/ai-ml.jpg"
              alt="AI and machine learning visualization"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Intelligence Embedded in Every Layer</h3>
            <p>From natural language processing to computer vision, we integrate AI capabilities that transform how your systems understand and respond to data.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>How We Integrate AI Into Your Systems</SectionTitle>
          <SectionDescription>
            Our proven AI integration framework ensures that intelligence is seamlessly woven into your existing technology ecosystem.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Discovery & Assessment</h3>
              <p>We analyze your business objectives, current systems, and data infrastructure to identify the highest-value opportunities for AI integration.</p>
            </Card>
            <Card>
              <h3>Solution Design</h3>
              <p>We develop a tailored integration plan that outlines the AI capabilities, data requirements, integration points, and expected outcomes.</p>
            </Card>
            <Card>
              <h3>Data Preparation</h3>
              <p>We assist with data cleansing, structuring, and enrichment to ensure your AI models have the quality inputs they need to generate valuable outputs.</p>
            </Card>
            <Card>
              <h3>Model Development</h3>
              <p>We build custom AI models or select and adapt pre-trained solutions based on your specific requirements and use cases.</p>
            </Card>
            <Card>
              <h3>Integration & API Development</h3>
              <p>We create secure and efficient interfaces between your existing systems and new AI components for seamless interaction.</p>
            </Card>
            <Card>
              <h3>Testing & Deployment</h3>
              <p>We rigorously test the integrated solution, deploy AI capabilities, and establish monitoring systems to track performance and identify areas for improvement.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>AI Technologies We Integrate</SectionTitle>
          <SectionDescription>
            Our AI integration services span a wide range of technologies that can be incorporated into your existing systems.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Natural Language Processing</h3>
              <p>Add the ability to understand, interpret, and generate human language to your applications, enabling chatbots, sentiment analysis, content summarization, and more.</p>
            </Card>
            <Card>
              <h3>Computer Vision</h3>
              <p>Integrate visual recognition capabilities that can analyze images and video to identify objects, faces, scenes, and activities for various business applications.</p>
            </Card>
            <Card>
              <h3>Predictive Analytics</h3>
              <p>Incorporate statistical models and machine learning algorithms that identify patterns in your data to forecast future outcomes and behavior.</p>
            </Card>
            <Card>
              <h3>Recommendation Systems</h3>
              <p>Embed intelligent recommendation engines that analyze user behavior and preferences to suggest relevant products, content, or actions.</p>
            </Card>
            <Card>
              <h3>Anomaly Detection</h3>
              <p>Implement systems that can identify unusual patterns in your data, highlighting potential issues, fraud, or opportunities that might otherwise go unnoticed.</p>
            </Card>
            <Card>
              <h3>Decision Support Systems</h3>
              <p>Add AI-powered analytics and recommendations to your business applications that help users make better, data-driven decisions.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <SplitSection>
        <SplitGrid>
          <SplitImage>
            <Image src="/images/stock/ai-abstract.jpg" alt="AI neural network visualization" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Responsible AI, Built to Last</h3>
            <p>We build AI systems with transparency, fairness, and long-term maintainability at their core — not as afterthoughts.</p>
            <ul>
              <li>Bias detection and mitigation at every stage</li>
              <li>Explainable AI — understand why your models decide what they decide</li>
              <li>Continuous model monitoring and drift detection</li>
              <li>Full compliance with GDPR and emerging AI regulation</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <ContentSection $alt>
        <Container>
          <HighlightBox>
            <h3>Not Sure Where AI Fits in Your Business?</h3>
            <p>Book a free 30-minute discovery call with our AI strategists. We'll assess your data landscape, identify high-impact opportunities, and outline a pragmatic roadmap — no obligation.</p>
          </HighlightBox>
        </Container>
      </ContentSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Enhance Your Systems with AI?</CTATitle>
          <CTAText>
            Let's discuss how AI and machine learning integration can help you achieve your business goals. Our team will work with you to identify the most impactful opportunities for intelligent enhancement.
          </CTAText>
          <CTAButton href="/#contact">Schedule an AI Integration Consultation</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
