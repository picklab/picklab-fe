import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Label from '@/components/common/Field/Label';

const meta: Meta<typeof Label> = {
  title: 'Components/Field/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    tag: 'label',
    className: '',
    options: [
      { value: 'label1', label: '라벨1' },
      { value: 'label2', label: '라벨2' },
      { value: 'label3', label: '라벨3' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Label>;
const LabelWithState = (args: React.ComponentProps<typeof Label>) => {
  const [selected, setSelected] = useState('option1');
  return (
    <div className="flex gap-2">
      <Label {...args} selectedValue={selected} onClickHandler={(value) => setSelected(value)} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <LabelWithState {...args} />,
};
