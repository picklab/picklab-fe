import Typography, { TypographyTypes } from '@/components/common/Typography';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  args: { onClick: fn() },
  tags: ['autodocs'],
  argTypes: {
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
    },
    type: {
      control: 'select',
      options: Object.keys(TypographyTypes),
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    tag: 'h3',
    type: 'Title3Medium',
    children: '이것은 Typography 예시입니다.',
    className: 'text-danger-50',
  },
};
