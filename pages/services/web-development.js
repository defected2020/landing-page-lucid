import React, { useState, useEffect } from 'react';
import SEO, { createServiceSchema, createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import Image from 'next/image';
import {
  PageContainer, ContentSection, Container,
  SectionTitle, SectionDescription, CardsGrid, Card,
  ProcessStep, StepNumber, StepContent,
  TechTabs, Tab, TechContent,
  CTASection, CTATitle, CTAText, CTAButton,
  FeatureImageSection, FeatureImageGrid, FeatureImageWrapper, FeatureTextContent,
  StatsBar, StatItem, StatNumber, StatLabel,
  SplitSection, SplitGrid, SplitText, SplitImage,
} from '../../components/ServicePageLayout';

export default function WebDevelopment() {
  const [activeTech, setActiveTech] = useState('frontend');
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
        title="Web Development Services | Lucid Code Labs"
        description="Strategic web development solutions to transform your business with modern, responsive websites and web applications."
        path="/services/web-development"
        jsonLd={[
          createServiceSchema({ name: 'Web Development', description: 'Strategic web development solutions to transform your business with modern, responsive websites and web applications.', path: '/services/web-development' }),
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'Web Development' }]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Strategic Web Development Solutions"
        subtitle="Transform your digital presence with custom web solutions built to drive engagement, conversion, and business growth in today's competitive landscape."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Web Development' },
        ]}
      />

      <ContentSection>
        <Container>
          <SectionTitle>Our Web Development Approach</SectionTitle>
          <SectionDescription>
            We don't just build websites; we create digital experiences that align with your business objectives and deliver measurable results.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Strategic Consulting</h3>
              <p>We analyze your business needs, target audience, and competition to develop a comprehensive web strategy that drives meaningful outcomes.</p>
            </Card>
            <Card>
              <h3>UX-Driven Design</h3>
              <p>User experience is at the heart of our design process, ensuring intuitive navigation, accessibility, and conversion-focused interfaces.</p>
            </Card>
            <Card>
              <h3>Performance Optimization</h3>
              <p>We build websites that load quickly, respond instantly, and operate smoothly across all devices and browsers for maximum user retention.</p>
            </Card>
            <Card>
              <h3>Scalable Architecture</h3>
              <p>Our solutions are built to grow with your business, utilizing modern frameworks and best practices that ensure long-term viability.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <FeatureImageSection>
        <FeatureImageGrid>
          <FeatureImageWrapper>
            <Image
              src="/images/stock/web-dev.jpg"
              alt="Modern web development workspace"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </FeatureImageWrapper>
          <FeatureTextContent>
            <h3>Built for the Modern Web</h3>
            <p>We leverage the latest frameworks and best practices to create websites and platforms that are fast, secure, and built to scale with your business.</p>
          </FeatureTextContent>
        </FeatureImageGrid>
      </FeatureImageSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>150+</StatNumber><StatLabel>Web Projects Delivered</StatLabel></StatItem>
            <StatItem><StatNumber>99.9%</StatNumber><StatLabel>Uptime Guarantee</StatLabel></StatItem>
            <StatItem><StatNumber>&lt;1s</StatNumber><StatLabel>Average Load Time</StatLabel></StatItem>
            <StatItem><StatNumber>4.9/5</StatNumber><StatLabel>Client Satisfaction</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>Our Web Development Process</SectionTitle>
          <SectionDescription>
            A methodical approach that transforms your vision into a high-performing digital solution.
          </SectionDescription>

          <ProcessStep>
            <StepNumber>1</StepNumber>
            <StepContent>
              <h3>Discovery & Strategy</h3>
              <p>We begin by understanding your business goals, target audience, and competitive landscape. This phase culminates in a detailed project roadmap and technical specification.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>2</StepNumber>
            <StepContent>
              <h3>UX/UI Design</h3>
              <p>Our designers create wireframes and high-fidelity mockups that focus on user experience, brand consistency, and conversion optimization.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>3</StepNumber>
            <StepContent>
              <h3>Development</h3>
              <p>We transform designs into responsive, functional websites using modern frameworks and clean, maintainable code while following best practices.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>4</StepNumber>
            <StepContent>
              <h3>Testing & Quality Assurance</h3>
              <p>Rigorous testing across devices and browsers ensures optimal performance, accessibility, and security before launch.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>5</StepNumber>
            <StepContent>
              <h3>Deployment & Launch</h3>
              <p>We handle all aspects of deployment, including server configuration, SEO optimization, and analytics setup for a smooth launch.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>6</StepNumber>
            <StepContent>
              <h3>Ongoing Support & Growth</h3>
              <p>Post-launch, we provide maintenance, performance monitoring, and iterative improvements based on user data and business results.</p>
            </StepContent>
          </ProcessStep>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Technologies We Leverage</SectionTitle>
          <SectionDescription>
            We utilize cutting-edge technologies and frameworks to deliver robust, scalable web solutions.
          </SectionDescription>

          <TechTabs>
            <Tab $active={activeTech === 'frontend'} onClick={() => setActiveTech('frontend')}>
              Frontend
            </Tab>
            <Tab $active={activeTech === 'backend'} onClick={() => setActiveTech('backend')}>
              Backend
            </Tab>
            <Tab $active={activeTech === 'cms'} onClick={() => setActiveTech('cms')}>
              CMS
            </Tab>
            <Tab $active={activeTech === 'ecommerce'} onClick={() => setActiveTech('ecommerce')}>
              E-Commerce
            </Tab>
          </TechTabs>

          <TechContent>
            {activeTech === 'frontend' && (
              <div>
                <h3>Modern Frontend Technologies</h3>
                <p>
                  We build responsive, interactive user interfaces using React, Next.js, Vue.js,
                  and other modern JavaScript frameworks. Our expertise includes CSS-in-JS solutions
                  like styled-components, state management libraries, and performance optimization techniques.
                </p>
              </div>
            )}

            {activeTech === 'backend' && (
              <div>
                <h3>Robust Backend Solutions</h3>
                <p>
                  Our backend development utilizes Node.js, Express, Python/Django, or PHP/Laravel
                  depending on project requirements. We implement RESTful APIs, GraphQL, and database
                  solutions including PostgreSQL, MongoDB, and MySQL with a focus on security and scalability.
                </p>
              </div>
            )}

            {activeTech === 'cms' && (
              <div>
                <h3>Content Management Systems</h3>
                <p>
                  We specialize in headless CMS solutions like Contentful and Sanity, as well as
                  traditional platforms like WordPress. Our custom CMS implementations provide intuitive
                  content management while maintaining frontend flexibility and performance.
                </p>
              </div>
            )}

            {activeTech === 'ecommerce' && (
              <div>
                <h3>E-Commerce Platforms</h3>
                <p>
                  We build custom e-commerce solutions using Shopify, WooCommerce, or headless commerce
                  platforms like Commercetools. Our implementations include payment processing, inventory
                  management, and seamless checkout experiences optimized for conversion.
                </p>
              </div>
            )}
          </TechContent>
        </Container>
      </ContentSection>

      <SplitSection $alt>
        <SplitGrid $reverse>
          <SplitImage>
            <Image src="/images/stock/agile-board.jpg" alt="Agile development workflow" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Why Teams Choose Us</h3>
            <p>We don't just write code — we become an extension of your team, deeply invested in your success from day one.</p>
            <ul>
              <li>Dedicated project manager for every engagement</li>
              <li>Weekly demos and transparent progress tracking</li>
              <li>Full code ownership — no vendor lock-in</li>
              <li>Post-launch support and growth partnership</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Transform Your Web Presence?</CTATitle>
          <CTAText>
            Let's discuss how our web development expertise can help you achieve your business goals
            and create exceptional digital experiences for your customers.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Strategy Session</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
