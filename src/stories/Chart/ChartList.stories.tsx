import type { Meta, StoryObj } from '@storybook/react';
import type { BadgeTypes } from '@/components/common/Chart/ChartBadge/ChartBadge';
import ChartList from '@/components/common/Chart/ChartList';

const meta: Meta<typeof ChartList> = {
  title: 'Components/Chart/ChartList',
  component: ChartList,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['new', 'default', 'up', 'down'] satisfies BadgeTypes[],
    },
    value: {
      control: 'number',
      description: 'type이 up이나 down일때는 해당값 반드시 입력',
    },
    rank: {
      control: 'number',
    },
    title: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChartList>;

export const Default: Story = {
  args: {
    rank: 1,
    title: '예시 검색어',
    type: 'default',
  },
};

export const LongTitle: Story = {
  args: {
    rank: 2,
    title: '긴 검색어긴 검색어긴 검색어긴 검색어긴 검색어',
    type: 'up',
    value: 3,
  },
};

export const NewItem: Story = {
  args: {
    rank: 3,
    title: '새로운 검색어',
    type: 'new',
  },
};

export const DownItem: Story = {
  args: {
    rank: 4,
    title: '긴 검색어긴 검색어긴 검색어긴 검색어긴 검색어',
    type: 'down',
    value: 1,
  },
};
