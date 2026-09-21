# SEO runbook — lucidcodelabs.com

Working notes for the site's search visibility. Started 2026-08-26.
Update the checklist as you go so the next session picks up where you left off.

---

## Where things stand

The site is technically healthy and ranks for its brand name — searching
"Lucid Code Labs" returns the homepage. It does **not** rank for anything else,
and the reason was never a technical defect. The three real gaps were:

1. **No measurement** — no Search Console access, no analytics.
2. **No content** — 17 brochure pages, nothing targeting a query anyone types.
3. **No off-site authority** — no backlinks, no directory presence, no Google
   Business Profile.

Phases 0–2 (everything that lives in code) are implemented. What remains needs
a browser and your accounts.

> **On SEO cold emails:** the "Aayra Ruiz" message that started this work is a
> mass-sent template. Nobody can guarantee a Google ranking — Google says so
> itself. Vendors behind these emails sell bulk directory submissions and
> purchased links, which is exactly what Google's spam updates penalise.
> Don't reply; replying confirms a live address.

---

## Your checklist

### Not done yet

- [x] **Search Console.** Domain property `sc-domain:lucidcodelabs.com` is
      verified and owned by britcardmeme@gmail.com (checked 2026-09-12). No
      `GOOGLE_SITE_VERIFICATION` env var is needed.
- [x] **Sitemap submitted** 2026-09-12 — status Success, 27 URLs discovered.
- [x] **Indexing requested** 2026-09-12 for `/`, `/about`, `/services`, `/work`,
      `/blog`, `/services/web-development`, `/services/ai-powered-software`.
      Note: before this, Google had `www` homepage as "Alternative page with
      proper canonical tag" (it had picked the non-www URL) and
      `/services/ai-powered-software` as "not served over HTTPS". Both should
      clear on recrawl now that canonicals say www. Re-check in the monthly review.
- [x] **Vercel Analytics enabled** 2026-09-12 (free tier). **Speed Insights**
      was already on — RES 76 on desktop, "needs improvement".
- [ ] **Vercel → Settings → Domains → lucidcodelabs.com → Edit.** Change the
      redirect dropdown from **307 Temporary** to **308 Permanent** and Save.
      (Claude in Chrome is blocked from domain changes; one click for you.)
