import DotPagination from '@/components/common/Pagination/DotPagination';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Pagination/DotPagination',
  component: DotPagination,
  tags: ['autodocs'],
  argTypes: {
    totalDots: {
      control: { type: 'number', min: 1 },
    },
    activeDot: {
      control: { type: 'number', min: 0 },
    },
    col: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof DotPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    totalDots: 5,
    activeDot: 2,
    col: false,
  },
};
