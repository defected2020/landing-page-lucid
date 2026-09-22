# GEO analysis — lucidcodelabs.com

Generative Engine Optimisation: whether AI search surfaces (Google AI Overviews,
Google AI Mode, ChatGPT Search, Perplexity, Claude) can find, trust and cite this
site. Run 2026-09-21 with the `claude-seo` plugin (v2.3.1) against the live site.

Companion to [SEO.md](SEO.md), which covers classic search. Read that first —
the two share a diagnosis.

---

## GEO Readiness Score: 71/100

Re-measured against the live site. First run was **59**, then **67** after the
on-page work, then **71** once every post carried a diagram.

| Criterion | Weight | Run 1 | Run 2 | Now | What moved |
|---|---|---|---|---|---|
| Technical accessibility | 20% | 95 | 95 | 95 | Already maxed; sitemap 27 → 29 |
| Structural readability | 20% | 65 | 68 | 68 | Genuine question headings 1 → 2 of ~38 |
| Citability | 25% | 60 | 75 | **77** | Homepage definition; 3 → 5 posts; figure captions |
| Multi-modal content | 15% | 45 | 45 | **70** | Five hand-built diagrams, one per post |
| **Authority & brand signals** | **20%** | **25** | **42** | **42** | Person schema landed; off-site still zero |

**+8, and the ceiling is exactly where the first run said it was.** Every point
came from on-page work. The axis that carries the most weight in AI citation —
off-site entity presence — is unchanged, because nothing off-site was done.

Measured, not assumed: homepage `ai_patterns` is now `[]` (was `['cutting-edge']`),
all five posts carry `Person` authorship where three carried `Organization`, the
organisation schema names both founders, and post quality ranges 80–84 with zero
filler across the blog.

---

## The finding that matters

**Lucid Code Labs has no entity presence, and the name is crowded.**

Searching `"Lucid Code Labs" reddit OR linkedin OR youtube OR clutch` returns
nothing for this company. The search engine's own summary said: *"I couldn't find
a specific company called 'Lucid Code Labs.'"* What it returned instead:

| Company | Signal it has that you don't |
|---|---|
| **Lucid Labs** (Berlin, AI studio) | Companyhouse, Northdata, Implisense, **Tracxn profile**, active job listings; **named founder, Marek Janetzke**, ex-CEO of Flightright |
| **Lucid Code** | Its own Tracxn company profile — a third near-identical name |
| Lucid.Studio (Berlin) | Established LinkedIn company page |
| Lucid Reality Labs | Clutch 100 2023, VR/AR trade press, active LinkedIn |
| Lucid Labs LLC / Lucid Labs (DeFi) | Established LinkedIn company pages |
| Lucidworks, Lucid IT, Lucidsamples | Wikipedia articles |

The first row is the problem. There is a **registered Berlin AI agency called
Lucid Labs**, in your city and your sector, with company-registry records that
machines can verify. When an AI assistant is asked about an AI/software agency in
Berlin with "Lucid" in the name, it has a well-evidenced entity to resolve to,
and it is not you.

This is why brand mentions correlate ~3x more strongly with AI citation than
backlinks do (Ahrefs, 75,000 brands): AI search resolves an *entity* before it
cites a *page*. You currently have no entity to resolve to. Perfect passage
formatting cannot fix that, which is why the on-page items below are ranked
beneath it.

**Re-checked 2026-09-21, after `founder` schema shipped.** Searching
`"Lucid Code Labs" software studio Berlin founders` still returns Lucid Labs'
founder by name, with a Tracxn profile and a hiring page behind him, and states
plainly that the results *"don't provide specific founder information"* for Lucid
Code Labs. Naming your founders in your own JSON-LD does not make them findable —
schema on your own domain is a claim, not corroboration. A third name, **Lucid
Code**, also turned up with its own Tracxn profile. The namespace is more crowded
than the first pass recorded, not less.

It also reframes SEO.md's gap #3. "No off-site authority" is not only a ranking
problem — it is an identity problem, and the name collision makes it urgent
rather than gradual.

---

## What's already right

Worth stating plainly, because it means the foundation needs no work:

- **Server-side rendering.** AI crawlers do not execute JavaScript. Every heading
  and paragraph is present in the raw HTML — verified by fetching without a
  browser. Next.js static prerendering is doing its job.
- **Every AI crawler is allowed.** `robots.txt` is `User-agent: *` / `Allow: /`,
  which covers `OAI-SearchBot` (ChatGPT Search citability), `Claude-SearchBot`,
  `PerplexityBot` and `Googlebot`. No AI-specific directives needed.
