// Engineering blog posts.
//
// Each post is a list of content blocks so the same source renders to the page
// and to structured data without a Markdown dependency:
//   { type: 'h2', text }            section heading
//   { type: 'p',  text }            paragraph
//   { type: 'ul', items: [...] }    bullet list
//
// Set `draft: true` to keep a post out of the listing, the sitemap, and the
// index (it stays reachable by direct URL for review, marked noindex).
// `date` is the publish date in YYYY-MM-DD and drives the article schema.

export const blogPosts = [
  {
    slug: "adding-ai-to-an-existing-product",
    title: "Adding AI to a product that already has users",
    description: "What it takes to add a model to a live Express app: staging output before it reaches production data, per-attempt timeouts, cost control and cheap evaluation.",
    date: '2026-08-26',
    draft: false,
    tags: ["AI integration", "Architecture", "Node.js", "Production engineering"],
    body: [
      { type: "p", text: "Most AI work is not greenfield. There is a system in production, people depending on it, a schema that has accumulated meaning over years, and someone has asked whether a model could do a job the software currently cannot. The interesting engineering is almost never the prompt. It is everything around the call that keeps the rest of the product as reliable as it was the week before. We recently added two model-backed features to a live Express and MongoDB application using the OpenAI SDK: extracting a printed menu from photographs, and grading free-text answers. Almost none of the work was the API call." },
      { type: "h2", text: "Treat the model as a third-party integration, not a new architecture" },
      { type: "p", text: "Give the model call an ordinary function signature and hide everything else behind it. One module exposes a function that takes images and returns normalised menu sections. Another takes a question and an answer and returns a score with feedback. The controllers calling them look like every other controller in the codebase. There is no AI layer, no orchestration framework, no new service. The vision call sits inside a normal Express handler, between a multer upload and a Mongoose write." },
      { type: "p", text: "That module also needs to know how to be absent. The client is constructed lazily on first use, and a missing API key throws a typed error rather than a generic one, so the route answers with a 503 and a sentence a human understands instead of a 500 and a stack trace. A separate predicate lets the route check configuration before it accepts an upload at all. Staging environments, local development and a lapsed billing account are the same condition, and the feature should switch itself off rather than take a page of the product down with it." },
      { type: "h2", text: "Nothing a model produces should reach a production table unreviewed" },
      { type: "p", text: "The scanning feature never writes to the live menu. Extraction produces a staged record in its own collection with a status of extracting, ready, committed or failed. The owner reviews and edits that payload, and only an explicit commit endpoint creates real sections and items. A misread price is a thirty-second correction on the review screen; the same misread price written straight through is a pricing dispute at a table. Staged records carry an expiry date and a TTL index, so the background monitor clears them roughly thirty days later. They are working data, not a business record." },
      { type: "p", text: "Constrain the response with a strict JSON schema rather than parsing prose. Two different features get confused here: JSON mode guarantees only that the output parses, while a strict json_schema guarantees the shape as well. Strict mode has a real cost — every property must appear in required and additionalProperties must be false throughout — so an optional field has to be expressed either as a nullable union or as a sentinel value. We chose sentinels: an unreadable price comes back as 0, a missing description as an empty string, and the normaliser turns those back into meaning on our side rather than spreading nulls through the rest of the code." },
      { type: "p", text: "A schema constrains shape, not truthfulness. Everything is re-validated before storage: prices coerced to finite numbers, negatives clamped, absurd values discarded, nameless items dropped, strings truncated to what the schema and the UI can hold, and enum values filtered against the real list rather than trusted because the schema said so. The extractor also asks the model to self-report confidence as high or low, and we force low whenever the price failed to parse, so the review screen can draw the eye to the rows most likely to be wrong." },
      { type: "p", text: "Do not let a model infer data that carries regulatory weight. Our prompt and schema record allergens and dietary tags only where the menu prints them, and the instruction never to infer them from ingredients or dish names appears in the system prompt, in the field descriptions and again in the validator. A model deciding a dish contains milk because it is called a carbonara is not a feature, it is exposure. If the source does not declare something that is regulated, the system should return an empty array and say so on the screen." },
      { type: "p", text: "Store the exact input the model saw — in our case the normalised images, not the originals — because the first time someone disputes what was read, you will want it. And make the commit path idempotent, because re-scanning after a bad read is the first thing a user will try. Ours skips items already on the menu by name. The trap there is filtering a whole section in one pass: every item is compared against the set as it stood before the section, so a dish printed twice on one page passes twice and is created twice. Claim each name as you accept it." },
      { type: "h2", text: "Latency and failure are product decisions, not infrastructure ones" },
      { type: "p", text: "Set timeouts deliberately and per feature, and know how the SDK applies them. The OpenAI client's timeout is per attempt, not per call, so the worst case is the timeout multiplied by retries plus one. Multi-page vision gets two minutes and a single retry, because it genuinely takes that long: four minutes held open at worst. Grading gets a minute and two retries, so three. Being generous with both numbers at once is how you end up with a request that occupies a connection for a quarter of an hour and then fails anyway." },
      { type: "p", text: "We run both calls inline in the HTTP request rather than pushing them onto the existing job runner. That is defensible when the user is watching a spinner having just taken a photo, and wrong if the work can wait. The honest cost is that a dropped connection loses the result, and you are trusting every proxy between the browser and the process not to cut a long request. If you take that route, write the attempt to the database before you make the call, so a failure leaves a row explaining itself rather than nothing at all." },
      { type: "p", text: "Then decide, per feature, what failure means. Grading degrades: if the call fails, it returns a neutral score and tells the user the answer was recorded and will be reviewed manually. Nobody loses a submission to a vendor outage. The trade-off is that a silent default becomes a data quality problem, so those rows have to be visible to someone rather than indistinguishable from a real mid-range score. Extraction cannot degrade, because there is no sensible default menu, so it fails loudly with a message that says what to change: a clearer, flatter photo." },
      { type: "p", text: "One caution on batching. Our grader fans out across a question set with a plain Promise.all, which is fine when the set is small and bounded by the assessment. Promise.all rejects on the first failure, so unless each call handles its own errors you lose the whole batch to one bad response — and pointed at a user-supplied list, the same pattern finds your rate limit in production, in front of a customer." },
      { type: "h2", text: "Cost control is mostly work you do before the request" },
      { type: "p", text: "By the time you are choosing a model, most of the money is already spent or saved. The image pipeline does the heavy lifting: every uploaded page is decoded from HEIC when the magic bytes say it is one, rotated according to its EXIF orientation, resized so the long edge is at most 2000 pixels, and re-encoded as JPEG at quality 82 before being base64-encoded into the request. The vision API rescales anything larger before it tokenises it, so pixels above that ceiling cost upload time and buy no accuracy. The same step is what makes the feature usable on a phone at all." },
      { type: "p", text: "Around that sit a few unglamorous limits, all of them dull and all of them load-bearing:" },
      {
        type: 'ul',
        items: [
          "Six pages per scan and three hundred items per import, enforced in the route, the controller and the extractor rather than in one hopeful place.",
          "A rate limiter scoped to the scanning route — twenty an hour — separate from the app-wide one, because this endpoint spends money and the rest of the API does not.",
          "An upload size cap on the multipart handler, so an oversized file is rejected before any decoding work happens.",
          "Authorisation narrowed to the account owner, for the same reason as the rate limit.",
          "The model name in an environment variable with a cheap default and a per-feature override, so changing it is a deploy rather than a refactor.",
        ],
      },
      { type: "h2", text: "Evaluate with fixtures you control" },
      { type: "p", text: "You do not need an evaluation platform to know whether the feature works. We render a synthetic menu as SVG containing exactly the things that trip extractors: dietary markings, a right-aligned price column with two-decimal prices, descriptions in smaller grey type, and footer noise — opening hours, a wifi password, a social handle — that must not become dishes. It renders to a JPEG, goes through the real extraction path, and the script asserts properties rather than exact strings: both sections found, all four dishes found, prices exact, tags present only where marked, footer ignored." },
      { type: "p", text: "The same script has an offline half that exercises the normaliser with hand-built payloads, including deliberately hostile ones: negative prices, invented dietary tags, allergens outside the statutory list, nameless items. That half needs no API key and no network, which means the majority of the safety logic is testable in CI for free, on every commit. Split evaluation this way and the part that costs money and time stays small enough that you actually run it." },
      { type: "p", text: "One lesson from writing that script. We originally built the HEIC test fixture with the same image library the production path uses. It produced an AV1-encoded file, which that library decodes happily, so the test passed while real iPhone photos — encoded with HEVC, which most builds of libheif omit for patent reasons — failed at the first byte. We now generate the fixture with a different tool entirely. Build fixtures with something other than the code under test, or you are testing your own assumptions back at yourself." },
      { type: "h2", text: "Why the integration work matters more than the model" },
      { type: "p", text: "Model choice is the part of this project that is genuinely easy to change; ours is an environment variable with a per-feature override. What does not change with a variable is the review queue, the validator, the rate limiter, the degradation path, the fixtures and the decision about which fields the model is not permitted to guess. Those took the time, and those determine whether the feature is trustworthy on a bad day." },
      { type: "p", text: "A useful test before shipping: if your provider doubled its latency tomorrow, or went down for an afternoon, what would your users see? If you can answer in one sentence, the integration is finished. If you cannot, the prompt is not the problem." },
      { type: "p", text: "Lucid Code Labs works on software that is already live, including integrations like this one." },
    ],
  },
  {
    slug: "what-goes-into-a-loyalty-platform",
    title: "What actually goes into building a loyalty platform",
    description: "The engineering behind a rewards product: ledger integrity, tenant-scoped authorisation, QR redemption, wallet passes, scheduled jobs and insider fraud.",
    date: '2026-08-26',
    draft: false,
    tags: ["Engineering", "Loyalty & Rewards", "Node.js", "System design"],
    body: [
      { type: "p", text: "A loyalty product looks small from the outside. A customer scans something, a number goes up, and eventually they get a free coffee. Almost none of the engineering effort goes into that. It goes into making the number correct, keeping it correct when two things happen at once, and stopping anyone from making it go up without earning it. This is drawn from building a rewards platform on Node, Express and MongoDB; the shape applies to any stack." },
      { type: "h2", text: "The ledger is the product" },
      { type: "p", text: "Points are a financial record even when they are not legally money, and customers notice a wrong balance immediately. So the first architectural decision is that balances are derived, not authored. Keep an append-only transaction collection where every row records the paying party, the receiving party, source and destination wallet, a typed reason, an amount and a status. The account may cache a balance for fast reads, but that cache is only ever moved by an atomic increment, never assigned." },
      { type: "p", text: "The mistake to avoid is debiting one wallet, crediting another, and writing the transaction record as three separate calls. A crash between the second and third leaves value that exists in balances but appears nowhere in history, and you find out weeks later when a partner queries their statement. Wrap the movement in a multi-document transaction so it commits or rolls back as a unit. On MongoDB that means running a replica set even in development, since transactions are unavailable on a standalone server." },
      { type: "p", text: "You will not get every step inside the session, because a call to an external provider cannot join a database transaction. That is fine if it is explicit: document which side compensates, implement the reversal, and test it by throwing inside the transaction on purpose. Status also needs more than success and failure, since real flows include awards pending a partner's confirmation. And a scheduled job should sum the ledger against cached balances, because the cache will drift." },
      { type: "h2", text: "Multi-tenancy is mostly an authorisation problem" },
      { type: "p", text: "A loyalty platform has more account types than people expect: members, partner businesses, staff working under those businesses, administrators, often a sales layer on top. Value moving between all of them pushes you towards polymorphic references, where a transaction stores both an identifier and the collection it points at. Useful once the ledger spans account types, a waste if you only have two: population becomes dynamic rather than a fixed join, an aggregation lookup targets one collection at a time, and type correctness moves into your own code." },
      { type: "p", text: "Authorisation is the harder half. Centralise it in one middleware that verifies the token, loads the account, checks the role against an allowed list, and compares a token version field so sessions can be revoked without waiting for expiry. Then hold one rule with no exceptions: the tenant identifier that scopes a query comes from the verified token, never from the request body, path or query string. A dashboard that filters by a client-supplied business ID is one curious user away from being everyone's dashboard." },
      { type: "h2", text: "QR codes should identify, never authorise" },
      { type: "p", text: "Printed cards, window stickers and table talkers live for years and you control none of them once they leave. Encode a short opaque code that resolves server-side to an account, rather than the account identifier itself. The indirection lets you revoke a compromised code, re-point a reprinted batch and see scan analytics without reissuing anything physical." },
      { type: "p", text: "What you must not do is put value in the code: no signed point totals, no bearer reward tokens, nothing a scanner could act on by itself. Anything scannable is copyable, and a photograph of a card duplicates it perfectly. The scan identifies a person; a separate, staff-authenticated endpoint decides what to award and records who authorised it. Rate limit short-code lookups separately from the rest of the API and keep the code space sparse, because short codes are worth guessing in a way database identifiers are not. In print, pin the version and error correction level: higher correction survives scuffing but costs capacity, pushing the payload up a version." },
      { type: "h2", text: "Wallet passes are a signing and lifecycle problem" },
      { type: "p", text: "An Apple Wallet pass is a zip archive containing the pass JSON, its assets, a manifest of file hashes and a detached signature over that manifest. Generating one with a library such as passkit-generator is the easy half. The work sits around it:" },
      {
        type: 'ul',
        items: [
          "Certificates. Apple's WWDR intermediate certificate, your Pass Type ID certificate and its private key, all of which expire. Treat them as rotatable configuration from a secret store, not files committed beside the code.",
          "Assets. Passes want icon and logo images at one, two and three times scale. Deriving them from a single brand asset at boot and caching the buffers avoids near-identical PNGs drifting out of sync.",
          "Identity. A device identifies a pass by pass type identifier plus serial number. Derive the serial deterministically from the member so a reissue updates the existing pass instead of stacking a second one.",
          "Delivery. The download link will end up in a mail client or a chat thread, so mint a short-lived signed token rather than a durable URL to a file containing member data.",
        ],
      },
      { type: "p", text: "Decide before you start whether passes update. Keeping one live means embedding a web service URL and authentication token in the pass, running the registration and update endpoints Apple specifies, and sending empty pushes that prompt the device to fetch a new version. Skipping that subsystem is legitimate, but then design the pass so staleness is harmless: show identity and membership, not a balance that silently goes wrong. Google Wallet updates passes as objects through its API, so Android is a second integration rather than a port." },
      { type: "h2", text: "Everything that happens overnight" },
      { type: "p", text: "Loyalty products carry behaviour no user triggers: activity aggregation, statement totals, reward expiry, cancelling subscriptions at period end. A database-backed scheduler suits this, because the job store is a database you already run and it coordinates across instances. Agenda is a common choice on MongoDB, pg-boss on Postgres; check how actively each is maintained before committing. Jobs must still be idempotent, because a lock can lapse mid-run and the work will be picked up again. And nothing scheduled belongs in a setInterval inside the web process, because the moment you run two instances every nightly accrual runs twice." },
      { type: "p", text: "Expiry and accrual are timezone problems wearing a scheduling costume. A reward that expires twelve months after issue lands on different calendar days depending on whether you resolve it in the member's zone, the venue's zone or UTC. Pick one, write the decision down where the next developer will find it, and store the resolved expiry instant on the record at issue time rather than recomputing it from rules that will have changed." },
      { type: "h2", text: "Payments, and the fraud you actually get" },
      { type: "p", text: "Expect more than one payment integration. Card-present merchants often already run a till system, so you support a hosted checkout provider for platform billing alongside a point-of-sale provider connected per merchant over OAuth. That second one brings obligations: encrypt stored merchant tokens, refresh them before expiry, verify webhook signatures, and treat the webhook as the state of record rather than the response to your own API call. Webhooks arrive at least once and out of order, so handlers must be idempotent." },
      { type: "p", text: "Provider SDKs accept an idempotency key, but a fresh random one per attempt protects you against your own retry loop, not against a customer tapping pay twice; derive it from the entity being paid for when duplicate submission is the risk, and check the provider's key retention window, which is short. On your own endpoints, a unique index on a client-supplied key, with the duplicate-key error handled by returning the existing record, is the cheapest correct guard." },
      { type: "p", text: "Fraud here is worth threat-modelling from the inside out. Forged codes get the attention, but the attempts that need no skill are a staff member awarding stamps to friends, someone scanning their own card during a quiet shift, and a partner inflating balances they have not funded. Record the acting user on every award, keep the audit trail queryable, apply velocity limits per member and per device, and give partner owners a view where an unusual pattern is visible without a support ticket." },
      { type: "p", text: "None of this is exotic. It is ordinary engineering applied carefully where correctness is not negotiable, and the ledger is where getting it wrong compounds quietest." },
    ],
  },
  {
    slug: "react-native-vs-native-startup-budget",
    title: "React Native or native? A budget-first decision framework",
    description: "What genuinely shares between iOS and Android, where cross-platform quietly costs you, and when a limited budget still points towards writing native code.",
    date: '2026-08-26',
    draft: false,
    tags: ["React Native", "Expo", "Mobile", "Architecture"],
    body: [
      { type: "p", text: "The question comes up in almost every first conversation about a mobile product: React Native or native? It is asked as a technology question, but on a limited budget it is a question about where the money goes. Cross-platform does not halve your cost; it moves the cost into places that are harder to see when you are writing the estimate. The useful exercise is working out which parts of your specific product genuinely share, and which parts will make you write platform code anyway." },
      { type: "h2", text: "What actually shares" },
      { type: "p", text: "The parts of an app that share cleanly are the parts with no opinion about the device: product logic, state management, data access, formatting, translations, navigation structure, and most of the interface. In a typical Expo codebase that layer holds Redux Toolkit with redux-persist, a hosted backend client for data and auth, i18next for translations and a styling layer such as NativeWind. None of it knows which platform it is running on." },
      { type: "p", text: "In a well-structured codebase only a small minority of files reference Platform.OS, and platform-suffixed files such as .ios.tsx are worth avoiding as a matter of policy. But the forked portion is not proportional to the effort it consumes. Platform-specific files are the slowest and least predictable work in the project, because that is where you stop writing your product and start negotiating with an operating system. So the framework is not about percentages of files but about which negotiations your product requires." },
      { type: "h2", text: "Where the shared line breaks" },
      { type: "p", text: "Anything that runs outside your app's own process is native work on both platforms, whatever framework you chose. Home screen widgets are the clearest example. On iOS a widget is a SwiftUI extension target reading from a shared App Group container the app writes to; on Android it is Glance or RemoteViews in Kotlin. React Native cannot render into either: a widget is not your app but a separate process with a strict memory budget and its own lifecycle." },
      {
        type: 'ul',
        items: [
          "Home screen and lock screen widgets, and watch complications.",
          "Rich push notifications. iOS needs a UNNotificationServiceExtension in Swift to download and attach media before the notification is shown; on Android the work happens in your messaging service, and only for data messages, since a notification-only payload is drawn by the system without your code running while the app is backgrounded.",
          "Anything talking to a platform framework with no maintained bridge. Reading live storefront pricing from StoreKit is a common one, and a StoreKit 2 path still needs a StoreKit 1 fallback if you support devices below iOS 15.",
          "Share sheet extensions, custom keyboards, watch and TV apps, App Intents and assistant surfaces.",
        ],
      },
      { type: "p", text: "Expo's config plugin mechanism makes this bearable rather than painless. You keep the Swift and Kotlin sources in your own repository and wire them into the generated native projects at prebuild time, so nobody edits an Xcode project by hand and the native targets survive a clean rebuild. But notice what has happened to the team: you now need somebody who can read and debug Swift and Kotlin. That person is a real line in your budget, and pretending otherwise is where cross-platform estimates usually go wrong." },
      { type: "h2", text: "Background work is the tax nobody budgets for" },
      { type: "p", text: "If your product has to do something while it is not on screen, treat that as the highest-risk area of the estimate whatever stack you pick. Take a timer that must fire reliably with the screen off. In the foreground it is a setTimeout and it is trivial. Backgrounded, both operating systems intervene: iOS suspends an app whose background audio session is not actually producing output, freezing the JavaScript thread and every pending timer with it, and Android's Doze mode, plus per-manufacturer power management on top of it, suspends the process unless something holds it at higher priority." },
      { type: "p", text: "The workarounds are not elegant. On Android the dependable answer is a media playback foreground service, declared with the right foreground service type and runtime permission on Android 14 and later, which holds the process at a priority where JavaScript timers keep firing; an audio library that only configures an audio session is not enough. On iOS you keep the audio session genuinely active rather than emitting digital silence, paired with an ongoing notification. Going native would not remove the problem, because Doze and audio session rules apply equally to Swift and Kotlin apps. What native removes is the JavaScript thread as one more thing that can be frozen, and a layer of indirection while you diagnose it. If background execution, geofencing, health data sync or long-running uploads are core rather than incidental, price that work as its own project." },
      { type: "h2", text: "Heavy graphics is no longer the automatic native answer" },
      { type: "p", text: "The old rule was that anything animation heavy belongs in native. Skia has changed that calculation. An animated star field can run as a single Skia canvas: one background quad and one drawAtlas call covering every star, driven by a single Reanimated frame callback on the UI thread, with no per-star views and no timers in the loop. That is structurally what you would write against Metal or a native canvas, expressed in TypeScript and running on both platforms." },
      { type: "p", text: "The difficulty moves rather than disappears. You are writing GPU code without native GPU tooling: Xcode's frame debugger and Android GPU Inspector show the Skia layer, not your component tree. Performance also becomes bimodal: either the scene collapses into one draw call and it is fine, or you have accidentally created hundreds of views and it is not, and the distance between them is a rewrite, not a tuning session. Games and continuous camera-processing pipelines still lean native. A rich, animated, visually ambitious interface no longer does." },
      { type: "h2", text: "The bill that arrives later" },
      { type: "p", text: "The line item that most often goes wrong is dependencies. A React Native app of any depth carries a long list of native modules, and you inherit the maintenance state of every one. Patching installed packages is normal rather than exceptional: a C++ header that no longer compiles against a newer toolchain, an Android library whose Gradle config targets an obsolete SDK and resolves from a repository that has since disappeared, a Kotlin coroutine whose uncaught exception kills the app process rather than one feature. Each costs a day or two, usually mid-release." },
      { type: "p", text: "Do not treat the dependency list as free, and do not choose a native module by GitHub stars or the polish of its demo video. Before committing to one for anything load-bearing, open its native source, check when it last built against a current SDK, and check whether more than one person maintains it. The question is not whether you will patch a dependency but how many, and how far down the stack. Budget it as ongoing maintenance rather than a surprise." },
      { type: "h2", text: "So when is the answer really native?" },
      { type: "p", text: "Reach for native when the product's core value is itself a platform capability: a real-time camera pipeline, on-device inference with tight latency requirements, CarPlay or Android Auto, a watch app as the primary surface, or sustained high frame rate interaction as in a game. Reach for it when you are shipping one platform with no near-term plan for the second, because the cross-platform saving is almost entirely on that second platform. And reach for it when your team is already strong in Swift or Kotlin, since familiarity beats theory on a short budget." },
      { type: "p", text: "Cross-platform holds up when you need both platforms and cannot fund two teams, which is the common founder position; when most of the product is screens, data, state and a design system; and when you still expect to change the product quickly because you are learning what it should be, since one codebase means one change rather than two that drift apart." },
      { type: "p", text: "The mistake worth naming is deciding from an edge case. Founders regularly talk themselves into native over one feature that might matter in year two, but a single widget, assistant shortcut or missing native module does not justify writing the entire product twice. Write the shared app, and write that one piece in Swift and Kotlin when you reach it. That is what config plugins exist for, and it costs far less than a second codebase and a second team to keep in step. None of this produces a verdict on its own; these are the questions to answer before you commit, and the answers move as the product does." },
    ],
  },
];


const WORDS_PER_MINUTE = 225;

export function estimateReadingTime(post) {
  const words = post.body.reduce((total, block) => {
    const text = block.type === 'ul' ? (block.items || []).join(' ') : block.text || '';
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function getPublishedPosts() {
  return blogPosts
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs() {
  return blogPosts.map((post) => post.slug);
}

export function getPublishedPostSlugs() {
  return getPublishedPosts().map((post) => post.slug);
}

export function getPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function formatPostDate(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
