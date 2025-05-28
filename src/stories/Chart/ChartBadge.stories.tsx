import ChartBadge from '@/components/common/Chart/ChartBadge/ChartBadge';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ChartBadge> = {
  title: 'Components/Chart/ChartBadge',
  component: ChartBadge,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['new', 'default', 'up', 'down'],
    },
    value: {
      control: { type: 'number' },
      description: 'type이 up이나 down일때는 해당값 반드시 입력',
    },
    className: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChartBadge>;

export const Default: Story = {
  args: {
    type: 'default',
  },
};

export const NewBadge: Story = {
  args: {
    type: 'new',
  },
};

export const UpBadge: Story = {
  args: {
    type: 'up',
    value: 2,
  },
};

export const DownBadge: Story = {
  args: {
    type: 'down',
    value: 3,
  },
};
