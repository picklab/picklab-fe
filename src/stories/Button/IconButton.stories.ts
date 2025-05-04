import IconButton from '@/components/common/Button/IconButton';
import { iconList } from '@/components/common/Icon/assets';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    buttonStyles: 'filled',
    icon: 'bookmarkLine',
    disabled: false,
    readonly: false,
  },
  argTypes: {
    buttonStyles: {
      control: 'select',
      options: ['filled', 'outlined', 'standard'],
      description: '버튼 스타일 타입',
    },
    icon: {
      control: 'select',
      options: iconList, // 아이콘 이름을 선택할 수 있도록
      description: '아이콘 이름',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    readonly: {
      control: 'boolean',
      description: '읽기 전용 여부',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    buttonStyles: 'filled',
    icon: 'alertCircle', // 실제 사용하는 아이콘 이름
    disabled: false,
    readonly: false,
  },
};
export const Outline: Story = {
  args: {
    buttonStyles: 'outlined',
    icon: 'alertCircle', // 실제 사용하는 아이콘 이름
    disabled: false,
    readonly: false,
  },
};

export const standard: Story = {
  args: {
    buttonStyles: 'standard',
    icon: 'alertCircle', // 실제 사용하는 아이콘 이름
    disabled: false,
    readonly: false,
  },
};
export const Readonly: Story = {
  args: {
    buttonStyles: 'filled',
    icon: 'alertCircle', // 실제 사용하는 아이콘 이름
    disabled: false,
    readonly: true,
  },
};
