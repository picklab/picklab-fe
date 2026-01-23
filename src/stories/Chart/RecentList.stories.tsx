import type { Meta, StoryObj } from '@storybook/react';
import RecentList, { chartDataTypes } from '@/components/common/Chart/RecentList';

const keywords = [
  { id: 1, word: '검색어1' },
  { id: 2, word: '검색어1' },
  { id: 3, word: '검색어1' },
  { id: 4, word: '검색어2' },
  { id: 5, word: '검색어2검색어2' },
  { id: 6, word: '검색어1검색어1검색어1' },
  { id: 7, word: '검색어3' },
  { id: 8, word: '검색어4' },
  { id: 9, word: '검색어3검색어3' },
  { id: 10, word: '검색어2검색어2검색어2' },
];

const chartDatas = [
  { rank: 1, title: '아이템 ABASDASDSDSAD', type: 'new' },
  { rank: 2, title: '아이템 B', type: 'up', value: 3 },
  { rank: 3, title: '아이템 C', type: 'down', value: 1 },
  { rank: 4, title: '아이템 D', type: 'default' },
  { rank: 5, title: '아이템 E', type: 'up', value: 2 },
  { rank: 6, title: '아이템 F', type: 'default' },
  { rank: 7, title: '아이템 G', type: 'down', value: 2 },
  { rank: 8, title: '아이템 H', type: 'up', value: 1 },
  { rank: 9, title: '아이템 I', type: 'default' },
  { rank: 10, title: '아이템 J', type: 'down', value: 1 },
] as chartDataTypes[];

const meta: Meta<typeof RecentList> = {
  title: 'Components/Chart/RecentList',
  component: RecentList,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof RecentList>;

export const Default: Story = {
  args: {
    keywords,
    chartDatas,
    removeHandler: (id: number) => alert(`${id}번 검색어 삭제`),
    popularTime: new Date(),
  },
};
