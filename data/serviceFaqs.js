// FAQ content for service pages. Rendered visibly by components/FAQ.js and
// emitted as FAQPage structured data — the two must always match, since
// marking up answers that are not on the page is a structured-data violation.

export const serviceFaqs = {
  "web-development": [
    {
      q: "How much does a custom website or web app cost?",
      a: "Cost tracks how much of the site is custom software rather than content pages. A brochure site assembled from a few page templates is a much smaller build than a platform carrying user accounts, payments, several languages and an admin area behind it. The variables that move the figure most are the number of distinct user roles, the integrations with systems you already run, and how much of the design is still open. We scope against a written feature list and put the cost in writing before any build work starts.",
    },
    {
      q: "How long does it take to build a custom web application?",
      a: "Scope sets the timeline, and staging changes what finished means. We build in stages so there is a working version to use before every feature exists, which often means a first release goes live while later work continues behind it. What holds projects up is rarely the code: it is usually content, brand assets, or access to third-party accounts that sit with someone else. We put a schedule against the feature list once that list is agreed, and tell you when something moves it rather than at the end.",
    },
    {
      q: "Do I need a custom build, or will WordPress or Squarespace do the job?",
      a: "If the site is mostly content pages with a contact form, WordPress or a site builder will usually serve you well, and there is little sense in commissioning custom software to publish text. Custom work starts to make sense when the site has to do something: accounts and permissions, payment flows, data that differs per user, or an interface wired into your own systems. Our default stack for that second category is Next.js and React. It is worth settling which of the two you are actually buying before you brief anyone.",
    },
    {
      q: "Can I edit the text and images myself after the site launches?",
      a: "Yes, where we build that in, and on content-led sites we normally do. Editing is designed in from the start so copy, images and page sections can be changed by someone non-technical. Which parts are editable is a decision worth making early: making every element editable tends to produce an admin nobody enjoys using, so we agree up front what your team will realistically change and build the editing around that, rather than routing small content changes back through us.",
    },
    {
      q: "Can you add payments and user accounts to a website?",
      a: "Yes. We have built platforms using Stripe for payments and Supabase or MongoDB behind accounts and application data, and we can usually build around the provider or database you already use rather than replacing it. Payments bring work beyond the code — tax handling, refunds, disputes, and whatever your payment provider requires of you — so those belong in scoping rather than in the week before launch.",
    },
    {
      q: "Who owns the code, and could another developer take the site over?",
      a: "The code written for your project is yours. We build on Next.js and React, both widely used and well documented, so the site can be picked up by any competent React developer rather than only by us, and we avoid proprietary wrappers that would make that awkward. If you move the work in-house or to another agency later, the repository and its deployment configuration go with you.",
    },
  ],
  "mobile-app-development": [
    {
      q: "Is React Native good enough for a real production app?",
      a: "For most apps, yes, including ones with logins, real-time data, media playback and offline behaviour. We have shipped a production React Native app built with Expo, Redux Toolkit and Supabase, running Apple sign-in and audio playback on iOS and Android from one codebase. Apps that lean hard on platform-specific hardware, heavy graphics or low-level performance work are still better served by native builds, and if yours is one of them we would rather say so at the start.",
    },
    {
      q: "What does it cost to build a mobile app?",
      a: "The main drivers are the number of distinct screens and flows, whether a backend and API already exist to build against, and how settled the design is. Reusing an existing API with a finished design is a very different job from building the data model, authentication and admin tooling alongside the app. Payments, video or messaging add integration and testing on top. There are also running costs that are yours rather than ours: Apple and Google developer accounts, and whatever services the app depends on. We price from a written feature list, not from a page like this.",
    },
    {
      q: "How long does it take to get an app into the App Store?",
      a: "Scope drives it far more than the framework does: a first release with a few core flows moves quickly compared with an app carrying social features, payments and an admin dashboard. Store review then adds time at the end, and a first submission to Apple often comes back asking for changes, so it is worth leaving room for that instead of booking a launch date against the day the code is finished. We schedule once scope is agreed and re-cut the schedule in the open when scope moves.",
    },
    {
      q: "What is the difference between Expo and bare React Native?",
      a: "Expo is a toolchain and library set on top of React Native that handles builds, over-the-air updates and many native modules for you, which keeps you out of Xcode and Gradle most of the time. Bare React Native hands you the native projects directly, which matters when you need a native SDK that Expo does not cover. Development builds have narrowed that gap considerably — custom native code is now normal inside an Expo project — so we start with Expo and add native code where a specific integration calls for it.",
    },
    {
      q: "Can a React Native app use native features like Sign in with Apple?",
      a: "Yes. We have implemented Apple sign-in and audio playback in a production app, and push notifications, biometrics, camera access, deep links and in-app purchases are all covered by maintained libraries. The friction usually comes from store policy rather than the framework: Apple sets rules about which login options must sit alongside third-party sign-in, and those rules have changed more than once, while background audio only works if the build declares the right capability. Check the current guidelines for anything your app leans on.",
    },
    {
      q: "Who owns the app and the App Store listing once it is built?",
      a: "You do — the code, the repository and the store listings. Wherever possible we publish under your own Apple Developer and Google Play accounts, so your company stays the account holder and a later handover does not have to route through us. Apps also need maintenance after launch whoever builds them, because OS releases, SDK deprecations and store policy changes force updates over time. We usually set up crash and error reporting with Sentry, so problems on real devices arrive as reports rather than as complaints.",
    },
  ],
  "ux-ui-design": [
    {
      q: "How much does UX/UI design cost?",
      a: "Design cost follows the size of the problem rather than the number of screens. A usability review of something that already exists is a small piece of work; research, interaction design and a component library for a complex application is a much larger one. What moves the figure most is how much user research is needed, how many user roles and edge-case states the product has, and whether there is already a brand and design language to work from. We put the scope and the cost in writing before starting, so you are not committing to an open-ended hourly arrangement.",
    },
    {
      q: "What do we actually get at the end — Figma files, prototypes, specs?",
      a: "Typically a Figma file you own, with screens and flows organised so they can be navigated rather than hunted through; clickable prototypes for the flows that need testing or sign-off; and the specifications a developer needs — spacing, states, tokens, interaction behaviour — rather than a set of flat images. Where research is part of the work, you also get what came out of it: the findings, the decisions taken from them, and the ones deliberately parked. Exactly what is included is set in the scope, because a usability review and a full product design produce very different things.",
    },
    {
      q: "What is the difference between UX design and UI design?",
      a: "UX is how the product works; UI is how it looks and feels while you use it. UX covers research, information architecture, user flows and the logic of completing a task. UI covers layout, typography, colour, interface states and the visual system that carries your brand. Splitting them cleanly is mostly a hiring convenience — a polished interface sitting on a confused flow still frustrates people. New product work usually needs both, though an existing product with a sound structure may only need the interface layer revisited.",
    },
    {
      q: "Can you hand the designs to our developers, or do you build them too?",
      a: "Either. We often build what we design, and when the people designing and the people building are working together, the questions that come up mid-build get answered without a formal handover. If you have your own development team, we design to their stack and supply component specifications, design tokens and assets they can implement directly, then stay available through the build to answer questions and review what ships against what was designed.",
    },
    {
      q: "Will the design meet WCAG accessibility standards?",
      a: "We design against the WCAG criteria as we go rather than patching at the end, because contrast, focus order, target sizes and keyboard paths are far cheaper to get right in a design file than in shipped code. In practice that means palettes checked for contrast, states drawn for keyboard and screen reader users, and components documented with their accessible behaviour and not only their appearance. AA is the level most public-facing products are measured against, and the European Accessibility Act has made it a compliance question for products sold into the EU. Whether the finished product conforms depends on the build as much as the design, so if it is a legal requirement for you, say so early and we will treat it as one — including auditing what you already have before any redesign starts.",
    },
    {
      q: "Do we need a design system, or is designing the screens enough?",
      a: "A design system starts to pay off once more than one person will design or build in the product over time. If you are validating a single idea, a small set of consistent components and a few clear rules is usually enough, and full documentation would only slow you down. With several teams, more than one platform or a long roadmap, a system removes decisions that would otherwise be re-made every week and keeps the product coherent as it grows. We build them as component libraries in Figma with tokens that map to the codebase, so the design source and the running product do not drift apart.",
    },
  ],
  "ai-powered-software": [
    {
      q: "What does it cost to add AI features to an existing app?",
      a: "Most of the cost is integration rather than AI. Model calls are billed per request by the provider, so that part scales with usage instead of landing up front; the engineering goes into everything around the call — shaping the input, validating what comes back, building the screens where someone reviews it, and deciding how the feature behaves when the provider is slow or down. Whether your data is already in a usable state matters as much as the feature itself. We scope after reading the codebase and looking at the data, because anything quoted before that is a guess.",
    },
    {
      q: "Do I need to train my own model, or can I just use the OpenAI API?",
      a: "Most products do not need a custom-trained model. Hosted language models already cover a wide range of language, extraction and classification work, and careful prompting, structured output and retrieval over your own content will usually take you further than fine-tuning. Training your own starts to make sense when you have a narrow, repetitive task with plenty of labelled examples, or a hard requirement to keep data inside your own infrastructure. Our own work has taken the first route: the OpenAI SDK integrated directly into a production Node backend, rather than a training pipeline.",
    },
    {
      q: "How do you stop an AI feature from making things up?",
      a: "You cannot stop a language model from being wrong, so the design has to assume that it will be. The control that does most of the work is keeping model output out of live data until a person has approved it. In a menu-scanning feature we built, photographed pages are read into a staged import that the account owner reviews and edits, and only an explicit commit writes real records; the source images are kept alongside the extraction, so a later dispute can be checked against what the model was actually shown. Forcing structured output and validating it against your own business rules clears out a further class of errors before anyone sees them.",
    },
    {
      q: "Do we need a lot of data before AI is worth doing?",
      a: "For features built on large language models, usually far less than people expect: the model brings the general capability, and your own data mainly needs to be findable. Predictive machine learning is a different case — it needs enough historical examples to cover the outcomes you want predicted, including the rare ones, and quality counts for more than volume. The more common blocker is the condition of the data rather than the amount of it, when records are unlabelled, inconsistent, or split across systems that do not talk to each other. Sorting that out is often the real project, and it is worth doing whether or not AI ever goes on top.",
    },
    {
      q: "Is it safe to send customer data to OpenAI or another AI provider?",
      a: "It depends on the provider's terms and on how much personal data you genuinely need to send. The business API tiers from the major providers generally state that they do not train on data submitted through the API, and several offer data residency options, but terms change and you should read the current ones rather than trust a summary, this one included. The strongest control is sending less: strip or pseudonymise identifiers before the request, include only the fields the task needs, and keep a record of what was sent so you can answer questions about it later. Where data cannot leave your own infrastructure at all, a privately hosted open-weight model is the alternative, at the cost of more operational work.",
    },
    {
      q: "Can you add AI to an app that another agency built?",
      a: "Yes, and that is the usual case — AI features almost always land in a system that already exists. The first job is reading the codebase to work out where the call belongs, where the result is stored, who is allowed to trigger it, and how the feature should behave when the provider is unavailable. Our AI work has been exactly this kind: OpenAI-backed extraction added to a production Node backend, and a cast of nine AI companion characters, each with its own voice, built into an interactive product. We ask for repository access and a walkthrough with whoever knows the system best before agreeing any scope.",
    },
  ],
};

export function getServiceFaqs(key) {
  return serviceFaqs[key] ?? [];
}
