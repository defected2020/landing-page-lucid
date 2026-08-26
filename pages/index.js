import React, { useState, useEffect } from 'react';

import SEO, { organizationSchema, websiteSchema } from '../components/SEO';
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
        title="Software Development Agency in Berlin | Lucid Code Labs"
        description="Lucid Code Labs builds intelligent, scalable software — AI-powered platforms, web applications, and mobile apps. A founder-led studio in Berlin, working globally."
        path="/"
        jsonLd={[organizationSchema, websiteSchema]}
      />

      <Navbar scrolled={scrolled} />

      <main className="overflow-x-hidden">
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
      </main>
    </>
  );
}
