import Head from 'next/head';
import { SITE_URL, SITE_NAME, CONTACT, sameAsUrls } from '../data/siteConfig';

const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`;

const SEO = ({
  title = 'Lucid Code Labs — Software Development Agency',
  description = 'We build intelligent, scalable software — from AI-powered platforms to stunning web and mobile experiences. Berlin-based, working globally.',
  canonical,
  image = DEFAULT_OG_IMAGE,
  path = '',
  type = 'website',
  jsonLd,
  noindex = false,
  publishedTime,
}) => {
  const url = canonical || `${SITE_URL}${path}`;
  // Relative paths are resolved against the canonical host; social crawlers
  // reject relative og:image values.
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1'}
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
};

export default SEO;

// Reusable JSON-LD schemas

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/lucid-logo.png`,
  image: `${SITE_URL}/images/og-default.png`,
  description:
    'Software development agency specializing in AI, web development, mobile apps, and digital transformation. Berlin-based, working globally.',
  email: CONTACT.email,
  telephone: CONTACT.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: CONTACT.locality,
    addressCountry: CONTACT.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: CONTACT.email,
    telephone: CONTACT.phone,
    areaServed: 'Worldwide',
    availableLanguage: ['English', 'German'],
  },
  areaServed: 'Worldwide',
  knowsAbout: [
    'Artificial intelligence',
    'Web development',
    'Mobile app development',
    'UX/UI design',
    'Data analytics',
    'Process automation',
  ],
  sameAs: sameAsUrls(),
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export const createServiceSchema = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  url: `${SITE_URL}${path}`,
  areaServed: 'Worldwide',
});

export const createBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    ...(item.url ? { item: `${SITE_URL}${item.url}` } : {}),
  })),
});

// Drives the FAQ rich result in Google. Only emit this where the questions and
// answers are genuinely visible on the page — hidden FAQ markup is a
// structured-data violation.
export const createFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

export const createArticleSchema = ({ title, description, path, datePublished, image }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description,
  url: `${SITE_URL}${path}`,
  datePublished,
  dateModified: datePublished,
  image: image ? `${SITE_URL}${image}` : `${SITE_URL}/images/og-default.png`,
  author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  publisher: { '@id': `${SITE_URL}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
});

export const createCaseStudySchema = ({ name, description, path, image, url }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `${name} — Case Study`,
  description,
  url: `${SITE_URL}${path}`,
  image: image ? `${SITE_URL}${image}` : `${SITE_URL}/images/og-default.png`,
  author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  publisher: { '@id': `${SITE_URL}/#organization` },
  about: url ? { '@type': 'CreativeWork', name, url } : { '@type': 'CreativeWork', name },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
});
