import type { Meta, StoryObj } from '@storybook/react';
import LabelType from '@/components/common/Filed/LabelType';

const meta = {
  title: 'Components/Field/LabelType',
  component: LabelType,
  tags: ['autodocs'],
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
} satisfies Meta<typeof LabelType>;

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
