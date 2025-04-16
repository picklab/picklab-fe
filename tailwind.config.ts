import { fontSizes, fontWeights, lineHeights, letterSpacings } from './src/styles/theme/text';
import { colors } from './src/styles/theme/colors';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard-Regular', ...defaultTheme.fontFamily.sans],
      },
      colors: colors,
      fontSize: fontSizes,
      fontWeight: fontWeights,
      lineHeight: lineHeights,
      letterSpacing: letterSpacings,
      maxWidth: {
        container: '1100px',
      },
      padding: {
        layoutPadding: '170px',
      },
    },
    screens: {
      desktop: { min: '1440px' },
      // 임시 레이아웃
      noDesktop: { max: '1440px' },
    },
  },
  plugins: [],
};

export default config;
