import { Meta, StoryObj } from '@storybook/react';
import InfoPage from '@/app/(home)/profile/account/info/page';

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

export const Info: StoryObj<typeof InfoPage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <InfoPage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '프로필 수정 페이지입니다. (반응형)',
      },
    },
  },
};
