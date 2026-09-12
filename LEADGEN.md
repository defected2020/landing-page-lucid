# Lucid Code Labs — Outbound Lead Generation Plan

**Status:** v1 seed plan, 2026-09-12
**Owner:** George
**Companion docs:** `SEO.md` (inbound), this file (outbound). A separate scraper build spec will be derived from Section 11.

This plan covers five things, in the order you need them:

1. Who we are hunting and why (ICP + offer)
2. What the scraper must collect (data model)
3. How the scraper should be built and run (architecture outline)
4. Where leads live (Postgres + Mautic + sending tool)
5. Email infrastructure and warm-up, which starts **today** because it is the slowest part

Section 10 is the immediate action list. Section 11 is the seed for the scraper build plan.

---

## 0. Guiding decisions

These are the calls the rest of the plan is built on. Change them here and the rest follows.

| Decision | Choice | Why |
|---|---|---|
| Volume target | **200–400 verified, qualified leads/day**, not 30,000 | Sending capacity is the bottleneck (~25 cold emails per inbox per day). 30k unverified leads/day burns domains and gets you blacklisted; it does not get you clients. |
| Primary cold-email markets | **US, UK, Australia, Canada** (English-speaking, legally workable) | Germany and Austria treat unsolicited B2B email as unfair competition (§7 UWG). Cold email into DACH carries Abmahnung risk. See Section 2. |
| DACH strategy | **LinkedIn, phone, Google Business, referrals, and warm email only** | Berlin is your home market and your credibility base. Reach it through channels that are legal and personal, and feed those contacts into Mautic with consent. |
| System of record | **Own Postgres database** | Full history, scoring, dedupe, suppression, and provenance live here. Nothing else is trusted. |
| Marketing automation | **Mautic** (self-hosted) for segments, nurture, forms, tracking, unsubscribes | Receives only verified, scored, compliant contacts. Never sees raw scraper output. |
| Cold sending | **Dedicated cold-email sequencer** (Smartlead or Instantly) on **secondary domains** | Mautic and Zoho are not built for cold outreach: no inbox rotation, no warm-up, no reply detection, and one bad batch damages the domain that carries `info@lucidcodelabs.com`. |
| Scraper stack | **Node/TypeScript + Crawlee + Playwright + Postgres**, Claude API for extraction and personalization, on a small Hetzner VPS | Matches your existing skills, cheap, GDPR-friendly hosting. Details in Section 4. |
| Personalization hook | **A real, automated audit finding about the prospect's own website** | You sell web and software work. The scraper can measure the prospect's site (speed, mobile, SSL, stack age). That is a hook no generic lead list has. |

---

## 1. Who we are targeting (ICP) and what we offer

Lucid Code Labs sells web development, mobile apps, UX/UI, AI-powered software, process automation, data/BI, and hosting. Outbound works when one segment maps to one concrete, cheap-to-say offer. Start with segments A and B; add the others once the machine runs.

### Segment A — Agencies that need a development partner (white-label)

- **Who:** Marketing, branding, SEO, and design agencies in the US, UK, AU, CA with 3–30 staff and no in-house developers.
- **Signals:** Portfolio shows Webflow/WordPress only; job posts for "freelance developer"; "we partner with" language; Clutch/Agency listings tagged "marketing" but not "development".
- **Offer:** Berlin-based senior dev team on white-label terms; fixed-price builds; Next.js/React/Shopify/mobile; EU time zone overlaps the US morning and the full UK/AU day split.
- **Why first:** Agencies buy repeatedly, understand scope, and pay on time. One good agency relationship equals dozens of SMB one-offs.

### Segment B — Established local businesses with an outdated website

- **Who:** Dentists, clinics, law firms, accountants, real estate brokers, hotels, gyms, restaurants with multiple locations, trade contractors. Businesses with revenue and a site that embarrasses them.
- **Signals (all measurable by the scraper):** Lighthouse mobile performance under 50; no HTTPS or expired certificate; copyright year two or more years old; WordPress with an old jQuery; not mobile-responsive; no online booking where competitors have it; Google rating 4.3+ with 50+ reviews (proves the business is healthy).
- **Offer:** "Your site scores X on mobile; here is the one thing costing you calls." Redesign with booking/lead capture, delivered in a fixed timeline.
- **Markets:** US, UK, AU, CA by email. Berlin and DACH via LinkedIn/phone/GBP.

### Segment C — E-commerce stores with performance problems

- **Who:** Shopify, WooCommerce, Magento stores doing an estimated $500k–$10M/year.
- **Signals:** Slow product pages, heavy theme, no headless setup, app-bloat, Meta Ad Library shows active ads (they are spending money that a slow site wastes).
- **Offer:** Performance and conversion engineering, headless Shopify, custom features, AI product search.

### Segment D — Funded early-stage startups

- **Who:** Pre-seed to Series A companies listed on Wellfound, Crunchbase, YC directory, Product Hunt; EU and US.
- **Signals:** Recent funding announcement; hiring for their first engineers; landing page but no product; "coming soon".
- **Offer:** MVP and AI-feature build-outs with a senior team, faster than hiring.

### Segment E — Berlin / DACH (relationship channel, not cold email)

- **Who:** Same profiles as A–D but local.
- **Channel:** LinkedIn connection + short message, phone call, Google Business Profile, meetups (you already go), referrals from existing clients, footer backlinks (see `SEO.md`).
- **Email only after** a reply, a meeting, a form fill, or a clearly published B2B address and a message that is unmistakably relevant to their business. Log the lawful basis in the database (Section 3.5).

---

## 2. Legal and deliverability ground rules

