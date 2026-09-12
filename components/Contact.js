import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Script from 'next/script';

const socialIconClass =
  'flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted transition-all duration-medium ease-smooth hover:-translate-y-[2px] hover:border-accent hover:text-accent';

const Contact = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section id="contact" className="bg-bg-subtle py-section">
      <div className="mx-auto max-w-container px-container">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block font-display text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-accent">
            Get In Touch
          </span>
          <h2 className="mb-4 text-[clamp(2rem,3.5vw+0.5rem,3.25rem)] font-bold text-text">
            Let&apos;s work together
          </h2>
          <p className="mx-auto max-w-[600px] text-[clamp(0.9375rem,1vw,1.0625rem)] leading-[1.7] text-text-muted">
            Have a question or want to start a project? Reach out and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="min-h-[550px] overflow-hidden rounded-lg bg-[var(--form-bg)] p-10 shadow-[0_0_80px_var(--form-shadow)]"
          >
            {isClient ? (
              <>
                <Script
                  src="https://tally.so/widgets/embed.js"
                  strategy="afterInteractive"
                  onLoad={() => {
                    if (typeof window !== 'undefined' && window.Tally) {
                      window.Tally.loadEmbeds();
                    }
                  }}
                />
                <iframe
                  data-tally-src="https://tally.so/embed/np9Xr1?alignLeft=1&hideTitle=1&dynamicHeight=1"
                  loading="lazy"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="Contact Form"
                  style={{ minHeight: '500px' }}
                />
              </>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center text-sm text-text-subtle">
                Loading contact form...
              </div>
            )}
          </motion.div>

          <div className="flex flex-col gap-8 py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-muted text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-display text-base font-semibold text-text">Call Us</h3>
                <p className="text-[0.9375rem] leading-[1.6] text-text-muted">
                  <a
                    href="tel:+4917681417544"
                    className="transition-colors duration-fast ease-smooth hover:text-accent"
                  >
                    +49 176 8141 7544
                  </a>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-muted text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-display text-base font-semibold text-text">Email Us</h3>
                <p className="text-[0.9375rem] leading-[1.6] text-text-muted">
                  <a
                    href="mailto:info@lucidcodelabs.com"
                    className="transition-colors duration-fast ease-smooth hover:text-accent"
                  >
                    info@lucidcodelabs.com
                  </a>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-muted text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-display text-base font-semibold text-text">Based In</h3>
                <p className="text-[0.9375rem] leading-[1.6] text-text-muted">
                  Berlin, Germany &middot; Working globally
                </p>
              </div>
            </motion.div>

            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com/lucidcodelabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={socialIconClass}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/lucidcodelabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={socialIconClass}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
