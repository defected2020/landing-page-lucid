import { getPortfolioSlugs } from '../data/portfolioProjects';
import { getPublishedPosts } from '../data/blogPosts';
import { SITE_URL } from '../data/siteConfig';

// `lastmod` is only emitted where a real date exists (blog posts). Stamping
// today's date on every URL on every request tells Google the whole site
// changed daily, which it learns to distrust and then ignores.
const staticPages = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/work', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/services/ai-powered-software', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/ai-ml-integration', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/branding', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/business-intelligence', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/cloud-computing', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/data-analytics', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/data-management', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/digital-growth', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/mobile-app-development', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/process-automation', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/ux-ui-design', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/web-development', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/webhosting', priority: '0.7', changefreq: 'monthly' },
];

function generateSitemap() {
  const caseStudies = getPortfolioSlugs().map((slug) => ({
    path: `/work/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const posts = getPublishedPosts().map((post) => ({
    path: `/blog/${post.slug}`,
    priority: '0.6',
    changefreq: 'yearly',
    lastmod: post.date,
  }));

  const allPages = [...staticPages, ...caseStudies, ...posts];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    ({ path, priority, changefreq, lastmod }) => `  <url>
    <loc>${SITE_URL}${path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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
