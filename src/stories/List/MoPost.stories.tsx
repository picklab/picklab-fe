import type { Meta, StoryObj } from '@storybook/react';
import MoPost, { MoPostProps } from '@/components/common/List/mobile/MoPost';

const meta: Meta<MoPostProps> = {
  title: 'Components/List/MoPost',
  component: MoPost,
  tags: ['autodocs'],
  args: {
    text: 'text',
    chipText: '대외활동',
    title: '2024년 하반기 대외활동 모집',
    company: '픽랩',
    date: new Date('2024-12-25'),
  },
  argTypes: {
    text: {
      control: 'text',
      description: '상단에 표시될 텍스트',
    },
    chipText: {
      control: 'select',
      options: ['대외활동', '교육', '공모전/해커톤', '강연/세미나'],
      description: '칩에 표시될 텍스트',
    },
    title: {
      control: 'text',
      description: '제목',
    },
    company: {
      control: 'text',
      description: '회사명',
    },
    date: {
      control: 'date',
      description: '날짜',
    },
    onPostClick: { action: 'post clicked', table: { disable: true } },
    onMenuClick: { action: 'menu clicked', table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof MoPost>;

// 기본 MoPost
export const Default: Story = {
  args: {
    text: '알립니다',
    chipText: '대외활동',
    title: '2024년 하반기 대외활동 모집',
    company: '픽랩',
    date: new Date('2024-12-25'),
  },
};

// 긴 제목과 회사명
export const LongText: Story = {
  args: {
    text: '매우 긴 text가 들어가는 경우의 테스트를 위한 긴 텍스트입니다',
    chipText: '대외활동',
    title: '매우 긴 제목이 들어가는 경우의 테스트를 위한 긴 제목입니다',
    company: '매우 긴 회사명이 들어가는 경우의 테스트를 위한 긴 회사명입니다',
    date: new Date('2024-08-15'),
  },
};
