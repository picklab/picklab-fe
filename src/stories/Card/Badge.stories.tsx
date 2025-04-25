import Badge from '@/components/common/Card/Badge';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
  title: 'components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      defaultValue: '뱃지 텍스트',
    },
    variant: {
      control: { type: 'radio' },
      options: ['default', 'deadline', 'intended'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    text: '기본',
    variant: 'default',
  },
};

export const Deadline: Story = {
  args: {
    text: '마감 임박',
    variant: 'deadline',
  },
};

export const Intended: Story = {
  args: {
    text: '예정',
    variant: 'intended',
  },
};
