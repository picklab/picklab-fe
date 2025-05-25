import CardChip from '@/components/common/Card/CardChip';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CardChip> = {
  title: 'components/Card/CardChip',
  component: CardChip,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      defaultValue: '칩 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardChip>;

export const Playground: Story = {
  args: {
    text: '칩 텍스트',
  },
};
