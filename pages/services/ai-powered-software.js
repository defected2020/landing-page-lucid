import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import {
  PageContainer, ContentSection, Container,
  SectionTitle, SectionDescription, CardsGrid, Card,
  CTASection, CTATitle, CTAText, CTAButton,
  StatsBar, StatItem, StatNumber, StatLabel,
  HighlightBox,
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

const ImageContainer = styled.div`
  border-radius: var(--radius-lg);
  height: 100%;
  min-height: 400px;
  overflow: hidden;
  position: relative;
`;

export default function AIServicePage() {
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
        <title>AI Powered Software Solutions | Lucid Code Labs</title>
        <meta name="description" content="Unlock your business potential with our custom AI solutions. We transform data into actionable intelligence and automation that evolves with your business." />
      </Head>

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Transformative AI Solutions for Your Business"
        subtitle="We don't just build AI systems -- we architect intelligent solutions that adapt to your evolving business needs, turning complex data into strategic advantages and automating processes for unprecedented efficiency."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'AI Powered Software' },
        ]}
      />

      <ContentSection>
        <Container>
          <TwoColumnGrid>
            <ContentText>
              <h3>Beyond AI Implementation: Strategic Transformation</h3>
              <p>
                In today's rapidly evolving business landscape, artificial intelligence isn't just a technology upgrade -- it's a strategic imperative. However, many organizations struggle to move beyond basic AI implementation to achieve meaningful transformation.
              </p>
              <p>
                At Lucid Code Labs, we take a fundamentally different approach. We partner with you to understand your unique business challenges, goals, and data environment before designing customized AI solutions that deliver tangible outcomes.
              </p>
              <p>
                Our consultative process begins with deep discovery. We work closely with your team to identify high-value opportunities where AI can create the most significant impact, whether that's automating repetitive tasks, uncovering hidden patterns in your data, or creating entirely new capabilities.
              </p>
              <p>
                Rather than offering one-size-fits-all AI tools, we craft bespoke solutions that align perfectly with your specific objectives and integrate seamlessly with your existing systems and workflows.
              </p>
            </ContentText>
            <ImageContainer>
              <Image
                src="/images/Neural Network Design.jpg"
                alt="AI Strategy Consultation - Neural Network Design"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </ImageContainer>
          </TwoColumnGrid>

          <CardsGrid>
            <Card>
              <h3>Data-Driven Decision Making</h3>
              <p>Transform raw data into actionable intelligence. Our AI solutions help you make faster, more accurate decisions by surfacing insights that would otherwise remain hidden in your data.</p>
            </Card>
            <Card>
              <h3>Intelligent Process Automation</h3>
              <p>Move beyond basic automation to intelligent systems that learn and improve over time. We identify and automate complex workflows, freeing your team to focus on higher-value activities.</p>
            </Card>
            <Card>
              <h3>Predictive Analytics</h3>
              <p>Anticipate future trends and behaviors with sophisticated prediction models. Our predictive systems help you identify opportunities and mitigate risks before they materialize.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <TwoColumnGrid>
            <ImageContainer>
              <Image
                src="/images/ai_garden.png"
                alt="AI Implementation"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </ImageContainer>
            <ContentText>
              <h3>From Vision to Value: How We Deliver</h3>
              <p>
                Our approach to AI implementation is structured yet adaptive, ensuring we deliver solutions that create immediate value while laying the foundation for continuous improvement.
              </p>
              <ul>
                <li><strong>Strategic Assessment:</strong> We begin by understanding your business objectives, data landscape, and existing systems to identify the highest-impact opportunities for AI implementation.</li>
                <li><strong>Solution Design:</strong> Our experts design a comprehensive AI strategy and architecture tailored to your specific needs, selecting the most appropriate algorithms and technologies.</li>
                <li><strong>Data Preparation:</strong> We help you organize, clean, and enrich your data -- often the most critical step in successful AI implementation.</li>
                <li><strong>Iterative Development:</strong> We develop your solution using agile methodologies, with frequent checkpoints to gather feedback and ensure alignment with your goals.</li>
                <li><strong>Integration & Deployment:</strong> We seamlessly integrate the AI solution with your existing systems and workflows, ensuring minimal disruption and maximum adoption.</li>
                <li><strong>Continuous Optimization:</strong> Post-launch, we monitor performance and continuously refine the solution to improve accuracy and adapt to changing business needs.</li>
              </ul>
            </ContentText>
          </TwoColumnGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>Strategic Impact for Your Business</SectionTitle>
          <SectionDescription>
            Our AI-powered solutions deliver tangible, measurable outcomes that directly contribute to your strategic objectives.
          </SectionDescription>

          <CardsGrid>
            <Card>
              <h3>Operational Efficiency</h3>
              <p>Reduce operational costs by 30-50% through intelligent automation of complex workflows and processes, while simultaneously improving accuracy and consistency.</p>
            </Card>
            <Card>
              <h3>Enhanced Decision Making</h3>
              <p>Make better decisions faster with AI-powered insights that surface patterns and opportunities invisible to traditional analysis, leading to improved business outcomes.</p>
            </Card>
            <Card>
              <h3>Competitive Advantage</h3>
              <p>Gain and maintain market leadership through proprietary AI capabilities that provide unique insights, personalized customer experiences, and innovative offerings.</p>
            </Card>
            <Card>
              <h3>Scalability</h3>
              <p>Handle growing volumes of data and increasing business complexity without proportional increases in resources, allowing your organization to scale efficiently.</p>
            </Card>
            <Card>
              <h3>Risk Mitigation</h3>
              <p>Identify potential risks and issues before they materialize, allowing preemptive action and reducing the impact of unforeseen challenges on your business.</p>
            </Card>
            <Card>
              <h3>Innovation Acceleration</h3>
              <p>Accelerate the pace of innovation by automating routine aspects of the development process and uncovering non-obvious connections and opportunities in your data.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>10x</StatNumber><StatLabel>Process Efficiency</StatLabel></StatItem>
            <StatItem><StatNumber>95%+</StatNumber><StatLabel>Prediction Accuracy</StatLabel></StatItem>
            <StatItem><StatNumber>50%</StatNumber><StatLabel>Cost Reduction</StatLabel></StatItem>
            <StatItem><StatNumber>Enterprise</StatNumber><StatLabel>Grade Security</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <HighlightBox>
            <h3>Ready to Bring AI Into Your Business?</h3>
            <p>Whether you're exploring AI for the first time or scaling existing models, our team will guide you from concept to production. Book a free strategy session to discover what's possible.</p>
          </HighlightBox>
        </Container>
      </ContentSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to Transform Your Business with AI?</CTATitle>
          <CTAText>
            Let's discuss how our AI-powered solutions can address your specific challenges and opportunities. Our experts will work with you to develop a strategic roadmap tailored to your unique business needs.
          </CTAText>
          <CTAButton href="/#contact">Schedule a Strategic Consultation</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
