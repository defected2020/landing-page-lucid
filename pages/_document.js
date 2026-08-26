import { Html, Head, Main, NextScript } from 'next/document';

// Set GOOGLE_SITE_VERIFICATION in the Vercel project env vars if verifying
// Search Console by meta tag. A DNS TXT record on a Domain property is
// preferred (it covers www and apex together) and needs no code.
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/images/lucid-logo.png" type="image/png" />
        {googleVerification && (
          <meta name="google-site-verification" content={googleVerification} />
        )}
        {/* Open the font connections early — the stylesheet blocks render, so
            the extra round trips come straight off Largest Contentful Paint. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
