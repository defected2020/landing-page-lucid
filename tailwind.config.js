/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './data/**/*.{js,jsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: 'var(--container-padding)',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-subtle': 'var(--bg-subtle)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-subtle': 'var(--text-subtle)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          glow: 'var(--accent-glow)',
          muted: 'var(--accent-muted)',
        },
        success: 'var(--syntax-green)',
        warning: 'var(--syntax-amber)',
        'footer-bg': 'var(--footer-bg)',
        'navbar-bg': 'var(--navbar-bg)',
        'navbar-border': 'var(--navbar-border)',
        'hover-overlay': 'var(--hover-overlay)',
        // shadcn aliases
        background: 'var(--bg)',
        foreground: 'var(--text)',
        input: 'var(--border)',
        ring: 'var(--accent)',
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'var(--bg-elevated)',
          foreground: 'var(--text)',
        },
        muted: {
          DEFAULT: 'var(--bg-subtle)',
          foreground: 'var(--text-muted)',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: 'var(--bg-elevated)',
          foreground: 'var(--text)',
        },
        card: {
          DEFAULT: 'var(--bg-elevated)',
          foreground: 'var(--text)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        sans: ['var(--font-body)'],
      },
      fontSize: {
        eyebrow: ['0.8125rem', { letterSpacing: '0.05em' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: '999px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        medium: '300ms',
        slow: '500ms',
      },
      boxShadow: {
        dropdown: 'var(--shadow-dropdown)',
        glow: '0 0 30px var(--accent-glow)',
      },
      backgroundImage: {
        'cta-gradient': 'var(--cta-gradient)',
        'cta-gradient-simple': 'var(--cta-gradient-simple)',
        'highlight': 'var(--highlight-bg)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
      spacing: {
        section: 'var(--section-padding)',
        container: 'var(--container-padding)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
