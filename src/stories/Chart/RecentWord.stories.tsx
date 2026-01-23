import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import RecentWord from '@/components/common/Chart/RecentWord';

const meta: Meta<typeof RecentWord> = {
  title: 'Components/Chart/RecentWord',
  component: RecentWord,
  tags: ['autodocs'],
  args: {
    keyword: {
      id: 1,
      word: '검색어',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RecentWord>;

export const Default: Story = {
  render: (args) => <RecentWord {...args} removeHandler={(id) => alert(`${id}번 검색어 삭제`)} />,
};
