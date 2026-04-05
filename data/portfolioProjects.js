const PLACEHOLDER = '/images/portfolio/placeholder.svg';

export const portfolioProjects = [
  {
    slug: 'brahma-sutras',
    name: 'Brahma Sutras',
    logo: '/images/logos/brahmsutras.png',
    url: 'https://www.brahmsutras.com',
    tagline: 'A refined digital presence for classical wisdom and commentary.',
    summary: [
      'We partnered with Brahma Sutras to translate a rich textual tradition into a calm, readable web experience that respects the depth of the source material while remaining approachable for modern readers.',
      'Our team focused on typography, hierarchy, and performance so long-form content loads quickly and reads comfortably across devices.',
      'Lucid Code Labs delivered a maintainable front end and content structure that the client can extend as their library and audience grow.',
    ],
    tags: ['Content-led design', 'Performance', 'Responsive layout'],
    screenshots: [
      { src: '/images/yoga_village1.png', alt: 'Brahma Sutras website — primary view', caption: 'Landing and hero presentation.' },
      { src: '/images/yoga_village2.png', alt: 'Brahma Sutras website — content section', caption: 'Key content and layout.' },
      { src: '/images/yoga_village3.png', alt: 'Brahma Sutras website — interior section', caption: 'Additional section and typography.' },
      { src: '/images/yoga_village4.png', alt: 'Brahma Sutras website — detail view', caption: 'Further pages and responsive treatment.' },
      { src: '/images/yoga_village5.png', alt: 'Brahma Sutras website — additional screen', caption: 'Extended layout and visual system.' },
    ],
  },
  {
    slug: 'atma-shambhala',
    name: 'Atma Shambhala',
    logo: '/images/logos/atmashambhala.png',
    url: 'https://www.atmashambhala.com',
    tagline: 'Immersive storytelling for a conscious brand.',
    summary: [
      'Atma Shambhala needed a digital space that mirrors the tone of their work: spacious, intentional, and emotionally resonant.',
      'We implemented responsive layouts and subtle motion where it supports the brand.',
      'The launch gave their team a flexible foundation to grow their community online.',
    ],
    tags: ['Brand-led UX', 'Visual storytelling', 'Motion'],
    screenshots: [
      { src: '/images/atma1.png', alt: 'Atma Shambhala website — primary view', caption: 'Landing and brand presentation.' },
      {
        src: '/images/atma2.png',
        alt: 'Atma Shambhala website — content section',
        caption: 'Key sections and layout.',
        objectFit: 'cover',
      },
      { src: '/images/atma3.png', alt: 'Atma Shambhala website — experiences and journeys', caption: 'Experiences, search, and program cards.' },
      { src: '/images/atma4.png', alt: 'Atma Shambhala website — screen 4', caption: 'Additional views and layout.' },
      { src: '/images/atma5.png', alt: 'Atma Shambhala website — screen 5', caption: 'Further pages and detail.' },
      { src: '/images/atma6.png', alt: 'Atma Shambhala website — screen 6', caption: 'Extended layout and visual system.' },
    ],
  },
  {
    slug: 'loyalty-club-plc',
    name: 'Loyalty Club PLC',
    logo: '/images/logos/loyalty.png',
    url: 'https://www.loyaltyclubplc.com',
    tagline: 'Enterprise-grade loyalty software and companion app, built for scale.',
    summary: [
      'Loyalty Club PLC required a robust platform for partners and end customers.',
      'Lucid Code Labs engineered the experience end to end—from information architecture and UI through to scalable implementation.',
      'We also developed a companion mobile app for the loyalty platform so the product reaches users wherever they are.',
      'The platform supports growth with a codebase and design system the team can evolve confidently.',
    ],
    tags: ['SaaS', 'Mobile app', 'Product design', 'Full-stack delivery'],
    screenshots: [
      { src: '/images/loyalty1.png', alt: 'Loyalty Club PLC platform — primary view', caption: 'Product overview and key interface.' },
      { src: '/images/loyalty2.png', alt: 'Loyalty Club PLC platform — feature section', caption: 'Core flows and layout.' },
      { src: '/images/loyalty3.png', alt: 'Loyalty Club PLC platform — additional screen', caption: 'Further views and responsive treatment.' },
    ],
  },
  {
    slug: 'inner-sphere',
    name: 'Inner Sphere',
    logo: '/images/logos/Innersphere.png',
    url: 'https://www.inner-sphere.net',
    tagline: 'A one-stop personal transformation app with habit tracking and mindfulness.',
    summary: [
      'Inner Sphere is a one-stop personal transformation app built to support everyday growth through habit tracking and mindfulness practices.',
      'Lucid Code Labs developed the complete product experience—including the full app and the landing page—so the brand and platform feel cohesive from first touch to daily use.',
      'The result is a scalable foundation the team can extend with new practices, programs, and community features.',
    ],
    tags: ['Mobile app', 'Habit tracking', 'Mindfulness', 'Landing page'],
    screenshots: [
      { src: '/images/inner1.png', alt: 'Inner Sphere app — primary view', caption: 'Core app experience and onboarding.' },
      { src: '/images/inner2.png', alt: 'Inner Sphere app — habit tracking', caption: 'Habit tracking and daily progress.' },
      { src: '/images/inner3.png', alt: 'Inner Sphere app — mindfulness practices', caption: 'Mindfulness practices and guided sessions.' },
    ],
  },
  {
    slug: 'awakenest',
    name: 'Awakenest (Stayfly Studio)',
    logo: '/images/logos/awakenist.png',
    url: 'https://www.stayflystudio.com/awakenest',
    tagline: 'A wellness festival in Thailand—community, program, and tickets in one flow.',
    summary: [
      'Awakenest is a wellness festival in Thailand hosted at Stayfly Studio in Koh Phangan.',
      'We built a structured, bilingual experience with clear calls to action for tickets and practical festival details.',
      'Lucid Code Labs delivered a production-ready marketing site that scales with schedule and FAQ updates.',
    ],
    tags: ['Event marketing', 'Bilingual content', 'Conversion-focused UI'],
    screenshots: [
      { src: '/images/awakenest3.png', alt: 'Awakenest festival — tickets and CTA', caption: 'Ticketing call-to-actions and conversion flow.' },
      { src: '/images/awakenest2.png', alt: 'Awakenest festival — schedule and details', caption: 'Program information and key details.' },
      { src: '/images/awakenest1.png', alt: 'Awakenest festival — primary view', caption: 'Festival landing and headline experience.' },
    ],
  },
  {
    slug: 'myth-os',
    name: 'Myth-OS',
    url: 'https://myth-os.net',
    tagline: 'A consciousness-development game with tarot readings and AI companions.',
    summary: [
      'Myth-OS set out to build a consciousness-development game that feels intentional, immersive, and emotionally resonant.',
      'We developed the core experience alongside an online tarot deck for readings, designed to support reflection and replayability.',
      'Lucid Code Labs also trained 9 distinct AI companions, each with their own tone and role in the journey.',
    ],
    tags: ['Game development', 'AI companions', 'Tarot deck', 'Experiential UX'],
    screenshots: [
      { src: '/images/mythos3.png', alt: 'Myth-OS — AI companions', caption: 'A cast of distinct AI companions supporting the journey.' },
      { src: '/images/mythos2.png', alt: 'Myth-OS — tarot reading interface', caption: 'Online tarot deck and reading flow.' },
      { src: '/images/mythos1.png', alt: 'Myth-OS — primary gameplay screen', caption: 'Core game experience and atmosphere.' },
    ],
  },
];

export function getPortfolioSlugs() {
  return portfolioProjects.map((p) => p.slug);
}

export function getPortfolioProjectBySlug(slug) {
  return portfolioProjects.find((p) => p.slug === slug) ?? null;
}
