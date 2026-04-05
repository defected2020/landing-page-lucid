import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { portfolioProjects } from '../data/portfolioProjects';

const Section = styled.section`
  padding: 3rem 0;
  border-bottom: 1px solid var(--border);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Label = styled.p`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-subtle);
  margin-bottom: 2rem;
`;

const LogoRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem 3rem;
`;

const ClientName = styled(motion.span)`
  font-family: var(--font-display);
  font-size: clamp(0.875rem, 1.2vw, 1rem);
  font-weight: 600;
  color: var(--text-subtle);
  transition: color var(--transition-fast);
  white-space: nowrap;

  &:hover {
    color: var(--text);
  }
`;

const TrustedBy = () => {
  return (
    <Section>
      <Container>
        <Label>Trusted by teams building remarkable products</Label>
        <LogoRow
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {portfolioProjects.map((project) => (
            <Link key={project.slug} href={`/work/${project.slug}`}>
              <ClientName
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {project.name}
              </ClientName>
            </Link>
          ))}
        </LogoRow>
      </Container>
    </Section>
  );
};

export default TrustedBy;
