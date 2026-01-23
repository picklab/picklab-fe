import GNB from '@/components/common/GNB/mobile/GNB';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GNB> = {
  title: 'Components/GNB/mobile/GNB',
  component: GNB,
  parameters: {
    layout: 'fullscreen', // centered 대신 fullscreen 사용
  },
  decorators: [(Story) => <Story />],
};

export default meta;

type Story = StoryObj<typeof GNB>;

export const LoggedOut: Story = {
  args: {
    isLogin: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isLogin: true,
  },
};
