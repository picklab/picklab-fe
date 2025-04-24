import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@/styles/theme/colors';
import ColorItem from '@/styles/ColorItem';

const primaryColors = {
  5: colors.primary[5],
  10: colors.primary[10],
  20: colors.primary[20],
  30: colors.primary[30],
  40: colors.primary[40],
  50: colors.primary[50],
  60: colors.primary[60],
  70: colors.primary[70],
  80: colors.primary[80],
  90: colors.primary[90],
};

const grayColors = {
  0: colors.gray[0],
  5: colors.gray[5],
  10: colors.gray[10],
  20: colors.gray[20],
  30: colors.gray[30],
  40: colors.gray[40],
  50: colors.gray[50],
  60: colors.gray[60],
  70: colors.gray[70],
  80: colors.gray[80],
  90: colors.gray[90],
  100: colors.gray[100],
};

const dangerColors = {
  5: colors.danger[5],
  10: colors.danger[10],
  20: colors.danger[20],
  30: colors.danger[30],
  40: colors.danger[40],
  50: colors.danger[50],
  60: colors.danger[60],
  70: colors.danger[70],
  80: colors.danger[80],
  90: colors.danger[90],
};

const warningColors = {
  5: colors.warning[5],
  10: colors.warning[10],
  20: colors.warning[20],
  30: colors.warning[30],
  40: colors.warning[40],
  50: colors.warning[50],
  60: colors.warning[60],
  70: colors.warning[70],
  80: colors.warning[80],
  90: colors.warning[90],
};

const infoColors = {
  5: colors.info[5],
  10: colors.info[10],
  20: colors.info[20],
  30: colors.info[30],
  40: colors.info[40],
  50: colors.info[50],
  60: colors.info[60],
  70: colors.info[70],
  80: colors.info[80],
  90: colors.info[90],
};

const successColors = {
  5: colors.success[5],
  10: colors.success[10],
  20: colors.success[20],
  30: colors.success[30],
  40: colors.success[40],
  50: colors.success[50],
  60: colors.success[60],
  70: colors.success[70],
  80: colors.success[80],
  90: colors.success[90],
};

const interactiveColors = {
  primary: colors.interactive.primary,
  'primary-hover': colors.interactive['primary-hover'],
  'primary-press': colors.interactive['primary-press'],
  secondary: colors.interactive.secondary,
  'secondary-hover': colors.interactive['secondary-hover'],
  'secondary-press': colors.interactive['secondary-press'],
  'border-secondary': colors.interactive.border.secondary,
  'border-secondary-hover': colors.interactive.border['secondary-hover'],
  'border-secondary-press': colors.interactive.border['secondary-press'],
};

const disabledColors = {
  disabled: colors.disabled,
  'disabled-border': colors['disabled-border'],
};

const planningColors = {
  background: colors.planning.bg,
  text: colors.planning.text,
};

const developmentColors = {
  background: colors.development.bg,
  text: colors.development.text,
};

const marketingColors = {
  background: colors.marketing.bg,
  text: colors.marketing.text,
};

const designColors = {
  background: colors.design.bg,
  text: colors.design.text,
};

const aiColors = {
  background: colors.ai.bg,
  text: colors.ai.text,
};

const meta: Meta = {
  title: 'Design System/Colors',
  component: ColorItem,
};

export default meta;
type Story = StoryObj;

export const AllColors: Story = {
  render: () => (
    <>
      <ColorItem title="PRIMARY" subtitle="emerald" colors={primaryColors} />
      <ColorItem title="GRAY" subtitle="gray" colors={grayColors} />
      <ColorItem title="DANGER" subtitle="system/red" colors={dangerColors} />
      <ColorItem title="WARNING" subtitle="system/yellow" colors={warningColors} />
      <ColorItem title="INFO" subtitle="system/blue" colors={infoColors} />
      <ColorItem title="SUCCESS" subtitle="system/lime" colors={successColors} />
      <ColorItem title="INTERACTIVE" colors={interactiveColors} />
      <ColorItem title="DISABLED" colors={disabledColors} />
      <ColorItem title="PLANNING" subtitle="jobchip/planning" colors={planningColors} />
      <ColorItem title="DEVELOPMENT" subtitle="jobchip/development" colors={developmentColors} />
      <ColorItem title="MARKETING" subtitle="jobchip/marketing" colors={marketingColors} />
      <ColorItem title="DESIGN" subtitle="jobchip/design" colors={designColors} />
      <ColorItem title="AI" subtitle="jobchip/ai" colors={aiColors} />
    </>
  ),
};
