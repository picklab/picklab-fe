import Dot from '@/components/common/pagination/Dot';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Pagination/Dot',
  component: Dot,
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' }, // 클릭 테스트 가능
  },
} satisfies Meta<typeof Dot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    active: false,
  },
};