These are not optional and they shape the data model. You are a German company processing personal data; GDPR applies to every contact record regardless of where the person sits.

### 2.1 Market rules for unsolicited B2B email

| Market | Rule of thumb | Practical requirement |
|---|---|---|
| **USA** (CAN-SPAM) | Allowed, opt-out based | Accurate sender, no misleading subject, physical postal address in every email, working opt-out honored within 10 days. |
| **UK** (PECR + UK GDPR) | Allowed to corporate addresses (companies, LLPs), opt-out based; sole traders and partnerships need consent | Identify yourself, provide opt-out, keep a legitimate-interest assessment on file. Prefer `name@company` over generic role addresses. |
| **Australia** (Spam Act) | Consent required, but "inferred consent" exists for conspicuously published business addresses when the message is relevant to their role | Only email addresses published on the business's own site; message must relate to their business; unsubscribe required. |
| **Canada** (CASL) | Consent required; "conspicuous publication" exception for B2B addresses without a no-spam notice, message relevant to their role | Same as AU. Keep the source URL of every address as proof. |
| **Germany / Austria** (UWG, DSGVO) | Unsolicited email needs prior express consent, even B2B | **Do not cold email.** Use LinkedIn, phone (B2B phone requires only presumed consent in Germany, still risky), post, GBP. |
| **Rest of EU** | Varies; NL, IT, FR restrictive | Skip for v1. |

Two consequences for the scraper:

- **Provenance is a required field.** Every email must carry `source_url`, `source_type`, and `captured_at`. This is your evidence of "conspicuously published" and of legitimate interest.
- **Jurisdiction is a required field.** Country drives whether a contact is eligible for cold email at all.

### 2.2 GDPR housekeeping (applies to all records)

- Lawful basis: legitimate interest (Art. 6(1)(f)) for B2B prospecting. Write a one-page Legitimate Interest Assessment and keep it with this plan.
- Provide a privacy notice link in every cold email and honor access/erasure requests within 30 days. Add `/privacy` on the site covering prospect data if it does not already.
- Retention: delete or anonymise contacts with no engagement after 12 months. Store the `retention_until` date on every record.
- Suppression: one global `do_not_contact` list in Postgres, synced to Mautic and the sequencer daily. Unsubscribes, bounces, complaints, and "please remove me" replies all land there within 24 hours.
- Do not scrape or store special-category data, personal phone numbers of individuals, or anything from behind a login.

### 2.3 Platform terms

- **LinkedIn:** do not scrape it. Automated collection violates their terms and they litigate. Use Sales Navigator manually for DACH and for enrichment of names/titles, or buy enrichment from a licensed provider.
- **Google Maps:** use the official **Places API (New)** for discovery. It is legal, has a free monthly tier, and needs no proxies. Scraping maps.google.com directly is fragile and against terms.
- **Company websites:** crawl politely. Respect `robots.txt`, identify yourself with a real user agent and contact URL, cap at one request every few seconds per host, cache everything.
- **Directories (Clutch, Yelp, Yell, TrueLocal, Wellfound, Crunchbase):** read their terms; most forbid bulk scraping. Use them for manual seed lists and use APIs where they exist.

### 2.4 Mailbox provider requirements (Google, Yahoo, Microsoft)

Since 2024–2025 all three enforce: SPF and DKIM aligned with DMARC, a DMARC record, a spam complaint rate under 0.3% (keep it under 0.1%), valid forward and reverse DNS, and one-click unsubscribe headers for bulk senders. The sequencer handles the headers; you handle DNS (Section 6).

---

## 3. Data model: what the scraper collects

Design principle: **collect once, enrich in stages, score last.** Every table has `created_at`, `updated_at`, `source`, and `source_url`. Nothing is overwritten; new observations are appended and the current view is computed.

### 3.1 `companies` (the anchor record)

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | |
| `domain` | text, unique | yes | Normalised, no `www`. This is the dedupe key. |
| `name` | text | yes | Display name |
| `legal_name` | text | no | From Impressum, Companies House, or footer |
| `website_url` | text | yes | Canonical URL after redirects |
| `country` | ISO-2 | yes | Drives jurisdiction rules |
| `region` / `city` | text | yes | |
| `postal_address` | text | no | For CASL/AU evidence and for letters |
| `phone` | text (E.164) | no | Business line only |
| `industry` | text | yes | Google Places primary type or your own taxonomy |
| `segment` | enum A–E | yes | Set by the classifier |
| `size_estimate` | enum | no | 1–10, 11–50, 51–200, 200+; from site, LinkedIn count, or job posts |
| `founded_year` | int | no | |
| `description` | text | no | One paragraph, LLM-summarised from the homepage |
| `languages` | text[] | no | Site languages |
| `google_place_id` | text | no | For refreshes |
| `google_rating` / `google_review_count` | numeric / int | no | Business-health signal |
| `social_urls` | jsonb | no | LinkedIn company page, Instagram, Facebook, X |
| `discovery_source` | text | yes | `places_api`, `directory:clutch`, `manual`, `wellfound` |
| `discovery_query` | text | yes | The search that found it (for attribution and re-runs) |
| `status` | enum | yes | `new`, `crawled`, `enriched`, `scored`, `exported`, `suppressed` |

