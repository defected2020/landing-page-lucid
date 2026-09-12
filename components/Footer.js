import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useTheme } from '../contexts/ThemeContext';
import { CONTACT, activeSocialProfiles } from '../data/siteConfig';

// Rendered only for profiles marked enabled in siteConfig, so the footer never
// links to an account that does not exist yet.
const SOCIAL_ICONS = {
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

const columnTitleClass =
  'mb-6 font-display text-xs font-semibold uppercase tracking-[0.08em] text-text-subtle';

const footerLinkClass =
  'inline-block text-sm text-text-muted transition-[color,transform] duration-fast ease-smooth hover:translate-x-[2px] hover:text-text';

const socialLinkClass =
  'flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted transition-all duration-medium ease-smooth hover:-translate-y-[2px] hover:border-border-hover hover:text-text';

const bottomLinkClass =
  'text-[0.8125rem] text-text-subtle transition-colors duration-fast ease-smooth hover:text-text-muted';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socials = activeSocialProfiles();
  const { isDark } = useTheme();
  const logoSrc = isDark ? '/images/lucid-logo-white.png' : '/images/lucid-logo.png';

  return (
    <footer className="border-t border-border bg-footer-bg pb-8 pt-section">
      <div className="mx-auto max-w-container px-container">
        <div className="mb-12 grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-[3fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-5 flex items-center">
              <Image
                src={logoSrc}
                alt="Lucid Code Labs"
                width={140}
                height={38}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="mb-7 max-w-[320px] text-sm leading-[1.7] text-text-muted">
              We build intelligent, scalable software that helps ambitious teams ship faster and grow smarter.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((profile) => (
                  <a
                    key={profile.id}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={profile.label}
                    className={socialLinkClass}
                  >
                    {SOCIAL_ICONS[profile.id]}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className={columnTitleClass}>Services</h4>
            <ul className="list-none p-0">
              <li className="mb-3"><NextLink href="/services/ai-powered-software" className={footerLinkClass}>AI Software</NextLink></li>
              <li className="mb-3"><NextLink href="/services/web-development" className={footerLinkClass}>Web Development</NextLink></li>
              <li className="mb-3"><NextLink href="/services/mobile-app-development" className={footerLinkClass}>Mobile Apps</NextLink></li>
              <li className="mb-3"><NextLink href="/services/ux-ui-design" className={footerLinkClass}>UX/UI Design</NextLink></li>
              <li className="mb-3"><NextLink href="/services/data-analytics" className={footerLinkClass}>Data Analytics</NextLink></li>
            </ul>
          </div>

          <div>
            <h4 className={columnTitleClass}>Company</h4>
            <ul className="list-none p-0">
              <li className="mb-3"><NextLink href="/about" className={footerLinkClass}>About</NextLink></li>
              <li className="mb-3"><NextLink href="/work" className={footerLinkClass}>Our Work</NextLink></li>
              <li className="mb-3"><NextLink href="/services" className={footerLinkClass}>All Services</NextLink></li>
              <li className="mb-3"><NextLink href="/blog" className={footerLinkClass}>Blog</NextLink></li>
              <li className="mb-3"><NextLink href="/#contact" className={footerLinkClass}>Contact</NextLink></li>
            </ul>
          </div>

          <div>
            <h4 className={columnTitleClass}>Contact</h4>
            <ul className="list-none p-0">
              <li className="mb-3"><a href={`tel:${CONTACT.phone}`} className={footerLinkClass}>{CONTACT.phoneDisplay}</a></li>
              <li className="mb-3"><a href={`mailto:${CONTACT.email}`} className={footerLinkClass}>{CONTACT.email}</a></li>
              <li className="mb-3 text-sm text-text-muted">{CONTACT.locality}, Germany</li>
            </ul>
          </div>
        </div>

        <div className="mb-8 h-px bg-border" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.8125rem] text-text-subtle">
            &copy; {currentYear} Lucid Code Labs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className={bottomLinkClass}>Privacy Policy</a>
            <a href="#" className={bottomLinkClass}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
