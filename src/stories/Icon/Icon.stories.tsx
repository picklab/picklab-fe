import { iconList } from '@/components/common/Icon/assets';
import Icon from '@/components/common/Icon/Icon';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'components/Icon',
  component: Icon,
  tags: ['autodocs'],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof Icon>;

export const Basic: Story = {
  args: {
    color: '#101828',
    size: 24,
  },
  argTypes: {
    icon: { table: { disable: true } },
    size: { control: { type: 'number' } },
    className: { control: { disable: true } },
    ariaLabel: { control: { disable: true } },
    role: { control: { disable: true } },
  },
  render: (args) => (
    <div className="grid grid-cols-4 gap-4">
      {iconList.map((icon) => (
        <div key={icon} className="flex flex-col items-center justify-center gap-1">
          <Icon {...args} icon={icon} />
          <span>{icon}</span>
        </div>
      ))}
    </div>
  ),
};
