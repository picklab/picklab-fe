import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CheckBoxLabel, { CheckBoxLabelProps } from '@/components/common/CheckBox/CheckBoxLabel';

const meta: Meta<typeof CheckBoxLabel> = {
  title: 'Components/CheckBox/CheckBoxLabel',
  component: CheckBoxLabel,
  tags: ['autodocs'],
  args: {
    error: false,
  },
  argTypes: {
    scale: {
      control: 'radio',
      options: ['xs', 'sm', 'md'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckBoxLabel>;

const Template = (args: CheckBoxLabelProps) => {
  const [checked, setChecked] = useState(false);

  return <CheckBoxLabel {...args} checked={checked} onChange={() => setChecked(!checked)} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: '체크박스 라벨 예시',
    id: 'checkbox-label-default',
    name: 'example',
    value: 'exampleValue',
    scale: 'sm',
    disabled: false,
  },
};

export const Disabled: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: '비활성화된 체크박스',
    id: 'checkbox-label-disabled',
    name: 'disabled',
    value: 'disabled',
    scale: 'sm',
    disabled: true,
  },
};

export const Sizes: Story = {
  // render: () => {
  //   const [state, setState] = useState({
  //     xs: false,
  //     sm: false,
  //     md: false,
  //   });
  //   return (
  //     <div className="space-y-4">
  //       {(['xs', 'sm', 'md'] as const).map((size) => (
  //         <CheckBoxLabel
  //           key={size}
  //           label={`사이즈: ${size}`}
  //           id={`checkbox-${size}`}
  //           name={`checkbox-${size}`}
  //           value={size}
  //           scale={size}
  //           checked={state[size]}
  //           onChange={() => setState((prev) => ({ ...prev, [size]: !prev[size] }))}
  //         />
  //       ))}
  //     </div>
  //   );
  // },
};
