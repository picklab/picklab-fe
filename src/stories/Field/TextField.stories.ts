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
    label: '',
    id: '',
    helpMessage: '',
    disabled: false,
  },
  argTypes: {
    status: {
      control: 'radio',
      description: 'success 일 경우 Help Message의 스타일만 변합니다',
      options: ['default', 'error', 'success'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: '라벨',
  },
};

export const WithHelpMessage: Story = {
  args: {
    helpMessage: 'help~~',
  },
};

export const WithLabelAndHelpMessage: Story = {
  args: {
    label: '전화번호',
    helpMessage: '입력할 수 없는 상태입니다.',
  },
};
