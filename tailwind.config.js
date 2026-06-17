/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Core canvas — near-black inks from the brand flier
        ink: {
          DEFAULT: '#0A0A0B',
          900: '#0A0A0B',
          800: '#111114',
          700: '#18181C',
          600: '#222227',
        },
        // Ember — the signature orange-red
        ember: {
          DEFAULT: '#FF3F1A',
          light: '#FF6A47',
          dark: '#E2330F',
          glow: '#FF8A6B',
        },
        // Ice — the calm light-blue
        ice: {
          DEFAULT: '#97D6DF',
          light: '#C2EAEF',
          dark: '#6FBCC7',
        },
        teal: {
          DEFAULT: '#447980',
          dark: '#2E565B',
        },
        mist: '#A8ABB4',

        // Legacy brand aliases (kept so existing utility classes resolve)
        brand: {
          primary: '#0A0A0B',
          secondary: '#FF3F1A',
          accent1: '#97D6DF',
          accent2: '#447980',
        },
        text: {
          heading: '#0A0A0B',
          subheading: '#52555f',
          body: '#5b5e68',
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF3F1A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#97D6DF",
          foreground: "#0A0A0B",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#447980",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-grotesk)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'dot-pattern': "radial-gradient(rgba(151,214,223,0.10) 1px, transparent 1px)",
        'grid-faint':
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        'ember-radial':
          "radial-gradient(60% 60% at 50% 0%, rgba(255,63,26,0.18) 0%, rgba(255,63,26,0) 70%)",
      },
      backgroundSize: {
        'dot-lg': '24px 24px',
        'grid-lg': '64px 64px',
      },
      boxShadow: {
        ember: '0 10px 40px -12px rgba(255,63,26,0.45)',
        'ember-sm': '0 4px 18px -6px rgba(255,63,26,0.5)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px -20px rgba(0,0,0,0.7)',
        soft: '0 12px 40px -16px rgba(10,10,11,0.18)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'spin-slow': 'spinSlow 22s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
