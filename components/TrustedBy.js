import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

const TrustedBy = () => {
  const logos = [...allLogos, ...allLogos]

  return (
    <section className="overflow-hidden border-b border-[#e5e7eb] bg-white py-12 max-md:py-6">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#9ca3af] max-md:mb-8 max-md:text-[0.625rem]">
        Trusted by teams building remarkable products
      </p>
      <div className="trustedby-track flex w-fit">
        {logos.map((item, i) => {
          const img = (
            <Image
              src={item.logo}
              alt={item.name}
              width={200}
              height={120}
              style={{ objectFit: 'contain', height: item.height, width: 'auto' }}
            />
          )
          return (
            <div
              key={`${item.name}-${i}`}
              className="trustedby-item flex h-20 w-[calc(100vw/3)] flex-shrink-0 items-center justify-center opacity-50 grayscale transition-[filter,opacity,transform] duration-fast ease-smooth hover:scale-105 hover:opacity-100 hover:grayscale-0 max-md:h-9 max-md:w-[50vw]"
            >
              {item.slug ? <Link href={`/work/${item.slug}`}>{img}</Link> : img}
            </div>
          )
        })}
      </div>
      <style jsx>{`
        @keyframes trustedby-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .trustedby-track {
          animation: trustedby-marquee 25s linear infinite;
        }
        .trustedby-track:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .trustedby-item :global(img) {
            transform: scale(0.8);
          }
        }
      `}</style>
    </section>
  )
}

export default TrustedBy
