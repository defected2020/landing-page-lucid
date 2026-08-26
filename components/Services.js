import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import services from '../data/services';
import { getServiceIcon } from './icons/ServiceIcons';
import { staggerContainer, fadeInUp } from './animations/variants';
import { cn } from '../lib/utils';

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="services" className="bg-bg py-section">
      <div className="mx-auto max-w-container px-container">
        <div className="mb-14 max-w-[600px]">
          <span className="mb-4 inline-block font-display text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-accent">
            What We Do
          </span>
          <h2 className="mb-4 text-[clamp(2rem,3.5vw+0.5rem,3.25rem)] font-bold text-text">
            Services built for ambitious teams
          </h2>
          <p className="text-[clamp(0.9375rem,1vw,1.0625rem)] leading-[1.7] text-text-muted">
            From AI-powered software to stunning design, we offer everything you need to succeed in the digital world.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => {
            const Icon = getServiceIcon(service.iconName);
            return (
              <Link key={service.id} href={service.link} className="no-underline">
                <motion.div
                  variants={fadeInUp}
                  className={cn(
                    'group relative col-span-1 flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated transition-[border-color,background-color,transform] duration-fast ease-smooth hover:-translate-y-0.5 hover:border-border-hover hover:bg-bg-subtle',
                    service.featured && 'lg:col-span-2'
                  )}
                >
                  {service.image && (
                    <div className="relative h-40 w-full overflow-hidden after:absolute after:inset-x-0 after:bottom-0 after:z-[1] after:h-10 after:bg-gradient-to-t after:from-bg-elevated after:to-transparent after:content-['']">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform [transition-duration:400ms] ease-out group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col px-8 pb-8 pt-5">
                    <div className="mb-5 text-accent">
                      <Icon size={28} />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-text">{service.title}</h3>
                    <p className="mb-5 text-sm leading-[1.6] text-text-muted">
                      {service.featured ? service.description : service.shortDescription}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-accent transition-[gap] duration-fast ease-smooth hover:gap-2.5">
                      Learn more
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
