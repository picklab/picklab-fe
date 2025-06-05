import { Meta, StoryObj } from '@storybook/react';
import FunctionOption from '@/components/common/Option/FunctionOption';

const meta: Meta<typeof FunctionOption> = {
  title: 'Components/Option/FunctionOption',
  component: FunctionOption,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['reset', 'selfplus'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[132px] border rounded">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FunctionOption>;

export const ResetOption: Story = {
  args: {
    type: 'reset',
  },
};

export const SelfPlusOption: Story = {
  args: {
    type: 'selfplus',
  },
};
