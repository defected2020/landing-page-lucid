import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Sun, Moon, ChevronDown, X } from 'lucide-react';
import services from '../data/services';
import { getServiceIcon } from './icons/ServiceIcons';
import { useTheme } from '../contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const Navbar = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef(null);
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

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
    return () => {
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const handleSectionClick = (e, sectionId) => {
    if (router.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (path) =>
    router.pathname === path || router.asPath.startsWith(path + '/');

  const heroLight = router.pathname === '/' && !isDark && !scrolled;
  const logoSrc = heroLight
    ? '/images/lucid-logo-white.png'
    : isDark
    ? '/images/lucid-logo-white.png'
    : '/images/lucid-logo.png';

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 z-[1000] w-full transition-[background-color,border-color] duration-medium ease-smooth',
          scrolled
            ? 'bg-navbar-bg backdrop-blur-[16px] backdrop-saturate-[180%] border-b border-navbar-border'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-container">
          <NextLink href="/" className="z-[1001] flex cursor-pointer items-center">
            <Image
              src={logoSrc}
              alt="Lucid Code Labs"
              width={140}
              height={38}
              priority
            />
          </NextLink>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 md:flex">
            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NextLink
                href="/services"
                className={cn(
                  'inline-flex items-center gap-1.5 py-1 font-body text-[0.8125rem] font-medium uppercase tracking-[0.05em] transition-colors duration-fast ease-smooth relative',
                  heroLight
                    ? 'text-white/85 hover:text-white'
                    : 'text-text-muted hover:text-text'
                )}
              >
                Services
                <ChevronDown
                  className={cn(
                    'h-2.5 w-2.5 transition-transform duration-fast',
                    dropdownOpen && 'rotate-180'
                  )}
                />
                {isActive('/services') && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </NextLink>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="absolute left-[-200px] top-full h-6 w-[700px]" />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute right-[-200px] top-[calc(100%+1.25rem)] z-[1000] grid w-[680px] grid-cols-3 gap-0.5 rounded-lg border border-border bg-bg-elevated p-5 shadow-dropdown backdrop-blur-[20px] before:absolute before:-top-1.5 before:left-[60px] before:h-3 before:w-3 before:rotate-45 before:border-l before:border-t before:border-border before:bg-bg-elevated before:content-['']"
                    >
                      {services.map((service) => {
                        const Icon = getServiceIcon(service.iconName);
                        return (
                          <NextLink
                            key={service.id}
                            href={service.link}
                            className="flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors duration-fast hover:bg-hover-overlay"
                          >
                            <div className="mt-px flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm bg-accent-muted text-accent">
                              <Icon size={16} />
                            </div>
                            <div>
                              <div className="mb-0.5 font-display text-[0.8125rem] font-semibold leading-tight text-text">
                                {service.title}
                              </div>
                              <div className="text-[0.6875rem] leading-[1.4] text-text-subtle">
                                {service.shortDescription}
                              </div>
                            </div>
                          </NextLink>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <NextLink
              href="/work"
              className={cn(
                'relative inline-flex items-center py-1 font-body text-[0.8125rem] font-medium uppercase tracking-[0.05em] transition-colors duration-fast ease-smooth',
                heroLight
                  ? 'text-white/85 hover:text-white'
                  : 'text-text-muted hover:text-text'
              )}
            >
              Work
              {isActive('/work') && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </NextLink>

            <NextLink
              href="/blog"
              className={cn(
                'relative inline-flex items-center py-1 font-body text-[0.8125rem] font-medium uppercase tracking-[0.05em] transition-colors duration-fast ease-smooth',
                heroLight
                  ? 'text-white/85 hover:text-white'
                  : 'text-text-muted hover:text-text'
              )}
            >
              Blog
              {isActive('/blog') && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </NextLink>

            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={cn(
                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border bg-transparent transition-all duration-fast',
                heroLight
                  ? 'border-white/30 text-white/85 hover:border-white/50 hover:bg-white/10 hover:text-white'
                  : 'border-border text-text-muted hover:border-border-hover hover:bg-hover-overlay hover:text-text'
              )}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <NextLink
              href="/#contact"
              onClick={(e) => handleSectionClick(e, 'contact')}
              className={cn(
                'inline-block rounded-pill border px-6 py-2 font-display text-[0.8125rem] font-semibold transition-all duration-medium hover:scale-[1.02] hover:border-transparent hover:bg-accent hover:text-white',
                heroLight
                  ? 'border-white/30 text-white/90'
                  : 'border-border text-text-muted'
              )}
            >
              Contact Us
            </NextLink>
          </div>

          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center md:hidden',
                  heroLight ? 'text-white' : 'text-text'
                )}
              >
                <span className="absolute left-2 right-2 h-[1.5px] -translate-y-1.5 rounded-sm bg-current" />
                <span className="absolute left-2 right-2 h-[1.5px] rounded-sm bg-current" />
                <span className="absolute left-2 right-2 h-[1.5px] translate-y-1.5 rounded-sm bg-current" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="full"
              hideClose
              className="flex flex-col overflow-y-auto border-none p-0"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-container top-4 z-[1002] flex h-12 w-12 items-center justify-center rounded-full border border-border text-text transition-colors duration-fast hover:border-accent hover:bg-hover-overlay"
              >
                <X className="h-[18px] w-[18px]" />
              </button>

              <nav className="flex flex-1 flex-col px-container pb-8 pt-24">
                <div
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex cursor-pointer items-center justify-between"
                >
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="flex items-center gap-3 py-3 font-display text-3xl font-bold tracking-[-0.02em] text-text transition-colors hover:text-accent"
                  >
                    <span className="min-w-6 font-body text-[0.6875rem] font-medium tracking-[0.05em] text-accent">
                      01
                    </span>
                    Services
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-fast',
                        mobileServicesOpen && 'rotate-180'
                      )}
                    />
                  </motion.span>
                </div>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="grid grid-cols-2 gap-1.5 overflow-hidden py-2 pl-9"
                    >
                      {services.map((service, i) => {
                        const Icon = getServiceIcon(service.iconName);
                        return (
                          <NextLink
                            key={service.id}
                            href={service.link}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.25 }}
                              className="flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2.5 transition-colors duration-fast hover:bg-hover-overlay"
                            >
                              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-accent">
                                <Icon size={14} />
                              </span>
                              <span className="text-[0.8125rem] font-medium text-text-muted">
                                {service.title}
                              </span>
                            </motion.div>
                          </NextLink>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                <NextLink href="/work" onClick={() => setMobileMenuOpen(false)}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="flex items-center gap-3 py-3 font-display text-3xl font-bold tracking-[-0.02em] text-text transition-colors hover:text-accent"
                  >
                    <span className="min-w-6 font-body text-[0.6875rem] font-medium tracking-[0.05em] text-accent">
                      02
                    </span>
                    Work
                    {isActive('/work') && (
                      <motion.span
                        layoutId="mobileActiveDot"
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                      />
                    )}
                  </motion.span>
                </NextLink>

                <NextLink href="/blog" onClick={() => setMobileMenuOpen(false)}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex items-center gap-3 py-3 font-display text-3xl font-bold tracking-[-0.02em] text-text transition-colors hover:text-accent"
                  >
                    <span className="min-w-6 font-body text-[0.6875rem] font-medium tracking-[0.05em] text-accent">
                      03
                    </span>
                    Blog
                    {isActive('/blog') && (
                      <motion.span
                        layoutId="mobileActiveDot"
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                      />
                    )}
                  </motion.span>
                </NextLink>

                <NextLink
                  href="/#contact"
                  onClick={(e) => {
                    handleSectionClick(e, 'contact');
                    setMobileMenuOpen(false);
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="flex items-center gap-3 py-3 font-display text-3xl font-bold tracking-[-0.02em] text-text transition-colors hover:text-accent"
                  >
                    <span className="min-w-6 font-body text-[0.6875rem] font-medium tracking-[0.05em] text-accent">
                      04
                    </span>
                    Contact
                  </motion.span>
                </NextLink>
              </nav>

              <div className="flex flex-shrink-0 flex-col gap-5 border-t border-border px-container pb-10 pt-6">
                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/#contact');
                  }}
                  className="block cursor-pointer rounded-pill bg-accent px-8 py-4 text-center font-display text-base font-semibold text-white transition-all duration-medium hover:scale-[1.02] hover:bg-accent-hover"
                >
                  Start a Project
                </motion.button>

                <div className="flex items-center justify-between">
                  <span className="text-[0.8125rem] font-medium uppercase tracking-[0.05em] text-text-muted">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-text-muted transition-all duration-fast hover:border-border-hover hover:bg-hover-overlay hover:text-text"
                  >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
