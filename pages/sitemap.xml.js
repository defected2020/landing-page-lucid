import { getPortfolioSlugs } from '../data/portfolioProjects';

const SITE_URL = 'https://lucidcodelabs.com';

const staticPages = [
  '',
  '/services',
  '/work',
  '/services/ai-powered-software',
  '/services/ai-ml-integration',
  '/services/branding',
  '/services/business-intelligence',
  '/services/cloud-computing',
  '/services/data-analytics',
  '/services/data-management',
  '/services/digital-growth',
  '/services/mobile-app-development',
  '/services/process-automation',
  '/services/ux-ui-design',
  '/services/web-development',
  '/services/webhosting',
];

function generateSitemap() {
  const portfolioSlugs = getPortfolioSlugs();
  const dynamicPages = portfolioSlugs.map((slug) => `/work/${slug}`);
  const allPages = [...staticPages, ...dynamicPages];
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : path === '/services' || path === '/work' ? '0.8' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSitemap();
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
