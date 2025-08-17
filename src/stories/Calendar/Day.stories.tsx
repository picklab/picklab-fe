import Day from '@/components/common/Calendar/Day';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Day> = {
  title: 'components/Calendar/Day',
  component: Day,
  tags: ['autodocs'],
  argTypes: {
    day: {
      control: 'number',
      description: '표시할 날짜 (1-31)',
    },
    isToday: {
      control: 'boolean',
      description: '오늘 날짜인지 여부',
    },
    isSelected: {
      control: 'boolean',
      description: '선택된 날짜인지 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Day>;

// 기본 날짜 (아무것도 아닌 것)
export const Default: Story = {
  args: {
    day: 15,
    isToday: false,
    isSelected: false,
  },
};

// 오늘 날짜
export const Today: Story = {
  args: {
    day: 20,
    isToday: true,
    isSelected: false,
  },
};

// 선택된 날짜
export const Selected: Story = {
  args: {
    day: 25,
    isToday: false,
    isSelected: true,
  },
};
