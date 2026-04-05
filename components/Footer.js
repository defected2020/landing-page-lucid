import React from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';

const FooterSection = styled.footer`
  background-color: var(--footer-bg);
  border-top: 1px solid var(--border);
  padding: var(--section-padding) 0 2rem;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: 3fr 1fr 1fr 1fr;
  }
`;

const FooterInfo = styled.div``;

const LogoWrapper = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
`;

const Description = styled.p`
  color: var(--text-muted);
  font-size: var(--radius-sm, 0.875rem);
  line-height: 1.7;
  margin-bottom: 1.75rem;
  max-width: 320px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialLink = styled.a`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-medium);

  &:hover {
    color: var(--text);
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-subtle);
  margin-bottom: 1.5rem;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.75rem;

  a {
    color: var(--text-muted);
    font-size: 0.875rem;
    text-decoration: none;
    transition: color var(--transition-fast), transform var(--transition-fast);
    display: inline-block;

    &:hover {
      color: var(--text);
      transform: translateX(2px);
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--border);
  margin-bottom: 2rem;
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  color: var(--text-subtle);
  font-size: 0.8125rem;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  a {
    color: var(--text-subtle);
    font-size: 0.8125rem;
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--text-muted);
    }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDark } = useTheme();
  const logoSrc = isDark ? '/images/lucid-logo-white.png' : '/images/lucid-logo.png';

  return (
    <FooterSection>
      <Container>
        <FooterGrid>
          <FooterInfo>
            <LogoWrapper>
              <Image
                src={logoSrc}
                alt="Lucid Code Labs"
                width={140}
                height={38}
                style={{ objectFit: 'contain' }}
              />
            </LogoWrapper>
            <Description>
              We build intelligent, scalable software that helps ambitious teams ship faster and grow smarter.
            </Description>
            <SocialLinks>
              <SocialLink href="https://github.com/lucidcodelabs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com/company/lucidcodelabs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialLink>
              <SocialLink href="https://x.com/lucidcodelabs" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialLink>
            </SocialLinks>
          </FooterInfo>

          <FooterColumn>
            <ColumnTitle>Services</ColumnTitle>
            <FooterLinks>
              <FooterLink><NextLink href="/services/ai-powered-software">AI Software</NextLink></FooterLink>
              <FooterLink><NextLink href="/services/web-development">Web Development</NextLink></FooterLink>
              <FooterLink><NextLink href="/services/mobile-app-development">Mobile Apps</NextLink></FooterLink>
              <FooterLink><NextLink href="/services/ux-ui-design">UX/UI Design</NextLink></FooterLink>
              <FooterLink><NextLink href="/services/data-analytics">Data Analytics</NextLink></FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Company</ColumnTitle>
            <FooterLinks>
              <FooterLink><NextLink href="/work">Our Work</NextLink></FooterLink>
              <FooterLink><NextLink href="/services">All Services</NextLink></FooterLink>
              <FooterLink><NextLink href="/#contact">Contact</NextLink></FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Contact</ColumnTitle>
            <FooterLinks>
              <FooterLink><a href="tel:+4917681417544">+49 176 8141 7544</a></FooterLink>
              <FooterLink><a href="mailto:info@lucidcodelabs.com">info@lucidcodelabs.com</a></FooterLink>
            </FooterLinks>
          </FooterColumn>
        </FooterGrid>

        <Divider />

        <FooterBottom>
          <Copyright>
            &copy; {currentYear} Lucid Code Labs. All rights reserved.
          </Copyright>
          <BottomLinks>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </BottomLinks>
        </FooterBottom>
      </Container>
    </FooterSection>
  );
};

export default Footer;