- **`max-snippet:-1`** is set, so AI surfaces may quote at any length. This is the
  actual control for AI Overview appearance — there is no AI-specific opt-out file.
- **Image alt coverage is 100%** (32/32 on the homepage).
- **Blog content is genuinely good.** 1,500–1,900 words each, scoring 80–84 on the
  plugin's quality scorer with **zero** AI-filler phrases detected. Specific,
  opinionated, technically concrete — exactly what gets cited. `BlogPosting` and
  `BreadcrumbList` schema present on all three.

**`/llms.txt` is absent and that is fine.** Google states explicitly that
`llms.txt` neither helps nor hurts. Do not let anyone sell you one as an AI
ranking lever.

---

## Fixed in this pass

- [x] **404 GitHub link removed from the contact section.**
      `components/Contact.js` hardcoded `github.com/lucidcodelabs` (confirmed
      404) and `linkedin.com/company/lucidcodelabs`, bypassing the
      `enabled` guard in `data/siteConfig.js` entirely. The footer respected the
      guard; the contact section never did, so the site was publicly linking a
      dead profile — the exact thing SEO.md records as already fixed. Contact now
      renders from `activeSocialProfiles()` like the footer, so profiles appear in
      both places the moment you flip `enabled: true`. Verified gone from all 27
      built pages.

---

## Recommended, in priority order

### 1. Establish the entity (off-site, highest impact)

Nothing on the website substitutes for this.

- [ ] **LinkedIn company page.** The single cheapest entity anchor. Already on
      SEO.md's list; it is now the top item, not a nice-to-have.
- [ ] **GitHub organisation.** You are a software agency with no public code
      presence. Even a few real repos disambiguate you from the other Lucids.
- [ ] **Clutch / GoodFirms listing.** Note that Lucid Reality Labs ranks on
      Clutch — this is the register AI assistants read for agency queries.
- [ ] **Decide the name question.** Consider consistently presenting as
      "Lucid Code Labs" in full, never "Lucid Labs", in every off-site profile,
      bio and byline. Consistency is what lets a machine separate you from the
      Berlin company with the near-identical name.
- [ ] **German company registry.** If the entity is registered, its registry
      record is a machine-verifiable signal the competing Lucid Labs already has.

*How you'd know it worked:* ask ChatGPT or Claude "who are Lucid Code Labs?" in a
fresh session. Today it cannot answer. That question is the KPI.

### 2. Person schema and bylines — **done**

Currently **every** article is authored by an `Organization`, there is no `Person`
schema anywhere on the site, and no visible byline. Anonymous authorship is a weak
E-E-A-T signal, and it wastes the two real, named, credentialed engineers you
already display on the homepage and `/about`.

All three posts are George's, confirmed 2026-09-21, and are now attributed.

- Each post carries `author: 'george'`, an id into `data/team.js`, so a name or
  role is only ever edited in one place.
- Posts render a visible byline — *"By George Beard, Founder & Fullstack
  Developer"* — with the name linking to `/about`. Both the name **and** the role
  are on the page because the schema claims both, and structured data must never
  describe a byline a reader cannot see.
- `createPersonSchema()` emits `Person` with `@id`, `jobTitle`, `url` and
  `worksFor` pointing at the organisation. `createArticleSchema` falls back to the
  organisation when a post has no author, so nothing breaks for future posts.
- The organisation schema now carries `founder: [Aline, George]`. Both are named
  and pictured on the homepage and `/about`, so the claim is backed by visible
  content — and it ties two real humans to the entity, which is the weakest signal
  in this audit.

Still open: **no `sameAs` on either `Person`.** None of the social profiles in
`siteConfig` exist, and the company GitHub/LinkedIn would not be a person's
`sameAs` in any case. Personal profiles are what close the loop from article →
human → entity, and they do not exist yet. This is item 1's work.

### 3. Question-form headings (on-site, low risk)

Across the three blog posts, roughly one H2 in twenty is phrased as a question
("So when is the answer really native?"). The rest are statements —
"The ledger is the product", "Where the shared line breaks". They are good
writing, and I would not touch the voice.

The surgical version: **add** a question-phrased H2 where one is already implicitly
being answered, rather than rewriting existing ones. "What actually shares" →
"What actually shares between iOS and Android?" costs nothing and matches how the
query is typed.

### 4. Give the homepage the definition `/about` already has — **done**

~44% of AI citations come from the first 30% of a page, and the optimal citable
passage is 134–167 self-contained words.

