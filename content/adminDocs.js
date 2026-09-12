// Files in this repository that show up as documents in /admin. `format` is
// 'markdown' (default) or 'html' (a self-contained page, shown in a frame).
//
// They deploy with the site, so a doc committed here is on production after
// the next push with no storage setup. Editing one in the admin UI saves a
// copy to the object store that overrides the repo version; deleting that
// copy brings the repo version back. Shared with next.config.js (CommonJS on
// purpose) so the files are bundled into the serverless functions on Vercel.

module.exports = [
  {
    file: 'content/admin-pages/leadgen-plan.html',
    format: 'html',
    title: 'Outbound Lead Generation Plan',
    tags: ['outreach', 'leadgen', 'scraper', 'mautic', 'plan'],
    pinned: true,
  },
  {
    file: 'SEO.md',
    title: 'SEO Runbook',
    tags: ['seo', 'runbook'],
    pinned: false,
  },
];
