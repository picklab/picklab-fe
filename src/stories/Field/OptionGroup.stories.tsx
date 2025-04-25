import { OptionGroup } from '@/components/common/Field/OptionGroup';
import type { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';

const meta: Meta<typeof OptionGroup> = {
  title: 'Components/Field/OptionGroup',
  component: OptionGroup,
  tags: ['autodocs'],
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    type: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof OptionGroup>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('option1');
    return <OptionGroup {...args} selectedValue={selected} onClickHandler={(value) => setSelected(value)} />;
  },
};

export const WithCheckBox: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('option1');
    return (
      <OptionGroup {...args} type="checkBox" selectedValue={selected} onClickHandler={(value) => setSelected(value)} />
    );
  },
};
