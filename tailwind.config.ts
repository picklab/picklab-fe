import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontSize: {
        '6xl': 'var(--font-size-6xl)',
        '4xl': 'var(--font-size-4xl)',
        '3xl': 'var(--font-size-3xl)',
        '2xl': 'var(--font-size-2xl)',
        xl: 'var(--font-size-xl)',
        lg: 'var(--font-size-lg)',
        base: 'var(--font-size-base)',
        sm: 'var(--font-size-sm)',
        xs: 'var(--font-size-xs)',
        '2xs': 'var(--font-size-2xs)',
        '3xs': 'var(--font-size-3xs)',
        '4xs': 'var(--font-size-4xs)',
        '5xs': 'var(--font-size-5xs)',
        '6xs': 'var(--font-size-6xs)',
        '7xs': 'var(--font-size-7xs)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
      letterSpacing: {
        tight: 'var(--letter-spacing-tight)',
        wide: 'var(--letter-spacing-wide)',
      },
    },
  },
  plugins: [],
};
export default config;
