import GNB from '@/components/common/GNB/GNB';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GNB> = {
  title: 'Components/GNB/GNB',
  component: GNB,
  parameters: {
    layout: 'fullscreen', // centered 대신 fullscreen 사용
  },
  decorators: [
    (Story) => (
      <div className="scale-[0.85] w-[1440px] -translate-x-[230px]">
        <Story />
      </div>
    ),
  ],
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