### 3.2 `contacts` (people; the unit of outreach)

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | |
| `company_id` | fk | yes | |
| `first_name` / `last_name` | text | yes for email tier 1 | Empty allowed for role addresses |
| `full_name_raw` | text | no | As found, before splitting |
| `title` | text | no | "Owner", "Founder", "Managing Director", "Head of Marketing" |
| `seniority` | enum | no | `owner`, `c_level`, `director`, `manager`, `other` |
| `email` | citext, unique | yes | Lowercased |
| `email_type` | enum | yes | `personal_work` (`jane@acme.com`), `role` (`info@`, `hello@`), `generic_provider` (gmail) |
| `email_status` | enum | yes | `unverified`, `valid`, `catch_all`, `invalid`, `disposable`, `unknown` |
| `email_verified_at` | timestamptz | no | Re-verify anything older than 30 days before sending |
| `email_source_type` | enum | yes | `impressum`, `contact_page`, `mailto`, `team_page`, `pattern_guess`, `enrichment_api`, `manual` |
| `email_source_url` | text | yes | Exact page where the address was found. Your legal evidence. |
| `linkedin_url` | text | no | Only when publicly linked from the company site or entered manually |
| `language` | ISO-2 | yes | Outreach language |
| `timezone` | text | yes | Derived from country/city, drives send windows |
| `jurisdiction` | enum | yes | `us`, `uk`, `au`, `ca`, `de`, `eu_other`, `other` |
| `cold_email_eligible` | bool | yes | Computed: jurisdiction allows it AND `email_type != generic_provider` AND not suppressed AND status valid/catch_all |
| `lawful_basis` | enum | yes | `legitimate_interest`, `consent`, `existing_relationship` |
| `do_not_contact` | bool | yes | Global suppression flag |
| `retention_until` | date | yes | Default: `created_at` + 12 months |

### 3.3 `site_audits` (the personalization engine; one row per crawl)

| Field | Notes |
|---|---|
| `company_id`, `audited_at` | |
| `cms` / `platform` | WordPress, Wix, Squarespace, Shopify, Webflow, custom, unknown. Fingerprinted from HTML, headers, and asset paths. |
| `cms_version_hint` | e.g. WordPress generator tag, jQuery version |
| `framework` | React/Next, Vue, none |
| `hosting_provider` | From DNS/ASN |
| `https_ok` / `cert_expiry` | Boolean plus date |
| `mobile_friendly` | Viewport meta present, responsive check |
| `lighthouse_perf_mobile` / `lighthouse_perf_desktop` | 0–100 via PageSpeed Insights API (free, 25k/day) |
| `lcp_ms`, `cls`, `page_weight_kb` | Core Web Vitals |
| `copyright_year` | Regex on footer |
| `last_modified` | From headers/sitemap |
| `has_booking` / `has_ecommerce` / `has_chat` / `has_contact_form` | Feature flags |
| `has_analytics` | GA/GTM/Plausible detected |
| `has_cookie_banner` | For EU targets |
| `broken_links_count` | Sampled from internal links |
| `schema_org_present` | Structured data present |
| `has_impressum` | DE/AT legal page found |
| `screenshot_url` | Object storage key; used in follow-up emails |
| `raw_findings` | jsonb, everything else |

### 3.4 `signals` (time-stamped events that raise priority)

One row per signal: `company_id`, `signal_type`, `observed_at`, `source_url`, `detail`. Types: `hiring_developer`, `hiring_marketer`, `funding_round`, `new_location`, `running_ads` (Meta Ad Library), `site_under_construction`, `new_reviews_spike`, `domain_recently_registered`, `agency_partner_language`, `app_in_store`.

### 3.5 `scores` (computed, recomputed nightly)

| Field | How |
|---|---|
| `fit_score` 0–100 | Segment match, size, industry, market |
| `pain_score` 0–100 | Weighted audit findings: perf < 50 (+30), no HTTPS (+25), copyright ≥ 2 years old (+15), not mobile-friendly (+20), no booking where segment expects it (+10) |
| `intent_score` 0–100 | Signals decayed over time: hiring dev (+40, halves every 30 days), funding (+30), running ads (+15) |
| `priority` | `tier_1` (contact by name, fit ≥ 70, pain or intent ≥ 50), `tier_2`, `tier_3`, `hold` |
| `hook` | One sentence, LLM-generated from the audit, stored so a human can review before sending |
| `hook_reviewed` | bool; tier_1 hooks are eye-balled before first send during the first month |

### 3.6 `outreach_events` (what happened)

`contact_id`, `channel` (`email`, `linkedin`, `phone`), `campaign`, `step`, `event` (`sent`, `bounced`, `replied`, `positive`, `negative`, `meeting_booked`, `unsubscribed`, `complained`), `occurred_at`, `raw` jsonb. Written by sequencer and Mautic webhooks. This table is the source for every KPI in Section 8.

### 3.7 `suppression_list`

`email`, `domain` (optional, for whole-company blocks), `reason`, `added_at`, `source`. Exported to the sequencer and Mautic every night. Also seed it with: existing clients, past clients, competitors, anyone who has ever said no.

---

## 4. Scraper architecture outline

Simple, boring, and yours. Build it as a pipeline of small stages that each read from and write to Postgres, so any stage can be re-run without redoing the others.

### 4.1 Pipeline stages

```
 discover  →  crawl  →  extract  →  find emails  →  verify  →  audit  →  classify/score  →  export
 (Places    (fetch    (Claude:   (Impressum,     (MX +      (PSI API,  (Claude:            (Postgres view →
  API,       home,     name,      contact, team,   verifier   finger-    segment, hook)       sequencer +
  seeds)     contact,  address,   mailto, pattern) service)   printing)                       Mautic)
             impressum, people)
             team)
```