- [ ] **Bing Webmaster Tools** — [bing.com/webmasters](https://www.bing.com/webmasters),
      "Import from Google Search Console". Five minutes, and it also feeds
      DuckDuckGo and several AI assistants.
- [ ] **Google Business Profile** — [business.google.com](https://business.google.com).
      Name *Lucid Code Labs*, category *Software company*, Berlin, phone
      +49 176 8141 7544, site `https://www.lucidcodelabs.com`. Verification is
      usually a postcard, so start it early. **This is the fastest real
      visibility win available** — map-pack results arrive in weeks, not months.
- [ ] **Social profiles.** The GitHub org, LinkedIn company page and X account
      linked in the footer all return 404, so they are currently hidden. Create
      them, then flip `enabled: true` in `data/siteConfig.js` — they reappear in
      the footer *and* in the Organization `sameAs` automatically.
- [ ] **Directories** — Clutch, GoodFirms, DesignRush. These dominate
      agency-search results; being listed inside them beats trying to outrank
      them.
- [ ] **Reviews** — ask 3–5 past clients for a Clutch or Google review.
- [ ] **Client footer backlinks** — ask each client whose site you built for a
      "Built by Lucid Code Labs" footer link. Most valuable links available to
      you: relevant, earned, and each one is live proof of the work.
- [ ] **Decide the "trained" wording.** `data/portfolioProjects.js` and
      `data/caseStudyContent.js` both say Lucid *"trained 9 distinct AI
      companions"* for Myth-OS. If they were prompt-designed rather than
      fine-tuned, change "trained" to "built" in both — it is a capability claim
      on a public page.
- [ ] **Flesh out two case studies.** `/work/awakenest` and `/work/myth-os` are
      thin because no repository existed to verify anything. Anything real you
      add to `data/caseStudyContent.js` helps.

### Done (branch `seo-implementation`, commit 2e15f7b)

- [x] Canonical host standardised on `www` across all 27 pages.
- [x] Homepage `<h1>` server-rendered (it was shipping empty).
- [x] Broken social links hidden rather than leaking link equity.
      **Regression found and fixed 2026-09-21:** `components/Contact.js`
      hardcoded the GitHub and LinkedIn URLs, bypassing the `enabled` guard,
      so the live contact section was still linking a 404 GitHub profile.
      It now renders from `activeSocialProfiles()` like the footer.
- [x] Sitemap `lastmod` made honest; `/about` and `/blog` added.
- [x] Font preconnects for LCP.
- [x] Vercel Analytics + Speed Insights installed.
- [x] Real 1200×630 Open Graph card.
- [x] Six case studies expanded (~250 → 900–1,300 words each).
- [x] `/blog` with three engineering posts.
- [x] `/about` page with team, Berlin location, NAP consistency.
- [x] FAQ sections + `FAQPage` schema on four service pages.

---

## How the code is organised

| File | Purpose |
|---|---|
| `data/siteConfig.js` | **Single source of truth** for site URL, contact details, social profiles. Change the canonical host here and it propagates everywhere. |
| `components/SEO.js` | Meta tags, Open Graph, Twitter cards, and all JSON-LD schema builders. |
| `data/caseStudyContent.js` | Long-form case study content, keyed by slug. |
| `data/blogPosts.js` | Blog posts as content blocks, plus reading-time and date helpers. |
| `data/serviceFaqs.js` | FAQ content keyed by service page. |
| `components/FAQ.js` | Renders FAQs; pairs with `createFAQSchema`. |
| `pages/sitemap.xml.js` | Generated sitemap; add new static routes here. |
| `public/robots.txt` | Crawl rules and sitemap pointer. |

### Adding a blog post

Append to `blogPosts` in `data/blogPosts.js`:

```js
{
  slug: 'url-slug',
  title: 'Title, under 70 characters',
  description: 'Meta description, under 165 characters.',
  date: '2026-09-15',        // YYYY-MM-DD, drives article schema
  draft: false,              // true = hidden from listing, sitemap, and index
  tags: ['Tag one', 'Tag two'],
  body: [
    { type: 'p',  text: 'Opening paragraph — no heading first.' },
    { type: 'h2', text: 'A section heading' },
    { type: 'ul', items: ['point one', 'point two'] },
  ],
}
```

The route, sitemap entry, schema and reading time are all automatic.

### Adding FAQs to another service page

1. Add the key and Q&A pairs to `data/serviceFaqs.js`.
2. In the page: import `FAQ`, `getServiceFaqs`, and `createFAQSchema`; add
   `const faqs = getServiceFaqs('your-key');`; add `createFAQSchema(faqs)` to the
   `jsonLd` array; render `<FAQ faqs={faqs} />` before the CTA section.

### Adding a new page

Create it under `pages/`, give it an `<SEO>` block with `path`, and **add the
route to `staticPages` in `pages/sitemap.xml.js`** — that step is easy to forget.

---

## Gotchas

- **Node version.** Node 16 is the default on this machine and Next.js needs
  18+. Before any build or dev run:
  `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"`
- **FAQ accordions.** Radix unmounts closed panels, which would leave the
  marked-up answers missing from the HTML and make the `FAQPage` schema invalid.
  `components/FAQ.js` uses `forceMount` plus a scoped collapse rule to keep them
  present. **Keep both** — removing either silently breaks the structured data.
- **Never emit FAQ schema for answers not visible on the page.** That is a
  structured-data violation, not a shortcut.
- **`sameAs` must only list profiles that exist.** Listing a 404 is a false
  statement to Google. That is what the `enabled` flags in `siteConfig.js` guard.
- **Don't stamp today's date as `lastmod`** on every sitemap URL. Google learns
  to distrust inaccurate `lastmod` and then ignores it.
- **Verifying rendered output:** the Chrome extension can't reach
  `localhost:3040`. Inspect `.next/server/pages/*.html` after a build, or curl
  `http://127.0.0.1:3040`, rather than relying on screenshots.

---

## Guardrails

- **Don't buy links or "SEO packages."** Purchased backlinks and bulk directory
  spam are what Google's spam updates exist to catch.
- **Don't trust "guaranteed page 1."** Any vendor leading with a guarantee has
  disqualified themselves.
- **Don't mass-produce AI content.** Thin generated posts get demoted site-wide.
  Two honest posts a month beat thirty generated ones. Everything currently on
  the site was fact-checked against real source material — 141 unsupported
  claims were removed before publication. Hold new content to that bar.
- **Don't keyword-stuff.** The brand voice is an asset.

---

## AI search (GEO)

See [GEO-ANALYSIS.md](GEO-ANALYSIS.md) — whether AI Overviews, ChatGPT and
Perplexity can cite this site. Readiness 59/100: the technical side is done,
but the brand has no entity presence and shares its name with a registered
Berlin AI agency (**Lucid Labs GmbH**), which is a stronger reason to create
the LinkedIn and GitHub profiles than link equity was.

## Monthly review

In Search Console, check:

- Indexed pages (target: all 27)
- Total impressions and clicks
- Share of **non-brand** queries — this is the number that matters
- Average position for five named target queries

**The KPI that pays rent:** contact-form enquiries that mention finding you on
Google.

### Honest timelines

| Target | Realistic timeline |
|---|---|
| Brand searches | Already ranking; cleaner within days of deploy |
| Berlin map pack | 2–6 weeks after Business Profile + first reviews |
| Case study / blog long-tail | First impressions 4–8 weeks, growth by month 3 |
| Service-page commercial queries | 3–6 months |
| "software development company" | Not the game — directories own head terms |

---

Full audit and plan: https://claude.ai/code/artifact/5b133ff6-0035-43ae-b3cf-766116b5a922
