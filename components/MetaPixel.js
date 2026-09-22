import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// A pixel id is public by design — it ships in the page source. Set
// NEXT_PUBLIC_META_PIXEL_ID to an empty string in an environment (preview,
// staging) to switch tracking off there without touching code.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '1122696593429353';

/**
 * Meta Pixel for lucidcodelabs.com.
 *
 * Fires on every page load with no consent gate — a deliberate choice, not an
 * oversight. If a cookie banner is ever added, this component is where the
 * gate belongs.
 *
 * Meta's base snippet only sends PageView once, when the script first runs.
 * Client-side route changes never re-run it, so they are reported below; the
 * first view is already covered by the snippet itself.
 */
export default function MetaPixel() {
  const router = useRouter();

  useEffect(() => {
    if (!PIXEL_ID) return undefined;
    const reportPageView = () => window.fbq?.('track', 'PageView');
    router.events.on('routeChangeComplete', reportPageView);
    return () => router.events.off('routeChangeComplete', reportPageView);
  }, [router.events]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
