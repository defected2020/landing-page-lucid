import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '../contexts/ThemeContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
      {/* Traffic reporting and real-user Core Web Vitals. Both need enabling
          once per project in the Vercel dashboard; they no-op until then. */}
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
}

export default MyApp;
