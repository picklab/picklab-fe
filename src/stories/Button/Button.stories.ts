// Button.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@/components/common/Button/Button';
import { iconList, IconType } from '@/components/common/Icon/assets';

const meta: Meta<typeof Button> = {
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
    icon: {
      description: 'icon: { icon: IconName, position: "left" | "right" }',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 기본 버튼
export const Default: Story = {
  args: {
    label: '기본 버튼',
    size: 'base',
    buttonStyle: 'filled',
  },
};

// 아이콘 왼쪽
export const WithIcon: Story = {
  args: {
    label: '아이콘',
    size: 'lg',
    buttonStyle: 'outlined',
    icon: {
      icon: 'search' as IconType,
      position: 'left',
    },
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
};

// 완전 둥근 버튼
export const FullRounded: Story = {
  args: {
    label: '둥근 버튼',
    size: 'base',
    buttonStyle: 'filled',
    isFullRounded: true,
  },
};
