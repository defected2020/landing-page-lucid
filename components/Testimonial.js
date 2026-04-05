import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import Link from 'next/link';

const Section = styled.section`
  padding: var(--section-padding) 0;
  background-color: var(--bg);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
  text-align: center;
`;

const QuoteMark = styled.span`
  display: block;
  font-family: Georgia, serif;
  font-size: 6rem;
  line-height: 1;
  color: var(--accent);
  opacity: 0.2;
  margin-bottom: -1.5rem;
`;

const QuoteText = styled(motion.blockquote)`
  font-size: clamp(1.0625rem, 1.5vw, 1.25rem);
  line-height: 1.8;
  color: var(--text);
  font-style: italic;
  margin: 0 0 2rem;
`;

const AuthorName = styled.p`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.25rem;
`;

const AuthorRole = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
`;

const CaseStudyLink = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--accent);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--accent-hover);
  }
`;

const testimonial = {
  content: "Working with Lucid Code Labs has been an incredible experience. They took our vision for Loyalty Club PLC and brought it to life with a level of expertise, creativity, and attention to detail that exceeded our expectations. Their team developed a robust, user-friendly loyalty platform that not only looks fantastic but also works flawlessly. We couldn't be happier with the result and highly recommend them to anyone looking for a top-tier development partner.",
  author: 'Tony Lewis',
  role: 'CEO, Loyalty Club PLC',
  caseStudy: '/work/loyalty-club-plc',
};

const Testimonial = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Section>
      <Container ref={ref}>
        <QuoteMark>&ldquo;</QuoteMark>
        <QuoteText
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {testimonial.content}
        </QuoteText>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AuthorName>{testimonial.author}</AuthorName>
          <AuthorRole>{testimonial.role}</AuthorRole>
          <Link href={testimonial.caseStudy}>
            <CaseStudyLink>Read the case study &rarr;</CaseStudyLink>
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Testimonial;
