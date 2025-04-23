import type { Meta, StoryObj } from '@storybook/react';
import CheckBox from '@/components/common/Option/CheckBox';

const meta = {
  title: 'Components/Option/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    id: {
      control: 'text',
    },
    onChange: { action: 'changed' }, // 이벤트 추적용
  },
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    id: 'checkbox-story',
    checked: false,
    error: false,
    disabled: false,
  },
};
