import Chip from '@/components/common/Card/Chip';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Chip> = {
  title: 'components/Card/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      defaultValue: '칩 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Playground: Story = {
  args: {
    text: '칩 텍스트',
  },
};
