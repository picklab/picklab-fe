// TextField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import TextField from '@/components/common/Field/TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/Field/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    placeholder: '텍스트를 입력하세요',
    status: 'default',
  },
  argTypes: {
    label: { control: 'text' },
    id: { control: 'text' },
    helpMessage: { control: 'text' },
    status: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: '이름',
    id: 'name',
    placeholder: '이름을 입력하세요.',
  },
};

export const WithHelpMessage: Story = {
  args: {
    label: '이메일',
    id: 'email',
    helpMessage: '이메일 형식을 확인하세요.',
    status: 'error',
  },
};

export const SuccessState: Story = {
  args: {
    label: '닉네임',
    id: 'nickname',
    helpMessage: '좋은 닉네임이에요!',
    status: 'success',
  },
};

export const Disabled: Story = {
  args: {
    label: '전화번호',
    id: 'phone',
    disabled: true,
    helpMessage: '입력할 수 없는 상태입니다.',
  },
};
