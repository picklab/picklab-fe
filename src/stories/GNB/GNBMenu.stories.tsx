import GNBMenu from '@/components/common/GNB/GNBMenu';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GNBMenu> = {
  title: 'Components/GNB/GNBMenu',
  component: GNBMenu,
  argTypes: {
    href: {
      description: '링크 주소',
    },
    children: {
      control: 'text',
      description: '문구',
    },
    onClick: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GNBMenu>;

export const Default: Story = {
  args: {
    href: '/activity',
    children: '대외활동',
  },
  render: (args) => {
    const onGNBMenuClick = () => {
      alert(`${args.href}로 이동!`);
    };
    return <GNBMenu {...args} onClick={onGNBMenuClick} />;
  },
};
