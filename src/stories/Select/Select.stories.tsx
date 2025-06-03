import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Select, { SelectProps } from '@/components/common/Select/Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    options: [
      { label: '옵션 1', value: 'option1' },
      { label: '옵션 2', value: 'option2' },
      { label: '옵션 3', value: 'option3' },
    ],
    value: '',
    width: 'default',
    size: 'default',
    disabled: false,
    type: 'text',
    helpMessage: '',
    helpMessageStatus: 'default',
  },
  argTypes: {
    options: {
      control: {
        disable: true,
      },
    },
    value: {
      control: {
        disable: true,
      },
    },
    width: {
      control: 'radio',
      options: ['default', 'large', 'small'],
    },
    size: {
      control: 'radio',
      options: ['default', 'small'],
    },
    type: {
      control: 'radio',
      options: ['text', 'checkbox', 'iconWithText'],
    },
    disabled: { control: 'boolean' },
    helpMessageStatus: {
      control: 'radio',
      options: ['default', 'error', 'success'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const Template = (args: SelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string | string[]>(args.value);
  useEffect(() => {
    if (args.type === 'checkbox') {
      setSelectedValue(['option1']);
    } else {
      setSelectedValue('option1');
    }
  }, [args.type]);

  return (
    <div className="min-h-[230px] p-4">
      <Select {...args} value={selectedValue} onChange={(value) => setSelectedValue(value)} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const Small: Story = {
  render: (args) => <Template {...args} />,
  args: {
    size: 'small',
    width: 'small',
  },
};

export const Large: Story = {
  render: (args) => <Template {...args} />,
  args: {
    width: 'large',
  },
};

export const Disabled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    disabled: true,
  },
};

export const ErrorState: Story = {
  render: (args) => <Template {...args} />,
  args: {
    helpMessage: '선택할 수 없습니다',
    helpMessageStatus: 'error',
  },
};

export const CheckBoxType: Story = {
  render: (args) => <Template {...args} />,
  args: {
    type: 'checkbox',
  },
};