`/about` is already right, and is the most citable page on the site. It opens
*"Lucid Code Labs is a founder-led software studio. We design and build AI-powered
platforms, web applications, and mobile products for clients around the world,"*
then *"run by its two founders, and the people you meet are the people who do the
work."* Specific, self-contained, liftable verbatim. Leave it alone.

The **homepage** is the gap. It is 632 words and its opening paragraph is
*"We combine cutting-edge technology with creative problem-solving to deliver
software that transforms businesses and delights users"* — which is the one piece
of copy on the site that would fit any agency on earth, sitting in the highest-value
citation real estate you own. An AI asked "who are Lucid Code Labs?" gets nothing
liftable from it.

Note that Berlin does **not** disambiguate you here — Lucid Labs GmbH is also
Berlin. What separates you is the full name used consistently.

**Rewritten 2026-09-21** to:

> Lucid Code Labs is a founder-led software studio in Berlin, building AI-powered
> platforms, web applications and mobile apps for clients worldwide. The people
> you meet are the people who write the code.

Every claim is one the site already makes: "founder-led software studio" and
"clients around the world" are `/about`'s own subtitle, Berlin is `CONTACT.locality`,
the service list is `/about`'s meta description, and the closing sentence restates
`/about`'s "the people you meet are the people who do the work" — accurate, since
`data/team.js` lists two founders who are both engineers.

The first sentence is deliberately self-contained so it can be lifted whole in
answer to "who are Lucid Code Labs?". Verified server-rendered in
`.next/server/pages/index.html`, since AI crawlers do not execute JavaScript.
`components/Hero.js` carries a comment explaining why the name is spelled out, so
it does not get optimised back into a slogan.

### 5. Trim three stock phrases

The quality scorer flagged these on the two pages sampled; grepping the repo found
13 instances across 7 files. The blog has none of this.

**Done in this pass** — five removals in body copy, no meaning lost, nothing
indexed touched. `cutting-edge` no longer appears anywhere on the site: removed
from `components/Hero.js` (see item 4), `data/services.js`,
`pages/services/web-development.js` and `pages/services/cloud-computing.js`, and
`at the heart of` in `pages/services/web-development.js`.

**Left alone deliberately:** the `Transform your …` subtitles on five service
pages. Several are also `description=` meta and `createServiceSchema` text, so
rewriting them changes what Google has already indexed — worth doing, but as a
deliberate copy pass rather than a side effect of this one. And the hero
paragraph, which is item 4's business.

### 6. Multi-modal — **partly done**

Every post now carries a hand-authored SVG diagram, built to show a mechanism the
prose otherwise makes the reader assemble:

| Post | Diagram |
|---|---|
| Offline-first | The three architectures called "offline", and where the source of truth sits in each |
| Push notifications | The five delivery stages, and the boundary past which you measure nothing |
| React Native or native | Share of files against share of effort — the same split, two proportions |
| Adding AI | The staging table and review gate, with the direct write-through crossed out |
| Loyalty platform | A QR that carries the grant against one that carries identity |

They are inline SVG in `components/blogDiagrams.js`, keyed by id and referenced
from `data/blogPosts.js` as `{ type: 'figure', diagram, caption }`. Built on
`currentColor` and the theme's own CSS variables, so one drawing serves light and
dark with no second asset and no JavaScript — verified in both. Each is a real
`<figure>` with a `<figcaption>` and `role="img"` plus an `aria-label` carrying
the same claim, and all of it is server-rendered, which matters because AI
crawlers do not execute JavaScript. No `dangerouslySetInnerHTML` anywhere.

Still missing for a full multi-modal score: video, and any interactive element
such as a calculator. Both are real effort and neither is next in priority.

---

## Deliberately not recommended

- **`/llms.txt`** — Google ignores it. No citation value.
- **Rewriting content "for AI"** — Google's own guidance rejects AI-specific
  rephrasing, chunking and keyword rewriting as ineffective. The blog is already
  above the bar.
- **Mention-farming** — buying mentions is the same trap as buying links.

---

## Re-running this

```bash
P=~/.claude/plugins/cache/agricidaniel-claude-seo/claude-seo/2.3.1
"$P/scripts/claude-seo" doctor --json          # check runtime
"$P/scripts/claude-seo" run parse_html.py <file> --json
"$P/scripts/claude-seo" run content_quality.py <file> --json
```

Or, in a fresh Claude Code session (the plugin is installed, so `/seo` is
available): `/seo geo https://www.lucidcodelabs.com`.

A full `/seo audit` fans out 7–11 subagents, five of them on Opus. It is
expensive; the narrow commands above are not.
