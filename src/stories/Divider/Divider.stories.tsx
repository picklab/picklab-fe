// Divider.stories.tsx
import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Divider } from '@/components/common/Divider/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider/Divider',
  component: Divider,
  argTypes: {
    vertical: {
      control: 'boolean',
      description: '수직 분할 여부',
    },
    className: {
      control: 'text',
      description: '추가적인 클래스 이름',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;
const WithLabelWrapper = (Story: StoryFn) => (
  <div style={{ display: 'flex', height: '128px', alignItems: 'center', gap: '1rem' }}>
    <div>Left</div>
    <Story />
    <div>Right</div>
  </div>
);

export const Horizontal: Story = {
  args: {
    vertical: false,
  },
  decorators: [WithLabelWrapper],
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
  decorators: [WithLabelWrapper],
};

export const CustomStyle: Story = {
  args: {
    className: 'bg-red-500',
  },
};
