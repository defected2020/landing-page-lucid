import '../styles/globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { LazyMotion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '../contexts/ThemeContext';
import MetaPixel from '../components/MetaPixel';

// Self-hosted, subsetted and preloaded by Next: no render-blocking request to
// Google Fonts and no layout shift when the real face swaps in.
// Both are variable fonts: one small file each covers every weight in use
// (Space Grotesk stops at 700; the 800 the old stylesheet asked for never existed).
const inter = Inter({ subsets: ['latin'], display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap' });

const loadMotionFeatures = () => import('../lib/motion-features').then((mod) => mod.default);

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <style jsx global>{`
        :root {
          --font-body: ${inter.style.fontFamily};
          --font-display: ${spaceGrotesk.style.fontFamily};
        }
      `}</style>
      {/* Components use the lightweight `m` element; the animation features
          arrive in their own chunk after the first paint, so framer-motion
          never sits on the critical path. Elements simply hold their initial
          pose until then. */}
      <LazyMotion features={loadMotionFeatures}>
        <Component {...pageProps} />
      </LazyMotion>
      {/* Traffic reporting and real-user Core Web Vitals. Both need enabling
          once per project in the Vercel dashboard; they no-op until then. */}
      <Analytics />
      <SpeedInsights />
      {/* Meta Pixel — no consent gate, see components/MetaPixel.js */}
      <MetaPixel />
    </ThemeProvider>
  );
}

export default MyApp;
