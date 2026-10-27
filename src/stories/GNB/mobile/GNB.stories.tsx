import GNB from '@/components/common/GNB/mobile/GNB';
import { AuthClientProvider } from '@/contexts/AuthContext';
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

// 로그인 여부는 AuthContext에서 읽음
export const LoggedOut: Story = {
  decorators: [(Story) => <AuthClientProvider initialAuthStatus={false}><Story /></AuthClientProvider>],
};

export const LoggedIn: Story = {
  decorators: [(Story) => <AuthClientProvider initialAuthStatus><Story /></AuthClientProvider>],
};
