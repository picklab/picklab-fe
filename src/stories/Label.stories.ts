import type { Meta, StoryObj } from '@storybook/react';
import Label from '@/components/common/Label';

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    optional: {
      control: 'boolean',
    },
    require: {
      control: 'boolean',
    },
    htmlFor: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: '이메일',
    optional: false,
    require: true,
    htmlFor: 'email',
  },
};
export const Default: Story = {
  args: {
    title: '이메일',
    optional: false,
    require: false,
    htmlFor: 'email',
  },
};
export const Optional: Story = {
  args: {
    title: '이메일',
    optional: true,
    require: false,
    htmlFor: 'email',
  },
};

export const Require: Story = {
  args: {
    title: '이메일',
    optional: false,
    require: true,
    htmlFor: 'email',
  },
};
