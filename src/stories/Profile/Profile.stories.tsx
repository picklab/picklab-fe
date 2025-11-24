import { Meta, StoryObj } from '@storybook/react';
import ProfilePage from '@/app/(home)/profile/page';

const meta: Meta = {
  title: 'Pages/Profile',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'white',
      values: [{ name: 'white', value: '#ffffff' }],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof ProfilePage> = {
  render: () => (
    <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">
      <ProfilePage />
    </main>
  ),
  parameters: {
    docs: {
      description: {
        story: '프로필 페이지입니다. (반응형)',
      },
    },
  },
};
