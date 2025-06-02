import { iconList } from '@/components/common/Icon/assets';
import { OptionGroup } from '@/components/common/Option/OptionGroup';
import type { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';

const meta: Meta<typeof OptionGroup> = {
  title: 'Components/Option/OptionGroup',
  component: OptionGroup,
  tags: ['autodocs'],
  args: {
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
  },
  argTypes: {
    type: {
      control: 'radio',
      description: 'iconWithText는 아이콘을 선택해야합니다!',
      options: ['text', 'checkbox', 'iconWithText'],
    },
    functionOptionType: {
      control: 'radio',
      options: ['selfplus', 'reset'],
    },
    icon: {
      control: 'select',
      options: iconList,
    },
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
    type: 'checkbox',
  },
  render: (args) => <OptionGroupWithState {...args} />,
};

export const WithIcon: Story = {
  args: {
    type: 'iconWithText',
  },
  render: (args) => <OptionGroupWithState {...args} icon="alertCircle" />,
};
