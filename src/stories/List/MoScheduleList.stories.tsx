import MoScheduleList, { MoScheduleListProps } from '@/components/common/List/mobile/MoScheduleList';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<MoScheduleListProps> = {
  title: 'Components/List/MoScheduleList',
  component: MoScheduleList,
  tags: ['autodocs'],
  args: {
    schedule: {
      id: '1',
      title: '2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기',
      companyName: '삼양그룹',
      category: '대외활동',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      isBookmarked: false,
      daysLeft: 5,
      period: 'start',
    },
  },
  argTypes: {
    schedule: {
      control: 'object',
      description: '스케줄 아이템 정보',
    },
    onApply: {
      action: 'apply clicked',
      table: { disable: true },
    },
    onBookmarkToggle: {
      action: 'bookmark toggled',
      table: { disable: true },
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MoScheduleList>;

// 기본 MoScheduleList
export const Default: Story = {
  args: {
    schedule: {
      id: '1',
      title: '2025 삼양그룹 대학생 서포터즈 Samyang Seeds 9기',
      companyName: '삼양그룹',
      category: '대외활동',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      isBookmarked: false,
      daysLeft: 5,
      period: 'start',
    },
  },
};

// 북마크된 상태
export const Bookmarked: Story = {
  args: {
    schedule: {
      id: '2',
      title: '2025 네이버 클로바 인턴십 프로그램',
      companyName: '네이버',
      category: '교육',
      startDate: '2025-01-20',
      endDate: '2025-03-20',
      isBookmarked: true,
      daysLeft: 3,
      period: 'deadline',
    },
  },
};

// 공모전/해커톤 카테고리
export const Contest: Story = {
  args: {
    schedule: {
      id: '3',
      title: '2025 카카오 개발자 채용 연계형 인턴십',
      companyName: '카카오',
      category: '공모전/해커톤',
      startDate: '2025-02-01',
      endDate: '2025-04-01',
      isBookmarked: false,
      daysLeft: 10,
      period: 'start',
    },
  },
};

// 강연/세미나 카테고리
export const Seminar: Story = {
  args: {
    schedule: {
      id: '4',
      title: 'AI 기술 트렌드 세미나',
      companyName: '구글',
      category: '강연/세미나',
      startDate: '2025-01-25',
      endDate: '2025-01-25',
      isBookmarked: true,
      daysLeft: 1,
      period: 'deadline',
    },
  },
};

// 긴 제목과 회사명
export const LongText: Story = {
  args: {
    schedule: {
      id: '5',
      title:
        '매우 긴 제목이 들어가는 경우의 테스트를 위한 긴 제목입니다. 이 제목은 매우 길어서 truncate 처리가 필요한 상황을 테스트하기 위한 것입니다.',
      companyName: '매우 긴 회사명이 들어가는 경우의 테스트를 위한 긴 회사명입니다',
      category: '대외활동',
      startDate: '2025-01-10',
      endDate: '2025-05-10',
      isBookmarked: false,
      daysLeft: 15,
      period: 'start',
    },
  },
};

// 마감 임박 (D-1)
export const DeadlineImminent: Story = {
  args: {
    schedule: {
      id: '6',
      title: '마감 임박 테스트 프로그램',
      companyName: '스타트업',
      category: '교육',
      startDate: '2025-01-01',
      endDate: '2025-01-20',
      isBookmarked: false,
      daysLeft: 1,
      period: 'deadline',
    },
  },
};
