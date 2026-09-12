import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, breadcrumbs = [], children }) => {
  return (
    <section className="relative overflow-hidden bg-bg pb-16 pt-40">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-1/2 w-4/5 -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-glow), transparent)',
        }}
      />
      <div className="relative mx-auto max-w-container px-container text-center">
        {breadcrumbs.length > 0 && (
          <div className="mb-8 text-[0.8125rem] uppercase tracking-[0.05em]">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="mx-2 text-text-subtle opacity-50">/</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-text-subtle transition-colors duration-fast ease-smooth hover:text-text-muted"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-muted">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.02em] text-text"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-[720px] text-[clamp(0.9375rem,1.2vw,1.125rem)] leading-[1.7] text-text-muted"
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageHero;
