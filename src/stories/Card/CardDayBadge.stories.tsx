import CardDayBadge from '@/components/common/Card/CardDayBadge';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CardDayBadge> = {
  title: 'components/Card/CardDayBadge',
  component: CardDayBadge,
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
type Story = StoryObj<typeof CardDayBadge>;

export const Default: Story = {
  args: {
    text: 'D-00',
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
