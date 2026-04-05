import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import services from '../data/services';
import { getServiceIcon } from './icons/ServiceIcons';
import { useTheme } from '../contexts/ThemeContext';

/* ─── Layout ─── */

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color var(--transition-medium), border-color var(--transition-medium);
  background-color: ${props => props.$scrolled ? 'var(--navbar-bg)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(16px) saturate(180%)' : 'none'};
  border-bottom: 1px solid ${props => props.$scrolled ? 'var(--navbar-border)' : 'transparent'};
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--container-padding);
  height: 72px;
  max-width: var(--container-max);
  margin: 0 auto;
`;

const Logo = styled.div`
  z-index: 1001;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const NavLinks = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }
`;

/* ─── Nav Items ─── */

const NavItem = styled.div`
  position: relative;
`;

const NavLink = styled.span`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.$heroLight ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)'};
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
  padding: 0.25rem 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &:hover {
    color: ${props => props.$heroLight ? '#ffffff' : 'var(--text)'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.$active ? '4px' : '0'};
    height: 4px;
    border-radius: 50%;
    background-color: var(--accent);
    transition: width var(--transition-fast);
  }

  &:hover::after {
    width: 4px;
  }
`;

const ChevronIcon = styled.span`
  display: inline-flex;
  transition: transform var(--transition-fast);
  transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0)'};

  svg {
    width: 10px;
    height: 10px;
  }
`;

const ContactButton = styled.span`
  display: none;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  border: 1px solid ${props => props.$heroLight ? 'rgba(255,255,255,0.3)' : 'var(--border)'};
  color: ${props => props.$heroLight ? 'rgba(255,255,255,0.9)' : 'var(--text-muted)'};
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-medium);

  &:hover {
    background-color: var(--accent);
    border-color: transparent;
    color: white;
    transform: scale(1.02);
  }

  @media (min-width: 768px) {
    display: inline-block;
  }
`;

/* ─── Theme Toggle ─── */

const ThemeToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${props => props.$heroLight ? 'rgba(255,255,255,0.3)' : 'var(--border)'};
  background: transparent;
  color: ${props => props.$heroLight ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;

  &:hover {
    color: ${props => props.$heroLight ? '#ffffff' : 'var(--text)'};
    border-color: ${props => props.$heroLight ? 'rgba(255,255,255,0.5)' : 'var(--border-hover)'};
    background-color: ${props => props.$heroLight ? 'rgba(255,255,255,0.1)' : 'var(--hover-overlay)'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/* ─── Mega Dropdown ─── */

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 1.25rem);
  right: -200px;
  width: 680px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  z-index: 1000;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  box-shadow: var(--shadow-dropdown);
  backdrop-filter: blur(20px);

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 60px;
    transform: rotate(45deg);
    width: 12px;
    height: 12px;
    background: var(--bg-elevated);
    border-top: 1px solid var(--border);
    border-left: 1px solid var(--border);
  }
`;

const DropdownHitArea = styled.div`
  position: absolute;
  top: 100%;
  left: -200px;
  width: 700px;
  height: 1.5rem;
`;

const ServiceDropdownItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--hover-overlay);
  }
`;

const ServiceIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background-color: var(--accent-muted);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

const ServiceInfo = styled.div``;

const ServiceName = styled.div`
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.2rem;
  line-height: 1.3;
`;

const ServiceDesc = styled.div`
  font-size: 0.6875rem;
  color: var(--text-subtle);
  line-height: 1.4;
`;

/* ─── Mobile ─── */

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$heroLight ? '#ffffff' : 'var(--text)'};
  cursor: pointer;
  z-index: 1001;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  @media (min-width: 768px) {
    display: none;
  }
`;

const HamburgerSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const CloseSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: var(--bg);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--container-padding);
  height: 72px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

const MobileNavItems = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 2rem var(--container-padding);
  gap: 0.5rem;
`;

const MobileNavLink = styled.span`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
  transition: color var(--transition-fast);
  display: block;
  padding: 0.5rem 0;

  &:hover {
    color: var(--accent);
  }
`;

const MobileServicesToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
`;

const MobileServicesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
  padding: 0.75rem 0;
`;

const MobileServiceLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--hover-overlay);
  }
`;

const MobileServiceIcon = styled.div`
  width: 24px;
  height: 24px;
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MobileServiceName = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-muted);
`;

const MobileDivider = styled.div`
  height: 1px;
  background-color: var(--border);
  margin: 0.5rem 0;
`;

const MobileContactButton = styled.span`
  display: inline-block;
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  background-color: var(--accent);
  color: white;
  cursor: pointer;
  text-align: center;
  transition: all var(--transition-medium);

  &:hover {
    background-color: var(--accent-hover);
  }
`;

const MobileThemeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
`;

const MobileThemeLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-muted);
`;

/* ─── Component ─── */

