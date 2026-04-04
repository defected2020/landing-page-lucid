import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Team from '../components/Team';
import Vision from '../components/Vision';
import Clients from '../components/Clients';
import Journey from '../components/Journey';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const GlobalStyle = styled.div`
  --primary: #3b82f6;
  --primary-light: #93c5fd;
  --primary-dark: #1d4ed8;
  --dark: #1e293b;
  --gray: #64748b;
  --light-gray: #e2e8f0;
  --light: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
`;

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
    <GlobalStyle>
      <Head>
        <title>Lucid Code Labs Software - Software Development Company</title>
        <meta
          name="description"
          content="Professional software development services including AI solutions, web development, mobile apps, and more."
        />
        <link rel="icon" href="/images/lucid-logo.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar scrolled={scrolled} />

      <MainContent>
        <Hero />
        <Services />
        <Team />
        <Vision />
        <Clients />
        <Journey />
        <Contact />
        <Footer />
      </MainContent>
    </GlobalStyle>
  );
}
