import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { staggerContainer, fadeInUp } from './animations/variants';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We learn about your business, goals, and users to define the right problem.',
  },
  {
    number: '02',
    title: 'Strategy & Planning',
    description: 'A clear roadmap with milestones, tech choices, and scope agreement.',
  },
  {
    number: '03',
    title: 'Design & Development',
    description: 'Iterative sprints with design reviews and working software at every stage.',
  },
  {
    number: '04',
    title: 'Testing & Refinement',
    description: 'Rigorous QA, user testing, and performance optimization before launch.',
  },
  {
    number: '05',
    title: 'Launch & Support',
    description: 'Smooth deployment with ongoing monitoring, updates, and partnership.',
  },
];

const Process = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="journey" className="bg-bg-subtle py-section">
      <div className="mx-auto max-w-container px-container">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block font-display text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-accent">
            How We Work
          </span>
          <h2 className="text-[clamp(2rem,3.5vw+0.5rem,3.25rem)] font-bold text-text">
            From vision to launch
          </h2>
        </div>

        <motion.div
          ref={ref}
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={fadeInUp}
              className="relative rounded-lg border border-border bg-bg-elevated px-6 py-8 text-center lg:text-left"
            >
              <span className="mb-4 block font-display text-5xl font-extrabold leading-none text-accent opacity-15">
                {step.number}
              </span>
              <h3 className="mb-2 text-base font-semibold text-text">{step.title}</h3>
              <p className="text-[0.8125rem] leading-[1.6] text-text-muted">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="absolute right-[-0.5rem] top-1/2 z-[1] hidden h-px w-4 border-t border-dashed border-border-hover lg:block" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
