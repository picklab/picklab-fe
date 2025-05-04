// Button.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button, { ButtonProps } from '@/components/common/Button/Button';
import { iconList, IconType } from '@/components/common/Icon/assets';

type CustomArgs = {
  iconPosition?: 'left' | 'right';
  iconSelect?: string;
};

const meta: Meta<typeof Button> & { args: CustomArgs; argTypes: any } = {
  title: 'Components/Button/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    label: '버튼',
    size: 'base',
    buttonStyle: 'filled',
    isFullRounded: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    size: {
      control: 'radio',
      options: ['xl', 'lg', 'base', 'sm'],
    },
    buttonStyle: {
      control: 'radio',
      options: ['filled', 'outlined', 'outline-filled'],
    },
    disabled: { control: 'boolean' },
    isFullRounded: { control: 'boolean' },
    icon: { table: { disable: true } }, // object 형식이어서 컨트롤배제
    iconSelect: {
      // 임의로 만든 타입(icon props가 object 형식이어서 컨트롤하기 편하게)
      control: 'select',
      options: iconList,
      description: '아이콘 리스트',
    },
    iconPosition: {
      // 임의로 만든 타입(icon props가 object 형식이어서 컨트롤하기 편하게)
      control: 'radio',
      options: ['left', 'right'],
      description: '아이콘 포지션(아이콘 먼저 지정해주세요)',
    },

    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Button> & CustomArgs;

const ButtonWithArgs = (args: React.ComponentProps<typeof Button> & CustomArgs) => {
  const icon = {
    position: args.iconPosition,
    icon: args.iconSelect,
  } as ButtonProps['icon'];
  return <Button {...args} icon={icon} />;
};
// 기본 버튼
export const Default: Story = {
  args: {
    label: '기본 버튼',
    size: 'base',
    buttonStyle: 'filled',
  },
  render: (args) => {
    return <ButtonWithArgs {...args} />;
  },
};

// 아이콘 왼쪽
export const WithIcon: Story = {
  args: {
    label: '아이콘',
    size: 'lg',
    buttonStyle: 'outlined',
    iconSelect: 'search',
    iconPosition: 'left',
  } as StoryObj<typeof Button> & CustomArgs,
  render: (args) => {
    return <ButtonWithArgs {...args} />;
  },
};

// 비활성 버튼
export const Disabled: Story = {
  args: {
    label: '비활성화됨',
    size: 'base',
    buttonStyle: 'filled',
    disabled: true,
  },
  render: (args) => {
    return <ButtonWithArgs {...args} />;
  },
};

// 완전 둥근 버튼
export const FullRounded: Story = {
  args: {
    label: '둥근 버튼',
    size: 'base',
    buttonStyle: 'filled',
    isFullRounded: true,
  },
  render: (args) => {
    return <ButtonWithArgs {...args} />;
  },
};
