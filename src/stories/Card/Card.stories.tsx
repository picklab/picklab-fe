'use client';

import Card from '@/components/common/Card/Card';
import { Meta, StoryObj } from '@storybook/react';

export default {
  title: 'Components/Card/Card',
  component: Card,
  argTypes: {
    onBookmarkClick: { action: 'onBookmarkClick' },
    onCardClick: { action: 'onCardClick' },
  },
  parameters: {
    backgrounds: {
      default: 'lightgray',
      values: [{ name: 'lightgray', value: '#f0f0f0' }],
    },
  },
} as Meta;

const Template: StoryObj<typeof Card> = {
  args: {
    imageUrl: '/imgs/cat.jpg',
    badgeText: '마감 임박',
    badgeVariant: 'deadline',
    isBookmarked: false,
    chipText: '채용 중',
    companyName: '스타트업 A',
    title: 'Frontend 개발자 모집',
    onBookmarkClick: () => alert('북마크 클릭!'),
    onCardClick: () => alert('카드 클릭!'),
    jobs: ['개발', '마케팅'],
  },
};

export const Default = { ...Template };

export const Bookmarked = {
  ...Template,
  args: {
    ...Template.args,
    isBookmarked: true,
  },
};

export const MultipleJobs = {
  ...Template,
  args: {
    ...Template.args,
    jobs: ['개발', '마케팅', '디자인'],
  },
};