| Stage | Input | Output | Notes |
|---|---|---|---|
| **Discover** | A query like `dentist in Austin, TX` or a seed CSV | `companies` rows with domain, name, place data | Places API (New) text search, paginated. Also: Clutch/Wellfound/Crunchbase seed lists exported manually. |
| **Crawl** | Domain | Cached HTML of home, `/contact`, `/about`, `/team`, `/impressum`, `/imprint`, plus sitemap sample | Static fetch first (cheap). Fall back to Playwright only when the page is a JS shell. Store raw HTML in object storage or a `pages` table. Max ~8 pages per site. |
| **Extract** | Cached HTML | Structured company + people fields | Claude with structured outputs. One call per site with all pages concatenated and the extraction schema enforced. |
| **Find emails** | Extracted people + HTML | Candidate emails with `source_type` and `source_url` | Order: explicit addresses on site → `mailto:` → deobfuscated `name [at] domain` → pattern guess from a known address (`first.last@`) → enrichment API for tier_1 only. |
| **Verify** | Candidate emails | `email_status` | Syntax → MX lookup → disposable/role detection → external verifier API (MillionVerifier, ZeroBounce, or Reoon) for SMTP-level checks. **Do not run SMTP probes from your own VPS**; the IP will be blacklisted within days. Cost is roughly $0.001–0.004 per verification. |
| **Audit** | Domain | `site_audits` row | PageSpeed Insights API for scores; own fingerprinting for CMS/features; headless screenshot for tier_1 only. |
| **Classify & score** | Everything above | `segment`, `scores`, `hook` | Claude classifies segment and writes the hook; scoring is plain SQL/TypeScript, not the model, so it is explainable and cheap. |
| **Export** | `export_ready` view | CSV or API push | Only rows where `cold_email_eligible` and `priority in (tier_1, tier_2)` and not exported in the last 90 days. |

### 4.2 Runtime and hosting

- **Language:** Node 22 + TypeScript. You already work in this stack; Claude Code can build and maintain it.
- **Crawling:** **Crawlee** (open source from Apify) gives request queues, retries, proxy rotation, session pools, and a Playwright/Cheerio crawler pair out of the box. Use `CheerioCrawler` by default and `PlaywrightCrawler` as fallback.
- **Queue:** Crawlee's built-in request queue for v1. Move to BullMQ + Redis if you ever run more than one worker.
- **Database:** Postgres 16 in Docker on the same VPS (or Neon/Supabase free tier for v1 if you want zero ops). Use Drizzle or Prisma for the schema.
- **Object storage:** Cloudflare R2 or Hetzner Object Storage for raw HTML and screenshots. You already use Vercel Blob for the admin area; it works too but egress is pricier.
- **Server:** **Hetzner CX22/CX32** (2–4 vCPU, 4–8 GB, €4–8/month) in Falkenstein or Nuremberg. German hosting keeps data in the EU and simplifies your GDPR story. Docker Compose with three services: `scraper`, `postgres`, `mautic` (Section 5).
- **Scheduling:** systemd timers or a single cron entry per stage. No Kubernetes, no serverless. Nightly runs are enough.
- **Observability:** a `runs` table (stage, started, finished, counts, errors) plus a daily summary posted to yourself via email or Telegram. That is all v1 needs.

### 4.3 Proxies: when you need them

| Target | Proxy need | Recommendation |
|---|---|---|
| Google Places API, PageSpeed API, verifier APIs | None | Official APIs, key-based |
| Company websites (thousands of different hosts) | **Usually none** | Each site sees a handful of requests. A polite crawler from a clean VPS IP is fine. Add a datacenter proxy pool (~$1/GB) only if you hit Cloudflare challenges frequently; add Playwright with stealth before adding proxies. |
| Directories, search engines, Maps HTML | Rotating residential (~$3–8/GB) | Avoid entirely in v1 by using APIs and manual seed exports. If you must, Decodo (formerly Smartproxy), IPRoyal, or Bright Data; budget $30–50/month. |
| LinkedIn | N/A | Not scraped. |

The person doing 30k/day is almost certainly hammering Maps or directories through residential proxies. You do not need that, and the risk profile is worse than the return.

### 4.4 Claude usage in the pipeline

Use the API for the three things regex is bad at: extracting people and addresses from messy HTML, classifying the business into a segment, and writing the one-line hook. Everything else is deterministic code.

- **Model:** `claude-opus-5` (adaptive thinking on by default). Use `output_config.effort: "low"` for extraction and classification; they are simple tasks and low effort keeps them cheap and fast. Use default effort for hook writing on tier_1 only.
- **Structured outputs:** enforce the extraction schema with `output_config.format` so the pipeline never parses free text.
- **Prompt caching:** keep the system prompt (schema explanation, segment definitions, examples) frozen and cached; put the page HTML after it.
- **Batch API:** nightly extraction and classification runs go through Message Batches for 50% off. Only the hook for a contact you are emailing tomorrow needs to be synchronous.
- **Rough cost at Opus 5 rates** (input $5/M, output $25/M, batch halves both):

| Job | Tokens in / out | Per item | 500 items/day |
|---|---|---|---|
| Extraction (3 pages trimmed to text) | ~6k / ~400 | ~$0.04, ~$0.02 batched | ~$10/day batched |
| Classification | ~1.5k / ~50 | ~$0.01 | ~$3/day batched |
| Hook (tier_1 only, ~100/day) | ~2k / ~80 | ~$0.012 | ~$1.20/day |

Trim HTML to visible text before sending (strip scripts, styles, nav, and footers beyond the Impressum). That single step cuts cost by 5–10x.

- **Refusal handling:** check `stop_reason` before reading content and log refusals to the `runs` table; a refused extraction just means "retry with a cleaner text" or "skip".

### 4.5 Politeness and resilience

