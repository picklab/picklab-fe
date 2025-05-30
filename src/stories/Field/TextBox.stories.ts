import { Meta, StoryObj } from '@storybook/react';
import TextBox, { InputTextBoxProps, TextareaTextBoxProps } from '@/components/common/Field/TextBox';
import { iconList } from '@/components/common/Icon/assets';

const meta: Meta<typeof TextBox> = {
  title: 'Components/Field/TextBox',
  component: TextBox,
  tags: ['autodocs'],
  args: {
    disabled: false,
    error: false,
    rounded: false,
  },
  argTypes: {
    textBoxType: {
      control: 'radio',
      options: ['input', 'textarea'],
    },
    icon: {
      control: 'select',
      options: iconList,
    },
    scale: {
      control: { type: 'radio' },
      options: ['base', 'sm'],
    },
    rounded: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<InputTextBoxProps | TextareaTextBoxProps>;

export const InputDefault: Story = {
  args: {
    textBoxType: 'input',
    placeholder: '입력해주세요',
    scale: 'base',
  },
};

export const InputWithIcon: Story = {
  args: {
    textBoxType: 'input',
    placeholder: '아이콘이 있는 인풋',
    scale: 'base',
    icon: 'search', // IconType의 문자열 중 하나로 대체 필요
  },
};

export const TextareaDefault: Story = {
  args: {
    textBoxType: 'textarea',
    placeholder: '내용을 입력해주세요',
    scale: 'base',
    rows: 4,
  },
};

export const ErrorState: Story = {
  args: {
    textBoxType: 'input',
    placeholder: '에러 상태',
    error: true,
  },
};

export const RoundedSmallInput: Story = {
  args: {
    textBoxType: 'input',
    placeholder: '둥근 인풋',
    scale: 'sm',
    rounded: true,
  },
};

export const Disabled: Story = {
  args: {
    textBoxType: 'input',
    placeholder: '비활성화 상태',
    disabled: true,
  },
};
