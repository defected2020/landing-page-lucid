import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SEO, { createBreadcrumbSchema } from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import services from '../../data/services';
import { getServiceIcon } from '../../components/icons/ServiceIcons';
import { staggerContainer, fadeInUp } from '../../components/animations/variants';

export default function ServicesPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SEO
        title="Our Services | Lucid Code Labs"
        description="Explore our comprehensive range of digital services — AI, web development, mobile apps, UX/UI design, data analytics, and more. Berlin-based agency, working globally."
        path="/services"
        jsonLd={createBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Services' },
        ])}
      />

      <Navbar scrolled={scrolled} />

      <PageHero
        title="Strategic Solutions for Your Digital Success"
        subtitle="We're not just service providers — we're your strategic partners in navigating the complex digital landscape."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
      />

      <section className="py-section bg-bg">
        <div className="mx-auto max-w-container px-container">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => {
              const Icon = getServiceIcon(service.iconName);
              return (
                <Link key={service.id} href={service.link} className="no-underline">
                  <motion.div
                    variants={fadeInUp}
                    className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated transition-[border-color,transform] duration-fast hover:-translate-y-0.5 hover:border-border-hover"
                  >
                    {service.image && (
                      <div className="card-image relative h-[180px] w-full overflow-hidden after:absolute after:inset-x-0 after:bottom-0 after:z-[1] after:h-10 after:bg-gradient-to-t after:from-bg-elevated after:to-transparent after:content-['']">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          className="transition-transform [transition-duration:400ms] ease-out group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col px-8 pt-5 pb-8">
                      <div className="mb-5 text-accent">
                        <Icon size={28} />
                      </div>
                      <h3 className="mb-3 text-[1.125rem] font-semibold text-text">{service.title}</h3>
                      <p className="mb-6 flex-1 text-sm leading-[1.6] text-text-muted">{service.description}</p>
                      <span className="mt-auto inline-flex items-center gap-[0.375rem] text-[0.8125rem] font-medium text-accent transition-[gap] duration-fast group-hover:gap-[0.625rem]">
                        Learn more
                        <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      <section className="py-section bg-bg-subtle">
        <div className="mx-auto max-w-container px-container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="mb-6 text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-text">Our Consultative Approach</h2>
              <p className="mb-6 text-[0.9375rem] leading-[1.7] text-text-muted">
                We believe that successful digital solutions begin with a deep understanding of your business. Our approach centers on becoming your trusted advisor.
              </p>
              <ul className="list-none p-0">
                {[
                  'We begin by thoroughly understanding your business goals, challenges, and unique market position.',
                  'Our experts analyze your current state and identify opportunities for innovation and transformation.',
                  'We create tailored strategies designed to achieve your specific objectives and deliver measurable outcomes.',
                  'Throughout implementation, we maintain clear communication and keep you involved in key decisions.',
                  'Post-launch, we provide ongoing support and strategic guidance to ensure long-term success.',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="relative mb-4 pl-6 text-[0.9375rem] leading-[1.6] text-text-muted before:absolute before:left-0 before:top-2 before:h-[6px] before:w-[6px] before:rounded-full before:bg-accent before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative min-h-[400px] overflow-hidden rounded-lg border border-border">
              <Image
                src="/images/stock/strategy-meeting.jpg"
                alt="Team collaborating on digital strategy"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
