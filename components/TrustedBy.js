import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import { portfolioProjects } from '../data/portfolioProjects'

const additionalClients = [{ name: 'Shoptimized', logo: '/images/logos/shoptimized.png' }]

const logoHeights = { 'atma-shambhala': '120px' }
const portfolioLogos = portfolioProjects
  .filter((p) => p.logo)
  .map((p) => ({ name: p.name, logo: p.logo, slug: p.slug, height: logoHeights[p.slug] || '80px' }))
const midpoint = Math.ceil(portfolioLogos.length / 2)
const allLogos = [
  ...portfolioLogos.slice(0, midpoint),
  ...additionalClients.map((c) => ({ name: c.name, logo: c.logo, slug: null, height: '60px' })),
  ...portfolioLogos.slice(midpoint),
]

const Section = styled.section`
  padding: 3rem 0;
  border-bottom: 1px solid #e5e7eb;
  overflow: hidden;
  background-color: #ffffff;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
`

const Label = styled.p`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9ca3af;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 0.625rem;
    margin-bottom: 1rem;
  }
`

const marquee = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

const Track = styled.div`
  display: flex;
  width: fit-content;
  animation: ${marquee} 25s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`

const LogoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: calc(100vw / 3);
  height: 80px;
  filter: grayscale(100%);
  opacity: 0.5;
  transition:
    filter var(--transition-fast),
    opacity var(--transition-fast),
    transform var(--transition-fast);

  &:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: calc(100vw / 3);
    height: 36px;

    img {
      transform: scale(0.45);
    }
  }
`

const TrustedBy = () => {
  const logos = [...allLogos, ...allLogos]

  return (
    <Section>
      <Label>Trusted by teams building remarkable products</Label>
      <Track>
        {logos.map((item, i) => {
          const img = (
            <Image src={item.logo} alt={item.name} width={200} height={120} style={{ objectFit: 'contain', height: item.height, width: 'auto' }} />
          )
          return <LogoItem key={`${item.name}-${i}`}>{item.slug ? <Link href={`/work/${item.slug}`}>{img}</Link> : img}</LogoItem>
        })}
      </Track>
    </Section>
  )
}

export default TrustedBy
