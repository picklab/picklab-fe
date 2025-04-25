import { fontSizes, fontWeights, lineHeights, letterSpacings } from './src/styles/theme/text';
import { spacing } from './src/styles/theme/spacing';
import { colors } from './src/styles/theme/colors';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/ColorItem.tsx',
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
      spacing: spacing,
      boxShadow: {
        optionGroup: '1px 4px 4.8px 0px #00000021',
      },
    },
  },
  plugins: [],
};

export default config;
