import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@/styles/theme/colors';
import ColorItem from '@/styles/ColorItem';

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

const meta: Meta = {
  title: 'Design System/Colors',
  component: ColorItem,
};

export default meta;
type Story = StoryObj;

export const AllColors: Story = {
  render: () => (
    <>
      <ColorItem title="PRIMARY" subtitle="emerald" colors={colors.primary} />
      <ColorItem title="GRAY" subtitle="gray" colors={colors.gray} />
      <ColorItem title="DANGER" subtitle="system/red" colors={colors.danger} />
      <ColorItem title="WARNING" subtitle="system/yellow" colors={colors.warning} />
      <ColorItem title="INFO" subtitle="system/blue" colors={colors.info} />
      <ColorItem title="SUCCESS" subtitle="system/lime" colors={colors.success} />
      <ColorItem title="INTERACTIVE" colors={interactiveColors} />
      <ColorItem title="DISABLED" colors={disabledColors} />
      <ColorItem title="PLANNING" subtitle="jobchip/planning" colors={colors.planning} />
      <ColorItem title="DEVELOPMENT" subtitle="jobchip/development" colors={colors.development} />
      <ColorItem title="MARKETING" subtitle="jobchip/marketing" colors={colors.marketing} />
      <ColorItem title="DESIGN" subtitle="jobchip/design" colors={colors.design} />
      <ColorItem title="AI" subtitle="jobchip/ai" colors={colors.ai} />
    </>
  ),
};
