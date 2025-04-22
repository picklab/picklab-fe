import Pagination from '@/components/common/Pagination/Pagination';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    totalPage: {
      control: { type: 'number', min: 1 },
      description: '전체 페이지 수',
    },
    activePage: {
      control: { type: 'number', min: 1 },
      description: '현재 활성화된 페이지 번호',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// 기본 스토리
export const Default: Story = {
  args: {
    totalPage: 20,
    activePage: 1,
  },
};

// 중간 페이지 활성화 상태
export const MiddlePage: Story = {
  args: {
    totalPage: 20,
    activePage: 10,
  },
};

// 마지막 페이지 활성화 상태
export const LastPage: Story = {
  args: {
    totalPage: 20,
    activePage: 20,
  },
};

// 페이지가 적은 경우
export const FewPages: Story = {
  args: {
    totalPage: 5,
    activePage: 3,
  },
};

// 많은 페이지가 있는 경우
export const ManyPages: Story = {
  args: {
    totalPage: 100,
    activePage: 50,
  },
};
