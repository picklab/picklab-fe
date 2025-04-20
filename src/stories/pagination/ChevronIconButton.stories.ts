import ChevronIconButton from '@/components/common/pagination/ChevronIconButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Pagination/ChevronIconButton',
  component: ChevronIconButton,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['left', 'right'],
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ChevronIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    direction: 'right',
    disabled: false,
  },
};
