import type { Meta, StoryObj } from '@storybook/react';
import Label from '@/components/common/Field/Label';

const meta = {
  title: 'Components/TextField/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    disable: false,
  },
  argTypes: {
    title: {
      control: 'text',
      description: '라벨 텍스트',
    },
    status: {
      control: { type: 'radio' },
      options: ['default', 'optional', 'require'],
      description: `'optional', 'require', 'default' 중 하나`,
    },
    htmlFor: {
      control: 'text',
      description: '연결할 input의 id',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: '이메일',
    status: 'default',
    htmlFor: 'email',
  },
};

export const Default: Story = {
  args: {
    title: '이메일',
    status: 'default',
    htmlFor: 'email',
  },
};

export const Optional: Story = {
  args: {
    title: '이메일',
    status: 'optional',
    htmlFor: 'email',
  },
};

export const Require: Story = {
  args: {
    title: '이메일',
    status: 'require',
    htmlFor: 'email',
  },
};
