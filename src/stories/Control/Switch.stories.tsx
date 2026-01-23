// Switch.stories.tsx
import Switch, { SwitchProps } from '@/components/common/Control/Switch';
import type { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Control/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    scale: 'base',
    disabled: false,
    checked: false,
  },
  argTypes: {
    scale: {
      control: 'radio',
      options: ['base', 'sm'],
    },
    disabled: { control: 'boolean' },
    checked: { control: false }, // 상태는 내부에서 useState로 제어
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// 상태 제어를 위한 Wrapper
const Template = (args: SwitchProps) => {
  const [checked, setChecked] = useState(false);

  return <Switch {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const Small: Story = {
  render: (args) => <Template {...args} />,
  args: {
    scale: 'sm',
  },
};

export const Disabled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    disabled: true,
    scale: 'base',
  },
};
