// Single source of truth for site-wide identity used by SEO tags, structured
// data, and the footer. Keep this in sync with the live DNS setup: the site is
// served from the www host, and the apex redirects to it.
export const SITE_URL = 'https://www.lucidcodelabs.com';
export const SITE_NAME = 'Lucid Code Labs';

export const CONTACT = {
  email: 'info@lucidcodelabs.com',
  phone: '+4917681417544',
  phoneDisplay: '+49 176 8141 7544',
  locality: 'Berlin',
  country: 'DE',
};

// `enabled: false` profiles are hidden in the footer and omitted from the
// Organization `sameAs` list. All three currently return 404 — linking to a
// profile that does not exist wastes crawl signals and breaks trust, and
// claiming it in structured data is a false statement to search engines.
// Create the profile, then flip the flag.
export const SOCIAL_PROFILES = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/lucidcodelabs', enabled: false },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/lucidcodelabs', enabled: false },
  { id: 'x', label: 'X (Twitter)', url: 'https://x.com/lucidcodelabs', enabled: false },
];

export const activeSocialProfiles = () => SOCIAL_PROFILES.filter((p) => p.enabled);
export const sameAsUrls = () => activeSocialProfiles().map((p) => p.url);
