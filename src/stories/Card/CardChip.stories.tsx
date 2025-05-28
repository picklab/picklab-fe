import CardChip from '@/components/common/Card/CardChip';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CardChip> = {
  title: 'components/Card/CardChip',
  component: CardChip,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'select',
      options: ['대외활동', '교육', '공모전/해커톤', '강연/세미나'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardChip>;

export const Playground: Story = {
  args: {
    text: '강연/세미나',
  },
};
