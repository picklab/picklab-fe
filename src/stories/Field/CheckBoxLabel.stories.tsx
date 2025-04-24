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
    checkBoxProps: {},
    options: [
      { label: 'Label1', value: 'A' },
      { label: 'Label2', value: 'B' },
      { label: 'Label3', value: 'C' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof CheckBoxLabel>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string>('A');

    return <CheckBoxLabel {...args} selectedValue={selected} onClickHandler={(val) => setSelected(val)} />;
  },
};
