'use client';

import Card from '@/components/common/Card/mobile/Card';
import { Meta, StoryObj } from '@storybook/react';

export default {
  title: 'Components/Card/mobile/Card',
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
    badgeText: 'D-10',
    badgeVariant: 'default',
    isBookmarked: false,
    chipText: '대외활동',
    companyName: '스타트업 A',
    title: 'TitleTitleTitleTitleTitleTitleTitleTitleTitle',
    onBookmarkClick: () => alert('북마크 클릭!'),
    onCardClick: () => alert('카드 클릭!'),
    jobs: ['기획', '디자인', '마케팅', '개발', 'AI'],
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
