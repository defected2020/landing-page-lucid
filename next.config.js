/** @type {import('next').NextConfig} */
// Normal deploy (Vercel, `next start`): just `npm run build`.
// Static folder only (GitHub Pages, S3): STATIC_EXPORT=1 npm run build → deploy `out/`
// Project Pages URL https://user.github.io/repo/: also set BASE_PATH=/repo
const basePath = process.env.BASE_PATH || '';
const staticExport =
  process.env.STATIC_EXPORT === '1' || process.env.STATIC_EXPORT === 'true';

// Markdown files served as /admin documents must travel with the serverless
// functions; Next's tracer cannot see reads driven by the manifest.
const adminDocFiles = require('./content/adminDocs').map((d) => `./${d.file}`);

const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/admin/**': adminDocFiles,
      '/api/admin/**': adminDocFiles,
    },
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  ...(staticExport
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
