import { Meta, StoryObj } from '@storybook/react';
import AccountPage from '@/app/(home)/profile/account/page';

const meta: Meta = {
  title: 'Pages/Profile/Account',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof AccountPage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <AccountPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '계정 관리 페이지입니다. (반응형)',
      },
    },
  },
};
