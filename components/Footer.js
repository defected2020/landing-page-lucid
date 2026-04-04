import React from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';

const FooterSection = styled.footer`
  background-color: var(--dark);
  color: white;
  padding: 5rem 0 2rem;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
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
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const FooterInfo = styled.div``;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.75rem;
  line-height: 1.7;
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h4`
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.75rem;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      color: white;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SocialLink = styled.a`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
    transform: translateY(-3px);
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const FooterBottomGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  /* Always NextLink: router pathname can differ on first client paint vs SSR and
     broke hydration when mixing react-scroll Link vs NextLink. */
  const renderLink = (to, label) => (
    <NextLink href={`/#${to}`}>{label}</NextLink>
  );

  return (
    <FooterSection>
      <Container>
        <FooterGrid>
          <FooterInfo>
            <Logo>
              <Image 
                src="/images/lucid-logo.png" 
                alt="Lucid Code Labs" 
                width={150} 
                height={50} 
                style={{ objectFit: 'contain' }}
              />
            </Logo>
            <Description>
              We are a team of passionate developers, designers, and strategists dedicated to creating exceptional digital experiences that drive business growth.
            </Description>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </SocialLink>
            </SocialLinks>
          </FooterInfo>
          
          <FooterColumn>
            <ColumnTitle>Services</ColumnTitle>
            <FooterLinks>
              <FooterLink>
                {renderLink("services", "AI Powered Software")}
              </FooterLink>
              <FooterLink>
                {renderLink("services", "Websites & Web Platforms")}
              </FooterLink>
              <FooterLink>
                {renderLink("services", "Mobile Apps")}
              </FooterLink>
              <FooterLink>
                {renderLink("services", "Data Analytics")}
              </FooterLink>
              <FooterLink>
                {renderLink("services", "UI/UX Design")}
              </FooterLink>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Company</ColumnTitle>
            <FooterLinks>
              <FooterLink>
                {renderLink("team", "Our Team")}
              </FooterLink>
              <FooterLink>
                {renderLink("vision", "Our Vision")}
              </FooterLink>
              <FooterLink>
                {renderLink("clients", "Clients")}
              </FooterLink>
              <FooterLink>
                {renderLink("journey", "Your Journey")}
              </FooterLink>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <ColumnTitle>Contact</ColumnTitle>
            <FooterLinks>
              <FooterLink>
                {renderLink("contact", "Get In Touch")}
              </FooterLink>
              <FooterLink>
                <a href="tel:+4917681417544">+49 176 8141 7544</a>
              </FooterLink>
              <FooterLink>
                <a href="mailto:info@lucidcodelabs.com">info@lucidcodelabs.com</a>
              </FooterLink>
            </FooterLinks>
          </FooterColumn>
        </FooterGrid>
        
        <Divider />
        
        <FooterBottomGrid>
          <Copyright>
            © {currentYear} Lucid Code Labs. All rights reserved.
          </Copyright>
          
          <BottomLinks>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Settings</a>
          </BottomLinks>
        </FooterBottomGrid>
      </Container>
    </FooterSection>
  );
};

export default Footer; 