- Per-host concurrency 1, global concurrency 10–20, 2–5 s randomised delay per host.
- Honour `robots.txt` and `Retry-After`. Skip sites that return 403/429 twice; mark `crawl_blocked`.
- Real user agent: `LucidCodeLabsBot/1.0 (+https://www.lucidcodelabs.com/bot)` with a `/bot` page explaining what you collect and how to opt out. This is both polite and a GDPR transparency measure.
- Cache every response for 30 days. Re-crawl only for refresh runs.
- Every stage is idempotent: re-running it on the same company must not create duplicates. Upsert on `domain` and `email`.

### 4.6 What makes this scraper "most effective"

1. **Quality gates before quantity:** a lead is not a lead until it has a verified email, a jurisdiction that allows contact, and a segment. Count only those.
2. **The audit is the product:** the personalization comes from measured facts about their site, not from guessing. Competitors send "I saw your website and loved it"; you send "your mobile score is 31 and your certificate expires in 12 days".
3. **Provenance on every field:** you can answer "where did you get my email" instantly. That protects you and it is also what makes CASL/AU inferred consent work.
4. **Feedback loop:** replies, bounces, and meetings flow back into `outreach_events`, and the scoring weights get tuned monthly from real outcomes.
5. **Boring infrastructure:** one VPS, one database, cron. You should be able to leave it alone for a week.

---

## 5. Where leads go: Postgres + Mautic + sequencer

```
               ┌──────────────────┐
  scraper ───▶ │  Postgres (truth) │ ◀──── webhooks (replies, bounces, unsubscribes, form fills)
               └────────┬─────────┘
          nightly export│  (export_ready view; suppression list)
          ┌─────────────┴─────────────┐
          ▼                           ▼
   Cold sequencer               Mautic (self-hosted)
   Smartlead / Instantly        segments, nurture, forms, tracking,
   secondary domains,           newsletter, DACH warm contacts,
   inbox rotation, warm-up      unsubscribe centre
          │                           ▲
          └── positive reply ─────────┘  (contact promoted to Mautic with "engaged" tag)
```

### 5.1 Postgres is the system of record

- Holds everything in Section 3. Scraper writes here and only here.
- `export_ready` view: eligible, scored, not suppressed, not exported recently.
- `suppression_list` is authoritative. Sequencer and Mautic get a copy every night.

### 5.2 Mautic's role

Self-host Mautic 6 in the same Docker Compose on the Hetzner box (or a second small VPS if you want isolation). Use it for:

- **Segments:** by segment A–E, by market, by engagement.
- **Nurture:** once someone replies, books, or fills a form, they leave the cold sequencer and enter a Mautic campaign (case study drip, newsletter, quarterly check-in).
- **DACH warm contacts:** LinkedIn/meetup/phone contacts with a logged lawful basis. Mautic's consent fields and unsubscribe centre are the record.
- **Forms and landing pages:** the site's contact form and a "free site audit" page post into Mautic, which posts into Postgres via webhook.
- **Tracking:** Mautic's tracking pixel on lucidcodelabs.com ties known contacts to site visits.

Do not use Mautic to send cold first-touch email. Its sending goes through one SMTP/API provider and has no inbox rotation or warm-up; a single bad campaign damages that provider reputation and, if you point it at Zoho, your primary domain.

### 5.3 Sequencer's role

Smartlead or Instantly (both ~$30–100/month at this scale). They provide:

- Multi-inbox rotation across your secondary domains
- Automated warm-up (see Section 6 for the caveat)
- Sequences with reply detection and auto-stop
- Bounce and complaint handling, custom tracking domain, unsubscribe link and headers
- CSV import and a REST API for pushing leads and pulling events

### 5.4 Sync rules

| Direction | Trigger | Mechanism |
|---|---|---|
| Postgres → sequencer | Nightly | API upsert of `export_ready` rows, capped at 1.5× tomorrow's sending capacity |
| Postgres → sequencer + Mautic | Nightly | Suppression list push |
| Sequencer → Postgres | Realtime | Webhooks for sent/bounced/replied/unsubscribed → `outreach_events` |
| Sequencer → Mautic | On positive reply or meeting | Postgres job creates/updates the Mautic contact via REST API with tags `engaged`, segment, market |
| Mautic → Postgres | Realtime | Webhooks for form submit, unsubscribe, email events |
| Postgres → you | Daily 08:00 | Summary: leads added, verified, exported, sent, replies, meetings, bounce rate, complaint rate |

Idempotency key everywhere is the email address (lowercased). Mautic contacts store the Postgres `contact_id` in a custom field so updates never create duplicates.

---

## 6. Email infrastructure and warm-up (start today)

This is the long pole. Domains need age and inboxes need history before they can carry cold volume. Everything in this section can begin now, before a single line of scraper code exists.

### 6.1 Never send cold email from lucidcodelabs.com

Your primary domain carries client email, invoices, and your inbound SEO work. Cold outreach lives on secondary domains that redirect to the main site.

### 6.2 Domains and inboxes

- Buy **3 secondary domains** now, aged domains later if you can find clean ones. Suggestions: `lucidcodelabs.io`, `lucidcode.dev`, `lucidlabs.agency`, `getlucidcode.com`, `lucidcodelabs.co`. Prefer `.com`/`.io`/`.co`; avoid cheap TLDs (`.xyz`, `.top`), they are pre-flagged.
- Buy through Namecheap (where the main DNS already lives) or Porkbun. Enable WHOIS privacy.
- **301-redirect each domain to `https://www.lucidcodelabs.com`.** Mailbox providers check that the sending domain resolves to a real site.
- **Mailboxes:** 2 per domain in month one, 3 max. Names that look human: `george@`, `g.beard@`, `hello@` (keep one role box per domain for replies).
- **Provider:** Google Workspace has the best inbox placement into Gmail, which is most SMB mail. Microsoft 365 has the best placement into Outlook, which is most corporate mail. Zoho is cheapest and fine for the third domain. Recommendation for v1: **Domain 1 on Google Workspace, Domain 2 on Microsoft 365, Domain 3 on Zoho.** Mixed providers also spread risk.
- Set a real display name, profile photo, and a signature with name, title, company, postal address (Berlin), and website.

