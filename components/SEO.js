import Head from 'next/head';

const SITE_URL = 'https://lucidcodelabs.com';
const SITE_NAME = 'Lucid Code Labs';
// Replace with a proper 1200x630 PNG when available
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/lucid-logo.png`;

const SEO = ({
  title = 'Lucid Code Labs — Software Development Agency',
  description = 'We build intelligent, scalable software — from AI-powered platforms to stunning web and mobile experiences. Berlin-based, working globally.',
  canonical,
  image = DEFAULT_OG_IMAGE,
  path = '',
  type = 'website',
  jsonLd,
}) => {
  const url = canonical || `${SITE_URL}${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

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
  '@type': 'Organization',
  name: 'Lucid Code Labs',
  url: SITE_URL,
  logo: `${SITE_URL}/images/lucid-logo.png`,
  description:
    'Software development agency specializing in AI, web development, mobile apps, and digital transformation. Berlin-based, working globally.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Berlin',
    addressCountry: 'DE',
  },
  sameAs: [],
};

export const createServiceSchema = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: 'Lucid Code Labs',
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
