import Select, { SelectProps } from '@/components/common/Field/Select';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'components/field/SelectField',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    labelStatus: {
      control: { type: 'radio' },
      options: ['default', 'require', 'optional'],
      description: '라벨 상태',
    },
    helpMessage: {
      control: 'text',
      description: '도움말 메시지',
    },
    helpMessageStatus: {
      control: { type: 'radio' },
      options: ['default', 'success', 'error'],
      description: '도움말 메시지 상태',
    },
    type: {
      control: { type: 'radio' },
      options: ['default', 'checkBox'],
      description: '옵션 선택 타입',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    width: {
      control: { type: 'radio' },
      options: ['default', 'large', 'small'],
      description: '너비',
    },
    value: {
      control: { disable: true },
    },
  },
  args: {
    label: 'Label',
    labelStatus: 'default',
    helpMessage: 'help message~!',
    helpMessageStatus: 'default',
    type: 'default',
    disabled: false,
    width: 'default',
    options: [
      { label: '옵션 1', value: 'option1' },
      { label: '옵션 2', value: 'option2' },
      { label: '옵션 3', value: 'option3' },
      { label: '옵션 4', value: 'option4' },
      { label: '옵션 5', value: 'option5' },
      { label: '옵션 6', value: 'option6' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const PlaygroundComponent = (args: SelectProps) => {
  const [selected, setSelected] = useState('');
  return (
    <div className="h-72">
      <Select {...args} value={selected} onChange={setSelected} />
    </div>
  );
};

export const Playground: Story = {
  render: (args) => <PlaygroundComponent {...args} />,
};
