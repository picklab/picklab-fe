// TextField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import TextField from '@/components/common/Field/TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/Field/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: '',
    labelStatus: 'default',
    placeholder: '텍스트를 입력하세요',
    status: 'default',
    helpMessage: '',
    id: '',
    disabled: false,
  },
  argTypes: {
    status: {
      control: 'radio',
      description: 'success 일 경우 Help Message의 스타일만 변합니다',
      options: ['default', 'error', 'success'],
    },
    labelStatus: {
      control: 'radio',
      options: ['default', 'optional', 'require'],
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
    label: '아이디',
    helpMessage: '아이디를 입력하세요',
  },
};
