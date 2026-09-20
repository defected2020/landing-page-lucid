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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
