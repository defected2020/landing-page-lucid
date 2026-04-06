import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import SEO, { createServiceSchema, createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import {
  PageContainer, ContentSection, Container,
  SectionTitle, SectionDescription, CardsGrid, Card,
  ProcessStep, StepNumber, StepContent,
  CTASection, CTATitle, CTAText, CTAButton,
  StatsBar, StatItem, StatNumber, StatLabel,
  SplitSection, SplitGrid, SplitText, SplitImage,
} from '../../components/ServicePageLayout';

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContentText = styled.div`
  color: var(--text-muted);
  line-height: 1.7;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.75rem;
  }

  p {
    margin-bottom: 1.5rem;
  }

  ul {
    margin-bottom: 1.5rem;
    margin-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

export default function UXUIServicePage() {
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
        title="UX/UI Design Solutions | Lucid Code Labs"
        description="Strategic UX/UI design services that transform user experiences. We create intuitive, engaging digital interfaces that drive business success and user satisfaction."
        path="/services/ux-ui-design"
        jsonLd={[
          createServiceSchema({ name: 'UX/UI Design', description: 'Strategic UX/UI design services — intuitive, engaging digital interfaces that drive business success.', path: '/services/ux-ui-design' }),
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'UX/UI Design' }]),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Human-Centered Design for Business Impact"
        subtitle="We design digital experiences that not only delight users but drive meaningful business outcomes -- transforming how people interact with your brand through research-backed, strategic design solutions."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'UX/UI Design' },
        ]}
      />

      <ContentSection>
        <Container>
          <TwoColumnGrid>
            <ContentText>
              <h3>Where User Needs Meet Business Objectives</h3>
              <p>
                Exceptional design isn't just about aesthetics -- it's about creating experiences that solve real problems for both users and businesses. At Lucid Code Labs, we take a strategic approach to UX/UI design that begins with a deep understanding of your business objectives.
              </p>
              <p>
                We believe the most successful digital products exist at the intersection of user needs, business goals, and technological feasibility. Our consultative process is designed to uncover insights in each of these areas, ensuring that every design decision contributes to your strategic objectives.
              </p>
              <p>
                Rather than treating design as a subjective creative exercise, we approach it as a problem-solving discipline guided by research, user insights, and measurable outcomes.
              </p>
            </ContentText>
            <div>
              <img
                src="/images/design thinking.png"
                alt="Strategic Design Thinking"
                style={{
                  borderRadius: 'var(--radius-lg, 1rem)',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </div>
          </TwoColumnGrid>

          <CardsGrid>
            <Card>
              <h3>User Research & Insights</h3>
              <p>We uncover deep insights about your users' needs, behaviors, and pain points through contextual research, interviews, and usability testing.</p>
            </Card>
            <Card>
              <h3>Experience Strategy</h3>
              <p>We align user experience with your business strategy, creating a cohesive plan that guides design decisions toward your key performance indicators.</p>
            </Card>
            <Card>
              <h3>Interface Design</h3>
              <p>We create intuitive, visually compelling interfaces that express your brand identity while making complex tasks feel simple and natural for users.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>A Structured Approach to Design Excellence</SectionTitle>
          <SectionDescription>
            Our human-centered design process is refined through years of experience and hundreds of successful projects, ensuring consistent results for our clients.
          </SectionDescription>

          <ProcessStep>
            <StepNumber>1</StepNumber>
            <StepContent>
              <h3>Discovery & Research</h3>
              <p>We begin by understanding your business objectives, competitive landscape, and user needs through stakeholder interviews, market analysis, and user research. This foundation ensures that design decisions are informed by strategic insights rather than assumptions.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>2</StepNumber>
            <StepContent>
              <h3>Strategy & Definition</h3>
              <p>With research insights in hand, we develop a clear UX strategy that bridges user needs and business goals. We create user personas, journey maps, and information architecture to define the optimal user experience and establish metrics for success.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>3</StepNumber>
            <StepContent>
              <h3>Wireframing & Prototyping</h3>
              <p>We design the structural elements of your interface through iterative wireframing, focusing on user flows and interaction patterns. Interactive prototypes allow stakeholders to experience and validate concepts before visual design begins.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>4</StepNumber>
            <StepContent>
              <h3>Visual Design</h3>
              <p>Our designers craft a polished visual language that embodies your brand while enhancing usability. We create comprehensive UI systems with consistent components, ensuring scalability and maintainability across your digital ecosystem.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>5</StepNumber>
            <StepContent>
              <h3>Validation & Iteration</h3>
              <p>We validate design solutions through usability testing and stakeholder feedback, identifying opportunities for improvement. This iterative approach ensures that the final product meets both user needs and business requirements.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>6</StepNumber>
            <StepContent>
              <h3>Implementation Support</h3>
              <p>We collaborate closely with development teams to ensure design fidelity during implementation, providing detailed specifications, assets, and guidance to bring your vision to life exactly as designed.</p>
            </StepContent>
          </ProcessStep>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Comprehensive Design Solutions</SectionTitle>
          <SectionDescription>
            Our UX/UI design services can be tailored to address specific challenges or delivered as a comprehensive end-to-end solution.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>UX Research & Strategy</h3>
              <p>In-depth user research, competitive analysis, and experience strategy that establishes a solid foundation for design decisions aligned with business goals.</p>
            </Card>
            <Card>
              <h3>Digital Product Design</h3>
              <p>End-to-end design for web and mobile applications, from concept through wireframing, prototyping, and polished UI that delivers exceptional user experiences.</p>
            </Card>
            <Card>
              <h3>Website Design & Optimization</h3>
              <p>Conversion-focused website design that balances brand expression with user needs, creating intuitive pathways that guide visitors toward business objectives.</p>
            </Card>
            <Card>
              <h3>Design System Development</h3>
              <p>Creation of comprehensive design systems with reusable components and clear guidelines that ensure consistency, accelerate development, and simplify scaling.</p>
            </Card>
            <Card>
              <h3>Usability Evaluation</h3>
              <p>Expert review and user testing of existing products to identify friction points and opportunities for improvement, with actionable recommendations.</p>
            </Card>
            <Card>
              <h3>Design Workshops & Training</h3>
              <p>Collaborative workshops and customized training programs that build design thinking capabilities within your organization and align teams around user-centered approaches.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>200+</StatNumber><StatLabel>Interfaces Designed</StatLabel></StatItem>
            <StatItem><StatNumber>40%</StatNumber><StatLabel>Avg Conversion Lift</StatLabel></StatItem>
            <StatItem><StatNumber>WCAG 2.1</StatNumber><StatLabel>Accessibility Standard</StatLabel></StatItem>
            <StatItem><StatNumber>5 days</StatNumber><StatLabel>Prototype to Test</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <TwoColumnGrid>
            <div>
              <img
                src="/images/design.png"
                alt="Design Impact on Business Metrics"
                style={{
                  borderRadius: 'var(--radius-lg, 1rem)',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </div>
            <ContentText>
              <h3>The Strategic Value of Exceptional Design</h3>
              <p>
                Investing in strategic UX/UI design delivers substantial business value that extends far beyond aesthetics. Our clients consistently report significant improvements in key performance indicators:
              </p>
              <ul>
                <li><strong>Increased Conversion Rates:</strong> Streamlined user journeys and intuitive interfaces typically improve conversion rates by 30-150% across websites and digital products.</li>
                <li><strong>Enhanced Customer Satisfaction:</strong> User-centered design directly improves satisfaction metrics, with our clients seeing average increases of 25-40% in NPS scores.</li>
                <li><strong>Reduced Support Costs:</strong> Intuitive interfaces reduce support inquiries by making products easier to use, often decreasing support volume by 20-35%.</li>
                <li><strong>Accelerated Time-to-Market:</strong> Design systems and clear specifications improve development efficiency, reducing implementation time by up to 40%.</li>
                <li><strong>Competitive Differentiation:</strong> Exceptional experiences create meaningful differentiation in crowded markets, strengthening brand perception and customer loyalty.</li>
                <li><strong>Higher User Adoption:</strong> Products that address real user needs and provide intuitive interfaces see significantly higher adoption rates and reduced abandonment.</li>
              </ul>
            </ContentText>
          </TwoColumnGrid>
        </Container>
      </ContentSection>

      <SplitSection>
        <SplitGrid $reverse>
          <SplitImage>
            <Image src="/images/stock/ux-wireframe.jpg" alt="UX wireframing and prototyping" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Design Systems That Scale</h3>
            <p>We don't just design screens — we build design systems that keep your product consistent as your team and feature set grow.</p>
            <ul>
              <li>Component libraries in Figma with developer-ready specs</li>
              <li>Design tokens synced with your codebase</li>
              <li>Accessibility baked in — not bolted on</li>
              <li>User testing at every stage, not just the end</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Transform Your Digital Experience?</CTATitle>
          <CTAText>
            Let's discuss how our strategic design approach can help you achieve your business goals. Our team will work with you to understand your specific challenges and create a tailored solution.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Strategic Consultation</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
