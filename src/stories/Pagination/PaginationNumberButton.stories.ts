import PaginationNumberButton from '@/components/common/Pagination/PaginationNumberButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Pagination/NumberButton',
  component: PaginationNumberButton,
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
    children: {
      control: 'text',
      defaultValue: '1',
    },
  },
} satisfies Meta<typeof PaginationNumberButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    active: false,
    children: '1',
  },
};
