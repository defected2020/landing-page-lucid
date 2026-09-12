import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const testimonial = {
  content: "Working with Lucid Code Labs has been an incredible experience. They took our vision for Loyalty Club PLC and brought it to life with a level of expertise, creativity, and attention to detail that exceeded our expectations. Their team developed a robust, user-friendly loyalty platform that not only looks fantastic but also works flawlessly. We couldn't be happier with the result and highly recommend them to anyone looking for a top-tier development partner.",
  author: 'Tony Lewis',
  role: 'CEO, Loyalty Club PLC',
  caseStudy: '/work/loyalty-club-plc',
};

const Testimonial = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="bg-bg py-section">
      <div ref={ref} className="mx-auto max-w-[800px] px-container text-center">
        <span
          className="mb-[-1.5rem] block text-[6rem] leading-none text-accent opacity-20"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          &ldquo;
        </span>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="m-0 mb-8 text-[clamp(1.0625rem,1.5vw,1.25rem)] italic leading-[1.8] text-text"
        >
          {testimonial.content}
        </motion.blockquote>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="mb-1 font-display text-base font-semibold text-text">{testimonial.author}</p>
          <p className="mb-6 text-sm text-text-muted">{testimonial.role}</p>
          <Link href={testimonial.caseStudy}>
            <span className="text-sm font-medium text-accent transition-colors duration-fast ease-smooth hover:text-accent-hover">
              Read the case study &rarr;
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
