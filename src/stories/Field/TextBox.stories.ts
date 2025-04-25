// TextBox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import TextBox from '@/components/common/Field/TextBox';

const meta: Meta<typeof TextBox> = {
  title: 'Components/Field/TextBox',
  component: TextBox,
  tags: ['autodocs'],
  args: {
    placeholder: '텍스트를 입력하세요',
  },
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: true,
    placeholder: '에러 상태입니다',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화 상태입니다',
  },
};
