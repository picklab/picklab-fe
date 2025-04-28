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

const OptionGroupWithState = (args: React.ComponentProps<typeof OptionGroup>) => {
  const [selected, setSelected] = useState('option1');
  return <OptionGroup {...args} selectedValue={selected} onClickHandler={(value) => setSelected(value)} />;
};

export const Default: Story = {
  render: (args) => <OptionGroupWithState {...args} />,
};

export const WithCheckBox: Story = {
  args: {
    type: 'checkBox',
  },
  render: (args) => <OptionGroupWithState {...args} />,
};
