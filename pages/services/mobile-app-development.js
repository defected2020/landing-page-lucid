import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SEO, { createServiceSchema, createBreadcrumbSchema, createFAQSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import FAQ from '../../components/FAQ';
import { getServiceFaqs } from '../../data/serviceFaqs';
import {
  PageContainer, ContentSection, Container,
  SectionTitle, SectionDescription, CardsGrid, Card,
  ProcessStep, StepNumber, StepContent,
  CTASection, CTATitle, CTAText, CTAButton,
  StatsBar, StatItem, StatNumber, StatLabel,
  SplitSection, SplitGrid, SplitText, SplitImage,
} from '../../components/ServicePageLayout';

export default function ReactNativeMobileApp() {
  const [scrolled, setScrolled] = useState(false);
  const faqs = getServiceFaqs('mobile-app-development');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageContainer>
      <SEO
        title="React Native Mobile App Development | Lucid Code Labs"
        description="Expert React Native mobile app development services. Build cross-platform iOS and Android apps with a single codebase. Fast, efficient, and cost-effective mobile solutions."
        path="/services/mobile-app-development"
        jsonLd={[
          createServiceSchema({ name: 'Mobile App Development', description: 'Expert React Native mobile app development — cross-platform iOS and Android apps with a single codebase.', path: '/services/mobile-app-development' }),
          createBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/services' }, { name: 'Mobile App Development' }]),
          createFAQSchema(faqs),
        ]}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="React Native Mobile App Development"
        subtitle="Build powerful cross-platform mobile applications with React Native. One codebase, two platforms -- delivering native performance and user experience for both iOS and Android while reducing development time and costs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'React Native Mobile Apps' },
        ]}
      />

      <ContentSection>
        <Container>
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="leading-[1.7] text-text-muted [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text [&_p]:mb-6">
              <h3>Why React Native for Your Mobile App?</h3>
              <p>
                React Native is our framework of choice for mobile app development because it offers the perfect balance of performance, development efficiency, and cost-effectiveness. With React Native, we can build truly native mobile applications using a single codebase that runs on both iOS and Android.
              </p>
              <p>
                This approach means faster time-to-market, reduced development costs, and easier maintenance - all while delivering the native performance and user experience your users expect. React Native is trusted by companies like Facebook, Instagram, Airbnb, and Tesla for their mobile applications.
              </p>
              <p>
                Our team specializes exclusively in React Native development, ensuring we leverage the framework's full potential to create high-quality, scalable mobile applications that meet your business objectives.
              </p>
            </div>
            <div className="h-full min-h-[400px] overflow-hidden rounded-lg">
              <img src="/images/mobile3.png" alt="React Native Mobile Development" className="h-full w-full rounded-lg object-cover" />
            </div>
          </div>

          <CardsGrid>
            <Card>
              <h3>Cross-Platform Efficiency</h3>
              <p>Write once, run everywhere. React Native allows us to develop for both iOS and Android simultaneously, reducing development time by up to 50% while maintaining native performance.</p>
            </Card>
            <Card>
              <h3>Native Performance</h3>
              <p>React Native apps compile to native code, providing the same performance and user experience as apps built with native iOS and Android development tools.</p>
            </Card>
            <Card>
              <h3>Cost-Effective Development</h3>
              <p>Significantly reduce development and maintenance costs with a single codebase that serves both platforms, while maintaining the ability to add platform-specific features when needed.</p>
            </Card>
          </CardsGrid>
        </Container>
      </ContentSection>

      <ContentSection $alt>
        <Container>
          <SectionTitle>React Native Development Ecosystem</SectionTitle>
          <SectionDescription>
            We use the latest React Native technologies and tools to build robust, scalable mobile applications.
          </SectionDescription>

          <div className="my-8 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              { title: 'React Native', desc: 'Core framework for cross-platform mobile development' },
              { title: 'Expo', desc: 'Development platform for rapid prototyping and deployment' },
              { title: 'TypeScript', desc: 'Type-safe development for better code quality and maintainability' },
              { title: 'Redux/Zustand', desc: 'State management for complex application logic' },
              { title: 'React Navigation', desc: 'Routing and navigation for seamless user experiences' },
              { title: 'Firebase', desc: 'Backend services, authentication, and real-time databases' },
              { title: 'Native Modules', desc: 'Custom native functionality when platform-specific features are needed' },
              { title: 'App Store Deployment', desc: 'Complete deployment and publishing to both iOS App Store and Google Play' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-bg-elevated p-6 text-center">
                <h4 className="mb-2 font-semibold text-text">{item.title}</h4>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <StatsBar>
            <StatItem><StatNumber>50+</StatNumber><StatLabel>Apps Shipped</StatLabel></StatItem>
            <StatItem><StatNumber>4.8★</StatNumber><StatLabel>Avg Store Rating</StatLabel></StatItem>
            <StatItem><StatNumber>iOS + Android</StatNumber><StatLabel>Platform Coverage</StatLabel></StatItem>
            <StatItem><StatNumber>60 days</StatNumber><StatLabel>MVP Delivery</StatLabel></StatItem>
          </StatsBar>
        </Container>
      </ContentSection>

      <ContentSection>
        <Container>
          <SectionTitle>React Native Development Process</SectionTitle>
          <SectionDescription>
            Our streamlined development process ensures efficient delivery of high-quality React Native applications.
          </SectionDescription>

          <ProcessStep>
            <StepNumber>1</StepNumber>
            <StepContent>
              <h3>Discovery & Planning</h3>
              <p>We analyze your requirements, target audience, and business goals to create a comprehensive development strategy and technical architecture for your React Native app.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>2</StepNumber>
            <StepContent>
              <h3>UI/UX Design</h3>
              <p>Our designers create intuitive, platform-appropriate interfaces that work seamlessly across iOS and Android while maintaining each platform's design guidelines.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>3</StepNumber>
            <StepContent>
              <h3>React Native Development</h3>
              <p>We build your application using React Native best practices, implementing features, integrating APIs, and ensuring optimal performance across both platforms.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>4</StepNumber>
            <StepContent>
              <h3>Testing & Optimization</h3>
              <p>Comprehensive testing on real devices, performance optimization, and platform-specific adjustments to ensure your app works flawlessly on all target devices.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>5</StepNumber>
            <StepContent>
              <h3>Deployment</h3>
              <p>We handle the complete app store submission process for both iOS App Store and Google Play Store, including compliance with all platform requirements.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep>
            <StepNumber>6</StepNumber>
            <StepContent>
              <h3>Maintenance & Updates</h3>
              <p>Ongoing support, bug fixes, feature updates, and React Native version upgrades to keep your app current and performing optimally.</p>
            </StepContent>
          </ProcessStep>
        </Container>
      </ContentSection>

      <SplitSection $alt>
        <SplitGrid>
          <SplitImage>
            <Image src="/images/stock/mobile-apps.jpg" alt="Mobile app on smartphone" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </SplitImage>
          <SplitText>
            <h3>Beyond the App Store</h3>
            <p>Launching is just the beginning. We provide ongoing support, performance monitoring, and iterative improvements based on real user data.</p>
            <ul>
              <li>App Store Optimization (ASO) for discoverability</li>
              <li>Crash reporting and real-time performance monitoring</li>
              <li>Push notification strategy and engagement analytics</li>
              <li>Regular updates for new OS versions and devices</li>
            </ul>
          </SplitText>
        </SplitGrid>
      </SplitSection>

      <FAQ
        faqs={faqs}
        description="Common questions about building a cross-platform mobile app."
      />

      <CTASection>
        <Container>
          <CTATitle>Let's Build Your React Native App</CTATitle>
          <CTAText>
            Ready to bring your mobile app idea to life with React Native? Let's discuss your project and create a solution that works perfectly for both iOS and Android users.
          </CTAText>
          <CTAButton href="/#contact">Start Your Project</CTAButton>
        </Container>
      </CTASection>

      <Footer />
    </PageContainer>
  );
}
