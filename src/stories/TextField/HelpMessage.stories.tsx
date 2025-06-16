import type { Meta, StoryObj } from '@storybook/react';
import HelpMessage from '@/components/common/Field/HelpMessage';

const meta = {
  title: 'Components/TextField/HelpMessage',
  component: HelpMessage,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof HelpMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: '비밀번호는 8자 이상 입력해야 해요.',
    status: 'error',
  },
};

export const Default: Story = {
  args: {
    title: '비밀번호는 8자 이상 입력해야 해요.',
  },
};

export const Error: Story = {
  args: {
    title: '비밀번호는 8자 이상 입력해야 해요.',
    status: 'error',
  },
};

export const Success: Story = {
  args: {
    title: '비밀번호는 8자 이상 입력해야 해요.',
    status: 'success',
  },
};