### 6.3 DNS for each secondary domain

| Record | Value | Why |
|---|---|---|
| MX | Provider's MX records | Receive replies and bounces |
| SPF (TXT) | `v=spf1 include:<provider> ~all` | One SPF record only; never more than 10 lookups |
| DKIM (TXT/CNAME) | Provider's selector | Signs mail; must align with From domain |
| DMARC (TXT at `_dmarc`) | `v=DMARC1; p=none; rua=mailto:dmarc@lucidcodelabs.com; pct=100` | Start at `p=none`, move to `p=quarantine` after 30 clean days |
| Custom tracking domain (CNAME) | e.g. `link.lucidcode.dev` → sequencer | Keeps link tracking off shared sequencer domains |
| A / redirect | → www.lucidcodelabs.com | Domain resolves to a real site |
| PTR | Provider handles | Reverse DNS |

Verify each with MXToolbox and a send to mail-tester.com (target 10/10). Add every domain to **Google Postmaster Tools** and **Microsoft SNDS** for reputation data.

### 6.4 Warm-up schedule

Automated warm-up networks (Smartlead, Instantly, Warmup Inbox, Mailreach) exchange emails between member inboxes and mark them as important and not spam. They work, but Google has stated automated warm-up tools violate Workspace terms and has begun acting on it, so run them conservatively and pair them with real human activity. Microsoft and Zoho are less sensitive.

| Phase | Days | Automated warm-up per inbox | Manual activity | Cold sends per inbox |
|---|---|---|---|---|
| Setup | 0–2 | Off | DNS, signatures, profile photos, send 5 real emails to friends/clients and get replies | 0 |
| Ramp 1 | 3–9 | Start at 5/day, +2/day to ~20 | Reply to real threads, subscribe to 5 newsletters, use the inbox from the phone | 0 |
| Ramp 2 | 10–16 | 20–30/day, reply rate 40%+ | Same | 0 |
| Ramp 3 | 17–23 | 25–35/day | Same | 5–10/day to your best tier_1 leads |
| Steady | 24+ | 15–20/day (never turn fully off) | Weekly manual use | 20–25/day, hard cap 30 |

Capacity at steady state: 3 domains × 2 inboxes × 25 = **150 cold emails/day**, about 3,000/month. Add a domain each month if metrics hold. Never exceed 30 cold sends per inbox per day regardless of the tool's limit.

**First cold email goes out around day 21 from today.** That is the deadline the scraper's v1 has to hit: 150 verified tier_1/tier_2 leads ready by then.

### 6.5 Deliverability guardrails

- Plain text, no images, no attachments, one link at most in the first email (prefer zero).
- **Open tracking off.** Tracking pixels reduce placement and Apple Mail Privacy inflates opens anyway. Measure replies.
- Send Tuesday–Thursday first, 08:00–11:00 in the prospect's time zone, randomised gaps of 3–8 minutes between sends.
- Bounce rate above 3% on any inbox: pause it for 3 days and re-verify the list. Complaint rate above 0.1%: pause the whole domain for a week.
- Rotate copy: 3–4 subject lines and 3 body variants per step so no two inboxes send identical text.
- Re-verify every email within 30 days before sending.
- Keep every inbox under 50 total emails/day including warm-up.

### 6.6 Outreach sequence (v1 template, for segment B)

- **Step 1 (day 0), 60–80 words:** name, one measured finding ("your site scores 31/100 on mobile and takes 6.4 s to load on a phone"), what it likely costs them in plain words, one question ("worth a 10-minute look?"). Signature with postal address and a one-line opt-out.
- **Step 2 (day 3):** reply to the same thread. Add one more finding or a screenshot link on the tracking domain. Two sentences.
- **Step 3 (day 7):** a different angle: a relevant case study from `data/caseStudyContent.js`, one sentence, ask if someone else handles the website.
- **Step 4 (day 14):** polite close. "I will stop here; if it becomes relevant, reply any time."

Segment A (agencies) uses the same rhythm with a capacity and white-label angle and no audit finding in step 1.

Reply handling within 4 business hours. Positive replies get promoted to Mautic and a Calendly/Cal.com link.

---

## 7. Operating rhythm

| Cadence | Task | Time |
|---|---|---|
| Daily, 08:00 | Read the pipeline summary email; check bounce and complaint rates per inbox | 5 min |
| Daily, 09:00 | Reply to all responses; move positives to Mautic; add negatives to suppression | 20–40 min |
| Daily | Review tomorrow's tier_1 hooks (first month only), approve or edit | 15 min |
| Weekly, Monday | Pick discovery queries for the week (segment × market × city list); launch the discover stage | 30 min |
| Weekly, Friday | KPI review (Section 8); rotate copy variants; adjust scoring weights | 30 min |
| Monthly | Add one domain and two inboxes if bounce < 2% and complaints < 0.1%; re-verify stale emails; purge records past `retention_until`; review the Legitimate Interest Assessment | 1 h |

---

## 8. KPIs and targets

Track from `outreach_events`, not from tool dashboards.

