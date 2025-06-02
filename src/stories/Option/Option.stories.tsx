import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import Option, { OptionProps, OptionType } from '@/components/common/Option/Option';

const meta: Meta<typeof Option> = {
  title: 'Components/Option/Option',
  component: Option,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['text', 'checkbox', 'iconWithText'],
    },
    focus: {
      table: {
        disable: true,
      },
    },
    selectedValue: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Option>;

const optionList: OptionType[] = [
  { value: 'opt1', label: '옵션 1' },
  { value: 'opt2', label: '옵션 2' },
  { value: 'opt3', label: '옵션 3' },
];

const Template = (args: OptionProps) => {
  const [selectedValue, setSelectedValue] = useState('opt1');

  return (
    <ul role="listbox" className="space-y-2 w-40">
      <Option {...args} selectedValue={selectedValue} onClickHandler={(value) => setSelectedValue(value)} />
    </ul>
  );
};

export const TextOption: Story = {
  render: (args: OptionProps) => <Template {...args} />,
  args: {
    options: optionList,
    type: 'text',
  },
};

export const CheckboxOption: Story = {
  render: (args: OptionProps) => <Template {...args} />,

  args: {
    options: optionList,

    type: 'checkbox',
  },
};

export const IconWithTextOption: Story = {
  render: (args: OptionProps) => <Template {...args} />,
  args: {
    options: optionList,
    type: 'iconWithText',
    icon: 'alertCircle', // IconType enum 중 하나로 교체하세요 (예: 'Plus', 'Check' 등)
  },
};
