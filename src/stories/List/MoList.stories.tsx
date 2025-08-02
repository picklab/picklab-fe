import type { Meta, StoryObj } from '@storybook/react';
import MoList, { MoListProps } from '@/components/common/List/mobile/MoList';

const meta: Meta<MoListProps> = {
  title: 'Components/List/MoList',
  component: MoList,
  tags: ['autodocs'],
  args: {
    imageSrc: '/imgs/placeholder_mo_list.png',
    company: '삼양그룹',
    title: '2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기',
    viewCount: 12,
    saveCount: 8,
    isBookmarked: false,
  },
  argTypes: {
    imageSrc: {
      control: 'text',
      description: '이미지 경로',
    },
    company: {
      control: 'text',
      description: '회사명',
    },
    title: {
      control: 'text',
      description: '제목',
    },
    viewCount: {
      control: 'number',
      description: '조회수',
    },
    saveCount: {
      control: 'number',
      description: '저장수',
    },
    isBookmarked: {
      control: 'boolean',
      description: '북마크 상태',
    },
    onListClick: {
      action: 'list clicked',
      table: { disable: true },
    },
    onBookmarkClick: {
      action: 'bookmark clicked',
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MoList>;

// 기본 MoList
export const Default: Story = {
  args: {
    imageSrc: '/imgs/placeholder_mo_list.png',
    company: '삼양그룹',
    title: '2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기',
    viewCount: 12,
    saveCount: 8,
    isBookmarked: false,
  },
};

// 북마크된 상태
export const Bookmarked: Story = {
  args: {
    imageSrc: '/imgs/placeholder_mo_list.png',
    company: '네이버',
    title: '2025 네이버 클로바 인턴십 프로그램',
    viewCount: 45,
    saveCount: 23,
    isBookmarked: true,
  },
};

// 높은 조회수와 저장수
export const HighEngagement: Story = {
  args: {
    imageSrc: '/imgs/placeholder_mo_list.png',
    company: '카카오',
    title: '2025 카카오 개발자 채용 연계형 인턴십',
    viewCount: 156,
    saveCount: 89,
    isBookmarked: false,
  },
};

// 긴 제목과 회사명
export const LongText: Story = {
  args: {
    imageSrc: '/imgs/placeholder_mo_list.png',
    company: '매우 긴 회사명이 들어가는 경우의 테스트를 위한 긴 회사명입니다',
    title:
      '매우 긴 제목이 들어가는 경우의 테스트를 위한 긴 제목입니다. 이 제목은 매우 길어서 truncate 처리가 필요한 상황을 테스트하기 위한 것입니다.',
    viewCount: 5,
    saveCount: 2,
    isBookmarked: false,
  },
};

// 낮은 수치
export const LowNumbers: Story = {
  args: {
    imageSrc: '/imgs/placeholder_mo_list.png',
    company: '스타트업',
    title: '신규 스타트업 인턴십 프로그램',
    viewCount: 3,
    saveCount: 1,
    isBookmarked: false,
  },
};
