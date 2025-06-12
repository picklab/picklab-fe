import { Meta, StoryObj } from '@storybook/react';

import { OptionType } from '@/components/common/Option/Option';
import Search, { SelectTextBoxProps } from '@/components/common/Field/Search';
import { useState } from 'react';

const meta: Meta<typeof Search> = {
  title: 'Components/TextField/Search',
  component: Search,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-[500px]">
        <div className="mb-5 text-sm text-gray-600">
          <strong>옵션 목록 안내:</strong>
          <ul className="mt-2 pl-4 list-disc">
            {options.map((opt) => (
              <li key={opt.value}>
                {opt.label} ({opt.value})
              </li>
            ))}
          </ul>
        </div>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    status: {
      control: 'radio',
      options: ['error', 'default', 'success'],
    },
    optionGroupProps: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Search>;

const options: OptionType[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
];

const SearchWithState = ({ ...props }: SelectTextBoxProps) => {
  const [selected, setSelected] = useState<string | string[] | undefined>();

  return (
    <div className="flex flex-col gap-2">
      <span>선택된 값:{selected}</span>
      <Search
        {...props}
        optionGroupProps={{
          ...props.optionGroupProps,
          options: options,
          selectedValue: selected,
          onClickHandler: (value) => {
            setSelected(value);
          },
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    status: 'default',
  } as SelectTextBoxProps,
  render: (args) => <SearchWithState {...args} />,
};

export const Error: Story = {
  args: {
    status: 'error',
  } as SelectTextBoxProps,
  render: (args) => <SearchWithState {...args} />,
};

export const Reset: Story = {
  args: {
    optionGroupProps: {
      functionOptionType: 'reset',
    },
  } as SelectTextBoxProps,
  render: (args) => <SearchWithState {...args} />,
};

export const SelfPlus: Story = {
  args: {
    optionGroupProps: {
      functionOptionType: 'selfplus',
    },
  } as SelectTextBoxProps,
  render: (args) => <SearchWithState {...args} />,
};
