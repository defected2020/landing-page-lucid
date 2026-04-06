import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import SEO, { organizationSchema, createBreadcrumbSchema } from '../components/SEO';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import Services from '../components/Services';
import FeaturedWork from '../components/FeaturedWork';
import Process from '../components/Process';
import Testimonial from '../components/Testimonial';
import Team from '../components/Team';
import CTABanner from '../components/CTABanner';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const MainContent = styled.main`
  overflow-x: hidden;
`;

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SEO
        title="Lucid Code Labs — Software Development Agency"
        description="We build intelligent, scalable software — from AI-powered platforms to stunning web and mobile experiences. Berlin-based, working globally."
        path="/"
        jsonLd={organizationSchema}
      />

      <Navbar scrolled={scrolled} />

      <MainContent>
        <Hero />
        <TrustedBy />
        <Services />
        <FeaturedWork />
        <Process />
        <Testimonial />
        <Team />
        <CTABanner />
        <Contact />
        <Footer />
      </MainContent>
    </>
  );
}
