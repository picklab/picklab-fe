import { iconList } from '@/components/common/Icon/assets';
import { OptionGroup } from '@/components/common/Option/OptionGroup';
import { widthClassMap } from '@/components/common/Select/Select';
import type { Meta, StoryObj } from '@storybook/react';

import { useEffect, useState } from 'react';

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
    width: {
      control: 'select',
      options: Object.keys(widthClassMap),
    },
  },
};

export default meta;
type Story = StoryObj<typeof OptionGroup>;

const OptionGroupWithState = (args: React.ComponentProps<typeof OptionGroup>) => {
  const [selected, setSelectedValue] = useState<string | string[] | undefined>(['option1']);

  useEffect(() => {
    if (args.type === 'checkbox') {
      setSelectedValue(['opt1']);
    } else {
      setSelectedValue('opt1');
    }
  }, [args.type]);
  const icon = args.type === 'iconWithText' ? 'alertCircle' : undefined;
  return (
    <OptionGroup
      icon={icon}
      {...args}
      selectedValue={selected}
      onClickHandler={(value) => {
        setSelectedValue(value);
      }}
    />
  );
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