| Metric | Target | Alarm |
|---|---|---|
| Verified, eligible leads added per day | 200–400 | < 100 for 3 days |
| Email verification pass rate | > 60% of candidates | < 40% (email-finding stage is guessing too much) |
| Bounce rate | < 2% | > 3% on any inbox |
| Spam complaint rate | < 0.1% | > 0.1% on any domain |
| Reply rate (any) | 5–10% for segment B, 3–6% for A | < 2% after 300 sends (copy or list problem) |
| Positive reply rate | 1–3% | |
| Meetings booked per 1,000 sends | 8–15 | |
| Cost per meeting | < €40 (tools + API + verification) | |
| Proposals sent per month | 8+ by month 3 | |

---

## 9. Budget (monthly, steady state, v1)

| Item | Cost |
|---|---|
| 3 domains | ~€3 amortised |
| 6 inboxes (Google Workspace 2, Microsoft 365 2, Zoho 2) | ~€35 |
| Sequencer (Smartlead/Instantly) | ~€35–90 |
| Hetzner VPS | ~€8 |
| Email verification (~10k/month) | ~€20–40 |
| Claude API (batched) | ~€200–400 |
| Google Places API | free tier likely sufficient; cap the key at €50 |
| PageSpeed Insights API | free |
| Proxies | €0 in v1 |
| **Total** | **~€300–600/month** |

Compared with a single retained agency client, this pays for itself on one deal. Compared with Apollo/ZoomInfo seats, it is cheaper and the data is better for your specific angle.

---

## 10. Immediate action points (start today)

Do these in order. Items 1–6 take one afternoon and start the 21-day warm-up clock.

### Today

1. **Buy 3 secondary domains** (`.com`/`.io`/`.co`), WHOIS privacy on, at Namecheap or Porkbun.
2. **Set up 301 redirects** from each to `https://www.lucidcodelabs.com`.
3. **Create mailboxes:** Domain 1 → Google Workspace (2 users), Domain 2 → Microsoft 365 (2 users), Domain 3 → Zoho Mail (2 users). Human-looking names.
4. **DNS per domain:** MX, SPF, DKIM, DMARC `p=none` with `rua` pointing at `dmarc@lucidcodelabs.com`. Validate with MXToolbox; send to mail-tester.com.
5. **Profile hygiene:** display name, photo, signature with Berlin postal address and website on all 6 inboxes.
6. **Send 5 real emails from each inbox** to people who will reply (clients, friends, your own main address). Reply back. Star threads.

### Days 1–3

7. **Sign up for a sequencer** (Smartlead or Instantly), connect all 6 inboxes, start warm-up at 5/day with the ramp in Section 6.4. Set a custom tracking domain per sending domain.
8. **Register domains in Google Postmaster Tools and Microsoft SNDS.**
9. **Write the Legitimate Interest Assessment** (one page) and a `/bot` page plus a prospect-data paragraph for `/privacy`. Add the `/bot` page to this repo.
10. **Create the seed suppression list:** existing and past clients, competitors, personal contacts, anyone who has said no. Keep it as a CSV until the database exists.
11. **Provision the Hetzner VPS** with Docker, Postgres, and Mautic 6. Point `mautic.lucidcodelabs.com` (or a subdomain on a secondary domain) at it. Configure Mautic's own sending through a transactional provider (Amazon SES or Postmark) for nurture only.

### Days 4–10

12. **Draft copy:** 3 subject lines and 3 bodies per step for segment B and segment A. Keep under 80 words. Test each in mail-tester and a Gmail/Outlook seed inbox.
13. **Hand-build a 50-lead pilot list** for segment B in one US city (for example dentists in Austin) using Google Maps manually, so you learn what the data looks like before automating it. Verify the emails with MillionVerifier's free credits. Score them by hand using Section 3.5's rules. This list becomes the scraper's acceptance test.
14. **Start the scraper build plan** (Section 11) as its own Claude Code session.
15. **DACH channel, in parallel:** create the LinkedIn company page (the footer flag in `data/siteConfig.js` is still `enabled: false`), connect with 10 Berlin agency owners and founders per week with a two-line message, no pitch. Log them in Mautic with `lawful_basis = consent` once they reply.

### Day 17–21

16. Warm-up metrics check: inbox placement 90%+ on the sequencer's placement test, zero bounces from warm-up.
17. **First 5–10 cold sends per inbox** from the pilot list, tier_1 only, hooks reviewed by hand.
18. From here, run the operating rhythm in Section 7.

---

## 11. Task B seed: the scraper build plan

This section is the brief for a separate, detailed planning session. It is intentionally a spec, not a plan; the plan should produce the milestones, schema migrations, and tickets.

### 11.1 Objective

A pipeline that turns "segment + market + city list" into 200–400 verified, scored, cold-email-eligible contacts per day, with provenance on every field, running unattended on one VPS, with the first 150 tier_1/tier_2 leads ready within 21 days of today.

### 11.2 v1 scope (what ships first)

- Discover via Google Places API (New) text search, one query template per segment B category.
- Crawl up to 8 pages per site with Crawlee (Cheerio first, Playwright fallback).
- Extract company, people, and emails via Claude structured outputs; deterministic email-finding chain from Section 4.1.
- Verify via one external verifier API.
- Audit via PageSpeed Insights API plus CMS fingerprinting; no screenshots in v1.
- Score with SQL/TypeScript rules from Section 3.5; Claude writes hooks for tier_1.
- Export via CSV to the sequencer; suppression list export.
- `runs` table and a daily summary email.

### 11.3 Explicitly out of scope for v1

Directory scraping, LinkedIn anything, residential proxies, screenshots, Mautic API sync (CSV import is fine for the first month), multi-worker queues, a UI.

### 11.4 Decisions the planning session must make

