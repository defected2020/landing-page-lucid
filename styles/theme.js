const darkTheme = {
  colors: {
    bg: '#0a0a0a',
    bgElevated: '#141414',
    bgSubtle: '#1a1a1a',
    border: '#262626',
    borderHover: '#404040',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    textSubtle: '#71717a',
    accent: '#6366f1',
    accentHover: '#818cf8',
    accentGlow: 'rgba(99, 102, 241, 0.15)',
    accentMuted: 'rgba(99, 102, 241, 0.08)',
    success: '#22c55e',
    warning: '#f59e0b',
  },
};

const lightTheme = {
  colors: {
    bg: '#ffffff',
    bgElevated: '#f8f8fa',
    bgSubtle: '#f1f1f5',
    border: '#e2e2e8',
    borderHover: '#c8c8d0',
    text: '#18181b',
    textMuted: '#52525b',
    textSubtle: '#a1a1aa',
    accent: '#4f46e5',
    accentHover: '#4338ca',
    accentGlow: 'rgba(79, 70, 229, 0.12)',
    accentMuted: 'rgba(79, 70, 229, 0.06)',
    success: '#16a34a',
    warning: '#d97706',
  },
};

const shared = {
  typography: {
    fontDisplay: "'Space Grotesk', sans-serif",
    fontBody: "'Inter', sans-serif",
    h1: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)',
    h2: 'clamp(2rem, 3.5vw + 0.5rem, 3.25rem)',
    h3: 'clamp(1.25rem, 2vw + 0.25rem, 1.75rem)',
    body: 'clamp(0.9375rem, 1vw, 1.0625rem)',
    small: '0.875rem',
    eyebrow: '0.8125rem',
    weightRegular: 400,
    weightMedium: 500,
    weightSemibold: 600,
    weightBold: 700,
    weightBlack: 800,
  },
  spacing: {
    containerMax: '1440px',
    containerPadding: 'clamp(1rem, 3vw, 3rem)',
    sectionPadding: 'clamp(4rem, 8vw, 8rem)',
  },
  radii: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    pill: '999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    medium: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export { darkTheme, lightTheme, shared };
export default { ...darkTheme, ...shared };
