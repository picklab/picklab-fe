import { fontSizes, fontWeights, lineHeights, letterSpacings } from './src/styles/theme/text';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard-Regular', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: '#ffffff', // 원하면 여기도 직접 hex 값으로
        foreground: '#000000',
      },
      fontSize: fontSizes,
      fontWeight: fontWeights,
      lineHeight: lineHeights,
      letterSpacing: letterSpacings,
    },
  },
  plugins: [],
};

export default config;
