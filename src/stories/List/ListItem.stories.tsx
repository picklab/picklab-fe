import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ListItem, { ListItemProps } from '@/components/common/List/ListItem';

const meta: Meta<typeof ListItem> = {
  title: 'Components/List/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  args: {
    thumbnail: '/imgs/cat.jpg',
    label: '진행중',
    title: '리스트 아이템 제목',
    saveCount: 10,
    viewCount: 100,
    isBookmarked: false,
    isFinished: false,
    chipTitle: '강연/세미나',
    organization: '회사명',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-05-15'),
    onListClick: () => alert('리스트 클릭!'),
  },
  argTypes: {
    thumbnail: { control: { disable: true }, description: '공통 필수 값' },
    label: { description: '진행 중 리스트 필수 값' },
    title: { description: '공통 필수 값' },
    saveCount: { control: 'number', description: '진행 중 리스트 필수 값' },
    viewCount: { control: 'number', description: '진행 중 리스트 필수 값' },
    isBookmarked: { control: { disable: true }, description: '진행 중 리스트 필수 값' }, // 북마크 여부는 Template 내의 state로 관리
    isFinished: { control: 'boolean', description: '공통 필수 값' },
    chipTitle: {
      control: 'select',
      options: ['대외활동', '교육', '공모전/해커톤', '강연/세미나'],
      description: '종료된 리스트 필수 값',
    },
    organization: { description: '종료된 리스트 필수 값' },
    startDate: { description: '종료된 리스트 필수 값' },
    endDate: { description: '종료된 리스트 필수 값' },
    onListClick: { description: '공통 필수 값' },
    onBookmarkClick: { description: '진행 중 리스트 필수 값' },
  },
};

export default meta;
type Story = StoryObj<typeof ListItem>;

const Template = (args: ListItemProps) => {
  const [isBookmarked, setIsBookmarked] = useState(args.isBookmarked);

  return <ListItem {...args} isBookmarked={isBookmarked} onBookmarkClick={() => setIsBookmarked(!isBookmarked)} />;
};

export const Ongoing: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: '모집 중',
    saveCount: 10,
    viewCount: 120,
    isFinished: false,
  },
};

export const Finished: Story = {
  render: (args) => <Template {...args} />,
  args: {
    chipTitle: '공모전/해커톤',
    organization: '기관명',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-01'),
    isFinished: true,
  },
};

export const Bookmarked: Story = {
  render: (args) => <Template {...args} />,
  args: {
    isBookmarked: true,
    label: '모집 중',
    saveCount: 5,
    viewCount: 80,
  },
};