1. Postgres hosting: Docker on the VPS vs. Neon/Supabase. (Lean: Docker on VPS, backups to R2 nightly.)
2. ORM and migration tool: Drizzle vs. Prisma. (Lean: Drizzle, lighter.)
3. HTML storage: Postgres `bytea`/text vs. object storage. (Lean: object storage keyed by `sha256(url)`; store only the trimmed text in Postgres.)
4. Which verifier API, based on price per credit and catch-all handling.
5. Which sequencer, based on API quality for pushing leads and receiving webhooks.
6. How the pilot list from action point 13 becomes the acceptance test (target: scraper reproduces ≥ 80% of the hand-found emails).
7. Discovery query templates and the first 10 cities.
8. The exact extraction schema (JSON) and the segment-classification prompt, with 10 hand-labelled examples for evaluation.
9. Hook prompt and a review flow (a simple CLI that prints tomorrow's hooks for approval is enough).
10. Secrets management and backups on the VPS.

### 11.5 Definition of done for v1

- Fresh VPS to running pipeline in under one hour using the README.
- A full nightly run on 10 queries completes without manual intervention and writes a summary.
- ≥ 80% email recall on the pilot list, ≥ 95% precision on `email_status = valid` after verification (measured by bounce rate in the first 300 sends).
- Every exported contact has `email_source_url`, `jurisdiction`, and `lawful_basis` populated.
- Suppression list round-trips: adding an email to the list removes it from the next export.

### 11.6 Suggested milestones

| Milestone | Deliverable | Target |
|---|---|---|
| M0 | Repo, schema, Docker Compose, `runs` table, README | Day 2 of build |
| M1 | Discover + crawl on 1 query, HTML cached | Day 4 |
| M2 | Extract + email-finding chain, evaluated on pilot list | Day 7 |
| M3 | Verify + audit + scoring, `export_ready` view | Day 10 |
| M4 | Hooks + review CLI + CSV export + suppression round-trip | Day 12 |
| M5 | Nightly cron, summary email, first 150 leads delivered | Day 14 (lands before warm-up finishes on day 21) |

### 11.7 Prompt to open the planning session

> Read `LEADGEN.md` in the landing-page-lucid repo, especially Sections 3, 4, and 11. Produce a detailed implementation plan for the v1 scraper as a new repository named `lucid-leadgen`: directory layout, Postgres schema with migrations, the stage-by-stage module design, the Claude extraction schema and prompts, the email-finding chain, verifier and PageSpeed integrations, the scoring SQL, the export view, Docker Compose for the Hetzner VPS, cron, and a test plan against the 50-lead pilot CSV. Resolve the ten open decisions in Section 11.4 with a recommendation each. Output the plan as `PLAN.md` in the new repo with milestones M0–M5 broken into tickets.

---

## 12. Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Domain burned by early aggressive sending | High if rushed | Follow the ramp; hard cap 30/inbox/day; one bad inbox never shares a domain with more than two others |
| Google acts against automated warm-up | Medium | Conservative warm-up volumes, real manual activity, provider mix, never warm the primary domain |
| Abmahnung from a German recipient | Medium if DACH is cold-emailed | Do not cold-email DE/AT; jurisdiction gate in the export view |
| VPS IP blacklisted from SMTP probing | High if done in-house | Use a verifier API, never probe from the VPS |
| Extraction quality drifts | Medium | 10-example eval set, re-run after every prompt change, track bounce rate as the ground truth |
| Too many leads, not enough replies handled | Medium | Reply SLA in Section 7; cap exports at 1.5× capacity |
| Data subject request you cannot answer | Low | Provenance fields, `/bot` page, privacy paragraph, 30-day response process |
| Scope creep into a "lead-gen SaaS" | High (it is tempting) | v1 scope in 11.2 is frozen until the first 3 meetings are booked |

---

## Appendix A — Discovery query templates (segment B, v1)

Format: `{category} in {city}, {state/region}`. Start with categories that have budgets and outdated sites.

Categories: dentist, orthodontist, dermatology clinic, physiotherapy, law firm, accounting firm, real estate agency, boutique hotel, gym, wedding venue, landscaping company, roofing contractor, HVAC contractor, private school, veterinary clinic.

Cities, first 10: Austin TX, Denver CO, Nashville TN, Raleigh NC, Phoenix AZ, Manchester UK, Bristol UK, Leeds UK, Brisbane AU, Perth AU.

Filters at discovery: `google_review_count ≥ 30`, `google_rating ≥ 4.0`, has website, website not on a marketplace domain (Yelp, Facebook pages, Linktree).

## Appendix B — Segment A seed sources (manual export, no scraping)

Clutch and DesignRush "marketing agency" lists per city (export manually, 100 per week), Webflow Experts directory, Shopify Partners directory, HubSpot Solutions directory, LinkedIn Sales Navigator search "marketing agency, 11–50 employees, no 'engineer' titles" (manual review, then find the agency's own website and let the crawler do the rest).

## Appendix C — Tooling shortlist

| Need | Options |
|---|---|
| Sequencer + warm-up | Smartlead, Instantly, lemlist |
| Email verification | MillionVerifier, ZeroBounce, Reoon, NeverBounce |
| Deliverability testing | mail-tester.com, GlockApps, MXToolbox, Google Postmaster Tools, Microsoft SNDS |
| Discovery | Google Places API (New), Serper.dev (if you need SERP results later) |
| Site audit | PageSpeed Insights API, Wappalyzer-style fingerprint rules (write your own; the open-source ruleset was withdrawn) |
| Enrichment (tier_1 only, later) | Hunter, Apollo, Prospeo |
| Crawler | Crawlee (Cheerio + Playwright) |
| Hosting | Hetzner Cloud, Cloudflare R2 |
| Marketing automation | Mautic 6 (Docker) |
| Booking | Cal.com (self-hostable) or Calendly |
