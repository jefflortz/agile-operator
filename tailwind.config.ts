import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        navy: {
          50:  '#f0f4f9',
          100: '#d9e4f0',
          200: '#b3c9e2',
          300: '#7fa3cc',
          400: '#4d7db5',
          600: '#1e4a7a',
          700: '#163a61',
          800: '#0f2a47',
          900: '#0b1f3a',  // primary brand navy
          950: '#071428',
        },
        gold: {
          400: '#e8b84b',
          500: '#d4a017',  // accent — use sparingly
          600: '#b8880f',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display scale
        'display-xl': ['4rem',    { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'display-sm': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
      },
      spacing: {
        // Section padding
        'section':    '6rem',   // 96px — standard section vertical padding
        'section-sm': '4rem',   // 64px — tighter sections
        'section-lg': '8rem',   // 128px — hero / feature sections
      },
      maxWidth: {
        content: '1200px',  // max site width
        prose:   '720px',   // article body
      },
    },
  },
  plugins: [],
}

export default config
