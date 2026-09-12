import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { staggerContainer, fadeInUp } from './animations/variants';
import { cn } from '../lib/utils';
import team from '../data/team';

const Team = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="team" className="bg-bg-subtle py-section">
      <div className="mx-auto max-w-container px-container">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block font-display text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-accent">
            Our Team
          </span>
          <h2 className="mb-4 text-[clamp(2rem,3.5vw+0.5rem,3.25rem)] font-bold text-text">
            The people behind the code
          </h2>
          <p className="mx-auto max-w-[550px] text-[clamp(0.9375rem,1vw,1.0625rem)] leading-[1.7] text-text-muted">
            A lean, senior team that ships fast and cares deeply about the craft.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mx-auto grid max-w-[800px] grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              className={cn(
                'group overflow-hidden rounded-lg border border-border bg-bg-elevated transition-[border-color,transform] duration-fast ease-smooth hover:-translate-y-1 hover:border-border-hover',
                index === 1 && 'max-[639px]:order-[-1]'
              )}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-bg">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover object-top transition-transform duration-slow ease-smooth group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="mb-1 text-lg font-bold text-text">{member.name}</h3>
                <p className="text-sm text-text-muted">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
