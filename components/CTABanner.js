import React from 'react';
import { motion } from 'framer-motion';

const CTABanner = () => {
  return (
    <section className="relative overflow-hidden bg-cta-gradient py-section">
      <div
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: '256px 256px',
        }}
      />
      <div className="relative z-[1] mx-auto max-w-container px-container text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-4 text-[clamp(2rem,4vw,3.5rem)] font-extrabold tracking-[-0.02em] text-white"
        >
          Ready to build something great?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mx-auto mb-10 max-w-[600px] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.7] text-white/85"
        >
          Start the conversation today and let&apos;s turn your vision into reality.
        </motion.p>
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
          className="inline-flex cursor-pointer items-center justify-center rounded-pill border-none bg-[var(--cta-btn-bg)] px-10 py-3.5 font-display text-base font-semibold text-[color:var(--cta-btn-text)] transition-all duration-medium ease-smooth hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          Contact Us
        </motion.a>
      </div>
    </section>
  );
};

export default CTABanner;
