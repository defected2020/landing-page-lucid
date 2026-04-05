import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from '../contexts/ThemeContext';

const GlobalStyle = createGlobalStyle`
  :root,
  [data-theme="dark"] {
    --bg: #0a0a0a;
    --bg-elevated: #141414;
    --bg-subtle: #1a1a1a;
    --border: #262626;
    --border-hover: #404040;
    --text: #fafafa;
    --text-muted: #a1a1aa;
    --text-subtle: #71717a;
    --accent: #6366f1;
    --accent-hover: #818cf8;
    --accent-glow: rgba(99, 102, 241, 0.15);
    --accent-muted: rgba(99, 102, 241, 0.08);
    --syntax-green: #22c55e;
    --syntax-amber: #f59e0b;
    --navbar-bg: rgba(10, 10, 10, 0.85);
    --navbar-border: rgba(255, 255, 255, 0.06);
    --hover-overlay: rgba(255, 255, 255, 0.04);
    --hero-overlay-start: rgba(10, 10, 10, 0.92);
    --hero-overlay-mid: rgba(10, 10, 10, 0.75);
    --hero-overlay-end: rgba(10, 10, 10, 0.3);
    --hero-overlay-mobile-start: rgba(10, 10, 10, 0.85);
    --hero-overlay-mobile-end: rgba(10, 10, 10, 0.6);
    --footer-bg: #050505;
    --form-bg: #ffffff;
    --form-shadow: rgba(99, 102, 241, 0.08);
    --cta-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%);
    --cta-gradient-simple: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    --cta-btn-bg: white;
    --cta-btn-text: #6366f1;
    --highlight-bg: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
    --highlight-border: rgba(99, 102, 241, 0.15);
    --shadow-dropdown: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03);
    --globe-sphere-inner: rgba(25, 30, 50, 0.9);
    --globe-sphere-mid: rgba(12, 15, 30, 0.85);
    --globe-sphere-outer: rgba(5, 5, 15, 0.8);
    --globe-grid: rgba(99, 102, 241, 0.06);
    --globe-land-fill: rgba(99, 102, 241, 0.07);
    --globe-land-stroke: rgba(130, 140, 255, 0.2);
    --font-display: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', sans-serif;
    --container-max: 1440px;
    --container-padding: clamp(1rem, 3vw, 3rem);
    --section-padding: clamp(4rem, 8vw, 8rem);
    --radius-sm: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-xl: 1.5rem;
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  [data-theme="light"] {
    --bg: #ffffff;
    --bg-elevated: #f8f8fa;
    --bg-subtle: #f1f1f5;
    --border: #e2e2e8;
    --border-hover: #c8c8d0;
    --text: #18181b;
    --text-muted: #52525b;
    --text-subtle: #a1a1aa;
    --accent: #4f46e5;
    --accent-hover: #4338ca;
    --accent-glow: rgba(79, 70, 229, 0.12);
    --accent-muted: rgba(79, 70, 229, 0.06);
    --syntax-green: #16a34a;
    --syntax-amber: #d97706;
    --navbar-bg: rgba(255, 255, 255, 0.85);
    --navbar-border: rgba(0, 0, 0, 0.06);
    --hover-overlay: rgba(0, 0, 0, 0.03);
    --hero-overlay-start: rgba(255, 255, 255, 0.92);
    --hero-overlay-mid: rgba(255, 255, 255, 0.75);
    --hero-overlay-end: rgba(255, 255, 255, 0.3);
    --hero-overlay-mobile-start: rgba(255, 255, 255, 0.88);
    --hero-overlay-mobile-end: rgba(255, 255, 255, 0.6);
    --footer-bg: #f1f1f5;
    --form-bg: #ffffff;
    --form-shadow: rgba(79, 70, 229, 0.06);
    --cta-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%);
    --cta-gradient-simple: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    --cta-btn-bg: white;
    --cta-btn-text: #4f46e5;
    --highlight-bg: linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(124, 58, 237, 0.04) 100%);
    --highlight-border: rgba(79, 70, 229, 0.12);
    --shadow-dropdown: 0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
    --globe-sphere-inner: rgba(220, 225, 240, 0.9);
    --globe-sphere-mid: rgba(200, 205, 225, 0.85);
    --globe-sphere-outer: rgba(180, 185, 210, 0.8);
    --globe-grid: rgba(79, 70, 229, 0.08);
    --globe-land-fill: rgba(79, 70, 229, 0.1);
    --globe-land-stroke: rgba(79, 70, 229, 0.25);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    color-scheme: dark;
  }

  [data-theme="light"] {
    color-scheme: light;
  }

  body {
    font-family: var(--font-body);
    line-height: 1.6;
    color: var(--text);
    background-color: var(--bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color var(--transition-medium), color var(--transition-medium);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    font-family: var(--font-body);
  }

  ::selection {
    background-color: var(--accent);
    color: white;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-hover);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-subtle);
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
