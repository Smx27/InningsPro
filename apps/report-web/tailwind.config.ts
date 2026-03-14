import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, hsl(var(--primary) / 0.26), hsl(var(--primary) / 0.08) 45%, transparent 90%)',
        'accent-gradient-soft':
          'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.18), transparent 60%), linear-gradient(135deg, hsl(var(--primary) / 0.12), transparent 70%)'
      },
      boxShadow: {
        'elevated-card': '0 20px 45px -22px hsl(var(--primary) / 0.35), 0 14px 30px -24px rgb(15 23 42 / 0.42)',
        'elevated-panel': '0 26px 64px -30px hsl(var(--primary) / 0.4), 0 20px 42px -30px rgb(15 23 42 / 0.55)',
        'elevated-float': '0 30px 90px -40px hsl(var(--primary) / 0.5), 0 24px 56px -36px rgb(15 23 42 / 0.58)'
      },
      fontSize: {
        hero: ['clamp(2.8rem, 6vw, 5.2rem)', { lineHeight: '1.02', letterSpacing: '-0.03em', fontWeight: '700' }],
        'section-title': ['clamp(2rem, 3.8vw, 3.3rem)', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }]
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
