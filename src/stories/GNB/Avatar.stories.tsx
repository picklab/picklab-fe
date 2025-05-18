import Avatar from '@/components/common/GNB/Avatar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Avatar> = {
  title: 'Components/GNB/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    scale: 'base',
    className: '',
  },
  argTypes: {
    scale: {
      control: { type: 'select' },
      options: ['base', 'lg'],
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    scale: 'lg',
  },
};

export const WithCustomClass: Story = {
  args: {
    scale: 'base',
    className: 'ring-2 ring-blue-500',
  },
};
