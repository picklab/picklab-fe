import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import CheckBoxLabel from '@/components/common/Field/CheckBoxLabel';

const meta: Meta<typeof CheckBoxLabel> = {
  title: 'Components/Field/CheckBoxLabel',
  component: CheckBoxLabel,
  tags: ['autodocs'],
  args: {
    tag: 'label',
    className: '',
    checkBoxProps: {
      disabled: false,
    },
    options: [
      { label: 'Label1', value: 'A' },
      { label: 'Label2', value: 'B' },
      { label: 'Label3', value: 'C' },
    ],
  },
  argTypes: {
    checkBoxProps: {
      control: 'object',
      description: 'Props passed to each checkbox input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckBoxLabel>;

const CheckBoxLabelWithState = (args: React.ComponentProps<typeof CheckBoxLabel>) => {
  const [selected, setSelected] = useState('option1');

  return <CheckBoxLabel {...args} selectedValue={selected} onClickHandler={(val) => setSelected(val)} />;
};

export const Default: Story = {
  render: (args) => <CheckBoxLabelWithState {...args} />,
};
