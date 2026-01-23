import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export const spacing = {
  'space-2': '2px', // 2px
  'space-base': '4px', // 4px (base)
  'space-6': '6px', // 6px
  'space-8': '8px', // 8px
  'space-10': '10px', // 10px
  'space-12': '12px', // 12px
  'space-14': '14px', // 14px
  'space-16': '16px', // 16px
  'space-20': '20px', // 20px
  'space-24': '24px', // 24px
  'space-32': '32px', // 32px
  'space-40': '40px', // 40px
  'space-48': '48px', // 48px
  'space-56': '56px', // 56px
};

export const radius = {
  // rounded-full-circle과 none은 기본 클래스로 쓸 수 있어 배제했습니다!
  ['extra-small']: '4px',
  small: '6px',
  medium: '8px',
  large: '10px',
  ['extra-large']: '12px',
};

export const elevation = {
  // 따로 변수값을 정의해주시지 않아 임의로 나누었습니다!(추후 변경 가능)
  sm: '0px 1px 2px 0px #0000001F',
  md: '0px 2px 8px 0px #0000001F',
  lg: '0px 6px 12px 0px #0000001F',
  xl: '0px 16px 20px 0px #0000001F',
  optionGroup: '1px 4px 4.8px 0px rgba(0, 6, 12, 0.08)',
};

export const colors = {
  primary: {
    5: '#ECFDF5',
    10: '#CFEEDF',
    20: '#8AE1B8',
    30: '#62D9AD',
    40: '#00D492',
    50: '#00BC7D',
    60: '#009966',
    70: '#007A55',
    80: '#006045',
    90: '#004F3B',
  },
  gray: {
    0: '#FFFFFF',
    5: '#F9FAFB',
    10: '#F3F4F6',
    20: '#E5E7EB',
    30: '#D1D5DC',
    40: '#99A1AF',
    50: '#6A7282',
    60: '#4A5565',
    70: '#364153',
    80: '#4A5660',
    90: '#101828',
    100: '#000000',
  },
  danger: {
    5: '#FEF2F2',
    10: '#FFE2E2',
    20: '#FFC9C9',
    30: '#FFA2A2',
    40: '#FF6467',
    50: '#FB2C36',
    60: '#E7000B',
    70: '#C10007',
    80: '#9F0712',
    90: '#82181A',
    border: '#DC2626',
  },
  warning: {
    5: '#FEFCE8',
    10: '#FEF9C2',
    20: '#FFF085',
    30: '#FFDF20',
    40: '#FDC700',
    50: '#F0B100',
    60: '#D08700',
    70: '#A65F00',
    80: '#894B00',
    90: '#733E0A',
  },
  info: {
    5: '#EFF6FF',
    10: '#DBEAFE',
    20: '#BEDBFF',
    30: '#8EC5FF',
    40: '#51A2FF',
    50: '#2B7FFF',
    60: '#155DFC',
    70: '#1447E6',
    80: '#193CB8',
    90: '#1C398E',
  },
  success: {
    5: '#EAF6EC',
    10: '#D8EEDD',
    20: '#A9DAB4',
    30: '#7EC88E',
    40: '#3FA654',
    50: '#228738',
    60: '#267337',
    70: '#285D33',
    80: '#1F4727',
    90: '#122B18',
  },
  interactive: {
    primary: '#2563EB',
    'primary-hover': '#1D4ED8',
    'primary-press': '#1E40AF',
    secondary: '#F3F3F3',
    'secondary-hover': '#E3E5E9',
    'secondary-press': '#D1D5DB',
    border: {
      secondary: '#D1D5DB',
      'secondary-hover': '#9CA3AF',
      'secondary-press': '#6B7280',
    },
    destructive: '#DC2626',
  },
  disabled: '#D1D5DB',
  'disabled-border': '#9CA3AF',
  planning: {
    bg: '#FFE8ED',
    text: '#ED658B',
  },
  development: {
    bg: '#E1EDFF',
    text: '#2484D8',
  },
  marketing: {
    bg: '#EBE8FF',
    text: '#8F62F0',
  },
  design: {
    bg: '#FDE7FF',
    text: '#E16CD9',
  },
  ai: {
    bg: '#67687D',
    text: '#F2F2F2',
  },
  dimmed: {
    85: '#000000D9',
    70: '#000000B3',
    30: '#0000004D',
  },
};

export const fontSizes = {
  '6xl': '56px',
  '5xl': '40px',
  '4xl': '36px',
  '3xl': '28px',
  '2xl': '24px',
  xl: '22px',
  lg: '20px',
  base: '18px',
  sm: '17px',
  xs: '16px',
  '2xs': '15px',
  '3xs': '14px',
  '4xs': '13px',
  '5xs': '12px',
  '6xs': '11px',
  '7xs': '10px',
  '8xs': '9px',
};

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const lineHeights = {
  normal: '1.5',
  relaxed: '1.75',
};

export const letterSpacings = {
  tight: '-0.02em',
  wide: '0.05em',
};

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
      screens: {
        mobile: { max: '1439px' },
        pc: { min: '1440px' },
      },
      fontFamily: {
        sans: ['Pretendard-Regular', ...defaultTheme.fontFamily.sans],
      },
      colors: colors,
      fontSize: fontSizes,
      fontWeight: fontWeights,
      lineHeight: lineHeights,
      letterSpacing: letterSpacings,
      spacing: spacing,
      borderRadius: radius,
      boxShadow: elevation,
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