const Navbar = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [router.asPath]);

  const handleMouseEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  useEffect(() => {
    return () => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); };
  }, []);

  const handleSectionClick = (e, sectionId) => {
    if (router.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (path) => router.pathname === path || router.asPath.startsWith(path + '/');

  // In light mode on homepage, when not scrolled, nav sits over the dark hero image — use white text
  const heroLight = router.pathname === '/' && !isDark && !scrolled;
  const logoSrc = heroLight ? '/images/lucid-logo-white.png' : (isDark ? '/images/lucid-logo-white.png' : '/images/lucid-logo.png');

  return (
    <NavbarContainer $scrolled={scrolled}>
      <NavInner>
        <NextLink href="/">
          <Logo>
            <Image src={logoSrc} alt="Lucid Code Labs" width={140} height={38} priority />
          </Logo>
        </NextLink>

        <NavLinks>
          {/* Services with mega dropdown */}
          <NavItem>
            <DropdownWrapper
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NextLink href="/services">
                <NavLink $active={isActive('/services')} $heroLight={heroLight}>
                  Services
                  <ChevronIcon $open={dropdownOpen}>
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 4.5L6 7.5L9 4.5" />
                    </svg>
                  </ChevronIcon>
                </NavLink>
              </NextLink>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <DropdownHitArea />
                    <DropdownPanel
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {services.map((service) => {
                        const Icon = getServiceIcon(service.iconName);
                        return (
                          <NextLink key={service.id} href={service.link}>
                            <ServiceDropdownItem>
                              <ServiceIconWrapper>
                                <Icon size={16} />
                              </ServiceIconWrapper>
                              <ServiceInfo>
                                <ServiceName>{service.title}</ServiceName>
                                <ServiceDesc>{service.shortDescription}</ServiceDesc>
                              </ServiceInfo>
                            </ServiceDropdownItem>
                          </NextLink>
                        );
                      })}
                    </DropdownPanel>
                  </>
                )}
              </AnimatePresence>
            </DropdownWrapper>
          </NavItem>

          <NavItem>
            <NextLink href="/work">
              <NavLink $active={isActive('/work')} $heroLight={heroLight}>Work</NavLink>
            </NextLink>
          </NavItem>

          <ThemeToggleButton $heroLight={heroLight} onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </ThemeToggleButton>

          <NextLink href="/#contact">
            <ContactButton $heroLight={heroLight} onClick={(e) => handleSectionClick(e, 'contact')}>
              Contact Us
            </ContactButton>
          </NextLink>
        </NavLinks>

        <MobileMenuButton
          $heroLight={heroLight}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <CloseSVG /> : <HamburgerSVG />}
        </MobileMenuButton>
      </NavInner>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <MobileMenuHeader>
              <NextLink href="/" onClick={() => setMobileMenuOpen(false)}>
                <Logo>
                  <Image src={logoSrc} alt="Lucid Code Labs" width={140} height={38} priority />
                </Logo>
              </NextLink>
              <MobileMenuButton onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <CloseSVG />
              </MobileMenuButton>
            </MobileMenuHeader>

            <MobileNavItems>
              {/* Services expandable */}
              <MobileServicesToggle onClick={() => setMobileServicesOpen(!mobileServicesOpen)}>
                <MobileNavLink as="span">Services</MobileNavLink>
                <ChevronIcon $open={mobileServicesOpen}>
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 4.5L6 7.5L9 4.5" />
                  </svg>
                </ChevronIcon>
              </MobileServicesToggle>

              <AnimatePresence>
                {mobileServicesOpen && (
                  <MobileServicesGrid
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {services.map((service) => {
                      const Icon = getServiceIcon(service.iconName);
                      return (
                        <NextLink key={service.id} href={service.link} onClick={() => setMobileMenuOpen(false)}>
                          <MobileServiceLink>
                            <MobileServiceIcon><Icon size={14} /></MobileServiceIcon>
                            <MobileServiceName>{service.title}</MobileServiceName>
                          </MobileServiceLink>
                        </NextLink>
                      );
                    })}
                  </MobileServicesGrid>
                )}
              </AnimatePresence>

              <MobileDivider />

              <NextLink href="/work" onClick={() => setMobileMenuOpen(false)}>
                <MobileNavLink>Work</MobileNavLink>
              </NextLink>

              <MobileDivider />

              <MobileThemeRow>
                <MobileThemeLabel>{isDark ? 'Dark Mode' : 'Light Mode'}</MobileThemeLabel>
                <ThemeToggleButton onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </ThemeToggleButton>
              </MobileThemeRow>

              <MobileDivider />

              <NextLink
                href="/#contact"
                onClick={(e) => {
                  handleSectionClick(e, 'contact');
                  setMobileMenuOpen(false);
                }}
              >
                <MobileContactButton>Contact Us</MobileContactButton>
              </NextLink>
            </MobileNavItems>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;
