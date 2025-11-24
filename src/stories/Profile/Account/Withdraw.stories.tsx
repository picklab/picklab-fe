import { Meta, StoryObj } from '@storybook/react';
import WithdrawPage from '@/app/(home)/profile/account/withdraw/page';

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

export const Withdraw: StoryObj<typeof WithdrawPage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <WithdrawPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '회원 탈퇴 페이지입니다. (반응형)',
      },
    },
  },
};
